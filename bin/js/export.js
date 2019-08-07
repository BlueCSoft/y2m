function __Cleanup() { 
 window.clearInterval(__idTmr); 
 CollectGarbage(); 
} 

function _$DataSetToExcel(DataSet){
	 __xmlHttp._ExcelApp = new ActiveXObject("Excel.Application");
  try{
   if(__xmlHttp._ExcelApp==null)
    __xmlHttp._ExcelApp = new ActiveXObject("Excel.Application");
  }catch(e){
   __xmlHttp._ExcelApp = null;	  
   alert("无法打开Excel.");
   return false;
  }

  var ExcelApp = __xmlHttp._ExcelApp;
  ExcelApp.DisplayAlerts = false;
  ExcelBook = ExcelApp.WorkBooks.Add();
  ExcelSheet = ExcelBook.Worksheets(1);  
  
  var fieldCount = DataSet.fields.length;
  var recordCount = DataSet.getRecordCount();
  var cell = null;
  
  for(var I=1;I<=fieldCount;I++){
   //ExcelSheet.Columns(I).ColumnWidth;
   cell = ExcelSheet.cells(1,I);
   cell.HorizontalAlignment = 3;
   cell.Value = DataSet.fields[I-1].displayLabel;
  }

  var nRecNo = DataSet.pData.absolutePosition;
  for(var I=1;I<=recordCount;I++){
	DataSet.pData.absolutePosition = I;
	
   for(var J=1;J<=fieldCount;J++){
    cell = ExcelSheet.cells(I+1,J);
    cell.NumberFormatLocal = "@";
    cell.Value = DataSet.fields[J-1].getDisplayText();
   }
  }
  DataSet.pData.absolutePosition = nRecNo;
  ExcelApp.visible = true;
  
  __idTmr = window.setInterval("__Cleanup();",1000); 
}

function _$GridToExcel(grid){
	
  __xmlHttp._ExcelApp = new ActiveXObject("Excel.Application");
  
  try{
   if(__xmlHttp._ExcelApp==null)
    __xmlHttp._ExcelApp = new ActiveXObject("Excel.Application");
  }catch(e){
   __xmlHttp._ExcelApp = null;	  
   alert("无法打开Excel.");
   return false;
  }

  var ExcelApp = __xmlHttp._ExcelApp;
  ExcelApp.DisplayAlerts = false;
  ExcelBook = ExcelApp.WorkBooks.Add();
  ExcelSheet = ExcelBook.Worksheets(1);  
  
  var colCount = grid.items.count;
  var DataSet = grid.dataset; 
  var recordCount = DataSet.getRecordCount();
  var cell = null,column = null;
  
  for(var I=0;I<colCount;I++){
   column = grid.columns[I];	  
   ExcelSheet.Columns(I+1).ColumnWidth = column.width/8;
   cell = ExcelSheet.cells(1,I+1);
   cell.HorizontalAlignment = 3;
   cell.Value = column.title.caption;
   cell.Font.Size = 9;
  }

  var nRecNo = DataSet.pData.absolutePosition;
  for(var I=1;I<=recordCount;I++){
	DataSet.pData.absolutePosition = I;
	
   for(var J=1;J<=colCount;J++){
    cell = ExcelSheet.cells(I+1,J);
    cell.NumberFormatLocal = "@";
	var column = grid.columns[J-1];
	
    if(column.alignment=="center")
	 cell.HorizontalAlignment = 3;
	else 
	 if(column.alignment=="right")
	  cell.HorizontalAlignment = 4;
	  
    cell.Value = column.field.getDisplayText();
	cell.Font.Size = 9;
   }
  }
  DataSet.pData.absolutePosition = nRecNo;
  ExcelApp.visible = true;
  
  __idTmr = window.setInterval("__Cleanup();",1000); 
}
