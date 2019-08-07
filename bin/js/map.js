// JavaScript Document
function _$gcj02tobd09(longitude, latitude){
  var result = {"lon":"","lat":""};
  var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
  var PI = 3.1415926535897932384626;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;
  
  var lon = parseFloat(longitude);  
  var lat = parseFloat(latitude);  
  var z = Math.sqrt(lon * lon + lat * lat) + 0.00002 * Math.sin(lat * Math.PI);
  var theta = Math.atan2(lat, lon) + 0.000003 * Math.cos(lon * x_PI);
  result.lon = (z * Math.cos(theta) + 0.0065).toFixed(6);
  result.lat = (z * Math.sin(theta) + 0.006).toFixed(6);
  
  return result;
}

