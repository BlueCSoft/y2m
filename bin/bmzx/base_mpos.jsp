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
<title>机具设置</title>
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
  
    table = new TTable("BASE_MPOS","",[0],{SeqName:"SQ_MAXID",SeqFieldName:"SID"});
  
    table.indexDefs.addIndex("index1",["SNO"],1,"机具编号不能够重复."); 
   
    table.setLogFields(["USERID","LASTUPTIME"],[<%=plimit.sessionAttr("gUserId")%>,"SYSDATE"]);
    table.AfterInsert = function(dSet){
	  dSet.$set("STATUS",1);
	  dSet.$set("OSNO",mdList.value);
	  dSet.$set("SSNO",__$Query.$("SNO"));
    }
	
    DBGrid.setDataSource(table.addDataSource(new TDataSource()));   
    QrGrid.boundQuery(__$Query,false);
	
	QrGrid.OnRowClick = function(){
      table.getDataFromServer("BASE_MPOS",[__$Query.$("SNO")]);
	}
	doQuery();
 }
 
 function doQuery(){
    __$Query.Query("dir_getstore0",[mdList.value]);	 
	QrGrid.OnRowClick();
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
  <button name="btIns" class="btn btn-primary btn-sm" id="btIns" onClick="table.insert();">
    <span class="glyphicon glyphicon-plus-sign"></span> 新 增</button>
  <button name="btDel" class="btn btn-primary btn-sm" onClick="table.DeleteHint();">
    <span class="glyphicon glyphicon-remove-circle"></span> 删 除</button>&nbsp;&nbsp;
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
  DBGrid.addColumn({fieldName:"SNO",width:120,alignment:taCenter});
  DBGrid.addColumn({fieldName:"ERPCASHID",width:120,alignment:taCenter});
  DBGrid.addColumn({fieldName:"COUNTERID",width:120,alignment:taCenter});
  DBGrid.addColumn({fieldName:"ISPAYCASH",width:88,alignment:taCenter,checkBox:true});
  DBGrid.addColumn({fieldName:"STATUS",width:88,alignment:taCenter,checkBox:true});
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

