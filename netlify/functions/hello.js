import * as d3 from "d3";
import jsdom from "jsdom";

const { JSDOM } = jsdom;
const { document } = (new JSDOM('')).window;
global.document = document;

export const handler = async (event, context) => {
    try {
        let data = await d3.json("http://localhost:8888/school.json")
        
        let body = document.getElementsByName("body");

        data = d3.hierarchy(data);
        console.log(data.data.nodes);

        const simulation = d3.forceSimulation(data.nodes)
   .force('charge', d3.forceManyBody().strength(-100))
   .force('link', d3.forceLink(data.edge.source).id(d => d.edge.target) //data.link ... d.id
         .distance(50))
    .force('center', d3.forceCenter(300, 300))
  
    const svg = d3.create("svg").attr("viewBox", [0, 0
                        , 600, 600]);
  
   const node = svg.selectAll('circle')
     .data(data.nodes)
     .enter()
     .append('circle')
     .attr('r', 25)
     .attr('fill', 'blue');
  
   const link = svg
     .selectAll('path.link')
     .data(data.edge.source)
     .enter()
     .append('path')
     .attr('stroke', 'black')
     .attr('fill', 'none');
  
  const lineGenerator = d3.line();
   
   simulation.on('tick', () => {
                 node.attr('cx', d => d.x);
                 node.attr('cy', d => d.y);
                 link.attr('d', d => lineGenerator([
                   [d.edge.source.x, d.edge.source.y], 
                   [d.edge.target.x, d.edge.target.y]]) 
                 )
   });
        //
             return {
           statusCode: 200,
           headers: {
             'Content-type': 'text/html; charset=UTF-8',
           },
           body: svg.node().innerHTML
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