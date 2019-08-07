//<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
//定义对齐枚举

 taDefault = "";
 taLeft = "left";
 taCenter = "center";
 taRight = "right";

 taTop = "top";
 taMiddle = "middle";  
 taBottom = "bottom";
//定义按钮类型
 cbsAuto = 0; 
 cbsOpen  = 1;
 cbsEllipsis  = 1;     
 cbsSelect = 2;
 cbsPassWord = 4;
 cbsNone = 5;
//颜色定义
 clBlack = "#000000";
 clBtnFace = "#dddddd";
 clWhite = "#ffffff";
//绘图方式
 dpmFieldPicture = 0;
 dpmPicture1 = 1;
 dpmPicture2 = 2;
 dpmPicture3 = 3;

 dpsNormal = 0;
 dpsPicture = 1;
 
 crContinue = 1;
 crVChanged = 2;
 crAbort = 3;
 
 __gridLineColor = "#ffffff";
 __crossColor = "#eeeeee";
 
 imageByConst = 0;
 imageByField = 1;
 imageByImages = 2;


/*全局对象*/
 globalCaptureObject = null;
 globalCaptureGrid = null;
/*使用二分法查找数组元素*/
 function findElement(value,aValueNo,aValueName){
  var r=-1;
  for(var i=0;i<aValueNo.length;i++)
   if(value==aValueNo[i]){
	r = i;   
	break;
   }
  if(r==-1) return "";
  else return aValueName[r];
 }

/*定义字体对象*/
 function TFont(){
  this.charset = "GB2312_CHARSET";
  this.color = _dbgrid_defFontColor;
  this.name =  _dbgrid_defFontName;
  this.size =  _dbgrid_defFontSize;
  this.fontStyle = "";
  this.fontWeight = "";
  this.textDecoration = "";
  //复制对象属性
  this.assign = function(src){
   this.charset = src.charset;
   this.color = src.color;
   this.name = src.name;
   this.size = src.size;
   this.fontStyle = src.fontStyle;
   this.fontWeight = src.fontWeight;
   this.textDecoration = src.textDecoration;
  }
  //批量设置属性
  this.setProperty = function(props){
   for(var i in props)
	this[i] = props[i];
   props = null;	
  }
  
 }
/**表格数据编辑框*/
 TInplaceEdit.prototype.parent = null;
 TInplaceEdit.prototype.biLexIcon = null;
 TInplaceEdit.prototype.lexiconID = null;
 TInplaceEdit.prototype.hasButton = cbsAuto;
 TInplaceEdit.prototype.element = null;
 TInplaceEdit.prototype.button = null;
 TInplaceEdit.prototype.Select = null;
 TInplaceEdit.prototype.grid = null;
 TInplaceEdit.prototype.changing = false;  //值被用户改变了
 TInplaceEdit.prototype.isMouseDown = false;
 TInplaceEdit.prototype.spChar = _date_defspChar;
 
 /*构造函数*/
 
 function TInplaceEdit(input,pwedit,Select){

  this.input = input;
  this.input.owner = this;
  this.owner = input.parentNode;
  this.owner.inpEdit = this;
  
  this.pwedit = pwedit;
  this.pwedit.owner = this;
  
  this.xCol = 0;
  this.yRow = 0;

  this.oxCol = 0;
  this.oyRow = 0;

  this.focusIndex = -1;
  this.visible = false;

  this.parent = input.parentNode;
  this.parent.style.visibility = "hidden";
  this.grid = this.parent.grid;
  this.button = this.input.nextSibling;
  this.Select = this.button.nextSibling;

  this.input.onkeyup = this.doKeyUp;
  this.input.onkeydown = this.doKeyDown;
  this.input.onblur = this.doBlur;
  this.input.onfocus = this.doFocus;
  this.input.onchange = this.doChange;
  
  this.pwedit.onkeyup = this.doKeyUp;
  this.pwedit.onkeydown = this.doKeyDown;
  this.pwedit.onblur = this.doBlur;
  this.pwedit.onfocus = this.doFocus;
  this.pwedit.onchange = this.doChange;

  this.element = input;
  this.owner.onmousedown = this.doMouseDown;
  this.owner.onmouseup = this.doMouseUp;  
  
  this.button.onclick = this.buttonClick;
  this.button.owner = this;
  
  this.Select.owner = this;
  this.Select.onchange = this.doSelectChange;
  this.Select.onblur = this.doBlur;
  this.Select.onfocus = this.doFocus;
  this.Select.onkeydown = this.doSelectKeyDown;
  
  this.isCrEvent = false;
 }

 TInplaceEdit.prototype.free = function(){
  this.parent = null;
  this.grid = null;
  
  this.button.owner = null;
  this.button.onclick = null;  
  this.button = null;

  this.Select.onblur = null;
  this.Select.onfocus = null;

  this.Select.onchange = null;  
  this.Select.onkeydown = null;
  this.Select.owner = null;
  this.Select = null;

  this.input.owner = null;
  this.input.onkeyup = null;
  this.input.onkeydown = null;
  this.input.onblur = null;
  this.input.onfocus = null;
  this.input.onchange = null;
  
  this.pwedit.owner = null;
  this.pwedit.onkeyup = null;
  this.pwedit.onkeydown = null;
  this.pwedit.onblur = null;
  this.pwedit.onfocus = null;
  this.pwedit.onchange = null;

  this.element = null;
  this.owner.onmousedown = null;
  this.owner.onmouseup = null;
  this.owner.inpEdit = null;
  this.owner = null;
 }
 /*Select处理键盘事件*/
 TInplaceEdit.prototype.doSelectKeyDown=function(e){
   var keyCode = window.event.keyCode;
   var grid=this.parentNode.grid;
   if(keyCode>=37&&keyCode<=40)
    window.event.cancelBubble = true; 
 }
 /*Input处理键盘事件*/
 TInplaceEdit.prototype.doKeyDown=function(e){
  var keyCode = window.event.keyCode;
  var grid = this.parentNode.grid;
 
  var field = null;
  switch(keyCode){
	case  9: window.event.keyCode = 13; 
	case 13: if(grid.canFirstInsert()){
               var nr = crContinue; 
	           window.event.cancelBubble = true;

	           nr = grid.doInputCRKeyDown(grid.columns[this.owner.xCol],this.value,this.parentNode,false);
			   
			   switch(nr){ 
 		        case crAbort:  //终止
                     return;
			    case crContinue://继续
				       this.isCrEvent = true;
			           if(!grid.updateData(grid,this.value,this.owner.xCol,this.owner.yRow)){
                       return;
					  }
			   }
	         }else{
			  window.event.cancelBubble = true;  
			  return false;
			 }
	case 38:
	case 40:grid.keyDown(window.event,this.value);
	case 37:
	case 39:window.event.cancelBubble = true; 
	         break;
	default:return grid.canFirstInsert();		 
  }
 }

 /*处理键盘事件*/
 TInplaceEdit.prototype.doKeyUp=function(e){
 }
 
 /*变化事件*/
 TInplaceEdit.prototype.doChange=function(e){
  var grid=this.parentNode.grid;
  if(!grid.isCrEvent)
   grid.updateData(grid,this.value,this.owner.xCol,this.owner.yRow);  
  grid.isCrEvent = false;
 }
 
 /*焦点失去事件*/
 TInplaceEdit.prototype.doBlur=function(e){
  var grid=this.parentNode.grid;
  grid.isFocus = grid.isMouseDown||grid.isKeyDown;
  var inp = this.owner;
  //this.parentNode.style.visibility = "hidden";
/*  if(inp.xCol==inp.oxCol&&inp.yRow==inp.oyRow)
    this.parentNode.style.visibility = "hidden";
  else{
	inp.oxCol==inp.xCol;
	inp.oyRow==inp.yRow;	
  } */
 }
 
 TInplaceEdit.prototype.setValueDate = function(value){
  this.element.focus();	 
  return this.grid.updateData(this.grid,value,this.xCol,this.yRow);
 }

 /*按扭单击时间*/
 TInplaceEdit.prototype.buttonClick=function(e){
  var grid=this.parentNode.grid;  
  var fieldName = grid.columns[grid.col].fieldName;
  var field = grid.dataset.fieldByName[fieldName];
  var cbox = this.owner;
  
  if(field!=null&&field.isDate()){
   var pos  = _$AdjustPosition(cbox.element,232,260);
   var x = pos.left;
   var y = pos.top;
  
   var  attr = "dialogHeight:260px;dialogWidth:232px;status:0;help:0;scroll:off;"+
               "dialogLeft:"+x+"px;dialogTop:"+y+"px;";

   result = window.showModalDialog("../util/getdate.html",cbox,attr);
  }else
   grid.buttonClick(grid,grid.columns[grid.col],this);
 }
 
 /*响应选择事件*/
 TInplaceEdit.prototype.doSelectChange=function(e){
  var grid=this.parentNode.grid;
  this.owner.changing = true;
  grid.updateData(grid,this.value,this.owner.xCol,this.owner.yRow);
  window.event.cancelBubble = true;
 }
 
 TInplaceEdit.prototype.doFocus=function(e){
   var grid = this.parentNode.grid;	
   grid.isFocus = true;
 }
 /*设置位置和大小*/
 TInplaceEdit.prototype.setBounds=function(x,y,w,h,xcol,yrow,slen){
   this.xCol = xcol;
   this.yRow = yrow;
   //this.oxCol = xcol;
   //this.oyRow = yrow;	
   w--;	 
   this.parent.style.left = x;
   this.parent.style.top = y;
   this.parent.style.width = w;
   this.parent.style.height = h;

   var col = this.grid.columns[xcol];
   
   switch(this.hasButton){
	 case cbsOpen: this.button.style.width = 16;
                    this.button.style.height = h-2;
					this.button.style.top = -4;
	 case cbsAuto: this.button.style.visibility = (this.hasButton==cbsOpen)?"":"hidden";
	                this.input.style.width = (this.hasButton==cbsOpen?w-18:w);
					this.input.style.top = -1;
                    this.input.style.height = h+1;

					this.input.style.fontFamily = col.font.name;
					this.input.style.fontSize = col.font.size;	  
					this.input.style.fontStyle = col.font.fontStyle;
					this.input.style.fontWeight = col.font.fontWeight;
					this.input.style.textDecoration = col.font.textDecoration; 
					
                  	this.input.style.visibility = "";	
					
                    this.Select.style.visibility = "hidden";
                 	this.pwedit.style.visibility = "hidden";
					this.focusIndex	 = 0;
					this.element = this.input;
					break;
     case cbsPassWord:
	                this.pwedit.style.width = w;
                    this.pwedit.style.height = h+1;
					this.pwedit.style.top = -1;
                  	this.pwedit.style.visibility = "";		

                    this.pwedit.style.fontFamily = col.font.name;
					this.pwedit.style.fontSize = col.font.size;	  
					this.pwedit.style.fontStyle = col.font.fontStyle;
					this.pwedit.style.fontWeight = col.font.fontWeight;
					this.pwedit.style.textDecoration = col.font.textDecoration; 
					
					this.input.style.visibility = "hidden";	
                    this.Select.style.visibility = "hidden";
                 	this.button.style.visibility = "hidden";
					this.focusIndex	 = 0;
					this.element = this.pwedit;
	                break;
	 case cbsSelect:
	                this.Select.style.top = 0;
	                this.Select.style.width = w+3;
                    this.Select.style.height = h+2;
					if(col.pickListNo!=null){
					 for(var i=this.Select.options.length-1;i>=0;i--)
					   this.Select.options.remove(i); 
				     for(var i=0;i<col.pickListNo.length;i++)
					   this.Select.options.add(new Option(col.pickListName[i],col.pickListNo[i]));
					}
					
                    this.Select.style.fontFamily = col.font.name;
					this.Select.style.fontSize = col.font.size;	  
					this.Select.style.fontStyle = col.font.fontStyle;
					this.Select.style.fontWeight = col.font.fontWeight;
					this.Select.style.textDecoration = col.font.textDecoration; 
					
                    this.Select.style.visibility = "";
                  	this.input.style.visibility = "hidden";
                 	this.pwedit.style.visibility = "hidden";
					this.button.style.visibility = "hidden";
                    this.focusIndex	 = 1;
					break;
   }
 }
 
 TInplaceEdit.prototype.setRects=function(rect,col,row,field){
   var slength = "";
   if(field!=null&&(field.dataType==1||field.dataType==12))
    slength = field.size;
   this.setBounds(rect[0],rect[1],rect[2],rect[3],col,row,slength);
 }
 
 /*设置控件的可见性*/
 TInplaceEdit.prototype.setVisible=function(visible){
  this.parent.style.visibility = visible;
  this.visible = visible=="";
  if(!this.visible) this.killFocus();
 }
 
 /*设置控件获取焦点*/
 TInplaceEdit.prototype.setFocus=function(){
   if(!this.visible) return;	 
   if(this.focusIndex==1)
    this.Select.focus();
   else{
    this.element.focus();
    this.element.select(true);	
   }
   this.grid.isFocus = true;     
 }
 
 TInplaceEdit.prototype.killFocus=function(){
  if(this.visible)
   if(this.focusIndex==0)
    this.element.blur();
   else
    if(this.focusIndex==1)
	 this.Select.blur();
 }
 
 TInplaceEdit.prototype.doMouseDown=function(e){
   this.inpEdit.isMouseDown = true;	  
   window.event.cancelBubble = true;
 }
 
 TInplaceEdit.prototype.doMouseUp=function(e){
   if(!this.inpEdit.isMouseDown){
	 this.inpEdit.setFocus(); 
   }
   this.inpEdit.isMouseDown = false; 
   window.event.cancelBubble = true;
 }

 /*设置控件的值*/
 TInplaceEdit.prototype.setValue=function(value,valueNo){
   this.element.value = value;
   this.Select.value = valueNo;
 }
 /*设置控件的字体和颜色*/
 TInplaceEdit.prototype.setFont=function(font,color,textCase){
   var style = this.element.style;	 
   style.fontSize = font.size;
   style.color = font.color;
   style.background = color;
   style.fontStyle = font.fontStyle;
   style.fontWeight = font.fontWeight;
   style.textDecoration = font.textDecoration;
   style.textTransform = textCase;
 }
 
 
/*列标题类*/
 TAColumnTitle.prototype.alignment = taCenter;
 TAColumnTitle.prototype.allwaysUseFLabel = false;
 TAColumnTitle.prototype.caption = "Column";
 TAColumnTitle.prototype.color = clBtnFace;
 TAColumnTitle.prototype.verShow = false;
 TAColumnTitle.prototype.verShowHeight = 24;
 TAColumnTitle.prototype.verShowWidth = 24;
 
 function TAColumnTitle(){
   this.font = new TFont();	 
 }
 
 TAColumnTitle.prototype.free = function(){
   this.font = null;
 }
//列类
 TAColumn.prototype.addString = "";
 TAColumn.prototype.afxString = "";
 TAColumn.prototype.alignment = taDefault;
 TAColumn.prototype.biLexIcon = null;
 TAColumn.prototype.buttonColor = clBtnFace;
 TAColumn.prototype.buttonDarkColor = clBtnFace;
 TAColumn.prototype.buttonLightColor = clBtnFace;
 TAColumn.prototype.buttonStyle = cbsAuto;

 TAColumn.prototype.canFocusEx = true;
 TAColumn.prototype.checkBox = false;
 TAColumn.prototype.checkBoxStyle = 0;
 TAColumn.prototype.color = _dbgrid_defColor;
 TAColumn.prototype.colorList = "";
 TAColumn.prototype.dblItem = false;
 TAColumn.prototype.defaultPicIndex = 0;
 TAColumn.prototype.defaultString = "√";
 TAColumn.prototype.drawPicture = false;
 TAColumn.prototype.drawPictureMethod = dpmPicture1;
 TAColumn.prototype.drawPictureStyle = dpsPicture;
 TAColumn.prototype.dropDownRows = 7;
 TAColumn.prototype.editColNum = 0;
 TAColumn.prototype.cursor = "";
 TAColumn.prototype.fieldBit = 0;
 TAColumn.prototype.fieldName = "";
 TAColumn.prototype.firstColNum = 0;
 TAColumn.prototype.font = null;
 TAColumn.prototype.fontName = "微软雅黑";
 TAColumn.prototype.fontSize = ""; 
 TAColumn.prototype.fontColor = ""; 

 TAColumn.prototype.fontStyle = ""; 
 TAColumn.prototype.fontWeight = "";
 TAColumn.prototype.fontTextDecoration = ""; 

 TAColumn.prototype.glPresent = 50;
 TAColumn.prototype.gpFont = null;
 TAColumn.prototype.groupCaption = "";
 TAColumn.prototype.groupID = 0;
 TAColumn.prototype.groupAlignMent = taCenter;
 TAColumn.prototype.index = 0;
 TAColumn.prototype.isSubColumn= false;
 TAColumn.prototype.lexiconID = "";
 TAColumn.prototype.isLink = false;
 TAColumn.prototype.linkStyle = 0;
 TAColumn.prototype.notRGridBClick = false;
 TAColumn.prototype.onlyLastData = true;
 TAColumn.prototype.passwordChar = 0;
 TAColumn.prototype.pickListNo = null;
 TAColumn.prototype.pickListName = null; 
 TAColumn.prototype.popupMenu = null;
 TAColumn.prototype.readOnly = false;
 TAColumn.prototype.rFieldName = "";
 TAColumn.prototype.selected = false;
 TAColumn.prototype.showCharCount = 0;
 TAColumn.prototype.showFromIndex = 0;
 TAColumn.prototype.showLevelData = false;
 TAColumn.prototype.showTreeStruct = false;
 TAColumn.prototype.showHint = false;
 TAColumn.prototype.textTransform = "none";
 TAColumn.prototype.title = null;
 TAColumn.prototype.titleAlignMent = taCenter;
 TAColumn.prototype.totalAlignMent = taDefault;
 TAColumn.prototype.totalCaption = "";
 TAColumn.prototype.totalFormat = "";
 TAColumn.prototype.totalID = 0;
 TAColumn.prototype.totalNum = 0;
 TAColumn.prototype.totalShow = false;
 TAColumn.prototype.useIDValue = false;
 TAColumn.prototype.useDirEvent = false;
 TAColumn.prototype.visible = true;
 TAColumn.prototype.width = 80;
 TAColumn.prototype.wordBreak = false;
 TAColumn.prototype.yoff = 0;

 TAColumn.prototype.groupClass = "groupcell";
 TAColumn.prototype.titleClass = "titlecell";
 TAColumn.prototype.titleColor = "";
 
 TAColumn.prototype.imageShow = -1;     //显示图形方式,-1不显示
 TAColumn.prototype.imageList = null;   //图形列表,图形比对应值多一个,最后一个作为默认图形
 TAColumn.prototype.valueList = null;   //对应的值,
 TAColumn.prototype.imageWidth =  0;      //图形宽度
 TAColumn.prototype.imageHeight = 0;      //图形高度
 TAColumn.prototype.imagePath = "";
 
 TAColumn.prototype.isDelCol = false;   //是删除列
 TAColumn.prototype.cellclass = "";
 TAColumn.prototype.valueToBgColor = false;
 
 function TAColumn(grid){
  this.title = new TAColumnTitle();
  this.titleClass = grid.titleClass;
  this.titleColor = grid.titleColor;
  this.grid = grid;
  this.tCell = null;
  this.field = null;
  this.sCell = null;
  
  this.font = new TFont();
  this.font.assign(grid.font);
  this.gpFont = new TFont();
  this.gpFont.assign(grid.font);
  
  this.cells = [];
 }

 TAColumn.prototype.free = function(){
  this.title.free();
  this.title = null;
  
  this.grid = null;
  this.tCell = null;
  this.field = null;
  this.sCell = null;  
  this.font = null;
  this.gpFont = null; 
  this.cells = [];
 }
 
 TAColumn.prototype.setPropertys=function(props){
  for(var i in props)
   this[i] = props[i];
  props = null;
  var grid = this.grid;
  
  if(grid.dataset!=null)
   this.field = grid.dataset.fieldByName[this.fieldName];
  else this.field = null; 
 }

 TAColumn.prototype.setReadOnly = function(bReadOnly){
   this.readOnly = bReadOnly;	 
   for(var i=0;i<this.cells.length;i++)
    this.cells[i].childNodes[0].disabled = bReadOnly;
 }
 
 TAColumn.prototype.setCaption = function(caption){
  this.tCell.childNodes[0].innerHTML = caption; 	 
 }
 
 TAColumn.prototype.setSortMark = function(sortAtt){
  switch(sortAtt){
   case -1: this.tCell.childNodes[1].innerHTML = "<span style='color:"+_dbgrid_defSortMarkColor+"'>↓</span>";
             break;
   case  0: this.tCell.childNodes[1].innerHTML = ""; 	 
             break;
   case  1: this.tCell.childNodes[1].innerHTML = "<span style='color:"+_dbgrid_defSortMarkColor+"'>↑</span>";
             break;
  }
 }
 
 TAColumn.prototype.reSize = function(nWidth){
   if(nWidth!=this.width){
	 var nOff = nWidth - this.width;   
     this.width = nWidth;
	 this.tCell.style.width = nWidth-2;
	 for(var i=0;i<this.cells.length;i++)
	   this.cells[i].style.width = nWidth;
	   
     for(var j=this.index+1;j<this.grid.columns.length;j++){
	   var column = this.grid.columns[j]; 	  
       for(var i=0;i<column.cells.length;i++)
	    column.cells[i].style.left = column.cells[i].offsetLeft + nOff;
	 }
     //this.grid.hideEditor();
     this.grid.adjustPosition();
	 this.grid.setFocus(false);
   }
 }
 
 TAColumn.prototype.setImageList = function(imageList,valueList){
   this.imageList = imageList;
   this.valueList = valueList;	 
 }
 
 TAColumn.prototype.setImageSize = function(imageWidth,imageHeight){
   this.imageWidth = imageWidth;
   this.imageHeight = imageHeight;
 }
 
//列集合
 function TAColumns(grid){
  this.columns = [];
  this.count = 0;

  this.grid = grid;
  
  this.del = function(nIndex){
   if(nIndex>=this.count) return;
   this.columns[nIndex] = null;
   for(var i=nIndex;i<this.count-1;i++)
    this.columns[i] = this.columns[i+1];
   this.count++;
  }

  this.move = function(nFrom,nTo){
   var ntemp = this.columns[nFrom];
   var i;
   if(nFrom>nTo){
    for(i=nFrom;i>nTo;i--)
	 this.columns[i] = this.columns[i-1];
	 this.columns[nTo] = ntemp;
   }
   if(nFrom<nTo){
    for(i=nForm;i<nTo;i++)
	 this.columns[i] = this.columns[i+1];
	 this.columns[nTo] = ntemp;
   }
  }
 }

 TAColumns.prototype.free = function(){
   for(var i=0;i<this.count;i++){
    this.columns[i].free();
	this.columns[i] = null;
   }
  this.columns = null;
  this.grid = null;
 }

 TAColumns.prototype.freeColumn = function(){
   for(var i=0;i<this.count;i++){
    this.columns[i].free();
	this.columns[i] = null;
   }
  this.columns = [];
  this.count = 0;
 }

 TAColumns.prototype.add = function(){
   this.columns[this.count] = new TAColumn(this.grid);
   this.columns[this.count].index = this.count;
   this.count++;
   return this.columns[this.count-1];
 }

 TAColumns.prototype.addEx = function(props){
   this.columns[this.count] = new TAColumn(this.grid);
   var col = this.columns[this.count];
   col.setPropertys(props);
   
   if(col.fontName!="") col.font.name = col.fontName; 
   if(col.fontSize!="") col.font.size = col.fontSize; 
   if(col.fontColor!="") col.font.color = col.fontColor; 
   if(col.fontStyle!="") col.font.style = col.fontStyle; 
   if(col.fontWeight!="") col.font.fontWeight = col.fontWeight; 
   if(col.fontTextDecoration!="") col.font.textDecoration = col.fontTextDecoration;    

   if(col.fieldName!="")
     col.fieldName = col.fieldName.toUpperCase();

   props = null;
   col.index = this.count;
   
   this.count++;
   return this.columns[this.count-1];
 }

 TGridDataLink.prototype.dataset = null;
 TGridDataLink.prototype.active = false;
 TGridDataLink.prototype.canModify = true;
 TGridDataLink.prototype.modifing = false;

 function TGridDataLink(grid){
  this.grid = grid;	 
 }
 
 TGridDataLink.prototype.free = function(){
   this.grid = null;	 
 }
 
 TGridDataLink.prototype.post = function(){
  return this.active? this.dataset.post():false;
 }
 
 TGridDataLink.prototype.first = function(){
  return this.active? this.dataset.first():false;
 }

 TGridDataLink.prototype.prior = function(){
  return this.active? this.dataset.prior():false;

 }
 
 TGridDataLink.prototype.next = function(){
  return this.active? this.dataset.next():false;
 }
 
 TGridDataLink.prototype.last = function(){
  return this.active? this.dataset.last():false;
 }

 TGridDataLink.prototype.moveRecord = function(nRow){
  return this.active? this.dataset.moveRecord(nRow):false;
 }
 
 TGridDataLink.prototype.updateData = function(fieldName,value){
  var result = false;	 
  if(this.active){
   result = this.dataset.validateWithValue(fieldName,value);
   result = result&&this.dataset.innersetFieldValue(fieldName,value);
  }
  return result;  
 }

 
 TGridDataLink.prototype.canFirstInsert = function(){
  return this.active&&this.dataset.canFirstInsert();
 }
 
 TGridDataLink.prototype.getFieldValue = function(fieldName){
  if(this.active)
   return this.dataset.getFieldValue(fieldName);
  else return ""; 
 }
 
//定义表格缓存行数

 TDBGrid.prototype.__bufferRow = 40;
 TDBGrid.prototype.autoInsert = true; 
 TDBGrid.prototype.left = 0;
 TDBGrid.prototype.top = 0;
 TDBGrid.prototype.width = 400;
 TDBGrid.prototype.height = 200;
 TDBGrid.prototype.rowHeight = 22; //行高
 TDBGrid.prototype.visibleRow = 1;  //可见行
 TDBGrid.prototype.maxVisibleRow = 1;  //最大可见行
 TDBGrid.prototype.rowCount = 10;  //表格记录数
 TDBGrid.prototype.scrollLeft = 0;
 TDBGrid.prototype.scrollTop = 0;
 TDBGrid.prototype.fixedCol = 0;
 TDBGrid.prototype.leftCol = 0;
 TDBGrid.prototype.topRow = 0;
 TDBGrid.prototype.dataset = null;
 TDBGrid.prototype.readOnlyCREvent = false;

 TDBGrid.prototype.activeFixedColor=_dbgrid_defActiveFixedColor;
 TDBGrid.prototype.activeRecordColor=_dbgrid_defActiveRecordColor;
 TDBGrid.prototype.activeRecordFont=null;
 TDBGrid.prototype.align=0;
 TDBGrid.prototype.color=_dbgrid_defColor;
 TDBGrid.prototype.conFieldName="";
 TDBGrid.prototype.ctrl3d=true;
 TDBGrid.prototype.dataSource = null;
 TDBGrid.prototype.editColor=_dbgrid_defEditColor;
 TDBGrid.prototype.emptyAreaStyle = false;
 TDBGrid.prototype.enabled=true;
 TDBGrid.prototype.fixedColor=_dbgrid_defFixedColor;
 TDBGrid.prototype.font = null;
 TDBGrid.prototype.glPresent = 50;
 TDBGrid.prototype.gridLineColor=_dbgrid_defGridLineColor;
 TDBGrid.prototype.gridTitleColor=_dbgrid_defGridTitleColor;
 TDBGrid.prototype.gridLine=1;
 TDBGrid.prototype.notShowZero=false;
 TDBGrid.prototype.readOnly=false;
 TDBGrid.prototype.selectBackGround=_dbgrid_defSelectBackGround;
 TDBGrid.prototype.selectFontColor="";
 TDBGrid.prototype.showTitleLine=false;
 TDBGrid.prototype.showTotalLine=false;
 TDBGrid.prototype.titleClickSort=false;
 TDBGrid.prototype.OnClickSort = null;
  
 TDBGrid.prototype.titleLinebs=1.2;
 
 TDBGrid.prototype.totalLinebs=1.0;
 TDBGrid.prototype.totalColor=_dbgrid_defTotalColor;
 TDBGrid.prototype.totalFont=null;
 TDBGrid.prototype.totalRow=false;
 TDBGrid.prototype.useActiveProperty=true;

 TDBGrid.prototype.OnCellClick = null;
 TDBGrid.prototype.OnCellMouseDown = null; 
 TDBGrid.prototype.OnDblClick = null; 
 TDBGrid.prototype.OnCRKeyDown = null;
 TDBGrid.prototype.OnDrawCell = null;
 TDBGrid.prototype.visible = true;
 TDBGrid.prototype.titleClass = "dbgridtitlecell";
 TDBGrid.prototype.titleColor = "";
 
 TDBGrid.prototype.fixedClass = "dbgridfixedcell";
 TDBGrid.prototype.crossShowRow = false;
 TDBGrid.prototype.crossRows = 2;
 TDBGrid.prototype.crossColor = _dbgrid_defCrossColor;
 
 TDBGrid.prototype.inpAlignMent = taCenter;
 TDBGrid.prototype.rowMoveEnabled = false;
 
 TDBGrid.prototype.presentWidth = false;
 
 TDBGrid.prototype.hasDelCol = false;            //显示删除操作列
 TDBGrid.prototype.delImageSrc = _dbgrid_defdelImageSrc;
 TDBGrid.prototype.delMethod = 0;        
 
 TDBGrid.prototype.cellclass = "dbgridcell";
 /*表格构造函数*/
 function TDBGrid(owner,name,inpWidth){
	
   this.Class = "TDBGRID";	
   this.items = new TAColumns(this);
   
	   
   this.columns = this.items.columns;
   this.owner = owner;
   owner.grid = this;
  
   owner.onresize = this.reSize;

   this.width = owner.offsetWidth;
   this.weight = owner.offsetHeight;
   
   this.name = name;
   this.font = new TFont();
    
   this.activeRecordFont = new TFont();
   this.activeRecordFont.color = "";
   this.totalFont = new TFont();
   
   this.options={dbEditing:true,dgAlwaysShowEditor:false,dgTitles:true,dgIndicator:true,
                  dgColumnResize:true,dgColLines:true,dgRowLines:true,
		  	      dgRowSelect:false,dgAlwaysShowSelection:true,dgCancelOnExit:true,
				  dgMultiSelect:false};
   
   this.fixedCol = 0;
   
   this.row = 0;  //当前行
   this.col = 0;  //当前列 
   this.oRow = 0;  //当前行
   this.oCol = 0;  //当前列
   this.rightCol = 0; //可见列
   this.lockScroll = false;
   this.ivLines = [];
   this.iCells = [];
   this.fhLines = [];
   this.hLines = [];
   this.editing = false;
   this.isUpdateData = false;
   //this.ActiveRecordFont.Color = "#FFFFFF";
   this.paintFirst = true;
   this.isMoveRow = false;
   
   if(typeof(inpWidth)!="undefined")
    this.inpEditWidth = inpWidth;
   else this.inpEditWidth = 28;	
   
   this.fDataLink = new TGridDataLink(this);
   
   this.isMouseDown = false;
   this.isKeyDown = false;
   this.isFocus = false; 
   
   this.isPaint = false;
   this.showInputMark = false;
   this.inputMark = "*";
   this.inputMarkColor = _dbgrid_defInputMarkColor;
   this.hiddenScroll = false;
   this.showEmptyArea = false;
   
   this.isFirstCreate = true;
   this.createToOwner = false;
   
   this.createMethod = document.write;
   this.columnCount = 0;
   
   this.inpSetting = false;  //指示列定制
   this.DragState = false;
   this.MouseIsCapture = false;
   this.DragPositionX = 0;
   this.DragPositionY = 0;

   __VCL.add(this);
 }

 TDBGrid.prototype.free = function(){
   var cell;
   for(var i=0;i<this.__bufferRow;i++)
    for(var j=0;j<this.columns.length;j++){
	 cell = this.columns[j].cells[i];
	 cell.childNodes[0].onclick = null;
	 cell.onclick = null;
	 cell.ondblclick = null;
	 cell.onmouseover = null;
	 cell.onmouseout = null;
	}

   for(var j=0;j<this.columns.length;j++){
    cell = this.columns[j].tCell;
    cell.childNodes[0].onclick = null;
   }
   
   this.items.free();
   this.items = null;

   this.columns = null;
   
   this.owner.grid = null;
   this.owner.onresize = null;
   this.owner = null;
   
   this.font = null;
   this.activeRecordFont = null;
   this.totalFont =null;
   this.options = null;
   
   this.ivLines = null;
   this.iCells = null;
   this.fhLines = null;
   this.hLines = null;
   
   this.fDataLink.free();
   this.fDataLink = null;

   this.frame.onscroll = null;
   this.frame.grid = null;
   this.scroll = null;
   this.frame = null;

   this.client.onmousedown = null;
   this.client.onmouseup = null;
   this.client.onmousemove = null;
   this.client.onkeydown = null;
   this.client.ondblclick = null;
   this.client.grid = this;
   this.client = null;
  

   this.cells.grid = null;
   this.cells = null;

   this.fixedCells.grid = null;
   this.fixedCells = null;
   
   this.indicator.grid = null;
   this.indicator = null;

   this.total.grid = null;
   this.total = null;

   this.edit.grid = null;
   this.edit = null;
   
   this.inpEdit.free();
   this.inpEdit = null;

 }
 
TDBGrid.prototype.removeColumns = function(){
  if(!this.isFirstCreate){
   var cell;

   for(var i=0;i<this.__bufferRow;i++)
    for(var j=0;j<this.columnCount;j++){
	 cell = this.columns[j].cells[i];
     cell.childNodes[0].onclick = null;
	 cell.onclick = null;
	 cell.ondblclick = null;
	 cell.onmouseover = null;
	 cell.onmouseout = null;
	}
   
   for(var j=0;j<this.columns.length;j++){
    cell = this.columns[j].tCell;
    cell.childNodes[0].onclick = null;
   }
   
   this.items.freeColumn();
   this.columns = this.items.columns;

   this.ivLines = [];
   this.iCells = [];
   this.fhLines = [];
   this.hLines = [];
   
   this.frame.onscroll = null;
   this.frame.grid = null;
   this.scroll = null;
   this.frame = null;

   this.client.onmousedown = null;
   this.client.onkeydown = null;
   this.client.ondblclick = null;
   this.client.grid = this;
   this.client = null;
  

   this.cells.grid = null;
   this.cells = null;

   this.fixedCells.grid = null;
   this.fixedCells = null;
   
   this.indicator.grid = null;
   this.indicator = null;

   this.total.grid = null;
   this.total = null;

   this.edit.grid = null;
   this.edit = null;
   
   this.inpEdit.free();
   this.inpEdit = null;
   
   this.inpFieldName = "";
   this.inpFormula = "";
   this.inpStr = "";
  }
 }
 /*处理表格滚动*/
 //求左边被隐藏列宽度再减去固定列和指示栏
 TDBGrid.prototype.getleftColWidth=function(leftCol){
  var w=0;
  for(var i=0;i<leftCol;i++)
   w+=this.columns[this.fixedCol+i].width;
  if(this.options.dgIndicator)
   w-=this.inpEditWidth;
  w -= this.getFixedWidth();
  return w;
 }

 //求左边被隐藏列宽度和
 TDBGrid.prototype.getleftColW=function(leftCol){
  var w=0;
  for(var i=0;i<leftCol;i++)
   w+=this.columns[this.fixedCol+i].width;
  return w;
 }

 TDBGrid.prototype.Scroll=function(e){
  var src=window.event.srcElement;
  var grid=src.grid;
  if(grid.lockScroll) return;

  //水平滚动
  if(grid.scrollLeft!=src.scrollLeft){
   //var nCol = Math.floor(src.scrollLeft/64);   
   //计算此位置,左边需要隐藏的列数
   var nCol = grid.getNoVisibleCols(src.scrollLeft);

   if(nCol!=grid.leftCol){
    //grid.leftCol = nCol;    	   

    if(nCol<grid.leftCol)
     nCol = (nCol>0)?nCol+grid.fixedCol:nCol;
    else{
     nCol = grid.getRightCol(nCol);
	 nCol = (nCol>=grid.items.count)?grid.items.count-1:nCol;
	}
    grid.moveOrigCol(nCol);
    grid.scrollLeft = src.scrollLeft;
   }
  }
  //垂直滚动
  if(grid.scrollTop!=src.scrollTop){
    grid.lockScroll = true;	  
	var nRow = Math.floor((src.scrollTop+2)/grid.rowHeight);  
 
    if(nRow!=grid.topRow){
	 if(nRow<grid.topRow) nRow += 1;
	 else nRow+=grid.maxVisibleRow; 
     //alert(src.scrollTop+","+grid.rowHeight);
	 if(!grid.fDataLink.moveRecord(nRow))  //数据集不允许滚动  
	  src.scrollTop = grid.scrollTop;
	 else
	  grid.scrollTop = src.scrollTop; 
	}
    grid.lockScroll = false;	
/*	
   var hrow = grid.getNoVisibleRows(src.scrollTop);
   
   if(grid.topRow != hrow){
	var nRow = (grid.topRow>hrow)?0:grid.visibleRow-1;
    grid.moveOrigRow(hrow+nRow);
   }  */
  }
 }
/*无线框事件处理*/
 TDBGrid.prototype.doCheckBoxClick=function(e){

  var src=window.event.srcElement;
  var vSrc=null;
  var grid;
  var vSrc = src;
  while (vSrc.tagName.toUpperCase()!="DIV")
   vSrc = vSrc.offsetParent;
  grid = vSrc.grid;
  var value="0";
  if(src.checked) value = "1";
  if(src.fieldName!="")
   grid.fDataLink.updateData(src.fieldName,value); 	 
  grid.isMouseDown = true; 
  grid.isFocus = true;  
 }


/*单元格单击事件*/
 TDBGrid.prototype.doCellClick=function(e){
  var src=window.event.srcElement;
  var vSrc=null;
  var grid;
  var vSrc = src;
  while (vSrc.tagName.toUpperCase()!="DIV")
   vSrc = vSrc.offsetParent;
  grid = vSrc.grid;
  col = grid.columns[grid.col];
  
  grid.isFocus = true;
  if(col.checkBoxStyle&&!grid.readOnly){
   var value = grid.fDataLink.dataset.getFieldValue(src.fieldName);
   if(value<="0"){
    value = "1";
    src.innerText = col.defaultString;
   }else{
    value = "0";
    src.innerText = " ";
   }
   grid.fDataLink.updateData(src.fieldName,value); 	 
  }else{
    if(grid.OnCellClick)
      grid.OnCellClick(grid,col); 
	if(col.isDelCol) 
	  grid.fDataLink.dataset.DeleteRow(grid.delMethod);
  }
 }
 
/*表格双击时间*/
 TDBGrid.prototype.doDblClick=function(e){
  var vSrc=window.event.srcElement;
  while (vSrc.tagName.toUpperCase()!="DIV")
   vSrc = vSrc.offsetParent;
  var grid = vSrc.grid;
  if(grid.OnDblClick)
   grid.OnDblClick(grid); 
 }

 TDBGrid.prototype.doTitleCellClick = function(e){
  var vSrc=window.event.srcElement;
  while (vSrc.tagName.toUpperCase()!="DIV")
    vSrc = vSrc.offsetParent;
  var grid = vSrc.grid;
  grid.fDataLink.dataset.DeleteRowAll(grid.delMethod);
 }
 
 TDBGrid.prototype.mouseUp=function(e){
  var src=window.event.srcElement;
  
  var vSrc=null;
  var grid;
  //求坐标获取所处于的列和行,src-响应鼠标的元素,x,y-为鼠标位置
  this.isMouseDown = false;    
  
  if(globalCaptureObject!=null){
   if(globalCaptureGrid.MouseIsCapture)
     globalCaptureObject.releaseCapture();	
   globalCaptureGrid.moveDiv.style.display = "none";
   globalCaptureGrid.DragState = false;
   globalCaptureGrid.MouseIsCapture = false;
   globalCaptureObject = null;
   globalCaptureGrid = null;
  }

  var getColRowByXy=function(){
   //求元素所在的div
   vSrc = src;
   while (vSrc!=null&&vSrc.tagName.toUpperCase()!="DIV")
    vSrc = vSrc.offsetParent;
  }

  getColRowByXy();
  if(vSrc==null) return;
  
  grid = vSrc.grid;

  if(typeof(grid)=="undefined") return;
  if(!grid.rowMoveEnabled) return;
  //鼠标按中指示列

  if(grid.DragPositionY!=event.clientY)
   if(vSrc.id==grid.name+"_Indicator"||vSrc.id==grid.name+"_Move")
    grid.doIndicatorMouseUp(0,0);

  window.event.cancelBubble = true;
  return true;
}
 
/*以下函数是处理表格被鼠标按下时的操作*/
 TDBGrid.prototype.mouseDown=function(e){
  var src=window.event.srcElement;
  var vSrc=null;
  var grid;
  //求坐标获取所处于的列和行,src-响应鼠标的元素,x,y-为鼠标位置
  var getColRowByXy=function(){
   //求元素所在的div
   vSrc = src;
   while (vSrc.tagName.toUpperCase()!="DIV")
    vSrc = vSrc.offsetParent;
  }

  getColRowByXy();
  grid = vSrc.grid;
  if(typeof(grid)=="undefined") return;

 
  if(grid.rowMoveEnabled&&vSrc.id==grid.name+"_Indicator"){
   globalCaptureObject = vSrc;
   globalCaptureGrid = grid;
   vSrc.setCapture();
   grid.MouseIsCapture = true;
  }
  //求vSrc左上角坐标，相对与body
  var vl = vSrc.offsetLeft;
  var vt = vSrc.offsetTop;
  var vParent = vSrc.offsetParent;

  var ts = vParent.tagName.toUpperCase();

  while (ts!="BODY"&&ts!="HTML"){
    vl += vParent.offsetLeft;
    vt += vParent.offsetTop;
	if(typeof(vParent.scrollLeft)!="undefined")
	 vl -= parseInt(vParent.scrollLeft,10);
	if(typeof(vParent.scrollTop)!="undefined")
	 vt -= parseInt(vParent.scrollTop,10);
    vParent = vParent.offsetParent;
	ts = vParent.tagName.toUpperCase();
  }

  //求鼠标位置鼠标位置相对于vSrc的坐标
  vl = window.event.clientX - vl;
  vt = window.event.clientY - vt-2;
 
  this.isMouseDown = true;  //设置鼠标被按下标记	  
  this.isFocus = true;
  //鼠标按中指示列
  if(vSrc.id==grid.name+"_Indicator")
   grid.doIndicatorMouseDown(vl,vt);
  //鼠标按中固定列
  if(vSrc.id==grid.name+"_FixedCells")
   grid.doFixedCellsMouseDown(vl,vt);
  //鼠标按中活动列
  if(vSrc.id==grid.name+"_Cells")
   grid.doCellsMouseDown(vl,vt);
  window.event.cancelBubble = true;
  return true;
 }
 
 /*鼠标拖动事件*/
 TDBGrid.prototype.mouseMove=function(e){
  var src=window.event.srcElement;
  var vSrc=null;
  var grid;
  //求坐标获取所处于的列和行,src-响应鼠标的元素,x,y-为鼠标位置
  var getColRowByXy=function(){
   //求元素所在的div
   vSrc = src;
   while (vSrc!=null&&vSrc.tagName.toUpperCase()!="DIV")
    vSrc = vSrc.offsetParent;
  }

  getColRowByXy();

  if(vSrc==null) return;
  
  grid = vSrc.grid;
  if(typeof(grid)=="undefined"||!grid.DragState) return;

  if(vSrc.id==grid.name+"_Indicator"){

   //求vSrc左上角坐标，相对与body
    var vl = vSrc.offsetLeft;
    var vt = vSrc.offsetTop;
    var vParent = vSrc.offsetParent;

    var ts = vParent.tagName.toUpperCase();

    while (ts!="BODY"&&ts!="HTML"){
      vl += vParent.offsetLeft;
      vt += vParent.offsetTop;
	  if(typeof(vParent.scrollLeft)!="undefined")
	   vl -= parseInt(vParent.scrollLeft,10);
	  if(typeof(vParent.scrollTop)!="undefined")
	   vt -= parseInt(vParent.scrollTop,10);
      vParent = vParent.offsetParent;
	  ts = vParent.tagName.toUpperCase();
    }

    //求鼠标位置鼠标位置相对于vSrc的坐标
    vl = window.event.clientX - vl;
    vt = window.event.clientY - vt-2;
    var th = grid.options.dgTitles?grid.getTitleHeight():0;	
    if(vt>=th){
      var  n = grid.moveDiv.offsetTop+(event.clientY-grid.DragPositionY);
	
	  if(n<th) n = th; 
      grid.moveDiv.style.top = n;
	             
      grid.DragPositionX = event.clientX;
      grid.DragPositionY = event.clientY;   	
	}
  }
  window.event.cancelBubble = true;
  return true;
 }
 
//处理鼠标按中指示列
 TDBGrid.prototype.doIndicatorMouseDown=function(x,y){
  var th = this.options.dgTitles?this.getTitleHeight():0;
  if(y > th){
   var h = th;
   var i = 0;
   for(i=0;i<this.visibleRow;i++){
	h += this.rowHeight;
	if(y<h) break;
   }
   this.moveOrigRow(this.topRow+i);
   this.moveDiv.style.top = h - this.rowHeight;
   
   if(this.rowMoveEnabled&&this.dataset!=null&&!this.dataset.isEmpty()){
     this.moveDiv.innerHTML = "<span style='width:"+this.inpEditWidth+"px;height:"+this.rowHeight+"px;left:0px'>"+
	                          this.iCells[this.row].innerHTML+"</span>"+this.getRowHtml(this.row);
     //this.moveDiv.childNodes[0].style.background = "#9999ff";
	 var nLeft = 0;//this.inpEditWidth;
     for(i=0;i<this.moveDiv.childNodes.length;i++){
      this.moveDiv.childNodes[i].style.left = nLeft;
	  this.moveDiv.childNodes[i].style.background = _dbgrid_defMoveDivBgColor;
	  this.moveDiv.childNodes[i].style.color = _dbgrid_defMoveDivFontColor;
      var sw = this.moveDiv.childNodes[i].style.width;
	  nLeft += parseInt(sw.substring(0,sw.length-2));
     }

     this.moveDiv.style.display = "block";
     this.DragState = true;
     this.DragPositionX = event.clientX;
     this.DragPositionY = event.clientY;   
     this.DragStartPosY = this.moveDiv.offsetTop;
   }
  }
 }

 TDBGrid.prototype.doIndicatorMouseUp=function(x,y){
  var th = this.options.dgTitles?this.getTitleHeight():0;
  var y = this.moveDiv.offsetTop;
  var oy = this.DragStartPosY;   
//  alert(y);
  if(y >=th){
   var h = th;
   var oRow = 0;
   if(y<oy){
    for(var i=0;i<this.visibleRow;i++){
     if(y<=h) break;
     oRow++;
     h += this.rowHeight;
    }
   }else{
    for(var i=0;i<this.visibleRow;i++){
     h += this.rowHeight;
     if(y<=h) break;
     oRow++;
    }
   }
   
   if(oRow!=this.row){
	 if(oRow>=this.rowCount-1) oRow = this.rowCount-1;
     this.dataset.changeRecordLocation(this.dataset.recNo(),oRow+this.topRow+1);
     this.drawCells();
     this.dataset.moveRecord(oRow+this.topRow+1);   
   }
  }
 }

 //处理鼠标按中固定列
 TDBGrid.prototype.doFixedCellsMouseDown=function(x,y){
  var w=0,i,j = -1;
  //求列
  for(i=0;i<this.fixedCol;i++){
   w += this.columns[i].width;
   if(x<w) break;
  }
  //表头高度
  var th = this.getTitleHeight();
  if(y > th){
   var h = th;
   for(j=0;j<this.visibleRow;j++){
	h += this.rowHeight;
	if(y<h) break;
   }
   j = j>=this.visibleRow?j-1:j; //改变当前单元格
  }
  if(j<0){ //是表头
   if(!this.columns[i].isDelCol)
     this.titleMouseDown(i,x,y);    //调用表头被单击事件
  }else{
   this.moveOrigCol(i,j==this.row);  //禁止刷新显示
   this.moveOrigRow(j+this.topRow);
  }
 }
 //处理鼠标按中活动列
 TDBGrid.prototype.doCellsMouseDown=function(x,y){
  var w=0,i=0,j = -1,li,k;
 
  //求行
  var th = this.getTitleHeight();
  if(y > th){
   var h = th;
   for(j=0;j<this.visibleRow;j++){
	h += this.rowHeight;
	if(y<h) break;
   }
   j = (j>=this.visibleRow)?j-1:j; //改变当前单元格
  }

  if(j<0){ //是表头
   for(k=this.fixedCol;k<this.items.count;k++){
    w += this.columns[k].width;
    if(x<w) break;
   }
   if(k>=this.items.count) return;  
   
    if(!this.columns[k].isDelCol)
      this.titleMouseDown(k,x,y);    //调用表头被单击事件
  }else {
   i = this.fixedCol; 
   for(k=this.fixedCol;k<this.items.count;k++){
    w += this.columns[k].width;
    if(this.columns[k].cells[j].style.visibility!="hidden")
    i = k;
    if(x<w) break;
   }
   if(i>=this.items.count) return;
   //if(i==this.items.count-1&&this.columns[i].isDelCol) return;

  //计算鼠标按在哪列上
   var oCol = this.col;	

   if(i!=this.col)	 this.moveOrigCol(i,j==this.row);  //禁止刷新显示
   if(j!=this.row)
    if(!this.moveOrigRow(j+this.topRow))
	 this.col = oCol;
	 
   if(this.OnCellMouseDown!=null)
    this.OnCellMouseDown(this.columns[this.col]);
  }
 }
 
 /*获取一个单元合的位置和大小*/
 TDBGrid.prototype.getCellRect=function(col,row){
   var t = this.options.dgTitles?this.getTitleHeight():0;
   t += row*this.rowHeight;
   var w,h=this.rowHeight;
   var l = this.options.dgIndicator?this.inpEditWidth:0;
   //先检查是否有固定列
   var cell = this.columns[col].cells[row];

   for(var i=0;i<this.fixedCol;i++){
	if(col==i) return [l,t,cell.offsetWidth,cell.offsetHeight];
	l += this.columns[i].width;
   }
   for(var i=this.fixedCol+this.leftCol;i<this.items.count;i++){
	if(col==i) return [l,t,cell.offsetWidth,cell.offsetHeight];
	l += this.columns[i].width;
   }
 }
 /*改变当前单元格  */
 TDBGrid.prototype.changeOrigCell=function(col,row){
  if(!this.visible) return;
  var n = this.oRow,m,rNo=0,column;
  var cell=null;

  if(this.columns.length==0) return;

  if(!this.isUpdateData)
   this.inpEdit.setVisible("hidden");
  //恢复原来行的颜色
  //alert(this.columns[1].cells[0]);
  rNo = n+this.topRow+1;
      
  if(n!=row){
   var nRecno = this.dataset.pData.absolutePosition;

   this.dataset.pData.absolutePosition = n+this.topRow+1;
   for(var i=0;i<this.items.count;i++){
	column = this.columns[i];   
    cell = column.cells[n];

    if(column.valueToBgColor&&column.field!=null&&column.field.$()!=""){
	   cell.style.background = "#"+column.field.$();	 
	}else{
      if(this.crossShowRow&&rNo%this.crossRows==0&&column.color==clWhite)
       cell.style.background = this.crossColor;
	  else	
	   cell.style.background = column.color;
	}
    cell.style.color = this.columns[i].font.color;
	
	if(this.columns[i].isLink)
	 cell.childNodes[0].style.color = "";
//	else
//	 cell.childNodes[0].style.color = this.columns[i].font.color;
	 
    if(this.OnDrawCell!=null){ 
	 this.OnDrawCell(this,this.columns[i],cell);	
	}
   }
   this.dataset.pData.absolutePosition = nRecno;   
  }else{
   m = this.col;	
   column = this.columns[m];
   cell = column.cells[row];
   
   if(column.valueToBgColor&&column.field!=null&&column.field.$()!=""){
     cell.style.background = "#"+column.field.$();	 
   }else{

     if(this.crossShowRow&&rNo%this.crossRows==0&&column.color==clWhite)
       cell.style.background = this.crossColor;
     else	
	   cell.style.background = column.color;
   }
   cell.style.color = column.font.color;
   cell.childNodes[0].style.color = "";
   if(this.OnDrawCell!=null)
    this.OnDrawCell(this,column,cell);	
  }
  
  //改变当前行的颜色
  if(this.useActiveProperty){
   for(var i=0;i<this.items.count;i++){
	column = this.columns[i];    
	cell = column.cells[row];
	if(!column.valueToBgColor||column.field==null||column.field.$()=="")
      cell.style.background = this.activeRecordColor;
	if(this.activeRecordFont.color!=""){
 	 cell.style.color = this.activeRecordFont.color;
	 if(column.isLink)
	  cell.childNodes[0].style.color = "";
	}
   }
  }
  cell = this.columns[col].cells[row];

  if(!this.isUpdateData)
   if(this.columns[col].checkBox){
	cell.childNodes[0].style.visibility = "";   
	if(!cell.childNodes[0].disabled&&this.isFocus)   
     cell.childNodes[0].focus();	 
   }else{
	column = this.columns[col]; 

    if(this.options.dbEditing&&!column.readOnly&&!this.readOnly&&column.field!=null&&!this.dataset.readOnly){
		
     this.inpEdit.hasButton = column.buttonStyle;
	 
     this.inpEdit.setRects(this.getCellRect(col,row),col,row,column.field);
	 
     this.inpEdit.setFont(column.font,column.color,column.textTransform);
	 
	 //
	 if(column.buttonStyle==cbsSelect){
	  var v=this.fDataLink.getFieldValue(column.fieldName);	 
	  this.inpEdit.setValue(v,v);
	 }
     else			 
      this.inpEdit.setValue(cell.innerText,"");
	  
     this.inpEdit.setVisible("");
	 
	 if(!this.isMouseDown&&this.isFocus) this.inpEdit.setFocus();
	 
    }else
	 if(this.options.dgAlwaysShowSelection){	
      cell.style.background = this.selectBackGround;
	  if(this.selectFontColor!=""){
       cell.style.color = this.selectFontColor;
 	   if(column.isLink)
	    cell.childNodes[0].style.color = this.selectFontColor;
	  }
	 }
   }
  this.oRow = this.row;
  this.oCol = this.col;
  this.row = row;
  this.col = col;
 }

 //处理表头被按下事件
 //处理表头被按下事件
 TDBGrid.prototype.titleMouseDown=function(col,x,y){
  var dSet = this.dataset;
  
  var src = window.event.srcElement;

  if(window.event.button==1){
   if(this.columns[col].checkBox&&this.columns[col].multiSelect){
    dSet.setFieldValueAll0(this.columns[col].fieldName);
   }else
    if(this.titleClickSort&&dSet!=null){
     for(var i=0;i<this.columns.length;i++)
      this.columns[i].setSortMark(0);
     if(this.OnClickSort!=null){
  	  this.changeSortAtt(this.columns[col].fieldName);   
      this.OnClickSort(this,dSet);
     }else{
      dSet.doSort(this.columns[col].fieldName);	 
      this.reFresh();
     }
     this.columns[col].setSortMark(dSet.sortAtt);
    }
  }
 }
 
 TDBGrid.prototype.titleCellMouseMove = function(){
   return;	  
   var src = window.event.srcElement;
   if(src.tagName=="TD"){
	var wCol = parseInt(src.width,10);
	var pcolumn = src.owner; 
	var m = window.event.offsetX;
	var n = wCol - m;
	if(typeof(pcolumn)!="undefined")
 	 if(n<=4||(!pcolumn.isFirstCol&&m<=4))
	  src.style.cursor = "w-resize";
	 else 
      src.style.cursor = "";
   }
 }
 
 TDBGrid.prototype.cellMouseOver = function(){
 }
 
 TDBGrid.prototype.cellMouseOut = function(){
 }
 
/*处理键盘事件*/
 TDBGrid.prototype.keyDown=function(e){
  var key=window.event.keyCode;
  var src = window.event.srcElement;
  var vSrc=src,value="",oldValue;
  var isInput = src.tagName.toUpperCase()=="INPUT"; 
  
  while (vSrc.tagName.toUpperCase()!="DIV")
   vSrc = vSrc.offsetParent;
  var grid = vSrc.grid;
  grid.isMouseDown = false;
  grid.isFocus = true;
  grid.isKeyDown = true;
  var nRow = grid.topRow+grid.row; //当前行
  switch(key){
   case  9:	  
   case 13:	//回车键
            if(isInput) value = src.value;
			  
            if(grid.OnCRKeyDown!=null)
			 if(!grid.OnCRKeyDown(grid,grid.col,value)) break;

            if(grid.crKeyDown(grid.col+1)) break;  //检查是否在最后一列按了回车
   case 39://右光标键
   case 9:
            grid.moveOrigCol(grid.col+1);  //移动列到下一列
			break;
   case 37://左光标键
            grid.moveOrigCol(grid.col-1);
			break;
   case 38://上光标键
            grid.moveOrigRow(nRow-1);
			break;
   case 40://下光标键
            grid.moveOrigRow(nRow+1);
			break;
   case 113:grid.showEditor();
   default:;
  }
  grid.isKeyDown = false;  
 }

 //回车键处理
 TDBGrid.prototype.crKeyDown=function(nCol){
   //获取下一个可以处理回车的列	 
   var nextCrCol = function(grid){
    if(!grid.readOnlyCREvent&&!grid.readOnly)
 	 while(nCol<grid.items.count){
	  if(grid.columns[nCol].readOnly||grid.columns[nCol].cells[grid.topRow+grid.row].style.visibility=="hidden")
	   nCol++;
	  else break;
	}
   }
   //获取第一个可以处理回车的列
   var firstCrCol = function(grid){
    nCol = 0;
    if(!grid.readOnlyCREvent&&!grid.readOnly)
 	 while(nCol<grid.items.count){
	  if(grid.columns[nCol].readOnly)
	   nCol++;
	  else break;
	}
   }
   
   nextCrCol(this);

   if(nCol<this.items.count)
    this.moveOrigCol(nCol);
   else{
    if(this.topRow+this.row<this.rowCount-1){
 	 firstCrCol(this);   		
	 this.moveOrigCol(nCol,false);		
     this.moveOrigRow(this.topRow+this.row+1);
	}
    else 
     if(this.fDataLink.active&&this.fDataLink.canModify&&!this.readOnly){
	  if(this.autoInsert)	 
       this.fDataLink.dataset.insert();
 	  firstCrCol(this);
  	  this.moveOrigCol(nCol,true);
	 }
   }
   return true;
 }
 //移动光标到下一列
 TDBGrid.prototype.moveOrigCol=function(nCol,nShow){
  //往左移动
  var bScroll = false;
  if(nCol<0||nCol>=this.items.count) return;
  if(nCol>=this.fixedCol&&nCol<this.fixedCol+this.leftCol){
   this.leftCol = nCol-this.fixedCol;
   this.getRightCol();   //求右边第一个未显示完全的列
   bScroll = true;
  }else if(nCol>=this.rightCol){
   nCol = (nCol>=this.items.count)?this.items.count-1:nCol;
   this.leftCol = this.getMinLeftCol(nCol);  //求左边被隐藏的列  
   this.getRightCol();   //求右边第一个未显示完全的列
   bScroll = true;
  }else if(nCol<this.fixedCol){
   this.leftCol = 0;
   this.getRightCol(); 
   bScroll = true;
  }
   
  if(bScroll){
   this.cells.style.left = 0-this.getleftColWidth(this.leftCol);
   this.totalc.style.left = this.cells.style.left;   
  }
  
  this.lockScroll = true;
  this.frame.scrollLeft = this.getleftColW(this.leftCol);
  this.scrollLeft = this.frame.scrollLeft;
  this.lockScroll = false;

  if(typeof(nShow)=="undefined"||nShow)
   this.changeOrigCell(nCol,this.row);
  else this.col = nCol;
 }

 //移动光标到下一行,att-0
 TDBGrid.prototype.moveOrigRow=function(nRow){
  //rRow为绝对行
  var result = false;
  var rRow = nRow+1;
  var oTopRow = this.topRow;
  var b = false;
  if((nRow<0)||(nRow>=this.rowCount)) return;
  //向上
  this.inpEdit.killFocus();  
  this.isMoveRow = true;
  if(this.fDataLink.moveRecord(rRow)){
   result = true; 	   
   if(nRow<this.topRow){
	this.topRow = nRow;
    this.row = 0;
   }else{
    if(nRow>=this.topRow+this.visibleRow){
	 this.row = this.visibleRow-1;
	 this.topRow = nRow - this.row;
	}else{
	 if(this.rowCount<this.topRow+this.visibleRow){
	  this.topRow = this.rowCount-this.visibleRow;	  
  	  this.row = nRow-this.topRow;	 
	  //this.drawCells();
	 }else{
      this.row = nRow-this.topRow;	
	  b = true;
	 }
	}
   }
   if(nRow<oTopRow||nRow>=this.maxVisibleRow){
    this.lockScroll = true;   
    this.frame.scrollTop = this.topRow*this.rowHeight;
	this.scrollTop = this.frame.scrollTop;	
    this.lockScroll = false;
   }
   if(b) this.changeOrigCell(this.col,this.row);    
   else this.drawCells(); 
  }
  this.isMoveRow = false;
  return result;
 }

 //表格尺寸变化时
 TDBGrid.prototype.reSize=function(){
   var vSrc = window.event.srcElement;
   var grid = vSrc.grid;
   
   if(grid.width!=grid.owner.offsetWidth||grid.height!=grid.owner.offsetHeight){
    grid.adjustPosition();
    grid.drawCells();
    grid.drawTotalCells();  

	grid.width=grid.owner.offsetWidth;
	grid.height=grid.owner.offsetHeight;
   }
 }
 
 /*求可见行行高和，并计算可见行数*/
 TDBGrid.prototype.getVisibleHeight = function(){
	var th = this.getTitleHeight();
	var nh = this.options.dgTitles?th:0;
	var ch = this.client.offsetHeight-nh;
	var mch = this.frame.clientHeight-nh;
	
    if(this.totalRow){
 	 ch-=this.rowHeight;
	 mch-=this.rowHeight;
	}

	this.visibleRow = Math.floor(ch/this.rowHeight); //visibleRow是可见行
	
	if(this.visibleRow>this.__bufferRow)
	  this.visibleRow = this.__bufferRow;
	  
	this.realshowRow = this.visibleRow;
    this.visibleRow = (this.visibleRow>this.rowCount)?this.rowCount:this.visibleRow;

	if(!this.showEmptyArea)
	 this.realshowRow = this.visibleRow;
	 
    this.maxVisibleRow = Math.floor(mch/this.rowHeight);
	
    th += this.rowHeight*this.realshowRow;
	
    return th;

 }
 
 /*获取需要滚动的宽度*/
 TDBGrid.prototype.getScrollXBound = function(){
  var nw = this.options.dgIndicator? this.inpEditWidth:0;
  var i,j;
  for(i=0;i<this.items.count;i++)
   nw+=this.columns[i].width;
  //活动区域宽度
  /*
  if(nw>this.frame.clientWidth&&this.items.count-this.fixedCol>1)
   nw = (this.items.count-1)*64+this.frame.clientWidth;
  else nw = this.frame.clientWidth-64; */
  return nw;
 }
 
 //获取需要滚动的高度
 TDBGrid.prototype.getScrollYBound = function(){
	var nh = 0;
	/*
	if(this.rowCount>this.visibleRow)
	 nh+=this.rowHeight*(this.rowCount-1);
    nh += this.frame.clientHeight;
	*/
	nh = this.rowHeight*this.rowCount+this.getTitleHeight();
	if(this.totalRow) nh+=this.rowHeight;
    return nh+16;
 }

 //并设置右边第一个被隐藏(未显示完成的)列,当右边没有隐藏的列时,rightCol>总列数
 TDBGrid.prototype.getRightCol = function(lCol){
	//aw是活动列可见区域的宽度
	var aw = this.client.offsetWidth;
    var leftCol = this.leftCol;
	
	if(typeof(lCol)!="undefined")
	 leftCol = lCol;
	 
	if(this.options.dgIndicator) aw -= this.inpEditWidth;
	if(this.fixedCol>0) aw-=this.getFixedWidth();

	var i,w = 0;
	for(i=leftCol+this.fixedCol;i<this.items.count;i++){
	 w += this.columns[i].width;
	 if(w>aw) break;
    }
	if(typeof(lCol)=="undefined")
 	 this.rightCol = i;
	return i;
 }
//求要能显示一列时，左边需要隐藏的最少列
 TDBGrid.prototype.getMinLeftCol=function(col){
	//aw是活动列可见区域的宽度
	var aw = this.client.offsetWidth;

	if(this.options.dgIndicator) aw -= this.inpEditWidth;
	if(this.fixedCol>0) aw-=this.getFixedWidth();

	var i=col,w = 0;
	if(i>=this.fixedCol){
 	 while(i>=this.fixedCol){
	  w += this.columns[i].width;
	  if(w>aw) break;
	  i--;
     }
	 i = i+1-this.fixedCol;
	} else i=0;
    return i;
 }

//获取左边被隐藏的列数
 TDBGrid.prototype.getNoVisibleCols = function(w){
	var nw = 0,j=0;
    for(var i=this.fixedCol;i<this.items.count;i++)
	 if(this.columns[i].visible){
   	  nw = this.columns[i].width/2;
	  if(w<nw) break;
	  j++;
	  w -= this.columns[i].width;
	 }
    return j;
 }

//获取上边被隐藏的行数
 TDBGrid.prototype.getNoVisibleRows = function(h){
 	var hr = h/this.rowHeight;
	return Math.floor(hr);
 }

//获取表头的高度
 TDBGrid.prototype.getTitleHeight = function(){
	return Math.floor(this.rowHeight*this.titleLinebs);
 }
//获取固定列宽度之和
 TDBGrid.prototype.getFixedWidth = function(){
	var w=0;
	for(var i=0;i<this.fixedCol;i++)
	 w += this.columns[i].width;
	return w;
 }
//获取活动列之宽度
 TDBGrid.prototype.getCellsWidth = function(){
	var w=0;
	for(var i=this.fixedCol;i<this.items.count;i++)
	 w += this.columns[i].width;
	return w;
 }
//显示一个单元格的内容
 TDBGrid.prototype.drawCell = function(col,row){
  if(this.fDataLink.active){	 
	 
   var dSet = this.dataset;
   var nRecno = row+this.topRow+1;
   var column = this.columns[col]; 
   var field = column.field;
   var value = "",valueNo="";
  
   if(field!=null){
     var n = dSet.pData.absolutePosition;
     dSet.pData.absolutePosition = nRecno;
     value = field.getValueZeroToNone(this.notShowZero,column.displayFormat);
     dSet.pData.absolutePosition = n;
   }
	
   var j = col,i = row;	
   var cell = column.cells[i];
    
   if(column.imageShow>-1){
	switch(column.imageShow){
     case 1:  if(column.imageList!=null&&column.valueList!=null){
	            var imgSrc = findElement(value,column.valueList,column.imageList);
				cell.childNodes[0].src = (imgSrc=="")? column.imageSrc:column.imagePath+imgSrc;
	          }
			  break;
	 case 2:  cell.childNodes[0].src = (value=="")? column.imageSrc:column.imagePath+value;
	          break;
	 default: cell.childNodes[0].src = column.imageSrc; 
	}

   }else
    if(column.checkBox){
     cell.childNodes[0].style.visibility = ""; 	   
     cell.childNodes[0].checked = value>"0";
    }else{
     cFont = column.font; 	   
     cell.style.color = cFont.color;
     cell.style.textAlign = column.alignment;
     cell.style.fontFamily = cFont.name;	
 	 cell.style.fontSize = cFont.size;
     cell.style.fontStyle = cFont.fontStyle;
     cell.style.fontWeight = cFont.fontWeight;
     cell.style.textDecoration = cFont.textDecoration; 

	if(this.row!=row){   
	 if(column.valueToBgColor&&field!=null&&field.$()!=""){
	   cell.style.background = "#"+field.$();	 
	 }else{
       if(this.crossShowRow&&nRecno%this.crossRows==0&&column.color==clWhite)
        cell.style.background = this.crossColor;
	   else	
	    cell.style.background = column.color;
	 }
	}
	
    if(this.OnDrawCell!=null) this.OnDrawCell(this,column,cell);		 
	
	if(dSet.isEmpty())
	 cell.childNodes[0].innerHTML = ""
	else{ 
     if(column.checkBoxStyle)
      if(value>"0") value =  this.columns[j].defaultString; 
      else value = " ";

     if(column.buttonStyle==cbsSelect&&column.pickListNo!=null){
 	  valueNo = value; 
 	  value = findElement(value,column.pickListNo,column.pickListName);
     }else
	  if(column.buttonStyle==cbsPassWord&&field!=null)
	    value = field.getPassWord();
	 
     value = column.afxString+value;
     if(value!="") value += column.addString;
	   
     if(column.isLink)
      cell.childNodes[0].innerHTML = value;	 
     else
      cell.childNodes[0].innerText = value;	 
	 if(column.showHint) cell.title = value; 
	}
   }
 
   if(col==this.col&&row==this.row)
    this.inpEdit.setValue(value,valueNo);
  }
 }
 
 //获取一行的Html描述
 TDBGrid.prototype.getRowHtml = function(row){
  var sResult = "";	 
  var column = null,cell = null;
  for(var j=0;j<this.items.count;j++){
   cell = this.columns[j].cells[row];
   sResult += cell.outerHTML;
  }
  return sResult;
 }
 
 //显示所有单元格的内容
 TDBGrid.prototype.drawCells = function(){

  //var d1 = new Date();
  var isCrossRow = false;
  var active = this.fDataLink.active,column; 
  
  if(active){
   var nRecNo = 0,value="",field,cell,fieldName,rNo=0;
   var dSet = this.dataset;
  
   nRecNo = this.dataset.pData.absolutePosition; 
   var nShowRow = (this.realshowRow>this.rowCount)?this.rowCount:this.realshowRow;

   for(var i=0;i<nShowRow;i++){
	   
	rNo = this.topRow+i+1;

    dSet.pData.absolutePosition = rNo;
	
	var inpStr = (dSet.isEmpty())?"&nbsp;":rNo+((dSet.pageNumber>0)?dSet.pageSize*(dSet.pageNumber-1):0);

	if(!dSet.isEmpty()&&
		this.inpField!=null&&this.inpField.sField.value+""!=""&&
		eval(this.inpField.sField.value+this.inpFormula))
	  inpStr += this.inpStr;
	  
    this.iCells[i].innerHTML = inpStr;
	
    for(var j=0;j<this.items.count;j++){
 	 value = "";    
	 column = this.columns[j];
	 field = column.field;
	 
//   if(this.columns[j].lexiconID=="RecNo")
//	  value = this.topRow+i+1;
//	 else 
	 if(field!=null)  value = field.getValueZeroToNone(this.notShowZero,column.displayFormat);

     cell=column.cells[i];

     if(column.valueToBgColor&&field!=null&&field.$()!=""){
	   cell.style.background = "#"+field.$();	 
	 }else{
       isCrossRow = this.crossShowRow&&rNo%this.crossRows==0&&column.color==clWhite;
	   if(isCrossRow)
         cell.style.background = this.crossColor;
       else	
	     cell.style.background = column.color;
	 }
	 
	 if(column.imageShow>-1){
  	   switch(column.imageShow){
         case 1:if(column.imageList!=null&&column.valueList!=null){
	              var imgSrc = findElement(value,column.valueList,column.imageList);
			      cell.childNodes[0].src = (imgSrc=="")? column.imageSrc:column.imagePath+imgSrc;
	            }
			    break;
	     case 2:cell.childNodes[0].src = (value=="")? column.imageSrc:column.imagePath+value;
	            break;
	     default: cell.childNodes[0].src = column.imageSrc; 
	   }
	   cell.childNodes[0].style.visibility = "";
    //	alert(column.imageSrc);	   
	 }else
 	   if(column.checkBox){
         cell.childNodes[0].style.visibility = ""; 		 
	    cell.childNodes[0].checked = value>"0";
	   }else{
 	    cFont = column.font; 
	  
        cell.style.color = cFont.color;
        cell.style.textAlign = column.alignment;
	    cell.style.fontFamily = cFont.name;
	    cell.style.fontSize = cFont.size;	  
	    cell.style.fontStyle = cFont.fontStyle;
        cell.style.fontWeight = cFont.fontWeight;
        cell.style.textDecoration = cFont.textDecoration; 
	  
	    if(this.OnDrawCell!=null) this.OnDrawCell(this,column,cell);
	   
	    if(dSet.isEmpty())
	     cell.childNodes[0].innerHTML = "";
	    else{ 
	     if(column.checkBoxStyle)
	      if(value>"0") value = column.defaultString; 
	      else value = " ";
	 
	     if(column.buttonStyle==cbsSelect&&column.pickListNo!=null)
  	      value = findElement(value,column.pickListNo,column.pickListName);
	     else
 	      if(this.columns[j].buttonStyle==cbsPassWord&&field!=null)
	       value = field.getPassWord();
	  
	     value  = column.afxString+value;
	     if(value!="") value += column.addString;
	     if(column.isLink)
          cell.childNodes[0].innerHTML = value;	 
 	     else
          cell.childNodes[0].innerText = value;	 
		
	     if(column.showHint) cell.title = value; 		
	   }
	 }  //else
    } //for(j
   } //for(i 
   dSet.pData.absolutePosition = nRecNo;		   
   this.changeOrigCell(this.col,this.row);   
  }
  
  var dataRow = this.realshowRow; //>this.rowCount)?this.rowCount:this.realshowRow;
  for(var i=nShowRow;i<dataRow;i++){
    this.iCells[i].innerHTML = "&nbsp;";	  
    isCrossRow = !isCrossRow;	
    for(var j=0;j<this.items.count;j++){
 	 value = "";    
     column = this.columns[j];
     cell=column.cells[i];

	 if(isCrossRow&&this.crossShowRow&&column.color==clWhite)
      cell.style.background = this.crossColor;
     else	
	  cell.style.background = column.color;
	
	 if(!column.checkBox&&column.imageShow<0)
      cell.childNodes[0].innerText = value;
	 else
	  cell.childNodes[0].style.visibility = "hidden";
     if(column.showHint) cell.title = ""; 		
    } //for(j
  }

  //var d2 = new Date();
  //alert(d2-d1);
 }  
 
 //显示合计行的内容
 TDBGrid.prototype.drawTotalCells = function(){
   for(var j=0;j<this.items.count;j++){
	var column = this.columns[j];
	if(column.totalShow&&column.field!=null){
	 //取合计值	
	 
	 var value = column.field.getSumDisplayText(this.notShowZero,column.displayFormat);    
	 var cell = column.sCell; 
	 var cFont = column.font; 
     cell.innerText = value;
	}
   }
 }
 
 //显示当前行
 TDBGrid.prototype.drawRow = function(){
  var dSet = this.dataset;	  
  var rNo = this.topRow+this.row+1;
  var nRecNo = rNo+((dSet.pageNumber>0)?dSet.pageSize*(dSet.pageNumber-1):0);
  
  var inpStr = (dSet.isEmpty()||nRecNo<=0)?" ":nRecNo;
  if(!dSet.isEmpty()&&this.inpField!=null&&this.inpField.sField.value+""!=""&&
				   eval(this.inpField.sField.value+this.inpFormula))
	inpStr += this.inpStr;
	  
  this.iCells[this.row].innerHTML = inpStr;
			  
  for(var i=0;i<this.columns.length;i++)
   this.drawCell(i,this.row);
 }
 
 //根据百分比调整表格宽度
 TDBGrid.prototype.adjustColumnWidth = function(){
	var w = 0,nw = 0;
	var colNum = this.columns.length;
	
	var aw = this.owner.clientWidth-16;
	if(this.options.dgIndicator) aw -= this.inpEditWidth;
	if(this.hasDelCol){
	  aw -= this.columns[colNum-1].width;
	  colNum --;
	}
	   
	if(aw>0){
  	 for(var i=0;i<colNum;i++)
	   w += this.columns[i].width;
	 if(aw>w){
	  for(var i=0;i<colNum-1;i++){
		var rw = Math.floor(this.columns[i].width*aw*1.0/w); 
		nw += rw;
	    this.columns[i].width = rw;
	  }
      this.columns[colNum-1].width = aw-nw;
	 }
	}
 }
 //调整各区域的位置
 TDBGrid.prototype.adjustPosition = function(){
   if(this.paintFirst) return;
   //滚动范围
   if(this.hiddenScroll){
    this.client.style.width = this.frame.offsetWidth;
    this.client.style.height = this.frame.offsetHeight;  
   }else{
    this.scroll.style.width = this.getScrollXBound();
    this.scroll.style.height = this.getScrollYBound();

    this.client.style.width = this.frame.clientWidth;
    this.client.style.height = this.frame.clientHeight;

    this.scroll.style.width = this.getScrollXBound();
    this.scroll.style.height = this.getScrollYBound();

    this.client.style.width = this.frame.clientWidth;
    this.client.style.height = this.frame.clientHeight;  
   }
   this.frame.scrollLeft = 0;
  
   var vh = this.getVisibleHeight()+1;      //可见行高
   
	 var inW = this.inpEditWidth,titleH = this.getTitleHeight();
	 var fw = this.getFixedWidth();  //固定列的宽度之和
	 var aw = this.getCellsWidth();  //活动列的宽度之和
	 var x=0,y=0;
	 var insShow = this.options.dgIndicator;
	 //控制指示栏
	 if(insShow){
	   x = inW;
	   this.indicator.style.width = inW;
       this.indicator.style.left = 0;
	   this.indicator.style.visibility = "visible";
       this.indicator.style.top = 0;
	   
	   if(vh>=0) this.indicator.style.height = vh ;

	 }else
	  this.indicator.style.visibility = "hidden";

	 //设置数据区域
	 if(fw>0){
 	  this.fixedCells.style.width = fw+1;
	  this.fixedCells.style.left = x;
	  this.fixedCells.style.top = 0;
	  
	  if(vh>=0) this.fixedCells.style.height = vh;
	  
	  this.fixedCells.style.visibility = "visible";
	  
	  this.totalf.style.left = x;
      this.totalf.style.top = 0;
	  this.totalf.style.width = fw+1;
	 }else
	  this.fixedCells.style.visibility = "hidden";

     this.cells.style.width = aw;
	 this.cells.style.left = x+fw;
	 this.cells.style.top = 0;
	 
	 if(vh>=0) this.cells.style.height = vh;
	 
	 this.cells.style.visibility = "visible";
  
     if(this.totalRow)
  	  this.total.style.visibility = "";
	 else this.total.style.visibility = "hidden"; 
	 this.total.style.width = x+fw+aw;
	 this.total.style.top = this.frame.clientHeight - this.rowHeight;
	 this.total.style.left = 0; 
	 this.total.style.height = this.rowHeight;
	 
     this.totalc.style.width = aw;
	 this.totalc.style.left = x+fw;
	 this.totalc.style.top = 0;
	 this.getVisibleHeight(); //求可见行行高和，并计算可见行数
     this.getRightCol();
 }

 TDBGrid.prototype.htmlTo = function(sHtml){
	this.gridHtml += sHtml;
 }
 //建立列fromCol到toCol的单元格,这些单元格位于区域panel中
 TDBGrid.prototype.createCells = function(fromCol,toCol,afx){

    var gid=0,ngid,gNum=1,isShow = true;
	var nw=0,h,cw,w,sHTML="";

	var rh=this.rowHeight;          //行高
  		
	var th=this.getTitleHeight();   //表头高

	var vh=rh*this.__bufferRow; //可见行高之和
    var resultHTML = "";
	h = 0,nw = 0;
    /*显示列头*/
	this.createMethod("<span style='position:absolute;height:"+th+"px;width:20000px'>");
	this.createMethod("<table id='"+this.name+"_TitleTable'  border='0' cellpadding='0' cellspacing='0' height='100%' style='word-break:break-all;word-wrap:break-word'>");
	
	sHTML = "<tr>";
	
    for(var i=fromCol;i<=toCol;i++){
     var column = this.columns[i];		
     cw = column.width-2;
	 w = cw;
	 gNum = 1;
	 isShow = true;
	 ngid = column.groupID;
	 
	 if(ngid!=0){
	  if(ngid!=gid){
	   for(var j=i+1;j<=toCol;j++)
	    if(this.columns[j].groupID==ngid){
		 w += this.columns[j].width;
		 gNum ++;
		}
		else break;
	  }else
	    isShow = false;  //是组内单元格，不显示
  	 }
	 gid = ngid; 
	 var bfb = this.glPresent+"%";
	 //这是列头的单元格内容
	 if(isShow)
	  if(gid!=0)  //是组头
	   sHTML += "<td colspan="+gNum+" style='cursor:default;background-color:"+column.titleColor+"' width='"+w+
	            "' class='"+column.groupClass+"' height='"+bfb+"' align='"+column.groupAlignMent+"'>"+column.groupCaption+"</td>";
	  else{
  	   var tCaption = (column.isDelCol)? "<img src=\""+column.imageSrc+"\">":column.title.caption;		  
	   sHTML += "<td rowspan=2 style='cursor:default;background-color:"+column.titleColor+"' width='"+w+
	            "' class='"+column.titleClass+"' id='t"+afx+i+"' align='"+column.titleAlignMent+"'><span>"+tCaption+"</span><span></span></td>"; 
	  }
     nw += cw;			 
    }
	sHTML += "</tr><tr>";
	//显示第二行
    for(var i=fromCol;i<=toCol;i++){
	 var column = this.columns[i];		
     cw = column.width-2;
	 w = cw;
	 ngid = column.groupID;
	 
     if(ngid!=0){  //是组头
  	  var tCaption = (column.isDelCol)? "<img src=\""+column.imageSrc+"\">":column.title.caption;	 
      sHTML += "<td rowspan=2 style='cursor:default;background-color:"+column.titleColor+"' width='"+w+
	           "' class='"+column.titleClass+"' id='t"+afx+i+"' align='"+column.titleAlignMent+"'><span>"+tCaption+"</span><span></span></td>"; 
	 }
     nw += cw;			 
    }
	
    this.createMethod(sHTML);	
	this.createMethod("</tr></table></span>");

	/*显示各单元格的数据 */
	nw = -1;
	var s,sa,scursor;

	var  ss= new Array(toCol-fromCol+1);
	
	for(var j=fromCol;j<=toCol;j++){
	 var column = this.columns[j];		
     w = column.width;
	 sa = "";
	 
	 if(column.imageShow>-1){
		 
	   if(column.imageWidth<0)
	     sa = " width='100%'";
	   else	if(column.imageWidth>0)
	         sa = " width='"+column.imageWidth+"'";

	   if(column.imageHeight<0)
	     sa += " height='100%'";
	   else	if(column.imageHeight>0)
	         sa += " height='"+column.imageHeight+"'";

	   s = "<img src='' border=0"+sa+">";
	 }else
  	   if(column.checkBox){ 
	     sa = "left:"+(w-14)/2+"px;";
	     s = "<input type='checkbox' class='dbgridccbox' style='"+sa+"'>";	  
	   }else 
	     if(column.isLink&&column.linkStyle==1)
	       s = "<a href='#'></a>";
	     else  
	       if(column.checkBoxStyle) s = "<span></span>";
	       else  s = "<span></span>";
	 
	 if(column.cursor!="") scursor = "cursor:"+column.cursor;
	 else scursor = "";
	 
	 var cellc = (column.cellclass=="")? this.cellclass:column.cellclass;
	 
     ss[j-fromCol] = "<span class='"+cellc+"' style='width:"+(w)+"px;height:"+(rh+1)+"px;left:"+nw+
	                 "px;border-right:1px solid "+this.gridLineColor+";"+scursor+"' >"+s+"</span>";
 	 nw += w;
	
	}
	
	h = th; 
	sHTML = ss.join("");

    for(var i=0;i<this.__bufferRow;i++){
		
	 this.createMethod("<span id='"+afx+"_div"+i+"' style='position:absolute;border:1px solid "+this.gridLineColor+";top:"+(h)+"px;height:"+rh+"px;width:200000px'>");	
	 this.createMethod(sHTML);
	 this.createMethod("</span>");
     h += rh;
    }
 }

 TDBGrid.prototype.createInp = function(){
	var nw=0,h,w;
	var rh=this.rowHeight;          //行高
	var th=this.getTitleHeight();   //表头高
	var vh=rh*this.__bufferRow; //可见行高之和
	//alert(vh);
    /*显示指示列*/
	 nw = this.inpEditWidth;
	 //显示竖线
 	 sHtml = "";//"<v:line from='0,0' to='0,"+vh+"' strokeline='1px'/>";
	 //显示横线
	 //sHtml = "<span></span>";
     this.createMethod("<table  border='0' cellpadding='0' cellspacing='0' width='100%'>");
	 this.createMethod("<tr><td height='"+th+"' class='"+this.titleClass+"'>&nbsp;</td></tr>");
	 this.createMethod("<tr><td height='1'></td></tr>");	 
	 //document.write("<span  class='titlecell' style='position:absolute;width:"+nw+"px;height:"+(th)+"px;'></span>");

	 h = th+1;
	 for(var i=0;i<this.__bufferRow;i++){
     // document.write("<span class='fixedcell' id='"+this.name+"iCells_"+i+"' style='position:absolute;height:"+
	 //				 rh+"px;top:"+h+"px;width:"+nw+"px;'></span>");
	  this.createMethod("<tr><td style='cursor:default;' height='"+rh+"' id='"+this.name+"iCells_"+i+"' class='"+
						 this.fixedClass+"' align='"+this.inpAlignMent+"'>&nbsp;</td></tr>");
      h += rh;
	 }
	 this.createMethod("</table>");
 }
 //建立列fromCol到toCol的合计单元格,这些单元格位于区域panel中
 TDBGrid.prototype.createTotalCells = function(fromCol,toCol,afx){
    var sHTML="",w,nw=0,tid=0,isVisible="";

	var rh = Math.floor(this.rowHeight*this.totalLinebs);          //行高
    this.createMethod("<span style='height:"+rh+"px;width:200000px;border-top:1px solid "+this.gridLineColor+";border-bottom:1px solid "+this.gridLineColor+";'>");	
    //rh-=2; 
	
    for(var i=fromCol;i<=toCol;i++){
	 nTid = this.columns[i].totalID;
	 w = this.columns[i].width;
	 isVisible = "";
	 
	 if(nTid!=0){
	  if(nTid!=tid){
	   for(var j=i+1;j<=toCol;j++)
	    if(this.columns[j].totalID==nTid)
		 w += this.columns[j].width;
		else break;
	  }else
	    isVisible = "hidden";
	 }
	 tid = nTid;
		   
	 //这是合计的单元格
	 sHTML += "<span class='totalcell' style='width:"+w+"px;height:"+rh+"px;left:"+nw+"px;visibility:"+isVisible+"'></span>";

	 nw += this.columns[i].width;
    }
    this.createMethod(sHTML);	
	this.createMethod("</span>");
 }
 
 TDBGrid.prototype.bandEvent = function(){
	
	this.frame = document.getElementById(this.name+"_Frame");
	this.frame.onscroll = this.Scroll;	
	this.frame.grid = this;
	this.scroll = document.getElementById(this.name+"_Scroll");

    var checkclick = null;
	var checkblur = null;
	 
    for(var i=this.fixedCol;i<this.items.count;i++){
  	  this.columns[i].tCell = document.getElementById("t"+this.name+"a"+i);
	  if(this.columns[i].isDelCol)
	    this.columns[i].tCell.childNodes[0].onclick = this.doTitleCellClick;
	}
     var rowdiv,cell;
 	 for(var i=0;i<this.__bufferRow;i++){
	  rowdiv = document.getElementById(this.name+"a_div"+i);
	  //显示各单元格的数据
  	  for(var j=this.fixedCol,k=0;j<this.items.count;j++,k++){
		  
	   cell = rowdiv.childNodes[k];
	   
       if(this.columns[j].checkBox){
   	    checkblur = null;
		if(this.columns[j].readOnly){
		  cell.childNodes[0].disabled = true;
		  checkclick = null;
		}else checkclick = this.doCheckBoxClick;
	   }
	   else{
		checkclick = this.doCellClick;
        checkblur = null;
	   }

	   this.columns[j].cells[i] = cell;
	   
       cell.childNodes[0].onclick = checkclick;
	   cell.childNodes[0].onblur = checkblur;
	   cell.childNodes[0].fieldName = this.columns[j].fieldName;
	  }
	 }	
	 
	if(this.fixedCol>0){
      for(var i=0;i<this.fixedCol;i++){
   	   this.columns[i].tCell = document.getElementById("t"+this.name+"b"+i);
	   if(this.columns[i].isDelCol)
	     this.columns[i].tCell.childNodes[0].onclick = this.doTitleCellClick;
	  }
 	  for(var i=0;i<this.__bufferRow;i++){

	   rowdiv = document.getElementById(this.name+"b_div"+i);
	   //显示各单元格的数据
  	   for(var j=0,k=0;j<this.fixedCol;j++,k++){
	    cell = rowdiv.childNodes[k];
        if(this.columns[j].checkBox){
 		 if(this.columns[j].readOnly){
		  cell.childNodes[0].disabled = true;
		  checkclick = null;
		 }else checkclick = this.doCheckBoxClick;
		}
	    else checkclick = this.doCellClick;
	    this.columns[j].cells[i] = cell;
	   
	    cell.childNodes[0].onclick=checkclick;
	
	    cell.childNodes[0].fieldName = this.columns[j].fieldName;
	   }
	  }
	}	 
	
	for(var i=0;i<this.__bufferRow;i++)
	  this.iCells[i] = document.getElementById(this.name+"iCells_"+i);
	
	this.client = document.getElementById(this.name+"_Client");
	this.client.grid = this;

	this.client.onmousedown = this.mouseDown;
	this.client.onmouseup = this.mouseUp;
	this.client.onmousemove = this.mouseMove;	
	
	this.client.onkeydown = this.keyDown;
	
	this.client.ondblclick = this.doDblClick;
 

	this.cells = document.getElementById(this.name+"_Cells");
	this.cells.grid = this;

	this.fixedCells = document.getElementById(this.name+"_FixedCells");
	this.fixedCells.grid = this;

	this.indicator = document.getElementById(this.name+"_Indicator");
	this.indicator.grid = this;
	
    /*处理合计行结构*/
	this.total = document.getElementById(this.name+"_Total");

	this.total.grid = this;
	this.totalf = this.total.childNodes[1];
	this.totalc = this.total.childNodes[2];	
	
	var cf = this.totalf.childNodes[0].childNodes;
	var cc = this.totalc.childNodes[0].childNodes;
	
    for(var j=0;j<this.fixedCol;j++){
	 this.columns[j].sCell = cf[j];   
	 if(!this.columns[j].totalShow)
	  cf[j].innerText = this.columns[j].totalCaption;
	}
	 
    for(var j=this.fixedCol;j<this.items.count;j++){
	 this.columns[j].sCell = cc[j-this.fixedCol];   
	 if(!this.columns[j].totalShow)
	  this.columns[j].sCell.innerText = this.columns[j].totalCaption;
	}	

    this.edit = document.getElementById(this.name+"_Edit");
    this.edit.grid = this;
	
   
	this.inpEdit = new TInplaceEdit(document.getElementById(this.name+"_InpEdit"),
									 document.getElementById(this.name+"_InpPw"),						 
									 document.getElementById(this.name+"_Select"));

    this.editing = !this.readOnly;
	this.paintFirst = false;	
//	var date2=new Date();
//	alert(date2.getTime()-date1.getTime());
   //设置合计行格式
	var cFont = null;
	var cell = null;
	
	this.columnCount = this.items.count;
	for(var j=0;j<this.items.count;j++){
     cFont = this.columns[j].font;
	 cell = this.columns[j].sCell;  //合计行
     cell.style.color = cFont.color;
     cell.style.textAlign = this.columns[j].totalAlignMent;
	 cell.style.fontFamily = cFont.name;
	 cell.style.fontSize = cFont.size;	  
	 cell.style.fontStyle = cFont.fontStyle;
     cell.style.fontWeight = cFont.fontWeight;
     cell.style.textDecoration = cFont.textDecoration; 
	}	
	
	this.moveDiv = document.getElementById(this.name+"_Move");
	this.moveDiv.grid = this;
	this.isFirstCreate = false;
 }
 //建立表格框架，生成表格各区域
 TDBGrid.prototype.createGrid = function(bufferRow){
	this.titleHeight = Math.floor(this.rowHeight*this.titleLinebs);
    this.col = 0;
	this.row = 0;

	if(!this.paintFirst) return;
  
    if(this.hasDelCol&&!this.readOnly){
	  this.addColumn({fieldName:"",width:24,isDelCol:true,readOnly:true,
					  imageShow:0,imageSrc:this.delImageSrc}); 
	}
	
	if(typeof(bufferRow)!="undefined"){
	 bufferRow = (bufferRow<10)?10:bufferRow;
	 bufferRow = (bufferRow>80)?80:bufferRow;
 	 this.__bufferRow = bufferRow;	 
	}
	this.gridHtml = "";
   
    if(this.presentWidth)  this.adjustColumnWidth();
	//生成包含滚动条的框架
	var titleHtml = "";
	var his = "";
	if(this.hiddenScroll)
	 his = "visibility:hidden";
	 
	var w=this.width-1,h=this.height-1;
	this.createMethod("<div style='"+his+";z-index:9;overflow:auto;position:absolute;width:"+
	               100+"%;height:"+100+"%;' id='"+this.name+"_Frame'>"+
			       "<div style='' id='"+this.name+"_Scroll'></div></div>");

	this.createMethod("<div style='z-index:9;overflow:hidden;position:absolute;' id='"+this.name+"_Client'>");

    this.createMethod("<div style='border:0px solid;z-index:11;overflow:hidden;position:absolute;' id='"+this.name+"_Cells'>");
  	 this.createCells(this.fixedCol,this.items.count-1,this.name+"a");
	this.createMethod("</div>");	 

	//固定数据区
	this.createMethod("<div style='z-index:12;overflow:hidden;position:absolute;' id='"+this.name+"_FixedCells'>");
 	if(this.fixedCol>0){
      this.createCells(0,this.fixedCol-1,this.name+"b");
	}
	 
	this.createMethod("</div>");

    this.createMethod("<div style='border:1px solid "+_dbgrid_defInpBorderColor+";z-index:13;overflow:hidden;position:absolute;visibility:hidden;' id='"+this.name+"_Edit'>"+
  				   "<input type='text' style='position:relative;padding: 2px 2px 0px 2px;border:0px' id='"+this.name+"_InpEdit'>"+
				   "<input type='button'  id='"+this.name+"_Button' value='…' style='position:relative;"+
	               "border-left:1px solid "+_dbgrid_defInpButtonColorLT+";border-top:1px solid "+_dbgrid_defInpButtonColorLT+
				   ";border-right:1px solid "+_dbgrid_defInpButtonColorRB+";border-bottom:1px solid "+_dbgrid_defInpButtonColorRB+"'>"+
				   "<select id='"+this.name+"_Select' style='font-size:12px;margin: -2px -1px -1px -2px;position:relative;'></select>"+
				   "<input type='password' style='padding: 0px 2px 0px 2px;border:0px' id='"+this.name+"_InpPw'></div>");
				
	this.createMethod("<div style='z-index:15;overflow:hidden;position:absolute;' id='"+this.name+"_Indicator'>");

	this.createInp();
	
	this.createMethod("</div>");

    //合计行
	var ih = this.rowHeight;
	var iw = this.inpEditWidth;
	this.createMethod("<div style='z-index:10;overflow:hidden;position:absolute' id='"+this.name+"_Total'>");
	
	 this.createMethod("<span style='position:absolute;z-index:10;border-top:1px solid "+_dbgrid_defFixedTopColor+
					    ";width:"+iw+"px;height:"+ih+"px;left:0px;'>");
	 this.createMethod("<span class='"+this.fixedClass+"' style='width:"+iw+"px;height:"+(ih-1)+"px;left:0px;'></span>");
	 this.createMethod("</span>");
	 
     this.createMethod("<span style='z-index:10;overflow:hidden;position:absolute' id='"+this.name+"_Totalf'>");
 	  this.createTotalCells(0,this.fixedCol-1,this.name+"_Totalf'>");
	 this.createMethod("</span>"); 
	 this.createMethod("<span style='z-index:9;overflow:hidden;position:absolute' id='"+this.name+"_Totalc'>");
 	  this.createTotalCells(this.fixedCol,this.items.count-1,this.name+"_Totalc'>");
	 this.createMethod("</span>"); 
	// this.createMethod("<span>&nbsp;</span>"); 
	 this.createMethod("&nbsp;&nbsp;&nbsp;");
	this.createMethod("</div>");

	this.createMethod("<div style='z-index:20;filter: alpha(opacity=60); opacity:0.6;"+
					  "overflow:hidden;position:absolute;width:100%;height:"+
					  this.rowHeight+"px;display:none' id='"+this.name+"_Move'>");

    this.createMethod("</div>");

    if(this.createToOwner)
  	 this.owner.innerHTML = this.gridHtml;
    this.bandEvent();
 }
 
 //构造表格
 TDBGrid.prototype.createGridTo = function(bufferRow){

    this.createToOwner = true; 
	this.createMethod = this.htmlTo; 
    this.paintFirst = true;
	this.createGrid(bufferRow);
	//this.paint();
 }
 
 //显示表格
 TDBGrid.prototype.paint = function(){
  this.adjustPosition();  
  if(this.columns.length>0){
	if(this.dataset!=null&&this.inpFieldName!=null)
	  this.inpField = this.dataset.fieldByName[this.inpFieldName];
	else
	  this.inpField = null;
	  
    this.drawCells();
    this.drawTotalCells();    
  
    if(!this.isPaint&&this.showInputMark)
     for(var i=0;i<this.columns.length;i++){
       var field = this.columns[i].field;   
       if(field!=null&&!field.isNull){
 	     this.columns[i].tCell.innerHTML = 
	       this.columns[i].tCell.innerHTML+
		   "<span style='color:"+this.inputMarkColor+"'>"+this.inputMark+"</span>";
	   }
     }
    this.isPaint = true;  
  }
 }
 
 TDBGrid.prototype.reFresh = function(){
   this.rowCount = this.dataset.getRecordCount();
   if(this.rowCount==0) this.rowCount = 1;
   this.row = 0;   
   this.topRow = 0;
   this.inpEdit.setVisible("hidden");
   this.adjustPosition();	
   this.drawCells();
   this.drawTotalCells();       
 }
 
 //设置表格关联的数据源
 TDBGrid.prototype.setDataSource=function(datasource){
  //if(this.dataSource==datasource) return;
  
  if(datasource==null){
    if(this.dataSource!=null)
	  this.dataSource.removeObject(this);
    this.dataset = null;
  }else{
    if(this.dataSource!=datasource){
      if(this.dataSource!=null&&this.dataSource!=datasource)  
        this.dataSource.removeObject(this);
      this.dataSource = datasource;	
      datasource.addObject(this);	
      this.dataset = datasource.dbTable;
    }
	if(datasource.OnDataChange!=null)
	  datasource.OnDataChange(datasource,datasource.dbTable,null);
  }
  
  if(this.dataset==null){
   this.fDataLink.dataset = null;
   this.fDataLink.active = false;
   for(var i=0;i<this.items.count;i++)
    this.columns[i].field = null;
   this.rowCount = 1;   
  }else{
	  
   this.fDataLink.dataset = this.dataset;
   this.fDataLink.active = true;
   var field = null;
   
   for(var i=0;i<this.items.count;i++){
   
   this.columns[i].field = this.dataset.fieldByName[this.columns[i].fieldName];
	
	if(this.columns[i].field==null)
	 this.columns[i].field = this.dataset.fieldByShortName[this.columns[i].fieldName];
	
	if(this.columns[i].checkBox)
	 for(var j=0;j<this.__bufferRow;j++){
	  this.columns[i].cells[j].childNodes[0].disabled = this.dataset.readOnly||this.columns[i].readOnly;
	 }
	
	field = this.columns[i].field;
	
	if(field!=null){
	 if(this.columns[i].alignment==taDefault)
 	  switch(parseInt(field.dataType)){
	   case 2:
	   case 3:
	   case 4:
	   case 5:this.columns[i].alignment = taRight;
	           break;
	   case 91:
	   case 92:this.columns[i].alignment = taCenter;
	  }
	  

	 if(this.columns[i].totalAlignMent==taDefault){
	  this.columns[i].totalAlignMent = this.columns[i].alignment;
	  this.columns[i].sCell.style.textAlign = this.columns[i].totalAlignMent;
	 }
	 
	 if(this.columns[i].title.caption=="Column"){
	  this.columns[i].title.caption = field.displayLabel; 
	  if(this.columns[i].tCell!=null)
	   this.columns[i].setCaption(field.displayLabel);  
	 }
	 
	 if(this.columns[i].buttonStyle==cbsOpen||this.columns[i].lexiconID!="")
		  field.OnChangeInnerCall = this.codeFieldChange;
		  
	}
   }
   this.rowCount = this.dataset.pData.recordCount;	
  }
  
  this.adjustPosition();	

  var bMark = this.dataset==null||this.dataset.isEmpty();
  for(var i=0;i<this.columns.length;i++)
   if(this.columns[i].checkBox)
    this.columns[i].cells[0].childNodes[0].disabled = bMark||this.columns[i].readOnly;
  this.paint();
 }

 //根据记录集位置调整表格行号,nRecNo-记录号
 TDBGrid.prototype.adjustOrigRow=function(nRecNo){
  //aRow为当前绝对行
  var aRow = this.row+this.topRow+1;
  if((nRow<0&&aRow==0)||(nRow>0&&aRow==this.rowCount)) return;
  //向上
  if(this.dataset.post()){
   if(nRow<0){
    if(this.row==0)
     this.topRow--;
    else this.row += nRow;
    this.dataset.prior();
   }else{
    if(this.row==this.visibleRow-1)
     this.topRow++;
    else this.row += nRow;
	this.dataset.Next();
   }
   this.drawCells();
  }
 }

 //数据集数据变化时,调用表格的dataChange方法，刷新表格数据显示
 TDBGrid.prototype.dataChange = function(ds,dSet,field,att){

  if(this.isMoveRow&&att!="post"&&att!="sum") return;
  
  this.lockScroll = true;
  
  if(att=="open"){
   this.rowCount = dSet.getRecordCount();

   if(this.rowCount==0) this.rowCount = 1;
   var bMark = dSet.isEmpty();

   for(var i=0;i<this.columns.length;i++)
	if(this.columns[i].checkBox){
	 this.columns[i].cells[0].childNodes[0].disabled = bMark||dSet.readOnly||this.columns[i].readOnly;
	}
	  
   this.row = 0;   
   this.topRow = 0;

   if(this.columns.length>0){
    this.inpEdit.setVisible("hidden");
    this.adjustPosition();	
  
    this.drawCells();
   }
   this.lockScroll = false;
   return;
  }
  //响应合计行
  if(att=="sum"){
   this.drawTotalCells();
   this.lockScroll = false;   
   return;
  }
  
  if(dSet==null){
	this.dataset = null;
	this.rowCount = 1;
    this.row = 0;	
	this.adjustPosition();	
	this.drawCells();
    for(var i=0;i<this.columns.length;i++)
	 if(this.columns[i].checkBox)
	  this.columns[i].cells[0].childNodes[0].disabled = true;
	
  }else{
   var n = dSet.getRecordCount();
   if(n==1||n!=this.rowCount){
	var bMark = n==0;    
    for(var i=0;i<this.columns.length;i++)
	 if(this.columns[i].checkBox){
      this.columns[i].cells[this.row].childNodes[0].disabled = bMark||dSet.readOnly||this.columns[i].readOnly;
	 }
   }
    
   if(n<this.rowCount|| //记录被删除或在中间插入 ||dSet.pData.absolutePosition<dSet.pData.recordCount
	  (n>this.rowCount&&dSet.pData.absolutePosition<dSet.pData.recordCount)){ 
   
    this.rowCount = (n==0)?1:n;
	this.adjustPosition();	
	var nRow = dSet.pData.absolutePosition - 1;
    if(this.rowCount<=this.topRow+this.visibleRow){
	 this.topRow = this.rowCount-this.visibleRow;	 
  	 this.row = nRow-this.topRow;	 
    }	
	this.col = 0;
	//alert(nRow);
    this.drawCells();	
    this.lockScroll = false;	
	return;
	
   }
   else if(n>this.rowCount){  //增加记录
    this.rowCount = n;
	this.adjustPosition();	
   }

   if(field==null){  //字段值无变化
    this.moveOrigRow(dSet.pData.absolutePosition-1);
	if(att=="new"||att=="post") this.drawRow();
   }
   else{
	for(var i=0;i<this.columns.length;i++)
	 if(this.columns[i].fieldName==field.fieldName){

	  this.drawCell(i,this.row);
	 }
   }
  }
  this.lockScroll = false;  
 }

 TDBGrid.prototype.canFirstInsert = function(){
  return this.fDataLink.canFirstInsert();
 }
 
 /*编辑框数据回填表格*/
 TDBGrid.prototype.updateData = function(grid,value,col,row){
  var result = true;	 
  var dset = grid.dataset.pData;
  var fieldName = grid.columns[col].fieldName;
  if(fieldName!=""){
   this.isUpdateData = true;		
  
   result = grid.fDataLink.updateData(fieldName,value);

   if(!result){
	var v = grid.dataset.getFieldValue(fieldName);
	grid.inpEdit.setValue(v,v);
   }else
    this.drawCell(col,row);
  
   this.isUpdateData = false;
  }
  return result;
 }

/*编辑框处理*/
 TDBGrid.prototype.hideEditor = function(){
   this.inpEdit.setVisible("hidden");
 }

 TDBGrid.prototype.showEditor = function(){
   this.inpEdit.setVisible("");
 }

 TDBGrid.prototype.buttonClick = function(grid,column,button){
   if(this.OnButtonClick!=null)
     this.OnButtonClick(this,this.columns[this.col]);
   else 
     this.doInputCRKeyDown(this.columns[this.col],"",button.parentNode,true);
 }

 TDBGrid.prototype.doInputCRKeyDown = function(column,value,activeControl,awOpen){
   var result = crContinue; 
   var field = column.field;	
   
   if(field!=null&&!field.OnChanging){
     field.awOpen = awOpen;
	 field.OnChanging = true;
     _$ActiveControl = activeControl;

     if(this.OnInputCRKeyDown!=null)
	   result = this.OnInputCRKeyDown(this,column,value);
     else{
					       
	   if(this.codeFieldChange!=null)
	     if(column.buttonStyle==cbsOpen||column.lexiconID!=""){
			 
           if(value!=field.priorValue||field.awOpen||value==""){
			 //alert("1"+field.fieldName);  
             field.sField.value = value;
			 var isClear = !field.awOpen&&field.isNull&&value==""&&field.priorValue!="";
             if(this.codeFieldChange(field))
 	           result = crVChanged;
 	         else result = crAbort; 
           }
		 }
     }   
	 field.awOpen = false;	
	 field.OnChanging = false;
   }
   return result; 
 }
 
 //设置表格获取焦点
 TDBGrid.prototype.setFocus=function(toFirst){
  this.owner.focus();	 
  if(toFirst||this.columns[this.col].readOnly)
   this.moveOrigCol(0);
   
  if(!this.readOnly){	 
   this.inpEdit.setRects(this.getCellRect(this.col,this.row),
					      this.col,this.row,
						  this.columns[this.col].field);
   this.inpEdit.setFocus();
  }
 }

 //设置表格获取焦点
 TDBGrid.prototype.setColFocus=function(nCol){
  this.moveOrigCol(nCol);
  this.setFocus(false);
 }

 //通过字段名获取列对象
 TDBGrid.prototype.columnByFieldName=function(fieldName){
  var column = null;
  for(var i=0;i<this.items.count;i++)
   if(this.columns[i].fieldName==fieldName){
	column = this.columns[i];
	break;
   }
  return column; 
 }

 TDBGrid.prototype.setVisible=function(value){
   if(this.visible!=value){
	this.visible = value;
	if(this.visible)
	 this.reFresh();
   }
 }

 TDBGrid.prototype.adjustColumn = function(nRow,fIndex,nCount){
   var colCount = this.columns.length;
   var i = 1, w = this.columns[fIndex].width;
   while(i<nCount&&(fIndex+i)<colCount){
    w += this.columns[fIndex+i].width;
	this.columns[fIndex+i].cells[nRow].style.visibility = "hidden";
	i++;
   }
   this.columns[fIndex].cells[nRow].style.width = w;	
 }
 
 TDBGrid.prototype.setInpColAtt = function(fieldName,formula,inpStr){
   this.inpSetting = fieldName!=""&&formula!=""&&inpStr!="";
   if(this.inpSetting){
	this.inpFieldName = fieldName;
	this.inpFormula = formula;
	this.inpStr = inpStr;
   }
 }

 TDBGrid.prototype.addColumn = function(props){
   return this.items.addEx(props);
 }

 TDBGrid.prototype.setPropertys=function(props){
   for(var i in props)
     this[i] = props[i];
   props = null;
 }
/**/