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
<title>软件注册</title>
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
   if((att==0&&confirm("确定要删除所有业务数据吗?"))||
       (att==1&&confirm("确认要删除所有基础和业务数据吗?")))
    if(__xmlHttp.executeProc("ClearData",
	                         [att,""])==0){
      alert("数据删除操作成功.");
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
          <span class="glyphicon glyphicon-book"></span> 保 存</button>
          <button name="btDel" class="btn btn-primary btn-sm" id="btDel" onClick="doDel(0);">
          <span class="glyphicon glyphicon-remove-circle"></span> 删除业务数据</button>
          <button name="btDelAll" class="btn btn-primary btn-sm" id="btDelAll" onClick="doDel(1);">
          <span class="glyphicon glyphicon-remove-circle"></span> 删除所有数据</button>
          </td>
      </tr>
    </table>
    </div>
</td></tr>
<tr><td>
    <div style="padding:4px; border:1px solid #CCC; border-radius:5px" align="center">
<table width="500" border="0" cellpadding="0" cellspacing="1" bgcolor="#ffffff">
  <tr>
    <td width="120" height="40" align="right" class="fixedcell1">单位代码：</td>
    <td><input name="DW_CODE" type="text" class="form-control" id="DW_CODE" size="20"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">单位全称：</td>
    <td ><input name="DW_NAME1" type="text" class="form-control" id="DW_NAME1" size="50"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">单位简称：</td>
    <td ><input name="DW_NAME2" type="text" class="form-control" id="DW_NAME2"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">单位别名：</td>
    <td ><input name="DW_NAME3" type="text" class="form-control" id="DW_NAME3"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">所在地区：</td>
    <td ><input name="DW_DQ" type="text" class="form-control" id="DW_DQ"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">税　号：</td>
    <td ><input name="DW_SH" type="text" class="form-control" id="DW_SH" size="35"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">详细地址：</td>
    <td ><input name="DW_XXDZ" type="text" class="form-control" id="DW_XXDZ" size="50"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">联系电话：</td>
    <td ><input name="DW_LXDH" type="text" class="form-control" id="DW_LXDH" size="35"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">开户行：</td>
    <td ><input name="DW_KHH" type="text" class="form-control" id="DW_KHH" size="40"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">帐　号：</td>
    <td ><input name="DW_ZH" type="text" class="form-control" id="DW_ZH" size="40"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">邮政编码：</td>
    <td ><input name="DW_YZBM" type="text" class="form-control" id="DW_YZBM" size="10"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">区域代码：</td>
    <td ><input name="AREAID" type="text" class="form-control" id="AREAID" size="10"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">产品序列号：</td>
    <td ><input name="CERTIFICATE" type="text" class="form-control" id="CERTIFICATE" size="40"></td>
  </tr>
  <tr>
    <td height="40" align="right" class="fixedcell1">网站：</td>
    <td ><input name="HOMEPAGE" type="text" class="form-control" id="HOMEPAGE" size="40"></td>
  </tr>
</table>
   </div>
 </td></tr></table>
</body>
</html>

