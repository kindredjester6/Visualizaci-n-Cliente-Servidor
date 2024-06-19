const svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(d => d.key))
  .force("charge", d3.forceManyBody().strength(-200))
  .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("eurosis.json").then(graph => {

  const zoom = d3.zoom()
    .scaleExtent([1 / 2, 8])
    .on("zoom", zoomed);

  const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.edges)
    .enter().append("line")
    .attr("class", "link")
    .attr("stroke-width", d => Math.sqrt(d.attributes.weight));

  const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", d => Math.sqrt(d.attributes.size))  // Adjust size scaling as needed
    .attr("fill", d => d.attributes.color)
    .on("mouseover", (event, d) => {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html(`Label: ${d.attributes.label}<br>
                    Country: ${d.attributes[1]}<br>
                    Category: ${d.attributes[2]}`)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  svg.call(zoom);

  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.edges);

  function ticked() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }

  function zoomed(event) {
    svg.attr("transform", event.transform);
  }

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
});
