// 1 d3.select("body")
//      .append("svg")
//      .attr("width", 50)
//      .attr("height", 50)
//      .append("circle")
//      .attr("cx", 25)
//      .attr("cy", 25)
//      .attr("r", 25)
//      .style("fill", "purple");





function setupSvg() {

    var svgSelection = d3.select("body")
        .append("svg")
        .attr("width", window.innerWidth - 320)
        .attr("height", window.innerHeight - 52)


    //##################################################
    //# To Check if the images won't overlap with the controll bars
    //##################################################
    svgSelection.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 2000)
        .attr("height", 2000);
}
