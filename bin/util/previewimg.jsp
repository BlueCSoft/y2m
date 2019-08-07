<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*,bluec.base.*"%>
<%
  request.setCharacterEncoding("GBK");
  response.addHeader("Expires","0");
  response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
  response.addHeader("Pragma", "public"); 
%>
<html>
<head>
<title>图片查看</title>
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link rel="stylesheet" href="../theme/page.css">
<style>
.selecttd {	
    color:#fff;
	background-color:#a4bf41;
	border-radius:10px;
	padding:6px;
	font-size:12px;
}
.unselecttd {	
    color:#000000;
	background-color:#f7f7f7;
	border-radius:10px;
	padding:6px;
	font-size:12px;
}
.style0{
}
.style1{
  	width:100%; 
	height:auto;
}
.style2{
  	width:auto; 
	height:100%;
}
</style>
<script src="../js/xmlhttp.js?version=46"></script>
<script src="../js/jquery.min.js"></script>
<script src="../js/stand.js"></script>
<script>
  function doLoad(){
    $("#divClient").css("height",document.documentElement.clientHeight-$("#divPageInfo").outerHeight());
    history.pushState("a", null);
    window.onpopstate = function(){
      parent._$closeWindow();
    }
	
	var ops = new TTdRadio([op0,op1,op2],[0,1,2],0,"unselecttd","selecttd");
	ops.OnChange = function(sender,obj,i){
	  imgid.className = "style"+i;
	}
  }
</script>
</head>
<body style="margin:0px" onLoad="doLoad()" scroll="no">
<div id="divClient" style="width:100%;height:200px;overflow:auto;">
<img id="imgid" src="<%=request.getParameter("imgpath").toString()%>" class="style0" onClick="history.back()">
</div>
<div style="height:40px;overflow:hidden; text-align:center; border-top:1px solid #ddd; padding:3px" id="divPageInfo">
<table border="0" height="100%" align="center">
<tr>
<td id="op0" class="selecttd">&nbsp;原图大小&nbsp;</td><td>&nbsp;</td>
<td id="op1" class="unselecttd">&nbsp;适应宽度&nbsp;</td><td>&nbsp;</td>
<td id="op2" class="unselecttd">&nbsp;适应高度&nbsp;</td>
</tr>
</table>
</div>
</body>
</html>

