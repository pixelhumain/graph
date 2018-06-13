// Prototypes concerning nodes

FluidGraph.prototype.drawNodes = function(svgNodes) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("drawNodes start");

  var rectCircle;
  rectCircle = svgNodes
    .append("rect")
    .attr("id", "nodecircle")
    .attr("class", "nodecircle")
    .attr("x", function (d){
      var radius = thisGraph.getProportionalRadius(d);
      var x = -radius;
      return x;
    })
    .attr("y", function (d){
      var radius = thisGraph.getProportionalRadius(d);
      var y = -radius;
      return y;
    })
    .attr("width", function (d){
      var radius = thisGraph.getProportionalRadius(d);
      var width = radius*2;
      return width;
    })
    .attr("height", function (d){
      var radius = thisGraph.getProportionalRadius(d);
      var height = radius*2;
      return height;
    })
    .attr("rx", thisGraph.customNodes.curvesCornersClosedNode)
    .attr("ry", thisGraph.customNodes.curvesCornersClosedNode)
    // .style("fill", function(d) {
    //   return thisGraph.customNodes.colorType[d["@type"]];
    // })
    // .style("stroke", function(d) {
    //   if (thisGraph.config.makeLinkSelectingNode == "On")
    //   {
    //     if (thisGraph.config.remindSelectedNodeOnSave == true)
    //       if (d.fixed == true)
    //         thisGraph.replaceSelectNode.call(thisGraph, d3.select(this.parentNode), d);
    //   }
    //   else {
    //     if (d.fixed == true)
    //       d.fixed = false;
    //   }
    //
    //   return thisGraph.customNodes.strokeColorType[d["@type"]];
    // })
    // .style("stroke-width", thisGraph.customNodes.strokeWidth)
    //
    // background: linear-gradient( #555, #2C2C2C);
    // .style("stroke-opacity", thisGraph.customNodes.strokeOpacity)
    // .style("cursor", thisGraph.customNodes.cursor)
    // .style("opacity", 1)

    .attr("style",function(d) {
      var style =
                  "fill:" + thisGraph.customNodes.colorType[d["@type"]] + ";"
                  +"stroke:"+ thisGraph.customNodes.strokeColorType[d["@type"]] + ";"
                  +"stroke-width:"+ thisGraph.customNodes.strokeWidth + ";"

      return style;
    })

    .style("stroke-opacity", thisGraph.customNodes.strokeOpacity)
    .style("cursor", thisGraph.customNodes.cursor)
    .style("opacity", 1)

  if (thisGraph.config.displayIndex == "On")
    thisGraph.displayIndex(svgNodes)

  if (thisGraph.customNodes.displayType == "On")
    thisGraph.displayType(svgNodes)

  if (thisGraph.customNodes.displayText == "On")
    thisGraph.displayText(svgNodes)

  if (thisGraph.config.debug) console.log("drawNodes end");
}

FluidGraph.prototype.getProportionalRadius = function(d) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("getProportionalRadius start");

  var radius;

  if (thisGraph.config.proportionalNodeSize == "On")
  {
    var neighbourNodesAndLinks = thisGraph.getNeighbourNodesAndLinks(d);
    var nbNeighbourNodes = neighbourNodesAndLinks.nodes.length;

    radius = (thisGraph.customNodes.widthClosed / 2) + (nbNeighbourNodes*thisGraph.customNodes.indiceProp);
    if (radius > thisGraph.customNodes.maxRadius)
      radius = thisGraph.customNodes.maxRadius
  }
  else radius = thisGraph.customNodes.maxRadius

  if (thisGraph.config.debug) console.log("getProportionalRadius end");

  return radius
}

FluidGraph.prototype.displayText = function(svgNodes) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayText start");

  var fo_content_closed_node_label = svgNodes
    .append("foreignObject")
    .attr("id", "fo_content_closed_node_label")
    .attr("x", -thisGraph.customNodesText.widthMax / 2)
    .attr("y", -thisGraph.customNodesText.heightMax / 2)
    .attr("width", thisGraph.customNodesText.widthMax)
    .attr("height", thisGraph.customNodesText.heightMax)

  //fo xhtml
  var fo_xhtml_content_closed_node_label = fo_content_closed_node_label
    .append('xhtml:div')
    .attr("class", "fo_xhtml_content_closed_node_label")
    .attr("style", "width:"+thisGraph.customNodesText.widthMax+"px;"
                  +"height:"+thisGraph.customNodesText.heightMax+"px;")

  //label_closed_node
  var label_closed_node = fo_xhtml_content_closed_node_label
    .append("div")
    .attr("id", "label_closed_node")
    .attr("class", "label_closed_node")
    .attr("style", function(d) {
      var color = thisGraph.customNodes.neighbourColorTypeRgba[d["@type"]];
      var style = "background-color:rgba(" + color
                                  + "," + thisGraph.customNodesText.strokeOpacity + ");"
                                  + "border: 1px solid rgba("
                                  + color + ","
                                  + thisGraph.customNodesText.strokeOpacity + ");"
                                  + "-moz-border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                                  + "-webkit-border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                                  + "border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"

      // Supprimé lors de la suppression du editGraphMode
      // https://hackmd.lescommuns.org/CwIwhgDAHBAmCmBaATNAZo48CMVFQGYCNYRk0CIB2AVlgNmCA===?both
      if (d.hypertext != undefined)
        style += "cursor:pointer;"
      else
         style += "cursor:" + thisGraph.customNodes.cursor + ";"

      return style;
    })
    .html(function(d, i) {
      var label;
      if (d.label.length > thisGraph.customNodes.maxCharactersInLabel)
        label = d.label.substring(0,thisGraph.customNodes.maxCharactersInLabel)+" ...";
      else {
        label = d.label;
      }

      // Supprimé lors de la suppression du editGraphMode
      // https://hackmd.lescommuns.org/CwIwhgDAHBAmCmBaATNAZo48CMVFQGYCNYRk0CIB2AVlgNmCA===?both
      // if (thisGraph.config.editGraphMode == false && d.hypertext != undefined)
      // {
      //   return "<a id='a_closed_node_hypertext' href='"+d.hypertext+"' target='_blank'>"+label+"</a>";
      // }
      // else {
         return label;
      // }
    })
    // .on("mousedown",function(d){
    //   thisGraph.nodeOnMouseDown.call(thisGraph, d3.select(this.parentNode.parentNode.parentNode), d)})
    // .on("mouseup",function(d){
    //   thisGraph.nodeOnMouseUp.call(thisGraph, d3.select(this.parentNode.parentNode.parentNode), d)})
    // .on("dblclick",function(d){
    //   if (thisGraph.config.editGraphMode == true)
    //   {
    //     if (thisGraph.config.editWithDoubleClick == true)
    //       thisGraph.editNode.call(thisGraph, d3.select(this.parentNode.parentNode.parentNode), d);
    //   }
    //   else
    //     thisGraph.displayExternalGraph.call(thisGraph, d3.select(this.parentNode.parentNode.parentNode), d);
    // })

  //Rect to put events
  var fo_content_closed_node_events = svgNodes
    .append("foreignObject")
    .attr("id", "fo_content_closed_node_events")
    .attr("x", -thisGraph.customNodesText.widthMax / 2)
    .attr("y", -thisGraph.customNodesText.heightMax / 2)
    .attr("width", thisGraph.customNodesText.widthMax)
    .attr("height", thisGraph.customNodesText.heightMax)

  var fo_xhtml_content_closed_node_events = fo_content_closed_node_events
    .append('xhtml:div')
    .attr("class", "fo_xhtml_content_closed_node_events")
    .attr("style", function (d){
      var radius = thisGraph.getProportionalRadius(d);
      var marginLeft = (thisGraph.customNodesText.widthMax - radius*2)/2
      var style = "margin-left:" + marginLeft + "px;"
                  + "padding:" + radius + "px;"
                  + "width:"+ radius*2 + "px;"
                  + "height:"+ radius*2 + "px;position:static;"

      // Supprimé lors de la suppression du editGraphMode
      // https://hackmd.lescommuns.org/CwIwhgDAHBAmCmBaATNAZo48CMVFQGYCNYRk0CIB2AVlgNmCA===?both
      // if (thisGraph.config.editGraphMode == false && d.hypertext != undefined)
      //   style += "cursor:pointer;"
      // else
      //   style += "cursor:" + thisGraph.customNodes.cursor + ";"

      return style;
    })

    .on("mousedown",function(d){
      thisGraph.nodeOnMouseDown.call(thisGraph, d3.select(this.parentNode.parentNode), d)
    })
    .on("mouseup",function(d){
      thisGraph.nodeOnMouseUp.call(thisGraph, d3.select(this.parentNode.parentNode), d)
    })
    .on("mouseover",function(d){
      console.log("mouseover on node events")
      if (d3.select(this.parentNode.parentNode) !== thisGraph.state.openedNode)
      {
        thisGraph.nodeOnMouseOver.call(thisGraph, d3.select(this.parentNode.parentNode), d)
      }
    })
    .on("mouseout",function(d){
      console.log("mouseout on node events")
      if (d3.select(this.parentNode.parentNode) !== thisGraph.state.openedNode)
      {
        thisGraph.nodeOnMouseOut.call(thisGraph, d3.select(this.parentNode.parentNode), d)
      }
    })
    .on("dblclick",function(d){
        if (thisGraph.config.editWithDoubleClick == true)
          thisGraph.editNode.call(thisGraph, d3.select(this.parentNode.parentNode.parentNode), d);
    })

  if (thisGraph.config.debug) console.log("displayText end");
}

FluidGraph.prototype.displayIndex = function(svgNodes) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayIndex start");

  /* id circle */
  svgNodes
    .append("circle")
    .attr("id", "circle_index")
    .attr("class", "circle_index")
    .attr("cx", thisGraph.nodeIndexCircle.cxClosed)
    .attr("cy", thisGraph.nodeIndexCircle.cyClosed)
    .attr("r", thisGraph.nodeIndexCircle.r)
    .attr("fill", function(d) {
      return thisGraph.customNodes.colorType[d["@type"]];
    })

  /* Text of id */
  svgNodes
    .append("text")
    .attr("id", "text_index")
    .attr("class", "text_index")
    .attr("dx", thisGraph.nodeIndexCircle.dxClosed)
    .attr("dy", thisGraph.nodeIndexCircle.dyClosed)
    .attr("fill", "#EEE")
    .attr("font-weight", "bold")
    .text(function(d) {
      return d.index;
    })

  if (thisGraph.config.debug) console.log("displayIndex end");
}

FluidGraph.prototype.displayType = function(svgNodes) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayType start");

  /* type circle*/
  svgNodes
    .append("circle")
    .attr("id", "circle_type")
    .attr("class", "circle_type")
    .attr("cx", 0)
    .attr("cy", thisGraph.nodeTypeIcon.cyClosed)
    .attr("r", thisGraph.nodeTypeIcon.r)

  /* Image of type */
  var fo_type_image = svgNodes
    .append("foreignObject")
    .attr("id", "fo_type_image")
    .attr('x', thisGraph.nodeTypeIcon.xClosed)
    .attr('y', thisGraph.nodeTypeIcon.yClosed)
    .attr('width', 25)
    .attr('height', 25)

  //xhtml div image
  var fo_xhtml_type_image = fo_type_image
    .append('xhtml:div')
    .attr("id", "fo_div_type_image")
    .attr("class", "fo_div_image")
    .append('i')
    .attr("id", "fo_i_type_image")
    .attr("class", function(d) {
      return "ui large disabled " + thisGraph.customNodes.imageType[d["@type"]] + " icon";
    })
    .attr("style", "display:inline")

  if (thisGraph.config.debug) console.log("displayType end");
}

FluidGraph.prototype.changeIndexNode = function(node,index) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("changeIndexNode start");

  var el = d3.select(node);
  var text_index = el.select("#text_index");
  text_index.text(index);

  if (thisGraph.config.debug) console.log("changeIndexNode end");
}

FluidGraph.prototype.changeTypeNode = function(node,type) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayType start");

  var el = d3.select(node);

  var nodecircle = el.select("#nodecircle");
  nodecircle.style("fill", thisGraph.customNodes.colorType[type]);
  nodecircle.style("stroke", thisGraph.customNodes.strokeColorType[type]);

  var type_el = el.select("#fo_type_image");
  type_el.select('#fo_i_type_image').remove();
  type_el.select('#fo_div_type_image')
      .append('i')
        .attr("id", "fo_i_type_image")
        .attr("class", "ui large " + thisGraph.customNodes.imageType[type] + " icon")
      .attr("style", "display:inline")

  var circle_index_el = el.select("#circle_index");
  circle_index_el.style("fill", function(d) { return thisGraph.customNodes.colorType[type] } );

  if (thisGraph.config.debug) console.log("displayType end");
}

FluidGraph.prototype.displayOptionMenu = function(parentDiv,
                                                  x,
                                                  y,
                                                  dNode,
                                                  typeOpenEdit,
                                                  typeObject,
                                                  size) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayOptionMenu start");

  // d3.select("#open_neighbour_option").remove();

  optionDiv = parentDiv.append("xhtml:div")
                        .attr("class", "open_"+typeObject+"_option")
                        .attr("id", "open_"+typeObject+"_option")
                        .attr("style","background-color:rgba(" + thisGraph.customNodes.colorTypeRgba[dNode["@type"]]
                                                    + "," + thisGraph.customNodesText.strokeOpacity + ");"
                                                    // + "border: 1px solid rgba("
                                                    // + thisGraph.customNodes.strokeNeighbourColorTypeRgba[dNode["@type"]] + ","
                                                    // + thisGraph.customNodesText.strokeOpacity + ");"
                                                    + "-moz-border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                                                    + "-webkit-border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                                                    + "border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                                                    + "cursor:pointer;"
                                                    + "padding:2px;"
                                                    + "display: flex;"
                                                    + "flex-direction:row;"
                                                    + "justify-content:flex-end;"
                                                    + "align-content:center;"
                                                    + "align-items:center;"
                                                  )

  if (thisGraph.config.customOptions.edit)
  {
    if (typeOpenEdit == "opened")
    {
      var fo_xhtml_edit_image = optionDiv
      .append('div')
      .append('i')
      .attr("id", "fo_i_edit_image")
      .attr("class", "ui "+ size +" edit icon")
      .attr("style", "display:inline;"+"cursor:pointer;")
      .on("click",function(){
        var d3Node = thisGraph.searchD3NodeFromD(dNode);
        thisGraph.editNode.call(thisGraph, d3Node, dNode);
      })
      .append("title").text("Edit the node")
    }
    else { // edited
      var fo_xhtml_edit_image = optionDiv
        .append('div')
         .append('i')
          .attr("id", "fo_i_save_image")
          .attr("class", "ui "+ size +" save icon")
        .attr("style", "display:inline;"+"cursor:pointer;")
        .on("click",function(){
          thisGraph.closeNode.call(thisGraph, "edited");
        })
        .append("title").text("Open the node")
    }
  }

  if (thisGraph.config.customOptions.center)
  {
    var fo_xhtml_center_image = optionDiv
      .append('div')
       .append('i')
        .attr("id", "fo_i_center_image")
        .attr("class", "ui "+ size +" crosshairs icon")
      .attr("style", "display:inline;"+"cursor:pointer;")
      .on("click",function(){
        thisGraph.centerNode(dNode);
      })
      .append("title").text("Delete the node")
  }

  if (thisGraph.config.customOptions.focusContextOn)
  {
    var fo_xhtml_focus_image = optionDiv
        .append('div')
         .append('i')
          .attr("id", "fo_i_focus_image")
          .attr("class", "ui "+ size +" selected radio icon")
        .attr("style", "display:inline;"+"cursor:pointer;")
        .on("click",function(){
          thisGraph.focusContextNode(dNode);
        })
        .append("title").text("Delete the node")
  }

  if (thisGraph.config.customOptions.focusContextOff)
  {
    if (thisGraph.state.focusMode)
    {
      var fo_xhtml_focus_off_image = optionDiv
          .append('div')
           .append('i')
            .attr("id", "fo_i_focus_off_image")
            .attr("class", "ui "+ size +" reply icon")
          .attr("style", "display:inline;"+"cursor:pointer;")
          .on("click",function(){
            thisGraph.focusContextNodeOff(dNode);
          })
          .append("title").text("Delete the node")
    }
  }

  if (thisGraph.config.customOptions.hypertext)
  {
    if (dNode.hypertext)
    {
      var fo_xhtml_external_link_image_a = optionDiv
          .append('div')
          .append("a")
          .attr("href", thisGraph.getHypertext(dNode))
          .attr("target", "_blank")

          .append('i')
          .attr("id", "fo_i_hypertext_image")
          .attr("class", "ui "+ size +" external icon")
          .attr("style", "display:inline;"+"cursor:pointer;")
          .append("title").text(dNode.hypertext.substring(0, 20)+"...")
    }
  }

  if (thisGraph.config.customOptions.delete)
  {
    var fo_xhtml_delete_image = optionDiv
        .append('div')
         .append('i')
          .attr("id", "fo_i_delete_image")
          .attr("class", "ui "+ size +" delete icon")
        .attr("style", "display:inline;"+"cursor:pointer;")
        .on("click",function(){
          thisGraph.deleteNode(dNode["@id"]);
        })
        .append("title").text("Delete the node")
  }

  if (thisGraph.config.debug) console.log("displayOptionMenu end");
}

FluidGraph.prototype.addNodeOnBg = function(thisGraph) {
  //Warning, here, we need "this" for mouse coord

  if (thisGraph.config.debug) console.log("addNodeOnBg start");

  var newNode = thisGraph.addDataNode.call(this, thisGraph);
  thisGraph.drawGraph();

  if (thisGraph.config.force == "Off")
    thisGraph.movexy.call(thisGraph);

  var d3Node = thisGraph.searchD3NodeFromD(newNode);
  thisGraph.editNode.call(thisGraph, d3Node, newNode);

  if (thisGraph.config.debug) console.log("addNodeOnBg end");

  return newNode;
}

FluidGraph.prototype.addDataNode = function(thisGraph, newNode) {
  //Warning, here, we need "this" for mouse coord

  if (thisGraph.config.debug) console.log("addDataNode start");
  var xy = [];

  if (typeof this.__ondblclick != "undefined") //if after dblclick
  {
    xy = d3.mouse(this);
  } else {
    if (typeof newNode.x == "undefined")
    {
      xy[0] = thisGraph.config.xNewNode;
      xy[1] = thisGraph.config.yNewNode;
    }
  }

  //We check values cause this function can be call externally...
  if (typeof newNode == "undefined")
    var newNode = {}

  if (typeof newNode.label == "undefined")
    newNode.label = thisGraph.customNodes.blankNodeLabel;
  if (typeof newNode.hypertext == "undefined")
    newNode.hypertext = "";
  if (typeof newNode["@type"] == "undefined")
    newNode["@type"] = thisGraph.customNodes.blankNodeType;
  if (typeof newNode["@id"] == "undefined")
    newNode["@id"] = thisGraph.customNodes.uriBase + thisGraph.getNodeIndex();
  if (typeof newNode.index == "undefined")
    newNode.index = thisGraph.getNodeIndex();

  if (typeof newNode.px == "undefined")
    newNode.px = xy[0];
  if (typeof newNode.py == "undefined")
    newNode.py = xy[1];
  if (typeof newNode.x == "undefined")
    newNode.x = xy[0];
  if (typeof newNode.y == "undefined")
    newNode.y = xy[1];

  thisGraph.d3Data.nodes.push(newNode)

  if (thisGraph.config.debug) console.log("addDataNode end");
  return newNode;
}

FluidGraph.prototype.drawNewNode = function(sourceNode, targetNode) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("drawNewNode start");

  thisGraph.OrderNodesInSvgSequence();

  thisGraph.drawGraph();

  var d3Node = thisGraph.searchD3NodeFromD(targetNode);
  d3Node
      .attr("transform", function (d){return "translate("+sourceNode.x+","+sourceNode.y+")"})
      .transition()
      .duration(thisGraph.customNodes.transitionDurationComeBack)
      .attr("transform", function (d){return "translate("+targetNode.x+","+targetNode.y+")"})
      .each("end", function() {
        thisGraph.svgNodesEnter = thisGraph.bgElement.selectAll("#node")
        				              .data(thisGraph.d3Data.nodes, function(d) { return d.index;})

        thisGraph.bgElement.selectAll("#node").attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
      });

  if (thisGraph.config.debug) console.log("drawNewNode end");
}

FluidGraph.prototype.closeNode = function(typeOfNode, clicOnNodeAction) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("closeNode start");

  if (typeOfNode == "edited")
  {
    var el = d3.select(thisGraph.state.editedNode);
    var p_el = d3.select(thisGraph.state.editedNode.parentNode);

    var edit_node_input_index = el.select("#edit_node_input_index");
    var edit_node_select_type = el.select("#edit_node_select_type");
    var edit_node_textarea_label = el.select("#edit_node_textarea_label");
    var edit_node_input_hypertext = el.select("#edit_node_input_hypertext");

    if (thisGraph.config.displayIndex == "On")
    {
      var integer_input_index = parseInt(input_index.node().value, 10);
      if (integer_input_index)
        thisGraph.state.editedNode.__data__.index = integer_input_index;
      else
        thisGraph.state.editedNode.__data__.index = thisGraph.state.editedIndexNode;
    }

    if (edit_node_select_type.node())
      thisGraph.state.editedNode.__data__["@type"] = edit_node_select_type.node().value;

    if (edit_node_textarea_label.node())
      thisGraph.state.editedNode.__data__.label = edit_node_textarea_label.node().value;
    else
      thisGraph.state.editedNode.__data__.label = thisGraph.customNodes.blankNodeLabel;

    if (edit_node_input_hypertext.node())
      thisGraph.state.editedNode.__data__.hypertext = edit_node_input_hypertext.node().value;

    thisGraph.saveEditNode();

    el.select("#fo_content_edited_node_label").remove();
    thisGraph.displayText(el);

    thisGraph.state.editedNode = null;
  }
  else { //opened
      var el = d3.select(thisGraph.state.openedNode);

      el.select("#fo_content_opened_node").remove();
      el.select("#fo_content_opened_node_events").remove();
      el.select("#fo_xhtml_content_open_node_label").remove();

      d3.select("#neighbour_connector_link").remove();
      d3.select("#fo_node_neighbour").remove();
      thisGraph.state.neighbourConnectorIsSet = false;

      // el.select("#fo_content_closed_node_label")
      //   .transition()
      //   .duration(thisGraph.customNodes.transitionDurationClose)
      //   .attr("y", -thisGraph.customNodesText.heightMax / 2)

      if (clicOnNodeAction == "flod")
        thisGraph.displayText(el);

      thisGraph.state.openedNode = null;
  }

  el
    .select("#circle_index")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationClose)
    .attr("cy", thisGraph.nodeIndexCircle.cyClosed)

  el
    .select("#text_index")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationClose)
    .attr("dy", thisGraph.nodeIndexCircle.dyClosed)

  el
    .select("#circle_type")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationClose)
    .attr("cy", thisGraph.nodeTypeIcon.cyClosed)

  el
    .select("#fo_type_image")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationClose)
    .attr("y", thisGraph.nodeTypeIcon.yClosed)

  el.select("#nodecircle")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationClose)
    .attr("x", function (d){
      var radius = thisGraph.getProportionalRadius(d);
      var x = -radius;
      return x;
    })
    .attr("y", function (d){
      var radius = thisGraph.getProportionalRadius(d);
      var y= -radius;
      return y;
    })
    .attr("width", function (d){
      var radius = thisGraph.getProportionalRadius(d);
      var width = radius*2;
      return width;
    })
    .attr("height", function (d){
      var radius = thisGraph.getProportionalRadius(d);
      var height = radius*2;
      return height;
    })
    .attr("rx", thisGraph.customNodes.curvesCornersClosedNode)
    .attr("ry", thisGraph.customNodes.curvesCornersClosedNode)

    thisGraph.OrderNodesInSvgSequence();

  if (thisGraph.config.debug) console.log("closeNode end");
}

FluidGraph.prototype.saveEditNode = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("saveEditNode start");

  var editedNodeData = thisGraph.state.editedNode.__data__;
  thisGraph.changeIndexNode(thisGraph.state.editedNode,editedNodeData.index);
  thisGraph.changeTypeNode(thisGraph.state.editedNode,editedNodeData["@type"]);

  if (thisGraph.config.debug) console.log("saveEditNode end");
}

FluidGraph.prototype.nodeOnMouseOver = function(d3Node, dNode) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("nodeOnMouseOver start");

  if (d3.event.defaultPrevented) return;

  d3.event.stopPropagation();

  if (thisGraph.config.repulseNeighbourOnHover) {
    var el = d3.select(d3Node.node());
    el.repulseNeighbour.call(thisGraph, dNode, 100);
  }

  if (thisGraph.config.openNodeOnHover == "On") {
    thisGraph.openNode(d3Node, dNode, thisGraph.config.clicOnNodeAction);
  }

  if (thisGraph.config.makeLinkSelectingNode == "Off")
  {
    if (thisGraph.state.draggingNode
        && dNode
        && dNode != thisGraph.state.draggingNode)
    {
      thisGraph.state.targetNode = dNode;
      thisGraph.state.targetNodeSvg = d3Node;
      thisGraph.state.neighbourConnection = dNode;
      if (thisGraph.state.openedNode)
      {
        if (thisGraph.state.dNeighbourConnector)
        {
          console.log("nodeOnMouseOver updateNeighbourConnectorLink(draggingNode, dNeighbourConnector) = ",
                                                                "("+thisGraph.state.draggingNode+","+thisGraph.state.dNeighbourConnector+")")
          thisGraph.updateNeighbourConnectorLink(thisGraph.state.draggingNode, thisGraph.state.dNeighbourConnector);
        }
      }
      else
        thisGraph.updateNodeConnector();
    }
  }

  if (thisGraph.config.debug) console.log("nodeOnMouseOver end");
}

FluidGraph.prototype.nodeOnMouseOut = function(d3NodeTarget, dNodeTarget) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("nodeOnMouseOut start");

  if (thisGraph.config.repulseNeighbourOnHover) {
    var el = d3.select(d3Node.node());
    el.repulseNeighbour.call(thisGraph, dNodeTarget, 1);
  }

  if (thisGraph.config.openNodeOnHover == "On") {
    thisGraph.closeNode.call(thisGraph, "opened", thisGraph.config.clicOnNodeAction);
  }

  if (thisGraph.config.makeLinkSelectingNode == "Off" && thisGraph.state.draggingNode)
  {
    thisGraph.state.targetNode = null;

    if (thisGraph.state.openedNode)
    {
      var dNodeSource = thisGraph.state.draggingNode;
      console.log("nodeOnMouseOut updateNeighbourConnectorLink")
      thisGraph.updateNeighbourConnectorLink(thisGraph.state.draggingNode, thisGraph.state.dNeighbourConnector)

      var labelTypeSource = dNodeSource["@type"].split(":").pop();
      var neighbour_target_fo_connector = d3.select("#neighbour_target_fo_connector_"+labelTypeSource);
      var colorRgbaSource = thisGraph.customNodes.strokeNeighbourColorTypeRgba[dNodeSource["@type"]];
      var backGroundColor = "rgba("+colorRgbaSource+ ","+ thisGraph.customNodes.neighbourConnectorOpacity + ")"
      neighbour_target_fo_connector.style("background-color",backGroundColor)
                                  .text(thisGraph.customNodes.neighbourConnectorMessage);

      thisGraph.state.neighbourConnection = null;
    }
    else
    {
      thisGraph.updateNodeConnector();
      thisGraph.removeSelectFromNode(dNodeTarget);
      thisGraph.removeSelectFromNode(thisGraph.state.draggingNode);
      if (thisGraph.state.targetNodeSvg)
      {
        thisGraph.state.targetNodeSvg.select("#nodecircle").style("opacity","1");
      }
    }
    thisGraph.state.targetNodeSvg = null;
  }

  if (thisGraph.config.debug) console.log("nodeOnMouseOut end");
}

d3.selection.prototype.repulseNeighbour = function(d, weight) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("repulseNeighbour start");

  d.weight = weight;

  if (thisGraph.config.debug) console.log("repulseNeighbour end");
}

FluidGraph.prototype.searchIndexNodeFromIdentifier = function(o, searchTerm) {
  for (var i = 0, len = o.length; i < len; i++) {
    if (o[i]["@id"] === searchTerm)
      return i;
  }
  return -1;
}

FluidGraph.prototype.searchIdNodeFromIdentifier = function(o, searchTerm) {
  for (var i = 0, len = o.length; i < len; i++) {
    if (o[i]["@id"] === searchTerm)
      return o[i].index;
  }
  return -1;
}

FluidGraph.prototype.searchD3NodeFromD = function(dNode) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("searchD3NodeFromD start");

  var d3Node;
  var allNodes = d3.selectAll("#node")[0];
  allNodes.forEach(function (svgNode){
    if (svgNode.__data__ === dNode)
    {
      d3Node = d3.select(svgNode);
    }
  })

  if (thisGraph.config.debug) console.log("searchD3NodeFromD end");

  return d3Node;
}

FluidGraph.prototype.getNeighbourNodesAndLinks = function(rootNode) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("getNeighbourNodesAndLinks start");

  var linkedByIndex = {};
  thisGraph.d3Data.edges.forEach(function(d) {
    linkedByIndex[d.source.index + "," + d.target.index] = 1;
  });

  function isConnected(a, b) {
    return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
  }

  var neighbours = {};
  neighbours.nodes = [];
  neighbours.edges = [];

  //First, the selected node
  neighbours.nodes.push(rootNode);

  thisGraph.d3Data.nodes.forEach(function(node) {
    //Nodes
    if (isConnected(rootNode, node) && rootNode.index != node.index) {
      neighbours.nodes.push(node);
    }
    //links
    if (isConnected(rootNode, node) && rootNode.index != node.index) {
      neighbours.edges.push({
        source: thisGraph.searchIndexNodeFromIdentifier(neighbours.nodes, rootNode["@id"]),
        target: thisGraph.searchIndexNodeFromIdentifier(neighbours.nodes, node["@id"])
      });
    }
  });

  if (thisGraph.config.debug) console.log("getNeighbourNodesAndLinks end");

  return neighbours;
}

FluidGraph.prototype.getHypertext = function(dNode) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("getHypertext start");

  return dNode.hypertext;

  if (thisGraph.config.debug) console.log("getHypertext end");
}

FluidGraph.prototype.focusContextNode = function(dNode) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("focusContextNode start");

  thisGraph.state.focusMode = true;
  thisGraph.d3DataFc = thisGraph.getNeighbourNodesAndLinks(dNode);

  //If not, there are problems in movexy()...
  d3.selectAll("#node").remove();
  d3.selectAll(".link").remove();

  thisGraph.centerNode(dNode);
  thisGraph.activateForce(thisGraph.d3DataFc);
  thisGraph.drawGraph(thisGraph.d3DataFc);
  thisGraph.movexy();
  var d3Node = thisGraph.searchD3NodeFromD(dNode)
  thisGraph.openNode(d3Node, dNode, thisGraph.config.clicOnNodeAction);

  if (thisGraph.config.debug) console.log("focusContextNode end");
}

FluidGraph.prototype.focusContextNodeOff = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("focusContextNodeOff start");

  //If not, there are problems in movexy()...
  d3.selectAll("#node").remove();
  d3.selectAll(".link").remove();
  thisGraph.drawGraph(thisGraph.d3Data);
  thisGraph.movexy();
  thisGraph.state.focusMode = false;

  if (thisGraph.config.debug) console.log("focusContextNodeOff end");
}

FluidGraph.prototype.fixUnfixNode = function(d3Node, d) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("fixUnfixNode start");

  if (d3.event.defaultPrevented) return;

  var status;

  if (d.fixed == true) {
    thisGraph.removeSelectFromNode(d);
    status = "unfixed";
    return false;
  }
  else {
    thisGraph.replaceSelectNode(d3Node, d);
    status = "fixed";
    return true;
  }

  if (thisGraph.config.debug) console.log("fixUnfixNode end");
  return status;
}

FluidGraph.prototype.replaceSelectNode = function(d3Node, d) {
  var thisGraph = this;
  d3Node.select("#nodecircle").classed(thisGraph.consts.selectedClass, true);

  if (thisGraph.config.makeLinkSelectingNode == "On")
  {
    d.fixed = true;
    if (thisGraph.state.selectedNode) {
      thisGraph.removeSelectFromNode(thisGraph.state.selectedNode);
    }
    thisGraph.state.selectedNode = d;
  }
};

FluidGraph.prototype.removeSelectFromNode = function(d) {
  var thisGraph = this;
  thisGraph.svgNodesEnter.filter(function(node) {
    if (node.index === d.index)
    {
      node.fixed = false;
      return true;
    }
  }).select("#nodecircle").classed(thisGraph.consts.selectedClass, false);
  thisGraph.state.selectedNode = null;
};

FluidGraph.prototype.getNodeIndex = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("getNodeIndex start");
  var nextNodeIndex = 0;

  thisGraph.d3Data.nodes.forEach(function (node){
    if (node.index > nextNodeIndex)
      nextNodeIndex = node.index;
  })

  if (thisGraph.config.debug) console.log("getNodeIndex end");
  return nextNodeIndex+1;
}

FluidGraph.prototype.nodeOnMouseDown = function(d3Node, d) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("nodeOnMouseDown start");

  // if (d3.event.defaultPrevented) return;

  if (thisGraph.state.editedNode)
  {
    var editedNode = thisGraph.state.editedNode
  }

  if (d3Node.node() != editedNode)
  {
    thisGraph.state.mouseDownNode = d;
    thisGraph.state.svgMouseDownNode = d3Node;

    if (thisGraph.config.makeLinkSelectingNode == "On")
    {
      //initialise drag_line position on this node
      thisGraph.drag_line.attr("d", "M" + thisGraph.state.mouseDownNode.x
                                  + " " + thisGraph.state.mouseDownNode.y
                                  + " L" + thisGraph.state.mouseDownNode.x
                                  + " " + thisGraph.state.mouseDownNode.y)
    }
  }

  if (thisGraph.config.debug) console.log("nodeOnMouseDown end");
}

FluidGraph.prototype.nodeOnMouseUp = function(d3Node, dNode) {
  //.on("mouseup",function(d){thisGraph.nodeOnMouseUp.call(thisGraph, d3.select(this), d)})
  // d3Node = d3.select(this) = array[1].<g.node>

  thisGraph = this;

  if (thisGraph.config.debug) console.log("nodeOnMouseUp start");

  // if we clicked on an origin node
  if (thisGraph.state.mouseDownNode) {
    thisGraph.state.mouseUpNode = dNode;
    // thisGraph.state.selectedNode = d;
    // if we clicked on the same node, reset vars
    if (thisGraph.state.mouseUpNode["@id"] == thisGraph.state.mouseDownNode["@id"]) {
      if (thisGraph.config.clicOnNodeAction == "flod")
      {
        if (thisGraph.config.makeLinkSelectingNode == "On")
            thisGraph.fixUnfixNode(d3Node, dNode);
          else {
            // thisGraph.centerNode(dNode);
            if (thisGraph.config.allowOpenNode)
              thisGraph.openNode(d3Node, dNode, thisGraph.config.clicOnNodeAction);
          }
      }
      else if (thisGraph.config.clicOnNodeAction == "options")
      {
        if (thisGraph.config.allowOpenNode)
          thisGraph.openNode(d3Node, dNode, thisGraph.config.clicOnNodeAction);
      }
      else if (thisGraph.config.clicOnNodeAction == "media")
      {
        var hypertext = dNode.hypertext;
        var match_url_video = hypertext.match(/(youtube|youtu|vimeo|dailymotion|kickstarter)\.(com|be)\/((watch\?v=([-\w]+))|(video\/([-\w]+))|(projects\/([-\w]+)\/([-\w]+))|([-\w]+))/)

        if (thisGraph.config.allowOpenNode)
        {
          if (match_url_video) {
            thisGraph.openVideoInNode(d3Node, dNode);
          }
          else {
            var a_closed_node_hypertext = d3Node.select("#a_closed_node_hypertext").node();
            if (a_closed_node_hypertext)
              a_closed_node_hypertext.click();
          }
        }
      }

      thisGraph.resetMouseVars();
      return;
    }

    //Drop on an other node --> create a link
    if (thisGraph.config.allowModifyLink == true && thisGraph.config.makeLinkSelectingNode == "On")
    {
      thisGraph.fixUnfixNode(thisGraph.state.svgMouseDownNode, dNode);
      thisGraph.drag_line.attr("visibility", "hidden");
      thisGraph.addDataLink(thisGraph.state.mouseDownNode["@id"], thisGraph.state.mouseUpNode["@id"]);
      thisGraph.drawGraph();
      thisGraph.resetMouseVars();
    }
  }

  if (thisGraph.config.debug) console.log("nodeOnMouseUp end");
}

FluidGraph.prototype.OrderNodesInSvgSequence = function() {
  //Make node ordred by index
  thisGraph.bgElement.selectAll("#node").sort(function(a, b) { // select the parent and sort the path's
      if (a.index > b.index) return 1; // a is not the hovered element, send "a" to the back
      else return -1; // a is the hovered element, bring "a" to the front
  });
}

FluidGraph.prototype.MakeNodeFirstInSvgSequence = function(d) {
  //Make drag node on the back (first of the list)
  thisGraph.bgElement.selectAll("#node").sort(function(a, b) { // select the parent and sort the path's
      if (a.index != d.index) return 1; // a is not the hovered element, send "a" to the back
      else return -1; // a is the hovered element, bring "a" to the front
  });
}

FluidGraph.prototype.MakeNodeLastInSvgSequence = function(d) {
  //Make drag node on the front (last of the list)
  thisGraph.bgElement.selectAll("#node").sort(function(a, b) { // select the parent and sort the path's
      if (a.index == d.index) return 1; // a is not the hovered element, send "a" to the back
      else return -1; // a is the hovered element, bring "a" to the front
  });
}

FluidGraph.prototype.nodeOnDragStart = function(d3Node, dNode) {
  //Here, "this" is the <g.node> where mouse drag
  thisGraph = this;

  if (thisGraph.config.debug) console.log("nodeOnDragStart start");

  console.log("nodeOnDragStart start", thisGraph.state.targetNode, thisGraph.d3Data)

  //Prevent to close node at the second click...
  d3.event.sourceEvent.stopPropagation();

  //When you click on node, it dragStart on mousedown and dragEnd on mouseup
  // So, you only have to drag on close node
  if (thisGraph.state.openedNode == d3Node.node())
    return

  if (thisGraph.state.openedNode){
    var dNodeSource = thisGraph.state.openedNode.__data__;
    var dNodeTarget = dNode;

    //Don't create a link if there is already one
    var searchLinkSourceTarget = d3.select("#edge"+dNodeSource.index+"_"+dNodeTarget.index).node();
  	var searchLinkTargetSource = d3.select("#edge"+dNodeTarget.index+"_"+dNodeSource.index).node();

  	if (!searchLinkSourceTarget && !searchLinkTargetSource)
  	{
      var labelType = dNode["@type"].split(":").pop();
      var neighbour_type_box = d3.select("#neighbour_type_box_"+labelType);
      thisGraph.addNeighbourOriginConnector(neighbour_type_box, dNodeSource, dNodeTarget);
    }
  }

  if (thisGraph.state.openedNode)
  {
    if (thisGraph.state.neighbourConnectorIsSet)
    {
      var labelTypeSource = dNode["@type"].split(":").pop();
      var neighbour_target_fo_connector = d3.select("#neighbour_target_fo_connector_"+labelTypeSource).node();
      thisGraph.state.dNeighbourConnector = neighbour_target_fo_connector.__data__;
    }
  }

  if (dNode.fixed != true) {
    if (thisGraph.config.makeLinkSelectingNode == "On")
    {
      thisGraph.drag_line.attr("visibility", "visible");
    }
  }

  console.log("nodeOnDragStart end", thisGraph.state.targetNode, thisGraph.d3Data)

  if (thisGraph.config.debug) console.log("nodeOnDragStart end");
}

FluidGraph.prototype.nodeOnDragMove = function(d3Node, dNode) {
  //Here, "this" is the <g.node> where mouse drag
  thisGraph = this;

  if (thisGraph.config.debug) console.log("nodeOnDragMove start");

  console.log("nodeOnDragMove start", thisGraph.state.targetNode, thisGraph.d3Data)

  // console.log("nodeOnDragMove1 : $('#edit_node_textarea_label')[0]", $("#edit_node_input_hypertext")[0]);
  // console.log("nodeOnDragMove2 : d3.event.sourceEvent.target", d3.event.sourceEvent.target);
  if (d3.event.sourceEvent.target === $("#edit_node_textarea_label")[0])
    return

  if (d3.event.sourceEvent.target === $("#edit_node_input_hypertext")[0])
    return

  if (thisGraph.state.openedNode == null)
    thisGraph.MakeNodeFirstInSvgSequence(dNode); //to make links with other closed nodes

  if (thisGraph.config.makeLinkSelectingNode == "Off"
      && thisGraph.state.openedNode !== d3Node.node()
      && thisGraph.state.editedNode !== d3Node.node())
  {
    if (thisGraph.state.openedNode)
      thisGraph.MakeNodeLastInSvgSequence(dNode);

    thisGraph.state.mouseDownNode = null;

    // get coords of mouseEvent relative to svg container to allow for panning
    relCoords = d3.mouse($('svg').get(0));
    if (relCoords[0] < thisGraph.panBoundary) {
        thisGraph.panTimer = true;
        thisGraph.pan(d3Node.node(), 'left');
    } else if (relCoords[0] > ($('svg').width() - thisGraph.panBoundary)) {
        thisGraph.panTimer = true;
        thisGraph.pan(d3Node.node(), 'right');
    } else if (relCoords[1] < thisGraph.panBoundary) {
        thisGraph.panTimer = true;
        thisGraph.pan(d3Node.node(), 'up');
    } else if (relCoords[1] > ($('svg').height() - thisGraph.panBoundary)) {
        thisGraph.panTimer = true;
        thisGraph.pan(d3Node.node(), 'down');
    } else {
        try {
            clearTimeout(thisGraph.panTimer);
        } catch (e) {

        }
    }

  }
  else   if (thisGraph.config.makeLinkSelectingNode == "On"
        && thisGraph.state.openedNode == null
        && thisGraph.state.editedNode == null)
  {
    thisGraph.MakeNodeLastInSvgSequence(dNode);
  }

  if (thisGraph.state.editedNode)
  {
    if (thisGraph.state.editedNode.__data__.index === d.index)
      return;
    else thisGraph.closeNode.call(thisGraph, "edited");
  }

  if (dNode.fixed != true) //false or undefined
  {
    thisGraph.state.draggingNode = dNode;
    thisGraph.state.draggingNodeSvg = d3Node;

    if (thisGraph.state.openedNode)
      if (thisGraph.state.draggingNodeSvg.node() === thisGraph.state.openedNode)
      {
        console.log("nodeOnDragMove end, draggingNodeSvg.node() = openedNode",
                    thisGraph.state.draggingNodeSvg.node(), thisGraph.state.openedNode)
        thisGraph.state.draggingNode = null;
        thisGraph.state.draggingNodeSvg = null;
        return
      }

    //drag node
    // thisGraph.state.draggingNode.px += d3.event.dx;
    // thisGraph.state.draggingNode.py += d3.event.dy;
    thisGraph.state.draggingNode.x += d3.event.dx;
    thisGraph.state.draggingNode.y += d3.event.dy;
    thisGraph.movexy();
    if (thisGraph.config.makeLinkSelectingNode == "On")
    {
      thisGraph.drag_line.attr("visibility", "hidden");
      thisGraph.resetMouseVars();
    }
    else {
      if (thisGraph.state.openedNode)
      {
        if (thisGraph.state.neighbourConnectorIsSet)
        {
          console.log("nodeOnDragMove updateNeighbourConnectorLink")
          thisGraph.updateNeighbourConnectorLink(thisGraph.state.draggingNode, thisGraph.state.dNeighbourConnector);
        }
      }
      else
        thisGraph.updateNodeConnector();
    }
  }

  console.log("nodeOnDragMove end", thisGraph.state.targetNode, thisGraph.d3Data)

  if (thisGraph.config.debug) console.log("nodeOnDragMove end");
}

FluidGraph.prototype.nodeOnDragEnd = function(d3Node,dNode) {
  //Here, "this" is the <g.node> where mouse drag
  thisGraph = this;

  if (thisGraph.config.debug) console.log("nodeOnDragEnd start");

  console.log("nodeOnDragEnd start [d3Node, dNode, targetNode, d3Data]",
                                    d3Node,dNode,thisGraph.state.targetNode,thisGraph.d3Data)

  //When you click on node, it dragStart on mousedown and dragEnd on mouseup
  // So, you only have to drag on close node
  if (thisGraph.state.openedNode == d3Node.node())
  {
    thisGraph.state.targetNode = null;
    thisGraph.state.targetNodeSvg = null
    thisGraph.state.draggingNode = null;
    return
  }

  if (thisGraph.state.draggingNode && thisGraph.state.openedNode == null)
    thisGraph.OrderNodesInSvgSequence();

  if (thisGraph.config.makeLinkSelectingNode == "Off")
  {
    if (thisGraph.state.targetNode)
    {
      //Don't create a link if there is already one
    	var searchLinkSourceTarget = d3.select("#edge"+thisGraph.state.draggingNode.index+"_"+thisGraph.state.targetNode.index).node();
    	var searchLinkTargetSource = d3.select("#edge"+thisGraph.state.targetNode.index+"_"+thisGraph.state.draggingNode.index).node();

    	if (!searchLinkSourceTarget && !searchLinkTargetSource)
      {
        //Come back to the old position
        d3Node
            .transition()
            .duration(thisGraph.customNodes.transitionDurationComeBack)
            .attr("transform", function (d){return "translate("+d.px+","+d.py+")"})

        d3.selectAll(".link")
            .transition()
            .duration(thisGraph.customNodes.transitionDurationComeBack)
            .attr("d", thisGraph.diagonal
              .source(function(d) { return {"x":d.source.px, "y":d.source.py}; })
              .target(function(d) { return {"x":d.target.px, "y":d.target.py}; })
            )

        if (thisGraph.state.draggingNode)
        {
          thisGraph.state.draggingNode.x = thisGraph.state.draggingNode.px;
          thisGraph.state.draggingNode.y = thisGraph.state.draggingNode.py;
        }

        console.log("nodeOnDragEnd addDataLink (draggingNode,targetNode)",
                    thisGraph.state.draggingNode,thisGraph.state.targetNode);

        thisGraph.addDataLink(thisGraph.state.draggingNode, thisGraph.state.targetNode);
        thisGraph.drawNewLink(thisGraph.state.draggingNode, thisGraph.state.targetNode);

        // If a node is opened, add neighbour and remove connector
        if (thisGraph.state.openedNode)
        {
          if (thisGraph.state.neighbourConnectorIsSet)
          {
            var d3NodeSource = d3.select(thisGraph.state.openedNode);
            var labelTypeSource = thisGraph.state.draggingNode["@type"].split(":").pop();
            var divNeighbourBoxType = d3NodeSource.select("#neighbour_type_box_"+labelTypeSource)
            thisGraph.addNeighbourInBox(divNeighbourBoxType, dNode)
          }
        }
      }
    }
    else { // thisGraph.state.targetNode == null
      if (thisGraph.state.draggingNode)
      {
        //Re-initialisation of px and py
        thisGraph.state.draggingNode.px = thisGraph.state.draggingNode.x;
        thisGraph.state.draggingNode.py = thisGraph.state.draggingNode.y;
      }
    }

    if (thisGraph.state.targetNodeSvg)
      thisGraph.state.targetNodeSvg.select("#nodecircle").style("opacity","1");

    if (thisGraph.state.targetNode)
      thisGraph.removeSelectFromNode(thisGraph.state.targetNode);
    if (thisGraph.state.draggingNode)
      thisGraph.removeSelectFromNode(thisGraph.state.draggingNode);

    if (thisGraph.state.openedNode)
    {
      d3.select("#neighbour_connector_link").remove();
      d3.select("#fo_node_neighbour").remove();
      thisGraph.state.neighbourConnectorIsSet = false;
    }
    else
      thisGraph.updateNodeConnector();
  }

  thisGraph.state.targetNode = null;
  thisGraph.state.targetNodeSvg = null
  thisGraph.state.draggingNode = null;
  thisGraph.state.dNeighbourConnector = null;
  thisGraph.state.neighbourConnection = null;

  if (thisGraph.config.elastic == "On") {
    if (dNode.fixed != true) {
      thisGraph.movexy.call(thisGraph);
      thisGraph.force.start();

      if (thisGraph.state.selectedLink) {
        thisGraph.removeSelectFromLinks();
      }

      if (thisGraph.state.selectedNode) {
        thisGraph.removeSelectFromNode(thisGraph.state.selectedNode);
      }
    }
  }

  console.log("nodeOnDragEnd end [d3Node, dNode, targetNode, d3Data]",
                                    d3Node,dNode,thisGraph.state.targetNode,thisGraph.d3Data)

  if (thisGraph.config.debug) console.log("nodeOnDragEnd end");
}

// Function to update the temporary connector indicating dragging affiliation
FluidGraph.prototype.updateNodeConnector = function() {
    var dataNodeConnector = [];

    var searchLinkSourceTarget = null;
    var searchLinkTargetSource = null;
    if (thisGraph.state.targetNode)
    {
      //Don't create a link if there is already one
      searchLinkSourceTarget = d3.select("#edge"+thisGraph.state.draggingNode.index+"_"+thisGraph.state.targetNode.index).node();
    	searchLinkTargetSource = d3.select("#edge"+thisGraph.state.targetNode.index+"_"+thisGraph.state.draggingNode.index).node();
    }

    if (!searchLinkSourceTarget && !searchLinkTargetSource)
    {
      if (thisGraph.state.draggingNode && thisGraph.state.targetNode) {
          dataNodeConnector = [{
              source: {x1 : thisGraph.state.targetNode.x, y1 : thisGraph.state.targetNode.y},
              target: {x2 : thisGraph.state.draggingNode.x, y2 : thisGraph.state.draggingNode.y}
          }];

          thisGraph.replaceSelectNode(thisGraph.state.targetNodeSvg, thisGraph.state.targetNode);
          thisGraph.replaceSelectNode(thisGraph.state.draggingNodeSvg, thisGraph.state.draggingNode);
          thisGraph.state.targetNodeSvg.select("#nodecircle").style("opacity", ".5");
      }
    }

    var tempConnector = thisGraph.bgElement.selectAll(".templink")
                                            .data(dataNodeConnector);

		tempConnector.enter()
				.insert("line", "#node")
        .attr("class", "templink")
				.attr('pointer-events', 'none')
        // .attr('stroke', thisGraph.customNodes.strokeColor)
        .attr('stroke', function(){
          if (!searchLinkSourceTarget && !searchLinkTargetSource)
        	{
            var color = thisGraph.customLinks.strokeColor;
          }
          else {
            var color = ""; //No Strokes
          }
          return color;
        })
        .attr('stroke-linecap', 'round')
				.attr('fill', 'none')
				.attr("x1", function (d) { return d.source.x1 })
				.attr("y1", function (d) { return d.source.y1 })
				.attr("x2", function (d) { return d.target.x2 })
				.attr("y2", function (d) { return d.target.y2 })     
        .attr('stroke-width', 0)
        .transition()
        .duration(thisGraph.customNodes.transitionDurationConnector)
        .delay(thisGraph.customNodes.transitionDelay)
        .ease(thisGraph.customNodes.transitionEasing)
        .attr('stroke-width', thisGraph.customNodes.widthClosed
                            + thisGraph.customNodes.strokeWidth*2+20)

		tempConnector
				.attr("x1", function (d) { return d.source.x1 })
				.attr("y1", function (d) { return d.source.y1 })
				.attr("x2", function (d) { return d.target.x2 })
				.attr("y2", function (d) { return d.target.y2 })     

    tempConnector.exit().remove();
}

FluidGraph.prototype.updateNeighbourConnectorLink = function(dNodeSource, dNodeTarget) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("updateNeighbourConnectorLink start");

  var dataNeighbourConnectorLink = [];

  if (thisGraph.state.draggingNode) {
    dataNeighbourConnectorLink = [{
        source: {
            x: dNodeSource.x,
            y: dNodeSource.y
        },
        target: {
            x: dNodeTarget.x,
            y: dNodeTarget.y
        }
    }];
  }

  if (thisGraph.state.neighbourConnection)
  {
    var labelTypeSource = dNodeSource["@type"].split(":").pop();
    var neighbour_target_fo_connector = d3.select("#neighbour_target_fo_connector_"+labelTypeSource);
    var colorRgba = thisGraph.customNodes.colorTypeRgba[dNodeSource["@type"]];
    var backGroundColor = "rgba("+colorRgba+ ","+ thisGraph.customNodes.neighbourConnectorOpacityDropped + ")"
    neighbour_target_fo_connector.style("background-color",backGroundColor)
                                .text(thisGraph.customNodes.dropNodeInNeighboursMessage);
  }

  var colorTarget = thisGraph.customNodes.strokeColorType[dNodeTarget["@type"]];
  var link = thisGraph.bgElement.selectAll(".neighbour_connector_link")
                                .data(dataNeighbourConnectorLink);

  link
      .enter()
      .insert("path", "#fo_node_neighbour")
      .attr("class", "neighbour_connector_link")
      .attr("id", "neighbour_connector_link")
      .style('pointer-events', 'none')
      .style("stroke", colorTarget)
      .style("stroke-width", thisGraph.customLinks.strokeWidth)
			.style("fill", "none")
      .attr("d", d3.svg.diagonal())
      .attr("stroke-dasharray", "5,5")

  link.attr("d", d3.svg.diagonal())
      .attr("stroke-dasharray", "5,5")

  link.exit().remove();

  if (thisGraph.config.debug) console.log("updateNeighbourConnectorLink end");
}

FluidGraph.prototype.centerNode = function(d) {
    scale = thisGraph.zoomListener.scale();
    x = -d.x;
    y = -d.y;
    x = x * scale + thisGraph.svgContainer.width / 2;
    y = y * scale + thisGraph.svgContainer.height / 2;
    d3.select('g')
      .transition()
      .duration(thisGraph.customNodes.transitionDurationCenterNode)
      .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    thisGraph.zoomListener.scale(scale);
    thisGraph.zoomListener.translate([x, y]);
}

FluidGraph.prototype.deleteNode = function(nodeIdentifier) {
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("deleteNode start");

  if (thisGraph.d3Data.nodes.length) {
    //delete args or the first if not arg (console).
    if (!nodeIdentifier)
      var nodeIdentifier = thisGraph.d3Data.nodes[0]["@id"];

    var index = thisGraph.searchIndexNodeFromIdentifier(thisGraph.d3Data.nodes, nodeIdentifier);
    var id = thisGraph.searchIdNodeFromIdentifier(thisGraph.d3Data.nodes, nodeIdentifier);

    //delete node
    thisGraph.d3Data.nodes.splice(index, 1);

    //delete edges linked to this (old) node
    thisGraph.spliceLinksForNode(id);

    if (thisGraph.config.makeLinkSelectingNode == "On")
    {
      thisGraph.state.selectedNode = null;
    }

    thisGraph.resetStateNode();
    thisGraph.drawGraph();
  } else {
    console.log("No node to delete !");
  }
  if (thisGraph.config.debug) console.log("deleteNode end");
}
