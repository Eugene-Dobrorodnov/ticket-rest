<?php

require APPPATH.'/libraries/REST_Controller.php';

class Sync_api extends REST_Controller{
  
  public function __construct()
  {
    parent::__construct();
    $this->load->model('model_task');
  }
  
  public function tasks_post()
  {
    $data   = $this->post();
    //Monog insert
    $dbhost = 'mongodb://localhost';
    $dbname = 'db_tasks';
    $m      = new Mongo($dbhost);
    $db     = $m->$dbname;

    $collection = $db->tasks;
    
    foreach ($data['tasks'] as $val)
    {
        $collection->insert($val, array("safe" => 1));
    }
    
  }
  
  public function tasks_put()
  {
    $data = $this->put();
    
    //Monog pull tasks
    $dbhost = 'mongodb://localhost';
    $dbname = 'db_tasks';
    $m      = new Mongo($dbhost);
    $db     = $m->$dbname;
    
    $collection = $db->tasks;
    $cursor = $collection->find(array(
        'creation_date' => array('$gt' => $data['creation_date'])
    ));
    
    if($cursor->count() > 0)
    {
      foreach ($cursor as $document) 
      {
        $data['tasks'][] = $document;
      }
    }
    else
    {
      $data['tasks'] = false;
    }
    
    echo json_encode($data);
  }
  
  public function tasks_delete()
  {
    $id = $this->delete();
    
    //Monog delete
    $dbhost = 'mongodb://localhost';
    $dbname = 'db_tasks';
    $m      = new Mongo($dbhost);
    $db     = $m->$dbname;
    $data   = array();

    $collection = $db->tasks;
    
    foreach ($id['tasks_id'] as $val)
    {
      try
      {
        new MongoId($val['id']);
        $collection->remove(array('_id' => new MongoId($val['id']) ));
        $data['error'][] = 0; 
        $data['id'][]    = $val['id'];
      }
      catch(Exception $e)
      {
        $data['error'][]  = $val['id'];
      }  
    }
    
    echo json_encode($data);
  }
}

?>
