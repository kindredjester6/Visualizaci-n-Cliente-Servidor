// graph.js

d3.json('data.json').then(data => {
  const width = 800;
  const height = 600;

  const zoom = d3.zoom()
    .scaleExtent([0.1, 10])
    .on('zoom', function(event) {
      svg.attr('transform', event.transform);
    });

  const svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .call(zoom)
    .append('g');

  const simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const link = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(data.links)
    .enter().append('line')
    .attr('class', 'link');

  const node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(data.nodes)
    .enter().append('circle')
    .attr('class', 'node')
    .attr('r', 10)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))
    .on('click', (event, d) => {
      zoomToNode(d);
    });

  const labels = svg.append('g')
    .attr('class', 'labels')
    .selectAll('text')
    .data(data.nodes)
    .enter().append('text')
    .attr('class', 'label')
    .attr('dy', -15)
    .text(d => d.label)
    .on('click', (event, d) => {
      zoomToNode(d);
    });

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    labels
      .attr('x', d => d.x)
      .attr('y', d => d.y);
  });

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

  function zoomToNode(d) {
    const scale = 2;  // Zoom scale factor
    const translate = [width / 2 - d.x * scale, height / 2 - d.y * scale];

    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
  }
});
