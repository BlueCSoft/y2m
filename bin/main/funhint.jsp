<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%@page import="java.util.*"%>
<%@page import="java.text.*"%>
<%@page import="java.io.*"%>
<%@page import="org.w3c.dom.*"%>
<%@page import="javax.xml.parsers.*"%>
<%@page import="javax.xml.transform.dom.*"%>
<%@page import="javax.xml.transform.stream.*"%>

<table width="100%" border="0" cellspacing="1" cellpadding="1" bgcolor="#ffffff">
<jsp:useBean id="pquery" scope="page" class="bluec.base.CQuery"/>
<%
  String uid=session.getAttribute("gUserId").toString();
  int k = 0;
  try{
   pquery.queryBySqlIDWithParam("@USERFUNC",uid,session);
   while(pquery.next()&&k<15){
%>
  <tr bgcolor="#eeeeff">
    <td width="22" height="21" align="center"><img src="images/funhint.gif" width="16" height="16"></td>
    <td style="padding:4px 0px 0px 4px;color:#666666"><span onclick="callBack(<%=pquery.getString(2)%>);"><label><%=pquery.getString(5)%></label></span></td>
  </tr>
<%
	k++;
   }
   while(k<15){
%>
  <tr bgcolor="#eeeeff">
    <td width="22" height="21" align="center">&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
<%  
   k++;	
   }
  // out.print(pquery.formatResultToXML4());
  }catch(Exception ex){
   out.println(request.getRequestURI()+"\n打开数据产生异常:\n"+ex.getMessage());
  }finally{
   pquery.closeConn();
  }   
%>
  <tr bgcolor="#eeeeff">
    <td width="22" height="18" align="center">&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
 </table>


