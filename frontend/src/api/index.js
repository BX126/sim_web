import { get, post} from "./axios";

const getResults = async (payload) => {
  return get("/result", { payload });
};

const runSimulation = async (data) => {
  return post("/run", { data: data });
 
};

const runSimulation2 = async (data) => {
  return post("/run2", { data: data });
 
};

const apis = {
  getResults,
  runSimulation,
  runSimulation2,
};

export default apis;