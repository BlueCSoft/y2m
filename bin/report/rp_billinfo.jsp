<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*,bluec.base.*"%>
<jsp:useBean id="plimit" scope="page" class="bluec.base.CLogin"/>
<%
  request.setCharacterEncoding("GBK");
  response.addHeader("Expires","0");
  response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
  response.addHeader("Pragma", "public"); 
  if(!plimit.isLogin(request.getSession())){
    return;
  }
%>

<!DOCTYPE html>
<head>

<title>订单查询</title>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link rel="stylesheet" href="../theme/page.css">

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>
<script src="../js/xmlhttp.js"></script>
<script src="../js/db.js"></script>
<script src="../js/iqrgrids.js?version=101"></script>
<script>
  var __$Query1 = new TQuery();
  var __$Query2 = new TQuery();
  
  function doLoad(){
	QrGrid1.boundQuery(__$Query1,false);
	QrGrid2.boundQuery(__$Query2,false);
    doQuery(<%=request.getParameter("billkey").toString()%>);
  }
 
  function doQuery(billkey){
    __$Query.Query("PosBill",[billkey]);
	__$Query.refreshCtrl();
	__$Query1.Query("PosBillProducts",[billkey]);
	__$Query2.Query("PosBillPayment",[billkey]);
  }  

</script>

</head>
<body onLoad="doLoad()" style="margin:0px" scroll="no">
<div style="padding-left:4px; padding-right:4px; height:100%; width:1100px; text-align:center;">
  <div id="toolpanel" style="padding:4px; width:100%; border-bottom:1px solid #CCC">
    <table border="0" width="100%">
  <tr>
    <td width="72" align="right">订单号：</td>
    <td width="160" align="left" data-field="BILLID">&nbsp;</td>
    <td width="72" align="right">收银员：</td>
    <td width="144" align="left" data-field="CASHIER">&nbsp;</td>
    <td width="72" align="right">商品笔数：</td>
    <td width="144" align="left" data-field="BS">&nbsp;</td>
    <td width="72" align="right">促销折扣：</td>
    <td width="144" align="left" data-field="POPZK">&nbsp;</td>
    <td width="72" align="center">打印次数：</td>
    <td align="left" data-field="PRINTCOUNT">&nbsp;</td>
  </tr>
  <tr>
    <td align="right">订单类型：</td>
    <td align="left" data-field="BILLTYPE">&nbsp;</td>
    <td align="right">营业员：</td>
    <td align="left" data-field="SALES">&nbsp;</td>
    <td align="right">商品件数：</td>
    <td align="left" data-field="QUANTITY">&nbsp;</td>
    <td align="right">整单折扣：</td>
    <td align="left" data-field="RULEZK">&nbsp;</td>
    <td align="center">&nbsp;</td>
    <td align="left">&nbsp;</td>
  </tr>
  <tr>
    <td align="right">销售时间：</td>
    <td align="left" data-field="BILLDATE">&nbsp;</td>
    <td align="right">会员卡：</td>
    <td align="left" data-field="VIPID">&nbsp;</td>
    <td align="right">合计金额：</td>
    <td align="left" data-field="TOTALAMOUNT">&nbsp;</td>
    <td align="right">总价折扣：</td>
    <td align="left" data-field="TOTALDISCOUNT">&nbsp;</td>
    <td align="center">&nbsp;</td>
    <td align="left">&nbsp;</td>
  </tr>
  <tr>
    <td align="right">所属商场：</td>
    <td align="left" data-field="STOREID">&nbsp;</td>
    <td align="right">顾客信息：</td>
    <td align="left" data-field="CUSTOMER">&nbsp;</td>
    <td align="right">会员折扣：</td>
    <td align="left" data-field="VIPDISCOUNT">&nbsp;</td>
    <td align="right">合计折扣：</td>
    <td align="left" data-field="SUMDISCOUNT">&nbsp;</td>
    <td align="center">&nbsp;</td>
    <td align="left">&nbsp;</td>
  </tr>
  <tr>
    <td align="right">所属专柜：</td>
    <td align="left" data-field="COUNTERID">&nbsp;</td>
    <td align="right">机具编号：</td>
    <td align="left" data-field="MPOSID">&nbsp;</td>
    <td align="right">单品折扣：</td>
    <td align="left" data-field="COUNTERDISCOUNT">&nbsp;</td>
    <td align="right">应收金额：</td>
    <td align="left" data-field="AMOUNT">&nbsp;</td>
    <td align="center">&nbsp;</td>
    <td align="left">&nbsp;</td>
  </tr>
  </table>
  </div>
<br>  
<div style="font-weight:bold;padding-left:24px; width:100%; text-align:left">商品列表</div> 
<div style="width:100%; overflow:none">
 <script>
  QrGrid1 = new TQRGrid();
  QrGrid1.setPropertys({name:"QRGrid1",crossShowRow:false,tableBgColor:"#ffffff",rowBackGround:"#ffffff",usePre:false,
                       titleHeight:28,userActiceRow:false,tableClass:"table rtable"});
  QrGrid1.addEx({Caption:"销售码",FieldName:"POSCODE",AlignMent:"center",Width:88});
  QrGrid1.addEx({Caption:"品名",FieldName:"POSNAME",Width:240});
  QrGrid1.addEx({Caption:"商品货号",FieldName:"PRODUCTCODE",Width:112});
  QrGrid1.addEx({Caption:"商品条码",FieldName:"BARCODE",Width:112});
  QrGrid1.addEx({Caption:"单位",FieldName:"UNIT",AlignMent:"center",Width:40});
  QrGrid1.addEx({Caption:"数量",FieldName:"QUANTITY",AlignMent:"center",Width:56});
  QrGrid1.addEx({Caption:"售价",FieldName:"iprice",AlignMent:"right",Width:90,DataFormat:"0.00"});  
  QrGrid1.addEx({Caption:"金额",FieldName:"totalamount",AlignMent:"right",Width:90,DataFormat:"0.00"});
  QrGrid1.addEx({Caption:"折扣",FieldName:"sumdiscount",AlignMent:"right",Width:90,DataFormat:"0.00",b0Space:true});
  QrGrid1.addEx({Caption:"应收",FieldName:"amount",AlignMent:"right",Width:90,DataFormat:"0.00"});
  QrGrid1.addEx({Width:0});
  QrGrid1.CreateGrid(true);  //显示表格线
</script>
</div>
<br>
<div style="font-weight:bold;padding-left:24px; width:100%; text-align:left">支付明细</div>
<div style="width:100%; overflow:none">
 <script>
  QrGrid2 = new TQRGrid();
  QrGrid2.setPropertys({name:"QRGrid2",crossShowRow:false,tableBgColor:"#ffffff",rowBackGround:"#ffffff",usePre:false,
                       titleHeight:28,userActiceRow:false,tableClass:"table rtable"});
  QrGrid2.addEx({Caption:"代码",FieldName:"PAYMENTCODE",AlignMent:"center",Width:48});
  QrGrid2.addEx({Caption:"名称",FieldName:"PAYMENTNAME",Width:80});
  QrGrid2.addEx({Caption:"支付金额",FieldName:"AMOUNT",AlignMent:"right",Width:88,DataFormat:"0.00"});
  QrGrid2.addEx({Caption:"余额",FieldName:"BALANCE",AlignMent:"right",Width:88,DataFormat:"0.00",b0Space:true});
  QrGrid2.addEx({Caption:"代币溢余",FieldName:"SYSY",AlignMent:"right",Width:88,DataFormat:"0.00"});
  
  QrGrid2.addEx({Caption:"卡号或请求号",FieldName:"REQCODE",Width:160});
  QrGrid2.addEx({Caption:"支付凭证号",FieldName:"TRADECODE",Width:220});
  QrGrid2.addEx({Caption:"流水号",FieldName:"LSH",AlignMent:"center",Width:88});
  QrGrid2.addEx({Caption:"支付说明",FieldName:"TRADE_CHANNEL",Width:104});
  QrGrid2.addEx({Caption:"授权人",FieldName:"AUTHUNAME",Width:64});

  QrGrid2.addEx({Width:0});
  QrGrid2.CreateGrid(true);  //显示表格线 
</script>
</div>
</div>
</body>

</html>

