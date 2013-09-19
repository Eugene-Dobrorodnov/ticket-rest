<?php

require APPPATH.'/libraries/REST_Controller.php';

class Tasks_api extends REST_Controller{
  
  public function __construct()
  {
    parent::__construct();
    $this->load->model('task/model_task');
  }
  
  public function tasks_get()
  {
    $dbhost = 'mongodb://localhost';
    $dbname = 'db_tasks';

    $m  = new Mongo($dbhost);
    $db = $m->$dbname;

    $collection = $db->tasks;
    $cursor = $collection->find()->sort(array('creation_date' => -1));

    $arr = array();

    foreach ($cursor as $document) {
        $arr['tasks'][] = $document;
    }
    $this->load->view('task-list', $arr);
  }

  public function task_post()
  {
    $data = array();
    $data['task']['title']         = $this->input->post('title', true);
    $data['task']['content']       = $this->input->post('content', true);
    $data['task']['creation_date'] = date('y-m-d H:i:s');
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
    print_r($this->_put_args);
  }
  
  public function task_delete()
  {
    $id = $this->delete();
    
    //Monog delete
    $dbhost = 'mongodb://localhost';
    $dbname = 'db_tasks';
    $m      = new Mongo($dbhost);
    $db     = $m->$dbname;

    $collection = $db->tasks;
    $collection->remove(array('_id' => $id['id']), array("justOne" => true));
    echo json_encode($id);
  }
  
}

?>
