<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%@page import="bluec.base.*"%>
<%@page import="bluec.gyy.*"%>

<%
  request.setCharacterEncoding("utf-8");
  CGymp obj = new CGymp(request);
  
  String sresult = obj.BillInfo();       
  response.setContentType("text/html;charset=utf-8");
  out.print(sresult);
%> 
  