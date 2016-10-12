// function MyGraph(el, startNodes, startEdges) {
function MyGraph() {
    myself = this;
    this.graph = new Object();
    this.error = new Object();

    this.width = window.innerWidth - 320;
    this.height = window.innerHeight - 52;

    this.zoom = d3.zoom()
        .scaleExtent([1, 10])
        .on("zoom", this.zoomed);

    this.margin = {
        top: -5,
        right: -5,
        bottom: -5,
        left: -5
    };
    this.svg = d3.select("body")
        .append("svg")
        .attr("id", "svgid")
        .attr("width", this.width)
        .attr("height", this.height)
        .on("click", this.svgMouseUp)
        .call(this.zoom)
        .on("dblclick.zoom", null);

    // listen for resize
    window.onresize = function(){myself.updateWindow(myself.svg);};

    this.container = this.svg.append("svg:g").attr("id", "containergroup");
    this.color = d3.scaleOrdinal(d3.schemeCategory20);

    myself.simulation = d3.forceSimulation()
        .stop()
        .force("link", d3.forceLink().id(function(d) {
            return d.id;
        }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(this.width / 2, this.height / 2));

    myself.simulation
        .on("tick", myself.ticked);
}

MyGraph.prototype = {

    //##################################################
    //# Draw the graph
    //##################################################
    refreshGraph: function() {
        // {{{

        var links = myself.graph.links;
        var nodes = myself.graph.nodes;

        var link = myself.container.selectAll(".link")
            .data(links);

        link.enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) {
                return Math.sqrt(d.value);
            });

        var gnodes = this.container.selectAll('.node')
            .data(nodes)
            .on("click", null);

        var newNodes = gnodes.enter()
            .append('g')
            .attr("class", "node")
            .call(d3.drag()
                .on("start", this.dragstarted)
                .on("drag", this.dragged)
                .on("end", this.dragended));

        var node = newNodes.append("circle")
            .attr("r", 5)
            .style("fill", function(d) {
                return myself.color(d.group);
            });


        var labels = newNodes.append("svg:text")
            .attr("class", "nodeLabel")
            .attr("x", 7)
            .attr("dy", ".35em")
            .text(function(d) {
                return d.id;
            });

        myself.simulation.nodes(nodes);
        myself.simulation.force("link").links(links);


        myself.simulation.alphaTarget(0.3).restart();
    },
    // end of refreshGraph()
    // }}}


    ticked: function() {
        myself.container.selectAll(".link")
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

        myself.container.selectAll('.node')
            .attr("transform", function(d) {
                return 'translate(' + [d.x, d.y] + ')';
            });
    },

    zoomed: function() {
        myself.container
        .attr("transform", d3.event.transform)
    },

    dragstarted: function(d) {
        if (!d3.event.active) myself.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    },

    dragged: function(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    },

    dragended: function(d) {
        if (!$('#fixOnDragBox').is(":checked")) {
            if (!d3.event.active) myself.simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    },

    hideLabels: function() {
        myself.container.selectAll(".nodeLabel")
            .style("opacity", function() {
                return $('#hideLabelsBox').is(":checked") ? 0 : 1
            });
    },


    updateWindow: function(svg){
        var docEl = document.documentElement,
            bodyEl = document.getElementsByTagName('body')[0];
        var x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
        var y = window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;
        svg.attr("width", x).attr("height", y);
    },

    svgMouseUp: function(d) {
        if (d3.event.shiftKey){
        var coordinates = d3.mouse(myself.container.node());
        var myX = coordinates[0];
        var myY = coordinates[1];

        var newNode = {
            "id": "New Node",
            "group": 3,
            "x": myX,
            "y": myY,
            "fx": myX,
            "fy": myY,
        };
        // alert("123\n" + JSON.stringify(this.graph));
        myself.graph.nodes.push(newNode);
        myself.refreshGraph();
        }
    },

    setGraph: function(newGraph) {
        myself.graph = newGraph;
        myself.simulation.nodes(myself.graph.nodes);
        myself.simulation.force("link").links(myself.graph.links);

        // alert("123\n" + JSON.stringify(graph));
        myself.refreshGraph();
    }

}

myGraph = new MyGraph(".main");
$.getJSON("json/miserables").then(function (response) {
    myGraph.setGraph(response);
});
