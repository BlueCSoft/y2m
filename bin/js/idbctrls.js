
TDBText.prototype.dataSource = null;
TDBText.prototype.dataset = null;
TDBText.prototype.field = null;
TDBText.prototype.fieldName = "";
TDBText.prototype.OnClick = null;

function TDBText(element,fieldName,ubgColor){
  this.Class = element.tagName.toUpperCase();
  this.NotFocus = true;
  this.readOnly = true;
  this.element = element;
  this.element.owner = this;  
  this.element.onclick = this.doClick;
  if(this.Class=="INPUT")
    this.element.readOnly = true;
  
  this.fieldName = fieldName;
  this.userBgColor = (typeof(ubgColor)=="undefined")?false:ubgColor;
  __VCL.add(this);  
}

TDBText.prototype.free = function(){
  this.element.owner = null;
  this.element.onclick = null;
  this.element = null;
}

TDBText.prototype.doClick = function(e){
  var src = event.srcElement;
  var edit = src.owner;
  if(edit.OnClick!=null) edit.OnClick(this);
}

TDBText.prototype.setDataSource = function(dataSource){
  this.dataSource = dataSource;
  if(this.dataSource==null)
    this.dataset = null
  else{
    this.dataset = this.dataSource.dbTable;
    dataSource.addObject(this);
  }
  this.setFieldName(this.fieldName);
}

TDBText.prototype.fromString = function(value){
  value = value+"";
 
  var nlen = value.length;

  if(nlen<6)
    value = value+stringOfChar(6-nlen,"FFFFFF");
  
  value = value.substr(0,6);	
  this.red   = parseInt("0x" + value.substring(0, 2), 16);
  this.green = parseInt("0x" + value.substring(2, 4), 16);
  this.blue  = parseInt("0x" + value.substring(4), 16);
  return value.substr(0,6);		
}


TDBText.prototype.isLight = function() {
  return (
		0.213 * this.red +
		0.715 * this.green +
		0.072 * this.blue >
		255 / 2
  );
}

TDBText.prototype.fontColor = function() {
  return (this.isLight())? "#000":"#fff";
}

TDBText.prototype.setElementColor = function(colorValue){
  $(this.element).css("backgroundColor","#"+colorValue); 	
  $(this.element).css("color",this.fontColor());
}

TDBText.prototype.setFieldName = function(fieldName){
  fieldName = fieldName.toUpperCase();
  this.fieldName = fieldName;
  
  if(this.dataSource!=null&&this.dataSource.dbTable!=null){
   var dSet = this.dataSource.dbTable;
   if(typeof(dSet.fieldByName[fieldName])!="undefined"){
	 this.field = dSet.fieldByName[fieldName];
     if(this.Class=="INPUT"){
       this.element.value = this.field.getDisplayText();
	   this.element.readOnly = this.element.readOnly||this.dataSource.dbTable.readOnly;	 
	   if(this.userBgColor)
	      this.setElementColor(this.fromString(this.element.value)); 
	 }else{
	   this.element.innerText = this.field.getDisplayText();
	   
	   if(this.userBgColor)
         this.setElementColor(this.fromString(this.element.innerText)); 
	 }
   }else{
	 this.field = null;
     if(this.Class=="INPUT"){
       this.element.value = "";  
	   this.element.maxlength = "";
	 }else  
       this.element.innerText = "";
	 if(this.userBgColor)
	   $(this.element).css("background","");     
   }
  }
}

TDBText.prototype.dataChange = function(ds,dSet,field){
  if(dSet==null){ //断开和数据集的连接	
   this.dataset = null;
   this.field = null;
   if(this.Class=="INPUT")
     this.element.value = "";
   else
     this.element.innerText = "";
   if(this.userBgColor)
	 $(this.element).css("background","");     
  }else{
   if(this.field==null)
    this.setFieldName(this.fieldName);
	  
   if(this.field!=null){
	 if(this.Class=="INPUT"){
       this.element.value = this.field.getDisplayText(); 
	   if(this.userBgColor)
	      this.setElementColor(this.fromString(this.element.value)); 
	 }else{ 
       this.element.innerText = this.field.getDisplayText();
	
	   if(this.userBgColor)
	      this.setElementColor(this.fromString(this.element.innerText)); 
	 }
   }
  }
}

TDBText.prototype.equals = function(sender){
    return this.element == sender;
}

TDBText.prototype.setDisabled =function(disabled){
}

TDBImage.prototype.dataSource = null;
TDBImage.prototype.dataset = null;
TDBImage.prototype.field = null;
TDBImage.prototype.fieldName = "";
TDBImage.prototype.OnClick = null;

function TDBImage(element,fieldName,fPath,fDefaultPic){
  this.Class = "TDBImage";
  this.NotFocus = true;
  this.element = element;
  this.element.owner = this;  
  this.fieldName = fieldName.toUpperCase();
  this.fPath = (typeof(fPath)=="undefined")?"":fPath;
  this.fDefaultPic = (typeof(fDefaultPic)=="undefined")?"":fDefaultPic;
  __VCL.add(this);  
}

TDBImage.prototype.free = function(){
  this.element.owner = null;
  this.element = null;
}

TDBImage.prototype.doClick = function(e){
 var src = event.srcElement;
 var edit = src.owner;
 if(src.OnClick!=null) src.OnClick();
 if(edit.OnClick!=null) edit.OnClick();
}

TDBImage.prototype.setDataSource = function(dataSource){
  this.dataSource = dataSource;
  if(this.dataSource==null)
   this.dataset = null
  else{
   this.dataset = this.dataSource.dbTable;
   dataSource.addObject(this);
  }
  this.setFieldName(this.fieldName);
}

TDBImage.prototype.dataChange = function(ds,dSet,field){
  if(dSet==null){ //断开和数据集的连接	
   this.dataset = null;
   this.field = null;
   this.element.src = this.fPath+this.fDefaultPic;
  }else{
   if(this.field==null)
     this.setFieldName(this.fieldName);
	  
   if(this.field!=null){
	 this.element.src = this.fDefaultPic;
     this.element.src = this.fPath+((this.field.$()=="")? this.fDefaultPic:this.field.$());
   }
  }
}

TDBImage.prototype.setFieldName = function(fieldName){
  this.fieldName = fieldName;
  if(this.dataSource!=null&&this.dataSource.dbTable!=null){
   var dSet = this.dataSource.dbTable;
   if(typeof(dSet.fieldByName[fieldName])!="undefined"){
	 this.field = dSet.fieldByName[fieldName];
     this.element.src = this.fPath+((this.field.$()=="")? this.fDefaultPic:this.field.$());
   }else{
	 this.field = null;
     this.element.src = this.fPath+this.fDefaultPic;
   }
  }
}

TDBImage.prototype.equals = function(sender){
    return this.element == sender;
}

/*TDBEdit,数据编辑控件*/
$charCase = {ecNormal:0,ecLowerCase:1,ecUpperCase:2};

TDBEdit.prototype.dataSource = null;
TDBEdit.prototype.dataset = null;
TDBEdit.prototype.field = null;
TDBEdit.prototype.fieldName = "";
TDBEdit.prototype.charCase = $charCase.ecNormal; 
TDBEdit.prototype.OnKeyDown = null;

function TDBEdit(element,fieldName,isReadOnly,colorctrl){
  this.Class = element.tagName.toUpperCase();
  this.element = element;
  this.element.owner = this;  
  this.element.onkeyup = this.doKeyUp;
  this.oldOnKeyDown = this.element.onkeydown;
  this.element.onkeydown = this.doKeyDown;
  
  this.oldOnBlur = this.element.onblur;
  this.element.onblur = this.doBlur;
  this.element.onchange = this.doChange;
  this.element.onafterpaste = this.doPaste;
  this.element.onpaste = this.doPaste;
  this.isDateEdit = false;
  this.isUpdateData = false;
  this.isColorCtrl = typeof(colorctrl)!="undefined"&&colorctrl;

  this.fieldName = fieldName.toUpperCase();  
  
  var isRO = typeof(isReadOnly)!="undefined"&&isReadOnly;
  this.element.readOnly = element.className=="textreadonly"||this.element.readOnly||isRO;
  this.readOnly = this.element.readOnly;						   
  if(this.element.readOnly)
    this.element.blur();
  __VCL.add(this);    
}

TDBEdit.prototype.free = function(){
  this.element.owner = null;
  this.element.onkeyup = null;
  this.element.onkeydown = null;
  this.element.onchange = null;
  this.element = null;
}

TDBEdit.prototype.fromString = function(value){
  value = value+"";
 
  var nlen = value.length;

  if(nlen<6)
    value = value+stringOfChar(6-nlen,"FFFFFF");
  
  value = value.substr(0,6);	
  this.red   = parseInt("0x" + value.substring(0, 2), 16);
  this.green = parseInt("0x" + value.substring(2, 4), 16);
  this.blue  = parseInt("0x" + value.substring(4), 16);
  return value.substr(0,6);		
}

TDBEdit.prototype.isLight = function() {
  return (
		0.213 * this.red +
		0.715 * this.green +
		0.072 * this.blue >
		255 / 2
  );
}

TDBEdit.prototype.fontColor = function() {
  return (this.isLight())? "#000":"#fff";
}

TDBEdit.prototype.setElementColor = function(colorValue){
  $(this.element).css("backgroundColor","#"+colorValue); 	
  $(this.element).css("color", this.fontColor());
}

TDBEdit.prototype.dataChange = function(ds,dSet,field){
  if(dSet==null){ //断开和数据集的连接	
    this.dataset = null;
    this.field = null;
    this.element.value = "";
  }else{
    if(this.field==null)
      this.setFieldName(this.fieldName);  
    if(this.field!=null&&(!this.isUpdateData||this.isSetValue)){  //||this.element.value!=this.field.getDisplayText()))
      $(this.element).val(this.field.getDisplayText());
	  if(this.isColorCtrl)
	    this.setElementColor(this.fromString(this.element.value)); 
	  this.element.readOnly = this.readOnly||dSet.readOnly;	
	}
  }
}

//更新数据
TDBEdit.prototype.updateData = function(){
 var result = true;	 
 if(this.field.sField!=null){
  var dSet = this.dataSource.dbTable;	
  this.isUpdateData = true;
  //校验值 
  result = dSet.validateWithValue(this.fieldName,this.element.value); 

  if(result)
   dSet.innersetFieldValue(this.fieldName,this.element.value);
  
  if(this.field.displayFormat!=""){
    var value = this.field.getDisplayText();
	if(value!=this.element.value){
      $(this.element).val(value);
	  if(this.isColorCtrl)
	    this.setElementColor(this.fromString(this.element.value));   
	}
  }
  
  this.isUpdateData = false;
 }
 return result;
}
//TDataSource回调
TDBEdit.prototype.dsUpdateData = function(){
  return this.updateData(); 	 
}

TDBEdit.prototype.setFieldName = function(fieldName){
  this.fieldName = fieldName;
  if(this.dataSource!=null&&this.dataSource.dbTable!=null){
   var dSet = this.dataSource.dbTable;
   if(typeof(dSet.fieldByName[fieldName])!="undefined"){
	   
	 this.field = dSet.fieldByName[fieldName];
	 

     this.element.value = this.field.getDisplayText();
	  if(this.isColorCtrl)
	    this.setElementColor(this.fromString(this.element.value));  
		
	 this.element.readOnly = this.readOnly||this.dataSource.dbTable.readOnly;	 
   }else{

	this.field = null;
    this.element.value = "";
	if(this.isColorCtrl)
	  this.setElementColor(this.fromString(this.element.value)); 
		
	this.element.maxlength = "";
   }
  }
}

TDBEdit.prototype.setDataSource = function(dataSource){
  this.dataSource = dataSource;
  if(this.dataSource==null)
   this.dataset = null
  else{
   this.dataset = this.dataSource.dbTable;
   dataSource.addObject(this);
  }
  this.setFieldName(this.fieldName);
}

TDBEdit.prototype.setPropertys = function(props){
  for(var i in props)
   this[i] = props[i];
  this.setDataSource(this.dataSource); 
} 
/*事件*/
TDBEdit.prototype.doPaste = function(e){
  src = event.srcElement;
  edit = src.owner;

  edit.updateData();
}

TDBEdit.prototype.doKeyUp = function(e){
  src = event.srcElement;
  edit = src.owner;

  if(edit.field!=null)
   if(edit.field.sField.value!=this.value&&edit.dataset.getState()==0){
     edit.isUpdateData = true;	
     edit.dataset.editRow();
     edit.isUpdateData = false;
   }
}

TDBEdit.prototype.doKeyDown = function(e){
 var src = event.srcElement;
 var edit = src.owner;
 var keyCode = event.keyCode;
 
 if(!edit.element.readOnly)
   if(keyCode==13)  edit.updateData();
  
 if(edit.oldOnKeyDown!=null)
   edit.oldOnKeyDown(edit,event);
   
 if(edit.OnKeyDown!=null)
   edit.OnKeyDown(edit,event);
 else{
   if(edit.Class!="TEXTAREA")
     edit.dataSource.keyDown(edit,event); 
 }
}

TDBEdit.prototype.doBlur = function(e){
 var src = event.srcElement;
 var edit = src.owner;
  
 if(!edit.element.readOnly) 
  if(edit.field.sField!=null){
    var dSet = edit.dataSource.dbTable;	
    var value = edit.field.getDisplayText();
    if(value!=edit.element.value)
      edit.updateData();
	if(edit.oldOnBlur!=null)
	  edit.oldOnBlur(edit.element);
  }
}

TDBEdit.prototype.doChange = function(iscall){
  var src = (typeof(iscall)=="undefined")? event.srcElement: this;
  var edit = src.owner;
  if(edit.isDateEdit)
    edit.updateData();
 //edit.field.sField.value = edit.element.value;
}

TDBEdit.prototype.focus = function(){
  this.element.focus();	
  this.element.select(true);
}

TDBEdit.prototype.canFocus = function(){
  return this.element.readOnly||this.element.disabled;
}

TDBEdit.prototype.setReadOnly =function(readOnly){
  this.readOnly = readOnly;
  this.element.readOnly = readOnly;
}

TDBEdit.prototype.equals = function(sender){
  return this.element == sender;
}

TDBEdit.prototype.setDisabled =function(disabled){
  this.element.disabled = disabled;
}

/*TDBCheckBox,数据选择控件*/
TDBCheckBox.prototype.dataSource = null;
TDBCheckBox.prototype.dataset = null;

TDBCheckBox.prototype.field = null;
TDBCheckBox.prototype.fieldName = "";
TDBCheckBox.prototype.OnKeyDown = null;

function TDBCheckBox(element,fieldName,isReadOnly){
  this.Class = element.tagName.toUpperCase();
  this.element = element;
  this.element.owner = this;  
  this.element.onclick = this.doClick;
  
  this.oldOnKeyDown = this.element.onkeydown;  
  this.element.onkeydown = this.doKeyDown;  
  
  var isRO = typeof(isReadOnly)!="undefined"&&isReadOnly;
  this.isUpdateData = false;
  this.fieldName = fieldName.toUpperCase();  
  this.element.disabled = element.className=="checkreadonly"||this.element.disabled||isRO;  
  this.readOnly = this.element.disabled;
  
  __VCL.add(this);    
}

TDBCheckBox.prototype.free = function(){
  this.element.owner = null;
  this.element.onclick = null;
  this.element.onkeydown = null;  
  this.element = null;
}

TDBCheckBox.prototype.dataChange = function(ds,dSet,field){
  if(dSet==null){ //断开和数据集的连接	
   this.dataset = null;
   this.field = null;
   this.element.checked = false;
  }else{
   if(this.field==null)
    this.setFieldName(this.fieldName);
    if(!this.isUpdateData&&this.field.sField!=null){
     this.element.checked = this.field.sField.value>"0";
	 this.element.disabled = this.readOnly||dSet.readOnly;	
    }
  }
}

//更新数据
TDBCheckBox.prototype.updateData = function(){
 if(this.field.sField!=null){
  var dSet = this.dataSource.dbTable;	
  this.isUpdateData = true;
  var value = "0";
  if(this.element.checked)
   value = "1";
  dSet.innersetFieldValue(this.fieldName,value);
  this.isUpdateData = false;
 }
}

TDBCheckBox.prototype.setFieldName = function(fieldName){
  this.fieldName = fieldName;
  if(this.dataSource!=null&&this.dataSource.dbTable!=null){
   var dSet = this.dataSource.dbTable;
   if(typeof(dSet.fieldByName[fieldName])!="undefined"){
	 this.field = dSet.fieldByName[fieldName];
     this.element.checked = this.field.sField.value>"0";
	 this.element.disabled = this.readOnly||this.dataSource.dbTable.readOnly;	 	 
   }else{
	this.field = null;
    this.element.checked = false;
   }
  }
}

TDBCheckBox.prototype.setDataSource = function(dataSource){
  this.dataSource = dataSource;
  if(this.dataSource==null)
   this.dataset = null
  else{
   this.dataset = this.dataSource.dbTable;
   dataSource.addObject(this);
  }
  this.setFieldName(this.fieldName);
}

TDBCheckBox.prototype.setPropertys = function(props){
  for(var i in props)
   this[i] = props[i];
  this.setDataSource(this.dataSource); 
} 
/*事件*/
TDBCheckBox.prototype.doClick = function(e){
 var src = event.srcElement;
 var edit = src.owner;
 edit.updateData();
}

TDBCheckBox.prototype.doKeyDown =function(e){
  var vSrc = event.srcElement;	
  if(vSrc.owner.oldOnKeyDown!=null)
   vSrc.owner.oldOnKeyDown(cbox,event);  
  if(vSrc.owner.OnKeyDown!=null)
   vSrc.owner.OnKeyDown(vSrc.owner,event)
  else
   vSrc.owner.dataSource.keyDown(vSrc.owner,event);   
}

TDBCheckBox.prototype.focus = function(){
 this.element.focus();	
}

TDBCheckBox.prototype.equals = function(sender){
    return this.element == sender;
}

/*radio数据封装*/
TDBRadio.prototype.dataSource = null;
TDBRadio.prototype.dataset = null;
TDBRadio.prototype.field = null;
TDBRadio.prototype.fieldName = "";
TDBRadio.prototype.OnKeyDown = null;

function TDBRadio(radios,fieldName,isReadOnly){
  this.Class = "RADIO";
  this.isUpdateData = false;
  this.fieldName = fieldName.toUpperCase();  
  var isRO = typeof(isReadOnly)!="undefined"&&isReadOnly;
  this.readOnly = isRO;
  
  this.radios = new Array(radios.length);
  for(var i=0;i<radios.length;i++){
   this.radios[i] = radios[i];
   this.radios[i].onclick = this.updateData;
   this.oldOnKeyDown = this.radios[i].onkeydown;   
   this.radios[i].onkeydown = this.doKeyDown;   
   this.radios[i].owner = this;
   this.radios[i].disabled = this.radios[i].className=="radioreadonly"||this.radios[i].disabled||isRO;       
  }
  __VCL.add(this);    
}

TDBRadio.prototype.free = function(){
  for(var i=0;i<this.radios.length;i++){
   this.radios[i].onclick = null;
   this.radios[i].owner = null;
   this.radios[i].onkeydown = null;   
   this.radios[i] = null;
  }
}

TDBRadio.prototype.setReadOnly =function(readOnly){
  for(var i=0;i<this.radios.length;i++){
   this.radios[i].disabled = readOnly||this.isRO;       
  }
}

TDBRadio.prototype.dataChange = function(ds,dSet,field){
  if(dSet==null){ //断开和数据集的连接	
   this.dataset = null;
   this.field = null;
   for(var i=0;i<this.radios.length;i++)
    this.radios[i].checked = false;
  }else{
   if(this.field==null)
    this.setFieldName(this.fieldName);
	  
   if(!this.isUpdateData&&this.field.sField!=null){
    var value = this.field.sField.value;
    for(var i=0;i<this.radios.length;i++){
	 if(this.radios[i].value==value){
       this.radios[i].checked = true;
	 }
	 this.radios[i].disabled = this.readOnly||dSet.readOnly;
	}
   }
  }
}

//更新数据
TDBRadio.prototype.updateData = function(){
 if(this.owner.field.sField!=null){
  var dSet = this.owner.dataSource.dbTable;	
  this.owner.isUpdateData = true;
  dSet.setFieldValue(this.owner.fieldName,this.value);
  this.owner.isUpdateData = false;
 }
}

TDBRadio.prototype.setFieldName = function(fieldName){
  this.fieldName = fieldName;
  if(this.dataSource!=null&&this.dataSource.dbTable!=null){
   var dSet = this.dataSource.dbTable;
   if(typeof(dSet.fieldByName[fieldName])!="undefined"){
	 this.field = dSet.fieldByName[fieldName];
	 
	 var value = this.field.sField.value;
	 
     for(var i=0;i<this.radios.length;i++){
      this.radios[i].disabled = this.radios[i].disabled||this.dataSource.dbTable.readOnly;	 		 
 	  if(this.radios[i].value==value)
       this.radios[i].checked = true;
	 }
   }else{
	this.field = null;
    for(var i=0;i<this.radios.length;i++)
     this.radios[i].checked = false;
   }
  }
}

TDBRadio.prototype.setDataSource = function(dataSource){
  this.dataSource = dataSource;
  if(this.dataSource==null)
   this.dataset = null
  else{
   this.dataset = this.dataSource.dbTable;
   dataSource.addObject(this);
  }
  this.setFieldName(this.fieldName);
}

TDBRadio.prototype.doKeyDown =function(e){
  var vSrc = event.srcElement;	
  
  if(vSrc.owner.oldOnKeyDown!=null)
   vSrc.owner.oldOnKeyDown(vSrc,event);
  
  if(vSrc.owner.OnKeyDown!=null)
   vSrc.owner.OnKeyDown(vSrc.owner,event);
  else
   vSrc.owner.dataSource.keyDown(vSrc.owner,event);   
 
}

TDBRadio.prototype.focus = function(){
 this.radios[0].focus();	
}

TDBRadio.prototype.equals = function(sender){
    return this.radios[0] == sender;
}

/*TDBComboBox,数据编辑控件*/

TDBComboBox.prototype.dataSource = null;
TDBComboBox.prototype.dataset = null;
TDBComboBox.prototype.field = null;
TDBComboBox.prototype.fieldNo = null;
TDBComboBox.prototype.fieldName = "";
TDBComboBox.prototype.fieldNameNo = "";
TDBComboBox.prototype.displayIndex = 1;
TDBComboBox.prototype.charCase = 1;
TDBComboBox.prototype.sqlID = "";
TDBComboBox.prototype.params = "";
TDBComboBox.prototype.OnKeyDown = null;
TDBComboBox.prototype.OnSetValue = null;
TDBComboBox.prototype.BeforeOpen = null;
TDBComboBox.prototype.OnInitValue = null;
TDBComboBox.prototype.DynCall = false;      //动态调用
TDBComboBox.prototype.CallAtt = 0;          //动态树型调用时
TDBComboBox.prototype.OnSetValueEx = null;

function TDBComboBox(element,button,fieldNameNo,fieldName,
					 url,w,h,sqlID,sqlIDC,isReadOnly){
  
  this.Class = element.tagName.toUpperCase();
  this.className = "TDBComboBox";
 
  this.params = null;
  this.results = [];
  
  this.element = element;
  this.element.owner = this;  
  this.oldOnKeyDown = this.element.onkeydown;
  this.element.onkeydown = this.doKeyDown;
  this.element.onkeyup = this.doKeyUp;
  this.element.onchange = this.doChange;
  var isRO = typeof(isReadOnly)!="undefined"&&isReadOnly;
  
  this.element.readOnly = element.className=="textreadonly"||this.element.readOnly||isRO;  
  this.readOnly = this.element.readOnly; 
  if(isRO)
    $(button).css("visibility","hidden");
  this.button = button;
  this.button.onclick = this.buttonClick;
  this.button.owner = this;  
  
  this.value = "";
  this.isUpdateData = false;
  this.isOpen = false;
  this.width = w;
  this.height = h;
  
  this.DynCall = url.lastIndexOf(__$gfileext)<0;

  this.sqlID = sqlID;
  this.sqlIDC = (this.DynCall)? sqlID+"_COUNT":sqlIDC;
  
  if(this.DynCall){
	if(url=="") url = "../lib/";

	this.CallAtt = (sqlIDC=="")?"0" : sqlIDC;
	var isTree = sqlIDC.indexOf(",")>0;
		  
	if(isTree)
  	  url += __$gfile.pubfindtree;
	else
	  url += __$gfile.pubfind;
  }
  
  this.url = url;
  this.$openurl = "";  
  
  this.fieldName = fieldName.toUpperCase();
  this.fieldNameNo = fieldNameNo.toUpperCase();
  
  this.oldValue = "";
  this.hint = "找不到数据";

  this.readOnly = isRO;
  
  this.Query = null;
  __VCL.add(this);    
}

TDBComboBox.prototype.free = function(){
  this.element.onkeydown = null;	
  this.element.onkeyup = null;
  this.element.owner = null;  
  this.element = null;
  
  this.button.onclick = null;
  this.button.owner = null;  
  this.button = null;  
  this.results = null;
  this.BeforeOpen = null;
}

TDBComboBox.prototype.dataChange = function(ds,dSet,field){
  if(dSet==null){ //断开和数据集的连接	
   this.dataset = null;
   this.field = null;
   this.fieldNo = null;
   this.element.value = "";
   this.oldValue = "";
  }else{
   if(this.field==null)
    this.setFieldName(this.fieldName,this.fieldNameNo);
   
   if(this.field==null)
    alert("字段"+this.fieldName+"不存在数据集中.");
   else
   if(!this.isUpdateData&&this.field.sField!=null){

	 var value = this.field.getDisplayText(); 
	 this.element.value = value;
	 this.value = this.fieldNo.sField.value;
	 this.oldValue = this.element.value;
	 
	 this.element.readOnly = this.readOnly||dSet.readOnly; 
   }
  }
}

//更新数据
TDBComboBox.prototype.updateData = function(){
 if(this.field.sField!=null){
  var dSet = this.dataSource.dbTable;	
  this.isUpdateData = true;
  
  if(this.fieldNameNo!="")
    dSet.innersetFieldValue(this.fieldNameNo,this.value);
	
  dSet.innersetFieldValue(this.fieldName,this.element.value);
  
  this.isUpdateData = false;
  var value = this.field.getDisplayText(); 
  if(this.element.value!=value)
    this.element.value = value;
 }
 return true;
}

//TDataSource回调
TDBComboBox.prototype.dsUpdateData = function(){
  return this.updateData(); 	 
}

TDBComboBox.prototype.setFieldName = function(fieldName,fieldNameNo){
  this.fieldName = fieldName;
  this.fieldNameNo = fieldNameNo;
  
  if(this.dataSource!=null&&this.dataSource.dbTable!=null){
   var dSet = this.dataSource.dbTable;
   if(typeof(dSet.fieldByName[fieldName])!="undefined"){
	   
	 this.field = dSet.fieldByName[fieldName];
	 this.oldValue = this.element.value;
	 
	 if(fieldNameNo!="")
	   this.fieldNo = dSet.fieldByName[fieldNameNo];
	 else
	   this.fieldNo = null;
     this.element.value = this.field.sField.value;
	 this.value = this.fieldNo.sField.value;
	 
	 this.element.readOnly = this.element.readOnly||this.dataSource.dbTable.readOnly;	 	
	 this.button.disabled = this.element.readOnly;
   }else{
	this.field = null;
	this.fieldNo = null;
    this.element.value = "";
	this.value = "";
   }
  }
}

TDBComboBox.prototype.setDataSource = function(dataSource){
  this.dataSource = dataSource;
  if(this.dataSource==null)
   this.dataset = null
  else{
   this.dataset = this.dataSource.dbTable;
   dataSource.addObject(this);
  }
  this.setFieldName(this.fieldName,this.fieldNameNo);
}

TDBComboBox.prototype.setPropertys = function(props){
  for(var i in props)
   this[i] = props[i];
  this.setDataSource(this.dataSource); 
} 

TDBComboBox.prototype.doTreeCallBack = function(node){
  if(this.displayIndex==1){	
   this.value = node.getCode();	
   this.element.value = node.getText();
  }else{
   this.value = node.getText();
   this.element.value = node.getCode();	
  }

  this.results[0] = node.getCode();
  this.results[1] = node.getText();
  this.results[2] = node.getID();
  
  this.oldValue=this.element.value;
  this.updateData();	  
  this.element.focus();  
  if(this.OnSetValue!=null) this.OnSetValue(this);
}

TDBComboBox.prototype.QueryCallBack = function(Query){

  this.Query = Query;
  
  if(this.displayIndex==1){	  
    this.value = Query.$("F1");	
    this.element.value = Query.$("F2");
  }else{
    this.value = Query.$("F2");	
    this.element.value = Query.$("F1");
  }
  
  if(this.showValue) this.element.value = this.value;
  
  var RowValues = Query.SelectedRow[0].attributes;  //被选中的一行
   
  for(var i=0;i<Query.fieldCount;i++)
    this.results[i] = RowValues[i+4].value;
   
  this.oldValue=this.element.value;
  this.updateData();	
 
  this.element.focus();
  if(this.OnSetValue!=null) this.OnSetValue(this);
  if(this.OnSetValueEx!=null) this.OnSetValueEx(this,Query);  
}

TDBComboBox.prototype.doCodeCallBack = function(dataset){
  if(this.displayIndex==1){	
   this.value = dataset.fields(4).value;	
   this.element.value = dataset.fields(5).value;
  }else{
   this.value = dataset.fields(5).value;	
   this.element.value = dataset.fields(4).value;
  }
	 
  for(var i=0;i<dataset.fields.count-4;i++)
   this.results[i] = dataset.fields(4+i).value;
  
  this.oldValue=this.element.value;
  this.updateData();	
 
  this.element.focus();
  if(this.OnSetValue!=null) this.OnSetValue(this);
}

TDBComboBox.prototype.doCodeCallBack2 = function(results){
  if(this.displayIndex==1){	
   this.value = results[0];	
   this.element.value = results[1];
  }else{
   this.value = results[1];	
   this.element.value = results[0];
  }
  
  this.results = results;
  
  this.oldValue=this.element.value;
  this.updateData();	
  
  this.element.focus();
  if(this.OnSetValue!=null) this.OnSetValue(this);
}

TDBComboBox.prototype.readDataTest = function(sparams){
  var result = 2;	
  if(typeof(__$Query)!="undefined")
    if(this.sqlID!=""&&this.sqlIDC!=""){
	  
	  var iSave = __$Query.dataFormatEx;
	  __$Query.dataFormatEx = this.DynCall;

      result = __$Query.getPageCount(this.sparams,this.sqlIDC,this.sqlID);
	  
      this.recoutCount = result;

      switch(result){
	    case 0: alert(this.hint);
	            break;
  	    case 1: __$Query.getPage(1);	       //直接读取一条记录
		   	    this.doCodeCallBack2(__$Query.getFieldValues());
		 	    this.Query = __$Query;
	            break;
      }
      __$Query.dataFormatEx = iSave;	  
    }
  return result; 
}

TDBComboBox.prototype.readData = function(awOpen,qc){
  var result = true;	
  var nResult = 2;
  
  //是按回车,并且输入的值和上一次查找的值一样,直接返回  
  if(!awOpen&&this.oldValue==this.element.value&&this.element.value!="") return result;
  if(this.OnInitValue!=null&&this.OnInitValue(this,this.element.value)) return result;
  
  var param = "";
  if(this.charCase==1) qc = qc.toUpperCase();  
  var sparams = [];
  
  var pos  = _$AdjustPosition(this.element,this.width,this.height);
  var x = pos.left;

  var y = pos.top;
  
  var  attr = "dialogHeight:"+this.height+"px;dialogWidth:"+this.width+"px;status:0;help:0;scroll:off;"+
              "dialogLeft:"+x+"px;dialogTop:"+y+"px;";

  var url = (this.url.indexOf("?")>0) ? this.url+"&v="+qc:this.url+"?v="+qc;

  /*构造参数数组*/
  sparams[0] = qc;

  if(typeof(this.params)!="undefined"&&this.params!=null)  
    for(var i=0;i<this.params.length;i++)
	  sparams[i+1] = this.params[i];
   
  this.sparams = sparams;

  //激活获取参数事件,让用户在调用前还有机会修改调用参数
  if(this.OnGetParams!=null) this.OnGetParams(this,sparams);  
   
  if(this.charCase==1)
	for(var i=0;i<this.sparams.length;i++)
	  this.sparams[i] = this.sparams[i].toUpperCase();

  /**/

  if(!awOpen){
   nResult = this.readDataTest(sparams);
   result = nResult>0;
  }
  
  if(nResult>=2){ 
   if(typeof(this.sparams)!="undefined"&&this.sparams!=null){  
    param = "";	   
    for(var i=0;i<this.sparams.length;i++)
     param = param+"&p"+i+"="+this.sparams[i];
   }
   
   this.$openurl = url+param+"&lexiconid="+this.sqlID+"&callatt="+this.CallAtt;
   
   if(this.BeforeOpen!=null) this.BeforeOpen(this);
   result = window.showModalDialog(this.$openurl,this,attr);
  }
  
  if(!result){ 
   this.element.value = this.field.sField.value;
   this.value = this.fieldNo.sField.value;
  }
  this.oldValue=this.element.value;  
  return result;
}

TDBComboBox.prototype.buttonClick = function(e){
  var vSrc = event.srcElement;	
  var cbox = vSrc.owner;
  cbox.readData(true,"");
}

TDBComboBox.prototype.doChange =function(e){
  var vSrc = event.srcElement;	
  var cbox = vSrc.owner;
  if(cbox.oldValue!=cbox.element.value)
    if(cbox.field!=null&&(!cbox.field.isNull||cbox.element.value!=""))
      cbox.readData(true,cbox.element.value);
    else	
      cbox.doCodeCallBack2(["","","","","","","","","","","","","","","","","","","",""]);
}

TDBComboBox.prototype.doKeyUp =function(e){
  var vSrc = event.srcElement;	
  var cbox = vSrc.owner;
  switch(event.keyCode){
    case  8:
    case 46:cbox.value = cbox.element.value;
  }
}

TDBComboBox.prototype.doKeyDown =function(e){
  var result = true	
  var vSrc = event.srcElement;	
  var cbox = vSrc.owner;
  if(event.keyCode==13){
    if(cbox.field!=null&&(!cbox.field.isNull||cbox.element.value==""))
      result = cbox.readData(false,cbox.element.value);
  }
  if(result){
    if(cbox.oldOnKeyDown!=null&&cbox.oldOnKeyDown!=cbox.doKeyDown)
      cbox.oldOnKeyDown(cbox,event); 
  
    if(cbox.OnKeyDown!=null)
      cbox.OnKeyDown(cbox,event); 
    else 
      cbox.dataSource.keyDown(cbox,event);    
  }
}

TDBComboBox.prototype.setReadOnly =function(readOnly){
 this.readOnly = readOnly;
 this.element.readOnly = readOnly;
 this.button.disabled = readOnly;
}

TDBComboBox.prototype.focus = function(){
 this.element.focus();	
 this.element.select(true);
}

TDBComboBox.prototype.equals = function(sender){
    return this.element == sender;
}

/*日期*/
TDBDate.prototype.dataSource = null;
TDBDate.prototype.dataset = null;
TDBDate.prototype.field = null;
TDBDate.prototype.fieldName = "";
TDBDate.prototype.OnKeyDown = null;
TDBDate.prototype.isMonth = false;
TDBDate.prototype.isMonthDay = false;
TDBDate.prototype.spChar = _date_defspChar;
TDBDate.prototype.OnGetValue = null;
TDBDate.prototype.OnSetValue = null;

function TDBDate(element,button,fieldName,isReadOnly,isMonth){
  this.Class = element.tagName.toUpperCase();
  
  this.element = element;
  this.element.owner = this;  
  var isRO = typeof(isReadOnly)!="undefined"&&isReadOnly;
  this.element.readOnly = element.className=="textreadonly"||this.element.readOnly||isRO;  
  
  this.readOnly =  this.element.readOnly;
  
  this.oldOnKeyDown = this.element.onkeydown;
  this.element.onkeydown = this.doKeyDown;
  
  if(isRO)
   button.style.visibility = "hidden";
  this.button = button;
  this.button.onclick = this.buttonClick;
  this.button.disabled = this.readOnly;
  
  this.button.owner = this; 
  
  this.fieldName = fieldName.toUpperCase();
  this.oldValue = "";
  this.isMonth = typeof(isMonth)!="undefined"&&isMonth;
  this.element.isMonth = this.isMonth; 
  
  this.isUpdateData = false;
  __VCL.add(this);    
}

TDBDate.prototype.free = function(){
  this.element.owner = null;  	
  this.element.onkeydown = null;  
  this.element = null;

  this.button.onclick = null;
  this.button.owner = null; 
  this.button = null;
}

TDBDate.prototype.dataChange = function(ds,dSet,field){
  if(dSet==null){ //断开和数据集的连接	
   this.dataset = null;
   this.field = null;
   this.element.value = "";
  }else{
   if(this.field==null)
    this.setFieldName(this.fieldName);
//   alert(this.fieldName);	  
   if(!this.isUpdateData&&this.field.sField!=null){
    var value = this.field.sField.value;
    this.element.value = value.substring(0,10);
	this.oldValue = this.element.value;
	
	this.element.readOnly = this.readOnly||dSet.readOnly; 
	this.button.disabled = this.readOnly||dSet.readOnly; 
	if(this.OnGetValue!=null)
	 this.OnGetValue(this,value);
   }
  }
}

TDBDate.prototype.setValue = function(value){
 var result = true;	
 if(this.field.sField!=null){
  var dSet = this.dataSource.dbTable;	
  this.isUpdateData = true;
  if(this.isMonth){
   value = value.substring(0,7);
   this.element.value = value;
  }else
   value = value.substring(0,10);  
   
  if(this.OnSetValue!=null)
	value = this.OnSetValue(this,value);  
   
  result = dSet.validateWithValue(this.fieldName,value);
  
  if(result)
   dSet.innersetFieldValue(this.fieldName,value);
  else
   this.element.value = this.field.sField.value;
  this.oldValue = this.field.sField.value;
  this.isUpdateData = false;
 }
 this.focus();
 return result;
}
//更新数据
TDBDate.prototype.updateData = function(){
 var result = true;	
 if(this.field.sField!=null){
  var dSet = this.dataSource.dbTable;	
  this.isUpdateData = true;
  
  var value = this.element.value;
  
  if(this.OnSetValue!=null)
	value = this.OnSetValue(this,value);  
  
  result = dSet.validateWithValue(this.fieldName,this.element.value); 
  
  if(result)
   dSet.innersetFieldValue(this.fieldName,this.element.value);
  else{
   value = this.field.sField.value+"";
   this.element.value = value.substring(0,10);
  }
  this.oldValue = this.field.sField.value;
  this.isUpdateData = false;
 }
 return result;
}

//TDataSource回调
TDBDate.prototype.dsUpdateData = function(){
  return this.updateData(); 	 
}

TDBDate.prototype.setFieldName = function(fieldName){
  this.fieldName = fieldName;
  
  if(this.dataSource!=null&&this.dataSource.dbTable!=null){
   var dSet = this.dataSource.dbTable;
   if(typeof(dSet.fieldByName[fieldName])!="undefined"){
	 this.field = dSet.fieldByName[fieldName];
     this.element.value = this.field.sField.value;
     this.oldValue = this.field.sField.value;
	 this.element.readOnly = this.element.readOnly||this.dataSource.dbTable.readOnly;	 
	 this.button.disabled = this.element.readOnly;
   }else{
	this.field = null;
    this.element.value = "";
    this.oldValue = "";
   }
  }
}

TDBDate.prototype.setDataSource = function(dataSource){
  this.dataSource = dataSource;
  if(this.dataSource==null)
   this.dataset = null
  else{
   this.dataset = this.dataSource.dbTable;
   dataSource.addObject(this);
  }
  this.setFieldName(this.fieldName);
}

TDBDate.prototype.setPropertys = function(props){
  for(var i in props)
   this[i] = props[i];
  this.setDataSource(this.dataSource); 
} 

TDBDate.prototype.doCodeCallBack = function(value){
  this.element.value = value;
  this.oldValue = value;
  this.updateData();	
}

TDBDate.prototype.buttonClick = function(e){
  var vSrc = event.srcElement;	
  var cbox = vSrc.owner;
  var pos  = _$AdjustPosition(cbox.element,232,260);
  var x = pos.left;
  var y = pos.top;
  
  var  attr = "dialogHeight:200px;dialogWidth:200px;status:0;help:0;scroll:off;"+
              "dialogLeft:"+x+"px;dialogTop:"+y+"px;";

  result = window.showModalDialog("../util/getdate.html",cbox,attr);
}

TDBDate.prototype.doKeyDown =function(e){
  var vSrc = event.srcElement;	
  
  var cbox = vSrc.owner;
  switch(event.keyCode){
    case 13:
         if(cbox.element.value==""){
           cbox.buttonClick();
		   return;
		 }
         break;
  }
  
  if(cbox.oldOnKeyDown!=null)
    cbox.oldOnKeyDown(cbox,event);
  if(cbox.OnKeyDown!=null)
    cbox.OnKeyDown(cbox,event);
  else
    cbox.dataSource.keyDown(cbox,event);   
  if(event.keyCode!=13){
   //event.keyCode = 0;  有些浏览器此句会报错误
    return false;
  }
}

TDBDate.prototype.focus = function(){
  this.element.focus();	
  this.element.select(true);
}

TDBDate.prototype.setReadOnly =function(readOnly){
  this.readOnly = readOnly;
  this.element.readOnly = readOnly;
  this.button.disabled = readOnly;
}

TDBDate.prototype.equals = function(sender){
  return this.element == sender;
}

/****************
*SELECT 下拉菜单
****************/
TDBSelect.prototype.dataSource = null;
TDBSelect.prototype.dataset = null;
TDBSelect.prototype.field = null;
TDBSelect.prototype.fieldName = "";

function TDBSelect(element,fieldNameNo,fieldName,isReadOnly){
  this.element = element;
  this.element.owner = this;  
  this.element.onchange = this.doChange;

  this.element.onkeyup = this.doKeyUp;
  this.oldOnKeyDown = this.element.onkeydown;
  this.element.onkeydown = this.doKeyDown;
  
  var isRO = typeof(isReadOnly)!="undefined"&&isReadOnly;
  this.element.readOnly = element.className=="textreadonly"||this.element.readOnly||isRO;  
  
  this.readOnly =  this.element.readOnly;
  
  this.isUpdateData = false;
  
  this.fieldName = "";  
  if(typeof(fieldName)!="undefined")
   this.fieldName = fieldName.toUpperCase();
   
  this.fieldNameNo = fieldNameNo.toUpperCase(); 
  __VCL.add(this);    
}
/***********************
*数据改变响应事件
************************/
TDBSelect.prototype.doChange = function(e){
   var src = event.srcElement;
   var edit = src.owner;
   edit.updateData();
}

TDBSelect.prototype.free = function(){
  this.element.owner = null;
  this.element.onchange = null;
  this.element.onkeyup = null;
  this.element.onkeydown = null;
  this.element = null;
}

TDBSelect.prototype.dataChange = function(ds,dSet,field){

  if(dSet==null){ //断开和数据集的连接	
   this.dataset = null;
   this.field = null;
   this.fieldNo = null;   
   this.element.value = "";
  }else{
   if(this.fieldNo==null)
    this.setFieldName(this.fieldName,this.fieldNameNo);
	  
   if(!this.isUpdateData&&this.fieldNo.sField!=null){
     this.element.value = this.fieldNo.sField.value; 
	 this.element.readOnly = this.readOnly||dSet.readOnly; 
   }
  }
}

/*事件*/
TDBSelect.prototype.doKeyUp = function(e){
 var src = event.srcElement;
 var edit = src.owner;

 if(edit.field!=null)
  if(edit.field.sField.value!=this.value&&edit.dataset.getState()==0){
   edit.isUpdateData = true;	
   edit.dataset.editRow();
   edit.isUpdateData = false;
  }
}

TDBSelect.prototype.doKeyDown = function(e){
 var src = event.srcElement;

 var edit = src.owner;
 var keyCode = event.keyCode;
 
 if(!edit.element.readOnly)
  if(keyCode==13)  edit.updateData();
  
 if(edit.oldOnKeyDown!=null)
  edit.oldOnKeyDown(edit,event);
   
 if(edit.OnKeyDown!=null)
  edit.OnKeyDown(edit,event);
 else edit.dataSource.keyDown(edit,event); 
}
/********************
*设置数据更改
*********************/
TDBSelect.prototype.updateData = function(){
 if(this.fieldNo.sField!=null){
  var dSet = this.dataSource.dbTable;	
  this.isUpdateData = true;
  dSet.setFieldValue(this.fieldNameNo,this.element.value);
  if(this.fieldName!=""){
   n = this.element.selectedIndex;
   if(n>-1)
     dSet.setFieldValue(this.fieldName,this.element.options[n].text);
  }
  this.isUpdateData = false;
 }
}

/************************
*设置下拉框绑定的字段名称
************************/
TDBSelect.prototype.setFieldName = function(fieldName,fieldNameNo){
  this.fieldName = fieldName;
  if(this.dataSource!=null&&this.dataSource.dbTable!=null){
   var dSet = this.dataSource.dbTable;
   if(typeof(dSet.fieldByName[fieldNameNo])!="undefined"){
	 if(fieldName!="")  
      this.field = dSet.fieldByName[fieldName];
	  
	 this.fieldNo = dSet.fieldByName[fieldNameNo];	 

     this.element.value = this.fieldNo.sField.value;
	 this.element.disabled = this.element.readOnly||this.dataSource.dbTable.readOnly;	 
   }else{
	this.field = null;
	this.fieldNo = null;
    this.element.value = "";
   }
  }
}

TDBSelect.prototype.setDataSource = function(dataSource){
  this.dataSource = dataSource;
  if(this.dataSource==null)
   this.dataset = null
  else{
   this.dataset = this.dataSource.dbTable;
   dataSource.addObject(this);
  }
  this.setFieldName(this.fieldName,this.fieldNameNo);
}

TDBSelect.prototype.setPropertys = function(props){
  for(var i in props)
   this[i] = props[i];
  this.setDataSource(this.dataSource); 
}

TDBSelect.prototype.focus = function(){
 this.element.focus();	
 //this.element.select(true);
}

TDBSelect.prototype.equals = function(sender){
    return this.element == sender;
}

TDBSelect.prototype.setDisabled =function(disabled){
  this.element.disabled = disabled;
}
