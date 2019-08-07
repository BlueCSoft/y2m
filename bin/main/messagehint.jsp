<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>
<%@page import="java.util.*"%>
<%@page import="java.text.*"%>
<%@page import="java.io.*"%>
<%@page import="org.w3c.dom.*"%>
<%@page import="javax.xml.parsers.*"%>
<%@page import="javax.xml.transform.dom.*"%>
<%@page import="javax.xml.transform.stream.*"%>

<table width="100%" border="0" cellspacing="1" cellpadding="1" bgcolor="#DDDDDD">
<jsp:useBean id="pquery" scope="page" class="bluec.base.CQuery"/>
<%
  String[] colors = {"#eaeaff","#e1e1ff"};
  String[] colors2 = {"#ffffff","#f1f1ff"};  

  String[] params = {session.getAttribute("gBmCode").toString()};
  int k = 0,j=0;
  try{
   pquery.queryBySqlIDWithParam("@MESSAGEHINT",params,session);
   while(pquery.next()&&k<8){
	j++;
%>
   <tr bgcolor="<%=colors2[k%2]%>">
   <td width="22" height="20" align="center" bgcolor="<%=colors[k%2]%>"></td>
    <td style="padding-top:4px">&nbsp;<span style="color:#000066"><%=pquery.getString(1)%></span>
	    <span style="color:#666666">[<%=pquery.getString(2)%>]</span></td>
    <td width="104" align="center"  style="padding-top:4px">
	 <span style="color:#666666"><%=pquery.getString(3).substring(0,16)%></span></td>
   </tr>
<%
	k++;
   }
   while(k<8){
%>
  <tr bgcolor="<%=colors2[k%2]%>">
    <td width="22" height="22" align="center" bgcolor="<%=colors[k%2]%>">&nbsp;</td>
    <td>&nbsp;</td>
    <td width="104">&nbsp;</td>
  </tr>
<%  
   k++;	
   }
%>
  <tr bgcolor="#FFFFFF">
   <td width="22" height="22" align="center" bgcolor="<%=colors[8-k]%>">&nbsp;</td>
   <td align="right" colspan="2"><a href="#">消息查询...</a>&nbsp;&nbsp;</td>
  </tr>
<%   
  // out.print(pquery.formatResultToXML4());
  }catch(Exception ex){
   out.println(request.getRequestURI()+"\n打开数据产生异常:\n"+ex.getMessage());
  }finally{
   pquery.closeConn();
  }   
%>
 </table>


