<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<jsp:useBean id="plimit" scope="page" class="bluec.base.CLogin"/>
<%
 request.setCharacterEncoding("GBK");
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
<title>数据传输配置</title>
<link href="../theme/neiye.css" rel="stylesheet" type="text/css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">

<script src="../theme/const.js"></script>
<script src="../js/xmlhttp.js"></script>
<script src="../js/dataset.js"></script>
<script src="../js/datasource.js"></script>
<script src="../js/dbgrids.js"></script>
<script src="../js/db.js"></script>

<jsp:useBean id="pquery" scope="page" class="bluec.base.CLexIcon"/>
<%
  try{
    pquery.queryBySql("SELECT * FROM SYS_TRANCFG",session);
    out.print(pquery.formatToXml("SYS_TRANCFG"));   
   
  }catch(Exception ex){
    out.println(request.getRequestURI()+"\n打开数据产生异常:\n"+ex.getMessage());
  }finally{
    pquery.closeConn();
  }   
%>

<script>
  
  var table,ds,DBGrid;
    
  function doLoad(){
    table = new TTable(mData,mMeta,mDelta,"SYS_TRANCFG");
    table.autoInsert = false;

    ds = new TDataSource();
    table.addDataSource(ds); 
   
    DBGrid.setDataSource(ds);      
    DBGrid.paint();  
  }
 
  function doCall(att){   
    __xmlHttp.requestPageExA("../sysciface/trandata.jsp",["att="+att]);	
  }
  
  function doApply(){   
    __xmlHttp.requestPageExA("../sysciface/traninit.jsp",[]);	
  }
</script>
</head>
<body bgcolor="#f7f8f9" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" onLoad="doLoad();"  scroll="no">
<table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0" bordercolor="488aa0" bgcolor="#f7f8f9" class="tabletop">
  <tr>
    <td height="20">
	  <table width="100%" border="0" cellpadding="0" cellspacing="0" class="tdmenutop">
        <tr> 
          <td bgcolor="#018cd1" width="40" style="padding:0px 0px 0px 6px;color:#FFFFFF"><nobr>数据传输配置</nobr></td>
		  <td width="34"><img src="../images/AddInfoMainTitle.jpg" border="0"></td>		  		  		  
		  <td align="right" valign="middle">&nbsp;</td>
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
        <td width="400" align="left" valign="middle"><input name="btSave" type="button" class="button_b3" id="btSave"
 onClick="table.applyUpdateEx();" value="保 存">
          <input name="btApply" type="button" class="button_b3" id="btApply"
 onClick="doApply();" value="应 用">
          <input name="btJust" type="button" class="button_b5" id="btJust"
 onClick="doCall(0);" value="全传一次">
          <input name="btJust2" type="button" class="button_b5" id="btJust2"
 onClick="doCall(5);" value="传订单一次">
          <input name="btClose" type="button" class="button_b3" id="btClose" onClick="closePage();" value="关 闭"></td>
        <td align="left" valign="middle">&nbsp;</td>	  
      </tr>
    </table></td>
  </tr>
  <tr>
    <td valign="top" height="100%" width="100%">

	 <table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
      <tr valign="top">
        <td style="padding:1px 1px 1px 1px"><div id="grid" 
        style="overflow:hidden;border:1px solid #bbbbbb;height:100%;width:100%; background-color:#FFF">
		<script>
  DBGrid = new TDBGrid(grid,"grid");
  
  DBGrid.showInputMark = true;
  DBGrid.addColumn({fieldName:"DATAMS",width:200,readOnly:true});
  DBGrid.addColumn({fieldName:"ISENABLED",width:88,checkBox:true});
  DBGrid.addColumn({fieldName:"TIMELEN",width:88,alignment:taCenter});  
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

