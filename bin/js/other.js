function maxInputLimit(sender,maxLen){
  var result = false;
  if(event.keyCode<47&&event.keyCode!=32){
    result = true;
  }else{
    result = getLength(sender.value) < maxLen;
  }
  return result;
}

function _bluec_PreviewImage(imgurl){
  _$InnerOpenWindow(
'<!DOCTYPE html>\n'+
'<head>\n'+
'<title>图片预览</title>\n'+
'<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1"/>\n'+
'<meta http-equiv="Content-Type" content="text/html; charset=gb2312">\n'+
'<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no">\n'+
'<scri'+'pt src="../js/jquery.min.js"></scri'+'pt>\n'+    
'<scri'+'pt>\n'+
'  function windowDoLoad(){\n'+
'    $("#divClient").css("height",document.documentElement.clientHeight);\n'+
'    history.pushState("a", null);\n'+
'    window.onpopstate = function(){\n'+
'      alert(9);\n'+
'      parent._$closeWindow();\n'+
'    }\n'+
'  }\n'+
'</scri'+'pt>\n'+    
'</head>\n'+                   
'<body style="maigin:0px;height:100%">\n'+ 
'<div id="divClient" style="width:100%;height:300px;overflow:auto; border:1px solid #000">\n'+
'<img src="'+imgurl+'" style="width:100%;height:auto"/>\n'+
'</div>\n'+ 
'<scri'+'pt> windowDoLoad(); </scri'+'pt>\n'+  
'</body>\n'+ 
'</html>',false);	
}