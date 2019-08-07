/*框架使用的公用文件*/
__$gfileext = '.jsp';
__$gfile= {
  	pagelogout:		"pagelogout"+__$gfileext,
	dynrecords:		"dynrecords"+__$gfileext,
	pagefinishi:	"pagefinishi"+__$gfileext,
	executeproc:	"executeproc"+__$gfileext,
	executesql:		"executesql"+__$gfileext,
	toexcel:		"toexcel"+__$gfileext,
	getsequencev:	"getsequencev"+__$gfileext,
	getservertime:	"getservertime"+__$gfileext,
	dynrecordsex:	"dynrecordsex"+__$gfileext,
	applyupdate:	"applyupdate"+__$gfileext,
	gettreedata:    "gettreedata"+__$gfileext,
	pubfind:        "pub_find"+__$gfileext,
	pubfindtree:    "pub_findtree"+__$gfileext,
	gettabledata:   "gettabledata"+__$gfileext
}

_dbgrid_defColor = "#ffffff";
_dbgrid_defFontColor = "#333333";
_dbgrid_defFontName = "微软雅黑";
_dbgrid_defFontSize = 13;
_dbgrid_defSortMarkColor = "#0000dd";

_dbgrid_defActiveFixedColor = "#dddddd";
_dbgrid_defActiveRecordColor = "#e9f4fe";
_dbgrid_defEditColor = "#ffffff";
_dbgrid_defFixedColor = "#f9f9f9";

_dbgrid_defGridLineColor = "#dddddd";
_dbgrid_defGridTitleColor = "#888888";
_dbgrid_defSelectBackGround = "#ddddee";
_dbgrid_defTotalColor = "#ffffff";
_dbgrid_defCrossColor = "#eeeeee";

_dbgrid_defInputMarkColor = "#ff0000";

_dbgrid_defMoveDivBgColor = "#aaaaff";
_dbgrid_defMoveDivFontColor = "#000000";

_dbgrid_defInpBorderColor = "#0000aa";
_dbgrid_defInpButtonColorLT = "#eeeeee";
_dbgrid_defInpButtonColorRB = "#999999";

_dbgrid_defFixedTopColor = "#cccccc";
_date_defspChar = "-";
_dbgrid_defdelImageSrc = "../images/griddel.gif";

var __DEBUG = false;       //调试模式
var __$sysType = "none";   //浏览器类型
var __$iswx = false;       //微信浏览器 

/*
function _$BlueClook(){ 
  var id = window.document.activeElement.name;
  if(typeof(id)=="undefined"&&event.keyCode==8)
   return false;
  if(event.ctrlKey&&event.keyCode==78)
   return false;
 }  

document.onkeydown = _$BlueClook;  */

TBlueCVcl.prototype.className = "TBlueCVcl";
function TBlueCVcl(){ 
  this.version = 2019;	 
  this.name = "BlueCVcl";
  this.toString = function(){return "BlueC VCL 2006 - 2019"}
  this.components = [];
  this.oldUnLoad = null;
  this.bodyTag = null;
  this.oldResize = null;
  this.idbgrids = [];
}

TBlueCVcl.prototype.ComponentName = function(className){
  var nIndex = 0;
  for(var i=this.components.length-1;i>=0;i--){
    var pObj = this.components[i];
    if(pObj.className==className){
	  nIndex = parseInt(pObj.name.substring(className.length));
	}
  }
  return className+(nIndex+1);
}

TBlueCVcl.prototype.addComponent = function(obj){
  //生成组件名称,每个组件有唯一的名称
  if(typeof(obj.className)!="undefined")
    obj.name = this.ComponentName(obj.className);
  this.components.push(obj);	
}

TBlueCVcl.prototype.add = function(obj){
  if(typeof(obj.className)!="undefined")
    obj.name = this.ComponentName(obj.className);
  this.components.push(obj);
  if(this.bodyTag==null){
	this.bodyTag = document.body;
	if(this.bodyTag!=null){
	  this.oldUnLoad = this.bodyTag.onunload;	
	  this.bodyTag.onunload = this._Vcl_doUnLoad;
	}
  }
}

TBlueCVcl.prototype._Vcl_doUnLoad = function(e){
 if(__VCL.bodyTag!=null){
   __VCL.bodyTag.onunload = null;
   __VCL.bodyTag = null;
   if(__VCL.oldUnLoad!=null)
     __VCL.oldUnLoad(e);
   __VCL.oldUnLoad = null;
   __VCL.freeAll();
 }
 if(typeof(__xmlHttp)!="undefined")
   __xmlHttp.pageLogout();
}

TBlueCVcl.prototype.freeAll = function(){
 var obj;	
 for(var i=this.components.length-1;i>=0;i--){
   obj = this.components.pop(); 	 

   obj.free();  
   obj = null;
 }
 
 for(var i=this.gridInps.length-1;i>=0;i--){
   this.idbgrids.pop(); 	 
 }
 this.idbgrids = null;
}

TBlueCVcl.prototype.doAutoAdjust = function(){
  var toolsheight = 0;
  for(var i=0;i<this.toolsPanels.length;i++)
    toolsheight += $(this.toolsPanels[i]).outerHeight();

  $(this.clientPanel).css("height",this.clientHeight - toolsheight);	
}

TBlueCVcl.prototype._Vcl_doResize = function(e){
  if(__VCL._Vcl_doResize!=null){
	__VCL._Vcl_doResize(e);   
  }
  __VCL.doAutoAdjust();
}

TBlueCVcl.prototype.autoAdjust = function(clientPanel,toolsPanels){
  this.clientHeight = document.documentElement.clientHeight;	
  this.oldResize = document.body.onResize;
  document.body.onResize = this._Vcl_doResize;
  this.clientPanel = clientPanel;
  this.toolsPanels = toolsPanels; 
  this.doAutoAdjust();
}

TBlueCVcl.prototype.showDialog = function(dialogId,dialogBodyId,dialogW,dialogH){
  dialog = document.getElementById(dialogId);
  dialogBody = document.getElementById(dialogBodyId);	
  var sWidth = document.body.clientWidth;
  var sHeight = document.body.clientHeight;
  dialogBody.style.width = dialogW+"px";
  dialogBody.style.height = dialogH+"px";
  dialogBody.style.top = (document.documentElement.scrollTop + (sHeight - dialogH) / 2) + "px";
  dialogBody.style.left = (sWidth - dialogW) / 2 + "px";
	
  dialog.style.visibility = "";	
  dialog.style.display = "";	
}

TBlueCVcl.prototype.closeDialog = function(dialogId){
  document.getElementById(dialogId).style.visibility = "hidden";	
  document.getElementById(dialogId).style.display = "none";	
}

if(!window.__VCL){
  var __VCL = new TBlueCVcl();  

  //var ua = navigator.userAgent.toLowerCase();
  
  var userAgent = navigator.userAgent.toLowerCase();    //取得浏览器的userAgent字符串

  __$iswx = userAgent.indexOf("micromessenger") > -1;
  var isOpera = userAgent.indexOf("opera") > -1; //判断是否Opera浏览器  
  
  if(isOpera) {
    __$sysType = "Opera";
  } else if (userAgent.indexOf("firefox") > -1) {
    __$sysType = "FF";
  } else if (userAgent.indexOf("chrome") > -1){
    __$sysType = "Chrome";
  } else if (userAgent.indexOf("safari") > -1) {
    __$sysType = "Safari";
  } else if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("msie") > -1 && !isOpera) {
    __$sysType = "IE";
  } else if (userAgent.indexOf("windows nt 6.1;") >-1 && userAgent.indexOf("trident/7.0;") > -1 && __$sysType!= "IE" ) {
    __$sysType = "IE";
  }
 
/*
  if (window.ActiveXObject)
    __$sysType = "ie";
  else
    if (document.getBoxObjectFor)
      __$sysType = "firefox";
    else 
	  if (window.MessageEvent && !document.getBoxObjectFor)
        __$sysType = "chrome";
      else 
	    if (window.opera)
          __$sysType = "opera";
        else 
		  if (window.openDatabase)
            __$sysType = "safari";
*/
}


//执行数据调用的错误号
TXmlHttp.prototype.className = "TXmlHttp";
TXmlHttp.prototype._pXmlHttp = null;
TXmlHttp.prototype.Sender = ["XmlHttpShared"]; //调用XmlHttl的调用者
TXmlHttp.prototype.AsynSender = "";            //异步调用者标识
TXmlHttp.prototype.isAsyn = false;             //异步调用,默认为同步
TXmlHttp.prototype.AsynAtt = 0;                //调用方式，由其它调用TXmlHttp的对象设置

TXmlHttp.prototype._xmlError = 0;              //HTTP请求返回代码
TXmlHttp.prototype.errorCode = 0;              //异常信息,0-无异常
TXmlHttp.prototype._lastError = "";
TXmlHttp.prototype.lastError = "";   //异常信息
TXmlHttp.prototype.returnValue = ""; // 
TXmlHttp.prototype.XmlObj = null;    //返回的XML数据对象
TXmlHttp.prototype.dataFormat = 0;   //数据格式

TXmlHttp.prototype.OnReading = null; //正在处理事件(Sender,Status)
TXmlHttp.prototype.OnSuccess = null; //数据成功下载(Sender,xmlObj)
TXmlHttp.prototype.OnError = null;   //数据下载产生异常(Sender,ErrorCode,ErrorMsg)

TXmlHttp.prototype.plPagename = __$gfile.pagelogout;
TXmlHttp.prototype.lexIconName = "";
TXmlHttp.prototype.pageId = 0;
TXmlHttp.prototype.afxUrl = "../util/";
TXmlHttp.prototype._ExcelApp = null;
TXmlHttp.prototype._aLink = null;
TXmlHttp.prototype.issubwin = false;

function TXmlHttp(){
  this.results = [];	 
  
  this.outParam = [];
  this.outResults = [];
  
  this.sqltype = 1;
  this.XmlHttps = new Array;     //异步调用时,各调用生成的个XMLHttpRequest对象
  this.CallObjs = new Array;     //通过其它对象调用TXmlHttp时，调用者集合
  this.CallAsyns = new Array;    //每个XMLHttpRequest的调用方式,true为异步调用
  this.AnalyseDatas = new Array; //是否需要分析数据,true需要
  this.AsynSenders = new Array;  //
  this.AsynAtts = new Array;     //
  
  this.callObj = null;
}

TXmlHttp.prototype.getSenderId = function(AsynSender){ 
  //alert(typeof(AsynSender));	
  if(AsynSender!=null){
    if(typeof(AsynSender)=="object")
 	  return (AsynSender[0]=="")?this.Sender[0]:AsynSender[0]+"";
    else
      return (AsynSender=="")?this.Sender[0]:AsynSender+"";
  }else 
    return this.Sender[0];
}

TXmlHttp.prototype.getAsynSender = function(AsynSender){
  if(AsynSender!=null){	 
    if(typeof(AsynSender)=="object")
	  return (AsynSender[0]=="")?this.Sender:AsynSender;
    else
      return (AsynSender=="")?this.Sender:AsynSender;
  }else
    return this.Sender;
}

TXmlHttp.prototype.getIsAsyn = function(AsynSender){
  if(AsynSender!=null){	 	
    if(typeof(AsynSender)=="object")
      return (AsynSender[0]!="");
    else
      return (AsynSender!=null&&AsynSender!=""); 	
  }else
    return false;
}

TXmlHttp.prototype._getXmlHttp = function(AsynSender,CallObj,bAnalyse,AsynAtt){

  var isAsyn = this.getIsAsyn(AsynSender);
  var Sender = this.getAsynSender(AsynSender);
  var SenderId = this.getSenderId(AsynSender);

  var pXmlHttp = isAsyn?null:this._pXmlHttp;
  
  if(typeof(this.XmlHttps[SenderId])!="undefined")
    pXmlHttp = this.XmlHttps[SenderId];
   
  if(pXmlHttp==null){	
    if(window.ActiveXObject)
      pXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    else 
    if(window.XMLHttpRequest)
      pXmlHttp = new XMLHttpRequest();
    else
     pXmlHttp = null;
  
    if(!isAsyn) this._pXmlHttp = pXmlHttp;

  }
  this.XmlHttps[SenderId] = pXmlHttp;
  this.CallObjs[SenderId] = CallObj;
  this.CallAsyns[SenderId] = isAsyn;
  this.AnalyseDatas[SenderId]= bAnalyse;
  this.AsynSenders[SenderId] = Sender;
  this.AsynAtts[SenderId] = AsynAtt;  
  return pXmlHttp;  
}

TXmlHttp.prototype.doReadyStateChange = function(SenderId){
  var oXmlHttp = this.XmlHttps[SenderId];
  var oCallObj = this.CallObjs[SenderId];
  var isAsyn = this.CallAsyns[SenderId];
  var bAnalyse = this.AnalyseDatas[SenderId]; 
  var AsynSender = this.AsynSenders[SenderId];
  var AsynAtt = this.AsynAtts[SenderId];
  
  if(this.OnReading!=null)
	this.OnReading(AsynSender,oXmlHttp.readyState);

  if(oXmlHttp.readyState==4){
	this.errorCode = -1;  
	this._xmlError = oXmlHttp.status;   
 	 
	if(oXmlHttp.status==200){
	  var xmlData = null;
	  
	  this.responseText = oXmlHttp.responseText;
      
	  if(__DEBUG) alert(this.responseText);
	  
      if(this.responseText==""){
		return;   
	  }

	  if(__$sysType == "IE"){
	    xmlData = new ActiveXObject('Msxml2.DOMDocument');
        xmlData.async = false;
        xmlData.loadXML(this.responseText);  
      } else
	    xmlData = oXmlHttp.responseXML;
	  
	  this.XmlObj = xmlData;
  
      if(bAnalyse){	
	     
        var root = xmlData.childNodes[0].childNodes[0];  
       	
        if(root.nodeName=="errors"){ //获取数据错误
		  if(this.OnError!=null)
	        this.OnError(AsynSender,200,root.childNodes[0].childNodes[0].nodeValue);
		  else
            alert(root.childNodes[0].childNodes[0].nodeValue);

          this._lastError = root.childNodes[0].childNodes[0].nodeValue;
		  this.lastError = this._lastError;
		            
        }else{
	  	   this.errorCode = 0;
		   
		   this.XmlObj = xmlData;  
		   var isNotCall = true;     //是否有自定义回调函数
		   // alert(root.nodeName);
		     
		   if(root.nodeName=="ok")	
		     this.returnValue = root.childNodes[0].childNodes[0].nodeValue;
		  	
			//	alert(this.responseText);
		   if(oCallObj!=null&&oCallObj.XmlHttpCallBack!=null){
	         oCallObj.XmlHttpCallBack(AsynSender,isAsyn,AsynAtt,xmlData,this.responseText);
		   }
		   
		   if(typeof(AsynSender)=="function"){
			 AsynSender(xmlData);
			 isNotCall = false;
		   }else
			 if(typeof(AsynSender)=="object")
			   for(var i=0;i<AsynSender.length;i++)
			     if(typeof(AsynSender[i])=="function"){
				   AsynSender[i](AsynSender,xmlData);
				   isNotCall = false;
				 }
				 
		   if(isNotCall&&oCallObj==null&&this.OnSuccess!=null)
	         this.OnSuccess(AsynSender,xmlData);
		}
	  }
	}else{
      this._lastError =	oXmlHttp.status;
	  this.lastError = this._lastError;
	  if(this.OnError!=null)
	    this.OnError(AsynSender,oXmlHttp.status,"产生异常代码:"+oXmlHttp.status);
	  else
	    alert("读取数据失败:"+oXmlHttp.status);
	}
  }
}
//整个页面读取响应
TXmlHttp.prototype.doReadyStateChange2 = function(SenderId){
  var oXmlHttp = this.XmlHttps[SenderId];
  var oCallObj = this.CallObjs[SenderId];
  var isAsyn = this.CallAsyns[SenderId];
  var bAnalyse = this.AnalyseDatas[SenderId]; 
  var AsynSender = this.AsynSenders[SenderId];
  var AsynAtt = this.AsynAtts[SenderId];
	
  if(this.OnReading!=null)
	this.OnReading(AsynSender,oXmlHttp.readyState);
	
  if(oCallObj!=null&&oCallObj.doReading!=null)
	oCallObj.doReading(AsynSender,AsynAtt,oXmlHttp.readyState);

  if(oXmlHttp.readyState==4){
	this.errorCode = -1;    
	this._xmlError = oXmlHttp.status;    
	
	if(oXmlHttp.status==200){
	  xmlData = oXmlHttp.responseText;	
	  this.responseText = xmlData;
	  
	  if(__DEBUG) alert(this.responseText);
	  	
      this.XmlObj = xmlData;		
	  if(bAnalyse){	
        this.errorCode = 0;	
		
		var isNotCall = true;     //是否有自定义回调函数
		    
		if(oCallObj!=null&&oCallObj.XmlHttpCallBack!=null)
	      oCallObj.XmlHttpCallBack(AsynSender,isAsyn,AsynAtt,xmlData,this.responseText);
				 
		if(typeof(AsynSender)=="function"){
		  AsynSender(xmlData);
		  isNotCall = false;
		}else
		  if(typeof(AsynSender)=="object")
		    for(var i=0;i<AsynSender.length;i++)
		      if(typeof(AsynSender[i])=="function"){
		 	    AsynSender[i](AsynSender,xmlData);
				isNotCall = false;
			  }
				 
		if(isNotCall&&oCallObj==null&&this.OnSuccess!=null)
	      this.OnSuccess(AsynSender,xmlData);
	  }
	}else
	  if(this.OnError!=null)
	    this.OnError(AsynSender,oXmlHttp.status,"");
	  else
	    alert("读取数据失败:"+oXmlHttp.status);
  }
}
/*存储过程调用处理*/
TXmlHttp.prototype.doReadyStateChangeProc = function(SenderId){
  var oXmlHttp = this.XmlHttps[SenderId];
  var oCallObj = this.CallObjs[SenderId];
  var isAsyn = this.CallAsyns[SenderId];
  var bAnalyse = this.AnalyseDatas[SenderId]; 
  var AsynSender = this.AsynSenders[SenderId];
  var AsynAtt = this.AsynAtts[SenderId];
  
  if(oXmlHttp.readyState==4){
	this.errorCode = -1;    
	this._xmlError = oXmlHttp.status;    
	if(oXmlHttp.status==200){
	  var xmlData = null;	
	  this.responseText = oXmlHttp.responseText;
	  
	  if(__DEBUG) alert(this.responseText);
	  
	  if(__$sysType == "IE"){
	    xmlData = new ActiveXObject('Msxml2.DOMDocument');
        xmlData.async = false;
        xmlData.loadXML(this.responseText);  
      } else
	    xmlData = oXmlHttp.responseXML;

      this.XmlObj = xmlData;
      var root = xmlData.childNodes[0].childNodes[0]; 
      var nr = 0;

      if(root.childNodes.length>1){
        var sRows = root.childNodes[1];
	    var fields = sRows.attributes;
	    nr = fields.length; 
		this.results = [];
        this.outParam = [];
        this.outResults = [];
		
	    for(var i=0;i<nr;i++){
          this.outParam[i] = fields[i].nodeName;
		  this.outResults[i] = fields[i].nodeValue;
		  this.results[i] = fields[i].nodeValue;
		}
      }
	  
      if(root.nodeName=="errors"){ //获取数据错误
        this._lastError = root.childNodes[0].childNodes[0].nodeValue;
        if(nr==0)
          this.lastError = this._lastError;
        else 
		  this.lastError = this.results[nr-1] 	
		  
		if(this.OnError!=null)
	      this.OnError(AsynSender,200,this.lastError);
		else     
          alert(this.lastError);
		this.errorCode = 1;
        return;
      }
	this.errorCode = 0;  
   }
 }
}


TXmlHttp.prototype._getDataFromServer=function(CallObj,
											   sqlid,params,fromRow,toRow,pageName,
											   dataAtt,keyCodes,fixedCol,keyFields,
											   lexIconName){
 //组装参数
 var param = "",lexicon = "";
 var dAtt = this.dataFormat,keyvs="",keyfs="",fixedC=0,cols = 1;
 this.dataFormat = 0;
 
 var useFormPost = false;   //使用窗口POST方式
 var xmlDoc = "";       //组装后的xml或参数字符串
 
 if(CallObj!=null && typeof(CallObj.useFormPost)!="undefined" && CallObj.useFormPost){
   pageName = sqlid;
   useFormPost = true; 
   cols = CallObj.columns;
   var c = "";

   if(params.length>0)
     for(var i=0;i<params.length;i++){
       xmlDoc = c+xmlDoc+params[i];
	   c = "&";
	 }
   if(fromRow>0&&toRow>0){
	  xmlDoc = xmlDoc+c+"nfrom="+fromRow+"&nto="+toRow;
	  c = "&";
   }
   
   xmlDoc = xmlDoc+c+"columns="+cols;
 }else{
   if(typeof(pageName)=="undefined"||pageName=="")
     pageName = __$gfile.dynrecords;
   if(pageName.indexOf("util/")<0)
     pageName = this.afxUrl+pageName; 
 
   var i = 0,j = 10;

   if(params.length>0)
     for(;i<params.length;i++,j++)
       param = param+" p"+j+"=\""+replaceXmlSpChar(params[i]+"")+"\"";

   if(fromRow>0&&toRow>0){
     param = param+" p"+j+"=\""+fromRow+"\"";
     param = param+" p"+(j+1)+"=\""+toRow+"\"";
   }

   if(typeof(dataAtt)!="undefined"&&dataAtt>0){
     dAtt = dataAtt;
     if(dataAtt!=6){
       if(keyCodes!=null)
         for(i=0,j=10;i<keyCodes.length;i++,j++)
           keyvs = keyvs+" p"+j+"=\""+keyCodes[i]+"\"";

       fixedC = fixedCol;
       if(keyFields!=null) 
         for(i=0,j=10;i<keyFields.length;i++,j++)
           keyfs = keyfs+" p"+j+"=\""+keyFields[i]+"\"";
     }
   }

   if(typeof(lexIconName)!="undefined") lexicon = lexIconName; 
   //组装xml文件
   xmlDoc = "<xml>\n"+
                 " <values>\n"+
                 "  <sqltype>"+this.sqltype+"</sqltype>\n"+
                 "  <sqls>"+sqlid+"</sqls>\n"+
                 "  <params"+param+"></params>\n"+
			     "  <pagesize>"+fromRow+"</pagesize>\n "+
			     "  <dataatt>"+dAtt+"</dataatt>\n"+
			     "  <lexicon>"+lexicon+"</lexicon>\n"+			   
			     "  <keyvalues"+keyvs+"></keyvalues>\n"+
			     "  <fixedcol>"+fixedC+"</fixedcol>\n"+
			     "  <keyfield"+keyfs+"></keyfield>\n"+
                 " </values>\n"+
            "</xml>";
 }
 		 
 //this.sqltype = 1;	  
 var isAsyn = this.isAsyn;
 var oXmlHttp = this._getXmlHttp(isAsyn?this.AsynSender:null,CallObj,true,this.AsynAtt);

 oXmlHttp.open("POST",pageName,isAsyn);
 
 if(useFormPost)
   oXmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");  
 else
   oXmlHttp.setRequestHeader("Content-Type","text/xml");
   
 oXmlHttp.setRequestHeader("charset","utf-8");
 
 var self = this;
 var SenderId = this.getSenderId(isAsyn?this.AsynSender:null);
 this.isAsyn = false;
 this.AsynAtt = 0;
 
 oXmlHttp.onreadystatechange = function(){
   self.doReadyStateChange(SenderId);
 }
  
 oXmlHttp.send(xmlDoc);

 if(!isAsyn&&this.errorCode==0)
   return this.XmlObj;
 else
   return null;
}

TXmlHttp.prototype._getDataFromServerEx=function(CallObj,sqlid,sparam,fromRow,toRow,pageName){
 var params = sparam.split(",");
 return this._getDataFromServer(CallObj,sqlid,params,fromRow,toRow,pageName);
}

TXmlHttp.prototype.getDataFromServer=function(CallObj,sqlid,sparam,pageName){
 return this._getDataFromServer(CallObj,sqlid,sparam,1,100000,pageName);
}


TXmlHttp.prototype.getAdoRecordset=function(CallObj,sqlid,sparam,fieldNames,fieldCounts){
 return this._getDataFromServer(CallObj,sqlid,sparam,1,100000,"",4,fieldCounts,0,fieldNames);
}

TXmlHttp.prototype.getClientXmlData=function(CallObj,sqlid,sparam,lexIconName){
 var lexIcon = "";
 if(typeof(lexIconName)!="undefined")
   lexIcon = lexIconName;
 return this._getDataFromServer(CallObj,sqlid,sparam,1,100000,"",6,null,0,null,lexIcon);
}

TXmlHttp.prototype.getTableXmlData=function(CallObj,sqlid,sparam,lexIconName){
  var lexIcon = "";
  if(typeof(lexIconName)!="undefined")
    lexIcon = lexIconName;
  var obj = this._getDataFromServer(CallObj,sqlid,sparam,1,100000,"",9,null,0,null,lexIcon);
/*  
  if(__$sysType == "IE"){
	var ieobj = new ActiveXObject('Msxml2.DOMDocument');
    ieobj.async = false;
    ieobj.loadXML(this.responseText);  
	return ieobj;
  }
*/
  return obj;
}

TXmlHttp.prototype._logout = function(pageName){
 //组装xml文件
 var xmlDoc = "<xml><values></values></xml>";
			   
 var oXmlHttp = this._getXmlHttp("",null,false,0);
 
 oXmlHttp.open("POST",pageName,false);
 oXmlHttp.setRequestHeader("Content-Type","text/xml");
 oXmlHttp.setRequestHeader("charset","utf-8");
 
 oXmlHttp.onreadystatechange = null;
 oXmlHttp.send(xmlDoc);
 return oXmlHttp.status==200;
}

TXmlHttp.prototype._getDataFromServer2=function(CallObj,sqlid,params,props,pageName){
  //组装参数
  var param = "",prop="";
  for(var i=0;i<params.length;i++)
   param = param+"p"+i+"='"+params[i]+"' ";
  
  for(var i=0;i<props.length;i++)
   prop = prop+"p"+i+"='"+props[i]+"' ";
 
  //组装xml文件
  var xmlDoc = "<xml>\n"+
                " <values>\n"+
                "  <sqltype>"+this.sqltype+"</sqltype>\n"+
                "  <sqls>"+sqlid+"</sqls>\n"+
                "  <params "+param+"></params>\n"+
                "  <props "+prop+"></props>\n"+			   
                " </values>\n"+
                "</xml>";
  this.sqltype = 1;			   

  var isAsyn = this.isAsyn;
  var oXmlHttp = this._getXmlHttp(isAsyn?this.AsynSender:null,CallObj,true,this.AsynAtt);
 
  if(pageName.indexOf("util/")<0)
    pageName = this.afxUrl+pageName; 

  oXmlHttp.open("POST",pageName,isAsyn);
  oXmlHttp.setRequestHeader("Content-Type","text/xml");
  oXmlHttp.setRequestHeader("charset","utf-8");
 
  var self = this;
  var SenderId = this.getSenderId(isAsyn?this.AsynSender:null);
 
  oXmlHttp.onreadystatechange = function(){
   //__VCL.xmlobjs[name].doReadyStateChange(isAsyn?AsynSender:sender);
    self.doReadyStateChange(SenderId);
  }
 
  oXmlHttp.send(xmlDoc);
  this.isAsyn = false;
  this.AsynAtt = 0;
  
  if(!isAsyn&&this.errorCode==0)
   return this.XmlObj;
  else
   return null;
}

TXmlHttp.prototype.doRequestInner = function(callObj,useForm,pageName,paramStr,AsynSender,bEventId,bAnalyse,bGet){
  var oXmlHttp = this._getXmlHttp(AsynSender,callObj,bAnalyse,0);

  var isAsyn = this.getIsAsyn(AsynSender);
 
  if(typeof(bGet)!="undefined"&&bGet=="GET")
    oXmlHttp.open("GET",pageName,isAsyn)
  else
    oXmlHttp.open("POST",pageName,isAsyn);
 
  if(useForm&&paramStr!="")  //form方式调用
    oXmlHttp.setRequestHeader("content-type","application/x-www-form-urlencoded");   
  else
    oXmlHttp.setRequestHeader("Content-Type","text/xml");  
	
  oXmlHttp.setRequestHeader("charset","utf-8");

  var self = this;
  var SenderId = this.getSenderId(isAsyn?AsynSender:null);
  
  switch(bEventId)
  {
	 case 0: oXmlHttp.onreadystatechange = function(){}; //不处理返回结果
     case 1: oXmlHttp.onreadystatechange = function(){   //文本处理方式
               self.doReadyStateChange2(SenderId);
             }
			 break;
	 case 2: oXmlHttp.onreadystatechange = function(){   //存储过程处理
               self.doReadyStateChangeProc(SenderId);
             }
			 break;		 
     default:oXmlHttp.onreadystatechange = function(){   //XML处理方式
               self.doReadyStateChange(SenderId);
             }
			 break;
  }
  oXmlHttp.send(paramStr);  
}
	
TXmlHttp.prototype.doRequest=function(useForm,pageName,paramStr,AsynSender,bEventId,bAnalyse,bGet){
  this.doRequestInner(null,useForm,pageName,paramStr,AsynSender,bEventId,bAnalyse,bGet);
}

TXmlHttp.prototype.requestPage=function(pageName){
  this.doRequest(false,pageName,"","",1,true,"GET");     //同步调用
  return (this._xmlError==200)?this.XmlObj:"";
}

TXmlHttp.prototype.requestObj=function(pageName){
  this.doRequest(false,pageName,"","",3,true,"GET");     //同步调用
  return (this._xmlError==200)?this.XmlObj:null;
}

TXmlHttp.prototype.requestPagePost=function(pageName,paramStr){
  this.doRequest(false,pageName,paramStr,"",1,true,"POST");     //同步调用
  return (this._xmlError==200)?this.XmlObj:"";
}

TXmlHttp.prototype.requestPagePostJsonResult=function(pageName,paramStr){
  this.doRequest(false,pageName,paramStr,"",1,true,"POST");     //同步调用
  var result = (this._xmlError==200)? 0:-1;
  if(result==0){
	this.json = JSON.parse(this.XmlObj);  
	result = parseInt(this.json.code);
	if(result!=0){
	  this.lastError = this.json.msg;	
	}else{
	  result = parseInt(this.json.sub_code);
	  if(result!=0){
	    this.lastError = this.json.sub_msg;
	  }
	}
  }
  return result; 
}

TXmlHttp.prototype.requestPageAsyn=function(pageName,AsynSender){
  this.doRequest(false,pageName,"",AsynSender,1,true);   //异步调用
}


TXmlHttp.prototype.requestPageEx=function(pageName,paramStr){
  this.doRequest(true,pageName,paramStr,"",1,true);     //同步调用
  return (this._xmlError==200)?this.XmlObj:"获取页面数据异常"+this._xmlError;
}


TXmlHttp.prototype.callPage = function(pageName,paramStr){
  //window.open(pageName);
  this.doRequest(true,pageName,paramStr,"",3,true);     //同步调用
  return this.errorCode==0;
}

TXmlHttp.prototype.callPageObj = function(callObj,pageName,paramStr){
  //window.open(pageName);
  this.doRequestInner(callObj,true,pageName,paramStr,"",3,true);     //同步调用
  return (this._xmlError==200)?this.XmlObj:null;
}

TXmlHttp.prototype.callPageInnerEx = function(callObj,pageName,paramStr,AsynSender){
  //window.open(pageName);
  this.doRequestInner(callObj,true,pageName,paramStr,AsynSender,3,true);     //异步调用
  return this.errorCode==0;
}

TXmlHttp.prototype.callPageGet=function(pageName,paramStr){
  //window.open(pageName);
  this.doRequest(true,pageName,paramStr,"",3,true,"GET");     
  return this.errorCode==0;
}

TXmlHttp.prototype.callPageByForm=function(pageName,paramStr){
  //window.open(pageName);
  this.doRequest(false,pageName,paramStr,"",3,true);     //同步调用
  return this.errorCode==0;
}

TXmlHttp.prototype.requestPageExAsyn=function(pageName,paramStr,AsynSender){
  this.doRequest(true,pageName,paramStr,AsynSender,1,true);    //异步调用
}

TXmlHttp.prototype.requestPageExA=function(pageName,paramArray,isGetUrl){
  var paramStr = paramArray.join("&");
  this.doRequest(true,pageName,paramStr,"",1,true);     
  return (typeof(isGetUrl)!="undefined"&&isGetUrl)? 
           pageName+"?"+paramArray.join("&"):(this._xmlError==200)?this.XmlObj.trim():this._xmlError;
}

TXmlHttp.prototype.requestGetUrl=function(pageName,paramArray){
  return pageName+"?"+paramArray.join("&");
}

TXmlHttp.prototype.getTimes = function(){
  var d = new Date();	
  var result =  d.getHours()+":"+
                 d.getMinutes()+":"+
				 d.getSeconds()+"."+d.getMilliseconds();
  return result;
}

TXmlHttp.prototype.pageFinishi = function(){
  if(this.pageId>0)
    this.doRequest(false,
				   "../util/"+__$gfile.pagefinishi+"?pageid="+this.pageId+"&pageetime="+this.getTimes(),
				   "","",0,false);
}

TXmlHttp.prototype.pageFinishi2 = function(pageid){
  if(parseInt(pageid)>0)
    this.doRequest(false,
				   "../util/"+__$gfile.pagefinishi.jsp+"?pageid="+pageid+"&pageetime="+this.getTimes(),
				   "","",0,false);     //同步调用
}

TXmlHttp.prototype.pageLogout=function(){
 if(this.pageId>0)
   this.doRequest(false,
				  this.afxUrl+this.plPagename+"?pageid="+this.pageId,"","",0,false);
}

TXmlHttp.prototype.login=function(pageName){
  this.doRequest(false,pageName,"","",9,true);
  result = this.errorCode==0;
  return result;
}

TXmlHttp.prototype.loginEx=function(pageName,params){
  this.doRequest(false,pageName,params,"",9,true);
  
  result = this._xmlError==0;
  if(!result)
   alert(this._lastError);
  return result;
}

TXmlHttp.prototype.getResults = function(paramName){
  var i = this.outParam.indexOf(paramName);
  if(i>-1)
    return this.outResults[i];
  else{
    alert("无效的参数名："+paramName);
    return null;
  }
}
//执行存储过程
TXmlHttp.prototype.doExecuteProc = function(pageName,sqlID,params,AsynSender){
 var param = "";
 var i = 0;
 if(params.length>0)
  for(;i<params.length;i++)
   param = param+"p"+(10+i)+"=\""+params[i]+"\" ";

 var xmlDoc = "<xml>\n"+
               " <values>\n"+
               "  <sqltype>1</sqltype>\n"+
               "  <sqls>"+sqlID+"</sqls>\n"+
               "  <params "+param+"></params>\n"+
               " </values>\n"+
               "</xml>";

 var isAsyn = this.getIsAsyn(AsynSender);
 //
 this.doRequest(false,pageName,xmlDoc,AsynSender,2,true);  //存储过程

 if(!isAsyn) return this.errorCode;
}

TXmlHttp.prototype.executeProc = function(sqlID,params){
  return this.doExecuteProc(this.afxUrl+__$gfile.executeproc,sqlID,params,""); 	
}

TXmlHttp.prototype.executeProcAsyn = function(sqlID,params,AsynSender){
  this.doExecuteProc(this.afxUrl+__$gfile.executeproc,sqlID,params,AsynSender); 	
}

//执行SQL语句
TXmlHttp.prototype.doExecuteSql = function(sqlID,params,AsynSender){
 var param = "";
 var i = 0;
 if(params.length>0)
  for(;i<params.length;i++)
   param = param+"p"+(10+i)+"=\""+params[i]+"\" ";

 var xmlDoc = "<xml>\n"+
               " <values>\n"+
               "  <sqltype>1</sqltype>\n"+
               "  <sqls>"+sqlID+"</sqls>\n"+
               "  <params "+param+"></params>\n"+
               " </values>\n"+
               "</xml>";
			   
 this.doRequest(false,this.afxUrl+__$gfile.executesql,xmlDoc,"",1,true);     //同步调用

 return this.errorCode;
}

TXmlHttp.prototype.toExcel = function(sqlID,params){
  var aLink = this._aLink;
  if(aLink==null){ 
   this._aLink = document.createElement("a");
   aLink = this._aLink;
   __VCL.bodyTag.appendChild(aLink);
  }
  //构造参数
  var param = "",plen = params.length+10;
  for(var i=10;i<plen;i++){
   if(i==10)
    param = "?p"+i+"="+escape(params[i-10]);
   else 
    param += "&p"+i+"="+escape(params[i-10]);
  }
  aLink.href = "../util/"+__$gfile.toexcel+param;  
  aLink.click();  
/*  var aLink = this._aLink;
  if(aLink==null){ 
   this._aLink = document.createElement("form");
   aLink = this._aLink;
   __VCL.bodyTag.appendChild(aLink);
   aLink.action = "../util/toexcel.jsp";
  }
  aLink.submit(); */ 
}

TXmlHttp.prototype.toFile = function(url,params){
  var aLink = this._aLink;
  if(aLink==null){ 
   this._aLink = document.createElement("a");
   aLink = this._aLink;
   __VCL.bodyTag.appendChild(aLink);
  }
  //构造参数
  var param = "",plen = params.length+10;
  for(var i=10;i<plen;i++){
   if(i==10)
    param = "?p"+i+"="+escape(params[i-10]);
   else 
    param += "&p"+i+"="+escape(params[i-10]);
  }
  aLink.href = url+param;  
  aLink.click();  
}

TXmlHttp.prototype.getSequenceValue = function(sqName){
 var xmlData = this._getDataFromServer(null,sqName,"",0,0,__$gfile.getsequencev);
 
 if(xmlData!=null){
   var root = xmlData.childNodes[0].childNodes[0]; 
   return root.childNodes[0].childNodes[0].nodeValue;
 }else
   return 0;
}
	
TXmlHttp.prototype.getSeq = function(sqName){
  return this.getSequenceValue(sqName);
}

TXmlHttp.prototype.linkTo = function(url,target){
  tr = (typeof(target)!="undefined"&&target!="")?" '_blank'":"";   
  
  if(tr==""){
    url = url + ((url.indexOf("?")<0)? "?":"&") + ((tr=="")? "wincalltype=1":"");
  }
  
  if(tr==""){
	location.href = url;  
  }else{
    var id = "__bluecdynlink";
    var aobj = document.getElementById(id);
    if(aobj==null){
      aobj = document.createElement("a");
      aobj.setAttribute("id", id);
	  document.body.appendChild(aobj);  
	}  
  	aobj.setAttribute("href", url);
    aobj.setAttribute("target", tr);
    aobj.click();
  }
/*  id = "__bluecdynlink";
  aobj = $("#"+id);
  if(aobj.length==0){
	tr = (typeof(target)!="undefined"&&target!="")?" target='_blank'":"";
	$("body").append("<a id='"+id+"'"+tr+"></a>");
	aobj = $("#"+id);
  }
  aobj[0].href = url;
  if(typeof(target)!="undefined")
    aobj[0].target = target;
  aobj[0].click();
*/
}

TXmlHttp.prototype.setSubwin = function(wincalltype){
  this.issubwin = wincalltype > 0;
  if(wincalltype==2){
    history.pushState('a', null);
    window.onpopstate = function(){
      parent._$closeWindow(__$windowcallresult);
    };
  }
}
	
TXmlHttp.prototype.closeWindow = function(){
  if(this.issubwin){
	history.back();  
  }else{
	if(__$iswx)  
      wx.closeWindow();	
	else
	  window.close();  
  }
}

//全局Microsoft.XMLHTTP对象
var __xmlHttp = new TXmlHttp();

function $doCodeCallBack(dataset,addValue){
  if(__xmlHttp.callObj!=null){
	__xmlHttp.callObj.doCodeCallBack(dataset,addValue);
  }
}

function $closeWindow(){
  __xmlHttp.callObj.closeWindow();
}
//异常函数abort
window.onerror = function(errorMsg,url,line){
  if(__xmlHttp.OnSysError!=null)
    __xmlHttp.OnSysError("异常:"+errorMsg+"\n页面:"+url+"\n行号:"+line); 
  alert("异常:"+errorMsg+"\n页面:"+url+"\n行号:"+line); 
  return true;
}

function TExpection(errNo,errMsg,action){ 
  this.errNo = errNo;
  this.errMsg = errMsg;
  if(errNo>=0)
   alert(errMsg+"["+errNo+"]");   
  //__error_url_line;
  //alert(9999);
}

function replaceXmlSpChar(s){
 var buffer = [];
 for(var i=0;i<s.length;i++)
  switch(s.charAt(i)){
    case '&': buffer.push("&amp;");
          break;
    case '<': buffer.push("&lt;");
          break;
    case '"': buffer.push("&quot;");
              break;
    default:  buffer.push(s.charAt(i));
  }
  return buffer.join("");
}

function spaceTonbsp(s){
  var buffer = [];
 for(var i=0;i<s.length;i++)
  switch(s.charAt(i)){
    case '&': buffer.push("&amp;");
          break;
    case '<': buffer.push("&lt;");
          break;
    case '"': buffer.push("&quot;");
              break;
    case ' ': buffer.push("&nbsp;");
	          break;
	case '\n':buffer.push("<br>");
	          break;
    default:  buffer.push(s.charAt(i));
  }
  return buffer.join("");
}

function _$splitCodeAndName(s,c){
 return s.substring(s.indexOf(c)+1);	
}

function _$checkBoundValue(s,bounds){
 if(s<bounds) s = bounds;
 return s;
}

function _$CBV(s,bounds){
 return _$checkBoundValue(s,bounds); 	 
}

/*日期时间处理函数*/
function _$toCMonth(pubyf){
  var nPos = pubyf.indexOf(".");
  if(nPos<0)
	 nPos = pubyf.indexOf("/"); 
  else 
	 nPos = pubyf.indexOf("-"); 
  if(nPos>0){
	  var nd = parseInt(pubyf.substring(0,nPos-1));
	  var yf = parseInt(pubyf.substring(nPos+1));
	  return nd+"年"+yf+"月";
  }else{
	  return pubyf;
  }
}

function _$toCMonth2(spubyf,epubyf){
 var result = _$toCMonth(spubyf);
 if(spubyf!=epubyf)
  result = result+"—"+_$toCMonth(epubyf);
 return result; 
}

function _$toCYear2(syear,eyear){
 var result = syear;
 if(syear!=eyear)
  result = result+"—"+eyear;
 return result; 
}

function _$getPriorYf(pubyf){
 var y = parseInt(pubyf.substring(0,4),10);
 var m = parseInt(pubyf.substring(5,8),10);
 if(m==1){
   y--;
   m=12;
 }else m--;
 var sm = (100+m)+"";
 return y+"."+sm.substring(1,3);
}

function _$getNextYf(yf){
   var n = parseInt(yf.substring(0,4),10);
   var y = parseInt(yf.substring(5,7),10);
   var r = "";
   if(y==12){
    n++;
    r = n+".01";
   }else{
    y = y+101;
	s = y+"";
    r =	n+"."+s.substring(1,3);
   }
   return r;	
}
/**/
/*格式化符点数*/
function formatFloat(sFormat,value){
  var fh="";
  var value = value+"";

  if(value!=""&&value!="0"&&value!=" "&&sFormat!=""){

    var v = parseFloat(value,10);
	
    if(v<0){
  	  v = 0 - v;
	  fh = "-";
    }else
	  if(v==0&&sFormat.indexOf("0")<0)
	    return "";

    //分析格式
    var ppos = sFormat.indexOf(".");    //格式的小数位置
    var qff = sFormat.indexOf(",");     //千分位分割符
   
    var xsws = 0;                       //小数位数
	var xss = "";                       //小数部分格式
    if(ppos>=0){
	  xss = sFormat.substring(ppos);    //含小数点
	  xsws = xss.length-1;              //不含小数点 
	}
   
    value = v.toFixed(xsws);

	var zsz = value+"";					//整数部分值
	var xsz = "";						//小数部分值
    if(xsws>0){						    //存在小数
      ppos = value.indexOf(".");
	  zsz = value.substring(0,ppos);
	  xsz = value.substring(ppos);      //含小数点
	  var n = xsws;                     //去掉小数后面的0

	  while(n>0&&xss.charCodeAt(n)==35&&xsz.charCodeAt(n)==48)
	    n--;
	  if(n<=0) xsz = "";
	  else if(n<xsws)
	         xsz = xsz.substring(0,n+1);
	}
    //alert(v+","+value+","+zsz);	
	
	if(qff>=0){							//有千分位分隔符
	  var zslen = zsz.length;			//整数部分长度
	  if(zslen>3){
		var qfgs = Math.floor(zslen/3);      //千分位整个数
		var qfys = zslen%3;
		var j = 0;
		var buffer = new Array;
		if(qfys>0){
		  buffer[j] = zsz.substring(0,qfys);
		  j++;
		}
		for(var i=0;i<qfgs;i++,qfys+=3,j++)
		  buffer[j] = zsz.substring(qfys,qfys+3);
		zsz = buffer.join(",");  
	  }
	}
	value = fh+zsz+xsz;
  }

  return value;
}

/*格式化日期时间*/
function formatDateTime(sFormat,value){
  if(value!=""&&value!=" "&&sFormat!=""){
	//分析日期  
	var right = function(v,len){
	  v = "0"+v;	
	  v = v.substring(v.length-len,v.length);
	  return v;		
	}
	
	var kg = value.indexOf(" ");
	var vrq = (kg>0)?value.substring(0,kg):value;  //日期部分
	var vsj = (kg>0)?value.substring(kg+1):"";     //时间部分
	
	var vc = (value.indexOf(".")>-1)?"." : ((value.indexOf("/")>-1)?"/" : "-");  //日期分割符号
    //分析格式
	kg = sFormat.indexOf(" ");
	var srq = (kg>0)?sFormat.substring(0,kg):sFormat;  //日期部分
	var ssj = (kg>0)?sFormat.substring(kg+1):"";     //时间部分
	var sc = (sFormat.indexOf(".")>-1)?"." : ((value.indexOf("/")>-1)?"/" : "-");  //日期分割符号
	
	value = "";
	//组合日期
	var avrq = vrq.split(vc);
	var asrq = srq.split(sc); 

	for(var i=0;i<avrq.length&&i<asrq.length;i++){
	  var v = avrq[i];	
	  if(i==0){ //处理年
	    value = (asrq[i].length>=4)?right(v,4):right(v,2);
	  }else{  //
		value += sc;
		value += (asrq[i].length>=2)?right(v,2):v;
	  }

	}

	if(vsj!=""&&ssj!=""){
	  var avsj = vsj.split(":");
	  var assj = ssj.split(":"); 
  	  for(var i=0;i<avsj.length&&i<assj.length;i++){
		var v = avsj[i];	  
	    if(i==0){ //处理时
		  value += " ";
	      value += (assj[i].length>=2)?right(v,2):v;
 	    }else{  //
		  value += ":";
		  value += (assj[i].length>=2)?right(v,2):v;
	    }
	  }
	}
  }
  return value;
}
/**其它函数*/
/**
  获取序列的下一个值
  sqName-序列名称
  返回值>0，序列值，<=0失败
 */
	
		
function getServerDateTime(){
 xmlData = __xmlHttp._getDataFromServer(null,"","",0,0,__$gfile.getservertime);
 value = "";
 if(xmlData!=null){
   var root = xmlData.childNodes[0].childNodes[0]; 
   value = root.childNodes[0].childNodes[0].nodeValue;
 }else
   value = "";
 return value;  
}

function _$addYear(year,addInc){
 return parseInt(year,10)+addInc;	
}

function _$GetBV(value,defaultValue){
 if(defaultValue==""||value.indexOf(defaultValue)==0)
  return value
 else
  return defaultValue;
}

//获取元素的纵坐标 
var _$ActiveControl = null;
var _$OffsetTop = 0,_$OffsetLeft = 0;
var _$pOffsetTop = -1,_$pOffsetLeft = -1;

function _$getScreenTop(){ 
  var obj = self;
  var n = 0;
  while(obj!=obj.parent){
	if(obj.parent._$pOffsetTop>-1)
	 n += obj.parent._$pOffsetTop;  
	else 
     n += obj._$OffsetTop;
	obj = obj.parent;
  }
  n += obj.screenTop;	
  return n;
}

function _$getScreenLeft(){ 
  var obj = self;
  var n = 0;
  while(obj!=obj.parent){
	if(obj.parent._$pOffsetLeft>-1)	 
	 n += obj.parent._$pOffsetLeft;  	
	else
     n += obj._$OffsetLeft;
	obj = obj.parent;
  }
  n += obj.screenLeft;	
  return n;
}

function _$yPosition(e){ 
  var offset=0; 
  var y = 0;
  while(e!=null){
   y = e.offsetTop;  
   offset+=y; 
   if(typeof(e.scrollTop)!="undefined")
    offset-=parseInt(e.scrollTop,10);  
   e = e.offsetParent;  
  }
  return offset; //+window.screenTop;
}

function _$xPosition(e){ 
  var offset=0; 
  var x = 0;
  while(e!=null){
   x = e.offsetLeft;  
   offset+=x; 
   if(typeof(e.scrollLeft)!="undefined")
    offset-=parseInt(e.scrollLeft,10);  
   e = e.offsetParent;  
  }
  return offset;
}

function _$xPosForParent(e,parent){ 
  var offset=0; 
  var x = 0;
  while(e!=null&&e.offsetParent!=parent){
   x = e.offsetLeft;  
   offset+=x; 
   if(typeof(e.scrollLeft)!="undefined")
    offset-=parseInt(e.scrollLeft,10);  
   e = e.offsetParent;  
  }
  return offset;
}

function _$yPosForParent(e){ 
  var offset=0; 
  var y = 0;
  while(e!=null&&e.offsetParent!=parent){
   y = e.offsetTop;  
   offset+=y; 
   if(typeof(e.scrollTop)!="undefined")
    offset-=parseInt(e.scrollTop,10);  
   e = e.offsetParent;  
  }
  return offset; //+window.screenTop;
}

function _$InitPosition(e){
  _$OffsetTop = _$yPosition(e);
  _$OffsetLeft = _$xPosition(e);
}

function _$InitPositionp(e){
  _$pOffsetTop = _$yPosition(e);
  _$pOffsetLeft = _$xPosition(e);
}

function _$ClientToSX(e){
  return _$getScreenLeft()+_$xPosition(e); 	 
}

function _$ClientToSY(e){
  return _$getScreenTop()+_$yPosition(e); 	 
}

function _$AdjustPosition(e,nw,nh){
  var pos = {};
  pos.top = pos.left = 0;
  var x = _$ClientToSX(e);
  var y = _$ClientToSY(e);  
  if(window.screen.availHeight>nh+y+e.offsetHeight+5)
   pos.top = y+e.offsetHeight+5;
  else
   pos.top = y-nh;
  pos.left = x; 
  return pos;
}

function _$GetWinSize(wMax,wOff,hMax,hOff){
  var sw = window.screen.availWidth;
  sw = ((sw-wOff)>wMax)?wMax:sw-wOff;
  var sh = window.screen.availHeight;
  sh = ((sh-hOff)>hMax)?hMax:sh-hOff;
  return [sw,sh];	
}

//求日期相差的天数
function _$DaysBetween(sDate,eDate){
  if(sDate==""||eDate=="") return 0;
  sDate = sDate.replace(/\-/g,"/");
  sDate = sDate.replace(/\./g,"/");
  eDate = eDate.replace(/\-/g,"/");
  eDate = eDate.replace(/\./g,"/");
  
  var s1 = new Date(sDate);
  var s2 = new Date(eDate);
  var days= s2.getTime()-s1.getTime(); 
  return parseInt(days/(1000*60*60*24));
}

function _$nsplit(arrays,c){
  var result = "";
  for(var i=0;i<arrays.length;i++){
    if(i>0) result = result+c;
    result = result+arrays[i];
  }
  return result;
}

function _$checkSplit(arrays,c){
  var result = "";
  var j = 0;
  for(var i=0;i<arrays.length;i++)
   if(arrays[i].checked){
    if(j>0) result = result+c;
    result = result+arrays[i].value;
	j++;
   }
  return result;
}
/*通用函数*/
__FUN = {
  _$isNumber:function(v){
    var nlen = v.length;
    var result = true;
    for(var i=0;i<nlen&&result;i++){
      var c = v.charAt(i);
      result = (c>='0')&&(c<='9');
    }
    return result;
  },

  _$isNumberAndLetter:function(v){
    var nlen = v.length;
    v = v.toUpperCase();
    var result = true;
    for(var i=0;i<nlen&&result;i++){
      var c = v.charAt(i);
      result = (c>='0'&&c<='9')||(c>='A'&&c<='Z');
    }
    return result;
  },
  
  __$IncString:function(v,dv){
	var result = dv;
	if(v != ""){
	  var nlen = v.length;
	  var f = (parseInt("1"+v,10)+1)+"";
	  result = f.substring(1);	 
	}
	return result;
  },
  
  GetRqByOff:function(rq,nOff,Att){
	  
    var c = (rq.indexOf(".")>-1)?"." : ((rq.indexOf("/")>-1)?"/" : "-");
	var ds = rq.split(c);

	var dtime = new Date(ds[0],parseInt(ds[1],10)-1,ds[2]);
	var sSq = "";

    switch(Att){
		case 0://按日
		     dtime.setDate(dtime.getDate()+nOff);
             sSq = dtime.getFullYear()+c+(dtime.getMonth()+1)+c+dtime.getDate();			 
			 break;
		case 1://按周	 
             dtime.setDate(dtime.getDate()+7*nOff);
             sSq = dtime.getFullYear()+c+(dtime.getMonth()+1)+c+dtime.getDate();			 
			 break;
		case 2://按月,按年
		case 3://因为javascript 2013-03-31减一个月变成2013-03-01,所以
		     var ny = parseInt(ds[0],10),nm = parseInt(ds[1],10),nd = parseInt(ds[2],10);
			 var n = 0;
			 if(Att==2){
			   n = nm + nOff;
			   ny = ny + Math.floor(n/12);
			   nm = n%12;
			 }else{
			   ny = ny + nOff;	 
			 }
			 if(nd>28)
			   switch(nm){
				  case  2: nd = (ny%4==0&&nd>29)?29:28;
				           break;
				  case  4:
				  case  6:
				  case  9:
				  case 11: if(nd>30) nd = 30;
			   }
			   //15991770449
		     sSq = ny+c+nm+c+nd;
			 break;
	}

    return sSq
  },
  
  GetStartRq:function(rq,Att){
	  
    var sSq,dtime,n;
    var c = (rq.indexOf(".")>-1)?"." : ((rq.indexOf("/")>-1)?"/" : "-");
	var ds = rq.split(c);
    dtime = new Date(ds[0],parseInt(ds[1])-1,ds[2]);
    switch(Att){
		case 0://本日
		       sSq = rq;
			   break;
        case 1://本周
		       n = dtime.getDay();
			   dtime.setDate(dtime.getDate()-n);
			   sSq = dtime.getFullYear()+c+(dtime.getMonth()+1)+c+dtime.getDate();
			   break;
        case 2://本月
			   sSq = dtime.getFullYear()+c+(dtime.getMonth()+1)+c+'1';
			   break;
        default:
		       sSq = dtime.getFullYear()+c+'1'+c+'1';
	}
    return sSq;
  },
  
  GetEndRq:function(rq,Att){
	  
    var sSq,dtime,n;
    var c = (rq.indexOf(".")>-1)?"." : ((rq.indexOf("/")>-1)?"/" : "-");
	var ds = rq.split(c);

    dtime = new Date(ds[0],parseInt(ds[1],10)-1,ds[2]);
    switch(Att){
		case 0://本日
		       sSq = rq;
			   break;
        case 1://本周
		       n = dtime.getDay();
			   dtime.setDate(dtime.getDate()+6-n);
			   sSq = dtime.getFullYear()+c+(dtime.getMonth()+1)+c+dtime.getDate();
			   break;
        case 2://本月
		       var ny = parseInt(ds[0],10),nm = parseInt(ds[1],10),nd = parseInt(ds[2],10);
			   dtime = new Date(ny,nm-1,1);
			   dtime.setMonth(dtime.getMonth()+1);
			   dtime.setDate(dtime.getDate()-1);
			   sSq = dtime.getFullYear()+c+(dtime.getMonth()+1)+c+dtime.getDate();
			   break;
        default:
		       sSq = dtime.getFullYear()+c+'12'+c+'31';
	}
    return sSq;
  },
  
  RandomPwd:function(){
	var pwd = Math.random()+"000000";
	return pwd.substring(2,8);	  
  },
  
  RightStr:function(value,nlen){
    result = value+"";
	n = result.length;
	if(n>nlen){
	   result = result.substring(n-nlen,n);
	}
	return result;
  },
  
  isPhhoneAvailable:function(str) {
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
	str = str.replace(/^\s+|\s+$/gm,'');
    if (!myreg.test(str)) {
      return false;
    } else {
      return true;
    }
  }
}

function _$GetRqInfo(rq,nOff,Att){
  rq = __FUN.GetRqByOff(rq,nOff,Att);	
  if(Att==0)
	return __FUN.GetStartRq(rq,0);
  else
	return __FUN.GetStartRq(rq,Att)+"-"+__FUN.GetEndRq(rq,Att);
}


if(!Array.prototype.indexOf)
 Array.prototype.indexOf = function(el){
   for(var i=0,n=this.length; i<n; i++){
	 if (this[i] === el)
	   return i;
   }
   return -1;
}

/*获取字符串字节的长度*/
function getLength(value){
 var nResult = 0;
 value = value+"";
 for(var i=0;i<value.length;i++)
   if(value.charCodeAt(i)>127)
     nResult += 2;
   else
     nResult += 1;
 return nResult;
}

if(!String.prototype.copy)
  String.prototype.copy = function(startIndex,length){
    var result = "";
    var i = 0, j = 0, nlen = this.length;
    while(i<nlen&&j<length){
      n = (this.charCodeAt(i)>127)? 2:1;
	  result += this.substr(i,1);
	  i++;
	  j += n;
    }
    return result;
  }

if(!String.prototype.copyex)
  String.prototype.copyex = function(startIndex,length){
    var result = "";
    var i = 0, j = 0, nlen = this.length;
    while(i<nlen&&j<length){
      n = (this.charCodeAt(i)>127)? 2:1;
	  result += this.substr(i,1);
	  i++;
	  j += n;
    }
    if(getLength(this)>length) result += "...";
	return result;
  }
  
function _$ObjType(obj){
  var tagName = obj.tagName;
  if(tagName=="INPUT")
    tagName = obj.type;
  return (tagName==null)? "":tagName.toUpperCase();	
}

function stringOfChar(n,c){
 var result = "";
 for(var i=0;i<n;i++)
  result += c;

 return result;
}


Date.prototype.format = function(format){ 
  var o = { 
    "M+" : this.getMonth()+1, //month 
    "d+" : this.getDate(), //day 
    "h+" : this.getHours(), //hour 
    "m+" : this.getMinutes(), //minute 
    "s+" : this.getSeconds(), //second 
    "q+" : Math.floor((this.getMonth()+3)/3), //quarter 
    "S" : this.getMilliseconds() //millisecond 
  } 

  if(/(y+)/.test(format)) { 
    format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  } 

  for(var k in o) { 
    if(new RegExp("("+ k +")").test(format)) { 
      format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
    } 
  } 
  return format; 
} 

function Now(){ 
  return (new Date()).format("yyyy-MM-dd hh:mm:ss");
}

_$ = function(ID){
  var obj = document.getElementById(ID);
  if(obj==null){
	alert("不存在对象:"+ID);  
  }
  return obj;
}

function _$v(_sId){
  var obj = document.getElementById(_sId); 
  return (obj.tagName=="INPUT"||obj.tagName=="SELECT")? obj.value:obj.innerText;
}

function _$s(_sName){
  return document.getElementsByName(_sName);
}

function _$getObj(objs,nindex){
  var result = null
  if(typeof(objs[0])=="undefined")
    result = objs;
  else
    result = objs[nindex];	

  return result;	
}

function $GetText(_sId){
  return document.getElementById(_sId).innerText;	
}

function $GetHtml(_sId){
  return document.getElementById(_sId).innerHTML;	
}

function $SetText(_sId,Value){
  document.getElementById(_sId).innerText = Value; 
}

function $SetHtml(_sId,Value){
  document.getElementById(_sId).innerHTML = Value;	
}


document.onclick = function(){
   if(typeof(parent)!="undefined"&&parent!=self&&typeof(parent.hideMainMenu)!="undefined")
      parent.hideMainMenu();	
}

function closePage(returnValue){
 if(parent!=self&&typeof(parent.closePage)!="undefined")
   parent.closePage(); 
 else{ 
   history.back(-1);
 }
}

function _$CNumToCny(n){
   var fraction = ['角', '分'];    
   var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];    
   var unit = [ ['元', '万', '亿'], ['', '拾', '佰', '仟']  ];    
   var head = n < 0? '欠': '';    
   n = Math.abs(n);    
      
   var s = '';    
      
   for (var i = 0; i < fraction.length; i++)     
   {    
      s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');    
   }    
   s = s || '整';    
   n = Math.floor(n);    
      
   for (var i = 0; i < unit[0].length && n > 0; i++)     
   {    
      var p = '';    
      for (var j = 0; j < unit[1].length && n > 0; j++)     
      {    
         p = digit[n % 10] + unit[1][j] + p;    
         n = Math.floor(n / 10);    
      }    
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零')  + unit[0][i] + s;    
   }    
   return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');    
}

function _$selectText(selectObj,opValue){
  for(var i=0;i<selectObj.options.length;i++)
    if(selectObj.options[i].value == opValue)
	  return selectObj.options[i].text;
  return ""; 	  
}

var __$showWaitingCount = 0;
//关闭等待窗口
function closeWaiting() {
  __$showWaitingCount--;
  if(__$showWaitingCount<=0){	
    var bgDiv = document.getElementById("bgBlueCToastDiv");
    var msgDiv = document.getElementById("msgBlueCToastDiv");
    //移除背景遮罩层div
    if(bgDiv != null){
        document.body.removeChild(bgDiv);
    }
    //移除中间信息提示层div    
    if(msgDiv != null){
        document.body.removeChild(msgDiv);
    }
  }
}
//显示等待窗口
function showWaiting(caption) {
  if(__$showWaitingCount<0) __$showWaitingCount = 0;	
  if(__$showWaitingCount==0){	
    var msgw, msgh, bordercolor;
    msgw = 200; //提示窗口的宽度 
    msgh = 120; //提示窗口的高度 
    bordercolor = "#336699"; //提示窗口的边框颜色 
    titlecolor = "#99CCFF"; //提示窗口的标题颜色 

    var sWidth, sHeight;
    sWidth = document.body.clientWidth;
    sHeight = document.body.clientHeight;

    //背景遮罩层div
    var bgObj = document.createElement("div");
    bgObj.setAttribute('id', 'bgBlueCToastDiv');
    bgObj.style.position = "absolute";
    bgObj.style.top = "0px";
    bgObj.style.background = "#888";
    bgObj.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75)";
    bgObj.style.opacity = "0.6";
    bgObj.style.left = "0px";
    bgObj.style.width = sWidth + "px";
    bgObj.style.height = sHeight + "px";
    document.body.appendChild(bgObj);
    
    //信息提示层div
    var msgObj = document.createElement("div");
    msgObj.setAttribute("id", "msgBlueCToastDiv");
    msgObj.setAttribute("align", "center");
    msgObj.style.position = "absolute";
    msgObj.style.background = "white";
	msgObj.style.borderRadius = "10px";
    msgObj.style.font = "12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
    msgObj.style.border = "1px solid " + bordercolor;
    msgObj.style.width = msgw + "px";
    msgObj.style.height = msgh + "px";
    msgObj.style.top = (document.documentElement.scrollTop + (sHeight - msgh) / 2) + "px";
    msgObj.style.left = (sWidth - msgw) / 2 + "px";
    document.body.appendChild(msgObj);
    
    //中间等待图标
    var img = document.createElement("img");
    img.style.margin = "15px 0px 10px 0px";
    img.style.width = "56px";
    img.style.height = "56px";
    img.setAttribute("src", "../images/waiting.gif");
    document.getElementById("msgBlueCToastDiv").appendChild(img);

    //标题栏
    var title = document.createElement("h4");
    title.setAttribute("id", "msgBlueCToastTitle");
    title.setAttribute("align", "center");
    title.style.margin = "0px";
    title.style.padding = "3px";
    //title.style.background = bordercolor;
    title.style.filter = "progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);";
    title.style.opacity = "0.75";
    //title.style.border = "1px solid " + bordercolor;
    title.style.height = "24px";
    title.style.font = "12px Verdana, Geneva, Arial, Helvetica, sans-serif";
    //title.style.color = "white";
    title.innerHTML = (typeof(caption)!="undefined")? caption:"正在加载数据，请稍候...";
    document.getElementById("msgBlueCToastDiv").appendChild(title);
  }  
  __$showWaitingCount ++;
}

var __$windowcallback = null;
var __$windowcallcount = 0;
var __$windowcallresult = {winname:"",isok:false,results:null};

function _$InnerOpenWindow(content,isurl,callback){
  var winid = "_BlueCClientWin";
  var div = document.getElementById(winid);
  var iframe = document.getElementById(winid+"Data");
  if(div == null){
    sWidth = document.body.clientWidth;
    sHeight = document.body.clientHeight;

	var div = document.createElement("div");
	div.setAttribute("id", winid);
	div.style.left = "0px";
    div.style.top = "0px";
	div.style.position = "absolute";
	div.style.zIndex = 100;
	div.style.background = "#fff";
	div.style.width = sWidth+"px";
	div.style.height = sHeight+"px";
	
	document.body.appendChild(div); 
	var iframe = document.createElement("iframe");
	
	iframe.setAttribute("id", winid+"Data");
	iframe.setAttribute("name", winid+"Data");
	iframe.setAttribute("frameborder", "0");
	iframe.setAttribute("scrolling", "auto");
	iframe.setAttribute("resizeable", "no");
	iframe.style.width = "100%";
	iframe.style.height = "100%";
	div.appendChild(iframe);
  }
  if(isurl){
	content = content + ((content.indexOf("?")<0)? "?":"&") + "wincalltype=2";   
	iframe.setAttribute("src", content);
  }else{
	iobj =  iframe.contentWindow.document || iframe.contentDocument;
    iobj.write(content);
  }
  div.style.display = "";
  __$windowcallback = (typeof(callback)!="undefined")? callback:null;
  __$windowcallcount++;
}

function _$openWindow(url,callback){
  _$InnerOpenWindow(url,true,callback);
}

function _$closeWindow(res){

  var winid = "_BlueCClientWin";
  var div = document.getElementById(winid);	
  var iframe = document.getElementById(winid+"Data");
  if(div != null){
    document.body.removeChild(div);
  }
  
  if(__$windowcallcount>0){
	__$windowcallcount --;	
	//history.back(-1);
  }
  
  if(this.__$windowcallback != null && typeof(res) != "undefined"){
    this.__$windowcallback(res);
    this.__$windowcallback = null;
  }
}

function _$gcj02tobd09(longitude, latitude){
  var result = {"lon":"","lat":""};
  var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
  var PI = 3.1415926535897932384626;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;
  
  var lon = parseFloat(longitude);  
  var lat = parseFloat(latitude);  
  var z = Math.sqrt(lon * lon + lat * lat) + 0.00002 * Math.sin(lat * Math.PI);
  var theta = Math.atan2(lat, lon) + 0.000003 * Math.cos(lon * x_PI);
  result.lon = (z * Math.cos(theta) + 0.0065).toFixed(6);
  result.lat = (z * Math.sin(theta) + 0.006).toFixed(6);
  
  return result;
}

var __$gObjFieldName = "";
var __$gObjFieldValue = null;
var __$readonly = true;

