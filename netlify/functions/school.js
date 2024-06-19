import * as d3 from "d3";
import jsdom from "jsdom";

const { JSDOM } = jsdom;
const { document } = (new JSDOM('')).window;
global.document = document;

export const handler = async (event, context) => {
    try {
        let data = await d3.json("https://visualizacion-cliente-servidor.netlify.app/school.json")
        
        let nodos = data.nodes; // -> {key : num, attributes : {label : size, color : ######, 0 : #+letra, 1 : letra}}
        let links = data.edges; // -> {key : num, source : nodeKey1, target : nodeKey2} (nodeKey1 y 2 pueden ser iguales)
        let options = data.options; // -> {multi : false, allowSelfloops : true, type : undirected}  (allowSelfloops toma 
                                //en cuenta si el source y el target son iguales)
        return {
           statusCode: 200,
           headers: {
             'Content-type': 'text/html; charset=UTF-8',
           },
           body: JSON.stringify({ nodos : nodos
            , links : links
            , options : options})
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