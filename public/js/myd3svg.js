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

    var width = window.innerWidth - 320;
    var height = window.innerHeight - 52;
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) {
            return d.id;
        }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    d3.json("json/miserables", function(error, graph) {
        if (error) throw error;

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function(d) {
                return Math.sqrt(d.value);
            });

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            // .attr("r", 5)
            .attr("fill", function(d) {
                return color(d.group);
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));


        node.append("text")
            .style("text-anchor", "middle")
            .attr("y", 3)
            .style("stroke-width", "1px")
            .style("stroke-opacity", 0.75)
            .style("stroke", "white")
            .style("font-size", "8px")
            .text(function (d) {return d.id})
            .style("pointer-events", "none")


        node.append("title")
            .text(function(d) {
                return d.id;
            });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
            link
                .attr("x1", function(d) {
                    return d.source.x;
                })
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) {
                    return d.target.y;
                });

            node
                .attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });
        }
    });

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
