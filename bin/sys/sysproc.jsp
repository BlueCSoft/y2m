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
<title>ִ��SQL������</title>
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
        alert("��������Դ���ֶ�ʱ�����������ֶ���.");
	    return false;
      }
      if((pf=="4")&&dSet.$("SQL_SESSION")==""){
        alert("��������Դ��sessionʱ����������session������.");
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
      <span class="glyphicon glyphicon-plus-sign"></span> �� ��</button>
      <button name="btDel" class="btn btn-primary btn-sm" onClick="table.DeleteHint();">
      <span class="glyphicon glyphicon-remove-circle"></span> ɾ ��</button>
      <button name="btParam" class="btn btn-primary btn-sm" onClick="callParam();">
      <span class="glyphicon glyphicon-list-alt"></span> ����˵��</button>
      <button name="btSave" class="btn btn-primary btn-sm"  onClick="table.applyUpdate('');">
      <span class="glyphicon glyphicon-book"></span> �� ��</button>
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
   DBGrid.items.addEx({fieldName:"SQL_ID",width:240}).title.caption = "��ʶ";
   DBGrid.items.addEx({fieldName:"SQL_DS",width:240}).title.caption = "˵��";
   DBGrid.items.addEx({fieldName:"GTAG",width:72,buttonStyle:cbsSelect,alignment:taLeft}).title.caption = "����";   
   
   DBGrid.columns[2].pickListNo = [4,5];
   DBGrid.columns[2].pickListName = ["�洢����","SQL���"];

   DBGrid.items.addEx({fieldName:"SQLATT",width:88,checkBox:true}).title.caption = "�����ִ��";   
   DBGrid.items.addEx({fieldName:"AEXEC",width:96,checkBox:true}).title.caption = "�����ֶα仯";      
  
   DBGrid.items.addEx({fieldName:"SQL_TYPE",width:110}).title.caption = "����";
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
    ���ò���(<span id="titleCaption"></span>)
    <span class="glyphicon glyphicon-remove-circle" style="float:right; cursor:pointer" onClick="__VCL.closeDialog('dialogModal');"></span>
  </div>
  </td></tr>
  <tr><td>
  <div style="border:0px solid #000;overflow:hidden;width:100%;height:100%;position:relative" id="gridd">
<script>
   DBGridd = new TDBGrid(gridd,"gridd");
   DBGridd.titleLinebs = 1.2;
   DBGridd.useActiveProperty = true;
   DBGridd.items.addEx({fieldName:"SQL_PARAM",width:200}).title.caption = "����˵��";
   DBGridd.items.addEx({fieldName:"SQL_PDTYPE",width:96,buttonStyle:cbsSelect}).title.caption = "��������";
   DBGridd.columns[1].pickListNo = [1,2,3,4];
   DBGridd.columns[1].pickListName = ["�ַ�","����","С��","����"];
   DBGridd.items.addEx({fieldName:"SQL_PFROM",width:112,buttonStyle:cbsSelect}).title.caption = "��Դ";
   DBGridd.columns[2].pickListNo = [0,1,2,3,5];
   DBGridd.columns[2].pickListName = ["��","�ֶ�ֵ","�ֶ�ԭֵ","session����","����"];
   DBGridd.items.addEx({fieldName:"SQL_SESSION",width:128}).title.caption = "�ֶλ������";   
   
   DBGridd.items.addEx({fieldName:"SQL_INOUT",width:88,buttonStyle:cbsSelect}).title.caption = "����";
   DBGridd.columns[4].pickListNo = [1,2,3];
   DBGridd.columns[4].pickListName = ["����","���","�������"];
   DBGridd.createGrid();   
</script>
  </div>
  </td></tr>
  <tr><td height="48" style="background-color:#FFF">
  <div style="height:100%; width:100%; border-top:1px solid #CCC;text-align:right; padding:5px; padding-right:24px">
  <button name="btOk" class="btn btn-primary btn-sm"  onClick="tabled.insert();">
      <span class="glyphicon glyphicon-plus"></span> �� ��</button>
  <button name="btOk" class="btn btn-primary btn-sm"  onClick="tabled.Delete();">
      <span class="glyphicon glyphicon-remove"></span> ɾ ��</button>&nbsp;&nbsp;&nbsp;
  <button name="btOk" class="btn btn-warning btn-sm"  onClick="__VCL.closeDialog('dialogModal');">
      <span class="glyphicon glyphicon-ban-circle"></span> ȡ ��</button>&nbsp;&nbsp;&nbsp;
  <button name="btOk" class="btn btn-primary btn-sm"  onClick="doOk()">
      <span class="glyphicon glyphicon-ok"></span> ȷ ��</button>
  </div>
  </td></tr></table>
  </div>
</div>
</body>

</html>

