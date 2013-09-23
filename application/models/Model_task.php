<?php

class Model_Task extends CI_Model {
  
  private $_dbhost = 'mongodb://localhost'; 
  private $_db;
    
  function __construct()
  {
    parent::__construct();
    
    $this->_db = new Mongo($this->_dbhost);
  }
    
  public function get_tasks()
  {
    $arr    = array();
    
    $mongo  = $this->_db;
    $db     = $mongo->db_tasks;
    $coll   = $db->tasks;
    $cursor = $coll->find()->sort(array('creation_date' => -1));

    foreach ($cursor as $document) 
    {
      $arr[] = $document;
    }
    return $arr;
  }
  
  public function insert_tasks()
  {
    $data = array();
    $data['task']['title']         = $this->input->post('title', true);
    $data['task']['content']       = $this->input->post('content', true);
    $data['task']['creation_date'] = $this->input->post('creation_date', true);
    $data['task']['status']        = 1;
    $data['error']                 = 0;
    
    $mongo  = $this->_db;
    $db     = $mongo->db_tasks;
    $coll   = $db->tasks;
    
    $coll->insert($data['task'], array("safe" => 1));
    return $data;
  }
  
  public function delete_tasks($id)
  {
    $data   = array();
    $mongo  = $this->_db;
    $db     = $mongo->db_tasks;
    $coll   = $db->tasks;
    
    try
    {
      new MongoId($id);
      $coll->remove(array('_id' => new MongoId($id) ));
      $data['error'] = 0; 
    }
    catch(Exception $e)
    {
      $data['error']  = 'ticket not faund';
    }
    
    return $data;
  }
  
  public function update_tasks($id)
  {
    $data   = array();
    $mongo  = $this->_db;
    $db     = $mongo->db_tasks;
    $coll   = $db->tasks;
    
    try
    {
      new MongoId($id);
      $coll->update(
        array('_id' => new MongoId($id)),
        array('$set' => array('status' => 2))
      );
      $data['error'] = 0; 
    }
    catch(Exception $e)
    {
      $data['error']  = 'ticket not faund';
    }
    
    return $data;
  }
}