<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*,bluec.base.*"%>
<jsp:useBean id="plimit" scope="page" class="bluec.base.CLogin"/>
<%
 request.setCharacterEncoding("GBK");
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
 if(!plimit.isLogin(session)){
  out.println(plimit.getLastError());
  return;
 }
 
%>

<html>
<head>

<title>签到签退查询</title>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<link href="../theme/page.css" rel="stylesheet" type="text/css">
<link href="../theme/imobile.css" rel="stylesheet" type="text/css">
<style>

.tdtitle{
    font-size:15px;
	color:#FFF;
	font-family:"微软雅黑";
}

td{
    font-size:14px;
	font-family:"微软雅黑";
}

</style>

<script src="../js/xmlhttp.js"></script>
<script src="../js/db.js"></script>
<script src="../js/qrgrids.js"></script>
<script src="../js/stand.js"></script>

<script>
 var __$Query0 = new TQuery("",10); 
 function doLoad(){
   __$Query.setCtrlButton(pageInp,btFirst,btPrior,btNext,btLast);
	
   QrGrid.boundQuery(__$Query,false);
   __$Query.pageSize = 10;
  
   new TDate(SDATE,btSDATE);
   new TDate(EDATE,btEDATE);
   doQuery();
 }
 
  function doQuery(att){
    __$Query.getPageCountEx([SDATE.value,EDATE.value,zgInp.value,syyInp.value],
	                         "rp_loginoutop_page","rp_loginoutop");
    __$Query.getFirstPage();
  }  

  function doSelectChange(sender){
	__$Query.pageSize = parseInt(sender.value);  
	doQuery()
  }
  
  function doFindPage(){
    __$Query.getPage(inpPage.value);
  }

</script>

</head>
<body leftmargin="0" topmargin="10" onLoad="doLoad();" bgcolor="#ffffff" scroll="auto">
<center>
<table width="880" border="0" cellpadding="1" cellspacing="1">
  <tr>
    <td align="left" valign="top">
      <table width="100%" border="0" cellpadding="0" cellspacing="1" bordercolor="#009933">
        <tr bgcolor="#FFFFFF">
          <td valign="top" style="border:#990000 solid 1px"><table width="100%" border="0" cellpadding="2" cellspacing="0" bordercolor="#dddddd">
            <tr>
              <td height="40" bgcolor="#990000">
              <table border="0" height="100%" width="100%">
                <tr><td class="tdtitle" align="center">签到签退查询</td>
                    <td width="32" valign="bottom" style="color:#CCC; cursor:pointer" onClick="closePage()">关闭</td>
                </tr></table>
              </td>
            </tr>
            <tr>
              <td height="40" align="left"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-left:10px" width="56">&nbsp;</td>
                  <td>&nbsp;
                  </td>
                  <td width="80" align="center">开始日期</td>
                  <td width="120"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td><input name="SDATE" type="text" class="queryinput" id="SDATE" value="<%=CUtil.getOrigDate("-")%>" style="width:100%"></td>
                      <td width="16"><input name="btSDATE" type="button" class="queryinput" value="..." id="btSDATE"></td>
                    </tr>
                  </table></td>
                  <td width="80" align="center">结束日期</td>
                  <td width="120"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td><input name="EDATE" type="text" class="queryinput" id="EDATE" value="<%=CUtil.getOrigDate("-")%>" style="width:100%"></td>
                      <td width="16"><input name="btEDATE" type="button" class="queryinput" value="..." id="btEDATE"></td>
                    </tr>
                  </table></td>
                  <td width="72" align="center">终端号</td>
                  <td width="80" align="center"><input name="zgInp" type="text" class="queryinput" id="zgInp" value="" style="width:80px"></td>
                  <td width="72" align="center">收银员</td>
                  <td width="80" align="center"><input name="syyInp" type="text" class="queryinput" id="syyInp" value="" style="width:80px"></td>
                  <td width="8" align="left"></td>
                  <td width="64" align="left"><input name="btFind" type="button" class="queryinput" value="搜索" style="font-size:14px"
		       id="btFind" onClick="doQuery(1);"></td>
                  </tr>
                </table></td>
              </tr>
            <tr>
              <td align="center" style="padding-left:12px;padding-right:12px">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td valign="top">
  <script>
  QrGrid = new TQRGrid(false,"",28,false,false,false,"序号");
  QrGrid.setPropertys({name:"QRGrid",crossShowRow:false,tableBgColor:"#cccccc",rowBackGround:"#ffffff",usePre:false,
                       titleHeight:28,userActiceRow:false,notShowZero:true});
  QrGrid.addEx({Caption:"时间",FieldName:"dtime",AlignMent:"center",Width:0});
  QrGrid.addEx({Caption:"收银员代码",FieldName:"cashierid",AlignMent:"center",Width:112});
  QrGrid.addEx({Caption:"收银员名称",FieldName:"cashier",AlignMent:"center",Width:112});
  QrGrid.addEx({Caption:"终端号",FieldName:"counterid",AlignMent:"center",Width:112});
  QrGrid.addEx({Caption:"专柜号",FieldName:"gwbh",AlignMent:"center",Width:112});
  QrGrid.addEx({Caption:"方式",FieldName:"lstyle",AlignMent:"center",Width:96});
  QrGrid.CreateGrid(true);  //显示表格线
</script>
</td>
</tr></table>
                </td>
              </tr>
            <tr>
              <td height="8" align="center">&nbsp;</td>
            </tr>
            <tr>
              <td height="40" align="center" bgcolor="#ffffff">
              <table border="0" cellpadding="1" cellspacing="1">
  <tr align="center">
   <td width="40">
      <select id="pageSelect" style="width:40px; height:22px" onChange="doSelectChange(this);">
			<option value="10" selected>10</option>  			
			<option value="15">15</option>  
            <option value="20">20</option>
			<option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
			</select>
   </td>
   <td width="160">
    <span id="pageInp" class="span_navigate" style="width:100%; background-color:#eee"></span> 
   </td>
   <td height="19" align="left" width="172">
   <input type="button" disabled class="button_navigate"  
   id="btFirst" onClick="__$Query.getFirstPage();" value="首页"><input type="button" disabled class="button_navigate" 
   id="btPrior" onClick="__$Query.getPriorPage();" value="上页"><input type="button" disabled class="button_navigate" 
   id="btNext" onClick="__$Query.getNextPage();" value="下页"><input type="button" disabled class="button_navigate" 
   id="btLast" onClick="__$Query.getLastPage();" value="尾页">
   </td>
   <td width="48"><span class="span_navigate" style="width:100%; background-color:#eee">转到：</span></td>
   <td width="24"><input name="inpPage" type="text" class="span_navigate" style="width:100%" id="inpPage" size="3" value="1"></td>
   <td width="20"><span class="span_navigate" style="width:100%; background-color:#eee">页</span></td>
   <td width="40"><input type="button" class="button_navigate" id="btGo" onClick="doFindPage();" value="GO"></td>
  </tr>
</table>	
              </td>
              </tr>
            </table>
            </td>
        </tr>
        
      </table>
    </td>
  </tr>
</table>
</center>
</body>
</html>

