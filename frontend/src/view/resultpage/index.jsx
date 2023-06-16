import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation } from "react-router-dom";
import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from "recharts";

export const ResultPage = () => {
  const location = useLocation();
  var data = location.state.data;
  console.log(data);
  // var color = [
  //   "#8884d8",
  //   "#82ca9d",
  //   "#ffc658",
  //   "#6699ff",
  //   "#ff5050",
  //   "#666699",
  //   "#999966",
  //   "#663300",
  // ];
  var color = [
    "#6699ff",
    "#82ca9d",
    "#6699ff",
    "#82ca9d",
    "#6699ff",
    "#82ca9d",
    "#6699ff",
    "#82ca9d",
  ];

  const startdates = {
    COOK: "2015-04-01",
    DUPAGE: "2012-01-01",
    WILL: "2014-11-01",
    PEORIA: "2013-09-01",
  };

  function reformatDataForLineChart_white(data) {
    const reformattedData = [];
    const White_Simulation = data.white_sim;
    const White_Real = data.white_real;
    const White_upper = data.white_upper;
    const White_lower = data.white_lower;
    let date = new Date(startdates[data.name]);

    for (let i = 0; i < White_Simulation.length; i++) {
      const whiteReal = White_Simulation[i];
      const whiteSim = White_Real[i];

      reformattedData.push({
        date: date.toISOString().slice(0, 10),
        White_Simulation: whiteReal,
        White_Real: whiteSim,
        White_PI: [White_lower[i], White_upper[i]],
      });

      date.setDate(date.getDate() + 7);
    }
    return reformattedData;
  }

  function reformatDataForLineChart_african(data) {
    const reformattedData = [];
    const African_Simulation = data.african_sim;
    const African_Real = data.african_real;
    const African_upper = data.african_upper;
    const African_lower = data.african_lower;
    let date = new Date(startdates[data.name]);

    for (let i = 0; i < African_Simulation.length; i++) {
      const ls1 = African_Simulation[i];
      const ls2 = African_Real[i];

      reformattedData.push({
        date: date.toISOString().slice(0, 10),
        African_Simulation: ls1,
        African_Real: ls2,
        African_PI: [African_lower[i], African_upper[i]],
      });

      date.setDate(date.getDate() + 7);
    }
    return reformattedData;
  }

  function reformatDataForLineChart_hispanic(data) {
    const reformattedData = [];
    const Hispanic_Simulation = data.hispanic_sim;
    const Hispanic_Real = data.hispanic_real;
    const Hispanic_upper = data.hispanic_upper;
    const Hispanic_lower = data.hispanic_lower;
    let date = new Date(startdates[data.name]);

    for (let i = 0; i < Hispanic_Simulation.length; i++) {
      const ls1 = Hispanic_Simulation[i];
      const ls2 = Hispanic_Real[i];

      reformattedData.push({
        date: date.toISOString().slice(0, 10),
        Hispanic_Simulation: ls1,
        Hispanic_Real: ls2,
        Hispanic_PI: [Hispanic_lower[i], Hispanic_upper[i]],
      });

      date.setDate(date.getDate() + 7);
    }
    return reformattedData;
  }

  function reformatDataForLineChart_other(data) {
    const reformattedData = [];
    const Other_Simulation = data.other_sim;
    const Other_Real = data.other_real;
    const Other_upper = data.other_upper;
    const Other_lower = data.other_lower;
    let date = new Date(startdates[data.name]);

    for (let i = 0; i < Other_Simulation.length; i++) {
      const ls1 = Other_Simulation[i];
      const ls2 = Other_Real[i];

      reformattedData.push({
        date: date.toISOString().slice(0, 10),
        Other_Simulation: ls1,
        Other_Real: ls2,
        Other_PI: [Other_lower[i], Other_upper[i]],
      });

      date.setDate(date.getDate() + 7);
    }
    return reformattedData;
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <ArrowBackIcon
          sx={{ ml: 3, fontSize: "2rem" }}
          onClick={() => (window.location.href = "/")}
        />

        <Typography
          variant="h2"
          component="h2"
          sx={{ mt: 3, mb: 0.5, fontFamily: "Droid Sans", fontSize: "2rem" }}
        >
          {data.name} County
        </Typography>

        <Box />
      </Box>

      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "50%",
            height: "100%",
            p: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h2"
            component="h2"
            sx={{ mt: 3, mb: 3, fontFamily: "Droid Sans", fontSize: "1.2rem" }}
          >
            White
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              width={500}
              height={300}
              data={reformatDataForLineChart_white(data)}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {["White_Simulation", "White_Real"].map((element, index) => (
                <Area
                  type="monotone"
                  fillOpacity={0}
                  dataKey={element}
                  stroke={color[index]}
                  strokeWidth={1.8}
                  name={element.split("_")[1]}
                />
              ))}
              <Area
                dataKey="White_PI"
                fillOpacity={0.25}
                stroke="lightgrey"
                fill="grey"
                name="Prediction Interval"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Box
          sx={{
            width: "50%",
            height: "100%",
            p: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h2"
            component="h2"
            sx={{ mt: 3, mb: 3, fontFamily: "Droid Sans", fontSize: "1.2rem" }}
          >
            African American
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              width={500}
              height={300}
              data={reformatDataForLineChart_african(data)}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {["African_Simulation", "African_Real"].map((element, index) => (
                <Area
                  type="monotone"
                  dot={false}
                  dataKey={element}
                  fillOpacity={0}
                  stroke={color[index + 2]}
                  strokeWidth={1.8}
                  name={element.split("_")[1]}
                />
              ))}
              <Area
                dataKey="African_PI"
                fillOpacity={0.25}
                stroke="lightgrey"
                fill="grey"
                name="Prediction Interval"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "50%",
            height: "100%",
            p: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h2"
            component="h2"
            sx={{ mt: 3, mb: 3, fontFamily: "Droid Sans", fontSize: "1.2rem" }}
          >
            Hispanic
          </Typography>

          {data.name === "PEORIA" ? (
            <Box
              sx={{
                width: "100%",
                height: 300,
                display: "flex",
                justifyContent: "center",
                alignItems: " center",
              }}
            >
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  mt: 3,
                  mb: 3,
                  fontFamily: "Droid Sans",
                  fontSize: "1.2rem",
                }}
              >
                Races with census data below 10 are not displayed.
              </Typography>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                width={500}
                height={300}
                data={reformatDataForLineChart_hispanic(data)}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {["Hispanic_Simulation", "Hispanic_Real"].map(
                  (element, index) => (
                    <Area
                      type="monotone"
                      dataKey={element}
                      fillOpacity={0}
                      stroke={color[index + 4]}
                      strokeWidth={1.8}
                      name={element.split("_")[1]}
                    />
                  )
                )}
                <Area
                  dataKey="Hispanic_PI"
                  fillOpacity={0.25}
                  stroke="lightgrey"
                  fill="grey"
                  name="Prediction Interval"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Box>

        <Box
          sx={{
            width: "50%",
            height: "100%",
            p: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h2"
            component="h2"
            sx={{ mt: 3, mb: 3, fontFamily: "Droid Sans", fontSize: "1.2rem" }}
          >
            All Races
          </Typography>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              width={500}
              height={300}
              data={reformatDataForLineChart_other(data)}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {["Other_Simulation", "Other_Real"].map((element, index) => (
                <Area
                  type="monotone"
                  dot={false}
                  dataKey={element}
                  fillOpacity={0}
                  stroke={color[index + 5]}
                  strokeWidth={1.8}
                  name={element.split("_")[1]}
                />
              ))}
              <Area
                dataKey="Other_PI"
                fillOpacity={0.25}
                stroke="lightgrey"
                fill="grey"
                name="Prediction Interval"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};
