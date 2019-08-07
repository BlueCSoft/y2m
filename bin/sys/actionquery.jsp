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

<html xmlns:v="urn:schemas-microsoft-com:vml">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<title>重要操作查询</title>
<link href="../theme/page.css" rel="stylesheet" type="text/css">

<script src="../theme/const.js"></script>
<script src="../theme/dataset.js"></script>
<script src="../theme/datasource.js"></script>
<script src="../theme/dbctrls.js"></script>
<script src="../theme/dbgrids.js"></script>
<script src="../theme/date.js"></script>
<style>
  td  {font-size:12px;}
  v\:* { BEHAVIOR: url(#default#VML) }
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
}
</style>
<script>


  var table = null;
  var ds = null;
  var DBGrid;
  //字段值变化时
  function doLoad(){
   table = new TTable(mData,mMeta,mDelta,"APPUSERS");
   ds = new TDataSource();
   table.addDataSource(ds);
   DBGrid.SetDataSource(ds);
   

   DBGrid.Paint(); 
   
}
</script>
</head>
<jsp:useBean id="pquery" scope="page" class="bluec.base.CQuery"/>
<%
  String SQL_TYPE="";
  try{
   ResultSet rs = pquery.queryBySql("SELECT USERID,USERNAME,LOGNAME,ORGID,IP_ADDR,CREATEBY FROM APPUSERS",
                                    session);
   out.print(pquery.formatToXml("APPUSERS"));
   pquery.closeConn();
  }catch(Exception ex){
   out.println(request.getRequestURI()+"\n打开数据产生异常:\n"+ex.getMessage());
   pquery.closeConn();
   return;
  }
%>
<body onLoad="doLoad();">
<form name="queryCondition">
<table width="100%" height="100%" border="0" cellspacing="0" cellpadding="1">
  <tr>
    <td height="32" align="center" bgcolor="#eeeeff"><table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td width="67%"><table width="100%"  border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td><nobr>&nbsp;开始日期：
                  <input type="text" name="txtStartDate" class="textinputquery" size="10" value ="" readonly><script>
                	document.write("<input type=button class='button_date' onclick='popUpCalendar(this, queryCondition.txtStartDate, \"yyyy-mm-dd\")' value=''>");
				</script>
                  　结束日期：
            <input type="text" name="txtEndDate" class="textinputquery" size="10" value ="" readonly><script>
                        document.write("<input type=button class='button_date' onclick='popUpCalendar(this, queryCondition.txtEndDate, \"yyyy-mm-dd\")' value=''>");
                    </script>&nbsp;功&nbsp;&nbsp;能：
                    <input name="textfield" type="text" class="inputtext2">
            </nobr></td>
          </tr>
          <tr>
            <td>&nbsp;单&nbsp;&nbsp;位：
              <input name="textfield2" type="text" class="inputtext2">
              &nbsp;&nbsp;操作员：
              <input name="textfield22" type="text" class="inputtext2"></td>
          </tr>
        </table></td>
        <td width="33%" align="center" valign="middle"><input name="Submit" type="button" class="button_b3" value="查 询"
		  onClick="table.applyUpdate();">
          <input name="Submit3" type="button" class="button_b3" value="打印">
          </td>
      </tr>
    </table></td>
  </tr>
  <tr><td height="1" bgcolor="#333333"></td></tr>
  <tr>
    <td height="20" align="right" valign="bottom">首页 上页 下页 尾页 第 <strong>X </strong>页/共 <strong>Y </strong>页&nbsp;&nbsp;</td>
  </tr>  
  <tr>
    <td valign="top">
	<div id="grid" style="overflow:hidden;border:1px solid #CCCCCC;left:1px;top:0px;width:100%;height:100%;">
	<script>
	   DBGrid = new TDBGrid(grid,"grid");
   DBGrid.TitleLinebs = 1;
   DBGrid.RowHeight = 18;
   //DBGrid.Options.dgIndicator = false;
   DBGrid.Options.dbEditing = false;
   DBGrid.UseActiveProperty = true;

   DBGrid.Items.AddEx({LexIconID:"RecNo",Width:40,Alignment:taCenter}).Title.Caption = "序号";
   DBGrid.Items.AddEx({FieldName:"",Width:200}).Title.Caption = "执行的内容";      
   DBGrid.Items.AddEx({FieldName:"",Width:120}).Title.Caption = "执行时间";      
   DBGrid.Items.AddEx({FieldName:"USERID",Width:80}).Title.Caption = "操作员";
   DBGrid.Items.AddEx({FieldName:"",Width:120}).Title.Caption = "单位";
   DBGrid.Items.AddEx({FieldName:"",Width:120}).Title.Caption = "IP地址";


   DBGrid.CreateGrid();
	</script>
	</div></td>
  </td>
  </tr>
</table>
</form>
</body>
</html>

