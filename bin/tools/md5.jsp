<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%@page import="bluec.base.*"%>
<%
  String hr = CUtil.MD5(request.getParameter("inp_in").toString());       
  //µ÷ÓÃ
  
  //http://120.236.153.203:18091/ShoppePay/spay/getLogin.ihtml?ZDH_IN=A0101
  String result = hr.trim();
  //ServletOutputStream Out = response.getOutputStream();
  //System.out.println(CUtil.MD5(request.getParameter("skymm_in").toString()));
  response.setContentType("text/html;charset=utf-8");
  //System.out.println(result);
  out.print(result);
%> 

  