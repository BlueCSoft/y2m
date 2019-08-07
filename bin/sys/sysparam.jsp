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

<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<title>系统参数设置</title>
<link href="../theme/neiye.css" rel="stylesheet" type="text/css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">

<script src="../theme/const.js"></script>
<script src="../js/xmlhttp.js"></script>
<script src="../js/dataset.js"></script>
<script src="../js/datasource.js"></script>
<script src="../js/treeview.js"></script>
<script src="../js/dbgrids.js"></script>
<script src="../js/db.js"></script>
<script>

  var table,ds,DBGrid,table1,ds1,DBGrid1,_ofind;
 
 function codeFieldChange(field){
  field.OnChange = null;
  var cData = table1.getFieldValue("LEXICONID");
  var value = field.getFieldValue();
  var result = true;
  var isClear = !field.awOpen&&field.isNull&&value=="";
  
   if(cData=="FEEITEM")
    if(isClear)
	 table1.setValueByResult(true,["PARAM"],[""]);
	else{    
     _ofind.OnGetParams = function(){
 	  this.sparams = ["",value]; 
 	 }
     result = _ofind.readDataEx("../lib/find_fyxm_ta.jsp",
                                "#FIND_FYXM_COUNT","#FIND_FYXM",value);
     table1.setValueByResult(result,["PARAM"],_ofind.results,["PARAM"]);
    }
     
   if(cData=="BM")
    if(isClear)
	 table1.setValueByResult(true,["PARAM"],[""]);
	else{    
     result = _ofind.readDataEx("../lib/find_bm_t.jsp",
                               "#FIND_BM_COUNT","#FIND_BM",value);
     table1.setValueByResult(result,["PARAM"],_ofind.results,["PARAM"]);
    }
	
  field.OnChange = codeFieldChange;  
  return result;
 } 
  
 function wsFieldChange(field){
  field.OnChange = null;
  table.setFieldValue("ZWS",table.getFieldValue("WS1")+table.getFieldValue("WS2")+
                            table.getFieldValue("WS3")+table.getFieldValue("WS4")+
							table.getFieldValue("WS5"));
  table.setFieldValue("PARAM",table.getFieldValue("WS1")+","+table.getFieldValue("WS2")+","+
                            table.getFieldValue("WS3")+","+table.getFieldValue("WS4")+","+
							table.getFieldValue("WS5"));
  field.OnChange = wsFieldChange;
 }   
 
  function OnInputCRKeyDown(grid,colomn,value){
   var field = colomn.field;
   var result = crContinue;
   if(field!=null){
    var fieldName = field.fieldName;
    if(value!=field.priorValue||field.awOpen)
     if(fieldName=="PARAM"||table1.getFieldValue("LEXICONID")!=""){
       field.sField.value = value;
       if(codeFieldChange(field))
 	    result = crVChanged;
 	   else result = crAbort; 
     }
   }	
   return result;
  }  
  
  function doLoad(){
   table = new TTable(mData,mMeta,mDelta,"SYS_PARAM");
   table.readOnly = <%=session.getAttribute("gUserLevel").toString()%>>=0;  
      
   table.fieldByName["WS1"].OnChange = wsFieldChange;
   table.fieldByName["WS2"].OnChange = wsFieldChange;
   table.fieldByName["WS3"].OnChange = wsFieldChange;
   table.fieldByName["WS4"].OnChange = wsFieldChange;
   table.fieldByName["WS5"].OnChange = wsFieldChange;            
   ds = new TDataSource();
   table.addDataSource(ds);
   DBGrid.setDataSource(ds);
   DBGrid.paint(); 
   
   table1 = new TTable(dData,dMeta,dDelta,"SYS_PARAM");
   table1.readOnly = <%=session.getAttribute("gUserLevel").toString()%>>=0;  
      
   table1.fieldByName["PARAM"].OnChange = codeFieldChange;
   ds1 = new TDataSource();
   table1.addDataSource(ds1);
   DBGrid1.setDataSource(ds1);
   DBGrid1.paint(); 
   
   DBGrid1.OnInputCRKeyDown = OnInputCRKeyDown;

   DBGrid1.OnSetButtonStyle = function(sender,column,hasButton){
    if(table1.getFieldValue("LEXICONID")=="")
	 return cbsAuto;
	else return hasButton; 
   }
   _ofind = new TFindObject("",400,280,"","");   
  }
  
  function doSave(){
   applyUpdates([table,table1]);
  } 
  
  function doDel(att){
   if((att==0&&confirm("确定要删除所有业务数据吗?"))||
       (att==1&&confirm("确认要删除所有基础和业务数据吗?")))
    if(__xmlHttp.executeProc("ClearData",
	                         [att,""])==0){
     alert("数据删除操作成功.");
	 window.close();
    }												    
  }
</script>
<jsp:useBean id="pquery" scope="page" class="bluec.base.CLexIcon"/>
<%
  try{
   pquery.queryBySqlIDWithParam("#SYS_PARAM","0",session);
   out.print(pquery.formatToXml("SYS_PARAM"));   
   pquery.queryBySqlIDWithParam("#SYS_PARAM","1",session);
   out.print(pquery.formatToXml("SYS_PARAM","d"));   
  }catch(Exception ex){
   out.println(request.getRequestURI()+"\n打开数据产生异常:\n"+ex.getMessage());
  }finally{
   pquery.closeConn();
  }   
%>
</head>
<body bgcolor="#EBE9E3" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" onLoad="doLoad();">
<table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0" bordercolor="488aa0" bgcolor="#FFFFFF" class="tabletop">
  <tr>
    <td height="20">
	  <table width="100%" border="0" cellpadding="0" cellspacing="0" class="tdmenutop">
        <tr> 
          <td bgcolor="#018cd1" width="80" style="padding:0px 0px 0px 6px;color:#FFFFFF">系统参数设置</td>
		  <td width="34"><img src="../images/AddInfoMainTitle.jpg" border="0"></td>		  		  		  
		  <td>&nbsp;</td>		  
        </tr>
      </table>
	</td>
  </tr>
  <tr>
    <td height="32" align="center" bgcolor="#eeeeff"><table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td align="left" valign="middle">&nbsp;
          <input name="btSave" type="button" class="button_b3" id="btSave" onClick="doSave();" value="保 存">	
		  <input name="btDel" type="button" class="button_b5" id="btDel" onClick="doDel(0);" value="删除业务数据">	 
		  <input name="btDelAll" type="button" class="button_b5" id="btDelAll" onClick="doDel(1);" value="删除所有数据"> 
          </td>
      </tr>
    </table></td>
  </tr>
  <tr>
    <td valign="top" width="100%">
	 <table width="560" border="0" cellpadding="0" cellspacing="0" bgcolor="#eeeeee">
<tr><td height="24" valign="bottom" bgcolor="#FFFFFF" style="padding:2px 2px 2px 2px">&nbsp;<b>代码位数控制</b></td>
</tr>	 
<tr valign="top">
        <td height="190" bgcolor="#FFFFFF" style="padding:2px 2px 2px 2px">
<div id="grid" style="overflow:hidden;border:1px solid #666666;height:100%;width:100%">
<script>
  DBGrid = new TDBGrid(grid,"grid");
  DBGrid.autoInsert = false;
  DBGrid.items.addEx({fieldName:"ID",width:72,alignment:taCenter,readOnly:true});
  DBGrid.items.addEx({fieldName:"BZ",width:260});
  DBGrid.items.addEx({fieldName:"ZWS",width:40,alignment:taCenter,readOnly:true});  
  DBGrid.items.addEx({fieldName:"WS1",width:16,alignment:taCenter});  
  DBGrid.items.addEx({fieldName:"WS2",width:16,alignment:taCenter});  
  DBGrid.items.addEx({fieldName:"WS3",width:16,alignment:taCenter});  
  DBGrid.items.addEx({fieldName:"WS4",width:16,alignment:taCenter});  
  DBGrid.items.addEx({fieldName:"WS5",width:16,alignment:taCenter});  	      
  DBGrid.createGrid(15);
</script></div>
</td>
</tr>
<tr><td height="24" valign="bottom" bgcolor="#FFFFFF" style="padding:2px 2px 2px 2px">&nbsp;<b>全局参数控制</b></td>
</tr>	 
<tr valign="top">
        <td height="190" bgcolor="#FFFFFF" style="padding:2px 2px 2px 2px">
<div id="grid1" style="overflow:hidden;border:1px solid #666666;height:100%;width:100%">
<script>
  DBGrid1 = new TDBGrid(grid1,"grid1");
  DBGrid1.items.addEx({fieldName:"ID",width:72,alignment:taCenter,readOnly:true});
  DBGrid1.items.addEx({fieldName:"BZ",width:260});
  DBGrid1.items.addEx({fieldName:"PARAM",width:120,buttonStyle:cbsOpen});  
  DBGrid1.createGrid(15);
</script></div>
</td>
</tr>
     </table>  
    </td>
  </tr>
</table>
</body>
</html>

