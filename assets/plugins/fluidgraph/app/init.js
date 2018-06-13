/** @namespace */
var FluidGraph = function (firstBgElement){
  /*
  *
  *           Initialisation
  *
  ****************************/

  //Help to assure that it's the "this" of myGraph object
  var thisGraph = this;


  /**
   * Configuration Object
   * @memberof FluidGraph
   */
  thisGraph.config = {
    backgroundColor : "#F5F5F5",
    xNewNode : 200,
    yNewNode : 100,
    bgElementType : "panzoom", //choixe : "panzoom" or "simple"
    force : "Off",
    elastic : "Off",
    curvesLinks : "On",
    openNodeOnHover : "Off",
    displayIndex : "Off",
    proportionalNodeSize : "On",
    makeLinkSelectingNode : "Off", // default : Off
    linkDistance : 200,
    charge : -1000,
    debug : false,
    version : "loglink46",
    curvesLinksType : "diagonal", // choice : "curve" or "diagonal" default : "curve"
    viewerButtonLabel : "Launch Carto PAIR !",
    bringNodeToFrontOnHover : false,
    repulseNeighbourOnHover : false,
    awsomeStrokeNode : true,
    remindSelectedNodeOnSave : true,
    editGraphMode : false, // only use for checkbox
    allowDraggingNode : false, // default : false
    allowModifyLink : false, // default : false
    allowOpenNode : false, // default : false
    editWithDoubleClick : false, // default : false
    newNodeWithDoubleClickOnBg : false, // default : false
    allowDragOnBg : false,
    clicOnNodeAction : "options", // options, flod
    customOptions : {
      edit : true,
      center : true,
      focusContextOn : true,
      focusContextOff : true,
      hypertext : true,
      close : true,
      delete : true,
    }
  };

  /**
   * Base properties of the nodes
   * @memberof FluidGraph
   */
  thisGraph.customNodes = {
    strokeWidth : 10,
    strokeOpacity : .5,
    displayType : "On",
    displayText : "On",
    strokeOpacityGhostNeighbour : 1,
    listType : ["av:project","av:actor","av:idea","av:ressource","av:without"],
    colorType : {"av:project" : "#89A5E5",
                  "av:actor" : "#F285B9",
                  "av:idea" : "#FFD98D",
                  "av:ressource" : "#CDF989",
                  "av:without" : "#999",
                  "av:gray" : "gray"},
  	colorTypeRgba : {"av:project" : "137,165,229",
                      "av:actor" : "242,133,185",
                      "av:idea" : "255,217,141",
                      "av:ressource" : "205,249,137",
                      "av:without" : "255,255,255",
                      "av:gray" : "200,200,200"},
    strokeColor : "#CCC",
    strokeNeighbourColorType : {"av:project" : "#89A5E5",
                  "av:actor" : "#F285B9",
                  "av:idea" : "#FFD98D",
                  "av:ressource" : "#CDF989",
                  "av:without" : "#999"},
    strokeNeighbourColorTypeRgba : {"av:project" : "137,165,229",
                  "av:actor" : "242,133,185",
                  "av:idea" : "255,217,141",
                  "av:ressource" : "205,249,137",
                  "av:without" : "255,255,255"},
    neighbourColorTypeRgba : {"av:project" : "137,165,229",
                              "av:actor" : "242,133,185",
                              "av:idea" : "255,217,141",
                              "av:ressource" : "205,249,137",
                              "av:without" : "255,255,255"},
    imageType : {"av:project" : "lab", "av:actor" : "user", "av:idea" : "idea", "av:ressource" : "tree", "av:without" : "circle thin"},
    maxCharactersInLabel : 50,
    cursor : "move", //Value : grab or move (default), pointer, context-menu, text, crosshair, default
    cursorOpen : "default", //Value : grab or move (default), pointer, context-menu, text, crosshair, default
		heightClosed : 50,
    maxRadius : 40,

    // Width...
    widthClosed : 50,
    widthOpened : 260,
    widthOpenedNeighboursBox : 250,
    widthOpenedNeighbours : 220,
    widthGhostNeighbourImage : 30,
    widthGhostNeighbourTxt : 150,
    widthGhostNeighbourButton : 30,
    widthEdited : 220,
    widthEditedDescription : 180,
    widthEditedHypertext : 180,
    widthStrokeHover : 20,
    indiceProp : 2,

    // Height...
    heightOpened : 280,
    heightOpenedLabel : 50,
    heightOpenedOption : 20,
    heightOpenedNeighbour : 25,
    heightOpenedNeighboursMax : 200,
    heightGhostNeighbour : 40,
    heightGhostNeighbourTxt : 20,
    heightGhostNeighbourTxtMax : 70,
		heightEdited : 280,
    heightEditedDescription :80,
    heightEditedHypertext :60,

    maxCharactersInOpenNodeLabel : 50,
    maxCharactersInNeighbours : 20,
    curvesCornersClosedNode : 50,
    curvesCornersEditedNode : 20,
    curvesCornersOpenedNode : 20,

    // Transition...
		transitionEasing : "elastic", //Values : linear (default), elastic
    transitionDurationOpen : 300,
    transitionDurationEdit : 1000,
    transitionDurationClose : 300,
    transitionDurationComeBack : 500,
    transitionDurationConnector : 1500,
    transitionDurationCenterNode : 1200,
		transitionDelay : 0,
    blankNodeLabel : "",
    blankNodeType : "av:without",
    uriBase : "http://fluidlog.com/node/", //Warning : with LDP, no uriBase... :-)
    neighbourConnectorMessage : "Come here to create a link !",
    dropNodeInNeighboursMessage : "Yes ! Now, drop it to create a new neighbour !",
    neighbourConnectorOpacity : .9,
    neighbourConnectorOpacityDropped : 1,
    heightVideoInNode : 200,
  }

  if (thisGraph.config.awsomeStrokeNode == true)
  {
    thisGraph.customNodes.strokeColorType = {"av:project" : "#CCC",
                  "av:actor" : "#CCC",
                  "av:idea" : "#CCC",
                  "av:ressource" : "#CCC",
                  "av:without" : "#CCC"}
  }
  else {
    thisGraph.customNodes.strokeColorType = {"av:project" : "#89A5E5",
                  "av:actor" : "#F285B9",
                  "av:idea" : "#FFD98D",
                  "av:ressource" : "#CDF989",
                  "av:without" : "#999"}
  }

  thisGraph.nodeTypeIcon = {
    r : 13,
    cxClosed : 0,
    cxEdited : 0,
    cyClosed : (thisGraph.customNodes.heightClosed/2)-10,
    cyEdited : (thisGraph.customNodes.heightEdited/2)-10,
    xClosed : -11,
    xOpened : -11,
    xEdited : -11,
    yClosed : (thisGraph.customNodes.heightClosed/2)-20,
    yEdited : (thisGraph.customNodes.heightEdited/2)-20,
  }

  thisGraph.nodeIndexCircle = {
    r : 10,
    cxClosed : 0,
    cyClosed : -(thisGraph.customNodes.heightClosed/2)+6,
    cxEdited : 0,
    cyEdited : -(thisGraph.customNodes.heightOpened/2),
    dxClosed : 0,
    dyClosed : -(thisGraph.customNodes.heightClosed/2)+10,
    dxEdited : 0,
    dyEdited : -(thisGraph.customNodes.heightOpened/2)+5,
  }

  thisGraph.customNodesText = {
    fontSize : 14,
    FontFamily : "Helvetica Neue, Helvetica, Arial, sans-serif;",
    strokeOpacity : .5,
    widthMax : 160,
		heightMax : 60,
    curvesCorners : thisGraph.customNodes.curvesCornersOpenedNode,
  }

  thisGraph.customLinks = {
    strokeWidth: 3,
    strokeColor: "#CCC",
    strokeColorError: "#FDAAAA",
    strokeSelectedColor: "#999", //See also fluidgraph.css
    uriBase : "http://fluidlog.com/edge/", //Warning : with LDP, no uriBase... :-)
    predicate : "loglink:linkedto",
    transitionDurationOverLinks : 300,
  }

  thisGraph.customLinksLabel = {
    width : 200,
    height : 80,
    fillColor : "#CCC",
    strokeColor : "#DDD",
    curvesCorners : 20,
    blankNodeLabel : "loglink:linkto",
  }

  thisGraph.svgContainer = {
    width : window.innerWidth - 30,
    height : window.innerHeight - 30,
  }

  /**
   * Mouse event variables
   * @memberof FluidGraph
   */
  thisGraph.state = {
    selectedNode : null,
    selectedLink : null,
    mouseDownNode : null,
    mouseDownLink : null,
    svgMouseDownNode : null,
    mouseUpNode : null,
    lastKeyDown : -1,
    editedNode : null,
    editedIndexNode : null,
    openedNode : null,
    editedLinkLabel : null,
    dragStarted : null,
    draggingNode : null,
    draggingNodeSvg : null,
    targetNode : null,
    targetNodeSvg : null,
    focusMode : null,
    dNeighbourConnector : null,
    neighbourConnectorIsSet : null,
    neighbourConnection : null,
  }

  thisGraph.graphName = thisGraph.consts.UNTILTED_GRAPH_NAME;
  thisGraph.openedGraph = null;
  thisGraph.selectedGraphName = null;
  thisGraph.ldpGraphName = null;
  thisGraph.selectedLdpGraphName = null;
  thisGraph.typeLdpServer = "local"; //local or external, default : local
  thisGraph.mockData0 = null;
  thisGraph.listOfLocalGraphs = [];
  thisGraph.listOfExtenalGraphs = [];
  thisGraph.graphToDeleteName = null;
  thisGraph.firstBgElement = null;
  thisGraph.d3Data = {};
  thisGraph.d3Data.nodes = [];
  thisGraph.d3Data.edges = [];
  thisGraph.bgElement = null;
  thisGraph.svgNodesEnter = [];
  thisGraph.svgLinksEnter = [];
  thisGraph.svgLinksLabelEnter = [];
  thisGraph.diagonal = d3.svg.diagonal();
  thisGraph.panBoundary = 20; // Within 20px from edges will pan when dragging.
  thisGraph.panBgBoundaryRate = 10;
  thisGraph.panBgLRBoundary = thisGraph.svgContainer.width / thisGraph.panBgBoundaryRate;
  thisGraph.panBgUDRBoundary = thisGraph.svgContainer.height / thisGraph.panBgBoundaryRate;
  thisGraph.panTimer = null;
  thisGraph.panBgSpeed = 20;
  thisGraph.panSpeed = 50;
  thisGraph.zoomListener = null;
  thisGraph.translateX = null;
  thisGraph.translateY = null;

  // dbpedia : http://dbpedia.org/resource/ (John_Lennon)
  // thisGraph.rwwplayUri = "https://localhost:8443/2013/cartopair/";
  // thisGraph.rwwplayUri = "https://212.47.232.171:8443/2013/cartopair/";
  // thisGraph.semFormsUri = "http://localhost:9000/ldp/cartopair/";

  /**
   * URI of the External LDP Store currently used (should be in a config object ?)
   * @memberof FluidGraph
   */
  thisGraph.rwwplayUri = "https://ldp.virtual-assembly.org:8443/2013/cartopair/";


  /**
   * External LDP Store information stored as object
   * @memberof FluidGraph
   */
  thisGraph.externalStore = {
    uri : thisGraph.rwwplayUri,
    context : {
      "@context":{
        "loglink": "http://www.fluidlog.com/2013/05/loglink/core#",
        "nodes": "http://www.fluidlog.com/2013/05/loglink/core#node",
        "label": "http://www.w3.org/2000/01/rdf-schema#label",
        "index": "http://www.fluidlog.com/2013/05/loglink/core#index",
        "x": "http://www.fluidlog.com/2013/05/loglink/core#x",
        "y": "http://www.fluidlog.com/2013/05/loglink/core#y",
        "edges": "http://www.fluidlog.com/2013/05/loglink/core#edge",
        "source": "http://www.fluidlog.com/2013/05/loglink/core#source",
        "target": "http://www.fluidlog.com/2013/05/loglink/core#target",
        "hypertext": "http://www.fluidlog.com/2013/05/loglink/core#hypertext",
        "av": "http://www.assemblee-virtuelle.org/ontologies/v1.owl#",
        "foaf": "http://xmlns.com/foaf/0.1/"
      }
    }
  }
}

/**
 * Some constant defined to be used by the Graph instance
 * Come from : https://github.com/cjrd/directed-graph-creator/blob/master/graph-creator.js
 * @memberof FluidGraph
 */
FluidGraph.prototype.consts =  {
  selectedClass: "selected",
  connectClass: "connect-node",
  circleGClass: "conceptG",
  graphClass: "graph",
  BACKSPACE_KEY: 8,
  DELETE_KEY: 46,
  ENTER_KEY: 13,
  nodeRadius: 50,
  OPENED_GRAPH_KEY: "openedGraph",
  UNTILTED_GRAPH_NAME: "Untilted",
};
