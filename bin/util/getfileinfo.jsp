<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*,java.io.*,bluec.base.*"%>
<%
 request.setCharacterEncoding("gb2312");
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
 String pid = request.getParameter("pid").toString();
%>
<jsp:useBean id="query" scope="page" class="bluec.base.CQuery"/>
<%
   int nSize = 0;
   int fid = 0;
   int rcount = 0;
   String imgName = "";
   try{
    query.queryBySql("select a.id,a.filesize,a.filesizec,a.ofilename,b.imgname,note=convert(varchar(2000),a.note) "+
	                 "from pub_files a,sys_filetype b "+
					 "where a.pid=%s and a.fileext*=b.fext order by id",pid,session);
    while(query.next()){
     if(rcount==0){%>
<table width="97%" border="0" cellpadding="0" cellspacing="0" bordercolor="#009933" bgcolor="#009933" style="margin:8px 8px 8px 8px">
<tr bgcolor="#FFFFFF"><td style="padding::0px 24px 0px 24px">	 
<table width="100%" border="0" cellpadding="0" cellspacing="0" 
       bgcolor="#CCCCCC" style="margin:0px 0px 0px 0px;word-break:break-all;word-wrap:break-word">
<%	 } 	
     fid = query.getInt("ID");
     nSize += query.getInt("FILESIZE");
	 imgName = query.getString("IMGNAME");
	 if(imgName.equals("")) imgName = "&nbsp;";
	 else imgName="<img src='../images/"+imgName+"' border=0>"; 
%>
  <tr height="23" bgcolor="#FFFFFF">
    <td align="center" width="24" style="font-size:13px"><%=imgName%></td>
    <td style="font-size:13px;padding::0px 8px 0px 8px">
	<a href="#" onclick="openAddFile(<%=fid%>)"><%=query.getString("OFILENAME")%></a>
	<span style="color:#FF0000">(<%=query.getString("NOTE")%>)</span>
	</td>
  </tr>
<%   rcount++;
    }
    if(rcount>0){%>
</table>	
</td></tr>
</table> 	
<%  }		
   }catch(Exception ex){ 
   }finally{
    query.closeConn();
   }
%>


