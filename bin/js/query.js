//获取数据
function getRecords(sqltype,sqls,params){
 var param = "";
 if(params.length>0)
  for(var i=0;i<params.length;i++)
   param = param+"p"+i+"='"+params[i]+"' ";
 var xmlDoc = "<xml>\n"+
               " <values>\n"+
               "  <sqltype>"+sqltype+"</sqltype>\n"+
               "  <sqls>"+sqls+"</sqls>\n"+
               "  <params "+param+"></params>\n"+
               " </values>\n"+
               "</xml>";
 var oXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
 oXmlHttp.Open("POST","../util/dynrecords.jsp",false);
 oXmlHttp.setRequestHeader("Content-Type","text/xml");
 oXmlHttp.setRequestHeader("charset","utf-8");
 oXmlHttp.Send(xmlDoc);
 if(oXmlHttp.status==200)
  return oXmlHttp.responseXml;
 else return null;
}
//设置SQL语句
function setSql(sqltype,sqls,params){
 this.sqltype = sqltype;
 this.sqls = sqls;
 this.params = params;
}
//初试化数据集
function initQuery(xmlData){
 if(typeof(xmlData.recordset)=="undefined"){
  this.Style = 1;
  this.recordset = xmlData;
  this.datasetnode = xmlData.getElementsByTagName("RS");
  this.rownodes = this.datasetnode[0].childNodes;
  this.recordCount = this.rownodes.length;
  this.fieldCount = this.rownodes[0].attributes.length;
  this.isEmpty = (this.recordCount==0)||(this.rownodes[0].getAttribute("RL")=="0");
 }else{ 
  this.Style = 0;
  this.recordset = xmlData.recordset; 
  this.fieldCount = this.recordset.fields.lenght;
  this.recordCount = this.recordset.recordCount;
  this.isEmpty = (this.recordCount==0)||(this.recordset("RL").value=="0");
 }
this.RecNo = 1;
}
//打开数据集
function Open(){
 var xmldoc=getRecords(this.sqltype,this.sqls,this.params);
 this.Active = xmldoc!=null;
 if(this.Active)
  this.initQuery(xmldoc);
}
//移动记录
function moveTo(rowIndex){
 if(rowIndex<1) rowIndex = 1;
 if(rowIndex>this.recordCount) rowIndex = this.recordCount;

 if(rowIndex==this.RecNo) return; 

 this.RecNo = rowIndex;
 if(this.Style==0)
  this.recordset.absolutePosition = rowIndex;

 if(this.OnRecordChange!=null)
  this.OnRecordChange(this,this.origField);
 this.origField = "";
 return rowIndex;
}
//列被选中时
function selectColumn(fieldName){
 this.origField = fieldName;  //
}
//移动记录
function queryfirst(){
 return this.moveTo(1);	
}
function queryprior(){
 return this.moveTo(this.RecNo-1);	 	
}
function querynext(){
 return this.moveTo(this.RecNo+1);	 	
}
function querylast(){
 return this.moveTo(this.recordCount);	 	
}
function getFieldValue(fieldName){
 var Result="";
 if(this.Style==0)
  Result=this.recordset(fieldName).value;
 else{
  var row=this.rownodes[this.RecNo-1];
  Result = row.getAttribute(fieldName).toString();
 } 
 return Result;
}
function TQuery(){
 var sqltype,sqls,params;
 var Active;
 var Style;
 var recordset;        //结果集
 var datasetnode;      //数据集节点
 var rownodes;          //行节点

 var origField = "";   //当前选中的字段
 var topRow = 0;       //标题行数
 var isEmpty = true;
 var fieldCount;       //字段数
 var recordCount;      //记录数
 var RecNo;
 var initQuery;        //设置结果集
 var setSql;
 var Open;
 var moveTo;           //移动记录到
 var First;
 var Prior;
 var Next;
 var Last;
 var selectColumn;
 var OnRecordChange;     //记录移动时发生
 var getFieldValue;
}

TQuery.prototype.Active = false;
TQuery.prototype.Style = 0;
TQuery.prototype.initQuery = initQuery;
TQuery.prototype.setSql = setSql;
TQuery.prototype.Open = Open;
TQuery.prototype.moveTo = moveTo;
TQuery.prototype.First = queryfirst;
TQuery.prototype.Prior = queryprior;
TQuery.prototype.Next = querynext;
TQuery.prototype.Last = querylast;
TQuery.prototype.RecNo = 0;
TQuery.prototype.selectColumn = selectColumn;
TQuery.prototype.getFieldValue = getFieldValue;



