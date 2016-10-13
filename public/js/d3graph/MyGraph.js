//##################################################
//# Initialization of MyGraph
//##################################################
// {{{
function MyGraph() {

    myself = this;
    this.graph = new Object();
    this.error = new Object();
    this.state = {
        hasForce: true,
        shiftNodeDrag: false,
        mouseDownNode: null,
        mouseOverNode: null,
        selectedNode: null,
        mouseX: 0,
        mouseY: 0,
        alerted: false,
        hasClickedNode: false
    }
    this.consts = {
        BACKSPACE_KEY: 8,
        DELETE_KEY: 46,
        ENTER_KEY: 13,
    }

    this.defaults = {
        forceLinkDistance: 100,
        forceChargeStrength: -50,
        forceChargeDistanceMin: 20,
        forceChargeDistanceMax: 800,

        forceCollideMargin: 10,
        forceCollideStrength: 0.9,
    }

    this.width = window.innerWidth - 320;
    this.height = window.innerHeight - 52;

    this.zoom = d3.zoom()
        .scaleExtent([-10, 20])
        .on("zoom", this.zoomed)
        .on("end", this.zoomEnd) // <---- added



    this.margin = {
        top: -5,
        right: -5,
        bottom: -5,
        left: -5
    };
    this.svg = d3.select("body")
        .on("keydown", this.svgKeyDown)
        .append("svg")
        .attr("id", "svgid")
        .attr("width", this.width)
        .attr("height", this.height)
        .on("click", this.svgClick)
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
            })
            // .strength(function(l){
            //     return 0.2;
            // })
            .distance(this.defaults.forceLinkDistance)
        )
        .force("charge", d3.forceManyBody()
            .strength(this.defaults.forceChargeStrength)
            .distanceMin(this.defaults.forceChargeDistanceMin)
            .distanceMax(this.defaults.forceChargeDistanceMax)
        )
        .force("collide", d3.forceCollide(10)
            .strength(0.9)

        )
        .force("center", d3.forceCenter(this.width / 2, this.height / 2));

    myself.simulation
        .on("tick", myself.ticked);

    this.dragline = myself.container.append("line")
        .attr("id", "draglineid")
        .attr("class", "hiddendragline");
}
// }}} end of initialiization

MyGraph.prototype = {

    //##################################################
    //# Draw the graph
    //##################################################
    // {{{
    refreshGraph: function() {

        var links = myself.graph.links;
        var nodes = myself.graph.nodes;

        var link = myself.container.selectAll(".link")
            .data(links, function(d) {
                return d.source.id + '-' + d.target.id;
                // return d;
            });

        link.enter().append("line")
            .attr("class", "link")
            // .style("stroke-width", function(d) {
            //     return Math.sqrt(d.value);
            // });

        var gnodes = this.container.selectAll('.node')
            .data(nodes, function(d) {
                return d.id + "-" + d.group;
                // return d;
            });

        var newNodes = gnodes.enter()
            .append('g')
            .attr("class", "node")
            .call(d3.drag()
                .on("start", this.dragstarted)
                .on("drag", this.dragged)
                .on("end", this.dragended))

        var node = newNodes.append("circle")
            // .on("mousedown", myself.nodeMouseDown)
            .attr("class", "nodecircle")
            .on("click", myself.nodeClick)
            .on("mouseover", myself.nodeMouseOver)
            .on("mouseout", myself.nodeMouseOut)
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

        labels.exit().remove();
        newNodes.exit().remove();
        node.exit().remove();
        link.exit().remove();
    },
    // }}} end of refreshGraph()

    //##################################################
    //# Update nodes on each force tick
    //##################################################
    // {{{
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
                var nX = d.fx ? d.fx : d.x;
                var nY = d.fy ? d.fy : d.y;
                return 'translate(' + [nX, nY] + ')';
            });
        myself.updateDragLine();
    },
    // }}}  end of ticked

    //##################################################
    //# Update the line to connect nodes
    //# Make it follow the pointer position
    //##################################################
    // {{{
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

            var myX = coordinates[0];
            var myY = coordinates[1];

            myself.dragline.attr("class", "dragline");
            dnode = myself.state.mouseDownNode;
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
    // }}}

    //##################################################
    //# Update the window on a resize
    //##################################################
    // {{{
    updateWindow: function(svg) {
        var docEl = document.documentElement,
            bodyEl = document.getElementsByTagName('body')[0];
        var x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
        var y = window.innerHeight || docEl.clientHeight || bodyEl.clientHeight;
        svg.attr("width", x).attr("height", y);
    },
    // }}}

    //##################################################
    //# Zoom event listeners
    //##################################################
    // {{{
    zoomed: function() {
        myself.container
            .attr("transform", d3.event.transform)
    },

    zoomEnd: function() {
        // alert('mouseup');
    },
    // }}}

    //##################################################
    //# Drag event listeners
    //##################################################
    // {{{
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
        if (!myself.state.shiftNodeDrag) {
            var coordinates = new Array();
            try {
                coordinates = myself.getMouseCoordinates();
                d.fx = coordinates[0];
                d.fy = coordinates[1];
                myself.simulation.tick();
                myself.ticked();
            } catch (e) {
                return;
            }
        } else {
            myself.updateDragLine();
        }
    },

    dragended: function(d) {
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

    // }}} end drag event listeners

    //##################################################
    //# Mouse
    //##################################################
    // {{{

    //##################################################
    //# General function to get the mouse coordinates
    //##################################################
    // {{{
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
    // }}}

    //##################################################
    //# Node mouse event listeners
    //##################################################
    // {{{

    // nodeMouseDown: function(d) {
    //     if (d3.event.shiftKey) {
    //         myself.state.shiftNodeDrag = true;
    //     }
    // },

    nodeClick: function(d) {
        if (d3.event.shiftKey) {

            if (!$('#keepTheForceBox').is(":checked")) {
                myself.stopForce();
            }
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
            }
        } else {
            // if(myself.state.selectedNode){
            //     myself.state.selectedNode
            //         .attr("class", "nodecircle");
            //     myself.state.selectedNode = null;
            // }
            // if (myself.state.selectedNode){
            //     alert(myself.state.selectedNode.id + "\n" + d.id);
            // }
            if (myself.state.selectedNode != null && myself.state.selectedNode.id == d.id) {
                d3.select(".selectednode")
                    .attr("class", "nodecircle");
                myself.state.selectedNode = null;
            } else if (!myself.state.selectedNode) {
                d3.select(this).attr("class", "selectednode");
                myself.state.selectedNode = d; //d3.select(this);
                // updateSidebarInfo();
                // }
            } else {
                d3.select(".selectednode")
                    .attr("class", "nodecircle");
                d3.select(this).attr("class", "selectednode");
                myself.state.selectedNode = d; //d3.select(this);
            }
        }

    },

    nodeMouseOver: function(d) {
        myself.state.mouseOverNode = d;
    },
    nodeMouseOut: function(d) {
        myself.state.mouseOverNode = null;
    },
    // end node mouse event listeners
    // }}}

    //##################################################
    //# SVG mouse event listeners
    //##################################################
    // {{{
    svgMouseMove: function(d) {
        if (myself.state.shiftNodeDrag) {
            myself.updateDragLine();
        }
    },

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
        if (myself.state.selectedNode !== null && myself.state.mouseOverNode === null) {
            d3.select(".selectednode")
                .attr("class", "nodecircle");
            myself.state.selectedNode = null;
        }

    },
    // end svg mouse event listeners
    // }}}
    //
    // end mouse functions
    // }}}

    //##################################################
    //# Key events
    //##################################################
    // {{{

    svgKeyDown: function(d) {
        switch (d3.event.keyCode) {
            case myself.consts.BACKSPACE_KEY:
            case myself.consts.DELETE_KEY:
                if (myself.state.selectedNode) {

                    myself.stopForce();
                    myself.removeNodeById(myself.state.selectedNode.id);
                    // var mynodes = myself.graph.nodes;
                    // for(var i = 0; i < mynodes.length; i++) {
                    //     if(mynodes[i] === myself.state.selectedNode) {
                    //         myself.graph.nodes.splice(i, 1);
                    //     }
                    // }

                    // var neighBorLinks = new Array();
                    // var nodesToRemove = new Array();

                    var mylinks = myself.graph.links;
                    for (var i = 0; i < mylinks.length; i++) {
                        if (mylinks[i].source.id == myself.state.selectedNode.id || mylinks[i].target.id == myself.state.selectedNode.id) {
                            // neighBorLinks.push(i);
                            // myself.graph.links.splice(i, 1);
                            myself.removeLinkBySrcTar(mylinks[i].source, mylinks[i].target);
                        }
                    }



                    // myself.simulation.nodes(myself.graph.nodes);
                    // myself.simulation.force("link").links(myself.graph.links);

                    // myself.graph.nodes.splice(myself.state.selectedNode);

                    myself.container.selectAll(".node").data(myself.graph.nodes, function(d) {
                            return d.id + "-" + d.group;
                            // return d;
                        })
                        .exit()
                        .remove();

                    myself.container.selectAll(".link")
                        .data(myself.graph.links, function(d) {
                            return d.source.id + '-' + d.target.id;
                            // return d;
                        })
                        .exit()
                        .remove();

                    myself.refreshGraph();
                    myself.simulation.tick();
                    myself.ticked();

                    d3.select(".selectednode")
                        .attr("class", "nodecircle");
                    myself.state.selectedNode = null;

                    if ($('#keepTheForceBox').is(":checked")) {
                        myself.startForce();
                    }

                    // myself.graph.nodes.splice(myself.state.selectedNode);
                    // myself.refreshGraph();
                    // myself.simulation.tick();
                    // myself.ticked();
                }
                break;
        }
    },


    removeNodeById: function(id) {
        myself.graph.nodes = myself.graph.nodes.filter(e => e.id !== id);

        // var mynodes = myself.graph.nodes;
        // for(var i = 0; i < mynodes.length; i++) {
        //     if(mynodes[i].id === id) {
        //         myself.graph.nodes.splice(i, 1);
        //     }
        // }
    },

    removeLinkBySrcTar: function(src, tar) {
        myself.graph.links = myself.graph.links.filter(e => !(
            (e.source == src && e.target == tar) ||
            (e.source == tar && e.target == src)))

        // var mylinks = myself.graph.links;
        // for(var i = 0; i < mylinks.length; i++) {
        //     if((mylinks[i].source == src && mylinks[i].target == tar)
        //         || (mylinks[i].source == tar && mylinks[i].target == src)) {
        //         myself.graph.links.splice(i, 1);
        //     }
        // }
    },
    // }}}

    //##################################################
    //# Public functions used by the interface
    //##################################################
    // {{{
    setGraph: function(newGraph) {
        myself.graph = newGraph;
        myself.simulation.nodes(myself.graph.nodes);
        myself.simulation.force("link").links(myself.graph.links);

        myself.refreshGraph();
    },

    startForce: function() {
        myself.state.hasForce = true;
        myself.simulation.alphaTarget(0.3).restart();
        $("#toggleForceId").text("Pause");
    },

    stopForce: function() {
        myself.state.hasForce = false;
        hasForce = false;
        myself.simulation.stop();
        $("#toggleForceId").text("Play");
    },

    hideLabels: function() {
        myself.container.selectAll(".nodeLabel")
            .style("opacity", function() {
                return $('#hideLabelsBox').is(":checked") ? 0 : 1
            });
    },
    // end public functions
    // }}}

}

function toggleForce() {
    myGraph.state.hasForce ? myGraph.stopForce() : myGraph.startForce();
}

myGraph = new MyGraph(".main");
$.getJSON("json/miserables").then(function(response) {
    myGraph.setGraph(response);
});

// myForceLinkDistSlider.name="linkforceslide";
// mySlider.min="0";
// mySlider.max="150";
// mySlider.step="5";
// mySlider.value="40";
// mySlider.tooltip="show";

// mySlider = new Slider("#forceDistSliderDiv");
// mySlider = new Slider("#forceDistSliderInput");
    // , {
// });


var myForceLinkDistSlider = $("#forceDistSliderInput").slider();
myForceLinkDistSlider.slider('setValue', myself.defaults.forceLinkDistance);
$("#forceDistSliderDiv")
    .on("change", function linkDistChanged(event, val) {
        // var myForceLinkDistSlider = $("#forceDistSliderDiv");
        // var myForceLinkDistSlider = $("#forceDistSliderDiv");
        // var val = $("#forceDistSliderInput").getValue();

        var val = myForceLinkDistSlider.slider('getValue');
        // var val = $("#forceDistSliderDiv").bootstrapSlider('getValue');
        myself.simulation.force("link").distance(val);
        // myself.simulation.alphaTarget(0.3).restart();
    });
