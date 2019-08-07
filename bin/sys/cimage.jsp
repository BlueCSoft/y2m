<%@page contentType="image/jpeg;charset=gb2312"%>
<%@page language="java"%>
<jsp:useBean id="pimage" scope="page" class="bluec.base.CImage"/>
<%
 pimage.CreateImage(request.getParameter("checkCode").toString(),
                    session,
                    response);
%>

