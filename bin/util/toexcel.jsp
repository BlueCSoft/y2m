<%@page contentType="application/vnd.ms-excel;charset=gb2312"%>
<%@page language="java" import="jxl.Workbook,jxl.write.Label,jxl.write.WritableWorkbook,jxl.write.WriteException"%>
<%
  String ofilename = "����.xls";
  ofilename = new String(ofilename.getBytes("gb2312"),"iso8859-1");  
  response.addHeader("Content-Disposition", "attachment;filename="+ofilename);

  WritableWorkbook wwb = null;
  try {
   wwb = Workbook.createWorkbook(response.getOutputStream());
   //����������
   jxl.write.WritableSheet ws = wwb.createSheet("Sheet1", 0);
   //�����������
   int i = 0;
   Label labelC = new Label(0, i, "����");
   ws.addCell(labelC);
  }catch(Exception e) {
   e.printStackTrace();
  } finally {
   if(wwb != null){
    wwb.write();
    wwb.close();
   }
  }   
%>


