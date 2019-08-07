<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%@page import="bluec.base.*"%>
<%@page import="bluec.gmp.*"%>

<%
  String sresult = "";
  request.setCharacterEncoding("utf-8");
  CGmpObject gmp = new CGmpObject(request);
  try{
    String[] vparams = {request.getParameter("startdate").toString(),
                        request.getParameter("enddate").toString(),
						request.getParameter("storeid").toString(),
						request.getParameter("gwbh").toString(),
						request.getParameter("zdid").toString(),
					    request.getParameter("cashierid").toString(),
						request.getParameter("status").toString(),
						request.getParameter("iszq").toString(),
						request.getParameter("payatt").toString()};
    sresult = gmp.GmpQuery("R_BILLLIST_NEW",vparams);       
  }catch(Exception ex){
	sresult = ex.getMessage();  
  }
  response.setContentType("text/html;charset=utf-8");
  out.print(sresult);
%> 
  