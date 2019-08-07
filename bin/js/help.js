function _$help(fid,stitle){
	
  var url = "../support/f_help_show.jsp?fid="+fid+"&stitle="+stitle;	
  var h = screen.height - 75;
  var x = screen.width - 300;
  var y = 0;
  
  window.open(url,
			  "helpwin",
			  "alwaysRaised=yes,status=1,left="+x+",top="+y+",width=290,height="+h); 
}
