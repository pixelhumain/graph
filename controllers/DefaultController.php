<?php
/**
 * DefaultController.php
 *
 * OneScreenApp for Communecting people
 *
 * @author: Tibor Katelbach <tibor@pixelhumain.com>
 * Date: 14/03/2014
 */
class DefaultController extends CommunecterController {

  public $version = "v0.1.0";
  public $versionDate = "05/01/2018";
  public $keywords = "graph, diagram, d3, CO, communecter";
  public $description = "any graphs generated for CO or ph::ontology driven Apps ";
  public $pageTitle = "Graph for CO";

  protected function beforeAction($action)
	{
    //parent::initPage();
	  return parent::beforeAction($action);
	}

	public function actionIndex() 
	{
    	$this->layout = "//layouts/empty";
	    $this->render("index");
  }

  public function actionDoc() 
  {
      echo file_get_contents('../../modules/graph/README.md');
  }

}