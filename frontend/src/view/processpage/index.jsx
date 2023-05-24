import { useLocation} from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import "./process.css";
import apis from "../../api";
import Times from "./times";

export const ProcessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  var maxtimes = location.state.data.times;

  useEffect(() => {
    apis.runSimulation(location.state.data)
  .then((res) => {
    navigate("/result", { state: { data: res } });
  });
  }, [location.state.data, navigate]);

  return (
    <div className="main">
      <div className="loader"></div>
      <Times max={maxtimes}/>
      
    </div>
  );
};
