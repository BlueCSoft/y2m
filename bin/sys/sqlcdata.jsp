<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<jsp:useBean id="plimit" scope="page" class="bluec.base.CLogin"/>
<%
 request.setCharacterEncoding("GBK");
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
 if(plimit.checkLimitM(request)<0){
   out.println(plimit.getLastError()); 
   return;
 }
%>

<html>

<head>
<title>数据上传下载配置表</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>

<script src="../js/xmlhttp.js"></script>
<script src="../js/idataset.js"></script>
<script src="../js/idbgrids.js"></script>
<script src="../js/idbctrls.js"></script>
<script src="../js/datasource.js"></script>
<script src="../js/stand.js"></script>  
<script>
  var table,ds,DBGrid;

  function AfterInsert(dSet){
    table.setFieldValue("STYLE",typeSelect.value);
  }
  
  function doLoad(){
   table = new TTable("BlueCWeb..SYS_CDATA","SYS_CDATA",[1]);
   
   table.AfterInsert = AfterInsert;
   
   ds = new TDataSource();
   ds.OnDataChange = function(ds,dSet,field){
    if(field==null){
	  btDelete.disabled = dSet.isEmpty();
	} 
   } 
   
   table.addDataSource(ds);
   ds.addObject(new TDBEdit(sqlEdit,"SQL"));
   ds.addObject(new TDBEdit(dsqlEdit,"DSQL"));
   ds.addObject(new TDBEdit(upsqlEdit,"UPSQL"));
   
   DBGrid.setDataSource(ds);
   DBGrid.paint(); 
   
   typeSelect = new TRadio([radio1,radio0]);
   typeSelect.OnChange = function(){
     table.getDataFromServer("SYS_CDATA",[typeSelect.value]);
   }
  }
  
 
</script>
</head>

<body onLoad="doLoad();" scroll="no">
<table width="100%" height="100%" border="0">
  <tr height="32">
    <td align="center">
    <div style="height:40px; padding-top:4px;font-size:13px">
   
    <table width="100%" height="100%"  border="0">
      <tr>
        <td width="200"><table width="96%"  border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td width="10"><nobr>&nbsp;</nobr></td>
            <td width="16"><input name="radio" type="radio" id="radio1" value="1" checked></td>
            <td style="font-size:13px" onClick="radio1.click()">数据上传</td>
			<td width="16"><input name="radio" type="radio" id="radio0" value="0"></td>
            <td style="font-size:13px" onClick="radio0.click()">数据下载</td>
          </tr>
        </table></td>
        <td align="left" valign="middle">
          <button type="button" class="btn btn-primary btn-sm" id="btIns" onClick="table.insert();">
           <span class="glyphicon glyphicon-plus-sign"></span> 增 加</button>
           <button id="btDelete" type="button" class="btn btn-primary btn-sm" onClick="table.DeleteHint();">
           <span class="glyphicon glyphicon-remove-circle"></span> 删 除</button>
           <button id="btSave" type="button" class="btn btn-primary btn-sm" onClick="table.applyUpdate('');">
           <span class="glyphicon glyphicon-book"></span> 保 存</button>
          </td>
      </tr>
    </table>
    </div>  
    </td>

</tr>
<tr><td>
<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%">
<tr><td width="625">
<div style=" border:1px solid #cccccc;overflow:hidden;width:100%;height:100%;position:relative;border-radius:5px" id="grid">
<script>
   DBGrid = new TDBGrid(grid,"grid");
   DBGrid.titleLinebs = 1.2;
   DBGrid.items.addEx({fieldName:"STATUS",width:32,alignment:taCenter,checkBox:true});
   DBGrid.items.addEx({fieldName:"ID",width:40,alignment:taCenter});
   DBGrid.items.addEx({fieldName:"MS",width:118});
   DBGrid.items.addEx({fieldName:"TNAME",width:160});
   DBGrid.items.addEx({fieldName:"KFIELD",width:184});  
   DBGrid.items.addEx({fieldName:"OnlyHost",width:40});  
   DBGrid.createGrid(40);   
</script>

</div>
</td>
<td style="padding:0px 1px 1px 1px">
<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">
<tr><td height="32%">
<textarea style="height:100%;" class="form-control" id="sqlEdit"></textarea>
</td></tr>
<tr><td height="18%">
<textarea style="height:100%;" class="form-control" id="dsqlEdit"></textarea>
</td></tr>
<tr><td height="50%">
<textarea style="height:100%;" class="form-control" id="upsqlEdit"></textarea>
</td></tr>
</table>
</td>
</tr>
</table>
</td></tr>
</table>
</center>
</body>

</html>

