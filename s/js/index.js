





//?RecordsCount={RecordsCount}
var gServerListUrl = "/json?RecordsCount={RecordsCount}";

jqParam.caption = "<b>网址列表</b>";
jqParam.colNames = ['title', 'createdate↓', 'webname'];
jqParam.colModel = [
   //		{ name: 'title', index: 'title', width: 300, sortable: false,formatter: urlFormat },
   		{ name: 'url', index: 'url', width: 300, sortable: false,formatter: urlFormat,cellattr:urlAttr },
   	//	{ name: 'url', index: 'url', width: 180, sortable: false,hidden:true },
   		{ name: 'createdate', index: 'createdate', sortable: false, width: 50,formatter:dateformatter },
   		{ name: 'pid', index: 'pid', sortable: false, width: 100,formatter:pidformatter }
//   		{ name: 'color', index: 'color', sortable: false, width: 50 }

   	];
   	jqParam.multiselect = true;
//jqParam.sortname = "FULLNAME";
//jqParam.sortorder = "desc";


InitGrid(jqParam);
jqParam = null;
function urlFormat(cellvalue, options, rowObject) {
    var url;
	var ck='';
    if(rowObject['click']=='0')
    {
        url='/click?id='+rowObject["key_id"]+'&url='+encodeURIComponent(rowObject["url"]);

    }
    else
    {
        url = rowObject['url'];
        ck='click'
    }
	var link = "<a href='"+url+"' class='"+ck+"' onclick='urlclick("+rowObject["key_id"]+");return true;' target='_blank'>"+rowObject['title']+ "</a>";
	return link;
    //return "<b>"+link+"</b>";

}
function urlAttr(rowId,val,rawObject,cm,rdata)
{
	var css;
	if(rawObject['reader']=="True")
	{
		css="style='font-weight:normal;";
	}
	else
	{
		css="style='font-weight:bold;";
	}
	return css+"color:"+rawObject["color"]+"'";
}
function pidformatter(cellvalue, options, rowObject)
{
	return webInfos[cellvalue];
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
//  ---menu
    $('#divDataList').jeegoocontext('menu',{'onSelect':function(){
    //	switch($(this).attr('id'))
    	var ids = jQuery("#dataList").jqGrid('getGridParam', 'selarrrow');
    	if(ids.length==0) return;
    	var type=$(this).attr('id');
    	switch(type)
    	{
    		case 'asreader':
    			asreader(ids);
    		break;
    		case 'mark_none':
    		case 'mark_red':
    		case 'mark_green':
    		case 'mark_blue':
    			var mtype = type.split('_')[1];
    			mark(ids,mtype);
    			break;
    	}
    }});

function asreader(ids)
{
	$.get('/mark?ids='+ids,{reader:1},function(msg){$.sticky("设置已读状态："+msg);
		for (var i = 0; i < ids.length; i++) {
			$("#dataList").jqGrid("setCell", ids[i],'url',"",{'font-weight':'normal'});
		}

	});
	//alert("asreader:"+ids);
}

function mark(ids,mtype)
{
	if(mtype=='none') mtype='';
	$.get('/mark?ids='+ids,{type:mtype},function(msg){$.sticky("设置颜色："+msg);
	            for (var i = 0; i < ids.length; i++) {

					$("#dataList").jqGrid("setCell", ids[i],'url',"",{'color':mtype});

            }

	});

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


$("#divSearch select").change(function(e) {
        $('#btnSearch').click();
});
