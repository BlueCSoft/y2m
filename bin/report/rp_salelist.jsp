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

<title>���۲�ѯ</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link rel="stylesheet" href="../theme/page.css">

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>
<script src="../js/xmlhttp.js"></script>
<script src="../js/db.js"></script>
<script src="../js/iqrgrids.js?version=101"></script>
<script src="../js/stand.js"></script>
<script src="../js/laydate/laydate.js"></script>
<script>
  function doLoad(){
	__VCL.autoAdjust("#divClient",["#toolpanel","#pagepanel"]);  
   
    __$Query.setCtrlButton(pageInp,btFirst,btPrior,btNext,btLast);
	
    QrGrid.boundQuery(__$Query,false);
   	QrGrid.OnGridElementClick = function(obj,col,fieldName){
	  if(col.linkAttr){
		_$("billinfo").src = "rp_billinfo.jsp?billkey="+__$Query.$("billkey");
		__VCL.showDialog("dialogModal","dialogBody",1106,600);
        //billinfo.src = "rp_billinfo.jsp?billkey="+__$Query.$("billkey");
	    //__xmlHttp.linkTo("rp_billinfo.jsp?billkey="+__$Query.$("billkey"),"new");
	  }
	}
    __$Query.pageSize = 15;
   
    doQuery();
  }
 
  function doQuery(){
    __$Query.getPageCountEx([SDATE.value,EDATE.value,dhInp.value,"<%=plimit.sessionAttr("gStoreId")%>",zgInp.value,syyInp.value],
	                         "rp_salelist_page","rp_salelist");
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
                  <td width="64" align="right"><span class="defaulLabel">��ʼ����</span></td>
                  <td width="108">
                   <input name="SDATE" type="text" class="laydate-icon form-control" id="SDATE" 
                   value="<%=CUtil.getMonthFirstDate("-")%>" style="width:100%;" onClick="laydate()"></td>
                  </td>
                  <td width="64" align="right"><span class="defaulLabel">��������</span></td>
                  <td width="108"> 
                   <input name="EDATE" type="text" class="laydate-icon form-control" id="EDATE" 
                   value="<%=CUtil.getOrigDate("-")%>" style="width:100%;" onClick="laydate()"></td>
                  </td>
                  <td width="64" align="right">��������</td>
                  <td>
                  <select class="form-control" id="xslxList" style="width:80px">
                    <%out.print(new CLexIcon().getOptionsBySqlId("dir_getbillxslx","",session)); %>   			
                  </select>
                  </td>
                  <td width="48" align="right">������</td>
                  <td><input name="dhInp" type="text" class="form-control" id="dhInp" value="" style="width:144px"></td>
                  <td width="88" align="right">ר����ն˺�</td>
                  <td><input name="zgInp" type="text" class="form-control" id="zgInp" value="" style="width:88px"></td>
                  <td width="72" align="right">����Ա����</td>
                  <td><input name="syyInp" type="text" class="form-control" id="syyInp" value="" style="width:88px"></td>
                  <td width="8" align="left"></td>
                  <td width="64" align="left"><button name="btQuery" class="btn btn-primary btn-sm" onClick="doQuery(1);" id="btQuery">
          <span class="glyphicon glyphicon-search"></span> �� ѯ</button></td>
        </tr>
    </table>
  </div>
<div style="height:200px; width:100%; overflow:none" id="divClient">
 <script>
  QrGrid = new TQRGrid();
  QrGrid.setPropertys({name:"QRGrid",crossShowRow:false,tableBgColor:"#cccccc",rowBackGround:"#ffffff",usePre:false,
                       titleHeight:28,userActiceRow:true,tableClass:"table rtable",fixedColNumber:2});
  QrGrid.addEx({Caption:"����/������",FieldName:"productcode",AlignMent:"center",Width:120});
  QrGrid.addEx({Caption:"Ʒ��",FieldName:"productname",Width:240});
  QrGrid.addEx({Caption:"���",FieldName:"",AlignMent:"center",Width:96});
  QrGrid.addEx({Caption:"Ʒ��",FieldName:"",AlignMent:"center",Width:96});
  QrGrid.addEx({Caption:"��λ",FieldName:"",AlignMent:"center",Width:56});
  QrGrid.addEx({Caption:"����",FieldName:"price",AlignMent:"center",Width:72,DataFormat:"0.0"});

  QrGrid.addEx({Caption:"����",FieldName:"quantity",AlignMent:"center",Width:56});
  QrGrid.addEx({Caption:"���",FieldName:"totalamount",AlignMent:"right",Width:90,DataFormat:"0.0"});
  QrGrid.addEx({Caption:"�ۿ�",FieldName:"sumdiscount",AlignMent:"right",Width:90,DataFormat:"0.0",b0Space:true});
  QrGrid.addEx({Caption:"Ӧ��",FieldName:"amount",AlignMent:"right",Width:90,DataFormat:"0.0"});

  QrGrid.addEx({Caption:"������",FieldName:"billid",AlignMent:"center",Width:120,linkAttr:true});
  QrGrid.addEx({Caption:"����ʱ��",FieldName:"billdate",AlignMent:"center",Width:150});
  QrGrid.addEx({Caption:"ר���",FieldName:"counterid",AlignMent:"center",Width:88});
  QrGrid.addEx({Caption:"ר����",FieldName:"counter",AlignMent:"center",Width:120});
  QrGrid.addEx({Caption:"����Ա",FieldName:"cashier",AlignMent:"center",Width:120});
  QrGrid.addEx({Caption:"ӪҵԱ",FieldName:"sales",AlignMent:"center",Width:120});
  QrGrid.addEx({Caption:"�ն˺�",FieldName:"mposid",AlignMent:"center",Width:88});
  QrGrid.addEx({Width:0});
  QrGrid.CreateGrid(true);  //��ʾ�����
</script>
</div>
<div id="pagepanel" style="padding-top:8px; border-top:1px solid #CCC">
<% 
   String __dataset = "__$Query"; 
   int __pagesize = 15;
%>
<%@include file="../util/pagetool.jsp"%>    
</div>
</div>
<div id="dialogModal" class="dialogWindow" style="visibility:hidden;">
  <div class="dialogMarkLayer"></div>
  <div class="dialogBody" style="width:400px;height:400px;" id="dialogBody">
  <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" class="">
  <tr><td height="32">
  <div class="dialogTitle">
    ��������
    <span class="glyphicon glyphicon-remove-circle" style="float:right; cursor:pointer" onClick="__VCL.closeDialog('dialogModal');"></span>
  </div>
  </td></tr>
  <tr><td>
   <iframe id="billinfo" style="height:100%; width:100%;" name="billinfo" 
           src="" frameborder=1 scrolling="no" resizeable="no"></iframe></td></tr></table>
  </div>
</div>
</body>

</html>

