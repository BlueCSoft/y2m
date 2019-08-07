<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*,bluec.base.*"%>
<%
 request.setCharacterEncoding("GBK");
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
%>
<head>

<title>²éÑ¯·ÖÎöÆ÷</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">
</head>
<body scroll="no">
<form name="execform" action="sqlexec2.jsp" method="POST" target="dData" style="height:100%">
<table border="0" cellpadding="0" cellspacing="0"  width="100%" height="100%">
 <tr>
   <td height="24" style="padding:4px">
     <input type="submit" name="btExec" value="Ö´ ÐÐ" class="button_3">
   </td>  
 </tr>
 <tr>
  <td align="left" height="150px" style="padding:4px">
   <textarea name="sql" style="width:100%;height:100%" class="form-control"></textarea>
  </td>
 </tr>
 <tr>
  <td style="padding:4px;">
   <iframe name="dData" style="border:1px solid #999;width:100%;height:100%" noresize frameborder="0">
   </iframe>
  </td>
 </tr>
</table>
</form>
</body>
</html>

