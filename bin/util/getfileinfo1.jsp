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
    query.queryBySql("select a.id,a.filesize,a.filesizec,a.ofilename,b.imgname "+
	                 "from pub_files a,sys_filetype b "+
					 "where a.pid=%s and a.fileext*=b.fext order by id",pid,session);
    if(query.next()){%>
<%=query.getString("OFILENAME")%>
<%   
   }
   }catch(Exception ex){ 
   }finally{
    query.closeConn();
   }
%>


