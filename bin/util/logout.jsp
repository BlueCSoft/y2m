<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%@page import="java.util.*"%>
<%@page import="java.text.*"%>
<%@page import="java.io.*"%>
<%@page import="org.w3c.dom.*"%>
<jsp:useBean id="query" scope="page" class="bluec.base.CQuery"/>
<%
  try{
   query.updateBySql("update sys_ulog_xt "+
                     "set etime=getdate(),times=dbo.getCTimes(stime,getdate()) "+
	  				 "where sid="+session.getAttribute("gLoginId").toString(),session);
  }finally{
   query.closeConn();
  }
  session.invalidate();
  String result = "<xml><ds><d>ok</d></ds></xml>";
  response.setContentType("text/xml;charset=utf-8");
  out.print(result);
%>

