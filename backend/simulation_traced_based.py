import numpy as np
import pandas as pd
import heapq

_init_ = "simulation_model"


class SimulationModel:
    def __init__(self, year_to_run, lambda_path, mu_path, n, concurrency, delta, Nc):
        self.year_to_run = year_to_run
        self.maximum_simulation_time = year_to_run * 365
        self.arrivals = np.array(pd.read_excel(lambda_path, sheet_name="Sheet1").values)
        self.mu = pd.read_csv(mu_path, header=None).values
        self.number_of_classes = 4
        self.n = n
        self.concurrency = concurrency
        self.severing = n * concurrency
        self.delta = delta
        self.Nc = Nc

        '''''
        Tracker
        '''''
        self.q = np.zeros(self.number_of_classes)
        self.time = 0

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

        '''''
        Matrices
        '''''
        self.tottime_q = np.zeros([self.number_of_classes, self.Nc])
        self.allinSystem = np.zeros([self.Nc, 4])

        '''''
        Result
        '''''
        self.track_q = []
        self.num_sample = 0

    def generate_arrival_time(self):
        """""
        Generate arrival time
        """""
        n_arrival = 0
        queue = []
        heapq.heapify(queue)

        for t, c in self.arrivals:
            class_index = 0 if c == 60 else 1 if c == 10 else 2 if c == 40 else 3
            heapq.heappush(queue, (t, 1, class_index, n_arrival))
            n_arrival = n_arrival + 1

        return queue

    def generate_departure_time(self, queue, curr_class, curr_id):
        """""
        Generate departure time
        """""

        mu_years = []
        for i in range(self.year_to_run):
            temp = list(self.mu[i])
            for j in range(365):
                mu_years.append(temp)

        service_time = np.random.lognormal(mu_years[int(self.time)][0], mu_years[int(self.time)][1])
        heapq.heappush(queue, (self.time + service_time, 2, curr_class, curr_id))

        return queue

    def sampling(self):
        for i in range(self.number_of_classes):
            self.tottime_q[i][int(self.q[i]) + 1] += self.delta
        self.track_q.append([self.num_sample] + list(self.q.astype(int)))

    def run(self):
        last_sample = 0
        queue = self.generate_arrival_time()

        while self.time <= self.maximum_simulation_time:

            if len(queue) == 0:
                break

            self.time, curr_event, curr_class, curr_id = heapq.heappop(queue)

            if self.num_sample == 0:
                diff = int(self.time) if int(self.time) != 0 else 1
                self.num_sample = 1
                for j in range(self.num_sample, self.num_sample + diff):
                    self.sampling()
                    last_sample = self.num_sample
                    self.num_sample += 1
            else:
                diff = int(self.time - last_sample)
                for j in range(self.num_sample, self.num_sample + diff):
                    self.sampling()
                    last_sample = self.num_sample
                    self.num_sample += 1

            if curr_event == 1:
                self.q[curr_class] += 1
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
                self.q[curr_class] -= 1
                self.counter_ND += 1
                self.time_D[self.counter_ND] = self.time
                self.counter_NDService += 1
                self.time_DService[self.counter_NDService] = self.time

        self.time_A = self.time_A[0:self.counter_NA]
        self.time_D = self.time_D[0:self.counter_ND]
        self.time_A_Q = self.time_A_Q[0:self.counter_NA]
        self.time_D_Q = self.time_D_Q[0:self.counter_ND]
        self.time_inService = self.time_inService[0:self.counter_NinService]
        self.time_AService = self.time_AService[0:self.counter_NAService]
        self.time_DService = self.time_DService[0:self.counter_NDService]

        return self.track_q


# if __name__ == '__main__':
#     ##############################################
#     # STEP1.Initialize the model with parameters #
#     ##############################################
#
#     year_to_run = 8
#     lambda_path = "/Volumes/CHRI-data/Code/Antonio/ForSimulation/ArrivalDay_and_Races.xlsx"
#     mu_path = "/Volumes/CHRI-data/Code/Antonio/ForSimulation/logNormalParametes.csv"
#     n = 2000
#     concurrency = 1
#     delta = 1
#     Nc = 100000
#     model = SimulationModel(year_to_run, lambda_path, mu_path, n, concurrency, delta, Nc)
#     model_copy = copy.deepcopy(model)
#
#     ########################
#     # STEP2.run simulation #
#     ########################
#     repeat_times = 100
#     num_classes = 4
#     result = []
#     model_copy.run()
#
#     # for i in range(repeat_times):
#     #     model_copy.run()
#     #     result.append(model_copy.track_q)
#     #     model_copy = copy.deepcopy(model)
#     #
#     # for i in range(repeat_times):
#     #     print(len(result[i]))
