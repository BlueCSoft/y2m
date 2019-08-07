<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*,java.io.*,bluec.base.*"%>
<%
 request.setCharacterEncoding("gb2312");
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
 int isOk = 0; 
%> 
<jsp:useBean id="mySU" scope="page" class="com.jspsmart.upload.SmartUpload"/>
<%
  String ofilename = "";
  String errorMsg = "";
 
  mySU.initialize(pageContext);
  mySU.setMaxFileSize(11000000);    
  //mySU.setTotalMaxFileSize(12000000);
  try{
    mySU.upload();
	
	ofilename = mySU.getRequest().getParameter("ofile").toString();
    ofilename = CUtil.extractFileName(CUtil.unescape(ofilename));	
	
    //Ä¿Â¼´¦Àí
    String sdir = "/bin/reportfmt/";
    String realpath = application.getRealPath(sdir);

    File fdir=new File(realpath); 
    if(!fdir.exists()) fdir.mkdir(); 
    isOk = 1; 
	
    for(int i=0;i<mySU.getFiles().getCount();i++){
    	System.out.println("ofilename="+ofilename);	
     com.jspsmart.upload.File myFile = mySU.getFiles().getFile(i);
     if(!myFile.isMissing()){
       if(myFile.getSize()>0)
	    myFile.saveAs(sdir+ofilename,mySU.SAVE_VIRTUAL);
       else
	    isOk = -2;
     }
	} 
  }catch(Exception ex){ 
    System.out.println("error:"+ex.getMessage());   
	isOk = -1;
	errorMsg = ex.getMessage();
  }finally{
  }	
%>


