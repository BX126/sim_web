from flask import Flask
from flask_cors import CORS
from flask import jsonify
from flask import request
import time
from runner import run_simulation

app = Flask(__name__)
CORS(app)


@app.route("/api/result", methods=['GET'])
def get_current_time():
    return jsonify({'time': time.time()})


@app.route("/api/run", methods=['POST'])
def get_simulation():
    data = request.get_json()["data"]
    repeat_times = data["times"]
    county = data["county"]
    directory = "./data/"+county+"/param/"
    result = run_simulation(repeat_times, directory)
    return result
