<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%
 request.setCharacterEncoding("gb2312");
 response.addHeader("Pragma", "no-cache");
 response.addHeader("Cache-Control", "no-store");
%>
<html>
<head>
<title>审批说明</title>
<link href="../theme/neiye.css" rel="stylesheet" type="text/css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">
<style>
<!--
 td           { font-size: 12px }
 -->
</style>
<script>
  window.returnValue = 0;
</script>
</head>
<body leftmargin="3" topmargin="2" bgcolor="#E1E1E1">
<center>
<br>
<table width="400" height="280" border="0" cellspacing="0" cellpadding="0">
  <tr>
   <td height="80"></td><td></td>
  </tr>
</table>
<br>
  <input name="btOk" type="button" class="button_b4" value="确 定" onClick="doPass(2);">
  &nbsp;
  <input name="btCancel" type="button" class="button_b4" 
         value="取  消" onClick="doPass(0);">
</center>
</body>
</html>

