<?php

class Model_Task extends CI_Model {

    function __construct()
    {
        parent::__construct();
    }
    
    public function get()
    {
      $query = $this->db->get('tasks');
      
      if( $query->num_rows() > 0 )
      {
        return $query->result_array();
      }
      else
      {
        return false;
      }
    }
    
    public function create(array $data)
    {
      
    }
}