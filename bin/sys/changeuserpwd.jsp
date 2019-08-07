<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%@page import="bluec.base.*"%>

<%
  request.setCharacterEncoding("utf-8");
  CLogin obj = new CLogin();
  
  String sresult = obj.changePwd(request);       
  
  response.setContentType("text/xml;charset=utf-8");
  out.print(sresult);
%> 

  