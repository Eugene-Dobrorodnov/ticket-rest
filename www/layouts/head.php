<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" type="text/css" href="../css/style.css">
    <title></title>
  </head>
  <body>
    <div id="main-panel">
      <div id="form-box">  
        <form id="task-form" method="post">
          Заголовок:<br/>  
          <input type="text" name="title"/><br/>
          Описание задачи:<br/>
          <textarea name="content"></textarea><br/>
          <button id="save_btn">Сохранить</button>
        </form>
      </div>    
      <div id="status-server">
          <div id="server-ok">
            Сервер работает
          </div>
      </div>  
    </div>
