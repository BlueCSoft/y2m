<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%@page import="bluec.base.*"%>
<%@page import="bluec.gyy.*"%>

<%
  String sresult = "";
  request.setCharacterEncoding("utf-8");
  CCommon obj = new CCommon(request);
  try{
    sresult = obj.Query(request.getParameter("sqlid").toString());       
  }catch(Exception ex){
	sresult = ex.getMessage();  
  }
  response.setContentType("text/html;charset=utf-8");
  out.print(sresult);
%> 
  