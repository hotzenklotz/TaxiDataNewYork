import datetime

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

    query = """SELECT TOP 10 MEDALLION, DRIVER, VENDOR, DROPOFF FROM NYCCAB.TRIP_TEST_SPATIAL
                WHERE DROPOFF.ST_Within(NEW ST_Polygon('%s')) = 1""" % polygon
    print(query)
    cur.execute(query)
    return cur.fetchall()

def get_neighborhood_data(hana, area_polygon, time_start, time_end, incoming_traffic=True):
    cur = hana.cursor()

    hana_polygon = hana_polygon_from_list(area_polygon)
    start, end = normalize_times(time_start, time_end)

    direction = 'DROPOFF' if incoming_traffic else 'PICKUP'

    query = """SELECT SUM(FARE)/SUM(DISTANCE), AVG(FARE), AVG(T.DISTANCE), COUNT(T.PICKUP_TIME) FROM (
            SELECT MEDALLION, DRIVER, VENDOR, %s, PICKUP_TIME, DISTANCE FROM NYCCAB.TRIP_TEST_SPATIAL
            WHERE %s_TIME BETWEEN ? AND ?  AND %s.ST_Within(new ST_Polygon(?)) = 1) T
            LEFT JOIN NYCCAB.FARE F ON T.MEDALLION = F.MEDALLION AND T.DRIVER = F.DRIVER AND T.PICKUP_TIME = F.PICKUP_TIME
            """ % (direction, direction, direction)
    print(query)
    cur.execute(query, [start, end, hana_polygon])
    row = cur.fetchone()

    return {
        "avg_fare_per_mile": float(row[0]),
        "avg_fare": float(row[1]),
        "avg_distance": float(row[2]),
        "ride_count": int(row[3])
    }
