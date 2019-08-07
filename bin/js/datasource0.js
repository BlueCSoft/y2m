//数据源对象
//数据控件单元
/*记录变化事件,ds-数据源,dSet-数据集,field-字段对象TField*/
function doTriggerEvent(ds,dSet,field,att){

  for(var i=0;i<ds.objectCount;i++)
    if(typeof(ds.objects[i])!="undefined"&&ds.objects[i]!=null){
      var sender = ds.objects[i];
      sender.dataChange(ds,dSet,field,att);
    }

  ds.changeEventName = att;  
  if(ds.OnDataChange!=null&&att!="sum")
     ds.OnDataChange(ds,dSet,field);
}

function getObjectIndex(sender,ds){
  var j = 0;
  for(var i=0;i<ds.objectCount;i++)
   if(ds.objects[i]==sender){
    j = i;
    break;
   } 
  return j; 
}
//按键处理
function findNextObject(sender,ds){

  var i = getObjectIndex(sender,ds)+1;
  return (i<ds.objectCount)? ds.objects[i]:ds.objects[0];
}

function db_doKeydownFirst(){
  this.objects[0].focus();
  this.objects[0].select(true);
}

function db_doKeydown(sender,e){

  if(e.keyCode==13){
    if(this.origKdObj == sender)
	  this.kdCount++;
	else{
      this.origKdObj = sender;
	  this.kdCount = 1;		
	}
  }
  
  if(this.OnKeyDown==null||!this.OnKeyDown(sender,e))
    if(e.keyCode==13){
	  if(this.endFocusElement!=null&&sender.equals(this.endFocusElement)){
		b = this.dbTable.nextPage();     
	    if(b&&!this.dbTable.readOnly&&this.kdCount>1){
          this.dbTable.insert();
		  b = false;
		}
		if(this.startFocusElement!=null&&!b){
		  this.startFocusElement.focus();
		  this.startFocusElement.select(true);
	    }
		return true;
	  }
	  var obj = findNextObject(sender,this);
	  if(obj.Class!="TEXTAREA"){
   	    while(obj.readOnly||obj.NotFocus||(typeof(obj.element)!="undefined"&&obj.element.disabled))
	      obj = findNextObject(obj,this);
	    if(obj!=sender&&obj.Class!="TEXTAREA"&&obj.Class!="DBGRID"){
	      e.returnvalue = false;	 
  	      obj.focus();   
	    }
	  }
    }
	
  return true;
}

//增加对象
function db_doFocusEx(){
  this.style.color = "black";
  this.style.background = "#FFFF00";
}

function db_doBlurEx(){
  this.style.color = "black";
  this.style.background = "#FFFFFF";
}

function addObjectEx(sender){
  sender.onblur = db_doBlurEx;
  sender.onfocus = db_doFocusEx;
  sender.dataSource = this;
  var result = -1;
  for(var i=0;result==-1&&i<this.objectCount;i++)
   if(typeof(this.objects[i])=="undefined"||
      this.objects[i]==null){
    this.objects[i] = sender;
    result = i;
   }
  if(result==-1){
   result = this.objectCount;
   this.objects[this.objectCount] = sender;
   this.objectCount++;
  }
}
//删除对象
function removeObject(dSet,sender){
  for(var i=0;i<this.objectCount;i++)
   if(this.objects[i]==sender){
    this.objects[i] == null;
    break;
   }
}

TDataSource.prototype.dbTable = null;
TDataSource.prototype.activeObject = null;
TDataSource.prototype.objects = []; 
TDataSource.prototype.objectCount = 0;
TDataSource.prototype.origKdObj = null;
TDataSource.prototype.kdCount = 0;

TDataSource.prototype.startFocusElement = null;
TDataSource.prototype.endFocusElement = null;

TDataSource.prototype.focusBackGroundColor = "#BBBBFF";
TDataSource.prototype.focusFontColor = "#000000";
TDataSource.prototype.readOnly = false;
TDataSource.prototype.triggerEvent = doTriggerEvent;
TDataSource.prototype.changeEventName = "";

TDataSource.prototype.setPropertys = function(props){
  for(var i in props)
    this[i] = props[i];
  props = null;
}

TDataSource.prototype.existObject = function(sender){
  var result = false;
  for(var i=0;!result&&i<this.objectCount;i++)
   if(typeof(this.objects[i])!="undefined"&&this.objects[i]!=null&&this.objects[i]==sender)
    result = true;
  return result;
}
/*增加对象到数据源中,sender是TControl的子类对象*/
TDataSource.prototype.addObject = function(sender){
  if(!this.existObject(sender)){	
   var result = -1;
   for(var i=0;result==-1&&i<this.objectCount;i++)
    if(typeof(this.objects[i])=="undefined"||this.objects[i]==null){
     this.objects[i] = sender;
     result = i;
    }
   if(result==-1){
    result = this.objectCount;
    this.objects[this.objectCount] = sender;
    this.objectCount++;
   }
   sender.setDataSource(this);   
  }
  return sender; 
}

TDataSource.prototype.datasetChange = function(dataset){
  var obj = null;	
  for(var i=0;i<this.objectCount;i++){
	obj = this.objects[i];
    obj.setDataSource(this);   	
  }
}

TDataSource.prototype.getObject = function(fieldName){
  var obj = null;	
  fieldName = fieldName.toUpperCase();
  for(var i=0;i<this.objectCount;i++)
   if(this.objects[i].fieldName==fieldName||
      (typeof(this.objects[i].fieldNameNo)!="undefined"&&this.objects[i].fieldNameNo==fieldName)){
	obj = this.objects[i];
	break;
   }
  return obj;  
}

TDataSource.prototype.addObjectEx = addObjectEx;
TDataSource.prototype.removeObject = removeObject;
TDataSource.prototype.keyDown = db_doKeydown;
TDataSource.prototype.keyDownFirst = db_doKeydownFirst;
TDataSource.prototype.OnKeyDown = null;
TDataSource.prototype.OnDataChange = null;
TDataSource.prototype.OnDataChangeEx = null;

function TDataSource(){
 this.objects = new Array();
 __VCL.add(this);   
}

TDataSource.prototype.free = function(){
 this.objects = null;	
}

TDataSource.prototype.dataUpdate = function(){
  var result = true;	
  if(!this.readOnly)
  for(var i=0;i<result&&this.objectCount;i++)
   if(typeof(this.objects[i])!="undefined"&&this.objects[i]!=null){
    var sender = this.objects[i];
	if(typeof(sender.dsUpdateData)!="undefined"&&sender.dsUpdateData!=null)
	  result = sender.dsUpdateData();
   }
  return result; 
}

TDataSource.prototype.changeFocus = function(fieldName){
  var result = false;	
  if(!this.readOnly){
   var Obj = this.getObject(fieldName);
   if(Obj!=null&&Obj.element!=null&&!Obj.element.readOnly&&!Obj.element.disabled){
    Obj.element.focus();
	result = true;
   }
  }
  return result;
}

/*
 {f:"字段",f0:"字段2",c:"对象名",t:"类型",r:true(只读)}
  t = e:(默认edit), c:Combox, t:text, s:select, r:radio, o:checkbox 
*/
TDataSource.prototype.addEditObjs = function(objs){
  for(i=0;i<objs.length;i++){
	obj = objs[i];
	ctype = (typeof(obj.T)=="undefined")? "E":obj.T;
	fname = obj.F;
	fname0 = (typeof(obj.F0)=="undefined")? fname:obj.F0;
	objid = (typeof(obj.C)=="undefined")? fname:obj.C;
	eobj = document.getElementById(objid);
	readOnly = (typeof(obj.R)=="undefined")? false:obj.R;
	switch(ctype.charAt(0).charCodeAt()){
	  case 69: this.addObject(new TDBEdit(eobj,fname,readOnly)); 
	    break;
	  case 67: 
	    break;
	  case 84: this.addObject(new TDBText(eobj,fname));  	
	    break;
	  case 83: this.addObject(new TDBSelect(eobj,fname0,fname,readOnly));
	    break;
	  case 82: this.addObject(new TDBRadio(obj.OBJS,fname0,fname,readOnly));
	    break;
	  case 79: this.addObject(new TDBCheckBox(eobj,fname,readOnly));
	    break;		  		
	}
  }
}
//INPUT SELECT RADIO CHECKBOX TEXTAREA 
TDataSource.prototype.boundDbCtrl = function(dsname,readfield){
  brf = typeof(readfield)!="undefined";
  data = (dsname!="")? "[data-source='"+dsname+"']" : "[data-field]";
  iobjs =  $(data);	

  for(i=0;i<iobjs.length;i++){
	eobj = iobjs[i];
	fieldName = eobj.dataset.field;
	fieldNameN = (typeof(eobj.dataset.fieldn)!="undefined")? eobj.dataset.fieldn:"";
	fieldNameP = (typeof(eobj.dataset.fieldp)!="undefined")? eobj.dataset.fieldp:"";
	
	ctype = eobj.tagName;

	readOnly = brf&&readfield.indexOf(fieldName)>-1;
	if(ctype=="TEXTAREA")
	  this.addObject(new TDBEdit(eobj,fieldName,readOnly)); 
	else
	if(ctype=="SELECT")  
	  this.addObject(new TDBSelect(eobj,fieldName,fieldNameN,readOnly));
	else
	if(ctype=="INPUT"){
	  type = eobj.type.toUpperCase();
	  if(type=="TEXT"||type=="DATE"){
		isDateEdit = typeof(eobj.dataset.date)!="undefined";
		this.addObject(new TDBEdit(eobj,fieldName,readOnly)).isDateEdit = isDateEdit; 
	  }else{
   	    if(type=="CHECKBOX") 
		  this.addObject(new TDBCheckBox(eobj,fieldName,readOnly));
	    else
	    if(type=="RADIO"){  
	      radios = $("[name='"+eobj.name+"']");
	      this.addObject(new TDBRadio(radios,fieldName,fieldNameN,readOnly));
	    }
	  }
	}
	else
	if(ctype=="IMG"){
	  this.addObject(new TDBImage(eobj,fieldName,fieldNameN,fieldNameP));
	}else{
	  this.addObject(new TDBText(eobj,fieldName));  	
	}
  }
}

TDataSource.prototype.sort = function(fieldNames){
}