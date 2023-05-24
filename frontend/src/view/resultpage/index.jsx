import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const ResultPage = () => {
  const location = useLocation();
  var data = location.state.data;
  console.log(data.white_real);
  var color = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#6699ff",
    "#ff5050",
    "#666699",
    "#999966",
    "#663300",
  ];

  function reformatDataForLineChart_white(data) {
    const reformattedData = [];
    const White_Simulation = data.white_sim;
    const White_Real = data.white_real;

    for (let i = 0; i < White_Simulation.length; i++) {
      const whiteReal = White_Simulation[i];
      const whiteSim = White_Real[i];

      reformattedData.push({
        White_Simulation: whiteReal,
        White_Real: whiteSim,
      });
    }
    return reformattedData;
  }

  function reformatDataForLineChart_african(data) {
    const reformattedData = [];
    const African_Simulation = data.african_sim;
    const African_Real = data.african_real;

    for (let i = 0; i < African_Simulation.length; i++) {
      const ls1 = African_Simulation[i];
      const ls2 = African_Real[i];

      reformattedData.push({
        African_Simulation: ls1,
        African_Real: ls2,
      });
    }
    return reformattedData;
  }

  function reformatDataForLineChart_hispanic(data) {
    const reformattedData = [];
    const Hispanic_Simulation = data.hispanic_sim;
    const Hispanic_Real = data.hispanic_real;

    for (let i = 0; i < Hispanic_Simulation.length; i++) {
      const ls1 = Hispanic_Simulation[i];
      const ls2 = Hispanic_Real[i];

      reformattedData.push({
        Hispanic_Simulation: ls1,
        Hispanic_Real: ls2,
      });
    }
    return reformattedData;
  }

  function reformatDataForLineChart_other(data) {
    const reformattedData = [];
    const Other_Simulation = data.other_sim;
    const Other_Real = data.other_real;

    for (let i = 0; i < Other_Simulation.length; i++) {
      const ls1 = Other_Simulation[i];
      const ls2 = Other_Real[i];

      reformattedData.push({
        Other_Simulation: ls1,
        Other_Real: ls2,
      });
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
            variant="h3"
            component="h3"
            sx={{ mt: 3, mb: 3, fontFamily: "Droid Sans", fontSize: "1.2rem" }}
          >
            White
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={500}
              height={300}
              data={reformatDataForLineChart_white(data)}
            >
              <XAxis />
              <YAxis />
              <Tooltip />
              <Legend />
              {["White_Simulation", "White_Real"].map((element, index) => (
                <Line
                  type="monotone"
                  dot={false}
                  dataKey={element}
                  stroke={color[index]}
                />
              ))}
            </LineChart>
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
            variant="h3"
            component="h3"
            sx={{ mt: 3, mb: 3, fontFamily: "Droid Sans", fontSize: "1.2rem" }}
          >
            African American
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={500}
              height={300}
              data={reformatDataForLineChart_african(data)}
            >
              <XAxis />
              <YAxis />
              <Tooltip />
              <Legend />
              {["African_Simulation", "African_Real"].map((element, index) => (
                <Line
                  type="monotone"
                  dot={false}
                  dataKey={element}
                  stroke={color[index + 2]}
                />
              ))}
            </LineChart>
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
            variant="h3"
            component="h3"
            sx={{ mt: 3, mb: 3, fontFamily: "Droid Sans", fontSize: "1.2rem" }}
          >
            Hispanic
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={500}
              height={300}
              data={reformatDataForLineChart_hispanic(data)}
            >
              <XAxis />
              <YAxis />
              <Tooltip />
              <Legend />
              {["Hispanic_Simulation", "Hispanic_Real"].map(
                (element, index) => (
                  <Line
                    type="monotone"
                    dot={false}
                    dataKey={element}
                    stroke={color[index + 4]}
                  />
                )
              )}
            </LineChart>
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
            variant="h3"
            component="h3"
            sx={{ mt: 3, mb: 3, fontFamily: "Droid Sans", fontSize: "1.2rem" }}
          >
            Other
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={500}
              height={300}
              data={reformatDataForLineChart_other(data)}
            >
              <XAxis />
              <YAxis />
              <Tooltip />
              <Legend />
              {["Other_Simulation", "Other_Real"].map((element, index) => (
                <Line
                  type="monotone"
                  dot={false}
                  dataKey={element}
                  stroke={color[index + 5]}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};
