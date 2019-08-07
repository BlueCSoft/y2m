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
<title>接口管理</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">
<script src="../theme/const.js"></script>

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>

<script src="../js/xmlhttp.js"></script>
<script src="../js/idataset.js"></script>
<script src="../js/idbgrids.js"></script>
<script src="../js/idbctrls.js"></script>
<script src="../js/datasource.js"></script>

<script>
  var table,ds,DBGrid;
  
  function doSelectChange(sender){
    table.getDataFromServer("#SYS_IFACEDEF",[typeSelect.value,inpEdit.value]);
	inpEdit.value = "";
  }
  
  function doLoad(){
    $("#divClient").css("height",document.documentElement.clientHeight-56); 

    table = new TTable("SYS_IFACEDEF","#SYS_IFACEDEF",[1,""],{SeqName:"SQ_MAXID",SeqFieldName:"SID"});
	
    table.setLogFields(["USERID","LASTUPTIME"],[<%=plimit.sessionAttr("gUserId")%>,"SYSDATE"]);
   
    table.AfterInsert = function(dSet){
	  dSet.$set("GID",typeSelect.value);
	  switch(parseInt(typeSelect.value)){
		case 1:
		  dSet.$set("ISYMP",1);
		  break;  
		case 2:
		  dSet.$set("ISYSS",1);
		  break;  
		case 3:
		  dSet.$set("ISYBS",1);
		  break;  
		case 4:
		  dSet.$set("ISYMP",1);
		  dSet.$set("ISYSS",1);
		  break;  
	  }
	}
   
    ds = new TDataSource();

    table.addDataSource(ds);
    ds.boundDbCtrl();
    DBGrid.setDataSource(ds);
    //DBGrid.paint(); 
    //doSelectChange(null);
  }
    
</script>

<body onLoad="doLoad();">
<table width="100%" height="100%"  border="0" id="mainTable">
<tr><td height="40">
 <div style="height:40px; padding-top:4px;">
  <table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
   <tr>
     <td width="40" align="center" onClick="callParam();">分类</td>
	 <td width="127">
       <select id="typeSelect" style="width:120px;" onChange="doSelectChange(this);" class="form-control">
	   <option value="1" selected>专柜收款</option> 
       <option value="2">小程序</option>  	
       <option value="3">零售商</option>  
       <option value="4">公用</option>  
	   </select>
     </td>
     <td width="40" align="center">查找</td>
     <td width="160">
       <input type="text" id="inpEdit" class="form-control"
              onKeyDown="if(event.keyCode==13) doSelectChange(this);">
     </td>
     <td align="left" valign="middle">&nbsp;
          <button name="btIns" class="btn btn-primary btn-sm" id="btIns" onClick="table.insert();">
          <span class="glyphicon glyphicon-plus-sign"></span> 增 加</button>
          <button name="btDel" class="btn btn-primary btn-sm" id="btDel" onClick="table.Delete();">
          <span class="glyphicon glyphicon-remove-circle"></span> 删 除</button>
          <button name="btSave" class="btn btn-primary btn-sm" onClick="table.applyUpdate('');">
          <span class="glyphicon glyphicon-book"></span> 保 存</button>
     </td>
   </tr>
  </table>
 </div>
</td></tr>
<tr><td>
    <div style="padding-left:4px;padding-right:4px;padding-bottom:4px;height:520px;" id="divClient">
    <table width="100%" height="100%"  border="0">
    <tr><td width="644px">
    <div id="grid" style="overflow:hidden;border:1px solid #ccc; height:100%; position:relative;border-radius:5px">
    <script>
       DBGrid = new TDBGrid(grid,"grid");
       DBGrid.useActiveProperty = true;
	   DBGrid.addColumn({fieldName:"STYPE",width:48});
       DBGrid.addColumn({fieldName:"SNAME",width:122});
       DBGrid.addColumn({fieldName:"SFILE",width:252});
       DBGrid.addColumn({fieldName:"ISJSON",width:48,checkBox:true});  
       DBGrid.addColumn({fieldName:"ISYMP",width:40,checkBox:true});  
       DBGrid.addColumn({fieldName:"ISYSS",width:40,checkBox:true});  
       DBGrid.addColumn({fieldName:"ISYBS",width:40,checkBox:true});  
       DBGrid.createGrid(40);   
    </script>
    </div>
    </td>
    <td style="padding:1px 1px 1px 1px" valign="top">
    <textarea class="form-control" style="height:100%;font-size:14px; font-family:'宋体'" data-field="REQTEXT"></textarea>  
    </td>
    <td style="padding:1px 1px 1px 1px" valign="top">
    <textarea class="form-control" style="height:100%;font-size:14px; font-family:'宋体'" data-field="REQNOTE"></textarea>  
    </td>
    </tr>
    </table>
   </div>
  </div>
</td></tr>
</table>
</body>

</html>



