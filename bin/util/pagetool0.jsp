  <table border="0" align="center">
  <tr align="center">
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
  </tr>
  </table>
