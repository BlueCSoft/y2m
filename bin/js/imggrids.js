/*表格定义*/
TIMGGrid.prototype.name = "IMGGrid1";
TIMGGrid.prototype.tableBgColor = "";
TIMGGrid.prototype.backGround = "";
TIMGGrid.prototype.columnCount = 10;
TIMGGrid.prototype.oBackGround = "";
TIMGGrid.prototype.oFontColor = "";
TIMGGrid.prototype.nBackGround = "#000000";
TIMGGrid.prototype.nFontColor = "#000000";
TIMGGrid.prototype.cellBackGround = "#eeeeee";

TIMGGrid.prototype.cellClass = "";
TIMGGrid.prototype.cellClassed = "";

TIMGGrid.prototype.picPath = "";
TIMGGrid.prototype.defaultPic = "";

TIMGGrid.prototype.cellStyle = "";
TIMGGrid.prototype.cellWidth = 90;
TIMGGrid.prototype.cellHeight = 90; 
TIMGGrid.prototype.imgWidth = 80;
TIMGGrid.prototype.imgHeight = 80; 
TIMGGrid.prototype.imgClass = "";     // 图形类
TIMGGrid.prototype.imgClassed = "";   // 当前图形类 	
TIMGGrid.prototype.imgStyle = "";     // 图形样式
TIMGGrid.prototype.imgStyleed = "";   // 当前图形样式  

TIMGGrid.prototype.OnCellClick = null;
TIMGGrid.prototype.OnSetValue = null;
TIMGGrid.prototype.OnSelected = null;

TIMGGrid.prototype.gridLine = true;
TIMGGrid.prototype.paintReCreate = false;  //true时,刷新数据时，先全部删除表格行
TIMGGrid.prototype.FieldName = "";         //图片字段

TIMGGrid.prototype.fontColor = "#000000";  //默认字体颜色
TIMGGrid.prototype.fontColored = "#ffffff";//选中字体颜色
TIMGGrid.prototype.fontSize = "14px";      //字号
TIMGGrid.prototype.opHtml = "";            //操作串

TIMGGrid.prototype.SelectedField = "";     //选择保存的字段
TIMGGrid.prototype.multiSelect = false;    //是否允许多选
TIMGGrid.prototype.FieldNameTitle = "";    //图片名字字段
TIMGGrid.prototype.SelectedImg = "";       //被选中图片的指示图片

TIMGGrid.prototype.SelectedKey = [];         

function $ImgParentTable(obj){
  while(obj.parentNode!=null&&
	    obj.parentNode.tagName.toUpperCase()!="TABLE"){
	 obj = obj.parentNode; 
  }
  return obj.parentNode;
}

function $ImgParentTd(obj){
  if(obj.tagName.toUpperCase()=="TD")
     return obj; 
  else{
    while(obj.parentNode!=null&&
	      obj.parentNode.tagName.toUpperCase()!="TD"){
	  obj = obj.parentNode; 
    }
    return obj.parentNode;
  }
}

function TIMGGrid(props){
/*
  this.columnCount = columnCount;
  this.cellWidth = cellWidth;
  this.cellHeight = cellHeight;
  this.imgWidth = imgWidth;
  this.imgHeight = imgHeight;
*/
  this.setPropertys(props);
 
  this.nameFieldIndex = 0;  //标题字段节点索引
  this.opAreaIndex = 2;     //操作区域节点索引
  
  this.canMultiSelect = false;
  
  this.Query = null;
  this.OrigCell = null;
  __VCL.add(this);
}

TIMGGrid.prototype.free = function(){
  this.SelectedKey = null;
  this.Table.owner = null;
  this.Query.QRGrid = null;
}

TIMGGrid.prototype.setPropertys=function(props){
  for(var i in props)
    this[i] = props[i];
}

TIMGGrid.prototype.boundQuery = function(Query,bAutoLines){
  this.Query = Query;
  Query.QRGrid = this;
  
  if(Query.className!="TQuery")
	this.doDataChange();        //刷新表格显示
}


TIMGGrid.prototype.ChangeOrigCell = function(NewCell,obj){

  var OrigCell = this.OrigCell;  //原选择的行
  if(NewCell!=OrigCell){

    if(OrigCell != null && !this.canMultiSelect){
      OrigCell.style.color = this.oFontColor;
      OrigCell.style.background = this.oBackGround;
	  OrigCell.className = this.cellClass;
      if(OrigCell.childNodes[0].childNodes.length>1){
        var hcell = OrigCell.childNodes[0].childNodes[1];	 
        for(var x=0;x<hcell.childNodes.length;x++){
	      var ccell = hcell.childNodes[x];
	      if(ccell.tagName=="SPAN"){ 
	        ccell.style.color = this.fontColor;
	      }
	    } 
      }
	  if(OrigCell.childNodes.length>1)
	    OrigCell.removeChild(OrigCell.childNodes[1]);
    }

    if(NewCell==null) return;
  
    if(!this.canMultiSelect){
      this.oBackGround = NewCell.style.background;
      this.oFontColor = NewCell.style.color;
	
      NewCell.style.background = this.nBackGround;
      NewCell.style.color = this.nFontColor;
      NewCell.className = this.cellClassed;
	  
      if(NewCell.childNodes[0].childNodes.length>1){
        var hcell = NewCell.childNodes[0].childNodes[1];	 
        for(var x=0;x<hcell.childNodes.length;x++){
      	  var ccell = hcell.childNodes[x];
	      if(ccell.tagName=="SPAN"){ 
	        ccell.style.color = this.fontColored;
	      }
	    }
      }
	 
	  if(this.SelectedImg!=""){
	    var inpDiv = document.createElement("div");
		inpDiv.innerHTML = "<img src='"+this.SelectedImg+"'>";
		var offTop = NewCell.childNodes[0].offsetHeight - NewCell.childNodes[0].childNodes[0].offsetHeight/2 - 
		             -inpDiv.childNodes[0].height/2; 
		$(inpDiv).css({"position":"relative","top":-offTop,"width":this.imgWidth,"height":0});
		$(NewCell).append(inpDiv);
	  }
	}
    
	this.OrigCell = NewCell;
    var recno = NewCell.parentNode.rowIndex*this.columnCount + NewCell.cellIndex + 1;
    this.Query.moveRecord(recno);
	if(this.OnSelected!=null&&obj!=null)
	  this.OnSelected(NewCell,recno);
  }
  
  if(NewCell!=null&&this.OnCellClick!=null&&obj!=null)
    this.OnCellClick(NewCell,obj.tagName,obj.id);
}

/*检查某个值是否已被选中,返回在数组中的序号*/
TIMGGrid.prototype.IsSaved = function(KeyValue){
  for(var i=0;i<this.SelectedKey.length;i++)
    if(KeyValue==this.SelectedKey[i])
	  return i;
  return -1;	  
}

//this = TableCell对象
TIMGGrid.prototype.CellClick = function(){
  var obj = this;
  var cell = $ImgParentTd(this);
 
  var Grid = $ImgParentTable(cell).owner;
	
  Grid.ChangeOrigCell(cell,this);
  
  //多选处理
  if(Grid.canMultiSelect&&_$ObjType(obj)=="CHECKBOX"){
	var v1 = Grid.Query.$(Grid.SelectedField);
	if(v1!=""){
	  var x = Grid.IsSaved(v1);
	  var isSelect = false;
	  if(obj.checked&&x==-1){
	    Grid.SelectedKey.push(v1);
		isSelect = true;
	  }
	  else
	  if(!obj.checked&&x>-1){
		Grid.SelectedKey.splice(x,1);
		isSelect = false;
	  }
	  
	  cell.className = (isSelect)? Grid.cellClassed:Grid.cellClass;	 
      cell.style.background = (isSelect)? Grid.nBackGround:Grid.cellBackGround; 

  	  if(cell.childNodes.length>1){
        var hcell = cell.childNodes[0].childNodes[1];	 
        for(var x=0;x<hcell.childNodes.length;x++){
	      var ccell = hcell.childNodes[x];
	      if(ccell.tagName=="SPAN"){ 
	        ccell.style.color = (isSelect)? Grid.fontColored:Grid.fontColor;
	      }
	    } 
      }	 
    }
  }
}


TIMGGrid.prototype.elementClick = function(){
}

TIMGGrid.prototype.setCellSelected = function(recNo){
  recNo = recNo - 1;
  var rowIndex =  Math.floor(recNo / this.columnCount);
  var cellIndex = recNo % this.columnCount;
  if(rowIndex>=0){
    var cell = this.Table.rows[rowIndex].cells[cellIndex];
    this.ChangeOrigCell(cell,null);
  }
}

TIMGGrid.prototype.paint = function(){
   
   var Table = this.Table;
   var Query = this.Query;
    
   var rowCount = Table.rows.length;  //表格行数
   
   if(this.columnCount==0){  //自动尺寸
     this.columnCount = Math.floor(Table.parentNode.clientWidth/this.cellWidth);     
   }
   
   var rCount = Query.getRecordCount();      //记录数
   var RecordCount = Math.ceil(1.0*rCount/this.columnCount);   
   
   //this.OrigRow = null;
   if(this.OrigCell != null&& !this.canMultiSelect){
     this.ChangeOrigCell(null,null);
   }

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
   
   var bshowname = this.FieldNameTitle != "";
   var bshowop = this.opHtml != "";

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
			
		 //cell.onclick = this.CellClick;
		 //cell.ondblclick = this.CellDblClick;
		 var imgClass = (this.imgClass!="")? " class='"+this.imgClass+"' ":"";
		 var imgStyle = (this.imgStyle!="")? " style='"+this.imgStyle+"' ":"";
		 
		 var shtml = "<div><img src='"+this.defaultPic+"' width='"+this.imgWidth+"' height='"+this.imgHeight+"' "+imgClass+imgStyle+">";
		 
		 if(bshowname||bshowop||this.canMultiSelect){
		   shtml += "<span>";
		   
		   if(bshowname||this.canMultiSelect){
			 var imgw = 10;
			 var sblank = "";
			 shtml += "<br>";
			 if(this.canMultiSelect){
			   sblank = "&nbsp;";
			   shtml += "<input type='checkbox'>"+sblank;
			   imgw += 8;
			 }
			 if(bshowname)  
		     shtml += "<span id='objnote' style='text-overflow:ellipsis; white-space: nowrap; overflow: hidden; width:"+(this.imgWidth-imgw)+"px'></span>";
		   }
		   
		   if(bshowop)
		     shtml += "<br>"+this.opHtml;	 	 
		   shtml += "</span></div>"; 
		 }
		 //alert(shtml);
		 cell.innerHTML = shtml;
		 
		 if(bshowname||bshowop)
		   for(var x=0;x<cell.childNodes[0].childNodes[1].childNodes.length;x++){
		     var ccell = cell.childNodes[0].childNodes[1].childNodes[x];
		     if(ccell.tagName=="SPAN"){
		       ccell.style.color = this.fontColor;
		  	   ccell.style.cursor = "pointer";
		     }
		   }
	   }
	 }
   }
   
   r = 1;      
   for(var i=0;i<RecordCount;i++){
	 for(var j=0;j<this.columnCount;j++){
	   var cell = Table.rows[i].cells[j];
	   var imgobj = cell.childNodes[0].childNodes[0];

	   if(r<=rCount){
	     Query.InnerMoveRecord(r);
		 r++;
		 imgobj.src = this.picPath+Query.$(this.FieldName);
		 imgobj.onclick = this.CellClick;
		 $(imgobj).css("visibility","");
		 
		 var isSelect = false;
		 if(this.canMultiSelect){
		   var v1 = Query.$(this.SelectedField);
		   isSelect = this.IsSaved(v1)>-1;
		   cell.childNodes[0].childNodes[1].childNodes[1].checked = isSelect;
		 }

 	     cell.className = (isSelect)? this.cellClassed:this.cellClass;	 
    	 var background = (isSelect)? this.nBackGround:this.cellBackGround; 
		 
         $(cell).css("background",background);
		 
  	     if(cell.childNodes[0].childNodes.length>1){
           var hcell = cell.childNodes[0].childNodes[1];	 
           for(var x=0;x<hcell.childNodes[0].childNodes.length;x++){
	         var ccell = hcell.childNodes[0].childNodes[x];
	         if(ccell.tagName=="SPAN"){ 
	           ccell.style.color = (isSelect)? this.fontColored:this.fontColor;
	         }
	       } 
         }	 
		 
		 if(bshowname){
		   var v = Query.$(this.FieldNameTitle);
		   if(this.OnSetValue!=null)
		     v = this.OnSetValue(v);
		   cell.childNodes[0].childNodes[1].childNodes[this.nameFieldIndex].innerHTML = v;
		 }
		 
         if(bshowname||bshowop||this.multiSelect){
		   for(var x=0;x<cell.childNodes[0].childNodes[1].childNodes.length;x++){
		     var ccell = cell.childNodes[0].childNodes[1].childNodes[x];
			 var objtype = _$ObjType(ccell);
		     if(objtype=="SPAN"||objtype=="CHECKBOX"){
		       ccell.onclick = this.CellClick;
		     }
		   }
		   cell.childNodes[0].childNodes[1].style.visibility = ""; 
		 }
		 
		 cell.onclick = this.CellClick;
	   }else{
	     imgobj.src = this.defaultPic;
		 imgobj.onclick = null;
		 $(imgobj).css("visibility","hidden");
		 
		 if(this.canMultiSelect)
		   cell.childNodes[0].childNodes[1].childNodes[1].checked = false;
		 if(bshowname)
		   cell.childNodes[0].childNodes[1].childNodes[this.nameFieldIndex].innerHTML = "";
		 cell.className = "";
		 $(cell).css("background","");
		 
		 cell.onclick = null;
		 if(bshowname||bshowop)
		   cell.childNodes[0].childNodes[1].style.visibility = "hidden";
	   }
	 }
   }
}

TIMGGrid.prototype.doMoveRecord = function(){
	
}

TIMGGrid.prototype.setSFieldByFields = function(){
	
}

TIMGGrid.prototype.innerDrawRow = function(){
}

TIMGGrid.prototype.doPageChange = function(){
  this.SelectedKey = null;
  this.SelectedKey = [];
}

TIMGGrid.prototype.doDataChange = function(){
  this.paint();	
}

//创建表格
TIMGGrid.prototype.CreateGrid = function(gridLine){

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
	
  this.nameFieldIndex = (this.multiSelect)? 3:1;  
  this.opAreaIndex = this.nameFieldIndex+2;    
  this.canMultiSelect = this.multiSelect&&this.SelectedField!="";  //允许多选的条件
}

TIMGGrid.prototype.hasSelected = function(){
  return (this.canMultiSelect)?  this.SelectedKey.length>0 : this.OrigCell!=null;	
}

TIMGGrid.prototype.getImgSrc = function(){
  return this.OrigCell.childNodes[0].src;	
}

TIMGGrid.prototype.$ = function(FieldName){
  return (this.OrigCell!=null)? this.Query.$(FieldName):"";	
}

TIMGGrid.prototype.$select = function(){
  return this.SelectedKey.join(",");
}