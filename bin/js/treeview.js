 //去掉右边的空格
 function rightTrim(value){
  var nlen = value.length - 1;
  for(;nlen>=0;nlen--){
   if(value.charAt(nlen)>' ') break;
  }
  return value.substring(0,nlen+1);
 }
/**
 节点定义
 */  
 function TTreeNode(owner,parentNode,pspan,pdiv,imgPath,index,isFirst,isLast){
   this.className = "TTreeNode";	 
   this.owner = owner;
   this.tree = owner;
   this.parentNode = parentNode;
   this.pspan = pspan;
   this.isFirst = isFirst;
   this.isLast = isLast;   
   this.icc = 0;              //innerChildCount
   this.checkChild = 0;       //被选中的子节点数
   this.CheckBox = null;
   
   for(var i=0;i<pspan.childNodes.length;i++)
     pspan.childNodes[i].pTreeNode = this;
   this.pdiv = pdiv;
   
   var cn = pspan.childNodes[0].childNodes.length;
   
   this.img = pspan.childNodes[0].childNodes[cn-3];
   this.img.pTreeNode = this;
   this.img2 = pspan.childNodes[0].childNodes[cn-2];
   this.img2.pTreeNode = this;
   
   this.icc = parseInt(pspan.childNodes[0].childNodes[cn-1].value,10);

   if(this.icc>0)
    this.img2.src = imgPath+"folder.gif";
   else
    this.img2.src = imgPath+"file.gif";

   //设置图形
   if(typeof(this.img.src)=="undefined"||this.img.src==""){
    if(isLast){
	 if(this.icc>0)
	  this.img.src = imgPath+"plusbottom.gif";
	 else
	  this.img.src = imgPath+"joinbottom.gif"; 
	}else{
	 if(this.icc>0)
	  this.img.src = imgPath+"plusex.gif";
	 else
	  this.img.src = imgPath+"join.gif"; 
	}
   }
   
   cn = cn-3;
   var pNode = this.parentNode;   
   while(cn>0&&pNode!=null&&pNode!=owner){
	var img = pspan.childNodes[0].childNodes[cn-1];
	if(pNode.isLast)
	 img.src = imgPath+"empty.gif";
	else 
	 img.src = imgPath+"lin.gif"; 
	cn--;  
    pNode =  pNode.parentNode;
   }
   
   this.isRead = false;
   this.hasChild = false;
   this.isExpend = false;
   
   if(parentNode==owner)
     this.level = 0;
   else this.level = parentNode.level+1;	
   this.ID = pspan.childNodes[3].value;
   
   this.nodes = new Array();
   this.childCount = 0;
   this.index = parentNode.childCount;	   
   parentNode.childCount++;
 }
 /**获取节点内容*/
 TTreeNode.prototype.getText = function(){
   return _$splitCodeAndName(this.pspan.childNodes[2].innerText,"."); 	 
 }

 TTreeNode.prototype.setText = function(value){
   this.pspan.childNodes[2].innerText = value+"-"+this.pspan.childNodes[2].innerText; 	 
 }

/**获取节点代码
  */
 TTreeNode.prototype.getID = function(){
   return this.pspan.childNodes[3].value; 	 
 }
  /**获取节点ID
  */
 TTreeNode.prototype.getCode = function(){
   var id = this.pspan.childNodes[4].value; 	 	 
   return id;
 }
 /**获取节点ID
  */
 TTreeNode.prototype.getAfxValue1 = function(){
   var id = this.pspan.childNodes[4].afxvalue1; 	 	 
   return id;
 }
 
 TTreeNode.prototype.getLevel = function(){
   return parseInt(this.level,10)+parseInt(this.tree.baseLevel,10);
 }
 
 /**获取节点的子节点数
  */
 TTreeNode.prototype.getCount = function(){
   return this.nodes.length;
 }
 /**检查节点是否有子节点
  */
 TTreeNode.prototype.hasChilden = function(){
   return this.nodes.length>0||this.icc>0;
 }
 /**设置节点选中状态
  */
 TTreeNode.prototype.setChecked = function(checked){
   this.pspan.childNodes[1].checked = checked;
   this.tree.CheckBoxChange(this);
 }

 TTreeNode.prototype.setCheckedF = function(){
   this.pspan.childNodes[1].checked = !this.pspan.childNodes[1].checked;
   this.tree.CheckBoxChange(this);
 }


 TTreeNode.prototype.setCheckedEx = function(checked){
   this.pspan.childNodes[1].checked = checked;
   
   //设置子节点选中计数
   var setCheckCount = function(vNode,checked){
	 if(vNode==null) return; 	
	 if(checked){
	  vNode.checkChild += 1
 	  var sText = vNode.pspan.childNodes[2].innerText;
      if(vNode.checkChild==1)
       vNode.pspan.childNodes[2].innerText = "(√)"+sText;	
	  setCheckCount(vNode.parentNode,checked);
	 }
   }

   setCheckCount(this.parentNode,checked);
 }

 TTreeNode.prototype.getChecked = function(){
   return this.pspan.childNodes[1].checked;
 }

 TTreeNode.prototype.setDisabled = function(checked){
   this.pspan.childNodes[1].disabled = checked;
 }


 TTreeView.prototype.OnExpanding = null;      //展开
 TTreeView.prototype.OnShrink = null;         //收缩
 TTreeView.prototype.OnTreeDblClick = null;   //选中
 TTreeView.prototype.OnTreeSelect = null;     //选中
 TTreeView.prototype.OnNodeClick = null;     //选中
 TTreeView.prototype.onlyLastNodeSelect = false;
 
 TTreeView.prototype.OnBeforeSelect = null;   //
 TTreeView.prototype.oldBackGround = "";
 TTreeView.prototype.oldFontColor = "";

 TTreeView.prototype.newBackGround = "#5555cc";
 TTreeView.prototype.newFontColor = "#ffffff";
 TTreeView.prototype.joinChecked = true;
 
 TTreeView.prototype.OnBlur = null;
 TTreeView.prototype.OnCheckChange = null;
 TTreeView.prototype.OnMouseOver = null;
 TTreeView.prototype.OnMouseOut = null; 
 
 TTreeView.prototype.addParams = null;           //附加参数
 TTreeView.prototype.baseLevel = 0;

 TTreeView.prototype.fontSize = 0;              //

 function TTreeView(pdiv,imgPath,nfc,nbg){
   this.className = "TTreeView";	 
   this.owner = this;
   this.pdiv = pdiv;
   this.pdiv.tree = this;
   this.selected = null;             //当前选中的节点
   this.childCount = 0;
   this.imgPath = "../images/";
   this.checkChild = 0;
   
   if(typeof(imgPath)!="undefined") this.imgPath = imgPath;
   
   if(typeof(nfc)!="undefined") this.newFontColor = nfc;
   
   if(typeof(nbg)!="undefined") this.newBackGround = nbg;
   
   this.pdiv.onkeydown = this.__keyDown;   
   
   this.nodes = new Array();
 
   this.initNode = function(node,owner,pdiv){
	 var pNode = node;
	 //if(node==owner) pNode = null;
	 var nodeCount = pdiv.childNodes.length/3;
	 for(var i=0,j=0;i<pdiv.childNodes.length;i+=3,j++){
	  var t = new TTreeNode(owner,
							pNode,
							pdiv.childNodes[i],
							pdiv.childNodes[i+2],
							this.imgPath,
							j,j==0,j==nodeCount-1);	
	  t.img.onclick = this._node_spread;   // img
	  t.img2.onclick = this._node_spread;  // img
	  
	  var nt = t.pspan.childNodes[1]; 

	  if(nt.tagName.toUpperCase()!="SPAN"){  //is checkboxss
	   nt.onclick = this._node_blur;
	   this.CheckBox = nt;
	   if(nt.checked)
	     node.checkChild = node.checkChild+1;

       if(node.checkChild>0){
	     node.pspan.childNodes[2].style.color = "#ff0000";
	   }
	  }
      nt = t.pspan.childNodes[2]; 	   	  

      nt.onclick = this._node_click;
	  nt.ondblclick = this._node_dblclick;
	  nt.onmouseover = this._node_mouseover;
	  nt.onmouseout = this._node_mouseout;	  
      node.nodes[j] = t;	  
	  
	  this.initNode(t,owner,t.pdiv);
	 }
	 
	 if(node==owner&&pdiv.childNodes.length>=3){
	  this.oldBackGround = node.nodes[0].pspan.childNodes[2].style.background;	 
	  this.oldFontColor = node.nodes[0].pspan.childNodes[2].style.color;	 
	  this.selected = node.nodes[0];		 
      this.selected.pspan.childNodes[2].style.color = this.newFontColor;
      this.selected.pspan.childNodes[2].style.background = this.newBackGround;
	 }
   }
   this.sqlID = "";
   this.isChecked = 0;
   this.dynTree = false;
   
   this.initNode(this,this,pdiv);
   __VCL.add(this);     
 }
 
 function freeNode(node){
   var cNode; 
   if(node!=null){
    if(node.hasChilden())
     for(var i=0;i<node.nodes.length;i++){
	  freeNode(node.nodes[i]);
	  node.nodes[i] = null;
     }
    node.img.onclick = null;
    node.img2.onclick = null; 
    node.pspan.childNodes[1].onclick = null;
    node.pspan.childNodes[2].onclick = null;
    node.pspan.childNodes[2].onmouseover = null;
    node.pspan.childNodes[2].onmouseout = null;   
    node.pspan.childNodes[3].ondblclick = null;
   }
   node = null; 
 }

 TTreeView.prototype.free = function(){
   for(var j=0;j<this.nodes.length;j++)
    freeNode(this.nodes[j]);
   this.pdiv.tree = null;
   this.pdiv.onkeydown = null;
 }
 
 TTreeView.prototype.hasChilden = function(){
    return this.selected.hasChilden();
 }

 /**设置一个节点下的HTML，并设置各子节点对象
 */
  TTreeView.prototype.setNodeHTML = function(node,sHtml){
	var nPos = 0;
	var isFile = 0;
	if(node==null){
     this.selected = null;	
     for(var j=0;j<this.nodes.length;j++)
       freeNode(this.nodes[j]);
	 this.nodes = new Array(); 
	 this.pdiv.innerHTML = sHtml;
	 this.initNode(this,this,this.pdiv);
	}else{
	 node.pdiv.innerHTML = sHtml; 
	 this.selected = null;
	 this.initNode(node,this,node.pdiv);
	 this.selected = node;
	 //修改节点状态
	 var s = node.pdiv;
     var img = node.img;
	 var img2 = node.img2;
	 
	 if(sHtml==""){   //无子节点
	  if(node.isLast)
	   img.src = this.imgPath+"joinbottom.gif";
	  else 
	   img.src = this.imgPath+"join.gif";
	  img2.src = this.imgPath+"file.gif"; 
      s.style.display = "none";  			   
	 }else{
	  if(s.style.display==""){
 	   if(node.isLast)
	    img.src = this.imgPath+"minusbottom.gif";
	   else 
	    img.src = this.imgPath+"minus.gif";
	  }else{
 	   if(node.isLast)
	    img.src = this.imgPath+"plusbottom.gif";
	   else 
	    img.src = this.imgPath+"plusex.gif";
	  }
	  img2.src = this.imgPath+"folder.gif"; 
	 }
	}
  }
  
  /**节点展开、收缩时间
  */
  TTreeView.prototype.__spread = function(sender){
	var node = sender;
	var tree = node.owner;
	var nPos = 0;
    var s = node.pdiv;

	if(s.style.display=="none"){
	 if(!node.isRead&&tree.dynTree){
	   node.isRead = true;
	   
       var n = 1;
       if(tree.addParams!=null) n += tree.addParams.length;
       var params = new Array(n);
       for(var i=0;i<n-1;i++)
         params[i] = tree.addParams[i];
       params[n-1] = node.getID(); 
	   
	   if(tree.OnGetParams!=null)
	     params = tree.OnGetParams(node);

	   var sqlId = tree.sqlID;
	   if(tree.OnGetSqlId!=null)
	     sqlId = tree.OnGetSqlId(node);

	   var v = tree.getDataFromServer(tree.sqlID,
									  params,
									  [node.level+1,
									   tree.fontSize*10+tree.isChecked,0,node.level+1]);
	   if(v != ""){
	     node.pdiv.innerHTML = v;
 	     tree.initNode(node,tree,node.pdiv);
	   }
	 }
	 if(node.pdiv.innerHTML!=""){
      s.style.display="";   //展开
	  var img = node.img;
	  if(node.isLast)
	   img.src = this.imgPath+"minusbottom.gif";
	  else 
	   img.src = this.imgPath+"minus.gif";
	  node.isExpend = true;
	 }
	 if(tree.OnExpand!=null) tree.OnExpand(node);
	}else{
	 node.isExpend = false;	
	 s.style.display="none";   //收缩	
	 var img = node.img;

     if(node.isLast)
	  img.src = this.imgPath+"plusbottom.gif";
	 else 
	  img.src = this.imgPath+"plusex.gif";

	 if(tree.OnShrink!=null) tree.OnShrink(node);
	}
  }
  
  TTreeView.prototype._node_spread = function(sender){
    var vSrc = window.event.srcElement;
	var node = vSrc.pTreeNode;

	node.owner.__spread(node);
  }
  
  TTreeView.prototype.CheckBoxChange = function(node){
	var pNode;
    var checkBox = node.pspan.childNodes[1];
	var tree = node.owner;
	
	//设置子节点状态函数
	var setNodeChild = function(vNode,checked){
	 for(var i=0;i<vNode.nodes.length;i++){
	  vNode.nodes[i].pspan.childNodes[1].checked = checked;
	  
	  tree.doCheckChange(vNode.nodes[i],checked);
	  
	  if(vNode.nodes[i].nodes.length>0)
	   setNodeChild(vNode.nodes[i],checked);
	 }
	}
	
	//检查并设置父节点状态，当子节点全部为false时，节点应该为false
	var setNodeParent = function(pNode){
	 var result = false;	
	 if(pNode==pNode.owner) return;
	 for(var i=0;!result&&i<pNode.nodes.length;i++)
	  result = pNode.nodes[i].pspan.childNodes[1].checked;
	 if(!result){
	  pNode.pspan.childNodes[1].checked = false;
	  tree.doCheckChange(pNode,false);	  
	  if(pNode.parentNode!=pNode.owner)
	   setNodeParent(pNode.parentNode);
	 }
	}
	//设置子节点选中计数
	var setCheckCount = function(vNode,checked){
	 if(vNode==null) return; 	
	 if(checked)
	  vNode.checkChild += 1
	 else vNode.checkChild -= 1;
	 var sText = vNode.pspan.childNodes[2].innerText;
     if(vNode.checkChild>0){
	   if(sText.indexOf("(√)")!=0)	 
 	    vNode.pspan.childNodes[2].innerText = "(√)"+sText;	
	 }else
	   vNode.pspan.childNodes[2].innerText = sText.substring(3);
	 setCheckCount(vNode.parentNode,checked);
	}
	
	if(tree.joinChecked)
     if(checkBox.checked){  //选中状态
 	  pNode = node.parentNode;

 	  while(pNode!=pNode.owner){
	   pNode.pspan.childNodes[1].checked = true;
	   tree.doCheckChange(pNode,true);	  	  
	   pNode = pNode.parentNode;
	  }
	  setNodeChild(node,checkBox.checked);
	 }else{
	  setNodeChild(node,checkBox.checked);	
	  setNodeParent(node.parentNode);
	 }
	
	if(!tree.joinChecked)
 	 setCheckCount(node.parentNode,checkBox.checked);
	 
	tree.doCheckChange(node,checkBox.checked);		  
	  
  }
  /**失去焦点*/
  TTreeView.prototype._node_blur = function(sender){
    var vSrc = window.event.srcElement;
	var node = vSrc.pTreeNode;
	var tree = node.owner;
    tree.CheckBoxChange(node);
	
    if(tree.onDoBlur!=null) tree.onBlur(node);
  }

  
  TTreeView.prototype.__dblclick = function(sender){
	var node = sender;
	var tree = node.owner;
    if(tree.OnTreeDblClick!=null)
     tree.OnTreeDblClick(node)
	else
  	 tree.__spread(node);
  }

  TTreeView.prototype._node_dblclick = function(sender){
    var vSrc = window.event.srcElement;
	var node = vSrc.pTreeNode;
	var tree = node.owner;
	tree.__dblclick(node);
  }

  TTreeView.prototype.__click = function(sender,scrollAtt){
    var node = sender;

	var tree = node.owner;
	var selected = tree.selected;

    if(tree.OnNodeClick!=null)
	  if(!tree.OnNodeClick(node)) return;
	 
    if(node==selected) return;
	
    var result = true;
	
    if(tree.OnBeforeSelect!=null)
      result = tree.OnBeforeSelect(node);


    if(result){
     if (selected != null){
       selected.pspan.childNodes[2].style.color = tree.oldFontColor;
       selected.pspan.childNodes[2].style.background = tree.oldBackGround;
	   if(selected.icc>0)
	    selected.img2.src = tree.imgPath+"folder.gif";
     }
	 
     tree.selected = node;

     if(node!=null){
       tree.oldBackGround = node.pspan.childNodes[2].style.background;
       node.pspan.childNodes[2].style.color = tree.newFontColor;
       node.pspan.childNodes[2].style.background = tree.newBackGround;
	   node.pspan.childNodes[2].focus();
	   if(node.icc>0)
	     node.img2.src = tree.imgPath+"folderopen.gif";
     }

     if(tree.OnTreeSelect!=null)
      tree.OnTreeSelect(node);
	 //if(typeof(scrollAtt)!="undefined") 
	 // node.pspan.childNodes[2].scrollInView(scrollAtt);
    }
  }

  TTreeView.prototype._node_click = function(sender){
    var vSrc = window.event.srcElement;
	var node = vSrc.pTreeNode;
	var tree = node.owner;
	tree.__click(node);
  }

 
 TTreeView.prototype._node_mouseover = function(sender){
    var vSrc = window.event.srcElement;
	var node = vSrc.pTreeNode;

	var tree = node.owner;
	if(tree.OnMouseOver!=null)
	 tree.OnMouseOver(vSrc);
 }
 
 TTreeView.prototype._node_mouseout = function(sender){
    var vSrc = window.event.srcElement;
	var node = vSrc.pTreeNode;

	var tree = node.owner;
	if(tree.OnMouseOut!=null)
	 tree.OnMouseOut(vSrc);
 }
 
 TTreeView.prototype.priorFocusNode = function(node){
   var index = node.index;        //节点的索引	
   var parentNode = node.parentNode;  //父节点
   if(index==0){  //是第一个子节点
     if(parentNode==node.owner) 
	   return null;  //返回空
	 else 
	   return parentNode;
   }else{
     node = parentNode.nodes[index-1];
     while(node.nodes.length>0&&node.isExpend){
		node =  node.nodes[node.nodes.length-1];
	 }
	 return node;
   }
 }

 TTreeView.prototype.nextFocusNode = function(node){
   var index = node.index;        //节点的索引	
   var parentNode = node.parentNode;  //父节点
   if(node.nodes.length>0&&node.isExpend){
	 return node.nodes[0];
   }else
     if(index<parentNode.nodes.length-1)   //不最后一个子节点
       return parentNode.nodes[index+1];
     else
       if(parentNode==node.owner) 
	     return null;  //返回空
	   else{
		 node = parentNode;   
		 while(node!=node.owner){
		   index = node.index;
	       parentNode = node.parentNode;
		   if(index<parentNode.nodes.length-1)
		     return parentNode.nodes[index+1];
		   node = parentNode;
		 }
		 return null;
	   }
 }

 TTreeView.prototype.__keyDown = function(sender){
   var vSrc = window.event.srcElement;
   var isDIV = vSrc.tagName=="DIV";
   var selected = (isDIV)?vSrc.tree.selected:vSrc.pTreeNode;
    
   if(selected!=null)
     switch(window.event.keyCode){
	  case 13: vSrc.tree.__dblclick(selected);
	           break;
	  case 32: if(isDIV) selected.setCheckedF();
	           break;
	  case 37:  //左光标键
	  case 39:  //右光标键
	           vSrc.tree.__spread(selected);
			   break;
	  case 38:  //向上
	           var bnode = vSrc.tree.priorFocusNode(selected);
		  	   if(bnode!=null) vSrc.tree.__click(bnode);
			   break;
	  case 40: var nnode = vSrc.tree.nextFocusNode(selected);
			   if(nnode!=null) vSrc.tree.__click(nnode);
			   break;
			  
     }
 }

 TTreeView.prototype.setNodesState = function(checked){
   var setNodesChecked = function(node){
 	for(var i=0;i<node.nodes.length;i++){
     node.nodes[i].pspan.childNodes[1].checked = checked;
	 setNodesChecked(node.nodes[i]);
	}
   }
   setNodesChecked(this);
 }
 
 TTreeView.prototype.doCheckChange = function(node,checked){
   if(this.OnCheckChange!=null)
     this.OnCheckChange(node,checked);
 }
 
 TTreeView.prototype.getText = function(){
   if(this.selected)
    return _$splitCodeAndName(this.selected.pspan.childNodes[2].innerText,".");
   else return "";	
 }
 
 /**获取节点代码
  */
 TTreeView.prototype.getCode = function(){
   if(this.selected)
    return this.selected.pspan.childNodes[4].value;
   else return "";	
 }
  /**获取节点ID
  */
 TTreeView.prototype.getID = function(){
   var id = "0";	 
   if(this.selected)
    id = this.selected.pspan.childNodes[3].value;
   return id;
 }

 TTreeView.prototype.getLevel = function(){
   var level = this.baseLevel;	 
   if(this.selected)
    level = parseInt(this.selected.level,10)+parseInt(this.baseLevel,10);
   return level;
 }
 
 TTreeView.prototype.getAfxValue1 = function(){
   if(this.selected)
    return this.selected.pspan.childNodes[4].afxvalue1;
   else return "";	
 }
 
 TTreeView.prototype.setChecked = function(checked){
   if(this.selected)	  
    this.selected.pspan.childNodes[1].checked = checked;
 }

 TTreeView.prototype.getChecked = function(){
   if(this.selected)	 
    return this.selected.pspan.childNodes[1].checked;
   else return false;	
 }

 //获取数据
 TTreeView.prototype.getDataFromServer = function(sqlid,params,props){
	 
   var xmlData = __xmlHttp._getDataFromServer2(this,sqlid,params,props,__$gfile.gettreedata);
   
   if(xmlData!=null){
    var root = xmlData.childNodes[0].childNodes[0]; 
  
    if(root.nodeName=="errors"){ //获取数据错误
     alert(root.childNodes[0].childNodes[0].nodeValue);
     return "";
    }else
	 if(root.childNodes[0].childNodes.length>0)
	  return root.childNodes[0].childNodes[0].nodeValue;   
	 else return ""; 
   }else
    return "";
 }
 //设置子节点数据
 TTreeView.prototype.setChildTree = function(){
  var n = 1;
  if(this.addParams!=null) n += this.addParams.length;
  var params = new Array(n);
  for(var i=0;i<n-1;i++)
   params[i] = this.addParams[i];
  params[n-1] = this.selected.getID(); 

  this.setNodeHTML(this.selected,
				    this.getDataFromServer(this.sqlID,
										    params,
						                   [this.selected.level+1,tree.fontSize*10+tree.isChecked,0,1])); 
 }
 //重新刷新数据
 TTreeView.prototype.freshData = function(params,node){
   this.setNodeHTML(node,
				    this.getDataFromServer(this.sqlID,
										   params,
						                   [1,tree.fontSize*10+tree.isChecked,0,1])); 
 }

 TTreeView.prototype.freshDataEx= function(sqlID,params,node){
   this.setNodeHTML(node,this.getDataFromServer(sqlID,params,[0,tree.fontSize*10+tree.isChecked,0,0])); 
 }

 TTreeView.prototype.freshData2= function(sqlID,params,aparams,node){
   this.setNodeHTML(node,this.getDataFromServer(sqlID,params,aparams)); 
 }

 TTreeView.prototype.getCheckedsText = function(sChar,defaultText){
   var gn = 0;
   var sResult = "";
   var vGet = function(node){
	 var nlen = node.nodes.length;	
	 for(var i=0;i<nlen;i++){
	  if(node.nodes[i].getChecked()){
	   if(gn>0) 
	    sResult = sResult+sChar+node.nodes[i].getText();
	   else	
	    sResult = node.nodes[i].getText();
	   gn++;	
 	  }
	  vGet(node.nodes[i]);
	 }
   }
   vGet(this); 	 
   if(sResult==""&&typeof(defaultText)!="undefined")
     sResult = defaultText;
   
   return sResult;
 }

 TTreeView.prototype.getCheckedsCode = function(sChar,sChar0,defaultCode){
   var gn = 0;
   var sResult = "";
   var vGet = function(node){
	 var nlen = node.nodes.length;	
	 for(var i=0;i<nlen;i++){
	  if(node.nodes[i].getChecked()){
	   if(gn>0) 
	    sResult = sResult+sChar+sChar0+node.nodes[i].getCode()+sChar0;
	   else	
	    sResult = sChar0+node.nodes[i].getCode()+sChar0;
	   gn++;		
 	  }
	  vGet(node.nodes[i]);
	 }
   }
   vGet(this); 	 
   if(sResult==""&&typeof(defaultCode)!="undefined")
     sResult = defaultCode;
   return sResult;
 }
 
 TTreeView.prototype.getCheckedsId = function(sChar,defaultId){
   var gn = 0;
   var sResult = "";
   var vGet = function(node){
	 var nlen = node.nodes.length;	
	 for(var i=0;i<nlen;i++){
	  if(node.nodes[i].getChecked()){
	   if(gn>0) 
	    sResult = sResult+sChar+node.nodes[i].getID();
	   else	
	    sResult = node.nodes[i].getID();
	   gn++;		
 	  }
	  vGet(node.nodes[i]);
	 }
   }
   vGet(this); 	 
   if(sResult==""&&typeof(defaultId)!="undefined") 
     sResult = defaultId;
   return sResult;
 }

 TTreeView.prototype.getCheckeds = function(){
   var sArray = [];
   var vGet = function(node){
	 var nlen = node.nodes.length;	
	 for(var i=0;i<nlen;i++){
	  if(node.nodes[i].getChecked()){
	    sArray.push(node.nodes[i].getID()); 
 	  }
	  vGet(node.nodes[i]);
	 }
   }
   vGet(this); 	 
   return sArray;
 }

 TTreeView.prototype.getAllNodes = function(){
   var sArray = [];
   var vGet = function(node){
	 var nlen = node.nodes.length;	
	 for(var i=0;i<nlen;i++){
       sArray.push(node.nodes[i]); 
 	   vGet(node.nodes[i]);
	 }
   }
   vGet(this); 	 
   return sArray;
 }
 