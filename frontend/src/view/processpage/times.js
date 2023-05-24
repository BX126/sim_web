import React, { useState, useEffect } from 'react';
import Typography from "@mui/material/Typography";

const Times = (maxtimes) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count => count + 1);
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, [maxtimes]);

  return (
    <div>
      {count <= maxtimes.max ? <Typography variant="h2" component="h2" sx={{ mt: 3, mb: 3, fontFamily: "Droid Sans", fontSize: "2.5rem" }}>
        Running Simulation {count}/{maxtimes.max} times
      </Typography> : <Typography variant="h2" component="h2" sx={{ mt: 3, mb: 3, fontFamily: "Droid Sans", fontSize: "2.5rem" }}>
        Plotting Results ...
      </Typography>}


    </div>
  );
}

export default Times;
