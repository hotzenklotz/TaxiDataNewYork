# System imports
import subprocess
import time
from os import path
import shutil
from flask import *
from werkzeug import secure_filename
from flask_extensions import *

static_assets_path = path.join(path.dirname(__file__), "dist")
app = Flask(__name__, static_folder=static_assets_path)


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


if __name__ == "__main__":
    # Start the server
    app.config.update(
        DEBUG=True,
        SECRET_KEY="asassdfs",
        CORS_HEADERS="Content-Type",
        TEMP_FOLDER="temp",
    )

    # Make sure all frontend assets are compiled
    subprocess.Popen("webpack")

    # Start the Flask app
    app.run(port=9000, threaded=True)
