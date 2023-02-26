from flask import Flask
from flask_cors import CORS 
from flask import jsonify
from flask import request
import time
from simulation import SimulationModel

app = Flask(__name__)
CORS(app)

@app.route("/api/result", methods=['GET'])
def get_current_time():
    return jsonify({'time': time.time()})

@app.route("/api/run", methods=['POST'])
def get_simulation():
    data = request.get_json()["data"]
    maximum_simulation_time = int(data["maxTime"])
    lambdaClasses = [float(x) for x in data["lambdaClasses"].split(",")] if "," in data["lambdaClasses"] else [float(data["lambdaClasses"])]
    muClasses = [float(x) for x in data["muClasses"].split(",")] if "," in data["muClasses"] else [float(data["muClasses"])]
    deltaClasses = [float(x) for x in data["deltaClasses"].split(",")] if "," in data["deltaClasses"] else [float(data["deltaClasses"])]
    gammaClasses = [float(x) for x in data["gammaClasses"].split(",")] if "," in data["gammaClasses"] else [float(data["gammaClasses"])]
    n = int(data["n"])
    concurrency = int(data["concurrency"])
    delta = float(data["delta"])
    gamma = float(data["gamma"])
    Nc = int(data["nc"])
    # maximum_simulation_time = 5000
    # lambdaClasses = [4, 5, 6, 2]
    # muClasses = [1 / 10, 1 / 12, 1 / 11, 1 / 9]
    # deltaClasses = [1 / 3, 1 / 4, 1 / 2, 1 / 5]
    # gammaClasses = [1 / 5, 1 / 16, 1 / 9, 1 / 14]
    # n = 2000
    # concurrency = 1
    # delta = 0.2
    # gamma = 0.1
    # Nc = 100000
    SteadyTime = int(data["steadyTime"])
    model = SimulationModel(maximum_simulation_time, lambdaClasses, muClasses, n, concurrency, delta,
                            deltaClasses, gammaClasses, gamma, Nc)
    result = model.run(steady_time=SteadyTime)
    return result


