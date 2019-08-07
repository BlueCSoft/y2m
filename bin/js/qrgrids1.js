/*表列定义*/
qrvsDefault = 0;
qrvsInput   = 1;
qrvsButton  = 2;
qrvsImg     = 4;
qrvsHtml    = 5;
qrvsList    = 6;

TQRColumn.prototype.Index = 0;
TQRColumn.prototype.Caption = "";
TQRColumn.prototype.FieldName = "";
TQRColumn.prototype.SFieldName = "";
TQRColumn.prototype.AlignMent = "center";
TQRColumn.prototype.FontStyle = "";
TQRColumn.prototype.DataFormat = "";
TQRColumn.prototype.Width = 0;
TQRColumn.prototype.Islink = false;
TQRColumn.prototype.IsImage = false;    //是图形
TQRColumn.prototype.addString = "";     //后缀字符
TQRColumn.prototype.afxString = "";     //前缀字符 
TQRColumn.prototype.isCombCol = false;  //是复合列
TQRColumn.prototype.combColHtml = "";   //复合列脚本
TQRColumn.prototype.subFieldName = [];  //复合列字字段
TQRColumn.prototype.subFieldFormat = [];//复合列子字段格式
TQRColumn.prototype.subCellObj = [];    //复合列字字段
TQRColumn.prototype.valueStyle = qrvsDefault;
TQRColumn.prototype.styleClass = "";
TQRColumn.prototype.pickNos = [];
TQRColumn.prototype.pickNames = [];
TQRColumn.prototype.usePre = false;

function TQRColumn(Index,Caption,FieldName,AlignMent,FontStyle,DataFormat,Width,IsLink){
  this.Index = Index;
}

TQRColumn.prototype.init = function(Caption,FieldName,AlignMent,FontStyle,DataFormat,Width,IsLink){
  this.Caption = Caption;
  this.FieldName = FieldName;
  this.SFieldName = FieldName;
  this.AlignMent = AlignMent;
  this.FontStyle = FontStyle;  
  this.DataFormat = DataFormat;
  this.Width = Width;  
  this.IsLink = IsLink;
}

TQRColumn.prototype.setPropertys=function(props){
  for(var i in props)
    this[i] = props[i];
}

TQRColumn.prototype.setChildCol = function(cell,rowIndex){   //设置子列字段
  var setChild = function(ccell,obj){
	for(var i=0;i<ccell.childNodes.length;i++){
	  var scell = ccell.childNodes[i];
	  if(scell.childNodes.length==0){
		if(typeof(scell.id)!="undefined"&&scell.id!=""){
			
	     var k = scell.id.indexOf(";");
		 obj.subFieldName.push((k<0)?scell.id:scell.id.substring(0,k)); 
		 var dataFormat = (k<0)?"":scell.id.substring(k+1);
		 obj.subFieldFormat.push(dataFormat);
		 obj.subCellObj[rowIndex].push(scell);
		}
	  }else
	    setChild(scell,obj);
	}
  }
  
  this.subFieldName = [];
  this.subFieldFormat = [];
  this.subCellObj = [];  
  this.subCellObj[rowIndex] = [];
  
  setChild(cell,this);
}

TQRColumn.prototype.setChildObj = function(cell,rowIndex){   //设置子列字段
  var setChild = function(ccell,obj){
	for(var i=0;i<ccell.childNodes.length;i++){
	  var scell = ccell.childNodes[i];
	  if(scell.childNodes.length==0){
		if(typeof(scell.id)!="undefined"&&scell.id!=""){
		  obj.subCellObj[rowIndex].push(scell);
		}
	  }else
	    setChild(scell,obj);
	}
  }
  
  this.subCellObj[rowIndex] = [];
  setChild(cell,this);
}

/*表格定义*/
TQRGrid.prototype.titleClass = "FixedTitleRow";
TQRGrid.prototype.fixedClass = "FixedDataColumn";
TQRGrid.prototype.crossShowRow = true;
TQRGrid.prototype.crossRows = 2;
TQRGrid.prototype.crossColor = "#eef6f9";
TQRGrid.prototype.OrigRow = null;
TQRGrid.prototype.oBackGround = "";
TQRGrid.prototype.oFontColor = "";
TQRGrid.prototype.nBackGround = "#bbbbff";
TQRGrid.prototype.nFontColor = "#ffffff";
TQRGrid.prototype.rowBackGround = "";
TQRGrid.prototype.backGround = "";
TQRGrid.prototype.cellClass = "";  //"cell1";
TQRGrid.prototype.titleBgColor = "#aabbff";
TQRGrid.prototype.tableBgColor = "";

TQRGrid.prototype.rowHeight = 19;   //默认行高,=0动态行高
TQRGrid.prototype.titleHeight = 0;  //默认表头行高,0-等于rowHeight
TQRGrid.prototype.inpWidth = 32;    //序号列宽度
TQRGrid.prototype.fixedCol = false; //固定列宽
TQRGrid.prototype.fixedCaption = "序号";
TQRGrid.prototype.wordBreak = true; //超长断行显示

TQRGrid.prototype.OnRowClick = null;
TQRGrid.prototype.OnRowDblClick = null;
TQRGrid.prototype.OnKeyDown = null;
TQRGrid.prototype.OnDrawCell = null;
TQRGrid.prototype.OnDrawElement = null;
TQRGrid.prototype.OnCellClick = null;

TQRGrid.prototype.topRow = 1;       //表头行数,0-表示不显示表头
TQRGrid.prototype.recNoCol = 1;     //序号列,0-表示不显示序号列

TQRGrid.prototype.gridLine = true;
TQRGrid.prototype.fixedColStyle = "";
TQRGrid.prototype.paintReCreate = false;  //true时,刷新数据时，先全部删除表格行
TQRGrid.prototype.usePre = true;
TQRGrid.prototype.userActiceRow = true;
function $QrParentTable(row){
  while(row.parentNode!=null&&
	    row.parentNode.tagName.toUpperCase()!="TABLE"){
	 row = row.parentNode; 
  }
  return row.parentNode;
}

function TQRGrid(useSelected,SelectdField,rowHeight,fixedCol,wordBreak,
				 hideTitle,fixedCaption){
  this.useSelected = useSelected;
  this.SelectdField = SelectdField;
  this.SelectdSField = SelectdField;
  
  this.rowHeight = rowHeight;
  this.heightStyle = (rowHeight==0)?"":"height=\""+rowHeight+"\"";
  
  this.fixedCol = fixedCol;
  this.fixedStyle = (fixedCol)?"style=\"table-layout:fixed\"" : "";
  this.wordBreak = wordBreak;
  
  if(wordBreak) this.cellClass = "qrcell"
  
  this.fixedCaption = (typeof(fixedCaption)=="undefined")?"序号":fixedCaption;
  this.topRow = (typeof(hideTitle)!="undefined"&&hideTitle)?0:1;
  this.recNoCol = (this.fixedCaption=="")?0:1;
  
  this.OrigRow = null;
  this.Columns = [];
  this.oldRowCount = 0;
  this.inpSetting = false;  //指示列定制
  
  __VCL.add(this);
}

TQRGrid.prototype.free = function(){
  this.Table.owner = null;
  this.Query.QRGrid = null;
  this.Columns = null;
}

TQRGrid.prototype.setPropertys=function(props){
  for(var i in props)
    this[i] = props[i];
}

TQRGrid.prototype.boundQuery = function(Query,bAutoLines){
  this.Query = Query;
  Query.QRGrid = this;
  
  if(Query.className=="TQuery"){
    Query.KeyField = this.SelectdField;
    Query.KeySField = this.SelectdSField;
    Query.useSelected = this.useSelected;
  }
  
  if(bAutoLines&&this.rowHeight>0){     //计算每页可以显示的行数
    var h = this.Table.parentNode.offsetHeight;
	var rH = (this.gridLine)?this.rowHeight+1 : this.rowHeight;
	this.PageLines = Math.ceil((h-this.topRow*rH)/rH);
	
    if(this.PageLines>0)
	  Query.pageSize = this.PageLines;  
  }
  
  if(Query.className!="TQuery")
	this.doDataChange();        //刷新表格显示
}

TQRGrid.prototype.add = function(Caption,FieldName,AlignMent,
				                 FontStyle,DataFormat,Width,IsLink){
  var Column = new TQRColumn(this.Columns.length);
  Column.init(Caption,FieldName,AlignMent,FontStyle,DataFormat,Width,IsLink);
  this.Columns.push(Column);
  return Column;
}

TQRGrid.prototype.addColumn = function(Caption,FieldName,AlignMent,
				                 FontStyle,DataFormat,Width,IsLink){
  return this.add(Caption,FieldName,AlignMent,
                  FontStyle,DataFormat,Width,IsLink);	
}

TQRGrid.prototype.addEx = function(props){
  var Column = new TQRColumn(this.Columns.length);	
  Column.setPropertys(props);
  this.Columns.push(Column);
  return Column;
}

TQRGrid.prototype.setSFieldByFields = function(){

  for(var i=0;i<this.Columns.length;i++)
    this.Columns[i].SFieldName = this.Query.getSFieldByField(this.Columns[i].FieldName);

  if(this.SelectdField!=""&&this.Query.className=="TQuery"){
    this.SelectdSField = this.Query.getSFieldByField(this.SelectdField);
	this.Query.KeySField = this.SelectdSField;
  }
}

TQRGrid.prototype.ChangeOrigRow = function(NewRow){

  if(this.userActiceRow){
   var OrigRow = this.OrigRow;  //原选择的行
   if(NewRow==OrigRow) return;

   if(OrigRow != null){
    OrigRow.style.color = this.oFontColor;
    OrigRow.style.background = this.oBackGround;
   }

   this.oBackGround = NewRow.style.background;
   this.oFontColor = NewRow.style.color;
	
   this.OrigRow = NewRow;
   NewRow.style.background = this.nBackGround;
   NewRow.style.color = this.nFontColor;
  }
}

TQRGrid.prototype.ChangeOrigRowByRecNo = function(recNo){
  var r = this.topRow+recNo-1;
  this.ChangeOrigRow(this.Table.rows[r]);
}

TQRGrid.prototype.doMoveRecord = function(recNo){
  var r = this.topRow+recNo-1;
  this.ChangeOrigRow(this.Table.rows[r]);	
}

//this = TableRow对象
TQRGrid.prototype.RowClick = function(){
  var Grid = $QrParentTable(this).owner;
  var r = this.rowIndex - Grid.topRow+1;  
  if(r<=Grid.Query.getRecordCount()){
    Grid.ChangeOrigRow(this);
    Grid.Query.doRecordChange(r);
	if(Grid.OnRowClick!=null)
      Grid.OnRowClick(r);
  }
}

TQRGrid.prototype.RowDblClick = function(){  
  var Grid = $QrParentTable(this).owner;
  
  if(Grid.Query.className=="TQuery")
    Grid.Query.SelectedReturn();     //返回准备
	
  if(this.rowIndex>=Grid.topRow&&Grid.OnRowDblClick!=null){
	var r = Grid.OrigRow.rowIndex - Grid.topRow+1;  
    Grid.OnRowDblClick(r);
  }
}

//this.parentNode.parentNode = TableRow对象
TQRGrid.prototype.CheckBoxClick = function(){
  var row = this.parentNode.parentNode;
  var Grid = $QrParentTable(row).owner;	
  var r = row.rowIndex - Grid.topRow+1;
  
  if(Grid.Query.className=="TQuery")
    Grid.Query.doSelectRow(row.rowIndex,this.checked);  
}

TQRGrid.prototype.ButtonBoxClick = function(checked){
  var row = this.parentNode.parentNode;
  var Grid = $QrParentTable(row).owner;	

  if(Grid.Query.className=="TQuery"){
    if(this.id=="btAllBox"){
      for(var i=1;i<=Grid.Query.getRecordCount();i++){
        var r = Grid.topRow+i-1;
	    if(Grid.Table.rows[r].cells[1].childNodes[0].style.visibility == "")
         Grid.Query.doSelectRow(r,true);  
      }
    }else
      Grid.Query.doSelectRow(0,false);  
    Grid.refreshSelectRow(0);  
  }
}

//刷新选择列
TQRGrid.prototype.refreshSelectRow = function(rowIndex){
  var pTable = this.Table;
  var pQuery = this.Query;
  var ci = this.recNoCol;   //选择列位置
  if(this.useSelected){
    if(rowIndex==0){
	  var recNo = pQuery.recNo;
      for(var i=1;i<=pQuery.getRecordCount();i++){
	    pQuery.InnerMoveRecord(i);
	    var v = pQuery.$Inner("RR","",false);
  	    var r = this.topRow+i-1; 		
	    pTable.rows[r].cells[ci].childNodes[0].checked = v=="1";
	  }
	  pQuery.recNo = recNo;
    }else{
      var v = pQuery.$Inner("RR","",false);  
	  var r = this.topRow+rowIndex-1;
      pTable.rows[r].cells[ci].childNodes[0].checked = v=="1";
    }
  }
}
//字段值被修改了
TQRGrid.prototype.innerFieldChange = function(){

  var fieldName = this.id;
  var row = this.parentNode.parentNode;
  var Table = row.parentNode.parentNode;  
  var Grid = Table.owner;
  var query = Grid.Query;
  
  var r = row.rowIndex - Table.owner.topRow+1;  
  var saveRecNo = query.recNo;
  query.InnerMoveRecord(r);
  query.innerFieldChange(fieldName,this.value); 
  Grid.drawRow(r);
  query.InnerMoveRecord(saveRecNo);
}

TQRGrid.prototype.inputKeyDown = function(){
  if(event.keyCode==13)	
   this.onchange();
}

TQRGrid.prototype.elementClick = function(){
  var row = this.parentNode.parentNode;
  var Table = row.parentNode.parentNode;  
  var Grid = Table.owner;
  row.onclick();
  if(Grid.OnCellClick!=null)
    Grid.OnCellClick(this.id);
}

TQRGrid.prototype.drawRow = function(rowIndex){
  var Table = this.Table;
  var Query = this.Query;
	
  var r = rowIndex;
  var nLength = this.Columns.length;   
  var isQuery = Query.className == "TQuery";
  var k = this.recNoCol;	
  if(this.useSelected){
    this.refreshSelectRow(0);
	k++;
  }
  
  for(var j=0;j<nLength;j++){
	 var Col = this.Columns[j];

	 if(Col.isCombCol){   //是复合列
	   for(var f=0;f<Col.subFieldName.length;f++){
		 var v = Query.$Inner(Col.subFieldName[f],Col.subFieldFormat[f],false); 
		 var obj = Col.subCellObj[r][f]; 
		 var objLx = obj.tagName;
			 
		 if(this.OnDrawElement!=null)
	       v = this.OnDrawElement(obj,v);
		 if(objLx == "IMG")
		   obj.src = v;
		 else{
		   if(v=="") v = " ";	 
		  
		   obj.innerHTML = (this.usePre||Col.usePre)?"<pre>"+v+"</pre>":v;
		 }
	   }
	 }else{
	   var SFieldName = (isQuery)?Col.SFieldName:Col.FieldName;
	   
       var v = (SFieldName!=""&&Col.valueStyle!=qrvsHtml&&Col.valueStyle!=qrvsButton)?
	               Query.$Inner(SFieldName,Col.DataFormat,false):"";
	   			   
	   var cell = Table.rows[r].cells[j+k];
	   if(this.OnDrawCell!=null){
	     var v0 = this.OnDrawCell(Col,cell,v);
		 if(typeof(v0)!="undefined")
		   v = v0;
	   }
	   switch(Col.valueStyle){
		 case qrvsDefault:
      		   if(v!=""){
		         if(Col.addString!="") v = v+Col.addString;
		         if(Col.afxString!="") v = Col.afxString+v;
	           }
	           if(v=="") v = " ";
			   else 
			    if(Col.isLink) v = "<a href=\"#\">"+v+"</a>";
			   
	           cell.innerHTML = (this.usePre||Col.usePre)?"<pre>"+v+"</pre>":v;
			   break;
	     case qrvsInput:
		       var cName = "";
			   if(cell.childNodes.length==0){
 			     if(Col.styleClass!="")
			       cName = "class=\""+Col.styleClass+"\"";
		         cell.innerHTML = "<input id=\""+Col.FieldName+"\" type=\"text\" "+cName+" value=\""+v+"\">";
			     cell.childNodes[0].onchange = this.innerFieldChange;
			     cell.childNodes[0].onkeydown = this.inputKeyDown;
			   }else
			     cell.childNodes[0].value = v;
		       break;
	     case qrvsButton:
		       var cName = "";
			   if(cell.childNodes.length==0){
			     if(Col.styleClass!="")
			       cName = "class=\""+Col.styleClass+"\"";
		         cell.innerHTML = "<input type=\"button\" id=\""+Col.DataFormat+"\" "+cName+" value=\""+Col.FieldName+"\">";
				 cell.childNodes[0].onclick = this.elementClick;
			   }
		       break;
	     case qrvsImg:
		       if(cell.innerHTML==""){
		         cell.innerHTML = "<img id=\""+Col.FieldName+"\" src=\""+"pic/010001_l.jpg"+"\">";
				 cell.childNodes[0].onclick = this.elementClick;
			   }
		       break;
	     case qrvsHtml:
		       if(cell.innerHTML==""){
		         cell.innerHTML = Col.FieldName; 
				 for(var i=0;i<cell.childNodes.length;i++){
				   if(typeof(cell.childNodes[i].tagName)!="undefined")
				     cell.childNodes[i].onclick = this.elementClick; 
				 }
			   }
		       break;
		 case qrvsList:
		       for(var i=0;i<Col.pickNos.length;i++)
			     if(v==Col.pickNos[i]){
					 v = Col.pickNames[i];
					 break;
				 }
 			  cell.innerHTML = (this.usePre||Col.usePre)?"<pre>"+v+"</pre>":v; 
		      break;
	   }
	 }
  }	
}

TQRGrid.prototype.paint = function(){
   
   var Table = this.Table;
   var Query = this.Query;
   
   var rowCount = Table.rows.length-this.topRow;  //表格行数
   var RecordCount = Query.getRecordCount();      //数据行数
   
   //this.OrigRow = null;

   if(rowCount>RecordCount||this.paintReCreate){  //表格行大于数据行,删除多余的行
     var k = (this.paintReCreate)? RecordCount:rowCount-RecordCount; 
	 var i = Table.rows.length-1;
     while(k>0&&i>=this.topRow){
	   Table.rows[i].onclick = null;
	   Table.rows[i].ondblclick = null;
	   Table.deleteRow(i); 
	   i--;
	   k--;
	 }
	 
	 if(this.paintReCreate) rowCount = 0;
   }
   
   if(rowCount<RecordCount){
	   for(var i=0;i<RecordCount-rowCount;i++){	 
	     var NewRow = Table.insertRow(Table.rows.length);
		 
		 if(this.crossShowRow&&i%this.crossRows==0)
		   NewRow.style.background = this.crossColor
		 else  
		   if(this.rowBackGround!="")
 	         NewRow.style.background = this.rowBackGround;
		 
	     NewRow.style.color = "#000000";

         var cell = null;
		 
		 if(this.recNoCol>0){
         //序号列		 			 
		   cell = NewRow.insertCell(-1);
		   if(this.rowHeight>0) cell.height = this.rowHeight;
		   cell.align = "center";
		   cell.className = "cell1";	 		   
		   if(this.topRow==0&&i==0) cell.width = 40;
		   if(this.fixedColStyle != "")
		     cell.style.cssText = this.fixedColStyle;
		 }

         if(this.useSelected){
		   cell = NewRow.insertCell(-1);
		   cell.align = "center";
		   if(this.rowHeight>0)
		     cell.innerHTML = "<input type=\"checkbox\" class=\"qrbox\">";
		   else
		     cell.innerHTML = "<input type=\"checkbox\">";
		   cell.childNodes[0].onclick = this.CheckBoxClick;
		 }
		 
		 var ht = this.topRow>0;
		 var enw = false;
		 
         for(var j=0;j<this.Columns.length;j++){
		   var col = this.Columns[j];	 
		   cell = NewRow.insertCell(-1)
		   cell.align = col.AlignMent;
		   
		   if(this.cellClass!="")
		     cell.className = this.cellClass;	 
			 
		   if(this.Columns[j].FontStyle!="")
		     cell.style.cssText = this.Columns[j].FontStyle;
		   //cell.style.whiteSpace = "pre-wrap";
		   
		   if(this.recNoCol==0&&!this.useSelected&&this.rowHeight>0)
		     cell.height = this.rowHeight;
			 
		   if(!ht&&i==0){
             var w = col.Width;
 	         enw = enw||w==0;  
	         if(!enw&&w!=0&&j==this.Columns.length-1) w = 0;
			 if(w>0) cell.width = w;
		   }
		   
		   if(col.isCombCol){  //复合列
		     cell.innerHTML = col.combColHtml;
			 if(NewRow.rowIndex==this.topRow)
			   col.setChildCol(cell,NewRow.rowIndex);	
			 else
			   col.setChildObj(cell,NewRow.rowIndex);
		   }
		 }
		 NewRow.onclick = this.RowClick;
		 NewRow.ondblclick = this.RowDblClick;
	   }
   }
      
   for(var i=1;i<=Query.getRecordCount();i++){
	  Query.InnerMoveRecord(i);
	  var r = this.topRow+i-1;

	  this.drawRow(r);

	  if(this.recNoCol>0){
		var sRecNo = i+Query.pageSize*(Query.pageNumber-1);
		var bLevel = false;
	    if(this.inpSetting){
		  var v = Query.$Inner(this.inpFieldName,"",false);
		  if(v!=""&&!eval(v+this.inpFormula)){
			bLevel = true;
		    sRecNo += this.inpStr;
		  }
		}
	    Table.rows[r].cells[0].innerHTML = sRecNo;//i+Query.pageSize*(Query.pageNumber-1);
		if(this.useSelected){
		  if(bLevel)
		    Table.rows[r].cells[1].childNodes[0].style.visibility = "hidden";
		  else
		    Table.rows[r].cells[1].childNodes[0].style.visibility = "";
		}
	  }
	}
   if(!Query.isEmpty)
     this.ChangeOrigRowByRecNo(1);	
}

TQRGrid.prototype.doDataChange = function(){
  this.paint();	
}

//创建表格
TQRGrid.prototype.CreateGrid = function(gridLine){

  this.gridLine = gridLine;
  var lineWidth = (typeof(gridLine)=="undefined"||gridLine)?1:0;
  var tableBg = " ";
  if(this.tableBgColor!="")
    tableBg = " bgcolor=\""+this.tableBgColor+"\"";
  document.write("<table border=\"0\" id=\""+this.name+"\" width=\"100%\""+
				 "cellpadding=\"2\" cellspacing=\""+lineWidth+"\" "+this.fixedStyle+tableBg+">");
  if(this.topRow>0){
	var hStyle = (this.titleHeight==0)? this.heightStyle:"height=\""+this.titleHeight+"\"";
    document.write("<thead>");
    document.write("<tr align=\"center\" bgcolor=\""+this.titleBgColor+"\">");  
    document.write("<td width=\""+this.inpWidth+"\" "+hStyle+" class=\""+this.titleClass+"\">"+this.fixedCaption+"</td>");
  
    //var qrbox = (this.rowHeight>0)? "class=\"qrtitlebox\"" : "";
	var qrbox = "class=\"qrtitlebox\"";
    if(this.useSelected)
      document.write("<td width=\"34\" valign=\"top\" class=\""+this.titleClass+"\"><input type=\"button\" id=\"btAllBox\" value=\"√\" "+
	   			     qrbox+"><input type=\"button\" id=\"btUAllBox\" value=\"×\" "+qrbox+"></td>");

    var enw = false;  //表示已经有某列不设置宽度了
  
    for(var i=0;i<this.Columns.length;i++){
	  var col = this.Columns[i];  
	  var w = (col.Width==0)?"":"width=\""+col.Width+"\"";
	  enw = enw||w=="";  
	  if(!enw&&w!=""&&i==this.Columns.length-1)
	    w = "";
      document.write("<td "+w+" align=\"center\" class=\""+this.titleClass+"\">"+col.Caption+"</td>");
    }
    document.write("</tr>");
    document.write("</thead>");  
  }
  document.write("<tbody id=\""+this.name+"_body\">");

  document.write("</tbody>");
  document.write("</table>");

  this.Table = document.getElementById(this.name);
  this.Table.owner = this;
  if(this.backGround!="")
   this.Table.style.background = this.backGround;
   
  if(this.useSelected){
	var cell = this.Table.rows[0].cells[1]; 
    cell.childNodes[0].onclick = this.ButtonBoxClick;
	cell.childNodes[1].onclick = this.ButtonBoxClick;
  }
  
  for(var i=0;i<this.Columns.length;i++){  
    this.Columns[i].isCombCol = this.Columns[i].combColHtml!="";
  }
}

TQRGrid.prototype.doKeyDown = function(){  
  var keyCode = event.keyCode;
  var Query = this.Query;
  
  switch(keyCode){
	case 32:Query.SetRowSelected();  
	        break;
    case 33:Query.getPriorPage();
	        break;
	case 34:Query.getNextPage();	
	        break;
 	case 38:if(Query.recNo>1)
 	          Query.prior();
 		    else
			  Query.getPriorPage();	
	        break;
    case 40:if(Query.recNo<Query.getRecordCount())
	          Query.next();
		    else
			  query.getNextPage();	
            break;
	case 13:Query.SelectedReturn();     //返回准备		
	case 65:if(event.ctrlKey)           //Ctrl+A       
	          Query.doSelectRow(0,true);
			  this.refreshSelectRow(0);
			break;  
	case 85:if(event.ctrlKey)           //Ctrl+U       
	          Query.doSelectRow(0,false);
			  this.refreshSelectRow(0);
			break;  
  }
  
  if(this.OnKeyDown!=null)
    this.OnKeyDown(event.srcElement,keyCode);
}

TQRGrid.prototype.focus = function(){
  this.Table.focus();	
}

TQRGrid.prototype.setInpColAtt = function (fieldName, formula, inpStr) {
    this.inpSetting = fieldName!="" && formula!="" && inpStr!="";
    if (this.inpSetting) {
        this.inpFieldName = fieldName;
        this.inpFormula = formula;
        this.inpStr = inpStr;
    }
}
