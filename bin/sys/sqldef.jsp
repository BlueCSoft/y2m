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
<title>��ѯ������</title>
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
    table.getDataFromServer("#SYS_SQLDS",[typeSelect.value,opEdit.value]);
	opEdit.value = "";
  }
  
  function AfterInsert(dSet){
    table.setFieldValue("SQL_STYLE",typeSelect.value);
	table.setFieldValue("SQLATT",5);
  }
  
  function doLoad(){
    $("#divClient").css("height",document.documentElement.clientHeight-56); 

    table = new TTable("SYS_SQLDS","#SYS_SQLDS",["B",""]);
   
    table.AfterInsert = AfterInsert;
    table.setFieldProp("SQL_SERVER","S",0);
   
    ds = new TDataSource();
      ds.OnDataChange = function(ds,dSet,field){
    } 

    table.addDataSource(ds);
    ds.addObject(new TDBEdit(sqlEdit,"SQL_SERVER"));  
    DBGrid.setDataSource(ds);
    DBGrid.paint(); 
    //doSelectChange(null);
  }
  
  function callParam(){
     sqlEdit.value = table.applyUpdate();
  }
    
</script>

<body onLoad="doLoad();">
<table width="100%" height="100%"  border="0" id="mainTable">
<tr><td height="40">
    <div style="height:40px; padding-top:4px;font-size:13px">
    <table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td width="460"><table width="100%"  border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td width="40" align="center" onClick="callParam();">����</td>
			<td width="127"><select id="typeSelect" style="width:160px;font-size:13px" onChange="doSelectChange(this);" class="form-control">
			<option value="B" selected>����</option> 
            <option value="D">�ֵ�</option>  	
            <option value="C">����</option>
            <option value="A">����</option>  
            <option value="R">����(POS)</option>  
            <option value="O">����(PC)</option>  	 	
            <option value="S">ϵͳ</option> 
            <option value="I">�ӿ�</option>  		
			<option value="">����</option>  			
			</select></td>
            <td width="40" align="center">����</td>
            <td>
            <input name="opEdit" type="text" id="opEdit" style="width:100%" class="form-control"
			    onKeyDown="if(event.keyCode==13) doSelectChange(this);">
            </td>
          </tr>
        </table></td>
        <td align="left" valign="middle">&nbsp;
          <button name="btIns" class="btn btn-primary btn-sm" id="btIns" onClick="table.insert();">
          <span class="glyphicon glyphicon-plus-sign"></span> �� ��</button>
          <button name="btDel" class="btn btn-primary btn-sm" id="btDel" onClick="table.Delete();">
          <span class="glyphicon glyphicon-remove-circle"></span> ɾ ��</button>
          <button name="btSave" class="btn btn-primary btn-sm" onClick="table.applyUpdate('');">
          <span class="glyphicon glyphicon-book"></span> �� ��</button></td>
      </tr>
    </table>
    </div>
</td></tr>
<tr><td>
    <div style="padding-left:4px;padding-right:4px;padding-bottom:4px;height:520px;" id="divClient">
    <table width="100%" height="100%"  border="0">
    <tr><td width="575px">
    <div id="grid" style="overflow:hidden;border:1px solid #ccc; height:100%; position:relative;border-radius:5px">
    <script>
       DBGrid = new TDBGrid(grid,"grid");
       DBGrid.useActiveProperty = true;
       DBGrid.items.addEx({fieldName:"SQL_ID",width:184}).title.caption = "��ʶ";
       DBGrid.items.addEx({fieldName:"SQL_DS",width:216}).title.caption = "˵��";
       DBGrid.items.addEx({fieldName:"SQL_STYLE",width:32,alignment:taCenter}).title.caption = "����";
       DBGrid.items.addEx({fieldName:"SQLATT",width:90,alignment:taLeft,buttonStyle:cbsSelect}).title.caption = "ִ������";   
       DBGrid.columns[3].pickListNo = [4,5];
       DBGrid.columns[3].pickListName = ["�洢����","SQL���"];
   
       //DBGrid.items.addEx({fieldName:"PROCNAME",width:200}).title.caption = "�洢��������";      
       DBGrid.createGrid(40);   
    </script>
    </div>
    </td>
    <td style="padding:1px 1px 1px 1px" valign="top">
    <textarea class="form-control" style="height:100%; font-size:14px; font-family:'Courier New', Courier, monospace" id="sqlEdit"></textarea>  
    </td>
    </tr>
    </table>
   </div>
  </div>
 </td></tr></table>
</body>

</html>



