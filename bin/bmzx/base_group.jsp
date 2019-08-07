<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*,bluec.base.*"%>
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
<title>用户组设置</title>
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

  var table,ds,DBGrid,tree,tabled,nodes = null;
  
  function doSetCheck(){
	var ncount = nodes.length, nro = 0;
	if(tabled.isEmpty()){
	  while(nro<ncount){
        nodes[nro].setChecked(false);
   	    nro++;
	  }
    }else
	  while(nro<ncount){
	    tabled.moveRecord(nro+1);
        nodes[nro].setChecked(tabled.$("ISUSE")==1);
   	    nro++;
	  }
  }
  
  function doSetValue(){
	var ncount = nodes.length, nro = 0;
	while(nro<ncount){
	  tabled.moveRecord(nro+1);
	  tabled.$set("ISUSE",(nodes[nro].getChecked())? 1:0,false);
	  tabled.post();
   	  nro++;
	}
  }
  
  function doLoad(){
    __VCL.autoAdjust("#divClient",["#toolpanel"]);
	  
    tree = new TTreeView(treediv);
    nodes = tree.getAllNodes();
	
    table = new TTable("SYS_ROLE","#SYS_ROLE",[],{SeqName:"SQ_MAXID",SeqFieldName:"SID"}); 
   
    table.OnInitUpdate = function(dSet){
 	  if(!tabled.isEmpty())
        doSetValue();
	  return true;
    }  
   
    ds = new TDataSource();
    ds.OnDataChange = function(ds,dSet,field){
      btDel.disabled = dSet.isEmpty();
    }
 
    table.addDataSource(ds);
    DBGrid.setDataSource(ds);
    DBGrid.paint();  
   
    tabled = new TTable("SYS_ROLEFUN","#SYS_ROLEFUN",[0]);    
	
    tabled.BeforePost = function(dSet){
 	  if(dSet.$("ISNEW")==-1){
        dSet.setSFV("RS","2");
        dSet.setSFV("RT","3");
	    dSet.setSFV("F1",table.$("SID"));
	    dSet.$set("ISNEW",1);	  
      }
	  return true;   
    }
   
    tabled.OnAfterOpen = function(dSet){
	  doSetCheck();
    }
   
    tabled.BeforeGetData = function(sender,params){
	  return [params[0]];	
	}
	
    tabled.setMasterDataSet(table,"SID","#SYS_ROLEFUN",true);
  }
  
  function doDelete(){
	table.Delete();
	table.applyUpdate();  
  }
   
</script>
</head>
<body onLoad="doLoad();">
<div style="padding-left:4px; padding-right:4px">
 <div id="toolpanel" style="height:40px; padding-top:4px; padding-left:4px">
    <table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td width="8">&nbsp;</td>
        <td align="left" valign="middle">
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
<div style="padding-left:4px;padding-right:4px;padding-bottom:4px;height:520px;" id="divClient">
  <table border="0" width="100%" height="100%">
  <tr><td width="444px">
  <div id="grid" style="position:relative; height:100%; border:1px #CCC solid;border-radius:5px">
  <script>
    DBGrid = new TDBGrid(grid,"grid");
    DBGrid.addColumn({fieldName:"SNAME",width:172});
    DBGrid.addColumn({fieldName:"NOTE",width:220});  
    DBGrid.createGrid(40);
  </script>
  </div>
  </td><td>
  <div id="treediv" style="height:100%; border:1px #CCC solid;border-radius:5px"><%
  try{
    out.print(new CLexIcon().getTreeViewInfoEx("#SYS_ROLEFUN_TREE","",0,1,0,0,"images/",session));
  }catch(Exception ex){
    out.print("构造树型结构产生异常:\n"+ex.getMessage());
  }
%></div>
  </td></tr>
  </table>
</div> 
</div>
</body>
</html>

