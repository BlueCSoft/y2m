<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<jsp:useBean id="plimit" scope="page" class="bluec.base.CLogin"/>
<%
 request.setCharacterEncoding("GBK");
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
 if(plimit.checkLimit(request)<0){
  out.println(plimit.getLastError());
  return;
 }
%>
<html>
<head>

<title>SQL语句参数定义</title>
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

 function doLoad(){
  table = new TTable(mData,mMeta,mDelta,"");
  table.readOnly = <%=session.getAttribute("gUserLevel").toString()%>>=0;  
  var pMs = tables.getFieldValue("SQL_PARAM");
  var pDy = tables.getFieldValue("SQL_PDTYPE");
  var pDf = tables.getFieldValue("SQL_PFROM");    
  var pSs = tables.getFieldValue("SQL_SESSION");      
  
  if(pDy!=""){
   var aMs = pMs.split("/");
   var aDy = pDy.split("/");
   var aDf = pDf.split("/");
   var aSs = pSs.split("/");   
 
   table.Delete(); 
   for(var i=0;i<aMs.length;i++){
    table.insert();
    table.setFieldValue("SQL_PARAM",aMs[i]);
    table.setFieldValue("SQL_PDTYPE",aDy[i]);
    table.setFieldValue("SQL_PFROM",aDf[i]);
    table.setFieldValue("SQL_SESSION",aSs[i]);	
    table.post();
   } 
  }
         
  ds = new TDataSource();   
  table.addDataSource(ds);

  dss = new TDataSource();   
  tables.addDataSource(dss);
    
  dss.addObject(new TDBEdit(sqlEdit,"SQL_SERVER"));
  
  DBGrid.setDataSource(ds);

  DBGrid.paint();
  
  btChange.disabled = table.readOnly;
  btOk.disabled = table.readOnly;
 }
 
 function doUnLoad(){
  tables.removeDataSource(dss);
 }
 
 function doComfire(){
   var pMs = "",pDy = "",pDf = "",pSs="",ds="",n=1,pp;     
   
   table.first();
   
   while(n<=table.getRecordCount()){
    pMs = pMs+ds+table.getFieldValue("SQL_PARAM");
    pDy = pDy+ds+table.getFieldValue("SQL_PDTYPE");
    pDf = pDf+ds+table.getFieldValue("SQL_PFROM");	
	pp = table.getFieldValue("SQL_SESSION");
	if(pp=="")
 	 pSs = pSs+ds+" ";		
	else
     pSs = pSs+ds+table.getFieldValue("SQL_SESSION");		
	ds = "/";	
	n++;
	table.next();
   }	
   
   tables.setFieldValue("SQL_PARAM",pMs);
   tables.setFieldValue("SQL_PDTYPE",pDy);
   tables.setFieldValue("SQL_PFROM",pDf);
   tables.setFieldValue("SQL_SESSION",pSs);   
   
   window.close();
 }
 
 function tolower(){
   var s = tables.getFieldValue("SQL_SERVER");
   tables.setFieldValue("SQL_SERVER",s.toLowerCase());
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
   pquery.queryBySql("select * from sys_sqlds where 1>2",session);
   out.print(pquery.formatToXml(""));
  }catch(Exception ex){
   out.println(request.getRequestURI()+"\n打开数据产生异常:\n"+ex.getMessage());
  }finally{
   pquery.closeConn();
  }
 %>
</xml>
<body leftmargin="8" topmargin="8" onLoad="doLoad();" onUnload="doUnLoad();" onUnload="__VCL.freeAll();">
<table width="100%" height="100%" border="0" cellpadding="1" cellspacing="1" bgcolor="#CCCCCC">
  <tr>
    <td height="350" align="left" valign="top" bgcolor="#FFFFFF"><textarea name="textarea" class="inputtext" id="sqlEdit" style="width:100%;height:100%; font-family:'Courier New';font-size:14px"></textarea></td>
  </tr>
  <tr>
    <td valign="top" bgcolor="#FFFFFF"><div style=" border:1px solid;overflow:hidden;width:100%;height:100%;" id="grid">
<script>
   DBGrid = new TDBGrid(grid,"grid");
   DBGrid.titleLinebs = 1.2;
   DBGrid.useActiveProperty = true;
   DBGrid.items.addEx({fieldName:"SQL_PARAM",width:215}).title.caption = "参数说明";
   DBGrid.items.addEx({fieldName:"SQL_PDTYPE",width:80,buttonStyle:cbsSelect}).title.caption = "数据类型";
   DBGrid.columns[1].pickListNo = [1,2,3,4];
   DBGrid.columns[1].pickListName = ["字符","整数","小数","日期"];
   DBGrid.items.addEx({fieldName:"SQL_PFROM",width:80,checkBox:true}).title.caption = "来自Session";
   DBGrid.items.addEx({fieldName:"SQL_SESSION",width:120}).title.caption = "SESSION变量名";   
   DBGrid.createGrid();   
</script>

</div></td>
  </tr>
  <tr>
    <td height="24" align="right" bgcolor="#CCCCCC"><input name="btChange" type="button" class="button_b5" id="btChange"
		  onClick="tolower();" value="转换成小写" disabled><input name="Submit22" type="button" class="button_3" value="删 除"
		  onClick="table.Delete();"><input name="btOk" type="button" class="button_b3" value="确 定"
		  onClick="doComfire();">
		  <input name="Submit2" type="button" class="button_b3" value="关 闭" onClick="window.close();">      
    &nbsp;&nbsp;</td>
  </tr>
</table>
</body>
</html>

