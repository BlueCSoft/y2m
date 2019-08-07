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

<title>销售汇总表</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link rel="stylesheet" href="../theme/page.css">

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>
<script src="../js/xmlhttp.js"></script>
<script src="../js/db.js?version=102"></script>
<script src="../js/iqrgrids.js?version=101"></script>
<script src="../js/stand.js"></script>
<script src="../js/laydate/laydate.js"></script>
<script>
  function doLoad(){
	__VCL.autoAdjust("#divClient",["#toolpanel","#pagepanel"]);  
   
    QrGrid.boundQuery(__$Query,false);
    
	//计算字段
	__$Query.OnCalField = function(sender,rowindex){
	  __$Query.$setFV("BSZB",(parseFloat(__$Query.$("bs"))/parseFloat(__$Query.getSumValue("bs"))*100).toFixed(2));
	  __$Query.$setFV("JEZB",(parseFloat(__$Query.$("je"))/parseFloat(__$Query.getSumValue("je"))*100).toFixed(2));
	}
    __$Query.pageSize = 15;
   
    doQuery();
  }
 
  function doQuery(){
    __$Query.getPageCountEx([SDATE.value,EDATE.value,"<%=plimit.sessionAttr("gStoreId")%>",zgInp.value,syyInp.value],
	                         "rp_paysum_page","rp_paysum");
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
<body onLoad="doLoad()">
<div style="padding-left:4px; padding-right:4px">
  <div id="toolpanel" style="padding:4px">
    <table>
           <tr>
                  <td width="64" align="right"><span class="defaulLabel">开始日期</span></td>
                  <td width="108">
                   <input name="SDATE" type="text" class="laydate-icon form-control" id="SDATE" 
                   value="<%=CUtil.getMonthFirstDate("-")%>" style="width:100%;" onClick="laydate()"></td>
                  </td>
                  <td width="64" align="right"><span class="defaulLabel">结束日期</span></td>
                  <td width="108"> 
                   <input name="EDATE" type="text" class="laydate-icon form-control" id="EDATE" 
                   value="<%=CUtil.getOrigDate("-")%>" style="width:100%;" onClick="laydate()"></td>
                  </td>
                  <td width="64" align="right">销售类型</td>
                  <td>
                  <select class="form-control" id="xslxList" style="width:80px">
                    <%out.print(new CLexIcon().getOptionsBySqlId("dir_getbillxslx","",session)); %>   			
                  </select>
                  </td>
                   <td width="88" align="right">专柜或终端号</td>
                  <td><input name="zgInp" type="text" class="form-control" id="zgInp" value="" style="width:88px"></td>
                  <td width="72" align="right">收银员代码</td>
                  <td><input name="syyInp" type="text" class="form-control" id="syyInp" value="" style="width:88px"></td>
                  <td width="8" align="left"></td>
                  <td width="64" align="left"><button name="btQuery" class="btn btn-primary btn-sm" onClick="doQuery(1);" id="btQuery">
          <span class="glyphicon glyphicon-search"></span> 查 询</button></td>
        </tr>
    </table>
  </div>
<div style="height:200px; width:100%; overflow:none" id="divClient">
 <script>
  QrGrid = new TQRGrid();
  QrGrid.setPropertys({name:"QRGrid",crossShowRow:false,tableBgColor:"#cccccc",rowBackGround:"#ffffff",usePre:false,
                       titleHeight:28,userActiceRow:true,tableClass:"table rtable"});
  QrGrid.addEx({Caption:"代码",FieldName:"paymentcode",AlignMent:"center",Width:88});
  QrGrid.addEx({Caption:"名称",FieldName:"paymentname",Width:160});
  QrGrid.addEx({Caption:"笔数",FieldName:"bs",AlignMent:"center",Width:72});
  QrGrid.addEx({Caption:"金额",FieldName:"je",AlignMent:"right",Width:104,DataFormat:"0.0"});
  QrGrid.addEx({Caption:"笔数占比",FieldName:"bszb",AlignMent:"right",Width:96,addString:"%"});
  QrGrid.addEx({Caption:"金额占比",FieldName:"jezb",AlignMent:"right",Width:96,addString:"%"});
  QrGrid.addEx({Width:0});
  QrGrid.CreateGrid(true);  //显示表格线
</script>
</div>
</div>
</body>

</html>

