<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>


<table width="100%" border="0" cellspacing="1" cellpadding="1" bgcolor="#eeeeee">
<jsp:useBean id="pquery" scope="page" class="bluec.base.CQuery"/>
<%
  String[] colors = {"e1e1ff","eaeaff","e1e1ff","eaeaff","e1e1ff","eaeaff","e1e1ff","eaeaff","e1e1ff","eaeaff"};
  String[] params={session.getAttribute("gBmCode").toString(),
                   session.getAttribute("gPubYf").toString(),
				   session.getAttribute("gUserId").toString()};
  int k = 0;
  try{
   pquery.queryBySqlIDWithParam("#CHECK_BILL",params,session);
   while(pquery.next()){
%>
  <tr bgcolor="#FFFFFF">
    <td width="22" height="21" align="center"><img src="images/taskhint.gif" width="16" height="16"></td>
    <td style="padding:4px 0px 0px 4px;color:#666666">
	 <a href="#" onclick="callBack('0301');">
	 有&nbsp;<%=pquery.getInt("DWS")%>&nbsp;个单位
	 &nbsp;<%=pquery.getString("BILLNAME")%>待审批</a>
	</td>
  </tr>
<%
    k++;
   }
   while(k<7){
%>
  <tr bgcolor="#FFFFFF">
    <td width="22" height="21" align="center">&nbsp;</td>
    <td style="padding:4px 0px 0px 4px;color:#666666">&nbsp;</td>
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
  <tr bgcolor="#ffffff">
    <td width="22" height="18" align="center">&nbsp;</td>
    <td>&nbsp;</td>
  </tr>

 </table>


