from flask import Flask
from flask_cors import CORS
from flask import jsonify
from flask import request
import time
from simulation import SimulationModel
from runner import run_simulation

app = Flask(__name__)
CORS(app)


@app.route("/api/result", methods=['GET'])
def get_current_time():
    return jsonify({'time': time.time()})


@app.route("/api/run", methods=['POST'])
def get_simulation():
    data = request.get_json()["data"]
    # maximum_simulation_time = int(data["maxTime"])
    lambdaClasses = [float(x) for x in data["lambdaClasses"].split(
        ",")] if "," in data["lambdaClasses"] else [float(data["lambdaClasses"])]
    muClasses = [float(x) for x in data["muClasses"].split(
        ",")] if "," in data["muClasses"] else [float(data["muClasses"])]
    deltaClasses = [float(x) for x in data["deltaClasses"].split(
        ",")] if "," in data["deltaClasses"] else [float(data["deltaClasses"])]
    gammaClasses = [float(x) for x in data["gammaClasses"].split(
        ",")] if "," in data["gammaClasses"] else [float(data["gammaClasses"])]
    maximum_simulation_time = 1000
    n = 2000
    concurrency = 1
    delta = 0.2
    gamma = 0.1
    Nc = 100000
    SteadyTime = int(data["steadyTime"])
    model = SimulationModel(maximum_simulation_time, lambdaClasses, muClasses, n, concurrency, delta,
                            deltaClasses, gammaClasses, gamma, Nc)
    result = model.run(steady_time=SteadyTime)
    return result


@app.route("/api/runs", methods=['POST'])
def get_simulation_2():
    data = request.get_json()["data"]
    years = int(data["years"])
    result = run_simulation(years)
    # return result
    return years
