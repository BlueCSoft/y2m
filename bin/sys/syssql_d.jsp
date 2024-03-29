<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<jsp:useBean id="plimit" scope="page" class="bluec.base.sys.CSystem"/>
<%
 response.addHeader("Pragma", "no-cache");
 response.addHeader("Cache-Control", "no-store");
%>
<html>
<head>

<title>报表列设置</title>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<link href="../theme/neiye.css" rel="stylesheet" type="text/css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">

<script src="../theme/const.js"></script>
<script src="../js/xmlhttp.js"></script>
<script src="../js/dataset.js"></script>
<script src="../js/datasource.js"></script>
<script src="../js/dbgrids.js"></script>
<script src="../js/dbctrls.js"></script>
<script>
 var tables = window.dialogArguments;

 var table,DBGrid;
 
 function AfterInsert(dSet){
   dSet.setFieldValue("SQL_ID",tables.getFieldValue("SQL_ID")); 
   dSet.setFieldValue("TOTALATT",0);
   dSet.setFieldValue("ALGINMENT","");  
   dSet.setFieldValue("R_XH",dSet.getRecordCount()); 
 }

 function doLoad(){
  table = new TTable(mData,mMeta,mDelta,"SYS_REPORT_D");
  table.getDataFromServer("#SYS_REPORT_D",[tables.getFieldValue("SQL_ID")]);
  
  table.AfterInsert = AfterInsert;         
  ds = new TDataSource();   
  table.addDataSource(ds);

  dss = new TDataSource();   
  tables.addDataSource(dss);
    
  dss.addObject(new TDBEdit(sqlEdit,"SQL_SERVER"));
  DBGrid.setDataSource(ds);

  DBGrid.paint();
 }
 
 function doUnLoad(){
  tables.removeDataSource(dss);
 }
 
 function doComfire(){
  table.applyUpdate();
 }
 
 function tolower(){
   var s = tables.getFieldValue("SQL_SERVER");
   tables.setFieldValue("SQL_SERVER",s.toLowerCase());
 }
 
 function tolower2(){
   var n = table.getRecordCount();
   for(var i=1;i<=n;i++){
    table.moveRecord(i);
	var s = table.getFieldValue("FIELDNAME");
	table.setFieldValue("FIELDNAME",s.toUpperCase());
	table.post();
   }	
 }
 
</script>

<style type="text/css">
<!--
body {
	background-color: #CCCCCC;
}
-->
</style></head>

<jsp:useBean id="pquery" scope="page" class="bluec.base.CQuery"/>
<%
  try{
   pquery.queryBySqlIDWithParam("#SYS_REPORT_D","none",session);
   out.print(pquery.formatToXml(""));
  }catch(Exception ex){
   out.println(request.getRequestURI()+"\n打开数据产生异常:\n"+ex.getMessage());
  }finally{
   pquery.closeConn();
  }
 %>
</xml>
<body leftmargin="8" topmargin="8" onLoad="doLoad();" onUnload="doUnLoad();">
<table width="100%" height="100%" border="0" cellpadding="1" cellspacing="1" bgcolor="#CCCCCC">
  <tr>
    <td height="240" align="left" valign="top" bgcolor="#FFFFFF"><textarea name="textarea" class="inputtext" id="sqlEdit" style="width:100%;height:100%; font-family:'Courier New';font-size:14px"></textarea></td>
  </tr>
  <tr>
    <td valign="top" bgcolor="#FFFFFF"><div style=" border:1px solid;overflow:hidden;width:100%;height:100%;" id="grid">
<script>
  DBGrid = new TDBGrid(grid,"grid");
 
  DBGrid.items.addEx({fieldName:"R_XH",width:48,alignment:taCenter}).title.caption = "排序号";          
  DBGrid.items.addEx({fieldName:"FIELDNAME",width:96}).title.caption = "列字段名称";

  DBGrid.items.addEx({fieldName:"FIELDNAME_CN",width:120}).title.caption = "列标题";
  DBGrid.items.addEx({fieldName:"SHOWWIDTH",width:64,alignment:taRight}).title.caption = "列宽度";        
  
  DBGrid.items.addEx({fieldName:"ALGINMENT",width:72,buttonStyle:cbsSelect,alignment:taLeft}).title.caption = "对齐方式";    
  DBGrid.columns[4].pickListNo = ["left","center","right"];
  DBGrid.columns[4].pickListName = ["左边对齐","中间对齐","右边对齐"];
  
  DBGrid.items.addEx({fieldName:"DISPLAYFORMAT",width:56}).title.caption = "显示格式";
  DBGrid.createGrid();  
</script>

</div></td>
  </tr>
  <tr>
    <td height="24" align="right" bgcolor="#CCCCCC"><input name="btChange2" type="button" class="button_b5" id="btChange2"
		  onClick="tolower2();" value="列转换成大写">
    <input name="btChange" type="button" class="button_b5" id="btChange"
		  onClick="tolower();" value="SQL转换成小写">
      <input name="btIns" type="button" class="button_3" id="btIns" onClick="table.insert();" value="增 加">
      <input name="Submit22" type="button" class="button_3" value="删 除"
		  onClick="table.DeleteHint();">
         <input name="Submit2" type="button" class="button_3" value="保 存"
		  onClick="doComfire();">
      <input name="Submit2" type="button" class="button_3" value="关 闭" onClick="window.close();">      
    &nbsp;&nbsp;</td>
  </tr>
</table>
</body>
</html>
