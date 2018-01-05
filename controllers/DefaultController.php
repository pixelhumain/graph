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