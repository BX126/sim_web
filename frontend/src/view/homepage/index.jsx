import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useState } from "react";
import ModelOne from "./model1";
import ModelTwo from "./model2";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export const HomePage = () => {
  const [open_1, setOpen_1] = useState(false);
  const [open_2, setOpen_2] = useState(false);

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
        sx={{ mt: 5, mb: 6, fontFamily: "Droid Sans" }}
      >
        Simulation
      </Typography>
      
      <Typography
          variant="h4"
          component="h4"
          sx={{ fontFamily: "Droid Sans" }}
        >
          Stationary Model
        </Typography>

      <img
        src={"flowchart1.png"}
        alt={"Stationary Model"}
        height="auto"
        width="50%"
        loading="lazy"
      />

      <Button
        variant="outlined"
        onClick={() => setOpen_1(true)}
        sx={{
          mb: 18,
          color: "black",
          textTransform: "none",
          ":hover": {
            bgcolor: "black",
            color: "white",
            borderColor: "white",
          },
          borderColor: "lightgrey",
        }}
        endIcon={<ArrowForwardIcon />}
      >
        <Typography
          variant="h6"
          component="h6"
          sx={{ fontFamily: "Droid Sans" }}
        >
          Run Stationary Model
        </Typography>
      </Button>

      <ModelOne open={open_1} setOpen={setOpen_1} />
      <ModelTwo open={open_2} setOpen={setOpen_2} />

      <Typography
          variant="h4"
          component="h4"
          sx={{ fontFamily: "Droid Sans" }}
        >
          Transient Model
        </Typography>

      <img
        src={"flowchart2.png"}
        alt={"Stationary Model"}
        height="auto"
        width="40%"
        loading="lazy"
      />

      <Button
        variant="outlined"
        onClick={() => setOpen_2(true)}
        sx={{
          mt:2,
          color: "black",
          textTransform: "none",
          ":hover": {
            bgcolor: "black",
            color: "white",
            borderColor: "white",
          },
          borderColor: "lightgrey",
        }}
        endIcon={<ArrowForwardIcon/>}
      >
        <Typography
          variant="h6"
          component="h6"
          sx={{ fontFamily: "Droid Sans" }}
        >
          Run Transient Model
        </Typography>
      </Button>
    </Box>
  );
};
