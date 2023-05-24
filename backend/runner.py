from simulation_traced_based import SimulationModel
import numpy as np
import pandas as pd
import json

__init__ = "runner"


def run_simulation(repeat_times, directory):
    name = directory.split("/")[-3]
    year_to_run = 10
    lambda_path = directory + "sim_arrival_dates.csv"
    n = 2000
    concurrency = 1
    delta = 1
    Nc = 100000
    black_x = directory + "los_ecdf_black_x.pkl"
    white_x = directory + "los_ecdf_white_x.pkl"
    hispanic_x = directory + "los_ecdf_hispanic_x.pkl"
    other_x = directory + "los_ecdf_x.pkl"
    result = []
    in_sys_rate_white = directory + "in_sys_rate_white.pkl"
    in_sys_rate_african = directory + "in_sys_rate_african.pkl"
    in_sys_rate_hispanic = directory + "in_sys_rate_hispanic.pkl"
    in_sys_rate_other = directory + "in_sys_rate_other.pkl"

    for i in range(repeat_times):
        print("Running simulation " + str(i + 1) + " times")
        model = SimulationModel(year_to_run, lambda_path, n, concurrency, delta, Nc, black_x, white_x,
                                hispanic_x, other_x, in_sys_rate_white, in_sys_rate_african, in_sys_rate_hispanic, in_sys_rate_other, repeat_times)
        model.run()
        result.append(model.track_q)

    maximum = []
    for i in range(len(result)):
        maximum.append(np.max(result[i], axis=0).tolist())

    df = pd.DataFrame(maximum, columns=[
                      'num', 'white', 'african', 'hispanic', 'other'])
    min_max = df["num"].min()

    white_census = []
    african_census = []
    hispanic_census = []
    other_census = []
    for i in range(len(result)):
        temp = pd.DataFrame(result[i][:min_max], columns=[
                            'num', 'white', 'african', 'hispanic', 'other'])
        white_census.append(week_mean(temp["white"].tolist()))
        african_census.append(week_mean(temp["african"].tolist()))
        hispanic_census.append(week_mean(temp["hispanic"].tolist()))
        other_census.append(week_mean(temp["other"].tolist()))

    avg_white = np.mean(white_census, axis=0).tolist()
    avg_african = np.mean(african_census, axis=0).tolist()
    avg_hispanic = np.mean(hispanic_census, axis=0).tolist()
    avg_other = np.mean(other_census, axis=0).tolist()

    sim_data = pd.DataFrame()
    sim_data["class1"] = avg_white
    sim_data["class2"] = avg_african
    sim_data["class3"] = avg_hispanic
    sim_data["class4"] = avg_other
    real_data = read_real_data(directory)
    r1, d1 = unify(real_data["class1"].tolist(), sim_data["class1"].tolist())
    r2, d2 = unify(real_data["class2"].tolist(), sim_data["class2"].tolist())
    r3, d3 = unify(real_data["class3"].tolist(), sim_data["class3"].tolist())
    r4, d4 = unify(real_data["class4"].tolist(), sim_data["class4"].tolist())
    out = json.dumps({"name":name,"white_sim": d1, "white_real": r1, "african_sim": d2, "african_real": r2,
                     "hispanic_sim": d3, "hispanic_real": r3, "other_sim": d4, "other_real": r4})
    return out


def unify(list1, list2):
    if len(list1) > len(list2):
        list1 = list1[:len(list2)]
    else:
        list2 = list2[:len(list1)]
    return list1, list2


def read_real_data(directory):
    data = pd.read_csv(directory + "real_census.csv")
    white = data["Census_60"].tolist()
    african = data["Census_10"].tolist()
    hispanic = data["Census_40"].tolist()
    others = data["OtherCensus"].tolist()
    df = pd.DataFrame()
    df["class1"] = white
    df["class2"] = african
    df["class3"] = hispanic
    df["class4"] = others
    return df


def week_mean(lt):
    mean = []
    for i in range(0, len(lt), 7):
        mean.append(np.mean(lt[i:i + 7]))
    return mean


