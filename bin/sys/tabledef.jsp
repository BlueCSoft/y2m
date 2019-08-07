<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%
 request.setCharacterEncoding("GBK");

 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
%>
<html>
<head>

<title>表定义</title>
<link href="../theme/neiye.css" rel="stylesheet" type="text/css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">

<script language="javascript">
<!---->
  var pwin = window.dialogArguments;
  
  var origElement = null;
  function doClick(sender){
    if(sender==origElement) return;

    if (origElement != null){
      origElement.style.color = "black";
      origElement.style.background = "#FFFFFF";
    }

    origElement = sender;
    origElement.style.color = "white";
    origElement.style.background = "#0000AA";
    dataset.recordset.absolutePosition = sender.rowIndex+1;
  }
  function autoInsert(){
   pwin.doAutoInsert(dataset.recordset);
   window.close();
  }
<!---->
</script>
</head>

<jsp:useBean id="pquery" scope="page" class="bluec.base.CQuery"/>
 <%
  String T_ID = request.getParameter("T_ID").toString();
  String T_MS = request.getParameter("T_MS").toString();
  try{
   ResultSet rs = pquery.queryBySql("SELECT * FROM "+T_ID+" WHERE 1>2",session);
   out.print("<xml id=\"dataset\">\n");
   out.print(pquery.formatMetaDataToXML(rs));
   out.print("</xml>\n");
  }catch(Exception ex){
   out.println(request.getRequestURI()+"\n打开数据产生异常:\n"+ex.getMessage());
  }finally{
   pquery.closeConn();
  }
 %>
</xml>
<body leftmargin="0" topmargin="0">
<table border="0" bgcolor="#BBBBBB" width="100%">
<tr><td height="28" valign="middle">
<b>&nbsp;获取表信息(表名：<%=T_ID%>，表说明：<%=T_MS%>)</b></td>
<td align="right">
<input type="button" value="添加到字典" name="btAdd"
       onclick="autoInsert()" class="button">
<input type="button" value="关闭" name="btClose"
       onclick="javascript:window.close();" class="button">
</td>
</tr>
</table>
<table width="100%" border="1" cellpadding="0" cellspacing="0" id="DBGrid"
       bordercolor="#000000" bordercolorlight="#CCCCCC"
       bordercolordark="#FFFFFF" DATASRC=#dataset>
  <thead>
   <tr bgcolor="#8888AA" bordercolor="#8888AA" bordercolorlight="#999999">
    <td width="32" height="18">&nbsp;</td>
    <td width="120" align="center">字段名称</td>
    <td width="96" align="center">数据类型</td>
    <td width="40" align="center">宽度</td>
    <td width="64" align="center">可空</td>
    <td width="64" align="center">只读</td>
    <td width="120" align="center">标题</td>
    <td>&nbsp;</td>
   </tr>
  </thead>
  <tr onClick="doClick(this)" style="cursor:hand">
    <td>&nbsp;</td>
    <td width="120" height="18"><span DATAFLD="A"></span></td>
    <td width="96"><span DATAFLD="B"></span></td>
    <td width="40" align="right"><span DATAFLD="W"></span></td>
    <td width="64" align="center"><span DATAFLD="D"></span>&nbsp;</td>
    <td width="64"><span DATAFLD="R"></span>&nbsp;</td>
    <td width="120"><span DATAFLD="L"></span></td>
    <td>&nbsp;</td>
  </tr>
</table>
</body>
</html>

