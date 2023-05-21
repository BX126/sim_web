import { get, post} from "./axios";

const getResults = async (payload) => {
  return get("/result", { payload });
};

const runSimulation = async (data) => {
  if (data.years === undefined) {
    return post("/run", { data: data });
  } else {
    return post("/runs", { data: data });
  }
};

const apis = {
  getResults,
  runSimulation,
};

export default apis;