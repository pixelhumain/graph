<?php
$cssAnsScriptFilesTheme = array(
  '/plugins/fluidgraph/library/semantic2.1.2.js',
  '/plugins/fluidgraph/library/d3.v3.min.js',
  '/plugins/fluidgraph/app/init.js',
  '/plugins/fluidgraph/app/mygraph.js',
  '/plugins/fluidgraph/app/mynodes.js',
  '/plugins/fluidgraph/app/myopenednode.js',
  '/plugins/fluidgraph/app/myeditednode.js',
  '/plugins/fluidgraph/app/mylinks.js',
  '/plugins/fluidgraph/app/mybackground.js',
  '/plugins/fluidgraph/app/convert.js',
  '/plugins/fluidgraph/css/fluidgraph.css',
  '/plugins/fluidgraph/css/semantic2.1.2.css',
  '/js/extensionCommunecter.js',
);

HtmlHelper::registerCssAndScriptsFiles($cssAnsScriptFilesTheme, Yii::app()->getModule( "graph" )->getAssetsUrl());
?>

<!--[if lt IE 11]>
      Votre navigateur est obsolète.
      Merci d'utiliser un navigateur récent : IE 9 (min), Firefox, Chrome ou Safari
      <![endif]-->

<script src="<?php echo $this->module->assetsUrl?>/plugins/fluidlog/loglink4.6/js/jquery-2.1.4.min.js"></script>

<script>
var baseUrl = "<?php echo Yii::app()->getRequest()->getBaseUrl(true);?>";
</script>

<style>

#chart{
  width: 100%;
}

	.fObjectCircle{
	border: 0px;
	margin: 0px auto;
	padding: 0;
	background-color: white;
	z-index: 4;

	}
	.fObjectCircle_circle{
	border: 0px;
	margin: 0px auto;
	padding: 0;
	background-color: white;
	z-index: 5;

	}
	.intocircle{
	border: 0px;
	color : steelblue;
	text-align: center;
	display:table;
	height : 100%;
	width : 100%;
	}
	.middlespan{
	display:table-cell;
	vertical-align:middle;
	}

	/*.circle_type {
	    cursor: pointer;
	    fill: #eee;
	    pointer-events: none;
	    stroke: #ddd;
	    stroke-width: 3px;
	}*/

	.pop-div .popover-content {
	    max-width: 310px;
	    height: 250px;
	    overflow-y:scroll;
	}

	.panel_legend{
		position: absolute;
		top:10px;
		left:15px;
		background: none repeat scroll 0 0 #5f8295;
		width: 150px;
		border: 2px solid #5f8295;
		color : white;
		text-align: center;
	}
	p.item_panel_legend {
	  margin-bottom: 3px;
	}

	.item_panel_legend {
	  padding-bottom: 3px;
	  padding-left: 15px;
	  padding-top: 3px;
	  text-align: left !important;
	}

	p {
		font-family: "Lato",arial,sans-serif;
  		line-height: 1.3em;
	  	text-align: center !important;
	}

	.rectLegend{
		width: 20px;
		height: 10px
	}

	.text_id{
		text-anchor: middle;
	}
</style>

<!-- <div id="ajaxSV">
<div class="center text-extra-large text-bold padding-20"  id="titre"></div>
</div> -->
  <div id="chart">
  </div>

<script>
var d3Data = [];
var contextDatafile = {};
var contextDataType = null;
var contextDataId = null;

console.log(<?php echo json_encode($data); ?>);
console.log(<?php echo json_encode(@$list); ?>);
console.log(<?php echo json_encode($links); ?>);
var tags = <?php echo json_encode($tags); ?>;
var nodes_data = <?php echo json_encode($data); ?>;
var links_data = <?php echo json_encode($links); ?>;

jQuery(document).ready(function() {
  $(window).resize(function() {

    clearTimeout(timer);
    timer = setTimeout(function() {
      force.stop();
      // $("#svgNodes").empty();
      $("#chart").empty();
      initViewer();
    }, 200);
  });

  phData = {nodes : nodes_data, edges : links_data};

  // var data = {
  //       nodes: [
  //               {id:"5a41573d8c8cee0d008b457f", index:0, group:0, label: "A", "type":"NGO", x:100, y:100 },
  //               {id: "projects", index:1, group:1, label: "B", "type":"NGO", x:200, y:200 },
  //               {id: "toto", index:2, group:1, label: "C", "type":"NGO", x:300, y:300 },
  //       ],
  //       edges: [
  //               { source: "5a41573d8c8cee0d008b457f", target: "projects" },
  //       ]
  // }

  var myGraph = new FluidGraph()

  myGraph.initSvgContainer("#chart");

  // CustomNodes
  myGraph.customNodes.strokeOpacity = 1;
  myGraph.customNodes.strokeWidth = 0;
  myGraph.customNodes.widthClosed = 30;
  myGraph.customNodes.displayType = "Off";
  myGraph.customNodes.displayText = "On";

  // CONFIG
  // CONFIG of the graph
  myGraph.config.force = "On";
  myGraph.config.elastic = "Off";
  myGraph.config.linkDistance = 100;
  myGraph.config.charge = -2000;
  myGraph.config.openNodeOnHover = 'off';

  // CONFIG of the FLOD / option mode
  myGraph.config.clicOnNodeAction = "options"; // options, flod

  // CONFIG of Edition parameters
  myGraph.config.editGraphMode = true;
  myGraph.config.allowDraggingNode = true;
  myGraph.config.allowModifyLink = false;
  myGraph.config.allowOpenNode = true;
  myGraph.config.editWithDoubleClick = false;
  myGraph.config.newNodeWithDoubleClickOnBg = false;
  myGraph.config.allowDragOnBg = false;

  // CONFIG of options menu
  myGraph.config.customOptions = {
    edit : false,
    center : false,
    focusContextOn : true,
    focusContextOff : false,
    hypertext : true,
    close : false,
    delete : false,
  }

  returnData = createFluidGraph(contextDataType, contextDataId, phData);
  myGraph.d3Data = {nodes : returnData.nodes, edges : returnData.edges}
  myGraph.customNodes.colorType = returnData.colorType;

  myGraph.customNodes.strokeColorType = {
                    "loglink:qui" : "#CCC",
                    "loglink:quoi" : "#CCC",
                    "loglink:quand" : "#CCC",
                    "loglink:pourquoi" : "#CCC",
                    "loglink:comment" : "#CCC",
                  };

  myGraph.customNodes.neighbourColorTypeRgba = {
                    "loglink:qui" : "255, 255, 0", // person (FFFF00)
                    "loglink:quoi" : "0, 128, 0", //organizations (008000)
                    "loglink:comment" : "128, 0, 128", // Projects (800080)
                    "loglink:quand" : "255, 165, 0", // Events (ffa500)
                    "loglink:pourquoi" : "255, 0, 0", // tags (ff0000)
                  };

  myGraph.activateForce();
  myGraph.drawGraph();

});

function searchIndexOfNodeId(o, searchTerm) {
  for (var i = 0, len = o.length; i < len; i++) {
    if (o[i].id === searchTerm) return i;
  }
  return -1;
}

function createFluidGraph(type, contextId, dataToD3) {
  console.log("createFluidGraph");
  // type et contextId sont utiles lors du focus+context, lorsqu'on revient dans la fonction.
  console.log("type = " + type);
  console.log("contextid = " + contextId);
  console.log("data = %o",dataToD3);

  var nodes= [];
  var edges= [];

  var index = 0;
  //links
  $.each(dataToD3.edges, function(type, obj) {
    // console.log("Début type : " + type);
    console.log("edges / Find indexes");

    indexSource = searchIndexOfNodeId(dataToD3.nodes,obj.source)
    indexTarget = searchIndexOfNodeId(dataToD3.nodes,obj.target)

    if (indexSource != -1 && indexTarget != -1)
    {
      edges.push({source : indexSource, target : indexTarget});
      console.log("source = " + indexSource + " ,target = " + indexTarget + ", obj = %o",obj);
    }
  });

  console.log("edges = %o",edges);

  var index = 0;
  var type = "";
  //nodes
  $.each(dataToD3.nodes, function(type, obj) {
    if (!obj.type)
      type = "none";
    else {
      type = obj.type; //typeMap[obj.type];
    }

    nodes.push({"@id" : index, "identifier" : obj.id, "hypertext" : baseUrl+"/#page.type."+type+".id."+obj.id, "type" : type, label : obj.label})
    index++;
  });

  console.log("nodes = %o",nodes);

  var typeObj = {
  	person : { col : "citoyens" ,ctrl : "person",titleClass : "bg-yellow",bgClass : "bgPerson",color:"yellow",icon:"user",lbh : "#person.invite",	},
  	citoyens : { sameAs:"person" },

  	poi:{  col:"poi",ctrl:"poi",color:"green-poi", titleClass : "bg-green-poi", icon:"map-marker",
  		subTypes:["link" ,"tool","machine","software","rh","RessourceMaterielle","RessourceFinanciere",
  			   "ficheBlanche","geoJson","compostPickup","video","sharedLibrary","artPiece","recoveryCenter",
  			   "trash","history","something2See","funPlace","place","streetArts","openScene","stand","parking","other" ] },
  	organization : { col:"organizations", ctrl:"organization", icon : "group",titleClass : "bg-green",color:"green",bgClass : "bgOrga"},
  	organizations : {sameAs:"organization"},
  	LocalBusiness : {col:"organizations",color: "azure",icon: "industry"},
  	NGO : {sameAs:"organization", color:"green", icon:"users"},
  	Association : {sameAs:"organization", color:"green", icon: "group"},
  	GovernmentOrganization : {col:"organization", color: "red",icon: "university"},
  	Group : {	col:"organizations",color: "turq",icon: "circle-o"},
  	event : {col:"events",ctrl:"event",icon : "calendar",titleClass : "bg-orange", color:"orange",bgClass : "bgEvent"},
  	events : {sameAs:"event"},
  	project : {col:"projects",ctrl:"project",	icon : "lightbulb-o",color : "purple",titleClass : "bg-purple",	bgClass : "bgProject"},
    projects : {sameAs:"project"},
    tag : {color:"red"},
  };

  // myGraph.customNodes.listType = ["loglink:qui",
  //                                 "loglink:pourquoi",
  //                                 "loglink:quoi",
  //                                 "loglink:ou",
  //                                 "loglink:comment",
  //                                 "loglink:quand",
  //                                 "loglink:combien",
  //                                 "loglink:without",
  //                                   ];

  // myGraph.customNodes.colorType = {"loglink:qui" : "#FFF800",
  //                                   "loglink:quoi" : "#FF0000",
  //                                   "loglink:pourquoi" : "#FF7400",
  //                                   "loglink:ou" : "#3C00FD",
  //                                   "loglink:comment" : "#23FE00",
  //                                   "loglink:quand" : "#9F00FD",
  //                                   "loglink:combien" : "#AAAAAA",
  //                                   "loglink:without" : "#FFFFFF"
  //                                   };

  coFludyType = { "person" : "loglink:qui",
                "organization" : "loglink:quoi",
                "event" : "loglink:quand",
                "project" : "loglink:comment",
                "tag" : "loglink:pourquoi",
                }

  // Remplacement des types dans les datas pour coller à l'ontologie du Quintilien
  for (indexNode in nodes)
  {
    var typeCo = nodes[indexNode].type;
    //Gestion des sameAs
    if (!typeObj[typeCo].sameAs)
      typeCoSameAs = typeCo;
    else {
      typeCoSameAs = typeObj[typeCo].sameAs;
    }
    nodes[indexNode]["@type"] = coFludyType[typeCoSameAs];
  }

  colorType = {}
  for (type in typeObj) {

    if (!typeObj[type].sameAs)
      fludyType = coFludyType[type];
    else {
      fludyType = coFludyType[typeObj[type].sameAs];
    }

    if (coFludyType[type]) // if "poi", do nothing
    {
      if (!typeObj[type].sameAs)
        colorType[fludyType] = typeObj[type].color;
      else {
        colorType[fludyType] = typeObj[typeObj[type].sameAs].color;
      }
    }
  };
  console.log("neighbourColorType = %o",colorType);

  return {nodes : nodes, edges : edges, colorType : colorType};
}

</script>
