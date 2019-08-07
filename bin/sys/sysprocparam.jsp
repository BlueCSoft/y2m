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

<!DOCTYPE html>

<head>

<title>存储过程调用参数定义</title>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>

<script src="../theme/const.js"></script>
<script src="../js/xmlhttp.js"></script>
<script src="../js/idataset.js"></script>
<script src="../js/datasource.js"></script>
<script src="../js/idbgrids.js"></script>
<script src="../js/idbctrls.js"></script>
<script>
 var tables = parent.table;

 var table,DBGrid;

 function doLoad(){
  table = new TTable(mData,mMeta,mDelta,"");
  table.readOnly = <%=session.getAttribute("gUserLevel").toString()%>>=0;  
  var pMs = tables.getFieldValue("SQL_PARAM");
  var pDy = tables.getFieldValue("SQL_PDTYPE");
  var pDf = tables.getFieldValue("SQL_PFROM");    
  var pSs = tables.getFieldValue("SQL_SESSION");      
  var pIo = tables.getFieldValue("SQL_INOUT");        
  
  if(pDy!=""){
   var aMs = pMs.split("/");
   var aDy = pDy.split("/");
   var aDf = pDf.split("/");
   var aSs = pSs.split("/");   
   var aIo = pIo.split("/");   
 
   table.Delete(); 
   for(var i=0;i<aMs.length;i++){
    table.insert();
    table.setFieldValue("SQL_PARAM",aMs[i]);
    table.setFieldValue("SQL_PDTYPE",aDy[i]);
    table.setFieldValue("SQL_PFROM",aDf[i]);
    table.setFieldValue("SQL_SESSION",aSs[i]);	
    table.setFieldValue("SQL_INOUT",aIo[i]);		
    table.post();
   } 
  }
  
  table.AfterInsert = function(dSet){
   table.setFieldValue("SQL_PDTYPE",1);
   table.setFieldValue("SQL_PFROM",1);
   table.setFieldValue("SQL_INOUT",1);   
  }
         
  table.BeforePost = function(dSet){
   var pf = table.getFieldValue("SQL_PFROM");
   if((pf=="1"||pf=="2")&&table.getFieldValue("SQL_SESSION")==""){
    alert("当数据来源于字段时，必须输入字段名.");
	return false;
   }
   if((pf=="4")&&table.getFieldValue("SQL_SESSION")==""){
    alert("当数据来源于session时，必须输入session变量名.");
	return false;
   }
   return true;
  }
  		 
  ds = new TDataSource();   
  table.addDataSource(ds);

  dss = new TDataSource();   
  tables.addDataSource(dss);
    
  dss.addObject(new TDBEdit(sqlEdit,"SQL_SERVER"));
  
  DBGrid.setDataSource(ds);

  DBGrid.paint();
  
  btOk.disabled = table.readOnly;
 }
 
 function doUnLoad(){
  tables.removeDataSource(dss);
 }
 
 function doComfire(){ 
   var pMs = "",pDy = "",pDf = "",pSs="",pIo="",ds="",n=1,pp;     
   
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

    pIo = pIo+ds+table.getFieldValue("SQL_INOUT");			
	ds = "/";	
	n++;
	table.next();
   }	
   
   tables.setFieldValue("SQL_PARAM",pMs);
   tables.setFieldValue("SQL_PDTYPE",pDy);
   tables.setFieldValue("SQL_PFROM",pDf);
   tables.setFieldValue("SQL_SESSION",pSs);   
   tables.setFieldValue("SQL_INOUT",pIo);      
   
   window.close();
 }
 
</script>
</head>

<body leftmargin="8" topmargin="8" onLoad="doLoad();" onUnload="doUnLoad();">
<table width="100%" height="100%" border="0" cellpadding="1" cellspacing="1" bgcolor="#CCCCCC">
  <tr>
    <td height="240" align="left" valign="top" bgcolor="#FFFFFF"><textarea name="textarea" class="inputtext" id="sqlEdit" style="width:100%;height:100%; font-family:'Courier New';font-size:14px"></textarea></td>
  </tr>
  <tr>
    <td valign="top" bgcolor="#FFFFFF"><div style=" border:1px solid;overflow:hidden;width:100%;height:100%;" id="grid">
<script>
   DBGrid = new TDBGrid(grid,"grid");
   DBGrid.titleLinebs = 1.2;
   DBGrid.useActiveProperty = true;
   DBGrid.items.addEx({fieldName:"SQL_PARAM",width:200}).title.caption = "参数说明";
   DBGrid.items.addEx({fieldName:"SQL_PDTYPE",width:80,buttonStyle:cbsSelect}).title.caption = "数据类型";
   DBGrid.columns[1].pickListNo = [1,2,3,4];
   DBGrid.columns[1].pickListName = ["字符","整数","小数","日期"];
   DBGrid.items.addEx({fieldName:"SQL_PFROM",width:96,buttonStyle:cbsSelect}).title.caption = "来源";
   DBGrid.columns[2].pickListNo = [0,1,2,3,5];
   DBGrid.columns[2].pickListName = ["无","字段值","字段原值","session变量","常数"];
   DBGrid.items.addEx({fieldName:"SQL_SESSION",width:120}).title.caption = "字段或变量名";   
   
   DBGrid.items.addEx({fieldName:"SQL_INOUT",width:64,buttonStyle:cbsSelect}).title.caption = "方向";
   DBGrid.columns[4].pickListNo = [1,2,3];
   DBGrid.columns[4].pickListName = ["输入","输出","输入输出"];
   DBGrid.createGrid();   
</script>

</div></td>
  </tr>
  <tr>
    <td height="24" align="right" bgcolor="#CCCCCC"><input name="btIns" type="button" class="button_3" id="btIns" onClick="table.insert();" value="增 加">
    <input name="Submit22" type="button" class="button_3" value="删 除"
		  onClick="table.DeleteHint();">
         <input name="btOk" type="button" class="button_3" value="确 定"
		  onClick="doComfire();" disabled>
      <input name="Submit2" type="button" class="button_3" value="关 闭" onClick="window.close();">      
    &nbsp;&nbsp;</td>
  </tr>
</table>
</body>
</html>

