import * as d3 from "https://esm.sh/d3";

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

document.addEventListener("DOMContentLoaded", function() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const dataset = data;
      const w = 1200;
      const h = 500;
      const padding = 60;

      const parseTime = d3.timeParse("%M:%S");
      const formatYear = d3.timeFormat("%Y");
      const formatTime = d3.timeFormat("%M:%S");

      const years = dataset.map(d => new Date(d.Year, 0, 1)); 
      const times = dataset.map(d => parseTime(d.Time)); 

      const xScale = d3.scaleTime()
        .domain([d3.min(years), d3.max(years)])
        .range([padding, w - padding]);

      const yScale = d3.scaleTime()
        .domain([d3.max(times), d3.min(times)])  
        .range([padding, h - padding]);

      const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => parseTime(d.Time).toISOString())  
        .attr("cx", d => xScale(new Date(d.Year, 0, 1)))
        .attr("cy", d => yScale(parseTime(d.Time)))
        .attr("r", 5)
        .attr("fill", d => d.Doping ? "orange" : "blue");

      const xAxis = d3.axisBottom(xScale)
        .tickFormat(d => formatYear(d))
        .tickSize(5);

      const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => formatTime(d))
        .tickSize(-w + 2 * padding);

      svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(xAxis);

      svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis);

      svg.append("text")
        .attr("class", "y-axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${padding / 4}, ${h / 2}) rotate (-90)`)
        .text("Time in Minutes and Seconds");

      svg.append("text")
        .attr("class", "x-axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${w / 2}, ${h - padding / 2 + 20})`)
        .text("Year");

      const legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${w - 250}, ${h - 40})`);

      legend.append("circle")
        .attr("cx", 10)
        .attr("cy", 10)
        .attr("r", 10)
        .style("fill", "blue");

      legend.append("circle")
        .attr("cx", 10)
        .attr("cy", 30)
        .attr("r", 10)
        .style("fill", "orange");

      legend.append("text")
        .attr("x", 30)
        .attr("y", 15)
        .text("No Doping Allegations");

      legend.append("text")
        .attr("x", 30)
        .attr("y", 35)
        .text("Doping Allegations Made");

      const tooltip = d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("opacity", 0)
        .style("pointer-events", "none")
        .style("background", "lightgray")
        .style("padding", "5px")
        .style("border-radius", "3px");

      svg.selectAll("circle")
        .on("mouseover", function(event, d) {
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.html(`${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}<br><br>${d.Doping}`)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px")
            .attr("data-year", d.Year)  
            .attr("data-time", d.Time); 
        })
        .on("mouseout", function() {
          tooltip.transition().duration(500).style("opacity", 0);
        });
    });
});
