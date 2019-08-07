var __$sCap = new Array(3);
__$sCap[0] = ['零','壹','贰','叁','肆','伍','陆','柒','捌','玖'];
__$sCap[1] = ['零','一','二','三','四','五','六','七','八','九'];
__$sCap[2] = ['0','1','2','3','4','5','6','7','8','9'];

var __$dIgi = new Array(3);
__$dIgi[0] = ['仟','佰','拾','亿','仟','佰','拾','万','仟','佰','拾','元','','角','分'];
__$dIgi[1] = ['仟','佰','拾','亿','仟','佰','拾','万','仟','佰','拾','元','','角','分'];
__$dIgi[2] = ['0','亿','0','0','0','万','0','0','0','元','','角','分'];

//转变成大写金额
function __$ChangeNumToCap(eNum,bsCap){

  var k,i,j,n;
  var nStr,oStr,Yuan,pStr,bMark = false;
  var bStr=new Array(16),afxStr,Result,c;

  Result = "";
  if(eNum<0.01&&eNum>-0.01) return Result;
  if(eNum<0){
    eNum = -eNum; 
    afxStr = "负";
  }else afxStr = "";

  for(i=0;i<15;i++) bStr[i] = "";

  Result = eNum.toFixed(2)+""; //转成字符串
  k = Result.length;                 //求长度
  
  i = 15-k;                        //开始索引
  j = bsCap-1;
  pStr = __$sCap[j][0];
  n = 0;
  while(i<15){                   //求元
    c = Result.substring(n,n+1);
    if(c!="."){
     k = c.charCodeAt(0) - 48;
     bStr[i] = __$sCap[j][k];
	}
    i++;
    n++;
  }

  Yuan = "";
  nStr = "";
  oStr = "";

  for(i=0;i<13;i++)
   if(bStr[i]!=""){
     nStr = bStr[i];
     if(nStr==pStr){  
       if(i==3||i==7||i==11){
         if(Yuan!=""){
          if(oStr==pStr)
           Yuan = Yuan.substring(0,Yuan.length-1);
		  if(Yuan.substring(Yuan.length-1,Yuan.length)!="亿"||i!=7)
           Yuan = Yuan+__$dIgi[j][i];
          bMark = true;
		 } else bMark = false;
	   }else{
        if(bMark||oStr!=pStr) 
         Yuan = Yuan+pStr;
        bMark = false;
	   }
	 }else{
      if(Yuan.substring(Yuan.length-1,Yuan.length)=="亿"&&i>7)
       Yuan = Yuan+pStr
	
      Yuan = Yuan+bStr[i]+__$dIgi[j][i];
      bMark = true;
	 }
     oStr = nStr;
   }
  //alert(Yuan);	
  if(bStr[13]==pStr){  
    if(bStr[14]!=pStr){
     if(Yuan!="")
      Yuan = Yuan+pStr+bStr[14]+__$dIgi[j][14]
     else Yuan = bStr[14]+__$dIgi[j][14];
	}else
	 Yuan = Yuan+"整";    
  }else{
    Yuan = Yuan+bStr[13]+__$dIgi[j][13];
    if(bStr[14]!=pStr)
      Yuan = Yuan+bStr[14]+__$dIgi[j][14];
  }
   
  return afxStr+Yuan;
}