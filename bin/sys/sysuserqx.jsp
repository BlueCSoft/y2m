<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<jsp:useBean id="plimit" scope="page" class="bluec.base.CLogin"/>
<%
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
 if(plimit.checkLimitM(request)<0){
  out.println(plimit.getLastError());
  return;
 }
 
 String merid = session.getAttribute("gMerchantId").toString();
 String uid = request.getParameter("uid").toString();
 
%>
<html>

<head>
<title>����Ա��Ͻ�ŵ�</title>
<link href="../theme/neiye.css" rel="stylesheet" type="text/css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">
<jsp:useBean id="pquery" scope="page" class="bluec.base.CQuery"/>
<%
  String[] vparams = {merid,uid};
  try{
    pquery.queryBySql("select BranchId,BranchName,IsUse=0 from dd_Branch where MerchantId='%s'",merid,session);
    out.print(pquery.formatToXml(""));
    pquery.queryBySql("select * from pub_userkf where MerchantId='%s' and user_id=%s",vparams,session);
    out.print(pquery.formatToXml("PUB_USERKF","kf"));
  }catch(Exception ex){
    out.println(request.getRequestURI()+"\n�����ݲ����쳣:\n"+ex.getMessage());
    return;
  }finally{
    pquery.closeConn();
  } 
%>
<style>
 td 		{font-size:13px};
</style>
<script src="../theme/const.js"></script>
<script src="../js/xmlhttp.js"></script>
<script src="../js/dataset.js"></script>
<script src="../js/datasource.js"></script>
<script src="../js/dbgrids.js"></script>
<script src="../js/db.js"></script>


<script>

  var table,tablekf,ds,DBGrid;
  
  function doLoad(){

   table = new TTable(mData,mMeta,mDelta,"");
   tablekf = new TTable(kfData,kfMeta,kfDelta,"PUB_USERKF");
   
   for(var i=1;i<=table.getRecordCount();i++){
     table.moveRecord(i);
	 if(tablekf.locate("MdCode",table.$("BranchId"))){
       table.$set("ISUSE",1);
	   table.post();
	 } 
   }
   table.moveRecord(1);

   tablekf.AfterInsert = function(dSet){
	 dSet.$set("MerchantId","<%=merid%>");    
	 dSet.$set("User_Id","<%=uid%>"); 
   }
   
   ds = new TDataSource();
   table.addDataSource(ds);
   DBGrid.setDataSource(ds);
   DBGrid.paint(); 
   
  }
 
  function doSave(){
   for(var i=1;i<=table.getRecordCount();i++){
     table.moveRecord(i);
	 if(table.$("ISUSE")==1){
	   if(!tablekf.locate("MdCode",table.$("BranchId"))){
		 tablekf.insert();
         tablekf.$set("MdCode",table.$("BranchId"));
	     tablekf.post();
	   } 
	 }else{
       if(tablekf.locate("MdCode",table.$("BranchId"))){
		 tablekf.Delete();
	   }	 
	 }
   }
   table.moveRecord(1);
   tablekf.applyUpdate();
  }
</script>
</head>

<body bgcolor="#EBE9E3" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" onLoad="doLoad();" scroll="no">
<table width="100%" height="100%" border="1" cellpadding="0" cellspacing="0" bordercolor="488aa0" 
       bgcolor="#FFFFFF" class="tabletop">
 <tr>
   <td height="28" align="left" bgcolor="#ddddff" style="padding:0px 0px 0px 3px">
   <input name="btSave" type="button" class="button_b3" value="�� ��" 
onClick="doSave();">&nbsp;<input name="btClose" type="button" class="button_b3" value="�� ��"
onClick="closePage();">  
 </td>
 </tr>
 <tr>
  <td height="20" align="left" bgcolor="#ddddff">&nbsp;��Ͻ���ŵ�
    <input type="text" style="border:0px;color:#ddddff;width:0px" size="1" readonly></td>
 </tr>
 <tr><td style="padding:2px 2px 2px 2px" valign="top"> 
	<div style="overflow:hidden;border:1px solid #CCCCCC;width:100%;height:100%;" id="grid">
<script>
  DBGrid = new TDBGrid(grid,"grid");
  DBGrid.autoInsert = false;
  DBGrid.items.addEx({fieldName:"ISUSE",width:32,checkBox:true}).title.caption = "ѡ��";
  DBGrid.items.addEx({fieldName:"BranchId",width:88,readOnly:true,alignment:taCenter}).title.caption = "�ŵ���";
  DBGrid.items.addEx({fieldName:"BranchName",width:230,readOnly:true}).title.caption = "�ŵ�����";	
  DBGrid.createGrid();
</script>
      </div>
 </td></tr>	  
</table>
</center>
</body>

</html>

