<%@page contentType="text/html;charset=utf-8"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%@page import="bluec.base.*"%>
<%@page import="bluec.gyy.*"%>
<%
  request.setCharacterEncoding("utf-8");
  response.setContentType("text/html;charset=utf-8");
  
  CCommon obj = new CCommon(request);
  try{
    String sresult = obj.YmpGetBillKeyAndId();       
    out.print(sresult);
  }catch(Exception ex){
	out.print(ex.getMessage());  
  }
%> 
  