
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
    url:"/create",
    data:{
      title   : val_title,
      content : val_content
      },
    cache:false,
    success:function(data){
      var data = jQuery.parseJSON(data);
      
      if(data.error === 0)
      {
        $('#tasks-wrapper').prepend('\
          <div class="task-box">\n\
            <div class="task-head">\n\
              <div class="task-title">' + data.title + '</div>\n\
              <div class="task-date">' + data.creation_date + '</div>\n\
            </div>\n\
            <div class="task-body">' + data.content + '</div>\n\
          </div>\n\
        ');
      }
    }
  });
  
  return false;
});