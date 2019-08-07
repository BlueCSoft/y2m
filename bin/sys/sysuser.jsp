<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<jsp:useBean id="plimit" scope="page" class="bluec.base.CLogin"/>
<%
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
 if(plimit.checkLimitM(request)<0){
  out.println(plimit.getLastError());
  return;
 }
%>
 
<!DOCTYPE html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<title>操作员设置</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>

<script src="../js/xmlhttp.js"></script>
<script src="../js/idataset.js"></script>
<script src="../js/idbgrids.js"></script>
<script src="../js/idbctrls.js"></script>
<script src="../js/datasource.js"></script>
<script src="../js/db.js"></script>
<script>
<%
  out.print(plimit.createGlobal(request));
%>
  var table,ds,DBGrid,_ofind;
  
  function AfterInsert(dSet){
	  
	var code = dSet.getMaxValue("USER_CODE");
	code = (code=="")? "001":__FUN.__$IncString(code.substring(7),"001");
	
	dSet.$set("USER_CODE",code);
	
	dSet.$set("USER_PASSE",__FUN.RandomPwd());	
    dSet.$set("LR_ID",_global.gUserId);
	
    dSet.$set("LR_DATE",getServerDateTime());	
	dSet.$set("USERSTATE",1);	
	dSet.$set("MerchantId","<%=session.getAttribute("gxMerchantId").toString()%>");
  }
  
  function doLoad(){
   $("#divClient").css("height",document.documentElement.clientHeight-96); 
   table = new TTable("PUB_USER","#PUB_USER",["<%=session.getAttribute("gxMerchantId").toString()%>",""]);
   
   table.SeqName = "OBJID";
   table.SeqFieldName = "USER_ID";
   
   table.indexDefs.addIndex("index1",["USER_CODE"],1,"人员代码不能够重复."); 
   
   table.AfterInsert = AfterInsert;
   
   ds = new TDataSource();
   
   table.addDataSource(ds); 
   
   DBGrid.setDataSource(ds);   
   DBGrid.paint();  
   
   ds.addObject(new TDBEdit(USER_CODE,"USER_CODE",true));
   ds.addObject(new TDBEdit(USER_NAME,"USER_NAME"));
   ds.addObject(new TDBEdit(LOGIN_ID,"LOGIN_ID"));
   ds.addObject(new TDBEdit(USER_PASSE,"USER_PASSE"));
   ds.addObject(new TDBRadio([SEX1,SEX2],"XB"));
   
   ds.addObject(new TDBEdit(IDCARD,"IDCARD"));

   //doQuery();
 }
 
 function doQuery(att){
   table.getDataFromServer("#PUB_USER",[""]);
 }

 function _$Dialog(isNew){
	 if(isNew) table.insert();
     $("#dialogModal").modal({ keyboard: true  });
 }
 
 function doEdit(isNew){
   _$Dialog(isNew||table.isEmpty());
 }
 
 function doQx(){
   var url = "sysuserqx.aspx?uid="+table.$("USER_ID");
   _$Dialog(url,window,476,400);
 }
  
 function checkLoginIdExists(){
   if(!table.isEmpty()&&table.$("LOGIN_ID")!=""){
	 __$Query.Query("SYSCheckLoginIdExists",[table.$("USER_ID"),table.$("LOGIN_ID")]);    
	 if(!__$Query.isEmpty){
	   LoginIdInfo.innerHTML = "登录账号已经存在.";	
	   return false; 
	 }
   }
   LoginIdInfo.innerHTML = "&nbsp;";
   return true;
 }

</script>
</head>
<body onLoad="doLoad();">
<div style="padding-left:4px; padding-right:4px">
    <div style="height:40px; padding-top:4px; padding-left:4px">
<button name="btIns" class="btn btn-primary btn-sm" id="btIns" onClick="doEdit(true);">
 <span class="glyphicon glyphicon-plus-sign"></span> 新 增</button>
        <button name="btEdit" class="btn btn-primary btn-sm" id="btEdit" onClick="doEdit(false);" >
        <span class="glyphicon glyphicon-edit"></span> 修 改</button>
        <button name="btDel" class="btn btn-primary btn-sm" onClick="table.DeleteHint();">
        <span class="glyphicon glyphicon-remove-circle"></span> 删 除</button>
<button name="btQx" class="btn btn-primary btn-sm" id="btQx" onClick="doQx();">
<span class="glyphicon glyphicon-plus-sign"></span> 设置权限</button>
<button name="btSave" class="btn btn-primary btn-sm" onClick="table.applyUpdate('');">
<span class="glyphicon glyphicon-ok"></span> 保 存</button>
    </div>
    <div style="padding-left:4px;padding-right:4px;padding-bottom:4px;height:520px;" id="divClient">
     <div id="grid" style="overflow:hidden;border:1px solid #cccccc;height:100%;width:100%;position:relative;border-radius:2px">
		<script>
  DBGrid = new TDBGrid(grid,"grid");
  DBGrid.readOnly = true;
  DBGrid.items.addEx({fieldName:"USER_CODE",width:100,alignment:taCenter});
  DBGrid.items.addEx({fieldName:"USER_NAME",width:100});
  DBGrid.items.addEx({fieldName:"LOGIN_ID",width:120,alignment:taCenter});
  DBGrid.items.addEx({fieldName:"USER_PASSE",width:200,buttonStyle:cbsPassWord});  
  DBGrid.items.addEx({fieldName:"XB",width:48,alignment:taCenter});  
  DBGrid.items.addEx({fieldName:"BORN",width:88,alignment:taCenter});    
  DBGrid.items.addEx({fieldName:"IDCARD",width:144,alignment:taCenter});    
  DBGrid.createGrid();
		</script>
        </div>
      </div>
</div>
<div class="modal fade" id="dialogModal" tabindex="-1" role="dialog" aria-labelledby="dialogModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="width:480px">
        <div class="modal-content">
            <div class="modal-header">
                <button class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title" id="dialogModalLabel">人员信息编辑</h4>
            </div>
            <div class="modal-body">
            <table width="100%" height="100%" border="0" cellpadding="2" cellspacing="8" bordercolor="#dddddd">
            <tr>
              <td width="128" height="40" align="right" >操作员编号：</td>
              <td width="200"><input name="USER_CODE" type="text" id="USER_CODE" class="form-control"></td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td height="40" align="right">操作员姓名：</td>
              <td><input name="USER_NAME" type="text" id="USER_NAME" class="form-control"></td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td height="40" align="right">登录账号：</td>
              <td><input name="LOGIN_ID" type="text" id="LOGIN_ID" onBlur="checkLoginIdExists();" class="form-control">
              </td>
              <td id="LoginIdInfo" style="color:#F00">&nbsp;</td>
            </tr>
            <tr>
              <td height="40" align="right">登录密码：</td>
              <td><input name="USER_PASSE" type="text" id="USER_PASSE" class="form-control">
               </td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td height="40" align="right">性　别：</td>
              <td><table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="16"><input type="radio" name="radio" id="SEX1" value="男" class="radio"></td>
                  <td width="32" onClick="SEX1.click()">男</td>
                  <td width="16"><input type="radio" name="radio" id="SEX2" value="女" class="radio"></td>
                  <td width="32" onClick="SEX2.click()">女</td>
                </tr>
              </table></td>
              <td>&nbsp;</td>
              </tr>
            <tr>
              <td height="40" align="right" style="color:#000">身份证号：</td>
              <td><input name="IDCARD" type="text" class="form-control" style="width:240px;" id="IDCARD"></td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td height="40">&nbsp;</td>
              <td id="LoginIdInfo">&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            </table>
            </div>
            <div class="modal-footer">
                <button class="btn btn-default" data-dismiss="modal">关闭</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>
</body>
</html>

