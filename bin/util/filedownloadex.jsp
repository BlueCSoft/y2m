<%@page contentType="text/html;charset=gb2312"%><%@page language="java" 
import="java.sql.*,javax.servlet.http.*,java.util.*,java.io.*,java.text.*,bluec.base.*"%><%
response.addHeader("Pragma", "no-cache");
response.addHeader("Cache-Control", "no-store");
%><%
  String sessionid = request.getParameter("sessionid").toString();
  Map colusers = (Map)application.getAttribute("olusers");
  HttpSession usession = null; 
  Iterator it = colusers.keySet().iterator();
   
  while(it.hasNext()){
   String key = (String)it.next();	
   usession = (HttpSession)colusers.get(key);
   if(sessionid.equals(usession.getId()))
    break;
  } 	

  String filename,ofilename = request.getParameter("filename").toString();

  //SmartUpload mySU = new SmartUpload();
  //mySU.initialize(pageContext);  

  try{
   String realpath = application.getRealPath("bin/buffer");

   filename = realpath+"\\"+ofilename;
   System.out.println(filename);	   
   java.io.File file_out=new java.io.File(filename);
   FileInputStream inPut=new FileInputStream(file_out);
   int fl = (int)file_out.length();
   response.setContentLength(fl); 
   ServletOutputStream Out = response.getOutputStream();
   int c = 0;
   byte[] bytes=new byte[8196];
   byte[] b;
   while((c=inPut.read(bytes))!=-1){
    Out.write(bytes);
   }
   inPut.close();
   Out.close();
   //mySU.downloadFile(filename);
  }catch(Exception ex){
   System.out.println(request.getRequestURI()+":"+ex.getMessage()); 
  }finally{
  }
%>

