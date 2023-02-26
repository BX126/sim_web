import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Button } from "@mui/material";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const [steadyTime, setSteadyTime] = useState(false);
  const handleSteadyTime = () => {
    setSteadyTime(!steadyTime);
  };

  const maxTime = useRef(5000);
  const lambdaClasses = useRef();
  const muClasses = useRef();
  const deltaClasses = useRef();
  const gammaClasses = useRef();
  const n = useRef();
  const concurrency = useRef();
  const delta = useRef();
  const gamma = useRef();
  const nc = useRef();
  const steadyTimeRef = useRef();

  const navigate = useNavigate();
  const runSimulation = () => {
    const data = {
      maxTime: maxTime.current.value,
      lambdaClasses: lambdaClasses.current.value,
      muClasses: muClasses.current.value,
      deltaClasses: deltaClasses.current.value,
      gammaClasses: gammaClasses.current.value,
      n: n.current.value,
      concurrency: concurrency.current.value,
      delta: delta.current.value,
      gamma: gamma.current.value,
      nc: nc.current.value,
    };
    if (steadyTime) {
      data.steadyTime = steadyTimeRef.current.value;
    } else {
      data.steadyTime = "-1";
    }
    navigate("./process", { state: { data } });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <Typography variant="h2" component="h2" sx={{ mt: 3, fontFamily:"cursive"  }}>
        Simulation
      </Typography>

      <Typography variant="p" component="p" sx={{ mt: 2, fontFamily:"cursive" }}>
        <b>NOTE:</b> Please enter the values separated by commas for different
        class
      </Typography>
      <Typography variant="p" component="p" sx={{fontFamily:"cursive" }}>
        for <i>Number of Clients</i>, <i>Average Service Times</i>,{" "}
        <i>Delay Time</i>, <i>Time Till Recidivism</i>
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            height: "100%",
            width: "50%",
            p: 5,
          }}
        >
          <TextField
            sx={{ width: "50%", mb: 2 }}
            label="Maximum simulation time"
            type="number"
            variant="filled"
            inputRef={maxTime}
          />

          <TextField
            sx={{ width: "50%", mb: 2 }}
            label=" Number of Clients"
            variant="filled"
            inputRef={lambdaClasses}
          />

          <TextField
            sx={{ width: "50%", mb: 2 }}
            label="Average Service Times"
            variant="filled"
            inputRef={muClasses}
          />

          <TextField
            sx={{ width: "50%", mb: 2 }}
            label="Delay Time"
            variant="filled"
            inputRef={deltaClasses}
          />

          <TextField
            sx={{ width: "50%", mb: 2 }}
            label="Time Till Recidivism"
            variant="filled"
            inputRef={gammaClasses}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            height: "100%",
            width: "50%",
            p: 5,
          }}
        >
          <TextField
            sx={{ width: "50%", mb: 2 }}
            label="N"
            type="number"
            variant="filled"
            inputRef={n}
          />

          <TextField
            sx={{ width: "50%", mb: 2 }}
            label="Concurrency"
            type="number"
            variant="filled"
            inputRef={concurrency}
          />

          <TextField
            sx={{ width: "50%", mb: 2 }}
            label="Delta"
            type="number"
            variant="filled"
            inputRef={delta}
          />

          <TextField
            sx={{ width: "50%", mb: 2 }}
            label="Gamma"
            type="number"
            variant="filled"
            inputRef={gamma}
          />

          <TextField
            sx={{ width: "50%", mb: 2 }}
            label="Nc"
            type="number"
            variant="filled"
            inputRef={nc}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <FormGroup>
          <FormControlLabel
            control={<Switch defaultChecked onChange={handleSteadyTime} />}
            label="Run Fluid Queue Model"
          />
        </FormGroup>

        {steadyTime && (
          <TextField
            sx={{ width: "20%" }}
            label="Steady Time"
            type="number"
            variant="filled"
            inputRef={steadyTimeRef}
          />
        )}
      </Box>

      <Button variant="contained" onClick={runSimulation} sx={{ mt: 6 }}>
        <Typography variant="h5" component="h5">
          Run Simulation
        </Typography>
      </Button>
    </Box>
  );
};
