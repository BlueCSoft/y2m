<%@page contentType="text/html;charset=gb2312"%><%@page language="java" 
import="java.sql.*,javax.servlet.http.*,java.io.*,bluec.base.*"%><%
response.addHeader("Pragma", "no-cache");
response.addHeader("Cache-Control", "no-store");

  try{
    String filename = request.getParameter("ofile").toString();
	
    String sdir = "/bin/reportfmt/";
    String realpath = application.getRealPath(sdir);
    filename = realpath+"/"+CUtil.extractFileName(CUtil.unescape(filename));
	
    java.io.File file_out = new java.io.File(filename);

    if(!file_out.exists()){
	 if(filename.indexOf(".rep")>0)
 	  filename = realpath+"/default.rep";
	 else
	  filename = realpath+"/default.ini"; 
	 file_out = new java.io.File(filename);
	}
	
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

	
  }catch(Exception ex){
   System.out.println(request.getRequestURI()+":"+ex.getMessage()); 
  }finally{
  }
%>

