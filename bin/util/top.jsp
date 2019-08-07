<jsp:useBean id="pquerytop" scope="page" class="bluec.base.CQuery"/>
<nav id="toolpanel" class="navbar navbar-default" role="navigation" style="margin:0px; border-radius:0px; border:0px; background-color:#eee">
<div class="container-fluid"> 
  <div class="navbar-header" style="padding-left:48px;">
     <a href="/"><img src="../images/blueclogo.png"></a>
  </div>
  <div>
    <div style="height:34px; text-align:right; padding-top:5px" class="container">
    <nobr>
 <span style="font-size:12px;"><%=session.getAttribute("gUserName").toString()%></span>&nbsp;
<%
 String root = request.getContextPath();
 if(root.equals(""))
   root = "/";
%> 
 <a style="font-size:12px; color:#006" href="#" onClick="location.href = '/';"> 帮助 </a>|
 <a style="font-size:12px; color:#006" href="#" onClick="location.href = 'bluec.jsp';"> 刷新 </a>|
 <a style="font-size:12px; color:#006" href="#" onClick="location.href = '<%=root%>';"> 注销 </a>
 </nobr>
    </div>
    <ul class="nav navbar-nav">
<%  
  //角色表
  String sCaption,sId,sUrl,twork;
  String app = request.getContextPath();
  int level,ccount; 
  int uType = Integer.parseInt(session.getAttribute("gUserLevel").toString());
  String Sql = "#SYS_ADMINMENU";
  if(uType>-1)
    Sql = "#SYS_USERMENU";

  try{ 
    pquerytop.queryBySqlID(Sql,session);
   
    while(pquerytop.next()){
      sId = pquerytop.getString("FUN_ID");  
	  sCaption = pquerytop.getString("FUN_NAME");  
	  sUrl = app+pquerytop.getString("PAGENAME"); 
  	  level = pquerytop.getInt("LEVEL");
	  ccount = pquerytop.getInt("HASCHILD");
	  
      if(ccount>0){
	    out.println("<li class=\"dropdown\">\n");  
	    out.println("<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" style=\"padding-top:8px;padding-bottom:8px;\">"+
		               sCaption+"<b class=\"caret\"></b></a>\n");
		out.println("<ul class=\"dropdown-menu\">\n");
	    for(int i=0;i<ccount;i++){
		  pquerytop.next();
   	      sUrl = app+pquerytop.getString("PAGENAME"); 	
		  sId = pquerytop.getString("FUN_ID"); 
		  sCaption = pquerytop.getString("FUN_NAME");  
		  twork = pquerytop.getString("TARGET").equals("1")? "_blank":"";  
		  
		  if(pquerytop.getString("FUN_NAME").equals("-"))
		    out.println("<li class=\"divider\"></li>\n");
          else
		    out.println("<li><a href=\"#\" onclick=\"OnCallFun('"+sId+"','"+sCaption+"','"+sUrl+"','"+twork+"');\">"+sCaption+"</a></li>\n");
	    }
		out.println("</ul>\n");  
        out.println("</li>\n");  
	  }else{
		out.println("<li><a href=\""+sUrl+"\">"+pquerytop.getString("FUN_NAME")+"</a></li>");
	  } 
    }	 
  }catch(Exception ex){
    out.println(request.getRequestURI()+"\n打开数据产生异常:\n"+ex.getMessage());
  }finally{
    pquerytop.closeConn();
  }   
%>
    </ul>
  </div>
  </div>
</nav>