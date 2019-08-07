<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*,java.io.*,bluec.base.*"%>
<%
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
 String sResult = "";
  System.out.println("sResult");
 try{
   CFileUpLoad upload = new CFileUpLoad();
   upload.UpLoad(request,false);
   sResult = upload.getReturnXml(); 
 }catch (Exception ex) {
   sResult = ex.getMessage();
 }finally{
 }
 //System.out.println(sResult);
 response.setContentType("text/xml;charset=utf-8");
 out.print(sResult);  
%>

