var isVisible = false;

var parentLeft = 0;
var parentTop = 0;
var parentRight = 0;
var parentBottom = 0;
var origmenu = null;
function setParentRang(pMenu,pL,pT,pR,pB){
  origmenu = pMenu;
  parentLeft = pL;
  parentTop = pT;
  parentRight = pR;
  parentBottom = pB;
}

function pointIn(mX,mY){
 var dleft;
 var dtop;
 var dright;
 var dbottom;

  return isVisible;
 dleft = document.body.scrollLeft;
 dtop = document.body.scrollTop;
 dright = dleft+document.body.offsetWidth;
 dbottom = dtop+document.body.offsetHeight;

 //mX -= origLeft;
 //mY -= origTop+27;
  mX += 1;
  mY += 1;
 alert(mX+","+mY+":"+dleft+","+dtop+","+dright+","+dbottom);
 if(mX < dleft||mX > dright||mY < dtop||mY > dbottom){
    //alert("come");
  return false;
  }
 return true;
}

function HideMenu()
{
 var mX;
 var mY;
 var vDiv;
 var mDiv;
 var dleft;
 var dtop;
 var dright;
 var dbottom;
 var h = 24;
 if(origmenu != null)
 {
   vDiv = origmenu;
   dleft = document.body.scrollLeft;
   dtop = document.body.scrollTop;
   dright = dleft+document.body.offsetWidth;
   dbottom = dtop+document.body.offsetHeight;
   mX = window.event.clientX;
   mY = window.event.clientY;
   if(mX < dleft||mX >= dright||mY < dtop||mY >= dbottom){
    //alert(mX+","+mY+":"+parentLeft+","+parentTop+","+parentRight+","+parentBottom);
    //if(mX < parentLeft||mX >= parentRight||mY < parentTop||mY >= parentBottom)
        isVisible = false;
        if(!parent.isvisible)
     parent.closeMenu();
   }
 }
}

function mhHover(menuname,showorhide)
{
  var menu=document.getElementById(menuname);
  if(menu==origmenu) return;
  if(origmenu!=null){
   origmenu.style.visibility = "hidden";
  }

  window.resizeTo(menu.offsetWidth,menu.offsetHeight);
  parent.menuData.resizeTo(menu.offsetWidth,menu.offsetHeight);
  parent.menuDataB.resizeTo(menu.offsetWidth,menu.offsetHeight);

  origmenu = menu;
  if(showorhide)
   menu.style.visibility = "";
  else
   menu.style.visibility = "hidden";
}

function mhHover2(sender,cls){
 sender.className = cls;
}

function callfun(url,att){
  parent.callfun(url,att);
}
