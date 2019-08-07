<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<jsp:useBean id="plimit" scope="page" class="bluec.base.CLogin"/>
<%
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
 if(plimit.checkLimit(request,"")<0){
   out.println(plimit.getLastError());
   return;
 }
%>
 
<!DOCTYPE html>

<head>
<title>专柜设置</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link href="../theme/page.css?version=16" rel="stylesheet" type="text/css">
<script src="../theme/const.js"></script>

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>

<script charset="utf-8" src="http://api.map.baidu.com/api?v=2.0&ak=bBHLPE6p5W3RymVCr4zatMAPWFbWQ96h"></script>
<script src="../js/xmlhttp.js"></script>
<script src="../js/idataset.js?version=1"></script>
<script src="../js/idbgrids.js"></script>
<script src="../js/datasource.js"></script>
<script src="../js/db.js"></script>
<script src="../js/iqrgrids.js?version=2"></script>
<script>
<%
  out.print(plimit.createGlobal(request));
%>
  var table,ds,DBGrid,_ofind;
  
  function doLoad(){
    __VCL.autoAdjust("#divClient",["#toolpanel"]);
  
    table = new TTable("BASE_COUNTER","",[0]);
  
    table.indexDefs.addIndex("index1",["SNO"],1,"专柜代码不能够重复."); 
   
    table.setDefaultFields(["PRECISION"],[1]);
    table.setLogFields(["USERID","LASTUPTIME"],[<%=plimit.sessionAttr("gUserId")%>,"SYSDATE"]);
    table.AfterInsert = function(dSet){
      code = dSet.getMaxValue("SNO");
	  code = (code=="")? __$Query.$("SNO")+"001":__FUN.__$IncString(code,"001");
	  dSet.$set("SNO",code);
	  dSet.$set("OSNO",mdList.value);
	  dSet.$set("SSNO",__$Query.$("SNO"));
    }
	
    DBGrid.setDataSource(table.addDataSource(new TDataSource()));   
    QrGrid.boundQuery(__$Query,false);
	
	QrGrid.OnRowClick = function(){
      table.getDataFromServer("BASE_COUNTER",[__$Query.$("SNO")]);
	}
	doQuery();
 }
 
 function doQuery(){
    __$Query.Query("dir_getstore0",[mdList.value]);	 
	QrGrid.OnRowClick();
 }

 function doOpen(){
	if(!table.isEmpty()){ 
	  titleCaption.innerText = table.$("SNAME");  
	  noteMemo.value = table.$("RECEIPTNOTE");  
      __VCL.showDialog("dialogModal","dialogBody",320,400);
	}
  }
  
 function doOk(){ 
   table.$set("RECEIPTNOTE",noteMemo.value);
   table.post();
   
   if(table.applyUpdate()>=0){
	 __VCL.closeDialog('dialogModal');  
   }
 }
 
 function doTran(){
   if(__xmlHttp.callPage("../ierp/readerpcounter.jsp?storeid="+__$Query.$("SNO"))){
     table.getDataFromServer("BASE_COUNTER",[__$Query.$("SNO")]);
	 alert("同步成功");
   }
 }
</script>
</head>
<body onLoad="doLoad();" style="overflow:hidden">
<div style="padding-left:4px; padding-right:4px">
 <div id="toolpanel" style="height:40px; padding-top:4px; padding-left:4px">
  <table border="0">
  <tr><td>所属门店</td>
  <td><select class="form-control" id="mdList" style="width:200px" onChange="doQuery()">
      <% out.print(plimit.getOptionsBySqlId("dir_getorglist0","",session)); %>   			
      </select></td>
  <td>
  <button name="btRead" class="btn btn-primary btn-sm" id="btRead" onClick="doTran();">
    <span class="glyphicon glyphicon-plus-sign"></span> 同步Erp数据</button>

  <button name="btIns" class="btn btn-primary btn-sm" id="btIns" onClick="table.insert();">
    <span class="glyphicon glyphicon-plus-sign"></span> 新 增</button>
  <button name="btDel" class="btn btn-primary btn-sm" onClick="table.DeleteHint();">
    <span class="glyphicon glyphicon-remove-circle"></span> 删 除</button>&nbsp;&nbsp;
    
  <button name="btSet" class="btn btn-info btn-sm" onClick="doOpen()">
    <span class="glyphicon glyphicon-th"></span> 小票广告语设置</button>&nbsp;&nbsp;

  <button name="btSave" class="btn btn-primary btn-sm" onClick="table.applyUpdate('');">
    <span class="glyphicon glyphicon-book"></span> 保 存</button>
  </td></tr>
  </table>  
 </div>
<div style="padding-left:4px;padding-right:4px;padding-bottom:4px;height:520px;" id="divClient">
  <table border="0" width="100%" height="100%">
  <tr>
  <td width="320">
  <div id="qrgrid" style="overflow:hidden;border:1px solid #cccccc;height:100%;width:100%;position:relative;border-radius:2px">
   <script>
  QrGrid = new TQRGrid();
  QrGrid.setPropertys({name:"QRGrid",crossShowRow:false,tableBgColor:"#cccccc",rowBackGround:"#ffffff",usePre:false,
                       titleHeight:28,userActiceRow:true,tableClass:"table rtable"});
  QrGrid.addEx({Caption:"商场代码",FieldName:"SNO",AlignMent:"center",Width:80});
  QrGrid.addEx({Caption:"商场名称",FieldName:"SNAME",AlignMent:"center",Width:0});
  QrGrid.CreateGrid(true);  //显示表格线
  </script>
  </div>
  </td>
  <td>
  <div id="grid" style="overflow:hidden;border:1px solid #cccccc;height:100%;width:100%;position:relative;border-radius:2px">
  <script>
  DBGrid = new TDBGrid(grid,"grid",32);
  DBGrid.showInputMark = true;
  DBGrid.addColumn({fieldName:"SNO",width:80,alignment:taCenter});
  DBGrid.addColumn({fieldName:"SNAME",width:200});
  DBGrid.addColumn({fieldName:"TEL",width:160});
  DBGrid.addColumn({fieldName:"CONTACT",width:120});
  DBGrid.addColumn({fieldName:"SUPPLYID",width:96,alignment:taCenter});
  DBGrid.addColumn({fieldName:"ROUNDBIT",width:88,alignment:taCenter,
                    pickListNo:[0,1,2],pickListName:["舍到元","舍到角","不舍入"],buttonStyle:cbsSelect});
  DBGrid.addColumn({fieldName:"MPOSID1",width:96,alignment:taCenter});
  DBGrid.addColumn({fieldName:"MPOSID2",width:96,alignment:taCenter});
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
    设置小票打印广告语(<span id="titleCaption"></span>)
    <span class="glyphicon glyphicon-remove-circle" style="float:right; cursor:pointer" onClick="__VCL.closeDialog('dialogModal');"></span>
  </div>
  </td></tr>
  <tr><td>
  <div style="border:0px solid #000;overflow:hidden;width:100%;height:100%;position:relative;">
   <textarea style="width:100%;height:100%; font-family:宋体; font-size:16px" class="form-control" id="noteMemo"></textarea>
  </div>
  </td></tr>
  <tr><td height="48" style="background-color:#FFF">
  <div style="height:100%; width:100%; border-top:1px solid #CCC;text-align:right; padding:5px; padding-right:24px">
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

