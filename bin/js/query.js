//��ȡ����
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
//����SQL���
function setSql(sqltype,sqls,params){
 this.sqltype = sqltype;
 this.sqls = sqls;
 this.params = params;
}
//���Ի����ݼ�
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
//�����ݼ�
function Open(){
 var xmldoc=getRecords(this.sqltype,this.sqls,this.params);
 this.Active = xmldoc!=null;
 if(this.Active)
  this.initQuery(xmldoc);
}
//�ƶ���¼
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
//�б�ѡ��ʱ
function selectColumn(fieldName){
 this.origField = fieldName;  //
}
//�ƶ���¼
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
 var recordset;        //�����
 var datasetnode;      //���ݼ��ڵ�
 var rownodes;          //�нڵ�

 var origField = "";   //��ǰѡ�е��ֶ�
 var topRow = 0;       //��������
 var isEmpty = true;
 var fieldCount;       //�ֶ���
 var recordCount;      //��¼��
 var RecNo;
 var initQuery;        //���ý����
 var setSql;
 var Open;
 var moveTo;           //�ƶ���¼��
 var First;
 var Prior;
 var Next;
 var Last;
 var selectColumn;
 var OnRecordChange;     //��¼�ƶ�ʱ����
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



