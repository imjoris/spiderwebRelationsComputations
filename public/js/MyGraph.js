// function MyGraph(el, startNodes, startEdges) {
function MyGraph() {
    myself = this;
    this.graph = new Object();
    this.error = new Object();
    this.state = {
        hasForce: true,
        shiftNodeDrag: false,
        mouseDownNode: null,
        mouseOverNode: null,
        mouseX: 0,
        mouseY: 0,
        alerted: false,
        hasClickedNode: false
    }

    this.width = window.innerWidth - 320;
    this.height = window.innerHeight - 52;

    this.zoom = d3.zoom()
        .scaleExtent([1, 10])
        .on("zoom", this.zoomed)
        .on("end", this.zoomEnd) // <---- added



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
        .on("click", this.svgClick)
        // .on("keydown", this.svgKeyDown)
        .on("mousemove", this.svgMouseMove)
        .call(this.zoom)
        .on("dblclick.zoom", null);

    // listen for resize
    window.onresize = function() {
        myself.updateWindow(myself.svg);
    };

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

    this.dragline = myself.container.append("line")
        .attr("id", "draglineid")
        .attr("class", "hiddendragline");
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

        var newNodes = gnodes.enter()
            .append('g')
            .attr("class", "node")
            .call(d3.drag()
                .on("start", this.dragstarted)
                .on("drag", this.dragged)
                .on("end", this.dragended))

        var node = newNodes.append("circle")
            // .on("mousedown", myself.nodeMouseDown)
            .on("click", myself.nodeClick)
            .on("mouseover", myself.nodeMouseOver)
            .on("mouseout", myself.nodeMouseOut)
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
        if (myself.state.hasForce) {
            myself.simulation.alphaTarget(0.3).restart();
        }
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

        // if(myself.state.hasForce){
        myself.container.selectAll('.node')
            .attr("transform", function(d) {
                var nX = d.fx ? d.fx : d.x;
                var nY = d.fy ? d.fy : d.y;
                return 'translate(' + [nX, nY] + ')';
            });
        // } else {
        //     myself.container.select('#mouseoverid')
        //         .attr("transform", function(d) {
        //             var nX = d.fx ? d.fx : d.x;
        //             var nY = d.fy ? d.fy : d.y;
        //             return 'translate(' + [nX, nY] + ')';
        //         });
        // }

        // var myX = myself.state.mouseX;
        // var myY = myself.state.mouseY;

        myself.updateDragLine();
    },

    zoomed: function() {
        myself.container
            .attr("transform", d3.event.transform)
    },

    zoomEnd: function() {
        // alert('mouseup');
        // if( d3.event.type == 'end' )
    },

    updateDragLine: function() {
        if (myself.state.shiftNodeDrag) {
            var myX = 0;
            var myY = 0;
            try {
                var coordinates = myself.getMouseCoordinates();
                var myX = coordinates[0];
                var myY = coordinates[1];
            } catch (err) {
                return;
            }
            // alert(coordinates[0] + "\n" + coordinates[1]);
            // myself.state.mouseX = coordinates[0];
            // myself.state.mouseY = coordinates[1];

            var myX = coordinates[0];
            var myY = coordinates[1];

            // var myX = myself.state.mouseX;
            // var myY = myself.state.mouseY;

            myself.dragline.attr("class", "dragline");
            dnode = myself.state.mouseDownNode;
            // alert(JSON.stringify(dnode));
            myself.dragline
                .attr("x1", function() {
                    if (dnode.fx) {
                        return dnode.fx
                    }
                    return dnode.x;
                })
                .attr("y1", function(d) {
                    if (dnode.fy) {
                        return dnode.fy;
                    }
                    return dnode.y
                })
                .attr("x2", myX)
                .attr("y2", myY)
                .attr("opacity", 1)
                .attr("stroke-opacity", 1)
                .attr("stroke-width", 6);

        } else {
            myself.dragline.attr("class", "hiddendragline");
        }
    },

    dragstarted: function(d) {
        if (!myself.state.shiftNodeDrag) {
            if (myself.state.hasForce) {
                if (!d3.event.active) myself.simulation.alphaTarget(0.3).restart();
            }
            d.fx = d.x;
            d.fy = d.y;
        }
    },


    dragged: function(d) {
        // myself.container.select('')
        if (!myself.state.shiftNodeDrag) {
            var coordinates = new Array();
            try {
                coordinates = myself.getMouseCoordinates();
                d.fx = coordinates[0];
                d.fy = coordinates[1];
                myself.simulation.tick();
                myself.ticked();
                // .attr("id", "mouseoverid")
                // .attr("transform", function(d) {
                //     var nX = d.fx ? d.fx : d.x;
                //     var nY = d.fy ? d.fy : d.y;
                //     return 'translate(' + [nX, nY] + ')';
                // });
            } catch (e) {
                return;
            }

            // d.fx = d3.event.x;
            // d.fy = d3.event.y;
        } else {
            myself.updateDragLine();
        }
    },

    dragended: function(d) {
        // if (myself.state.shiftNodeDrag) {
        //     myself.state.shiftNodeDrag = false;
        //     myself.dragline.attr("class", "hiddendragline");
        // }
        if (!myself.state.shiftNodeDrag) {
            if (myself.state.hasForce) {
                if (!$('#fixOnDragBox').is(":checked")) {
                    if (!d3.event.active) myself.simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }
            }
        }
    },

    hideLabels: function() {
        myself.container.selectAll(".nodeLabel")
            .style("opacity", function() {
                return $('#hideLabelsBox').is(":checked") ? 0 : 1
            });
    },


    updateWindow: function(svg) {
        var docEl = document.documentElement,
            bodyEl = document.getElementsByTagName('body')[0];
        var x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
        var y = window.innerHeight || docEl.clientHeight || bodyEl.clientHeight;
        svg.attr("width", x).attr("height", y);
    },

    // nodeMouseDown: function(d) {
    //     if (d3.event.shiftKey) {
    //         myself.state.shiftNodeDrag = true;
    //     }

    // },

    nodeClick: function(d) {
        if (d3.event.shiftKey) {
            myself.stopForce();
            myself.state.mouseDownNode = d;
            myself.state.shiftNodeDrag = true;
            myself.updateDragLine();
        }
        if (myself.state.shiftNodeDrag) {
            if (myself.state.mouseOverNode != myself.state.mouseDownNode) {

                var newLink = {
                    "source": myself.state.mouseDownNode.id,
                    "target": d.id
                }

                for (var i = 0; i < myself.graph.links.length; i++) {
                    var alink = myself.graph.links[i];
                    alinkSrcId = alink.source.id;
                    alinkTarId = alink.target.id;
                    // if(!myself.state.alerted){
                    //     alert(alinkSrcId + "\n" + alinkTarId);
                    //     myself.state.alerted = true;
                    // }
                    if ((alinkSrcId === newLink.target && alinkTarId === newLink.source) || (alinkSrcId === newLink.source && alinkTarId === newLink.target)) {
                        alert("link already exists");
                        myself.state.mouseDownNode = d;
                        myself.state.shiftNodeDrag = false;
                        myself.updateDragLine();

                        return;
                    }
                }

                myself.state.shiftNodeDrag = false;
                myself.updateDragLine();

                myself.graph.links.push(newLink);
                myself.refreshGraph();
                myself.simulation.tick();
                myself.ticked();


                // var sIndex;
                // var tIndex;
                // for (var i = 0; i < myself.graph.nodes.length; i++){
                //     var curnode = myself.graph.nodes[i];
                //     if(curnode === myself.state.mouseDownNode){
                //         sIndex = i;
                //     }
                //     if(curnode === d){
                //         tIndex = i;
                //     }
                // }
                // myself.graph.nodes.splice(sIndex, 1);
                // myself.graph.nodes.splice(tIndex, 1);
                // d3.selectAll(".node").data(myself.graph.nodes);

                // myself.graph.nodes.push(d);
                // myself.graph.nodes.push(myself.state.mouseDownNode);
            }
        }

        // if (myself.state.mouseDownNode) {
        //     var newLink = {
        //         "source": myself.state.mouseDownNode.id,
        //         "target": d.id
        //     }
        //     myself.graph.links.push(newLink);
        //     myself.refreshGraph();
        // }
        // myself.state.shiftNodeDrag = false;
        // myself.dragline.attr("class", "hiddendragline");
        // myself.state.mouseDownNode = null;
    },

    // d3.selection.prototype.moveToFront = function() {
    //     return this.each(function(){
    //         this.parentNode.appendChild(this);
    //     });
    // };

    nodeMouseOver: function(d) {
        myself.state.mouseOverNode = d;
    },
    nodeMouseOut: function(d) {
        myself.state.mouseOverNode = null;
    },

    getMouseCoordinates: function() {
        var coordinates = new Array();
        try {
            coordinates = d3.mouse(myself.container.node());
        } catch (err) {
            if (d3.event) {
                coordinates = [d3.event.x, d3.event.y];
            } else {
                return;
            }
        }
        myself.state.mouseX = coordinates[0];
        myself.state.mouseY = coordinates[1];

        return coordinates;
    },

    svgMouseMove: function(d) {
        if (myself.state.shiftNodeDrag) {
            myself.updateDragLine();
        }
    },

    //     svgKeyDown: function(d) {

    //     },

    svgClick: function(d) {
        if (!myself.state.shiftNodeDrag) {
            if (d3.event.shiftKey) {
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
                myself.simulation.tick();
                myself.ticked();
            }
        } else {
            if (myself.state.mouseOverNode === null) {
                myself.state.shiftNodeDrag = false;
                myself.updateDragLine();
            }
        }

    },

    setGraph: function(newGraph) {
        myself.graph = newGraph;
        myself.simulation.nodes(myself.graph.nodes);
        myself.simulation.force("link").links(myself.graph.links);

        // alert("123\n" + JSON.stringify(graph));
        myself.refreshGraph();
    },

    startForce: function() {
        myself.state.hasForce = true;
        // myself.simulation.restart();
        myself.simulation.alphaTarget(0.3).restart();
        $("#toggleForceId").text("Pauze");
    },

    stopForce: function() {
        myself.state.hasForce = false;
        hasForce = false;
        myself.simulation.stop();
        $("#toggleForceId").text("Play");
        // myself.simulation.alphaTarget(0);
        // myself.simulation.alpha(0);
    }

}

function toggleForce() {
    myGraph.state.hasForce ? myGraph.stopForce() : myGraph.startForce();
}

myGraph = new MyGraph(".main");
$.getJSON("json/miserables").then(function(response) {
    myGraph.setGraph(response);
});
