// var width = window.innerWidth - 320;
// var height = window.innerHeight - 52;
// var svg = d3.select("body")
//     .append("svg")
//     .attr("width", width)
//     .attr("height", height);
// var svg = d3.select("svg");

var mygraph = new Object();
var error = new Object();

// $.getJSON("json/miserables", function(result){
//     graph=JSON.stringify(result);
//     alert(JSON.stringify(result));

// });

var width = window.innerWidth - 320;
var height = window.innerHeight - 52;

// var zoom = d3.behavior.zoom()
var zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

var margin = {
    top: -5,
    right: -5,
    bottom: -5,
    left: -5
};
var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
    .call(zoom);

var container = svg.append("g");
var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {
        return d.id;
    }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

//##################################################
//# Draw the graph
//##################################################
// d3.json("json/miserables", function(error, graph) {
d3.json("json/miserables", function(error, graph) {
    if (error) throw error;
// function drawGraph(){
    mygraph = graph;

    var link = container.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function(d) {
            return Math.sqrt(d.value);
        });

    var gnodes = container.selectAll('node')
        .data(graph.nodes)
        .enter()
        .append('g')
        // .attr("class", "node")
        .call(d3.drag()
            .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

    var node = gnodes.append("circle")
        .attr("r", 5)
        .style("fill", function(d) {
            return color(d.group);
        });

    var labels = gnodes.append("svg:text")
        .attr("class", "nodeLabel")
        .attr("x", 7)
        .attr("dy", ".35em")
        .text(function(d) {

            // if (! $('#fixOnDragBox').is(":checked")){
                return d.id;
            // } else {
            //     return "";
            // }
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

        gnodes.attr("transform", function(d) {
            return 'translate(' + [d.x, d.y] + ')';
        });
    }
});


function zoomed() {
    container.attr("transform", d3.event.transform);
}

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
    if (! $('#fixOnDragBox').is(":checked")){
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

function hideLabels(){
    normalClass = "nodeLabel";
    hiddenClass = "hidden";

    oldClass = "";
    newClass = ""

    if ($('#hideLabelsBox').is(":checked")){
        oldClass = normalClass;
        newClass = hiddenClass;
    } else {
        oldClass = hiddenClass;
        newClass = normalClass;
    }
    container.selectAll('.' + oldClass)
    .attr("class", newClass);
    
    // container.selectAll(".nodeLabel")
        // .style("opacity", function () { return $('#hideLabelsBox').is(":checked") ? 0 : 1});
}
