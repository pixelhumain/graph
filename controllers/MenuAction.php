<?php
class MenuAction extends CAction
{
    public function run($type=null,$view=null)
    {
        $controller=$this->getController();
        $menu = OpenData::$categ;

        $root = array( "id" => "root", "group" => 0,  "label" => "Home", "level" => 0 );
        $data = array($root);
        $links = array();
        $tags = array();
        $strength = 0.08;

        foreach ($menu as $key => $value)
        {
            array_push($data, array( "id" => "lvl1".$key, "group" => 1,  "label" => $value["name"], "level" => 2,"type"=>"lvl1" ));
            array_push($links, array( "target" => "lvl1".$key, "source" => "root",  "strength" => $strength ) );
                
    		foreach ($value["tags"] as $ix => $tag) 
            {
                array_push($data, array( "id" => "lvl1".$key."lvl2".$ix, "group" => 1,  "label" => $tag, "level" => 2,"type"=>"tag" ));
                array_push($links, array( "target" => "lvl1".$key."lvl2".$ix, "source" => "lvl1".$key,  "strength" => $strength ) );
    		}
    	}
        

        $params = array( 
            'data' => $data, 
            'links' => $links,
            'item' => $menu,
            'tags' => $tags,
            "typeMap" => $type,
            "title" => "Menu : ".$type
            );

        Yii::app()->theme  = "empty";
        Yii::app()->session["theme"] = "empty";

        if($view)
            Rest::json($data);
        else{
            if(Yii::app()->request->isAjaxRequest)
                $controller->renderPartial('d3', $params);
            else{
                Yii::app()->theme  = "empty";
                $controller->render('d3', $params);
            }
        }
    }
}
