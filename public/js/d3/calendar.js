function renderCalendar(data) {
  var width;
  var height;
  var margin = { top: 20, right: 20, bottom: 30, left: 50 };
  var cellSize = 17; // cell size

  // var percent = d3.format(".1%");
  var format = d3.timeFormat("%Y-%m-%d");

  var color = d3.scaleQuantize()
    .domain([1, 10])
    .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

  width = $("#calendar").width() - margin.left - margin.right;
  height = $("#calendar").height() - margin.top - margin.bottom;
  calheight = 166;
  var svg = d3.select("#calendar").selectAll("svg")
    .data(d3.range(2017, 2019))
    .enter().append("svg")
    .attr("width", width)
    .attr("height", calheight)
    .attr("class", "RdYlGn")
    .append("g")
    //.attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");
    .attr("transform", "translate(" + 120 + "," + 30 + ")");

  svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return d - 1; });

  var rect = svg.selectAll(".day")
      .data(function(d) { return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
    .enter().append("rect")
      .attr("class", "day")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d), d) * cellSize; })
      .attr("y", function(d) { return d.getDay() * cellSize; })
      .datum(format);

  rect.append("title")
      .text(function(d) { return d; });

  svg.selectAll(".month")
      .data(function(d) { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
    .enter().append("path")
      .attr("class", "month")
      .attr("d", monthPath);

  var nestd = d3.nest()
    .key(function(d) { return d.date.toString().substring(0,10); })
    .rollup(function(d) { return d[0].count; })
    .map(data);

  rect.filter(function(d) { return nestd.has(d); })
      .attr("class", function(d) { return "day " + color(nestd.get(d)); })
    .select("title")
      .text(function(d) { return d + ": " + nestd.get(d); });

  // console.log(nestd);

  function monthPath(t0) {
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0), t0)
        d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
    return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
        + "H" + w0 * cellSize + "V" + 7 * cellSize
        + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
        + "H" + (w1 + 1) * cellSize + "V" + 0
        + "H" + (w0 + 1) * cellSize + "Z";
  }
}
