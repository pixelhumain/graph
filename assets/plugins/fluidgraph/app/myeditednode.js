FluidGraph.prototype.editNode = function(d3Node, d) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("editNode start");

  if (d3.event)
    d3.event.stopPropagation();

  if (thisGraph.state.editedNode !== d3Node.node() && thisGraph.state.editedNode !== null)
    thisGraph.closeNode.call(thisGraph, "edited");

  // console.log("thisGraph.state.openedNode : ", thisGraph.state.openedNode);
  // console.log("d3Node.node() : ", d3Node.node());
  if (thisGraph.state.openedNode)
    thisGraph.closeNode.call(thisGraph, "opened", thisGraph.config.clicOnNodeAction);

  var el = d3Node;
  var p_el = d3.select(d3Node.node().parentNode); //p_el = g#node

  el.select("#fo_content_closed_node_label").remove();
  el.select("#fo_content_closed_node_events").remove();

  el
    .select("#circle_index")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationEdit)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("cx", thisGraph.nodeIndexCircle.cxEdited)
    .attr("cy", thisGraph.nodeIndexCircle.cyEdited)

  el
    .select("#text_index")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationEdit)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("dx", thisGraph.nodeIndexCircle.dxEdited)
    .attr("dy", thisGraph.nodeIndexCircle.dyEdited)

  el
    .select("#circle_type")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationEdit)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("cx", thisGraph.nodeTypeIcon.cxEdited)
    .attr("cy", thisGraph.nodeTypeIcon.cyEdited)

  el
    .select("#fo_type_image")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationEdit)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("x", thisGraph.nodeTypeIcon.xEdited)
    .attr("y", thisGraph.nodeTypeIcon.yEdited)

  el
    .select("#nodecircle")
    .transition()
    .duration(thisGraph.customNodes.transitionDurationEdit)
    .delay(thisGraph.customNodes.transitionDelay)
    .ease(thisGraph.customNodes.transitionEasing)
    .attr("x", -thisGraph.customNodes.widthEdited / 2)
    .attr("y", -thisGraph.customNodes.heightEdited / 2)
    .attr("rx", thisGraph.customNodes.curvesCornersEditedNode)
    .attr("ry", thisGraph.customNodes.curvesCornersEditedNode)
    .attr("width", thisGraph.customNodes.widthEdited)
    .attr("height", thisGraph.customNodes.heightEdited)
    .each("end", function(d) {
      thisGraph.displayContentEditedNode.call(thisGraph, d3.select(this), d)
    })

  thisGraph.state.editedNode = d3Node.node();
  thisGraph.state.editedIndexNode = thisGraph.d3Data.nodes.indexOf(d);

  if (thisGraph.config.debug) console.log("editNode end");
}

FluidGraph.prototype.displayContentEditedNode = function(d3Node, dNode) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayContentEditedNode start");

  var el = d3Node.node();
  var p_el = d3.select(d3Node.node().parentNode); //p_el = g#node

  /*
   *
   * Content of the node
   *
   * */

  var fo_content_edited_node_label = p_el
        .append("foreignObject")
        .attr("id","fo_content_edited_node_label")
        .attr("x", -thisGraph.customNodes.widthEdited/2)
        .attr("y", -thisGraph.customNodes.heightEdited/2)
        .attr("width", thisGraph.customNodes.widthEdited)
        .attr("height", thisGraph.customNodes.heightEdited)
        .on("mousedown",null)
        .on("mouseup",null)
        .on("mouseover",null)
        .on("dblclick",function(d){
          d3.event.stopPropagation();
        })

  var fo_xhtml_content_edited_node_label = fo_content_edited_node_label
        .append('xhtml:div')
        .attr("class", "fo_xhtml_content_edited_node_label")
        //Warning : using css doesn't work !
        .attr("style", "width:"+thisGraph.customNodes.widthEdited+"px;"
                      +"height:"+thisGraph.customNodes.heightEdited+"px;"
                      +"cursor:"+thisGraph.customNodes.cursor+";"
                      +"position:static;")

  /*
   * Options/action : Hypertext, delete...
   * */
  var xNodeOption = 0;
  var yNodeOption = 0;
  thisGraph.displayOptionMenu(fo_xhtml_content_edited_node_label,
                                xNodeOption,
                                yNodeOption,
                                dNode,
                                "edited",
                                "node",
                                "large");


  //Node Segment
  var  node_segment = fo_xhtml_content_edited_node_label
        .append("div")
        .attr("class", "ui raised segment")
        .attr("style", "position:static;margin:0px;padding:10px")

  //Form Segment
  var form_segment = node_segment
        .append("div")
        .attr("class", "ui form top attached segment")
        .attr("style", "position:static;margin-top:0px;padding:0px")

      /*
       *
       * index
       *
       * */

  if (thisGraph.config.displayIndex == "On")
  {
    var field_index = form_segment
           .append("div")
           .attr("class", "id")
           .attr("style", "margin:0px")

    //Node label index
    var node_label_type = field_index
          .append("label")
          .attr("style", "margin:0;")
          .html("<b>Index</b>")

    //content index
    var edit_node_input_index = field_index
          .append("input")
          .attr("id", "edit_node_input_index")
          .attr("style", "padding:0px; margin-left:20px; width:50px")
          .attr("value", dNode.index)
  }

      /*
       *
       * Type
       *
       * */

   var field_type = form_segment
         .append("div")
         .attr("class", "field")
         .attr("style", "margin:0px")

  //Node label type
  var node_label_type = field_type
        .append("label")
        .attr("style", "margin:0;")
        .text("Type")

  //select type
  var edit_node_select_type = field_type
        .append("select")
        .attr("id", "edit_node_select_type")
        .attr("style", "padding:0px")

  thisGraph.customNodes.listType.forEach(function(type) {
    var option = edit_node_select_type.append("option")

    option.attr("value", type)

    if (dNode["@type"] === type)
      option.attr("selected",true)

    option.text(type)

  });

  /*
   *
   * Description
   *
   * */

var field_description = form_segment
  .append("div")
  .attr("class", "field")
  .attr("style", "margin:0px")

//Node label 1 (description)
var node_label_1 = field_description
  .append("label")
  .attr("style", "margin:0;")
  .text("Description")

//Node textarea
var edit_node_textarea_label = field_description
  .append("textarea")
  .attr("id", "edit_node_textarea_label")
  .attr("placeholder", 'Description')
  .attr("style", "padding:0;min-height:0;"
                +"height:"+thisGraph.customNodes.heightEditedDescription+"px;"
                +"width:"+thisGraph.customNodes.widthEditedDescription+"px;")
              .text(function() {
                this.focus();
                  return dNode.label;
              })

/*
 *
 * Hypertext
 *
 * */

var field_hypertext = form_segment
  .append("div")
  .attr("class", "field")
  .attr("style", "margin:0px")

//Node label 1 (Hypertext)
var node_label_1 = field_description
  .append("label")
  .attr("style", "margin:0;")
  .text("Hypertext")

//Node textarea
var edit_node_input_hypertext = field_description
  .append("textarea")
  .attr("id", "edit_node_input_hypertext")
  .attr("placeholder", 'External link')
  .attr("style", "padding:0;min-height:0;"
                  +"height:"+thisGraph.customNodes.heightEditedHypertext+"px;"
                  +"width:"+thisGraph.customNodes.widthEditedHypertext+"px;")
  .text(dNode.hypertext)

  thisGraph.MakeNodeLastInSvgSequence(dNode);

  if (thisGraph.config.debug) console.log("displayContentEditedNode end");
}
