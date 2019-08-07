
<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%@page import="java.util.*"%>
<%@page import="java.text.*"%>
<%@page import="java.io.*"%>

<jsp:useBean id="table" scope="page" class="bluec.base.CTable"/>
<%
  //调用
  int result = 0;
  result = table.delphiUpdates(request);
  
  //ServletOutputStream Out = response.getOutputStream();
  response.setContentType("text/xml;charset=utf-8");
  
/*  if(result==0)
   Out.print("<xml><ds><d>ok</d></ds></xml>");
  else  
   Out.print("<xml><errors><error>"+table.getLastError()+"</error></errors></xml>"); */

  if(result==0)
   out.print("<xml><ds><d>上传成功</d></ds></xml>");
  else  
   out.print("<xml><errors><error>"+table.getLastError()+"</error></errors></xml>"); 
//  Out.close();
%>
