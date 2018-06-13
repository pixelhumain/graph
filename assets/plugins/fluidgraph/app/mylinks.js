FluidGraph.prototype.drawLinks = function(svgLinks){
  thisGraph = this;

  if (thisGraph.config.debug) console.log("drawLinks start");

  if (thisGraph.config.curvesLinks == "On")
  {
    svgLinks.attr("class", "link")
            .attr("id", function(d) { return "edge"+d.source.index + "_" + d.target.index })
            .attr("stroke", thisGraph.customLinks.strokeColor)
            .attr("stroke-width", thisGraph.customLinks.strokeWidth)
            .attr("d", function(d) {
                        var dx = d.target.x - d.source.x,
                            dy = d.target.y - d.source.y,
                            dr = Math.sqrt(dx * dx + dy * dy);
                        return "M" +
                            d.source.x + "," +
                            d.source.y + "A" +
                            dr + "," + dr + " 0 0,1 " +
                            d.target.x + "," +
                            d.target.y;
                      })
            .style("fill", "none")
  }
  else { //Off
    svgLinks.attr("class", "link")
            .attr("id", function(d) { return "edge"+d.source.index + "_" + d.target.index })
            .attr("stroke", thisGraph.customLinks.strokeColor)
            .attr("stroke-width", thisGraph.customLinks.strokeWidth)
            .attr("x1", function(d) { return d.source.x; })
    		  	.attr("y1", function(d) { return d.source.y; })
    		  	.attr("x2", function(d) { return d.target.x; })
    		  	.attr("y2", function(d) { return d.target.y; })
  }

  if (thisGraph.config.debug) console.log("drawLinks end");
}

FluidGraph.prototype.linkEdit = function(d3Edge, edgeData){
  thisGraph = this;

  if (thisGraph.config.debug) console.log("linkEdit start");

  d3.event.stopPropagation();

  var el = d3Edge;
  var p_el = d3.select(d3Edge.node().parentNode);

  var searchLabelIndex = "#label" + edgeData.source.index + "_" + edgeData.target.index;
  d3.select(searchLabelIndex).attr("visibility", "hidden");

  //Close opened linkEditBox
  d3.selectAll("#linkEditBox").remove();
  d3.selectAll("#fo_content_edited_linklabel").remove();

  thisGraph.state.editedLinkLabel = d3Edge.node();

  var linkEditBoxX = edgeData.source.x
                    + (edgeData.target.x - edgeData.source.x)/2
                    - thisGraph.customLinksLabel.width/2;
  var linkEditBoxY = edgeData.source.y
                    + (edgeData.target.y - edgeData.source.y)/2
                    -thisGraph.customLinksLabel.height/2;

  p_el.append("rect")
      .attr("id", "linkEditBox")
      .attr("class", "linkEditBox")
      .attr("x", linkEditBoxX )
      .attr("y", linkEditBoxY )
      .attr("width", thisGraph.customLinksLabel.width)
      .attr("height", thisGraph.customLinksLabel.height)
      .attr("rx", thisGraph.customLinksLabel.curvesCorners)
      .attr("ry", thisGraph.customLinksLabel.curvesCorners)
      .style("fill", thisGraph.customLinksLabel.fillColor)
      .style("stroke", thisGraph.customLinksLabel.strokeColor)
      .style("stroke-width", 2)
      .style("stroke-opacity", .5)
      .style("cursor", thisGraph.customNodes.cursor)
      .style("opacity", .8)

  /*
   *
   * Content of the linklabel
   *
   * */

  var fo_content_edited_linklabel = p_el
        .append("foreignObject")
        .attr("id","fo_content_edited_linklabel")
        .attr("x", linkEditBoxX)
        .attr("y", linkEditBoxY)
        .attr("width", thisGraph.customLinksLabel.width)
        .attr("height", thisGraph.customLinksLabel.height)
        .on("mousedown",null)
        .on("mouseup",null)
        .on("mouseover",null)
        .on("mousedown",function(d){
          d3.event.stopPropagation();
        })
        .on("dblclick",function(d){
          d3.event.stopPropagation();
        })
        .on("click",function(d){
          d3.event.stopPropagation();
        })

  var fo_xhtml_content_edited_linklabel = fo_content_edited_linklabel
        .append('xhtml:div')
        .attr("class", "fo_xhtml_content_edited_linklabel")
        //Warning : using css doesn't work !
        .attr("style", "width:"+thisGraph.customLinksLabel.width+"px;"
                      +"height:"+thisGraph.customLinksLabel.height+"px;"
                      +"cursor:"+thisGraph.customNodes.cursor+";"
                      +"position:static;padding:10px")

  //linklabel Segment
  var  linklabel_segment = fo_xhtml_content_edited_linklabel
        .append("div")
        .attr("class", "ui raised segment")
        .attr("style", "position:static;margin:0px;padding:2px")

  //Form Segment
  var form_segment = linklabel_segment
        .append("div")
        .attr("class", "ui form top attached segment")
        .attr("style", "position:static;margin-top:0px;padding:0px")

    /*
     *
     * Description
     *
     * */

  //Node label 1 (description)
  var field_type = form_segment
        .append("div")
        .attr("class", "field")
        .attr("style", "margin:0px")

  var text_edited_linklabel = field_type
    .append("label")
    .attr("style", "margin:0;")
    .text("Predicat")

  //Node textarea
  var textarea_edited_linklabel = form_segment
    .append("textarea")
    .attr("id", "textarea_edited_linklabel")
    .attr("style", "padding:0;min-height:0;height:30px;width:170px;")
                .text(function() {
                  this.focus();
                    return edgeData["@type"];
                })


  if (thisGraph.config.debug) console.log("linkEdit end");
}

FluidGraph.prototype.addDataLink = function(sourceNode, targetNode)
{
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("addDataLink start");

  console.log("addDataLink start (sourceNode, targetNode)", sourceNode, targetNode);

  // draw link between mouseDownNode and this new node
  var sourceNodeIdentifier = sourceNode["@id"];
  var targetNodeIdentifier = targetNode["@id"];

  var sourceIndex = thisGraph.searchIndexNodeFromIdentifier(thisGraph.d3Data.nodes, sourceNodeIdentifier);
  var targetIndex = thisGraph.searchIndexNodeFromIdentifier(thisGraph.d3Data.nodes, targetNodeIdentifier);

  var sourceObj = thisGraph.d3Data.nodes[sourceIndex];
  var targetObj = thisGraph.d3Data.nodes[targetIndex];
  var newlink = { "index" : thisGraph.getLinkIndex(),
                  "@id" : thisGraph.customLinks.uriBase + thisGraph.getLinkIndex(),
                  "@type" : thisGraph.customLinks.predicate,
                  "source" : sourceObj,
                  "target" : targetObj,
                };

  thisGraph.d3Data.edges.push(newlink);

  console.log("addDataLink End d3Data = ", thisGraph.d3Data);

  if (thisGraph.config.debug) console.log("addDataLink end");

  return newlink;
}

FluidGraph.prototype.drawNewLink = function (targetNode, sourceNode)
{
  thisGraph = this;

  if (thisGraph.config.debug) console.log("drawNewLink start");

  console.log("drawNewLink start (targetNode, sourceNode)", targetNode, sourceNode);

  thisGraph.OrderNodesInSvgSequence();

	//Don't create a link if there is already one
	var searchLinkSourceTarget = d3.select("#edge"+sourceNode.index+"_"+targetNode.index).node();
	var searchLinkTargetSource = d3.select("#edge"+targetNode.index+"_"+sourceNode.index).node();

	if (!searchLinkSourceTarget && !searchLinkTargetSource)
	{
		var newLink = d3.svg.diagonal()
				.source({"x":sourceNode.x, "y":sourceNode.y})
				.target({"x":targetNode.x, "y":targetNode.y})

    var existLinksLabel = d3.select(".linksLabel").node();
    var beforeElement;
    if (existLinksLabel)
      beforeElement = ".linksLabel";
    else {
      beforeElement = "#node";
    }

    var newPath = thisGraph.bgElement
				.insert("path", beforeElement)
        .attr("class", "link")
        .attr("id", "edge"+sourceNode.index + "_" + targetNode.index)
        .style("stroke", thisGraph.customLinks.strokeColor)
        .style("stroke-width", thisGraph.customLinks.strokeWidth)
				.style("fill", "none")
				.attr("d", newLink)

    thisGraph.svgLinksLabel = thisGraph.bgElement.selectAll(".linksLabel")
          .data(thisGraph.d3Data.edges)
          .enter()
          .insert("text", "#node")
          .attr("class", "linksLabel")
          .attr("id", function(d) { return "label" + d.source.index + "_" + d.target.index})
      		.attr("x", function(d) { return d.source.x + (d.target.x - d.source.x)/2; })
          .attr("y", function(d) { return d.source.y + (d.target.y - d.source.y)/2; })
          .attr("text-anchor", "middle")
          .attr("visibility", "hidden")
          .attr("pointer-events", "none")
          .attr("cursor", "default")
      	  .style("fill", "#000")
          .text(function(d) {
            return d["@type"];
          });

		var totalLengthPath = newPath.node().getTotalLength();

		newPath
			.attr("stroke-dasharray", totalLengthPath + " " + totalLengthPath)
			.attr("stroke-dashoffset", totalLengthPath)
			.transition()
			.duration(thisGraph.customNodes.transitionDurationComeBack)
			.attr("stroke-dashoffset", 0)
			.each("end", function() {
				newPath.attr("stroke-dasharray", "none")

        thisGraph.svgLinks = thisGraph.bgElement.selectAll(".link")
                      			.data(thisGraph.d3Data.edges)

        thisGraph.svgLinks.on("mousedown", function(d){
                              thisGraph.linkOnMouseDown.call(thisGraph, d3.select(this), d);
                            })
                            .on("mouseup", function(d){
                              thisGraph.state.mouseDownLink = null;
                            })
                            .on("mouseover", function(d){
                              d3.select(this)
                              .transition()
                              .duration(thisGraph.customLinks.transitionDurationOverLinks)
                              .attr("stroke-width", thisGraph.customLinks.strokeWidth+10)
                              thisGraph.linkOnMouseDown.call(thisGraph, d3.select(this), d);
                            })
                            .on("mouseout", function(d){
                              d3.select(this)
                              .transition()
                              .duration(thisGraph.customLinks.transitionDurationOverLinks)
                              .attr("stroke-width", thisGraph.customLinks.strokeWidth)
                              thisGraph.state.mouseDownLink = null;
                              thisGraph.removeSelectFromLinks();
                            })
                            .on("dblclick", function(d){
                              thisGraph.linkEdit.call(thisGraph, d3.select(this), d);
                            })
      })
	}

  console.log("drawNewLink end d3Data = ", thisGraph.d3Data);

  if (thisGraph.config.debug) console.log("drawNewLink end");
}

FluidGraph.prototype.getLinkIndex = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("getLinkIndex start");
  var nextLinkIndex = 0;

  if (thisGraph.d3Data.edges.length)
  {
    thisGraph.d3Data.edges.forEach(function (edge){
      if (edge.index >= nextLinkIndex)
        nextLinkIndex = edge.index+1;
    })
  }

  if (thisGraph.config.debug) console.log("getLinkIndex end");
  return nextLinkIndex;
}

FluidGraph.prototype.replaceSelectLinks = function(d3Edge, edgeData){
  var thisGraph = this;
  d3Edge.classed(thisGraph.consts.selectedClass, true);

  var searchLabelIndex = "#label" + edgeData.source.index + "_" + edgeData.target.index;
  d3.select(searchLabelIndex).attr("visibility", "visible");

  if (thisGraph.state.selectedLink){
    thisGraph.removeSelectFromLinks();
  }
  thisGraph.state.selectedLink = edgeData;
};

FluidGraph.prototype.removeSelectFromLinks = function(){
  var thisGraph = this;
  thisGraph.svgLinks.filter(function(link){
    return link === thisGraph.state.selectedLink;
  }).classed(thisGraph.consts.selectedClass, false);

  //Hide every linkslabel
  thisGraph.bgElement.selectAll(".linksLabel").attr("visibility", "hidden");

  thisGraph.state.selectedLink = null;
};

FluidGraph.prototype.linkOnMouseDown = function(d3path, d){
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("linkOnMouseDown start");

  d3.event.stopPropagation();
  thisGraph.state.mouseDownLink = d;

  if (thisGraph.state.selectedNode){
    thisGraph.removeSelectFromNode(thisGraph.state.selectedNode);
  }

  var prevEdge = thisGraph.state.selectedLink;
  if (!prevEdge || prevEdge !== d){
    thisGraph.replaceSelectLinks(d3path, d);
  } else{
    thisGraph.removeSelectFromLinks();
  }

  if (thisGraph.config.debug) console.log("linkOnMouseDown end");
}

FluidGraph.prototype.deleteLink = function() {
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("deleteLink start");

  if (thisGraph.d3Data.edges.length > 0)
  {
    thisGraph.d3Data.edges.splice(thisGraph.d3Data.edges.indexOf(thisGraph.state.selectedLink), 1);
    thisGraph.state.selectedLink = null;
    thisGraph.drawGraph();
  }
  else {
    console.log("No link to delete !");
  }

  if (thisGraph.config.debug) console.log("deleteLink end");
}

FluidGraph.prototype.spliceLinksForNode = function (nodeid) {
  var thisGraph = this;

  var toSplice = thisGraph.d3Data.edges.filter(
    function(l) {
      return (l.source.index === nodeid) || (l.target.index === nodeid); });

  toSplice.map(
    function(l) {
      thisGraph.d3Data.edges.splice(thisGraph.d3Data.edges.indexOf(l), 1); });
}

FluidGraph.prototype.saveEditedLinkLabel = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("saveEditedLinkLabel start");

  var el = d3.select(thisGraph.state.editedLinkLabel);
  var p_el = d3.select(thisGraph.state.editedLinkLabel.parentNode);

  var linkLabelNewText;
  var textarea_edited_linklabel = p_el.select("#textarea_edited_linklabel");

  // thisGraph.state.editedLinkLabel = thisGraph.d3Data.edges[...]
  if (textarea_edited_linklabel.node().value == "")
    linkLabelNewText = thisGraph.customLinksLabel.blankNodeLabel;
  else
    linkLabelNewText = textarea_edited_linklabel.node().value;

  thisGraph.state.editedLinkLabel.__data__["@type"] = linkLabelNewText;

  //Modification of linklabel
  var searchLabelIndex = "#label" + thisGraph.state.editedLinkLabel.__data__.source.index + "_" + thisGraph.state.editedLinkLabel.__data__.target.index;
  d3.select(searchLabelIndex).text(linkLabelNewText);

  d3.selectAll("#linkEditBox").remove();
  d3.selectAll("#fo_content_edited_linklabel").remove();

  thisGraph.state.editedLinkLabel = null;

  if (thisGraph.config.debug) console.log("saveEditNode end");
}
