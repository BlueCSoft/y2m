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
<title>�޸�����</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<meta name="viewport" content="initial-scale=1">
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link rel="stylesheet" href="../theme/page.css">
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
    if(opwdEdit.value == ""){
      alert("������ԭ����");
      return;
    }

    if(npwdEdit.value == ""){
      alert("������������");
      return;
    }
	
    if(npwdEdit.value != npwdSure.value){
      alert("��������������벻һ��.");
      return;
    }
   if(__xmlHttp.callPage("changeuserpwd.jsp","userid=<%=plimit.sessionAttr("gUserId")%>&oldpwd="+
                          opwdEdit.value+"&newpwd="+npwdEdit.value)){
     alert("�����޸ĳɹ�.");
   }												    
  }   
</script>
</head>
<body onLoad="doLoad();">
<table width="100%" height="100%"  border="0" id="mainTable">
<tr><td height="40">
    <div style="height:40px; padding-top:12px">
    <table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td width="8">&nbsp;</td>
        <td align="center">
        <span style="font-size:16px; font-weight:bold">�޸�����</span>  
        </td>
      </tr>
    </table>
    </div>
</td></tr>
<tr><td style="padding:16px" align="center">
<div style="padding:16px; border:1px solid #CCC; border-radius:5px; max-width:640px">
<table width="100%" border="0" bgcolor="#ffffff">
  <tr>
    <td>&nbsp;</td>
    <td width="100" height="48" align="right" class="spanr">ԭ �� �룺</td>
    <td width="200"><input type="password" class="form-control" id="opwdEdit" dataType="Require" placeholder="������ԭ����"></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>&nbsp;</td>
    <td height="48" align="right" class="spanr">�� �� �룺</td>
    <td><input type="password" class="form-control" id="npwdEdit" dataType="Require" placeholder="������������"></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>&nbsp;</td>
    <td height="48" align="right" class="spanr">ȷ�������룺</td>
    <td><input type="password" class="form-control" id="npwdSure" dataType="Require" placeholder="���ٴ�����������"></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td height="48" align="center" class="spanr" colspan="4">
    <button name="btSave" class="btn btn-primary btn-sm" id="btSave" onClick="doChange();">
    <span class="glyphicon glyphicon-ok"></span> &nbsp;ȷ ��&nbsp;&nbsp;</button></td>
  </tr>
</table>
</div>
 </td></tr></table>
</body>
</html>

