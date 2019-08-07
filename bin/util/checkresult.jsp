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
  window.returnValue = [0,""];
  function doPass(att){
   switch(att){
     case -1:if(sresult.value==""){
	           sresult.value=="审批驳回";
	           //alert("请输入审批结果，说明驳回原因.");
			   //return;
			  }
              window.returnValue = [-1,sresult.value];			  
			  break;
	 case 2: window.returnValue = [2,sresult.value];		   
	          break;
   }
   window.close();
  }
</script>
</head>
<body leftmargin="3" topmargin="2" bgcolor="#E1E1E1">
<center>
<br>
<span style="font-size:14px;color:#0000AA;">&nbsp;<b>审批说明</b><br>
<br></span>
<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
   <td><textarea id="sresult" name="sresult" style="width:550px;" rows="16"></textarea></td>
  </tr>
</table>
<br>
  <input name="btOk" type="button" style="font-weight:bold" class="button_b4" value="通  过" onClick="doPass(2);">
  <input name="btReturn" type="button" style="color:#FF0000; font-weight:bold" class="button_b4" value="通不过" onClick="doPass(-1);">
  <input name="btCancel" type="button" class="button_b4" 
         value="取  消" onClick="doPass(0);">
</center>
</body>
</html>

