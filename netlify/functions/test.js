import * as d3 from "d3";
import jsdom from "jsdom";

const { JSDOM } = jsdom;
const { document } = (new JSDOM('')).window;
global.document = document;


const nodes = [
    {"id": "Alice"},
    {"id": "Bob"},
    {"id": "Carol"}
  ];
  
const links = [
    {"source": 0, "target": 1}, // Alice → Bob
    {"source": 1, "target": 2} // Bob → Carol
  ];

export const handler = async (event, context) => {
    try {

        let data = await d3.json("http://localhost:8888/school.json")

        let width = 2240;
        let height = 1080;
        
    //    console.log(data)
    
        //const nodesTest = data.nodes.map(d => ({...d})); Copia profunda
        
        const nodesTest = data.nodes; //Copia superficial
    
        const linkTest = data.edges
        
       // console.log(nodesTest, linkTest)

        const simulation = d3.forceSimulation(nodesTest)  
            .force("charge", d3.forceManyBody().strength(0))
            .force("link", d3.forceLink(linkTest).id(d => d.key).strength(0.1).distance(height/2).iterations(5))
            .force('center', d3.forceCenter())
            // .force("y", d3.forceY());

        const container = d3.select(document).select("body");

        const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto;");
        
        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll('.link')
            .data(linkTest)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", d => {
                if (d.source === d.target) {
                // Crea una curva para el bucle
                return `M${d.source.x},${d.source.y}A${d.source.attributes.size},${d.source.attributes.size} 0 1,1 ${d.target.x},${d.target.y}`;
                } else {
                // Crea una línea recta para aristas normales
                return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
                }
            });
            //.attr("stroke-width", d => d.attributes.weight);

        const node = svg.append("g")
        .attr("stroke", "#7fba00")
        .attr("stroke-width", 1)
        .selectAll('circle')
        .data(nodesTest)
        .join("circle")
        .attr('r', 4)
        .attr('fill', d => d.attributes.color);
        
        node.append("title")
        .text(d => d.attributes.label);
    //   const lineGenerator = d3.line();
        
        node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

        simulation.on('tick', () => {
        link
            .attr("d", d => {
                if (d.source === d.target) {
                return `M${d.source.x},${d.source.y}A${d.source.attributes.size},${d.source.attributes.size} 0 1,1 ${d.target.x},${d.target.y}`;
                } else {
                return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
                }
            });

            node.attr('cx', d => d.x)
                .attr('cy', d => d.y);
        });


        // invalidation.then(() => simulation.stop());
    

        function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;}

        function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;}

        function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
        console.log(container.node().innerHTML)
        return {
           statusCode: 200,
           headers: {
             'Content-type': 'text/html; charset=UTF-8',
           },
           body: container.node().innerHTML
         };
       } catch (error) {
         return {
           statusCode: 500,
           body: JSON.stringify({
             errorDonde: "error de school",
             error: error.message
           }),
         };
       }
  }