function renderMain(data) {
  console.log(data);
  var width;
  var height;
  var margin = { top: 20, right: 20, bottom: 30, left: 50 };

  var svg = d3.select("#main-line");
  width = $("#main-line").width() - margin.left - margin.right;
  height = $("#main-line").height() - margin.top - margin.bottom;
  var g = svg.append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  var x = d3.scaleTime()
    .rangeRound([0, width]);

  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  var line = d3.line()
    .curve(d3.curveBundle.beta(0.7))
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.val); });

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.val; }));

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .style("text-anchor", "end")
      .text("Price ($)");

  g.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
}
