
function getDate(){
    var date = new Date();
    var mon = ('0'+(1+date.getMonth())).replace(/.?(\d{2})/,'$1');
    var result = date.toString().replace(/^[^\s]+\s([^\s]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s.*$/ig,'$3-'+mon+'-$2 $4');
    return result;
};

// Удаляем задачи, которые были созданы локально
function removeLocalStaroge(id){
  for(var i in window.localStorage)
  {
    if(i != 'create_'+id)
    {  
      localStorage.removeItem('create_'+id);
      console.log($('#tasks-wrapper div.task-box[title="'+id+'"]'));
      $('#tasks-wrapper div.task-box[title="'+id+'"]').remove();
    }
  }
}; 
//window.localStorage.clear();
for(var i in window.localStorage)
 {
   console.log(localStorage.getItem('---------'+i+'-------------'));   
 }

/*
 * Если в локальном хранилище есть записи, которые были созданы НЕ ЛОКАЛЬНО и
 *  должны быть удалены - то отправляем их на сервер
 */ 
function removeOnServer(){
  
  var dump = []; 
    
  if(localStorage.length == 0)
  {  
    return false;  
  }
  
  for(var i in window.localStorage)
  { 
    // Выбераем все с префиксом 'delete_', то есть локально созданные задачи   
    var patt  = /delete_/g;
    var result= patt.test(i);
    if(false !== result) {  
      dump.push(JSON.parse(localStorage.getItem(i)));
    }
  }
  
  if(dump.length == 0)
  {
    return false;
  }
  
  $.ajax({
    async: false,
    type:"DELETE",
    url:"/sync-tasks",
    data:{
      tasks_id : dump
    },
    cache:false,
    success:function(data){
      var data = jQuery.parseJSON(data);
      $.each(data.id, function(i, value){
        //$('#'+value).remove(); 
      });
    }
  });
};

// Вставляем в локальное хранилище
function setLocalStaroge(val_title, val_content){
  var myDate  = getDate();
  var infoset = {
    title         : val_title,
    content       : val_content,
    status        : 1,
    creation_date : myDate
  };
  
  localStorage.setItem('create_' + val_title, JSON.stringify(infoset));
  $('#tasks-wrapper').prepend('\
    <div title="'+val_title+'" class="task-box task-active">\n\
      <div class="task-head">\n\
        <div class="task-title">' + infoset.title + '</div>\n\
        <div class="task-date">' + infoset.creation_date + '</div>\n\
      </div>\n\
      <div class="task-body">' + infoset.content + '</div>\n\
      <a href="#">Выполнить</a>\n\
      <a onclick="removeLocalStaroge(\''+val_title+'\');" href="#">Удалить задачу</a>\n\
    </div>\n\
  ');
}; 

/*
 * Если в локальном хранилище есть зписи, которые были созданы локально -
 * то отправляем их на сервер
 */ 
function createOnServer(){
  
  var dump = []; 
    
  if(localStorage.length == 0)
  { 
    return false;  
  }
  
  for(var i in window.localStorage)
  { 
    // Выбераем все с префиксом 'create_', то есть локально созданные задачи   
    var patt   = /create_/g;
    var result = patt.test(i);
    
    if(false !== result) {
      dump.push(JSON.parse(localStorage.getItem(i)));
    }
  }
  
  if(dump.length == 0)
  {
    return false;
  }
  
  $.ajax({
    async: false,
    type:"POST",
    url:"/sync-tasks",
    data:{
      tasks   : dump
    },
    cache:false,
    success:function(data){
    }
  });

};

/* 
 * Эта функция будет подтягивать новые тикеты без перезагрузки страницы.... 
 * по идеии
*/
function pullTasks(){
  var last_ticket = $.trim($('#tasks-wrapper .task-box:first .task-head .task-date').html());
  
  if(!last_ticket)
  {
    return false;
  }
  
  $.ajax({
    async: false,
    type:"PUT",
    url:"/sync-tasks",
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
              <div id='+ data.tasks[i]._id.$id +' class="task-box task-active">\n\
              <div class="task-head">\n\
                <div class="task-title">' + data.tasks[i].title + '</div>\n\
                <div class="task-date">' + data.tasks[i].creation_date + '</div>\n\
              </div>\n\
              <div class="task-body">' + data.tasks[i].content + '</div>\n\
              <a class="update-task-btn" href="#">Выполнить</a>\n\
              <a class="remove-task-btn" href="#">Удалить задачу</a>\n\
              </div>\n\
            ');
          });
        }
        
        if($('#server-ok').length == 0 && $('#server-error').length > 0 )
        {  
          $('#server-error').remove();
          $('#status-server').append('\
            <div id="server-ok">\n\
              Сервер работает\n\
            </div>\n\
          ');
        }
        
        createOnServer();
        removeOnServer();
        window.localStorage.clear();
        /*
         * если сервер ответил, то каждые 5 секунд будем обращаться к нему,
         * а вдруг там что-то новенькое...
         */
        setTimeout(function() {
          pullTasks();
        }, 5000);
      },
    error: function(){
      if($('#server-ok').length > 0 && $('#server-error').length == 0 )
      {
         $('#server-ok').remove();
         $('#status-server').append('\
          <div id="server-error">\n\
            На данный момент сервер неотвечает\n\
            <a href="#" onclick="pullTasks();">Обновить</a>\n\
          </div>\n\
        ');
      }
    }        
  });
};

pullTasks();

$(document).ready(function() {
  // Create Task
  $('form#task-form button#save_btn').click(function(){
    var val_title   = $('form#task-form input[name="title"]').val();
    var val_content = $('form#task-form textarea[name="content"]').val();
    var myDate      = getDate();
    
    if(!val_title && !val_content)
    {
      return false;
    }
        
    $.ajax({
      async: false,
      type:"POST",
      url:"/task",
      data:{
        title         : val_title,
        content       : val_content,
        creation_date : myDate
      },
      cache:false,
      success:function(data){
        var data = jQuery.parseJSON(data);
        if(data.error === 0)
        {
          $('#tasks-wrapper').prepend('\
            <div id='+ data.task._id.$id +' class="task-box task-active">\n\
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
      },
      error: function(){
        setLocalStaroge(val_title, val_content);
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
      },
      error: function()
      {
        /*
         * Если этих задач нет в локальном хранилище,  
         * то создаем стек задач, которые нужно удалить, когда сервере
         * будет доступен
         */
        var infoset = {id:task_id};  
        localStorage.setItem('delete_' + task_id, JSON.stringify(infoset));
        $('#'+task_id).remove();
      }        
    });
  });
  
});