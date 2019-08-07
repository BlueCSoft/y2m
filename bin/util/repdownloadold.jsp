<%@page contentType="text/html;charset=gb2312"%><%@page language="java" 
import="java.sql.*,javax.servlet.http.*,com.jspsmart.upload.SmartUpload,bluec.base.*"%><%
response.addHeader("Pragma", "no-cache");
response.addHeader("Cache-Control", "no-store");

  SmartUpload mySU = new SmartUpload();

  try{
    mySU.initialize(pageContext);
	//mySU.upload();

    String filename = request.getParameter("ofile").toString();
	
    String sdir = CInitParam.getFilePath1();
    String realpath = application.getRealPath(sdir);
    filename = CUtil.extractFileName(CUtil.unescape(filename));
	
    mySU.downloadFile(realpath+"/"+filename,null,filename);
	
	
  }catch(Exception ex){
   System.out.println(request.getRequestURI()+":"+ex.getMessage()); 
  }finally{
  }
%>

