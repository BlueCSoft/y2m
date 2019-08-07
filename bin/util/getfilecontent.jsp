<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*,java.io.*,bluec.base.*"%>
<%
    String filepath = request.getParameter("filepath").toString();
	String result = "";
    try{
	    CFileUpLoad upload = new CFileUpLoad();
	    result = upload.ReadFile(filepath,request);
	}catch (Exception ex) {
        result = ex.getMessage();
    }finally{
    }
    response.setContentType("text/xml;charset=utf-8");
    out.print(result); 
%>

