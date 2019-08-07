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

<title>������ѯ</title>
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
    <td width="72" align="right">�����ţ�</td>
    <td width="160" align="left" data-field="BILLID">&nbsp;</td>
    <td width="72" align="right">����Ա��</td>
    <td width="144" align="left" data-field="CASHIER">&nbsp;</td>
    <td width="72" align="right">��Ʒ������</td>
    <td width="144" align="left" data-field="BS">&nbsp;</td>
    <td width="72" align="right">�����ۿۣ�</td>
    <td width="144" align="left" data-field="POPZK">&nbsp;</td>
    <td width="72" align="center">��ӡ������</td>
    <td align="left" data-field="PRINTCOUNT">&nbsp;</td>
  </tr>
  <tr>
    <td align="right">�������ͣ�</td>
    <td align="left" data-field="BILLTYPE">&nbsp;</td>
    <td align="right">ӪҵԱ��</td>
    <td align="left" data-field="SALES">&nbsp;</td>
    <td align="right">��Ʒ������</td>
    <td align="left" data-field="QUANTITY">&nbsp;</td>
    <td align="right">�����ۿۣ�</td>
    <td align="left" data-field="RULEZK">&nbsp;</td>
    <td align="center">&nbsp;</td>
    <td align="left">&nbsp;</td>
  </tr>
  <tr>
    <td align="right">����ʱ�䣺</td>
    <td align="left" data-field="BILLDATE">&nbsp;</td>
    <td align="right">��Ա����</td>
    <td align="left" data-field="VIPID">&nbsp;</td>
    <td align="right">�ϼƽ�</td>
    <td align="left" data-field="TOTALAMOUNT">&nbsp;</td>
    <td align="right">�ܼ��ۿۣ�</td>
    <td align="left" data-field="TOTALDISCOUNT">&nbsp;</td>
    <td align="center">&nbsp;</td>
    <td align="left">&nbsp;</td>
  </tr>
  <tr>
    <td align="right">�����̳���</td>
    <td align="left" data-field="STOREID">&nbsp;</td>
    <td align="right">�˿���Ϣ��</td>
    <td align="left" data-field="CUSTOMER">&nbsp;</td>
    <td align="right">��Ա�ۿۣ�</td>
    <td align="left" data-field="VIPDISCOUNT">&nbsp;</td>
    <td align="right">�ϼ��ۿۣ�</td>
    <td align="left" data-field="SUMDISCOUNT">&nbsp;</td>
    <td align="center">&nbsp;</td>
    <td align="left">&nbsp;</td>
  </tr>
  <tr>
    <td align="right">����ר��</td>
    <td align="left" data-field="COUNTERID">&nbsp;</td>
    <td align="right">���߱�ţ�</td>
    <td align="left" data-field="MPOSID">&nbsp;</td>
    <td align="right">��Ʒ�ۿۣ�</td>
    <td align="left" data-field="COUNTERDISCOUNT">&nbsp;</td>
    <td align="right">Ӧ�ս�</td>
    <td align="left" data-field="AMOUNT">&nbsp;</td>
    <td align="center">&nbsp;</td>
    <td align="left">&nbsp;</td>
  </tr>
  </table>
  </div>
<br>  
<div style="font-weight:bold;padding-left:24px; width:100%; text-align:left">��Ʒ�б�</div> 
<div style="width:100%; overflow:none">
 <script>
  QrGrid1 = new TQRGrid();
  QrGrid1.setPropertys({name:"QRGrid1",crossShowRow:false,tableBgColor:"#ffffff",rowBackGround:"#ffffff",usePre:false,
                       titleHeight:28,userActiceRow:false,tableClass:"table rtable"});
  QrGrid1.addEx({Caption:"������",FieldName:"POSCODE",AlignMent:"center",Width:88});
  QrGrid1.addEx({Caption:"Ʒ��",FieldName:"POSNAME",Width:240});
  QrGrid1.addEx({Caption:"��Ʒ����",FieldName:"PRODUCTCODE",Width:112});
  QrGrid1.addEx({Caption:"��Ʒ����",FieldName:"BARCODE",Width:112});
  QrGrid1.addEx({Caption:"��λ",FieldName:"UNIT",AlignMent:"center",Width:40});
  QrGrid1.addEx({Caption:"����",FieldName:"QUANTITY",AlignMent:"center",Width:56});
  QrGrid1.addEx({Caption:"�ۼ�",FieldName:"iprice",AlignMent:"right",Width:90,DataFormat:"0.00"});  
  QrGrid1.addEx({Caption:"���",FieldName:"totalamount",AlignMent:"right",Width:90,DataFormat:"0.00"});
  QrGrid1.addEx({Caption:"�ۿ�",FieldName:"sumdiscount",AlignMent:"right",Width:90,DataFormat:"0.00",b0Space:true});
  QrGrid1.addEx({Caption:"Ӧ��",FieldName:"amount",AlignMent:"right",Width:90,DataFormat:"0.00"});
  QrGrid1.addEx({Width:0});
  QrGrid1.CreateGrid(true);  //��ʾ�����
</script>
</div>
<br>
<div style="font-weight:bold;padding-left:24px; width:100%; text-align:left">֧����ϸ</div>
<div style="width:100%; overflow:none">
 <script>
  QrGrid2 = new TQRGrid();
  QrGrid2.setPropertys({name:"QRGrid2",crossShowRow:false,tableBgColor:"#ffffff",rowBackGround:"#ffffff",usePre:false,
                       titleHeight:28,userActiceRow:false,tableClass:"table rtable"});
  QrGrid2.addEx({Caption:"����",FieldName:"PAYMENTCODE",AlignMent:"center",Width:48});
  QrGrid2.addEx({Caption:"����",FieldName:"PAYMENTNAME",Width:80});
  QrGrid2.addEx({Caption:"֧�����",FieldName:"AMOUNT",AlignMent:"right",Width:88,DataFormat:"0.00"});
  QrGrid2.addEx({Caption:"���",FieldName:"BALANCE",AlignMent:"right",Width:88,DataFormat:"0.00",b0Space:true});
  QrGrid2.addEx({Caption:"��������",FieldName:"SYSY",AlignMent:"right",Width:88,DataFormat:"0.00"});
  
  QrGrid2.addEx({Caption:"���Ż������",FieldName:"REQCODE",Width:160});
  QrGrid2.addEx({Caption:"֧��ƾ֤��",FieldName:"TRADECODE",Width:220});
  QrGrid2.addEx({Caption:"��ˮ��",FieldName:"LSH",AlignMent:"center",Width:88});
  QrGrid2.addEx({Caption:"֧��˵��",FieldName:"TRADE_CHANNEL",Width:104});
  QrGrid2.addEx({Caption:"��Ȩ��",FieldName:"AUTHUNAME",Width:64});

  QrGrid2.addEx({Width:0});
  QrGrid2.CreateGrid(true);  //��ʾ����� 
</script>
</div>
</div>
</body>

</html>

