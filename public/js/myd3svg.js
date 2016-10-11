// // var width = window.innerWidth - 320;
// // var height = window.innerHeight - 52;
// // var svg = d3.select("body")
// //     .append("svg")
// //     .attr("width", width)
// //     .attr("height", height);
// // var svg = d3.select("svg");

// var graph = new Object();
// var error = new Object();

// var width = window.innerWidth - 320;
// var height = window.innerHeight - 52;

// // var zoom = d3.behavior.zoom()
// var zoom = d3.zoom()
//     .scaleExtent([1, 10])
//     .on("zoom", zoomed);

// var margin = {
//     top: -5,
//     right: -5,
//     bottom: -5,
//     left: -5
// };
// var svg = d3.select("body")
//     .append("svg")
//     .attr("width", width)
//     .attr("height", height)
//     // .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
//     .on("click", svgMouseUp)
//     .call(zoom);



// var container = svg.append("g");
// var color = d3.scaleOrdinal(d3.schemeCategory20);

// var simulation = d3.forceSimulation()
//     .force("link", d3.forceLink().id(function(d) {
//         return d.id;
//     }))
//     .force("charge", d3.forceManyBody())
//     .force("center", d3.forceCenter(width / 2, height / 2));


// //##################################################
// //# Draw the graph
// //##################################################
// var refreshGraph = function () {
//     var links = simulation.force("link").links();
//     var nodes = simulation.nodes();
    
//     // var links = graph.links;
//     // var nodes = graph.links;
//     // simulation.force("link").links(links);
//     // simulation.nodes(nodes);

//     var link = container.selectAll(".link")
//         // .data(graph.links)
//         // .attr("class", "link")
//         // .style("stroke-width", function(d) {
//         //     return Math.sqrt(d.value);
//         // })
//         // .data(links, function(d){return d.source + d.target})
//         .data(links);

//     link.enter().append("line")
//         .attr("class", "link")
//         .style("stroke-width", function(d) {
//             return Math.sqrt(d.value);
//         });

//     gnodes = container.selectAll('.node')
//         // .data(graph.nodes)
//         // .data(nodes, function(d){return d.id})
//         .data(nodes);
//         // .attr("class", "node")
//         // .call(d3.drag()
//         //     .on("start", dragstarted)
//         //         .on("drag", dragged)
//         //         .on("end", dragended));

//     // gnodes.select("circle")
//         // .attr("r", 5)
//         // .style("fill", function(d) {
//         //     return color(d.group);
//         // });

//     // gnodes.select(".nodeLabel")
//     //     .attr("class", "nodeLabel")
//     //     .attr("x", 7)
//     //     .attr("dy", ".35em")
//     //     .text(function(d) {
//     //         return d.id;
//     //     });

//     var newNodes = gnodes.enter()
//         .append('g')
//         .attr("class", "node")
//         .call(d3.drag()
//             .on("start", dragstarted)
//                 .on("drag", dragged)
//                 .on("end", dragended));

//     var node = newNodes.append("circle")
//         .attr("r", 5)
//         .style("fill", function(d) {
//             return color(d.group);
//         });


//     var labels = newNodes.append("svg:text")
//         .attr("class", "nodeLabel")
//         .attr("x", 7)
//         .attr("dy", ".35em")
//         .text(function(d) {
//             return d.id;
//         });


//     //     .attr("class", "nodeLabel")
//     //     .attr("x", 7)
//     //     .attr("dy", ".35em")
//     //     .text(function(d) {

//     //         // if (! $('#fixOnDragBox').is(":checked")){
//     //         return d.id;
//     //         // } else {
//     //         //     return "";
//     //         // }
//     //     });
//     // labels.exit().remove();

//     // simulation.nodes();
//     // simulation.force("link").links(graph.links);
//     // d3.forceLink().links(graph.links);

//     simulation
//         .on("tick", ticked);

//     // simulation.tick();
//     // simulation.alpha(0);
//     // simulation.alphaTarget(0.3).restart();
//     // simulation.force.start();
//     function ticked() {
//         link
//             .attr("x1", function(d) {
//                 return d.source.x;
//             })
//             .attr("y1", function(d) {
//                 return d.source.y;
//             })
//             .attr("x2", function(d) {
//                 return d.target.x;
//             })
//             .attr("y2", function(d) {
//                 return d.target.y;
//             });

//         gnodes.attr("transform", function(d) {
//             return 'translate(' + [d.x, d.y] + ')';
//         });
//     }
// };


// function zoomed() {
//     container.attr("transform", d3.event.transform);
// }

// function dragstarted(d) {
//     if (!d3.event.active) simulation.alphaTarget(0.3).restart();
//     d.fx = d.x;
//     d.fy = d.y;
// }

// function dragged(d) {
//     d.fx = d3.event.x;
//     d.fy = d3.event.y;
// }

// function dragended(d) {
//     if (! $('#fixOnDragBox').is(":checked")){
//         if (!d3.event.active) simulation.alphaTarget(0);
//         d.fx = null;
//         d.fy = null;
//     }
// }

// function hideLabels(){
//     container.selectAll(".nodeLabel")
//         .style("opacity", function () { return $('#hideLabelsBox').is(":checked") ? 0 : 1});
// }

// function svgMouseUp(d){

//     // d3.event.stopPropagation();
//     coordinates = [0, 0];
//     coordinates = d3.mouse(this);
//     newNode = {
//         "id": "New Node",
//         "group": 3,
//         "x" : coordinates[0],
//         "y" : coordinates[1],
//         "fx" : coordinates[0],
//         "fy" : coordinates[1]
//     };
//     graph.nodes.push(newNode);
//     simulation.nodes(graph.nodes);
//     refreshGraph();
//     // graph.nodes.push(newNode);
//     // simulation.nodes().push(newNode);
//     // simulation.nodes(simulation.nodes().push(newNode));
// }

var myGraph = new MyGraph(".main");
// myGraph.initializeGraph();
$.getJSON("json/miserables").then(function (response) {
    // graph = response;
    // alert(JSON.stringify(graph));
    myGraph.setGraph(response);
    // d3.forceLink().links(graph.links);
    // simulation.nodes().push(graph.nodes);
    // simulation.force("link").links().push(graph.links);
    // simulation.nodes(response.nodes);
    // simulation.force("link").links(response.links);
    // refreshGraph();
});

