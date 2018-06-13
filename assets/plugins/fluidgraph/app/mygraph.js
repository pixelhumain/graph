
//Create a balise SVG with events
FluidGraph.prototype.initSvgContainer = function(firstBgElement){
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("initSgvContainer start");

  // listen for key events
  d3.select(window).on("keydown", function(){
      thisGraph.bgKeyDown.call(thisGraph);
  })
  .on("keyup", function(){
      thisGraph.bgKeyUp.call(thisGraph);
  });

  var svg;
  var element = firstBgElement.substring(1);

  if (thisGraph.config.bgElementType == "simple")  {

    svg = d3.select(firstBgElement)
          .append("svg")
          .attr("width", thisGraph.svgContainer.width)
          .attr("height", thisGraph.svgContainer.height)
          .append('g')
          .attr('id', "bg_"+element)
  }
  else  {  //panzoom
    var outer = d3.select(firstBgElement)
          .append("svg")
          .attr("width", thisGraph.svgContainer.width)
          .attr("height", thisGraph.svgContainer.height)

    thisGraph.zoomListener = d3.behavior
      .zoom()
      .scaleExtent([0.2, 2])
      .on("zoom", thisGraph.rescale);
      // Problème ici : https://hackmd.lescommuns.org/CwIwhgDAHBAmCmBaATNAZo48CMVFQGYCNYRk0CIB2AVlgNmCA===?both

    svg = outer
      .append('g')
      .call(thisGraph.zoomListener)
      .on("dblclick.zoom", null)
      .on("click", null)
      .on("dblclick", function(){
          if (thisGraph.config.newNodeWithDoubleClickOnBg)
            thisGraph.addNodeOnBg.call(this, thisGraph);
      })
      .append('g')
      .attr('id', "bg_"+element)
      .on("mousedown", function(d){
          thisGraph.bgOnMouseDown.call(thisGraph, d)
      })
      .on("mousemove", function(d){
          thisGraph.bgOnMouseMove.call(thisGraph, d)
      })
      .on("mouseup", function(d){
        if (thisGraph.config.makeLinkSelectingNode == "On")
        {
          console.log("mouseup sur bg")
          thisGraph.bgOnMouseUp.call(thisGraph, d)
        }
      })
      // .on("mouseover", function(d){
      //   // console.log("mouseover sur bg")
      //   d3.event.stopPropagation();
      // })
      // .on("mouseout", function(d){
      //   // console.log("mouseout sur bg")
      //   d3.event.stopPropagation();
      // })

    svg.append('rect')
          .attr('x', -thisGraph.svgContainer.width*3)
          .attr('y', -thisGraph.svgContainer.height*3)
          .attr('width', thisGraph.svgContainer.width*7)
          .attr('height', thisGraph.svgContainer.height*7)
          .attr('fill', thisGraph.config.backgroundColor)
  }

  thisGraph.bgElement = d3.select("#bg_"+element);

  if (thisGraph.config.makeLinkSelectingNode == "On")
    thisGraph.initDragLine();

  if (thisGraph.config.debug) console.log("initSgvContainer end");
}

FluidGraph.prototype.initDragLine = function(){
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("initDragLine start");

  // line displayed when dragging new nodes
  if (thisGraph.config.curvesLinks == "On")
  {
    thisGraph.drag_line = thisGraph.bgElement.append("path")
                          .attr("id", "drag_line")
                          .attr("class", "drag_line")
                          .attr("stroke-dasharray", "5,5")
                          .attr("stroke", "#999")
                          .attr("stroke-width", "2")
                          .attr("d", "M0 0 L0 0")
                          .attr("visibility", "hidden");
  }
  else {
    thisGraph.drag_line = thisGraph.bgElement.append("line")
                          .attr("id", "drag_line")
                          .attr("class", "drag_line")
                          .attr("stroke-dasharray", "5,5")
                          .attr("stroke", "#999")
                          .attr("stroke-width", "2")
                          .attr("x1", 0)
                    	    .attr("y1", 0)
                    	    .attr("x2", 0)
                    	    .attr("y2", 0)
                          .attr("visibility", "hidden");
  }

  if (thisGraph.config.debug) console.log("initDragLine start");
}

FluidGraph.prototype.activateForce = function(){
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("activateForce start");

  thisGraph.force = d3.layout.force()
                        .nodes(thisGraph.d3Data.nodes)
                        .links(thisGraph.d3Data.edges)
                        .size([thisGraph.svgContainer.width, thisGraph.svgContainer.height])
                        .linkDistance(thisGraph.config.linkDistance)
                        .charge(thisGraph.config.charge)

  if (thisGraph.config.elastic == "On")  {
    thisGraph.force.start()
    thisGraph.force.on("tick", function(args){
      thisGraph.movexy.call(thisGraph, args)})
  }  else { // Off
    // Run the layout a fixed number of times.
  	// The ideal number of times scales with graph complexity.
    thisGraph.force.start();
  	for (var t = 100; t > 0; --t) thisGraph.force.tick();
    thisGraph.force.stop();
  }

  if (thisGraph.config.debug) console.log("activateForce end");
}

FluidGraph.prototype.drawGraph = function(d3dataFc){
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("drawGraph start");

  var dataToDraw = d3dataFc || thisGraph.d3Data;

  if (typeof dataToDraw.nodes != "undefined")
  {
    //Update of the nodes
    dataToDraw.nodes.forEach(function(node)
            {
              if (typeof dataToDraw.nodes.px == "undefined")
              {
                node.px = node.x;
                node.py = node.y;
                node.weight = 1;
              }

            });

    thisGraph.svgNodesEnter = thisGraph.bgElement.selectAll("#node")
    				              .data(dataToDraw.nodes, function(d) { return d.index;})

    thisGraph.svgNodes = thisGraph.svgNodesEnter
                                .enter()
                        				.append("g")
                                .attr("id", "node")
                                .attr("class", "g_node")
                                .attr("index", function(d) { return d.index;})
                              if (thisGraph.config.allowDraggingNode == true)
                              {
                                thisGraph.svgNodesEnter.call(d3.behavior.drag()
                                    .on("dragstart", function(d){
                                      thisGraph.nodeOnDragStart.call(thisGraph, d3.select(this), d)})
                                    .on("drag", function(d){
                                      thisGraph.nodeOnDragMove.call(thisGraph, d3.select(this), d)})
                                    .on("dragend", function(d){
                                      thisGraph.nodeOnDragEnd.call(thisGraph, d3.select(this), d)})
                                )
                              }

    if (thisGraph.config.force == "On" || thisGraph.config.elastic == "On")
    {
      thisGraph.svgNodes.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
    }

    thisGraph.drawNodes(thisGraph.svgNodes);

    //delete node if there's less object in svgNodes array than in DOM
    thisGraph.svgNodesEnter.exit().remove();

    //Update links
    // Without force :
    // once you have object nodes, you can create d3data.edges without force.links() function

    // From the second time, we check every edges to see if there are number to replace by nodes objects
    dataToDraw.edges.forEach(function(link)
            {
              if (typeof(link.source) == "number")
              {
                link.source = dataToDraw.nodes[link.source];
                link.target = dataToDraw.nodes[link.target];
              }
            });

    thisGraph.svgLinksEnter = thisGraph.bgElement.selectAll(".link")
                  			.data(dataToDraw.edges, function(d) { return d.source.index + "-" + d.target.index; })

    if (thisGraph.config.curvesLinks == "On")
    {
      thisGraph.svgLinks = thisGraph.svgLinksEnter
                          .enter()
                          .insert("path", "#node")
    }
    else
    {
      thisGraph.svgLinks = thisGraph.svgLinksEnter
                          .enter()
                          .insert("line", "#node")
    }

    if (thisGraph.config.allowModifyLink == true)
    {
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
    }

    thisGraph.drawLinks(thisGraph.svgLinks);

    //delete link if there's less object in svgLinksEnter array than in DOM
    thisGraph.svgLinksEnter.exit().remove();

    thisGraph.svgLinksLabelEnter = thisGraph.bgElement.selectAll(".linksLabel")
        .data(dataToDraw.edges, function(d) { return d.source.index + "-" + d.target.index; })

    thisGraph.svgLinksLabel  =  thisGraph.svgLinksLabelEnter
        .enter()
    		.insert("text", "#node")
        .attr("class", "linksLabel")
        .attr("id", function(d) { return "label" + d.source.index + "_" + d.target.index })
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

    //delete label link if there's less object in svgLinksLabelEnter array than in DOM
    thisGraph.svgLinksLabelEnter.exit().remove();
  }

  // console.log("drawGraph end, thisGraph.d3Data : ", thisGraph.d3Data);

  if (thisGraph.config.debug) console.log("drawGraph end");
}

FluidGraph.prototype.movexy = function(){
  thisGraph = this;

  if (thisGraph.config.debug) console.log("movexy start");

  if (isNaN(thisGraph.svgNodesEnter[0][0].__data__.x) || isNaN(thisGraph.svgNodesEnter[0][0].__data__.y))
  {
    console.log("movexy problem if tick...",thisGraph.svgNodesEnter[0][0].__data__.x)
    throw new Error("movexy still problem if tick :-)...");
  }

  if (thisGraph.config.curvesLinks == "On")
  {
    if (thisGraph.config.curvesLinksType == "curve")
    {
      // curve
      thisGraph.bgElement.selectAll(".link").attr("d", function(d) {
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
    }
    else { // diagonal
      var link = thisGraph.bgElement.selectAll(".link");
      var node = thisGraph.bgElement.selectAll("#node");
      var targetNode = thisGraph.state.targetNode;
      var toto = thisGraph.d3Data;
      thisGraph.bgElement.selectAll(".link").attr("d", thisGraph.diagonal
  								.source(function(d) { return {"x":d.source.x, "y":d.source.y}; })
  								.target(function(d) { return {"x":d.target.x, "y":d.target.y}; })
  							)
    }
  }
  else { // line
    thisGraph.bgElement.selectAll(".link").attr("x1", function(d) { return d.source.x; })
		      .attr("y1", function(d) { return d.source.y; })
		      .attr("x2", function(d) { return d.target.x; })
		      .attr("y2", function(d) { return d.target.y; });
  }

  thisGraph.bgElement.selectAll(".linksLabel")
      .attr("x", function(d) {
        return d.source.x + (d.target.x - d.source.x)/2;
        })
      .attr("y", function(d) { return d.source.y + (d.target.y - d.source.y)/2; })

  thisGraph.bgElement.selectAll("#node").attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  if (thisGraph.config.debug) console.log("movexy end");
}

FluidGraph.prototype.newGraph = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("newGraph start");

  thisGraph.clearGraph();
  thisGraph.changeGraphName();
  thisGraph.typeLdpServer = "local";

  thisGraph.d3Data.nodes = thisGraph.mockData0.nodes;
  if (thisGraph.config.makeLinkSelectingNode == "On")
    thisGraph.initDragLine()
  localStorage.removeItem(thisGraph.config.version+"|"+thisGraph.consts.OPENED_GRAPH_KEY);
  thisGraph.drawGraph();
  thisGraph.movexy();

  var d3Node = thisGraph.searchD3NodeFromD(thisGraph.mockData0.nodes[0]);
  thisGraph.editNode.call(thisGraph, d3Node, thisGraph.mockData0.nodes[0]);
  //thisGraph.centerNode(thisGraph.mockData0.nodes[0]);

  if (thisGraph.config.debug) console.log("newGraph end");
}

FluidGraph.prototype.clearGraph = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("clearGraph start");

  thisGraph.resetMouseVars();
  thisGraph.resetStateNode();
  thisGraph.d3Data.nodes = [];
  thisGraph.d3Data.edges = [];
  thisGraph.graphName = thisGraph.consts.UNTILTED_GRAPH_NAME;
  thisGraph.removeSvgElements();

  if (thisGraph.config.debug) console.log("clearGraph end");
}

FluidGraph.prototype.refreshGraph = function() {
  var thisGraph = this;

  if (thisGraph.config.debug) console.log("refreshGraph start");

  thisGraph.resetMouseVars();
  if (thisGraph.config.force == "On")
    thisGraph.activateForce();

  thisGraph.resetStateNode();
  thisGraph.removeSvgElements();
  if (thisGraph.config.makeLinkSelectingNode == "On")
    thisGraph.initDragLine();
  thisGraph.drawGraph();
  if (thisGraph.config.force == "Off")
    thisGraph.movexy.call(thisGraph);

  if (thisGraph.config.debug) console.log("refreshGraph end");
}

FluidGraph.prototype.downloadGraph = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("downloadGraph start");

  var jsonD3 = thisGraph.d3DataToJsonD3();
  var blob = new Blob([jsonD3], {type: "text/plain;charset=utf-8"});
  var now = new Date();
  var date_now = now.getDate()+"-"+now.getMonth()+1+"-"+now.getFullYear()+"-"+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
  saveAs(blob, "Carto-"+thisGraph.graphName+"-"+date_now+".d3json");

  if (thisGraph.config.debug) console.log("downloadGraph end");
}

FluidGraph.prototype.uploadGraph = function(input) {

thisGraph = this;

if (thisGraph.config.debug) console.log("uploadGraph start");

  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var uploadFile = input[0].files[0];
    var filereader = new window.FileReader();

    filereader.onload = function(){
      var txtRes = filereader.result;
      // TODO better error handling
      try{
        thisGraph.clearGraph();
        thisGraph.d3Data = thisGraph.jsonD3ToD3Data(txtRes);
        thisGraph.changeGraphName();
        if (thisGraph.config.makeLinkSelectingNode == "On")
          thisGraph.initDragLine();
        thisGraph.drawGraph();
        thisGraph.movexy();
        thisGraph.saveGraphToLocalStorage();
        thisGraph.setOpenedGraph();
      }catch(err){
        window.alert("Error parsing uploaded file\nerror message: " + err.message);
        return;
      }
    };
    filereader.readAsText(uploadFile);
    $("#sidebarButton").click();

  } else {
    alert("Your browser won't let you save this graph -- try upgrading your browser to IE 10+ or Chrome or Firefox.");
  }

  if (thisGraph.config.debug) console.log("uploadGraph end");
}

FluidGraph.prototype.changeGraphName = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("changeGraphName start");

  if (thisGraph.typeLdpServer)
    $('#graphNameLabel').text(thisGraph.graphName + " ("+thisGraph.typeLdpServer+")");
  else
    $('#graphNameLabel').text(thisGraph.graphName);

  if (thisGraph.config.debug) console.log("changeGraphName end");
}

FluidGraph.prototype.getListOfGraphsInLocalStorage = function(type) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("getListOfGraphsInLocalStorage start");

  thisGraph.listOfLocalGraphs = [];
  Object.keys(localStorage)
      .forEach(function(key){
          var regexp = new RegExp(thisGraph.config.version);
           if (regexp.test(key)) {
             var keyvalue = [];
             keyvalue[0] = key.split("|").pop();
             keyvalue[1] = localStorage.getItem(key)

            if (keyvalue[0] != thisGraph.consts.OPENED_GRAPH_KEY)
             thisGraph.listOfLocalGraphs.push(keyvalue)
           }
       });

  if (type == "open")
  {
    if (thisGraph.listOfLocalGraphs.length)
    {
      d3.select('#openLocalGraphModalSelection').remove();
      openLocalGraphModalSelection = d3.select('#openLocalGraphModalList')
           .append("select")
           .attr("id", "openLocalGraphModalSelection")
           .attr("multiple", true)
           .attr("style","width:200px; height:100px")
           .on("click", function(d){
             thisGraph.selectOpenedGraphInModal.call(thisGraph, "local")})

      thisGraph.listOfLocalGraphs.forEach(function(value, index) {
       var option = openLocalGraphModalSelection
                   .append("option")
                   .attr("value", value[0])

                   if (thisGraph.graphName == thisGraph.consts.UNTILTED_GRAPH_NAME) //Untilted
                   {
                     if (index == 0)
                     {
                       option.attr("selected",true);
                       thisGraph.selectedGraphName = value[0];
                     }
                   }
                   else {
                     if (value[0] == thisGraph.selectedGraphName)
                     {
                       option.attr("selected",true);
                     }
                   }

       option.text(value[0])
      });
    }
  }

  if (thisGraph.config.debug) console.log("getListOfGraphsInLocalStorage end");
}

FluidGraph.prototype.getListOfGraphsInExternalStorage = function(externalStoreUri, type) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("getListOfGraphsInExternalStorage start");

  thisGraph.listOfExternalGraphs = [];

  if (type == "open")
  {
    // Prepare list of external store(s) to open

    d3.select("#openExternalGraphModalSelection").remove();
    openExternalGraphModalSelection = d3.select("#openExternalGraphModalList")
          .append("select")
          .attr("id", "openExternalGraphModalSelection")
          .attr("multiple", true)
          .attr("style","width:200px; height:100px")
          .on("click", function(){
            thisGraph.selectOpenedGraphInModal.call(thisGraph,"external")
          });

  }
  else { // Manage

    // Prepare list of external store(s) to manage

    d3.select("#manageExternalGraphModalTable").remove();
    var manageExternalGraphModalTable = d3.select("#manageExternalGraphModalDivTable")
                              .append("table")
                              .attr("id", "manageExternalGraphModalTable")
                              .attr("class","ui celled table")

    var manageExternalGraphModalThead = manageExternalGraphModalTable
                              .append("thread")

    var manageExternalGraphModalTrHead =  manageExternalGraphModalTable
                            .append("tr")

    manageExternalGraphModalTrHead.append("th")
                              .text("Name")
    manageExternalGraphModalTrHead.append("th")
                              .text("Content")
    manageExternalGraphModalTrHead.append("th")
                              .text("Action")

    var manageExternalGraphModalTbody =  manageExternalGraphModalTable.append("tbody")
  }

  // Get data to build list

  var newstore = new MyStore({ container : externalStoreUri,
                            context : "http://owl.openinitiative.com/oicontext.jsonld",
                            template : "",
                            partials : ""})

  newstore.list(externalStoreUri).then(function(list){
    list.forEach(function(item){
      var idOfExternalGraph;
      var nameOfExternalGraph;
      newstore.get(item["@id"]).then(function(graphElementJsonld){
        idOfExternalGraph = graphElementJsonld["@id"].split("/").pop();
        nameOfExternalGraph = graphElementJsonld["foaf:name"];

        if (idOfExternalGraph)
        {
          if (type == "open")
          {
            var option = openExternalGraphModalSelection
                        .append("option")
                        .attr("value", thisGraph.externalStore.uri+idOfExternalGraph)

                        if (thisGraph.graphName == thisGraph.consts.UNTILTED_GRAPH_NAME) //Untilted
                        {
                          option.attr("selected",true);
                        }
                        else {
                          if (nameOfExternalGraph == thisGraph.selectedGraphName)
                          {
                            option.attr("selected",true);
                          }
                        }

            option.text(nameOfExternalGraph + " ("+idOfExternalGraph+")");
          }
          else { //manage

            var nodesPreview = "(";
            // When bug of list() will be resolved:
            // Change by graphElementJsonld.nodes and node.label...
            var dataNodes = graphElementJsonld["http://www.fluidlog.com/2013/05/loglink/core#node"];
            dataNodes.every(function(node, index){
              if (index > 2)
              {
                nodesPreview += node["rdfs:label"].split(" ",2);
                return false;
              }
              else {
                if (index == dataNodes.length-1)
                  nodesPreview += node["rdfs:label"].split(" ",2);
                else
                  nodesPreview += node["rdfs:label"].split(" ",2) + ',';
                return true;
              }
            });
            nodesPreview += ")";

            var manageExternalGraphModalTrBody =  manageExternalGraphModalTbody
                                    .append("tr")

            manageExternalGraphModalTrBody.append("td")
                                    .text(nameOfExternalGraph+ " ("+idOfExternalGraph+")");

            manageExternalGraphModalTrBody.append("td")
                                    .text(nodesPreview);

            manageExternalGraphModalTrBody.append("td")
                                  .append("button")
                                  .attr("class", "ui mini labeled icon button")
                                  .on("click", function (){
                                    thisGraph.graphToDeleteName = externalStoreUri+idOfExternalGraph;
                                    thisGraph.deleteExternalGraph.call(thisGraph);
                                    thisGraph.getListOfGraphsInLocalStorage.call(thisGraph, "manage");
                                  })
                                  .text("Delete")
                                  .append("i")
                                  .attr("class", "delete small icon")
          }
        }
      });
    });
  });

  if (thisGraph.config.debug) console.log("getListOfGraphsInExternalStorage end");
}

FluidGraph.prototype.selectOpenedGraphInModal = function(type) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayContentOpenGraphModal start");

  thisGraph.typeLdpServer = type;

  if (thisGraph.typeLdpServer == "local")
  {
    //Get index selected if selection change
    var openLocalGraphModalSelection = d3.select('#openLocalGraphModalSelection');
    if (openLocalGraphModalSelection.node())
    {
      var selectedoption = openLocalGraphModalSelection.node().selectedIndex;
      thisGraph.selectedGraphName = openLocalGraphModalSelection.node().options[selectedoption].value;
    }
    thisGraph.loadLocalGraph(thisGraph.selectedGraphName);
  }
  else if (thisGraph.typeLdpServer == "external"){
    //Get index selected if selection change
    var openExternalGraphModalSelection = d3.select('#openExternalGraphModalSelection');
    if (openExternalGraphModalSelection.node())
    {
      var selectedoption = openExternalGraphModalSelection.node().selectedIndex;
      thisGraph.selectedLdpGraphName = openExternalGraphModalSelection.node().options[selectedoption].value;
    }
    thisGraph.loadExternalGraph(thisGraph.selectedLdpGraphName);
  }
  else if (!thisGraph.selectedGraphName)
  {
    thisGraph.selectedGraphName = thisGraph.graphName;
  }

  thisGraph.updateSelectOpenGraphModalPreview();

  if (thisGraph.config.debug) console.log("displayContentOpenGraphModal end");
}

FluidGraph.prototype.updateSelectOpenGraphModalPreview = function(type) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("updateSelectOpenGraphModalPreview start");

  d3.select("#contentSelectedOpenGraphModalPreview").remove();

  var contentOpenGraphModalPreview = d3.select("#openSelectedGraphModalPreview")
              .append("div")
              .attr("id", "contentSelectedOpenGraphModalPreview")
  var ul =  contentOpenGraphModalPreview
                .append("ul")

  //Use every instead of forEach to stop loop when you want
  thisGraph.d3Data.nodes.every(function(node, index) {
    var li = ul
              .append("li")
              .text(node.label)
    if (index > 4)
      return false;
    else
      return true
  });

  var total = contentOpenGraphModalPreview
                .append("div")
                .attr("id","totalSelectedOpenGraphModalPreview")
                .html("<b>Total of nodes :</b> "+thisGraph.d3Data.nodes.length+"<br> <b>Total of links :</b> "+thisGraph.d3Data.edges.length);

  if (thisGraph.config.debug) console.log("updateSelectOpenGraphModalPreview end");
}

FluidGraph.prototype.openGraph = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("openGraph start");

  thisGraph.resetMouseVars();
  thisGraph.removeSvgElements();
  if (thisGraph.config.makeLinkSelectingNode == "On")
    thisGraph.initDragLine();
  thisGraph.drawGraph();
  if (thisGraph.config.force == "Off")
    thisGraph.movexy.call(thisGraph);
  thisGraph.setOpenedGraph();

  if (thisGraph.config.debug) console.log("openGraph end");
}

FluidGraph.prototype.setOpenedGraph = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("rememberGraphOpened start");

  var graphNameToSet;

  if (thisGraph.typeLdpServer == "local")
    graphNameToSet = thisGraph.graphName;
  else { // external
    graphNameToSet = thisGraph.ldpGraphName;
  }

  localStorage.setItem(thisGraph.config.version
                      + "|" + thisGraph.consts.OPENED_GRAPH_KEY,
                      thisGraph.typeLdpServer + "|" + graphNameToSet)

  if (thisGraph.config.debug) console.log("rememberGraphOpened end");
}

FluidGraph.prototype.getOpenedGraph = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("rememberGraphOpened start");

  var openedGraphValue = localStorage.getItem(thisGraph.config.version+"|"+thisGraph.consts.OPENED_GRAPH_KEY);
  if (openedGraphValue)
  {
    thisGraph.typeLdpServer = openedGraphValue.split("|",1)[0];
    openedGraph = openedGraphValue.split("|").pop();
  }
  else openedGraph = null;

  if (thisGraph.config.debug) console.log("rememberGraphOpened end");

  return openedGraph;
}

FluidGraph.prototype.loadGraph = function(typeLdpServer, graphName) {
  thisGraph = this;

  var testGraph;
  if (thisGraph.config.debug) console.log("loadGraph start");

  if (typeLdpServer == "local")
  {
    testGraph = thisGraph.loadLocalGraph(graphName);
  }
  else { //external
    testGraph = thisGraph.loadExternalGraph(graphName);
  }

  if (thisGraph.config.debug) console.log("loadGraph end");
  return testGraph;
}

FluidGraph.prototype.loadLocalGraph = function(graphName) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("loadLocalGraph start");

  var localGraph = localStorage.getItem(thisGraph.config.version+"|"+graphName);

  //If there's a hash, remove it
  window.location.hash = "";
  thisGraph.d3Data = thisGraph.jsonD3ToD3Data(localGraph);
  thisGraph.graphName = graphName;
  thisGraph.changeGraphName();

  if (thisGraph.config.debug) console.log("loadLocalGraph end");
  return true;
}

FluidGraph.prototype.loadExternalGraph = function(externalGraphUri) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("loadExternalGraph start");

  $("#message").html("<p>Si la carto ne s'affichent pas, plusieurs raisons possibles :"
  + "<ul><li>Soit le serveur de base de données n'est pas disponible : "
  + "dans ce cas envoyez un email à <a href='mailto:contact@assemblee-virtuelle.org'>contact@assemblee-virtuelle.org</a></li>"
  + "<li>Acceptez l'exception de sécurité qui apparait en cliquant sur "
  +" <a href='https://ldp.virtual-assembly.org:8443/'>ce lien</a> jusqu'à obtenir un logo 'stample',"
  +"</li></p>").show();

  //If there's a hash, remove it to put the new one
  window.location.hash = externalGraphUri;

  store.get(externalGraphUri).then(function(externalGraph){
    if (externalGraph.nodes)
    {
      $("#message").hide();
      thisGraph.d3Data = thisGraph.jsonLdToD3Data(externalGraph);
      thisGraph.changeGraphName();
      thisGraph.ldpGraphName = externalGraphUri;
      if (thisGraph.selectedLdpGraphName)
        thisGraph.updateSelectOpenGraphModalPreview();

      thisGraph.openGraph();

      if (thisGraph.config.debug) console.log("loadExternalGraph end");
      return true;
    }
    else if (externalGraph["@id"])
    {
      thisGraph.createFluidGraph(externalGraph);
      thisGraph.activateForce();
      thisGraph.drawGraph();
      thisGraph.movexy();
    }
    return false;
  });
  return false;
}

FluidGraph.prototype.createFluidGraph = function(externalGraph) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("createFluidGraph start");

  var name = externalGraph["foaf:name"];
  var firstName = externalGraph["foaf:firstName"];
  var currentProjectObject = externalGraph["foaf:currentProject"];
  var currentProjectId = currentProjectObject["@id"];
  thisGraph.d3Data.nodes = [{index : 0,
                              "@id" : externalGraph["@id"],
                              label : firstName+ " " +name,
                              "@type" : "av:actor"},
                              {index : 1,
                              "@id" : currentProjectId,
                              label : currentProjectId,
                              "@type" : "av:project"}
                            ];

  thisGraph.d3Data.edges = [{index:0,
                          "@id" : "http://fluidlog.com/edge/0",
                          "@type":"foaf:currentProject",
                          source: 0,
                          target: 1}
                          ];


  if (thisGraph.config.debug) console.log("createFluidGraph end");
}

FluidGraph.prototype.displayContentManageGraphModal = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("displayContentManageGraphModal start");

  /*****************************
  *
  * Liste of local store(s)
  *
  ******************************/

  d3.select('#manageLocalGraphModalTable').remove();
  var manageLocalGraphModalTable = d3.select('#manageLocalGraphModalDivTable')
                            .append("table")
                            .attr("id", "manageLocalGraphModalTable")
                            .attr("class","ui celled table")

  var manageLocalGraphModalThead = manageLocalGraphModalTable
                            .append("thread")

  var manageLocalGraphModalTrHead =  manageLocalGraphModalTable
                          .append("tr")

  manageLocalGraphModalTrHead.append("th")
                            .text("Name")
  manageLocalGraphModalTrHead.append("th")
                            .text("Content")
  manageLocalGraphModalTrHead.append("th")
                            .text("Action")

  var manageLocalGraphModalTbody =  manageLocalGraphModalTable.append("tbody")


  thisGraph.listOfLocalGraphs.forEach(function(value, index) {
    try{
      var data = JSON.parse(value[1]);
    }catch(err){
      var data = null;
    }

    if (data)
    {
      var nodesPreview = "(";
      data.nodes.every(function(node, index){
        if (index > 2)
        {
          nodesPreview += node.label.split(" ",2);
          return false;
        }
        else {
          if (index == data.nodes.length-1)
            nodesPreview += node.label.split(" ",2);
          else
            nodesPreview += node.label.split(" ",2) + ',';
          return true;
        }
      });
      nodesPreview += ")";
    }

    var manageLocalGraphModalTrBody =  manageLocalGraphModalTbody
                            .append("tr")

    manageLocalGraphModalTrBody.append("td")
                            .text(value[0]);

    manageLocalGraphModalTrBody.append("td")
                            .text(' ' + nodesPreview);

    manageLocalGraphModalTrBody.append("td")
                          .append("button")
                          .attr("class", "ui mini labeled icon button")
                          .on("click", function (){
                            thisGraph.graphToDeleteName = value[0];
                            thisGraph.deleteLocalGraph.call(thisGraph);
                            thisGraph.typeLdpServer = "local";
                            thisGraph.getListOfGraphsInLocalStorage.call(thisGraph, "manage");
                            thisGraph.displayContentManageGraphModal.call(thisGraph);
                          })
                          .text("Delete")
                          .append("i")
                          .attr("class", "delete small icon")
  });

  if (thisGraph.config.debug) console.log("displayContentManageGraphModal end");
}

FluidGraph.prototype.deleteLocalGraph = function(skipPrompt) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("deleteLocalGraph start");

  doDelete = true;
  if (!skipPrompt){
    doDelete = window.confirm("Press OK to delete the local graph named : " + thisGraph.graphToDeleteName);
  }
  if(doDelete){
    localStorage.removeItem(thisGraph.config.version+"|"+thisGraph.graphToDeleteName);
    if (thisGraph.graphToDeleteName == thisGraph.graphName)
      thisGraph.newGraph();
  }

  if (thisGraph.config.debug) console.log("deleteLocalGraph end");
}

FluidGraph.prototype.deleteExternalGraph = function(skipPrompt) {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("deleteExternalGraph start");

  doDelete = true;
  if (!skipPrompt){
    doDelete = window.confirm("Press OK to delete the external graph named : " + thisGraph.graphToDeleteName);
  }
  if(doDelete){
    store.delete(thisGraph.graphToDeleteName);

    if (thisGraph.graphToDeleteName.split("/").pop() == thisGraph.graphName)
      thisGraph.newGraph();

    $("#closeManageGraphModal").click();

    thisGraph.graphToDeleteName = null;
  }

  if (thisGraph.config.debug) console.log("deleteExternalGraph end");
}

FluidGraph.prototype.displayExternalGraph = function(d3Node, d) {
  thisGraph = this;
  if (thisGraph.config.debug) console.log("displayExternGraph start");

  d3.event.stopPropagation();

  externalUri = d["@id"];

  var externalD3Data = thisGraph.getExternalD3Data(externalUri)

  if (externalD3Data)
  {
    thisGraph.d3Data = externalD3Data;

    thisGraph.resetMouseVars();
    thisGraph.resetStateNode();
    thisGraph.removeSvgElements();
    if (thisGraph.config.makeLinkSelectingNode == "On")
      thisGraph.initDragLine();
    thisGraph.drawGraph();
    if (thisGraph.config.force == "Off")
      thisGraph.movexy.call(thisGraph);
  }

  if (thisGraph.config.debug) console.log("displayExternGraph end");
}

FluidGraph.prototype.getExternalD3Data = function(externalUri) {
  var d3data;

  //Appelle main.php de manière synchrone. C'est à dire, attend la réponse avant de continuer
  $.ajax({
    type: 'GET',
    url: externalUri,
    dataType: 'json',
    success: function(t_data) {
      d3data = t_data;
      return false;
    },
    error: function(t_data) {
      console.log("Erreur Ajax : Message=" + t_data + " (Fonction getd3data()) !");
    },
    async: false
  });
  return d3data;
}

FluidGraph.prototype.saveGraph = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("saveGraph start");

  if (thisGraph.typeLdpServer == "local")
  {
    thisGraph.saveGraphToLocalStorage();
  }
  else { //external
    thisGraph.saveGraphToExternalStore();
  }

  if (thisGraph.config.debug) console.log("saveGraph end");

}

FluidGraph.prototype.saveGraphToLocalStorage = function() {
  thisGraph = this;
  if (thisGraph.config.debug) console.log("saveGraphToLocalStorage start");

  thisGraph.changeGraphName();
  thisGraph.selectedGraphName = thisGraph.graphName;

  if (thisGraph.config.remindSelectedNodeOnSave == false)
  {
    thisGraph.d3Data.nodes.forEach(function(node, i){
      if (node.fixed == true) node.fixed = false;
    });
  }

  localStorage.setItem(thisGraph.config.version+"|"+thisGraph.graphName,
                      thisGraph.d3DataToJsonD3())

  $("#message").text("Locally saved!").show().delay(1000).fadeOut();

  thisGraph.setOpenedGraph();

  if (thisGraph.config.debug) console.log("saveGraphToLocalStorage end");
}

FluidGraph.prototype.saveGraphToExternalStore = function() {
  thisGraph = this;
  if (thisGraph.config.debug) console.log("saveGraphToExternalStore start");

  var jsonLd = thisGraph.d3DataToJsonLd();

  if (thisGraph.graphName != thisGraph.consts.UNTILTED_GRAPH_NAME)
  {
    //add @id
    jsonLd["@id"] = thisGraph.ldpGraphName;

    //Bug : we do a get in order to get ETag
    // store.get(thisGraph.ldpGraphName)
    store.save(jsonLd);
    $("#message").text("Not saved, cause of bugs ! ;)").show().delay(1000).fadeOut();
  }
  else
  {
    store.save(jsonLd);
    $("#message").text("Saved in external store!").show().delay(1000).fadeOut();
  }

  // console.log("jsonLd " + JSON.stringify(jsonLd));

  if (thisGraph.config.debug) console.log("saveGraphToExternalStore end");
}

FluidGraph.prototype.publishGraph = function() {

  if (thisGraph.config.debug) console.log("publishGraph start");

  var jsonLd = thisGraph.d3DataToJsonLd();
  store.save(jsonLd);
  $("#message").text("Published in external store! You can open it ! :)").show().delay(1000).fadeOut();

  if (thisGraph.config.debug) console.log("publishGraph end");
}

FluidGraph.prototype.removeSvgElements = function() {
  thisGraph = this;

  if (thisGraph.config.debug) console.log("removeSvgElements start");

  d3.selectAll("#node").remove();
  d3.selectAll(".link").remove();
  d3.selectAll(".linksLabel").remove();
  d3.selectAll(".templink").remove();
  d3.selectAll("#neighbour_connector_link").remove();
  // if (thisGraph.config.makeLinkSelectingNode == "On")
  d3.selectAll("#drag_line").remove();

  if (thisGraph.config.debug) console.log("removeSvgElements end");
}

// From : http://bl.ocks.org/robschmuecker/7880033, to be improoved... :)
FluidGraph.prototype.pan = function(domNode, direction) {

  if (thisGraph.config.debug) console.log("pan start");

  var speed = thisGraph.panSpeed;
  var translateCoords, scaleX, scaleY, scale;
  var svgGroup = thisGraph.bgElement;

  if (thisGraph.panTimer) {
    clearTimeout(thisGraph.panTimer);
    translateCoords = d3.transform(svgGroup.attr("transform"));
    if (direction == 'left' || direction == 'right') {
      thisGraph.translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
      thisGraph.translateY = translateCoords.translate[1];
    } else if (direction == 'up' || direction == 'down') {
      thisGraph.translateX = translateCoords.translate[0];
      thisGraph.translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
    }
    scaleX = translateCoords.scale[0];
    scaleY = translateCoords.scale[1];
    scale = thisGraph.zoomListener.scale();
    svgGroup.transition().attr("transform", "translate(" + thisGraph.translateX + "," + thisGraph.translateY + ")scale(" + scale + ")");
    d3.select(domNode).select('g.node').attr("transform", "translate(" + thisGraph.translateX + "," + thisGraph.translateY + ")");
    thisGraph.zoomListener.scale(thisGraph.zoomListener.scale());
    thisGraph.zoomListener.translate([thisGraph.translateX, thisGraph.translateY]);
    thisGraph.panTimer = setTimeout(function() {
      thisGraph.pan(domNode, speed, direction);
    }, 50);
  }

  if (thisGraph.config.debug) console.log("pan end");
}

FluidGraph.prototype.resetMouseVars = function()
{
  if (thisGraph.config.debug) console.log("resetMouseVars start");

  thisGraph.state.mouseDownNode = null;
  thisGraph.state.mouseUpNode = null;
  thisGraph.state.mouseDownLink = null;

  if (thisGraph.config.debug) console.log("resetMouseVars end");
}

FluidGraph.prototype.resetStateNode = function() {
  thisGraph.state.selectedNode = null;
  thisGraph.state.openedNode = null;
  thisGraph.state.editedNode = null;
  thisGraph.state.draggingNode = null;
  thisGraph.state.draggingNodeSvg = null;
  thisGraph.state.dragStarted = null;
  thisGraph.state.targetNode = null;
  thisGraph.state.targetNodeSvg = null;
  thisGraph.state.dNeighbourConnector = null;
  thisGraph.state.neighbourConnection = null;
}
