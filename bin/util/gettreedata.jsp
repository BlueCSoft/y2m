<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%@page import="java.util.*"%>
<%@page import="java.text.*"%>
<%@page import="java.io.*"%>
<%@page import="org.w3c.dom.*"%>
<%@page import="javax.xml.parsers.*"%>
<%@page import="javax.xml.transform.dom.*"%>
<%@page import="javax.xml.transform.stream.*"%>
<jsp:useBean id="tree" scope="page" class="bluec.base.CLexIcon"/>
<%
  //����
  String result = tree.getTreeViewInfo(request);
  //ServletOutputStream Out = response.getOutputStream();
  response.setContentType("text/xml;charset=utf-8");
  out.print(result);  
  //Out.print(result);
  //Out.close();
%>

