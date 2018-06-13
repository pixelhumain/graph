//Display Graph in a card (image + description)
FluidGraph.prototype.graphInCard = function($divCards, $graphId, $graphName, $typeLoadingGraph){

  // <div class="card">
  var $divCard = $("<div class='fluid card' id='card_"+$graphId+"'>");
  $divCard.appendTo($divCards);

  //  <div class="blurring dimmable image">
  var $divBlurImage = $("<div class='blurring dimmable image' id='divBlurImage_"+$graphId+"'>");

  $divBlurImage.appendTo($divCard);
  $divBlurImage.dimmer({
    on: 'hover'
  });

  //    <div class="ui dimmer">
  var $divUiDimmer = $("<div class='ui dimmer'>");
  $divUiDimmer.appendTo($divBlurImage);

  //     <div class="content">
  var $divDimmerContent = $("<div class='content'>");
  $divDimmerContent.appendTo($divUiDimmer);

  //      <div class="center">
  var $divCenter = $("<div class='center'>");
  $divCenter.appendTo($divDimmerContent);

  //       <div class="ui inverted button">
  var $divButton = $("<div class='ui inverted button'>");
  $divButton.appendTo($divCenter);

  //        <a href='...'>Launch Carto PAIR !</a>
  var $urlLink;

  if ($typeLoadingGraph == "local")
  {
    $urlLink = myGraph.appli;
  }
  else { // External
    $urlLink = myGraph.appli+"#"
              +myGraph.externalStore.uri+$graphId;
  }

  $divButton.html("<a href=/"+$urlLink
          +" target='_blank'>"+myGraph.config.viewerButtonLabel+"</a>")

  $divButton.on('click', function() {
    myGraph.graphName = $graphName;
    myGraph.typeLdpServer = "local";
    myGraph.setOpenedGraph();
  });

  //  <div id='card_2a1499b5dc'></div>
  var $divGraph = $("<div id='graph_"+$graphId+"'>");
  $divGraph.appendTo($divBlurImage);

  $('#divBlurImage_'+$graphId).dimmer({
    on: 'hover'
  });

  myGraph.initSvgContainer("#graph_"+$graphId);

  if (myGraph.d3Data.nodes.length > 0)
  {
    myGraph.drawGraph();
    myGraph.movexy();
  }

  // <div class="content">
  var $divContent = $("<div class='content'>");
  $divContent.appendTo($divCard);

  //  <div class="header">
  var $divHeader = $("<div class='header'>");
  $divHeader.appendTo($divContent);
  $divHeader.text($graphName + " ("+$graphId+")");

  //   <div class="description">
  var $divDescription = $("<div class='description'>");
  $divDescription.appendTo($divContent);

  var $divDescriptionUl = $("<ul>");
  $divDescriptionUl.appendTo($divDescription);

  //Use every instead of forEach to stop loop when you want
  thisGraph.d3Data.nodes.every(function(node, index) {
    var $divDescriptionLi = $("<li>");
    $divDescriptionLi.appendTo($divDescriptionUl);
    $divDescriptionLi.text(node.label);

    if (index > 4)
      return false;
    else
      return true
  });

  var $divDescriptionTotal = $("<div>");
  $divDescriptionTotal.appendTo($divDescription);
  $divDescriptionTotal.html("<b>Total of nodes :</b> "+myGraph.d3Data.nodes.length
                +"<br> <b>Total of links :</b> "+myGraph.d3Data.edges.length);
}
