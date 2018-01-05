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
	        'getdata'  => 'citizenToolKit.controllers.graph.GetDataAction',
	        'viewer'   => 'citizenToolKit.controllers.graph.ViewerAction',
	        'd3'  	   => 'citizenToolKit.controllers.graph.D3Action',
	        'search'   => 'citizenToolKit.controllers.graph.SearchAction'
	    );
	}
}
