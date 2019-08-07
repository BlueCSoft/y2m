<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*,bluec.base.*"%>
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
<title>操作员设置</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">
<script src="../theme/const.js"></script>

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>

<script src="../js/xmlhttp.js"></script>
<script src="../js/idataset.js?version=12"></script>
<script src="../js/idbgrids.js"></script>
<script src="../js/treeview.js"></script>
<script src="../js/datasource.js"></script>
<script src="../js/db.js"></script>
<script src="../js/qrgrids.js"></script>

<script src="../js/laydate/laydate.js"></script>

<script>
 
  var table,ds,DBGrid,tree,tabldg;
  
  function AfterInsert(dSet){
    dSet.$set("PSID",tree.getID());
    var code = dSet.getMaxValue("USERCODE");
	if(code != ""){
	  code = code.substring(0,code.length-2)+__FUN.__$IncString(__FUN.RightStr(code,2),"01");
	}
    dSet.$set("USERCODE",code);
  }
   
  function OnTreeSelect(node){
    table.getDataFromServer("PUB_USER",[node.getID()]);
  }
  
  function doLoad(){
    __VCL.autoAdjust("#divClient",["#toolpanel"]);
   
    tree = new TTreeView(treediv);
    tree.OnTreeSelect = OnTreeSelect;

    QrGrid.boundQuery(__$Query,false);
    __$Query.Query("dir_getrole",[]);

    tabler = new TTable("SYS_USERROLE","",[0],{},function(dSet){__$Query.initSelectedWith(dSet.$s("SID"));});
    tabler.setLogFields(["OUSERID","LASTUPTIME"],[<%=plimit.sessionAttr("gUserId")%>,"SYSDATE"]);
	
    table = new TTable("PUB_USER","",[0],{SeqName:"SQ_USERID",SeqFieldName:"USERID"});
	table.setDefaultFields(["STATUS","USER_PASS"],[1,"21218CCA77804D2BA1922C33E0151105"]);
    table.setLogFields(["OUSERID","LASTUPTIME"],[<%=plimit.sessionAttr("gUserId")%>,"SYSDATE"]);
        
    table.AfterInsert = AfterInsert;
	table.BeforePost = function(dSet){
      if(!table.isEmpty()){
	    if(table.$("TEL")!=""&&!__FUN.isPhhoneAvailable(table.$("TEL"))){
		  alert(table.fieldByName["TEL"].displayLabel+table.fieldByName["TEL"].errorMsg);
		  return false;
		}
		if(table.$("USER_ACCOUNT")!=""||table.$("TEL")!=""){
	      if(__xmlHttp.executeProc("CheckAccountExists",[table.$("USERID"),table.$("USER_ACCOUNT"),table.$("TEL")])!=0)
	        return false;
	    }
      }
      return true;
    }
  
    DBGrid.setDataSource(table.addDataSource(new TDataSource()));   
    DBGrid.paint();  
	
	tabler.setMasterDataSet(table,"USERID","SYS_USERROLE",true);
  }
 
  function doGroup(){
	if(!table.isEmpty()){ 
	  titleCaption.innerText = table.$("USERNAME");  
      __VCL.showDialog("dialogModal","dialogBody",400,400);
	}
  }
  
  function doOk(autosave){
    tabler.DeleteAll();
    values = __$Query.SelectedKey;
     for(x=0;x<values.length;x++){
	   tabler.appendRecord([table.$("USERID"),values[x]]);  
    }
   
    if(table.applyUpdate()>=0&&!autosave){
	  __VCL.closeDialog('dialogModal'); 
    }
  }

</script>
</head>
<body onLoad="doLoad();">
<div style="padding-left:4px; padding-right:4px">
<div id="toolpanel" style="height:40px; padding-top:4px; padding-left:4px">
<table width="100%" height="100%"  border="0" id="mainTable">
<tr><td>
          <button name="btIns" class="btn btn-primary btn-sm" id="btIns" onClick="table.insert();">
          <span class="glyphicon glyphicon-plus-sign"></span> 增 加</button>
          <button name="btDel" class="btn btn-primary btn-sm" onClick="table.DeleteHint();">
          <span class="glyphicon glyphicon-remove-circle"></span> 删 除</button>
          <button name="btSave" class="btn btn-primary btn-sm" onClick="doGroup()">
          <span class="glyphicon glyphicon-user"></span> 用户组</button>
          
          <button name="btSave" class="btn btn-primary btn-sm" onClick="table.applyUpdate('');">
          <span class="glyphicon glyphicon-book"></span> 保 存</button>
</td></tr>
</table>
</div>
<div style="padding-left:4px;padding-right:4px;padding-bottom:4px;height:420px;" id="divClient">
 	 <table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
      <tr valign="top">
        <td width="320">
         <div id="treediv" style="overflow:auto;border:1px solid #ccc;width:100%; height:100%;border-radius:3px"><span><span><img 
         align="absmiddle"><img align="absmiddle"><input type="hidden" 
         value="1"></span><span></span><span 
         style='padding:1px 1px 1px 1px;cursor:hand;font-size:12px;'>管理员</span><input type='hidden' 
         value='0'><input type='hidden' value='0'></span><br><div style='display:;margin-left:0pt'><%
  try{
    out.print(new CLexIcon().getTreeViewInfoEx("#BASE_STORE_TREE","",1,0,0,0,"images/",session));
  }catch(Exception ex){
    out.print("构造树型结构产生异常:\n"+ex.getMessage());
  }
%></div></div></td>
        <td width="3"></td>
        <td>
      <div id="grid" style="overflow:hidden;border:1px solid #ccc;height:100%;width:100%;border-radius:3px;position:relative">
		<script>
  DBGrid = new TDBGrid(grid,"grid",32);
  DBGrid.addColumn({fieldName:"USERCODE",width:88,alignment:taCenter});
  DBGrid.addColumn({fieldName:"USERNAME",width:120});
  DBGrid.addColumn({fieldName:"USER_ACCOUNT",width:120});
  DBGrid.addColumn({fieldName:"SEX",width:56,alignment:taCenter,pickListNo:[1,2],pickListName:["男","女"],buttonStyle:cbsSelect});
  DBGrid.addColumn({fieldName:"TEL",width:120,alignment:taCenter});
  DBGrid.addColumn({fieldName:"WDATE",width:120,alignment:taCenter,buttonStyle:cbsDate});
  DBGrid.addColumn({fieldName:"STATUS",width:88, checkBox:true}); 
  DBGrid.createGrid();
		</script>
   </div>
		</td>
      </tr>
     </table>
   </div>
</div>

<div id="dialogModal" class="dialogWindow" style="visibility:hidden;">
  <div class="dialogMarkLayer"></div>
  <div class="dialogBody" style="width:400px;height:400px;" id="dialogBody">
  <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" class="">
  <tr><td height="32">
  <div class="dialogTitle">
    设置操作员用户组(<span id="titleCaption"></span>)
    <span class="glyphicon glyphicon-remove-circle" style="float:right; cursor:pointer" onClick="__VCL.closeDialog('dialogModal');"></span>
  </div>
  </td></tr>
  <tr><td>
  <div style="border:0px solid #000;overflow:hidden;width:100%;height:100%;position:relative; background-color:#fff">
  <script>	  
    QrGrid = new TQRGrid({widthMatchParent:false});
    QrGrid.setPropertys({name:"QRGrid",crossShowRow:false,useSelected:true,userActiceRow:false,KeyField:"SID",SelectdField:"ISNEW"});
    QrGrid.addEx({Caption:"用户组",FieldName:"SNAME",Width:0});
    QrGrid.CreateGrid(true);  //不显示表格线
  </script>     
  </div>
  </td></tr>
  <tr><td height="48" style="background-color:#FFF">
  <div style="height:100%; width:100%; border-top:1px solid #CCC;text-align:right; padding:5px; padding-right:24px">
  <button name="btOk" class="btn btn-warning btn-sm"  onClick="__VCL.closeDialog('dialogModal');">
      <span class="glyphicon glyphicon-ban-circle"></span> 取 消</button>&nbsp;&nbsp;&nbsp;
  <button name="btOk" class="btn btn-primary btn-sm"  onClick="doOk(false)">
      <span class="glyphicon glyphicon-ok"></span> 确 定</button>
  </div>
  </td></tr></table>
  </div>
</div>
</body>
</html>