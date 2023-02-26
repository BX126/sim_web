import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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
  const getClassName = (n) => {
    var name = [];
    for (var i = 0; i < n; i++) {
      name.push("Class_" + (i + 1) + "_Theroetical");
      name.push("Class_" + (i + 1) + "_Simulation");
    }
    return name;
  };
  const reformatQ1 = (data) => {
    const n = data["n"];
    var q1 = [];
    for (var i = 0; i <= 40; i++) {
      var temp = {};
      for (var j = 0; j < n; j++) {
        temp["Class_" + (j + 1) + "_Theroetical"] = data["theory_1"][j][i];
        temp["Class_" + (j + 1) + "_Simulation"] =
          i < data["q1"][j].length ? data["q1"][j][i] : 0;
      }
      q1.push(temp);
    }
    return q1;
  };
  const reformatQ2 = (data) => {
    const n = data["n"];
    var q2 = [];
    for (var i = 0; i <= 60; i++) {
      var temp = {};
      for (var j = 0; j < n; j++) {
        temp["Class_" + (j + 1) + "_Theroetical"] = data["theory_2"][j][i];
        temp["Class_" + (j + 1) + "_Simulation"] =
          i < data["q2"][j].length ? data["q2"][j][i] : 0;
      }
      q2.push(temp);
    }
    return q2;
  };
  const reformatQboth = (data) => {
    const n = data["n"];
    var qboth = [];
    for (var i = 0; i <= 80; i++) {
      var temp = {};
      for (var j = 0; j < n; j++) {
        temp["Class_" + (j + 1) + "_Theroetical"] = data["theory_both"][j][i];
        temp["Class_" + (j + 1) + "_Simulation"] =
          i < data["qboth"][j].length ? data["qboth"][j][i] : 0;
      }
      qboth.push(temp);
    }
    return qboth;
  };

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
      <Typography
        variant="h3"
        component="h3"
        sx={{ mt: 3, mb: 3, fontFamily: "cursive" }}
      >
        Simulation Results
      </Typography>
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
            sx={{ mt: 3, mb: 3, fontFamily: "cursive", fontSize: "1.2rem" }}
          >
            Station 1
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart width={500} height={300} data={reformatQ1(data)}>
              <XAxis />
              <YAxis />
              <Tooltip />
              <Legend />
              {getClassName(data["n"]).map((element, index) => (
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
            sx={{ mt: 3, mb: 3, fontFamily: "cursive", fontSize: "1.2rem" }}
          >
            Station 2
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart width={500} height={300} data={reformatQ2(data)}>
              <XAxis />
              <YAxis />
              <Tooltip />
              <Legend />
              {getClassName(data["n"]).map((element, index) => (
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
          sx={{ mt: 3, mb: 3, fontFamily: "cursive", fontSize: "1.2rem" }}
        >
          Station Both
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart width={500} height={300} data={reformatQboth(data)}>
            <XAxis />
            <YAxis />
            <Tooltip />
            <Legend />
            {getClassName(data["n"]).map((element, index) => (
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
    </Box>
  );
};
