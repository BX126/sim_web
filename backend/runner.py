from simulation_traced_based import SimulationModel
import copy
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

_init_ = "runner"

def run_simulation(year_to_run=8):
    lambda_path = "/Volumes/CHRI-data/Code/Antonio/ForSimulation/ArrivalDay_and_Races.xlsx"
    mu_path = "/Volumes/CHRI-data/Code/Antonio/ForSimulation/logNormalParametes.csv"
    n = 2000
    concurrency = 1
    delta = 1
    Nc = 100000
    model = SimulationModel(year_to_run, lambda_path, mu_path, n, concurrency, delta, Nc)
    model_copy = copy.deepcopy(model)
    repeat_times = 100
    num_classes = 4
    result = []

    for i in range(repeat_times):
        model_copy.run()
        result.append(model_copy.track_q)
        model_copy = copy.deepcopy(model)

    maximum = []
    for i in range(len(result)):
        maximum.append(np.max(result[i], axis=0).tolist())

    df = pd.DataFrame(maximum, columns=['num', 'white', 'african', 'hispanic', 'asian'])
    min_max = df["num"].min()

    white_census = []
    african_census = []
    hispanic_census = []
    asian_census = []
    for i in range(len(result)):
        temp = pd.DataFrame(result[i][:min_max], columns=['num', 'white', 'african', 'hispanic', 'asian'])
        white_census.append(week_mean(temp["white"].tolist()))
        african_census.append(week_mean(temp["african"].tolist()))
        hispanic_census.append(week_mean(temp["hispanic"].tolist()))
        asian_census.append(week_mean(temp["asian"].tolist()))

    avg_white = np.mean(white_census, axis=0).tolist()
    avg_african = np.mean(african_census, axis=0).tolist()
    avg_hispanic = np.mean(hispanic_census, axis=0).tolist()
    avg_asian = np.mean(asian_census, axis=0).tolist()

    sim_data = pd.DataFrame()
    sim_data["class1"] = avg_white
    sim_data["class2"] = avg_african
    sim_data["class3"] = avg_hispanic
    sim_data["class4"] = avg_asian
    return sim_data


def plotting(df, real_data):
    plt.figure(4)
    plt.plot([x for x in range(len(real_data["class4"].tolist()))], real_data["class4"].tolist(), label='Other Census Real')
    plt.plot([x for x in range(len(df["class4"].tolist()))], df["class4"].tolist(), label='Other Census Simulation')
    plt.plot([x for x in range(len(df["class4"].tolist()))],
             df["class4"].tolist() - 1.975 * np.sqrt(df["class4"].tolist()),
             label='Other Census Simulation - 5% Confidence Interval')
    plt.plot([x for x in range(len(df["class4"].tolist()))],
             df["class4"].tolist() + 1.975 * np.sqrt(df["class4"].tolist()),
             label='Other American Census Simulation - 95% Confidence Interval')
    plt.savefig('class4.png')
    plt.legend()

    plt.figure(3)
    plt.plot([x for x in range(len(df["class1"].tolist()))], df["class1"].tolist(), label='White Census Simulation')
    plt.plot([x for x in range(len(real_data["class1"].tolist()))], real_data["class1"].tolist(), label='White Census Real')
    plt.plot([x for x in range(len(df["class1"].tolist()))],
             df["class1"].tolist() - 1.975 * np.sqrt(df["class1"].tolist()),
             label='White Census Simulation - 5% Confidence Interval')
    plt.plot([x for x in range(len(df["class1"].tolist()))],
             df["class1"].tolist() + 1.975 * np.sqrt(df["class1"].tolist()),
             label='White Census Simulation - 95% Confidence Interval')
    # plt.fill_between([x for x in range(len(df["class1"].tolist()))], df["class1"].tolist() - 1.96 * np.sqrt(df["class1"].tolist()),
    #                  df["class1"].tolist() + 1.96 * np.sqrt(df["class1"].tolist()), alpha=0.2)
    plt.savefig('class1.png')
    plt.legend()

    plt.figure(2)
    plt.plot([x for x in range(len(df["class2"].tolist()))], df["class2"].tolist(),
             label='African American Census Simulation')
    plt.plot([x for x in range(len(real_data["class2"].tolist()))], real_data["class2"].tolist(),
                label='African American Census Real')
    plt.plot([x for x in range(len(df["class2"].tolist()))],
             df["class2"].tolist() - 1.975 * np.sqrt(df["class2"].tolist()),
             label='African American Census Simulation - 5% Confidence Interval')
    plt.plot([x for x in range(len(df["class2"].tolist()))],
             df["class2"].tolist() + 1.975 * np.sqrt(df["class2"].tolist()),
             label='African American Census Simulation - 95% Confidence Interval')
    plt.savefig('class2.png')
    plt.legend()

    plt.figure(1)
    plt.plot([x for x in range(len(df["class3"].tolist()))], df["class3"].tolist(),
             label='Hispanic Census Simulation')
    plt.plot([x for x in range(len(real_data["class3"].tolist()))], real_data["class3"].tolist(),
                label='Hispanic Census Real')
    plt.plot([x for x in range(len(df["class3"].tolist()))],
             df["class3"].tolist() - 1.975 * np.sqrt(df["class3"].tolist()),
             label='African American Census Simulation - 5% Confidence Interval')
    plt.plot([x for x in range(len(df["class2"].tolist()))],
             df["class3"].tolist() + 1.975 * np.sqrt(df["class3"].tolist()),
             label='African American Census Simulation - 95% Confidence Interval')
    plt.savefig('class3.png')
    plt.legend()

    plt.show()


def read_real_data():
    white = pd.read_csv("/Users/bx/PycharmProjects/simulation/real_data/white_real_data.csv", header=None)[1].values.tolist()
    african = pd.read_csv("/Users/bx/PycharmProjects/simulation/real_data/AA_real_data.csv", header=None)[1].values.tolist()
    hispanic = pd.read_csv("/Users/bx/PycharmProjects/simulation/real_data/H_real_data.csv", header=None)[1].values.tolist()
    asian = pd.read_csv("/Users/bx/PycharmProjects/simulation/real_data/O_real_data.csv", header=None)[1].values.tolist()
    df = pd.DataFrame()
    df["class1"] = white
    df["class2"] = african
    df["class3"] = hispanic
    df["class4"] = asian
    return df


def week_mean(lt):
    mean = []
    for i in range(0, len(lt), 7):
        mean.append(np.mean(lt[i:i + 7]))
    return mean


if __name__ == '__main__':
    sim = run_simulation()
    real = read_real_data()
    plotting(sim, real)
