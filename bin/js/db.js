// JavaScript Document
//定义TQuery
TQuery.prototype.className = "TQuery";
TQuery.prototype.Active = false;
TQuery.prototype.OnSuccess = null;
TQuery.prototype.InnerAsynSender = "";
TQuery.prototype.InnerIsAsyn = false;  
TQuery.prototype.OnReading = null;
TQuery.prototype.dataFormat = 0;       //数据格式
TQuery.prototype.dataFormatEx = false; //附加格式
TQuery.prototype.dataRowToCol = 1;     //每多少行组成1列

TQuery.prototype.CtrlPageInfo = null;
TQuery.prototype.CtrlBtFirst = null;
TQuery.prototype.CtrlBtPrior = null;
TQuery.prototype.CtrlBtNext = null;
TQuery.prototype.CtrlBtLast = null;

TQuery.prototype.useSelected = false;  //选择记录标记
TQuery.prototype.SelectedKey = [];
TQuery.prototype.SelectedRow = [];
TQuery.prototype.KeyField = "";
TQuery.prototype.KeySField = "";
TQuery.prototype.SelectedRecNo = 0;    //被选中行当前行号。
TQuery.prototype.pageInfo = "";        //页信息

TQuery.prototype.whereField = [];      //查找字段
TQuery.prototype.tableName = "";       //数据更新表名称

TQuery.prototype.OnRecordChange = null;
TQuery.prototype.OnPageChange = null;  //页数据发生变化时
TQuery.prototype.OnPageCount = null;   //读页数量时 
TQuery.prototype.OnSumChange = null;   //合计发生变化时 
TQuery.prototype.OnFieldChange = null;
TQuery.prototype.OnDelete = null;
TQuery.prototype.OnDataChange = null;
TQuery.prototype.OnCalField = null;

TQuery.prototype.OnLoadStart = null;
TQuery.prototype.OnLoadEnd = null;
TQuery.prototype.OnComplete = null;

TQuery.prototype.recordUnit = "条记录";
TQuery.prototype.srollRead = false;
TQuery.prototype.toast = false;
TQuery.prototype.isPaging = false;

function TQuery(sqlID,pageSize,useFormPost){
  this.sqltype = 1;
  this.sqlID = (typeof(pageSize)=="undefined")? "":sqlID;
  this.sqlIDC = "";
  this.params = null;
  this.pageSize = (typeof(pageSize)=="undefined"||pageSize==0)?1:pageSize;
  this.pageNumber = 1;
  this.pageCount = 0;   //

  this.SelectdField = "RR";
  this.SelectdSField = "";
  
  this.useFormPost = (typeof(useFormPost)!="undefined")?useFormPost:false;
 
  this.active = false;
  this.recordset = null;
  this.datasetnode = null;
  this.rownodes = null;	 //记录节点
  this.fields = [];      //字段集合
  this.fieldInfos = [];  //完整字段集合
  this.origField = "";
  this.topRow = 0;        //标题行数
  this.isEmpty = true;
  this.fieldCount = 0;    //字段数
  this.recordCount = 0;   //本地记录数
  this.recordCountAll = 0;//总记录数 
  this.recNo = 0;
  this.isBusy = false;    //忙状态
 
  this.SumInfo = null;    //读取页数时,保留的行信息
  this.QRGrid = null;     //绑定的表格
  this.rowBuffer = null;
}

TQuery.prototype.free = function(){
  this.recordset = null;
  this.datasetnode = null;
  this.rownodes = null;
  this.params = null;
  this.QRGrid = null; 
  this.SelectedRow = null;
  this.SelectedKey = null;
  this.fields = null; 
  this.fieldInfos = null;
}

TQuery.prototype.setPropertys=function(props){
  for(var i in props)
    this[i] = props[i];
}

TQuery.prototype.setCtrlButton = function(CtrlPageInfo,CtrlBtFirst,CtrlBtPrior,CtrlBtNext,CtrlBtLast){
  this.CtrlPageInfo = CtrlPageInfo;
  this.CtrlBtFirst = CtrlBtFirst;
  this.CtrlBtPrior = CtrlBtPrior;
  this.CtrlBtNext = CtrlBtNext;
  this.CtrlBtLast = CtrlBtLast;	
}

TQuery.prototype.setCtrlButtonState = function(){
  if(this.CtrlPageInfo!=null){
	if(this.isEmpty)
	  this.CtrlPageInfo.innerText = "没有满足条件的数据";
	else{
	  if(this.isPaging)
        this.CtrlPageInfo.innerText = "第"+this.pageNumber+"页,共"+this.pageCount+"页,"+this.recordCountAll+this.recordUnit;
      else
	    this.CtrlPageInfo.innerText = "共"+this.recordCountAll+this.recordUnit;	
	}
  }
  if(this.CtrlBtFirst != null)
  	this.CtrlBtFirst.disabled = this.isEmpty||this.pageNumber<=1;

  if(this.CtrlBtPrior != null)	
    this.CtrlBtPrior.disabled = this.isEmpty||this.pageNumber<=1;

  if(this.CtrlBtNext != null) 
    this.CtrlBtNext.disabled = this.isEmpty||this.pageNumber==this.pageCount;

  if(this.CtrlBtLast != null)
    this.CtrlBtLast.disabled = this.isEmpty||this.pageNumber==this.pageCount;	
}

TQuery.prototype.IsSaved = function(KeyValue){
  for(var i=0;i<this.SelectedKey.length;i++)
    if(KeyValue==this.SelectedKey[i])
	  return i;
  return -1;	  
}

TQuery.prototype.$SFieldValue = function(fieldName,rowIndex){
  var row = this.rownodes[rowIndex-1];
  var result = "";
  try{
    result = row.getAttribute(fieldName.toUpperCase()).toString();
  }catch(e){
	//alert(fieldName);  
  }
  return result;
}

TQuery.prototype.initSelected = function(){
  this.KeySField = this.getSFieldByField(this.KeyField);
  this.SelectdSField = this.getSFieldByField(this.SelectdField);
  for(var i=1;i<=this.recordCount;i++){
    var v1 = this.$SFieldValue(this.KeySField,i);
    if(this.IsSaved(v1)>-1){
	  this.rownodes[i-1].setAttribute(this.SelectdSField,"1");
	}else
	  this.rownodes[i-1].setAttribute(this.SelectdSField,"0");
  }
}

TQuery.prototype.SaveSelect = function(rowIndex,isSaved){

  v1 = this.$SFieldValue(this.KeySField,rowIndex);

  if(isSaved){   //选中
	if(this.IsSaved(v1)==-1||v1==""){  //未保存过
	  if(v1!=""){
	    this.SelectedRow.push(this.rownodes[rowIndex-1]);
	    this.SelectedKey.push(v1);
	  }
	  this.rownodes[rowIndex-1].setAttribute(this.SelectdSField,"1");
	}
  }else{
	var k = this.IsSaved(v1);
	if(k>-1||v1==""){
	  if(v1!=""){
	    this.SelectedRow.splice(k,1);
	    this.SelectedKey.splice(k,1);
	  }
	  this.rownodes[rowIndex-1].setAttribute(this.SelectdSField,"0");	  
	}
  }
}

TQuery.prototype.initSelectedWith = function(values){
  this.KeySField = this.getSFieldByField(this.KeyField);
  this.SelectdSField = this.getSFieldByField(this.SelectdField);
  this.SelectedRow = [];
  this.SelectedKey = [];
  
  for(var i=1;i<=this.recordCount;i++){
    vkey = this.$SFieldValue(this.KeySField,i);
	if(values.indexOf(vkey)>-1){
	  this.rownodes[i-1].setAttribute(this.SelectdSField,"1");
	  this.SelectedRow.push(this.rownodes[i-1]);
	  this.SelectedKey.push(vkey);
	}else{
	  this.rownodes[i-1].setAttribute(this.SelectdSField,"0");	
	}
  }
  if(this.QRGrid!=null)
	this.QRGrid.refreshSelectRow(0);
}

TQuery.prototype.SetRowSelected = function(){
  if(!this.isEmpty){	
    this.KeySField = this.getSFieldByField(this.KeyField);
    this.SelectdSField = this.getSFieldByField(this.SelectdField);

	var bChecked = !(this.$SFieldValue(this.SelectdSField)=="1");
	this.SaveSelect(this.recNo,bChecked);
	if(this.QRGrid!=null)
	  this.QRGrid.refreshSelectRow(this.recNo);
  }
}

TQuery.prototype.doSelectRow = function(rowIndex,isSaved){
  this.KeySField = this.getSFieldByField(this.KeyField);
  this.SelectdSField = this.getSFieldByField(this.SelectdField);
	
  if(rowIndex==0){
	for(var i=1;i<=this.recordCount;i++){
	  this.SaveSelect(i,isSaved);
	}
  }else
    this.SaveSelect(rowIndex,isSaved);
}

TQuery.prototype.doRecordChange = function(rowIndex){
  if(this.InnerMoveRecord(rowIndex)>0){
	if(this.OnRecordChange!=null) this.OnRecordChange(this);  
    if(this.OnDataChange!=null) this.OnDataChange(this);
  }
}

TQuery.prototype.getRow = function(){
  return (this.isEmpty)?null:this.rownodes[this.recNo-1];
}

//通过字段全名获取别名
TQuery.prototype.getSFieldByField = function(fieldName){
  if(this.fieldCount>0)
    if(typeof(this.fields[fieldName])!="undefined")
	  return this.fields[fieldName].sFieldName;
  return fieldName;	  
}
//计算数据集的合计
TQuery.prototype.innerCalSumValue = function(){
  var isNumberType = function(dataType){
	return (dataType>=2&&dataType<=7)||dataType<=-5; 
  }
	
  var saveRecNo = this.recNo;
  var nCount = this.recordCount;
  var fCount = this.fieldCount;

  var sumValue = [];
  for(var i=0;i<fCount;i++)
    sumValue[i] = 0;
  for(var i=1;i<=nCount;i++){
    this.InnerMoveRecord(i);
    for(var j=0;j<fCount;j++)
	  if(isNumberType(this.fieldInfos[j].DataType))
        sumValue[j] += parseFloat(this.$(this.fieldInfos[j].fieldName));
  }
  this.recNo = saveRecNo;
  for(var i=0;i<fCount;i++){
    this.fieldInfos[i].sumValue = sumValue[i];
	this.fields[this.fieldInfos[i].fieldName].sumValue = sumValue[i];
  }
	
  if(this.OnSumChange!=null)
	this.OnSumChange();
}
//初试化数据集
TQuery.prototype.initQuery = function(xmlData,append){
  if(xmlData==null) return;
  
  var root = xmlData.getElementsByTagName("error");
  if(root!=null&&root.length>0){
    var root = root[0];
	alert(root.childNodes[0].nodeValue);
	return;  
  }

  var isAppend = (typeof(append)=="undefined")?false:append;

  if(!isAppend){
    this.datasetnode = xmlData.getElementsByTagName("RS");
    this.rownodes = this.datasetnode[0].childNodes;
    this.recordCount = this.rownodes.length;

    this.recordset = xmlData;
     //带字段描述的数据

    if(xmlData.getElementsByTagName("FS").length>0){
      var fss = xmlData.getElementsByTagName("FS")[0].childNodes;
      this.fields = new Array;   
	  this.fieldInfos = new Array;
	
      for(var i=0;i<fss.length;i++){
	    var f = "F"+(i+1);
        this.fields[fss[i].getAttribute("A")] = {sFieldName:f,DataType:fss[i].getAttribute("B"),oldValue:"",sumValue:0};
	    this.fieldInfos[i] = {fieldName:fss[i].getAttribute("A"),DataType:fss[i].getAttribute("B"),oldValue:"",sumValue:0}; 
	  }
	  this.fieldCount = fss.length;
    }else
      if(this.recordCount>0)
        this.fieldCount = this.rownodes[0].attributes.length - 4;
	  
    if(this.QRGrid!=null) this.QRGrid.setSFieldByFields();
 
    this.isEmpty = (this.recordCount==0)||(this.rownodes[0].getAttribute("RL")=="0");
    if(this.isEmpty) this.recordCount = 0;
	else
	  this.rowBuffer = this.rownodes[0].cloneNode(true); 
  
    if(this.fields != null)
      this.innerCalSumValue();       //计算合计    

    if(this.useSelected) this.initSelected();
    
	if(this.OnCalField!=null){
	  for(var i = 1; i<=this.recordCount;i++){
		 this.recNo = i;
		 this.OnCalField(this,i);
	  }
	}
    this.recNo = 1;

    if(this.QRGrid!=null) this.QRGrid.doDataChange(this.recNo);   //刷新表格显示
	
  }else{
	var crows = xmlData.getElementsByTagName("RS")[0].childNodes;
	if(crows.length==0) return;
    var ncount = crows.length;
	for(var i = 0; i < ncount; i++){
	  var node = crows[i].cloneNode(true);
	  this.datasetnode[0].append(node);
	} 
	
	if(this.OnCalField!=null){
	  for(var i = 1; i<=ncount;i++){
		 this.recNo = this.recordCount + i;
		 this.OnCalField(this,i);
	  }
	}
	
	this.recNo = this.recordCount + 1;	
    this.recordCount = this.recordCount + ncount;  	
	
	if(this.QRGrid!=null) this.QRGrid.doDataChange(this.recNo);   
  }

  if(!this.isPaging)
    this.recordCountAll = this.recordCount;
	  
  this.Active = true;
  this.setCtrlButtonState();
	
  this.pageInfo = (this.isEmpty)?"无数据":(this.isPaging?"第"+this.pageNumber+"页,共"+this.pageCount+"页":"共"+this.recordCountAll+"条记录");

  if(this.OnDataChange!=null) this.OnDataChange(this);
  if(this.OnPageChange!=null) this.OnPageChange(this);
  //if(this.OnRecordChange!=null) this.OnRecordChange(this);
}

TQuery.prototype.initQuery2 = function(xmlText){
  if(this.recordset==null)
    this.recordset = new ActiveXObject("Microsoft.xmlDom");
  this.recordset.loadXML(xmlText); 
   
  this.datasetnode = this.recordset.getElementsByTagName("RS");
  this.rownodes = this.datasetnode[0].childNodes;
  this.recordCount = this.rownodes.length;
   
  this.fieldCount = this.rownodes[0].attributes.length - 4;
  this.isEmpty = (this.recordCount==0)||(this.rownodes[0].getAttribute("RL")=="0");
  if(this.isEmpty)
    this.recordCount = 0;
  
  this.Active = true;
  
  this.setCtrlButtonState();  
  this.recNo = 1;  
  if(this.OnPageChange!=null) this.OnPageChange(this);
  //if(this.OnRecordChange!=null) this.OnRecordChange(this);
}

//清空数据
TQuery.prototype.emptyDataset = function(){
  if(this.datasetnode != null){
	var dset = this.datasetnode[0];
	var n = dset.childNodes.length - 1;
	while(n>=0){
	  dset.removeChild(dset.childNodes[n]);	
	  n--;
	}
    this.recordCount = 0;
    this.isEmpty = true;
	this.QRGrid.doDataChange();
  }
}

//增加数据
TQuery.prototype.append = function(records){
  if(this.datasetnode != null){
	var dset = this.datasetnode[0];
	var row = this.rowBuffer.cloneNode(true);
	for(var i=1;i<=records.length;i++){
      row.setAttribute("F"+i,records[i-1]);
	}
    dset.append(row);	
	this.recordCount = this.datasetnode[0].childNodes.length;
	this.isEmpty = false;
	this.QRGrid.doDataChange();
  }
}

//异步调用响应函数
TQuery.prototype.doReading = function(AsynSender,AsynAtt,readyState){
  if(this.OnReading!=null)
    this.OnReading(AsynSender,readyState); 
}

TQuery.prototype.XmlHttpCallBack = function(AsynSender,isAsyn,AsynAtt,xmlData,xmlText){
  this.active = xmlData != null;

  if(this.active){
	switch(AsynAtt)
	{
	   case  0://普通调用
	   case -1: 
	           this.initQuery(xmlData);   
			   if(this.OnLoadEnd != null && this.toast){
				 this.OnLoadEnd(this);
			   }
               if(AsynAtt==0&&this.OnSuccess!=null) this.OnSuccess(AsynSender);
			   break;	 
	   case -2: //读取页数		
	           this.innerGetRecordCount(xmlData);
			   this.isBusy = false;               //清除忙标记 
  			   if(isAsyn) this.getFirstPage();    //动态调用时，自动读取第一页
			   break;
	   default://读取某一页		 
	           this.pageNumber = AsynAtt; 
               this.initQuery(xmlData,this.srollRead);
			   if(this.OnLoadEnd != null && this.toast){
				 this.OnLoadEnd(this);
			   }
			   this.srollRead = false;	 
			   break;
	}
	if(this.OnComplete != null)
	  this.OnComplete(this);
  }
}
//设置SQL语句
TQuery.prototype.setSql = function(sqlID,params,pageSize){
 this.sqltype = 1;
 this.sqlID = sqlID;
 this.params = params;
 this.pageSize = pageSize;
}

//打开数据集
TQuery.prototype.doOpen = function(params,sqlID,AsynSender,callback){
 if(typeof(sqlID)!="undefined"&&sqlID!="")	
  this.sqlID = sqlID;
 this.params = params;	

 var nF=1;
 var nT=this.pageSize;
 
 __xmlHttp.sqltype = this.sqltype;
 __xmlHttp.AsynSender = AsynSender;
 var isAsyn = AsynSender!="";
 __xmlHttp.isAsyn = isAsyn;
 
 if(this.useSelected){
   this.SelectedKey = [];
   this.SelectedRow = [];
 }
 
 if(typeof(callback) != "undefined")
   this.OnComplete = callback;
    
 var that = this; 
 if(this.OnLoadStart != null && this.toast){
	this.OnLoadStart(this);
	var time = window.setInterval(function() {
	    window.clearInterval(time); 
		__xmlHttp._getDataFromServer(that,that.sqlID,that.params,nF,nT);
		},1000);
 }else{
	__xmlHttp._getDataFromServer(that,that.sqlID,that.params,nF,nT); 
 }
}

TQuery.prototype.Open = function(params,sqlID,callback){
  this.doOpen(params,sqlID,"");
}

TQuery.prototype.open = function(params,sqlID,callback){
  this.doOpen(params,sqlID,"");
}

TQuery.prototype.OpenAsyn = function(params,sqlID,AsynSender,callback){
  this.doOpen(params,sqlID,AsynSender);
}

TQuery.prototype.openAsyn = function(params,sqlID,AsynSender,callback){
  this.doOpen(params,sqlID,AsynSender);
}

TQuery.prototype.innerQuery = function(sqlID,params,dataFormat,AsynSender,callback){
 var nF = 1;
 var nT = this.pageSize;
 __xmlHttp.dataFormat = dataFormat;
 __xmlHttp.AsynSender = AsynSender;
 var isAsyn = AsynSender != "";
 __xmlHttp.isAsyn = isAsyn;
 
 this.sqlID = sqlID;
 
 if(this.useSelected){
   this.SelectedKey = [];
   this.SelectedRow = [];
 }

 if(typeof(callback) != "undefined")
   this.OnComplete = callback;
 var that = this; 
 if(this.OnLoadStart != null && this.toast){
	this.OnLoadStart(this);
	var time = window.setInterval(function() {
	    window.clearInterval(time); 
		__xmlHttp._getDataFromServer(that,sqlID,params,nF,nT);
	},1000);
 }else{
	__xmlHttp._getDataFromServer(this,sqlID,params,nF,nT);
 }
}

//带字段信息的数据
TQuery.prototype.Query = function(sqlID,params,callback){
  this.innerQuery(sqlID,params,7,"",callback);	
}

TQuery.prototype.QueryRowToCol = function(sqlID,params,nRowToCol,callback){
  this.innerQuery(sqlID,params,1000+nRowToCol,"",callback,callback);	
}

TQuery.prototype.QueryAsyn = function(sqlID,params,AsynSender,callback){
  this.innerQuery(sqlID,params,7,AsynSender,callback);	
}

TQuery.prototype.QueryRowToColAsyn = function(sqlID,params,nRowToCol,AsynSender,callback){
  this.innerQuery(sqlID,params,1000+nRowToCol,AsynSender,callback);	
}

TQuery.prototype.Get = function(pageName){
  this.initQuery(__xmlHttp.requestObj(pageName));
}

TQuery.prototype.Post = function(pageName,paramStr){
  __xmlHttp.callPageObj(this,pageName,paramStr);
}
/*处理页数*/
TQuery.prototype.innerGetRecordCount = function(xmldoc){
  this.SumInfo = xmldoc;
  var datasetnode = xmldoc.getElementsByTagName("RS");
  var rownodes = datasetnode[0].childNodes;
  var row = rownodes[0];
  this.recordCountAll = parseInt(row.getAttribute("F1").toString(),10);
  
  if(this.pageSize>0)
    this.pageCount = Math.ceil(this.recordCountAll/this.pageSize);

  if(this.OnPageCount!=null) this.OnPageCount(this);
 
  if(this.QRGrid!=null){ 
    this.QRGrid.doPageChange();
  }
}

TQuery.prototype.getSumValue = function(fieldName,format){
  if(this.SumInfo != null){
	fieldName = fieldName.toUpperCase();  
    var xmldoc = this.SumInfo;
	if(xmldoc.getElementsByTagName("FS").length>0){
      var fss = xmldoc.getElementsByTagName("FS")[0].childNodes;

      for(var i=0;i<fss.length;i++){
	    if(fieldName==fss[i].getAttribute("A")){
		   fieldName = "F"+(i+1);
		   break;
	    }
	  } 
	}
	var row = xmldoc.getElementsByTagName("RS")[0].childNodes[0];
	var v = row.getAttribute(fieldName.toUpperCase()).toString();
	if(v!=""&&typeof(format)!="undefined"&&format!="")
	  v = formatFloat(format,parseFloat(v));
	return v;  
  }
  return "";
}

TQuery.prototype.doGetPageCount = function(isAsyn,params,sqlIDC,sqlID){
  var pn = 0;
  if(typeof(sqlID)!="undefined"&&sqlID!="")	
   this.sqlID = sqlID;
  
  if(typeof(sqlIDC)!="undefined"&&sqlIDC!="")	
    this.sqlIDC = sqlIDC;
   
  this.params = params;	
 
  if(this.useSelected){
    this.SelectedKey = [];
    this.SelectedRow = [];
  }

  var nF = 1;
  var nT = this.pageSize;
 
  this.InnerIsAsyn = isAsyn;
  __xmlHttp.dataFormat = this.dataFormat;
  __xmlHttp.sqltype = this.sqltype;
  __xmlHttp.isAsyn = this.InnerIsAsyn;        //异步调用
  
  this.InnerAsynSender = isAsyn? [this.name]:"";
  __xmlHttp.AsynSender = this.InnerAsynSender;
  
  __xmlHttp.AsynAtt = -2;
  this.isBusy = isAsyn;             //异步调用时，读页数时设置忙状态
  __xmlHttp._getDataFromServer(this,this.sqlIDC,this.params,nF,nT);
  this.isPaging = true;
  
  return this.recordCountAll;
}

TQuery.prototype.getPageCount = function(params,sqlIDC,sqlID){
   this.dataFormat = 0;	 
   return this.doGetPageCount(false,params,sqlIDC,sqlID);	
}

TQuery.prototype.getPageCountAsyn = function(params,sqlIDC,sqlID){
   this.dataFormat = 0;
   this.doGetPageCount(true,params,sqlIDC,sqlID);	
}

TQuery.prototype.getPageCountEx = function(params,sqlIDC,sqlID){
   this.dataFormat = (this.dataFormatEx)? 8:7;
   return this.doGetPageCount(false,params,sqlIDC,sqlID);	
}

TQuery.prototype.getPageCountExAsyn = function(params,sqlIDC,sqlID){
   this.dataFormat = (this.dataFormatEx)? 8:7;
   this.doGetPageCount(true,params,sqlIDC,sqlID);	
}

/*读取一页数据*/
TQuery.prototype.InnerGetData= function(AsynAtt,nF,nT){
 __xmlHttp.sqltype = this.sqltype;
 __xmlHttp.isAsyn = this.InnerIsAsyn; 
 __xmlHttp.AsynSender = this.InnerAsynSender;
 __xmlHttp.AsynAtt = AsynAtt;
 __xmlHttp.dataFormat = this.dataFormat; 
 
 var that = this; 
 if(this.OnLoadStart != null && this.toast){
	this.OnLoadStart(this);
    var time = window.setInterval(function() {
        window.clearInterval(time);     //停止执行setInterval循环。
		__xmlHttp._getDataFromServer(that,that.sqlID,that.params,nF,nT);
		},1000);
 }else{
	__xmlHttp._getDataFromServer(that,that.sqlID,that.params,nF,nT);
 }
 
 	
}

//读取第一页
TQuery.prototype.getFirstPage = function(sqlID){
 if(typeof(sqlID)!="undefined"&&sqlID!="")	
   this.sqlID = sqlID;

 this.InnerGetData(1,1,this.pageSize);
}

//读取上一页
TQuery.prototype.getPriorPage = function(){
 if(this.pageNumber>1){	
  var nF = this.pageSize*(this.pageNumber-2)+1;
  var nT = this.pageSize*(this.pageNumber-1);
  
  this.InnerGetData(this.pageNumber-1,nF,nT);
 }
}

//读取下一页
TQuery.prototype.getNextPage = function(srollRead){
 if(this.pageNumber < this.pageCount){	
   var nF = this.pageSize*this.pageNumber+1;
   var nT = this.pageSize*(this.pageNumber+1);
   this.srollRead = (typeof(srollRead)=="undefined")? this.srollRead:srollRead;
   this.InnerGetData(this.pageNumber+1,nF,nT);
 }
}

//读取最后一页
TQuery.prototype.getLastPage = function(isRefresh){
 var bR = (typeof(isRefresh)!="undefined")&&isRefresh;
 if(this.pageNumber<this.pageCount||bR){	
 
  var nF=this.pageSize*(this.pageCount-1)+1;
  var nT=this.pageSize*this.pageCount;

  this.InnerGetData(this.pageCount,nF,nT);
 }
}

//读取指定页
TQuery.prototype.getPage = function(nPage){
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
  
  this.InnerGetData(n,nF,nT);
}
/*获取相对页*/
TQuery.prototype.getOffPage = function(nOffPage){
	var n = this.pageNumber+nOffPage;
	if(n>0&&n<=this.pageCount)
	  this.getPage(n);
}

/*刷新当前页*/
TQuery.prototype.refreshPage = function(pageAtt){
  if(pageAtt==0){
	this.getPage(this.pageNumber);  
  }else{
    var nPage = (this.recordCount<=1&&this.pageNumber>1)? this.pageNumber-1:this.pageNumber;
    this.doGetPageCount(false,this.params,this.sqlIDC,this.sqlID);	
    if(pageAtt==1)
      this.getPage(nPage);
    else 
      this.getLastPage(true);	
  }
}

/*此方法供其它对象调用*/
TQuery.prototype.InnerGetAllPage = function(){
  __xmlHttp.sqltype = this.sqltype;
 
  __xmlHttp.isAsyn = this.InnerIsAsyn; 
  __xmlHttp.AsynSender = this.InnerAsynSender;
  __xmlHttp.AsynAtt = -1;
  __xmlHttp._getDataFromServer(this,this.sqlID,this.params,1,100000);	 
}

//移动记录
TQuery.prototype.moveRecord = function(rowIndex){
 if(!this.isEmty&&rowIndex!=this.recNo){
   if(rowIndex<1) rowIndex = 1;
   if(rowIndex>this.recordCount) rowIndex = this.recordCount;

   this.recNo = rowIndex;
   if(this.QRGrid!=null) this.QRGrid.doMoveRecord(rowIndex);  //刷新表格当前行
 
   if(this.OnRecordChange!=null)
     this.OnRecordChange(this,this.origField);
   this.origField = "";
   return rowIndex;
 }
}

//内部移动记录
TQuery.prototype.InnerMoveRecord = function(rowIndex,att){

 if(rowIndex<1) rowIndex = 1;
 if(rowIndex>this.recordCount) rowIndex = this.recordCount;
 if(rowIndex==this.recNo) return 0; 

 this.recNo = rowIndex;

 if(this.QRGrid!=null) this.QRGrid.doMoveRecord(rowIndex);  //刷新表格当前行

 return rowIndex;
}

TQuery.prototype.LocateRecord = function(fieldNames,values){
  var result = false;
  var fCount = fieldNames.length;
  if(!this.isEmpty){
    var rowIndex = this.recNo;
	for(var i=1;!result&&i<=this.recordCount;i++){
	  this.InnerMoveRecord(i);
	  result = true;
	  for(var j=0;result&&j<fCount;j++)
	    result = this.$(fieldNames[j])==values[j];
	}
	if(!result) this.InnerMoveRecord(rowIndex);
	else
	  if(this.QRGrid!=null) this.QRGrid.doMoveRecord(this.recNo);  //刷新表格当前行
  }
  return result;
}
//列被选中时
TQuery.prototype.selectColumn = function(fieldName){
 this.origField = fieldName;  
}
//移动记录
TQuery.prototype.first = function(){
 return this.moveRecord(1);	
}

TQuery.prototype.prior = function(){
 return this.moveRecord(this.recNo-1);	 	
}

TQuery.prototype.next = function(){
 return this.moveRecord(this.recNo+1);	 	
}

TQuery.prototype.last = function(){
 return this.moveRecord(this.recordCount);	 	
}

TQuery.prototype.drawRow = function(){
  if(this.QRGrid!=null) this.QRGrid.innerDrawRow(this.recNo);
}

TQuery.prototype.$Inner = function(fieldName,format,b0Space){
  var result = "";
  fieldName = fieldName.toUpperCase();
  var datatype = 0;

  if(this.isEmpty)
    result = ""
  else{
    var row = this.rownodes[this.recNo-1];

    if(this.fields!=null&&typeof(this.fields[fieldName])!="undefined"){
	  datatype = parseInt(this.fields[fieldName].DataType);
      fieldName = this.fields[fieldName].sFieldName;
    }
    result = row.getAttribute(fieldName).toString();
  } 
  
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

TQuery.prototype.$ = function(fieldName,format,b0Space){
  return this.$Inner(fieldName,
					 (typeof(format)=="undefined")? "":format,
				     (typeof(b0Space)=="undefined")? false:b0Space);
}

TQuery.prototype.$0 = function(fieldName,format){
  return this.$Inner(fieldName,format,true);
}

TQuery.prototype.$Default = function(fieldName,format,vDefault){
  var v = this.$Inner(fieldName,format,true);
  return (v!="")? v : vDefault;
}

TQuery.prototype.getFieldValue = function(fieldName){
  return this.$(fieldName,"");
}

TQuery.prototype.getNumeric = function(fieldName,format){
  return this.$(fieldName,format);
}

TQuery.prototype.$innerSum = function(fieldName,format,b0Space){
  var result="";
  fieldName = fieldName.toUpperCase();
  var datatype = 0;
  if(this.isEmpty)
    result = ""
  else{
    result = this.fields[fieldName].sumValue+"";
    if(b0Space&&parseFloat(result)==0) result = "";
    if(result!=""&&typeof(format)!="undefined"&&format!="")
      result = formatFloat(format,parseFloat(result));
  }
  return result;	
}

TQuery.prototype.$Sum = function(fieldName,format,b0Space){
  return this.$innerSum(fieldName,
					    (typeof(format)=="undefined")? "":format,
				       ( typeof(b0Space)=="undefined")? false:b0Space);
}
//选中行处理函数
TQuery.prototype.selectedRecordCount = function(){
  return this.SelectedRow.length;	
}

TQuery.prototype.selectedMoveRecord = function(rowIndex){
  if(rowIndex>0&&rowIndex<=this.SelectedRow.length)
    this.SelectedRecNo = rowIndex;
}

TQuery.prototype.$SelectedInner = function(fieldName,format,b0Space){
 var result="";
 fieldName = fieldName.toUpperCase();
 if(this.SelectedRow.length==0)
  result = ""
 else{
   var row = this.SelectedRow[this.SelectedRecNo-1];
   if(this.fields!=null&&typeof(this.fields[fieldName])!="undefined")
     fieldName = this.fields[fieldName].sFieldName;
   result = row.getAttribute(fieldName).toString();
 } 
  
 if(b0Space&&parseFloat(result)==0) result = "";
 
 if(result!=""&&typeof(format)!="undefined"&&format!="")
   result = formatFloat(format,parseFloat(result));
 return result;	
}

TQuery.prototype.$Selected = function(fieldName,format,b0Space){
  return this.$SelectedInner(fieldName,
		  			        (typeof(format)=="undefined")? "":format,
					        (typeof(b0Space)=="undefined")? false:b0Space);	
}

TQuery.prototype.$SelectedKey = function(){
  if(this.SelectedKey.length>0&&this.SelectedRecNo<=this.SelectedKey.length)
    return this.SelectedKey[this.SelectedRecNo-1];
}

//如果不是选择类数据,返回前,当前记录放入返回中
TQuery.prototype.SelectedReturn = function(){
  if(!this.useSelected&&!this.isEmpty){	
    if(this.SelectedRow.length>0)
	  this.SelectedRow.pop();
    this.SelectedRow.push(this.rownodes[this.recNo-1]);
  }
}
//检查是否有选择的记录
TQuery.prototype.hasSelected = function(){
  return this.SelectedKey.length>0; 	
}

TQuery.prototype.$select = function(){
  return this.SelectedKey.join(","); 	
}

TQuery.prototype.$setFV = function(fieldName,value){
  var row = this.rownodes[this.recNo-1];
  if(this.fields!=null&&typeof(this.fields[fieldName])!="undefined"){
    datatype = parseInt(this.fields[fieldName].DataType);
    fieldName = this.fields[fieldName].sFieldName;
  }
  row.setAttribute(fieldName,value+"");
}

TQuery.prototype.setFieldValue = function(fieldName,value){
  if(!this.isEmpty){
    fieldName = fieldName.toUpperCase();	  
    this.$setFV(fieldName,value);	  
	this.drawRow();
  } 
}

TQuery.prototype.$set = function(fieldName,value){
  this.setFieldValue(fieldName,value);
}

TQuery.prototype.setFieldValues = function(fieldNames,values){
  if(!this.isEmpty){
	for(var i=0;i<fieldNames.length;i++)
	  this.$setFV(fieldNames[i].toUpperCase(),values[i]);	  
 	this.drawRow();
  } 
}

TQuery.prototype.getFieldValues = function(){
  var result=[];
  var fields=this.rownodes[this.recNo-1].attributes;
  for(var i=0;i<this.fieldCount;i++)
    result[i] = fields[i+4].nodeValue;
  return result;
}

TQuery.prototype.$SelectedKeyStr = function(splitChar){
  var result = "";	
  var c = (typeof(splitChar)!="undefined")? splitChar : ",";
  for(var i=0;i<this.SelectedKey.length;i++)
    if(i==0)
	  result = this.SelectedKey[i]; 
	else
      result = result+c+this.SelectedKey[i];
  return result;	  
}

TQuery.prototype.innerFieldChange = function(fieldName,newValue){
  var oldValue = this.$(fieldName);
  if(oldValue!=newValue){
   //保存原值
   for(var i=0;i<this.fieldInfos.length;i++){
     this.fieldInfos[i].oldValue = this.$(this.fieldInfos[i].fieldName); 
	 this.fields[this.fieldInfos[i].fieldName].oldValue = this.fieldInfos[i].oldValue; 
   }
   
   this.setFieldValue(fieldName,newValue);
   
   if(this.OnFieldChange!=null)
     newValue = this.OnFieldChange(fieldName,newValue);
   //执行数据更新	 
   if(this.whereField.length>0&&this.tableName!=""){
	   
	 var isNumberType = function(dataType){
		return (dataType>=2&&dataType<=7)||dataType<=-5; 
	 }

	 var sSet = "";
	 var cCount = 0;       
   	 //构造set语句	 

     for(var i=0;i<this.fieldInfos.length;i++){
  	   var field = this.fieldInfos[i]; //字段对象   
       
	   var v = this.$(field.fieldName);

       if(field.oldValue!=v){  //新旧值不等时需要更新

         var vSet = v;
         if(v=="")
		   vSet = "null";
		 else if(!isNumberType(parseInt(field.DataType)))      //是数字类型
		        vSet = "'"+v+"'";
         if(cCount>0)
		   sSet += ",";
		 
		 sSet += field.fieldName +"="+vSet;
		 cCount++;
	   }
     }  
	   
	 if(cCount>0){
       sSet = " set "+sSet;    		 
	
	   //构造where语句
   	   var sWhere = " ";
	   for(var i=0;i<this.whereField.length;i++){
	     var wFieldName = this.whereField[i];	 
	     field = 	this.fields[wFieldName]; 
 	     if(i>0) sWhere += ' and ';
	     if(isNumberType(parseInt(field.DataType)))
	       sWhere += wFieldName+"="+field.oldValue;
   	     else 
	       sWhere += wFieldName+"='"+field.oldValue+"'";
	   }
  	   __xmlHttp.doExecuteSql("update "+this.tableName+sSet+" where"+sWhere,[],"");
	   
	   this.innerCalSumValue();       //计算合计
	 }
   }
  }
}

TQuery.prototype.getRecordCount = function(){
  return this.recordCount;
}

TQuery.prototype.Delete = function(){
  if(this.whereField.length>0&&this.tableName!=""){
    var isNumberType = function(dataType){
	  return (dataType>=2&&dataType<=7)||dataType<=-5; 
	}
	
    var sWhere = " ";
	for(var i=0;i<this.whereField.length;i++){
	  var wFieldName = this.whereField[i];	 
	  field = this.fields[wFieldName.toUpperCase()]; 
 	  if(i>0) sWhere += ' and ';
	  if(isNumberType(parseInt(field.DataType)))
	    sWhere += wFieldName+"="+this.$(wFieldName);
   	  else 
	    sWhere += wFieldName+"='"+this.$(wFieldName)+"'";
	}
	
	if(__xmlHttp.doExecuteSql("delete from "+this.tableName+" where"+sWhere,[],"")==0)
	  if(this.OnDelete!=null)
	    this.OnDelete();
  }
}

TQuery.prototype.showToast = function(){
   this.OnLoadStart = function(){
	 showWaiting();
   }
   this.OnLoadEnd = function(){
	 closeWaiting();
   }
   this.toast = true;
}

TQuery.prototype.refreshCtrl = function(dsname){

  data = (typeof(dsname)!="undefined"&&dsname!="")? "[data-source='"+dsname+"']" : "[data-field]";
  iobjs =  $(data);	

  for(i=0;i<iobjs.length;i++){
	eobj = iobjs[i];
	fieldName = eobj.dataset.field;
	dataformat = (typeof(eobj.dataset.dataformat) != "undefined")? eobj.dataset.dataformat : "";
    ctype = eobj.tagName;

	if(ctype=="TEXTAREA")
	  eobj.value = this.$(fieldName,dataformat);
	else
	if(ctype=="SELECT")  
	  eobj.value = this.$(fieldName,dataformat);
	else
	if(ctype=="INPUT"){
	  type = eobj.type.toUpperCase();
	  if(type=="TEXT"||type=="DATE"||type=="PASSWORD"){
		eobj.value = this.$(fieldName,dataformat);
	  }else{
   	    if(type=="CHECKBOX") 
		  eobj.value = this.$(fieldName);
	  }
	}
	else
	if(ctype=="IMG"){
	  eobj.src = this.$(fieldName);
	}else{
	  if(ctype=="SPAN"||ctype=="TD"){
	    eobj.innerHTML = this.$(fieldName);
	  }
	}
  }	
}

TQuery.prototype.clearCtrl = function(dsname){

  data = (typeof(dsname)!="undefined"&&dsname!="")? "[data-source='"+dsname+"']" : "[data-field]";
  iobjs =  $(data);	

  for(i=0;i<iobjs.length;i++){
	eobj = iobjs[i];
	fieldName = eobj.dataset.field;
	dataformat = (typeof(eobj.dataset.dataformat) != "undefined")? eobj.dataset.dataformat : "";
    ctype = eobj.tagName;

	if(ctype=="TEXTAREA")
	  eobj.value = "";
	else
	if(ctype=="SELECT")  
	  eobj.value = "";
	else
	if(ctype=="INPUT"){
	  type = eobj.type.toUpperCase();
	  if(type=="TEXT"||type=="DATE"||type=="PASSWORD"){
		eobj.value = "";
	  }else{
   	    if(type=="CHECKBOX") 
		  eobj.value = "";
	  }
	}
	else
	if(ctype=="IMG"){
	  eobj.src = "";
	}else{
	  if(ctype=="SPAN"){
	    eobj.innerHTML = "";
	  }
	}
  }	
}
//定义全局查询对象

__$Query = new TQuery("",10,false);

TFindObject.prototype.className = "TFindObject";
TFindObject.prototype.DynCall = false;      //动态调用
TFindObject.prototype.CallAtt = "0";        //动态树型调用时
TFindObject.prototype.OnSetValue = null;
TFindObject.prototype.OnSetValueEx = null;

function TFindObject(url,w,h,sqlIDC,sqlID){
  
  this.className = "TFindObject";
  this.callId = "";
  this.sqlID = sqlID;
  this.sqlIDC = sqlIDC;
   
  this.results = [];     //返回结果 
  this.dataset = null;
  this.value = "";
  this.text = "";
  
  this.zeroReturnTrue = false;
  
  this.isOpen = false;
  this.width = w;
  this.height = h;
  this.owidth = w;
  this.oheight = h;
  
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
  this.hint = "找不到数据";
  this.vpos = 1;
  this.recoutCount = 0;
  
  this.OnSetValue = null;  
  __VCL.add(this);
}

TFindObject.prototype.free = function(){
  this.params = null;
  this.results = null;
}

TFindObject.prototype.setPropertys = function(props){
  for(var i in props)
    this[i] = props[i];
} 

TFindObject.prototype.doCodeCallBack = function(dataset,addValue){
  
  this.closeWindow();
  this.dataset = dataset;
  this.value = dataset.$("F1");	
  this.text = dataset.$("F2");	

  var i=0;
  for(i=0;i<dataset.fieldCount;i++)
    this.results[i] = dataset.$("F"+(i+1));
  
  if(typeof(addValue)!="undefined")
    this.results[i] = addValue;
   
  if(this.OnSetValue!=null)
    this.OnSetValue(this,this.callId);	
}

TFindObject.prototype.doCodeCallBack2 = function(results){ 
  
  this.closeWindow();
  	
  this.value = results[0];	
  this.text = results[1];
  this.results = results;
  if(this.OnSetValue!=null)
    this.OnSetValue(this,this.callId);
}

TFindObject.prototype.doSelectAll = function(results){
	
  this.closeWindow();
  	
  this.value = results[0];	
  this.text = results[1];
}

TFindObject.prototype.doTreeCallBack = function(node){
	
  this.closeWindow();	
  this.value = node.getCode();	
  this.text = _$splitCodeAndName(node.getText(),".");
  this.results[0] = this.value;
  this.results[1] = this.text ;
  this.results[2] = node.getID();
  
  if(this.OnSetValue!=null)  this.OnSetValue(this,this.callId);
  
}

TFindObject.prototype.doTreeCallBacks = function(tree){
  
  this.closeWindow();
  	
  this.results[0] = "";
  this.results[1] = tree.getCheckedsText(",");
  this.results[2] = 0;
  
  if(this.OnSetValue!=null) this.OnSetValue(this,this.callId);
}

TFindObject.prototype.QueryCallBack = function(Query){
  this.closeWindow();
  if(this.OnSetValueEx!=null) this.OnSetValueEx(this,Query,this.callId);	
}

TFindObject.prototype.closeWindow = function(){
  $("#finddialogModal").modal("hide");
}

TFindObject.prototype.readDataTest = function(sparams){
  var result = 2;	
  if(typeof(__$Query)!="undefined"){
    if(this.sqlID!=""&&this.sqlIDC!=""){
      this.sparams = sparams;	   
      if(this.OnGetParams!=null)
        this.OnGetParams(this,sparams);  //获取参数
      this.OnGetParams = null;	

      var iSave = __$Query.dataFormatEx;
 	  __$Query.dataFormatEx = this.DynCall;

      result = __$Query.getPageCount(this.sparams,this.sqlIDC,this.sqlID);
      this.recoutCount = result;

      if(!this.zeroReturnTrue)  //无记录时返回true
        switch(result){
	      case 0: alert(this.hint);
	              break;
	      case 1: __$Query.InnerGetAllPage();	         //直接读取一条记录
		          this.doCodeCallBack2(__$Query.getFieldValues());
		 	      this.Query = __$Query;
	              break;
        }
	  
      __$Query.dataFormatEx = iSave;	  	
    }
  }
  return result; 
}

TFindObject.prototype.readData = function(qc){
  var result = true;	
  var nResult = 2;
  var url;
  var param = "";
  var sparams = [];

  if(this.url.indexOf("?")>0)
    url = this.url+"&v="+qc;
  else url = this.url+"?v="+qc;
  
  url = url+"&vpos="+this.vpos;
  sparams[0] = qc;
  
  if(typeof(this.params)!="undefined"&&this.params!=null)  
    for(var i=0;i<this.params.length;i++){
      param = param+"&p"+i+"="+this.params[i];
	  sparams[i+1] = this.params[i];
    }

  if(!this.allwayOpen&&this.sqlID!="")
    nResult = this.readDataTest(sparams);
  else {
    this.sparams = sparams;	   
    if(this.OnGetParams!=null)
      this.OnGetParams(this,sparams);  //获取参数
    this.OnGetParams = null;	
  }
  
  result = (nResult>0)||(this.zeroReturnTrue&&nResult==0);
  if(nResult>=2||(this.zeroReturnTrue&&nResult==1)){
    if(typeof(this.sparams)!="undefined"&&this.sparams!=null){  
      param = "";	   
      for(var i=0;i<this.sparams.length;i++)
        param = param+"&p"+i+"="+this.sparams[i];
    }
   
    this.$openurl = url+param+"&lexiconid="+escape(this.sqlID)+"&lexiconidc="+escape(this.sqlIDC)+"&callatt="+this.CallAtt;
 
    __xmlHttp.callObj = this;
    $("#finddialogData").attr("src",this.$openurl);
	$("#finddialogModal").modal({ keyboard: true  });
  }
  this.sparams = null;
  this.width = this.owidth;  
  this.height = this.oheight;
  this.allwayOpen = false;
  return result;
}

TFindObject.prototype.readDataEx = function(callId,caption,width,height,url,sqlIDC,sqlID,qc,allwayOpen){
  this.callId = callId;	
  if(typeof(allwayOpen)!="undefined"&&allwayOpen!=null)
    this.allwayOpen = allwayOpen;
   
  if(typeof(width)!="undefined")
    this.width = width;

  if(typeof(height)!="undefined")
    this.height = height;
  
  $("#finddialogForm").css("width",width);
  $("#finddialogModalLabel").text(caption);
  $("#finddialogBody").css("height",height);


  this.DynCall = url.lastIndexOf(__$gfileext)<0;
  
  if(typeof(sqlID)!="undefined"){
    this.sqlID = sqlID;
    this.sqlIDC = (this.DynCall)? sqlID+"_COUNT":sqlIDC;
  }
  
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
  
  this.readData((typeof(qc)!="undefined")?qc:"");
}

var __$FindObject = new TFindObject("",560,280,"","");   

