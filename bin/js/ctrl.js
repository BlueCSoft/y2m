function nocontextmenu(){
  event.cancelBubble = true
  event.returnValue = false;
  return false;
}

function _disabledkey(){ 
 if(event.shiftKey){
  return false;
 }
 //½ûÖ¹Shift
 if(event.altKey){
  return false;
 }
 //½ûÖ¹Alt
 if(event.ctrlKey){
  return false;
 }
  //½ûÖ¹Ctrl
 return true; 
}
 
document.onkeydown = _disabledkey;
document.oncontextmenu = nocontextmenu;