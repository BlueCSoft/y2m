<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%@page import="bluec.base.*"%>
<%@page import="bluec.gyy.*"%>

<%
  request.setCharacterEncoding("utf-8");
  CGyerp obj = new CGyerp(request);
  
  String sresult = obj.pos_sendsale();       
  response.setContentType("text/xml;charset=utf-8");
  out.print(sresult);
%> 
  