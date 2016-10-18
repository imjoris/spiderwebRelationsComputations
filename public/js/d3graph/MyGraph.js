// myglobal = this;
//##################################################
//# Initialization of MyGraph
//##################################################
// {{{
function MyGraph() {
    var self = this;
    this.maxId = 0;
    this.graph = {
        "nodes": [],
        "links": []
    };
    this.error = null;
    this.consts = {
        BACKSPACE_KEY: 8,
        DELETE_KEY: 46,
        ENTER_KEY: 13,
    };
    this.defaults = {
        forceLinkDistance: 100,
        forceChargeStrength: -50,
        forceChargeDistanceMin: 20,
        forceChargeDistanceMax: 800,

        forceCollideRadius: 10,
        forceCollideStrength: 0.9,
    };
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
    };
    this.width = window.innerWidth - 320;
    this.height = window.innerHeight - 52;


    //##################################################
    //# Draw the graph
    //##################################################
    // {{{
    this.refreshGraph = function() {
        var links = this.graph.links;
        var nodes = this.graph.nodes;

        var link = this.containerLinks.selectAll(".link")
            .data(links, function(d) {
                return d.source.id + '-' + d.target.id;
                // return d;
            });

        link.enter()
            .append("line")
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

        var gnodes = this.containerNodes.selectAll('.node')
            .data(nodes, function(d) {
                // return d.id + "-" + d.group;
                return d.id;
                // return d;
            });

        var newNodes = gnodes.enter()
            .append('g')
            .attr("class", "node")
            .call(d3.drag()
                .on("start", this.dragstarted)
                .on("drag", this.dragged)
                .on("end", this.dragended));

        var node = newNodes.append("circle")
            // .on("mousedown", this.nodeMouseDown)
            // .on("mouseup", this.nodeMouseUp)
            .on("click.mynode", this.nodeClick)
            .on("mouseover.mynode", this.nodeMouseOver)
            .on("mouseout.mynode", this.nodeMouseOut)
            .attr("class", "nodecircle")
            .style("fill", function(d) {
                return self.color(d.group);
            });

        var labels = newNodes.append("svg:text")
            .attr("class", "nodeLabel")
            .attr("x", 7)
            .attr("dy", ".35em")
            .text(function(d) {
                return d.name;
            });


        this.simulation.nodes(nodes);
        this.simulation.force("link").links(links);
        if (this.state.hasForce) {
            this.simulation.alphaTarget(0.3).restart();
        }

        labels.exit().remove();
        newNodes.exit().remove();
        node.exit().remove();
        link.exit().remove();
    };
    // }}} end of refreshGraph()

    //##################################################
    //# Update nodes on each force tick
    //##################################################
    // {{{
    this.ticked = function() {
        self.containerLinks.selectAll(".link")
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

        self.containerNodes.selectAll('.node')
            .attr("transform", function(d) {
                var nX = d.fx ? d.fx : d.x;
                var nY = d.fy ? d.fy : d.y;
                return 'translate(' + [nX, nY] + ')';
            });
        // .attr("x", function(d){return d.x})
        // .attr("y", function(d){return d.y});
        self.updateDragLine();
    };
    // }}}  end of ticked

    //##################################################
    //# Update the line to connect nodes
    //# Make it follow the pointer position
    //##################################################
    // {{{
    self.updateDragLine = function() {
        if (self.state.shiftNodeDrag) {
            var myX = 0;
            var myY = 0;
            try {
                var coordinates = self.getMouseCoordinates();
                var myX = coordinates[0];
                var myY = coordinates[1];
            } catch (err) {
                console.log(err);
                return;
            }

            var myX = coordinates[0];
            var myY = coordinates[1];

            self.dragline.attr("class", "dragline");
            var dnode = self.state.mouseDownNode;
            self.dragline
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
            self.dragline.attr("class", "hiddendragline");
        }
    };
    // }}}

    //##################################################
    //# SVG mouse event listeners
    //##################################################
    // {{{
    this.svgMouseMove = function(d) {
        if (!self.state.mouseOverNode) {
            if (self.state.shiftNodeDrag) {
                self.updateDragLine();
            }
        }
    };

    this.svgClick = function(d) {
        d3.event.stopPropagation();
        // if (!self.state.shiftNodeDrag && myself.state.mouseOverNode == null) {
        console.log("svg click");
        if (!self.state.shiftNodeDrag) {
            if (d3.event.shiftKey) {
                self.stopForce();
                var coordinates = d3.mouse(self.container.node());
                var myX = coordinates[0];
                var myY = coordinates[1];

                self.maxId += 1;
                var newNode = {
                    "id": self.maxId,
                    "name": "New Node",
                    "group": 3,
                    "x": myX,
                    "y": myY,
                    "fx": null,
                    "fy": null,
                    // "fx": myX,
                    // "fy": myY,
                };
                // console.log(newNode);
                self.graph.nodes.push(newNode);
                self.refreshGraph();
                // self.simulation.tick();
                self.ticked();
            }
        } else {
            if (!self.state.mouseOverNode) {
                self.state.shiftNodeDrag = false;
                self.updateDragLine();
            }
        }
        if (self.state.selectedNode !== null && self.state.mouseOverNode === null) {
            d3.select(".selectednode")
                .attr("class", "nodecircle");
            self.state.selectedNode = null;
        }
    };
    // end svg mouse event listeners
    // }}}

    //##################################################
    //# Update the window on a resize
    //##################################################
    // {{{
    this.updateWindow = function(svg) {
        var docEl = document.documentElement,
            bodyEl = document.getElementsByTagName('body')[0];
        var x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
        var y = window.innerHeight || docEl.clientHeight || bodyEl.clientHeight;
        svg.attr("width", x).attr("height", y);
    };
    // }}}

    //##################################################
    //# Zoom event listeners
    //##################################################
    // {{{
    self.zoomed = function() {
        var myTransform = d3.event.transform;
        self.container
            .attr("transform", myTransform);

        // console.log(myTransform);
        self.state.zoomTransform = myTransform;
        // console.log(self.zoom.translate());

    };

    // self.zoomEnd = function() {
    //     // alert('mouseup');
    // };
    // }}}

    //##################################################
    //# Drag event listeners
    //##################################################
    // {{{
    this.dragstarted = function(d) {
        if (!self.state.shiftNodeDrag) {
            if (self.state.hasForce) {
                if (!d3.event.active) self.simulation.alphaTarget(0.3).restart();
            }
            // d.fx = d.x;
            // d.fy = d.y;
        }
    };


    this.dragged = function(d) {
        if (!self.state.shiftNodeDrag) {
            var coordinates = new Array();
            try {
                coordinates = self.getMouseCoordinates();
                d.x = coordinates[0];
                d.y = coordinates[1];
                // d.fx = coordinates[0];
                // d.fy = coordinates[1];
                // self.simulation.tick();
                self.ticked();
            } catch (e) {
                return;
            }
        } else {
            self.updateDragLine();
        }
    };

    this.dragended = function(d) {
        if (!self.state.shiftNodeDrag) {
            if (self.state.hasForce) {
                if (!$('#fixOnDragBox').is(":checked")) {
                    if (!d3.event.active) self.simulation.alphaTarget(0.3);
                    d.fx = null;
                    d.fy = null;
                }
            }
        }
    };

    // }}} end drag event listeners

    //##################################################
    //# Mouse
    //##################################################
    // {{{

    //##################################################
    //# General function to get the mouse coordinates
    //##################################################
    // {{{
    self.getMouseCoordinates = function() {
        var coordinates = [];
        try {
            coordinates = d3.mouse(self.container.node());
        } catch (err) {
            if (d3.event) {
                coordinates = [d3.event.x, d3.event.y];
            } else {
                return;
            }
        }
        self.state.mouseX = coordinates[0];
        self.state.mouseY = coordinates[1];

        return coordinates;
    };
    // }}}

    //##################################################
    //# Node mouse event listeners
    //##################################################
    // {{{

    //     self.nodeMouseDown = function(d) {
    //         d3.event.stopPropagation();
    //         if (d3.event.shiftKey) {
    //             self.state.shiftNodeDrag = true;
    //             self.state.mouseDownNode = d;
    //         }
    //     };

    // self.nodeMouseUp = function(d) {
    //     d3.event.stopPropagation();
    // };

    this.nodeClick = function(d) {
        console.log("nodeclick");
        d3.event.stopPropagation();
        if (self.state.shiftNodeDrag) {
            if (d.id !== self.state.mouseDownNode.id) {
                var newLink = {
                    "source": self.state.mouseDownNode,
                    "target": d
                }

                for (var i = 0; i < self.graph.links.length; i++) {
                    var alink = self.graph.links[i];
                    var alinkSrcId = alink.source.id;
                    var alinkTarId = alink.target.id;
                    if ((alinkSrcId === newLink.target.id && alinkTarId === newLink.source.id) || (alinkSrcId === newLink.source.id && alinkTarId === newLink.target.id)) {
                        alert("link already exists");
                        console.log("link already exists");
                        self.state.shiftNodeDrag = false;
                        self.updateDragLine();
                        return;
                    }
                }

                self.graph.links.push(newLink);
                self.refreshGraph();
                self.ticked();

                self.state.mouseDownNode = null;
                self.state.shiftNodeDrag = false;
                self.updateDragLine();

            }

            // console.log(self.state.mouseDownNode);
            // console.log(self.state.mouseOverNode);
            // console.log(self.state.shiftNodeDrag);

            // console.log(self.state.shiftNodeDrag);
            // } else {
            // console.log("1");
        } else {
            if (d3.event.shiftKey) {
                self.state.mouseDownNode = d;
                if (!$('#keepTheForceBox').is(":checked")) {
                    self.stopForce();
                }
                self.state.shiftNodeDrag = true;
                self.updateDragLine();
            } else {
                // if(self.state.selectedNode){
                //     self.state.selectedNode
                //         .attr("class", "nodecircle");
                //     self.state.selectedNode = null;
                // }
                // if (self.state.selectedNode){
                //     alert(self.state.selectedNode.id + "\n" + d.id);
                // }
                if (self.state.selectedNode && self.state.selectedNode.id === d.id) {
                    d3.select(".selectednode")
                        .attr("class", "nodecircle");
                    self.state.selectedNode = null;
                } else if (!self.state.selectedNode) {
                    d3.select(this).attr("class", "selectednode");
                    self.state.selectedNode = d; //d3.select(self);
                    // updateSidebarInfo();
                    // }
                } else {
                    d3.select(".selectednode")
                        .attr("class", "nodecircle");
                    d3.select(this).attr("class", "selectednode");
                }
            }
        }
    };

    self.nodeMouseOver = function(d) {
        d3.event.stopPropagation();
        console.log("node over");
        self.state.mouseOverNode = d;
        self.dragline
            .attr("x2", d.x)
            .attr("y2", d.y)
        // self.svg.on("click.mysvg", null);
        // d3.selectAll("circle").on("click.mynode", this.nodeClick)
    };
    self.nodeMouseOut = function(d) {
        d3.event.stopPropagation();
        console.log("node out");
        self.state.mouseOverNode = null;
        // d3.selectAll("circle").on("click.mynode", null);
        // self.svg.on("click.mysvg", this.svgClick)
    };
    // end node mouse event listeners
    // }}}

    //
    // end mouse functions
    // }}}

    //##################################################
    //# Key events
    //##################################################
    // {{{

    self.svgKeyDown = function(d) {
        switch (d3.event.keyCode) {
            case self.consts.BACKSPACE_KEY:
            case self.consts.DELETE_KEY:
                if (self.state.selectedNode) {

                    self.stopForce();
                    self.removeNodeById(self.state.selectedNode.id);
                    // var mynodes = self.graph.nodes;
                    // for(var i = 0; i < mynodes.length; i++) {
                    //     if(mynodes[i] === self.state.selectedNode) {
                    //         self.graph.nodes.splice(i, 1);
                    //     }
                    // }

                    // var neighBorLinks = new Array();
                    // var nodesToRemove = new Array();

                    var mylinks = self.graph.links;
                    for (var i = 0; i < mylinks.length; i++) {
                        if (mylinks[i].source.id == self.state.selectedNode.id || mylinks[i].target.id == self.state.selectedNode.id) {
                            // neighBorLinks.push(i);
                            // self.graph.links.splice(i, 1);
                            self.removeLinkBySrcTar(mylinks[i].source, mylinks[i].target);
                        }
                    }



                    // self.simulation.nodes(myself.graph.nodes);
                    // self.simulation.force("link").links(myself.graph.links);

                    // self.graph.nodes.splice(myself.state.selectedNode);

                    self.container.selectAll(".node").data(self.graph.nodes, function(d) {
                            // return d.id + "-" + d.group;
                            return d.id
                                // return d;
                        })
                        .exit()
                        .remove();

                    self.container.selectAll(".link")
                        .data(self.graph.links, function(d) {
                            return d.source.id + '-' + d.target.id;
                            // return d;
                        })
                        .exit()
                        .remove();

                    self.refreshGraph();
                    self.simulation.tick();
                    self.ticked();

                    d3.select(".selectednode")
                        .attr("class", "nodecircle");
                    self.state.selectedNode = null;

                    if ($('#keepTheForceBox').is(":checked")) {
                        self.startForce();
                    }

                    // self.graph.nodes.splice(myself.state.selectedNode);
                    // self.refreshGraph();
                    // self.simulation.tick();
                    // self.ticked();
                }
                break;
        }
    };


    self.removeNodeById = function(id) {
        self.graph.nodes = self.graph.nodes.filter(e => e.id !== id);

        // var mynodes = self.graph.nodes;
        // for(var i = 0; i < mynodes.length; i++) {
        //     if(mynodes[i].id === id) {
        //         self.graph.nodes.splice(i, 1);
        //     }
        // }
    };

    self.removeLinkBySrcTar = function(src, tar) {
        self.graph.links = self.graph.links.filter(e => !(
            (e.source == src && e.target == tar) ||
            (e.source == tar && e.target == src)))

        // var mylinks = self.graph.links;
        // for(var i = 0; i < mylinks.length; i++) {
        //     if((mylinks[i].source == src && mylinks[i].target == tar)
        //         || (mylinks[i].source == tar && mylinks[i].target == src)) {
        //         self.graph.links.splice(i, 1);
        //     }
        // }
    };
    // }}}

    //##################################################
    //# Public functions used by the interface
    //##################################################
    // {{{
    this.setGraph = function(newGraph) {
        this.graph = newGraph;
        // console.log(this.graph.links);
        // console.log(this.simulation);
        // this.simulation.nodes(this.graph.nodes);
        // this.simulation.force("link").links(this.graph.links);
        this.refreshGraph();
    };

    this.startForce = function() {
        this.state.hasForce = true;
        this.simulation.alphaTarget(0.3).restart();
        $("#toggleForceId").text("Pause");
    };

    this.stopForce = function() {
        this.state.hasForce = false;
        this.simulation.stop();
        $("#toggleForceId").text("Play");
    };

    this.hideLabels = function() {
        this.container.selectAll(".nodeLabel")
            .style("opacity", function() {
                return $('#hideLabelsBox').is(":checked") ? 0 : 1
            });
    };
    // end public functions
    // }}}


    this.zoom = d3.zoom()
        .scaleExtent([-10, 20])
        .on("zoom", this.zoomed)
        // .on("end", this.zoomEnd);

    this.svg = d3.select("#svgDiv")
        .append("svg")
        .attr("id", "svgid")
        .attr("width", this.width)
        .attr("height", this.height)
        .on("click.mysvg", this.svgClick)
        .on("mousemove", this.svgMouseMove)
        .call(this.zoom)
        .on("dblclick.zoom", null)

    d3.select("body")
        .on("keydown", this.svgKeyDown)

    // listen for resize
    window.onresize = function() {
        self.updateWindow(self.svg);
    };

    this.container = this.svg.append("svg:g").attr("id", "containergroup");
    this.containerLinks = this.container.append("svg:g").attr("id", "containerlinksgroup");
    this.containerNodes = this.container.append("svg:g").attr("id", "containernodesgroup");
    this.containerDragLine = this.container.append("svg:g").attr("id", "containerdraglinegroup");
    this.color = d3.scaleOrdinal(d3.schemeCategory20);

    this.dragline = this.containerDragLine.append("line")
        .attr("id", "draglineid")
        .attr("class", "hiddendragline");

    this.simulation = d3.forceSimulation()
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
        // .force("center", d3.forceCenter(this.width / 2, this.height / 2));

    this.simulation
        .on("tick", this.ticked);

}
// $(".nodecircle").on("hover", function(d) {
//     $(".nodecircle").off("click"); // Remove previous events, if have
//     $(".nodecircle").on("click", function(d) {
//         alert("Clicked!");
//     });
// });

// }}} end of initialiization

myGraph = new MyGraph();
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

    var myData = {
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
            var data = JSON.parse(contents);

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

            myGraph.maxId = Math.max.apply(Math, array.map(function(o) {
                return o.id;
            }))
            myGraph.maxId += 1;

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

            // console.log(newGraph.nodes);
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
    $('#upload').value = null;
    // this.value = null
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
