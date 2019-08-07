 function picResult(nReault,fileafx,addpath,picFileName,attach){
   if(nReault==0){
     tabled.$set(fileafx,addpath+picFileName);
	 tabled.post();
     tabled.applyUpdate();
	 if(attach!=""&&_$(attach)!=null)
	   _$(attach).innerText = "上传成功:"+picFileName; 
   }else
     if(attach!=""&&_$(attach)!=null)
	   _$(attach).innerText = picFileName;  
 }

 function UpLoadPemFile(type,fileafx,fileid,attach){
   _$BLUECFILE.fileupload("/util/uploadfile.jsp",_$(fileid).files[0],
                          ["type",type,"fileafx",fileafx,"merchantid",table.$("MerchantId"),"attach",attach],picResult);
 }

 function ShowPemFile(note,fname){
	alert(note+"：\n"+__xmlHttp.requestPage("/util/downloadfile.aspx?fname="+fname+"&merid="+table.$("MerchantId")));
 }
 
 function UpLoadLogoFile(type,fileafx,fileid,attach,dwdm){
   var dwcode = (typeof(dwdm)=="undefined")? "m":dwdm;
   _$BLUECFILE.fileupload("/util/uploadpic.jsp",_$(fileid).files[0],
                          ["type",type,"fileafx",fileafx,"dwcode",dwcode,"merchantid",table.$("MerchantId"),"attach",attach],picResult);
						  
 }
 
 function UpLoadLogoFileEx(type,fileafx,fileid,attach,params,dwdm){
   var dwcode = (typeof(dwdm)=="undefined")? "m":dwdm;
   var vparams = ["type",type,"fileafx",fileafx,"dwcode",dwcode,"merchantid",table.$("MerchantId"),"attach",attach];
   for(var i=0;i<params.length;i+=2){
     vparams.push(params[i]);
     vparams.push(params[i+1]);
   }
   _$BLUECFILE.fileupload("/util/uploadpic.jsp",_$(fileid).files[0],vparams,picResult);
 }