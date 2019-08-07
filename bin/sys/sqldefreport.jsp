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

<title>͸�ӱ�����</title>
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
   dSet.setFieldValue("TOTALID",0);
   dSet.setFieldValue("DISPLAYWIDTH",0);   
   dSet.setFieldValue("R_XH",dSet.getRecordCount()); 
 }

 function doLoad(){
  table = new TTable(mData,mMeta,mDelta,"SYS_SQLDS_D");
  table.getDataFromServer("#SYS_SQLDS_D",[tables.getFieldValue("SQL_ID")]);
  
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
   pquery.queryBySqlIDWithParam("#SYS_SQLDS_D","none",session);
   out.print(pquery.formatToXml(""));
  }catch(Exception ex){
   out.println(request.getRequestURI()+"\n�����ݲ����쳣:\n"+ex.getMessage());
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
 
  DBGrid.items.addEx({fieldName:"R_XH",width:48,alignment:taCenter}).title.caption = "�����";          
  DBGrid.items.addEx({fieldName:"FIELDNAME",width:120}).title.caption = "������";

  DBGrid.items.addEx({fieldName:"DISPLAYLABEL",width:160}).title.caption = "�б���";
  DBGrid.items.addEx({fieldName:"DISPLAYWIDTH",width:64,alignment:taRight}).title.caption = "��ʾ���";        
  DBGrid.items.addEx({fieldName:"DISPLAYFROMAT",width:80,alignment:taRight}).title.caption = "��ʾ��ʽ";          

  DBGrid.items.addEx({fieldName:"TOTALID",width:80,buttonStyle:cbsSelect,alignment:taLeft}).title.caption = "λ��";    
  DBGrid.columns[5].pickListNo = [0,1,2,3,4];
  DBGrid.columns[5].pickListName = ["δ����","���ֶ�","���ֶ�","�����ֶ�","ɸѡ�ֶ�"];
  
/*  DBGrid.items.addEx({fieldName:"ALIGNMENT",width:72,buttonStyle:cbsSelect,alignment:taLeft}).title.caption = "���뷽ʽ";    
  DBGrid.columns[6].pickListNo = ["0","1","2"];
  DBGrid.columns[6].pickListName = ["��߶���","�м����","�ұ߶���"];*/
  
  DBGrid.createGrid();  
</script>

</div></td>
  </tr>
  <tr>
    <td height="24" align="right" bgcolor="#CCCCCC"><input name="btChange2" type="button" class="button_b5" id="btChange2"
		  onClick="tolower2();" value="��ת���ɴ�д">
    <input name="btChange" type="button" class="button_b5" id="btChange"
		  onClick="tolower();" value="SQLת����Сд">
      <input name="btIns" type="button" class="button_3" id="btIns" onClick="table.insert();" value="�� ��">
      <input name="Submit22" type="button" class="button_3" value="ɾ ��"
		  onClick="table.DeleteHint();">
         <input name="Submit2" type="button" class="button_3" value="�� ��"
		  onClick="doComfire();">
      <input name="Submit2" type="button" class="button_3" value="�� ��" onClick="window.close();">      
    &nbsp;&nbsp;</td>
  </tr>
</table>
</body>
</html>
