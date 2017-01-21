function renderBars(data) {
  var svg = d3.select("#bar-svg");
  var margin = { top: 30, right: 30, bottom: 140, left: 40 },
    width = $("#bar-svg").width() - margin.left - margin.right,
    height = $("#bar-svg").height() - margin.top - margin.bottom;

  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(data.map(function(d) { return d.website; }));
  y.domain([0, d3.max(data, function(d) { return d.val; })]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "rotate(-90) translate(-10,-12)")
        .style("text-anchor", "end");;

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.website); })
      .attr("y", function(d) { return y(d.val); })
      .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.val); });
}