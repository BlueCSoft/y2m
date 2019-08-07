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
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<title>销售码设置</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">
<script src="../theme/const.js"></script>

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>

<script charset="utf-8" src="http://api.map.baidu.com/api?v=2.0&ak=bBHLPE6p5W3RymVCr4zatMAPWFbWQ96h"></script>
<script src="../js/xmlhttp.js"></script>
<script src="../js/idataset.js?version=3"></script>
<script src="../js/idbgrids.js?version=7"></script>
<script src="../js/datasource.js"></script>
<script src="../js/db.js?version=2"></script>
<script src="../js/iqrgrids.js?version=2"></script>
<script src="../js/laydate/laydate.js"></script>

<script>
<%
  out.print(plimit.createGlobal(request));
%>
  var table,ds,DBGrid,_ofind,__$QueryZg = new TQuery();
  
  function doLoad(){
    __VCL.autoAdjust("#divClient",["#toolpanel"]);
	__VCL.autoAdjust("#qrgrid",["#toolpanel"]);
	__VCL.autoAdjust("#gridzg",["#toolpanel"]);
  
    table = new TTable("BASE_POSCODE","",[0],{SeqName:"SQ_MAXID",SeqFieldName:"SID"});
  
    table.indexDefs.addIndex("index1",["SNO"],1,"销售码码不能够重复."); 
   
	table.setDefaultFields(["STATUS"],[1,1]);
   
    table.setLogFields(["USERID","LASTUPTIME"],[<%=plimit.sessionAttr("gUserId")%>,"SYSDATE"]);
	table.BeforeInsert = function(dSet){
	  return !__$QueryZg.isEmpty;	
	}

    table.AfterInsert = function(dSet){
	  code = dSet.getMaxValue("SNO");
	  if(code != "")
	    code = __FUN.RightStr(code,4);
	  code = (code=="")? "0001":__FUN.__$IncString(code,"0001");
	  dSet.$set("SNO",__$QueryZg.$("SNO")+code);
	  
	  dSet.$set("OSNO",mdList.value);
	  dSet.$set("SSNO",__$QueryZg.$("SSNO"));
	  dSet.$set("CSNO",__$QueryZg.$("SNO"));
    }
	
	table.BeforePost = function(dSet){
	  return true;
	}
	
    DBGrid.setDataSource(table.addDataSource(new TDataSource()));   
    QrGrid.boundQuery(__$Query,false);
	
	__$Query.OnDataChange = function(){
	  __$QueryZg.Query("dir_getcounter0",[(__$Query.isEmpty)? "":__$Query.$("SNO")]);
	}
	
    QrGridzg.boundQuery(__$QueryZg,false);
	
	__$QueryZg.OnDataChange = function(){
      table.getDataFromServer("BASE_POSCODE",[(__$QueryZg.isEmpty)? "":__$QueryZg.$("SNO")]);
	}

	doQuery();
 }
 
 function doQuery(){
    __$Query.Query("dir_getstore0",[mdList.value]);	 
 }
 
 function doTran(){
   if(__xmlHttp.callPage("../ierp/readerpposcode.jsp?counterid="+__$QueryZg.$("SNO"))){
     table.getDataFromServer("BASE_POSCODE",[__$QueryZg.$("SNO")]);
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
  <td width="268">&nbsp;</td>    
  <td>
  <button name="btRead" class="btn btn-primary btn-sm" id="btRead" onClick="doTran();">
    <span class="glyphicon glyphicon-plus-sign"></span> 同步Erp数据</button>

  <button name="btIns" class="btn btn-primary btn-sm" id="btIns" onClick="table.insert();">
    <span class="glyphicon glyphicon-plus-sign"></span> 新 增</button>
  <button name="btDel" class="btn btn-primary btn-sm" onClick="table.DeleteHint();">
    <span class="glyphicon glyphicon-remove-circle"></span> 删 除</button>
  <button name="btSave" class="btn btn-primary btn-sm" onClick="table.applyUpdate('');">
    <span class="glyphicon glyphicon-book"></span> 保 存</button>
  </td></tr>
  </table>  
 </div>
<div style="padding-bottom:4px;height:520px;" id="divClient">
  <table border="0" width="100%" height="100%">
  <tr>
  <td width="248">
  <div id="qrgrid" style="overflow:hidden;border:1px solid #cccccc;height:100%;width:100%;position:relative;border-radius:2px">
   <script>
  QrGrid = new TQRGrid();
  QrGrid.setPropertys({name:"QRGrid",crossShowRow:false,tableBgColor:"#cccccc",rowBackGround:"#ffffff",usePre:false,
                       titleHeight:28,userActiceRow:true,tableClass:"table rtable",inpWidth:32});
  QrGrid.addEx({Caption:"商场代码",FieldName:"SNO",AlignMent:"center",Width:72});
  QrGrid.addEx({Caption:"商场名称",FieldName:"SNAME",Width:0});
  QrGrid.CreateGrid(true);  //显示表格线
  </script>
  </div>
  </td>
  <td width="320">
  <div id="gridzg" style="overflow:hidden;border:1px solid #cccccc;height:100%;width:100%;position:relative;border-radius:2px">
  <script>
  QrGridzg = new TQRGrid();
  QrGridzg.setPropertys({name:"QRGridzg",crossShowRow:false,tableBgColor:"#cccccc",rowBackGround:"#ffffff",usePre:false,
                       titleHeight:28,userActiceRow:true,tableClass:"table rtable",inpWidth:32});
  QrGridzg.addEx({Caption:"专柜代码",FieldName:"SNO",AlignMent:"center",Width:80});
  QrGridzg.addEx({Caption:"专柜名称",FieldName:"SNAME",Width:0});
//  QrGridzg.addEx({Caption:"电话",FieldName:"TEL",Width:160});
//  QrGridzg.addEx({Caption:"联系人",FieldName:"CONTACT",Width:120});
  QrGridzg.addEx({Caption:"厂商代码",FieldName:"SUPPLYID",AlignMent:"center",Width:80});
//  QrGridzg.addEx({addString:"设置营业员",allwayShowAdd:true,AlignMent:"center",Width:96,linkAttr:true,tag:1});
  QrGridzg.CreateGrid(true);  //显示表格线
  </script>
  </div>
  </td>
  <td>
  <div id="grid" style="overflow:hidden;border:1px solid #cccccc;height:100%;width:100%;position:relative;border-radius:2px">
  <script>
  DBGrid = new TDBGrid(grid,"grid");
  DBGrid.showInputMark = true;
  DBGrid.addColumn({fieldName:"SNO",width:120,alignment:taCenter});
  DBGrid.addColumn({fieldName:"SNAME",width:208});
  DBGrid.addColumn({fieldName:"SHORTCUT",width:52,alignment:taCenter});
  DBGrid.addColumn({fieldName:"BRANDID",width:64});
  DBGrid.addColumn({fieldName:"CATID",width:64});
  DBGrid.addColumn({fieldName:"SPEC",width:64});
  DBGrid.addColumn({fieldName:"UNIT",width:32,alignment:taCenter});
  DBGrid.addColumn({fieldName:"PRICE",width:80,alignment:taRight});
  DBGrid.addColumn({fieldName:"BARCODE",width:112,alignment:taCenter});
  //DBGrid.addColumn({fieldName:"PRICEATT",width:56,alignment:taCenter,checkBox:true});
  DBGrid.addColumn({fieldName:"STATUS",width:40,alignment:taCenter,checkBox:true});
  DBGrid.createGrid(); 
  </script>
  </div>
  </td>
  </tr>
  </table>
</div>
</div>
</body>
</html>

