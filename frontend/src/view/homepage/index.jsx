import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IllinoisMap from "./IllinoisMap";
import Param from "./param";

export const HomePage = () => {
  const [county, setCounty] = useState("COOK");
  const [open, setOpen] = useState(false);

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
        sx={{ mt: 5, fontFamily: "Droid Sans" }}
      >
        Simulation
      </Typography>

      <Typography
        variant="h5"
        component="h5"
        sx={{ mt: 1, mb: 0, fontFamily: "Droid Sans" }}
      >
        Click on a county to run the simulation
      </Typography>

      <Typography
        variant="h5"
        component="h5"
        sx={{ mb: 6, fontFamily: "Droid Sans" }}
      >
        <i>*NOTE*</i>: Only counties with the
        <span style={{ color: "#69b3a2", fontWeight: "bold" }}> green </span>
        color are available for simulation
      </Typography>

      <IllinoisMap setCounty={setCounty} setOpen={setOpen}/>

      <Typography
        variant="h6"
        component="h6"
        sx={{ mt: 1, mb: 0, fontFamily: "Droid Sans", color: "grey" }}
      >
        <i>Illinois State Counties</i>
      </Typography>

      <Param open={open} setOpen={setOpen} county={county} />
    </Box>
  );
};
