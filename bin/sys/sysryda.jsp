<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<jsp:useBean id="plimit" scope="page" class="bluec.base.CLogin"/>
<%
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
 if(!plimit.isLogin(session)){
  out.println(plimit.getLastError());
  return;
 }
%>
 
<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<title>操作员设置</title>
<link href="../theme/neiye.css" rel="stylesheet" type="text/css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">

<script src="../theme/const.js"></script>
<script src="../js/xmlhttp.js"></script>
<script src="../js/dataset.js"></script>
<script src="../js/datasource.js"></script>
<script src="../js/dbgrids.js"></script>

<jsp:useBean id="pquery" scope="page" class="bluec.base.CLexIcon"/>
<%
  try{
    pquery.queryBySql("select * from pub_user where userid>0",session);
    out.print(pquery.formatToXml("PUB_USER"));   
   
  }catch(Exception ex){
    out.println(request.getRequestURI()+"\n打开数据产生异常:\n"+ex.getMessage());
  }finally{
    pquery.closeConn();
  }   
%>

<script>
  var table,ds,DBGrid;
  
  function AfterInsert(dSet){
	dSet.setFieldValue("USER_LEVEL",1);		
	dSet.setFieldValue("USER_PASS","888888");			
  }
  
  function doLoad(){
  
   table = new TTable(mData,mMeta,mDelta,"PUB_USER");
   table.SeqName = "SEQ_PUB_USER";
   table.SeqFieldName = "USERID";
   
   table.indexDefs.addIndex("index1",["USERCODE"],1,"人员代码不能够重复."); 
   
        
   table.AfterInsert = AfterInsert;
   
   ds = new TDataSource();
   table.addDataSource(ds); 
   
   DBGrid.setDataSource(ds);      
   DBGrid.paint();  

 }
 
</script>
</head>
<body bgcolor="#f7f8f9" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" onLoad="doLoad();"  scroll="no">
<table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0" bordercolor="488aa0" bgcolor="#f7f8f9" class="tabletop">
  <tr>
    <td height="20">
	  <table width="100%" border="0" cellpadding="0" cellspacing="0" class="tdmenutop">
        <tr> 
          <td bgcolor="#018cd1" width="80" style="padding:0px 0px 0px 6px;color:#FFFFFF"><nobr>操作员设置</nobr></td>
		  <td width="34"><img src="../images/AddInfoMainTitle.jpg" border="0"></td>		  		  		  
		  <td align="right" valign="middle">&nbsp;</td>
      <td width="144" valign="middle" align="center" style="padding-top:2px">
      <span id="pageInp"></span></td>
      <td width="32" align="right"><input name="btExit" type="button" class="button_6" id="btExit" 
	          onClick="closePage();" value="&times;" style="font-weight:bold"></td>
        </tr>
      </table>
	</td>
  </tr>
  <tr>
    <td height="32" align="center" bgcolor="#eeeeff"><table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
      <tr>
	    <td width="5"></td>
        <td width="200" align="left" valign="middle">
          <input name="btIns" type="button" class="button_3" id="btIns" onClick="table.insert();" 
value="增 加"><input name="Submit22" type="button" class="button_3" value="删 除" 
onClick="table.DeleteHint();">
  <input name="Submit2" type="button" class="button_b3" value="保 存"
 onClick="table.applyUpdateEx();"></td>
        <td width="60">&nbsp;</td> 
		<td align="left" valign="middle"><input name="btClose" type="button" class="button_b3" id="btClose" onClick="closePage();" value="关 闭"></td>	  
      </tr>
    </table></td>
  </tr>
  <tr>
    <td valign="top" height="100%" width="100%">

	 <table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
      <tr valign="top">
        <td style="padding:1px 1px 1px 1px"><div id="grid" style="overflow:hidden;border:1px solid #bbbbbb;height:100%;width:100%">
		<script>
  DBGrid = new TDBGrid(grid,"grid");
  
  DBGrid.showInputMark = true;
  DBGrid.addColumn({fieldName:"USERCODE",width:80,alignment:taCenter}).title.caption = "编号";
  DBGrid.addColumn({fieldName:"USERNAME",width:96}).title.caption = "姓名";
  DBGrid.addColumn({fieldName:"USER_PASS",width:120,buttonStyle:cbsPassWord,readOnly:true}).title.caption = "密码";  
   
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

