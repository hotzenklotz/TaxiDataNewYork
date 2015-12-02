# System imports
import subprocess
import time
from os import path
import shutil
from flask import *
from werkzeug import secure_filename
import pyhdb
import json
import datetime

from config import Config

from helpers import get_rides_from_area, get_neighborhood_data, \
    hana_polygon_from_list, get_bounding_box_condition, \
    get_bounding_box

static_assets_path = path.join(path.dirname(__file__), "dist")
app = Flask(__name__, static_folder=static_assets_path)

hana = pyhdb.connect(host=Config.hana_host, port=Config.hana_port, user=Config.hana_user, password=Config.hana_pass)

geo_data = {}

# ----- Routes ----------
@app.route("/", defaults={"fall_through": ""})
@app.route("/<path:fall_through>")
def index(fall_through):
    if fall_through:
        return redirect(url_for("index"))
    else:
        return app.send_static_file("index.html")


@app.route("/dist/<path:asset_path>")
def send_static(asset_path):
    return send_from_directory(static_assets_path, asset_path)


def bad_request(reason):
    response = jsonify({"error": reason})
    response.status_code = 400
    return response


@app.route("/api/rides/")
def api_rides():
    cur = hana.cursor()
    cur.execute("SELECT COUNT(*) FROM NYCCAB.TRIP")
    row = cur.fetchone()
    return jsonify({"count": row[0]})

def find_neighborhood(name):
    for borough in geo_data["neighborhoods"]:
        if name in geo_data["neighborhoods"][borough]:
            return borough, name
    return None, None

@app.route("/api/neighborhoods/<neighborhood>/rides")
def api_neighborhood_rides(neighborhood):
    borough, hood = find_neighborhood(neighborhood)
    if borough is None:
        abort(404)

    polygon = [(c["lng"], c["lat"]) for c in geo_data["neighborhoods"][borough][hood]["coords"]]
    rides = get_rides_from_area(hana, polygon)

    return jsonify({
        "rides": rides
    })

@app.route("/api/neighborhoods")
def api_neighborhoods():

    response = {"bronx": [], "queens": [], "manhattan": [], "staten_island": [], "brooklyn": []}

    for borough in geo_data["neighborhoods"]:
        for hood in geo_data["neighborhoods"][borough]:

            polygon = [(c["lat"], c["lng"]) for c in geo_data["neighborhoods"][borough][hood]["coords"]]

            response[borough].append({
                "name": hood,
                "polygon": polygon,
            })


    return jsonify(response)


@app.route("/api/neighborhoods/details")
def api_neighborhood_details():

    response = {"bronx": [], "queens": [], "manhattan": [], "staten_island": [], "brooklyn": []}

    time_start = request.args.get('time_start', None)
    time_end = request.args.get('time_end', None)

    if time_start is None or time_end is None:
        return bad_request('Please specify a start and end time.')

    try:
        time_start = datetime.datetime.fromtimestamp(int(time_start))
        time_end = datetime.datetime.fromtimestamp(int(time_end))
    except ValueError:
        return bad_request('Invalid time format. Please use %Y-%m-%d %H:%M:%S')

    for borough in geo_data["neighborhoods"]:
        for hood in geo_data["neighborhoods"][borough]:

            response[borough].append({
                "name": hood,
                "fares": 100,
                "rides": 100,
            })

    return jsonify(response)

@app.route("/api/neighborhoods/<neighborhood>")
def api_neighborhood(neighborhood):
    borough, hood = find_neighborhood(neighborhood)
    if borough is None:
        abort(404)

    time_start = request.args.get('time_start', None)
    time_end = request.args.get('time_end', None)

    if time_start is None or time_end is None:
        return bad_request('Please specify a start and end time.')

    try:
        time_start = datetime.datetime.fromtimestamp(int(time_start))
        time_end = datetime.datetime.fromtimestamp(int(time_end))
    except ValueError:
        return bad_request('Invalid time format. Please use %Y-%m-%d %H:%M:%S')

    polygon = [(c["lat"], c["lng"]) for c in geo_data["neighborhoods"][borough][hood]["coords"]]
    bounding_box = get_bounding_box(polygon)

    data = get_neighborhood_data(hana, polygon, time_start, time_end)

    result = {
        "name": neighborhood,
        "borough": borough,
        "polygon": polygon,
        "boundingBox": bounding_box,
        "details": data
    }
    return jsonify(result)

def load_data():
    # load neighbourhood data
    f = open("geojson/nyc_data.json", "r")
    geo_data["neighborhoods"] = json.loads(f.read())
    f.close()

    # load boroughs
    f = open("geojson/nyc.geojson", "r")
    geo_data["boroughs"] = json.loads(f.read())
    f.close()

if __name__ == "__main__":
    # Start the server
    app.config.update(
        DEBUG=True,
        SECRET_KEY="asassdfs",
        CORS_HEADERS="Content-Type",
        TEMP_FOLDER="temp",
    )

    # load borough data
    load_data()

    # Make sure all frontend assets are compiled
    subprocess.Popen("webpack")

    # Start the Flask app
    app.run(port=9000, threaded=True)
