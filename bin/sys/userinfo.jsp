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
<title>���ע��</title>
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

   table = new TTable("PUB_UNIT","#PUB_UNIT",[""]);
   
   ds = new TDataSource();
   table.addDataSource(ds); 

   ds.addObject(new TDBEdit(DW_CODE,"DW_CODE"));

   ds.addObject(new TDBEdit(DW_NAME1,"DW_NAME1"));
   ds.addObject(new TDBEdit(DW_NAME2,"DW_NAME2"));
   ds.addObject(new TDBEdit(DW_NAME3,"DW_NAME3"));

   ds.addObject(new TDBEdit(DW_DQ,"DW_DQ"));
   ds.addObject(new TDBEdit(DW_SH,"DW_SH"));
   ds.addObject(new TDBEdit(DW_XXDZ,"DW_XXDZ"));
   ds.addObject(new TDBEdit(DW_LXDH,"DW_LXDH"));
   ds.addObject(new TDBEdit(DW_KHH,"DW_KHH"));
   ds.addObject(new TDBEdit(DW_ZH,"DW_ZH"));
   ds.addObject(new TDBEdit(DW_YZBM,"DW_YZBM"));
   ds.addObject(new TDBEdit(AREAID,"AREAID"));
   ds.addObject(new TDBEdit(CERTIFICATE,"CERTIFICATE"));  
   ds.addObject(new TDBEdit(HOMEPAGE,"HOMEPAGE")); 

  }
  
  function doDel(att){
   if((att==0&&confirm("ȷ��Ҫɾ������ҵ��������?"))||
       (att==1&&confirm("ȷ��Ҫɾ�����л�����ҵ��������?")))
    if(__xmlHttp.executeProc("ClearData",
	                         [att,""])==0){
      alert("����ɾ�������ɹ�.");
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
        <td align="left" valign="middle">
          <button name="btSave" class="btn btn-primary btn-sm" id="btSave" onClick="table.applyUpdate('');">
          <span class="glyphicon glyphicon-book"></span> �� ��</button>
          <button name="btDel" class="btn btn-primary btn-sm" id="btDel" onClick="doDel(0);">
          <span class="glyphicon glyphicon-remove-circle"></span> ɾ��ҵ������</button>
          <button name="btDelAll" class="btn btn-primary btn-sm" id="btDelAll" onClick="doDel(1);">
          <span class="glyphicon glyphicon-remove-circle"></span> ɾ����������</button>
          </td>
      </tr>
    </table>
    </div>
</td></tr>
<tr><td>
    <div style="padding:4px; border:1px solid #CCC; border-radius:5px" align="center">
<table width="500" border="0" cellpadding="0" cellspacing="1" bgcolor="#ffffff">
  <tr>
    <td width="120" height="40" align="right" class="fixedcell1">��λ���룺</td>
    <td><input name="DW_CODE" type="text" class="form-control" id="DW_CODE" size="20"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">��λȫ�ƣ�</td>
    <td ><input name="DW_NAME1" type="text" class="form-control" id="DW_NAME1" size="50"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">��λ��ƣ�</td>
    <td ><input name="DW_NAME2" type="text" class="form-control" id="DW_NAME2"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">��λ������</td>
    <td ><input name="DW_NAME3" type="text" class="form-control" id="DW_NAME3"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">���ڵ�����</td>
    <td ><input name="DW_DQ" type="text" class="form-control" id="DW_DQ"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">˰���ţ�</td>
    <td ><input name="DW_SH" type="text" class="form-control" id="DW_SH" size="35"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">��ϸ��ַ��</td>
    <td ><input name="DW_XXDZ" type="text" class="form-control" id="DW_XXDZ" size="50"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">��ϵ�绰��</td>
    <td ><input name="DW_LXDH" type="text" class="form-control" id="DW_LXDH" size="35"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">�����У�</td>
    <td ><input name="DW_KHH" type="text" class="form-control" id="DW_KHH" size="40"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">�ʡ��ţ�</td>
    <td ><input name="DW_ZH" type="text" class="form-control" id="DW_ZH" size="40"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">�������룺</td>
    <td ><input name="DW_YZBM" type="text" class="form-control" id="DW_YZBM" size="10"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">������룺</td>
    <td ><input name="AREAID" type="text" class="form-control" id="AREAID" size="10"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">��Ʒ���кţ�</td>
    <td ><input name="CERTIFICATE" type="text" class="form-control" id="CERTIFICATE" size="40"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">��վ��</td>
    <td ><input name="HOMEPAGE" type="text" class="form-control" id="HOMEPAGE" size="40"></td>
  </tr>
</table>
   </div>
 </td></tr></table>
</body>
</html>

