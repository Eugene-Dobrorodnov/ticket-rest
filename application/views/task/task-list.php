<?php
require_once 'web/layouts/head.php';
?>

<?php

if($tasks)
{?>
<div id="tasks-wrapper">
  <?php
  foreach ($tasks as $task)
  { ?>
  <div class="task-box" id="task-<?php echo $task['task_id']?>">
    <div class="task-head">
      <div class="task-title">
        <?php echo $task['title']; ?>
      </div>
      <div class="task-date">
        <?php echo $task['creation_date']; ?>
      </div>
    </div>
    <div class="task-body">
      <?php echo $task['body']; ?>
    </div>
  </div>
  <?php 
  }?>
</div>
<?php  
}
else
{?>
<h2>На данный момент нет заданий!</h2>

<?php 
} 
?>

<?php
require_once 'web/layouts/footer.php';
?>