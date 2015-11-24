# System imports
import subprocess
import time
from os import path
import shutil
from flask import *
from werkzeug import secure_filename
from flask_extensions import *
import pyhdb
import json

from config import Config
from nyc_data import boroughs

static_assets_path = path.join(path.dirname(__file__), "dist")
app = Flask(__name__, static_folder=static_assets_path)

hana = pyhdb.connect(host=Config.hana_host, port=Config.hana_port, user=Config.hana_user, password=Config.hana_pass)

boroughs = {}

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

def hana_polygon_from_list(coords):
    s = "Polygon (("
    s += ", ".join([str(x) + " " + str(y) for x,y in coords])
    s += "))"
    return s

def get_rides_from_area(area):
    cur = hana.cursor()
    
    polygon = area
    if type(polygon) != str:
        polygon = hana_polygon_from_list(area)
    
    query = """SELECT TOP 10 * FROM NYCCAB.TRIP_SPATIAL
                WHERE NEW ST_Polygon('%s').ST_Contains(NEW ST_Point(DROPOFF_LONG, DROPOFF_LAT))""" % polygon
    print(query)
    cur.execute(query)
    return cur.fetchall()

@app.route("/api/rides/<neighborhood>/average_fare")
def api_rides_average_fare(neighborhood):
    for borough in boroughs:
        if neighborhood in boroughs[borough]:
            polygon = [(c["lng"], c["lat"]) for c in boroughs[borough][neighborhood]["coords"]]
            hana_polygon = hana_polygon_from_list(polygon)
            result = {
                "polygon": polygon,
                "hana": hana_polygon,
                "rides": get_rides_from_area(hana_polygon)
            }
            return jsonify(result)
    return jsonify({"error": "not found"})

if __name__ == "__main__":
    # Start the server
    app.config.update(
        DEBUG=True,
        SECRET_KEY="asassdfs",
        CORS_HEADERS="Content-Type",
        TEMP_FOLDER="temp",
    )

    # load borough data
    f = open("nyc_data.json", "r")
    boroughs = json.loads(f.read())
    f.close()

    # Make sure all frontend assets are compiled
    subprocess.Popen("webpack")

    # Start the Flask app
    app.run(port=9000, threaded=True)
