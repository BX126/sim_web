import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Box from "@mui/material/Box";
import Slider from '@mui/material/Slider';
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Param = ({ open, setOpen, county }) => {


  const [repeatTimes, setRepeatTimes] = useState(50);
  const [traced, setTraced] = useState(false);
  const af = useRef(0);
  const other = useRef(0);
  const hispanic = useRef(0);
  const white = useRef(0);
  const los = {
    "COOK": {
      "white": 462.31,
      "af": 496.52,
      "hispanic": 465.76,
      "other": 373.00
    },
    "DUPAGE": {
      "white": 595.28,
      "af": 660.36,
      "hispanic": 595.93,
      "other": 830.00
    },
    "WILL": {
      "white": 462.31,
      "af": 496.52,
      "hispanic": 465.76,
      "other": 373.00
    },
    "PEORIA": {
      "white": 576.00,
      "af": 657.72,
      "hispanic": 504.50,
      "other": 913.00
    }
  }

  const handleTraced = () => {
    setTraced(!traced);
  };

  const handleChange = (event, newValue) => {
    setRepeatTimes(newValue);
  };

  const navigate = useNavigate();
  const runSimulation = () => {
    const data = {
      traced: traced,
      times: repeatTimes,
      county: county,
      white: white.current.value,
      af: af.current.value,
      hispanic: hispanic.current.value,
      other: other.current.value,
    };
    navigate("./process", { state: { data } });
  };

  const handleClose = () => {
    setOpen(false);
    setTraced(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="lg">
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
              height: traced ? 400 : 200,
              width: 400,
            }}
          >
            <Typography
              variant="h6"
              component="h6"
              sx={{ mb: 3, color: "rgb(128, 128, 128)", fontSize: "large", fontWeight: "bold" }}
            >
              Simulation Parameters
            </Typography>

            <Typography
              variant="h6"
              component="h6"
              sx={{ mb: 1, color: "rgb(128, 128, 128)", fontSize: "medium" }}
            >
              Repeat Times
            </Typography>
            <Slider
              getAriaLabel={() => 'Value slider'}
              value={repeatTimes}
              onChange={handleChange}
              valueLabelDisplay="auto"
              getAriaValueText={(value) => `${value}`}
              min={50}
              max={3000}
              marks={[
                {
                  value: 50,
                  label: '50',
                },
                {
                  value: 3000,
                  label: '3000',
                },
              ]}
              sx={{
                width: "80%",
                color: 'green',
                '& .MuiSlider-thumb': {
                  color: '#69b3a2',
                },
                '& .MuiSlider-track': {
                  color: '#69b3a2',
                },
                '& .MuiSlider-rail': {
                  color: '#69b3a2',
                },
              }}
            />

            <Typography
              variant="h6"
              component="h6"
              sx={{ mb: 1, color: "rgb(128, 128, 128)", fontSize: "medium" }}
            >
              Length of Stay
            </Typography>

            <FormGroup>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                defaultValue="Emerpical Distri."
                onChange={handleTraced}
              >
                <FormControlLabel value="Emerpical Distri." control={<Radio sx={{
                  color: "#69b3a2", '&.Mui-checked': {
                    color: "#69b3a2",
                  }
                }} />} label="~Emerpical Distri." sx={{ mb: 1, color: "rgb(128, 128, 128)", fontSize: "medium" }} />
                <FormControlLabel value="Exponential Distri." control={<Radio sx={{
                  color: "#69b3a2", '&.Mui-checked': {
                    color: "#69b3a2",
                  }
                }} />} label="~Exponential Distri." sx={{ mb: 1, color: "rgb(128, 128, 128)", fontSize: "medium" }} />
              </RadioGroup>
            </FormGroup>

            {traced && (
              <Box
                sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: " center" }}>
                <Typography variant="h6" component="h6" sx={{ mb: 0, color: "rgb(128, 128, 128)", fontSize: "small" }}>
                  λ
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "50%", m: 1 }}
                    label="White"
                    defaultValue={los[county]["white"]}
                    inputRef={white}
                  />

                  <TextField
                    sx={{ width: "50%", m: 1 }}
                    label="African American"
                    defaultValue={los[county]["af"]}
                    inputRef={af}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >

                  <TextField
                    sx={{ width: "50%", m: 1 }}
                    label="Hispanic"
                    defaultValue={los[county]["hispanic"]}
                    inputRef={hispanic}
                  />

                  <TextField
                    sx={{ width: "50%", m: 1 }}
                    label="Other"
                    defaultValue={los[county]["other"]}
                    inputRef={other}
                  />

                </Box>
              </Box>
            )}



          </Box>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: "center" }}>
          <Button variant="contained" onClick={runSimulation} sx={{ textTransform: "none", fontSize: "large", backgroundColor: '#69b3a2', ':hover': { backgroundColor: 'green' } }}>Run Simulation</Button>
          <Button variant="contained" onClick={handleClose} sx={{ textTransform: "none", fontSize: "large", backgroundColor: '#69b3a2', ':hover': { backgroundColor: 'green' } }}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div >
  );
}

export default Param;