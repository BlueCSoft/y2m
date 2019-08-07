<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<jsp:useBean id="plimit" scope="page" class="bluec.base.CLogin"/>
<%
 request.setCharacterEncoding("GBK");
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
%>
<!DOCTYPE html>
<head>

<title>查询分析器</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link rel="stylesheet" href="../theme/page.css">
<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>
<script src="../js/xmlhttp.js"></script>
<script src="../js/idataset.js"></script>
<script src="../js/datasource.js"></script>
<script src="../js/idbgrids.js"></script>
<script src="../js/db.js"></script>
<script src="../js/qrgrids.js"></script>
</head>

<script>
  var table = null;
  var ds = null;
  var DBGrid = null;
</script>
</head>

<jsp:useBean id="pquery" scope="page" class="bluec.base.CQuery"/>

<body>
<div style="border:1px solid;overflow:auto;width:100%;height:100%;" id="grid">
<script>
   try{  
     __$Query.Query("#SQL",["<%=request.getParameter("sql").toString()%>"]);
     QrGrid = new TQRGrid({widthMatchParent:false});
     QrGrid.setPropertys({name:"QRGrid",crossShowRow:false,tableBgColor:"#cccccc",rowBackGround:"#ffffff",usePre:false,
                          titleHeight:28,userActiceRow:true,titleClass:"qrgridtitlecell",styleClass:"qrgridcell",fixedCaption:"No"});
     for(var i=0;i<__$Query.fieldCount;i++){
	   QrGrid.addEx({Caption:__$Query.fieldInfos[i].fieldName,FieldName:__$Query.fieldInfos[i].fieldName});   
     }
   
     QrGrid.CreateGrid(true);  
     QrGrid.boundQuery(__$Query,false);  
     __$Query.Query("#SQL",["<%=request.getParameter("sql").toString()%>"]); 
   }catch(error){
	 
   }
   //不显示表格线
</script>
</div>
</body>
</html>

