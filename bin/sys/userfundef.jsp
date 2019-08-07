<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<jsp:useBean id="plimit" scope="page" class="bluec.base.CLogin"/>
<%
 request.setCharacterEncoding("GBK");
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
 if(!plimit.sessionValidated(session)){
  return;
 }
%>

<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<title>操作员常用功能设置</title>
<link href="../theme/neiye.css" rel="stylesheet" type="text/css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">

<script src="../theme/const.js"></script>
<script src="../js/xmlhttp.js"></script>
<script src="../js/dataset.js"></script>
<script src="../js/datasource.js"></script>
<script src="../js/treeview.js"></script>
<script src="../js/dbgrids.js"></script>

<jsp:useBean id="pquery" scope="page" class="bluec.base.CQuery"/>
<%
  String ulevel = session.getAttribute("gUserLevel").toString();
  String uid = session.getAttribute("gUserId").toString();
  
  try{
   if(ulevel.equals("-1"))
    pquery.queryBySqlIDWithParam("@USERALLFUNS",uid,session);
   else
    pquery.queryBySqlIDWithParam("@USERFUNS",uid,session);   	
   out.print(pquery.formatToXml("SYS_FUNS","d"));   
  
   pquery.queryBySqlIDWithParam("@USERFUNC",uid,session);
   out.print(pquery.formatToXml("SYS_USERFUNC"));   
   
  }catch(Exception ex){
   out.println(request.getRequestURI()+"\n打开数据产生异常:\n"+ex.getMessage());
  }finally{
   pquery.closeConn();
  }   
%>

<script>
 
  var table,tabled,ds,DBGrid,dsd,DBGridd;
  
  function AfterInsert(dSet){
    dSet.setFieldValue("UID",<%=uid%>);
	dSet.setFieldValue("FID",tabled.getFieldValue("FID"));
	dSet.setFieldValue("PXH",0);		
	dSet.setFieldValue("FUN_ID",tabled.getFieldValue("FUN_ID"));	
	dSet.setFieldValue("FUN_NAME",tabled.getFieldValue("FUN_NAME"));	
  }
  
  function doLoad(){
   table = new TTable(mData,mMeta,mDelta,"SYS_USERFUNC");
   table.OnInitUpdate = function(dSet){
    var nRecNo = dSet.pData.absolutePosition;
    for(var i=1;i<dSet.getRecordCount();i++){
	 dSet.moveRecord(i);
	 dSet.setFieldValue("PXH",i);
	 dSet.post();
	}
	dSet.moveRecord(nRecNo);
    return true;
   }
   table.AfterInsert = AfterInsert;

   tabled = new TTable(dData,dMeta,dDelta,"SYS_FUNS");	 
   
   var nRecNo = table.pData.absolutePosition;
   for(var i=1;i<table.getRecordCount();i++){
    table.moveRecord(i);	
	if(tabled.locate("FID",table.getFieldValue("FID"))){
	 tabled.setFieldValue("STATUS",i);
	 tabled.post();
	} 
   }
   table.moveRecord(nRecNo);
   

   ds = new TDataSource();
   table.addDataSource(ds); 
   
   DBGrid.setDataSource(ds);   
   DBGrid.paint();  
   
   dsd = new TDataSource();
   tabled.addDataSource(dsd); 
   
   DBGridd.setDataSource(dsd);   
   DBGridd.paint();  
  }
 
  function doAdd(){
   if(!tabled.isEmpty()&&!table.locate("FID",tabled.getFieldValue("FID"))){
    table.insert();
	table.post();
    tabled.setFieldValue("STATUS",1);
	tabled.post();
   }
  }
  
  function doDel(){
   if(!tabled.isEmpty()&&tabled.locate("FID",table.getFieldValue("FID"))){
    tabled.setFieldValue("STATUS",0);
	tabled.post();
	table.Delete();
   }
  }
  
  function doUp(){
   if(table.pData.absolutePosition>1)
    table.changeRecord(table.pData.absolutePosition,table.pData.absolutePosition-1);
  }
  
  function doDown(){
   if(table.pData.absolutePosition<table.getRecordCount())
    table.changeRecord(table.pData.absolutePosition,table.pData.absolutePosition+1);
  }
  
</script>
</head>
<body bgcolor="#EBE9E3" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" onLoad="doLoad();"  scroll="no">
<table width="100%" height="100%" border="1" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabletop">
  <tr>
    <td height="23">
	  <table width="100%" border="0" cellpadding="2" cellspacing="2" class="tdmenutop">
        <tr> 
          <td class="textmenutop">操作员常用功能设置</td>
        </tr>
      </table>
	</td>
  </tr>
  <tr>
    <td height="32" align="center" bgcolor="#eeeeff"><table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td width="2%"></td>
        <td width="98%" align="left" valign="middle"><input name="Submit2" type="button" class="button_b3" value="保 存"
		  onClick="table.applyUpdateEx();"></td>
      </tr>
    </table></td>
  </tr>
  <tr><td height="2" bgcolor="#999999"></td></tr>
  <tr>
    <td valign="top" height="100%" width="100%" style="padding:3px 3px 3px 3px">

	 <table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
	 <tr><td width="364" height="24">&nbsp;待选功能</td><td width="64"></td><td>&nbsp;已选功能</td>
	 </tr>
      <tr valign="top">
<td>		
<div id="grid" style="overflow:hidden;border:1px solid #666666;height:100%;width:100%">
		<script>
  DBGridd = new TDBGrid(grid,"grid");
  DBGridd.readOnly = true;
  DBGridd.options.dgAlwaysShowSelection = false;
  DBGridd.items.addEx({fieldName:"FUN_ID",width:72});
  DBGridd.items.addEx({fieldName:"FUN_NAME",width:240});
  
  DBGridd.OnDrawCell = function(sender,column,cell){
   if(sender.dataset.getFieldValue("STATUS")>0)
    cell.style.color = "#888888";
  }   

  DBGridd.createGrid();
		</script></div>
</td>
<td width="64" align="center"><p>&nbsp;</p>
  <p>
    <input name="btAdd" type="button" class="button_2" id="btAdd"
		  value="&gt;" onClick="doAdd();">
    <br>
    <br>
    <input name="btDelete" type="button" class="button_2" id="btDelete"
		  onClick="doDel();" value="&lt;">
    <br>
    <br>
    <input name="btUp" type="button" class="button_2" id="btUp"
		  onClick="doUp();" value="↑">
    <br>
    <br>
    <input name="btDown" type="button" class="button_2" id="btDown"
		  onClick="doDown();" value="↓">
  </p></td>
<td>
<div id="grid1" style="overflow:hidden;border:1px solid #666666;height:100%;width:100%">
		<script>
  DBGrid = new TDBGrid(grid1,"grid1");
  DBGrid.readOnly = true;
  DBGrid.options.dgAlwaysShowSelection = false;  
  DBGrid.items.addEx({fieldName:"FUN_ID",width:72});
  DBGrid.items.addEx({fieldName:"FUN_NAME",width:240});
  DBGrid.createGrid();
		</script></div>
		</td>
      </tr>
     </table>  
    </td>
  </tr>
</table>
</body>
</html>

