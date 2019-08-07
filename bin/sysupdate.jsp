<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*,java.io.*"%>
<%
 response.addHeader("Pragma", "no-cache");
 response.addHeader("Cache-Control", "no-store");
%>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<title>文件更新</title>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<link href="../theme/page.css" rel="stylesheet" type="text/css">
<link href="../theme/indexcss.css" rel="stylesheet" type="text/css">
<script src="../js/dataset.js"></script>
<script src="../js/xmlhttp.js"></script>
<style>
 td   {font-size:12px};
 input {font-size:12px};
</style>
<script>
 function doFileUpLoad(){
  form1.href = "sysupdate.jsp?att=1";
  form1.submit(); 
 }
</script>
</head>
<jsp:useBean id="mySmartUpLoad" scope="page" class="com.jspsmart.upload.SmartUpload"/>
<%
  if(request.getParameter("att")!=null){  
   String filename,filepath;  
   mySmartUpLoad.initialize(pageContext);
   mySmartUpLoad.upload();
   filepath = mySmartUpLoad.getRequest().getParameter("filepath").toString();
   //目录处理
   String sdir="/bin/"+filepath+"/"; 
   String realpath = application.getRealPath(sdir);

   File fdir=new File(realpath); 
   if(!fdir.exists()) 
    fdir.mkdir(); 

   for(int i=0;i<mySmartUpLoad.getFiles().getCount();i++){
    com.jspsmart.upload.File myFile = mySmartUpLoad.getFiles().getFile(i);
    if(!myFile.isMissing()){
	 filename = myFile.getFileName();
     myFile.saveAs(sdir+filename,mySmartUpLoad.SAVE_VIRTUAL);
    }
   }
  } 					   
%>
<body leftmargin="8" topmargin="8">
<form action="sysupdate.jsp?att=1" method="post" enctype="multipart/form-data" name="form1">
  <table width="305" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td width="500">&nbsp;</td>
      <td width="33">&nbsp;</td>
    </tr>
    <tr>
      <td width="500" height="24"><input name="file1" type="file" size="80"></td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td width="500" height="24"><input name="file2" type="file" size="80"></td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td width="500" height="24"><input name="file3" type="file" size="80"></td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td width="500" height="24"><input name="file4" type="file" size="80"></td>
      <td>&nbsp;</td>
    </tr>
     <tr>
      <td width="500" height="24"><input name="file5" type="file" size="80"></td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td width="500" height="24"><input name="file6" type="file" size="80"></td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td width="500" height="24"><input name="file7" type="file" size="80"></td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td width="500" height="24"><input name="file8" type="file" size="80"></td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td width="500" height="24"><input name="file9" type="file" size="80"></td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td width="500" height="24"><input name="file10" type="file" size="80"></td>
      <td>&nbsp;</td>
    </tr>
   <tr>
      <td width="500" height="24"><input name="filepath" type="text" id="filepath" size="35"></td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td width="500" height="63" align="center"><input type="submit" name="Submit" value="确  定"></td>
      <td>&nbsp;</td>
    </tr>
  </table>

</form>
</body>
</html>
