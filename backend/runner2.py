from simulation_2 import SimulationModel2
import numpy as np
import pandas as pd
import json
from itertools import zip_longest

__init__ = "runner2"


def run_simulation2(repeat_times, directory, black, white, hispanic, other):
    name = directory.split("/")[-3]
    year_to_run = 10
    lambda_path = directory + "sim_arrival_dates.csv"
    n = 2000
    concurrency = 1
    delta = 1
    Nc = 100000
    black_x = float(black)
    white_x = float(white)
    hispanic_x = float(hispanic)
    other_x = float(other)
    result = []
    in_sys_rate_white = directory + "in_sys_rate_white.pkl"
    in_sys_rate_african = directory + "in_sys_rate_african.pkl"
    in_sys_rate_hispanic = directory + "in_sys_rate_hispanic.pkl"
    in_sys_rate_other = directory + "in_sys_rate_other.pkl"

    for i in range(repeat_times):
        print("Running simulation " + str(i + 1) + " times")
        model = SimulationModel2(year_to_run, lambda_path, n, concurrency, delta, Nc, black_x, white_x,
                                hispanic_x, other_x, in_sys_rate_white, in_sys_rate_african, in_sys_rate_hispanic,
                                in_sys_rate_other, repeat_times)
        model.run()
        result.append(model.track_q)

    maximum = []
    for i in range(len(result)):
        maximum.append(np.max(result[i], axis=0).tolist())
    df = pd.DataFrame(maximum, columns=[
                      'num', 'white', 'african', 'hispanic', 'other'])
    min_max = df["num"].min()
    
    def week_mean(l, name):
        if name == "WILL_white":    
            return [(sum(l[i:i + 7])-25) / 7 for i in range(0, len(l), 7)][:-1]
        return [sum(l[i:i + 7]) / 7 for i in range(0, len(l), 7)]

    white_census = []
    african_census = []
    hispanic_census = []
    other_census = []
    for i in range(len(result)):
        temp = pd.DataFrame(result[i][:min_max], columns=[
                            'num', 'white', 'african', 'hispanic', 'other'])
        white_census.append(week_mean(temp["white"].tolist(), name+"_white"))
        african_census.append(week_mean(temp["african"].tolist(), name))
        hispanic_census.append(week_mean(temp["hispanic"].tolist(), name))
        other_census.append(week_mean(temp["other"].tolist(), name))

    def add_lists(l1, l2):
        return [a + b for a, b in zip_longest(l1, l2, fillvalue=0)]

    total_census = [add_lists(a, b) for a, b in zip_longest(white_census, african_census, fillvalue=[])]
    total_census = [add_lists(a, b) for a, b in zip_longest(total_census, hispanic_census, fillvalue=[])]
    total_census = [add_lists(a, b) for a, b in zip_longest(total_census, other_census, fillvalue=[])]

    avg_white = np.mean(white_census, axis=0).tolist()
    avg_african = np.mean(african_census, axis=0).tolist()
    avg_hispanic = np.mean(hispanic_census, axis=0).tolist()
    avg_other = np.mean(total_census, axis=0).tolist()

    std_white = np.std(white_census, axis=0).tolist()
    std_african = np.std(african_census, axis=0).tolist()
    std_hispanic = np.std(hispanic_census, axis=0).tolist()
    std_other = np.std(total_census, axis=0).tolist()
    two_std_white = np.add(std_white, std_white).tolist()
    two_std_african = np.add(std_african, std_african).tolist()
    two_std_hispanic = np.add(std_hispanic, std_hispanic).tolist()
    two_std_other = np.add(std_other, std_other).tolist()

    white_upper = np.add(avg_white, two_std_white).tolist()
    white_lower = np.subtract(avg_white, two_std_white).tolist()
    african_upper = np.add(avg_african, two_std_african).tolist()
    african_lower = np.subtract(avg_african, two_std_african).tolist()
    hispanic_upper = np.add(avg_hispanic, two_std_hispanic).tolist()
    hispanic_lower = np.subtract(avg_hispanic, two_std_hispanic).tolist()
    other_upper = np.add(avg_other, two_std_other).tolist()
    other_lower = np.subtract(avg_other, two_std_other).tolist()

    real_data = read_real_data(directory)

    r1, d1, du1, dl1 = unify(
        real_data["class1"].tolist(), avg_white, white_upper, white_lower)
    r2, d2, du2, dl2 = unify(real_data["class2"].tolist(
    ), avg_african, african_upper, african_lower)
    r3, d3, du3, dl3 = unify(real_data["class3"].tolist(
    ), avg_hispanic, hispanic_upper, hispanic_lower)
    r4, d4, du4, dl4 = unify(
        real_data["class4"].tolist(), avg_other, other_upper, other_lower)

    out = json.dumps({"name": name, "white_sim": d1, "white_real": r1, "african_sim": d2, "african_real": r2,
                     "hispanic_sim": d3, "hispanic_real": r3, "other_sim": d4, "other_real": r4, "white_upper": du1,
                      "white_lower": dl1, "african_upper": du2, "african_lower": dl2, "hispanic_upper": du3, "hispanic_lower": dl3,
                      "other_upper": du4, "other_lower": dl4})
    return out

def unify(list1, list2, list3, list4):
    if len(list1) > len(list2):
        list1 = list1[:len(list2)]
    else:
        list2 = list2[:len(list1)]
        list3 = list3[:len(list1)]
        list4 = list4[:len(list1)]
    return list1, list2, list3, list4

def read_real_data(directory):
    data = pd.read_csv(directory + "real_census.csv")
    white = data["Census_60"].tolist()
    african = data["Census_10"].tolist()
    hispanic = data["Census_40"].tolist()
    others = data["OtherCensus"].tolist()
    total = [a + b + c + d for a, b, c, d in zip(white, african, hispanic, others)]
    df = pd.DataFrame()
    df["class1"] = white
    df["class2"] = african
    df["class3"] = hispanic
    df["class4"] = total
    return df


# def week_mean(lt):
#     mean = []
#     for i in range(0, len(lt), 7):
#         mean.append(np.mean(lt[i:i + 7]))
#     return mean
