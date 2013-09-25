<?php
require_once '../www/layouts/head.php';
?>

<div id="tasks-wrapper">
<?php
if(isset($tasks) && $tasks)
{
  foreach ($tasks as $task)
  { ?>
  <div class="task-box <?=($task['status'] == 1) ? "task-active" : "task-complete" ?> " id="<?php echo $task['_id']; ?>">
    <div class="task-head">
      <div class="task-title">
        <?php echo $task['title']; ?>
      </div>
      <a class="remove-task-btn" href="#">×</a>
      <div class="task-date">
        <?php echo $task['creation_date']; ?>
      </div>
    </div>
    <div class="task-body">
      <?php echo $task['content']; ?>
    </div>
    <button class="update-task">Редактировать</button>
  </div>
  <?php 
  } 
}
?>
</div>  

<?php
require_once '../www/layouts/footer.php';
?>