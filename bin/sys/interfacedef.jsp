<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<jsp:useBean id="plimit" scope="page" class="bluec.base.CLogin"/>
<%
 request.setCharacterEncoding("GBK");
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
/*
 if(plimit.checkLimit(request)<0){
   out.println(plimit.getLastError()); 
   return;
 }
*/ 
%>

<!DOCTYPE html>

<head>
<title>接口语句管理</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">
<script src="../theme/const.js"></script>

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>

<script src="../js/xmlhttp.js"></script>
<script src="../js/idataset.js"></script>
<script src="../js/idbgrids.js"></script>
<script src="../js/idbctrls.js"></script>
<script src="../js/datasource.js"></script>

<script>
  var table,ds,DBGrid;
  
  function doSelectChange(sender){
    table.getDataFromServer("#SYS_SQLDS_IFACE",["I",opEdit.value,opEdit.value]);
	opEdit.value = "";
  }
  
  function AfterInsert(dSet){
    table.setFieldValue("SQL_STYLE","I");
	table.setFieldValue("SQLATT",1);
  }
  
  function doLoad(){
    $("#divClient").css("height",document.documentElement.clientHeight-56); 

    table = new TTable("SYS_SQLDS","#SYS_SQLDS_IFACE",["I","",""]);
   
    table.AfterInsert = AfterInsert;
    table.setFieldProp("SQL_SERVER","S",0);
   
    ds = new TDataSource();
      ds.OnDataChange = function(ds,dSet,field){
    } 

    table.addDataSource(ds);
    ds.addObject(new TDBEdit(sqlEdit,"SQL_SERVER"));  
	ds.addObject(new TDBEdit(sqlParam,"SQL_PARAM")); 
    DBGrid.setDataSource(ds);
    DBGrid.paint(); 
    //doSelectChange(null);
  }
  
  function callParam(){
     sqlEdit.value = table.applyUpdate();
  }
    
</script>

<body onLoad="doLoad();">
<table width="100%" height="100%"  border="0" id="mainTable">
<tr><td height="40">
    <div style="height:40px; padding-top:4px;font-size:13px">
    <table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td width="460"><table width="100%"  border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td width="40" align="center">查找</td>
            <td>
            <input name="opEdit" type="text" id="opEdit" style="width:100%" class="form-control"
			    onKeyDown="if(event.keyCode==13) doSelectChange(this);">
            </td>
          </tr>
        </table></td>
        <td align="left" valign="middle">&nbsp;
          <button name="btIns" class="btn btn-primary btn-sm" id="btIns" onClick="table.insert();">
          <span class="glyphicon glyphicon-plus-sign"></span> 增 加</button>
          <button name="btDel" class="btn btn-primary btn-sm" id="btDel" onClick="table.Delete();">
          <span class="glyphicon glyphicon-remove-circle"></span> 删 除</button>
          <button name="btSave" class="btn btn-primary btn-sm" onClick="table.applyUpdate('');">
          <span class="glyphicon glyphicon-book"></span> 保 存</button></td>
      </tr>
    </table>
    </div>
</td></tr>
<tr><td>
    <div style="padding-left:4px;padding-right:4px;padding-bottom:4px;height:520px;" id="divClient">
    <table width="100%" height="100%"  border="0">
    <tr><td width="542px">
    <div id="grid" style="overflow:hidden;border:1px solid #ccc; height:100%; position:relative;border-radius:5px">
    <script>
       DBGrid = new TDBGrid(grid,"grid");
       DBGrid.useActiveProperty = true;
       DBGrid.items.addEx({fieldName:"SQL_ID",width:184}).title.caption = "标识";
       DBGrid.items.addEx({fieldName:"SQL_DS",width:216}).title.caption = "说明";
       DBGrid.items.addEx({fieldName:"SQLATT",width:90,checkBox:true}).title.caption = "JSON参数";   
       DBGrid.createGrid(40);   
    </script>
    </div>
    </td>
    <td style="padding:1px 1px 1px 1px" valign="top">
    <textarea class="form-control" style="height:100%;font-size:13px; font-family:'宋体'" id="sqlEdit"></textarea>  
    </td>
    <td style="padding:1px 1px 1px 1px" valign="top">
    <textarea class="form-control" style="height:100%;font-size:13px; font-family:'宋体'" id="sqlParam"></textarea>  
    </td>
    </tr>
    </table>
   </div>
  </div>
 </td></tr></table>
</body>

</html>



