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
	        'getdata'  => 'graph.controllers.actions.GetDataAction',
          'fluid'   => 'graph.controllers.actions.D3Action',
          'viewer'   => 'graph.controllers.actions.ViewerAction',
	        'd3'  	   => 'graph.controllers.actions.D3Action',
	        'search'   => 'graph.controllers.actions.SearchAction',
	        'menu'   => 'graph.controllers.actions.MenuAction'
	    );
	}
}
