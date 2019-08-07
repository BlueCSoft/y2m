<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*"%>

<jsp:useBean id="plimit" scope="page" class="bluec.base.CLogin"/>
<%
 request.setCharacterEncoding("GBK");
 response.addHeader("Expires","0");
 response.addHeader("Cache-Control","must-revalidate,post-check=0,pre-check=0");
 response.addHeader("Pragma", "public"); 
 
 if(plimit.checkLimit(request)<0){
   out.println(plimit.getLastError());
   return;
 }
%>

<!DOCTYPE html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<title>表及字段属性设置</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link href="../theme/page.css?version=16" rel="stylesheet" type="text/css">
<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>
<script src="../js/xmlhttp.js"></script>
<script src="../js/idataset.js"></script>
<script src="../js/datasource.js"></script>
<script src="../js/idbgrids.js"></script>
<script src="../js/db.js"></script>
<script src="../js/iqrgrids.js"></script>
<script>
  __DEBUG = false;
  var table,tabled;
  var ds,dsd,DBGrid,DBGridd;
   
  function doSelectChange(sender){
    table.getDataFromServer("#SYS_LEXICONM",[typeSelect.value,opEdit.value,opEdit.value]);
  }
  
  var oldId = "";
  function OnDataChange(ds,dSet,field){
   if(dSet!=null&&field==null)
    DBGridd.readOnly = dSet.isEmpty();
  }
    
  function AfterInsert(dSet){
   if(dSet==table)
     dSet.setFieldValue("T_TYPE",typeSelect.value);
   else{
	 dSet.setFieldValue("F_XH",tabled.getRecordCount()); 
    //dSet.setFieldValue("T_ID",table.getFieldValue("T_ID")); 	
   } 	
  }
  
  function doLoad(){
   $("#divClient").css("height",document.documentElement.clientHeight-56); 

   table = new TTable("SYS_LEXICONM","#SYS_LEXICONM",["B","",""]);

   table.AfterInsert = AfterInsert;   
   table.dEmptyNotSave = false;

   ds = new TDataSource();
   ds.OnDataChange = OnDataChange;
   table.addDataSource(ds); 
  
   tabled = new TTable("SYS_LEXICOND","#SYS_LEXICOND",["None"]);
   tabled.AfterInsert = AfterInsert;
   
   tabled.setMasterDataSet(table,"T_ID","#SYS_LEXICOND",true);
   
   dsd = new TDataSource();
   tabled.addDataSource(dsd); 

   DBGrid.setDataSource(ds);  
    
   DBGridd.setDataSource(dsd);

   DBGrid.paint();  
   DBGridd.paint();  
   doSelectChange(typeSelect);     

   QrGrid.boundQuery(__$Query,false);
  }
  
  <!--自动增加字段-->
  function doSelect(){
    var findMark = false;  <!--查找标记-->
	var i = 0, j = 0, dtype = "";
	tabled.enableControl = false;
	
    __$Query.first();
	
    while(i<__$Query.recordCount){
     
      findMark = false;
	  j = 0;
	  if(__$Query.$("F5")!="0"){
		 if(__$Query.$("F7")!="0")
		    dtype = __$Query.$("F4")+"("+__$Query.$("F5")+","+__$Query.$("F7")+")";
		 else
		    dtype = __$Query.$("F4")+"("+__$Query.$("F5")+")";
	  }else
		 dtype = __$Query.$("F4");

      while(j<tabled.getRecordCount()&&!findMark){
		 tabled.moveRecord(j+1); 
        findMark = tabled.$("F_NAME") == __$Query.$("F1");
		
		if(findMark){
		  tabled.$set("F_DATATYPE",dtype);
		  tabled.post();
		}
		j++;
      }
	  
      if(!findMark){
		
        tabled.insert();
		tabled.$set("T_ID",table.$("T_ID"));
        tabled.$set("F_XH",""+tabled.getRecordCount());
        tabled.$set("F_NAME",__$Query.$("F1"));
		tabled.$set("F_LABEL",__$Query.$("F1"));
		tabled.$set("F_DATATYPE",dtype);
		tabled.$set("F_NULL",__$Query.$("F6"));
        tabled.post();
      }
      __$Query.next();
	  i++;
    }
	tabled.enableControl = true;
	DBGridd.reFresh();
	__VCL.closeDialog('dialogModal');  
  }
  
  function openMeta(){
     __$Query.Get("../util/gettablemeta.jsp?tablename="+table.$("T_ID"))
	 titleCaption.innerText = table.$("T_ID");
     __VCL.showDialog("dialogModal","dialogBody",680,560);
	 //$("#menuModal").modal({ keyboard: true  });
  }

</script>

</head>
<body onLoad="doLoad();">
<table width="100%" height="100%"  border="0" id="mainTable">
<tr><td height="40">
    <div style="height:40px; padding-top:4px; font-size:13px">
     <table width="100%" height="100%"  border="0">
      <tr>
        <td width="400"><table width="100%"  border="0">
          <tr>
            <td width="64" align="right">&nbsp;表分类：</td>
			<td><input name="opEdit" type="text" id="opEdit" size="20" class="form-control" style="font-size:13px"
			    onKeyDown="if(window.event.keyCode==13) doSelectChange(this);"></td>
            <td style="padding-left:4px">
			<select id="typeSelect" style="width:160px;font-size:13px" onChange="doSelectChange(this);" class="form-control">
			<option value="B" selected>基础</option>  	
            <option value="O">业务</option>  	 	
            <option value="S">系统</option> 		
			<option value="">所有</option>  			
			</select>
            </td>
            </tr>
        </table></td>
        <td align="left" valign="middle">&nbsp;
          <button name="btIns" class="btn btn-primary btn-sm" id="btIns" onClick="table.insert();">
          <span class="glyphicon glyphicon-plus-sign"></span> 增 加</button>
          <button name="btDel" class="btn btn-primary btn-sm" onClick="table.DeleteHint();">
          <span class="glyphicon glyphicon-remove-circle"></span> 删 除</button>
          <button name="btInsd" class="btn btn-primary btn-sm" id="btInsd" onClick="tabled.insert();">
          <span class="glyphicon glyphicon-plus-sign"></span> 增加明细</button>
          <button name="btDeld" class="btn btn-primary btn-sm" id="btDeld" onClick="tabled.DeleteHint();">
          <span class="glyphicon glyphicon-remove-circle"></span> 删除明细</button>
          <button name="btDef" class="btn btn-primary btn-sm" onClick="openMeta();">
          <span class="glyphicon glyphicon-list-alt"></span> 表定义</button>
          <button name="btSave" class="btn btn-primary btn-sm" onClick="table.applyUpdate('');">
          <span class="glyphicon glyphicon-book"></span> 保 存</button>
          </td>
      </tr>
    </table>
    </div>
</td></tr>
<tr><td>
    <div style="padding-left:4px;padding-right:4px;padding-bottom:4px;" id="divClient">
    <table border="0" width="100%" height="100%">
    <tr><td width="488px">
<div id="grid" style="overflow:hidden;border:1px solid #ccc;height:100%;position:relative;border-radius:5px">
	<script>	  
 
  DBGrid = new TDBGrid(grid,"grid");
  
  DBGrid.titleLinebs = 1.2;
  DBGrid.addColumn({fieldName:"T_ID",width:185}).title.caption = "表名称";
  DBGrid.addColumn({fieldName:"T_NAME",width:192}).title.caption = "表说明";  
  DBGrid.addColumn({fieldName:"T_TYPE",width:56}).title.caption = "分类";    
  DBGrid.columns[2].font.fontStyle = "italic";
  DBGrid.createGrid(); 
		</script>  
	  </div>
    </td><td>
<div id="gridd" style="overflow:hidden;border:1px solid #ccc;height:100%;position:relative;border-radius:5px;">
		<script>

  DBGridd = new TDBGrid(gridd,"gridd");
  
  DBGridd.titleLinebs = 1.2;
  DBGridd.fixedCol = 2;
  
  DBGridd.addColumn({fieldName:"F_NAME",width:160,color:"#f8f8f8"}).title.caption = "字段名称";

  DBGridd.addColumn({fieldName:"F_LABEL",width:160,color:"#f8f8f8"}).title.caption = "字段标题";
  DBGridd.addColumn({fieldName:"F_DATATYPE",width:128}).title.caption = "数据类型";        
  DBGridd.addColumn({fieldName:"F_KEY",width:32,checkBox:true}).title.caption = "查找";    
  DBGridd.addColumn({fieldName:"F_NULL",width:32,checkBox:true}).title.caption = "可空";    
  DBGridd.addColumn({fieldName:"NOUPDATE",width:48,checkBox:true}).title.caption = "不更新";      
  DBGridd.addColumn({fieldName:"NOTE",width:360}).title.caption = "字段说明";    
  DBGridd.addColumn({fieldName:"F_SAFED",width:64}).title.caption = "安全控制";    
  DBGridd.addColumn({fieldName:"F_SETSAFE",width:32,checkBox:true}).title.caption = "替换";      
  DBGridd.addColumn({fieldName:"SHOWEDIT",width:120}).title.caption = "格式控制";      
  DBGridd.addColumn({fieldName:"F_FORMATERR",width:120}).title.caption = "格式提示信息";        
  DBGridd.addColumn({fieldName:"F_CONSTRANT",width:120}).title.caption = "约束表达式";        
  DBGridd.addColumn({fieldName:"F_ERRORMSG",width:120}).title.caption = "约束提示信息";          
  DBGridd.addColumn({fieldName:"SHOWFORMAT",width:120}).title.caption = "显示格式";            
  DBGridd.createGrid();  
		</script></div>
</td></tr></table>
     </div> 
    </div>		
   </div>
  </div>
</td></tr></table>

<div id="dialogModal" class="dialogWindow" style="visibility:hidden;">
  <div class="dialogMarkLayer"></div>
  <div class="dialogBody" style="width:680px;height:560px;" id="dialogBody">
  <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" class="">
  <tr><td height="32">
  <div class="dialogTitle">
    表定义(<span id="titleCaption"></span>)
    <span class="glyphicon glyphicon-remove-circle" style="float:right; cursor:pointer" onClick="__VCL.closeDialog('dialogModal');"></span>
  </div>
  </td></tr>
  <tr><td valign="top">
  <div style="border:0px solid #000;overflow:hide;width:100%;height:480px;position:relative; background-color:#CCC" id="gridd">
<script>
  QrGrid = new TQRGrid({widthMatchParent:false});
  QrGrid.setPropertys({name:"QRGrid",crossShowRow:false,tableBgColor:"#cccccc",rowBackGround:"#ffffff",usePre:false,
                       titleHeight:28,userActiceRow:true});
  QrGrid.addEx({Caption:"字段名称",FieldName:"F1",AlignMent:"left",Width:144});
  QrGrid.addEx({Caption:"数据类型",FieldName:"F4",AlignMent:"left",Width:88});
  QrGrid.addEx({Caption:"宽度",FieldName:"F5",AlignMent:"center",Width:64,b0Space:true});
  QrGrid.addEx({Caption:"精度",FieldName:"F7",AlignMent:"center",Width:64,b0Space:true});
  QrGrid.addEx({Caption:"可空",FieldName:"F6",AlignMent:"center",Width:64,b0Space:true});
  QrGrid.CreateGrid(true);  //不显示表格线
</script>
  </div>
  </td></tr>
  <tr><td height="48" style="background-color:#fff">
  <div style="height:100%; width:100%; border-top:1px solid #CCC;text-align:right; padding:5px; padding-right:24px">
     <button class="btn btn-primary btn-sm" onClick="doSelect()">
     <span class="glyphicon glyphicon-ok"></span> 选择</button>
     <button class="btn btn-primary btn-sm" onClick="__VCL.closeDialog('dialogModal');">
     <span class="glyphicon glyphicon-log-in"></span> 关闭</button>
  </div>
  </td></tr></table>
  </div>
</div>
</body>
</html>

