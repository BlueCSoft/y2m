<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<jsp:useBean id="plimit" scope="page" class="bluec.base.CLogin"/>
<%
 request.setCharacterEncoding("GBK");
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
 if(plimit.checkLimit(request)<0){
  out.println(plimit.getLastError());
  return;
 }
%>

<!DOCTYPE html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<title>修改密码</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link rel="stylesheet" href="../theme/imobile.css">
<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>
<script src="../js/xmlhttp.js"></script>
<script src="../js/idataset.js"></script>
<script src="../js/datasource.js"></script>
<script src="../js/idbctrls.js"></script>
<script>

  var table,ds;
  
  function doLoad(){
  }
  
  function doChange(){ 
    if(npwdEdit.value!=npwdSure.value){
      alert("两次输入的新密码不一致.");
      return;
    }
   if(__xmlHttp.executeProc("ChangePwd",
      [<%=session.getAttribute("gUserId").toString()%>,opwdEdit.value,npwdEdit.value])==0){
     alert("密码修改成功.");
   }												    
  }   
</script>
</head>
<body onLoad="doLoad();">
<table width="100%" height="100%"  border="0" id="mainTable">
<tr><td height="40">
    <div style="height:40px; padding-top:4px">
    <table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td width="8">&nbsp;</td>
        <td align="center">
        <b>修改密码</b>  
        </td>
      </tr>
    </table>
    </div>
</td></tr>
<tr><td style="padding:16px">
<div style="padding:16px; border:1px solid #CCC; border-radius:5px" align="center">
<table width="100%" border="0" bgcolor="#ffffff">
  <tr>
    <td>&nbsp;</td>
    <td width="120" height="48" align="right" class="spanr">现 密 码：</td>
    <td width="200"><input type="password" class="form-control" id="opwdEdit" dataType="Require" placeholder="请输入现密码"></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>&nbsp;</td>
    <td height="48" align="right" class="spanr">新 密 码：</td>
    <td><input type="password" class="form-control" id="npwdEdit" dataType="Require" placeholder="请输入新密码"></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>&nbsp;</td>
    <td height="48" align="right" class="spanr">确认新密码：</td>
    <td><input type="password" class="form-control" id="npwdSure" dataType="Require" placeholder="请再次输入新密码"></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td height="48" align="center" class="spanr" colspan="4">
    <button name="btSave" class="btn btn-primary btn-sm" id="btSave" onClick="doChange();">
    <span class="glyphicon glyphicon-ok"></span> 确 定</button></td>
  </tr>
</table>
</div>
 </td></tr></table>
</body>
</html>

