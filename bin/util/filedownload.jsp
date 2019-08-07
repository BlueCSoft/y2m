<%@page contentType="text/html;charset=gb2312"%><%@page language="java" 
import="java.sql.*,javax.servlet.http.*,com.jspsmart.upload.SmartUpload,bluec.base.*"%><%
response.addHeader("Pragma", "no-cache");
response.addHeader("Cache-Control", "no-store");
%><%
  CQuery query = new CQuery();
  SmartUpload mySmartUpLoad = new SmartUpload();
  String ofilename="",filename = "";

  String fileid = request.getParameter("fileid").toString();
  try{
   query.queryBySqlInner("select nfilename,ofilename,pid,convert(char(20),getdate(),120) stime "+
                         "from pub_files where id=%s",fileid);
   if(query.next()){
    mySmartUpLoad.initialize(pageContext);
    String sdir = CInitParam.getFilePath1();
    String realpath = application.getRealPath(sdir);
	
	String stime = query.getString("STIME");
	String pid = query.getString("PID");
	
    filename = realpath+"/"+query.getString("NFILENAME");
	ofilename = query.getString("OFILENAME"); 
	ofilename = new String(ofilename.getBytes("gb2312"),"iso8859-1");
	
    mySmartUpLoad.downloadFile(filename,null,ofilename);
	
/*    String uSql = "insert into file_dlinfos(id,pid,dlstime,dletime,times,dept_id,\n"+
                  "                         dept_no,dept_name,userid,usercode,username)\n"+
                  "select seq_file_read.nextval,%s,to_date('%s','yyyy-mm-dd hh24:mi:ss'),sysdate,\n"+
				  "       getSeconds(to_date('%s','yyyy-mm-dd hh24:mi:ss'),sysdate),%s,'%s','%s',%s,'%s','%s'\n"+
                  "from dual";
    String[] params={pid,
	                 stime,
					 stime,
                     session.getAttribute("gDeptId").toString(),
                     session.getAttribute("gDeptNo").toString(),
                     session.getAttribute("gDeptName").toString(),
                     session.getAttribute("gUserId").toString(),
                     session.getAttribute("gUserCode").toString(),
                     session.getAttribute("gUserName").toString()};					
    query.updateBySqlWithParam(uSql,params,session);
	query.updateBySql("update file_lists set dlcount=dlcount+1 where id="+fileid,session); */
   }
  }catch(Exception ex){
   System.out.println(request.getRequestURI()+":"+ex.getMessage()); 
  }finally{
   query.closeConn();
  }
%>

