import numpy as np
import pandas as pd
import heapq
import pickle

__init__ = "simulation"


class SimulationModel:
    def __init__(self, year_to_run, lambda_path, n, concurrency, delta, Nc, black_x, white_x, hispanic_x, other_x, in_sys_rate_white, in_sys_rate_african, in_sys_rate_hispanic, in_sys_rate_other, seed):
        self.year_to_run = year_to_run
        self.maximum_simulation_time = year_to_run * 365
        self.arrivals = pd.read_csv(lambda_path).values
        self.number_of_classes = 4
        self.n = n
        self.concurrency = concurrency
        self.severing = n * concurrency
        self.delta = delta
        self.Nc = Nc
        self.out = []
        self.in_sys_rate_white = pickle.load(open(in_sys_rate_white, "rb"))
        self.in_sys_rate_african = pickle.load(open(in_sys_rate_african, "rb"))
        self.in_sys_rate_hispanic = pickle.load(open(in_sys_rate_hispanic, "rb"))
        self.in_sys_rate_other = pickle.load(open(in_sys_rate_other, "rb"))
        self.seed = seed
        self.black_x = pickle.load(open(black_x, "rb"))
        self.white_x = pickle.load(open(white_x, "rb"))
        self.hispanic_x = pickle.load(open(hispanic_x, "rb"))
        self.other_x = pickle.load(open(other_x, "rb"))
        self.af_los = []
        self.wh_los = []
        self.hi_los = []
        self.ot_los = []

        np.random.seed(seed)
        for i in range(self.year_to_run):
            self.af_los.append(np.random.choice(self.black_x[i].index, size=250, p=self.black_x[i].values))
            self.wh_los.append(np.random.choice(self.white_x[i].index, size=120, p=self.white_x[i].values))
            self.hi_los.append(np.random.choice(self.hispanic_x[i].index, size=100, p=self.hispanic_x[i].values))
            self.ot_los.append(np.random.choice(self.other_x[i].index, size=100, p=self.other_x[i].values))
        self.af_ind = [0 for i in range(self.year_to_run)]
        self.wh_ind = [0 for i in range(self.year_to_run)]
        self.hi_ind = [0 for i in range(self.year_to_run)]
        self.ot_ind = [0 for i in range(self.year_to_run)]

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
        index = int(self.time / 365)
        if curr_class == 0:
            np.random.seed(self.seed)
            leave_sys = np.random.choice([0, 1], p=[1 - self.in_sys_rate_white[index], self.in_sys_rate_white[index]])
            if leave_sys == 0:
                service_time = 10000
            else:
                service_time = self.wh_los[index][self.wh_ind[index]]
                self.wh_ind[index] += 1
            self.out.append(service_time)
        elif curr_class == 1:
            np.random.seed(self.seed)
            leave_sys = np.random.choice([0, 1], p=[1 - self.in_sys_rate_african[index], self.in_sys_rate_african[index]])
            if leave_sys == 0:
                service_time = 10000
            else:
                service_time = self.af_los[index][self.af_ind[index]]
                self.af_ind[index] += 1
        elif curr_class == 2:
            np.random.seed(self.seed)
            leave_sys = np.random.choice([0, 1], p=[1 - self.in_sys_rate_hispanic[index], self.in_sys_rate_hispanic[index]])
            if leave_sys == 0:
                service_time = 10000
            else:
                service_time = self.hi_los[index][self.hi_ind[index]]
                self.hi_ind[index] += 1
        else:
            np.random.seed(self.seed)
            leave_sys = np.random.choice([0, 1], p=[1 - self.in_sys_rate_other[index], self.in_sys_rate_other[index]])
            if leave_sys == 0:
                service_time = 10000
            else:
                service_time = self.ot_los[index][self.ot_ind[index]]
                self.ot_ind[index] += 1

        heapq.heappush(queue, (self.time + int(service_time), 2, curr_class, curr_id))
        return queue

    def sampling(self):
        for i in range(self.number_of_classes):
            self.tottime_q[i][int(self.q[i]) + 1] += self.delta
        self.track_q.append([self.num_sample] + list(self.q.astype(int)))

    def run(self):
        last_sample = 0
        queue = self.generate_arrival_time()

        while self.time < self.maximum_simulation_time:

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

        return self.track_q, self.out
