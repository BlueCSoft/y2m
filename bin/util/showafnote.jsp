<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%
 request.setCharacterEncoding("gb2312");
 response.addHeader("Pragma", "no-cache");
 response.addHeader("Cache-Control", "no-store");
%>
<html>
<head>
<title>��ʾ˵��</title>
<link href="../theme/neiye.css" rel="stylesheet" type="text/css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">
<script>
 window.returnValue = false;
 function doOk(){
  window.returnValue = true;
  window.close();
 }
</script>
</head>
<jsp:useBean id="pquery" scope="page" class="bluec.base.CQuery"/>
<body leftmargin="16" topmargin="16" rightmargin="16" bottommargin="16" bgcolor="#DDDDDD">
<center>
<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td style=" font-size:14px;padding:8px 8px 8px 8px;height:180px; border:1px solid #999999; background:#EEEEEE" valign="top">
<%
  String fileid = request.getParameter("fileid").toString();
  try{
   pquery.queryBySql("select note from pub_files where id=%s",fileid,session);
   pquery.next();
   out.print(pquery.getNote("note"));
  }catch(Exception ex){
   out.println(request.getRequestURI()+"\n�����ݲ����쳣:\n"+ex.getMessage());
   return;
  }finally{
   pquery.closeConn();
  }   
%> 
  </td>
  </tr>
  <tr><td height="2"></td></tr>
  <tr>
  <td style="font-size:12px;padding:8px 8px 8px 8px;height:40px; font-weight:bold;color:#FF0000;border:1px solid #999999;background:#EEEEEE" valign="top">
  ˵�����������Ķ��������ݸ��ӵ�˵����Ȼ���ٰ�ȷ�ϰ�ť�򿪲������ݡ�
  </td>
  </tr>
  <tr>
  <td height="40" align="center">
    <input name="btOk" type="button" style="font-weight:bold" class="button_b4" value="ȷ ��" onClick="doOk();">
    <input name="btCancel" type="button" style="font-weight:bold" class="button_b4" value="ȡ ��" onClick="window.close();">
  </td>
  </tr>
</table>
</center>
</body>
</html>

