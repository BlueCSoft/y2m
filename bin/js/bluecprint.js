var __$printer = null;
function $getPrinter(noHint){
 try{
  __$printer = new ActiveXObject("BlueCWPrint.BlueCPrint");
 }catch(e){
  __$printer = null;
  if(typeof(noHint)=="undefined")
   alert("没有安装BlueC-Web打印插件.");
 }
 return __$printer!=null;
}

//封装Print方法，这样在调用时PageName后面的参数可以忽略
function $Print(docObj,PageName,nWidth,nHeight,nOrient,mLeft,mTop,mRight,mBottom){
 if($getPrinter()){
  var nw=0,nh=0,no=1,ml=-1,mt=-1,mr=-1,mb=-1;
  if(typeof(nWidth)!="undefined") nw = parseInt(nWidth,10);
  if(typeof(nHeight)!="undefined") nh = parseInt(nHeight,10);
  if(typeof(nOrient)!="undefined") no = parseInt(nOrient,10);
  if(typeof(mLeft)!="undefined") ml = parseInt(mLeft,10);  
  if(typeof(mTop)!="undefined") mt = parseInt(mTop,10);
  if(typeof(mRight)!="undefined") mr = parseInt(mRight,10);
  if(typeof(mBottom)!="undefined") mb = parseInt(mBottom,10);
  __$printer.Print(docObj,PageName,nw,nh,no,ml,mt,mr,mb);
 }
}
function $Preview(docObj,PageName,nWidth,nHeight,nOrient,mLeft,mTop,mRight,mBottom){
 if($getPrinter()){
  var nw=0,nh=0,no=1,ml=-1,mt=-1,mr=-1,mb=-1;
  if(typeof(nWidth)!="undefined") nw = parseInt(nWidth,10);
  if(typeof(nHeight)!="undefined") nh = parseInt(nHeight,10);
  if(typeof(nOrient)!="undefined") no = parseInt(nOrient,10);
  if(typeof(mLeft)!="undefined") ml = parseInt(mLeft,10);  
  if(typeof(mTop)!="undefined") mt = parseInt(mTop,10);
  if(typeof(mRight)!="undefined") mr = parseInt(mRight,10);
  if(typeof(mBottom)!="undefined") mb = parseInt(mBottom,10);
  __$printer.Preview(docObj,PageName,nw,nh,no,ml,mt,mr,mb);
 }
}

function $PrintA(htmlText,PageName,nWidth,nHeight,nOrient,mLeft,mTop,mRight,mBottom){
 if($getPrinter()){
  var nw=0,nh=0,no=1,ml=-1,mt=-1,mr=-1,mb=-1;
  if(typeof(nWidth)!="undefined") nw = parseInt(nWidth,10);
  if(typeof(nHeight)!="undefined") nh = parseInt(nHeight,10);
  if(typeof(nOrient)!="undefined") no = parseInt(nOrient,10);
  if(typeof(mLeft)!="undefined") ml = parseInt(mLeft,10);  
  if(typeof(mTop)!="undefined") mt = parseInt(mTop,10);
  if(typeof(mRight)!="undefined") mr = parseInt(mRight,10);
  if(typeof(mBottom)!="undefined") mb = parseInt(mBottom,10);
  __$printer.PrintA(htmlText,PageName,nw,nh,no,ml,mt,mr,mb);
 }
}
function $PreviewA(htmlText,PageName,nWidth,nHeight,nOrient,mLeft,mTop,mRight,mBottom){
 if($getPrinter()){
  var nw=0,nh=0,no=1,ml=-1,mt=-1,mr=-1,mb=-1;
  if(typeof(nWidth)!="undefined") nw = parseInt(nWidth,10);
  if(typeof(nHeight)!="undefined") nh = parseInt(nHeight,10);
  if(typeof(nOrient)!="undefined") no = parseInt(nOrient,10);
  if(typeof(mLeft)!="undefined") ml = parseInt(mLeft,10);  
  if(typeof(mTop)!="undefined") mt = parseInt(mTop,10);
  if(typeof(mRight)!="undefined") mr = parseInt(mRight,10);
  if(typeof(mBottom)!="undefined") mb = parseInt(mBottom,10);
  __$printer.PreviewA(htmlText,PageName,nw,nh,no,ml,mt,mr,mb);
 }
}

function $ExecWB(docObj,nCmdID, nCmdExecOpt,title,PageName,
                  nWidth,nHeight,nOrient,mLeft,mTop,mRight,mBottom){
 if($getPrinter()){
  var nw=0,nh=0,no=1,ml=-1,mt=-1,mr=-1,mb=-1;
  if(typeof(nWidth)!="undefined") nw = parseInt(nWidth,10);
  if(typeof(nHeight)!="undefined") nh = parseInt(nHeight,10);
  if(typeof(nOrient)!="undefined") no = parseInt(nOrient,10);
  if(typeof(mLeft)!="undefined") ml = parseInt(mLeft,10);  
  if(typeof(mTop)!="undefined") mt = parseInt(mTop,10);
  if(typeof(mRight)!="undefined") mr = parseInt(mRight,10);
  if(typeof(mBottom)!="undefined") mb = parseInt(mBottom,10);
  __$printer.ExecWB(docObj,nCmdID,nCmdExecOpt,title,PageName,nw,nh,no,ml,mt,mr,mb);
 }
}

function $ExecWBA(htmlText,nCmdID,nCmdExecOpt,title,PageName,
                   nWidth,nHeight,nOrient,mLeft,mTop,mRight,mBottom){
 if($getPrinter()){
  var nw=0,nh=0,no=1,ml=-1,mt=-1,mr=-1,mb=-1;
  if(typeof(nWidth)!="undefined") nw = parseInt(nWidth,10);
  if(typeof(nHeight)!="undefined") nh = parseInt(nHeight,10);
  if(typeof(nOrient)!="undefined") no = parseInt(nOrient,10);
  if(typeof(mLeft)!="undefined") ml = parseInt(mLeft,10);  
  if(typeof(mTop)!="undefined") mt = parseInt(mTop,10);
  if(typeof(mRight)!="undefined") mr = parseInt(mRight,10);
  if(typeof(mBottom)!="undefined") mb = parseInt(mBottom,10);
  __$printer.ExecWBA(htmlText,nCmdID,nCmdExecOpt,title,PageName,nw,nh,no,ml,mt,mr,mb);
 }
}    

function $ExecWBB(objWindow,url,nCmdID,nCmdExecOpt,title,PageName,
                   nWidth,nHeight,nOrient,mLeft,mTop,mRight,mBottom){
 if($getPrinter()){
  var nw=0,nh=0,no=1,ml=-1,mt=-1,mr=-1,mb=-1;
  if(typeof(nWidth)!="undefined") nw = parseInt(nWidth,10);
  if(typeof(nHeight)!="undefined") nh = parseInt(nHeight,10);
  if(typeof(nOrient)!="undefined") no = parseInt(nOrient,10);
  if(typeof(mLeft)!="undefined") ml = parseInt(mLeft,10);  
  if(typeof(mTop)!="undefined") mt = parseInt(mTop,10);
  if(typeof(mRight)!="undefined") mr = parseInt(mRight,10);
  if(typeof(mBottom)!="undefined") mb = parseInt(mBottom,10);
  __$printer.ExecWBB(objWindow,url,nCmdID,nCmdExecOpt,title,PageName,nw,nh,no,ml,mt,mr,mb);
 }
}   

function $OutToPort(TxtContent,BlankLines,Copys,sPort,sCommand){
 if($getPrinter()){
  __$printer.OutToPort(TxtContent,BlankLines,Copys,sPort,sCommand);
 }
}   

function $OutToPrint(TxtContent, BlankLines, Copys,
                       nTop,nLeft,RowHeight,FontName,FonrSize,sCommand){
 if($getPrinter()){ 
  __$printer.OutToPrint(TxtContent, BlankLines, Copys,
                        nTop,nLeft,RowHeight,FontName,FonrSize,sCommand);
 }
}   

function $StrTo(value,nLen,bAlignMent){
 value = value+"";	
 var nResult = 0,m=0,s = value;
 if(nLen>0){
  for(var i=0;i<value.length;i++){
   if(value.charCodeAt(i)>127)
    nResult += 2;
   else
    nResult += 1;
   m++; 
   if(nResult>=nLen) break;
  }
  
  if(nResult>=nLen)
   s = value.substring(0,m);
  else
   switch(bAlignMent){ 
 	case 1: s = s+formatSpaces(nLen-nResult);
 	         break;
	case 2: var nl = (nLen-nResult)/2;
	         var nr = nLen-nResult-nl;
	         s	= formatSpaces(nl)+s+formatSpaces(nr);
	         break;
	case 3: s = formatSpaces(nLen-nResult)+s;
  }
 }
 return s;
}

function $checkUpLoadFile(fileName,fileExt,nSize){
 var nResult = 1;	
 if($getPrinter(true)){	
  nResult = __$printer.upLoadFile(fileName,fileExt,nSize);	
  switch(parseInt(nResult,10)){
    case 0: alert("扩展名为"+fileExt+"的文件被限制上传.");
	         break;
    case -1:alert("上传文件的大小不能够超过"+nSize+"个字节.");
  }
 }
 return nResult>0;
}
