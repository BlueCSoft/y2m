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
<title>商场设置</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">
<script src="../theme/const.js"></script>

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>

<script charset="utf-8" src="http://api.map.baidu.com/api?v=2.0&ak=bBHLPE6p5W3RymVCr4zatMAPWFbWQ96h"></script>
<script src="../js/xmlhttp.js"></script>
<script src="../js/idataset.js?version=1"></script>
<script src="../js/idbgrids.js"></script>
<script src="../js/datasource.js"></script>
<script>
<%
  out.print(plimit.createGlobal(request));
%>
  var table,ds,DBGrid,_ofind;
  
  function doLoad(){
    __VCL.autoAdjust("#divClient",["#toolpanel"]);
  
    table = new TTable("BASE_STORE","",[mdList.value]);
  
    table.indexDefs.addIndex("index1",["SNO"],1,"商场代码不能够重复."); 
   
    table.setLogFields(["USERID","LASTUPTIME"],[<%=plimit.sessionAttr("gUserId")%>,"SYSDATE"]);
    table.AfterInsert = function(dSet){
      code = dSet.getMaxValue("SNO");
	  code = (code=="")? mdList.value+"01":__FUN.__$IncString(code,"01");
	  dSet.$set("SNO",code);
	  dSet.$set("OSNO",mdList.value);
    }
	
    DBGrid.setDataSource(table.addDataSource(new TDataSource()));   
    //DBGrid.paint();  
 }
 
 function doQuery(){
   table.getDataFromServer("BASE_STORE",[mdList.value]);
 }

 function doTran(){
   if(__xmlHttp.callPage("../ierp/readerpstore.jsp?orgid="+mdList.value)){
     doQuery();
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
    <span class="glyphicon glyphicon-remove-circle"></span> 删 除</button>
  <button name="btSave" class="btn btn-primary btn-sm" onClick="table.applyUpdate('');">
    <span class="glyphicon glyphicon-book"></span> 保 存</button>
  </td></tr>
  </table>  
 </div>
<div style="padding-left:4px;padding-right:4px;padding-bottom:4px;height:520px;" id="divClient">
  <div id="grid" style="overflow:hidden;border:1px solid #cccccc;height:100%;width:100%;position:relative;border-radius:2px">
  <script>
  DBGrid = new TDBGrid(grid,"grid");
  DBGrid.showInputMark = true;
  DBGrid.addColumn({fieldName:"SNO",width:80,alignment:taCenter});
  DBGrid.addColumn({fieldName:"SNAME",width:200});
  DBGrid.addColumn({fieldName:"LOCATION",width:320});
  DBGrid.addColumn({fieldName:"TEL",width:160});
  DBGrid.addColumn({fieldName:"CONTACT",width:120});
  DBGrid.createGrid(); 
  </script>
  </div>
</div>
</div>
</body>
</html>

