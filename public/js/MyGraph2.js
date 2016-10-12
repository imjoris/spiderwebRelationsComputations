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
        .attr("id", "svgid")
        .attr("width", this.width)
        .attr("height", this.height)
        // .attr("transform", "translate(" + this.margin.left + "," + this.margin.right + ")")
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
            .attr("transform", function(d){return "translate(" + d.x + "," + d.y + ")";})

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
        // myself.simulation.restart();
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
        // myself.attr("transform", d3.event.transform);

        // this.state.justScaleTransGraph = true;
        // d3.select("." + this.consts.graphClass)
        
        // d3.select("#svgid")
        // d3.select("#svgid")
        // myself.container
        // .attr("translate(" + d3.event.transform + ") scale(" + d3.event.scale + ")"); 
        // .attr("transform", d3.event.transform);
        //
        
        myself.container
        .attr("transform", d3.event.transform)
        //     .attr("transform", "translate(" + [myself.container.x , myself.container.y] + ")");
            
            // "translate(" + d3.event.transform + ") scale(" + d3.event.scale + ")"); 
        // myself.container
        //     .attr("transform", "translate(" + [myself.container.x , myself.container.y] + ")");
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


    // Pass in the element and its pre-transform coords
    getElementCoords: function(element, coords) {
        var ctm = element.getCTM(),
            x = ctm.e + coords.x * ctm.a + coords.y * ctm.c,
            y = ctm.f + coords.x * ctm.b + coords.y * ctm.d;
        return {
            x: x,
            y: y
        };
    },

    correct: function(m) {
        var $container = $("#containergroup");
        var width = $container.width(),
            height = $container.height(),
            topOffset = $container.find(".position-handler.top").first().offset(),
            bottomOffset = $container.find(".position-handler.bottom").first().offset()
        scaleX = (bottomOffset.left - topOffset.left) / width || 1,
            scaleY = (bottomOffset.top - topOffset.top) / height || 1;
        return [m[0] / scaleX, m[1] / scaleY];
    },


    updateWindow: function(svg){
        var docEl = document.documentElement,
            bodyEl = document.getElementsByTagName('body')[0];
        var x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
        var y = window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;
        svg.attr("width", x).attr("height", y);
    },

    svgMouseUp: function(d) {

        // d3.event.stopPropagation();
        var coordinates = d3.mouse(myself.container.node());
        // var coordinates = d3.mouse();
        // coordinates = myself.correct(coordinates);
        // var myX = coordinates.x;
        // var myY = coordinates.y;
        // var myPreX = coordinates[0];
        // var myPreY = coordinates[1];
        // var newCoords = myself.getElementCoords(myself.container, {x:myPreX, y:myPreY});
        // var myX = newCoords.x;
        // var myY = newCoords.y;

        // var myX = coordinates[0];
        // var myY = coordinates[1];

        var myX = coordinates[0];
        var myY = coordinates[1];

        // var myX = d3.event.clientX;
        // var myY = d3.event.clientY;
        // var myX = window.pageXOffset + myX;
        // var myY = window.pageYOffset + myY;
        // var myX = window.pageXOffset +d3.event.pageX;
        // var myY = window.pageYOffset + d3.event.pageY;

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
