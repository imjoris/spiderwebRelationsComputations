// 1 d3.select("body")
//      .append("svg")
//      .attr("width", 50)
//      .attr("height", 50)
//      .append("circle")
//      .attr("cx", 25)
//      .attr("cy", 25)
//      .attr("r", 25)
//      .style("fill", "purple");



// var width = window.innerWidth - 320;
// var height = window.innerHeight - 52;
// var svg = d3.select("body")
//     .append("svg")
//     .attr("width", width)
//     .attr("height", height);
// var svg = d3.select("svg");


function setupSvg() {

    d3.json("json/graph", function(error, data) {
        createNetwork(data)
    });

}

// function onlyUnique(value, index, self) {
//     return self.indexOf(value) === index;
// }

function createNetwork(data) {
    var width = window.innerWidth - 320;
    var height = window.innerHeight - 52;
    var svgSelection = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    var svg = d3.select("svg");


    var edges = data.edges;
    var nodes = data.nodes;

    //create a network from an edgelist

    var colors = ["#996666", "#66CCCC", "#FFFF99", "#CC9999", "#666633", "#993300", "#999966", "#660000", "#996699", "#cc6633", "#ff9966", "#339999", "#6699cc", "#ffcc66", "#ff6600", "#00ccccc"]

    //This isn't "gravity" it's the visual centering of the network based on its mass
    var networkCenter = d3.forceCenter().x(width / 2).y(height / 2);

    //CHARGE
    var manyBody = d3.forceManyBody().strength(-150).distanceMax(100)

    //Specify module position for the three largest modules. This is the x-y center of the modules
    //singletons and small modules will be handled as a whole
    var modulePosition = {
        "2": {x: 0, y: 0},
        "3": {x: 200, y: 25},
        "1": {x: 0, y: 200}
    }

    //Make the x-position equal to the x-position specified in the module positioning object or, if not in
    //the hash, then set it to 250
    var forceX = d3.forceX(function (d) {return modulePosition[d.module] ? modulePosition[d.module].x : 250})
        .strength(0.05)

    //Same for forceY--these act as a gravity parameter so the different strength determines how closely
    //the individual nodes are pulled to the center of their module position
    var forceY = d3.forceY(function (d) {return modulePosition[d.module] ? modulePosition[d.module].y : 250})
        .strength(0.05)

    var simulation = d3.forceSimulation()
        .force("edge", d3.forceLink().id(function(d) { return d.source; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    // var path = svg.append("g")
    //     .attr("class", "edge")
    //     .selectAll("line")
    //     .data(edges)
    //     .enter().append("line")
    //     .style("stroke-width", function (d) {return d.border ? "3px" : "1px"})
        

  var edgeEnter = d3.select("svg.main").selectAll("g.edge")
  .data(edges)
  .enter()
  .append("g")
  .attr("class", "edge");

  edgeEnter
  .append("line")
  .style("stroke-width", function (d) {return d.border ? "3px" : "1px"})
  .style("stroke", "black")
  .style("pointer-events", "none");


  var nodeEnter = d3.select("svg.main").selectAll("g.node")
  .data(nodes, function (d) {return d.id})
  .enter()
  .append("g")
  .attr("class", "node")

  nodeEnter.append("circle")
  .attr("r", 8)
  .style("fill", function (d) {return colors[d.module]})
  .style("stroke", "black")
  .style("stroke-width", function (d) {return d.border ? "3px" : "1px"})

  nodeEnter.append("text")
  .style("text-anchor", "middle")
  .attr("y", 3)
  .style("stroke-width", "1px")
  .style("stroke-opacity", 0.75)
  .style("stroke", "white")
  .style("font-size", "8px")
  .text(function (d) {return d.id})
  .style("pointer-events", "none")

  nodeEnter.append("text")
  .style("text-anchor", "middle")
  .attr("y", 3)
  .style("font-size", "8px")
  .text(function (d) {return d.id})
  .style("pointer-events", "none")

        
        // svg.selectAll("g.edge")
        // .data(edges)
        // .enter()
        // .append("g")
        // .attr("class", "edge");

    // edgeEnter
        // .append("line")
        // .style("stroke-width", function (d) {return d.border ? "3px" : "1px"})
        // .style("stroke", "black")
        // .style("pointer-events", "none");

    // var nodeEnter = svg.append("g")
    //     .attr("class", "node")
    //     .selectAll("circle")
    //     .data(nodes)
    //     .enter().append("circle")
    //     .attr("r", 5)
    //     .attr("fill", function(d) { return colors[d.module]; })
    //     .call(d3.drag()
    //         .on("start", dragstarted)
    //             .on("drag", dragged)
    //             .on("end", dragended));



    // d3.select("svg").selectAll("g.node")
    // .data(nodes, function (d) {return d.id})
    // .enter()
    // .append("g")
    // .attr("class", "node")
    // .call(d3.drag()
    //     .on("start", dragstart)
    //         .on("drag", dragged)
    //         .on("end", dragend)
    // );

    nodeEnter.append("circle")
        .attr("r", 8)
        .style("fill", function (d) {return colors[d.module]})
        .style("stroke", "black")
        .style("stroke-width", function (d) {return d.border ? "3px" : "1px"})

    nodeEnter.append("text")
        .style("text-anchor", "middle")
        .attr("y", 3)
        .style("stroke-width", "1px")
        .style("stroke-opacity", 0.75)
        .style("stroke", "white")
        .style("font-size", "8px")
        .text(function (d) {return d.id})
        .style("pointer-events", "none")

    // nodeEnter.append("text")
    //     .style("text-anchor", "middle")
    //     .attr("y", 3)
    //     .style("font-size", "8px")
    //     .text(function (d) {return d.id})
    //     .style("pointer-events", "none")

    //  force.start();



    simulation
        .nodes(nodes)
        .on("tick", tick);

    simulation.force("edge")
        .links(edges);



    function tick() {
       edgeEnter 
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

       nodeEnter 
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        // edgeEnter
        //     .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }
            // .attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")"});

    // function updateNetwork(e) {
    //     // d3.select("svg.main").selectAll("line")
    //     d3.select("svg").selectAll("line")
    //         .attr("x1", function (d) {return d.source.x})
    //         .attr("y1", function (d) {return d.source.y})
    //         .attr("x2", function (d) {return d.target.x})
    //         .attr("y2", function (d) {return d.target.y});

    //     d3.select("svg").selectAll("g.node")
    //         .attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")"});

    // }


    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }


    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

}

