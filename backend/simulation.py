import numpy as np
import math
import matplotlib.pyplot as plt
import heapq
import json

_init_ = "simulation_model"


class SimulationModel:
    def __init__(self, maximum_simulation_time, lambdaClasses, muClasses, n, concurrency, delta,
                 deltaClasses, gammaClasses, gamma, Nc):
        """""
        Parameters:
            - maximum simulation time (unit: week)
            - steady state time: Determined by the fluid queue model.
            - lambdaClasses: Number of clients per week for each classes.
            - muClasses : Average service times per 72 weeks (Half of a year) for each classes.
            - n: Number of servers.
            - number of classes: Number of classes of clients. 
            - concurrency: Number of clients be served by servers at the same time.
            - severing: n * concurrency.
            - delta: To control how many sample to take.
            - deltaClasses: Delay time for each classes.
            - gamma: To control time till recidivism
            - Nc: To control time recorder
        """""
        self.maximum_simulation_time = maximum_simulation_time
        self.steady_state_time = 0
        self.lambdaClasses = np.around(lambdaClasses, decimals=4)
        self.muClasses = np.around(muClasses, decimals=4)
        self.number_of_classes = len(lambdaClasses)
        self.n = n
        self.concurrency = concurrency
        self.severing = n * concurrency
        self.delta = delta
        self.deltaClasses = np.around(deltaClasses, decimals=4)
        self.gammaClasses = np.around(gammaClasses, decimals=4)
        self.gamma = gamma
        self.Nc = Nc

        '''''
        Tracker
        '''''
        self.q_1 = np.zeros(self.number_of_classes)
        self.q_2 = np.zeros(self.number_of_classes)
        self.q_both = np.zeros(self.number_of_classes)
        self.time = 0
        self.q_1_event = np.zeros(self.number_of_classes)
        self.q_2_event = np.zeros(self.number_of_classes)

        '''''
        Counter
        '''''
        self.counter_NA = 0
        self.counter_ND = 0
        self.counter_NA_Q = 0
        self.counter_ND_Q = 0
        self.counter_NinService = 0
        self.counter_NAService = 0
        self.counter_NDService = 0
        self.counter_NAJail = 0

        '''''
        Time recorder
        '''''
        self.time_A = np.zeros(self.Nc)
        self.time_D = np.zeros(self.Nc)
        self.time_A_Q = np.zeros(self.Nc)
        self.time_D_Q = np.zeros(self.Nc)
        self.time_inService = np.zeros(self.Nc)
        self.time_AService = np.zeros(self.Nc)
        self.time_DService = np.zeros(self.Nc)
        self.time_AJail = np.zeros(self.Nc)

        '''''
        Matrices
        '''''
        self.tottime_q1 = np.zeros([self.number_of_classes, self.Nc])
        self.tottime_q2 = np.zeros([self.number_of_classes, self.Nc])
        self.tottime_qboth = np.zeros([self.number_of_classes, self.Nc])
        self.allinSystem = np.zeros([self.Nc, 4])

        print("\n################################################")
        print("Model initialized with following parameters:")
        print(" -Maximum simulation time:", self.maximum_simulation_time)
        print(" -Lambda classes:", self.lambdaClasses)
        print(" -Mu classes:", self.muClasses)
        print(" -Delta classes:", self.deltaClasses)
        print(" -Gamma classes:", self.gammaClasses)
        print(" -N:", self.n)
        print(" -Concurrency:", self.concurrency)
        print(" -Delta:", self.delta)
        print(" -Gamma:", self.gamma)
        print(" -Nc:", self.Nc)
        print("################################################\n")

    def set_steady_state_time(self, time):
        self.steady_state_time = time

    def fluid_queue_model(self):
        """""
        Fluid queue model to determine the steady state time.
        """""
        queue_1 = np.zeros([self.number_of_classes, self.maximum_simulation_time])
        queue_2 = np.zeros([self.number_of_classes, self.maximum_simulation_time])
        for i in range(1, self.maximum_simulation_time):
            queue_1[:, i] = queue_1[:, i - 1] + self.lambdaClasses - (self.deltaClasses * queue_1[:, i - 1])
            queue_2[:, i] = queue_2[:, i - 1] + (self.deltaClasses * queue_1[:, i - 1]) - (
                    (self.gammaClasses + self.muClasses) * queue_2[:, i - 1])
        state_1 = self.lambdaClasses / self.deltaClasses
        state_2 = self.lambdaClasses / (self.gammaClasses + self.muClasses)
        time_1 = self.get_steady_index(queue_1, state_1)
        time_2 = self.get_steady_index(queue_2, state_2)
        self.steady_state_time = max(time_1, time_2)
        return self.steady_state_time, state_1, state_2

    def generate_arrival_time(self):
        """""
        Generate arrival time according to Poisson distribution.
        """""

        LAMBDA = sum(self.lambdaClasses)
        ForComparison = np.cumsum(self.lambdaClasses) / LAMBDA
        t = -(np.log(np.random.rand()) / LAMBDA)
        n_arrival = 0
        queue = []
        heapq.heapify(queue)
        while t < self.maximum_simulation_time:
            rand = np.random.rand()
            dummy = [1 if x < rand else 0 for x in ForComparison[:len(ForComparison) - 1]]
            dummy2 = sum(dummy)
            class_index = 0
            if dummy2 == len(dummy):
                class_index = len(dummy)
            elif dummy2 == 0:
                class_index = 0
            else:
                for i in range(len(dummy)):
                    if dummy[i] == 0:
                        class_index = i
                        break
            heapq.heappush(queue, (t, 1, class_index, n_arrival))
            n_arrival = n_arrival + 1
            t = t - (np.log(np.random.rand()) / LAMBDA)

        return queue

    def generate_departure_time(self, queue, curr_class, curr_id):
        """""
        Generate departure time according to Exp distribution.
        """""
        delay_time = self.time + np.random.exponential(scale=1 / self.deltaClasses[curr_class], size=1)[0]
        time_till_recidiv = np.random.exponential(scale=1 / self.gammaClasses[curr_class], size=1)[0]
        time_till_servifinish = np.random.exponential(scale=1 / self.muClasses[curr_class], size=1)[0]

        jailIndicator = 0
        service_time = delay_time + time_till_servifinish
        if time_till_recidiv <= time_till_servifinish:
            jailIndicator = 1
            service_time = delay_time + time_till_recidiv

        heapq.heappush(queue, (delay_time, 3, curr_class, curr_id))

        if jailIndicator == 0:
            heapq.heappush(queue, (service_time, 2, curr_class, curr_id))
        else:
            heapq.heappush(queue, (service_time, 4, curr_class, curr_id))

        return queue

    def sampling(self):
        for i in range(self.number_of_classes):
            self.tottime_q1[i][int(self.q_1[i]) + 1] += self.delta
            self.tottime_q2[i][int(self.q_2[i]) + 1] += self.delta
            self.tottime_qboth[i][int(self.q_both[i]) + 1] += self.delta

    def run(self, steady_time=-1):
        if steady_time == -1:
            print("Running fluid queue model to get steady state time...")
            steady_time, state_1, state_2 = self.fluid_queue_model()
            print("Finished running fluid queue model.")
            print("Steady state time:", steady_time)
        else:
            time, state_1, state_2 = self.fluid_queue_model()
            print("Assigned Steady state time:", steady_time)
        print()
        self.set_steady_state_time(steady_time)

        num_sample = 0
        last_sample_time = 0
        queue = self.generate_arrival_time()

        print("Running simulation...")
        while self.time <= self.maximum_simulation_time:
            if len(queue) == 0:
                break

            self.time, curr_event, curr_class, curr_id = heapq.heappop(queue)

            if self.time >= self.steady_state_time:
                if (np.floor(self.time) == self.steady_state_time) and (num_sample == 0):
                    num_sample = 1
                    last_sample_time = self.steady_state_time
                    self.sampling()
                else:
                    diff = np.ceil((self.time - last_sample_time) / self.delta).astype(int)
                    for j in range(num_sample, num_sample + diff):
                        self.sampling()
                    num_sample = num_sample + diff
                    last_sample_time = self.time

            if curr_event == 1:
                self.q_1[curr_class] += 1
                self.q_both[curr_class] += 1
                self.counter_NA += 1
                self.counter_NinService += 1
                self.time_inService[self.counter_NinService] = self.time
                self.counter_NAService += 1
                self.time_AService[self.counter_NAService] = self.time
                self.allinSystem[self.counter_NA][0] = self.counter_NA
                self.allinSystem[self.counter_NA][1] = 0
                self.allinSystem[self.counter_NA][2] = self.time
                self.allinSystem[self.counter_NA][3] = self.time
                self.time_A[self.counter_NA] = self.time
                temp = self.generate_departure_time(queue, curr_class, curr_id)
                del queue
                queue = temp

            elif curr_event == 2:
                self.q_2[curr_class] -= 1
                self.q_both[curr_class] -= 1
                self.counter_ND += 1
                self.time_D[self.counter_ND] = self.time

            elif curr_event == 3:
                self.q_1[curr_class] -= 1
                self.q_2[curr_class] += 1
                self.counter_NDService += 1
                self.time_DService[self.counter_NDService] = self.time

            elif curr_event == 4:
                self.q_2[curr_class] -= 1
                self.q_both[curr_class] -= 1
                self.counter_ND += 1
                self.time_D[self.counter_ND] = self.time
                self.counter_NAJail += 1
                self.time_AJail[self.counter_NAJail] = self.time

        print("Finished running simulation.")

        print("Processing information...")
        self.time_A = self.time_A[0:self.counter_NA]
        self.time_D = self.time_D[0:self.counter_ND]
        self.time_A_Q = self.time_A_Q[0:self.counter_NA]
        self.time_D_Q = self.time_D_Q[0:self.counter_ND]
        self.time_inService = self.time_inService[0:self.counter_NinService]
        self.time_AService = self.time_AService[0:self.counter_NAService]
        self.time_DService = self.time_DService[0:self.counter_NDService]
        self.time_AJail = self.time_AJail[0:self.counter_NAJail]

        q1_new = np.zeros(self.number_of_classes)
        q2_new = np.zeros(self.number_of_classes)
        qboth_new = np.zeros(self.number_of_classes)
        max_q1 = np.zeros(self.number_of_classes)
        max_q2 = np.zeros(self.number_of_classes)
        max_qboth = np.zeros(self.number_of_classes)
        tottime_q1_new = []
        tottime_q2_new = []
        tottime_qboth_new = []
        for i in range(self.number_of_classes):
            max_q1[i] = np.max(np.nonzero(self.tottime_q1[i]))
            tottime_q1_new.append(self.tottime_q1[i][0:int(max_q1[i])])
            q1_new[i] = np.sum(
                np.array(tottime_q1_new[i]) * np.array([x for x in range(len(tottime_q1_new[i]))])) / np.sum(
                tottime_q1_new[i])

            max_q2[i] = np.max(np.nonzero(self.tottime_q2[i, :]))
            tottime_q2_new.append(self.tottime_q2[i, :int(max_q2[i])])
            q2_new[i] = np.sum(
                np.array(tottime_q2_new[i]) * np.array([x for x in range(len(tottime_q2_new[i]))])) / np.sum(
                tottime_q2_new[i])

            max_qboth[i] = np.max(np.nonzero(self.tottime_qboth[i, :]))
            tottime_qboth_new.append(self.tottime_qboth[i, :int(max_qboth[i])])
            qboth_new[i] = np.sum(
                np.array(tottime_qboth_new[i]) * np.array([x for x in range(len(tottime_qboth_new[i]))])) / np.sum(
                tottime_qboth_new[i])

        theory_1 = []
        arr = np.array([x for x in range(120)])
        frac = [math.factorial(x) for x in range(120)]
        for i in range(self.number_of_classes):
            theory_1.append((state_1[i] ** arr) / frac * (np.exp(-state_1[i])))

        theory_2 = []
        for i in range(self.number_of_classes):
            theory_2.append((state_2[i] ** arr) / frac * (np.exp(-state_2[i])))

        state_both = [x + y for x, y in zip(state_1, state_2)]
        theory_both = []
        for i in range(self.number_of_classes):
            theory_both.append((state_both[i] ** arr) / frac * (np.exp(-state_both[i])))

        print("Finished processing information.")

        
        for i in range(self.number_of_classes):
            temp = np.sum(tottime_q1_new[i])
            tottime_q1_new[i] = tottime_q1_new[i] / temp
            temp = np.sum(tottime_q2_new[i])
            tottime_q2_new[i] = tottime_q2_new[i] / temp
            temp = np.sum(tottime_qboth_new[i])
            tottime_qboth_new[i] = tottime_qboth_new[i] / temp
            
        output = {"n": self.number_of_classes, "q1": tottime_q1_new, "q2": tottime_q2_new, "qboth": tottime_qboth_new, "theory_1": theory_1, "theory_2": theory_2, "theory_both": theory_both}
        class NumpyEncoder(json.JSONEncoder):
            def default(self, obj):
                if isinstance(obj, np.ndarray):
                    return obj.tolist()
                return json.JSONEncoder.default(self, obj)
        return json.dumps(output, cls=NumpyEncoder)

    """""
    utility functions
    """""

    @staticmethod
    def get_steady_index(queue, state):
        for index in range(1, len(queue[0])):
            flag = True
            for ele in range(len(queue)):
                if np.abs(queue[ele][index] - state[ele]) > 0.0001:
                    flag = False
                    break
            if flag:
                return index
        return -1
    
    @staticmethod
    def plot_with_raw_results(directory_path, save_plots_to_path=None):
        if directory_path[-1] != '/':
            directory_path += '/'
        with open(directory_path + 'tottime_q1.p', 'r') as f:
            tottime_q1 = pickle.load(f)
        with open(directory_path + 'tottime_q2.p', 'r') as f2:
            tottime_q2 = pickle.load(f2)
        with open(directory_path + 'tottime_qboth.p', 'r') as f3:
            tottime_qboth = pickle.load(f3)
        with open(directory_path + 'theory_1.p', 'r') as f4:
            theory_1 = pickle.load(f4)
        with open(directory_path + 'theory_2.p', 'r') as f5:
            theory_2 = pickle.load(f5)
        with open(directory_path + 'theory_both.p', 'r') as f6:
            theory_both = pickle.load(f6)

        plt.figure()
        for i in range(len(tottime_q1)):
            plt.plot([x for x in range(len(tottime_q1[i]))], tottime_q1[i] / np.sum(tottime_q1[i]),
                     label='Class ' + str(i + 1) + " Simulation")
            plt.plot(theory_1[i], label='Class ' + str(i + 1) + ' Theoretical')
            plt.xlim(0, 40)
            plt.legend()
            plt.title("Queue 1")

        plt.figure(2)
        for i in range(len(tottime_q2)):
            plt.plot([x for x in range(len(tottime_q2[i]))], tottime_q2[i] / np.sum(tottime_q2[i]),
                     label='Class ' + str(i + 1) + " Simulation")
            plt.plot(theory_2[i], label='Class ' + str(i + 1) + ' Theoretical')
            plt.xlim(0, 60)
            plt.legend()
            plt.title("Queue 2")

        plt.figure(3)
        for i in range(len(tottime_qboth)):
            plt.plot([x for x in range(len(tottime_qboth[i]))], tottime_qboth[i] / np.sum(tottime_qboth[i]),
                     label='Class ' + str(i + 1) + " Simulation")
            plt.plot(theory_both[i], label='Class ' + str(i + 1) + ' Theoretical')
            plt.xlim(0, 150)
            plt.legend()
            plt.title("Queue Both")

        try:
            if save_plots_to_path is not None:
                if save_plots_to_path[-1] != '/':
                    save_plots_to_path += '/'
                plt.savefig(save_plots_to_path + 'queue1.png')
                plt.savefig(save_plots_to_path + 'queue2.png')
                plt.savefig(save_plots_to_path + 'queue_both.png')
            else:
                plt.show()
        except:
            print("Failed save plots to file.")
            print("Please check if the path is correct.")
            print("Skipped saving plots to file.")
            plt.show()


if __name__ == '__main__':
    ##############################################
    # STEP1.Initialize the model with parameters #
    ##############################################

    maximum_simulation_time = 5000
    lambdaClasses = [4, 5, 6, 2]
    muClasses = [1 / 10, 1 / 12, 1 / 11, 1 / 9]
    deltaClasses = [1 / 3, 1 / 4, 1 / 2, 1 / 5]
    gammaClasses = [1 / 5, 1 / 16, 1 / 9, 1 / 14]
    n = 2000
    concurrency = 1
    delta = 0.2
    gamma = 0.1
    Nc = 100000
    model = SimulationModel(maximum_simulation_time, lambdaClasses, muClasses, n, concurrency, delta,
                            deltaClasses, gammaClasses, gamma, Nc)

    ########################
    # STEP2.run simulation #
    ########################

    '''''
    There are 3 optional parameter to run the simulation.
    1. steady_time: The steady state time of the simulation. If not assigned, the model will run fluid queue model to calculate the steady state time.
    2. save_plots_to_path: The path to save the plots. If not assigned, the plots will be shown.
    3. save_results_to_path: The path to save the raw results. If not assigned, the results will not be saved.
    '''''

    # Option1 - Run fluid queue model to calculate steady state time and then run simulation
    # model.run()

    # Option2 - Run simulation with assigned steady state time
    # model.run(steady_time=495)

    # Option3 - Run simulation and save plots to path
    # model.run(save_plots_to_path="/Users/bx/PycharmProjects/simulation/results/")

    # Option4 - Run simulation and save raw results to path
    # model.run(save_results_to_path="/Users/bx/PycharmProjects/simulation/results/")

    ###################
    # Other functions #
    ###################

    # Plot raw results, use together with run function option 4
    # model.plot_with_raw_results("/Users/bx/PycharmProjects/simulation/results/")
    # model.plot_with_raw_results("/Users/bx/PycharmProjects/simulation/results/", save_plots_to_path="/Users/bx/PycharmProjects/simulation/results/")

    # Get steady state time and states
    # steady_state_time, state_1, state_2 = model.fluid_queue_model()
    # print("Steady state time: ", steady_state_time)
    # print("State 1: ", state_1)
    # print("State 2: ", state_2)
