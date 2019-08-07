<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<jsp:useBean id="plimit" scope="page" class="bluec.fee.CLogin"/>
<%
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
%>

<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<title>显示审批流程</title>
<link href="../theme/neiye.css" rel="stylesheet" type="text/css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">

<jsp:useBean id="pquery" scope="page" class="bluec.base.CLexIcon"/>
<%
  String[] params={request.getParameter("idkey").toString()};
  try{
   pquery.queryBySqlIDWithParam("#SHOWFLOWS",params,session);
   out.print(pquery.formatToXml("CHECK_FLOW"));   
  }catch(Exception ex){
   out.println(request.getRequestURI()+"\n打开数据产生异常:\n"+ex.getMessage());
  }finally{
   pquery.closeConn();
  }   
%>


<script src="../js/xmlhttp.js"></script>
<script src="../js/dataset.js"></script>
<script src="../js/datasource.js"></script>
<script src="../js/dbgrids.js"></script>
<script>
  var table,ds,DBGrid;
  
  
  function doLoad(){

   table = new TTable(mData,mMeta,mDelta,"");
   ds = new TDataSource();
   
   table.addDataSource(ds);
   DBGrid.setDataSource(ds);
   DBGrid.paint(); 
   
  }
  
</script>
</head>
<body bgcolor="#EBE9E3" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" onLoad="doLoad();">
<table width="100%" height="100%" border="1" cellpadding="0" cellspacing="0" bordercolor="488aa0" bgcolor="#FFFFFF" class="tabletop">
  <tr>
    <td height="20">
	  <table width="100%" border="0" cellpadding="0" cellspacing="3" class="tdmenutop">
        <tr> 
          <td class="textmenutop">显示审批流程</td>
        </tr>
      </table>
	</td>
  </tr>
  <tr>
    <td height="32" align="center" bgcolor="#eeeeff"><table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td align="right">
		  <input name="btClose" type="button" class="button_3" id="btClose" onClick="window.close();" value="关 闭">&nbsp;</td>  		  
      </tr>
    </table></td>
  </tr>
  <tr>
    <td valign="top" height="100%" width="100%">
	 <table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
      <tr valign="top">
        <td style="padding:2px 2px 2px 2px"><div id="grid" style="overflow:hidden;border:1px solid #666666;height:100%;width:100%">
		<script>
  DBGrid = new TDBGrid(grid,"grid");
  DBGrid.readOnly = true;
  
  DBGrid.items.addEx({fieldName:"FLOW_XH",width:64,alignment:taCenter});
  DBGrid.items.addEx({fieldName:"FLOW_NAME",width:144});
  DBGrid.items.addEx({fieldName:"UTIME",width:120});
  DBGrid.items.addEx({fieldName:"RY_CODE",width:64,alignment:taCenter});
  DBGrid.items.addEx({fieldName:"RY_NAME",width:72});
  DBGrid.items.addEx({fieldName:"CRESULT",width:200,showHint:true});
  DBGrid.createGrid(40);
		</script></div></td>
      </tr>
     </table>  
    </td>
  </tr>
</table>
</body>
</html>

