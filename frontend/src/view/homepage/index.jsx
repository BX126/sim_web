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
  const lambdaClasses_1 = useRef(4);
  const lambdaClasses_2 = useRef(5);
  const lambdaClasses_3 = useRef(6);
  const lambdaClasses_4 = useRef(2);
  const muClasses_1 = useRef(0.1);
  const muClasses_2 = useRef(0.083);
  const muClasses_3 = useRef(0.0909);
  const muClasses_4 = useRef(0.1111);
  const deltaClasses_1 = useRef(0.3333);
  const deltaClasses_2 = useRef(0.25);
  const deltaClasses_3 = useRef(0.5);
  const deltaClasses_4 = useRef(0.2);
  const gammaClasses_1 = useRef(0.2);
  const gammaClasses_2 = useRef(0.0625);
  const gammaClasses_3 = useRef(0.1111);
  const gammaClasses_4 = useRef(0.0714);
  const steadyTimeRef = useRef();

  const navigate = useNavigate();
  const runSimulation = () => {
    const data = {
      lambdaClasses: lambdaClasses_1.current.value+","+lambdaClasses_2.current.value+","+lambdaClasses_3.current.value+","+lambdaClasses_4.current.value,
      muClasses: muClasses_1.current.value+","+muClasses_2.current.value+","+muClasses_3.current.value+","+muClasses_4.current.value,
      deltaClasses: deltaClasses_1.current.value+","+deltaClasses_2.current.value+","+deltaClasses_3.current.value+","+deltaClasses_4.current.value,
      gammaClasses: gammaClasses_1.current.value+","+gammaClasses_2.current.value+","+gammaClasses_3.current.value+","+gammaClasses_4.current.value,
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
      <Typography
        variant="h2"
        component="h2"
        sx={{ mt: 3, fontFamily: "cursive" }}
      >
        Simulation
      </Typography>

      <Typography
        variant="p"
        component="p"
        sx={{ mt: 2,mb:5, fontFamily: "cursive" }}
      >
        <b>NOTE:</b> Click the fields to change the values
      </Typography>

      <Typography variant="p" component="p" sx={{ fontFamily: "cursive" }}>
        Number of Clients
      </Typography>

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
        <TextField
          sx={{ width: "10%", m: 2 }}
          label="Class 1"
          variant="filled"
          id="outlined-helperText"
          value={4}
          inputRef={lambdaClasses_1}
        />

        <TextField
          sx={{ width: "10%", m: 2 }}
          label="Class 2"
          variant="filled"
          d="outlined-helperText"
          value={5}
          inputRef={lambdaClasses_2}
        />
        <TextField
          sx={{ width: "10%", m: 2 }}
          label="Class 3"
          variant="filled"
          d="outlined-helperText"
          value={6}
          inputRef={lambdaClasses_3}
        />
        <TextField
          sx={{ width: "10%", m: 2 }}
          label="Class 4"
          variant="filled"
          d="outlined-helperText"
          value={2}
          inputRef={lambdaClasses_4}
        />
      </Box>

      <Typography variant="p" component="p" sx={{ fontFamily: "cursive" }}>
        Average Length of Stay
      </Typography>

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
        <TextField
          sx={{ width: "10%", m: 2 }}
          label="Class 1"
          variant="filled"
          id="outlined-helperText"
          value={0.1}
          inputRef={muClasses_1}
        />

        <TextField
          sx={{ width: "10%", m: 2 }}
          label="Class 2"
          variant="filled"
          id="outlined-helperText"
          value={0.083}
          inputRef={muClasses_2}
        />
        <TextField
          sx={{ width: "10%", m: 2 }}
          label="Class 3"
          variant="filled"
          id="outlined-helperText"
          value={0.0909}
          inputRef={muClasses_3}
        />
        <TextField
          sx={{ width: "10%", m: 2 }}
          label="Class 4"
          variant="filled"
          id="outlined-helperText"
          value={0.1111}
          inputRef={muClasses_4}
        />
      </Box>

      <Typography variant="p" component="p" sx={{ fontFamily: "cursive" }}>
        Delay Time
      </Typography>

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
        <TextField
          sx={{ width: "10%", m: 2 }}
          label="Class 1"
          variant="filled"
          id="outlined-helperText"
          value={0.3333}
          inputRef={deltaClasses_1}
        />

        <TextField
          sx={{ width: "10%", m: 2 }}
          id="outlined-helperText"
          label="Class 2"
          variant="filled"
          value={0.25}
          inputRef={deltaClasses_2}
        />
        <TextField
          sx={{ width: "10%", m: 2 }}
          id="outlined-helperText"
          label="Class 3"
          variant="filled"
          value={0.5}
          inputRef={deltaClasses_3}
        />
        <TextField
          sx={{ width: "10%", m: 2 }}
          id="outlined-helperText"
          label="Class 4"
          variant="filled"
          value={0.2}
          inputRef={deltaClasses_4}
        />
      </Box>

      <Typography variant="p" component="p" sx={{ fontFamily: "cursive" }}>
        Time Till Recidivism
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          mb:5
        }}
      >
        <TextField
          sx={{ width: "10%", m: 2 }}
          id="outlined-helperText"
          label="Class 1"
          variant="filled"
          value={0.2}
          inputRef={gammaClasses_1}
        />

        <TextField
          sx={{ width: "10%", m: 2 }}
          id="outlined-helperText"
          label="Class 2"
          variant="filled"
          value={0.0625}
          inputRef={gammaClasses_2}
        />
        <TextField
          sx={{ width: "10%", m: 2 }}
          id="outlined-helperText"
          label="Class 3"
          variant="filled"
          value={0.1111}
          inputRef={gammaClasses_3}
        />
        <TextField
          sx={{ width: "10%", m: 2 }}
          id="outlined-helperText"
          label="Class 4"
          variant="filled"
          value={0.0714}
          inputRef={gammaClasses_4}
        />
      </Box>

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

      <Button variant="contained" onClick={runSimulation} sx={{ mt: 6 }}>
        <Typography variant="h5" component="h5">
          Run Simulation
        </Typography>
      </Button>
    </Box>
  );
};
