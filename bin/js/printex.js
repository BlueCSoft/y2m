var __$printer = null;
var __$OnReportPrint = null;
function $getPrinter(noHint){
 try{
  if(__$printer==null){
	var url = window.location.toString();
	var k = url.indexOf("bin/");
    url = url.substring(0,k+4);
    __$printer = new ActiveXObject("IEPrint3.BlueCPrint");
	__$printer.InitUrl(url+"util/repupload.jsp",
	 			       url+"util/repdownload.jsp");
  }
 }catch(e){
  __$printer = null;
  if(typeof(noHint)=="undefined")
   alert("没有安装打印组件或打印组件被禁止.");
 }
 return __$printer!=null;
}

function __$arrayToXml(vArray){
  if(vArray.length>0)
   for(var i=0;i<vArray.length;i++)
    xml = xml+"<p>"+replaceXmlSpChar(vArray[i]+"")+"</p>";
  return xml;  
}
  
function _arrayToXmlEx(vArray){
  var xml = "";  
  var i = 0;
  if(vArray.length>0)
   for(;i<vArray.length;i+=2)
    xml = xml+"<p a=\""+replaceXmlSpChar(vArray[i]+"")+"\">"+replaceXmlSpChar(vArray[i+1]+"")+"</p>";
  return xml;  
}

function _setFieldProperty(xmlText,fieldLabels){
  var fieldsnode = xmlText.getElementsByTagName("FIELDS");
  var rownodes = fieldsnode[0].childNodes;
  var nlen = (rownodes.length<=fieldLabels.length)?rownodes.length:fieldLabels.length;
  for(var i=0;i<nlen;i++){
   rownodes[i].setAttribute("displaylabel",fieldLabels[i]);
  }
}

function __$ReportPrintEvent(EventID,PageInfo){
  if(__$OnReportPrint != null)
     __$OnReportPrint(EventID,PageInfo);
}

function __$Print1(rpid,op,oqx,xmlText,paramText,Copys,ReportStyle,UserId){
 if($getPrinter()){
  __$printer.CallReport1(document,rpid,op,oqx,xmlText,"",
						 _arrayToXmlEx(paramText),
						 (typeof(Copys)=="undefined")? 0:Copys,
						 (typeof(ReportStyle)=="undefined")? "":ReportStyle,
						 (typeof(UserId)=="undefined")? -1:UserId);
 }
}

function __$Print1Ex(rpid,op,oqx,xmlText,fieldLabels,paramText,Copys,ReportStyle,UserId){
 if($getPrinter()){
  _setFieldProperty(xmlText,fieldLabels);	 
  __$printer.CallReport1(document,rpid,op,oqx,xmlText,"",_arrayToXmlEx(paramText),
						 (typeof(Copys)=="undefined")? 0:Copys,
						 (typeof(ReportStyle)=="undefined")? "":ReportStyle,
						 (typeof(UserId)=="undefined")? -1:UserId);
 }
}

function __$Print1x(rpid,op,oqx,xmlText,xmlTextd,paramText,Copys,ReportStyle,UserId){
 if($getPrinter()){
  __$printer.CallReport1(document,rpid,op,oqx,xmlText,xmlTextd,_arrayToXmlEx(paramText),
						 (typeof(Copys)=="undefined")? 0:Copys,
						 (typeof(ReportStyle)=="undefined")? "":ReportStyle,
						 (typeof(UserId)=="undefined")? -1:UserId);
 }
}

function __$Print1xEx(rpid,op,oqx,
					   xmlText,fieldLabels,
					   xmlTextd,fieldLabelsd,
					   paramText,Copys,ReportStyle,UserId){
 if($getPrinter()){
  _setFieldProperty(xmlText,fieldLabels);	 
  _setFieldProperty(xmlTextd,fieldLabelsd);	   
  __$printer.CallReport1(document,rpid,op,oqx,xmlText,xmlTextd,_arrayToXmlEx(paramText),
						 (typeof(Copys)=="undefined")? 0:Copys,
						 (typeof(ReportStyle)=="undefined")? "":ReportStyle,
						 (typeof(UserId)=="undefined")? -1:UserId);
 }
}

function __$Print2(rpid,op,oqx,mMeta,mData,paramText,Copys,ReportStyle,UserId){
 if($getPrinter()){
  __$printer.CallReport2(document,rpid,op,oqx,mMeta,mData,_arrayToXmlEx(paramText),
						 (typeof(Copys)=="undefined")? 0:Copys,
						 (typeof(ReportStyle)=="undefined")? "":ReportStyle,
						 (typeof(UserId)=="undefined")? -1:UserId);
 }
}

function __$Print2x(rpid,op,oqx,mMeta,mData,dMeta,dData,paramText,Copys,ReportStyle,UserId){
 if($getPrinter()){
  __$printer.CallReport2x(document,rpid,op,oqx,mMeta,mData,dMeta,dData,_arrayToXmlEx(paramText),
						 (typeof(Copys)=="undefined")? 0:Copys,
						 (typeof(ReportStyle)=="undefined")? "":ReportStyle,
						 (typeof(UserId)=="undefined")? -1:UserId);
 }
}

function __$Print3x(rpid,op,oqx,mMeta,mData,dMeta,dData,cMeta,cData,
					 paramText,Copys,ReportStyle,UserId){
 if($getPrinter()){
  __$printer.CallReport3x(document,rpid,op,oqx,mMeta,mData,dMeta,dData,cMeta,cData,
						  _arrayToXmlEx(paramText),
						 (typeof(Copys)=="undefined")? 0:Copys,
						 (typeof(ReportStyle)=="undefined")? "":ReportStyle,
						 (typeof(UserId)=="undefined")? -1:UserId);
 }
}

function __$PrintTable(rpid,op,oqx,_table,paramText,Copys,ReportStyle,UserId){
 if($getPrinter()){
  switch(_table.dDataset.length){
   case 1:__$printer.CallReport2x(document,rpid,op,oqx,_table.metaXml,_table.dataXml,
						           _table.dDataset[0].metaXml,
								   _table.dDataset[0].dataXml,
								   _arrayToXmlEx(paramText),
						           (typeof(Copys)=="undefined")? 0:Copys,
						           (typeof(ReportStyle)=="undefined")? "":ReportStyle,
						           (typeof(UserId)=="undefined")? -1:UserId);
          break;
   case 2:__$printer.CallReport3x(document,rpid,op,oqx,_table.metaXml,_table.dataXml,
						           _table.dDataset[0].metaXml,
								   _table.dDataset[0].dataXml,
								   _table.dDataset[1].metaXml,
								   _table.dDataset[1].dataXml,
								   _arrayToXmlEx(paramText),
						          (typeof(Copys)=="undefined")? 0:Copys,
						          (typeof(ReportStyle)=="undefined")? "":ReportStyle,
						          (typeof(UserId)=="undefined")? -1:UserId);
   default:
    __$printer.CallReport2(document,rpid,op,oqx,_table.metaXml,_table.dataXml,_arrayToXmlEx(paramText),
						   (typeof(Copys)=="undefined")? 0:Copys,
						          (typeof(ReportStyle)=="undefined")? "":ReportStyle,
						          (typeof(UserId)=="undefined")? -1:UserId);
  }
 }
}

function __$PrintTableEx(rpid,op,oqx,_table,global,vArrayParam,Copys,ReportStyle,UserId){

  var paramText = ["操作员号",_global.gUserCode,
				    "操作员名",_global.gUserName,
					"当前月份",_global.gPubYf,
					"当前门店号",_global.gKfCode,
					"当前门店名",_global.gKfName,
					"单位名称一",_global.gDwName1,
					"单位名称二",_global.gDwName2,
					"单位名称三",_global.gDwName3];	
 if(vArrayParam.length>0)
   for(var i=0;i<vArrayParam.length;i+=2){
    paramText[i+16] = vArrayParam[i];
	paramText[i+17] = vArrayParam[i+1];
   }
  __$PrintTable(rpid,op,oqx,_table,paramText,
						 (typeof(Copys)=="undefined")? 0:Copys,
						 (typeof(ReportStyle)=="undefined")? "":ReportStyle,
						 (typeof(UserId)=="undefined")? -1:UserId);
}

