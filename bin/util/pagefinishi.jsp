
<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%@page import="java.util.*"%>
<%@page import="java.text.*"%>
<%@page import="java.io.*"%>
<jsp:useBean id="pobj" scope="page" class="bluec.base.sys.CSystem"/>
<%
  //µ÷ÓÃ
  int result = 0;
  result = pobj.pageFinishi(request);
  if(result==0)
   out.print("<xml><ds><d>"+pobj.getLastError()+"</d></ds></xml>");
  else  
   out.print("<xml><errors><error>"+pobj.getLastError()+"</error></errors></xml>"); 
//  Out.close();
%>