<!--本地数据封装 蓝仕红设计 2003-2017年-->
var __oXmlHttp = null;
function getXmlHttp(){
 if(__oXmlHttp==null){	
   if(window.ActiveXObject)
     __oXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
   else	 
     if(window.XMLHttpRequest)
       __oXmlHttp = new XMLHttpRequest();
     else
       __oXmlHttp = null;
 }
 return __oXmlHttp;  
}

    
<!--数据集处理函数-->
var __testdate1 = null;
var __testdate2 = null;
/**--四舍五入函数*/  
function getRound(value,n){
 var result = parseFloat(value,10);
 return result.toFixed(n)+"";
/*旧代码
 var result = value;
 if(n != 0)
  result = Math.round(Math.pow(10,n)*value)/Math.pow(10,n);
 return result+"";  */
}
/*判断传入的参数num是否为有效的数字，如果不是，返回repnum，是，返回num*/
function nvl(num, repnum){
 if (isNaN(num)||num==null||num==""||num==" ")
  return repnum;
 return num;
}

function nullTo(value,defaultValue){
 if(value==null||value=="")
  return defaultValue;
 return value; 
}
/*产生n个空格*/
function formatSpaces(n){
 var result = "";
 for(var i=0;i<n;i++)
  result += " ";
 return result;
}

/*把时间格式化成yyyy.mm.dd格式*/
function getFormatDate(pdate){
 var m = 1+pdate.getMonth();
 return ""+pdate.getFullYear()+"."+m+"."+pdate.getDate();
}

function $rightTrim(value){
 value = value+"";
 if(value!=null&&value!=""){	
  var l = getLength(value);
  var i = l-1;
  for(;i>=0&&value.charCodeAt(i)==32;i--);
  if(i<l-1) value = value.substring(0,i+1);
 }
 return value;	
}

function $Value(value){
 var result = "";
 var s = value.toString();
 if(s!=""){
	 var vl = s.length;
	 for(var i=0;i<vl;i++){
	  if(s.substring(i,i+1)!=",")
		result = result+s.substring(i,i+1);
	 }
 }
 
 return result;
}
/**字段类定义*/
TField.prototype.index = 0; 			// 字段索引
TField.prototype.sField = null;			// 数据岛字段
TField.prototype.dataset = null;		// 关联的数据集
TField.prototype.fieldName = "";		// 字段名称
TField.prototype.shortName = "";        // 字段别名
TField.prototype.dataType  = -1;		// 数据类型
TField.prototype.keyField = false;		// 是主键
TField.prototype.size = 0;				// 宽度
TField.prototype.precision = 15;		// 精度
TField.prototype.isNull = false;		// 可空
TField.prototype.isNullEx = true;     //  草稿可空
TField.prototype.isPassword = false;	// 按密码显示
TField.prototype.readOnly = false;		// 只读
TField.prototype.sumValue = 0.0;	    // 数字类型的合计值
TField.prototype.maxValue = "";			// 当前最大值
TField.prototype.minValue = "";			// 当前最小值
TField.prototype.oldValue = "";			// 旧值
TField.prototype.postValue = "";		// post之前的值
TField.prototype.priorValue = "";		// 上次的值 
TField.prototype.oValue = "";		    
TField.prototype.rightTrim = true;      //是否去掉右边的空格
TField.prototype.srChange = false;      //记录设置为保存状态时,字段是否发生变化
TField.prototype.displayWidth = 0;		// 显示宽度
TField.prototype.displayLabel = "";		// 显示标题
TField.prototype.displayFormat = "";	// 显示格式
TField.prototype.constrant = "";        // 约束表达式
TField.prototype.errorMsg = "";         // 约束提示
TField.prototype.format = "";           // 格式约束
TField.prototype.formatErr = "";        // 格式提示
TField.prototype.OnChanging = false;     //正在响应OnChange事件
TField.prototype.OnChange = null;
TField.prototype.OnChangeOld = null;
TField.prototype.OnChangeEx = null;

TField.prototype.OnChangeInnerCall = null;

TField.prototype.awOpen = false;
TField.prototype.tag = 0;
TField.prototype.charCase = 0;          //1-大写,2-小写

/*构造函数*/
function TField(dataset){
  this.dataset = dataset;
  this.sField = null;
  this.isSetValue = false;
}

/*设置字段属性*/
TField.prototype.setFieldProp=function(props){
  var oFieldName = this.fieldName;
  for(var i in props){
   this[i] = props[i];
  }
  if(oFieldName!=this.fieldName){
   this.shortName = this.dataset.shortNameByName[this.fieldName];
   this.sField  = this.dataset.fieldByName[this.fieldName].sField;
  }
}

/*设置字段名称*/
TField.prototype.setFieldName=function(fieldName){
  this.fieldName = fieldName;
  this.shortName = this.dataset.shortNameByName[this.fieldName];
  this.sField  = this.dataset.fieldByName[this.fieldName].sField;
}

/*设置字段值*/
TField.prototype.setFieldValue=function(value){
  if(this.sField!=null){
   this.dataset.origField = this;	   //当前变化的字段
   if(this.isNumberType())
    this.sField.value = parseFloat($Value(value),10)+"";
   else{
	  var v = this.rightTrim? $rightTrim(value):value;
	  switch(this.charCase){
		case 1:
		     v = v.toUpperCase();
		     break;
		case 2:  
		     v = v.toLowerCase();
		     break;
	  }
      this.sField.value = v;
   }
   this.srChange = this.dataset.__saveRecord;
  }
}

/*获取字段值*/
TField.prototype.getFieldValue=function(){
  if(this.sField!=null){
	  
   if(this.isNumberType()){	  
    if(isNaN(this.sField.value)||this.sField.value==""||this.sField.value==null) return 0;
	else return parseFloat(this.sField.value,10);
   }
   return this.sField.value;
  }
  else return "";
}

TField.prototype.$Inner = function(format,b0Space){
 var result = this.getFieldValue();
 var datatype = this.DataType;

 if(b0Space&&result!=""){
	 if(parseFloat(result)==0) result = "";
	 else result = parseFloat(result);
 }
 
 if(result!=""&&typeof(format)!="undefined"&&format!=""){
   if(datatype==91||format.indexOf("y")>-1)  //日期
     result = formatDateTime(format,result);
   else
     result = formatFloat(format,parseFloat(result));
 }
 else
  if(result!=""&&((datatype>=2&&datatype<=7)||datatype<=-5))
    result = parseFloat(result);

 return result;	
}

TField.prototype.$ = function(){
  return this.getFieldValue();	
}

TField.prototype.getPassWord=function(){
 var nLen = getLength(this.getFieldValue());
 var result = "";
 if(nLen>0)
  result = stringOfChar(nLen,"*");
 return result; 
}

/*获取字段值*/
TField.prototype.getDisplayText=function(){
  var value = "";	
  if(this.sField!=null){
   value = this.sField.value;
   if(value!=null&&value!="")
    if(this.displayFormat!=""){
     value = formatFloat(this.displayFormat,value);
	}else
	 if((this.dataType==2||this.dataType==3)&&value!=""&&this.precision>0)
	   value = parseFloat(value,10).toFixed(this.precision);
  }
  return value;
}

/*获取字段值*/
TField.prototype.getValueZeroToNone=function(zeroToNone,displayFmt){
  var value = "";	
  var sFmt = this.displayFormat;
  if(typeof(displayFmt)!="undefined")
   sFmt = displayFmt;
  
  if(this.sField!=null){
   value = this.sField.value;	  
   if(value!=""){
    if(this.isNumberType()){
     if(zeroToNone&&parseFloat(value,10)==0)
	  value = "";   
	 else 
	  if(sFmt!="")
       value = formatFloat(sFmt,value);
	  else 
	   if((this.dataType==2||this.dataType==3)&&this.precision>=0)
	    value = parseFloat(value,10).toFixed(this.precision);
    }else
	 if(sFmt!="")
      value = formatFloat(sFmt,value);
   }
  } 
  return value;
}

/*获取字段值*/
TField.prototype.getSumDisplayText=function(zeroToNone,displayFmt){
  var value = this.sumValue+"";	
  
  var sFmt = this.displayFormat;
  if(typeof(displayFmt)!="undefined")
   sFmt = displayFmt;
   
  var zton = typeof(zeroToNone)!="undefined"&&zeroToNone;
  if(zton&&parseFloat(this.sumValue,10)==0)
   value = "";
  else{ 
   if(sFmt!="")
    value = formatFloat(sFmt,value);
   else
    if((this.dataType==2||this.dataType==3)&&value!="")
 	 value = parseFloat(value,10).toFixed(this.precision);
  }
  return value; 
}

TField.prototype.isNumberType=function(){
 return (this.dataType>=2&&this.dataType<=7)||this.dataType<=-5;
}

TField.prototype.isInteger=function(){
 return (this.dataType>=4&&this.dataType<=5)||this.dataType<=-5||
         ((this.dataType>=2&&this.dataType<=3)&&this.precision<=0);
}

TField.prototype.isFloat=function(){
 return (this.dataType>=6&&this.dataType<=7)||
         ((this.dataType>=2&&this.dataType<=3)&&this.precision>0);
}

TField.prototype.isDate=function(){
 return this.dataType==91||this.dataType==93;
}

TField.prototype.isClearStatus = function(){
  return !this.awOpen&&this.isNull&&this.sField.value==""&&this.oldValue!="";
}

/*索引定义*/
//根据索引indexObj情况比较recordset两个记录的大小,大于返回1,等于返回0,小于返回-1
function compareRecord(recordset,indexObj,sValue,dPos){
 var oValue = new Array(indexObj.indexFieldCount);
  
 var rrow = recordset[dPos-1];
 
 for(var i=0;i<indexObj.indexFieldCount;i++)
  oValue[i] = rrow.getAttribute(indexObj.shortNames[i]);

 var result = 0,bMark = false,cMark;

 for(var i=0;i<indexObj.indexFieldCount;i++){
  bMark = sValue[i]==oValue[i];	 

  if(!bMark){
   if(indexObj.dataTypes[i]==2) //是数字	 
    cMark = parseFloat(sValue[i])>parseFloat(oValue[i]);
   else cMark = sValue[i]>oValue[i];	
   
   //降序,大的值排在前面,升序,小的排在前面
   if((cMark&&indexObj.sortoptions[i]==2)||(!cMark&&indexObj.sortoptions[i]==1))  
    result = -1
   else result = 1;	
   break;
  }
 }
 return result;
}

//索引节点,aPos表示记录号
function TIndexNode(aPos,parentNode){
 this.aPos = aPos;	
 this.parentNode = parentNode;
 this.leftNode = null;
 this.rightNode = null;
 this.frontNode = null;
 this.nextNode = null;
 this.value = "";
}

TIndexNode.prototype.free = function(){
 this.aPos = -1;	
 this.leftNode = null;
 this.rightNode = null;
 this.frontNode = null;
 this.nextNode = null;
 this.parentNode = null;
}


TIndexDef.prototype.shortNames = null;      //原始字段名
TIndexDef.prototype.dataTypes = [];       //数据类型  
TIndexDef.prototype.sortoptions = [];  //字段排序选项,asc(默认)=1,desc=2
TIndexDef.prototype.options = 0;       //选项,ioUnique=1
TIndexDef.prototype.recordIDs = [];    //记录标识ID
TIndexDef.prototype._keyErrorMsg = "索引值重复错误!";  //主健重复提示的值

function TIndexDef(owner,indexName,fieldInfos,options,errMsg){
  this.owner = owner;
  this.dataset = owner.dataset;
  this.indexName = indexName;	
  this.indexFieldCount = fieldInfos.length;
  this.firstNode = null;  //链表头
  this.rootNode = null;   //二叉树根节点
  this.origNode = null;
  this.shortNames = [];
  this.fieldNames = [];
  this.isUpdate = true;
  this.nRecNo = 0;
  
  if(typeof(errMsg)!="undefined")
   this._keyErrorMsg = errMsg;
  
  var j = owner.indexFieldNames.length;
  
  for(var i=0;i<fieldInfos.length;i++){
	var fs = fieldInfos[i].split(" ");  
	var field = this.dataset.fieldByName[fs[0]];
	
    this.shortNames[i] = field.shortName; 	   
	this.fieldNames[i] = field.fieldName; 	  
	
	this.dataTypes[i] = field.dataType;
	owner.indexFieldNames[j] = field.fieldName;
	j++;
	
	if(fs.length>1&&fs[1].toUpperCase()=="DESC")
	  this.sortoptions[i] = 2;
	else this.sortoptions[i] = 1;  
  }
  this.options = options;
  this.initSort();
}

TIndexDef.prototype.free = function(){
 this.clearNode();

 
 for(var i=0;i<this.fieldNames.length;i++)
  for(var j=0;j<this.owner.indexFieldNames.length;j++)
   if(this.fieldNames[i]==this.owner.indexFieldNames[j]){
	this.owner.indexFieldNames[j] = null;
	break;
   }

 this.dataset = null;
 this.owner = null;
 this.fieldNames = null;
 this.shortNames = null;
}

function showIndexValue(node){
  var testStr = "";
  var i = 1;
  while(node!=null){
   testStr = testStr+"\n"+i+":"+node.value+" ("+node.aPos+")"; //recordset("F1").value+",";
   i++;
   node = node.nextNode;
  }  
  alert("link:\n"+testStr); 
}

function showIndexValueb(node){
  var testStr = "";
  var i = 1;
  while(node!=null){
   testStr = testStr+"\n"+i+":"+node.value+" ("+node.aPos+")"; //recordset("F1").value+",";
   i++;
   node = node.frontNode;
  }  
  alert("link:\n"+testStr); 
}

function showIndexValue2(node){
  var testStr = "";
  var i = 1;
	
  var findN = function(vNode){
   if(vNode.leftNode!=null) findN(vNode.leftNode);
      
   testStr = testStr+"\n"+i+":"+vNode.value; //recordset("F1").value+",";
   i++;
   if(vNode.rightNode!=null) findN(vNode.rightNode);
  }	
  
  if(node!=null) findN(node);
  
  alert("tree:\n"+testStr); 
}
//清除所有接点
TIndexDef.prototype.clearNode = function(){
  var nnode = this.firstNode;
  var node;
  while(nnode!=null){
	node = nnode;
	nnode = node.nextNode;	
	node.nextNode = null;
	node.frontNode = null;	
    node.leftNode = null;
	node.rightNode = null;
	node.parentNode = null;
	node = null;
  }
  this.firstNode = null;
  this.rootNode = null;
  this.origNode = null;  
}

TIndexDef.prototype.addNode = function(recordset,sValue,dPos){
	
  if(this.rootNode==null){	
   this.firstNode = new TIndexNode(1,null);
   this.firstNode.value = sValue[0];
   this.rootNode = this.firstNode;
   this.origNode = this.firstNode;
   this.lastNode = this.firstNode;
   return 0;
  }

  var rNode = this.rootNode,tNode,node;
  var fhLNode = null,fhRNode = null;   //第一个具有左/右分支的节点
  
  var k = 0,result = 0;
  while(rNode!=null&&result==0){
	k = compareRecord(recordset,this,sValue,rNode.aPos);
	switch(k){
	 case -1: 
	 case  0: //在前面,树的左边
  	    fhLNode = rNode;   //求第一个左分支的节点	 
	    if(k==-1||this.options==0){

	     tNode = rNode.leftNode;
	 	 if(tNode==null){
	 	  node = new TIndexNode(dPos,rNode); 	
		  rNode.leftNode = node;
		  rNode.frontNode = node;
		  
		  node.frontNode = fhRNode;
		  node.nextNode = node.parentNode;
		  
		  node.value = sValue[0];
								 
		  //this.ts = this.ts+"\nl:"+sValue[0]+" = "+rNode.value;		
		  
		  if(fhRNode!=null)
		   fhRNode.nextNode = node;
		  else this.firstNode = node;
		 }
		}
		else
		 result = 1;    //违反唯一索引
		break;
	 case 1:
   	    fhRNode = rNode;  //求第一个右分支的节点
	    tNode = rNode.rightNode;
	    if(tNode==null){
		 node = new TIndexNode(dPos,rNode);	
 	     node.value = sValue[0];
		  
   	     //this.ts = this.ts+"\nr:"+sValue[0]+" = "+rNode.value;		 
		 rNode.rightNode = node;
		 rNode.nextNode = node;
		 
		 node.frontNode = node.parentNode;
		 node.nextNode = fhLNode;
		 
		 if(fhLNode!=null)
		  fhLNode.frontNode = node;
		 else 
		  this.lastNode = node;
		}
		break;
	}
   	rNode = tNode;
  }
  //showIndexValue(recordset,this.firstNode);
  return result;
}

//初始化排序操作
TIndexDef.prototype.initSort = function(){
  this.clearNode();
  if(this.dataset.isEmpty()) return;
  
  var recordset = this.dataset.pData;
  var k = 0;
  this.ts="";
  this.nRecNo = this.dataset.RecNo; 
  
  var sValue = new Array(this.indexFieldCount);
  
  for(var i=1;i<=recordset.length;i++){
   var rrow = recordset[i-1];
   for(var j=0;j<this.indexFieldCount;j++)
    sValue[j] = rrow.getAttribute(this.shortNames[j]);
   this.addNode(recordset,sValue,i);
  }
 // showIndexValue(this.firstNode);
 // showIndexValueb(this.lastNode);
 // showIndexValue2(this.rootNode); 
}

//增加记录时调整排序
TIndexDef.prototype.addAdjust = function(sPos){
  var result;	
  
  var sValue = new Array(this.indexFieldCount);
  var recordset = this.dataset.pData;  
  var row = recordset[sPos-1];
  
  for(var i=0;i<this.indexFieldCount;i++){
   sValue[i] = row.getAttribute(this.shortNames[i]);
  }
  result = this.addNode(recordset,sValue,sPos); 	 

  if(result>0)
    this.dataset.validateKeyField(this,0,1);
//  showIndexValue(this.firstNode);
//  showIndexValueb(this.lastNode);
//  showIndexValue2(this.rootNode); 
  return result;
}

//删除记录时调整排序
TIndexDef.prototype.delAdjust = function(sPos,updatePos){

  this.changePos(sPos);
  
  if(this.origNode==null) return; 
  
  var node = this.origNode;     //当前节点
  var uNode = null,rNode;             //要升级的节点
  //删除树中节点  
  if(node.leftNode!=null){     
   uNode = node.leftNode;
   
   if(node.rightNode!=null){
    rNode = uNode;
   
    while(rNode.rightNode!=null) rNode = rNode.rightNode;
   
    rNode.rightNode = node.rightNode;
    node.rightNode.parentNode = rNode; 
   }
  }else
   uNode = node.rightNode;	 

  if(uNode!=null)
   uNode.parentNode = node.parentNode; 
  
  if(node.parentNode==null)
   this.rootNode = uNode;
  else 
   if(node.parentNode.leftNode==node)  //删除一个节点的左节点  
    node.parentNode.leftNode = uNode;
   else	 node.parentNode.rightNode = uNode;


  //删除链表中节点
  if(typeof(updatePos)=="undefined"){
   nnode = this.firstNode;
   while(nnode!=null){
    if(nnode.aPos>node.aPos)
     nnode.aPos = nnode.aPos-1;
    nnode = nnode.nextNode;
   }
  }
  
  if(node.nextNode!=null)
   node.nextNode.frontNode = node.frontNode;
  else
   this.lastNode = node.frontNode; 
   
  if(node.frontNode!=null)
   node.frontNode.nextNode = node.nextNode;  
  else 
   this.firstNode = node.nextNode;  

  node.free();
  node = null;  

//  showIndexValue(this.firstNode);
//  showIndexValueb(this.lastNode);  
//  showIndexValue2(this.rootNode);
}

//查找当前数据匹配的节点
TIndexDef.prototype.findNode = function(recordset,sValue){
	
  var fNode = this.firstNode;
  var k = 2; 
  while(fNode!=null&&k!=0){
   if(fNode!=this.origNode)
    k = compareRecord(recordset,this,sValue,fNode.aPos);  

   fNode = fNode.nextNode;
  }
 
  return k;
}
//修改记录时调整排序
TIndexDef.prototype.editAdjust = function(sPos){
  
  this.changePos(sPos); 
  
  var recordset = this.dataset.pData;  
  this.nRecNo = this.dataset.RecNo;	 
  var row = recordset[sPos-1];
  
  var sValue = new Array(this.indexFieldCount);

  for(var i=0;i<this.indexFieldCount;i++)
   sValue[i] = row.getAttribute(this.shortNames[i]);

  var rNode = null;

  if(this.options==1&&this.findNode(recordset,sValue)==0){

	this.dataset.validateKeyField(this,2,1); 	
    return 1;
  }

  //先删除原来的节点

  this.delAdjust(sPos,false);
  var result = this.addNode(recordset,sValue,sPos); 	 
  
//  showIndexValue(this.firstNode);
//  showIndexValueb(this.lastNode);
//  showIndexValue2(this.rootNode); 

  return result;
}


//根据记录号改变当前节点
TIndexDef.prototype.changePos = function(sPos){
  this.origNode = null;	
  var node = this.firstNode;
  while(node!=null){
   if(node.aPos == sPos){
    this.origNode = node;
	break;
   }
   node = node.nextNode;	  
  }
}

//索引管理器
function TIndexDefs(dataset){
  this.dataset = dataset;	
  this.indexCount = 0;
  this.indexDef	 = [];
  this.indexFieldNames = [];
}

TIndexDefs.prototype.fieldInIndex = function(fieldName,indexDef){
  var result = false;	
  for(var i=0;!result&&i<indexDef.fieldNames.length;i++)
    result = fieldName==indexDef.fieldNames[i];
 
  return result; 
}

TIndexDefs.prototype.addIndex = function(indexName,fieldInfos,options,errMsg){
  this.indexDef[this.indexCount] = 
        new TIndexDef(this,indexName,fieldInfos,options,errMsg);
  this.indexCount++;		
}

TIndexDefs.prototype.deleteIndex = function(indexName){
  var i; 	
  for(i=0;i<this.indexCount;i++)
   if(this.indexDef[i].indexName==indexName){
	this.indexDef[i].free();
    this.indexDef[i] = null;
	this.indexCount--;
   }
  while(i<this.indexCount-1){
	this.indexDef[i] = this.indexDef[i+1];
	i++;
  }
}

TIndexDefs.prototype.free = function(){
 for(var i=0;i<this.indexCount;i++){
  this.indexDef[i].free();
  this.indexDef[i] = null;
 }
}

//增加记录时调整排序
TIndexDefs.prototype.addAdjust = function(sPos){
 var result = 0;	
 var iDef = null;
 for(var i=0;result==0&&i<this.indexFieldNames.length;i++)
  if(this.indexFieldNames[i]!=null)
  for(var j=0;result==0&&j<this.indexDef.length;j++){
	  
   iDef = this.indexDef[j];
   
   if(iDef.isUpdate&&this.fieldInIndex(this.indexFieldNames[i],iDef)){
    iDef.isUpdate = false;	  
    result = iDef.addAdjust(sPos);
   }
  }

 
 for(var j=0;j<this.indexDef.length;j++)
  this.indexDef[j].isUpdate = true;
 
 return result;     
}

//删除记录时调整排序
TIndexDefs.prototype.delAdjust = function(sPos){
 var result = 0;	
 var iDef = null;
 for(var i=0;result==0&&i<this.indexFieldNames.length;i++)
  if(this.indexFieldNames[i]!=null)
  for(var j=0;result==0&&j<this.indexDef.length;j++){
	  
   iDef = this.indexDef[j];
  
   if(iDef.isUpdate&&this.fieldInIndex(this.indexFieldNames[i],iDef)){
    iDef.isUpdate = false;	  
    result = iDef.delAdjust(sPos);
   }
  }
 
 for(var j=0;j<this.indexDef.length;j++)
  this.indexDef[j].isUpdate = true;
 
 return result;     
}

TIndexDefs.prototype.editAdjust = function(sPos){
 var result = 0;	
 var iDef = null;
 var field = null; 
 var fieldName = "";
 
 for(var i=0;result==0&&i<this.indexFieldNames.length;i++)
  if(this.indexFieldNames[i]!=null){
	fieldName = this.indexFieldNames[i];    
    for(var j=0;result==0&&j<this.indexDef.length;j++){
	  
     iDef = this.indexDef[j];
     field = this.dataset.fieldByName[fieldName];
	 //

     if(iDef.isUpdate&&field.sField.value!=field.postValue&&this.fieldInIndex(fieldName,iDef)){
      iDef.isUpdate = false;	  
      result = iDef.editAdjust(sPos);
     }
   }
  }
 
 for(var j=0;j<this.indexDef.length;j++)
  this.indexDef[j].isUpdate = true;
 
 return result;     
} 

//根据记录号改变当前节点
TIndexDefs.prototype.changePos = function(sPos){
 for(var i=0;i<this.indexCount;i++)
  this.indexDef[i].changePos(sPos);
} 

TIndexDefs.prototype.initSort = function(){
 for(var i=0;i<this.indexCount;i++)
  this.indexDef[i].initSort();
}
	
TIndexDefs.prototype.clearNode = function(){	
 for(var i=0;i<this.indexCount;i++)
  this.indexDef[i].clearNode();
}
/**数据表定义*/
//记录类型
$recordType = {rtNew:3,rtOpen:1,rtEmpty:0};
//记录状态
$datasetState = {dsInsert:2,dsEdit:1,dsBrowse:0};
/* 属性定义*/
TTable.prototype.pData = null;   //主数据集,数据岛的recordset
TTable.prototype.pMeta = null;   //字段描述数据集
TTable.prototype.pDelta = null;  //数据日志数据集
TTable.prototype.dataXml = null;  //主数据岛
TTable.prototype.metaXml = null;  //字段描述数据岛
TTable.prototype.deltaXml = null;  //数据日志数据岛
TTable.prototype.fields = null;     //字段数组
TTable.prototype.origField = null;  //当前变化的字段
TTable.prototype.nameByShortName = null;   //字段长短名对应表
TTable.prototype.shortNameByName = null;   //字段长短名对应表
TTable.prototype.fieldByName = null;  //字段对应字段对象
TTable.prototype.fieldByShortName = null; //字段别名对象的字段对象

TTable.prototype.keyFields =null;   //主键字段数组
TTable.prototype.tableName = "";   //数据提交表名称
TTable.prototype.useTransaction = 0;  //是否使用事务,0-不用,1-使用

TTable.prototype.pageSize = 0;    // 读取的每页大小
TTable.prototype.pageNumber = 0;  // 当前页号
TTable.prototype.pageCount = 0;   // 页数
TTable.prototype.allRecordCount = 0;  //总记录数

TTable.prototype.BeforeInsertSql = ""; //记录插入数据库之前需要执行的sql
TTable.prototype.AfterInsertSql = "";  //记录插入数据库之后需要执行的sql
TTable.prototype.BeforeDeleteSql = ""; //记录删除之前需要执行的sql
TTable.prototype.AfterDeleteSql = "";  //记录删除之后需要执行的sql
TTable.prototype.BeforeUpdateSql = ""; //记录修改之前需要执行的sql
TTable.prototype.AfterUpdateSql = "";  //记录删除之后需要执行的sql
TTable.prototype.aBeforeUpdateSql = "";//数据集保存之前需要执行的sql
TTable.prototype.aAfterUpdateSql = ""; ////数据集保存之后需要执行的sql
TTable.prototype.allwaysUpdateSql = ""; //数据无变化时也执行

TTable.prototype.dataSources =null;     //关联的数据源
TTable.prototype.dataSourceCount = 0;

TTable.prototype.R_Location = 0;       //数据集记录记数，用来产生记录唯一的id
TTable.prototype.mDataset = null;     //主从关系时对应的主表TTable
TTable.prototype.dDataset = null;     //主从关系时对应的从表TTable
TTable.prototype.linkField = "";       //主从关系时关联的字段
TTable.prototype.oLinkValue = null;
TTable.prototype.sqlID = "";
TTable.prototype.params = null;
TTable.prototype.dynData = true;

TTable.prototype.readOnly = false;    //只读属性
TTable.prototype.canInsert = true;    //增加属性
TTable.prototype.canDelete = true;    //删除属性
TTable.prototype.canModity = true;    //修改属性

TTable.prototype.calTotal = true;    //动态计算合计
TTable.prototype.lock = false;        //数据集锁定
TTable.prototype.lockField = false;       
TTable.prototype.isCheckPost = false; 

TTable.prototype.isInNew = false;
TTable.prototype.enableControl = true;
TTable.prototype.lastError = "";       //最后错误信息 
TTable.prototype.lastErrorNo = 0;      //
TTable.prototype.dEmptyNotSave = false;
TTable.prototype.dEmptyNotSaveEx = false;

TTable.prototype.deNSaveHint = "没有明细数据,不能够保存数据.";
TTable.prototype.noDataHint = true;  //查询不到数据时是否提示
/*索引定义*/
TTable.prototype.IndexDefs = null;

TTable.prototype.oXmlHttp = null;
/*事件定义*/
TTable.prototype.AfterCancel = null;
TTable.prototype.AfterDelete = null;
TTable.prototype.AfterEdit = null;
TTable.prototype.AfterInsert = null;
TTable.prototype.AfterInsert2 = null;
TTable.prototype.AfterPost = null;
TTable.prototype.AfterPost0 = null;
TTable.prototype.AfterScroll = null;
TTable.prototype.BeforeCancel = null;
TTable.prototype.BeforeDelete = null;
TTable.prototype.BeforeEdit = null;
TTable.prototype.BeforeInsert = null;
TTable.prototype.BeforePost = null;
TTable.prototype.BeforeScroll = null;
TTable.prototype.OnCalcFields = null;
TTable.prototype.OnDeleteError = null;
TTable.prototype.OnEditError = null;
TTable.prototype.OnNewRecord = null;
TTable.prototype.OnInnerRowEnter = null;

TTable.prototype.OnBeforeUpdate = null;
TTable.prototype.OnAfterUpdate = null;
TTable.prototype.OnInitUpdate = null;
TTable.prototype.OnSetUpdateValue = null;
TTable.prototype.lastAskUpdate = null;

TTable.prototype.OnBeforeOpen = null;
TTable.prototype.OnAfterOpen = null;
TTable.prototype.OnPageChange = null;
TTable.prototype.OnReadPageCount = null;
TTable.prototype.OnReadSumValue = null;

TTable.prototype.OnPostError = null;
TTable.prototype.OnFieldChange = null;
TTable.prototype.OnRecordChange = null;
TTable.prototype.OnCalSumValue = null;
TTable.prototype.OnKeyFieldError = null;  //主键重复错误
TTable.prototype.OnKeyFieldError2 = null;  //主键重复错误
TTable.prototype.OnDataChange = null;
TTable.prototype.OnChangeFocus = null;
TTable.prototype.BeforeGetData = null;

TTable.prototype.BeforeGetPage = null;

TTable.prototype.pageName = "";
TTable.prototype.__dataAtt = 0;
TTable.prototype.__keyCodes = null;
TTable.prototype.__fixedCols = 0;
TTable.prototype.__keyFields = null;
TTable.prototype.fixedTotal = false;

TTable.prototype.SeqFieldName  = "";
TTable.prototype.SeqName  = "";
TTable.prototype.OnGetSeqError = null;

TTable.prototype.selected = null;      //所选记录指定字段的值
TTable.prototype.selectRecord = false;
TTable.prototype.selectValue = null;
TTable.prototype.selectField = "";
TTable.prototype.recordField = "";
TTable.prototype.csplit = "";
TTable.prototype.idKeyFieldName = "ID_KEY";
TTable.prototype.ddKeyFieldName = "DD_KEY";
TTable.prototype.dTimeFieldName = "LR_DATE";
TTable.prototype.ddType = "";

TTable.prototype.InnerAsynSender = "";
TTable.prototype.InnerIsAsyn = false;  
TTable.prototype.OnReading = null;

TTable.prototype.LocationField = "";  //次序控制字段

TTable.prototype.deleteRowHintStr = "确认要删除当前记录吗?";
TTable.prototype.deleteRowAllHintStr = "确认要删除全部记录吗?";

TTable.prototype.OnSetValue = null;
TTable.prototype.CtrlPageInfo = null;
TTable.prototype.CtrlBtFirst = null;
TTable.prototype.CtrlBtPrior = null;
TTable.prototype.CtrlBtNext = null;
TTable.prototype.CtrlBtLast = null;

TTable.prototype.recordUnit = "条记录";

/*构造函数*/
function TTable(tableName,sqlid,params,props,onafteropen){

  this.className = "TTable";
    
  this.dDataset = new Array;
  this.oLinkValue = new Array;
  this.dataSources = new Array;
  
  this.fixedTotal = false;
  
  if(typeof(props)!="undefined")
    for(var i in props)
      this[i] = props[i];
  
  if(sqlid=="") sqlid = tableName;
  if(typeof(onafteropen)!="undefined")
  	this.OnAfterOpen = onafteropen;
	
  if(sqlid!="")  
    this.initTable(tableName,sqlid,params);
  __VCL.add(this);    
}

/**TTable通用的函数*/

<!--交换记录 从fromIndex到toIndex-->
function copyRecord(dataset,fromIndex,toIndex){

  var sRow = dataset[fromIndex-1];
  var dRow = dataset[toIndex-1];
  var fieldCount = sRow.attributes.length;
  
  var buffer = new Array(fieldCount);
  var i = 0;
  var s = "";
  for(i=0;i<fieldCount;i++){  <!--复制到缓冲 -->
    s = sRow.attributes[i].value;
    s = s.replace(/\n/g,"ん");
    buffer[i] = s;
  }

  for(i=0;i<fieldCount;i++)  <!--缓冲到目标 -->
    dRow.attributes[i].value = buffer[i];
   
  buffer = null; 
}

  <!--定位记录-->
function locateRecord(dataset,rLocation,rType,fromIndex){
	
  var recordCount = dataset.length;	
  while(fromIndex<=recordCount){
    var row = dataset[fromIndex-1];  <!--移动到开始记录 -->
    if(parseInt(row.getAttribute("RL"))==parseInt(rLocation)&&
       parseInt(row.getAttribute("RT"))==parseInt(rType))
      return fromIndex;
	fromIndex++;  
  }
  return 0;
}

<!--复制记录 从sDataset到dDataSet-->
TTable.prototype.cloneRecord = function(dRow,sRow,stod){
  var s = "";
  var fieldCount = this.fields.length;

  dRow.attributes["RL"].value  = sRow.attributes["RL"].value;
  dRow.attributes["RS"].value  = sRow.attributes["RS"].value;
  dRow.attributes["RT"].value  = sRow.attributes["RT"].value;
  dRow.attributes["RR"].value  = sRow.attributes["RR"].value;

  if(stod){
    for(var i=0;i<fieldCount;i++){
      fname = this.fields[i].fieldName;
      sname = this.fields[i].shortName;
      s = sRow.attributes[sname].value;
      if(s!=null&&s!="")
        s = s.replace(/\n/g,"ん");
      dRow.attributes[fname].value = s;
    }
  }else{
	for(var i=0;i<fieldCount;i++){
      sname = this.fields[i].fieldName;
      fname = this.fields[i].shortName;
      s = sRow.attributes[sname].value;
      if(s!=null&&s!="")
        s = s.replace(/\n/g,"ん");
      dRow.attributes[fname].value = s;
    } 
  }
}

TTable.prototype.__addNew = function(){
  var dataset = this.pData;	 
  var newRow = dataset[0].cloneNode(true);
  for(var i=4;i<newRow.attributes.length;i++)
    newRow.attributes[i].value = "";
  dataset[0].parentNode.appendChild(newRow);
  return this.setRecRow(dataset.length);
}

TTable.prototype.__delRow = function(){
  var dataset = this.pData;	

  dataset[0].parentNode.removeChild(dataset[this.RecNo-1]);
  if(this.RecNo>dataset.length)
    this.RecNo = dataset.length;
  return this.setRecRow(this.RecNo);  
}

TTable.prototype.__addDelta = function(){
  var delta = this.pDelta;	 
  var newRow = delta[0].cloneNode(true);
  delta[0].parentNode.appendChild(newRow);
  return this.setDeltaRecRow(delta.length);
}

//析构函数
TTable.prototype.free = function(){
  this.defaultFields = null;
  this.defaultValues = null;
  
  this.logFields = null;
  this.logValues = null;
	
  this.fields = null;  
  this.dataSources = null;
  this.keyFields = null;
  this.nameByShortName = null;  
  this.shortNameByName = null;  
  this.fieldByName = null; 
  this.fieldByShortName = null; 
  this.dDataset = null;
  this.oLinkValue = null;
  this.indexDefs.free();
  this.indexDefs = null;
  this.recordValue = null;
}

TTable.prototype.setCtrlButton = function(CtrlPageInfo,CtrlBtFirst,CtrlBtPrior,CtrlBtNext,CtrlBtLast){
  this.CtrlPageInfo = CtrlPageInfo;
  this.CtrlBtFirst = CtrlBtFirst;
  this.CtrlBtPrior = CtrlBtPrior;
  this.CtrlBtNext = CtrlBtNext;
  this.CtrlBtLast = CtrlBtLast;	
  this.setCtrlButtonState();
}

TTable.prototype.setCtrlButtonState = function(){
  if(this.CtrlPageInfo!=null){
	if(this.isEmpty())
	  this.CtrlPageInfo.innerText = "没有满足条件的数据";
	else
      this.CtrlPageInfo.innerText = "第"+this.pageNumber+"页,共"+this.pageCount+"页,"+this.allRecordCount+this.recordUnit;
	  
	this.CtrlBtFirst.disabled = this.isEmpty()||this.pageNumber<=1;
	this.CtrlBtPrior.disabled = this.CtrlBtFirst.disabled;
	
	this.CtrlBtNext.disabled = this.isEmpty()||this.pageNumber==this.pageCount;
	this.CtrlBtLast.disabled = this.CtrlBtNext.disabled;	
  }
}

TTable.prototype.setRecRow = function(RecNo){
  this.RecNo = RecNo;       
 
  this.RecRow = this.pData[RecNo-1]; 

  for(var i=0;i<this.fields.length;i++)
    this.fields[i].sField = this.RecRow.attributes["F"+(i+1)]; 
  return this.RecRow;	
}

TTable.prototype.setDeltaRecRow = function(RecNo){
  this.DeltaRecNo = RecNo;                
  this.DeltaRecRow = this.pDelta[RecNo-1]; 
  return this.DeltaRecRow;	
}

TTable.prototype.initTable = function(tableName,sqlid,params){

  var xmlObj = __xmlHttp.getTableXmlData(this,sqlid,params,tableName);	
  
  this.deltaXml = xmlObj.getElementsByTagName("delta")[0];
  this.metaXml = xmlObj.getElementsByTagName("mmeta")[0];
  this.dataXml = xmlObj.getElementsByTagName("mdata")[0];

  this.pData  = this.dataXml.childNodes[0].childNodes;
  this.pMeta  = this.metaXml.childNodes[0].childNodes;
  this.pDelta = this.deltaXml.childNodes[0].childNodes;
 
  this.tableName = tableName;

  this.recordValue = new Array;
  this.fields = new Array(this.pMeta.length);  //字段数组

  this.keyFields = new Array; 
  this.nameByShortName = new Array;  
  this.shortNameByName = new Array;  
  this.fieldByName = new Array; 
  this.fieldByShortName = new Array; 

  this.defaultFields = null;
  this.defaultValues = null;
  
  this.logFields = null;
  this.logValues = null;
  
  //设置字段数组
  var i = 0,j=0,mdSet = this.pMeta, Field = null;

  while(i<mdSet.length){
    Field = new TField(this);
    this.fields[i] = Field;
    Field.index = i; //字段索引
    Field.dataset = this;

    Field.sField = this.pData[0].attributes["F"+(i+1)];
	
    Field.fieldName = mdSet[i].getAttribute("A");  // 字段名称
    Field.shortName = mdSet[i].getAttribute("O");  // 字段短名 
    Field.keyField = mdSet[i].getAttribute("K")=="1"; //主键字段
   
    Field.dataType = parseInt(mdSet[i].getAttribute("B"),10);  //数据类型
   
    Field.size = parseInt(mdSet[i].getAttribute("W"),10);
    Field.isNull = (mdSet[i].getAttribute("D")=="1"||mdSet[i].getAttribute("D")=="false");
   
    Field.precision = parseInt(mdSet[i].getAttribute("P"),10);
    if(Field.dataType==2||Field.dataType==3){
      Field.precision = 2;
	  Field.displayFormat = "0.00";
    }
	
    Field.readOnly = mdSet[i].getAttribute("R")=="1";
    Field.displayLabel = mdSet[i].getAttribute("L");
    Field.displayWidth = parseInt(mdSet[i].getAttribute("W"));
    if(mdSet[i].getAttribute("M")!="")
      Field.displayFormat = mdSet[i].getAttribute("M");
    var cstr = mdSet[i].getAttribute("C");
    if(cstr!=""&&cstr!=null)
      cstr = cstr.replace(Field.fieldName,"v");
    Field.constrant = cstr;
    Field.errorMsg = mdSet[i].getAttribute("E");
    Field.format = mdSet[i].getAttribute("F");
    Field.formatErr = mdSet[i].getAttribute("H");

    this.nameByShortName[Field.shortName] = Field.fieldName;
    this.shortNameByName[Field.fieldName] = Field.shortName;
    this.fieldByName[Field.fieldName] = Field;
    this.fieldByShortName[Field.shortName] = Field;

    if(Field.keyField){
      this.keyFields[j] = Field;
      j++;
    }
    i++;
  }

  this.indexDefs = new TIndexDefs(this);

  this.__innerNoDataHint = false;
  
  this.__postmark = true;
  this.__saveRecord = false;
  this.__saveDataStatus = false;  
  this.sortFieldName = "RL";
  
  this.sortAtt = 1;   //1-升序 -1-降序
    
  this.keyValues1 = null;
  this.keyValues2 = null;
  this.keyValues11 = null;
  this.keyValues21 = null;

  this.isFastData = false;
  this.keyElementCount = 1;
  this.keyIndex1 = 0;
  this.keyIndex2 = 1;
  this.keyIndex11 = 2;
  this.keyIndex21 = 3;
  
  this.allRecordCount = 0;//总记录数
  
  this.__SeqId = 0;
  this.RecNo = 1;              //当前记录号
  this.RecRow = this.pData[0]; //当前行指针
  this.DeltaRecNo = 1;
  this.DeltaRecRow = this.pDelta[0]; //当前日志行指针
  
  this.calSumValue(true);   //计算合计

  this.cloneRecord(this.DeltaRecRow,this.RecRow,true);
  
  if(this.OnAfterOpen!=null) this.OnAfterOpen(this);   
  if(this.OnPageChange!=null) this.OnPageChange(this);
   
  if(this.OnRecordChange != null) this.OnRecordChange(this);

}

TTable.prototype.reInitTable = function(tableName,sqlid,params){

  this.fields = null;  
  this.keyFields = null;
  this.nameByShortName = null;  
  this.shortNameByName = null;  
  this.fieldByName = null; 
  this.fieldByShortName = null; 
  this.indexDefs.free();
  this.indexDefs = null;
  this.recordValue = null;
  this.initTable(tableName,sqlid,params);
}

TTable.prototype.setPropertys = function(props){
  for(var i in props)
    this[i] = props[i];
  props = null;
}

/*方法定义*/
TTable.prototype.getState = function(){
  var v = this.RecRow.getAttribute("RS");	
  return (v=="")?0:parseInt(v); 
}

TTable.prototype.getRecordType = function(){
  var v = this.RecRow.getAttribute("RT");		
  if(v==""||v=="0")
    return 0;
  var n = parseInt(v); 
  if(n<=2) n=1;
  return n;
}

TTable.prototype.resetAllState = function(){
  this.lock = false;
  this.enableControl = true;
  var field;
  for(var i=0;i<this.fields.length;i++){
   field = this.fields[i];
   field.OnChanging = false;
   field.isSetValue = false;
  }
  new TExpection(-1,""); 
}

/*获取字段类型*/
TTable.prototype.getFieldDataType=function(fieldName){
  var result = -1;
  result = this.fieldByName[fieldName].dataType;
  return result;
}

/*通过字段名获取字段引用*/
TTable.prototype.getFieldByFieldName=function(fieldName){
  return this.fieldByName[fieldName];
}

/*通过字段别名获取字段引用*/
TTable.prototype.getFieldByShortName=function(sFieldName){
  return this.fieldByShortName[sFieldName];
}


/*通过原始字段引用字段对象*/
TTable.prototype.getFieldBySField=function(sField){
  return this.fieldByShortName[sField.name];
}

/*内部增加，动态打开记录集时使用,sRows源记录数据*/
TTable.prototype.innerInsert = function(sRows,delRows,bSelected){

 /*装载数据*/
 var data = this.pData;
 
 var ocount = data.length;
 var ncount = sRows.length;

 var fieldcount = sRows[0].attributes.length;
 
 if(ocount<ncount){ //新数据行数多
   for(var i=0;i<ncount-ocount;i++){
	  var newRow = data[0].cloneNode(true);   
	  data[0].parentNode.appendChild(newRow);
   }
 } else if(ocount>ncount){   //新数据行数少
   for(var i=ocount-ncount;i>0;i--){
	  data[0].parentNode.removeChild(data[i-1]);
   }
 }
 
 for(var i=0;i<ncount;i++){
	for(var j=0;j<fieldcount;j++){
	   data[i].attributes[j].value = sRows[i].attributes[j].value; 	
	}
 }

 this.setRecRow(1);
 //alert(new Date()- t1);
 this.indexDefs.clearNode();
 this.indexDefs.initSort();

 this.cloneRecord(this.DeltaRecRow,this.RecRow,true); 
 
 this.calSumValue(true); 
 
 if(bSelected) this.innerSelectedTo();
  
 this.triggerDataChange(null,"open");
}

TTable.prototype.setSFV = function(SF,V){
  this.RecRow.setAttribute(SF,V);   
}

/*增加记录,增加成功时，返回true*/
TTable.prototype.insert = function(){
  var dSet = this;
  if(dSet.readOnly||(!dSet.canInsert)) return false;  //数据集为只读时退出

  var data = dSet.pData,metadata = dSet.pMeta,delta = dSet.pDelta;
  var result = false,mresult = true;
  var tmpidkey = 0,tmpddkey = "",tmpstime = "";
   
  if(dSet.mDataset!=null){    //如果存在主从关系,先确认主表
   if(dSet.mDataset.isEmpty()){
    mresult = false;
//	this.resetAllState();
//	new TExpection(0,"请输入主表数据.");
   }else{
    mresult = dSet.mDataset.getFieldValue(this.linkField)!="";  //主表关联字段有值时才能够增加明细表 
    //mresult = dSet.mDataset.canPost()&&dSet.mDataset.post();   //否则先Post主表数据
   }
  }

  if(mresult&&dSet.post()) //首先Post目前记录的数据
   if(dSet.BeforeInsert==null||dSet.BeforeInsert(dSet)){  //首先检查并调用增加前事件
    //处理自动序列 
    if(this.SeqFieldName!=""&&this.SeqName!=""){
	  this.__SeqId = __xmlHttp.getSeq(this.SeqName);

	  mresult = this.__SeqId>0;
	  if(!mresult)
	    if(this.OnGetSeqError!=null) this.OnGetSeqError(this);	  
	    else alert("获取序列值失败，请检查网络，或者重试操作");
	}
   
    if(mresult&&this.ddType!=""){
		if(__xmlHttp.executeProc("GetBillCode",[this.ddType,"0","","",""])==0){
		   tmpidkey = __xmlHttp.getResults("billid");
		   tmpddkey = __xmlHttp.getResults("billcode");
		   tmpdtime = __xmlHttp.getResults("dtime");
		}else
		   mresult = false;
	}
	
    if(mresult){ 

     this.isInNew = true;
     var row = this.RecRow;	 
	 
     if(parseInt(row.getAttribute("RT"))>0){ //增加新记录
       row = this.__addNew();
 	 }

     row.setAttribute("RT","3");    <!--类型变成 3 - 新记录 -->
     row.setAttribute("RS","2");    <!--状态变成 2 - 插入状态 -->
     row.setAttribute("RR","0");

     if(dSet.R_Location==0) dSet.R_Location = data.length;  //设置记录标识
	 else dSet.R_Location++;
	 
     row.setAttribute("RL",""+dSet.R_Location);  <!--内部记录定位号-->

     //处理主从关系

	 var mDSet = dSet.mDataset;
	 if(mDSet!=null&&dSet.linkField!=""){
	  var field = mDSet.fieldByName[dSet.linkField];
	  if(field!=null&&field.sField!=null)
	    dSet.fieldByName[dSet.linkField].sField.value = field.sField.value;
	 }

     this.RecNo = data.length;

     for(var i=0;i<this.fields.length;i++){   //把空值设置为空白
	  this.fields[i].oldValue = "";
	  this.fields[i].oValue = "";
	  this.fields[i].priorValue = "";
	 }
	
     if(this.SeqFieldName!=""&&this.SeqName!="")
	   dSet.innersetFieldValue(this.SeqFieldName,this.__SeqId,false);

     if(this.ddType!=""){
 	   if(this.idKeyFieldName != "")
		 dSet.innersetFieldValue(this.idKeyFieldName,tmpidkey);
  	   if(this.ddKeyFieldName != "")
		 dSet.innersetFieldValue(this.ddKeyFieldName,tmpddkey);
 	   if(this.dTimeFieldName != "")
		 dSet.innersetFieldValue(this.dTimeFieldName,tmpdtime);
	 }
     /*设置自动值*/
	 if(__$gObjFieldName!=""&&dSet.fieldByName[__$gObjFieldName]!=null) 
	   dSet.innersetFieldValue(__$gObjFieldName,__$gObjFieldValue,false);
	
	 if(dSet.defaultFields != null)
	   for(var i=0;i<dSet.defaultFields.length;i++)
	     dSet.innersetFieldValue(dSet.defaultFields[i],dSet.defaultValues[i],false);
	
     if(dSet.AfterInsert!=null) dSet.AfterInsert(dSet);  //检查并调用增加后事件
     if(dSet.AfterInsert2!=null) dSet.AfterInsert2(dSet);  //检查并调用增加后事件	 

     for(var i=0;i<row.attributes.length;i++)            //把空值设置为空白
      if(row.attributes[i].value==null)
       row.attributes[i].value = "";

     //清空旧值
	 this.isInNew = false;
     this.innermoveRecord(data.length,"new");
     //this.triggerDataChange(null,"new");	
     this.adjustSumValue(0);
     //删除明细表的数据	
	 /*
     var dDSet = this.dDataset;
     for(var i=0;i<dDSet.length;i++)
      dDSet[i].emptyDataset();  */
     result = true;
	}
   }
  return result;
}

/*增加记录,增加成功时，返回true*/
TTable.prototype.Insert = function(){
  var dSet = this;
  if(dSet.readOnly||(!dSet.canInsert)) return false;  //数据集为只读时退出

  var data = dSet.pData,metadata = dSet.pMeta,delta = dSet.pDelta;
  var result = false,mresult = true;

  if(dSet.mDataset!=null){    //如果存在主从关系,先确认主表
   if(dSet.mDataset.isEmpty()){
    mresult = false;
//	this.resetAllState();
//	new TExpection(0,"请输入主表数据.");
   }else{
    mresult = dSet.mDataset.getFieldValue(this.linkField)!="";  //主表关联字段有值时才能够增加明细表 
    //mresult = dSet.mDataset.canPost()&&dSet.mDataset.post();   //否则先Post主表数据
   }
  }

  if(mresult&&dSet.post()) //首先Post目前记录的数据
   if(dSet.BeforeInsert==null||dSet.BeforeInsert(dSet)){  //首先检查并调用增加前事件
   
    //处理自动序列 
    if(this.SeqFieldName!=""&&this.SeqName!=""){
	  this.__SeqId = __xmlHttp.getSeq(this.SeqName);
	  mresult = this.__SeqId>0;
	  if(!mresult)
	   if(this.OnGetSeqError!=null) this.OnGetSeqError(this);	  
	   else alert("获取序列值失败，请检查网络，或者重试操作");
	}
   
    if(mresult){ 
   
     this.isInNew = true;
     var row = this.RecRow;	 	 
	 
     if(parseInt(row.getAttribute("RT"))>0){ //增加新记录
	  var orecNo = this.RecNo; 
      
	  row = this.__addNew();
	  
      for(var i=data.length;i>orecNo;i--)
 	   copyRecord(data,i-1,i);
	   
	  row = this.setRecRow(orecNo);
	  
	  for(var i=0;i<row.attributes.length;i++)
	    row.attributes[i].value = "";
	 }

     row.setAttribute("RT","3");    <!--类型变成 3 - 新记录 -->
     row.setAttribute("RS","2");    <!--状态变成 2 - 插入状态 -->
     row.setAttribute("RR","0");

     if(dSet.R_Location==0) dSet.R_Location = data.length;  //设置记录标识
	 else dSet.R_Location++;
     row.setAttribute("RL",""+dSet.R_Location);  <!--内部记录定位号-->

     //处理主从关系

	 var mDSet = dSet.mDataset;
	 if(mDSet!=null&&dSet.linkField!=""){
	  var field = mDSet.fieldByName[dSet.linkField];
	  if(field!=null&&field.sField!=null)
	   dSet.fieldByName[dSet.linkField].sField.value = field.sField.value;
	 }

     //data.absolutePosition = data.recordCount;

     for(var i=0;i<this.fields.length;i++){   //把空值设置为空白
	  this.fields[i].oldValue = "";
	  this.fields[i].oValue = "";
	  this.fields[i].priorValue = "";
	 }
	
     if(this.SeqFieldName!=""&&this.SeqName!="")
	  dSet.innersetFieldValue(this.SeqFieldName,this.__SeqId,false);
	
	 /*设置自动值*/
	 if(__$gObjFieldName!=""&&dSet.fieldByName[__$gObjFieldName]!=null) 
	  dSet.innersetFieldValue(__$gObjFieldName,__$gObjFieldValue,false);
	
	 if(dSet.defaultFields != null)
	   for(var i=0;i<dSet.defaultFields.length;i++)
	     dSet.innersetFieldValue(dSet.defaultFields[i],dSet.defaultValues[i],false);
	
     if(dSet.AfterInsert!=null) dSet.AfterInsert(dSet);  //检查并调用增加后事件
     if(dSet.AfterInsert2!=null) dSet.AfterInsert2(dSet);  //检查并调用增加后事件
	 
     for(var i=0;i<row.attributes.length;i++)
  	   if(data.attributes[i].value==null)
	     row.attributes[i].value = "";

     //清空旧值
	 this.isInNew = false;
     //this.innermoveRecord(data.absolutePosition,"new");
	 //this.innermoveRecord(data.absolutePosition,"new");
     this.innermoveRecord(data.length,"move");	
	 this.adjustSumValue(2);
     //this.adjustSumValue(2);

     result = true;
	}
   }
  return result;
}

TTable.prototype.appendRecord = function(values){
  this.insert();
  fieldCount = this.fields.length;
  if(fieldCount>values.length) 
    fieldCount = values.length;
  for(i=0;i<fieldCount;i++)
	this.$set(this.fields[i].fieldName,values[i]);
  this.post();  
}

/*删除记录,成功时返回true*/
TTable.prototype.Delete = function(){
  var dSet = this;
  if(dSet.readOnly||(!dSet.canDelete)) return false;

  var data = dSet.pData;
  var metadata = dSet.pMeta;
  var delta = dSet.pDelta;
  var result = false;
   
  var row = this.RecRow;

  if(parseInt(row.getAttribute("RT"))>0)
    if(dSet.BeforeDelete==null||dSet.BeforeDelete(dSet)){

      //处理主从关系

	  var dDSet = dSet.dDataset;
	  var delResult = true;
 
      
	  for(var i=0;delResult&&i<dDSet.length;i++)
        delResult = dDSet[i].deleteDetail();	 

      if(!delResult) return false;

      switch(parseInt(row.getAttribute("RT"))){
        case 1:<!--未被修改的记录 -->
               var dRecNo = this.__addDelta();
               row.setAttribute("RT","4");   			<!--被删除的记录-->
               this.cloneRecord(this.DeltaRecRow,row,true);    	<!--复制data到delta-->
               break;
        case 2:<!--被修改了的记录 -->
               var n = locateRecord(delta,row.getAttribute("RL"),"1",2);<!--查找类型为2的记录-->
               if(n>0){     <!--n>0表示本次修改已经被记录在delta中，要先处理delta -->
			     this.setDeltaRecRow(n);   				<!--定位delta-->
                 this.DeltaRecRow.setAttribute("RT","4");<!--设置成被删除标记 -->
				 delta[0].parentNode.removeChild(delta[n-1]);		<!--删除被修改的-->
               } else {
				 this.setDeltaRecRow(1);    
                 this.DeltaRecRow.setAttribute("RT","4");
                 var dRecNo = this.__addDelta();
                 copyRecord(delta,1,delta.length);  <!--复制原记录-->
               }
               break;
        case 3:<!--新增加的记录-->
               var n = locateRecord(delta,row.getAttribute("RL"),"3",2);<!--查找类型为2的记录-->
			   if(n>0){     <!--n>0表示本次插入已经被记录在delta中，要先处理delta -->
			     delta[0].parentNode.removeChild(delta[n-1]);		<!--删除被修改的-->
               }
			   break;
      }

      dSet.adjustSumValue(2);
 
      
      var x = this.RecNo;
      this.indexDefs.delAdjust(x); 		

      if(data.length==1){
        for(var i=4;i<row.attributes.length;i++)
          row.attributes[i].value = "";

        row.setAttribute("RT","0");
        row.setAttribute("RS","0");
        row.setAttribute("RL","0");
        row.setAttribute("RR","0");
      }else{
        this.__delRow();  <!--删除当前记录-->
	    x = this.RecNo;
	  }

      dSet.innermoveRecord(x,"move");	

      if(dSet.AfterDelete!=null) dSet.AfterDelete(dSet);  //调用删除后时间
      result = true;
    }
  return result;
}
/*删除全部从表数据*/
TTable.prototype.deleteDetail = function(){
  var bResult = true;
  var n = this.getRecordCount();
  this.enableControl = false;
  for(var i=n;i>=1&&bResult;i--){
    this.setRecRow(i);
	bResult = this.Delete();
  }
  this.enableControl = true;   
  this.triggerDataChange(null,"open");
  return bResult; 
}
/*编辑记录*/
TTable.prototype.editRow = function(){

  var dSet = this;
  var data = dSet.pData;
  var metadata = dSet.pMeta;
  var delta = dSet.pDelta;
  var result = false;
  var rsState = false;

  var row = this.RecRow;
  
  if(row.getAttribute("RT")=="0")  //空闲记录 
    result = dSet.insert();
  else{
    rsState = row.getAttribute("RS")=="0"; 	  	   

    result = !rsState||dSet.BeforeEdit==null||dSet.BeforeEdit(dSet);

    if(result)
      if(rsState){
        row.setAttribute("RS","1");   <!-- 设置为编辑状态 -->	
 	    dSet.triggerDataChange(null,"edit");
        if(dSet.AfterEdit!=null) dSet.AfterEdit(dSet);	 
	  }
  }
  return result;
}

TTable.prototype.deleteRow = function(){
  var dSet = this;
  var data = dSet.pData;
  var metadata = dSet.pMeta;
  var delta = dSet.pDelta;
  var result = false;
  var row = this.RecRow;
  
  dSet.adjustSumValue(2);

  var x = this.RecNo;
  this.indexDefs.delAdjust(x); 		
  
  if(data.length==1){
   for(var i=4;i<row.attributes.length;i++)
    row.attributes[i].value = "";

   row.setAttribute("RT","0");
   row.setAttribute("RS","0");
   row.setAttribute("RL","0");
   row.setAttribute("RR","0");
  }else {
    this.__delRow(); <!--删除当前记录-->
    x = this.RecNo;
  }
  
  dSet.innermoveRecord(x,"move");	
}

/*取消编辑的记录*/
TTable.prototype.cancelRow = function(){
  var dSet = this;
  var data = dSet.pData;
  var metadata = dSet.pMeta;
  var delta = dSet.pDelta;
  var row = this.RecRow;
  var result = false;
 
  if(parseInt(row.getAttribute("RT"))>0&&parseInt(row.getAttribute("RS"))>0)
   if(dSet.BeforeCancel==null||dSet.BeforeCancel(dSet)){
    switch(parseInt(row.getAttribute("RS"))){
        case 1: <!--修改状态-->
                this.setDeltaRecRow(1);
                this.cloneRecord(row,this.DeltaRecRow,false); <!--复制delta到data-->
                row.setAttribute("RS","0");
				dSet.innermoveRecord(this.RecNo,"post");	
                break;
        case 2: <!--插入状态-->
                this.deleteRow(); <!--直接删除-->
    }
    if(dSet.AfterCancel != null) dSet.AfterCancel(dSet);
    result = true;
   }
  return result;
}

/*删除本地所有数据,不记录日志*/
TTable.prototype.emptyDataset=function(){
	
  var dDSet = this.dDataset;
  for(var i=0;i<dDSet.length;i++)
    dDSet[i].emptyDataset();
   
  var data = this.pData;
  var delta = this.pDelta;
  var nRows = data.length;
  
  for(var i=nRows;i>=2;i--){
    data[0].parentNode.removeChild(data[i-1]);
  }
  
  var row = this.setRecRow(1);
  
  for(var i=4;i<row.attributes.length;i++)
   row.attributes[i].value = "";

  for(var i=0;i<this.fields.length;i++)
   this.fields[i].sumValue = 0;
   
  row.setAttribute("RT","0");
  row.setAttribute("RS","0");
  row.setAttribute("RL","0");
  row.setAttribute("RR","0");
  
  nRows = data.length;
  
  for(var i=nRows;i>=2;i--){
    delta[0].parentNode.removeChild(delta[i-1]);
  }
  
  this.setDeltaRecRow(1);
 //清空索引
  this.indexDefs.clearNode();
  this.calSumValue();
  this.triggerDataChange(null,"open");
}

/*删除所有记录*/
TTable.prototype.DeleteAll=function(){
  ncount = this.getRecordCount();
  while(ncount>0){
    this.Delete();
	ncount--; 
  }
}

/*清除日志中的数据*/
TTable.prototype.resetData=function(){
  var dSet = this;
  var data = dSet.pData;
  var metadata = dSet.pMeta;
  var delta = dSet.pDelta;
  var n = dSet.RecNo;    <!--原来的位置-->
  <!--处理数据-->
  for(var i=0;i<data.length;i++){
    if(parseInt(data[i].getAttribute("RT"))>1) data[i].setAttribute("RT","1");     <!--设置旧记录标记 -->
  }

  this.setRecRow(n);

  <!--处理变化的数据-->
  var nRows = delta.length;
  
  for(var i=nRows;i>=2;i--){
   delta[0].parentNode.removeChild(delta[i-1]);
  }
  
  this.setDeltaRecRow(1);
  
  this.cloneRecord(this.DeltaRecRow,this.RecRow,true); 	<!--复制data到delta-->
  
  if(this.enableControl) 
   this.triggerDataChange(null,"move");
}

TTable.prototype.reSet = TTable.prototype.resetData;
/**数据校验函数系列*/

 /*检查索引*/
TTable.prototype.validateKeyField = function(iDef,nState,errCode){
 if(this.OnKeyFieldError!=null)
   this.OnKeyFieldError(this,iDef,nState,errCode);
 else{
   alert(iDef._keyErrorMsg);
   if(this.OnKeyFieldError2!=null)
     this.OnKeyFieldError2(this,iDef,nState,errCode);
 }
}
 /*校验一个字段*/
TTable.prototype.validateField = function(sfield,value,checkIsNull){
  var result = true;
  var fieldType = 0;
  var field = this.getFieldBySField(sfield);
  if(field!=null){
   //获取数据类型
   fieldType = parseInt(field.dataType);
	
   if(checkIsNull&&!field.isNull){

    if(value==null||value==""){
//     alert("错误信息："+"字段不能为空值\n数 据 项："+field.displayLabel+"("+this.tableName+")");
     alert(field.displayLabel+"是必填项，不能为空.\n\n["+field.fieldName+"]");
     result = false;
	 this.changeFocus(field.fieldName);
	 this.resetAllState();	 
    }
   }
   //检查格式是否合法
   //检查宽度
   if(result)
     switch(fieldType){
         case 2: //数字类型
		 case 3:
		 case 4:
		 case 5:
		        value = $Value(value);
                result = !isNaN(value); //isNaN检查一个值是否是合法的数字
                if(!result)
/*                 alert("提    示："+value+"不是一个合法的数字.\n  "+
                       "数 据 项："+field.displayLabel+"\n  "+
                       "输入的值："+value); */
                 alert(field.displayLabel+value+"不是一个合法的数字.");
				else
				 if(parseFloat(	value)>=10000000000000){
				  alert("输入的数字太大:"+value);	 
				  result = false;
   		  		  this.resetAllState();
				 }else{
 				  var svalue = value+"";

				  if(field.precision==0&&svalue!=null&&svalue.indexOf(".")>-1){
                   alert(field.displayLabel+"不能为小数("+value+"). ");
				   result = false;
   		  		   this.resetAllState();
				  }
				 }
                break;
         case 1: //CHAR类型
         case 12://VARCAHR2类型
              if(result&&checkIsNull&&value!=null){
                var width = parseInt(field.size); <!--字段宽度-->
                var datalen = getLength(value); <!--当前数据宽度-->
				if(datalen>100) value = value.substring(0,100)+"\n......";
                if(datalen>width){
                   alert(field.displayLabel+"输入的值超过允许的宽度.\n  "+
                         "允许宽度："+width+"，实际宽度："+datalen+"\n"+
                         "输入的值："+value);
                   result = false;
  		           this.resetAllState();				   
                }
              }
              break;
         case 93: //DATE
              break;
     }
     //约束检查
 	if(result){
      var fStr = field.constrant;
      if(fStr != "") {  // 存在约束
       var v = value;
       result = eval(fStr);
       if(!result){
        fStr = field.errorMsg;
        fStr = (fStr!="")?fStr:"输入的值不符合要求.  ";
		if(value=="")
		 alert(field.displayLabel+fStr);
		else
         alert(field.displayLabel+fStr+"\n输入的值："+value);
		this.resetAllState();		
       }
      }
    }

     //格式检查
 	if(result){
      var fStr = field.format+"";
      if(fStr != "") {  // 存在约束
       var nRxp = new RegExp(fStr);
       result = nRxp.test(value);
	   nRxp = null;
       if(!result){
        fStr = field.formatErr;
        fStr = (fStr!="")?fStr:"输入的值不合法.  ";
		if(value=="")
		 alert(field.displayLabel+fStr);
		else
         alert(field.displayLabel+fStr+"\n输入的值："+value);
		this.resetAllState();
       }
      }
    }

    if(result)
     if(this.OnValidateData!=null)  //用户校验数据
      result = this.OnValidateData(this,field,value);


    if(!result){    //调用校验错误
	 var rResult = true
	 
     if(this.OnValidateError!=null)
      rResult = this.OnValidateError(this,field,value);
	  
	 if(rResult||typeof(rResult)=="undefined")
	  this.changeFocus(field.fieldName);	 
	}
    
    if(!result) this.triggerDataChange(field,"edit");
   }
   return result;
  }
 <!--校验一条记录-->
TTable.prototype.Validate = function(){
  dSet = this;
  var result = true;      <!--返回的结构 -->
  var sfield = null;
  var data = dSet.pData,delta=dSet.pDelta;
  var row = this.RecRow;
  for(var i=4;result&&i<row.attributes.length;i++){
   sfield = row.attributes[i];
   result = this.validateField(sfield,sfield.value,true);
  }

  this.__postmark = result; 
  return result;
}

 <!--检验一个值是否符合某个字段-->
TTable.prototype.validateWithValue = function(fieldName,value){
  var sField = this.fieldByName[fieldName].sField;
  var result = this.validateField(sField,value,false);
  return result;
}

 /*校验记录是否能确认，但不提示错误*/
 
TTable.prototype.checkRecodePost = function(sfield,value,checkIsNull){
  var result = true;
  var fieldType = 0;
  var field = this.getFieldBySField(sfield);
  if(field!=null){
   //获取数据类型
   fieldType = parseInt(field.dataType);
   if(checkIsNull&&!field.isNull)
    result = value!=null&&value!="";

   if(result)
    switch(fieldType){
       case 2: //数字类型
              result = !isNaN(value); //isNaN检查一个值是否是合法的数字
              break;
       case 1: //CHAR类型
       case 12://VARCAHR2类型
             if(result&&value!=null){
                var width = nvl(field.Width,0); <!--字段宽度-->
                var datalen = getLength(value); <!--当前数据宽度-->
                result = width==0||datalen<=width;

			 }
             break;
         case 93: //DATE
              break;
    }
  //约束检查
   if(result){
    var fStr = field.constrant;
    if(fStr != "") {  // 存在约束
     var v = value;
     result = eval(fStr);
    }
   }

   if(result)
    if(this.OnValidateData!=null)  //用户校验数据
     result = this.OnValidateData(this,field,value);
   }
  return result;
 }
  
TTable.prototype.canPost = function(){
  dSet = this;
  this.isCheckPost = true;
  var result = true;      <!--返回的结构 -->
  var sfield = null;
  var data = dSet.pData,delta=dSet.pDelta;
  
  var row = this.RecRow;
  for(var i=4;result&&i<row.attributes.length;i++){
   sfield = row.attributes[i];
   result = this.checkRecodePost(sfield,sfield.value,true);
  }
  
  this.isCheckPost = false;
  return result;
}

TTable.prototype.canFirstInsert = function(){
  var result = !this.readOnly&&(this.canInsert||this.canModity);

  if(result)
   if(this.isEmpty()&&this.mDataset!=null){
    result = !this.mDataset.isEmpty()&&this.mDataset.getFieldValue(this.linkField)!="";
    result = result&&(this.BeforeInsert==null||this.BeforeInsert(this));
   }
  return result;
}

/*检查isNullEx设置为false的字段是否为空,wbEmpty=true,数据集为空也检查*/
TTable.prototype.checkIsNullEx = function(wbEmpty){
  var cdSet,dSet = this;
  var result = true;      <!--返回的结构 -->
  var bEmpty = typeof(wbEmpty)!="undefined"&&wbEmpty;
  
  if(!dSet.isEmpty()||bEmpty){
   var sfield = null;
   var value = "";
   var data = dSet.pData,delta=dSet.pDelta;
   var row = this.SelRow;
   
   for(var i=4;result&&i<row.attributes.length;i++){
    sfield = row.attributes[i];
    var field = dSet.getFieldBySField(sfield);
    if(field!=null){
     value = sfield.value;
     if(!field.isNullEx)
      if(value==null||value==""){
       alert(field.displayLabel+"是必填项，不能为空.\n\n["+field.fieldName+"]");
       result = false;
  	   this.changeFocus(field.fieldName); 
	  }
    }
   }
  
  if(result) 
   for(var i=0;result&&i<dSet.dDataset.length;i++){
    cdSet = dSet.dDataset[i];  	 
    result = cdSet.checkIsNullEx(bEmpty);
   }

  if(result) 
   for(var i=0;result&&i<dSet.dDataset.length;i++){
    cdSet = dSet.dDataset[i];  	 
    if(cdSet.dEmptyNotSaveEx&&cdSet.isEmpty()){
 	 result = false; 
	 alert(cdSet.deNSaveHint);
    }
   }
  }
 return result;	
}

 /*本地记录确认*/
TTable.prototype.post =  function(){
  var dSet = this;

  var data = dSet.pData;
  var metadata = dSet.pMeta;
  var delta = dSet.pDelta;
  var result = false;
  var row = this.RecRow;
  
  <!--不在编辑或者插入状态 -->

 // if(!this.__saveDataStatus)
  if(row.getAttribute("RS")=="0"||row.getAttribute("RS")==null)
    return true;
  if(dSet.BeforePost==null||dSet.BeforePost(dSet)){
   if(dSet.logFields != null)
	 for(var i=0;i<dSet.logFields.length;i++)
	   dSet.innersetFieldValue(dSet.logFields[i],dSet.logValues[i],false);

   this.__postmark = this.dsDataUpdate();	  

   if(this.__postmark&&dSet.Validate()){
    <!--此处加入确认操作代码-->
	result = true;
    switch(parseInt(row.getAttribute("RT"))){ <!-- 3 新记录 -->
        case 3:
		       if(row.getAttribute("RS")=="2"){   <!-- 2 插入状态 把数据存到Delta中-->
			   
			    result = this.indexDefs.addAdjust(this.RecNo)==0; 		       

                if(!result) break;
				
                var dobj = this.__addDelta();
                row.setAttribute("RS","0");
                this.cloneRecord(dobj,row,true); <!--复制data到delta-->
                break;
               }
               <!--注意，新记录的修改执行case 2的代码-->
        case 2:<!--修改的记录(重复修改)-->
	           result = this.indexDefs.editAdjust(this.RecNo)==0; 		       
               if(!result) break;
               var n = locateRecord(delta,row.getAttribute("RL"),row.getAttribute("RT"),2);
               if(n>0){
                row.setAttribute("RS","0");
				this.setDeltaRecRow(n);
                this.cloneRecord(this.DeltaRecRow,row,true);
               }
               break;
        case 1:<!--修改的记录(第一次修改)-->
		       //调整索引
 	           result = this.indexDefs.editAdjust(this.RecNo)==0; 		       
				 
               if(!result) break;
               if(row.getAttribute("RS")=="1"){
                var dobj = this.__addDelta();
                row.setAttribute("RS","0");
                row.setAttribute("RT","2");
                copyRecord(delta,1,this.DeltaRecNo);  <!--复制原记录-->
                dobj.setAttribute("RT","1");
                dobj = this.__addDelta();
                this.cloneRecord(dobj,row,true);
				
               }
    }
	if(result){
		
     this.innermoveRecord(this.RecNo,"post");
     this.adjustSumValue(3);

     if(dSet.AfterPost!=null) dSet.AfterPost(dSet);
	 
	 for(var i=0;i<dSet.fields.length;i++){
      dSet.fields[i].oldValue = row.attributes[i+4].value;
      dSet.fields[i].priorValue = dSet.fields[i].oldValue;	
      dSet.fields[i].postValue = dSet.fields[i].oldValue;		  
      dSet.fields[i].oValue = dSet.fields[i].oldValue;		  	  
     }
	}
   }
  }
  this.__postmark = true;
  return result;
}

//递归调用post方法
TTable.prototype.postAll = function(){
 var dSet = this;	
 var result = dSet.post();
 for(var i=0;result&&i<dSet.dDataset.length;i++) 
  result = dSet.dDataset[i].postAll();
 return result; 
}
/**移动记录方法集*/
/*检查记录集是否为空*/
TTable.prototype.isEmpty = function(){
  var dSet = this;
  return (dSet.pData.length==0||dSet.pData[0].getAttribute("RT") == "0");
}
/*检查记录时候在最后*/
TTable.prototype.isLast = function(){
  var dSet = this;
  return dSet.pData.length==this.RecNo;
}

TTable.prototype.dataToDelta = function(){
  this.DeltaRecNo = 1;
  this.DeltaRecRow = this.pDelta[0]; //当前日志行指针
  this.cloneRecord(this.DeltaRecRow,this.RecRow,true);
}

 <!--内部移动记录-->
TTable.prototype.innermoveRecord = function(toRow,att){
  var dSet = this;
  var data = dSet.pData,metadata = dSet.pMeta,delta = dSet.pDelta;
  var result = true;
  var bMark = this.RecNo != toRow;

  this.setRecRow(toRow);

  var row = this.RecRow;

  if(bMark){
    for(var i=0;i<dSet.fields.length;i++)
      dSet.fields[i].oValue = row.attributes[i+4].value;	
  }
  
  if(row.getAttribute("RS")=="0"){
	var dobj = this.setDeltaRecRow(1);   <!--复制记录到缓冲中--> 
    this.cloneRecord(dobj,row,true);
  }
   
  if(att=="new"&&dSet.OnNewRecord != null)
    dSet.OnNewRecord(dSet);
  else{
    if(att!="post"&&dSet.OnInnerRowEnter!=null) <!--内部记录移动产生的变化-->
      dSet.OnInnerRowEnter(dSet);
  }

  if(dSet.OnRecordChange != null)
    dSet.OnRecordChange(dSet);
  this.adjustSumValue(-1);
  //激活数据源事件
  this.triggerDataChange(null,att);
	
  return result;
}

 <!--移动记录-->
TTable.prototype.moveRecord = function(toRow){
  var dSet = this;
  var data = dSet.pData,metadata = dSet.pMeta,delta = dSet.pDelta;
  var result = true;

  if(toRow<1) toRow = 1;
  if(toRow>data.length) toRow = data.length;

  if(this.RecNo != toRow){ <!--已经相等了不需要移动-->
 
   result = this.postAll();

   if(result){
	var row = this.setRecRow(toRow);    <!--移动记录到指定的位置-->
    var dobj = this.setDeltaRecRow(1);	<!--复制记录到缓冲中-->
    this.cloneRecord(dobj,row,true);

    this.adjustSumValue(-1);

    if(dSet.OnRecordChange != null) dSet.OnRecordChange(dSet);
    //激活数据源事件
    this.triggerDataChange(null,"move");
    for(var i=0;i<dSet.fields.length;i++)
      dSet.fields[i].oValue = row.attributes[i+4].value;		  	  
   }
  }
  return result;
}

TTable.prototype.recNo = function(){
  return this.isEmpty()? 0:this.RecNo;	
}

TTable.prototype.isBof = function(){
 return this.isEmpty()||this.RecNo==1;
}

TTable.prototype.isEof = function(){
 return this.isEmpty()||this.RecNo==this.pData.length;
}

TTable.prototype.isEofAll = function(){
 return this.isEmpty()||
        (this.RecNo==this.pData.length&&(this.pageSize==0||this.pageNumber==this.pageCount));
}

 <!--第一条记录-->
TTable.prototype.first = function(){
  var result = false;
  if(this.RecNo>1&&this.post())
    result = this.innermoveRecord(1,"move");
  return result;
}

 <!--向前移动记录-->
TTable.prototype.next = function(){
  var dSet = this;
  var result = true;
  if(dSet.RecNo<dSet.pData.length&&dSet.post()){
    result = dSet.innermoveRecord(dSet.RecNo+1,"move");
  }
  return result;
}

TTable.prototype.nextPage = function(){
  result = this.isEofAll();
  if(this.isEof()&&this.pageSize>0){
	if(this.BeforeGetPage==null||this.BeforeGetPage(this))
      this.getNextPage();
  }else this.next();	
  return result;
}
 <!--向后移动记录-->
TTable.prototype.prior = function(){
  var dSet = this;
  var result = false;
  if(dSet.RecNo>1&&dSet.post())
    result = dSet.innermoveRecord(dSet.RecNo-1,"move");
  return result;
}

TTable.prototype.priorPage = function(){
  if(this.isBof()){
	if(this.BeforeGetPage==null||this.BeforeGetPage(this))
      if(this.getPriorPage())
	    this.last();
  }else this.prior();	
}
 <!--最后一条记录-->
TTable.prototype.last = function(){
  var dSet = this;
  var result = false;
  if(dSet.RecNo<dSet.pData.length&&dSet.post())
    result = dSet.innermoveRecord(dSet.pData.length,"move");
  return result;
}

 <!--获取记录数-->
TTable.prototype.getRecordCount = function(){
  if(this.isEmpty())
   return 0;
  else return this.pData.length;
}

//查找数据,找到返回true
TTable.prototype.locate = function(fieldName,value){
  var dSet = this;
  var result = false;

  var nRecno = dSet.RecNo;
  fieldName = fieldName.toUpperCase();
  var n=0,sName = this.fieldByName[fieldName].shortName;
  var isDate = this.fieldByName[fieldName].isDate();
  if(isDate){
   var sd = value+"";
   sd = sd.replace(/\-/g,"/");
   sd = sd.replace(/\./g,"/");
   var d2 = new Date(sd);  
  }
  for(var i=1;!result&&i<=dSet.pData.length;i++){
   var row = dSet.pData[i-1];
   if(isDate){
    var s = row.getAttribute(sName);
    s = s.replace(/\-/g,"/");
	s = s.replace(/\./g,"/");
    var d1 = new Date(s);
    result = d1.getDate()==d2.getDate();
   }else
    result = row.getAttribute(sName)==value;
   n = i;
  }
  
  dSet.setRecRow(nRecno);

  if(result&&n!=nRecno){
   dSet.post();
   dSet.innermoveRecord(n,"move");
  }

  return result;
}
//查找数据,找到返回true
TTable.prototype.locates = function(fieldNames,values){
  var dSet = this;
  var result = false;
  var tempvalues = "",tempFValue = "";
  var n=0;
  for(var i=0;i<values.length;i++)  //组合字段的值
   tempvalues += values[i];
  for(var i=0;i<fieldNames.length;i++)
   fieldNames[i] = this.fieldByName[fieldNames[i]].shortName;

  var nRecno = this.RecNo;

  for(var i=1;!result&&i<=dSet.pData.length;i++){
   var row = dSet.pData[i-1]; 
   tempFValue = "";
   for(var j=0;j<fieldNames.length;j++)
    tempFValue += row.getAttribute(fieldNames[j]);
   result = tempFValue==tempvalues;
   n = i;
  }
  
  dSet.selRecRow(nRecno);
  
  if(result&&n!=nRecno){
   dSet.post();
   this.innermoveRecord(n,"move");
  }
  return result;
}

TTable.prototype.locates2 = function(fieldNames,values){
  var dSet = this;
  var result = false;
  var tempvalues = "",tempFValue = "";
  var n=0;
  for(var i=0;i<values.length;i++)  //组合字段的值
   tempvalues += values[i];
  for(var i=0;i<fieldNames.length;i++)
   fieldNames[i] = this.fieldByName[fieldNames[i]].shortName;

  var nRecno = this.RecNo;

  for(var i=1;!result&&i<=dSet.pData.length&&i!=nRecno;i++){
   var row = dSet.pData[i-1]; 
   tempFValue = "";
   for(var j=0;j<fieldNames.length;j++)
    tempFValue += row.getAttribute(fieldNames[j]);
   result = tempFValue==tempvalues;
   n = i;
  }

  dSet.selRecRow(nRecno);
  
  return (result)?n:0;
}

/*根据当前索引查找数据*/
TTable.prototype.findKey = function(values){
 return false;
}
/*数据变化处理*/
 <!--数据产生变化时-->
TTable.prototype.innerDataChange=function(fieldName){
  if(this.isInNew) return;	
  var dSet = this;
  var data = dSet.pData;
  var field = null;
  var row = this.RecRow;
  
  field = this.fieldByName[fieldName];

  if(row.getAttribute("RT")=="0")  <!--空白记录-->
   this.insert();       <!--产生一个插入事件-->
  else{
   if(row.getAttribute("RS")=="0")
    row.setAttribute("RS","1");    <!-- 设置为编辑状态 -->

   if(dSet.OnFieldChange!=null&&!dSet.lock)
    dSet.OnFieldChange(dSet,field);
	
   dSet.triggerDataChange(field,"edit");
   dSet.adjustSumValue(1);
  }
}

/*交换记录的数据*/
TTable.prototype.changeRecord = function(nFrom,nTo){
  var dSet = this;	
  var data = this.pData;
  var row = this.RecRow;
  if(this.isEmpty()||nFrom>data.length||nTo>data.length||nFrom<1||nTo<1)
   return;

  var tvf = new Array(row.attributes.length);
  var tvt = new Array(row.attributes.length);

  row = this.setRecRow(nFrom);
  
  for(var i=0;i<row.attributes.length;i++)
   tvf[i] = row.attributes[i].value;

  row = this.setRecRow(nTo);
  for(var i=0;i<row.attributes.length;i++){
   tvt[i] = row.attributes[i].value;
   row.attributes[i].value = tvf[i];
  }
  
  dSet.triggerDataChange(null,"post");

  row = this.setRecRow(nFrom);
  for(var i=0;i<row.attributes.length;i++){
   row.attributes[i].value = tvt[i];
  }
  dSet.triggerDataChange(null,"post");
  this.moveRecord(nTo);
}

/*激活数据源的相关事件*/
TTable.prototype.innertriggerDataChange = function(ds,field,att){
  //处理主从关系	
  var dSet = this;

  if(field==null&&this.dynData){
    var dDSet = this.dDataset;
    for(var i=0;i<dDSet.length;i++){
	   
	  var lfield = this.fieldByName[dDSet[i].linkField];   
      var nKey = lfield.sField.value;  
	  var dataType=parseInt(lfield.dataType);
	 
	  if(nKey==""&&dataType>=2&&dataType<=5)
	    nKey = "0";
	  
      if(nKey!=this.oLinkValue[i]){
	    this.oLinkValue[i] = nKey; 	
	    var params = [nKey];
	    if(dDSet[i].BeforeGetData!=null)
	      params = dDSet[i].BeforeGetData(this,params);
        dDSet[i].innergetDataFromServer(dDSet[i].sqlID,params);
	  }
	 
    }
  }
  
  if(this.enableControl){
    ds.triggerEvent(ds,this,field,att);
  }
  
  this.doDataChange(this,field);
}

TTable.prototype.doDataChange = function(dSet,field){
 if(this.mDataset!=null)     //如果是从表，事件向上传递
  this.mDataset.doDataChange(dSet,field);
 else	 
  if(this.OnDataChange!=null)
   this.OnDataChange(dSet,field);
}

//驱动各数据集事件
TTable.prototype.triggerDataChange = function(field,att){
  var dSet = this;
  for(var i=0;i<dSet.dataSourceCount;i++)
    if(typeof(dSet.dataSources[i])!="undefined"&&dSet.dataSources[i]!=null){
      var ds = dSet.dataSources[i];
	  if(att=="new"||att=="sum"||att=="open"){
	    //for(var j=0;j<dSet.fields.length;j++)
	    if(att=="open")
	      this.doSort(this.sortFieldName,this.sortAtt);
        this.innertriggerDataChange(ds,null,att)
	    //this.innertriggerDataChange(ds,dSet.fields[j],att)
	  }else{
        this.innertriggerDataChange(ds,field,att);
	  }
    }
}

//驱动各数据集事件
TTable.prototype.changeFocus = function(fieldName){
  var dSet = this;
  
  if(dSet.OnChangeFocus!=null) dSet.OnChangeFocus(dSet,fieldName);
  
  for(var i=0;i<dSet.dataSourceCount;i++)
   if(typeof(dSet.dataSources[i])!="undefined"&&dSet.dataSources[i]!=null){
    var ds = dSet.dataSources[i];
	if(ds.changeFocus(fieldName)) break;
   }
}

//检查数据源绑定的编辑控件数据已提交到数据集中
TTable.prototype.dsDataUpdate = function(){
  var dSet = this;
  var result = true;
  for(var i=0;result&&i<dSet.dataSourceCount;i++)
   if(typeof(dSet.dataSources[i])!="undefined"&&dSet.dataSources[i]!=null){
    var ds = dSet.dataSources[i];
	result = ds.dataUpdate();
   }
  return result; 
}

/*计算方法集*/
TTable.prototype.doSumValue = function(att){ 
 this.triggerDataChange(null,"sum");	
 if(att>=0&&this.OnCalSumValue!=null)  this.OnCalSumValue(this);	
}

TTable.prototype.setSumValue = function(fieldName,sumValue){
 var field = this.fieldByName[fieldName];
 if(field==null) field = this.fieldByShortName[fieldName];
 if(field!=null)
   field.sumValue = sumValue;
}
 <!--计算合计-->
TTable.prototype.calSumValue = function(att){
  var dSet = this;

  if(!dSet.fixedTotal){
   if(dSet.calTotal||(typeof(att)!="undefined"&&att)){
    var data = dSet.pData;
    var recno = this.RecNo;
    var i = 0;

    for(i=0;i<dSet.fields.length;i++)  <!--合计设置为 -->
     if(dSet.fields[i].dataType >= 2&& dSet.fields[i].dataType<=5){ <!--数字类型,先设置为0 -->
      dSet.fields[i].sumValue = 0.0;
      dSet.fields[i].maxValue = 0.0;
      dSet.fields[i].minValue = 0.0;
     }

    if(!dSet.isEmpty()){
     <!--计算合计和求最大值-->
     for(var j=0;j<data.length;j++){
      var row = data[j];
      for(i=0;i<dSet.fields.length;i++)  <!--合计设置为 -->
       if(dSet.fields[i].dataType >= 2&&dSet.fields[i].dataType<=5){ <!--数字类型 -->
        var value = row.attributes[i+4].value;
	    if(value==""||value==" ") value = 0;
	    else value = parseFloat(value);
	   
        dSet.fields[i].sumValue += value;

        if(dSet.fields[i].maxValue < value)
         dSet.fields[i].maxValue = value;
 
  	    if(dSet.fields[i].minValue > value)
         dSet.fields[i].minValue = value;
       }
     }
    }

    row = this.setRecRow(recno);
 
    for(var i=0;i<dSet.fields.length;i++){
     dSet.fields[i].oldValue = row.attributes[i+4].value;
     dSet.fields[i].priorValue = dSet.fields[i].oldValue;	
    }

    dSet.doSumValue(0);
   }
  }else
   this.triggerDataChange(null,"sum");
}

 <!--调整合计数据-->
TTable.prototype.adjustSumValue = function(att){
  var dSet = this;
  var data = dSet.pData;
  var row = this.RecRow;
  var a,b,c;
  if(dSet.calTotal&&att>=0){
    var result = 0;

    switch(att){
     case 0: <!--增加-->
          for(var i=0;i<dSet.fields.length;i++)
           if(dSet.fields[i].dataType >= 2&&dSet.fields[i].dataType<=5){
			c = nvl(dSet.fields[i].sumValue,0)+nvl(parseFloat(row.attributes[i+4].value,10),0);    
            dSet.fields[i].sumValue = Math.round(Math.pow(10,6)*c)/Math.pow(10,6);
		   }
          break;
     case 1: <!--修改-->
	      if(data.length==1){
           for(var i=0;i<dSet.fields.length;i++)		  
            if(dSet.fields[i].dataType >= 2&&dSet.fields[i].dataType<=5){
		 	 b = nvl(parseFloat(row.attributes[i+4].value,10), 0);
             dSet.fields[i].sumValue = Math.round(Math.pow(10,6)*b)/Math.pow(10,6);
		    }
		  }else
           for(var i=0;i<dSet.fields.length;i++)		  
            if(dSet.fields[i].dataType >= 2&&dSet.fields[i].dataType<=5){
			 a = nvl(dSet.fields[i].sumValue,0); 
		 	 b = nvl(parseFloat(row.attributes[i+4].value,10), 0);
	 		 c = nvl(dSet.fields[i].oldValue, 0);
			 //alert(a+","+b+","+c);
			 c = a+b-c;	
             dSet.fields[i].sumValue = Math.round(Math.pow(10,6)*c)/Math.pow(10,6);
		    }
          break;
     case 2: <!--删除-->
          for(var i=0;i<dSet.fields.length;i++)
           if(dSet.fields[i].dataType >= 2&&dSet.fields[i].dataType<=5){
			c = nvl(dSet.fields[i].sumValue,0)-nvl(parseFloat(row.attributes[i+4].value,10), 0);   
            dSet.fields[i].sumValue = Math.round(Math.pow(10,6)*c)/Math.pow(10,6);
           }
          break;
    }

    for(var i=0;i<dSet.fields.length;i++){
     dSet.fields[i].oldValue = row.attributes[i+4].value;
	 dSet.fields[i].priorValue = dSet.fields[i].oldValue;
	}

    dSet.doSumValue(att);
  }
 
  //记录旧值
  if(att==-1)
   for(var i=0;i<dSet.fields.length;i++){
    dSet.fields[i].oldValue = row.attributes[i+4].value;
    dSet.fields[i].priorValue = dSet.fields[i].oldValue;
	dSet.fields[i].postValue = dSet.fields[i].oldValue;
   }
}
  <!--获取某个字段的最大值-->
TTable.prototype.getMaxValue = function(fieldName){
  dSet = this;
  var data = dSet.pData;
  var n = this.RecNo;
  var nMax = "",mValue = ""
  var nnMax = 0,nmValue = 0;
  
  fieldName = fieldName.toUpperCase();
  
  var field = this.fieldByName[fieldName];
  
  fieldName = field.sField.name;   //字段短名
  
  if(!field.isNumberType()){
	if(this.isEmpty())
	  nMax = "";
	else  
      for(var i=0;i<data.length;i++){
        mValue = data[i].getAttribute(fieldName);
        nMax = (nMax<mValue)?mValue:nMax;
      }
  }else{
	if(this.isEmpty())
	  nMax = 0;
	else   
      for(var i=0;i<data.length;i++){
        nmValue = parseFloat(data[i].getAttribute(fieldName));
        nnMax = (nnMax<nmValue)?nmValue:nnMax;
      }
    nMax = nnMax+"";
  }
  
  this.setRecRow(n);
  if(nMax==""&&field.isNumberType())
    nMax = "0";
   
  if(field.isInteger())
    return parseInt(nMax,10);
  else 
    if(field.isFloat())
      return parseFloat(nMax,10);
    else 	
      return nMax;
}

 <!--获取某个字段的最小值-->
TTable.prototype.getMinValue = function(fieldName){
  dSet = this;
  var data = dSet.pData;
  var nMax = 0,mValue = 0;
  
  fieldName = fieldName.toUpperCase();
  
  var field = this.fieldByName[fieldName];
  
  fieldName = field.sField.name;   //字段短名
  
  for(var i=0;i<data.length;i++){
    mValue = parseFloat(data[i].getAtributs(fieldName));
    nMax = (nMax>mValue)?mValue:nMax;
  }

  return nMax;
}

<!--获取某个字段的合计值-->
TTable.prototype.getSumValue = function(fieldName){
  var dSet = this;
  var result = 0;
  fieldName = fieldName.toUpperCase();
  for(var i=0;i<dSet.fields.length;i++)
   if(dSet.fields[i].fieldName == fieldName){
    result = dSet.fields[i].sumValue;
    if(isNaN(result))
      result = 0;
    break;
   }
  return result;
}

<!--获取某个字段的合计值-->
TTable.prototype.getFieldsSumValue = function(fieldNames){
  var dSet = this;
  var result = 0;
  for(var i=0;i<fieldNames.length;i++){
    result += dSet.$(fieldNames[i]);  
  }
  return result;
}

//设置字段的值
TTable.prototype.setFieldValue = function(fieldName,value,bOnChange){
  var dSet = this;
  var result = true;
  var bDcce = typeof(bOnChange)=="undefined"||bOnChange;
  fieldName = fieldName.toUpperCase();
  var field = this.fieldByName[fieldName];
  try{
   var tValue = field.sField.value;
  }catch(ex){
   this.resetAllState();	  
   new TExpection(1,"字段"+fieldName+"不存在数据集中."); 	  
  }
  var dataType = field.dataType; 
  var nResult = true;
  value = field.rightTrim? $rightTrim(value):value;

  if(field.isNumberType()){  //数字类型转换为数字比较
   if(value!=null&&value!="")  
    value = parseFloat($Value(value),10)+""; 
   nResult = parseFloat(tValue,10)==parseFloat(value,10);
  }
  else{
	switch(field.charCase){
	  case 1:
		   value = value.toUpperCase();
		   break;
	  case 2:  
		   value = value.toLowerCase();
		   break;
	}
    nResult = tValue == value;
  }
	//如果是字符串，检查字符串长度,并截取
  if(!nResult){	
/*   if(dataType==1||dataType==12)
	if(field.size<getLength(value)){
     alert("数据项 ["+field.displayLabel+"] 设置的值太长，系统切断超长的值.\n"+
		   "字段允许长度 "+field.size+" ,实际值长度 "+getLength(value));	  
	 value = value.substring(0,field.size-1);
    }  */
   if(dSet.editRow()){  //设置为编辑状态

    result = this.validateWithValue(fieldName,value);   
	if(result){
 	 field.isSetValue = true;
	 dSet.origField = field;
     field.oldValue = field.sField.value;
     field.sField.value = value+""; 
 	 field.priorValue = field.sField.value;
	 
	 field.srChange = this.__saveRecord;
     //选择记忆功能
 	 if(this.selectRecord&&fieldName==this.selectField){ 
	  var kvalue = this.csplit+this.fieldByName[this.recordField].sField.value+this.csplit;

      var kpos = this.selected.indexOf(kvalue); 

	  if(this.selectValue==value&&kpos<0)
		this.selected.push(kvalue);
	  else
	    if(this.selectValue!=value&&kpos>-1)
		 this.selected.splice(kpos,1);
	 }
     //处理合计
     if(bDcce){
	   if(!this.lockField&&field.OnChange!=null&&!field.OnChanging){
	     field.OnChanging = true;	 
	     this.lockField = true;
		 if(field.OnChangeOld!=null)
		   field.OnChangeOld(field);
         field.OnChange(field);
	     this.lockField = false;
	     field.OnChanging = false;	 
	   }

	   if(field.OnChangeEx!=null&&!field.OnChanging){
		 field.OnChanging = true;	 
         field.OnChangeEx(field);
	     field.OnChanging = false;	
	   } 
	 }

     //激活数据源事件
     dSet.innerDataChange(fieldName);
     field.isSetValue = false;

	 if(dSet.OnSetValue!=null) dSet.OnSetValue(field);
	}
   }
  }
  return result;
}

TTable.prototype.$set = function(fieldName,value,bOnChange){
  return this.setFieldValue(fieldName,value,bOnChange);
}

 //内部设置字段的值用
TTable.prototype.innersetFieldValue = function(fieldName,value){
  var dSet = this;
  var result = true;
  var field = this.fieldByName[fieldName.toUpperCase()];
  
  var nResult = true;
  var result = true;
  var tValue = field.sField.value;
   value = field.rightTrim? $rightTrim(value):value;
  
  if(field.isNumberType()){  //数字类型转换为数字比较
   if(value!=null&&value!="")
    value = parseFloat($Value(value),10)+""; 
   nResult = parseFloat(tValue)==parseFloat(value);
  }
  else{
	switch(field.charCase){
	  case 1:
		   value = value.toUpperCase();
		   break;
	  case 2:  
		   value = value.toLowerCase();
		   break;
	}
    nResult = tValue == value;
  }

  if(!nResult)
   if(dSet.editRow()){  //设置为编辑状态
    dSet.origField = field;
    field.oldValue = field.sField.value;
    field.sField.value = value+"";
	field.priorValue = field.sField.value;	
	
    //选择记忆功能
	if(this.selectRecord&&fieldName==this.selectField){ 
	  var kvalue = this.csplit+this.fieldByName[this.recordField].sField.value+this.csplit;
      var kpos = this.selected.indexOf(kvalue); 

	  if(this.selectValue==value&&kpos<0)
		this.selected.push(kvalue);
	  else
	    if(this.selectValue!=value&&kpos>-1)
		 this.selected.splice(kpos,1);
	}
	
    //处理合计
	field.srChange = this.__saveRecord;
    if(field.OnChange!=null&&!this.fieldLock&&!field.OnChanging){
      field.OnChanging = true;	 	
      this.lockField = true;	 
	  if(field.OnChangeOld!=null)
		field.OnChangeOld(field);
      result = field.OnChange(field);
	  this.lockField = false;	 
      field.OnChanging = false;	 	 
	}
	
	if(field.OnChangeEx!=null&&!field.OnChanging){
	  field.OnChanging = true;	 
      field.OnChangeEx(field);
	  field.OnChanging = false;	
	} 
     //激活数据源事件
    dSet.innerDataChange(fieldName);
	if(dSet.OnSetValue!=null) dSet.OnSetValue(field);
   }
  //alert("innersetFieldValue="+fieldName);   
  return result||(typeof(result)=="undefined");
}

 //设置字段的所有记录的值
TTable.prototype.setFieldValueAll = function(fieldName,value){
  var dSet = this;
  if(dSet.isEmpty()) return;  
  var nRecNo = this.RecNo;
   dSet.enableControl = false;

  if(dSet.post()){
    for(var i=1;i<=dSet.pData.length;i++){
      this.moveRecord(i);
      this.setFieldValue(fieldName,value);
      if(!dSet.post()) break;
    }
  }
  this.moveRecord(nRecNo);
  dSet.enableControl = true; 
}

 //设置字段的所有记录的值
TTable.prototype.setFieldValueAll0 = function(fieldName){
  var dSet = this;
  if(dSet.isEmpty()) return;  
  
  dSet.enableControl = false;

  var nRecNo = this.RecNo;
  if(dSet.post()){
    for(var i=1;i<=dSet.pData.length;i++){
      this.moveRecord(i);
      this.setFieldValue(fieldName,1-this.getFieldValue(fieldName));
      if(!dSet.post()) break;
    }
  }
  this.moveRecord(nRecNo);
  
  dSet.enableControl = true; 
}

TTable.prototype.setFieldValueAlls = function(fieldNames,values){
  var dSet = this;
  if(dSet.isEmpty()) return;
  
  dSet.enableControl = false;
  var nRecNo = this.RecNo;
  if(dSet.post()){
    for(var i=1;i<=dSet.pData.length;i++){
      this.moveRecord(i);
      for(var j=0;j<fieldNames.length;j++)
        this.setFieldValue(fieldNames[j],values[j],false);
      if(!dSet.post()) break;
    }
  }
  this.moveRecord(nRecNo);
  dSet.enableControl = true; 
}

TTable.prototype.setFieldValueFromAlls = function(toFields,fromFields){
  var dSet = this;
  if(dSet.isEmpty()) return;
  
  dSet.enableControl = false;
  var nRecNo = this.RecNo;
  dSet.post();
  for(var i=1;i<=dSet.pData.length;i++){
   this.moveRecord(i);
   for(var j=0;j<toFields.length;j++)
     this.$set(toFields[j],this.$(fromFields[j]),false);
   dSet.post();
  }
  this.moveRecord(nRecNo);
  dSet.enableControl = true; 
}

TTable.prototype.setValueByResult = function(result,fNames1,vs1,fNames2,vs2){
  var dSet = this;
  if(result){
   for(var i=0;i<fNames1.length;i++)
    if(fNames1[i]!="") dSet.setFieldValue(fNames1[i],vs1[i]);
  }else
   if(typeof(vs2)!="undefined"){
    for(var i=0;i<fNames2.length;i++)
	 if(fNames2[i]!="") dSet.setFieldValue(fNames2[i],vs2[i]);
   }else{ 
    for(var i=0;i<fNames2.length;i++)
     dSet.setFieldValue(fNames2[i],dSet.fieldByName[fNames2[i]].oldValue);
   }
}
  //获取字段的值
TTable.prototype.getFieldValue = function(fieldName){
  if(fieldName!=""){
   try{	  
    fieldName = fieldName.toUpperCase();
    return this.fieldByName[fieldName].getFieldValue(); 
   }catch(ex){
	//alert("字段"+fieldName+"不存在数据集中.");   
   }
  }
  else return null;
}

TTable.prototype.getFieldValues = function(fieldName){
  var values = [];	
  if(fieldName!=""){
    try{	  
      fieldName = fieldName.toUpperCase();
	  fieldName = this.fieldByName[fieldName].shortName;
	  ncount = this.getRecordCount();
	  for(i=0;i<ncount;i++){       
        RecRow = this.pData[i]; 
        values.push(RecRow.getAttribute(fieldName));
	  }
    }catch(ex){
	  //alert("字段"+fieldName+"不存在数据集中.");   
    }
  }
  return values;
}

TTable.prototype.$s = function(fieldName){
  return this.getFieldValues(fieldName);
}

TTable.prototype.$Inner = function(fieldName,format,b0Space){
  fieldName = fieldName.toUpperCase();
  return this.fieldByName[fieldName].$Inner(format,b0Space);
}

TTable.prototype.$ = function(fieldName){
  return this.getFieldValue(fieldName);
}

TTable.prototype.valueByShortName = function(shortName){
  if(shortName!=""){
   try{	  
    shortName = shortName.toUpperCase();
    return this.fieldByShortName[shortName].getFieldValue(); 
   }catch(ex){
	//alert("字段"+fieldName+"不存在数据集中.");   
   }
  }
  else return null;
}

//获取指定记录字段的值
TTable.prototype.getFieldValueByRow = function(fieldName,offRow,defaultValue){
  var n = this.RecNo+offRow;
  var value = defaultValue;
  if(offRow!=0&&n>=1&&n<=this.pData.length){
    this.setRecRow(n);
    fieldName = fieldName.toUpperCase();
    value = this.fieldByName[fieldName].getFieldValue(); 
    this.setRecRow(n-offRow);	
  }
  return value;
}

TTable.prototype.valueIsNull = function(fieldName){
  fieldName = fieldName.toUpperCase();
  var v = this.fieldByName[fieldName].sField.value;
  return v==null||v=="";
}
/*设置字段的特性*/
TTable.prototype.setFieldProp = function(fieldName,propName,value){
  var meta = this.pMeta;
  for(var i=0;i<meta.length;i++){
    var mrow = meta[i];  
   if(fieldName==mrow.getAttribute("A")){
	mrow.setAttribute(propName,value); 	
	break;
   }
  }
}

/**和数据源关联*/
/*绑定数据源*/
TTable.prototype.addDataSource = function(dSource){
  var result = false;
  var dSet = this;
  for(var i=0;!result&&i<dSet.dataSourceCount;i++)
   if(typeof(dSet.dataSources[i])=="undefined"||
      dSet.dataSources[i]==null){
    dSet.dataSources[i] = dSource;
    result = true;
   }
  if(!result){
   dSet.dataSources[dSet.dataSourceCount] = dSource;
   dSet.dataSourceCount ++;
  }
  dSource.dbTable = dSet;
  dSource.datasetChange(dSet);
  this.innertriggerDataChange(dSource,null,"open");
  return dSource;
}
/*移去数据源*/
TTable.prototype.removeDataSource = function(dSource){
  var dSet = this;
  for(var i=0;i<dSet.dataSourceCount;i++)
   if(dSet.dataSources[i]==dSource){
    dSet.innertriggerDataChange(dSet.dataSources[i],null,"close");
    dSet.dataSources[i] = null;
    break;
   }
}

/**数据提交方法集*/
/*数据提交之前事件响应*/
TTable.prototype.doBeforeUpdate = function(){
  var result = true;
  if(this.OnBeforeUpdate!=null)
   result = this.OnBeforeUpdate(this);
  return result;
}

/*数据提交之后事件响应*/
TTable.prototype.doAfterUpdate = function(){
  if(this.OnAfterUpdate!=null)
   this.OnAfterUpdate(this);
}

/*变化的记录数*/
TTable.prototype.getChangeCount = function(){
  return this.pDelta.length-1;	
}

TTable.prototype.dataIsChange = function(){
  var result = this.pDelta.length-1>0||this.getState()>$datasetState.dsBrowse;
  var cdSet;
  for(var i=0;!result&&i<this.dDataset.length;i++){
   cdSet = this.dDataset[i];  
   result = cdSet.dataIsChange();
  }
  return result;	
}

TTable.prototype.refrashData = function(xmlData,bAppend,bSelected){
  var rows = xmlData.getElementsByTagName("RS")[0].childNodes; 

  var recordCount = rows.length;

  var fieldCount = rows[0].attributes.length;
  
  var isEmpty = (recordCount==0)||(rows[0].getAttribute("RL")=="0");
 
 //alert(isEmpty);
  if(!isEmpty)
    this.innerInsert(rows,0,bSelected);
  else{ 
    this.emptyDataset();  //删除所有本地数据  
    //this.calSumValue(true);
    //this.triggerDataChange(null,"open");
    if(this.mDataset==null&&this.noDataHint&&this.__innerNoDataHint)
      alert("没有满足查询条件的数据.");  //由主表引起的从表查询数据,不需要提示该句话
  }
		
  this.__innerNoDataHint = false;
 
  if(this.OnAfterOpen!=null) this.OnAfterOpen(this);   
  if(this.OnPageChange!=null) this.OnPageChange(this);
  if(this.OnRecordChange != null) this.OnRecordChange(this);
  
  this.setCtrlButtonState();
}

/*打开数据集*/
TTable.prototype.innergetDataFromServer = function(sqlid,params,bAppend){
 if(sqlid=="") return; 
 if(this.OnBeforeOpen!=null&&!this.OnBeforeOpen(this)) return;

 var getDSet = function(dSet){
  if(dSet.mDataset==null)
   return dSet;
  else return getDSet(dSet.mDataset); 
 }
 
 var dSet = getDSet(this);

 if(this.getChangeCount()==0||dSet.applyUpdate()>=0){
  var xmlData = __xmlHttp._getDataFromServer(this,sqlid,params,0,0,this.pageName,
											 this.__dataAtt,this.__keyCodes,this.__fixedCols,this.__keyFields);
 
  if(xmlData!=null)
    this.refrashData(xmlData,typeof(bAppend)=="undefined"||bAppend,false);
 }
}

/*打开数据集*/
TTable.prototype.getDataFromServer = function(sqlid,params,bAppend){
 if(this.OnBeforeOpen!=null&&!this.OnBeforeOpen(this)) return;

 if(sqlid!="") this.sqlID = sqlid;
 if(this.sqlID=="") return;
 
 this.params = params;
 var i=0;  
 
 var nF=this.pageSize*(this.pageNumber-1)+1;
 var nT=this.pageSize*this.pageNumber;

 var xmlData = __xmlHttp._getDataFromServer(this,this.sqlID,params,nF,nT,this.pageName,
											this.__dataAtt,this.__keyCodes,
											this.__fixedCols,this.__keyFields);
 
 if(xmlData!=null)
   this.refrashData(xmlData,typeof(bAppend)!="undefined"&&bAppend,false);
}

/*重构数据集*/
TTable.prototype.reBuildTable = function(sqlid,sqlidc,params,lexIconName,tableName){
 if(this.OnBeforeOpen!=null&&!this.OnBeforeOpen(this)) return;

 this.params = params;
 this.sqlID = sqlid;
 var oatt = this.__dataAtt;  
 
 var nF = 1;
 var nT = this.pageSize;

 this.__dataAtt = 9;
 var xmlObj = __xmlHttp._getDataFromServer(this,this.sqlID,params,nF,nT,this.pageName,
											this.__dataAtt,this.__keyCodes,
											this.__fixedCols,this.__keyFields,lexIconName);
 this.__dataAtt = oatt;
 
 if(xmlObj!=null){
   this.reInitTable(xmlObj);
   if(typeof(sqlidc)!="undefined"&&sqlidc!="")
     this.doGetPageCount(false,sqlidc,params);
   if(typeof(tableName)!="undefined")
     this.tableName = tableName;
 }
}


TTable.prototype.innerGetRecordCount = function(xmldoc){
  var datasetnode = xmldoc.getElementsByTagName("RS");
  var rownodes = datasetnode[0].childNodes;
  var recordCount = rownodes.length;

  if(recordCount>0&&rownodes[0].getAttribute("RL")!="0"){
	this.allRecordCount = parseInt(rownodes[0].getAttribute("F1"),10);  
    this.pageCount = Math.ceil(this.allRecordCount/this.pageSize);
  }else{
    this.pageCount = 0;
	this.allRecordCount = 0;
  }
  this.pageNumber = (this.pageCount<=0)?0:1;
  
  if(this.OnPageChange!=null) this.OnPageChange(this);
  if(this.OnReadPageCount!=null) this.OnReadPageCount(this,rownodes[0]);
  this.setCtrlButtonState();
    
  if(this.pageCount==0){
	this.emptyDataset();   	   
	if(this.__innerNoDataHint)
      alert("没有满足查询条件的数据.");
	return false;  
  }
  return true;
}

TTable.prototype.innerGetRecordCountEx = function(xmldoc){

  var datasetnode = xmldoc.getElementsByTagName("RS");
   var rownodes = datasetnode[0].childNodes;
   this.pageCount = rownodes.length/2;
   this.allRecordCount = rownodes.length; 
   
   this.isFastData = true;
   
   if(this.pageCount==0){
	this.keyValues1 = null;
	this.keyValues2 = null;
   }else{
	this.keyValues1 = [];
	this.keyValues2 = [];
	this.keyElementCount = rownodes[0].attributes.length;
	if(this.keyElementCount==1){
     for(var i=0,j=0;j<this.pageCount;i+=2,j++){
 	  this.keyValues1[j] = rownodes[i].attributes[0].nodeValue;
 	  this.keyValues2[j] = rownodes[i+1].attributes[0].nodeValue;
	 }
	}else{
 	 this.keyValues11 = [];
	 this.keyValues21 = [];
     for(var i=0,j=0;j<this.pageCount;i+=2,j++){
 	  this.keyValues1[j] = rownodes[i].attributes[0].nodeValue;
 	  this.keyValues2[j] = rownodes[i+1].attributes[0].nodeValue;
 	  this.keyValues11[j] = rownodes[i].attributes[1].nodeValue;
 	  this.keyValues21[j] = rownodes[i+1].attributes[1].nodeValue;
	 }
	}
   }
   
   this.pageNumber = (this.pageCount<=0)?0:1;
   if(this.OnPageChange!=null) this.OnPageChange(this);
   
   this.setCtrlButtonState();
   
   if(this.pageCount==0){
	 this.emptyDataset();   	   
	 if(this.__innerNoDataHint){
       alert("没有满足查询条件的数据.");
	   return false;
	 }
   }
  return true;	
}

TTable.prototype.doReading = function(AsynSender,AsynAtt,readyState){
  if(this.OnReading!=null)
    this.OnReading(AsynSender,readyState); 
}

TTable.prototype.XmlHttpCallBack = function(AsynSender,isAsyn,AsynAtt,xmlData){
  var xmldoc = xmlData;
  if(xmldoc!=null){
	switch(AsynAtt)
	{
	   case  0:break;  //普通调用
	   case -2: //读取页数 getPageCount函数	
	   case -3: //
	           if(AsynAtt==-2)
	             this.innerGetRecordCount(xmldoc);
			   else
			     this.innerGetRecordCountEx(xmldoc); 
			   this.isBusy = false;               //清除忙标记 
			   if(isAsyn) this.getFirstPage();    //动态调用时，自动读取第一页
			   break;
	   default://读取某一页	
               this.pageNumber = (this.pageCount<=0)?0:AsynAtt;
               this.refrashData(xmldoc,false,this.selectRecord);
			   break;
	}
  }
}

TTable.prototype.doGetPageCount = function(isAsyn,rsqlID,params){

  this.params = params;
  this.isFastData = false;
  
  this.InnerIsAsyn = isAsyn;
  __xmlHttp.isAsyn = this.InnerIsAsyn;        //异步调用
  this.InnerAsynSender = isAsyn? [this.name]:"";
  __xmlHttp.AsynSender = this.InnerAsynSender;
  
  __xmlHttp.AsynAtt = -2;
  this.isBusy = isAsyn;             //异步调用时，读页数时设置忙状态
  
  __xmlHttp._getDataFromServer(this,rsqlID,this.params,0,0);	

  return this.pageCount>0;
}

TTable.prototype.getPageCount = function(rsqlID,params){
  this.doGetPageCount(false,rsqlID,params);	
}

TTable.prototype.getPageCountAsyn = function(rsqlID,params){
  this.doGetPageCount(true,rsqlID,params);	
}

TTable.prototype.doGetPageCountEx = function(rsqlID,params,pageSize){
  this.params = params;

  if(typeof(pageSize)!="undefined")
    this.pageSize = pageSize;
	
  this.InnerIsAsyn = isAsyn;
  __xmlHttp.isAsyn = this.InnerIsAsyn;        //异步调用
  this.InnerAsynSender = isAsyn? [this.name]:"";
  __xmlHttp.AsynSender = this.InnerAsynSender;
  
  __xmlHttp.AsynAtt = -3;
  this.isBusy = isAsyn;             //异步调用时，读页数时设置忙状态
  
  __xmlHttp._getDataFromServer(this,rsqlID,this.params,this.pageSize,1,__$gfile.dynrecordsex);	

  return this.pageCount>0;
}

TTable.prototype.getPageCountEx = function(rsqlID,params,pageSize){
  this.doGetPageCountEx(false,rsqlID,params,pageSize);
}

TTable.prototype.getPageCountExAysn = function(rsqlID,params,pageSize){
  this.doGetPageCountEx(true,rsqlID,params,pageSize);
}

TTable.prototype.getSumFromServer = function(rsqlID){
  if(this.pageCount==0) return false;
  
  var xmldoc=__xmlHttp._getDataFromServer(this,rsqlID,this.params,0,0,this.pageName);	

  if(xmldoc!=null){
   var datasetnode = xmldoc.getElementsByTagName("RS");
   var xmlRow = datasetnode[0].childNodes[0];
   if(this.OnReadSumValue!=null){
	this.OnReadSumValue(this,xmlRow);
    this.doSumValue(-1);
   }
  }
  return true;
}

TTable.prototype.getSumFromServerEx = function(rsqlID,firstSumCol){
  if(this.pageCount==0) return;	
  var xmldoc=__xmlHttp._getDataFromServer(this,rsqlID,this.params,0,0,this.pageName,
   									      this.__dataAtt,this.__keyCodes,this.__fixedCols,this.__keyFields);	

  if(xmldoc!=null){
   var datasetnode = xmldoc.getElementsByTagName("RS");
   var xmlRow = datasetnode[0].childNodes[0];

   var fsc = (typeof(firstSumCol)=="undefined")? 1:firstSumCol;
   var cNum = this.__keyCodes.length*this.__keyFields.length+fsc-1;    //列数

   for(var i=fsc,j=this.__fixedCols+1;i<=cNum;i++,j++)
    this.setSumValue("F"+j,xmlRow.getAttribute("F"+i));

   this.doSumValue(-1);
  }
  return true;
}

//读取第一页
function _$NVL(value,defaultValue){
 return (typeof(value)=="undefined"||value==null)?defaultValue:value;	
}

TTable.prototype.innerSelectedTo = function(){

  if(this.selectRecord){	
   var nr = this.getRecordCount();
   for(var i=1;i<=nr;i++){
	this.setRecRow(i);
	var kvalue = this.csplit+this.fieldByName[this.recordField].sField.value+this.csplit;
	if(this.selected.indexOf(kvalue)>-1)
	 this.fieldByName[this.selectField].setFieldValue(this.selectValue);
   }
   this.setRecRow(1);
  }
}

//读取第一页
TTable.prototype.getFirstPage = function(){
	
 if(this.pageCount==0) return;	
 var nF=1;
 var nT=this.pageSize;

 var params = this.params;
 if(this.isFastData){
  params[this.keyIndex1] = this.keyValues1[0];
  params[this.keyIndex2] = this.keyValues2[0];
  if(this.keyElementCount>1){
   params[this.keyIndex11] = this.keyValues11[0];
   params[this.keyIndex21] = this.keyValues21[0];
  }
 }
 
 __xmlHttp.isAsyn = this.InnerIsAsyn; 
 __xmlHttp.AsynSender = this.InnerAsynSender;
 __xmlHttp.AsynAtt = 1;
 
 __xmlHttp._getDataFromServer(this,this.sqlID,params,nF,nT,this.pageName,
										  this.__dataAtt,this.__keyCodes,this.__fixedCols,this.__keyFields);
}

//读取上页
TTable.prototype.getPriorPage = function(){
 if(this.pageNumber>1){	
   var nF=this.pageSize*(this.pageNumber-2)+1;
   var nT=this.pageSize*(this.pageNumber-1);
  
   var params = this.params;
   if(this.isFastData){
     params[this.keyIndex1] = this.keyValues1[this.pageNumber-2];
     params[this.keyIndex2] = this.keyValues2[this.pageNumber-2];
     if(this.keyElementCount>1){
      params[this.keyIndex11] = this.keyValues11[this.pageNumber-2];
      params[this.keyIndex21] = this.keyValues21[this.pageNumber-2];
    }
   }

    __xmlHttp.isAsyn = this.InnerIsAsyn; 
    __xmlHttp.AsynSender = this.InnerAsynSender;
    __xmlHttp.AsynAtt = this.pageNumber - 1;

    __xmlHttp._getDataFromServer(this,this.sqlID,params,nF,nT,this.pageName,
	  						   this.__dataAtt,this.__keyCodes,this.__fixedCols,this.__keyFields);

   return true;
 } else
   return false;
}

//读取下页
TTable.prototype.getNextPage = function(){
 if(this.pageNumber<this.pageCount){	
 
  var nF = this.pageSize*this.pageNumber+1;
  var nT = this.pageSize*(this.pageNumber+1);
  
  var params = this.params;
 
  if(this.isFastData){
   params[this.keyIndex1] = this.keyValues1[this.pageNumber];
   params[this.keyIndex2] = this.keyValues2[this.pageNumber];
   if(this.keyElementCount>1){
    params[this.keyIndex11] = this.keyValues11[this.pageNumber];
    params[this.keyIndex21] = this.keyValues21[this.pageNumber];
   }
  }

  __xmlHttp.isAsyn = this.InnerIsAsyn; 
  __xmlHttp.AsynSender = this.InnerAsynSender;
  __xmlHttp.AsynAtt = this.pageNumber + 1;

  __xmlHttp._getDataFromServer(this,this.sqlID,params,nF,nT,this.pageName,
										  this.__dataAtt,this.__keyCodes,this.__fixedCols,this.__keyFields);
 }
}

//读取最后一页
TTable.prototype.getLastPage = function(){
 if(this.pageNumber<this.pageCount){	
 
  var nF=this.pageSize*(this.pageCount-1)+1;
  var nT=this.pageSize*this.pageCount;
  
  var params = this.params;
  if(this.isFastData){
   params[this.keyIndex1] = this.keyValues1[this.pageCount-1];
   params[this.keyIndex2] = this.keyValues2[this.pageCount-1];
   if(this.keyElementCount>1){
    params[this.keyIndex11] = this.keyValues11[this.pageCount-1];
    params[this.keyIndex21] = this.keyValues21[this.pageCount-1];
   }
  }
  
  __xmlHttp.isAsyn = this.InnerIsAsyn; 
  __xmlHttp.AsynSender = this.InnerAsynSender;
  __xmlHttp.AsynAtt = this.pageCount;
  
  __xmlHttp._getDataFromServer(this,this.sqlID,params,nF,nT,this.pageName,
										   this.__dataAtt,this.__keyCodes,this.__fixedCols,this.__keyFields);

 }
}

//读取指定页
TTable.prototype.getPage = function(nPage){
  var n = parseInt(nPage);
  if(isNaN(n)){
   alert(nPage+"不是一个合法的页数.");
   return;
  }
  if(n<1||n>this.pageCount){
   alert("页的范围是1到"+this.pageCount);
   return;
  }	
	
  var nF=this.pageSize*(n-1)+1;
  var nT=this.pageSize*n;
  
  var params = this.params;
  if(this.isFastData){
   params[this.keyIndex1] = this.keyValues1[n-1];
   params[this.keyIndex2] = this.keyValues2[n-1];
   if(this.keyElementCount>1){
    params[this.keyIndex11] = this.keyValues11[n-1];
    params[this.keyIndex21] = this.keyValues21[n-1];
   }
  }
  
  __xmlHttp.isAsyn = this.InnerIsAsyn; 
  __xmlHttp.AsynSender = this.InnerAsynSender;
  __xmlHttp.AsynAtt = n;
  
  __xmlHttp._getDataFromServer(this,this.sqlID,params,nF,nT,this.pageName,
											  this.__dataAtt,this.__keyCodes,this.__fixedCols,this.__keyFields);

}


TTable.prototype.setMasterDataSet = function(mDataset,linkField,sqlid,readData){
  if(linkField==""){
	alert("关联字段能够为空.");  
	return;  
  }
  this.mDataset = mDataset;	

  this.linkField = linkField.toUpperCase();
  
  this.sqlID = (sqlid=="")?this.tableName:sqlid;

  for(var i=0;i<mDataset.dDataset.length;i++)
   if(mDataset.dDataset[i]==this)
    return;

  mDataset.dDataset.push(this);  
  mDataset.oLinkValue.push(this.mDataset.getFieldValue(linkField));
  
  if(typeof(readData)!="undefined"&&readData){
   var dataType=parseInt(this.fieldByName[linkField].dataType);
  
   var nKey = mDataset.fieldByName[linkField].sField.value;
  
   if(nKey==""&&dataType>=2&&dataType<=5)
    nKey = "0";
   var params = [nKey];	
   if(this.BeforeGetData!=null)
     params = this.BeforeGetData(this,params);
   var xmlData = __xmlHttp._getDataFromServer(this,this.sqlID,params,1,this.pageSize);
 
   if(xmlData!=null) this.refrashData(xmlData,false,false);
  }
}

TTable.prototype.removeMasterDataSet = function(mDataset){
  this.mDataset = null;	

  this.linkField = "";
  var i,mcount = mDataset.dDataset.length;
  
  if(mcount>0)
   for(i=0;i<mcount;i++)
    if(mDataset.dDataset[i]==this){
     for(var j=i;j<mcount-1;j++){
  	  mDataset.dDataset[j] = mDataset.dDataset[j+1];  
	  mDataset.oLinkValue[j] = mDataset.oLinkValue[j+1];
	 }
     mDataset.dDataset.pop();  
     mDataset.oLinkValue.pop();
	 break;
    }
}

//删除后自动保存
TTable.prototype.DeleteEx = function(){
 if(this.Delete())
   this.applyUpdate();
}

//删除前提示
TTable.prototype.DeleteHint = function(hint){
 var dSet = this;
 if(dSet.readOnly||(!dSet.canDelete)) return false;

 if(dSet.BeforeDelete!=null&&!dSet.BeforeDelete(dSet))
  return false;
	
 var s = this.deleteRowHintStr;
 
 if(typeof(hint)!="undefined"&&hint!="")
  s = hint;
 var result = confirm(s); 
 if(result) this.Delete();
 return result;
}

TTable.prototype.DeleteHintAndSave = function(hint){
 result = this.DeleteHint(hint);
 if(result)
   this.applyUpdate();
 return result;
}

TTable.prototype.DeleteRow = function(delMethod,hint){
  if(!this.isEmpty())	
    switch(delMethod){
	  case 0:  result = this.Delete();
	           break;
  	  case 1:  result = this.DeleteHint(hint);
	           break;
	  case 2:  result = this.DeleteEx();
	           break; 
	  case 3:  result = this.DeleteHintAndSave(hint); 
	           break;
    }
}

TTable.prototype.DeleteRowAll = function(delMethod,hint){
  if(!this.isEmpty()){
    var dSet = this;
    if(dSet.readOnly||(!dSet.canDelete)) return false;

    var result = true;
    if(delMethod==1||delMethod==3){
      var s = this.deleteRowAllHintStr; 
      if(typeof(hint)!="undefined"&&hint!="")
       s = hint;
      result = confirm(s); 
    }
    if(result) 
      while(!this.isEmpty()) this.Delete();	
  
    if(delMethod==2||delMethod==3)
      this.applyUpdate();
  }
}
<!--作废函数-->
TTable.prototype.CancelHintAndSave = function(hint,fieldName,value){
 if(!this.isEmpty()&&confirm(hint)){
  this.setFieldValue(fieldName,value+"",false);
  this.setFieldValue("STATUS_NAME","已作废",false);
  this.post();
  this.applyUpdate();
  this.emptyDataset();
  return true;
 }
 return false;
}

<!--构造xml数据-->
TTable.prototype.deltaToXml = function(){
  var records = this.pDelta;
  var rows = new Array(records.length);
  rows.push("<RS>");
  for(var i=0;i<records.length;i++){
	 var row = [];
	 row.push("<R");
	 row.push(" RL=\""+records[i].getAttribute("RL")+"\" RS=\""+records[i].getAttribute("RS")+
	          "\" RT=\""+records[i].getAttribute("RT")+"\" RR=\""+records[i].getAttribute("RR")+"\"");
	 for(var j=0;j<this.fields.length;j++){
		 row.push(" "+this.fields[j].fieldName+"=\""+replaceXmlSpChar(records[i].getAttribute(this.fields[j].fieldName))+"\"");
	 }
	 row.push("/>");
	 rows.push(row.join(""));
  }  
  rows.push("</RS>");
  return rows.join(""); 
}

TTable.prototype.metaToXml = function(){
  var records = this.pMeta;
  var rows = new Array(records.length);
  rows.push("<FS>");
  for(var i=0;i<records.length;i++){
	 var row = [];
	 row.push("<F");
	 for(var j=0;j<records[i].attributes.length;j++){
		 row.push(" "+records[i].attributes[j].name+"=\""+replaceXmlSpChar(records[i].attributes[j].value)+"\"");
	 }
	 row.push("/>");
	 rows.push(row.join(""));
  }
  rows.push("</FS>");
  return rows.join(""); 
}

<!--分析参数-->
function analyseParam(paramStr,afxstr){
  var sql="";
  var param="";
  var s=0;
  var e=0;      
  if(paramStr!=""){
    s = paramStr.indexOf("(");
    e = paramStr.indexOf(")");
   if(s>1){
     sql = paramStr.substring(0,s);	  
     var params = paramStr.substring(s+1,e).split(",");
     for(var i=0,j=10;i<params.length;i++,j++)
       param=param+" p"+j+"=\""+params[i]+"\""; 
   }else
    sql = paramStr;
  }
  return "<"+afxstr+param+">"+sql+"</"+afxstr+">";
}
  
<!--获取要保存的数据-->
function getSaveXmlDataEx(dSet,tableName){
 var sResult = "";
 if(dSet.getChangeCount()>0||dSet.allwaysUpdateSql!=""){
  sResult = "<db>"+
            "<tb tn=\""+tableName+"\"/>"+
            "<op>"+
            "<ut>"+dSet.useTransaction+"</ut>"+
            analyseParam(dSet.BeforeInsertSql,"bi")+
            analyseParam(dSet.AfterInsertSql,"ai")+
            analyseParam(dSet.BeforeDeleteSql,"bd")+
            analyseParam(dSet.AfterDeleteSql,"ad")+
            analyseParam(dSet.BeforeUpdateSql,"bu")+
            analyseParam(dSet.AfterUpdateSql,"au")+
            analyseParam(dSet.aBeforeUpdateSql,"albu")+
            analyseParam(dSet.aAfterUpdateSql,"alau")+
			analyseParam(dSet.allwaysUpdateSql,"allways")+
            "</op>"+
             dSet.metaToXml()+
             dSet.deltaToXml()+
            "</db>";
 }

 return sResult;
}

//递归获取要保存的数据
TTable.prototype.getSaveInfo = function(){
 var dSet = this;	
 var sResult = getSaveXmlDataEx(dSet,dSet.tableName);
 for(var i=0;i<dSet.dDataset.length;i++)
   sResult += dSet.dDataset[i].getSaveInfo();
 return sResult; 
}

//递归调用BeforeUpdate事件
TTable.prototype.doBeforeUpdateAll = function(){
 var dSet = this;	
 var result = dSet.doBeforeUpdate();

 for(var i=0;result&&i<dSet.dDataset.length;i++){ 
  var ddSet = dSet.dDataset[i];
  result = ddSet.doBeforeUpdate();

  if(result&&ddSet.dEmptyNotSave&&ddSet.isEmpty()){
	result = false;
	alert(ddSet.deNSaveHint);
  }
 }
 return result;  
}

//递归调用doAfterUpdateAll事件
TTable.prototype.doAfterUpdateAll = function(){
 var dSet = this;	
 dSet.doAfterUpdate();
 for(var i=0;i<dSet.dDataset.length;i++) 
  dSet.dDataset[i].doAfterUpdate();
}

//递归调用reset所有数据
TTable.prototype.doResetAll = function(){
 var dSet = this;	
 dSet.reSet();
 for(var i=0;i<dSet.dDataset.length;i++) 
  dSet.dDataset[i].reSet();
}

//递归调用InitUpdatet
TTable.prototype.callInitUpdate = function(){
 var dSet = this,cdSet;
 var result = true;
 if(!dSet.isEmpty()){
  result = dSet.OnInitUpdate==null||dSet.OnInitUpdate(dSet);

  for(var i=0;result&&i<dSet.dDataset.length;i++){
   cdSet = dSet.dDataset[i];  	 
   result = cdSet.callInitUpdate();
  }
 }
 return result;  
}

TTable.prototype.setUpdateValue = function(){
 var dSet = this,cdSet;	


 var result = dSet.dataIsChange()&&(dSet.OnSetUpdateValue==null||dSet.OnSetUpdateValue(dSet));

 for(var i=0;i<dSet.dDataset.length;i++){
  cdSet = dSet.dDataset[i];  	 
  result = result||cdSet.setUpdateValue();
 }
 return result;  
}

//数据保存的方法
TTable.prototype.dataCanConfirm = function(lastAsk){
  var dSet = this;
  var result = true; //默认保存被终止
  this.__saveDataStatus = true;
  result = dSet.callInitUpdate()&&dSet.postAll()&&dSet.doBeforeUpdateAll();
 
  if(result)
   if(typeof(lastAsk)=="undefined"||lastAsk)
    result = this.lastAskUpdate==null||this.lastAskUpdate(this);

  this.__saveDataStatus = false;
  return result;
}

TTable.prototype.showError = function(){
 if(this.lastErrorNo<0)
  alert(this.lastError);
}
//数据保存的方法
TTable.prototype.applyUpdate = function(hIntText){
  var dSet = this;
  var result = 2; //默认保存被终止
  var hInt = "";
  var tableName = dSet.tableName;

  var isHint = typeof(hIntText)!="undefined";
  if(isHint) hInt = hIntText; 
	
  this.__saveDataStatus = true;
  /*响应保存前时间，可以在此事件中设置一些数据，如，把从表汇总数设置到总表中,
    事件响应函数返回false时，可终止更新操作*/
  if(!(dSet.callInitUpdate()&&dSet.postAll())){
    this.__saveDataStatus = false;
    return -4;
  }
  this.__saveDataStatus = false;	  
  
  //当数据有变化时，再设置一些值
  dSet.setUpdateValue();

  //最后取消数据保存的机会  
  if(this.lastAskUpdate!=null&&!this.lastAskUpdate(this))
    return -6;
   
  //获取要保存的数据
  var xmlDoc = dSet.getSaveInfo();

  //判断数据是否有变化
  if(xmlDoc != ""){
    xmlDoc = "<datasets>"+xmlDoc+"</datasets>"; 
   
    if(!dSet.doBeforeUpdateAll()) return -5;

    var oXmlHttp = getXmlHttp(); 

    oXmlHttp.open("POST","../util/"+__$gfile.applyupdate,false);
    oXmlHttp.setRequestHeader("Content-Type","text/xml");
    oXmlHttp.setRequestHeader("charset","utf-8");

    //var t0 = getServerDateTime().substring(11);
  
    oXmlHttp.send(xmlDoc);
 
    if(oXmlHttp.status==200){

      var xmlData = oXmlHttp.responseXML;
	
      var root = xmlData.childNodes[0].childNodes[0]; 

      if(root.nodeName=="errors"){ //出现异常
	    result = -3;
        this.lastError = root.childNodes[0].childNodes[0].nodeValue;	 
	    hInt = "数据保存失败！\n"+this.lastError;
	  }else{
        if(hInt=="")
		  hInt = "数据保存成功.";  
        dSet.doResetAll();  //复位delta
	    dSet.doAfterUpdateAll();
	    result = 0;
	  }
    }else{
	  hInt = "数据保存出现异常！"+oXmlHttp.status;
	  result = -2;
    }
  }else{
    if(hInt=="") hInt = "数据保存成功.";  	  
    result = 1;
  }
  
  if(isHint) alert(hInt);
  return result;
}

TTable.prototype.save = function(hIntText){
  return this.applyUpdate(hIntText);
}

TTable.prototype.applyUpdateEx = function(sHint){
 var nResult = 1;
 if(this.dataCanConfirm()){
  if(typeof(sHint)=="undefined"||sHint=="")
   nResult = this.applyUpdate(sHint);
  else{
   nResult = this.applyUpdate("");
   if(nResult==0) alert(sHint);
  }
 
  if(nResult<0){
   this.restoreRecord();	
   if(typeof(sHint)!="undefined")
    alert(this.lastError); 
  }
 }
 
 return nResult>=0;
}

TTable.prototype.applyUpdateExr = function(noDataHint,brRecord,sHint){ 
 result = this.applyUpdateEx(sHint);
 if(!result&&brRecord)
  this.restoreRecord();
 if(result)
  this.__innerNoDataHint = noDataHint;
 return result;
}
//多表数据同时保存

function applyUpdates(dSets,noHint){
  var dSet = this,cdSet;
  var result = 2,nResult = true; //默认保存被终止
  var  hInt = "";

  var isHint = typeof(noHint)=="undefined"||noHint;
  

  for(var i=0;i<dSets.length;i++){
   cdSet = dSets[i];  	 
   nResult = (cdSet.OnInitUpdate==null)||cdSet.OnInitUpdate(cdSet);
   if(!nResult) return result;
  }

  /*把未post的数据先post*/
  for(var i=0;i<dSets.length;i++){
   cdSet = dSets[i];  	 
   if(!cdSet.post()) return result;
  }
  
  var aaa = false;
  for(var i=0;i<dSets.length;i++){
   cdSet = dSets[i];  	 
   aaa = aaa||cdSet.setUpdateValue();
  }
  
  if(!aaa) result;
  
  //获取要保存的数据
  var xmlDoc = "";
  for(var i=0;i<dSets.length;i++){
   cdSet = dSets[i];  	 
   xmlDoc += cdSet.getSaveInfo();
  }

  //判断数据是否有变化
  if(xmlDoc!=""){

   xmlDoc = "<datasets>"+xmlDoc+"</datasets>"; 
   
   for(var i=0;i<dSets.length;i++){
    cdSet = dSets[i];  	 
    nResult = cdSet.doBeforeUpdate();
    if(!nResult) return result;
   }

   var oXmlHttp = getXmlHttp(); 

   oXmlHttp.Open("POST","../util/"+__$gfile.applyupdate,false);
   oXmlHttp.setRequestHeader("Content-Type","text/xml");
   oXmlHttp.setRequestHeader("charset","utf-8");

   oXmlHttp.Send(xmlDoc);

   if(oXmlHttp.status==200){
    var xmlData = oXmlHttp.responseXml;
    var root = xmlData.childNodes[0].childNodes[0]; 

    if(root.nodeName=="errors"){ //出现异常
	 result = -3;
     this.lastError = root.childNodes[0].childNodes[0].nodeValue;
	 hInt = "数据保存失败！\n"+this.lastError;
	}else{
     hInt = "数据保存成功.";
	 
     for(var i=0;i<dSets.length;i++){
      cdSet = dSets[i];  
	  cdSet.reSet();
	  cdSet.doAfterUpdate();
     }	 
	 result = 0;
	}
   }else{
	 hInt = "数据保存过程中出现异常！"+oXmlHttp.status;
	 result = -2;
   }
  }else{
   hInt = "数据没有变化，不需要保存.";	  
   result = 1;
  }
  
  if(isHint) alert(hInt);
  return result;
}

TTable.prototype.applyUpdate2 = function(ofName,nfName,noHint){
 var DataSet = this.pData;
 var DeltaSet = this.pDelta;
 var isSave = false;

 ofName = this.fieldByName[ofName].shortName;
 nfName = this.fieldByName[nfName].shortName;

 this.Reset();
 var nRecNo = this.RecNo;
 
 for(var i=1;i<=DataSet.length;i++){
  var row = DataSet[i-1];
  var ov=parseInt(row.getAttribute(ofName),10);
  var nv=parseInt(row.getAttribute(nfName),10);
  if(nv==-1) nv=1;
  if(ov!=nv){ //和原来的不一样,变化数据记录集中增加一条记录
   var drow = this.__addDelta();
   this.cloneRecord(drow,row,true);  //DataSet数据复制到DeltaSet
   if(ov==0)  //原来没有选中,现在选中了应该增加
     drow.setAttribute("RT","3");  //增加标记
   else
     drow.setAttribute("RT","4"); //删除标记
   isSave = true;
   row.setAttribute(ofName,row.getAttribute(nfName));
  }
 }
 if(isSave)    
  return this.applyUpdate(noHint);
 else return 0;
}

TTable.prototype.applyUpdate3 = function(ofName,nfName,noHint){
 var DataSet = this.pData;
 var DeltaSet = this.pDelta;

 ofName = this.fieldByName[ofName].shortName;
 nfName = this.fieldByName[nfName].shortName;

 var isSave = false;
 this.Reset(this);

 for(var i=1;i<=DataSet.length;i++){
  var row = DataSet[i-1];
  var ov = parseInt(row.getAttribute(ofName),10);
  var nv = parseInt(row.getAttribute(nfName),10);
  if(ov!=nv){ //和原来的不一样,变化数据记录集中增加一条记录
   var drow = this.__addDelta();
   this.cloneRecord(drow,row,true);  //DataSet数据复制到DeltaSet
   if(ov==-1)  //原来没有选中,现在选中了应该增加
     drow.setAttribute("RT","3"); //增加标记
   else{
     drow.setAttribute(nfName,ov);
     drow.setAttribute("RT","1"); //修改

	 drow = this.__addDelta();
	 
     this.cloneRecord(drow,row,true);  //DataSet数据复制到DeltaSet
     drow.setAttribute("RT","2"); //修改
   }
   isSave = true;
   row.setAttribute(ofName,row.getAttribute(nfName));
  }
 }

 if(isSave)
  return this.applyUpdateOne(noHint);
 else return 0;
}

TTable.prototype.setFieldChange = function(fields,fun){
  if(fields instanceof Array){
	for(i=0; i<fields.length; i++){
	  this.fieldByName[fields[i]].OnChangeOld = this.fieldByName[fields[i]].OnChange;
	  this.fieldByName[fields[i]].OnChange = fun;  
	}
  }else{
	this.fieldByName[fields].OnChangeOld = this.fieldByName[fields].OnChange;  
    this.fieldByName[fields].OnChange = fun;
  }
}

TTable.prototype.setFieldChangeEx = function(fields,fun){
  if(fields instanceof Array){
	for(i=0; i<fields.length; i++)
	  this.fieldByName[fields[i]].OnChangeEx = fun;  
  }else
    this.fieldByName[fields].OnChangeEx = fun;
}

TTable.prototype.saveRecord = function(){
 if(!this.isEmpty()){	
  this.__saveRecord = true;
  var n = this.RecRow.attributes.length;	
  for(var i=0;i<n;i++)
   this.recordValue[i] = this.RecRow.attributes[i].value;
 }
}

TTable.prototype.restoreRecord = function(){
 if(!this.isEmpty()&&this.__saveRecord){	
  this.__saveRecord = false;
  var n = this.RecRow.attributes.length;
  var field;
  
  for(var i=0;i<n-5;i++){
   field = this.fields[i];	  
   if(field.srChange){
	this.setFieldValue(field.fieldName,this.recordValue[i+4]);
	field.srChange = false;
   }
  }
  this.post();
  //for(var i=0;i<4;i++)
  // this.pData.fields(i).value = this.recordValue[i];
 }
}

/*统计满足一定条件的记录数*/
TTable.prototype.totalRecordNum = function(fieldNames,values){
 var n = 0;
 var nf = fieldNames.length
 var nRecNo = this.RecNo
 for(var i=1;i<=this.pData.length;i++){
  this.setRecRow(i);	 
  var isOk = true; 
  for(var j=0;isOk&&j<nf;j++)
   isOk = this.getFieldValue(fieldNames	[j])==values[j];
  if(isOk) n++;
 }
 this.setRecRow(nRecNo);	 
 return n;	
}

TTable.prototype.getSplitString = function(fieldName,splitChar){
  var results = "";	 
  var nR = this.getRecordCount(); 
  var nRecNo = this.RecNo;
  for(var i=1;i<=nR;i++){
	this.setRecRow(i);	 
	if(i>1)
	 results = results+splitChar;
	results =  results+this.getFieldValue(fieldName);  
  }
  this.setRecRow(nRecNo);	   
  return results;	 
}
 
TTable.prototype.getSplitStringWithC = function(fieldName,splitChar,CField,CValue){
  var results = "";	 
  var nR = this.getRecordCount(); 
  var nRecNo = this.RecNo;
  var j=0;
  for(var i=1;i<=nR;i++){
	this.setRecRow(i);	 
	if(this.getFieldValue(CField)==CValue){
	 j++;	
 	 if(j>1)
	  results = results+splitChar;
	 results =  results+this.getFieldValue(fieldName);  
	}
  }
  this.setRecRow(nRecNo);	   
  return results;	 
}
 
TTable.prototype.changeSortAtt = function(fieldName){
  if(fieldName!=""){
   if(this.sortFieldName == fieldName)
    this.sortAtt = 0-this.sortAtt;
  
   //if(this.sortAtt==0) this.sortAtt = 1;
   this.sortFieldName = fieldName;
  }else{
    this.sortFieldName = "RL";	  
    this.sortAtt = 1;
  }
}

TTable.prototype.getSortInfo = function(defaultSort){
  var result = defaultSort;
  
  if(this.sortFieldName!="RL"){
    result = this.sortFieldName;
    if(this.sortAtt==-1)
      result = result + " desc ";
  }
  
  return result;
}
<!--排序-->
TTable.prototype.doSort = function(fieldName,sortAtt){
  if(fieldName=="") fieldName = "RL";
  
  if(!this.post()) return false;
  if(this.sortFieldName == fieldName)
   if(typeof(sortAtt)=="undefined")
    this.sortAtt = 0-this.sortAtt;
   else 
    if(this.sortAtt != sortAtt)
	 this.sortAtt = sortAtt;
	else return; 

  this.sortFieldName = fieldName;
  
  if(fieldName=="") return false;
  if(fieldName!="RL") fieldName = this.fieldByName[fieldName].shortName;
   
  var dataset = this.pData;	
  var i=1;
  var j=1;
  var k=0;
  var str1="";
  
  //比较函数
  var conpareStrAsc = function(value1,value2){
	return value1<value2;
  }
  var conpareStrDesc = function(value1,value2){
	return value1>value2;
  }
  
  var conpareNumAsc = function(value1,value2){
    var r = parseFloat(nvl(value1,0),10)<parseFloat(nvl(value2,0),10);
	return r;
  }
  var conpareNumDesc = function(value1,value2){
	return parseFloat(nvl(value1,0),10)>parseFloat(nvl(value2,0),10);
  }

  var conpareFun = null;
  if(fieldName=="RL"||this.fieldByName[this.sortFieldName].isNumberType()){
   if(this.sortAtt==1) conpareFun = conpareNumAsc;
   else conpareFun = conpareNumDesc;
  }else {
   if(this.sortAtt==1) conpareFun = conpareStrAsc;
   else conpareFun = conpareStrDesc;
  }

  var buf = new Array(dataset.length);
  var buf2 = new Array(dataset.length);
  var row = null;
  
  for(i=dataset.length;i>1;i--){
   row = dataset[i-1];
   str1 = row.getAttribute(fieldName);
   for(j=i-1;j>=1;j--){
    row = dataset[j-1];
    if(conpareFun(str1,row.getAttribute(fieldName))){
     str1=row.getAttribute(fieldName);
     k = j;
    }
   }
   if(k>0){
	row = dataset[k-1];
    for(j=0;j<row.attributes.length;j++)
     buf[j] = row.attributes[j].value;
    
	row = dataset[i-1];
	
    for(j=0;j<row.attributes.length;j++){
      buf2[j] = row.attributes[j].value;
      row.attributes[j].value = buf[j];
    }
	
	row = dataset[k-1];
	
    for(j=0;j<row.attributes.length;j++)
     row.attributes[j].value = buf2[j];
    k = 0;
   }
  }
  return true;
} 

TTable.prototype.setSelectRecord = function(selectField,selectValue,
											recordField,csplit){
  this.selected = [];
  this.selectRecord = true;
  this.selectField = selectField;
  this.selectValue = selectValue;
  this.recordField = recordField;
  if(typeof(csplit)=="undefined")
   this.csplit = "";
  else 
   this.csplit = csplit;
}

TTable.prototype.getSelectedString = function(c){
  return this.selected.join(c);
}

TTable.prototype.copyFromTable = function(sTable){
  var nr = sTable.getRecordCount();
  var fieldCount = this.fields.length;
  for(var i=1;i<=nr;i++){
	sTable.moveRecord(i);  
	this.insert();
	for(var j=0;j<fieldCount;j++)
	 this.fields[j].setFieldValue(sTable.fields[j].getFieldValue(),false);
	this.post(); 
  }
}

//把记录nFrom移动到nTo的位置
TTable.prototype.changeRecordLocation = function(nFrom,nTo){
  
  var buf = [];
  var tbuf = [];
  var dataset = this.pData;
  var nRecNo = nFrom;
  var nLocation = 0;
  var tLocation = 0;
  var sField = null;
  var bCtrl = this.LocationField!="";
  if(bCtrl)
    sField = this.fieldByName[this.LocationField].sField;

  dataset.absolutePosition = nFrom;
  
  for(var i=0;i<dataset.fields.count;i++)
    buf[i] = dataset.fields(i).value;
    
  if(nFrom>nTo){     //往上移动
	while(nFrom>nTo){
   	 dataset.absolutePosition = nFrom-1;
     for(var i=0;i<dataset.fields.count;i++)
       tbuf[i] = dataset.fields(i).value;   
	  
     dataset.absolutePosition = nFrom;
     for(var i=0;i<dataset.fields.count;i++)
      dataset.fields(i).value = tbuf[i];
	  
	 nFrom--;	
	}
    
	dataset.absolutePosition = nTo;
    for(var i=0;i<dataset.fields.count;i++)
      dataset.fields(i).value = buf[i];
	
	if(bCtrl){
	 nFrom = nRecNo; 	
     nLocation = parseInt(sField.value);
     while(nTo<nFrom){
   	  dataset.absolutePosition = nTo+1;
      tLocation = parseInt(sField.value);
      this.moveRecord(nTo);
	  this.innersetFieldValue(this.LocationField,tLocation,false);
      this.post();
  	  nTo++;	
	 }
     this.moveRecord(nRecNo);
	 this.innersetFieldValue(this.LocationField,nLocation,false);
     this.post();
    }
  }else{
	while(nFrom<nTo){
   	 dataset.absolutePosition = nFrom+1;
     for(var i=0;i<dataset.fields.count;i++)
      tbuf[i] = dataset.fields(i).value;   
	  
   	 dataset.absolutePosition = nFrom;
	 if(bCtrl) tLocation = parseInt(sField.value);	 
     for(var i=0;i<dataset.fields.count;i++)
      dataset.fields(i).value = tbuf[i];
	 nFrom++;	
	}
	dataset.absolutePosition = nTo;
    for(var i=0;i<dataset.fields.count;i++)
      dataset.fields(i).value = buf[i];
	
	if(bCtrl){
	 nFrom = nRecNo; 	
     nLocation = parseInt(sField.value);
     while(nTo>nFrom){
   	  dataset.absolutePosition = nTo-1;
      tLocation = parseInt(sField.value);
      this.moveRecord(nTo);
	  this.innersetFieldValue(this.LocationField,tLocation,false);
      this.post();
  	  nTo--;	
	 }
     this.moveRecord(nRecNo);
	 this.innersetFieldValue(this.LocationField,nLocation,false);
     this.post();
    }
  }
  
  dataset.absolutePosition = nRecNo;
}

TTable.prototype.copyFromTableWithFields = function(sTable,fieldNames){
  var nr = sTable.getRecordCount();
  var fieldCount = fieldNames.length;
  for(var i=1;i<=nr;i++){
	sTable.moveRecord(i);  
	this.insert();

	for(var j=0;j<fieldCount;j++)
	 this.fieldByName[fieldNames[j]].setFieldValue(
					    sTable.fields[fieldNames[j]].getFieldValue(),false);
	this.post(); 
  }
}

TTable.prototype.copyFromTableWithFieldsEx = function(sTable,dfieldNames,sfieldNames){
  var nr = sTable.getRecordCount();
  var fieldCount = dfieldNames.length;
  for(var i=1;i<=nr;i++){
	sTable.moveRecord(i);  
	this.insert();
	for(var j=0;j<fieldCount;j++)
	 this.fieldByName[dfieldNames[j]].setFieldValue(
					    sTable.fields[sfieldNames[j]].getFieldValue(),false);
	this.post(); 
  }
}

TTable.prototype.copyFromRecset = function(sRecset){
  var nr = sRecset.recordCount;
  var fieldCount = this.fields.length;
  for(var i=1;i<=nr;i++){
	sRecset.absolutePosition = i;
	this.insert();
	for(var j=0;j<fieldCount;j++)
	 this.fields[j].setFieldValue(sRecset.fields(j+4).value,false);
	this.post(); 
  }
}

TTable.prototype.copyFromRecsetWithFields = function(sRecset,fieldNames){
  var nr = sRecset.recordCount;
  var fieldCount = fieldNames.length;
  for(var i=1;i<=nr;i++){
	sRecset.absolutePosition = i;
	this.insert();	
	for(var j=0;j<fieldCount;j++){
	 this.fieldByName[fieldNames[j]].setFieldValue(sRecset.fields(j+4).value,false);
	}
	this.post(); 
  }
}

TTable.prototype.copyFromRecsetWithFieldsEx = function(sRecset,dfieldNames,sfieldNames){
  var nr = sRecset.recordCount;
  var fieldCount = dfieldNames.length;
  for(var i=1;i<=nr;i++){
	sRecset.absolutePosition = i;
	this.insert();	
	for(var j=0;j<fieldCount;j++)
	 this.fieldByName[dfieldNames[j]].setFieldValue(sRecset(sfieldNames[j]).value,false);
	this.post(); 
  }
}  

TTable.prototype.setDefaultFields = function(defaultFields,defaultValues){
   this.defaultFields = defaultFields;
   this.defaultValues = defaultValues;
}

TTable.prototype.setLogFields = function(logFields,logValues){
   this.logFields = logFields;
   this.logValues = logValues;
}
