<%@page contentType="text/html;charset=utf-8"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%@page import="java.util.*"%>
<%@page import="java.text.*"%>
<%@page import="java.io.*"%>
<%@page import="org.w3c.dom.*"%>
<%@page import="javax.xml.parsers.*"%>
<%@page import="javax.xml.transform.dom.*"%>
<%@page import="javax.xml.transform.stream.*"%>
<jsp:useBean id="query" scope="page" class="bluec.base.CLexIcon"/>
<%
  //µ÷ÓÃ
  String result = query.getRecords(request);
  //ServletOutputStream Out = response.getOutputStream();
  //System.out.print("IPAD Call");
  response.setContentType("text/xml;charset=utf-8");
  //System.out.println(result);
  out.print(result);
  //out.print("xml id=\"bluec\"><RS><R RL=\"1\" RT=\"1\" RS=\"0\" RR=\"1\" F1=\"ºÃ\"/></RS></xml>");
  // out.print("<xml><values>I am Hear</values></xml>");
  //Out.print(result); 
  //Out.close();
%> 

  