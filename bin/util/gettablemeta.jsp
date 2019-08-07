<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%@page import="java.util.*"%>
<%@page import="java.text.*"%>
<%@page import="java.io.*"%>
<jsp:useBean id="query" scope="page" class="bluec.base.CQuery"/>
<%
    //µ÷ÓÃ
	String tablename = request.getParameter("tablename").toString();
	String result = query.formatMetaToDataSet(tablename);
	response.setContentType("text/xml;charset=utf-8");
	out.print(result);  
%>
