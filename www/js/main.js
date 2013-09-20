

/* 
 * Эта функция будет подтягивать новые тикеты без перезагрузки страницы.... 
 * по идеии
*/
function pullTask(){
  var last_ticket = $.trim($('#tasks-wrapper .task-box:first .task-head .task-date').html());
  
  if(!last_ticket)
  {
    return false;
  }
  
  $.ajax({
      async: false,
      type:"PUT",
      url:"/pull-tasks",
      data:{
        creation_date : last_ticket
      },
      cache:false,
      success:function(data){
        var data = jQuery.parseJSON(data);
        
        if(data.tasks)
        {
          $.each(data.tasks, function(i, value){
            $('#tasks-wrapper').prepend('\n\
              <div id='+ data.tasks[i]._id.$id +' class="task-box">\n\
              <div class="task-head">\n\
                <div class="task-title">' + data.tasks[i].title + '</div>\n\
                <div class="task-date">' + data.tasks[i].creation_date + '</div>\n\
              </div>\n\
              <div class="task-body">' + data.tasks[i].content + '</div>\n\
              <a class="update-task-btn" href="#">Выполнить</a>\n\
              <a class="remove-task-btn" href="#">Удалить задачу</a>\n\
              </div>\n\
            ');
            console.log(data.tasks[i].title);
          });
        }
      },
      error: function(){
        console.log('not connect');
      }
  });
}

setInterval(function() {
  pullTask();
}, 3000);


$( document ).ready(function() {
  
  // Create Task
  $('form#task-form button#save_btn').click(function(){
    var val_title   = $('form#task-form input[name="title"]').val();
    var val_content = $('form#task-form textarea[name="content"]').val();

    if(!val_title && !val_content)
    {
      return false;
    }

    $.ajax({
      async: false,
      type:"POST",
      url:"/task",
      data:{
        title   : val_title,
        content : val_content
        },
      cache:false,
      success:function(data){
        var data = jQuery.parseJSON(data);
        console.log(data.task._id.$id);
        if(data.error === 0)
        {
          $('#tasks-wrapper').prepend('\
            <div id='+ data.task._id.$id +' class="task-box">\n\
              <div class="task-head">\n\
                <div class="task-title">' + data.task.title + '</div>\n\
                <div class="task-date">' + data.task.creation_date + '</div>\n\
              </div>\n\
              <div class="task-body">' + data.task.content + '</div>\n\
              <a class="update-task-btn" href="#">Выполнить</a>\n\
              <a class="remove-task-btn" href="#">Удалить задачу</a>\n\
            </div>\n\
          ');
        }
      }
    });

    return false;
  });

  //Update Task
  $('#tasks-wrapper').on('click', '.task-box a.update-task-btn', function(){
    var task_id = $(this).parents('.task-box').attr('id');
    
    if(!task_id)
    {
      return false;
    }
    
    $.ajax({
      async: false,
      type:"PUT",
      url:"/task",
      data:{
        id : task_id
        },
      cache:false,
      success:function(data){
        var data = jQuery.parseJSON(data);
        
        if(data.error === 0)
        {
          $('#'+task_id).css('color','red');  
        }
      }
    });
  });

  //Delete Task
  $('#tasks-wrapper').on('click', '.task-box a.remove-task-btn', function(){
    var task_id = $(this).parents('.task-box').attr('id');
    
    if(!task_id)
    {
      return false;
    }
    
    $.ajax({
      async: false,
      type:"DELETE",
      url:"/task",
      data:{
        id : task_id
        },
      cache:false,
      success:function(data){
        var data = jQuery.parseJSON(data);
        
        if(data.error === 0)
        {
          $('#'+task_id).remove();  
        } 
      }
    });
  });
  
});