/*TComboBox,普通组合框*/

TComboBox.prototype.data = "";
TComboBox.prototype.sqlID = "";
TComboBox.prototype.sqlIDC = "";
TComboBox.prototype.params = "";
TComboBox.prototype.charCase = 1;
TComboBox.prototype.OnChange = null;
TComboBox.prototype.OnSetValue = null;
TComboBox.prototype.BeforeOpen = null;
TComboBox.prototype.OnKeyDown = null;
TComboBox.prototype.showValue = false;    //true时显示第一个字段
TComboBox.prototype.DynCall = false;      //动态调用
TComboBox.prototype.CallAtt = "0";        //动态树型调用时
TComboBox.prototype.OnSetValueEx = null;
TComboBox.prototype.isFixed = false;      //固定combox
TComboBox.prototype.itemIndex = -1;

function TComboBox(element,button,url,w,h,sqlIDC,sqlID,params,defVNo,defVName){
  this.Class = element.tagName;
  
  if(typeof(params)!="undefined"||params!=null)
    this.params = params;   //查询参数
   
  this.results = [];     //返回结果 
  
  this.element = element;
  this.element.owner = this;  
  this.element.onkeydown = this.doKeyDown;
  this.element.onkeyup = this.doKeyUp;      
  this.element.onchange = this.doChange;
  
  this.button = button;
  this.button.onclick = this.buttonClick;
  this.button.owner = this;  
  
  this.value = (typeof(defVNo)!="undefined")? defVNo:"";
  if(typeof(defVName)!="undefined")
    this.element.value = defVName;
	
  this.valueEx = "''"; 
  this.hideElement = null;
  
  this.isOpen = false;
  this.width = w;
  this.height = h;
//  this.DynCall = url.lastIndexOf(__$gfileext)<0;
  this.isFixed = url.toUpperCase()=="FIXED";
  this.DynCall = url==""||(!this.isFixed&&url.lastIndexOf(__$gfileext)<0);  
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
  this.hint = "找不到数据";
  
  this.Query = null;
  this.Div = null;
  this.saveRow = null;
  this.saveColor = "";
  this.saveBackGround = "";  
  __VCL.add(this);
}

TComboBox.prototype.free = function(){
  this.params = null;
  this.results = null;
  
  this.element.owner = null;  
  this.element.onkeyup = null;
  this.element.onkeydown = null;
  this.element.onchange = null;
  this.element = null;  
  
  this.button.onclick = null;
  this.button.owner = null;  
  this.button = null;  
  this.BeforeOpen = null;
  this.hideElement = null;
  if(this.Div!=null){
    var table = this.Div.childNodes[0];
    for(var i=0;i<table.rows.length;i++){
	 table.rows[i].onmouseover = null;
	 table.rows[i].onmousedown = null;
	 table.rows[i].owner = null;
    }
	table.onkeydown = null;
	this.Div.owner = null;
    this.Div = null; 
  }
}

TComboBox.prototype.setPropertys = function(props){
  for(var i in props)
   this[i] = props[i];
} 

TComboBox.prototype.QueryCallBack = function(Query){

  this.Query = Query;
  this.value = Query.$("F1");	
  this.element.value = Query.$("F2");
  
  if(this.showValue) this.element.value = this.value;
  
  var RowValues = Query.SelectedRow[0].attributes;  //被选中的一行
   
  for(var i=0;i<Query.fieldCount;i++)
    this.results[i] = RowValues[i+4].value;
   
  this.doChange();
  this.doSetValue();
  
  if(this.OnSetValueEx!=null)
   this.OnSetValueEx(this,Query);
}

TComboBox.prototype.doCodeCallBack = function(dataset){
  this.value = dataset.fields(4).value;	
  this.element.value = dataset.fields(5).value;
  
  if(this.showValue)
   this.element.value = this.value;
   
  for(var i=0;i<dataset.fields.count-4;i++)
   this.results[i] = dataset.fields(4+i).value;
   
  this.doChange();
  this.doSetValue();
}

TComboBox.prototype.doCodeCallBack2 = function(results){
  this.value = results[0];	
 
  this.element.value = results[1];
  
  if(this.showValue)
    this.element.value = this.value;
  
  for(var i=0;i<results.length;i++)
  this.results[i] = results[i];
   
  this.doChange();
  this.doSetValue();  
}

TComboBox.prototype.doSelectAll = function(results){
  this.value = results[0];	
 
  this.element.value = results[1];
  
  if(this.showValue)
   this.element.value = this.value;
  
  for(var i=0;i<results.length;i++)
  this.results[i] = results[i];
  this.doChange();
  this.doSetValue();  
}

TComboBox.prototype.doTreeCallBack = function(node){
  var tree = (node.className=="TTreeView")? node:node.tree;

  if(tree.isChecked==1){
    this.value = tree.getCheckedsCode(",","");	
    this.results[0] = this.value;	  
	this.element.value = tree.getCheckedsText(",");

	this.results[1] = this.element.value ;
	this.results[2] = tree.getCheckedsId(",");
	
	this.valueEx = tree.getCheckedsCode(",","'");
	this.results[3] = this.valueEx;
  }else{
    this.value = node.getCode();	
  
    this.element.value = _$splitCodeAndName(node.getText(),".");
    this.results[0] = this.value;
    this.results[1] = this.element.value ;
  
    if(this.showValue)
      this.element.value = this.value;
  
    this.results[2] = node.getID();
  }
  
  this.doChange();
  this.doSetValue();  
}

TComboBox.prototype.readDataTest = function(){
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

TComboBox.prototype.readData = function(awOpen,qc){
  var result = true;	
  var nResult = 2;
  
  //是按回车,并且输入的值和上一次查找的值一样,直接返回
  if(!awOpen&&this.oldValue==this.element.value&&this.element.value!="") return result;
  
  var param = "";
  if(this.charCase==1) qc = qc.toUpperCase();
  var sparams = [];
  
  var pos  = _$AdjustPosition(this.element,this.width,this.height);
  var x = pos.left;
  var y = pos.top;
  
  var  attr = "dialogHeight:"+this.height+"px;dialogWidth:"+this.width+"px;status:0;help:0;scroll:off;"+
              "dialogLeft:"+x+"px;dialogTop:"+y+"px;";

  var url= (this.url.indexOf("?")>0) ? this.url+"&v="+qc:this.url+"?v="+qc;
  
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
  
  if(!awOpen){   //如果是按回车,先测试获取数据,如果没数据或者只有一条记录,就无需打开弹出窗口
    nResult = this.readDataTest();  //0-没数据,1-有一条记录,>1有多条记录
    result = nResult>0;
  }
  
  if(nResult>=2){
   if(typeof(this.sparams)!="undefined"&&this.sparams!=null){  
    param = "";	   
    for(var i=0;i<this.sparams.length;i++)
      param = param+"&p"+i+"="+this.sparams[i];
   }

   this.$openurl = url+param+"&lexiconid="+escape(this.sqlID)+"&lexiconidc="+escape(this.sqlIDC)+"&callatt="+this.CallAtt;
   
   if(this.BeforeOpen!=null) this.BeforeOpen(this,awOpen);
   
   result = window.showModalDialog(this.$openurl,this,attr);
  }
   
  return result;
}
/*
TComboBox.prototype.readData = function(qc){ //qc为查询条件
  var url;
  var param = "";
  var  attr = "dialogHeight:"+this.height+"px;dialogWidth:"+this.width+"px;status:0;help:0;scroll:off;";
  if(this.url.indexOf("?")>0)
   url = this.url+"&v="+qc;
  else url = this.url+"?v="+qc;
  
  if(typeof(this.params)!="undefined"&&this.params!=null) 
   for(var i=0;i<this.params.length;i++)
    param = param+"&param"+i+"="+this.params[i];
   
  window.showModalDialog(url+param,this,attr);
  //window.open(url+param);
}
*/

TComboBox.prototype.buttonClick = function(e){
  var vSrc = window.event.srcElement;	
  var cbox = vSrc.owner,url;
  
  if(cbox.isFixed)
    cbox.doPop();
  else	
    cbox.readData(true,"");
}

TComboBox.prototype.doKeyDown =function(e){
  var vSrc = window.event.srcElement;	
  var cbox = vSrc.owner;
  
  switch(event.keyCode){
	case 13:if(cbox.isFixed){
          	 if(cbox.element.value=="")   
              cbox.doPop();
            }else	
             cbox.readData(true,"");
            break;
	case 38://VK_UP
	        if(cbox.isFixed){
	         var itemCount = cbox.sqlIDC.length;
			 if(itemCount>0){
	          if(cbox.itemIndex<0) cbox.itemIndex = 0;
			  else if(cbox.itemIndex>0) cbox.itemIndex--;
			  cbox.element.value = cbox.sqlID[cbox.itemIndex];  	
			  cbox.value = cbox.sqlIDC[cbox.itemIndex]; 
			 }
			}
	        break;
	case 40://VK_DOWN
	        if(cbox.isFixed){
	         var itemCount = cbox.sqlIDC.length;
			 if(itemCount>0){
	          if(cbox.itemIndex<0) cbox.itemIndex = 0;
			  else if(cbox.itemIndex<itemCount-1)
				    cbox.itemIndex++;
			  cbox.element.value = cbox.sqlID[cbox.itemIndex];  	
			  cbox.value = cbox.sqlIDC[cbox.itemIndex]; 
			 }
			}
	        break;
  }
  if(cbox.OnKeyDown!=null)
   cbox.OnKeyDown(cbox,window.event)
}

TComboBox.prototype.doKeyUp =function(e){
  var vSrc = window.event.srcElement;	
  var cbox = vSrc.owner;
  switch(window.event.keyCode){
   case  8:
   case 46:cbox.value = cbox.element.value;
           if(cbox.hideElement!=null){
             cbox.hideElement.value = "";
			 cbox.results[2] = "";
		   }
           cbox.doChange();
  }
}

TComboBox.prototype.doChange =function(e){ 
  if(this.OnChange!=null)
   this.OnChange(this);
}
TComboBox.prototype.doSetValue =function(e){ 
  if(this.hideElement!=null)
   this.hideElement.value = this.value;
  if(this.OnSetValue!=null)
   this.OnSetValue(this);
}

TComboBox.prototype.setReadOnly =function(readOnly){
 this.element.readOnly = readOnly;
 this.button.disabled = readOnly;
}

TComboBox.prototype.clear =function(){
 this.element.value = "";
 this.value = "";
 if(this.hideElement!=null)
  this.hideElement.value = ""; 
}

TComboBox.prototype.docMouseDown = function(){
  var cbox = this.owner;
  var obj = event.srcElement;
  
  if(obj!=cbox.Div){
   cbox.Div.style.visibility = "hidden";	
  //cbox.Div.releaseCapture();	
   document.onmousedown = null;
   document.owner = null;
  }
}

TComboBox.prototype.onMouseDown = function(){
  var obj = event.srcElement;
  while(obj.tagName.toUpperCase()!="TR")
    obj = obj.parentNode; 
  var owner = obj.owner;
  owner.element.value = obj.childNodes[0].innerText;  
  owner.value = owner.sqlIDC[obj.rowIndex];
  owner.itemIndex = obj.rowIndex;
}

TComboBox.prototype.onMouseOver = function(){
  var obj = event.srcElement;
  while(obj.tagName.toUpperCase()!="TR")
    obj = obj.parentNode; 
  var owner = obj.owner;
  
  //alert(obj.tagName);
  if(owner.saveRow!=null){
    owner.saveRow.style.background = owner.saveBackGround;
	owner.saveRow.childNodes[0].style.color = owner.saveColor; 
  }
  
  owner.saveColor = obj.childNodes[0].style.color;	
  owner.saveBackGround = obj.style.background;
  obj.style.background = "#0000aa";
  obj.childNodes[0].style.color = "#ffffff";
  owner.saveRow = obj;
}

TComboBox.prototype.doPopKeyDown = function(){
	
}

TComboBox.prototype.doPop = function(){
 if(this.Div==null){
   this.Div = document.createElement("div");
   var itemHeight = this.element.clientHeight+2;
   var itemCount = (this.height==0)? 8:this.height;
   
   if(itemCount>this.sqlIDC.length) 
     itemCount = this.sqlIDC.length;
	 
   this.Div.style.width = this.element.clientWidth+this.width;
   this.Div.style.height = itemCount*itemHeight+4;
   this.Div.style.top = _$yPosition(this.element)+itemHeight;
   this.Div.style.left = _$xPosition(this.element);
   this.Div.style.position = "absolute";
   this.Div.style.zIndex = 100;
   this.Div.style.borderStyle = "solid";
   this.Div.style.borderColor = "#000000";
   this.Div.style.borderWidth = 1;
   //this.Div.style.padding = "3px";
   this.Div.style.background = "#ffffff";
   this.Div.style.overflow="auto"
   //this.Div.style.visibility = "hidden";
   document.body.appendChild(this.Div);
   var sHtml = "<table width=\"100%\" bgcolor=\"#ffffff\" "+
               "border=\"0\" cellspacing=\"0\" cellpadding=\"0\">"; 
   itemCount = this.sqlIDC.length;
   for(var i=0;i<itemCount;i++){
	 sHtml += "<tr style=\"cursor:hand\"><td height=\""+itemHeight+"\" style=\"padding-left:3px\">"+this.sqlID[i]+"</td></tr>";   
   }
   sHtml += "<table>";
   this.Div.innerHTML = sHtml;
   
   var table = this.Div.childNodes[0];
   for(var i=0;i<table.rows.length;i++){
	 table.rows[i].onmouseover = this.onMouseOver;
	 table.rows[i].onmousedown = this.onMouseDown;
	 table.rows[i].owner = this;
   }
   table.onkeydown = this.doPopKeyDown;
   this.Div.owner = this;
 }
 this.Div.style.visibility = ""; 
 document.onmousedown = this.docMouseDown;
 document.owner = this;
 this.Div.focus();
 //this.Div.setCapture();
}

//Radio数据封装
TRadio.prototype.OnKeyDown = null;
TRadio.prototype.OnChange = null;
TRadio.prototype.origRadio = null;

function TRadio(radios){
  this.Class = "RADIO";

  this.radios = new Array(radios.length);
  this.value = ""; 
  this.origRadio = null;
  for(var i=0;i<radios.length;i++){
   this.radios[i] = radios[i];
   this.radios[i].oldclick = this.radios[i].onclick;
   this.radios[i].onclick = this.doClick;
   this.radios[i].onkeydown = this.doKeyDown;   
   this.radios[i].owner = this;
   if(radios[i].checked){
    this.value = radios[i].value;
	this.origRadio = radios[i];
   }
  }
  __VCL.add(this);
}

TRadio.prototype.free = function(){
  for(var i=0;i<this.radios.length;i++){
   this.radios[i].owner = null;   
   this.radios[i].onclick = null;
   this.radios[i].onkeydown = null;
   this.radios[i] = null;
  }
}

//更新数据
TRadio.prototype.doClick = function(){
  var vSrc = window.event.srcElement;	
  vSrc.owner.value = vSrc.value;	
  if(vSrc!=vSrc.owner.origRadio&&vSrc.owner.OnChange!=null)
    vSrc.owner.OnChange(vSrc.owner,vSrc);
  if(vSrc.oldclick!=null)
    vSrc.oldclick();
  vSrc.owner.origRadio = vSrc; 
}

TRadio.prototype.setValue = function(value){
  for(var i=0;i<this.radios.length;i++)
   if(value==this.radios[i].value){
	this.radios[i].checked = true;
	this.value = value;
	break;
   }
}

TRadio.prototype.doKeyDown =function(e){
  var vSrc = window.event.srcElement;	
  if(vSrc.owner.OnKeyDown!=null)
   vSrc.owner.OnKeyDown(vSrc.owner,window.event)
}

//TTdRadio数据封装2015.08.10
TTdRadio.prototype.OnKeyDown = null;
TTdRadio.prototype.OnChange = null;
TTdRadio.prototype.origRadio = null;
TTdRadio.prototype.selectImgObj = null;

function TTdRadio(tdradios,values,selectIndex,unselectclass,selectclass){
  this.Class = "TDRADIO";

  this.tdradios = new Array(values.length);
  
  for(var i=0,j=0;i<tdradios.length;i++){
	if(typeof(tdradios[i].tagName)!="undefined")
	  this.tdradios[j++] = tdradios[i]; 
  }

  this.values = values;
  this.value = ""; 
  this.selectIndex = selectIndex;
  this.count = values.length;

  this.unselectclass = unselectclass;
  this.selectclass = selectclass;
  
  this.origtdRadio = null;
  
  for(var i=0;i<this.count;i++){
   
   this.tdradios[i].oldclick = this.tdradios[i].onclick;
   
   this.tdradios[i].owner = this;
   if(this.tdradios[i].className==unselectclass||this.tdradios[i].className==selectclass){
     this.tdradios[i].onclick = this.doClick;
     if(i==selectIndex||selectIndex==-1){
       this.value = values[i];
	   this.origtdRadio = this.tdradios[i];
	   selectIndex = i;
	   this.selectIndex = i;
     }
   }
  }
 
 this.hasImgObj = false;
 this.paint();
  __VCL.add(this);
}

TTdRadio.prototype.free = function(){
  for(var i=0;i<this.tdradios.length;i++){
   this.tdradios[i].owner = null;   
   this.tdradios[i].onclick = this.tdradios[i].oldclick;
   this.tdradios[i].onkeydown = null;
   this.tdradios[i] = null;
  }
}

TTdRadio.prototype.adjustImgPos = function(vSrc,owner){
  var xoff = _$xPosForParent(vSrc,owner.ctrlParent) + (parseInt(vSrc.clientWidth)-owner.selectImgWidth)/2;
  var yoff = _$yPosForParent(vSrc,owner.ctrlParent) + (parseInt(vSrc.clientHeight)-2*owner.selectImgHeight)/2;
  owner.selectImgObj.style.left = xoff;
  //owner.selectImgObj.style.top = yoff;	
}

TTdRadio.prototype.setSelectImgObj = function(ImgObj){
  this.selectImgWidth = parseInt(ImgObj.width);	
  this.selectImgHeight = parseInt(ImgObj.height);
  this.selectImgObj = ImgObj;
  this.ctrlParent = ImgObj.offsetParent;
  this.hasImgObj = true;
  
  this.adjustImgPos(this.tdradios[this.selectIndex],this);
}
//更新数据
TTdRadio.prototype.doClick = function(){
  var vSrc = window.event.srcElement;
  var owner = vSrc.owner;
    	
  if(owner!=null){
    for(var i=0;i<owner.count;i++){
	
	  if(owner.tdradios[i]==vSrc){
	   
        if(vSrc!=owner.origtdRadio&&owner.OnChange!=null)
          owner.OnChange(owner,vSrc,i);
		
	    if(owner.tdradios[i].oldclick!=null)
          owner.tdradios[i].oldclick();

	    owner.selectIndex = i;
	    owner.value = owner.values[i];	
        owner.origtdRadio = vSrc; 
	  
	    if(owner.hasImgObj){
	  	  owner.adjustImgPos(vSrc,owner);
	    }
	  }
    }
    owner.paint();
  }
}

TTdRadio.prototype.setValue = function(value){
  for(var i=0;i<this.count;i++)
    if(value==this.values[i]){
	  this.selectIndex = i;
	  this.value = value;	
      this.origtdRadio = this.tdradios[i]; 
	  this.paint();
	  break;
    }
}

TTdRadio.prototype.paint = function(){
  for(var i=0;i<this.count;i++)
    if(this.tdradios[i].className==this.selectclass||
	        this.tdradios[i].className==this.unselectclass)
      if(this.selectIndex==i){
        this.tdradios[i].className = this.selectclass;
      }else{
	    this.tdradios[i].className = this.unselectclass;	
	  }
}

//TCheckBox,数据选择控件
TCheckBox.prototype.OnKeyDown = null;
TCheckBox.prototype.OnChange = null;
function TCheckBox(element,checkedValue,unCheckedValue){
  this.Class = element.tagName;
  this.element = element;
  this.element.owner = this;  
  this.element.onclick = this.doClick;
  this.element.onkeydown = this.doKeyDown;
  this.checkedValue = (typeof(checkedValue)=="undefined")?"1":checkedValue;
  this.unCheckedValue = (typeof(unCheckedValue)=="undefined")?"0":unCheckedValue;    
  
  if(this.element.checked){
   this.value = this.checkedValue;
  }else{
   this.value = this.unCheckedValue;
  }
  __VCL.add(this);
}

TCheckBox.prototype.free = function(){
  this.element.owner = null;  
  this.element.onclick = null;
  this.element.onkeydown = null;
  this.element = null;  
}

TCheckBox.prototype.doClick = function(e){
 var src = window.event.srcElement;
 if(src.checked)
  src.owner.value = src.owner.checkedValue;
 else src.owner.value = src.owner.unCheckedValue; 
 if(src.owner.OnChange!=null)
  src.owner.OnChange(src.owner);
 
}

TCheckBox.prototype.setValue = function(value){
 this.element.checked = value;	 
 if(value)
  this.value = this.checkedValue;
 else this.value = this.unCheckedValue; 
}

TCheckBox.prototype.getValue = function(){
 return (this.element.checked)?this.element.value:"";
}

TCheckBox.prototype.doKeyDown =function(e){
  var vSrc = window.event.srcElement;	
  if(vSrc.owner.OnKeyDown!=null)
   vSrc.owner.OnKeyDown(vSrc.owner,window.event)
}

//TSpinEdit,数据选择控件
TSpinEdit.prototype.OnKeyDown = null;
TSpinEdit.prototype.OnChange = null;
function TSpinEdit(element,buttonUp,buttonDown,insc){
  this.Class = element.tagName;
  this.insc = insc;
  this.maxValue = 0;
  this.minValue = 0;
  this.element = element;
  this.element.owner = this;  
  this.element.onkeydown = this.doKeyDown;
  
  this.buttonUp = buttonUp;
  this.buttonUp.owner = this;
  this.buttonDown = buttonDown;
  this.buttonDown.owner = this;
  
  this.buttonUp.onclick = this.buttonUpClick;
  this.buttonDown.onclick = this.buttonDownClick;
  __VCL.add(this);
}

TSpinEdit.prototype.free = function(){
  this.element.owner = null;  
  this.element.onkeydown = null;
  this.buttonUp.owner = null;
  this.buttonUp.onclick = null;
  this.buttonDown.owner = null;
  this.buttonDown.onclick = null;
  this.buttonUp = null;
  this.buttonDown = null;
  this.element = null;  
}

TSpinEdit.prototype.buttonUpClick = function(e){
 var src = window.event.srcElement;
 var sedit = src.owner;
 if(sedit.maxValue==0||parseFloat(sedit.element.value)+sedit.insc<=sedit.maxValue){
  sedit.element.value = parseFloat(sedit.element.value)+sedit.insc;
  if(sedit.OnChange!=null)
   sedit.OnChange(sedit);
 }
}

TSpinEdit.prototype.buttonDownClick = function(e){
 var src = window.event.srcElement;
 var sedit = src.owner;
 if(sedit.minValue==0||parseFloat(sedit.element.value)-sedit.insc>=sedit.minValue){
  sedit.element.value = parseFloat(sedit.element.value)-sedit.insc;
  if(sedit.OnChange!=null)
   sedit.OnChange(sedit);
 }
}

TSpinEdit.prototype.doKeyDown =function(e){
  var vSrc = window.event.srcElement;	
  if(vSrc.owner.OnKeyDown!=null)
   vSrc.owner.OnKeyDown(vSrc.owner,window.event)
}

/*日期*/
TDate.prototype.OnKeyDown = null;
TDate.prototype.spChar = _date_defspChar;
TDate.prototype.isMonth = false;
TDate.prototype.OnChange = null;
TDate.prototype.isMonthDay = false;

function TDate(element,button,isMonth,isReadOnly){
  this.Class = element.tagName;

  this.element = element;
  this.element.owner = this;  
  
  this.oldOnKeyDown = this.element.onkeydown;

  this.element.onkeydown = this.doKeyDown;

  this.button = button;
  this.button.onclick = this.buttonClick;
  this.button.owner = this; 

  this.isMonth = typeof(isMonth)!="undefined"&&isMonth;
  this.element.isMonth = this.isMonth;   
  
  this.element.readOnly = typeof(isReadOnly)!="undefined"&&isReadOnly;
  this.button.disabled = this.element.readOnly;
  
  __VCL.add(this);    
}

TDate.prototype.free = function(){
  this.element.owner = null;  	
  this.element.onkeydown = null;  
  this.element = null;

  this.button.onclick = null;
  this.button.owner = null; 
  this.button = null;
}

TDate.prototype.setValue = function(value){
 if(this.isMonth)
  this.element.value = value.substring(0,7);
 else
  if(this.isMonthDay)
   this.element.value = value.substring(5,10);
  
 if(this.OnChange!=null)
  this.OnChange(this);
 this.focus();
 return true;
}

TDate.prototype.setPropertys = function(props){
  for(var i in props)
   this[i] = props[i];
} 

TDate.prototype.buttonClick = function(e){
  var vSrc = window.event.srcElement;	
  var cbox = vSrc.owner;
  
  var pos  = _$AdjustPosition(cbox.element,232,260);
  var x = pos.left;
  var y = pos.top;
  
  popUpCalendar(cbox.button,
	            cbox.element,
				"yyyy"+cbox.spChar+"mm"+cbox.spChar+"dd",
				cbox); 
}

TDate.prototype.doKeyDown =function(e){
  var vSrc = window.event.srcElement;	
  
  var cbox = vSrc.owner;
  if(window.event.keyCode==13){
   cbox.buttonClick();
   return;
  }
  
  if(cbox.oldOnKeyDown!=null)
   cbox.oldOnKeyDown(cbox,window.event);
  if(cbox.OnKeyDown!=null)
   cbox.OnKeyDown(cbox,window.event);
}

TDate.prototype.focus = function(){
 this.element.focus();	
 this.element.select(true);
}
	
function TShowWait(name,width,height,caption){
 this.name = name;	
 var l = (screen.availWidth-width)/2;
 var t = 150;  //(screen.availHeight-height)/2;
 document.write("<div id=\"bluceshowwait_"+name+"\" style=\"left:"+l+"px;top:"+t+"px;width:"+width+"px;height:"+height+"px;"+
				 "border:2px solid #0000aa;position:absolute;z-index:9999; background:#eeeeee;visibility:hidden;\">\n"); 	
 document.write(" <table width=\"100%\" height=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n");
 document.write("   <tr>\n");
 document.write("     <td style=\"font-size:12px\" id=\"bluecpanel_"+name+"\" align=\"center\">"+caption+"</td>\n");
 document.write("   </tr>\n");
 document.write(" </table>\n");
 document.write("</div>");
 __VCL.add(this);  
}

TShowWait.prototype.free = function(){
}

function _$showWait(name,width,height,caption){
 var pshowwait = document.getElementById("bluceshowwait_"+name);	
 var ppanel = document.getElementById("bluecpanel_"+name);	
 if(pshowwait==null) return;

 ppanel.innerText = caption;
 pshowwait.style.visibility = "";	
}

function _$hideWait(name){
  var pshowwait = document.getElementById("bluceshowwait_"+name);
  if(pshowwait!=null)
  pshowwait.style.visibility = "hidden";
}


function TIframePageTab(pageDiv,divcount,pName,class0,class1){
  this.owner = pageDiv;
  this.name = pName;
  this.divs = null;
  this.class0 = class0;
  this.class1 = class1;
  this.tabCount = 0;
  this.autoReplace = false;
 
  this.isUse = new Array(divcount);
  this.idBuf = new Array(divcount); 
  this.ttimes = new Array(divcount); 
  this.divIndex = new Array(divcount); 
 
  this.divCount = divcount;
 
  for(var i=0;i<divcount;i++){
    this.isUse[i] = 0;
    this.idBuf[i] = "";
    this.ttimes[i] = 0;
    this.divIndex[i] = 0;
  }

  this.pageCount = 0;
  this.timestmap = 0;
  __VCL.add(this);     
}

TIframePageTab.prototype.free = function(){ 
  for(var i=1;i<this.pageCount;i++){
    if(typeof(this.row.cells[i].childNodes[0].childNodes[2])!="undefined")
      this.row.cells[i].childNodes[0].childNodes[2].onclick = null;	 
    this.row.cells[i].onclick = null;
  }
  this.row.owner = null; 
  this.row = null; 
  this.table = null;
  this.owner = null;
  this.isUse = null;
  this.idBuf = null;
  this.divIndex = null;
  this.ttimes = null;
}

TIframePageTab.prototype.setDiv = function(divs){
  this.divs = divs;	
}

TIframePageTab.prototype.OnClick = function(){
  var cell = event.srcElement;
  while(cell.tagName.toUpperCase()!="TD")
   cell = cell.parentNode;	  
  var row = cell.parentNode;
 
  if(row.owner.activeTab!=cell.cellIndex){
    row.owner.closeActiveTab(row.owner.activeTab);
    row.owner.changeActiveTab(cell.cellIndex);
  }
}

TIframePageTab.prototype.OnClose = function(){
  var cell = event.srcElement;
  while(cell.tagName.toUpperCase()!="TD")
    cell = cell.parentNode;	  
  var row = cell.parentNode;

  row.owner.removePageTab(cell.cellIndex);
}

TIframePageTab.prototype.createPageTab = function(caption,h){
  document.write("<table id=\"pagetab_"+this.name+"\" height=\""+h+"\" border=\"0\" style=\"color:#000033;font-size:13px; padding:0px; margin:0px\">\n");
  document.write("<tr>\n");
  document.write("<td class=\""+this.class1+"\">"+"<nobr><span style='font-size:13px'>"+caption+"</span>&nbsp;"+
                 "<span></span>&nbsp;"+
				 "<span style='display:none'>div0</span>"+
				 "<span style='display:none'>home</span><span style='display:none'>0</span></nobr>"+"</td>\n");
  document.write("</tr>\n");
  document.write("</table>\n");
  
  this.table = document.getElementById("pagetab_"+this.name);
  this.row = this.table.rows[0];
  this.row.owner = this;
  this.activeTab = 0;
  this.pageCount = 1;
 
  this.isUse[0] = 0;
  this.divIndex[0] = 0;
  this.tabCount = 0;
 
  this.row.cells[this.activeTab].onclick = this.OnClick;
}

TIframePageTab.prototype.addPageTab = function(id,caption){
  var finddiv = function(sender){
	for(i=1;i<sender.divCount;i++){
	  dname = "div"+i;

	  result = false;
	  for(j=1;j<sender.row.cells.length&&!result;j++){
	    cell = sender.row.cells[j];
		result = cell.childNodes[0].childNodes[4].innerText == dname; 
	  }
	  if(!result) return dname;
	}
	return "";
  }
  
  var divname = finddiv(this);
  //alert("divname="+divname);
  this.timestmap++;
  var cell = this.row.insertCell(),j = 1;
  var s = caption.copyex(0,12);
  
  cell.innerHTML = "<nobr><span style='font-size:13px'>"+s+"</span>&nbsp;"+
                   "<span class='glyphicon glyphicon-remove-sign'></span>&nbsp;"+
				   "<span style='display:none'>"+divname+"</span>"+
				   "<span style='display:none'>"+id+"</span><span style='display:none'>"+this.timestmap+"</span></nobr>";
  cell.title = caption;

  cell.className = this.class0;
  cell.onclick = this.OnClick;
  cell.childNodes[0].childNodes[2].onclick = this.OnClose;

  this.closeActiveTab(this.activeTab);
  this.changeActiveTab(cell.cellIndex); 
  return cell.cellIndex;
}

TIframePageTab.prototype.removePageTab = function(nIndex){
 
  if(nIndex<1) return;

  var cell = this.row.cells[nIndex];
  isActive = _$(cell.childNodes[0].childNodes[4].innerText).style.display=="";
  
  cell.childNodes[0].childNodes[2].onclick = null;	 
  cell.onclick = null;
  
  onIndex = nIndex;

  if(isActive){  //关闭的是活动页
    this.closeActiveTab(nIndex);
    this.changeActiveTab(0);  
  }else{
	if(this.activeTab>onIndex)
      this.activeTab = this.activeTab-1;
  }
  this.row.deleteCell(onIndex);
}

TIframePageTab.prototype.changeActiveTab = function(nIndex){
  if(this.activeTab==nIndex) return;
  this.activeTab = nIndex;
  cell = this.row.cells[this.activeTab];
  div = _$(cell.childNodes[0].childNodes[4].innerText);
  div.style.visibility = "";
  div.style.display = "";	 
  cell.className = this.class1;
}

TIframePageTab.prototype.closeActiveTab = function(nIndex){
	
  cell = this.row.cells[nIndex];
  div = _$(cell.childNodes[0].childNodes[4].innerText); 
  div.style.visibility = "hidden";
  div.style.display = "none";	
  cell.className = this.class0;
  this.activeTab = -1;
}

TIframePageTab.prototype.setActiveTab = function(id,caption){
 var j=1,mini=10000000,k=0;	
 for(j=1;j<this.row.cells.length;j++){
   cell = this.row.cells[j];
   if(cell.childNodes[0].childNodes[5].innerText==id){
     this.timestmap++;
     cell.childNodes[0].childNodes[6].innerText = this.timestmap;
     this.changeActiveTab(j);	  
     return "opened";
   }
 }
 
 if(this.row.cells.length>=this.divCount)
   if(!this.autoReplace){
     alert("最多可以打开"+this.divCount+"个页面,请先关闭部门已打开的页面.");	 
     return "opened"; 	
   }else{
     return "opened";	
   }

  var j = this.addPageTab(id,caption);

  return "work"+j;
} 

function _$getOps(afx,checkBoxs){
  var n = checkBoxs	.length;
  var checkNum = 0;
  var s = "";
  for(var i=0;i<n;i++)
   if(checkBoxs[i].checked){
	 checkNum++;   
	 if(checkNum==1) s = checkBoxs[i].value;
	 else s = s+","+checkBoxs[i].value;
   }
  if(checkNum==n||checkNum==0)
   return "";
  else
   return afx+" ("+s+")";
}

TPageControl.prototype.activeTabColor = "#eeeeee";
TPageControl.prototype.tabColor = "#ffffff";
TPageControl.prototype.OnChange = null;
TPageControl.prototype.OnChanging = null;

function TPageControl(TabSheets,activeTab,tabColor,activeTabColor){
  this.tabSheets = TabSheets;
  this.activeTab = -1;	 
  this.activeTabColor = activeTabColor;
  this.tabColor = tabColor;
  var tabnum = this.tabSheets.length;
  for(var i=0;i<tabnum;i++){
    this.tabSheets[i].onclick = this.doClick;
	this.tabSheets[i].owner = this;
	this.tabSheets[i].style.background = this.tabColor;
  }
  this.changeTab(activeTab);	
  __VCL.add(this);	 
}

TPageControl.prototype.free = function(){
  var tabnum = this.tabSheets.length;
  for(var i=0;i<tabnum;i++)
    this.tabSheets[i].onmousedown = null;	
}

TPageControl.prototype.changeTab=function(nTabIndex){
  if(nTabIndex!=this.activeTab){
	if(this.activeTab>-1){  
     tab = this.tabSheets[this.activeTab];
	 tab.style.background = this.tabColor;
	 tab.style.borderBottomWidth = "1px";
	}
    this.activeTab = nTabIndex;
	tab = this.tabSheets[this.activeTab];
	tab.style.background = this.activeTabColor;
	tab.style.borderBottomWidth = "0px";
  }
}

TPageControl.prototype.getTabIndex=function(tab){
  var tabnum = this.tabSheets.length;
  for(var i=0;i<tabnum;i++)
   if(tab==this.tabSheets[i])
    return i;
  return -1;	
}

TPageControl.prototype.doClick = function(e){ 
  var vSrc = window.event.srcElement;	
  var sender = vSrc.owner;
  nIndex = sender.getTabIndex(vSrc); 	  
  if(nIndex!=sender.activeTab&&
     (sender.OnChanging==null||sender.OnChanging(sender,nIndex))){
   sender.changeTab(nIndex);
   if(sender.OnChange!=null){
  
    sender.OnChange(sender,nIndex);
   }
  }
}

TPageControlEx.prototype.activeTabColor = "#eeeeee";
TPageControlEx.prototype.tabColor = "#ffffff";
TPageControlEx.prototype.OnChange = null;
TPageControlEx.prototype.OnChanging = null;

function TPageControlEx(TabSheets,TabBodys,activeTab,tabColor,activeTabColor){
  this.tabSheets = TabSheets;
  this.TabBodys = TabBodys;
  this.activeTab = -1;	 
  this.activeTabColor = activeTabColor;
  this.tabColor = tabColor;
  var tabnum = this.tabSheets.length;
  for(var i=0;i<tabnum;i++){
    this.tabSheets[i].onclick = this.doClick;
	this.tabSheets[i].owner = this;
	this.tabSheets[i].style.background = this.tabColor;
	if(i==activeTab)
     this.TabBodys[i].style.display = "";	
	else
	 this.TabBodys[i].style.display = "none";	
  }
  this.changeTab(activeTab);	
  __VCL.add(this);	 
}

TPageControlEx.prototype.free = function(){
  var tabnum = this.tabSheets.length;
  for(var i=0;i<tabnum;i++)
    this.tabSheets[i].onmousedown = null;	
}

TPageControlEx.prototype.changeTab=function(nTabIndex){
  if(nTabIndex!=this.activeTab){
	if(this.activeTab>-1){  
     tab = this.tabSheets[this.activeTab];
	 tab.style.background = this.tabColor;
	 tab.style.borderBottomWidth = "1px";
	 this.TabBodys[this.activeTab].style.display = "none";	
	}
    this.activeTab = nTabIndex;
	tab = this.tabSheets[nTabIndex];
	tab.style.background = this.activeTabColor;
	tab.style.borderBottomWidth = "0px";
	this.TabBodys[nTabIndex].style.display = "";	
  }
}

TPageControlEx.prototype.getTabIndex=function(tab){
  var tabnum = this.tabSheets.length;
  for(var i=0;i<tabnum;i++)
   if(tab==this.tabSheets[i])
    return i;
  return -1;	
}

TPageControlEx.prototype.doClick = function(e){ 
  var vSrc = window.event.srcElement;	
  var sender = vSrc.owner;
  nIndex = sender.getTabIndex(vSrc); 	  
  if(nIndex!=sender.activeTab&&
     (sender.OnChanging==null||sender.OnChanging(sender,nIndex))){
   sender.changeTab(nIndex);
   if(sender.OnChange!=null){
     sender.OnChange(sender,nIndex);
   }
  }
}

