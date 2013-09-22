<?php

require APPPATH.'/libraries/REST_Controller.php';

class Tasks_api extends REST_Controller{
  
  public function __construct()
  {
    parent::__construct();
    $this->load->model('model_task');
  }
  
  public function tasks_get()
  {
    $arr          = array();  
    $model        = new Model_Task();
    $arr['tasks'] = $model->get_tasks();
    
    $this->load->view('task-list', $arr);
  }

  public function task_post()
  {
    $data = array();
    $data['task']['title']         = $this->input->post('title', true);
    $data['task']['content']       = $this->input->post('content', true);
    $data['task']['creation_date'] = $this->input->post('creation_date', true);
    $data['task']['status']        = 1;
    $data['error']                 = 0;
    
    //Monog insert
    $dbhost = 'mongodb://localhost';
    $dbname = 'db_tasks';
    $m      = new Mongo($dbhost);
    $db     = $m->$dbname;

    $collection = $db->tasks;
    $collection->insert($data['task'], array("safe" => 1));
    
    echo json_encode($data);
  }
  
  public function task_put()
  {
    $id = $this->put();
    
    //Monog delete
    $dbhost = 'mongodb://localhost';
    $dbname = 'db_tasks';
    $m      = new Mongo($dbhost);
    $db     = $m->$dbname;
    $data   = array();

    $collection = $db->tasks;
    
    try
    {
      new MongoId($id['id']);
      $collection->update(
        array('_id' => new MongoId($id['id'])),
        array('$set' => array('status' => 2))
      );
      $data['error'] = 0; 
    }
    catch(Exception $e)
    {
      $data['error']  = 'ticket not faund';
    }
    
    echo json_encode($data);
  }
  
  public function task_delete()
  {
    $id = $this->delete();
    
    //Monog delete
    $dbhost = 'mongodb://localhost';
    $dbname = 'db_tasks';
    $m      = new Mongo($dbhost);
    $db     = $m->$dbname;
    $data   = array();

    $collection = $db->tasks;
    
    try
    {
      new MongoId($id['id']);
      $collection->remove(array('_id' => new MongoId($id['id']) ));
      $data['error'] = 0; 
    }
    catch(Exception $e)
    {
      $data['error']  = 'ticket not faund';
    }
    
    echo json_encode($data);
  }
  
  // тот самый метод
  public function pullTasks_put()
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
  
}

?>
