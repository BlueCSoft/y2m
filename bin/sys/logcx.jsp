<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<jsp:useBean id="pLogin" scope="page" class="bluec.base.CLogin"/>
<%
 request.setCharacterEncoding("GBK");
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
 if(pLogin.checkLimit(request)<0){
  out.println(pLogin.getLastError());
  return;
 }
%>

<html>

<head>
<title>使用情况查询</title>
<link href="../theme/neiye.css" rel="stylesheet" type="text/css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">

<jsp:useBean id="pquery" scope="page" class="bluec.base.CQuery"/>
<body bgcolor="#EBE9E3" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" onLoad="doLoad();" scroll="no">
<%
  String[] params={session.getAttribute("gPubYf").toString()+".01",
                   session.getAttribute("gWorkDate").toString(),
				   "","","1","30"};
  try{
   pquery.queryBySqlIDWithParam("#LOGCX",params,session);
   out.print(pquery.formatToXml(""));
   pquery.closeConn();
   
  }catch(Exception ex){
   out.println(request.getRequestURI()+"\n打开数据产生异常:\n"+ex.getMessage());
   pquery.closeConn();
   return;
  }
%>

<script src="../theme/const.js"></script>
<script src="../js/xmlhttp.js"></script>
<script src="../js/dataset.js"></script>
<script src="../js/datasource.js"></script>
<script src="../js/dbgrids.js"></script>
<script src="../js/date2.js"></script>
<script src="../js/db.js"></script>
<script src="../js/stand.js"></script>

<script>
  var table,ds,DBGrid;
  __xmlHttp.pageId = <%=request.getAttribute("pageid").toString()%>;

  function doLoad(){
   table = new TTable(mData,mMeta,mDelta,"");
  
   ds = new TDataSource();
   ds.OnDataChange = function(ds,dSet,field){
   } 
   
   table.addDataSource(ds);
   DBGrid.setDataSource(ds);
   DBGrid.paint();  
   
   new TDate(form1.SDATE,form1.btSDATE);
   new TDate(form1.EDATE,form1.btEDATE);
   
   table.OnPageChange = function(sender){
    pageInp.innerText = "第"+sender.pageNumber+"页,共"+sender.pageCount+"页";
	with(form1){
 	 btFirst.disabled = sender.pageNumber<=1;
 	 btPrior.disabled = btFirst.disabled;
	 btNext.disabled = sender.pageNumber==sender.pageCount;
	 btLast.disabled = btNext.disabled;	
	} 
   }
   
   table.pageSize = 30;
   table.getPageCount("#LOGCX_COUNT",["<%=session.getAttribute("gMerchantId").toString()%>",
                                      form1.SDATE.value,form1.EDATE.value,form1.FUNID.value,
                                      form1.USER.value]);
   table.sqlID = "#LOGCX";
  }

  function doQuery(att){
   table.__innerNoDataHint = typeof(att)!="undefined";
   var t1 = new Date(); 
   table.getPageCount("#LOGCX_COUNT",["<%=session.getAttribute("gMerchantId").toString()%>",
                                      form1.SDATE.value,form1.EDATE.value,form1.FUNID.value,
                                      form1.USER.value]);
   table.getFirstPage();
   alert(new Date()-t1);
  }	
  
</script>
</head>

<form name="form1" action="" method="post">
<table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0" bordercolor="#ffffff" bgcolor="#FFFFFF" class="tabletop">
  <tr>
    <td height="20">
	  <table width="100%" border="0" cellpadding="0" cellspacing="0" class="tdmenutop">
        <tr> 
          <td bgcolor="#018cd1" width="40" style="padding:0px 0px 0px 6px;color:#FFFFFF; font-size:12px">
		  <nobr>使用情况查询</nobr></td>
		  <td width="34"><img src="../images/AddInfoMainTitle.jpg" border="0"></td>		
		  <td>&nbsp;</td>  		  
		  <td width="80" align="right"><input name="btClose" type="button" class="button_6" id="btClose" onClick="closePage();" value="&times;"></td>
        </tr>
      </table>
	</td>
  </tr>

   <tr>
    <td height="30" align="center"><table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td width="680"><table width="100%"  border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td><table width="100%"  border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td width="56" height="24" align="right"><nobr>时间从：</nobr></td>
                <td width="92"><input name="SDATE" type="text" class="textinput" id="SDATE" 
				size="10" value="<%=params[1]%>"><input name="btSDATE" type="button" class="button_6" id="btSDATE" value="…"></td>
                <td width="32" align="right">到：</td>
                <td width="92"><input name="EDATE" type="text" class="textinput" id="EDATE" 
				size="10" value="<%=params[2]%>"><input name="btEDATE" type="button" class="button_6" id="btEDATE" value="…"></td>
                <td width="56" align="right">操作员：</td>
                <td width="48" align="right"><input name="USER" type="text" class="textinput" id="USER" 
				size="17"></td>
                <td width="48" align="right">功能：</td>
                <td><input name="FUNID" type="text" class="textinput" id="FUNID"
				     size="29"></td>
              </tr>
            </table>
</td>
          </tr>
        </table></td>
        <td align="left" valign="middle">
          <input name="btQuery" type="button" class="button_b3" id="btQuery" onClick="doQuery(1);" 
		   value="查 询">
          <input name="btFirst" type="button" disabled class="button_2" 
   id="btFirst" onClick="table.getFirstPage();" value="首页"><input name="btPrior" type="button" disabled 
   class="button_2" id="btPrior" onClick="table.getPriorPage();" value="上页"><input name="btNext" type="button" disabled 
   class="button_2" id="btNext" onClick="table.getNextPage();" value="下页"><input name="btLast" type="button" disabled 
   class="button_2" id="btLast" onClick="table.getLastPage();" value="尾页">
          <input name="btClose" type="button" class="button_b3" value="关 闭"
		  onClick="closePage();" id="btClose"></td> 
	  <td valign="middle">
      <span id="pageInp"></span></td>  	   
      </tr>
    </table></td>
  </tr>
<tr><td style="padding:3px 3px 3px 3px">
<div style=" border:1px solid #999999;overflow:hidden;width:100%;height:100%;" id="grid">
<script>
   DBGrid = new TDBGrid(grid,"grid");
   DBGrid.readOnly = true;
   DBGrid.items.addEx({fieldName:"USERCODE",width:64}).title.caption = "人员编号";
   DBGrid.items.addEx({fieldName:"USERNAME",width:80}).title.caption = "人员名称";   
   DBGrid.items.addEx({fieldName:"FUN_ID",width:64}).title.caption = "功能号";   
   DBGrid.items.addEx({fieldName:"FUN_NAME",width:200}).title.caption = "功能名称";   
   DBGrid.items.addEx({fieldName:"IP",width:120}).title.caption = "IP地址";   
   DBGrid.items.addEx({fieldName:"STIME",width:128,alignment:taCenter}).title.caption = "进入时间";   
   DBGrid.items.addEx({fieldName:"ETIME",width:128,alignment:taCenter}).title.caption = "离开时间";    
   DBGrid.items.addEx({fieldName:"TIMES",width:96}).title.caption = "持续时间"; 
   DBGrid.createGrid(40);   
</script>

</div>
</td></tr>
</table>
</form>
</body>

</html>

