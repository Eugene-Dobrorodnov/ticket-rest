<?php

require APPPATH.'/libraries/REST_Controller.php';

class Index extends CI_Controller{
  
  public function __construct()
  {
    parent::__construct();
    $this->load->model('task/model_task');
  }
  
  public function test()
  {
    echo "ololo";
  }


  public function main()
  {
    
    $dbhost = 'mongodb://localhost';
    $dbname = 'db_task';

    $m  = new Mongo($dbhost);
    $db = $m->$dbname;

    $collection = $db->tasks;
    $cursor = $collection->find()->limit(5);

    $arr = array();

    foreach ($cursor as $document) {
        $arr['tasks'][] = $document;
    }
    $this->load->view('task/task-list', $arr);
  }
  
  public function create()
  {
    $data = array();
    $data['title']         = $this->input->post('title', true);
    $data['content']       = $this->input->post('content', true);
    $data['creation_date'] = date('y-m-d H:i:s');
    $data['error']         = 0;
    
    //Monog insert
    $dbhost = 'mongodb://localhost';
    $dbname = 'db_task';
    $m      = new Mongo($dbhost);
    $db     = $m->$dbname;

    $collection = $db->tasks;
    $collection->insert(
                array(
                   'alias'        => 'Try',
                   'title'        => 'Simple Title',
                   'content'      => 'Lorem Ipsum',
                   'created_date' => date('H:i:s'),
                   'status'       => 1,
                   ),
                array("safe" => 1));
    //Monog insert
    
    echo json_encode($data);
  }

  public function edit()
  {
    $model = new Model_Task();
    $data  = array();
    
    $data['tasks'] = $model->get();
    
    $this->load->view('task/task-list', $data);
  }
  
}

?>
