
function getDate(){
    var date = new Date();
    var mon = ('0'+(1+date.getMonth())).replace(/.?(\d{2})/,'$1');
    var result = date.toString().replace(/^[^\s]+\s([^\s]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s.*$/ig,'$3-'+mon+'-$2 $4');
    return result;
};

//Обертка для обновления
  function hideForm(selector){
    var title   = $.trim(selector.find('input[name="title"]').val());
    var content = $.trim(selector.find('textarea[name="content"]').val());
    
    selector.find('input[name="title"]').remove();
    selector.find('textarea[name="content"]').remove();
    selector.find('input[name="status"]').remove();
    selector.find('button.save_changes').remove();

    selector.find('.task-title').text(title);
    selector.find('.task-body').text(content);

    $(selector).find('button.update-task').html('Редактировать');
  };
  
  function showForm(selector){
    var title   = $.trim(selector.find('.task-title').text());
    var content = $.trim(selector.find('.task-body').text());

    selector.find('.task-body').html('');
    selector.find('.task-title').wrapInner('<input name="title" value="' + title + '"/>');
    selector.find('.task-body').wrapInner('<textarea name="content">' + content + '</textarea>');
    $(selector).find('button.update-task').html('отменить');
    selector.append('<button class="save_changes">Сохранить</button>');
    selector.append('<input name="status" type="checkbox"/>')

    if(selector.hasClass('task-complete'))
    {
      selector.find('input[name="status"]').attr('checked','checked');
    }
  }

// Удаляем задачи, которые были созданы локально
function removeLocalStaroge(id){
  for(var i in window.localStorage)
  {
    if(i == 'create_'+id)
    {  
      localStorage.removeItem('create_'+id);
      console.log($('#tasks-wrapper div.task-box[title="'+id+'"]'));
      console.log('delete '+id);
      $('#tasks-wrapper div.task-box[title="'+id+'"]').remove();
    }
  }
  
  if(localStorage.length == 0)
  {
    $('#tasks-wrapper div.task-box[title="'+id+'"]').remove();
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
    url:"/task",
    data:{
      tasks_id : dump
    },
    cache:false,
    success:function(data){
      var data = jQuery.parseJSON(data);
      console.log(data);
      $.each(data.id, function(i, value){
        $('#'+value).remove(); 
      });
    }
  });
};

// Обновляем задачи в локальное хранилище
function updateLocalStaroge(id, title, content, status){
  var myDate  = getDate();
  var infoset = {
    title         : title,
    content       : content,
    status        : status,
  };
  
  for(var i in window.localStorage)
  { 
    // Выбераем все с префиксом 'create_', то есть локально созданные задачи   
    var patt  = /create_/g;
    var result= patt.test(i);
    
    if(false !== result && i == 'create_'+id) {  
      var tmp     =  JSON.parse(localStorage.getItem(i));
      
      tmp.title   = title;
      tmp.content = content;
      tmp.status  = status;
      
      localStorage.removeItem(i);
      localStorage.setItem('create_' + title, JSON.stringify(tmp));
      
      $('div.task-box[title="'+ id +'"]').attr('title', title);
      $('div.task-box[title="'+ title +'"]').find('div.task-head a').attr('onclick','removeLocalStaroge(\''+title+'\')');
      
      switch (status) {
        case 2:
          $('div.task-box[title="'+ title +'"]').removeClass('task-active');
          $('div.task-box[title="'+ title +'"]').addClass('task-complete');
          break;

        case 1:
          $('div.task-box[title="'+ title +'"]').removeClass('task-complete');
          $('div.task-box[title="'+ title +'"]').addClass('task-active');
          break;
      }
      
      hideForm($('div.task-box[title="'+ title +'"]'));
    }
    
  }
  
}; 

/*
 * Если в локальном хранилище есть записи, которые были созданы НЕ ЛОКАЛЬНО и
 *  должны быть обновленны - то отправляем их на сервер
 */ 
function updateOnServer(){
  
  var dump = []; 
    
  if(localStorage.length == 0)
  {  
    return false;  
  }
  
  for(var i in window.localStorage)
  { 
    // Выбераем все с префиксом 'update_', то есть локально созданные задачи   
    var patt  = /update_/g;
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
    type:"PUT",
    url:"/task",
    data:{
      tasks : dump
    },
    cache:false,
    success:function(data){
      var data = jQuery.parseJSON(data);
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
        <a onclick="removeLocalStaroge(\''+val_title+'\');" href="#">×</a>\n\
        <div class="task-date">' + infoset.creation_date + '</div>\n\
      </div>\n\
      <div class="task-body">' + infoset.content + '</div>\n\
      <button class="update-task">Редактировать</button>\n\
    </div>\n\
  ');
  $('form#task-form input[name="title"]').val('');
  $('form#task-form textarea[name="content"]').val('');
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
  console.log(dump);
  if(dump.length == 0)
  {
    return false;
  }
  
  $.ajax({
    async: false,
    type:"POST",
    url:"/task",
    data:{
      tasks   : dump
    },
    cache:false,
    success:function(data){
      var data = jQuery.parseJSON(data);
      console.log(data);
      $.each(data.tasks, function(i, value){
        //Меняем title на id, убераем onclick
        var box = $('div.task-box[title="'+ data.tasks[i].title +'"]');
        if(box.length == 1)
        {
          box.attr('id',data.tasks[i]._id.$id);
          box.find('.task-head a').attr('onclick','');
          box.find('.task-head a').attr('class', 'remove-task-btn');
        }
        
      });
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
  console.log(last_ticket);
  $.ajax({
    async: false,
    type:"GET",
    url:"/task",
    data:{
      creation_date : last_ticket
    },
    cache:false,
    response:'json',
    success:function(data){
      var data = jQuery.parseJSON(data);
      console.log(data);
      if(data.tasks)
        {
          $.each(data.tasks, function(i, value){
            $('#tasks-wrapper').prepend('\n\
              <div id='+ data.tasks[i]._id.$id +' class="task-box task-active">\n\
              <div class="task-head">\n\
                <div class="task-title">' + data.tasks[i].title + '</div>\n\
                <a class="remove-task-btn" href="#">×</a>\n\
                <div class="task-date">' + data.tasks[i].creation_date + '</div>\n\
              </div>\n\
              <div class="task-body">' + data.tasks[i].content + '</div>\n\
              <button class="update-task">Редактировать</button>\n\
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
        
        updateOnServer();
        removeOnServer();
        createOnServer();
        window.localStorage.clear();
        
      },
    error: function(){
      if($('#server-ok').length > 0 && $('#server-error').length == 0 )
      {
         $('#server-ok').remove();
         $('#status-server').append('\
          <div id="server-error">\n\
            Сервер не доступен!\n\
          </div>\n\
        ');
      }
    }        
  });
};



$(document).ready(function() {
  
  /*
  * если сервер ответил, то каждые 5 секунд будем обращаться к нему,
  * а вдруг там что-то новенькое...
  */
  setInterval(function() {
   pullTasks();
  }, 5000);
  
  // Create Task
  $('form#task-form button#save_btn').click(function(){
    var val_title   = $('form#task-form input[name="title"]').val();
    var val_content = $('form#task-form textarea[name="content"]').val();
    var myDate      = getDate();
    var dump        = [];
    
    if(!val_title && !val_content)
    {
      return false;
    }
    
    dump.push({
      title         : val_title,
      content       : val_content,
      creation_date : myDate,
      status        : 1
      });
    
    $.ajax({
      async: false,
      type:"POST",
      url:"/task",
      data:{
        tasks :  dump
      },
      cache:false,
      success:function(data){
        var data = jQuery.parseJSON(data);
        
        $.each(data.tasks, function(i, value){
          $('#tasks-wrapper').prepend('\n\
            <div id='+ data.tasks[i]._id.$id +' class="task-box task-active">\n\
            <div class="task-head">\n\
              <div class="task-title">' + data.tasks[i].title + '</div>\n\
              <a class="remove-task-btn" href="#">×</a>\n\
              <div class="task-date">' + data.tasks[i].creation_date + '</div>\n\
            </div>\n\
            <div class="task-body">' + data.tasks[i].content + '</div>\n\
            <button class="update-task">Редактировать</button>\n\
            </div>\n\
          ');
        });
        $('form#task-form input[name="title"]').val('');
        $('form#task-form textarea[name="content"]').val('');
      },
      error: function(){
        setLocalStaroge(val_title, val_content);
      }
    });

    return false;
  });
  
  $('#tasks-wrapper').on('click', '.task-box button.update-task', function(){
    
    var box = $(this).parent('.task-box');
    
    if(
       box.find('input[name="title"]').length > 0 &&
       box.find('textarea[name="content"]').length > 0 
      )
    {
      hideForm(box);
    }
    else
    {
      showForm(box);
    }
  });
  
  //Update Task
  $('#tasks-wrapper').on('click', '.task-box button.save_changes', function(){
    var task_id      = $(this).parents('.task-box').attr('id');
    var task_status  = $(this).parents('.task-box').find('input[name="status"]').is(':checked') ? 2 : 1;
    var task_title   = $.trim($(this).parents('.task-box').find('input[name="title"]').val());
    var task_content = $.trim($(this).parents('.task-box').find('textarea[name="content"]').val());
    // У созданных локально задач будем брать title
    var local_id     = $(this).parents('.task-box').attr('title');
    var dump         = [];
    
    //Редактируем локально созданные задачи
    if(!task_id && task_title && task_content && task_content && local_id)
    {
      updateLocalStaroge(local_id, task_title, task_content, task_status)
      return false;
    }
    
    if(!task_id || !task_title || !task_content || task_content == '')
    {
      return false;
    }
    
    dump.push({
        id      : task_id,
        title   : task_title,
        content : task_content,
        status  : task_status
    })
    
    $.ajax({
      async: false,
      type:"PUT",
      url:"/task",
      data:{
        tasks : dump
        },
      cache:false,
      success:function(data){
        var data = jQuery.parseJSON(data);
        $.each(data, function(i, value){
          if(data[i].error === 0)
          {
            switch (task_status) {
              case 2:
                $('#'+task_id).removeClass('task-active');
                $('#'+task_id).addClass('task-complete');
                break;
                
              case 1:
                $('#'+task_id).removeClass('task-complete');
                $('#'+task_id).addClass('task-active');
                break;
            }
            
            $('#'+task_id).find('task-title').html(task_title);
            $('#'+task_id).find('task-body').html(task_content);
            
            hideForm($('#'+task_id));
          }
        });
      },
      error: function()
      {
        /*
         * Если этих задач нет в локальном хранилище,  
         * то создаем стек задач, которые нужно отредактировать, когда сервере
         * будет доступен
         */
        var infoset = {
          id      : task_id,
          title   : task_title,
          content : task_content,
          status  : task_status
        };  
        
        localStorage.setItem('update_' + task_id, JSON.stringify(infoset));
        
        switch (task_status) {
          case 2:
            $('#'+task_id).removeClass('task-active');
            $('#'+task_id).addClass('task-complete');
            break;

          case 1:
            $('#'+task_id).removeClass('task-complete');
            $('#'+task_id).addClass('task-active');
            break;
        }
            
        $('#'+task_id).find('task-title').html(task_title);
        $('#'+task_id).find('task-body').html(task_content);

        hideForm($('#'+task_id));
      } 
    });
  });

  //Delete Task
  $('#tasks-wrapper').on('click', '.task-box a.remove-task-btn', function(){
    var task_id = $(this).parents('.task-box').attr('id');
    var dump    = [];
    
    if(!task_id)
    {
      return false;
    }
    
    dump.push({id:task_id});
    
    $.ajax({
      async: false,
      type:"DELETE",
      url:"/task",
      data:{
        tasks_id : dump
        },
      cache:false,
      success:function(data){
        var data = jQuery.parseJSON(data);
        $('#'+task_id).remove();  
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