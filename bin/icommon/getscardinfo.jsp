<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%@page import="bluec.base.*"%>
<%@page import="bluec.gyy.*"%>

<%
  request.setCharacterEncoding("utf-8");
  CCommon obj = new CCommon(request);
  
  String sresult = obj.YmpGetSCardInfo();       
  response.setContentType("text/html;charset=utf-8");
  out.print(sresult);
%> 
  