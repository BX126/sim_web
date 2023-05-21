import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ModelTwo = ({ open, setOpen }) => {

  const years = useRef(8);

  const navigate = useNavigate();
  const runSimulation = () => {
    const data = {
      years: years.current.value,
    };
    navigate("./process", { state: { data } });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="lg">
        <DialogTitle sx={{ fontFamily: "Droid Sans" }}>Transient Model Parameters</DialogTitle>
        <DialogContent>
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

            <Typography variant="p" component="p" sx={{ fontFamily: "Droid Sans" }}>
              Number of Years to Simulate
            </Typography>

            <TextField
              sx={{ width: "50%", m: 2 }}
              variant="filled"
              id="outlined-helperText"
              defaultValue={8}
              inputRef={years}
            />

          </Box>


        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={runSimulation} sx={{ textTransform: "none", fontSize: "large" }}>Run Simulation</Button>
          <Button variant="contained" onClick={handleClose} sx={{ textTransform: "none", fontSize: "large" }}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ModelTwo;