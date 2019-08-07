<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*,java.io.*,bluec.base.*"%>
<%
 request.setCharacterEncoding("gb2312");
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
 int isOk = 0; 
%>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<title>上传测量数据</title>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<link href="../theme/page.css" rel="stylesheet" type="text/css">
<link href="../theme/neiye.css" rel="stylesheet" type="text/css">
<jsp:useBean id="query" scope="page" class="bluec.base.CQuery"/>
<jsp:useBean id="mySU" scope="page" class="com.jspsmart.upload.SmartUpload"/>
<%
  int fileid = 0;
  String pid="0";
  String ofilename = "",filename="";
  String errorMsg = "";

  mySU.initialize(pageContext);
  mySU.setMaxFileSize(11000000);    
  //mySU.setTotalMaxFileSize(12000000);
	
  //mySU.setAllowedFilesList("doc,txt,jpg,rar,mid,waw,mp3,gif");    

  if(request.getParameter("att")==null){  
   int count=0;
   try{
	mySU.setDeniedFilesList("exe,bat,jsp,htm,html");    
    mySU.upload();

    pid = mySU.getRequest().getParameter("pid").toString();  //主记录ID
	String ulstime = mySU.getRequest().getParameter("ulstime").toString();
	String snote = mySU.getRequest().getParameter("snote").toString();
			
	ofilename = mySU.getRequest().getParameter("ofile").toString();
    ofilename = CUtil.extractFileName(CUtil.unescape(ofilename));	
	
    //目录处理
    String sdir = CInitParam.getFilePath1();
    String realpath = application.getRealPath(sdir);

    File fdir=new File(realpath); 
    if(!fdir.exists()) fdir.mkdir(); 
    isOk = 1; 
    for(int i=0;i<mySU.getFiles().getCount();i++){
     com.jspsmart.upload.File myFile = mySU.getFiles().getFile(i);
     if(!myFile.isMissing()){
      if(myFile.getSize()>0){
       //获取文件ID	 
  	   query.queryBySql("update sys_seq set value=value+1 where id='FILEID'\n"+
    		            "select value from sys_seq where id='FILEID'",session);
	   query.next();
	   fileid = query.getInt2(1,0);
	  
	  
   	   filename = "file"+fileid+"."+myFile.getFileExt();
       myFile.saveAs(sdir+filename,mySU.SAVE_VIRTUAL);
	   
       String uSql="insert into pub_files(id,pid,ofilename,nfilename,filesize,filesizec,filepath,fileext,\n"+
                   "       ulstime,uletime,dlcount,times,note)\n"+
                   "values(%s,%s,'%s','%s',%s,'%s','','%s',\n"+
                   "       '%s',getdate(),0,dbo.getCTimes('%s',getdate()),'%s')";
       String[] params = {Integer.toString(fileid),
	                      pid,
	                      ofilename,
						  filename,
						  Integer.toString(myFile.getSize()),
						  Integer.toString(myFile.getSize()),
						  myFile.getFileExt(),
						  ulstime,
						  ulstime,
						  snote};
       query.updateBySqlWithParam(uSql,params,session); 
      }else{
       //throw new Exception(old_file_name+"不存在或不是有效的文件！");
	   isOk = -2;
	  } 
     }
	} 
   }catch(Exception ex){ 
    System.out.println("error:"+ex.getMessage());   
	isOk = -1;
	errorMsg = ex.getMessage();
   }finally{
    query.closeConn(); 
   }	
  }else{ 
   if(request.getParameter("del")!=null){
    query.updateBySql("delete from pub_files where id="+
	                           request.getParameter("fileid").toString(),session);     
    isOk = 1;
   }								   
   if(request.getParameter("pid")!=null)
    pid = request.getParameter("pid").toString();
 }
 
%>
<script src="../js/xmlhttp.js"></script>
<script src="../js/bluecprint.js"></script>
<script src="../js/dataset.js"></script>
<style>
 td   {font-size:12px};
 input {font-size:12px};
</style>

<script>
<%if(isOk<0){%>
 alert("<%=errorMsg%>");
<%}%>

 var fileCount = 0;
 function doFileUpLoad(){
  if(form1.upFile.value==""){
   alert("请先选择要上传的附件.");
   return;
  }
  
  if(form1.snote.value==""){
   alert("请输入测量说明.");
   return;
  }
  if(!$checkUpLoadFile(form1.upFile.value,".exe,.bat,.com,.html,.htm,.jsp,.asp,.aspx",3000000))
   return;
  form1.ofile.value = form1.upFile.value;    
  form1.ulstime.value = getServerDateTime();    
  form1.action = "uploadclsj.jsp";
  form1.target = "_self";
  form1.submit(); 
  form1.upFile.disabled = true;  
  form1.btUpload.disabled = true;  
 }

 function doLoad(){
  form1.upFile.disabled = fileCount>=8;  
  form1.btUpload.disabled = fileCount>=8; 
  
  if(<%=isOk%>==1){
   if(typeof(this.opener)!="undefined"&&typeof(this.opener._getFileInfo)!="undefined")
    this.opener._getFileInfo(true,<%=fileid%>);
   if(typeof(this.parent)!=""&&typeof(this.parent._getFileInfo)!="undefined")
    this.parent._getFileInfo(true,<%=fileid%>);

  }
 } 
</script>
</head>

<body leftmargin="1" topmargin="1" rightmargin="1" bottommargin="1" onLoad="doLoad();">
<table width="100%" height="100%" border="1" cellpadding="0" cellspacing="0" bordercolor="488aa0" bgcolor="#FFFFFF" class="tabletop">
  
  <tr>
   <td valign="top" style="padding:4px 4px 4px 4px">
<form action="" method="post" enctype="multipart/form-data" name="form1" target="_top">
  <input type="hidden" name="pid" value="<%=pid%>">
  <input type="hidden" name="ulstime">
  <table width="100%" height="42" border="0" bgcolor="#FFFFFF">
    <tr >
      <td width="100%" height="18">
        <input name="upFile" type="file" size="60"
		 style="font-size:12px; height:18px;border:1px solid"><input name="btUpload" type="button"  
		 style="font-size:12px; height:18px;border:1px solid; margin:0px 0px 0px 1px"  onClick="doFileUpLoad();" 
		 value="&nbsp;上&nbsp;传&nbsp;">
        <input type="hidden" name="ofile">      </td>
    </tr>
    <tr >
      <td height="48"><table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td width="34" align="center">说明</td>
          <td valign="top"><textarea id="snote" name="snote" 
		style="width:100%; border:1px solid #BBBBBB; padding:2px 2px 2px 2px" rows="3"></textarea></td>
        </tr>
      </table></td>
    </tr>
  </table>
<table width="99%" border="0" cellpadding="0" cellspacing="1" 
       bgcolor="#CCCCCC" style="margin:0px 0px 0px 3px;word-break:break-all;word-wrap:break-word">
  <thead>
    <tr bgcolor="#FFFFFF">
	  <td height="18" width="32" align="center" bgcolor="#eeeeee"></td>
      <td align="center" bgcolor="#eeeeee">文件名</td>
      <td width="88" align="center" bgcolor="#eeeeee">文件大小</td>
      <td width="48" bgcolor="#eeeeee">&nbsp;</td>
    </tr>
  </thead>
<%
   int nSize = 0;
   int fid = 0;
   int fileCount = 0;
   String imgName = "";
   try{
    query.queryBySql("select a.id,a.filesize,a.filesizec,a.ofilename,b.imgname "+
	                 "from pub_files a,sys_filetype b "+
					 "where a.pid=%s and a.fileext*=b.fext order by id",pid,session);
    while(query.next()){
     fid = query.getInt("ID");
     nSize += query.getInt("FILESIZE");
	 imgName = query.getString("IMGNAME");
	 if(imgName.equals("")) imgName = "&nbsp;";
	 else imgName="<img src='../images/"+imgName+"' border=0>"; 
%>
  <tr height="22" bgcolor="#FFFFFF">
    <td align="center"><%=imgName%></td>
    <td><a href="filedownload0.jsp?fileid=<%=fid%>" target="_blank"><%=query.getString("OFILENAME")%></a></td>
    <td align="right"><%=query.getString("FILESIZEC")%>&nbsp;</td>
    <td width="48" align="center"><a href="uploadclsj.jsp?att=0&del=1&pid=<%=pid%>&fileid=<%=fid%>">删除</a></td>
  </tr>
<% 
     fileCount++;
    }
   }catch(Exception ex){ 
   }finally{
    query.closeConn();
   }
%>
  <tfoot>
  </tfoot>
</table>
</form></td></tr></table>
<script>
 fileCount = <%=fileCount%>;
</script>
</body>
</html>

