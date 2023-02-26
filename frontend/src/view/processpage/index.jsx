import { useLocation} from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import "./process.css";
import apis from "../../api";

export const ProcessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    apis.runSimulation(location.state.data)
    .then((res) => {
      navigate("/result", { state: { data: res } });
    });
  }, [location.state.data, navigate]);

  return (
    <div className="main">
      <div className="loader"></div>
      <Typography variant="h3" component="h3" sx={{ mt: 3, mb: 3, fontFamily:"cursive" }}>
        Running Simulation ...
      </Typography>
    </div>
  );
};
