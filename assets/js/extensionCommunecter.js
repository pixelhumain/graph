//wrap the first function defined in mygraph.js  displayExternalGraph and focusContextNode... for communecter

FluidGraph.prototype.displayExternalGraph = function(d3node, d) {
  thisGraph = this;
  if (thisGraph.config.debug) console.log("displayExternGraph start");

  d3.event.stopPropagation();

  externalUri = baseUrl+"/graph/co/fluid/id/"+d.identifier+"/type/"+d.type+"/view/true";

  console.log("displayExternGraph externalUri = "+externalUri);

  thisGraph.phData = {};
  thisGraph.phData = thisGraph.getExternalD3Data(externalUri);

  var returnData = createFluidGraph(d.type, d.identifier, thisGraph.phData);
  thisGraph.d3Data = {nodes : returnData.nodes, edges : returnData.edges}
  thisGraph.resetMouseVars();
  thisGraph.removeSvgElements();
  thisGraph.initDragLine();
  thisGraph.activateForce();
  thisGraph.drawGraph();

  if (thisGraph.config.debug) console.log("displayExternGraph end");
}

FluidGraph.prototype.focusContextNode = function(dNode) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("focusContextNode start");

  externalUri = baseUrl+"/graph/co/fluid/id/"+dNode.identifier+"/type/"+dNode.type+"/view/true";

  console.log("displayExternGraph externalUri = "+externalUri);

  thisGraph.phData = {};
  thisGraph.phData = thisGraph.getExternalD3Data(externalUri);

  var returnData = createFluidGraph(dNode.type, dNode.identifier, thisGraph.phData);
  thisGraph.d3Data = {nodes : returnData.nodes, edges : returnData.edges}
  thisGraph.resetMouseVars();
  thisGraph.removeSvgElements();
  thisGraph.initDragLine();
  thisGraph.activateForce();
  thisGraph.drawGraph();

  if (thisGraph.config.debug) console.log("focusContextNode end");
}

// à mettre à jour
FluidGraph.prototype.getHypertext = function(dNode) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("getHypertext start");

  return dNode.hypertext;

  if (thisGraph.config.debug) console.log("getHypertext end");
}
