var __color = ["#ff0000","#0000ff","#00ff00","#eeee00","#995500","#005599","#059950","#3cc000",
               "#ff19ff","#993300","#f60000","#460000","#00aaaa"];

function __$chart_dv(value,defaultValue){
 return (value<0)?defaultValue:value;   
}

function __$NVL(value){
 return (isNaN(value)||value==""||value==null)? 0:parseFloat(value,10);
}
/*获取字符串字节的长度*/
function __$chartgetLength(value){
 var nResult = 0;
 for(var i=0;i<value.length;i++)
  if(value.charCodeAt(i)>127)
   nResult += 2;
  else
   nResult += 1;
 return nResult;
}


__pieonit=true;
__pienum=0;
   
var __olditeam=null,__oldtop,__oldtxt,__oldrec;

function moveup(iteam,top,txt,rec){
	
 if(__olditeam!=null&&__olditeam!=iteam)
  movedown(__olditeam,__oldtop,__oldtxt,__oldrec);

 __olditeam = iteam;
 __oldtop = top;
 __oldtxt = txt;
 __oldrec = rec;
 temp = eval(iteam);
 tempat = eval(top);
 temptxt = eval(txt);
 temprec = eval(rec);
 at = parseInt(temp.style.top);
 temprec.style.display = ""; 
 if (__pienum > 27)
   temptxt.style.display = "";

 if(at>(tempat-28) && __pieonit){
   __pienum++;
   temp.style.top = at-1;
   Stop=setTimeout("moveup(temp,tempat,temptxt,temprec)",10);
 }
}
   
function movedown(iteam,top,txt,rec){
 temp = eval(iteam);
 temptxt = eval(txt);
 temprec = eval(rec);
 clearTimeout(Stop);
 temp.style.top = top;
 __pienum = 0;
 temptxt.style.display = "none";
 temprec.style.display = "none";
 __olditeam=null;
}
   
function ontxt(iteam,top,txt,rec){
 temp = eval(iteam);
 temptxt = eval(txt);
 temprec = eval(rec);
 if(__pieonit){
  temp.style.top = top-28;
  temptxt.style.display = "";
  temprec.style.display = "";
 }
}
   
function movereset(over){
 __pieonit = over!=1;
}
  
function TPieChart(labelvs,values,left,top,width,height,unit){
	
  this.labelvs = labelvs;	
  this.values = values;	
  this.left = left;
  this.top = top;
  this.width = width;
  this.height = height;
  this.title = null;
  this.unit = unit;

  this.pierec = [];
  this.labels = [];
  this.piecake = [];
  this.pietxt = [];
  this.piepath = [];
  __VCL.add(this);
}

TPieChart.prototype.free = function(){
  this.pierec = null;
  this.labels = null;
  this.piecake = null;
  this.pietxt = null;
  this.piepath = null;
  this.labelvs = null;	
  this.values = null;	
  this.title = null;
}

TPieChart.prototype.createPie = function(barName){
  var allvalues=0;
  var num = this.values.length;
  var pie = new Array(num);

  for(var i=0; i<num; i++)
   allvalues += __$NVL(this.values[i]);

  var k = 0;
  for(var i=0;i<num-1;i++){
   pie[i] = __$NVL(this.values[i])/allvalues*10000/10000;
   k += pie[i];
  }
  pie[num-1] = 1-k;
  document.writeln("<v:shapetype id='Cake_3D' coordsize='21600,21600' o:spt='95' adj='11796480,5400' path='al10800,10800@0@0@2@14,10800,10800,10800,10800@3@15xe'></v:shapetype>");
    
  document.writeln("<v:shapetype id='3dtxt' coordsize='21600,21600' o:spt='136' adj='10800' path='m@7,l@8,m@5,21600l@6,21600e'>");
  document.writeln("<v:path textpathok='t' o:connecttype='custom' o:connectlocs='@9,0;@10,10800;@11,21600;@12,10800' o:connectangles='270,180,90,0'/>");
  document.writeln("<v:textpath on='t' fitshape='t'/>");
  document.writeln("<o:lock v:ext='edit' text='t' shapetype='t'/>");
  document.writeln("</v:shapetype>");
    
  document.writeln("<v:group ID='table' style='position:absolute;left:"+this.left+"px;top:"+this.top+"px;width:"+this.width + "px;height:"+this.height+ "px;' coordsize = '21000,11500'>");
  document.writeln("<v:Rect style='position:relative;left:500;top:200;width:20000;height:800'filled='false' stroked='false'>");
  document.writeln("<v:TextBox inset='0pt,0pt,0pt,0pt'>");
  document.writeln("<table width='100%' border='0' align='center' cellspacing='0'>");
  document.writeln("<tr>");
  document.writeln("<td align='center' valign='middle'><div style='font-size:14px;color:#0000aa' id='title_"+barName+"'></div></td>");
  document.writeln("</tr>");
  document.writeln("</table>");
  document.writeln("</v:TextBox>");
  document.writeln("</v:Rect> ");
  
  this.title = document.getElementById("title_"+barName);
  
  document.writeln("<v:rect id='back' style='position:relative;left:15000;top:1400;width:6000; height:" + ((num+1)*6000/11+450) + ";' fillcolor='#9cf' stroked='t' strokecolor='#0099ff'>");
  document.writeln("<v:fill rotate='t' angle='-175' focus='100%' type='gradient'/>");
  document.writeln("<v:shadow on='t' type='single' color='silver' offset='3pt,3pt'/>");
  document.writeln("</v:rect>");
    
  document.writeln("<v:Rect style='position:relative;left:15100;top:1500;width:5760;height:700' fillcolor='#000000' stroked='f' strokecolor='#000000'>");
  document.writeln("<v:TextBox inset='6pt,2pt,2pt,2pt' style='font-size:13px;'><div align='left'><font color='#ffffff'>总数:<span id='pietotal_"+barName+"'>" + allvalues.toFixed(2) +"</span>"+ this.unit + "</font></div></v:TextBox>");
  document.writeln("</v:Rect> ");
  this.totalNum = document.getElementById("pietotal_"+barName);
  for(var i=0; i<num; i++){
   document.writeln("<v:Rect id='pierec_"+barName+i + "' style='position:relative;left:15100;top:" + Math.round((i+1)*6000/11+1700) + ";width:5760;height:600;display:none' fillcolor='#efefef' strokecolor='" + __color[i%10] + "'>");
   document.writeln("<v:fill opacity='.6' color2='fill darken(118)' o:opacity2='.6' rotate='t' method='linear sigma' focus='100%' type='gradient'/>");
   document.writeln("</v:Rect>");
   document.writeln("<v:Rect style='position:relative;left:15200;top:" + Math.round((i+1)*6000/11+1800) + ";width:750;height:430' fillcolor='" + __color[i%10] + "'/>");
   document.writeln("<v:Rect style='position:relative;left:16150;top:" + Math.round((i+1)*6000/11+1770) + ";width:4400;height:480' filled='f' stroked='f'>");
   document.writeln("<v:TextBox inset='0pt,1pt,0pt,0pt' style='font-size:9pt;'><div align='left'>" + this.labelvs[i] + ":<span id='pielabel_"+barName+i+"'>" + this.values[i] + "</span></div></v:TextBox>");
   document.writeln("</v:Rect> " );
   this.pierec[i] = document.getElementById("pierec_"+barName+i);
   this.labels[i] = document.getElementById("pielabel_"+barName+i);
  }
  
  document.writeln("</v:group>");
  
  var k1 = 180;
  var k4 = 10;
    
  for(var i=0; i<num; i++){
   var k2 = 360 * pie[i]/2;
   var k3 = k1 + k2;
   
   if (k3 >= 360) k3 = k3 - 360;

   var kkk = (-11796480 * pie[i] + 5898240);
   var k5 = 3.1415926 * 2 * (180-(k3-180))/360;

   var R = this.height/2;
   var txt_x = this.left + this.height/8-30 + R + R * Math.sin(k5) * 0.7;
   var txt_y = this.top + this.height/14-39 + R + R * Math.cos(k5) * 0.7 * 0.5;

   var titlestr = "名称：" + this.labelvs[i] + "<br>数值：" + this.values[i] + this.unit +
   	               "<br>所占比例：" + Math.round(pie[i]*10000)/100  + "%"
    
   document.writeln("<div style='cursor:hand;'>");
   document.writeln("<v:shape id='piecake_" +barName+i+ "' type='#Cake_3D' title='" + titlestr + "' style='visibility:hidden;'");
   document.writeln("style='position:absolute;left:" + this.left+this.height/8 + "px;top:" + this.top+this.height/40 + "px;width:" + this.height + "px;height:" + this.height + "px;rotation:" + k3 + ";z-index:" + k4 + "'");
   document.writeln("adj='" + kkk + ",0' fillcolor='" + __color[i%10] + "' onmouseover='moveup(piecake_"+barName+i + "," + (this.top+this.height/40) + ",pietxt_" +barName+i + ",pierec_"+barName+ i + ")';"+
  				    " onmouseout='movedown(piecake_" +barName+i + "," + (this.top+this.height/40) + ",pietxt_"+barName + i + ",pierec_"+barName + i + ");'>");
   document.writeln("<v:fill opacity='60293f' color2='fill lighten(120)' o:opacity2='60293f' rotate='t' angle='-135' method='linear sigma' focus='100%' type='gradient'/>");
   document.writeln("<o:extrusion v:ext='view' on='t'backdepth='30' rotationangle='60' viewpoint='0,0'viewpointorigin='0,0' skewamt='0' lightposition='-50000,-50000' lightposition2='50000'/>");
   document.writeln("</v:shape>");
   
   document.writeln("<v:shape id='pietxt_" +barName+i + "' type='#3dtxt' style='position:absolute;left:" + txt_x + "px;top:" + txt_y + "px;z-index:20;display:none;width:50; height:18;' fillcolor='#ffffff'");
   document.writeln("onmouseover='ontxt(piecake_" +barName+i + "," + (this.top+this.height/40) + ",pietxt_" +barName + i + ",pierec_" +barName + i + ")'>");
   document.writeln("<v:fill opacity='60293f' color2='fill lighten(120)' o:opacity2='60293f' rotate='t' angle='-135' method='linear sigma' focus='100%' type='gradient'/>");
   document.writeln("<v:textpath id='piepath_" +barName+i + "' style='font-family:'宋体';v-text-kern:t' trim='t' fitpath='t' string='" + Math.round(pie[i]*10000)/100 + "%'/>");
   document.writeln("<o:extrusion v:ext='view' backdepth='8pt' on='t' lightposition='0,0' lightposition2='0,0'/>");
   document.writeln("</v:shape>");
   document.writeln("</div>");

   this.piecake[i] = document.getElementById("piecake_"+barName+i);
   this.pietxt[i] = document.getElementById("pietxt_"+barName+i);
   this.piepath[i] = document.getElementById("piepath_"+barName+i);
   
   k1 = k1+k2*2;
   if (k1 >= 360) k1 = k1-360;
   if (k1 > 180)  k4 = k4+1;
   else k4 = k4-1;

  }

 }
 
TPieChart.prototype.setTitle = function(title){
 this.title.innerHTML = title;	
}

TPieChart.prototype.dynSetValues = function(values){
  this.values = values;	
  var allvalues=0;
  var num = this.values.length;
  var pie = new Array(num);

  for(var i=0; i<num; i++){
   allvalues += __$NVL(this.values[i]);
  }
  
  var sumvalue = allvalues;
  
  if(sumvalue==0) sumvalue = 1;
  var k = 0;
  for(var i=0;i<num-1;i++){
   pie[i] = parseInt(__$NVL(this.values[i])/sumvalue*10000)/10000;
   k += pie[i];
  }
  if(allvalues==0)
   pie[num-1] = 0;
  else
   pie[num-1] = 1-k;

  this.totalNum.innerText = allvalues.toFixed(2);
  
  for(var i=0; i<num; i++){
   this.pierec[i].style.top = Math.round((i+1)*6000/11+1700);
   this.labels[i].innerText = this.values[i];
  }
  
  var k1 = 180;
  var k4 = 10;
    
  for(var i=0; i<num; i++){
   var k2 = 360 * pie[i]/2;
   var k3 = k1 + k2;
   
   if (k3 >= 360) k3 = k3 - 360;

   var kkk = (-11796480 * pie[i] + 5898240);
   var k5 = 3.1414926 * 2 * (180-(k3-180))/360;
   
   var R = this.height/2;
   var txt_x = this.left + this.height/8-30 + R + R * Math.sin(k5) * 0.7;
   var txt_y = this.top + this.height/14-39 + R + R * Math.cos(k5) * 0.7 * 0.5;

   var titlestr = "名称：" + this.labelvs[i] + "\n数值：" + this.values[i] + this.unit +
   	               "\n比例：" + Math.round(pie[i]*10000)/100  + "%"
    
   this.piecake[i].title = titlestr;
   this.piecake[i].style.left = this.left+this.height/8;
   this.piecake[i].style.top = this.top+this.height/40;
   this.piecake[i].style.rotation = k3;
   this.piecake[i].style.zIndex = k4;
   this.piecake[i].adj.value = kkk+",0";
   
   this.piecake[i].style.visibility = (k2>0)?"":"hidden";

   this.pietxt[i].style.left = __$chart_dv(txt_x,0);
   
   this.pietxt[i].style.top = __$chart_dv(txt_y,0);

   this.piepath[i].string = Math.round(pie[i]*10000)/100+"%";
   
   k1 = k1+k2*2;
   if (k1 >= 360) k1 = k1-360;
   if (k1 > 180)  k4 = k4+1;
   else k4 = k4-1;

  }

 }
   


function calAxisUnit(value){
 var result = 0;	
 var tvalue = value;
 if(value>0){
  var fbit = parseInt(String(value).substring(0,1),10);
  var n = 0;
  while(value>=10){
   n++;
   value = value/10;
  }
  result = fbit*Math.pow(10,n);
  if(result<tvalue)
   result = (fbit+1)*Math.pow(10,n);
 }

 return (result<=0)?1:result;
}

//标题对象
function TChartTitle(ownerChart){
 this.owner = ownerChart;
 this.caption = null;
}

TChartTitle.prototype.free = function(){ 
 this.caption = null; 	 
}

//坐标对象
function TAxis(ownerChart,nCount){
  this.owner = ownerChart; 	
  this.line1 = new Array(nCount);
  this.line2 = new Array(nCount);
  this.line3 = new Array(nCount);
  this.label = new Array(nCount);
  this.labelValue = new Array(nCount);  
  this.lineColor = "#aaaaaa";
}

TAxis.prototype.free = function(){
  this.line1 = null;
  this.line2 = null;
  this.line3 = null;
  this.label = null;
  this.labelValue = null;  
}

//节点对象
function TChartNode(ownerChart,gCount){
  this.owner = ownerChart; 		 
  this.bars = new Array(gCount);
  this.values = new Array(gCount);	
  this.scaleValues = new Array(gCount);	
  this.colors = new Array(gCount);	
  this.lines = new Array(gCount);	
  for(var i=0;i<gCount;i++) 
   this.colors[i] = "#ab843d";
}

TChartNode.prototype.free = function(){
  this.bars = null;	 
  this.values = null;	
  this.scaleValues = null;	
  this.colors = null;
  this.lines = null;
}

//水平直方图
function TChart(barStyle,left,top,width,height,vCount,gCount){
  this.title = new TChartTitle(this);
  this.barStyle = barStyle;
  this.left = left;
  this.top = top;
  this.width = width;
  this.height = height;
  
  this.vCount = vCount;                  //值的最大个数
  this.gCount = gCount;                  //组数
  
  this.axisCount = 10;                   //x坐标点数
  this.xAxis = new TAxis(this,this.axisCount);
  
  this.yAxis = new TAxis(this,vCount);
						 
  this.totalValue = new Array(gCount);  //总合计值
  this.maxValue = new Array(gCount);
  this.minValue = new Array(gCount);  
  
  this.allmaxValue = 0;
  this.chartNode = new Array(vCount);  
  
  for(var i=0;i<vCount;i++)
   this.chartNode[i] = new TChartNode(this,gCount);
    
  this.axisRUnit = 1;
  this.axisUnit = 1;
  this.titleHeight = 40;                 //标题行高度 
  
  this.xMargin = 64;
  this.yMargin = 64;
  this.barWidth = 30;
  this.barMargin = 20;
  this.axisMargin = 10;
  
  this.labelMaxWidth = 0;                //标签最大宽度
  this.valueMaxWidth = 80;                //值最大宽度
  
  this.legendValue = null;
  this.legendPos = "bottom";
  this.legendWidth = 100;
  __VCL.add(this);

}

TChart.prototype.free = function(){
  this.totalValue = null;
  this.maxValue = null;
  this.minValue = null;
  this.xAxis.free();
  this.xAxis = null;
  this.yAxis.free();
  this.yAxis = null;

  for(var i=0;i<this.vCount;i++){
   this.chartNode[i].free();
   this.chartNode[i] = null;
  }
  this.title.free();
  this.title = null;
  
  this.legendValue = null;
}

TChart.prototype.setLabels = function(labels){
  var nCount = labels.length;
  if(nCount>this.vCount) nCount = this.vCount;
  
  var maxm = 0,nLen = 0;
  
  var obj = this.yAxis.label;
  var yLabelValue = this.yAxis.labelValue;

  for(var i=0;i<nCount;i++){
   nLen = __$chartgetLength(String(labels[i]))*8;
   if(nLen>maxm) maxm = nLen;
   yLabelValue[i].innerText = labels[i];
  }

  this.labelMaxWidth = maxm;
}

TChart.prototype.setValues = function(values){
  var nCount = values.length;
  if(nCount>this.vCount) nCount = this.vCount;
 
  var obj = this.chartNode;
  var totalValue = 0,nv = 0,maxv = 0,nLen = 0,maxl = 0;
  for(var i=0;i<nCount;i++){
   nv = __$NVL(values[i]); 
   totalValue += nv;
   
   obj[i].values[0] = nv;
   if(nv>maxv) maxv = nv;
   
   nLen = String(values[i]).length*8;
   if(nLen>maxl) maxl = nLen;
  }
   
  this.totalValue[0] = totalValue;  
  this.maxValue[0] = maxv;
  this.allmaxValue = maxv;
  
  //this.valueMaxWidth = maxv;
  
  for(var i=0;i<nCount;i++)
   obj[i].scaleValues[0] = 	 obj[i].values[0]/totalValue; 
   
  return nCount; 
}

TChart.prototype.setTitle = function(title){
 this.title.caption.innerHTML = title;	
}

TChart.prototype.setValuesEx = function(vvalues){
  var nCount = vvalues[0].length;
  if(nCount>this.vCount) nCount = this.vCount;
 
  var obj = this.chartNode;
  var nv = 0,maxv = 0,nLen = 0,maxl = 0;
  this.allmaxValue = 0;
  
  for(var j=0;j<vvalues.length;j++){
   var totalValue = 0;  
   for(var i=0;i<nCount;i++){
    nv = __$NVL(vvalues[j][i]); 
    totalValue += nv;
   
    obj[i].values[j] = nv;
    if(nv>maxv) maxv = nv;
   
    nLen = String(nv).length*8;
    if(nLen>maxl) maxl = nLen;
   }
   
   this.totalValue[j] = totalValue;  
   this.maxValue[j] = maxv;
   
   if(this.allmaxValue<maxv)
    this.allmaxValue = maxv;
  
   for(var i=0;i<nCount;i++)
    obj[i].scaleValues[j] = 	 obj[i].values[j]/totalValue; 
  }
  return nCount;  
}


TChart.prototype.dynSetBarValues = function(values){
	
  var vCount = 0;
  if(typeof(values[0])=="object")
   vCount = this.setValuesEx(values);  
  else
   vCount = this.setValues(values);
  
  var isBar = this.barStyle=="bar";
  
  var a = this.height-this.titleHeight-this.yMargin-10;
  
  if(isBar) a -= this.axisMargin;
  
  this.axisRUnit = Math.floor(a/this.axisCount);  //x坐标点距离
  this.axisUnit = calAxisUnit(this.allmaxValue/this.axisCount);
 
  var gCount = this.gCount;
  
  a = this.width-this.xMargin-15;
  if(isBar) a -= this.axisMargin;
  
  var nodeMargin = Math.floor(a/vCount);
  this.barMargin = nodeMargin/3;
  this.barMargin = this.barMargin<1?1:this.barMargin;
  
  this.barWidth = (nodeMargin-this.barMargin)/gCount;

  var x = this.xMargin;
  var lw = nodeMargin-this.barMargin;
  var x1 = this.width;
  var w = this.width-x;
  var y = this.yMargin;
  var t = this.titleHeight-3;
  var y1 = this.height-y;
  var h = this.height-t-y;
  var am = this.axisMargin;
  var ym = am+t;
  
  var xLabelValue = this.xAxis.labelValue;
  
  b = this.axisUnit;
  
  for(var i=0;i<this.axisCount;i++){
   xLabelValue[i].innerText = b;
   b += this.axisUnit;
  }
  
  var yLine1 = this.yAxis.line1;
  var yLine2 = this.yAxis.line2;
  var yLine3 = this.yAxis.line3;
  var yLabel = this.yAxis.label;
  
  a = x+15;
  b = this.barWidth;
  b2 = (nodeMargin-this.barMargin)/2;
  v = 0;
  var ox=[],oy=[],nx,ny;
  
  for(var i=0;i<vCount;i++){
   var obj = this.chartNode[i];	  
   var al = a;
   for(var j=0;j<gCount;j++){	 
    var v = obj.values[j]/this.axisUnit*this.axisRUnit; 

    if(isBar){
     obj.bars[j].style.left = al;
 	 obj.bars[j].style.top = y1-v;
 	 obj.bars[j].style.width = b-1;
	 obj.bars[j].style.height = v;
	}else{
     nx = a+b2;
	 ny = y1-v;
     obj.bars[j].style.left = nx-3;
 	 obj.bars[j].style.top = ny-3;
	 if(i>0){
	  obj.lines[j].from = ox[j]+","+oy[j];
	  obj.lines[j].to = nx+","+ny;
	  obj.lines[j].style.visibility = "";
	 }
     ox[j] = nx;
	 oy[j] = ny;
	}
    obj.bars[j].style.visibility = "";
	obj.bars[j].title = obj.values[j];
    al += b;
   }
   
   cp = a+b2;
   yLine1[i].from = cp+","+y1;
   yLine1[i].to = cp+","+(y1+5);
   yLine1[i].style.visibility = "";

   if(!isBar){
    yLine3[i].from = cp+","+t;
    yLine3[i].to = cp+","+y1;
    yLine3[i].style.visibility = "";
   }
   
   yLabel[i].style.left = a;
   yLabel[i].style.top = y1+5;
   yLabel[i].style.width = lw;
   yLabel[i].style.visibility = "";
   
   a +=nodeMargin;
  }
  for(var i=vCount;i<this.vCount;i++){
   var obj = this.chartNode[i];	  
   for(var j=0;j<gCount;j++){	 
    if(!isBar&&i>0)
	 obj.lines[j].style.visibility = "hidden";
    obj.bars[j].style.visibility = "hidden";
   }
   
   yLine1[i].style.visibility = "hidden";

   if(!isBar)
    yLine3[i].style.visibility = "hidden";
   yLabel[i].style.visibility = "hidden";
  }  
}

TChart.prototype.createBar = function(barID,leftCaption){

  //this.xMargin = this.valueMaxWidth;
  var isBar = this.barStyle=="bar";
  
  var a = this.height-this.titleHeight-this.yMargin-10;
  
  if(isBar) a -= this.axisMargin;
  
  this.axisRUnit = Math.floor(a/this.axisCount);  //x坐标点距离

  var vCount = this.vCount;
  var gCount = this.gCount;
  
  var barColor = [];
  if(gCount==1) barColor = [__color];
  else
   for(var j=0;j<gCount;j++){
	barColor[j] = new Array(vCount);
	for(var i=0;i<vCount;i++)
	 barColor[j][i] = __color[j];
   }
   
  a = this.width-this.xMargin-15;
  if(isBar) a -= this.axisMargin;

  var nodeMargin = Math.floor(a/vCount);
  this.barMargin = nodeMargin/3;
  this.barMargin = this.barMargin<1?1:this.barMargin;
  
  this.barWidth = (nodeMargin-this.barMargin)/gCount;

  var x = this.xMargin;
  var lw = nodeMargin-this.barMargin;
  var x1 = this.width;
  var w = this.width-x;
  var y = this.yMargin;
  var t = this.titleHeight-3;
  var y1 = this.height-y;
  var h = this.height-t-y;
  var am = this.axisMargin;
  var ym = am+t;
  
  var DLC = "#aaaaaa";

  document.write("<v:group ID='"+barID+"' style='position:relative;left:"+this.left+"px;top:"+this.top+"px;"+
			  " width:"+this.width+"px;height:"+this.height+"px' coordsize = '"+this.width+","+this.height+"'>");
  
  document.writeln("<v:Rect style='left:0px;top:0px;width:"+
				     this.width+"px;height:"+this.titleHeight+"px' filled='false' stroked='false'>");
  document.writeln("<v:TextBox inset='0pt,0pt,0pt,0pt'>");
  document.writeln("<table width='100%' height='100%' border='0' align='center' cellspacing='0'>");
  document.writeln("<tr>");
  document.writeln("<td align='center' valign='middle' style='font-size:14px;color:#0000aa' id='title_"+barID+"'>统计图</td>");
  document.writeln("</tr>");
  document.writeln("</table>");
  document.writeln("</v:TextBox>");
  document.writeln("</v:Rect> ");

  this.title.caption = document.getElementById("title_"+barID);


  if(isBar){
   document.write("<v:PolyLine filled='T' FillColor='#ddddff' Points='"+x+","+ym+","+x+" "+y1+","+(x1-am)+" "+y1+","+
 				  x1+" "+(y1-am)+","+x1+" "+t+","+
				  (x+am)+" "+t+","+x+" "+ym+"' style='z-index:-2'>");
   document.write("<v:fill rotate='t' angle='-45' focus='100%' type='gradient'/></v:rect>");   
   document.write("</v:PolyLine>");
  
   document.write("<v:line alt='' style='z-index:-1' from='"+(x+am)+","+t+"' to='"+(x+am)+","+(y1-am)+"' strokecolor='"+DLC+"'/>");
   document.write("<v:line alt='' style='z-index:-1' from='"+(x+am)+","+(y1-am)+"' to='"+x1+","+(y1-am)+"' strokecolor='"+DLC+"'/>");
   document.write("<v:line alt='' style='z-index:-1' from='"+x+","+y1+"' to='"+(x+am)+","+(y1-am)+"' strokecolor='"+DLC+"'/>");
  }else{
   document.write("<v:PolyLine filled='T' FillColor='#ddddff' Points='"+x+","+t+","+x+" "+y1+","+x1+" "+y1+","+
 				  x1+" "+t+","+x+" "+t+"' style='z-index:-2'>");
   document.write("<v:fill rotate='t' angle='-45' focus='100%' type='gradient'/></v:rect>");   
   document.write("</v:PolyLine>");
  }
  
  document.writeln("<span style='position:absolute;z-index:10;color:#0000aa;text-align:center;font-size:12px;left:0px;top:"+t+"px;filter:progid:DXImageTransform.Microsoft.BasicImage(Rotation=3);height:1px;width:"+(y1-t)+"px'>");         
  document.writeln(leftCaption);   
  document.writeln("</span>");    
  
  var xLine1 = this.xAxis.line1;
  var xLine2 = this.xAxis.line2;
  var xLine3 = this.xAxis.line3;
  var xLabel = this.xAxis.label;
  var xLabelValue = this.xAxis.labelValue;
  
  a = y1-this.axisRUnit;
  var bid;
  
  for(var i=0;i<this.axisCount;i++){
   bid = barID+i;	   
   if(isBar){
    document.write("<v:line id='xline1_"+bid+"' style='z-index:-1' from='"+(x-5)+","+a+"' to='"+x+","+a+"' strokecolor='"+DLC+"'/>");
    document.write("<v:line id='xline2_"+bid+"' style='z-index:-1' from='"+x+","+a+"' to='"+(x+am)+","+(a-am)+"' strokecolor='"+DLC+"'>");
    document.write("<v:stroke dashstyle='ShortDash'/></v:line>");
    document.write("<v:line  id='xline3_"+bid+"' style='z-index:-1' from='"+(x+am)+","+(a-am)+"' to='"+x1+","+(a-am)+"' strokecolor='"+DLC+"'>");
    document.write("<v:stroke dashstyle='ShortDash'/></v:line>");
   }else{
    document.write("<v:line id='xline1_"+bid+"' style='z-index:-1' from='"+(x-5)+","+a+"' to='"+x+","+a+"' strokecolor='"+DLC+"'/>");
    document.write("<v:line  id='xline3_"+bid+"' style='z-index:-1' from='"+x+","+a+"' to='"+x1+","+a+"' strokecolor='"+DLC+"'>");
    document.write("<v:stroke dashstyle='ShortDash'/></v:line>");
   }
   
   document.write("<v:shape id='xLabel_"+bid+"' style='left:0px;top:"+(a-am)+"px;width:"+(x-3)+"px;height:18px;z-index:1'>");
   document.write("<v:textbox inset='0px,0px,0px,0px'>");
   document.write(" <table cellspacing='3' cellpadding='0' width='100%' height='100%'>");
   document.write("  <tr><td align='right' id='xLabelv_"+bid+"'>"+i+"</td></tr></table>");  //刻度的值
   document.write("</v:textbox></v:shape>");
   
   xLine1[i] = document.getElementById("xline1_"+bid);
   if(isBar)
    xLine2[i] = document.getElementById("xline2_"+bid);
	
   xLine3[i] = document.getElementById("xline3_"+bid);
   xLabel[i] = document.getElementById("xLabel_"+bid);
   xLabelValue[i] = document.getElementById("xLabelv_"+bid);
   a -= this.axisRUnit;
  }
  
  var yLine1 = this.yAxis.line1;
  var yLine2 = this.yAxis.line2;
  var yLine3 = this.yAxis.line3;
  var yLabel = this.yAxis.label;
  var yLabelValue = this.yAxis.labelValue;
  
  a = x+15;
  b = this.barWidth;
  b2 = (nodeMargin-this.barMargin)/2;
  v = 0;
  var ox=[],oy=[],nx,ny;
  
  for(var i=0;i<vCount;i++){
   var obj = this.chartNode[i];	  
   var al = a;
   
   bid = bid+i;
   cp = a+b2;
   //document.write("<v:line alt='' style='z-index:1' from='"+(a+b2)+","+t+"' to='"+(a+b2)+","+y1+"' strokeWeight='1px' strokecolor='"+DLC+"'>");
   //document.write("<v:stroke dashstyle='ShortDash'/></v:line>");
   document.write("<v:line id='yLine_1"+bid+"' style='visibility:hidden;z-index:1' from='"+cp+","+y1+"' to='"+cp+","+(y1+5)+"' strokeWeight='1px' strokecolor='"+DLC+"'/>");
   yLine1[i] = document.getElementById("yLine_1"+bid);   
   if(!isBar){
    document.write("<v:line id='yLine_3"+bid+"' style='visibility:hidden;z-index:1' from='"+cp+","+t+"' to='"+cp+","+y1+"' strokeWeight='1px' strokecolor='"+DLC+"'>");
	document.write("<v:stroke dashstyle='ShortDash'/></v:line>");
    yLine3[i] = document.getElementById("yLine_3"+bid);   
   }
   
   for(var j=0;j<gCount;j++){	 
    bid = barID+i*1000+j;
	if(isBar){
     document.write("<v:rect id='barh_"+bid+"' style='visibility:hidden;left:"+al+"px;top:"+(y1-10)+"px;width:"+(b-1)+
   			        "px;height:5px;z-index:1' fillcolor='"+barColor[j][i]+"'>");
     document.write("<v:fill color2='#d1ffd1' rotate='t' type='gradient'/>");
     document.write("<o:extrusion v:ext='view' backdepth='20pt' color='"+barColor[j][i]+"' on='t'/>");
     document.write("</v:rect>");
	}else{
     nx = a+b2-3;
	 ny = y1-10;
     document.write("<v:rect id='barh_"+bid+"' style='visibility:hidden;left:"+nx+"px;top:"+ny+
					"px;width:6px;height:6px;z-index:2' fillcolor='"+barColor[j][i]+"'/>");		
     if(i>0){
	  document.write("<v:line id='line"+bid+"' style='visibility:hidden;z-index:1' from='"+ox[j]+","+oy[j]+
					 "' to='"+nx+","+ny+"' strokeWeight='1px' strokecolor='"+__color[j]+"'/>");	 
	  obj.lines[j] = document.getElementById("line"+bid); 
	 }
     ox[j] = nx;
     oy[j] = ny;
	}
    obj.bars[j] = document.getElementById("barh_"+bid);
	al += b;
   }
   
   document.write("<v:shape alt='' id='yAxis_"+bid+"' style='visibility:hidden;left:"+a+"px;top:"+(y1+5)+"px;width:"+lw+"px;z-index:1'>");
   document.write("   <v:textbox inset='0px,0px,0px,0px'>");
   document.write("     <table cellspacing='3' cellpadding='0' width='100%' height='100%'>");
   document.write("	   <tr><td align='center' valign='top' id='ylabel_"+bid+"'></td></tr></table>");
   document.write("   </v:textbox>");
   document.write("</v:shape>"); 
   
   yLabel[i] = document.getElementById("yAxis_"+bid);   
   yLabelValue[i] = document.getElementById("ylabel_"+bid);   
   a +=nodeMargin;
  }

  if(gCount>1)
   if(this.legendPos=="bottom"){
    document.write("<v:shape style='left:0px;top:"+(this.height-25)+"px;height:25px;width:"+this.width+"px;z-index:1'>");
    document.write("<table cellspacing='0' cellpadding='0' width='100%' height='100%'><tr><td align='center'>");
    document.write("<table cellspacing='3' cellpadding='0' style='border:1px solid #555555'><tr height='15'>");
    for(var j=0;j<gCount;j++)
	 document.write("<td width='30' bgcolor='"+__color[j]+"'></td><td align='left'>"+this.legendValue[j]+"&nbsp;&nbsp;</td>");  
    document.write("</tr></table>");	
    document.write("</td></tr></table>");
    document.write("</v:shape>"); 
   }else{
    document.write("<v:shape style='left:"+(x1+3)+"px;top:"+t+"px;height:"+(y1-t)+"px;width:"+this.legendWidth+"px;z-index:1'>");
    document.write("<table cellspacing='0' cellpadding='0'><tr><td align='center'>");
    document.write("<table cellspacing='3' cellpadding='0' style='border:1px solid #555555'>");
    for(var j=0;j<gCount;j++)
	 document.write("<tr height='15'><td width='30' bgcolor='"+__color[j]+"'></td><td align='left'><nobr>"+this.legendValue[j]+"</nobr></td></tr>");  
    document.write("</table>");	
    document.write("</td></tr></table>");
    document.write("</v:shape>"); 
   }
  document.write("</v:group>"); 
}


TChart.prototype.dynSetHorBarValues = function(values){
  var vCount = 0;
  if(typeof(values[0])=="object")
   vCount = this.setValuesEx(values);  
  else
   vCount = this.setValues(values);

  var isBar = this.barStyle=="bar";
  
  var a = this.width-this.xMargin-10;
  
  if(isBar) a -= this.axisMargin;
  
  this.axisRUnit = Math.floor(a/this.axisCount);  //x坐标点距离
  this.axisUnit = calAxisUnit(this.allmaxValue/this.axisCount);
 
  var gCount = this.gCount;
  
  a = this.height-this.yMargin-this.titleHeight-15;
  if(isBar) a -= this.axisMargin;
  
  var nodeMargin = Math.floor(a/vCount);
  this.barMargin = nodeMargin/3;
  this.barMargin = this.barMargin<1?1:this.barMargin;
  
  this.barWidth = (nodeMargin-this.barMargin)/gCount;

  var x = this.xMargin;
  var lw = nodeMargin-this.barMargin;
  var x1 = this.width;
  var w = this.width-x;
  var y = this.yMargin;
  var t = this.titleHeight-3;
  var y1 = this.height-y;
  var h = this.height-t-y;
  var am = this.axisMargin;
  var ym = am+t;
  
  var xLabelValue = this.xAxis.labelValue;
  
  b = this.axisUnit;
  
  for(var i=0;i<this.axisCount;i++){
   xLabelValue[i].innerText = b;
   b += this.axisUnit;
  }
  
  var yLine1 = this.yAxis.line1;
  var yLine2 = this.yAxis.line2;
  var yLine3 = this.yAxis.line3;
  var yLabel = this.yAxis.label;
  
  a = y1-15;
  b = this.barWidth;
  b2 = (nodeMargin-this.barMargin)/2;
  v = 0;
  var ox=[],oy=[],nx,ny;
  
  for(var i=0;i<vCount;i++){
   var obj = this.chartNode[i];	  
   var al = a;

   for(var j=0;j<gCount;j++){	 
    var v = obj.values[j]/this.axisUnit*this.axisRUnit; 

    if(isBar){
 	 obj.bars[j].style.top = al-b;
 	 obj.bars[j].style.width = v;
	}else{
     nx = x+v;
	 ny = a-b2-3;
     obj.bars[j].style.left = nx+3;
 	 obj.bars[j].style.top = ny-3;
	 if(i>0){
	  obj.lines[j].from = ox[j]+","+oy[j];
	  obj.lines[j].to = nx+","+ny;
	  obj.lines[j].style.visibility = "";
	 }
     ox[j] = nx;
	 oy[j] = ny;
	}
    obj.bars[j].style.visibility = "";
	obj.bars[j].title = obj.values[j];
	al -= b;
   }
   
   cp = a-b2;
   yLine1[i].from = (x-5)+","+cp;
   yLine1[i].to = x+","+cp;
   yLine1[i].style.visibility = "";

   if(!isBar){
    yLine3[i].from = x+","+cp;
    yLine3[i].to = x1+","+cp;
    yLine3[i].style.visibility = "";
   }
   
  
   yLabel[i].style.top = a-b2-9;
   yLabel[i].style.width = x;
   yLabel[i].style.visibility = "";
   
   a -=nodeMargin;
  }	
  
  for(var i=vCount;i<this.vCount;i++){
   var obj = this.chartNode[i];	  

   for(var j=0;j<gCount;j++){	 
    if(!isBar&&i>0)
     obj.lines[j].style.visibility = "hidden";
    obj.bars[j].style.visibility = "hidden";
   }
   
   yLine1[i].style.visibility = "hidden";

   if(!isBar)
    yLine3[i].style.visibility = "hidden";
  
   yLabel[i].style.visibility = "hidden";
  }  
}

TChart.prototype.createHorBar = function(barID,leftCaption){
  var isBar = this.barStyle=="bar";
  
  var a = this.width-this.xMargin-10;
  
  if(isBar) a -= this.axisMargin;
  
  this.axisRUnit = Math.floor(a/this.axisCount);  //x坐标点距离

  var vCount = this.vCount;
  var gCount = this.gCount;
  
  var barColor = [];
  if(gCount==1) barColor = [__color];
  else
   for(var j=0;j<gCount;j++){
	barColor[j] = new Array(vCount);
	for(var i=0;i<vCount;i++)
	 barColor[j][i] = __color[j];
   }
   
  a = this.height-this.yMargin-this.titleHeight-15;
  if(isBar) a -= this.axisMargin;

  var nodeMargin = Math.floor(a/vCount);
  this.barMargin = nodeMargin/3;
  this.barMargin = this.barMargin<1?1:this.barMargin;
  
  this.barWidth = (nodeMargin-this.barMargin)/gCount;

  var x = this.xMargin;
  var lw = nodeMargin-this.barMargin;
  var x1 = this.width;
  var w = this.width-x;
  var y = this.yMargin;
  var t = this.titleHeight-3;
  var y1 = this.height-y;
  var h = this.height-t-y;
  var am = this.axisMargin;
  var ym = am+t;
  
  var DLC = "#aaaaaa";

  document.write("<v:group ID='"+barID+"' style='position:relative;left:"+this.left+"px;top:"+this.top+"px;"+
			  " width:"+this.width+"px;height:"+this.height+"px' coordsize = '"+this.width+","+this.height+"'>");
  
  document.writeln("<v:Rect style='left:0px;top:0px;width:"+
				     this.width+"px;height:"+this.titleHeight+"px' filled='false' stroked='false'>");
  document.writeln("<v:TextBox inset='0pt,0pt,0pt,0pt'>");
  document.writeln("<table width='100%' height='100%' border='0' align='center' cellspacing='0'>");
  document.writeln("<tr>");
  document.writeln("<td align='center' valign='middle' style='font-size:14px;color:#0000aa' id='title_"+barID+"'>统计图</td>");
  document.writeln("</tr>");
  document.writeln("</table>");
  document.writeln("</v:TextBox>");
  document.writeln("</v:Rect> ");

  this.title.caption = document.getElementById("title_"+barID);


  if(isBar){
   document.write("<v:PolyLine filled='T' FillColor='#ddddff' Points='"+x+","+ym+","+x+" "+y1+","+(x1-am)+" "+y1+","+
 				  x1+" "+(y1-am)+","+x1+" "+t+","+
				  (x+am)+" "+t+","+x+" "+ym+"' style='z-index:-2'>");
   document.write("<v:fill rotate='t' angle='-45' focus='100%' type='gradient'/></v:rect>");   
   document.write("</v:PolyLine>");
  
   document.write("<v:line alt='' style='z-index:-1' from='"+(x+am)+","+t+"' to='"+(x+am)+","+(y1-am)+"' strokecolor='"+DLC+"'/>");
   document.write("<v:line alt='' style='z-index:-1' from='"+(x+am)+","+(y1-am)+"' to='"+x1+","+(y1-am)+"' strokecolor='"+DLC+"'/>");
   document.write("<v:line alt='' style='z-index:-1' from='"+x+","+y1+"' to='"+(x+am)+","+(y1-am)+"' strokecolor='"+DLC+"'/>");
  }else{
   document.write("<v:PolyLine filled='T' FillColor='#ddddff' Points='"+x+","+t+","+x+" "+y1+","+x1+" "+y1+","+
 				  x1+" "+t+","+x+" "+t+"' style='z-index:-2'>");
   document.write("<v:fill rotate='t' angle='-45' focus='100%' type='gradient'/></v:rect>");   
   document.write("</v:PolyLine>");
  }
  
  document.writeln("<span style='position:absolute;z-index:10;color:#0000aa;text-align:right;font-size:12px;left:"+x+"px;top:"+
				   (this.height-20)+"px;height:16px;width:"+(x1-x)+"px'>");         
  document.writeln(leftCaption);   
  document.writeln("</span>");    
  
  var xLine1 = this.xAxis.line1;
  var xLine2 = this.xAxis.line2;
  var xLine3 = this.xAxis.line3;
  var xLabel = this.xAxis.label;
  var xLabelValue = this.xAxis.labelValue;
  
  a = x+this.axisRUnit;
  var bid;
  
  for(var i=0;i<this.axisCount;i++){
   bid = barID+i;	   
   if(isBar){
    document.write("<v:line id='xline1_"+bid+"' style='z-index:-1' from='"+a+","+y1+"' to='"+a+","+(y1+5)+"' strokecolor='"+DLC+"'/>");
    document.write("<v:line id='xline2_"+bid+"' style='z-index:-1' from='"+a+","+y1+"' to='"+(a+am)+","+(y1-am)+"' strokecolor='"+DLC+"'>");
    document.write("<v:stroke dashstyle='ShortDash'/></v:line>");
    document.write("<v:line  id='xline3_"+bid+"' style='z-index:-1' from='"+(a+am)+","+(y1-am)+"' to='"+(a+am)+","+t+"' strokecolor='"+DLC+"'>");
    document.write("<v:stroke dashstyle='ShortDash'/></v:line>");
   }else{
    document.write("<v:line id='xline1_"+bid+"' style='z-index:-1' from='"+a+","+(y1-5)+"' to='"+a+","+y1+"' strokecolor='"+DLC+"'/>");
    document.write("<v:line  id='xline3_"+bid+"' style='z-index:-1' from='"+a+","+y1+"' to='"+a+","+t+"' strokecolor='"+DLC+"'>");
    document.write("<v:stroke dashstyle='ShortDash'/></v:line>");
   }
   
   document.write("<v:shape id='xLabel_"+bid+"' style='left:"+(a-this.axisRUnit/2)+"px;top:"+(y1+5)+"px;width:"+this.axisRUnit+"px;height:16px;z-index:1'>");
   document.write("<v:textbox inset='0px,0px,0px,0px'>");
   document.write(" <table cellspacing='3' cellpadding='0' width='100%' height='100%'>");
   document.write("  <tr><td align='center' style='font-size:12px' id='xLabelv_"+bid+"'>"+i+"</td></tr></table>"); 
   document.write("</v:textbox></v:shape>");
   
   xLine1[i] = document.getElementById("xline1_"+bid);
   if(isBar)
    xLine2[i] = document.getElementById("xline2_"+bid);
	
   xLine3[i] = document.getElementById("xline3_"+bid);
   xLabel[i] = document.getElementById("xLabel_"+bid);
   xLabelValue[i] = document.getElementById("xLabelv_"+bid);
   a += this.axisRUnit;
  }
  
  var yLine1 = this.yAxis.line1;
  var yLine2 = this.yAxis.line2;
  var yLine3 = this.yAxis.line3;
  var yLabel = this.yAxis.label;
  var yLabelValue = this.yAxis.labelValue;
  
  a = y1-15;
  b = this.barWidth;
  b2 = (nodeMargin-this.barMargin)/2;
  v = 0;
  var ox=[],oy=[],nx,ny;
  
  for(var i=0;i<vCount;i++){
   var obj = this.chartNode[i];	  
   var al = a;
   
   bid = bid+i;
   cp = a-b2;
   //document.write("<v:line alt='' style='z-index:1' from='"+(a+b2)+","+t+"' to='"+(a+b2)+","+y1+"' strokeWeight='1px' strokecolor='"+DLC+"'>");
   //document.write("<v:stroke dashstyle='ShortDash'/></v:line>");
   document.write("<v:line id='yLine_1"+bid+"' style='visibility:hidden;z-index:1' from='"+(x-5)+","+cp+"' to='"+x+","+cp+"' strokeWeight='1px' strokecolor='"+DLC+"'/>");
   yLine1[i] = document.getElementById("yLine_1"+bid);   
   if(!isBar){
    document.write("<v:line id='yLine_3"+bid+"' style='visibility:hidden;z-index:1' from='"+x+","+cp+"' to='"+x1+","+cp+"' strokeWeight='1px' strokecolor='"+DLC+"'>");
	document.write("<v:stroke dashstyle='ShortDash'/></v:line>");
    yLine3[i] = document.getElementById("yLine_3"+bid);   
   }
   
   for(var j=0;j<gCount;j++){	 
    bid = barID+i*1000+j;
	if(isBar){
     document.write("<v:rect id='barh_"+bid+"' style='visibility:hidden;left:"+x+"px;top:"+(al-b)+"px;width:80px;"+
   			        "height:"+(b-1)+"px;z-index:1' fillcolor='"+barColor[j][i]+"'>");
     document.write("<v:fill color2='#dddddd' rotate='t' type='gradient' angle='45'/>");
     document.write("<o:extrusion v:ext='view' backdepth='20pt' color='"+barColor[j][i]+"' on='t'/>");
     document.write("</v:rect>");
	}else{
     nx = x+10;
	 ny = a-b2-3;
     document.write("<v:rect id='barh_"+bid+"' style='visibility:hidden;left:"+nx+"px;top:"+ny+
					"px;width:6px;height:6px;z-index:2' fillcolor='"+barColor[j][i]+"'/>");		
     if(i>0){
	  document.write("<v:line id='line"+bid+"' style='visibility:hidden;z-index:1' from='"+ox[j]+","+oy[j]+
					 "' to='"+nx+","+ny+"' strokeWeight='1px' strokecolor='"+__color[j]+"'/>");	 
	  obj.lines[j] = document.getElementById("line"+bid); 
	 }
     ox[j] = nx;
     oy[j] = ny;
	}
    obj.bars[j] = document.getElementById("barh_"+bid);
	al -= b;
   }
   
   document.write("<v:shape alt='' id='yAxis_"+bid+"' style='visibility:hidden;left:0px;top:"+(a-b2-9)+"px;width:"+x+"px;z-index:1'>");
   document.write("   <v:textbox inset='0px,0px,0px,0px'>");
   document.write("     <table cellspacing='3' cellpadding='0' width='100%' height='100%'>");
   document.write("	   <tr><td align='right' valign='top' style='font-size:12px' id='ylabel_"+bid+"'></td></tr></table>");
   document.write("   </v:textbox>");
   document.write("</v:shape>"); 
   
   yLabel[i] = document.getElementById("yAxis_"+bid);   
   yLabelValue[i] = document.getElementById("ylabel_"+bid);   
   a -=nodeMargin;
  }

  if(gCount>1)
   if(this.legendPos=="bottom"){
    document.write("<v:shape style='left:0px;top:"+(this.height-25)+"px;height:25px;width:"+this.width+"px;z-index:1'>");
    document.write("<table cellspacing='0' cellpadding='0' width='100%' height='100%'><tr><td align='center'>");
    document.write("<table cellspacing='3' cellpadding='0' style='border:1px solid #555555'><tr height='15'>");
    for(var j=0;j<gCount;j++)
	 document.write("<td width='30' bgcolor='"+__color[j]+"'></td><td align='left'>"+this.legendValue[j]+"&nbsp;&nbsp;</td>");  
    document.write("</tr></table>");	
    document.write("</td></tr></table>");
    document.write("</v:shape>"); 
   }else{
    document.write("<v:shape style='left:"+(x1+3)+"px;top:"+t+"px;height:"+(y1-t)+"px;width:"+this.legendWidth+"px;z-index:1'>");
    document.write("<table cellspacing='0' cellpadding='0'><tr><td align='center'>");
    document.write("<table cellspacing='3' cellpadding='0' style='border:1px solid #555555'>");
    for(var j=0;j<gCount;j++)
	 document.write("<tr height='15'><td width='30' bgcolor='"+__color[j]+"'></td><td align='left'><nobr>"+this.legendValue[j]+"</nobr></td></tr>");  
    document.write("</table>");	
    document.write("</td></tr></table>");
    document.write("</v:shape>"); 
   }
  document.write("</v:group>"); 
}

