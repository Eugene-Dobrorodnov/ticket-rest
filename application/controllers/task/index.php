<?php

class Index extends CI_Controller{
  
  public function __construct()
  {
    parent::__construct();
    $this->load->model('task/model_task');
  }
  
  public function main()
  {
    echo phpinfo();
  }
  
  public function edit()
  {
    $model = new Model_Task();
    $data  = array();
    
    $data['tasks'] = $model->get();
    
    $this->load->view('task/task-list', $data);
  }
  
  public function create()
  {
    
  }
  
}

?>
