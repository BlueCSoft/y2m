<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%@page import="java.util.*"%>
<%@page import="java.text.*"%>
<%@page import="java.io.*"%>
<%@page import="org.w3c.dom.*"%>
<%@page import="javax.xml.parsers.*"%>
<%@page import="javax.xml.transform.dom.*"%>
<%@page import="javax.xml.transform.stream.*"%>
<jsp:useBean id="pLogin" scope="page" class="bluec.base.CLogin"/>
<%
  request.setCharacterEncoding("gb2312");
  int result = pLogin.Login(request);
  response.setContentType("text/xml;charset=utf-8");
  if(result==0)
   out.print("<xml><ds><d>ok</d></ds></xml>");  
  else
   out.print("<xml><errors><error>"+pLogin.getLastError()+"</error></errors></xml>");     
%>

