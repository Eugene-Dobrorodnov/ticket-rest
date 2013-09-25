<?php

require APPPATH.'/libraries/REST_Controller.php';

class Tasks_api extends REST_Controller{
  
  private $result = null;

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
    $tasks = $this->post();
    $data  = $this->model_task->insert_tasks();
    $this->result = json_encode($data);
  }
  
  public function task_put()
  {
    $id[]  = $this->put();
    $data  = $this->model_task->update_tasks($id);   
    $this->result = json_encode($data);
  }
  
  public function task_delete()
  {
    $id    = $this->delete();
    $data  = $this->model_task->delete_tasks($id['id']);
    
    $this->result = json_encode($data);
  }
  
  public function __destruct() {
    if($this->result) echo $this->result;
  }
}
?>
