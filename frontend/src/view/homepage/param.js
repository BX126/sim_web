import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Box from "@mui/material/Box";
import Slider from '@mui/material/Slider';
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Param = ({ open, setOpen, county }) => {

  const [repeatTimes, setRepeatTimes] = useState(100);

  const handleChange = (event, newValue) => {
    setRepeatTimes(newValue);
  };

  const navigate = useNavigate();
  const runSimulation = () => {
    const data = {
      times: repeatTimes,
      county: county
    };
    navigate("./process", { state: { data } });
  };

  const handleClose = () => {
    setOpen(false);
    setRepeatTimes(100);
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
              height: 150,
              width: 350,
            }}
          >
            <Typography
              variant="h5"
              component="h5"
              sx={{ fontFamily: "Droid Sans", mb: 2 }}
            >
              Repeat Times
            </Typography>
            <Slider
              getAriaLabel={() => 'Value slider'}
              value={repeatTimes}
              onChange={handleChange}
              valueLabelDisplay="auto"
              getAriaValueText={(value) => `${value}`}
              min={100}
              max={3000}
              marks={[
                {
                  value: 100,
                  label: '100',
                },
                {
                  value: 3000,
                  label: '3000',
                },
              ]}
              sx={{
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

          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={runSimulation} sx={{ textTransform: "none", fontSize: "large" }}>Run Simulation</Button>
          <Button variant="contained" onClick={handleClose} sx={{ textTransform: "none", fontSize: "large" }}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div >
  );
}

export default Param;