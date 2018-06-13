//rescale g
FluidGraph.prototype.rescale = function(){
  if (thisGraph.config.debug) console.log("rescale start");

  if (thisGraph.config.allowDragOnBg)
  {
    thisGraph.bgElement.attr("transform",
      "translate(" + d3.event.translate + ")"
      + " scale(" + d3.event.scale + ")");
  }

  if (thisGraph.config.debug) console.log("rescale end");
}

//pan g / Not used for the moment
FluidGraph.prototype.bgPan = function(direction){
  if (thisGraph.config.debug) console.log("rescale start");

  var translateCoords, getTransform;

  if (thisGraph.panTimer) {
    clearTimeout(thisGraph.panTimer);

    getTransform = thisGraph.bgElement.attr("transform");
    translateCoords = d3.transform(getTransform);
    if (direction == 'left')
    {
      thisGraph.translateX = translateCoords.translate[0] + thisGraph.panBgSpeed;
      thisGraph.translateY = translateCoords.translate[1];
    }
    else if  (direction == 'right')
    {
      thisGraph.translateX = translateCoords.translate[0] - thisGraph.panBgSpeed;
      thisGraph.translateY = translateCoords.translate[1];
    }
    else if  (direction == 'up')
    {
      thisGraph.translateX = translateCoords.translate[0];
      thisGraph.translateY = translateCoords.translate[1] + thisGraph.panBgSpeed;
    }
    else if (direction == 'down')
    {
      thisGraph.translateX = translateCoords.translate[0];
      thisGraph.translateY = translateCoords.translate[1] - thisGraph.panBgSpeed;
    }
    thisGraph.bgElement.transition().attr("transform",
                    "translate(" + thisGraph.translateX + "," + thisGraph.translateY + ")");

    thisGraph.panTimer = setTimeout(function() {
      thisGraph.bgPan(direction);
    }, 50);
  }

  if (thisGraph.config.debug) console.log("rescale end");
}

FluidGraph.prototype.bgOnMouseDown = function(d){
  thisGraph = this;

  if (thisGraph.config.debug) console.log("bgOnMouseDown start");

  if (thisGraph.state.selectedLink){
    thisGraph.removeSelectFromLinks();
  }

  if (thisGraph.state.selectedNode && thisGraph.state.svgMouseDownNode){
    thisGraph.fixUnfixNode(thisGraph.state.svgMouseDownNode,thisGraph.state.selectedNode);
  }

  //If it still exist somthing "selected", set to "unselected"
  d3.selectAll("#path.selected").classed(thisGraph.consts.selectedClass, false);
  d3.selectAll("#nodecircle.selected").classed(thisGraph.consts.selectedClass, false);

  if (thisGraph.state.editedNode)
  {
    // var el_edited_node = d3.select(thisGraph.state.editedNode);
    // var el_edited_node_label = el_edited_node.select("#fo_content_edited_node_label");
    // if (el_edited_node_label.node())
      thisGraph.closeNode.call(thisGraph, "edited");
  }

  if (thisGraph.state.openedNode)
  {
    // var el_opened_node = d3.select(thisGraph.state.openedNode);
    // var el_closed_node_label = el_opened_node.select("#fo_content_closed_node_label");
    // if (el_closed_node_label.node())
      thisGraph.closeNode.call(thisGraph, "opened", thisGraph.config.clicOnNodeAction);
  }

  if (thisGraph.state.editedLinkLabel)
  {
    thisGraph.saveEditedLinkLabel.call(thisGraph)
  }

  if (thisGraph.config.debug) console.log("bgOnMouseDown start");
}

FluidGraph.prototype.bgOnMouseOver = function(d){
  thisGraph = this;

  if (thisGraph.config.debug) console.log("bgOnMouseOver start");

  var xycoords = d3.mouse(thisGraph.bgElement.node());

  // get coords of mouseEvent relative to svg container to allow for panning
  relCoords = d3.mouse($('svg').get(0));
  if (relCoords[0] < thisGraph.panBgLRBoundary) {
      thisGraph.panTimer = true;
      thisGraph.bgPan("left");
  } else if (relCoords[0] > ($('svg').width() - thisGraph.panBgLRBoundary)) {
      thisGraph.panTimer = true;
      thisGraph.bgPan('right');
  } else if (relCoords[1] < thisGraph.panBgUDRBoundary) {
      thisGraph.panTimer = true;
      thisGraph.bgPan('up');
  } else if (relCoords[1] > ($('svg').height() - thisGraph.panBgUDRBoundary)) {
      thisGraph.panTimer = true;
      thisGraph.bgPan('down');
  } else {
      try {
          clearTimeout(thisGraph.panTimer);
      } catch (e) {

      }
  }

  // if the origin click is not a node, then pan the graph (activated by bgOnMouseDown)...
  if (!thisGraph.state.mouseDownNode) return;

  if (thisGraph.config.debug) console.log("bgOnMouseOver end")
}

FluidGraph.prototype.bgOnMouseMove = function(d){
  thisGraph = this;

  if (thisGraph.config.debug) console.log("bgOnMouseMove start");

  // var xycoords = d3.mouse(thisGraph.bgElement.node());
  //
  // // get coords of mouseEvent relative to svg container to allow for panning
  // relCoords = d3.mouse($('svg').get(0));
  // if (relCoords[0] < thisGraph.panBgLRBoundary) {
  //     thisGraph.panTimer = true;
  //     thisGraph.bgPan("left");
  // } else if (relCoords[0] > ($('svg').width() - thisGraph.panBgLRBoundary)) {
  //     thisGraph.panTimer = true;
  //     thisGraph.bgPan('right');
  // } else if (relCoords[1] < thisGraph.panBgUDRBoundary) {
  //     thisGraph.panTimer = true;
  //     thisGraph.bgPan('up');
  // } else if (relCoords[1] > ($('svg').height() - thisGraph.panBgUDRBoundary)) {
  //     thisGraph.panTimer = true;
  //     thisGraph.bgPan('down');
  // } else {
  //     try {
  //         clearTimeout(thisGraph.panTimer);
  //     } catch (e) {
  //
  //     }
  // }

  // if the origin click is not a node, then pan the graph (activated by bgOnMouseDown)...
  if (!thisGraph.state.mouseDownNode) return;

    if (thisGraph.config.makeLinkSelectingNode == "On")
    {
      // update drag line
      if (thisGraph.config.curvesLinks == "On")
      {
        thisGraph.drag_line.attr("d", function(d) {
                 var dx = xycoords[0] - thisGraph.state.mouseDownNode.x,
                      dy = xycoords[1] - thisGraph.state.mouseDownNode.y,
                      dr = Math.sqrt(dx * dx + dy * dy);
                 return "M" +
                      thisGraph.state.mouseDownNode.x + "," +
                      thisGraph.state.mouseDownNode.y + "A" +
                      dr + "," + dr + " 0 0,1 " +
                      xycoords[0] + "," +
                      xycoords[1];
                    })
                    .style("fill", "none")
      }
      else{ //false
        thisGraph.drag_line.attr("x1", thisGraph.state.mouseDownNode.x)
                    	      .attr("y1", thisGraph.state.mouseDownNode.y)
                    	      .attr("x2", xycoords[0])
                    	      .attr("y2", xycoords[1]);
      }
    }

  if (thisGraph.config.debug) console.log("bgOnMouseMove end")
}

FluidGraph.prototype.bgOnMouseUp = function(d){
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("bgOnMouseUp start");

  console.log("bgOnMouseUp1 : d3.event.sourceEvent.target", d3.event.target);
  console.log("bgOnMouseUp2 : $('#fo_i_edit_image')[0]", $("#fo_i_edit_image")[0]);
  if (d3.event.target === $("#fo_i_edit_image")[0])
     return
  if (d3.event.target === $("#fo_i_center_image")[0])
    return
  if (d3.event.target === $("#fo_i_focus_image")[0])
     return
  if (d3.event.target === $("#fo_i_hypertext_image")[0])
   return
  if (d3.event.target === $("#fo_i_delete_image")[0])
  return
  if (d3.event.target === $("#edit_select_node_type")[0])
   return

  if (!thisGraph.state.mouseDownNode)
  {
    thisGraph.resetMouseVars();
    return;
  }

  var xycoords = d3.mouse(thisGraph.bgElement.node());

  if (thisGraph.config.makeLinkSelectingNode == "On")
  {
    thisGraph.drag_line.attr("visibility", "hidden");
    thisGraph.fixUnfixNode(thisGraph.state.svgMouseDownNode, thisGraph.state.mouseDownNode);
    var newNode = thisGraph.addDataNode.call(this, thisGraph, {x:xycoords[0],y:xycoords[1]});

    thisGraph.drawNewNode(thisGraph.state.mouseDownNode, newNode);
    thisGraph.addDataLink(thisGraph.state.mouseDownNode, newNode);
    thisGraph.drawNewLink(newNode, thisGraph.state.mouseDownNode);

    thisGraph.resetMouseVars();
  }

  if (thisGraph.config.debug) console.log("bgOnMouseUp end");
}

// From https://github.com/cjrd/directed-graph-creator/blob/master/graph-creator.js
FluidGraph.prototype.bgKeyDown = function() {
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("bgKeyDown start");

  // make sure repeated key presses don't register for each keydown
  if(thisGraph.state.lastKeyDown !== -1) return;

  thisGraph.state.lastKeyDown = d3.event.keyCode;

  switch(d3.event.keyCode) {
  case thisGraph.consts.BACKSPACE_KEY:
  break;
  case thisGraph.consts.DELETE_KEY:
    d3.event.preventDefault();
    if (thisGraph.state.selectedNode){
      thisGraph.deleteNode(thisGraph.state.selectedNode["@id"])
    } else if (thisGraph.state.selectedLink){
      thisGraph.deleteLink()
    }
    break;
  }

  if (thisGraph.config.debug) console.log("bgKeyDown end");
}

FluidGraph.prototype.bgKeyUp = function() {
  this.state.lastKeyDown = -1;
};
