function nocontextmenu(){
  event.cancelBubble = true
  event.returnValue = false;
  return false;
}

function _disabledkey(){ 
 if(event.shiftKey){
  return false;
 }
 //��ֹShift
 if(event.altKey){
  return false;
 }
 //��ֹAlt
 if(event.ctrlKey){
  return false;
 }
  //��ֹCtrl
 return true; 
}
 
document.onkeydown = _disabledkey;
document.oncontextmenu = nocontextmenu;