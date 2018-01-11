<?php
/**
 * CoController.php
 *
 * Cocontroller always works with the PH base 
 *
 * @author: Tibor Katelbach <tibor@pixelhumain.com>
 * Date: 14/03/2014
 */
class CoController extends CommunecterController {


    protected function beforeAction($action) {
        //parent::initPage();
		return parent::beforeAction($action);
  	}

  	public function actions()
	{
	    return array(
	        'getdata'  => 'graph.controllers.GetDataAction',
	        'viewer'   => 'graph.controllers.ViewerAction',
	        'd3'  	   => 'graph.controllers.D3Action',
	        'search'   => 'graph.controllers.SearchAction',
	        'menu'   => 'graph.controllers.MenuAction'
	    );
	}
}
