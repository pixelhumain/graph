<?php
$cssAnsScriptFilesTheme = array(
  '/plugins/fluidlog/loglink4.6/js/d3.v3.min.js',
  '/plugins/fluidlog/loglink4.6/js/mygraph.js',
  '/plugins/fluidlog/loglink4.6/js/mynodes.js',
  '/plugins/fluidlog/loglink4.6/js/mylinks.js',
  '/plugins/fluidlog/loglink4.6/js/mybackground.js',
  '/plugins/fluidlog/loglink4.6/js/extensionCommunecter.js',
  '/plugins/fluidlog/loglink4.6/js/semantic2.1.2.js',
  '/plugins/fluidlog/loglink4.6/css/loglink4.6.css',
  '/plugins/fluidlog/loglink4.6/css/semantic2.1.2.css',
);

HtmlHelper::registerCssAndScriptsFiles($cssAnsScriptFilesTheme, Yii::app()->getModule( "graph" )->getAssetsUrl());
?>

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
</div> -->
  <div id="chart">
	   <div class="center text-extra-large text-bold padding-20"  id="titre"></div>
  </div>


<div class="panel_legend" style="max-width: 250px;">
	<p name"].'"="" id="item_panel_legend_'.$tag[" class="item_panel_legend">
		<span>
		</span></p><center><i>Legends
		</i><center>

	<p></p>
</center></center></div>

<script>
var d3data = [];
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

  data = {nodes : nodes_data, edges : links_data};

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

  console.log("d3data = %o", d3data);

  if (d3data != null) {
    // var myGraph = new FluidGraph("#ajaxSV #chart", d3data)
    d3data = createFluidGraph(contextDataType, contextDataId, data)

    var myGraph = new FluidGraph("#chart", d3data)

    myGraph.initSgvContainer("bgElement");
    myGraph.config.force = "On";
    myGraph.config.elastic = "Off";
    myGraph.config.editGraphMode = false;
    myGraph.config.editMode = false;
    myGraph.config.linkDistance = 100;
    myGraph.config.charge = -2000;
    myGraph.activateForce();
    myGraph.customNodes.displayId = true;
    myGraph.customNodes.listType = []; //["project", "organization", "event", "person", "tag", "none"];

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

    myGraph.customNodes.colorType = {}
    for (type in typeObj) {
      if (!typeObj[type].sameAs)
        myGraph.customNodes.colorType[type] = typeObj[type].color;
      else {
        myGraph.customNodes.colorType[type] = typeObj[typeObj[type].sameAs].color;
      }
    };
    console.log("colorType = %o",myGraph.customNodes.colorType);

    myGraph.customNodes.colorTypeRgba = {};
    // myGraph.customNodes.colorTypeRgba = {
    //                   "project" : "140, 90, 161", //"137,165,229"
    //                   "organization" : "148, 192, 27", //"255,217,141",
    //                   "event" : "255, 199, 4", //"205,249,137",
    //                   "person" : "242,133,185",
    //                   "tag" : "98, 12.2, 18.4",
    //                   "none" : "87.1, 78.8, 95.3",
    //                 };

    myGraph.customNodes.imageType = {
                      "project" : "idea",
                      "organization" : "users",
                      "event" : "calendar",
                      "person" : "user",
                      "tag" : "tag",
                      "none" : "none",
                    };

    myGraph.customNodes.strokeColorType = {
                      "project" : "#CCC",
                      "organization" : "#CCC",
                      "event" : "#CCC",
                      "person" : "#CCC",
                      "tag" : "#CCC",
                      "none" : "#CCC",
                    };

    myGraph.drawGraph();

    //Legend
    var legendHtml = "<div><p></p>"
    for (var i = 0; i < myGraph.customNodes.listType.length; i++) {
      legendHtml += "<div><p class='item_panel_legend'><i class='fa fa-square fa-1x' style='color:"
      + myGraph.customNodes.colorType[myGraph.customNodes.listType[i]]
      + "'></i><span class='filter_name' style='display: inline;'>"
      + myGraph.customNodes.listType[i] + "</span></p></div>";
    }
    legendHtml += "</div>"

    $(".panel_legend").html(legendHtml);

  } else {
    $("#titre").text("Pas de donnée à afficher");
    $(".panel_legend").remove();
  }

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

  // var typeMap = {
  //   "NGO" : "organization",
  //   "Group" : "organization",
  //   "LocalBusiness" : "organization",
  //   "getTogether" : "organization",
  //   "competition" : "event",
  //   "concert" : "event",
  //   "concours" : "event",
  //   "exposition" : "event",
  //   "festival" : "event",
  //   "getTogether" : "event",
  //   "market" : "event",
  //   "meeting" : "event",
  //   "person" : "person",
  //   "project" : "project", //Attention, avant c'était "projects"
  //   "tag" : "tag",
  //   "organization" : "organization",
  //   "event" : "event",
  // };

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

    nodes.push({"@id" : index, "identifier" : obj.id, "type" : type, label : obj.label})
    index++;
  });

  console.log("nodes = %o",nodes);

  return {nodes : nodes, edges : edges};
}

</script>
