//##################################################
//# Initialization of MyGraph
//##################################################
// {{{
function MyGraph() {

    myself = this;
    this.graph = new Object();
    this.graph.nodes = new Array();
    this.graph.links = new Array();
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
        hasClickedNode: false,
        // zoomTransform: null,
        zoomTransform: {
            k: 1,
            x: 0,
            y: 0
        },
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

        forceCollideRadius: 10,
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
    // this.svg = d3.select("body")
    this.svg = d3.select("#svgDiv")
        .append("svg")
        .attr("id", "svgid")
        .attr("width", this.width)
        .attr("height", this.height)
        .on("click", this.svgClick)
        .on("mousemove", this.svgMouseMove)
        .call(this.zoom)
        .on("dblclick.zoom", null)

    d3.select("body")
        .on("keydown", this.svgKeyDown)

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
            .attr("data-src", function(d) {
                return d.source.id
            })
            .attr("data-tar", function(d) {
                return d.target.id
            })

        // .style("stroke-width", function(d) {
        //     return Math.sqrt(d.value);
        // });

        var gnodes = myself.container.selectAll('.node')
            .data(nodes, function(d) {
                return d.id + "-" + d.group;
                // return d;
            });

        var newNodes = gnodes.enter()
            .append('g')
            .attr("class", "node")
            .attr("data-id", function(d) {
                return d.id
            })
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
        myTransform = d3.event.transform;
        myself.container
            .attr("transform", myTransform)

        // console.log(myTransform);
        myself.state.zoomTransform = myTransform;
        // console.log(myself.zoom.translate());

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
        // console.log(myself.graph.links);
        // console.log(myself.simulation);
        // myself.simulation.nodes(myself.graph.nodes);
        // myself.simulation.force("link").links(myself.graph.links);
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

myGraph = new MyGraph(".main");
// $.getJSON("json/miserables").then(function(response) {
//     myGraph.setGraph(response);
// });

function toggleForce() {
    myGraph.state.hasForce ? myGraph.stopForce() : myGraph.startForce();
}


// function initSliders(){
addSlider("forceLinkDist", myGraph.defaults.forceLinkDistance, function(val) {
    myGraph.simulation.force("link").distance(val);
});

addSlider("forceChargeDistanceMin", myGraph.defaults.forceChargeDistanceMin, function(val) {
    myGraph.simulation.force("charge").distanceMin(val);
});
addSlider("forceChargeDistanceMax", myGraph.defaults.forceChargeDistanceMax, function(val) {
    myGraph.simulation.force("charge").distanceMax(val);
});

addSlider("forceChargeStrength", myGraph.defaults.forceChargeStrength, function(val) {
    myGraph.simulation.force("charge").strength(val);
});

addSlider("forceCollideRadius", myGraph.defaults.forceCollideRadius, function(val) {
    myGraph.simulation.force("collide").radius(val);
});

addSlider("forceCollideStrength", myGraph.defaults.forceCollideStrength, function(val) {
    myGraph.simulation.force("collide").strength(val);
});

function addSlider(IdSuffix, defaultVal, valueCallBack) {
    var sl = $(document.getElementById("sliderInput:" + IdSuffix)).slider();
    sl.slider('setValue', defaultVal);
    $(document.getElementById("sliderLabel:" + IdSuffix)).text(sl.slider('getValue'));
    $(document.getElementById("sliderDiv:" + IdSuffix))
        .on("change", function slChange(event, val) {
            var val = sl.slider('getValue');
            $(document.getElementById("sliderLabel:" + IdSuffix)).text(val);
            valueCallBack(val);
        });
}

function onClickExport() {
    var svgData = $("#svgid")[0].outerHTML;
    var svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8"
    });
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "newesttree.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function onClickExportJson() {

    // console.log(d3.zoomTransform(myGraph.zoom.scale()));
    var myForce = {
        "forceLinkDist": myGraph.simulation.force("link").distance()(),

        "forceChargeStrength": myGraph.simulation.force("charge").strength()(),
        "forceChargeDistanceMin": myGraph.simulation.force("charge").distanceMin(),
        "forceChargeDistanceMax": myGraph.simulation.force("charge").distanceMax(),

        "forceCollideRadius": myGraph.simulation.force("collide").radius()(),
        "forceCollideStrength": myGraph.simulation.force("collide").strength(),
    }

    myData = {
        "force": myForce,
        "nodes": myGraph.simulation.nodes(),
        "links": myGraph.simulation.force("link").links(),
        "state": myGraph.state,
    }

    function replacer(key, value) {
        if (typeof value === "function") {
            return undefined;
        }
        return value;
    }
    var str = JSON.stringify(myData, replacer);

    //Save the file contents as a DataURI
    var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(str);

    var downloadLink = document.createElement("a");
    downloadLink.href = dataUri;
    downloadLink.download = "newesttree.json";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function performClick(elemId) {
    var elem = document.getElementById(elemId);
    if (elem && document.createEvent) {
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, false);
        elem.dispatchEvent(evt);
    }
}

function readSingleFile(evt) {
    myGraph.stopForce();
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0];

    if (f) {
        var r = new FileReader();
        r.onload = function(e) {
            var contents = e.target.result;
            data = JSON.parse(contents);

            // d3.select("#containergroup").transition()
            //     .duration(1000)
            //     .ease(d3.easeLinear)
            //     .attr("opacity", 0)
            // .on("end", function() {

                    $("#containergroup").empty();
                    myGraph.dragline = myGraph.container.append("line")
                        .attr("id", "draglineid")
                        .attr("class", "hiddendragline");
                    // console.log(contents);

                    // Just setting myGraph.graph.links to the received json data.links
                    // Will cause an error, because the data.links.source and .target
                    // Do not reference the object in data.nodes, but are a new
                    // object themselves.
                    // The ticked() function however, updates the lines to go from
                    // the links source to the links target locations
                    var newLinks = [];
                    for (var i = 0; i < data.links.length; i++) {
                        newLinks.push({
                            source: data.nodes.filter(e => e.id === data.links[i].source.id)[0],
                            target: data.nodes.filter(e => e.id === data.links[i].target.id)[0],
                        });

                    }

                    for (var key in data.force) {
                        if (data.force.hasOwnProperty(key)) {
                            $("#sliderInput\\:" + key).changeSliderVal(data.force[key]);
                        }
                    }

                    // myGraph.container
                    //     .attr("transform", data.state.zoomTransform);

                    myGraph.graph.nodes = data.nodes;
                    myGraph.graph.links = newLinks;

                    // TODO: restore the state
                    // myGraph.state = data.state;

                    myGraph.refreshGraph();
                    // d3.selectAll(".node").attr("opacity", 0);
                    d3.selectAll("#containergroup").attr("opacity", 0);

                    // d3.selectAll(".node").transition()
                    d3.select("#containergroup").transition()
                        .duration(1000)
                        .ease(d3.easeLinear)
                        .attr("opacity", 1);

                    myGraph.ticked();
                    var zt = data.state.zoomTransform;
                    d3.select("#svgid").transition()
                        .duration(750)
                        .ease(d3.easeLinear)
                        .call(myGraph.zoom.transform,
                            d3.zoomIdentity
                            .translate(zt.x, zt.y).scale(zt.k));

                    // myGraph.zoom.transform(myGraph.container, data.state.zoomTransform);
                    // console.log(data.state.zoomTransform);
                    // myGraph.container.attr("transform", data.state.zoomTransform);
                    // myGraph.container.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
                // });
            }
            r.readAsText(f);
        } else {
            alert("Failed to load file");
        }
    }

    $.fn.changeSliderVal = function(v) {
        return $(this).slider('setValue', v).trigger("change");
    }

    function readSingleFileSVGXML(evt) {
        //Retrieve the first (and only!) File from the FileList object
        var f = evt.target.files[0];

        if (f) {
            var r = new FileReader();
            r.onload = function(e) {
                var contents = e.target.result;
                // var data = jQuery.parseXML(contents);
                // $.parseXML(contents);

                // .select(".containergroup")
                // .each(function(d, i) {
                //     console.log(d);
                //     // myself.graph.nodes[i] = d.data("id");
                // });

                // d3.xml(contents, function(error, data) {
                //     console.log(JSON.stringify(data));
                // myGraph.graph.links = [].map.call(data.querySelectorAll(".link"), function(node) {
                //     // console.log(JSON.stringify(node));
                //     return {
                //         source: node.getAttribute("data-source"),
                //         target: node.getAttribute("data-target")
                //     };
                // });

                // // alert(xmlDoc.documentElement.nodeName);
                var mySvg = document.getElementById("svgDiv")

                var newGraph = new Array();
                newGraph["nodes"] = [].map.call(data.querySelectorAll(".node"), function(n) {
                    return {
                        id: n.getAttribute("data-id"),
                        // myx: n.getAttribute("x")
                        myTransform: n.getAttribute("transform"),
                        // myStyle: n.getAttribute("style")
                        myCircleStyle: n.getElementsByTagName("circle")[0].getAttribute("style")
                    };
                });

                console.log(newGraph.nodes);
                newGraph["links"] = [].map.call(data.querySelectorAll(".link"), function(l) {
                    return {
                        source: newGraph.nodes.filter(e => e.id === l.getAttribute("data-src"))[0],
                        target: newGraph.nodes.filter(e => e.id === l.getAttribute("data-tar"))[0],
                        myx1: l.getAttribute("x1"),
                        myx2: l.getAttribute("x2"),
                        myy1: l.getAttribute("y1"),
                        myy2: l.getAttribute("y2")
                    };
                });

                // myGraph = new MyGraph(".main");
                // console.log(newGraph.links);
                // myGraph.setGraph({"nodes":[], "links":[]});
                myGraph.setGraph(newGraph);
                d3.selectAll(".node")
                    .data(newGraph.nodes)
                    .attr("transform", function(d) {
                        return d.myTransform;
                    })
                    .select("circle").attr("style", function(d) {
                        return d.myCircleStyle;
                    })

                d3.selectAll(".link")
                    .data(newGraph.links)
                    .attr("x1", function(d) {
                        return d.myx1;
                    })
                    .attr("x2", function(d) {
                        return d.myx2;
                    })
                    .attr("y1", function(d) {
                        return d.myy1;
                    })
                    .attr("y2", function(d) {
                        return d.myy2;
                    });

                myGraph.simulation.nodes(newGraph.nodes);
                myGraph.simulation.force("link").links(newGraph.links);
                myGraph.simulation.tick();
                myGraph.ticked();
                // if (myself.state.hasForce) {
                //     myself.simulation.alphaTarget(0.3).restart();
                // }


                // mySvg.outerHTML = contents;
                //     myself.simulation = d3.forceSimulation()
                //         .stop()
                //         .force("link", d3.forceLink().id(function(d) {
                //             return d.id;
                //         })
                //             // .strength(function(l){
                //             //     return 0.2;
                //             // })
                //                 .distance(myGraph.defaults.forceLinkDistance)
                //         )
                //     .force("charge", d3.forceManyBody()
                //         .strength(myGraph.defaults.forceChargeStrength)
                //             .distanceMin(myGraph.defaults.forceChargeDistanceMin)
                //             .distanceMax(myGraph.defaults.forceChargeDistanceMax)
                //     )
                //     .force("collide", d3.forceCollide(10)
                //         .strength(0.9)

                //     )
                //     .force("center", d3.forceCenter(this.width / 2, this.height / 2));
                // myGraph.simulation.nodes(myGraph.graph.nodes);
                // myGraph.simulation.force("link").links(myGraph.graph.links);
                myGraph.refreshGraph();
                // myGraph.simulation.tick();
                // myGraph.ticked();
                // d3.select("#svgDiv").outerHTML = contents;

                // var newNodes = d3.selectAll(".link");

                // console.log(JSON.stringify(newNodes));
                // console.log(newNodes);
                // console.log(myGraph.graph.links);

                // var myNodes = contents.querySelectorAll(".node");
                // console.log(myNodes.length);
                // console.log(JSON.stringify(myNodes));

                // myGraph.graph.nodes.splice(0, myGraph.graph.nodes.length);
                // myGraph.graph.links.splice(0, myGraph.graph.links.length);


                // d3.selectAll(".node")
                //     .each(function(d, i) {
                //         alert(JSON.stringify(d));
                //         // myself.graph.nodes[i] = d.data("id");
                //     });

                //             console.log(JSON.stringify(data));
                //             myGraph.graph.links = [].map.call(data.querySelectorAll(".link"), function(node) {
                //                 console.log(JSON.stringify(node));
                //                 return {
                //                     source: node.getAttribute("data-source"),
                //                     target: node.getAttribute("data-target")
                //                 };
                //             });

                // console.log(myGraph.graph.nodes.length + "\n" + myGraph.graph.links.length);
                // console.log(JSON.stringify(myGraph.graph.links));


                // d3.selectAll(".link")
                //     .each(function(d,i){
                //         if(!myGraph.state.alerted){
                //         alert(JSON.stringify(d));
                //             myGraph.state.alerted = true;
                //         }
                //         // myself.graph.links[i] = d;
                //     });
                // return;
                // d3.selectAll(".node")
                //     .each(function(d,i){
                //         myself.graph.nodes[i] = d;
                //     });

                // alert(mygraph.graph.nodes.first().id)

                // var newSvg = mySvg.parentNode.replaceChild(xmlDoc, mySvg);
                // alert( "Got the file \n"
                //     +"name: " + f.name + "\n"
                //         +"type: " + f.type + "\n"
                //         +"size: " + f.size + " bytes\n"
                //         + "starts with: " + contents.substr(1, contents.indexOf("\n"))
                // );

            }
            r.readAsText(f);
        } else {
            alert("Failed to load file");
        }
    }

    function test() {
        // console.log(myGraph.zoom);
        // console.log(d3.select("#containergroup"));
        // console.log(d3.zoomIdentity);
        // var myTransition = d3.transition()
        //     .duration(750).call(myGraph.zoom.transform, d3.zoomIdentity);

        // var myTransition = d3.transition()
        //     .duration(750)
        //     .call(myGraph.zoom.transform,
        //         d3.zoomIdentity.translate(12,34).scale(1.5)
        //     );

        d3.select("#svgid").transition()
            .duration(3000)
            .ease(d3.easeLinear)
            .call(myGraph.zoom.transform, d3.zoomIdentity.translate(12, 34).scale(1.5));

        // myGraph.svg.call(myGraph.zoom.transform, d3.zoomIdentity.translate(12,34).scale(1.5))
        // myGraph.svg.call(myGraph.zoom.transform, d3.zoomIdentity.translate(12,34).scale(1.5))
        // var t = d3.transition()
        //     .duration(5750)
        //     .ease(d3.easeLinear);
        // d3.selectAll("circle").transition(t)
        //     .style("fill", "red");


        // var t = d3.transition().duration(750).call(myGraph.zoom.transform, d3.zoomIdentity);
        // d3.select("#containergroup").transition(t);
        // console.log(myGraph.zoom);
        // console.log(d3.zoomTransform(myGraph.container));
        // console.log(d3.zoomTransform(this));
        // console.log(myGraph.container.("transform"));
        // console.log(myGraph.zoom.transform);
    }

    // Set the current value to null when clicking,
    // This makes sure the 'change' event is fired when reloading
    // the same file
    document.getElementById('upload').addEventListener('click', function() {
        this.value = null
    });
    document.getElementById('upload').addEventListener('change', readSingleFile);
    $('#fakeUpload').click(function(e) {
        e.preventDefault();
        $('#upload').trigger('click');
    });

    // $('#upload').on('click', function () {
    //     this.value = null;
    // };

    // $('#upload').on('', readSingleFile);



    // if($.browser.mozilla) {
    //     $('.trigger-file-input').click(function() {
    //         $('#fileinput').click();
    //     });
    // }
