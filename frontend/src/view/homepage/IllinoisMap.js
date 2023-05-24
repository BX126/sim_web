import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const IllinoisMap = ({ setCounty, setOpen }) => {
  const ref = useRef();
  const specialCounties = ["COOK", "DUPAGE", "PEORIA", "WILL"];

  useEffect(() => {
    const svg = d3.select(ref.current);
    var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("padding", "10px")
      .style("border", "1px solid #000")
      .style("border-radius", "5px")
      .style("pointer-events", "none");

    d3.json("/illinois-counties.geojson").then(data => {
      const projection = d3.geoMercator().fitSize([800, 600], data);
      const path = d3.geoPath().projection(projection);

      const counties = svg.selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", (d) => specialCounties.includes(d.properties.NAME) ? "#69b3a2" : "#dfe0e0")
        .attr("stroke", "#909493")
        .attr('stroke-width', '1')
        .on('click', (event, d) => {
          if (specialCounties.includes(d.properties.NAME)) {
            setCounty(d.properties.NAME);
            setOpen(true);
          }
        })
        .on('mouseover', function (event, d) {
          d3.select(this)
            .attr('fill', (d) => specialCounties.includes(d.properties.NAME) ? "#ade3d5" : "#dfe0e0")
            .attr("stroke", "#909493")
            .attr('stroke-width', (d) => specialCounties.includes(d.properties.NAME) ? "2" : '1');
          if (specialCounties.includes(d.properties.NAME)) {
            tooltip.transition()
              .duration(200)
              .style("opacity", .9);
            tooltip.html("County: " + d.properties.NAME)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 28) + "px");
          }
        })
        .on('mouseout', function (event, d) {
          d3.select(this).attr("fill", (d) => specialCounties.includes(d.properties.NAME) ? "#69b3a2" : "#dfe0e0")
            .attr("stroke", "#909493")
            .attr('stroke-width', '1')
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });

      counties.append("title")
        .text(d => d.properties.NAME);
    });
  }, []);

  return (
    <svg ref={ref} style={{ width: 850, height: 600 }}></svg>
  );
}

export default IllinoisMap;
