





//?RecordsCount={RecordsCount}
var gServerListUrl = "/webjson?RecordsCount={RecordsCount}";

jqParam.caption = "<b>网站列表</b>";
jqParam.colNames = ['title','url', 'createdate↓','geturldate','geturlcount','option'];
jqParam.colModel = [
   		{ name: 'name', index: 'name', width: 200, sortable: false,formatter: urlFormat },  
   		{ name: 'url', index: 'url', width: 300, sortable: false},   	
   	//	{ name: 'url', index: 'url', width: 180, sortable: false,hidden:true },
   		{ name: 'createdate', index: 'createdate', sortable: false, width: 50,formatter:dateformatter },
   		{ name: 'geturldate', index: 'geturldate', sortable: false, width: 50,formatter:dateformatter },
   		{ name: 'geturlcount', index: 'geturlcount', width: 30, sortable: false},   	
   		{ name: 'key_id', index: 'key_id', width: 100, sortable: false,formatter:keyformatter}
//   		{ name: 'color', index: 'color', sortable: false, width: 50 }
   		
   	];
   	jqParam.multiselect = true;
//jqParam.sortname = "FULLNAME";
//jqParam.sortorder = "desc";


InitGrid(jqParam);
jqParam = null;
function urlFormat(cellvalue, options, rowObject) {
	var link = "<a href='"+rowObject["url"]+"' onclick='urlclick("+rowObject["key_id"]+");return true;' target='_blank'>"+rowObject['name']+"</a>";
	return link;
    //return "<b>"+link+"</b>";

}

function keyformatter(cellvalue, options, rowObject)
{
	var edit="<a href='/edit?id="+cellvalue+"' target='_blank'>edit</a> <a href='#' onclick='deleteweb("+cellvalue+");return false;'>delete</a> <a href='/get?id="+cellvalue+"' target='_blank'>get</a>";
	return edit;
}

function dateformatter(cellvalue, options, rowObject)
{
	return	moment.utc(cellvalue,'YYYY-MM-DDTHH:mm:ss').fromNow();
}

function urlclick(id)
{
	//console.info("click",id);
}

function OperatorFormat(cellvalue, options, rowObject) {
    return "<a  href='/edit?id=" + cellvalue + "' target='_blank'>编辑</a>";
}
//  var ids = jQuery("#dataList").jqGrid('getGridParam', 'selarrrow');

$("#btnAdd").click(function(){
	open("/edit");
});

function deleteweb(id)
{
	if(confirm('确定要删除此网站吗？'))
	{
		$.get('/deleteweb?id='+id,{},function(data){
			gCurrentRecordCount = 0;
    		jQuery("#dataList").trigger("reloadGrid");
			alert('delete :'+data);
		});
	}
}


//hotkey
$(document).bind('keydown', 'left', function(){  $("#prev_dataPager span").click();});
$(document).bind('keydown', 'right', function(){ $("#next_dataPager span").click();  });

$(document).bind('keydown', 'r', function(evt){ 
	var ids = jQuery("#dataList").jqGrid('getGridParam', 'selarrrow');
	evt.stopPropagation( );  
    evt.preventDefault( );
	if(ids.length==0) 
	{
		return false; 
	}
	mark(ids,'red');


	return false;
});

$(document).bind('keydown', 'g', function(evt){ 
	var ids = jQuery("#dataList").jqGrid('getGridParam', 'selarrrow');
	evt.stopPropagation( );  
    evt.preventDefault( );
	if(ids.length==0) 
	{
		return false; 
	}
	mark(ids,'green');


	return false;
});

$(document).bind('keydown', 'b', function(evt){ 
	var ids = jQuery("#dataList").jqGrid('getGridParam', 'selarrrow');
	evt.stopPropagation( );  
    evt.preventDefault( );
	if(ids.length==0) 
	{
		return false; 
	}
	mark(ids,'blue');


	return false;
});

$(document).bind('keydown', 'n', function(evt){ 
	var ids = jQuery("#dataList").jqGrid('getGridParam', 'selarrrow');
	evt.stopPropagation( );  
    evt.preventDefault( );
	if(ids.length==0) 
	{
		return false; 
	}
	mark(ids,'none');


	return false;
});

$(document).bind('keydown', 'e', function(evt){ 
	var ids = jQuery("#dataList").jqGrid('getGridParam', 'selarrrow');
	evt.stopPropagation( );  
    evt.preventDefault( );
	if(ids.length==0) 
	{
		return false; 
	}
	asreader(ids);


	return false;
});


$(document).bind('keydown', 'a', function(evt){

 var ck=$("#cb_dataList")[0];
 ck.checked=!ck.checked; 
 

	evt.stopPropagation( );  
    evt.preventDefault( );

setTimeout(function(){
//var ck=$("#cb_dataList")[0];
// ck.checked=!ck.checked;  
	$("#cb_dataList").click();
	setTimeout(function(){ var ck=$("#cb_dataList")[0];
 ck.checked=!ck.checked; },50);
},50);
    return false;
     });
