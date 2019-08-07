_$BLUECFILE = {
	fileupload:function(url,file,params,callback){
	  var __iXmlHttp = null;
      
	  if(_$BLUECFILE.OnStart != null)
	    _$BLUECFILE.OnStart();
	    
	  if(window.ActiveXObject)
        __iXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
      else 
		if(window.XMLHttpRequest)
          __iXmlHttp = new XMLHttpRequest();
 	  
	  var formData = new FormData();
      //添加非文件数据
	  for(var i=0;i<params.length;i+=2)
        formData.append(params[i],params[i+1]);
      if(file!=null)	
        formData.append("file1",file);
      //使用POST方法发送数据
      __iXmlHttp.open("POST",url,true);
      __iXmlHttp.send(formData)
            //返回的数据

      __iXmlHttp.onreadystatechange=function(){
        if (__iXmlHttp.readyState==4){
            if(_$BLUECFILE.OnComplete != null)
	          _$BLUECFILE.OnComplete();			
			if(__iXmlHttp.status==200){
		      var obj = __iXmlHttp.responseXML;

              callback(obj.getElementsByTagName("data")[0].getAttribute("status"),
		                   obj.getElementsByTagName("data")[0].getAttribute("fileafx"),
					           obj.getElementsByTagName("data")[0].getAttribute("addpath"),
						           obj.getElementsByTagName("data")[0].getAttribute("filename"),
							           obj.getElementsByTagName("data")[0].getAttribute("attach"));
			}else{
				alert("异常:"+__iXmlHttp.responseText);
			}
        }
	  }
    },
	
	OnStart:null,
	OnComplete:null,
	OnGetParams:null,
	
	OnSuccess:null,
	responseTable:null,
	
	callbackfun:null,
	tablepost:true,
	
    picResult:function(nReault,fileafx,addpath,picFileName,attach){
      if(nReault==0){
        if(_$BLUECFILE.responseTable != null){
          _$BLUECFILE.responseTable.$set(fileafx,addpath+picFileName);
		  if(_$BLUECFILE.tablepost)
	        _$BLUECFILE.responseTable.post();
        }
	    if(attach!=""&&_$(attach)!=null)
	      _$(attach).innerText = "上传成功:"+picFileName; 
		if(_$BLUECFILE.OnSuccess != null)
		  _$BLUECFILE.OnSuccess(fileafx,addpath+picFileName);
      }else
        if(attach!=""&&_$(attach)!=null)
	      _$(attach).innerText = picFileName;  
    },
 
    UpLoadFileDo:function(catalog,rsptable,merid,type,fileafx,fileid,attach,params,dwcode){
      var dwdm = (typeof(dwdm)=="undefined")? "m":dwcode;		
      var vparams = ["type",type,"merid",merid,"fileafx",fileafx,"attach",attach,"dwcode",dwdm];
      for(var i=0;i<params.length;i++){
        vparams.push(params[i]);
      }
      var dynparams = [];
	  
	  if(_$BLUECFILE.OnGetParams != null){
	    dynparams = _$BLUECFILE.OnGetParams(fname);
		for(var i=0;i<dynparams.length;i++){
          vparams.push(dynparams[i]);
        }	
	  }
	  
	  if(rsptable!=null) _$BLUECFILE.responseTable = rsptable;
	  
      var rspcallback = (_$BLUECFILE.callbackfun!=null)? _$BLUECFILE.callbackfun : _$BLUECFILE.picResult;
	  filename = (catalog==0)? "../util/uploadpic.jsp":"../util/uploadimg.jsp";
      _$BLUECFILE.fileupload(filename,_$(fileid).files[0],vparams,rspcallback);
	},
	
	UpLoadFile:function(rsptable,merid,type,fileafx,fileid,attach,params,dwcode){
      _$BLUECFILE.UpLoadFileDo(0,rsptable,merid,type,fileafx,fileid,attach,params,dwcode);
	},
	
	UpLoadBlueCFile:function(rsptable,merid,type,fileafx,fileid,attach,params,dwcode){
      _$BLUECFILE.UpLoadFileDo(1,rsptable,merid,type,fileafx,fileid,attach,params,dwcode);
	}
}