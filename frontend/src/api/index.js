import { get, post} from "./axios";

const getResults = async (payload) => {
  return get("/result", { payload });
};

const runSimulation = async (data) => {
  return post("/run", { data: data });
 
};

const apis = {
  getResults,
  runSimulation,
};

export default apis;