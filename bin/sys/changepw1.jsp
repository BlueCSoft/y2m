<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<jsp:useBean id="pLogin" scope="page" class="bluec.base.CLogin"/>
<%
 request.setCharacterEncoding("GBK");
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0"); 
 response.addHeader("Pragma", "public"); 
%>


<html>

<head>
<title>修改密码</title>
<link href="../theme/neiye.css" rel="stylesheet" type="text/css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">

<script src="../theme/const.js"></script>
<script src="../js/xmlhttp.js"></script>
<script src="../js/stand.js"></script>
<script>
  function doLoad(){
  }
  
  function doChange(){ 
   if(form1.npwdEdit.value!=form1.npwdSure.value){
    alert("两次输入的新密码不一致.");
    return;
   }
   if(__xmlHttp.executeProc("ChangePassword",
    ["<%=session.getAttribute("gDwCode").toString()%>",
	 <%=session.getAttribute("gUserId").toString()%>,
	 form1.opwdEdit.value,form1.npwdEdit.value])==0){
    alert("密码修改成功.");
	window.close();
   }												    
  }
  
</script>
</head>

<jsp:useBean id="pquery" scope="page" class="bluec.base.CLexIcon"/>
<body bgcolor="#EBE9E3" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" onLoad="doLoad();" scroll="no">
<form name="form1" method="post" action="" target="frame1">
<CENTER>
<table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabletop">
  <tr>
    <td height="20">
	  <table width="100%" border="0" cellpadding="0" cellspacing="0" class="tdmenutop">
        <tr> 
          <td bgcolor="#018cd1" width="40" style="padding:0px 0px 0px 6px;color:#FFFFFF; font-size:12px">
		  <nobr>修改当前操作员的密码</nobr></td>
		  <td width="34"><img src="../images/AddInfoMainTitle.jpg" border="0"></td>		
		  <td>&nbsp;</td>  		  
		  <td width="80" align="right"><input name="btClose" type="button" class="button_6" id="btClose" onClick="closePage();" value="&times;"></td>
        </tr>
      </table>
	</td>
  </tr>
  
<tr><td valign="top" style="padding:2px 2px 2px 2px">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td width="100" height="32" align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td height="32" align="right">旧 密 码：</td>
      <td><input type="password" class="textinput" id="opwdEdit" dataType="Require" placeholder="请输入旧密码"></td>
    </tr>
    <tr>
      <td height="32" align="right">新 密 码：</td>
      <td><input name="npwdEdit" type="password" class="textinput" id="npwdEdit" size="28" dataType="Require" placeholder="请输入新密码"></td>
    </tr>
    <tr>
      <td height="32" align="right">确认新密码：</td>
      <td><input name="npwdSure" type="password" class="textinput" id="npwdSure" size="28" dataType="Repeat" placeholder="两次输入新密码"></td>
    </tr>
    
    <tr>
		<td height="32" align="right">&nbsp;</td>    
		<td height="32" align="right">&nbsp;</td>
	</tr>
	
    <tr>
      <td height="24" align="right">&nbsp;</td>
      <td><input name="btOk" type="button" class="button_b3" id="btOk"
		  onClick="doChange();" value="确 定"></td>
    </tr>
    
  </table>
</td>
</tr>

<iframe name="frame1" id="frame1"  width="100%" height="100%" frameborder="0" scrolling ="no" >
	<table width="100%" height="100%" border="1" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabletop">
		<tr><td height="100%" valign="top">&nbsp;&nbsp;</td></tr>
	</table>
</iframe>

</table>
<input type="hidden" name="act">

</center>
</form>


</body>
</html>

