/*表列定义*/
qrvsDefault  = 0;
qrvsInput    = 1;
qrvsButton   = 2;
qrvsImg      = 4;
qrvsHtml     = 5;
qrvsList     = 6;
qrvsCheckBox = 7;

TQRColumn.prototype.Index = 0;
TQRColumn.prototype.Caption = "";
TQRColumn.prototype.FieldName = "";
TQRColumn.prototype.LinkFieldName = "";
TQRColumn.prototype.SFieldName = "";
TQRColumn.prototype.AlignMent = "left";
TQRColumn.prototype.FontStyle = "";
TQRColumn.prototype.DataFormat = "";
TQRColumn.prototype.b0Space = false;
TQRColumn.prototype.Width = 0;
TQRColumn.prototype.maxLength = 0;
TQRColumn.prototype.isLink = false;
TQRColumn.prototype.linkAttr = false;
TQRColumn.prototype.target = "";
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
TQRColumn.prototype.imgUrl = "";        //图片地址
TQRColumn.prototype.imgWidth = 0;
TQRColumn.prototype.imgHeight = 0;
TQRColumn.prototype.defaultImg = "";    //默认图片
TQRColumn.prototype.allwayShowAdd = false;
TQRColumn.prototype.titleAlignMent = "";
TQRColumn.prototype.workBreak = true;
TQRColumn.prototype.cellIndex = -1;     //对应表格的列
TQRColumn.prototype.titleClick = true;
TQRColumn.prototype.showMark = 0;

function TQRColumn(Index,Caption,FieldName,AlignMent,FontStyle,DataFormat,Width,isLink){
  this.Index = Index;
}

TQRColumn.prototype.init = function(Caption,FieldName,AlignMent,FontStyle,DataFormat,Width,isLink){
  this.Caption = Caption;
  this.FieldName = FieldName;
  this.SFieldName = FieldName;
  this.AlignMent = AlignMent;
  this.FontStyle = FontStyle;  
  this.DataFormat = DataFormat;
  this.Width = Width;  
  this.isLink = isLink;
}

TQRColumn.prototype.setPropertys=function(props){
  for(var i in props)
    this[i] = props[i];
}

TQRColumn.prototype.setChildCol = function(cell,rowIndex){   //设置子列字段
  var setChild = function(ccell,obj){
	for(var i=0;i<ccell.childNodes.length;i++){
	  var scell = ccell.childNodes[i];
	  if(scell.childNodes.length==0||scell.id.substring(0,7)=="DYNNODE"){
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
	  if(scell.childNodes.length==0||scell.id.substring(0,7)=="DYNNODE"){
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
TQRGrid.prototype.tableClass = "table";
TQRGrid.prototype.titleClass = "";//"qrgridFixedTitleRow";
TQRGrid.prototype.fixedClass = "";//"qrgridFixedDataColumn";
TQRGrid.prototype.styleClass = "";
TQRGrid.prototype.crossShowRow = true;
TQRGrid.prototype.crossRows = 2;
TQRGrid.prototype.crossColor = "#eef9ee";
TQRGrid.prototype.OrigRow = null;
TQRGrid.prototype.oBackGround = "";
TQRGrid.prototype.oFontColor = "";
TQRGrid.prototype.nBackGround = "#ddffdd";
TQRGrid.prototype.nFontColor = "#000000";
TQRGrid.prototype.rowBackGround = "";
TQRGrid.prototype.backGround = "";
TQRGrid.prototype.cellClass = "";//"qrgridcell";
TQRGrid.prototype.titleBgColor = "";
TQRGrid.prototype.tableBgColor = "";
TQRGrid.prototype.border = "";

TQRGrid.prototype.rowHeight = 19;   //默认行高,=0动态行高
TQRGrid.prototype.titleHeight = 0;  //默认表头行高,0-等于rowHeight
TQRGrid.prototype.inpWidth = 48;    //序号列宽度
TQRGrid.prototype.fixedCol = false; //固定列宽
TQRGrid.prototype.fixedCaption = "No";
TQRGrid.prototype.wordBreak = true; //超长断行显示

TQRGrid.prototype.OnRowClick = null;
TQRGrid.prototype.OnRowDblClick = null;
TQRGrid.prototype.OnKeyDown = null;
TQRGrid.prototype.OnInputKeyDown = null;
TQRGrid.prototype.OnInputFocus = null;
TQRGrid.prototype.OnInputSetValue = null;
TQRGrid.prototype.OnDrawCell = null;
TQRGrid.prototype.OnSetLinkHref = null;

TQRGrid.prototype.OnDrawElement = null;
TQRGrid.prototype.OnDrawDynElement = null;
TQRGrid.prototype.OnCellClick = null;
TQRGrid.prototype.OnGetColumnHtml = null;
TQRGrid.prototype.OnGridElementClick = null;
TQRGrid.prototype.OnTitleClick = null;

TQRGrid.prototype.topRow = 0;          //表头行数,0-表示不显示表头
TQRGrid.prototype.recNoCol = 1;        //序号列,0-表示不显示序号列
TQRGrid.prototype.fixedColNumber = 0;  //左边固定列
TQRGrid.prototype.gridLine = true;
TQRGrid.prototype.fixedColStyle = "";
TQRGrid.prototype.paintReCreate = false;  //true时,刷新数据时，先全部删除表格行
TQRGrid.prototype.usePre = false;
TQRGrid.prototype.userActiceRow = false;
TQRGrid.prototype.widthMatchParent = false;
TQRGrid.prototype.cursor = "";
TQRGrid.prototype.rowStart = 1;
TQRGrid.prototype.srollRead = false;
 
function $QrParentTable(row){
  while(row.parentNode!=null&&
	    row.parentNode.tagName.toUpperCase()!="TABLE"){
	 row = row.parentNode; 
  }
  return row.parentNode;
}

function $QrParentTd(obj){
  while(obj.parentNode!=null&&obj.tagName.toUpperCase()!="TD"){
	 obj = obj.parentNode; 
  }
  return obj;
}

function TQRGrid(props){

  this.useSelected = false;
  this.SelectdField = "SEL";
  this.SelectdSField = "";
  this.KeyField = "";
  this.rowHeight = 28;
  
  this.fixedCol = false;
  this.wordBreak = false;
  this.hideTitle = false;
  this.fixedCaption = "No";
  this.name = "QRGrid";
  
  if(typeof(props)!="undefined")
    this.setPropertys(props);
  
  this.OrigRow = null;
  this.Columns = [];
  this.oldRowCount = 0;
  this.inpSetting = false;  //指示列定制
  this.Query = null;
  
  __VCL.add(this);
}

TQRGrid.prototype.free = function(){
  this.Table.owner = null;
  if(this.Query!=null&&this.Query.QRGrid!=null)
    this.Query.QRGrid = null;
  this.Columns = null;
}

TQRGrid.prototype.init = function(){
  this.heightStyle = (this.rowHeight==0)?"":"height=\""+this.rowHeight+"\"";
  this.fixedStyle = (this.fixedCol)?"style=\"table-layout:fixed\"" : "";
 
  //if(this.wordBreak) this.cellClass = "qrcell"
  
  //this.topRow = (this.hideTitle)?0:1;
  //this.recNoCol = (this.fixedCaption=="")?0:1;
}

TQRGrid.prototype.setPropertys=function(props){
  for(var i in props)
    this[i] = props[i];
  this.init();
  this.btAllBoxName = this.name+"btAllBox";	
}

TQRGrid.prototype.boundQuery = function(Query,bAutoLines){
  this.Query = Query;
  Query.QRGrid = this;
  
  if(Query.className=="TQuery"){
    Query.KeyField = this.KeyField;
    Query.SelectdField = this.SelectdField;
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
				                 FontStyle,DataFormat,Width,isLink){
  var Column = new TQRColumn(this.Columns.length);
  Column.init(Caption,FieldName,AlignMent,FontStyle,DataFormat,Width,isLink);
  this.Columns.push(Column);
  return Column;
}

TQRGrid.prototype.addColumn = function(Caption,FieldName,AlignMent,
				                 FontStyle,DataFormat,Width,isLink){
  return this.add(Caption,FieldName,AlignMent,
                  FontStyle,DataFormat,Width,isLink);	
}

TQRGrid.prototype.addEx = function(props){
  var Column = new TQRColumn(this.Columns.length);	
  Column.setPropertys(props); 
  if((Column.isLink||Column.linkAttr)&&Column.FontStyle=="")
    Column.FontStyle = "color:#00f;cursor:pointer";
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
	 if(this.fixedColNumber>0){
	   var rowIndex = OrigRow.rowIndex;
	   this.TableL.rows[rowIndex].style.color = this.oFontColor;
	   this.TableL.rows[rowIndex].style.background = this.oBackGround;  	 
	 }
   }
   if(NewRow != null){
     this.oBackGround = NewRow.style.background;
     this.oFontColor = NewRow.style.color;
	
     this.OrigRow = NewRow;
     NewRow.style.background = this.nBackGround;
     NewRow.style.color = this.nFontColor;
	 if(this.fixedColNumber>0){
	   var rowIndex = NewRow.rowIndex;
	   this.TableL.rows[rowIndex].style.color = this.nFontColor;
	   this.TableL.rows[rowIndex].style.background = this.nBackGround;  	 
	 }
   }
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
	if(Grid.OnGridElementClick!=null){
	  td = $QrParentTd(event.srcElement);
	  col = null;
	  fieldName = "";
	  for(i=0;i<Grid.Columns.length;i++)
	    if(td.cellIndex == Grid.Columns[i].cellIndex){
		  col = Grid.Columns[i];
		  fieldName = col.FieldName;
		  break;	
		}
	  Grid.OnGridElementClick(event.srcElement,col,fieldName);
	}
  }
}

//this = TableRow对象
TQRGrid.prototype.TitleRowClick = function(){
  var Grid = $QrParentTable(this).owner;
  if(Grid.OnTitleClick!=null){
	var td = $QrParentTd(event.srcElement);
	if(typeof(td.id) != "undefined"){
	  var col = Grid.Columns[parseInt(td.id)];
      Grid.OnTitleClick(Grid,col);
	}
  }
}
TQRGrid.prototype.RowDblClick = function(){  
  var Grid = $QrParentTable(this).owner;
  
  if(Grid.Query.className=="TQuery")
    Grid.Query.SelectedReturn();     //返回准备
	
  if(this.rowIndex>0&&Grid.OnRowDblClick!=null){
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
    if(this.id==Grid.btAllBoxName){
	  Grid.Query.doSelectRow(0,this.checked);  
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
	    var v = pQuery.$Inner(this.SelectdField,"",false)+"";
  	    var r = this.topRow+i-1; 		
	    pTable.rows[r].cells[ci].childNodes[0].checked = v=="1";
	  }
	  pQuery.recNo = recNo;
    }else{
      var v = pQuery.$Inner(this.SelectdField,"",false)+"";  
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
  
  var Table = $QrParentTable(this);  
  var Grid = Table.owner;
  var query = Grid.Query;
  
  if(Grid.OnInputKeyDown!=null)
    Grid.OnInputKeyDown(this.id,query);
}

TQRGrid.prototype.inputFocus = function(){
  var Table = $QrParentTable(this);  
  var Grid = Table.owner;
  var query = Grid.Query;
  
  if(Grid.OnInputFocus!=null)
    Grid.OnInputFocus(this.id,this,query);
}

TQRGrid.prototype.elementClick = function(){
  var row = this.parentNode.parentNode;
  var Table = row.parentNode.parentNode;  
  var Grid = Table.owner;
  row.onclick();
  if(Grid.OnCellClick!=null)
    Grid.OnCellClick(this.id);
}

TQRGrid.prototype.doDrawRow = function(rowIndex,iStart,iEnd,Table){

  var Query = this.Query;
	
  var r = rowIndex;
  var nLength = iEnd;   
  var isQuery = Query.className == "TQuery";
  var k = (iStart==0)?this.recNoCol:0;	
  if(iStart==0&&this.useSelected){
    this.refreshSelectRow(r);
	k++;
  }

  for(var j=iStart;j<nLength;j++){
	 var Col = this.Columns[j];
	 if(Col.isCombCol){   //是复合列
       		
	   for(var f=0;f<Col.subFieldName.length;f++){
		 var obj = Col.subCellObj[r][f]; 
		 var objLx = obj.tagName.toUpperCase();

	     if(obj.id.toUpperCase().substring(0,7)!="DYNNODE"){
		   var v = Query.$Inner(Col.subFieldName[f],Col.subFieldFormat[f],false)+""; 
	   	   if(this.OnDrawElement!=null)
	         v = this.OnDrawElement(obj,Col.subFieldName[f],v);
		   if(objLx == "IMG")
		     obj.src = v;
		   else{
			 //alert(Col.subFieldName[f]+"="+v);  
		     if(v=="") v = " ";	 
		     //obj.innerHTML = (this.usePre)?"<pre>"+v+"</pre>":v;
		     //alert(Col.subFieldName[f]+"="+v);
			 obj.innerHTML = v;
		   }
		 }else
		   if(this.OnDrawDynElement!=null){
			 v = obj.innerHTML;  
	         var v = this.OnDrawDynElement(obj,v);
			 obj.innerHTML = v;
		   }
	   }
   
	 }else{
	   var SFieldName = (isQuery)?Col.SFieldName:Col.FieldName;
    
       var v = (SFieldName!=""&&Col.valueStyle!=qrvsHtml&&Col.valueStyle!=qrvsButton)?
	               Query.$Inner(SFieldName,Col.DataFormat,Col.b0Space):"";

	   var cell = Table.rows[r].cells[j+k-iStart];
	   
	   if(this.OnDrawCell!=null){
	     v0 = this.OnDrawCell(Col,cell,v);
		 if(typeof(v0)!="undefined")
		   v = v0;
	   }
	   
	   switch(Col.valueStyle){
		 case qrvsDefault:
      		   if(Col.allwayShowAdd||v!=""){
		         if(Col.addString!="") v = v+Col.addString;
		         if(Col.afxString!="") v = Col.afxString+v;
	           }
	           if(v=="") v = " ";
			   else{ 
			    if(Col.maxLength>0&&getLength(v)>Col.maxLength)
				  v = v.copy(0,Col.maxLength)+"...";
			    if(!Col.workBreak)
				  v = "<nobr>"+v+"</nobr>";
				if(Col.isLink){
				  lv = "";	
				  if(Col.LinkFieldName!="")
				     lv = Query.$Inner(Col.LinkFieldName,"",Col.b0Space);
				  
				  if(this.OnSetLinkHref!=null)
				     lv = this.OnSetLinkHref(Col,cell);	
				
				  target = (Col.target=="")? "":" target='"+Col.target+"'";	 	
				  style = (Col.FontStyle=="")? "":" style='"+Col.FontStyle+"'"; 
			      if(Col.styleClass != "")		 
				     v = "<a href=\""+lv+"\""+target+style+">"+v+"</a>";
				  else
				     v = "<a href=\""+lv+"\" class=\""+Col.styleClass+"\""+target+style+">"+v+"</a>";	 
				}
			   }
			   if(Col.styleClass!=""&&!Col.isLink)
			     v = "<div class=\""+Col.styleClass+"\">"+v+"</div>";
			   
			   //alert(v);
	           cell.innerHTML = (this.usePre)?"<pre>"+v+"</pre>":v;
			   break;
	     case qrvsInput:
		       var cName = "";
			   if(cell.childNodes.length==0){
 			     if(Col.styleClass!="")
			       cName = "class=\""+Col.styleClass+"\"";
		         cell.innerHTML = "<input id=\""+Col.FieldName+"\" type=\"text\" "+cName+" value=\""+v+"\">";
			     cell.childNodes[0].onchange = this.innerFieldChange;
			     cell.childNodes[0].onkeydown = this.inputKeyDown;
				 cell.childNodes[0].onclick = this.elementClick;
			   }else
			     cell.childNodes[0].value = v;
			   if(this.OnInputSetValue!=null)
			     this.OnInputSetValue(Col.FieldName,cell.childNodes[0],Query);
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
		       var imgName = (v=="")? Col.imgUrl+Col.defaultImg : Col.imgUrl+v;
			   var imgW = (Col.imgWidth==0)?"":"width="+Col.imgWidth;
			   var imgH = (Col.imgHeight==0)?"":"height="+Col.imgHeight;
		       if(cell.innerHTML==""){
		         cell.innerHTML = "<img "+imgW+" "+imgH+" id=\""+Col.FieldName+"\" src=\""+imgName+"\">";
				 cell.childNodes[0].onclick = this.elementClick;
			   }else
			     cell.childNodes[0].src = imgName;

               if(this.Columns[j].FontStyle!="")
		         cell.childNodes[0].style.cssText = this.Columns[j].FontStyle;				 
		       break;
	     case qrvsHtml:
		       if(cell.innerHTML==""){
		         cell.innerHTML = Col.FieldName; 
				 for(var i=0;i<cell.childNodes.length;i++){
				   if(typeof(cell.childNodes[i].tagName)!="undefined"){
				     cell.childNodes[i].onclick = this.elementClick; 
				   }
				 }
				 
			   }
		       break;
		 case qrvsList:
		       for(var i=0;i<Col.pickNos.length;i++)
			     if(v==Col.pickNos[i]){
					 v = Col.pickNames[i];
					 break;
				 }
 			  cell.innerHTML = (this.usePre)?"<pre>"+v+"</pre>":v; 
		      break;
	     case qrvsCheckBox:
		      var cName = "";
			  if(cell.childNodes.length==0){
			    if(Col.styleClass!="")
			      cName = "class=\""+Col.styleClass+"\"";
		        cell.innerHTML = "<input type=\"checkbox\" id=\""+Col.DataFormat+"\" "+cName+" value=\""+v+"\" disabled>";
				cell.childNodes[0].onclick = this.elementClick;
			  }else{
				cell.childNodes[0].value = v;
			  }
			  cell.childNodes[0].checked = v>"0";
		      break;
	   }
	 }
  }	
  if(iStart>0){
    var hL = this.TableL.rows[r].offsetHeight;
    var h = this.Table.rows[r].offsetHeight;
    if(h<hL) h = hL;
	
    this.Table.rows[r].style.height = h+"px";
    this.TableL.rows[r].style.height = h+"px";
  }
}

TQRGrid.prototype.drawRow = function(recNo){
  var rowIndex = recNo - 1+this.topRow;
  this.doDrawRow(rowIndex,0,this.fixedColNumber,this.TableL);
  this.doDrawRow(rowIndex,this.fixedColNumber,this.Columns.length,this.Table);
}

TQRGrid.prototype.innerDrawRow = function(recNo){
  this.drawRow(recNo);
}

TQRGrid.prototype.doPaint = function(iStart,iEnd,Table){
   var Query = this.Query;
   
   var rowCount = Table.rows.length-this.topRow;  //表格行数
   var RecordCount = Query.getRecordCount();      //数据行数

   //this.OrigRow = null;

   if(rowCount>RecordCount||this.paintReCreate){  //表格行大于数据行,删除多余的行
     var k = (this.paintReCreate)? RecordCount:rowCount-RecordCount; 
	 var i = Table.rows.length-1;
	 //alert(this.topRow);
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
		 if(this.cursor!="")
           NewRow.style.cursor = this.cursor;
         var cell = null;
		 var isSetHeight = false;
		 if(iStart==0&&this.recNoCol>0){
         //序号列		 			 
		   cell = NewRow.insertCell(-1);
		   if(this.rowHeight>0) cell.height = this.rowHeight;
		   cell.align = "center";
		   cell.width = this.inpWidth;
           isSetHeight = true;
		   if(this.fixedClass!="")
		     cell.className = this.fixedClass;	 	
		   	   
		   if(this.topRow==0&&i==0) cell.width = this.inpWidth;
		   if(this.fixedColStyle != "")
		     cell.style.cssText = this.fixedColStyle;
		 }

         if(iStart==0&&this.useSelected){
		   cell = NewRow.insertCell(-1);
		   cell.align = "center";
		   if(!isSetHeight){
		     if(this.rowHeight>0) cell.height = this.rowHeight;
			 isSetHeight = true;
		   }
		   if(this.rowHeight>0)
		     cell.innerHTML = "<input name=\""+this.name+"CheckBox\" type=\"checkbox\" class=\"qrbox\">";
		   else
		     cell.innerHTML = "<input name=\""+this.name+"CheckBox\" type=\"checkbox\">";
		   cell.childNodes[0].onclick = this.CheckBoxClick;
		 }
		 
		 var ht = false;
		 var enw = false;
		 
         for(var j=iStart;j<iEnd;j++){
		   var col = this.Columns[j];	 
		   cell = NewRow.insertCell(-1)
		   
		   col.cellIndex = cell.cellIndex;
		   cell.align = col.AlignMent;
		   
		   if(this.cellClass!="")
		     cell.className = this.cellClass;	 
			 
		   if(this.Columns[j].FontStyle!="")
		     cell.style.cssText = this.Columns[j].FontStyle;
		   //cell.style.whiteSpace = "pre-wrap";
		   
		   if(!isSetHeight&&this.rowHeight>0){
		     cell.height = this.rowHeight;
			 isSetHeight = true;
		   }
			 
		   cell.width = col.Width;
		   
		   if(col.isCombCol){  //复合列
		     var sHtml = col.combColHtml;
			 if(this.OnGetColumnHtml!=null)
			   sHtml = this.OnGetColumnHtml(col);
		     cell.innerHTML = sHtml;
			 
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
         
   //alert(this.rowStart+","+	Query.getRecordCount());	 
   for(var i = this.rowStart;i <= Query.getRecordCount(); i++){
	  Query.InnerMoveRecord(i);
	  var r = i-1;//this.topRow+i-1;

      this.doDrawRow(r,iStart,iEnd,Table);
	  
	  if(iStart==0&&this.recNoCol>0){
		var sRecNo = (this.srollRead)? i:i+Query.pageSize*(Query.pageNumber-1);
		var bLevel = false;
	    if(this.inpSetting){
		  var v = Query.$Inner(this.inpFieldName,"",false);
		  if(v!=""&&!eval(v+this.inpFormula)){
			bLevel = true;
		    sRecNo += this.inpStr;
		  }
		}
		v = sRecNo;
		if(this.OnDrawCell!=null){
	     v0 = this.OnDrawCell(null,Table.rows[r].cells[0],v);
		 if(typeof(v0)!="undefined")
		   v = v0;
	    }
	    Table.rows[r].cells[0].innerHTML = v;       //i+Query.pageSize*(Query.pageNumber-1);
		
		if(this.useSelected){
		  if(bLevel)
		    Table.rows[r].cells[1].childNodes[0].style.visibility = "hidden";
		  else
		    Table.rows[r].cells[1].childNodes[0].style.visibility = "";
		}
	  }
	}
	
	
   if(!Query.isEmpty){
	 Query.moveRecord(this.rowStart);  
     this.ChangeOrigRowByRecNo(this.rowStart);	
   }
}

TQRGrid.prototype.paint = function(){
  	
  this.doPaint(0,this.fixedColNumber,this.TableL);
  this.doPaint(this.fixedColNumber,this.Columns.length,this.Table);
}

TQRGrid.prototype.doDataChange = function(rowStart){
  this.rowStart = (typeof(rowStart)=="undefined")? 1:rowStart;	
  this.paint();	
}

//创建表格
TQRGrid.prototype.CreateGrid = function(gridLine){

  this.gridLine = gridLine;
  var lineWidth = (typeof(gridLine)=="undefined"||gridLine)?1:0;
  var tableBg = " ";
  if(this.tableBgColor!="")
    tableBg = " bgcolor=\""+this.tableBgColor+"\"";
  var wm = (this.widthMatchParent)? " width=\"100%\" ":"";
  
  var tableclass = (this.tableClass!="")? "class=\""+this.tableClass+"\" ":"";

  this.drawTitle = function(isFixed,nameSuffix){
	if(this.topRow>=0){
      document.write("<table id=\""+this.name+nameSuffix+"\" "+tableclass+tableBg+wm+">");
	  var hStyle = (this.titleHeight==0)? this.heightStyle:"height=\""+this.titleHeight+"\"";
	  var hClass = (this.titleClass!="")? " class='"+this.titleClass+"'":"";
      document.write("<thead>");
      document.write("<tr id='"+this.name+nameSuffix+"row'>");  
	  if(this.recNoCol>0&&(isFixed||this.fixedColNumber==0)){
        document.write("<td align=\"center\" width=\""+this.inpWidth+"\" "+hStyle+hClass+">"+this.fixedCaption+"</td>");
	    hStyle = "";
	  }
  	  var qrbox = "class=\"qrgridtitlebox\"";
      if(isFixed&&this.useSelected)
        document.write("<td width=\"32\" align=\"center\"><input type=\"checkbox\" id=\""+this.btAllBoxName+"\" value=\"√\" "+qrbox+"></td>");

      var enw = false;  //表示已经有某列不设置宽度了
      var istart = (isFixed)?0:this.fixedColNumber;
	  var iend = (isFixed)?this.fixedColNumber:this.Columns.length;
      for(var i=istart;i<iend;i++){
	    var col = this.Columns[i];  
	    var w = (col.Width==0)?"":"width=\""+col.Width+"\"";
	    enw = enw||w=="";  
	    if(!enw&&w!=""&&i==this.Columns.length-1&&this.widthMatchParent)
	      w = "";
	    var align = (col.titleAlignMent != "")? col.titleAlignMent:col.AlignMent;
	  
	    var vCaption = col.Caption;
		if(col.showMark>0){
		  vCaption += "<span style='color:#aaa'>"+((col.showMark==1)? "▲":"●")+"</span>"; 
		}
        document.write("<td "+w+" align=\""+align+"\" "+hStyle+hClass+" id='"+i+"'>"+vCaption+"</td>");
	    hStyle = "";
      }
      document.write("</tr>");
      document.write("</thead>");  
	  document.write("</table>");
	  
	  document.getElementById(this.name+nameSuffix+"row").addEventListener("click",this.TitleRowClick);
    }
  }
  
  document.write('<div class="mytable_fixed" style="width:100%;height:100%;'+this.border+'">');
  
  document.write(' <div class="mytable_header" style="width:100%;height:32px;" id="'+this.name+'_header">');
  
  document.write('  <div class="mytable_fixedHeaderColumn" style="width:120px;height:100%;background-color: #eeeeee;border-right:solid 1px #ccc" id="'+this.name+'_fixedAreaTitle">');
  this.drawTitle(true,"fixedTitlerow");
  document.write('  </div>');
  
  document.write('  <div class="mytable_header_left" style="flex:1;height:100%;background-color: #eeeeee;" id="'+this.name+'table_header">');
  this.drawTitle(false,"titleRow");
  document.write('  </div>');
  
  document.write(' </div>');
  
  document.write(' <div class="mytable_container" style="width:100%;">');
  document.write('  <div class="mytable_fixedColumn" style="overflow:hidden;width:120px;height:100%;border-right:solid 1px #ccc" id="'+this.name+'_fixedArea">');
  document.write("<table id=\""+this.name+"fixedCol\" "+tableclass+tableBg+wm+">");            
  document.write("</table>");            
  document.write('  </div>');  
  
  document.write('  <div class="mytable_conentent" style="flex:1;height:100%" id="'+this.name+'_conentent">');
  document.write("<table id=\""+this.name+"col\" "+tableclass+tableBg+wm+">");            
  document.write("</table>");            
  document.write('  </div>');  
  document.write(' </div>');
  document.write('</div>');

  if(this.hideTitle){
	document.getElementById(this.name+"_header").style.display = "none";  
  }
  if(this.fixedColNumber==0){
	document.getElementById(this.name+"_fixedAreaTitle").style.display = "none";  
	document.getElementById(this.name+"_fixedArea").style.display = "none";    
  }
  this.TabletTL = document.getElementById(this.name+"fixedTitlerow");
  this.TabletTL.owner = this;
  this.TableT = document.getElementById(this.name+"titleRow");
  this.TableT.owner = this;
  
  this.TableL = document.getElementById(this.name+"fixedCol");
  this.TableL.owner = this;
  this.Table = document.getElementById(this.name+"col");
  this.Table.owner = this;
  
  if(this.backGround != ""){
    this.TabletTL.style.background = this.backGround;
    this.TableT.style.background = this.backGround;
	this.TableL.style.background = this.backGround;
	this.Table.style.background = this.backGround;
  }
  if(this.useSelected){
	obj = document.getElementById(this.btAllBoxName);  
    obj.onclick = this.ButtonBoxClick;
//	cell.childNodes[1].onclick = this.ButtonBoxClick;
  }
  
  for(var i=0;i<this.Columns.length;i++){  
    this.Columns[i].isCombCol = this.Columns[i].combColHtml!="";
	if(this.Columns[i].styleClass == "")
	  this.Columns[i].styleClass = this.styleClass;
  }
  
  var mytable_conentent_Dom = document.getElementById(this.name+"_conentent");
  var mytable_fixedHeaderColumn_Dom = document.getElementById(this.name+"_fixedAreaTitle");
  var mytable_fixedColumn_Dom = document.getElementById(this.name+"_fixedArea");
  var mytable_header_left_Dom = document.getElementById(this.name+"table_header");
  
  mytable_conentent_Dom.owner = this;
  mytable_fixedColumn_Dom.owner = this;
  mytable_conentent_Dom.addEventListener("scroll",function(event){
    var target = event.target;
    mytable_fixedColumn_Dom.scrollTop = target.scrollTop;
    mytable_header_left_Dom.scrollLeft = target.scrollLeft;
  },false);
  
  mytable_fixedColumn_Dom.addEventListener("scroll",function(event){
    var target = event.target;
    mytable_conentent_Dom.scrollTop = target.scrollTop;
  },false);
  
  var table_header = document.getElementById(this.name+"_header");

  table_header.style.height = this.TableT.offsetHeight+"px";

  //alert(this.TabletTL.offsetWidth);
  mytable_fixedHeaderColumn_Dom.style.width = this.TabletTL.offsetWidth+"px";
  mytable_fixedColumn_Dom.style.width = mytable_fixedHeaderColumn_Dom.style.width;
  
  mytable_conentent_Dom.addEventListener("touchend", function(event) {
	var obj = this.owner;
    var iscroll = obj.Table;
	//alert(this.scrollTop+","+this.offsetHeight+","+(iscroll.offsetHeight-20));
	if(this.scrollTop+this.offsetHeight>=iscroll.offsetHeight-25&&this.owner.srollRead){
	  obj.Query.getNextPage(true);
	}
   }, false);
   
  mytable_fixedColumn_Dom.addEventListener("touchend", function(event) {
	var obj = this.owner;
    var iscroll = obj.TableL;
	//alert(this.scrollTop+","+this.offsetHeight+","+(iscroll.offsetHeight-20));
	if(this.scrollTop+this.offsetHeight>=iscroll.offsetHeight-25&&this.owner.srollRead){
      obj.Query.getNextPage(true);	
	}
   }, false);
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

TQRGrid.prototype.doPageChange = function(){
}

