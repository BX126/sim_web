import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./process.css";
import apis from "../../api";
import Times from "./times";

export const ProcessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  var maxtimes = location.state.data.times;
  var county = location.state.data.county;
  var traced = location.state.data.traced;

  useEffect(() => {
    if (location.state.data.traced === true) {
      console.log(location.state.data);
      apis.runSimulation2(location.state.data).then((res) => {
        navigate("/result", { state: { data: res } });
      });
    } else {
      apis.runSimulation(location.state.data).then((res) => {
        navigate("/result", { state: { data: res } });
      });
    }
  }, []);

  return (
    <div className="main">
      <div className="loader"></div>
      <Times maxtimes={maxtimes} county={county} traced={traced} />
    </div>
  );
};
