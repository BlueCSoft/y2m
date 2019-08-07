<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>

<jsp:useBean id="plimit" scope="page" class="bluec.base.CLogin"/>
<%
 request.setCharacterEncoding("GBK");
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
 if(plimit.checkLimitM(request)<0){
  out.println(plimit.getLastError());
  return;
 }
%>

<!DOCTYPE html>

<head>
<title>问题分类设置</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>

<script src="../js/xmlhttp.js"></script>
<script src="../js/idataset.js"></script>
<script src="../js/idbgrids.js"></script>
<script src="../js/datasource.js"></script>
<script>

  var table,ds,DBGrid;  
 
  function doLoad(){
   $("#divClient").css("height",document.documentElement.clientHeight-64); 
   table = new TTable("SYS_DIRSD","",["WTFL"]);
   table.AfterInsert = function(){
     table.$set("DIR_CODE","WTFL");
   }
   ds = new TDataSource();
   table.addDataSource(ds); 
   
   DBGrid.setDataSource(ds);   

   DBGrid.paint();  
   
  }
    
</script>
</head>
<body onLoad="doLoad();">
<table width="100%" height="100%"  border="0" id="mainTable">
<tr><td height="40">
    <div style="height:40px; padding-top:4px;padding-left:4px">
          <button name="btAdd" class="btn btn-primary btn-sm" id="btAdd" onClick="table.insert();">
          <span class="glyphicon glyphicon-plus-sign"></span> 增 加</button>
<button name="btDel" class="btn btn-primary btn-sm" id="btDel" onClick="table.DeleteHintAndSave();">
<span class="glyphicon glyphicon-remove-circle"></span> 删 除</button>
          <button name="btSave" class="btn btn-primary btn-sm" onClick="table.applyUpdate('');">
          <span class="glyphicon glyphicon-books"></span> 保 存</button>
    </div>
</td></tr>
<tr><td>
<div style="padding-left:4px;padding-right:4px;padding-bottom:4px;height:100%;" id="divClient">
 	  <div id="grid" style="overflow:hidden;border:1px solid #cccccc;height:100%;border-radius:5px; position:relative">
	<script>	  
  DBGrid = new TDBGrid(grid,"grid");
  
  DBGrid.titleLinebs = 1.2;
  
  DBGrid.items.addEx({fieldName:"ITEM_CODE",width:96,alignment:taCenter});
  DBGrid.items.addEx({fieldName:"ITEM_NAME",width:240});  
  
  DBGrid.createGrid(); 
		</script>  
 </div>
</div>
</td></tr></table>
</body>
</html>

