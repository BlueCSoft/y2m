<%@page contentType="text/html;charset=gb2312"%>
<%@page language="java" import="java.sql.*,javax.servlet.http.*,bluec.base.*,bluec.keg.*"%>
<%
  request.setCharacterEncoding("GBK");
  response.setHeader("Pragma", "no-cache" );
  response.addHeader("Cache-Control", "must-revalidate");
  response.addHeader("Cache-Control", "no-cache");
  response.addHeader("Cache-Control", "no-store");
  response.setDateHeader("Expires", 0);

  String lon = "", lat = "", sname = "",sxxdz = "";
  Boolean isnew = false;
  Boolean isdw = request.getParameter("isdw").toString().equals("1");

  sname = request.getParameter("sname").toString(); 	
  sxxdz = request.getParameter("sxxdz").toString();   
  
  lon = request.getParameter("lon").toString();
  lat = request.getParameter("lat").toString();
  
  if(lon.equals("")||lat.equals("")){
    lon = "113.294093";
    lat = "23.143385";
	isnew = true;
  }
%>
<!DOCTYPE html>
<head>
<title>客户定位</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no">

<link rel="stylesheet" href="../theme/bootstrap.min.css">
<link rel="stylesheet" href="../theme/page.css">

<script charset="utf-8" src="http://api.map.baidu.com/api?v=2.0&ak=bBHLPE6p5W3RymVCr4zatMAPWFbWQ96h"></script>
<script src="../js/jquery.min.js"></script>
<script src="../js/xmlhttp.js?version=1"></script>
<script src="../js/db.js?version=1"></script>
<script src="../js/iqrgrids.js?version=1"></script>
<script>
  var map, geocoder, marker = null, QrGrid = null, findH = 0;
		
  var gcfun = function(rs){
	var addComp = rs.addressComponents;
	var address = [addComp.city].join('');
	infoLabel.innerText = addComp.province+addComp.city+addComp.district+addComp.street+addComp.streetNumber;
  };
			
  function getOrigLocation(){
	showWaiting("正在定位，请稍后......");  
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
	  closeWaiting();	
	  if(this.getStatus() == BMAP_STATUS_SUCCESS){
		marker = new BMap.Marker(r.point);
		map.addOverlay(marker);
		map.panTo(r.point);
		new BMap.Geocoder().getLocation(r.point, gcfun);
	  } else {
		alert("失败"+this.getStatus());
	  }        
	},{enableHighAccuracy: true})  
  }
  
  function initialize() {
    __xmlHttp.clientheight = document.documentElement.clientHeight;
	__xmlHttp.setSubwin(<%=CUtil.winCalltype(request)%>);  
	
	QrGrid.boundQuery(__$Query,false);
	QrGrid.OnRowClick = function(row){
	  if(!__$Query.isEmpty){
		editJd.innerText = __$Query.$("F3");
	    editWd.innerText = __$Query.$("F4"); 
		infoLabel.innerText = __$Query.$("F2");
	  }
    }
   
	__$Query.Query("#MAPTO",[]);
		 
	reSize();
	map = new BMap.Map('map_canvas');
			
	var x = <%=lon%>;
	var y = <%=lat%>;
	var z = 15;
				
	editJd.innerText = x;
	editWd.innerText = y; 
					
	var point = new BMap.Point(x, y);
		
	map.centerAndZoom(point, z);
	map.addControl(new BMap.NavigationControl());
	map.enableScrollWheelZoom();

	new BMap.Geocoder().getLocation(point, gcfun);
				
	<%if(isdw){%>
	map.addEventListener("click", function(e){
	  editJd.innerText = e.point.lng
	  editWd.innerText = e.point.lat;    
					
	  if(marker!=null)
		map.removeOverlay(marker);
	  marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat));       
	  map.addOverlay(marker);  
	  map.panTo(e.point);				
	  new BMap.Geocoder().getLocation(e.point, gcfun);
	});
    <%}%>			
<%  if(!isnew){%>		
	marker = new BMap.Marker(new BMap.Point(x, y));       
	map.addOverlay(marker);
<%  }else{%>
    getOrigLocation();
<%  }%>		
  }
			
  function searchByStationName(address) {
	if (!map) return;
	var localSearch = new BMap.LocalSearch(map, {
	  renderOptions: {
		map: map,
		autoViewport: true,
		selectFirstResult: false
	  }
    });
	showWaiting();  
	__$Query.emptyDataset();

    var soptions = {
	  onSearchComplete: function(results){
		//判断状态是否正确
		if(local.getStatus() == BMAP_STATUS_SUCCESS){
		  for(var i = 0; i < results.getCurrentNumPois(); i ++){
			__$Query.append([results.getPoi(i).title,results.getPoi(i).address,results.getPoi(i).point.lng,results.getPoi(i).point.lat]);
		  }
		}
		closeWaiting(); 
	  },
	  renderOptions: {
		map: map,
		autoViewport: true,
		selectFirstResult: false
	  }
	};
	var local = new BMap.LocalSearch("广州市", soptions);
	local.search(address);
	dataOp.style.display = "";
	//reSize();
  }
	     		
  function doOk(){
    __$windowcallresult.isok = true;
	__$windowcallresult.results = [editJd.innerText,editWd.innerText,infoLabel.innerText]; 
    history.back();
  }
	
  function doCancel(){
    history.back();
  }	
  	
  function doFind(){
	if(inpEdit.value != ""){
      searchByStationName(inpEdit.value);
	}else{
	  searchByStationName(titlebar.innerText);	
	}
  }
  
  function reSize(){
	findH = __xmlHttp.clientheight-$("#titlebar").outerHeight()-$("#findPanel").outerHeight();
    $("#divClient").css("height",findH); 
  }
</script>
</head>
<body onLoad="initialize();" onResize="reSize()" scroll="no" style="overflow:hidden; margin:0px; height:100%">
  <div id="titlebar" style="width:100%; height:24px; padding:5px; font-size:12px; font-weight:bold"><%=sname%> 地图定位</div>
  <div id="findPanel" style="width:100%; height:40px;">
    <table height="100%" border="0">
    <tr>
    <td width="320" style="padding-left:8px">
    <input id="inpEdit" type="text" class="form-control" value="<%=sname%>"/></td>
    <td width="88">
    <button class="btn btn-primary btn-sm" onClick="doFind();">
    <span class="glyphicon glyphicon-plus-sign"></span> 查找</button>
    </td>
    <td>
    <table height="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
     <td  width="600" style="padding-left:4px"><span id="infoLabel" style="font-size:14px;"></span>
                                   &nbsp;&nbsp;经度:<span id="editJd"></span>&nbsp;&nbsp;纬度:<span id="editWd"></span></td>
     <%if(isdw){%>
     <td align="center" width="88">
     <button class="btn btn-warning btn-sm" onClick="doCancel();">
     <span class="glyphicon glyphicon-chevron-left"></span> 取消</button>
     </td>
     <td width="88">
     <button class="btn btn-primary btn-sm" onClick="doOk();">
     <span class="glyphicon glyphicon-ok"></span> 确定</button>
     </td>
     <%}else{%>
     <td width="88">
     <button class="btn btn-warning btn-sm" onClick="doCancel();">
     <span class="glyphicon glyphicon-chevron-left"></span> 返回</button>
     </td>
     <%}%>
    </tr>
    </table>
    </td>
    </tr>
    </table>
  </div>
  <div id="divClient" style="width:100%;height:400px;display:flex;flex-direction:row;">
   <div id="dataOp" style="width:320px;height:100%;display:none; border-right:1px solid #666;border-bottom:1px solid #666">
    <script>
     QrGrid = new TQRGrid();
     QrGrid.setPropertys({name:"QRGrid",crossShowRow:false,tableBgColor:"#cccccc",rowBackGround:"#ffffff",usePre:false,
                          titleHeight:28,userActiceRow:true,hideTitle:true,recNoCol:0});
     QrGrid.addEx({FieldName:"F1",Width:0}).combColHtml =
            '<span id="F1" style="font-size:12px;font-weight:bold"></span><br>'+
            '<span id="F2" style="font-size:12px;color:#666"></span>';
     QrGrid.CreateGrid(true);  //显示表格线
    </script>
   </div>
   <div id="map_canvas" style="flex:1; height:100%; border-bottom:1px #666 solid;"></div>
  </div> 
</body>
</html>
