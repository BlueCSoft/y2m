//�򿪲�������
function openAddFile(fileid){
 __$Query.open([fileid],"#CHECK_AFILE_NOTE");
 if(!__$Query.isEmpty){
   var  attr = "dialogHeight:300px;dialogWidth:462px;status:0;help:0;scroll:off;";
   if(!window.showModalDialog("../util/showafnote.jsp?fileid="+fileid,window,attr))
    return;
 }
 _$("addlink").href = "../util/filedownload.jsp?fileid="+fileid;
 _$("addlink").click();
}

//�жϵ绰����ĸ�ʽ
function _$checkTelPhoneValid(tels,nws){
 var result = true;	
 if(tels!=""){	
  var atel = tels.split("/");
  for(var i=0;result&&i<atel.length;i++){
	result = (atel[i].length==nws)&&__FUN._$isNumber(atel[i]);
  }
 }
 return result;
}