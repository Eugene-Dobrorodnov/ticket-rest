<?php

require APPPATH.'/libraries/REST_Controller.php';

class Tasks_api extends REST_Controller{
  
  private $result = null;

  public function __construct()
  {
    parent::__construct();
    $this->load->model('model_task');
  }
  
  public function task_get()
  {
    $arr = array();
    $get = $this->get();
    $arr = $this->model_task->get_tasks($get);
    
    if(empty($get))
    {
      $this->load->view('task-list', $arr);   
    }
    else
    {
        $this->result = json_encode($arr);
    }
  }

  public function task_post()
  {
    $tasks = $this->post();
    $data  = $this->model_task->insert_tasks($tasks);
    $this->result = json_encode($data);
  }
  
  public function task_put()
  {
    $tasks = $this->put();
    $data  = $this->model_task->update_tasks($tasks);   
    $this->result = json_encode($data);
  }
  
  public function task_delete()
  {
    $id    = $this->delete();
    $data  = $this->model_task->delete_tasks($id);
    
    $this->result = json_encode($data);
  }
  
  public function __destruct() {
    if($this->result) echo $this->result;
  }
}
?>
