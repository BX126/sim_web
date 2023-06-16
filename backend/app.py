from flask import Flask
from flask_cors import CORS
from flask import jsonify
from flask import request
import time
from runner import run_simulation
from runner2 import run_simulation2

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


@app.route("/api/run2", methods=['POST'])
def get_simulation2():
    data = request.get_json()["data"]
    print(data["traced"])
    repeat_times = data["times"]
    county = data["county"]
    black = data["af"]
    white = data["white"]
    hispanic = data["hispanic"]
    other = data["other"]
    directory = "./data/"+county+"/param/"
    result = run_simulation2(repeat_times, directory,
                             black, white, hispanic, other)
    return result


if __name__ == '__main__':
    app.run(debug=False, use_reloader=False, port=5000, threaded=False)
