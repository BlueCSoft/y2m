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

<title>订单详情</title>
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
    
	QrGrid.OnDrawCell = function(Col,cell,v){
	  if(__$Query.$("billstate")<0&&Col!=null&&!Col.linkAttr){
	    cell.style = "color:#999";
	  }
	  return v;       
    }	
	
	QrGrid.OnGridElementClick = function(obj,col,fieldName){
	  if(col.linkAttr){
		_$("billinfo").src = "rp_billinfo.jsp?billkey="+__$Query.$("billkey");
		__VCL.showDialog("dialogModal","dialogBody",1106,600);
        //billinfo.src = "rp_billinfo.jsp?billkey="+__$Query.$("billkey");
	    //__xmlHttp.linkTo("rp_billinfo.jsp?billkey="+__$Query.$("billkey"),"new");
	  }
	}
   
    __$Query.pageSize = 20;
   
    doQuery();
  }
 
  function doQuery(){
    __$Query.getPageCountEx([SDATE.value,EDATE.value,ddStatus.value,dhInp.value,xslxList.value,
	                         "<%=plimit.sessionAttr("gStoreId")%>",zgInp.value,syyInp.value],
	                         "rp_billlist_page","rp_billlist");
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
<body onLoad="doLoad()" style="margin:0px" scroll="no">
<div style="padding-left:4px; padding-right:4px; height:100%;">
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
                  <td width="64" align="right">订单状态</td>
                  <td>
                  <select class="form-control" id="ddStatus" style="width:120px">
                    <%out.print(new CLexIcon().getOptionsBySqlId("dir_getbillstatus","",session)); %>   			
                  </select>
                  </td>
                  <td width="48" align="right">订单号</td>
                  <td><input name="dhInp" type="text" class="form-control" id="dhInp" value="" style="width:144px"></td>
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
  QrGrid.addEx({Caption:"订单号",FieldName:"billid",AlignMent:"center",Width:120});
  QrGrid.addEx({Caption:"订单时间",FieldName:"billdate",AlignMent:"center",Width:150});
  QrGrid.addEx({Caption:"商品数",FieldName:"quantity",AlignMent:"center",Width:56});
  QrGrid.addEx({Caption:"金额",FieldName:"totalamount",AlignMent:"right",Width:90,DataFormat:"0.00"});
  QrGrid.addEx({Caption:"折扣",FieldName:"sumdiscount",AlignMent:"right",Width:90,DataFormat:"0.00",b0Space:true});
  QrGrid.addEx({Caption:"应收",FieldName:"amount",AlignMent:"right",Width:90,DataFormat:"0.00"});
  QrGrid.addEx({Caption:"收银员",FieldName:"cashier",AlignMent:"center",Width:120});
  QrGrid.addEx({Caption:"营业员",FieldName:"sales",AlignMent:"center",Width:120});
  QrGrid.addEx({Caption:"终端号",FieldName:"mposid",AlignMent:"center",Width:88});
  QrGrid.addEx({Caption:"专柜号",FieldName:"counterid",AlignMent:"center",Width:88});
  QrGrid.addEx({Caption:"专柜名",FieldName:"counter",AlignMent:"center",Width:120});
  QrGrid.addEx({Caption:"收款",FieldName:"paidbycash",AlignMent:"center",Width:56});
  QrGrid.addEx({Caption:"状态",FieldName:"statename",AlignMent:"center",Width:96});
  QrGrid.addEx({addString:"查看明细",allwayShowAdd:true,AlignMent:"center",Width:80,linkAttr:true});
  QrGrid.addEx({Width:0});
  QrGrid.CreateGrid(true);  //显示表格线
</script>
</div>
<div id="pagepanel" style="padding-top:8px; border-top:1px solid #CCC">
<% 
   String __dataset = "__$Query"; 
   int __pagesize = 20;
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
    订单详情
    <span class="glyphicon glyphicon-remove-circle" style="float:right; cursor:pointer" onClick="__VCL.closeDialog('dialogModal');"></span>
  </div>
  </td></tr>
  <tr><td style="background-color:#FFF">
   <iframe id="billinfo" style="height:100%; width:100%;" name="billinfo" 
           src="" frameborder=1 scrolling="no" resizeable="no"></iframe></td></tr></table>
  </div>
</div>

</body>

</html>

