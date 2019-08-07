  <table border="0" cellpadding="2" cellspacing="2" align="center">
  <tr align="center">
   <td width="56">
      <select id="pageSelect" style="width:56px; height:24px; font-size:13px" onChange="doSelectChange(this);">
<%out.print(plimit.getOptionsValue(new int[]{10,15,20,30,40,50},__pagesize)); %>  
      </select>
   </td>
   <td width="200" valign="middle">
    <div id="pageInp" class="span_navigate" style="width:98%"></div> 
   </td>
   <td height="19" align="left" width="200">
   <input type="button" disabled class="button_navigate"  
   id="btFirst" onClick="<%=__dataset%>.getFirstPage();" value="首页"><input type="button" disabled class="button_navigate" 
   id="btPrior" onClick="<%=__dataset%>.getPriorPage();" value="上页"><input type="button" disabled class="button_navigate" 
   id="btNext" onClick="<%=__dataset%>.getNextPage();" value="下页"><input type="button" disabled class="button_navigate" 
   id="btLast" onClick="<%=__dataset%>.getLastPage();" value="尾页">
   </td>
   <td width="48"><div class="span_navigate" style="width:46px; background-color:#eee">转到：</div></td>
   <td width="28"><input name="inpPage" type="text" class="span_navigate" style="width:26px" id="inpPage" size="3" value="1"></td>
   <td width="24"><div class="span_navigate" style="width:22px; background-color:#eee">页</div></td>
   <td width="40"><input type="button" class="button_navigate" id="btGo" onClick="<%=__dataset%>.getPage(inpPage.value);" value="GO"></td>
  </tr>
  </table>
