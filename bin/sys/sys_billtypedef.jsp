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
<title>支付订单类型登记</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">
<script src="../theme/const.js"></script>

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>

<script src="../js/xmlhttp.js"></script>
<script src="../js/idataset.js"></script>
<script src="../js/idbgrids.js"></script>
<script src="../js/datasource.js"></script>

<script>

  var table,ds,DBGrid;  
 
  function doLoad(){
    table = new TTable("Sys_BillTypeDef","#Sys_BillTypeDef",[]);

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
          <input name="btAdd" type="button" class="btn btn-default" id="btAdd" value="增 加" onClick="table.insert();">
<input name="btDel" type="button" class="btn btn-default" id="btDel" value="删 除" onClick="table.DeleteHintAndSave();">
          <input name="btSave" type="button" class="btn btn-default" value="保 存" onClick="table.applyUpdate('');">
    </div>
</td></tr>
<tr><td>
    <div style="padding:8px;height:528px">
	  <div id="grid" style="overflow:hidden;border:1px solid #cccccc;height:100%;border-radius:5px">
	<script>	  

  DBGrid = new TDBGrid(grid,"grid");
  
  DBGrid.titleLinebs = 1.2;
  
  DBGrid.items.addEx({fieldName:"BILLTYPEID",width:96,alignment:taCenter});
  DBGrid.items.addEx({fieldName:"BILLTYPENAME",width:240});  
  
  DBGrid.createGrid(); 
		</script>  
 </div>
</div>
</td></tr></table>
</body>
</html>

