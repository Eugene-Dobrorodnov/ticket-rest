<?php

class Model_Task extends CI_Model {
  
  private $_dbhost = 'mongodb://localhost'; 
  private $_db;
    
  function __construct()
  {
    parent::__construct();
    
    try{
      $db = new Mongo($this->_dbhost);
      $dn = $db->db_tasks; 
    
      $this->db_coll = $dn->tasks;
    }
    catch (Exception $e)
    {
      return array('error'=>$e);
    }
  }
    
  public function get_tasks($get)
  {
    $arr    = array();
    
    if(empty($get))
    {
      $cursor = $this->db_coll->find()->sort(array('creation_date' => -1));
    }
    else
    {
      $cursor = $this->db_coll->find(array(
        'creation_date' => array('$gt' => $get['creation_date'])
      ));
    }
    
    if($cursor->count() > 0)
    {
      foreach ($cursor as $document) 
      {
        $arr['tasks'][] = $document;
      }
    }
    else
    {
      $arr['tasks'] = false;
    }
    
    return $arr;
  }
  
  public function insert_tasks(array $tasks)
  {    
    $this->db_coll->batchInsert($tasks['tasks']);
    return $tasks;
  }
  
  public function delete_tasks($id)
  {
    $data   = array();
    
    foreach ($id['tasks_id'] as $val)
    {
      try
      {
        new MongoId($val['id']);
        $this->db_coll->remove(array('_id' => new MongoId($val['id']) ));
        $data['error'][] = 0; 
        $data['id'][]    = $val['id'];
      }
      catch(Exception $e)
      {
        $data['error'][]  = $val['id'];
      }  
    }
    
    return $data;
  }
  
  public function update_tasks($tasks)
  {
    $data   = array();
    
    foreach ($tasks['tasks'] as $task)
    {
      try
      {
        $this->db_coll->update(
          array('_id' => new MongoId($task['id'])),
          array('$set' => array(
            'title'   => $task['title'],
            'content' => $task['content'],
            'status'  => $task['status']  
          ))
        );
        $data[$task['id']]['error'] = 0;
      }
      catch (Exception $e)
      {
        $data[$task['id']]['error'] = 1;
      }
    }  
    
    return $data;
  }
}