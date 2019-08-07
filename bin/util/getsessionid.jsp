<%@page contentType="text/html;charset=gb2312"%><%@page language="java" 
import="javax.servlet.http.*"%><%
response.addHeader("Pragma", "no-cache");
response.addHeader("Cache-Control", "no-store");
%>
<%=session.getId()%>

