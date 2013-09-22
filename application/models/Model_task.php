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
}