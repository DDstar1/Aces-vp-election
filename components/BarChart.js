"use client";

import { useEffect } from "react";
import * as d3 from "d3";

const BarChart = ({ data }) => {
  useEffect(() => {
    if (data.length === 0) return;

    // Define the aspect ratio for the chart (e.g., 16:9)
    const aspectRatio = 16 / 9;

    // Get the width of the container dynamically (full width of the screen)
    const width = document.getElementById("chart").clientWidth;

    // Calculate height based on the aspect ratio
    const height = width / aspectRatio;

    // Remove any existing SVG to redraw the chart
    d3.select("#chart").selectAll("*").remove();

    // Count the votes for Vice Presidents
    const voteCounts = d3.rollups(
      data,
      (v) => v.length,
      (d) => d["Choose your Vice President"]
    );

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X Scale (Candidates)
    const x = d3
      .scaleBand()
      .domain(voteCounts.map((d) => d[0]))
      .range([0, width - margin.left - margin.right])
      .padding(0.1);

    // Y Scale (Vote Counts)
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(voteCounts, (d) => d[1])])
      .nice()
      .range([height, 0]);

    // Append X Axis (truncate candidate names)
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .text((d) => (d.length > 15 ? d.substring(0, 15) + "..." : d)) // Truncate long names
      .attr("text-anchor", "middle")
      .attr("fill", "black"); // Adjust label color if necessary

    // Append Y Axis
    svg.append("g").call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll(".bar")
      .data(voteCounts)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d[0]))
      .attr("y", (d) => y(d[1]))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d[1]))
      .attr("fill", "steelblue");

    // Labels (show vote counts, truncate long numbers)
    svg
      .selectAll(".label")
      .data(voteCounts)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d[0]) + x.bandwidth() / 2)
      .attr("y", (d) => y(d[1]) - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white") // Set the label color to white
      .text((d) => {
        let text = d[1].toString(); // Convert vote count to string
        return text.length > 15 ? text.substring(0, 15) + "..." : text; // Truncate long numbers
      });

    // Handle window resize to keep the chart responsive
    const resize = () => {
      const newWidth = document.getElementById("chart").clientWidth;
      const newHeight = newWidth / aspectRatio;
      d3.select("svg")
        .attr("width", newWidth)
        .attr("height", newHeight + margin.top + margin.bottom);
      svg
        .attr("width", newWidth)
        .attr("height", newHeight + margin.top + margin.bottom);
      x.range([0, newWidth - margin.left - margin.right]);
      y.range([newHeight, 0]);
    };

    window.addEventListener("resize", resize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", resize);
  }, [data]);

  return (
    <div
      id="chart"
      className="mb-10 w-full flex items-center justify-center"
    ></div>
  );
};

export default BarChart;
