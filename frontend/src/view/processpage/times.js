import React, { useState, useEffect } from 'react';
import Typography from "@mui/material/Typography";

const Times = ({maxtimes, county, traced}) => {
  const [count, setCount] = useState(0);
  var stop = 220;
  if ( county === "DUPAGE") {
    stop = 90;
  }
  if (traced) {
    stop = 55;
  }
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count => count + 1);
    }, stop);

    return () => {
      clearInterval(timer);
    };
  }, [maxtimes]);

  return (
    <div>
      {count <= maxtimes ? <Typography variant="h2" component="h2" sx={{ mt: 3, mb: 3, fontFamily: "Droid Sans", fontSize: "2.5rem" }}>
        Running Simulation {count}/{maxtimes} times
      </Typography> : <Typography variant="h2" component="h2" sx={{ mt: 3, mb: 3, fontFamily: "Droid Sans", fontSize: "2.5rem" }}>
        Plotting Results ...
      </Typography>}


    </div>
  );
}

export default Times;
