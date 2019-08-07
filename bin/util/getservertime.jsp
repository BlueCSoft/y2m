<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%@page import="java.util.*"%>
<%@page import="java.text.*"%>
<%@page import="java.io.*"%>
<%@page import="org.w3c.dom.*"%>
<%@page import="javax.xml.parsers.*"%>
<%@page import="javax.xml.transform.dom.*"%>
<%@page import="javax.xml.transform.stream.*"%>
<jsp:useBean id="query" scope="page" class="bluec.base.CQuery"/>
<%
  //µ÷ÓÃ
  String result = "";
  try{
   ResultSet rs = query.queryBySql("select a=convert(varchar,getdate(),121)",session);
   rs.next();
   result = rs.getString(1);
  }finally{
   query.closeConn();
  } 
  //ServletOutputStream Out = response.getOutputStream();
  response.setContentType("text/xml;charset=utf-8");
 
  out.print("<xml><ds><d>"+result+"</d></ds></xml>");
  //Out.print("<xml><ds><d>"+result+"</d></ds></xml>");
  //Out.close();
%>

