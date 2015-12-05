import datetime
import time
import sys

def hana_polygon_from_list(coords):
    s = "Polygon (("
    s += ", ".join([str(x) + " " + str(y) for x,y in coords])
    s += "))"
    return s

def get_hana_time(t=None):
    """Converts a timestamp into a HANA timestamp string.

    :Parameters:
      - `t` (optional): The date and time that should be converted.
        Can either be an integer UNIX timestamp or a :py:class:`datetime.datetime` object
    """
    if t is None:
        t = time.time()
    if isinstance(t, datetime.datetime):
        return t.strftime('%Y-%m-%d %H:%M:%S')

    return datetime.datetime.fromtimestamp(t).strftime('%Y-%m-%d %H:%M:%S')

def get_bounding_box(polygon):
    min_x = min([p[0] for p in polygon])
    max_x = max([p[0] for p in polygon])
    min_y = min([p[1] for p in polygon])
    max_y = max([p[1] for p in polygon])

    # return [(min_x, min_y), (max_x, min_y), (max_x, max_y), (min_x, max_y), (min_x, min_y)]
    return ((min_x, min_y), (max_x, max_y))

def get_bounding_box_condition(box):
    return "ST_IntersectsRect(new ST_Point(%f, %f), new ST_Point(%f, %f)) = 1" % \
            (box[0][0], box[0][1], box[1][0], box[1][1])

def normalize_times(time_start, time_end):
    start = time_start
    if type(time_start) == datetime.datetime:
        time_start = get_hana_time(time_start)

    end = time_end
    if type(time_end) == datetime.datetime:
        time_end = get_hana_time(time_end)

    start = start.replace(second=0)
    end = end.replace(second=59)

    return start, end

def get_rides_from_area(hana, area, time_start, time_end):
    cur = hana.cursor()

    polygon = area
    if type(polygon) != str:
        polygon = hana_polygon_from_list(area)

    start = time_start
    if type(time_start) == datetime.datetime:
        time_start = get_hana_time(time_start)

    end = time_end
    if type(time_end) == datetime.datetime:
        time_end = get_hana_time(time_end)

    query = """SELECT TOP 10 MEDALLION, DRIVER, VENDOR, DROPOFF FROM NYCCAB.TRIP_SPATIAL_ANNOTATED
                WHERE DROPOFF.ST_Within(NEW ST_Polygon('%s')) = 1""" % polygon
    print(query)
    cur.execute(query)
    return cur.fetchall()

def get_neighborhood_data(hana, hood, time_start, time_end, incoming_traffic=False):
    cur = hana.cursor()

    start, end = normalize_times(time_start, time_end)

    direction = 'DROPOFF' if incoming_traffic else 'PICKUP'

    query = """SELECT IFNULL(SUM(FARE),0)/IFNULL(SUM(DISTANCE),1), IFNULL(AVG(FARE),0), IFNULL(AVG(T.DISTANCE),0), IFNULL(COUNT(T.PICKUP_TIME),0)
            FROM NYCCAB.TRIP_SPATIAL_ANNOTATED T
            LEFT JOIN (
                SELECT MEDALLION, DRIVER, VENDOR, PICKUP_TIME, FARE FROM NYCCAB.FARE
                WHERE %s_TIME BETWEEN ? AND ?
            ) F ON T.MEDALLION = F.MEDALLION AND T.DRIVER = F.DRIVER AND T.PICKUP_TIME = F.PICKUP_TIME
            WHERE T.%s_TIME BETWEEN ? AND ?  AND %s_NEIGHBORHOOD = ?
            """ % (direction, direction, direction)
    print(query)
    cur.execute(query, [start, end, start, end, hood])
    row = cur.fetchone()

    return {
        "avg_fare_per_mile": float(row[0]),
        "avg_fare": float(row[1]),
        "avg_distance": float(row[2]),
        "ride_count": int(row[3])
    }

def get_neighborhoods_details(hana, time_start, time_end, incoming_traffic=False):
    cur = hana.cursor()

    start, end = normalize_times(time_start, time_end)
    direction = 'DROPOFF' if incoming_traffic else 'PICKUP'

    query = """SELECT %s_NEIGHBORHOOD, SUM(FARE), SUM(T.DISTANCE), AVG(FARE), AVG(T.DISTANCE), COUNT(T.PICKUP_TIME)
                FROM NYCCAB.TRIP_SPATIAL_ANNOTATED T
                LEFT JOIN (
                    SELECT MEDALLION, DRIVER, PICKUP_TIME, FARE FROM  NYCCAB.FARE
                    WHERE %s_TIME BETWEEN ? AND ?
                ) F ON T.MEDALLION = F.MEDALLION AND T.DRIVER = F.DRIVER AND T.PICKUP_TIME = F.PICKUP_TIME
                WHERE T.%s_TIME BETWEEN ? AND ? AND T.%s_NEIGHBORHOOD IS NOT NULL
                GROUP BY %s_NEIGHBORHOOD""" % (direction, direction, direction, direction, direction)
    cur.execute(query, [start, end, start, end])

    print(query)
    result = {}

    for row in cur.fetchall():
        hood, fare_sum, distance_sum, fare, distance, rides = row
        result[hood] = {
            "avg_fare_per_mile": float(fare_sum)/float(distance_sum) if distance_sum > 0 else 0.0,
            "avg_fare": float(fare),
            "avg_distance": float(distance),
            "ride_count": int(rides)
        }
    return result

def get_neighborhoods_rides(hana, time_start, time_end, incoming_traffic=False):
    cur = hana.cursor()

    start, end = normalize_times(time_start, time_end)
    direction = 'DROPOFF' if incoming_traffic else 'PICKUP'

    query = """SELECT PICKUP_NEIGHBORHOOD, DROPOFF_NEIGHBORHOOD, COUNT(PICKUP_TIME), COUNT(DROPOFF_TIME)
                FROM NYCCAB.TRIP_SPATIAL_ANNOTATED
                WHERE PICKUP_TIME BETWEEN ? AND ?
                GROUP BY PICKUP_NEIGHBORHOOD, DROPOFF_NEIGHBORHOOD"""
    cur.execute(query, [start, end])

    result = {}
    meta = {
        "min_outgoing": None,
        "max_outgoing": None,
        "min_incoming": None,
        "max_incoming": None}

    for row in cur.fetchall():
        pickup_hood, dropoff_hood, pickup_rides, dropoff_rides = row

        if pickup_hood is not None and pickup_hood not in result:
            result[pickup_hood] = {
                "outgoing_rides": 0,
                "incoming_rides": 0
            }
        if dropoff_hood is not None and dropoff_hood not in result:
            result[dropoff_hood] = {
                "outgoing_rides": 0,
                "incoming_rides": 0
            }

        if pickup_hood is not None:
            result[pickup_hood]["outgoing_rides"] += pickup_rides
        if dropoff_hood is not None:
            result[dropoff_hood]["incoming_rides"] += dropoff_rides

    meta["min_outgoing"] = min([result[hood]["outgoing_rides"] for hood in result])
    meta["max_outgoing"] = max([result[hood]["outgoing_rides"] for hood in result])
    meta["min_incoming"] = min([result[hood]["incoming_rides"] for hood in result])
    meta["max_incoming"] = max([result[hood]["incoming_rides"] for hood in result])

    return {
        "meta": meta,
        "rides": result
    }
