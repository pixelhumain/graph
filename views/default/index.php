<?php

	$cssAnsScriptFilesTheme = array(
		// SHOWDOWN
		'/plugins/showdown/showdown.min.js',
		//MARKDOWN
		'/plugins/to-markdown/to-markdown.js',
        '/js/api.js'
	);
	HtmlHelper::registerCssAndScriptsFiles($cssAnsScriptFilesTheme, Yii::app()->request->baseUrl);
?>
<h1>Graph Module</h1>

<div id="doc"></div>


<script type="text/javascript">
$(document).ready(function() { 
	getAjax('', baseUrl+'/graph/default/doc',
			function(data){ 
				alert(data);
					$('#doc').html(data);
					descHtml = dataHelper.markdownToHtml(data) ; 
					//$('#doc').html(descHtml);
					//bindLBHLinks();
				}
	,"html");
});

