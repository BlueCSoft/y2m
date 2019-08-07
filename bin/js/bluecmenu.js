function JsXMenu(ContainerId){
	var objMenuPanel = document.createElement("div");
	objMenuPanel.Instance = this;
	objMenuPanel.className = "menuPanel";
	/*
	objDivider = document.createElement("span");
	objDivider.className = "menuDivider";
	objMenuPanel.appendChild(objDivider);
	*/

	this.xFix = -3;
	this.yFix = -1;

	this.MenuPanel = objMenuPanel;
	this.SelectedItems = new Array();
	this.popped = false;
	this.blnClickOutMenu = false;
	
	var objContainer = document.getElementById(ContainerId);
	if(objContainer){
		objContainer.appendChild(objMenuPanel);
	}else{
		document.body.appendChild(objMenuPanel);
	}

	/*
	window.onload = function(){
		var objContainer = document.getElementById(ContainerId);
		if(objContainer){
			objContainer.appendChild(objMenuPanel);
		}else{
			document.body.appendChild(objMenuPanel);
		}
	}
	*/
	document.onclick = function(){
		if(objMenuPanel.Instance.blnClickOutMenu){
			objMenuPanel.Instance.HideItems();
			objMenuPanel.Instance.popped = false;
		}
		objMenuPanel.Instance.blnClickOutMenu = true;
	}

	this.createMenu = function(strMenuText,blnEnabled,width,url,target){
		var objMenu = document.createElement("span");

		objMenu.Instance = this;
		objMenu.type = "MENU";
		objMenu.Enabled = blnEnabled&&(width>0);
		objMenu.url = url;
		objMenu.target = target;

		objMenu.ParentItem = null;
		objMenu.ParentItems = new Array();
		objMenu.ItemPanel = null;

		objMenu.PanelWidth = width;
		objMenu.innerHTML = strMenuText;
		if(objMenu.Enabled){
			objMenu.className = "menu";
		}else{
			objMenu.className = "menuDisabled";
		}

		objMenu.onmouseover = function(){
			if(this.Enabled){
				if(this.Instance.popped){
					var exist = false;
					for(var i=0;i<this.Instance.SelectedItems.length;i++){
						if(this.Instance.SelectedItems[i] == this){
							exist = true;
							break;
						}
					}
					if(!exist){
						this.Instance.HideItems(); //hide all selected items
						this.Instance.SelectedItems = this.ParentItems.concat(this); //reset selected items
						this.Instance.ShowItems(); //show all selected items
					}
				}else{
					this.className = "menuOver";
				}
			}else{
				this.className = "menuDisabledOver";
			}
		}
		objMenu.onmouseout = function(){
			if(this.Enabled){
				if(this.Instance.popped){
					this.className = "menuDown";
				}else{
					this.className = "menu";
				}
			}else{
				this.className = "menuDisabled";
			}
		}
		objMenu.onmousedown = function(){
			if(this.Enabled){
				this.className = "menuDown";
			}
		}
		objMenu.onclick = function(){
           if(this.Enabled){
				if(this.Instance.popped){
					this.Instance.HideItems();
				}else{
					this.Instance.SelectedItems = this.ParentItems.concat(this);
					this.Instance.ShowItems();
					if(this.Items.length==0){
 					  this.Instance.doCmd(this.url,this.target,this.innerText);
					  this.Instance.popped = true;
					  this.Instance.HideItems()
					}
				}
				this.Instance.popped = !this.Instance.popped;
			}
			this.Instance.blnClickOutMenu = false;
		}
		
		objMenu.createMenuItem = function(strText,strCmd,strTar,blnEnabled,width,icon){
			return this.Instance.createMenuItem(this,strText,strCmd,strTar,blnEnabled,width,icon);
		}
		
		objMenu.createSeparator = function(){
			return this.Instance.createSeparator(this);
		}

		this.AddMenu(objMenu);

		return objMenu;
	}

	this.createMenuItem = function(objMenu,strText,strCmd,strTar,blnEnabled,width,icon){
		//var objMenuItem = document.createElement("div");
		//ttang start
		var objMenuItem = document.createElement("td");
		//ttang end

		objMenuItem.Instance = this;
		objMenuItem.type = "MENU_ITEM";

		objMenuItem.Enabled = blnEnabled;
		objMenuItem.PanelWidth = width;
		objMenuItem.innerHTML = strText;

		//objMenuItem.Text = strText;
		objMenuItem.Cmd = strCmd;
		objMenuItem.target = strTar;
		if(objMenuItem.Enabled){
			objMenuItem.className = "menuItem";
		}else{
			objMenuItem.className = "menuItemDisabled";
		}
		//objMenuItem.noWrap = true;

		if(icon){
			objMenuItem.style.backgroundImage = "url(" + icon + ")";
			objMenuItem.style.backgroundRepeat = "no-repeat";
			objMenuItem.style.backgroundPosition = "5px center";
		}
		
		objMenuItem.onmouseover = function(){
			if(this.Enabled){
				var exist = false;
				for(var i=0;i<this.Instance.SelectedItems.length;i++){
					if(this.Instance.SelectedItems[i] == this){
						exist = true;
						break;
					}
				}
				if(!exist){
					this.Instance.HideItems(); //hide all selected items
					this.Instance.SelectedItems = this.ParentItems.concat(this); //reset selected items
					this.Instance.ShowItems(); //show all selected items
				}
			}else{
				for(var i=0;i<this.ParentItem.Items.length;i++){
					if(this.ParentItem.Items[i].type == "MENU_ITEM"){
						if(this.ParentItem.Items[i].Enabled)
							this.ParentItem.Items[i].className = "menuItem";
						else
							this.ParentItem.Items[i].className = "menuItemDisabled";
					}
				}
				this.className = "menuItemDisabledOver";
				this.Instance.SelectedItems = this.ParentItems.concat(this);
			}
		}
		objMenuItem.onmouseout = function(){
			//objMenuPanel.Instance.HideItems();
			if(this.Enabled){
				window.status = "";
			}else{
				this.className = "menuItemDisabled";
			}
		}
		objMenuItem.onmousedown = function(){
			if(this.Enabled){
				this.className = "menuItemDown";
			}
		}
		objMenuItem.onclick = function(){
			if(this.Enabled){
				if(this.Cmd){
					this.Instance.doCmd(objMenuItem.Cmd,objMenuItem.target,objMenuItem.innerText);
					this.Instance.HideItems();
					this.Instance.popped = false;
				}
			}
			this.Instance.blnClickOutMenu = false;
		}
		objMenuItem.createMenuItem = function(strText,strCmd,strTar,blnEnabled,width,icon){
			var objSubMenuItem = this.Instance.createMenuItem(this,strText,strCmd,strTar,blnEnabled,width,icon);
			
			this.Instance.AddMenuItem(objMenuItem,objSubMenuItem);
			return objSubMenuItem;
		}
		objMenuItem.createSeparator = function(){
			return this.Instance.createSeparator(this);
		}

		this.AddMenuItem(objMenu,objMenuItem);

		return objMenuItem;
	}

	this.createSeparator = function(objMenu){
		//var separator = document.createElement("div");
		//ttang start
		var separator = document.createElement("td");
		//ttang end

		separator.Instance = this;
		//separator.innerHTML = "<hr style='width:100%;border-width:1px;border-style: solid;border-color: #808080 #ffffff #ffffff #ffffff;'>";
		//separator.innerHTML = "<hr>";
		separator.innerHTML = "<div tabIndex=0 style='margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;color:#808080;border-style:solid;border-width:1px;border-color: #808080 #ffffff #ffffff #ffffff;'></div>";
		separator.className = "separator";
		separator.type = "SEPARATOR";
		separator.onclick = function(){
			this.Instance.blnClickOutMenu = false;
		}
		this.AddMenuItem(objMenu,separator);
		return separator;
	}

	this.AddMenu = function(objMenu){
		//加入菜单
		objMenu.Items = new Array();
		objMenu.ParentItem = this.MenuPanel;
		objMenu.ParentItems = new Array();
		objMenu.ItemPanel = null;

		this.MenuPanel.appendChild(objMenu);
	}
	/*
	this.AddMenuItem = function(objMenu,objMenuItem){
		//如果没有 ItemPanel 则创建之
		if(!objMenu.ItemPanel || objMenu.ItemPanel == null){
			var objItemPanel = document.createElement("div");
			objItemPanel.className = "menuItemPanel";
			objItemPanel.style.display = "none";
			if(objMenu.PanelWidth && objMenu.PanelWidth > 0){
				objItemPanel.style.width = objMenu.PanelWidth;
			}
			//
			objMenu.ItemPanel = objItemPanel;

			this.MenuPanel.appendChild(objMenu.ItemPanel);

			//加入箭头
			if(objMenu.type == "MENU_ITEM"){
				var objItemArrow = document.createElement("span");
				objItemArrow.className = "menuItemArrow";
				objMenu.appendChild(objItemArrow);
				objMenu.ItemArrow = objItemArrow;
			}
		}
		//加入菜单项
		objMenu.Items.push(objMenuItem);

		objMenuItem.ParentItem = objMenu;
		objMenuItem.ParentItems = objMenu.ParentItems.concat(objMenu);

		objMenuItem.Items = new Array();
		objMenuItem.ItemPanel = null;

		objMenu.ItemPanel.appendChild(objMenuItem);
	}
	*/

	//ttang start
	this.AddMenuItem = function(objMenu,objMenuItem){
		//如果没有 ItemPanel 则创建之
		if(!objMenu.ItemPanel || objMenu.ItemPanel == null){
			var objItemPanel = this.createItemPanel(objMenu.PanelWidth);

			objMenu.ItemPanel = objItemPanel;

			this.MenuPanel.appendChild(objMenu.ItemPanel);

			//加入箭头
			if(objMenu.type == "MENU_ITEM"){
				var objItemArrow = document.createElement("span");
				objItemArrow.className = "menuItemArrow";
				objMenu.appendChild(objItemArrow);
				objMenu.ItemArrow = objItemArrow;
			}
		}
		//加入菜单项
		objMenu.Items.push(objMenuItem);
		objMenuItem.ParentItem = objMenu;
		objMenuItem.ParentItems = objMenu.ParentItems.concat(objMenu);
		objMenuItem.Items = new Array();
		objMenuItem.ItemPanel = null;

		//ttang start
		objMenu.ItemPanel.appendItem(objMenuItem);
		//ttang end
	}
	this.createItemPanel = function(panelWidth){
		var objItemPanel = document.createElement("div");
		objItemPanel.className = "menuItemPanel";
		objItemPanel.style.display = "none";

		var tbl = document.createElement("TABLE");
		var tBody = document.createElement("TBODY");
		tbl.appendChild(tBody);
		tbl.style.width = "100%";
		tbl.style.padding = 0;
		tbl.style.borderWidth = 0;
		tbl.cellSpacing = 0;
		tbl.cellPadding = 0;

		if(panelWidth && panelWidth > 0){
			objItemPanel.style.width = panelWidth;
		}

		objItemPanel.ItemTable = tBody;

		objItemPanel.appendItem = function(objMenuItem){
			var row = document.createElement("tr");
			row.appendChild(objMenuItem);
			this.ItemTable.appendChild(row);
		}

		objItemPanel.appendChild(tbl);

		return objItemPanel;
	}
	//ttang end

	this.ShowItems = function(){
		//show all selected items
		for(var i=0;i<this.SelectedItems.length;i++){
			var objParent = this.SelectedItems[i];
			if(objParent.type == "MENU"){
				objParent.className = "menuDown";
			}else{
				objParent.className = "menuItemOver";
			}
			if(objParent.ItemArrow){
				objParent.ItemArrow.className = "menuItemArrowOver"
			}
			if(objParent.ItemPanel){
				var itemPos = this.Pos(objParent);
				if(objParent.type == "MENU"){
					objParent.ItemPanel.style.left = itemPos[0];
					objParent.ItemPanel.style.top = itemPos[1] + objParent.offsetHeight + this.yFix;
				}else{
					objParent.ItemPanel.style.left = itemPos[0] + objParent.offsetWidth + this.xFix;
					objParent.ItemPanel.style.top = itemPos[1];
				}
				objParent.ItemPanel.style.display = "block";
			}
		}
	}

	this.HideItems = function(){
		//hide all selected items
		for(var i=0;i<this.SelectedItems.length;i++){
			if(this.SelectedItems[i].ItemArrow){
				this.SelectedItems[i].ItemArrow.className = "menuItemArrow"
			}
			if(this.SelectedItems[i].type == "MENU")
				if(this.SelectedItems[i].Enabled){
					this.SelectedItems[i].className = "menu";
				}else{
					this.SelectedItems[i].className = "menuDisabled";
				}
			else{
				if(this.SelectedItems[i].Enabled){
					this.SelectedItems[i].className = "menuItem";
				}else{
					this.SelectedItems[i].className = "menuItemDisabled";
				}
			}
			if(this.SelectedItems[i].ItemPanel)
				this.SelectedItems[i].ItemPanel.style.display = "none";
		}
	}

	this.doCmd = function(strCmd,strTar,caption){
	  if(strCmd!=""){
		if (strCmd.indexOf("link:") == 0){
		  window.open(strCmd,strTar,''); 
		}else {
			if (strCmd.indexOf("js:") == 0) {
				eval(strCmd.substr(3));
			}
			else {
              if(typeof(OnOpenTarget)!="undefined"&&OnOpenTarget!=null)
			    strTar = OnOpenTarget(caption,strCmd,strTar);
              if(strTar!=""&&(strTar.substring(0,1)=="A"||strTar.substring(0,1)=="B")){
				var awh = strTar.substring(1,100).split(",");
				if(strTar.substring(0,1)=="A")
                  window.showModalDialog(strCmd,window,
				                         "dialogHeight:"+awh[1]+"px;dialogWidth:"+awh[0]+"px;status:0;help:0;scroll:off;");
				else{
				  var x = (screen.availWidth - awh[0])/2;
                  var y = (screen.availHeight - awh[1])/2-8;
                  window.open(strCmd,"_blank",
			                  "alwaysRaised=yes,status=1,left="+x+",top="+y+",width="+awh[0]+",height="+awh[1]); 
				}
			  }else
			    if(strTar!="opened") {
			      var satt = "alwaysRaised=yes,status=1,left=0,top=0,width="+(screen.availWidth-10)+
                             ",height="+(screen.availHeight-48);
			      window.open(strCmd,strTar,satt); 
			    }
			//alert(strCmd+strTar);
			}
		}
	  }
	}

	this.Pos = function(obj){
		var left = 0;
		var top = 0;
		if(obj.offsetParent){
			while(obj.offsetParent){
				left += obj.offsetLeft;
				top += obj.offsetTop;
				obj = obj.offsetParent;
			}
		}else if(obj.x){
			left += obj.x;
			top += obj.y;
		}
		return ([left,top]);
	}
}