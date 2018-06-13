// ============================================================================
//
// thisGraph.openNode(d3Node, dNode)
//
// ============================================================================


FluidGraph.prototype.openNode = function(d3Node, dNode, clicOnNodeAction) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("openNode start");

  //Close precedent opened node
  if (thisGraph.state.openedNode)
    thisGraph.closeNode.call(thisGraph, "opened", thisGraph.config.clicOnNodeAction);

  if (thisGraph.state.editedNode)
    thisGraph.closeNode.call(thisGraph, "edited");

  var el = d3Node;
  var p_el = d3.select(d3Node.node().parentNode); //p_el = g#node

  if (clicOnNodeAction == "flod")
  {
    el.select("#fo_content_closed_node_label").remove();
    el.select("#fo_content_closed_node_events").remove();
  }

  var neighbours = thisGraph.getNeighbourNodesAndLinks(dNode);
  var nbNeighbours = neighbours.nodes.length-1;
  var heightNeighbours = nbNeighbours
                          *thisGraph.customNodes.heightOpenedNeighbour
                          +nbNeighbours*2 //stroke of each neighbour
                          +thisGraph.customNodes.heightGhostNeighbour*7 + 10;
  if (heightNeighbours > thisGraph.customNodes.heightOpenedNeighboursMax)
    heightNeighbours = thisGraph.customNodes.heightOpenedNeighboursMax;

  var totalHeight = thisGraph.customNodes.heightOpenedOption
                    + thisGraph.customNodes.heightOpenedLabel
                    + heightNeighbours

  var xNodeCircle = thisGraph.customNodes.widthOpened / 2
  var yNodeCircle = totalHeight/2;
  var cyCircleIndex = totalHeight/2-5;
  var dyTextIndex = (totalHeight/2)-10;
  var cyCircleType = (totalHeight/2)-10;
  var yTypeImage = (totalHeight/2)-22;
  var ylabel = totalHeight/2;

  var totalWidth;

  el
    .select("#circle_index")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationOpen)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("cy", -cyCircleIndex)

  el
    .select("#text_index")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationOpen)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("dy", -dyTextIndex)

  el
    .select("#circle_type")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationOpen)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("cy", cyCircleType)

  el
    .select("#fo_type_image")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationOpen)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("y", yTypeImage)

  // el
  //   .select("#fo_content_closed_node_label")
  //   .transition()
  //   .duration(thisGraph.customNodes.transitionDurationOpen)
  //   .delay(thisGraph.customNodes.transitionDelay)
  //   .ease(thisGraph.customNodes.transitionEasing)
  //   .attr("y", -ylabel)

  if (clicOnNodeAction == "options")
  {
    xNodeCircle = xNodeCircle/2;
    yNodeCircle = yNodeCircle/2
    totalWidth = thisGraph.customNodes.widthOpened/2;
    totalHeight = totalHeight/2;
  }
  else {
    totalWidth = thisGraph.customNodes.widthOpened;
  }


  el
    .select("#nodecircle")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationOpen)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("x", -xNodeCircle)
    .attr("y", -yNodeCircle)
    .attr("width", totalWidth)
    .attr("height", totalHeight)
    .attr("rx", thisGraph.customNodes.curvesCornersOpenedNode)
    .attr("ry", thisGraph.customNodes.curvesCornersOpenedNode)
    .each("end", function(d) {
        thisGraph.displayContentOpenedNode.call(thisGraph, d3.select(this), d, neighbours, heightNeighbours, clicOnNodeAction)
    })

  thisGraph.state.openedNode = d3Node.node();

  if (thisGraph.config.debug) console.log("openNode end");
}


 // ============================================================================
 //
 // displayContentOpenedNode(d3Node, dNode, neighbours, heightNeighbours)
 //
 // ============================================================================


FluidGraph.prototype.displayContentOpenedNode = function(d3Node, dNode, neighbours, heightNeighbours, clicOnNodeAction) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayContentOpenedNode start");

  var el = d3Node.node();
  var p_el = d3.select(d3Node.node().parentNode); //p_el = g#node
  var totalHeight;

  if (clicOnNodeAction == "flod")
  {
    totalHeight = thisGraph.customNodes.heightOpenedOption // (-top > + bottom)
                    + thisGraph.customNodes.heightOpenedLabel
                    + heightNeighbours;
  }
  else if (clicOnNodeAction == "options")
  {
    totalHeight = thisGraph.customNodes.heightOpenedOption // (-top > + bottom)
                  + thisGraph.customNodes.heightOpenedLabel
  }

  // console.log("totalHeight : ",totalHeight)
  // console.log("y : ",-(totalHeight/2)-thisGraph.customNodes.heightOpenedOption)
  // console.log("heightNeighbours : ",heightNeighbours)

  // var totalHeightMoreOption = totalHeight+thisGraph.customNodes.heightOpenedOption;

  var xNode = -thisGraph.customNodes.widthOpened/2;
  var yNode = -(totalHeight/2)-thisGraph.customNodes.heightOpenedOption

  var fo_content_opened_node = p_el
        .append("foreignObject")
        .attr("id","fo_content_opened_node")
        .attr("x", xNode)
        .attr("y", yNode)
        .attr("width", thisGraph.customNodes.widthOpened)
        .attr("height", totalHeight)

  var fo_xhtml_content_open_node = fo_content_opened_node
        .append('xhtml:div')
        .attr("class", "fo_xhtml_content_open_node")
        .attr("id", "fo_xhtml_content_open_node")
        //Warning : using css doesn't work !?
        .attr("style","cursor:"+thisGraph.customNodes.cursor+";"
                      +"position:static;"
                      +"width:"+thisGraph.customNodes.widthOpened+"px;"
                      // +"height:"+totalHeightMoreOption+"px;"
                    )
        .on("mousedown",null)
        .on("mouseup",null)
        // .on("mouseover",function(d){
        //   console.log("mouseover on fo_xhtml_content_open_node")
        //   return null;
        // })
        // .on("mouseout",function(d){
        //   console.log("mouseout on fo_xhtml_content_open_node")
        //   thisGraph.nodeOnMouseOut.call(thisGraph, d3.select(this.parentNode.parentNode), d);
        // })
        // .on("dblclick",function(){
        //   console.log("dblclick on fo_xhtml_content_open_node")
        //   d3.event.stopPropagation();
        // })
        // .on("click", function(){
        //   console.log("click on fo_xhtml_content_open_node")
        //   d3.event.stopPropagation();
        // })

    /*
     * Options/action : Hypertext, delete...
     * */
    var xNodeOption = xNode;
    var yNodeOption = yNode-20;
    thisGraph.displayOptionMenu(fo_xhtml_content_open_node,
                                xNodeOption,
                                yNodeOption,
                                dNode,
                                "opened",
                                "node",
                                "large");

    /*
     *
     * Label
     *
     * */
     if (clicOnNodeAction == "flod")
     {
    var fo_xhtml_content_open_node_label = fo_xhtml_content_open_node
          .append('div')
          .attr("class", "fo_xhtml_content_open_node_label")
          .attr("id", "fo_xhtml_content_open_node_label")
          //Warning : using css doesn't work !?
          .attr("style", "width:"+thisGraph.customNodes.widthOpened+"px;"
                        // +"height:"+thisGraph.customNodes.heightOpenedLabel+"px;"
                        +"cursor:"+thisGraph.customNodes.cursor+";"
                        +"position:static;")
          .text(function(d){
            if (d.label.length > thisGraph.customNodes.maxCharactersInOpenNodeLabel)
              label = d.label.substring(0,thisGraph.customNodes.maxCharactersInOpenNodeLabel)+" ...";
            else {
              label = d.label;
            }
            return label;
          })
        }

    /*
     *
     * neighbours
     *
     * */

  if (clicOnNodeAction == "flod")
  {
    var heightNeighboursBox = heightNeighbours+10;
    var neighbours_box = fo_xhtml_content_open_node
       .append("div")
       .attr("class", "neighbours_box")
       .attr("id", "neighbours_box")
       .attr("style","background-color:rgba(" + thisGraph.customNodes.neighbourColorTypeRgba[dNode["@type"]]
                                   + "," + thisGraph.customNodes.strokeOpacity + ");"
                    +"height:"+heightNeighboursBox+"px;"
                     +"width:"+thisGraph.customNodes.widthOpenedNeighboursBox+"px;"
                     +"overflow: auto;"
                    //  + "border: 2px solid rgba("
                    //  + thisGraph.customNodes.neighbourColorTypeRgba[dNode["@type"]] + ","
                    //  + thisGraph.customNodesText.strokeOpacity + ");"
                     + "-moz-border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                     + "-webkit-border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                     + "border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                     + "display: flex;"
                     + "flex-direction:colomn;"
                     + "justify-content:center;"
                     + "align-content:center;"
                     + "align-items:center;"
        )

                                            // +"pointer-events: none;")
                              // .on("mousedown",function(d){
                              //   console.log("mousedown on neighbours_box");
                              //   d3.event.stopPropagation();
                              // })
                              // .on("mouseup",function(d){
                              //   console.log("mouseup on neighbours_box");
                              //   d3.event.stopPropagation();
                              // })
                              // .on("mouseover",function(d){
                              //   console.log("mouseover on neighbours_box");
                              //   return null;
                              // })
                              // .on("mouseout",function(d){
                              //   console.log("mouseout on neighbours_box");
                              //   return null;
                              // })
                              // .on("dragstart", function(d){
                              //   console.log("dragstart on neighbours_box");
                              //   d3.event.stopPropagation();
                              // })
                              // .on("drag", function(d){
                              //   console.log("drag on neighbours_box");
                              //   d3.event.stopPropagation();
                              // })
                              // .on("dragend", function(d){
                              //   console.log("dragend on neighbours_box");
                              //   d3.event.stopPropagation();
                              // })
                              // .on("dblclick",function(){
                              //   console.log("dblclick on neighbours_box");
                              //   d3.event.stopPropagation();
                              // })
                              // .on("click", function(){
                              //   console.log("click on neighbours_box");
                              //   d3.event.stopPropagation();
                              // })
                              // .on("zoom", function(){
                              //   console.log("zoom on neighbours_box");
                              //   d3.event.stopPropagation();
                              // })
                              // .on("dblclick.zoom", function(){
                              //   console.log("dblclick.zoom on neighbours_box");
                              //   d3.event.stopPropagation();
                              // })

      var heightNodeNeighbours = heightNeighbours+5;
     var node_neighbours = neighbours_box
                               .append("div")
                               .attr("class", "node_neighbours")
                               .attr("id", "node_neighbours")
                               .attr("style","height:"+heightNodeNeighbours+"px;"
                                              +"width:"+thisGraph.customNodes.widthOpenedNeighbours+"px;"
                                              )

    neighbours.nodes.sort(function(a, b){
      var aIndex = thisGraph.customNodes.listType.indexOf(a["@type"]);
      var bIndex = thisGraph.customNodes.listType.indexOf(b["@type"]);

      if (aIndex < bIndex)
        return -1;
      if (aIndex > bIndex)
        return 1;
      return 0;
    })

    var previousType = "";
    var previousNode;
    var neighbour_type_box;
    var labelType;
    var type;

    var nbNeighbours = neighbours.nodes.length-1 //without node itself

    thisGraph.customNodes.listType.forEach(function (typeInList, indexList){
      labelType = typeInList.split(":").pop();

      neighbour_type_box = node_neighbours
      .append("div")
      .attr("class", "neighbour_type_box")
      .attr("id", "neighbour_type_box_"+labelType)
      .attr("style", "background-color:rgba(" + thisGraph.customNodes.colorTypeRgba[typeInList]
                                  + "," + thisGraph.customNodes.strokeOpacity + ");"
                                  // + "border: 2px solid rgba("
                                  // + thisGraph.customNodes.strokeNeighbourColorTypeRgba[typeInList] + ","
                                  // + thisGraph.customNodes.strokeOpacity + ");"
                                  + "-moz-border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                                  + "-webkit-border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                                  + "border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                                  + "cursor:pointer;"
                                  + "padding:3px;"
                                  + "text-align: center;"
                                )

        // Add Ghost neighbour in box for each type
      thisGraph.addGhostNeighbours(neighbour_type_box, dNode, typeInList);

      neighbours.nodes.forEach(function(node){
        if (node["@type"] == typeInList && node.index != dNode.index)
        {
          // Liste of neighbours for the type
          thisGraph.addNeighbourInBox(neighbour_type_box, node)
        }
      })
    })

    // var withoutNode = thisGraph.mockData0.nodes[0];
    // var labelTypeWithout = withoutNode["@type"].split(":").pop();
    // neighbour_type_box = node_neighbours
    //       .append("div")
    //       .attr("class", "neighbour_type_box")
    //       .attr("id", "neighbour_type_box_"+labelTypeWithout)
    //
    // thisGraph.addGhostNeighbours(neighbour_type_box, withoutNode, withoutNode["@type"]);
  }

  thisGraph.MakeNodeLastInSvgSequence(dNode);

  if (thisGraph.config.debug) console.log("displayContentOpenedNode end");
}

FluidGraph.prototype.addNeighbourInBox = function(neighbour_type_box, dNode) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("addNeighbourInBox start");

  var neighboursLabel;
  if (dNode.label.length > thisGraph.customNodes.maxCharactersInNeighbours)
    neighboursLabel = dNode.label.substring(0,thisGraph.customNodes.maxCharactersInNeighbours)+" ...";
  else {
    neighboursLabel = dNode.label;
  }

  var labelType = dNode["@type"].split(":").pop();

  var xNode = $("#neighbour_type_box_"+labelType).position().left;
  var yNode = $("#neighbour_type_box_"+labelType).position().top;

  var node_neighbour = neighbour_type_box
    .insert("div", "#ghost_neighbour_"+labelType)
    .attr("class", "node_neighbour")
    .attr("id", "node_neighbour_"+labelType+"_"+dNode.index)
    .attr("style", function(d) {
      return "background-color:rgba(" + thisGraph.customNodes.neighbourColorTypeRgba[dNode["@type"]]
                                  + "," + thisGraph.customNodesText.strokeOpacity + ");"
                                  // + "border: 2px solid rgba("
                                  // + thisGraph.customNodes.strokeNeighbourColorTypeRgba[dNode["@type"]] + ","
                                  // + thisGraph.customNodesText.strokeOpacity + ");"
                                  + "cursor:pointer;margin:1px;"
                                  + "-moz-border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                                  + "-webkit-border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                                  + "border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                                  + "display: flex;"
                                  + "flex-direction:row;"
                                  + "justify-content:space-between;"
                                  + "align-content:center;"
                                  + "align-items:center;"
    })
    // .on("mouseover",function(d){
    //   console.log("mouseover on node_neighbour_"+labelType)
    //   var xNodeOption = xNode;
    //   var yNodeOption = yNode;
    //   thisGraph.displayOptionMenu(node_neighbour,
    //                               xNodeOption,
    //                               yNodeOption,
    //                               dNode,
    //                               "opened",
    //                               "neighbour",
    //                               "small");
    // })

  var node_neighbour_text = node_neighbour
    .append("div")
    .attr("class", "node_neighbour_text")
    .attr("id", "node_neighbour_text_"+labelType+"_"+dNode.index)
    .style("text-align", "center")
    .style("width", "100%")
    .text(neighboursLabel)
    .on("click",function(){
      var d3Node = thisGraph.searchD3NodeFromD(dNode);
      thisGraph.centerNode(dNode);
      thisGraph.openNode(d3Node, dNode);
    })

  var xNodeOption = xNode;
  var yNodeOption = yNode;
  thisGraph.displayOptionMenu(node_neighbour,
                              xNodeOption,
                              yNodeOption,
                              dNode,
                              "opened",
                              "neighbour",
                              "small");

  if (thisGraph.config.debug) console.log("addNeighbourInBox end");
}

FluidGraph.prototype.addGhostNeighbours = function(neighbour_type_box, dNode, typeGostNeighbour) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("addGhostNeighbours start");

  var labelTypeGostNeighbour = typeGostNeighbour.split(":").pop();
  var strokeNeighbourColorTypeRgba = thisGraph.customNodes.strokeNeighbourColorTypeRgba[typeGostNeighbour];
  var colorTypeRgba = thisGraph.customNodes.colorTypeRgba[typeGostNeighbour];

  var ghost_neighbour = neighbour_type_box
    .append("div")
    .attr("class", "ghost_neighbour")
    .attr("id", "ghost_neighbour_"+labelTypeGostNeighbour)
    .attr("style", "background-color:rgba(" + colorTypeRgba
        + "," + thisGraph.customNodes.strokeOpacityGhostNeighbour + ");"
        + "cursor:text;"
        // + "border:2px;"
        + "-moz-border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
        + "-webkit-border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
        + "border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
        + "padding:2px;"
        + "display: flex;"
        + "flex-direction:row;"
        + "justify-content:space-around;"
        + "align-content:center;"
        + "align-items:center;"
        + "height:"+thisGraph.customNodes.heightGhostNeighbour+"px;"
    )

  var ghost_neighbour_i = ghost_neighbour
    .append("div")
    .attr("class", "ghost_neighbour_i")
    .attr("id", "ghost_neighbour_i_"+labelTypeGostNeighbour)
    .attr("style", function(d) {
      return "background-color:rgba(" + colorTypeRgba
                                  + "," + thisGraph.customNodes.strokeOpacityGhostNeighbour + ");"
                                  + "display:inline-block;"
                                  + "text-align: center;padding:5px;"
                                  + "width:"+thisGraph.customNodes.widthGhostNeighbourImage+"px;"
                                  + "-moz-border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                                  + "-webkit-border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                                  + "border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
  })
  .append('i')
  .attr("id", "fo_i_center_image")
  .attr("class", "ui disabled large add circle icon")
   .attr("style", "display:inline;")

  var ghost_neighbour_txt = ghost_neighbour
  .append("div")
  .attr("class", "ghost_neighbour_txt")
  .attr("id", "ghost_neighbour_txt_"+labelTypeGostNeighbour)
  .attr("style", "background-color:rgba(" + thisGraph.customNodes.neighbourColorTypeRgba[typeGostNeighbour]
                                 + "," + thisGraph.customNodes.strokeOpacity + ");"
                                 + "display:inline-block;"
                                 + "text-align: left;"
                                 + "padding-left:3px;"
                                 + "overflow:auto;"
                                 + "width:"+thisGraph.customNodes.widthGhostNeighbourTxt+"px;"
                                 + "height:"+thisGraph.customNodes.heightGhostNeighbourTxt+"px;"
  )
  .text(labelTypeGostNeighbour+" ?")
  .on("click",function(d){
    var el = d3.select(this);
    el.attr("contentEditable", "true");
    el.node().focus()

    var elDiv = d3.select(this.parentNode);
    elDiv.style("height", thisGraph.customNodes.heightGhostNeighbourTxtMax+"px");
    el.style("height", thisGraph.customNodes.heightGhostNeighbourTxtMax-5+"px");
    el.style("border", "2px solid white");
  })

  var ghost_neighbour_button = ghost_neighbour
    .append("div")
    .attr("class", "ghost_neighbour_button")
    .attr("id", "ghost_neighbour_button_"+labelTypeGostNeighbour)
    .attr("style", function(d) {
      return "background-color:rgba(" + colorTypeRgba
                                  + "," + thisGraph.customNodes.strokeOpacityGhostNeighbour + ");"
                                  + "display:inline-block;"
                                  + "text-align: center;padding:5px;"
                                  + "width:"+thisGraph.customNodes.widthGhostNeighbourImage+"px;"
                                  + "-moz-border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                                  + "-webkit-border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                                  + "border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
  })
  .on("click",function(d){
    // Warning : mix of JQuery first (for the text) and then D3js syntax
    var $elTxt = $("#ghost_neighbour_txt_"+labelTypeGostNeighbour);
    var elTxtValue = $elTxt.text();
    var elType = labelTypeGostNeighbour;
    thisGraph.addNewNeighbour(d, elType, elTxtValue);

    //After creating the new neighbour
    $elTxt.text(elType+" ?");

    var el = d3.select(this);
    var elDiv = d3.select(this.parentNode);
    var elTxt = elDiv.select("#ghost_neighbour_txt_"+labelTypeGostNeighbour)
    elDiv.style("height", thisGraph.customNodes.heightGhostNeighbour+"px");
    elTxt.style("height", thisGraph.customNodes.heightGhostNeighbourTxt+"px");
    elTxt.style("border", "");
  })
  .append('i')
   .attr("id", "fo_i_center_image")
   .attr("class", "ui large play icon")
   .attr("style", "display:inline;cursor:pointer")

  if (thisGraph.config.debug) console.log("addGhostNeighbours end");
}

FluidGraph.prototype.addNeighbourOriginConnector = function(neighbour_type_box, dNodeSource, dNodeTarget) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("addNeighbourOriginConnector start");

  var neighbours = thisGraph.getNeighbourNodesAndLinks(dNodeSource);
  var labelType = dNodeTarget["@type"].split(":").pop();
  var nbNeighboursByType = 0;
  neighbours.nodes.forEach(function(node){
    if (node.index != 0)
      if (node["@type"] == dNodeTarget["@type"])
        nbNeighboursByType++;
  })
  var heightConnector = nbNeighboursByType * thisGraph.customNodes.heightOpenedNeighbour
                        + nbNeighboursByType * 2 //strokes
                        + thisGraph.customNodes.heightGhostNeighbour + 7;

  var d3NodeSource = thisGraph.searchD3NodeFromD(dNodeSource);

  var xFoNodeNeighbour = $("#neighbour_type_box_"+labelType).position().left;
  var yFoNodeNeighbour = $("#neighbour_type_box_"+labelType).position().top-42;
  var fo_node_neighbour = thisGraph.bgElement
        .append("foreignObject")
        .attr("id","fo_node_neighbour")
        .attr("x", xFoNodeNeighbour)
        .attr("y", yFoNodeNeighbour)
        .attr("width", thisGraph.customNodes.widthOpenedNeighbours)
        .attr("height", heightConnector)

  var fo_xhtml_node_neighbour = fo_node_neighbour
        .append('xhtml:div')
        .attr("class", "fo_xhtml_node_neighbour")
        .attr("id", "fo_xhtml_node_neighbour")
        //Warning : using css doesn't work !?
        .attr("style", "width:"+thisGraph.customNodes.widthOpenedNeighbours+"px;"
                      + "height:"+heightConnector+"px;"
                      + "position:static;")

  var dataNeighbourSourceFoConnector = [{"@type" : dNodeTarget["@type"],
                                        x : xFoNodeNeighbour + thisGraph.customNodes.widthOpenedNeighbours/2,
                                        y: yFoNodeNeighbour + heightConnector/2
                                        }]

  var colorRgba = thisGraph.customNodes.strokeNeighbourColorTypeRgba[dNodeTarget["@type"]];
  var neighbour_target_fo_connector = fo_xhtml_node_neighbour.selectAll(".neighbour_target_fo_connector")
        .data(dataNeighbourSourceFoConnector)
        .enter()
        .insert("div", "#ghost_neighbour_"+labelType)
        .attr("class", "neighbour_target_fo_connector")
        .attr("id", "neighbour_target_fo_connector_"+labelType)
        .attr("style", "background-color:rgba("+colorRgba+","
                                      + thisGraph.customNodes.neighbourConnectorOpacity + ");"
                                      + "cursor:pointer;"
                                      + "padding:30px;"
                                      + "text-align: center;"
                                      + "font-weight: bold;"
                                      + "-moz-border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                                      + "-webkit-border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                                      + "border-radius:" + thisGraph.customNodesText.curvesCorners + "px;"
                                      + "height:"+heightConnector+"px;"
                                      + "display: flex;"
                                      + "flex-direction:colomn;"
                                      + "justify-content:center;"
                                      + "align-content:center;"
                                      + "align-items:center;"
        )
        .text(thisGraph.customNodes.neighbourConnectorMessage)
        .on("mouseover",function(d){
          console.log("mouseover on neighbour_target_fo_connector")
          thisGraph.nodeOnMouseOver.call(thisGraph, d3NodeSource, dNodeSource)
        })
        .on("mouseout",function(d){
          console.log("mouseout on neighbour_target_fo_connector")
          thisGraph.nodeOnMouseOut.call(thisGraph, d3NodeSource, dNodeSource);
        })
        // .on("click", function(){
        //   console.log("click on neighbour_target_fo_connector")
        //   d3.event.stopPropagation();
        // })

  thisGraph.state.neighbourConnectorIsSet = true;

  if (thisGraph.config.debug) console.log("addNeighbourOriginConnector end");
}

FluidGraph.prototype.addNewNeighbour = function(dNode, ghostNeighbourType, ghostNeighbourLabel) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("addNewNeighbour start");

  console.log("addNewNeighbour start :", thisGraph.state.openedNode);

  var d3Node = thisGraph.searchD3NodeFromD(dNode);
  var divNeighbourBoxType = d3Node.select("#neighbour_type_box_"+ghostNeighbourType)
  var nbNeighbours = divNeighbourBoxType.node().childElementCount-1;
  var $divAddLinkButtonPosition = $("#ghost_neighbour_button_"+ghostNeighbourType).position();

  var xNode = thisGraph.customNodes.widthOpenedNeighbours
                  + $divAddLinkButtonPosition.left
                  + (nbNeighbours*thisGraph.customNodes.widthGhostNeighbourButton);

  var yNode = $divAddLinkButtonPosition.top
                  + (nbNeighbours*thisGraph.customNodes.widthGhostNeighbourButton);

  var preparedNode = {
                  "label" : ghostNeighbourLabel,
                  "@type" : thisGraph.customNodes.blankNodeType.split(":")[0]+":"+ghostNeighbourType,
                  "x" : xNode,
                  "y" : yNode,
                  "px" : xNode,
                  "py" : yNode,
                };

  console.log("addNewNeighbour addNeighbourInBox(divNeighbourBoxType,preparedNode) = ",
                                              divNeighbourBoxType,preparedNode);

  thisGraph.addNeighbourInBox(divNeighbourBoxType, preparedNode)

  console.log("addNewNeighbour var newNode = addDataNode(thisGraph,preparedNode) = ",
                                              thisGraph,preparedNode);

  var newNode = thisGraph.addDataNode(thisGraph, preparedNode);

  console.log("addNewNeighbour drawNewNode(dNode,preparedNode) = ",
                                              dNode,preparedNode);

  thisGraph.drawNewNode(dNode, preparedNode);

  console.log("addNewNeighbour addDataLink(dNode,newNode) = ", dNode,newNode);
  thisGraph.addDataLink(dNode, newNode);
  console.log("addNewNeighbour drawNewLink (newNode,dNode) = ", newNode,dNode);
  thisGraph.drawNewLink(newNode,dNode);

  console.log("MakeNodeLastInSvgSequence(dNode) = ", dNode);
  thisGraph.MakeNodeLastInSvgSequence(dNode);

  if (thisGraph.config.debug) console.log("addNewNeighbour end");
}


FluidGraph.prototype.openVideoInNode = function(d3Node, dNode) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("openVideoInNode start");

  //Close precedent opened node
  if (thisGraph.state.openedNode)
    thisGraph.closeNode.call(thisGraph, "opened", thisGraph.config.clicOnNodeAction);

  if (thisGraph.state.editedNode)
    thisGraph.closeNode.call(thisGraph, "edited");

  var el = d3Node;
  var p_el = d3.select(d3Node.node().parentNode); //p_el = g#node

  el.select("#fo_content_closed_node_label").remove();
  el.select("#fo_content_closed_node_events").remove();

  var totalHeight = thisGraph.customNodes.heightVideoInNode;

  var xNodeCircle = thisGraph.customNodes.widthOpened / 2
  var yNodeCircle = totalHeight/2;
  var cyCircleIndex = totalHeight/2-5;
  var dyTextIndex = (totalHeight/2)-10;
  var cyCircleType = (totalHeight/2)-10;
  var yTypeImage = (totalHeight/2)-22;
  var ylabel = totalHeight/2;

  el
    .select("#circle_index")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationOpen)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("cy", -cyCircleIndex)

  el
    .select("#text_index")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationOpen)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("dy", -dyTextIndex)

  el
    .select("#circle_type")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationOpen)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("cy", cyCircleType)

  el
    .select("#fo_type_image")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationOpen)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("y", yTypeImage)

  el
    .select("#nodecircle")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationOpen)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("x", -xNodeCircle)
    .attr("y", -yNodeCircle)
    .attr("width", thisGraph.customNodes.widthOpened)
    .attr("height", totalHeight)
    .attr("rx", thisGraph.customNodes.curvesCornersOpenedNode)
    .attr("ry", thisGraph.customNodes.curvesCornersOpenedNode)
    .each("end", function(d) {
      thisGraph.displayVideoInOpenedNode.call(thisGraph, d3.select(this), d)
    })

  thisGraph.state.openedNode = d3Node.node();

  if (thisGraph.config.debug) console.log("openVideoInNode end");
}

FluidGraph.prototype.displayVideoInOpenedNode = function(d3Node, dNode) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayVideoInOpenedNode start");

  var el = d3Node.node();
  var p_el = d3.select(d3Node.node().parentNode); //p_el = g#node

  var totalHeight = thisGraph.customNodes.heightVideoInNode;

  var xNode = -thisGraph.customNodes.widthOpened/2;
  var yNode = -(totalHeight/2)

  var fo_content_opened_node = p_el
        .append("foreignObject")
        .attr("id","fo_content_opened_node")
        .attr("x", xNode)
        .attr("y", yNode)
        .attr("width", thisGraph.customNodes.widthOpened)
        .attr("height", totalHeight)

  var fo_xhtml_content_open_node = fo_content_opened_node
        .append('xhtml:div')
        .attr("class", "fo_xhtml_content_open_node")
        .attr("id", "fo_xhtml_content_open_node")
        //Warning : using css doesn't work !?
        .attr("style","cursor:"+thisGraph.customNodes.cursor+";"
                      +"position:static;"
                      +"width:"+thisGraph.customNodes.widthOpened+"px;"
                      // +"height:"+totalHeightMoreOption+"px;"
                    )
        .on("mousedown",null)
        .on("mouseup",null)
        .on("click",null)

  /*
   *
   * Label
   *
   * */

  var fo_xhtml_content_open_node_label = fo_xhtml_content_open_node
        .append('div')
        .attr("class", "fo_xhtml_content_open_node_label")
        .attr("id", "fo_xhtml_content_open_node_label")
        //Warning : using css doesn't work !?
        .attr("style", "width:"+thisGraph.customNodes.widthOpened+"px;"
                      // +"height:"+thisGraph.customNodes.heightOpenedLabel+"px;"
                      +"cursor:"+thisGraph.customNodes.cursor+";"
                      +"position:static;")
        .text(function(d){
          if (d.label.length > thisGraph.customNodes.maxCharactersInOpenNodeLabel)
            label = d.label.substring(0,thisGraph.customNodes.maxCharactersInOpenNodeLabel)+" ...";
          else {
            label = d.label;
          }
          return label;
        })

  /*
   *
   * Vidéo
   *
   * */

  var fo_xhtml_content_open_node_video = fo_xhtml_content_open_node
        .append('div')
        .attr("class", "fo_xhtml_content_open_node_video")
        .attr("id", "fo_xhtml_content_open_node_video")
        //Warning : using css doesn't work !?
        .html(function(d){
          var html_video = "<iframe src="+d.hypertext+" width='200px' allowfullscreen>vidéo</iframe>"
          return html_video;
        })


  if (thisGraph.config.debug) console.log("displayVideoInOpenedNode end");
}
