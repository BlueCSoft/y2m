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
<title>功能管理</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">
<script src="../theme/const.js"></script>

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>

<script src="../js/xmlhttp.js"></script>
<script src="../js/idataset.js"></script>
<script src="../js/idbgrids.js"></script>
<script src="../js/treeview.js"></script>
<script src="../js/datasource.js"></script>

<script>
 
  var table,ds,DBGrid,tree;
  
  function AfterInsert(dSet){
    dSet.$set("PID",tree.getID());
	dSet.$set("HASCHILD",0);	
	dSet.$set("STATUS","1");	
	dSet.$set("TARGET",0);
	dSet.$set("NLEVEL",tree.getLevel()+1);	
  }
   
  function OnTreeSelect(node){
   table.getDataFromServer("#SYS_FUNS",[node.getID()]);
  }
  
  function OnAfterUpdate(dSet){
   tree.setChildTree(); 
  }
  
  function doLoad(){
   $("#divClient").css("height",document.documentElement.clientHeight-56); 
   
   tree = new TTreeView(treediv);
   tree.sqlID = "#SYS_FUNS_TREE";
   tree.dynTree = true;
   tree.OnTreeSelect = OnTreeSelect;

   table = new TTable("SYS_FUNS","#SYS_FUNS",[0],{SeqName:"SQ_MAXID",SeqFieldName:"ID"});

   table.OnInitUpdate = function(dSet){
     //dSet.allwaysUpdateSql = "#SYS_FUNS_CALHASCHILD("+tree.getID()+","+tree.getID()+")";		
	 return true;  
   }
   
   table.fieldByName["PAGENAME"].OnChange = function(field){
     var s = table.getFieldValue("PAGENAME");
     if(s != ""){
	   var n = s.indexOf(".");
	   if(n>0) s = s.substring(0,n);
       table.$set("PAGEID",s);
	 }  
   }
   
   table.noDataHint = false;
         
   table.AfterInsert = AfterInsert;
   table.OnAfterUpdate = OnAfterUpdate;
   
   ds = new TDataSource();
   table.addDataSource(ds); 
   
   DBGrid.setDataSource(ds);   
   DBGrid.paint();  
     
}
 
</script>
</head>
<body onLoad="doLoad();">
<table width="100%" height="100%"  border="0" id="mainTable">
<tr><td height="40">
    <div style="height:100%; padding-top:4px; padding-left:4px">
          <button name="btIns" class="btn btn-primary btn-sm" id="btIns" onClick="table.insert();">
          <span class="glyphicon glyphicon-plus-sign"></span> 增 加</button>
          <button name="btDel" class="btn btn-primary btn-sm" onClick="table.DeleteHint();">
          <span class="glyphicon glyphicon-remove-circle"></span> 删 除</button>
          <button name="btSave" class="btn btn-primary btn-sm" onClick="table.applyUpdate('');">
          <span class="glyphicon glyphicon-book"></span> 保 存</button>
    </div>
</td></tr>
<tr><td>
    <div style="padding-left:4px;padding-right:4px;padding-bottom:4px;height:420px;" id="divClient">
 	 <table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
      <tr valign="top">
        <td width="320">
         <div id="treediv" style="overflow:auto;border:1px solid #ccc;width:100%; height:100%;border-radius:3px"><span><span><img 
         align="absmiddle"><img align="absmiddle"><input type="hidden" 
         value="1"></span><span></span><span 
         style='padding:1px 1px 1px 1px;cursor:hand;font-size:12px;'>功能列表</span><input type='hidden' 
         value='0'><input type='hidden' value='0'></span><br><div style='display:none;margin-left:0pt'></div></div></td>
        <td width="3"></td>
        <td>
      <div id="grid" style="overflow:hidden;border:1px solid #ccc;height:100%;width:100%;border-radius:3px; position:relative">
		<script>
  DBGrid = new TDBGrid(grid,"grid",32);
  DBGrid.addColumn({fieldName:"FUN_ID",width:88});
  DBGrid.addColumn({fieldName:"FUN_NAME",width:240});
  DBGrid.addColumn({fieldName:"PAGENAME",width:400});  
  DBGrid.addColumn({fieldName:"TARGET",width:88, checkBox:true});   
  DBGrid.addColumn({fieldName:"ISFUN",width:88, checkBox:true}); 
  DBGrid.createGrid();
		</script>
   </div>
		</td>
      </tr>
     </table>
   </div>
 </td></tr></table>
</body>
</html>