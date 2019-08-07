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
 
 String gid = request.getParameter("gid").toString();
%>

<!DOCTYPE html>

<head>
<title>接口测试</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link href="../theme/page.css" rel="stylesheet" type="text/css">
<script src="../theme/const.js"></script>

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>

<script src="../js/xmlhttp.js"></script>
<script src="../js/db.js"></script>
<script src="../js/iqrgrids.js?version=101"></script>

<script>
  
  function doSelectChange(sender){
    __$Query.Query("#SYS_IFACETEST<%=gid%>",[typeSelect.value,inpEdit.value]);
	inpEdit.value = "";
  }
  
  function doLoad(){
	__VCL.autoAdjust("#divClient",["#toolpanel"]);  
 	
    QrGrid.boundQuery(__$Query,false);
	__$Query.OnDataChange = function(){
	  REQTEXT.value = __$Query.$("REQTEXT");	
	  SRESULT.value = "";
	}

    doSelectChange();
  }
    
  function doCall(){   
    if(!__$Query.isEmpty){
	  var params = REQTEXT.value;	
      if(__$Query.$("ISJSON")==1){
        SRESULT.value = __xmlHttp.requestPagePost("<%=request.getContextPath()%>"+__$Query.$("SFILE"),params).trim();	
	  }else
		params = params.replace(/\n/g,"&");  
	    SRESULT.value = __xmlHttp.requestPage("<%=request.getContextPath()%>"+__$Query.$("SFILE")+"?"+params).trim();  	
	}
  }
</script>

<body onLoad="doLoad();" scroll="no">
<div style="height:48px;" id="toolpanel">
  <table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
   <tr>
     <td width="40" align="center" onClick="callParam();">分类</td>
	 <td width="127">
       <select id="typeSelect" style="width:120px;" onChange="doSelectChange(this);" class="form-control">
	   <%out.print(new CLexIcon().getOptionsBySqlId("dir_getifacestype"+gid,"",session)); %>   
	   </select>
     </td>
     <td width="160">
       <input type="text" id="inpEdit" class="form-control" onKeyDown="if(event.keyCode==13) doSelectChange(this);">
     </td>
     <td align="left" style="padding-left:8px">
      <button name="btQuery" class="btn btn-primary btn-sm" onClick="doSelectChange();" id="btQuery">
          <span class="glyphicon glyphicon-search"></span> 查 询</button>
      <button name="btQuery" class="btn btn-primary btn-sm" onClick="doCall();" id="btQuery">
          <span class="glyphicon glyphicon-play"></span> 测试接口</button>    
     </td>
   </tr>
  </table>
</div>
<div style="padding-left:4px;padding-right:4px;padding-bottom:4px;height:520px;" id="divClient">
  <table width="100%" height="100%"  border="0">
    <tr><td width="480px">
    <div id="grid" style="overflow:hidden;border:1px solid #ccc; height:100%; position:relative;border-radius:5px">
    <script>
       QrGrid = new TQRGrid();
       QrGrid.setPropertys({name:"QRGrid",crossShowRow:false,tableBgColor:"#cccccc",rowBackGround:"#ffffff",usePre:false,
                       titleHeight:28,userActiceRow:true,tableClass:"table rtable"});
       QrGrid.addEx({Caption:"接口名称",FieldName:"SNAME",Width:122});
       QrGrid.addEx({Caption:"接口文件",FieldName:"SFILE",Width:0});
       QrGrid.addEx({Caption:"JSON参数",FieldName:"ISJSON",Width:72,valueStyle:qrvsCheckBox,AlignMent:"center"});
       QrGrid.CreateGrid(true); 
    </script>
    </div>
    </td>
    <td style="padding:1px 1px 1px 1px" valign="top">
    <textarea class="form-control" style="height:100%;font-size:14px; font-family:'宋体'" id="REQTEXT"></textarea>  
    </td>
    <td style="padding:1px 1px 1px 1px" valign="top">
    <textarea class="form-control" style="height:100%;font-size:14px; font-family:'宋体'" id="SRESULT"></textarea>  
    </td>
    </tr>
    </table>
   </div>
  </div>
</body>

</html>



