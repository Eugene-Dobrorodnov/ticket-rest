<?php
require_once '../www/layouts/head.php';
?>

<div id="tasks-wrapper">
<?php
if(isset($tasks) && $tasks)
{
  foreach ($tasks as $task)
  { ?>
  <div class="task-box" id="<?php echo $task['_id']; ?>">
    <div class="task-head">
      <div class="task-title">
        <?php echo $task['title']; ?>
      </div>
      <div class="task-date">
        <?php echo $task['creation_date']; ?>
      </div>
    </div>
    <div class="task-body">
      <?php echo $task['content']; ?>
    </div>
    <a class="remove-task-btn" href="#">Удалить задачу</a>
  </div>
  <?php 
  } 
}
?>
</div>  

<?php
require_once '../www/layouts/footer.php';
?>