/*表格定义*/
TITBGrid.prototype.name = "ITBGrid1";
TITBGrid.prototype.tableBgColor = "";
TITBGrid.prototype.columnCount = 10;

TITBGrid.prototype.cellClass = "";
TITBGrid.prototype.statusCellClasss = null;

TITBGrid.prototype.cellStyle = "";
TITBGrid.prototype.cellWidth = 90;
TITBGrid.prototype.cellHeight = 90; 

TITBGrid.prototype.OnCellClick = null;

TITBGrid.prototype.gridLine = true;
TITBGrid.prototype.paintReCreate = false;  //true时,刷新数据时，先全部删除表格行
TITBGrid.prototype.FieldName = "";         //内容字段
TITBGrid.prototype.opFieldName = "";       //条件字段

TITBGrid.prototype.fontColor = "#000000";  //默认字体颜色
TITBGrid.prototype.fontColored = "#ffffff";//选中字体颜色
TITBGrid.prototype.fontSize = "14px";      //字号

function $TDParentTable(obj){
  while(obj.parentNode!=null&&
	    obj.parentNode.tagName.toUpperCase()!="TABLE"){
	 obj = obj.parentNode; 
  }
  return obj.parentNode;
}

function TITBGrid(props){
  this.setPropertys(props);
  this.Query = null;
  __VCL.add(this);
}

TITBGrid.prototype.free = function(){
  this.Query.QRGrid = null;
}

TITBGrid.prototype.setPropertys=function(props){
  for(var i in props)
    this[i] = props[i];
}

TITBGrid.prototype.boundQuery = function(Query,bAutoLines){
  this.Query = Query;
  Query.QRGrid = this;
  
  if(Query.className!="TQuery")
	this.doDataChange();        //刷新表格显示
}


TITBGrid.prototype.ChangeOrigCell = function(NewCell,obj){
  if(NewCell!=null&&this.OnCellClick!=null&&obj!=null)
    this.OnCellClick(NewCell,obj.tagName,obj.id);
}


//this = TableCell对象
TITBGrid.prototype.CellClick = function(){
  var obj = this;
  var cell = obj;
  var Grid = $TDParentTable(cell).owner;
  Grid.ChangeOrigCell(cell,this);
}


TITBGrid.prototype.paint = function(){
   
   var Table = this.Table;
   var Query = this.Query;
    
   var rowCount = Table.rows.length;  //表格行数
   
   if(this.columnCount==0){  //自动尺寸
     this.columnCount = Math.floor(Table.parentNode.clientWidth/this.cellWidth);     
   }
   
   var rCount = Query.getRecordCount();      //记录数
   var RecordCount = Math.ceil(1.0*rCount/this.columnCount);   
   
   if(rowCount>RecordCount||this.paintReCreate){  //表格行大于数据行,删除多余的行
     var k = (this.paintReCreate)? rowCount:rowCount-RecordCount; 
	 var i = Table.rows.length-1;
     while(k>0){
	   Table.deleteRow(i); 
	   i--;
	   k--;
	 }
	 
	 if(this.paintReCreate) rowCount = 0;
   }
   
   var r = 1; 
      
   if(rowCount<RecordCount){
	 for(var i=0;i<RecordCount-rowCount;i++){	 
	   var NewRow = Table.insertRow(Table.rows.length);
	   //NewRow.height = this.cellHeight;
	   var cell = null;
		 
       for(var j=0;j<this.columnCount;j++){
  	     cell = NewRow.insertCell(-1)
		 cell.align = "center";
		 cell.width = this.cellWidth;  
		 if(this.cellHeight>0)
		   cell.height = this.cellHeight;

		 if(this.cellClass!="")
		   cell.className = this.cellClass;	 
		   
		 if(this.cellStyle!="")
		   cell.style = this.cellStyle;
	   }
	 }
   }
   
   r = 1;      
   for(var i=0;i<RecordCount;i++){
	 for(var j=0;j<this.columnCount;j++){
	   var cell = Table.rows[i].cells[j];

	   if(r<=rCount){
	     Query.InnerMoveRecord(r);
		 r++;

	     var v = Query.$(this.FieldName);
	     cell.innerText =  v;
		 
		 if(this.statusCellClasss!=null){
		   var n = Query.$(this.opFieldName); 
		   cell.className = this.statusCellClasss[n];
		 }
	   }
	 }
   }
}

TITBGrid.prototype.doMoveRecord = function(){
	
}

TITBGrid.prototype.setSFieldByFields = function(){
	
}

TITBGrid.prototype.innerDrawRow = function(){
}

TITBGrid.prototype.doPageChange = function(){
}

TITBGrid.prototype.doDataChange = function(){
  this.paint();	
}

//创建表格
TITBGrid.prototype.CreateGrid = function(gridLine){

  this.gridLine = gridLine;
  var lineWidth = (typeof(gridLine)=="undefined"||gridLine)?1:0;
  var tableBg = " ";
  if(this.tableBgColor!="")
    tableBg = " bgcolor=\""+this.tableBgColor+"\"";
	
  document.write("<table border=\"0\" id=\""+this.name+"\" style=\"border-collapse:separate;\" "+tableBg+">");
  document.write("<tbody id=\""+this.name+"_body\">");
  document.write("</tbody>");
  document.write("</table>");

  this.Table = document.getElementById(this.name);

  this.Table.owner = this;
  if(this.backGround!="")
    this.Table.style.background = this.backGround;
}

