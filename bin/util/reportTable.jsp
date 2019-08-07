
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<div id="export" class="exportlinks"></div>
<div style="overflow:auto;border:0px solid;left:10px;top:100px;width:100%;height:90%;" id="grid"> 
<display:table name="test" export="true" class="table_tag" cellpadding="0" cellspacing="1" id="t1">
<%
String[] columns_cn = td.getCurColumn();
int[] disOrder = td.getDisplayorder();
for(int i = 0;i < td.getRecordColumn();i++){
if(td.isVi(i+1)){
	continue;
}
String propertyName = td.transform(disOrder[i]);
String titleName = columns_cn[disOrder[i]- 1];
String style = td.getCurColCss(disOrder[i] - 1);
%>
  <display:column property="<%=propertyName%>" title="<%=titleName%>" style="<%=style%>" headerClass="titlecell1" class="field1"/>
<%
}  
%>
  <display:setProperty name="export.pdf" value="true" />
  </display:table>
</div>

