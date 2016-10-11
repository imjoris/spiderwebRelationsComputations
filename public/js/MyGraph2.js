// function MyGraph(el, startNodes, startEdges) {
function MyGraph() {
    myself = this;
    this.graph = new Object();
    this.error = new Object();

    // var links = graph.links;
    // var nodes = graph.nodes;

    // var myElement = d3.select("body");
    // var myElement = $(".main");
    this.width = window.innerWidth - 320;
    this.height = window.innerHeight - 52;
    // var width = window.innerWidth;
    // var height = window.innerHeight;

    // var width = myElement.innerWidth();
    // var height = myElement.innerHeight();
    // alert("Width:" + this.width + "height: " + this.height);
    // var width = window.innerWidth - 320;
    // var height = window.innerHeight - 52;

    // var zoom = d3.behavior.zoom()
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
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.right + ")")
        .on("click", this.svgMouseUp)
        .call(this.zoom);



    this.container = this.svg.append("g");
    this.color = d3.scaleOrdinal(d3.schemeCategory20);


    myself.simulation = d3.forceSimulation()
        .stop()
        .force("link", d3.forceLink().id(function(d) {
            return d.id;
        }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(this.width / 2, this.height / 2));


    // this.links = this.simulation.force("link").links();
    // this.nodes = this.simulation.nodes();

}

MyGraph.prototype = {
    //##################################################
    //# Draw the graph
    //##################################################
    // this.refreshGraph = function() {
    refreshGraph: function() {
        // {{{

        var links = myself.graph.links;
        var nodes = myself.graph.nodes;
        // var links = myself.simulation.force("link").links();
        // var nodes = myself.simulation.nodes();

        // alert(JSON.stringify(myself.graph));
        // simulation.force("link").links(links);
        // simulation.nodes(nodes);

        var link = myself.container.selectAll(".link")
            // .data(graph.links)
            // .attr("class", "link")
            // .style("stroke-width", function(d) {
            //     return Math.sqrt(d.value);
            // })
            // .data(links, function(d){return d.source + d.target})
            .data(links);

        link.enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) {
                return Math.sqrt(d.value);
            });

        var gnodes = this.container.selectAll('.node')
            // .data(graph.nodes)
            // .data(nodes, function(d){return d.id})
            .data(nodes)
            .attr("class", "node")
            .call(d3.drag()
                .on("start", this.dragstarted)
                .on("drag", this.dragged)
                .on("end", this.dragended));

        // gnodes.select("circle")
        // .attr("r", 5)
        // .style("fill", function(d) {
        //     return color(d.group);
        // });

        // gnodes.select(".nodeLabel")
        //     .attr("class", "nodeLabel")
        //     .attr("x", 7)
        //     .attr("dy", ".35em")
        //     .text(function(d) {
        //         return d.id;
        //     });

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
                // return d3.scaleOrdinal(d3.schemeCategory20)(d.group);
                return myself.color(d.group);
            });


        var labels = newNodes.append("svg:text")
            .attr("class", "nodeLabel")
            .attr("x", 7)
            .attr("dy", ".35em")
            .text(function(d) {
                return d.id;
            });


        //     .attr("class", "nodeLabel")
        //     .attr("x", 7)
        //     .attr("dy", ".35em")
        //     .text(function(d) {

        //         // if (! $('#fixOnDragBox').is(":checked")){
        //         return d.id;
        //         // } else {
        //         //     return "";
        //         // }
        //     });
        // labels.exit().remove();

        // myself.simulation = d3.forceSimulation()
        //     .stop()
        //     .force("link", d3.forceLink().id(function(d) {
        //         return d.id;
        //     }))
        //     .force("charge", d3.forceManyBody())
        //     .force("center", d3.forceCenter(this.width / 2, this.height / 2));

        myself.simulation.nodes(nodes);
        myself.simulation.force("link").links(links);
        // d3.forceLink().links(graph.links);

        myself.simulation
            .on("tick", myself.ticked);

        // simulation.tick();
        // simulation.alpha(0);
        myself.simulation.alphaTarget(0.3).restart();
        // simulation.force.start();
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

    // if(!this.graph) {
    //     return false;
    // }

    // this.context.clearRect(0,0,this.width,this.height);
    // this.context.save();
    // this.context.translate(this.width / 2, this.height / 2);

    // this.context.beginPath();
    // this.graph.links.forEach((d)=>{
    //     this.context.moveTo(d.source.x, d.source.y);
    //     this.context.lineTo(d.target.x, d.target.y);
    // });
    // this.context.strokeStyle = this.lines.stroke.color;
    // this.context.lineWidth = this.lines.stroke.thickness;

    // this.context.stroke();

    // this.graph.nodes.forEach((d)=>{
    //     this.context.beginPath();

    //     this.context.moveTo(d.x + d.r, d.y);
    //     this.context.arc(d.x, d.y, d.r, 0, 2 * Math.PI);

    //     this.context.fillStyle = d.colour;
    //     this.context.strokeStyle =this.nodes.stroke.color;
    //     this.context.lineWidth = this.nodes.stroke.thickness;
    //     this.context.fill();
    //     this.context.stroke();
    // });

    // this.context.restore();
    // },
    zoomed: function() {
        myself.container.attr("transform", d3.event.transform);
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
        container.selectAll(".nodeLabel")
            .style("opacity", function() {
                return $('#hideLabelsBox').is(":checked") ? 0 : 1
            });
    },

    svgMouseUp: function(d) {

        // d3.event.stopPropagation();
        var coordinates = [0, 0];
        var coordinates = d3.mouse(this);
        var newNode = {
            "id": "New Node",
            "group": 3,
            "x": coordinates[0],
            "y": coordinates[1],
            "fx": coordinates[0],
            "fy": coordinates[1]
        };
        // alert("123\n" + JSON.stringify(this.graph));
        myself.graph.nodes.push(newNode);
        // myself.simulation.nodes(myself.graph.nodes);
        myself.refreshGraph();
        // graph.nodes.push(newNode);
        // simulation.nodes().push(newNode);
        // simulation.nodes(simulation.nodes().push(newNode));
    },

    setGraph: function(newGraph) {
        myself.graph = newGraph;
        myself.simulation.nodes(myself.graph.nodes);
        myself.simulation.force("link").links(myself.graph.links);

        // alert("123\n" + JSON.stringify(graph));
        myself.refreshGraph();
    }

}
