<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>

<jsp:useBean id="plimit" scope="page" class="bluec.base.CLogin"/>
<%
 request.setCharacterEncoding("GBK");
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
/* if(plimit.checkLimit(request)<0){
  out.println(plimit.getLastError());
  return;
 }*/
%>
<!DOCTYPE html>

<head>
<title>执行SQL语句管理</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link href="../theme/page.css?version=18" rel="stylesheet" type="text/css">

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>

<script src="../js/xmlhttp.js?version=18"></script>
<script src="../js/idataset.js"></script>
<script src="../js/idbgrids.js?version=12"></script>
<script src="../js/idbctrls.js"></script>
<script src="../js/datasource.js"></script>

<script>
  var table,ds,DBGrid,tabled,DBGridd;

  function AfterInsert(dSet){
    table.setFieldValue("SQL_TYPE","");
    table.setFieldValue("GTAG",4);
	table.setFieldValue("ATT",0);	
  }
  
  function doLoad(){
	$("#divClient").css("height",document.documentElement.clientHeight-56); 
	$("#dialogModal").css("height",document.documentElement.clientHeight); 
    table = new TTable("SYS_PROCS","#SYS_PROCS",[""]);
    table.noDataHint = false;
      
    table.fieldByName["SQL_PARAM"].rightTrim = false;  
    table.fieldByName["SQL_PDTYPE"].rightTrim = false;
    table.fieldByName["SQL_PFROM"].rightTrim = false;
    table.fieldByName["SQL_SESSION"].rightTrim = false;
   
    table.AfterInsert = AfterInsert;
    
    ds = new TDataSource();

    table.addDataSource(ds);
    ds.addObject(new TDBEdit(sqlEdit,"SQL_SERVER"));     
    DBGrid.setDataSource(ds);
    DBGrid.paint(); 
	
    tabled = new TTable("SYS_PROCS_PARAM","#SYS_PROCS_PARAM",[""]);	
	tabled.AfterInsert = function(dSet){
      dSet.$set("SQL_PDTYPE",1);
      dSet.$set("SQL_PFROM",1);
      dSet.$set("SQL_INOUT",1);   
    }
   
    tabled.BeforePost = function(dSet){
      var pf = dSet.$("SQL_PFROM");
      if((pf=="1"||pf=="2")&&dSet.$("SQL_SESSION")==""){
        alert("当数据来源于字段时，必须输入字段名.");
	    return false;
      }
      if((pf=="4")&&dSet.$("SQL_SESSION")==""){
        alert("当数据来源于session时，必须输入session变量名.");
	    return false;
      }
      return true;
    }

	DBGridd.setDataSource(tabled.addDataSource(new TDataSource()));
  }
  
  function callParam(){
	titleCaption.innerText = table.$("SQL_DS");  
    __VCL.showDialog("dialogModal","dialogBody",680,480);
	DBGridd.paint();
	tabled.emptyDataset();   
	var pMs = table.$("SQL_PARAM");
    var pDy = table.$("SQL_PDTYPE");
    var pDf = table.$("SQL_PFROM");    
    var pSs = table.$("SQL_SESSION");      
    var pIo = table.$("SQL_INOUT");        
 
    if(pDy != ""){
      var aMs = pMs.split("/");
      var aDy = pDy.split("/");
      var aDf = pDf.split("/");
      var aSs = pSs.split("/");   
      var aIo = pIo.split("/");   
      for(var i=0;i<aMs.length;i++){
        tabled.insert();
        tabled.$set("SQL_PARAM",aMs[i]);
        tabled.$set("SQL_PDTYPE",aDy[i]);
        tabled.$set("SQL_PFROM",aDf[i]);
        tabled.$set("SQL_SESSION",aSs[i]);	
        tabled.$set("SQL_INOUT",aIo[i]);		
        tabled.post();
      } 
    }
  }
  
 function doOk(){ 
   var pMs = "",pDy = "",pDf = "",pSs="",pIo="",ds="", n=1, pp = "";     
   
   tabled.first();
   
   while(n<=tabled.getRecordCount()){
     pMs = pMs+ds+tabled.$("SQL_PARAM");
     pDy = pDy+ds+tabled.$("SQL_PDTYPE");
     pDf = pDf+ds+tabled.$("SQL_PFROM");	
	
   	 pp = table.$("SQL_SESSION");
	 if(pp=="")
 	   pSs = pSs+ds+" ";		
	 else
       pSs = pSs+ds+table.$("SQL_SESSION");		

     pIo = pIo+ds+table.$("SQL_INOUT");			
	 ds = "/";	
	 n++;
	 tabled.next();
   }	
   
   table.$set("SQL_PARAM",pMs);
   table.$set("SQL_PDTYPE",pDy);
   table.$set("SQL_PFROM",pDf);
   table.$set("SQL_SESSION",pSs);   
   table.$set("SQL_INOUT",pIo);      
   table.post();
   
   if(table.applyUpdate()>=0){
	 __VCL.closeDialog('dialogModal');  
   }
 }
</script>
</head>

<body onLoad="doLoad();">
<table width="100%" height="100%"  border="0" id="mainTable">
<tr><td height="40">
    <div style="height:40px; padding-top:4px; padding-left:4px">
      <button name="btIns" class="btn btn-primary btn-sm" id="btIns" onClick="table.insert();">
      <span class="glyphicon glyphicon-plus-sign"></span> 增 加</button>
      <button name="btDel" class="btn btn-primary btn-sm" onClick="table.DeleteHint();">
      <span class="glyphicon glyphicon-remove-circle"></span> 删 除</button>
      <button name="btParam" class="btn btn-primary btn-sm" onClick="callParam();">
      <span class="glyphicon glyphicon-list-alt"></span> 参数说明</button>
      <button name="btSave" class="btn btn-primary btn-sm"  onClick="table.applyUpdate('');">
      <span class="glyphicon glyphicon-book"></span> 保 存</button>
     </div>
</td></tr>
<tr><td>
    <div style="padding-left:4px;padding-right:4px;padding-bottom:4px;" id="divClient">
    <table border="0" width="100%" height="100%">
    <tr><td width="900">
<div style=" border:1px solid #CCC;overflow:hidden;left:0px;top:0px;width:100%;height:100%; position:relative;border-radius:5px" id="grid">
<script>
   DBGrid = new TDBGrid(grid,"grid");
   DBGrid.useActiveProperty = true;
   DBGrid.items.addEx({fieldName:"SQL_ID",width:240}).title.caption = "标识";
   DBGrid.items.addEx({fieldName:"SQL_DS",width:240}).title.caption = "说明";
   DBGrid.items.addEx({fieldName:"GTAG",width:72,buttonStyle:cbsSelect,alignment:taLeft}).title.caption = "类型";   
   
   DBGrid.columns[2].pickListNo = [4,5];
   DBGrid.columns[2].pickListName = ["存储过程","SQL语句"];

   DBGrid.items.addEx({fieldName:"SQLATT",width:88,checkBox:true}).title.caption = "允许空执行";   
   DBGrid.items.addEx({fieldName:"AEXEC",width:96,checkBox:true}).title.caption = "忽略字段变化";      
  
   DBGrid.items.addEx({fieldName:"SQL_TYPE",width:110}).title.caption = "分类";
   DBGrid.columns[1].font.color = "navy";   
   DBGrid.createGrid();   
</script>
</div>
    </td><td valign="top"> 
<div style="padding-top:0px;height:100%;position:relative">
<textarea style="width:100%;height:100%" class="form-control" id="sqlEdit"></textarea>
</div>
     </td></tr></table>
</div>
</td></tr></table>
<div id="dialogModal" class="dialogWindow" style="display:none;">
  <div class="dialogMarkLayer"></div>
  <div class="dialogBody" style="width:680px;height:480px;" id="dialogBody">
  <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" class="">
  <tr><td height="32">
  <div class="dialogTitle">
    设置参数(<span id="titleCaption"></span>)
    <span class="glyphicon glyphicon-remove-circle" style="float:right; cursor:pointer" onClick="__VCL.closeDialog('dialogModal');"></span>
  </div>
  </td></tr>
  <tr><td>
  <div style="border:0px solid #000;overflow:hidden;width:100%;height:100%;position:relative" id="gridd">
<script>
   DBGridd = new TDBGrid(gridd,"gridd");
   DBGridd.titleLinebs = 1.2;
   DBGridd.useActiveProperty = true;
   DBGridd.items.addEx({fieldName:"SQL_PARAM",width:200}).title.caption = "参数说明";
   DBGridd.items.addEx({fieldName:"SQL_PDTYPE",width:96,buttonStyle:cbsSelect}).title.caption = "数据类型";
   DBGridd.columns[1].pickListNo = [1,2,3,4];
   DBGridd.columns[1].pickListName = ["字符","整数","小数","日期"];
   DBGridd.items.addEx({fieldName:"SQL_PFROM",width:112,buttonStyle:cbsSelect}).title.caption = "来源";
   DBGridd.columns[2].pickListNo = [0,1,2,3,5];
   DBGridd.columns[2].pickListName = ["无","字段值","字段原值","session变量","常数"];
   DBGridd.items.addEx({fieldName:"SQL_SESSION",width:128}).title.caption = "字段或变量名";   
   
   DBGridd.items.addEx({fieldName:"SQL_INOUT",width:88,buttonStyle:cbsSelect}).title.caption = "方向";
   DBGridd.columns[4].pickListNo = [1,2,3];
   DBGridd.columns[4].pickListName = ["输入","输出","输入输出"];
   DBGridd.createGrid();   
</script>
  </div>
  </td></tr>
  <tr><td height="48" style="background-color:#FFF">
  <div style="height:100%; width:100%; border-top:1px solid #CCC;text-align:right; padding:5px; padding-right:24px">
  <button name="btOk" class="btn btn-primary btn-sm"  onClick="tabled.insert();">
      <span class="glyphicon glyphicon-plus"></span> 增 加</button>
  <button name="btOk" class="btn btn-primary btn-sm"  onClick="tabled.Delete();">
      <span class="glyphicon glyphicon-remove"></span> 删 除</button>&nbsp;&nbsp;&nbsp;
  <button name="btOk" class="btn btn-warning btn-sm"  onClick="__VCL.closeDialog('dialogModal');">
      <span class="glyphicon glyphicon-ban-circle"></span> 取 消</button>&nbsp;&nbsp;&nbsp;
  <button name="btOk" class="btn btn-primary btn-sm"  onClick="doOk()">
      <span class="glyphicon glyphicon-ok"></span> 确 定</button>
  </div>
  </td></tr></table>
  </div>
</div>
</body>

</html>

