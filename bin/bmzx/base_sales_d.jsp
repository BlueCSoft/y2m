<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*,bluec.base.*"%>
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
<title>营业员设置</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">
<script src="../theme/const.js"></script>

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>

<script src="../js/xmlhttp.js"></script>
<script src="../js/idataset.js?version=1"></script>
<script src="../js/idbgrids.js"></script>
<script src="../js/datasource.js"></script>
<script>
<%
  out.print(plimit.createGlobal(request));
%>
  var table,ds,DBGrid,cprefix;
  
  function doLoad(){
	 
    __VCL.autoAdjust("#divClient",["#toolpanel"]);
	__xmlHttp.setSubwin(<%=CUtil.winCalltype(request)%>);  

	
    cprefix =parent.__$Query.$("SNO")+parent.__$QueryZg.$("SNO"); 
    table = new TTable("BASE_SALES","",[parent.__$QueryZg.$("SID")],{SeqName:"SQ_MAXID",SeqFieldName:"SID"});
  
    table.indexDefs.addIndex("index1",["SNO"],1,"营业员代码不能够重复."); 
    
	table.setDefaultFields(["SSID","MSID","CSID"],[parent.mdList.value,parent.__$QueryZg.$("MSID"),parent.__$QueryZg.$("SID")]);
    table.setLogFields(["USERID","LASTUPTIME"],[<%=plimit.sessionAttr("gUserId")%>,"SYSDATE"]);

    table.AfterInsert = function(dSet){
      code = dSet.getMaxValue("SNO");
	  if(code != "")
	    code = __FUN.RightStr(code,3);
	  code = cprefix+((code=="")? "001":__FUN.__$IncString(code,"001"));
	  dSet.$set("SNO",code);
	}
	
    DBGrid.setDataSource(table.addDataSource(new TDataSource()));   
    //DBGrid.paint();  
 }

  function doOk(){
	if(table.applyUpdate()>=0){  
      __$windowcallresult.isok = true;
	  __$windowcallresult.results = [table.getRecordCount()]; 
      history.back();
	}
  }
	
  function doCancel(){
	if(table.post()){
	  if(table.dataIsChange()){
		if(confirm("保存已被更改的数据吗？"))
		  doOk();
		else
		  history.back();  
	  }else{
		history.back();
	  }
	}
  }	

</script>
</head>
<body onLoad="doLoad();" style="overflow:hidden">
<div style="padding-left:4px; padding-right:4px">
 <div id="toolpanel" style="height:40px; padding-top:4px; padding-left:4px">
  <button name="btIns" class="btn btn-primary btn-sm" id="btIns" onClick="table.insert();">
    <span class="glyphicon glyphicon-plus-sign"></span> 新 增</button>
  <button name="btDel" class="btn btn-primary btn-sm" onClick="table.DeleteHint();">
    <span class="glyphicon glyphicon-remove-circle"></span> 删 除</button>
  <button name="btSave" class="btn btn-primary btn-sm" onClick="doOk()">
    <span class="glyphicon glyphicon-ok"></span> 保 存</button>
  <button name="btSave" class="btn btn-primary btn-sm" onClick="doCancel()">
    <span class="glyphicon glyphicon-book"></span> 关 闭</button>
 </div>
<div style="padding-left:4px;padding-right:4px;padding-bottom:4px;height:520px;" id="divClient">
  <div id="grid" style="overflow:hidden;border:1px solid #cccccc;height:100%;width:100%;position:relative;border-radius:2px">
  <script>
  DBGrid = new TDBGrid(grid,"grid");
  DBGrid.showInputMark = true;
  DBGrid.addColumn({fieldName:"SNO",width:80,alignment:taCenter});
  DBGrid.addColumn({fieldName:"SNAME",width:200});
  DBGrid.addColumn({fieldName:"SEX",width:56,alignment:taCenter,pickListNo:[0,1],pickListName:["男","女"]});
  DBGrid.addColumn({fieldName:"IDCARD",width:160,alignment:taCenter});
  DBGrid.addColumn({fieldName:"WDATE",width:120,alignment:taCenter});
  DBGrid.createGrid(); 
  </script>
  </div>
</div>
</div>
</body>
</html>

