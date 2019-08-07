<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<jsp:useBean id="pLogin" scope="page" class="bluec.base.CLogin"/>
<%
 request.setCharacterEncoding("gb2312");
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
 if(!pLogin.isLogin(request.getSession())){
   response.sendRedirect("../index.html");
   return;
 }
 pLogin.initRequest(request);
 String menuSqlId = (pLogin.sessionAttrInt("gUserLevel",0)<0)? "#SYS_ADMINMENU" : "#SYS_USERMENU";
%>

<!DOCTYPE html>
<html>
<head>
<title>广州友谊商店零售商管理系统1.0</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="theme/bootstrap.min.css">
<style>
  .pagetab0 {font-size:13px; color:#666; padding-left:8px;padding-right:4px; cursor:pointer; background-color:#eee; 
             border-left:1px solid #999; border-top:1px solid #999; border-right:1px solid #999;
             border-top-left-radius:15px;border-top-right-radius:4px}
  .pagetab1 {font-size:13px; color:#00f; padding-left:8px;padding-right:4px; cursor:pointer; background-color:#ff5;  
             border-left:1px solid #999; border-top:1px solid #999; border-right:1px solid #999;
             border-top-left-radius:15px;border-top-right-radius:4px:}
			 
  .dropdown-submenu {
    position: relative;
  }
  .dropdown-submenu > .dropdown-menu {
    top: 0;
    left: 100%;
    margin-top: -6px;
    margin-left: -1px;
    -webkit-border-radius: 0 6px 6px 6px;
    -moz-border-radius: 0 6px 6px;
    border-radius: 0 6px 6px 6px;        
  }
  .dropdown-submenu:hover > .dropdown-menu {
    display: block;
  }        
  .dropdown-submenu > a:after {
    display: block;
    content: " ";
    float: right;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 5px 0 5px 5px;
    border-left-color: #ccc;
    margin-top: 5px; 
    margin-right: -10px;
  }
  .dropdown-submenu:hover > a:after {
    border-left-color: #fff; 
  }
  .dropdown-submenu.pull-left {
    float: none;
  }
  .dropdown-submenu.pull-left > .dropdown-menu {
    left: -100%;
    margin-left: 10px;
    -webkit-border-radius: 6px 0 6px 6px;
    -moz-border-radius: 6px 0 6px 6px;
    border-radius: 6px 0 6px 6px;
  }
			 
</style>
<script src="js/jquery.min.js"></script>
<script src="js/bluecmenu.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/xmlhttp.js"></script>
<script src="js/stand.js"></script>
<script>
   var pageTab = null;
   function doLoad(){
  	 history.pushState('a', null);
     window.addEventListener('popstate',function() {
       history.pushState('a', null);
     });

	 $("#iframes").css("height",document.documentElement.clientHeight-98);  
   }

   function OnCallFun(id,caption,url,twork){
	 iwork = (twork==""||twork=="work")? pageTab.setActiveTab(id,caption):twork;  
	 if(iwork!="opened"){
	   idfun.href = url;
	   idfun.target = iwork;
	   idfun.click();
	 }
   }
   
   function closePage(){
     pageTab.removePageTab(3);
   }
   
   function hideMainMenu(){
	 //$(".dropdown-toggle").dropdown("toggle");
   }
</script>

</head>

<body onLoad="doLoad();" scroll="no" style="margin:0px">
<table height="100%" width="100%" border="0">
<tr><td>
<nav id="toolpanel" class="navbar navbar-default" role="navigation" style="margin:0px; border-radius:0px; border:0px; background:#428bca">
<div class="container-fluid"> 
  <div class="navbar-header" style="padding:0px;padding-left:8px;">
     <img src="images/bluecsoft.png">
  </div>
  <div>
    <div style="height:24px; text-align:right; padding-top:2px; padding-right:36px; font-size:13px; color:#eee">
    <nobr>
      <a style="color:#fff" href="#">(<%=session.getAttribute("gUserName").toString()%>)</a>&nbsp;&nbsp;
      <a style="color:#fff" href="#" onClick="location.href = '/';"> 帮助 </a>|
      <a style="color:#fff" href="#" onClick="location.href = 'bluec.jsp';"> 刷新 </a>|
      <a style="color:#fff" href="#" onClick="location.href = '../';"> 注销 </a>
    </nobr>
    </div>
    <div style=" background-color:#428bca; padding:4px">
       <div>
<%=pLogin.CreateMainMenu(request,menuSqlId,new String[]{session.getAttribute("gUserId").toString()})%>
      </div>
    </div>
  </div>
</div>
</nav>
</td></tr>
<tr>
 <td height="28" valign="bottom" align="left" bgcolor="#fff">
  <table border="0" width="100%" height="100%" style="color:#000033;font-size:13px; border-bottom:1px solid #eee; padding:0px">
   <tr><td valign="middle" align="center" width="16">
    <span style="color:#000000">&nbsp;</span>
   </td>
   <td>
<div style="width:100%;height:100%;overflow:hidden;" id="pageTab">
<script>
  pageTab = new TIframePageTab(pageTab,15,"work","pagetab0","pagetab1"); 
  pageTab.createPageTab("&nbsp;&nbsp;首页&nbsp;&nbsp;","100%");
</script>						 
</div>
</td></tr>
</table>	
	</td>
  </tr>
<tr><td>
<div style="width:100%;height:100%;overflow:hidden:" id="iframes">

<div style="width:100%;height:100%;" id="div0">
 <iframe id="work0" style="height:100%; width:100%;" name="work0" src="" 
  frameborder=0 scrolling="auto" resizeable="no"></iframe>     
</div> 

<div style="width:100%;height:100%;display:none;" id="div1">
 <iframe id="work1" style="height:100%; width:100%"  name="work1" src="" frameborder=0 scrolling="auto" resizeable="no"></iframe>
</div> 

<div style="width:100%;height:100%;display:none;" id="div2">
 <iframe id="work2" style="height:100%; width:100%;" name="work2" 
  src="" frameborder=0 scrolling="auto" resizeable="no"></iframe>
</div> 

<div style="width:100%;height:100%;display:none;" id="div3">
 <iframe id="work3" style="height:100%; width:100%;" name="work3" 
  src="" frameborder=0 scrolling="auto" resizeable="no"></iframe>
</div> 

<div style="width:100%;height:100%;display:none;" id="div4">
 <iframe id="work4" style="height:100%; width:100%;" name="work4" 
  src="" frameborder=0 scrolling="auto" resizeable="no"></iframe>
</div> 

<div style="width:100%;height:100%;display:none;" id="div5">
 <iframe id="work5" style="height:100%; width:100%;" name="work5" 
  src="" frameborder=0 scrolling="auto" resizeable="no"></iframe>
</div>

<div style="width:100%;height:100%;display:none;" id="div6">
 <iframe id="work6" style="height:100%; width:100%;" name="work6" 
  src="" frameborder=0 scrolling="auto" resizeable="no"></iframe>
</div>

<div style="width:100%;height:100%;display:none;" id="div7">
 <iframe id="work7" style="height:100%; width:100%;" name="work7" 
  src="" frameborder=0 scrolling="auto" resizeable="no"></iframe>
</div>

<div style="width:100%;height:100%;display:none;" id="div8">
 <iframe id="work8" style="height:100%; width:100%;" name="work8" 
  src="" frameborder=0 scrolling="auto" resizeable="no"></iframe>
</div>

<div style="width:100%;height:100%;display:none;" id="div9">
 <iframe id="work9" style="height:100%; width:100%;" name="work9" 
  src="" frameborder=0 scrolling="auto" resizeable="no"></iframe>
</div>

<div style="width:100%;height:100%;display:none;" id="div10">
 <iframe id="work10" style="height:100%; width:100%;" name="work10" 
  src="" frameborder=0 scrolling="auto" resizeable="no"></iframe>
</div>

<div style="width:100%;height:100%;display:none;" id="div11">
 <iframe id="work11" style="height:100%; width:100%;" name="work11" 
  src="" frameborder=0 scrolling="no" resizeable="no"></iframe>
</div>

<div style="width:100%;height:100%;display:none;" id="div12">
 <iframe id="work12" style="height:100%; width:100%;" name="work12" 
  src="" frameborder=0 scrolling="no" resizeable="no"></iframe>
</div>

<div style="width:100%;height:100%;display:none;" id="div13">
 <iframe id="work13" style="height:100%; width:100%;" name="work13" 
  src="" frameborder=0 scrolling="no" resizeable="no"></iframe>
</div>

<div style="width:100%;height:100%;display:none;" id="div14">
 <iframe id="work14" style="height:100%; width:100%;" name="work14" 
  src="" frameborder=0 scrolling="no" resizeable="no"></iframe>
</div>
</div>  
</td>
</tr>
</table>
<script>
  pageTab.setDiv([div0,div1,div2,div3,div4,div5,div6,div7,div8,div9,div10,div11,div12,div13,div14]);
</script>
<a id="idfun" href="#" style="display:none"></a>
</body>
</html>

