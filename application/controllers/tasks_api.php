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
    $model = new Model_Task();
    $data  = $model->insert_tasks();
    echo json_encode($data);
  }
  
  public function task_put()
  {
    $id    = $this->put();
    $model = new Model_Task();
    $data  = $model->update_tasks($id['id']);   
    echo json_encode($data);
  }
  
  public function task_delete()
  {
    $id    = $this->delete();
    $model = new Model_Task();
    $data  = $model->delete_tasks($id['id']);
    
    echo json_encode($data);
  }
}
?>
