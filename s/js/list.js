jQuery(function($) {
    $.datepicker.regional['zh-CN'] = {
        clearText: '清除',
        clearStatus: '清除已选日期',
        closeText: '关闭',
        closeStatus: '不改变当前选择',
        prevText: '<上月',
        prevStatus: '显示上月',
        prevBigText: '<<',
        prevBigStatus: '显示上一年',
        nextText: '下月>',
        nextStatus: '显示下月',
        nextBigText: '>>',
        nextBigStatus: '显示下一年',
        currentText: '今天',
        currentStatus: '显示本月',
        //monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNames: ['-01', '-02', '-03', '-04', '-05', '-06', '-07', '-08', '-09', '-10', '-11', '-12'],
        //monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        //monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        monthStatus: '选择月份',
        yearStatus: '选择年份',
        weekHeader: '周',
        weekStatus: '年内周次',
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        dayStatus: '设置 DD 为一周起始',
        dateStatus: '选择 m月 d日, DD',
        dateFormat: 'yy-mm-dd',
        firstDay: 1,
        changeYear: true,
        changeMonth: true,
        showMonthAfterYear: true,
        initStatus: '请选择日期',
        
        isRTL: false,
        maxDate: 0,
        minDate:"-2y",
        duration:0,
        altFormat: 'yyyy-mm-dd'
    };
    $.datepicker.setDefaults($.datepicker.regional['zh-CN']);
});
// By Raoming
var gCurrentRecordCount = 0;
var gAdvancedSearchWidth = 475;

var jqParam = {
    url: "",
    caption: "",
    sortname: '',
    sortorder: "",
    datatype: "json",
    colNames: [],
    colModel: [],
    //multiselect: true, 	

    rowNum: 15,
    autowidth: true,
    rownumbers: true,
    forceFit: true,
    height: 'auto',
    //height:240,
    hidegrid: false,

    rowList:[10,15,20,50,100,200],
    pager: '#dataPager',
    viewrecords: true,
    altRows: true,
   		    
    //editurl:"",
    jsonReader: {
        repeatitems: false,
        id: "key_id"
    },
    beforeRequest: function() {
        jQuery("#dataList").jqGrid('setGridParam', { url: gCurrentListUrl.replace('{RecordsCount}', gCurrentRecordCount) });
    },
    gridComplete: function() {
        window.setTimeout(function() {
            gCurrentRecordCount = jQuery("#dataList").jqGrid('getGridParam', "records");
        }, 500);
    },
    loadError: function(xhr, st, err) {
    if (xhr.status == 403) {
        top.location.replace(xhr.responseText);
    }
    

    }
};

if (screen.availHeight < 700) {
    jqParam.rowNum = 10;
}
else if (screen.availHeight < 900) {
    jqParam.rowNum = 15;
}
else {
    jqParam.rowNum = 20;
}





function InitGrid(jqParam) {
    if (gServerListUrl.indexOf('{RecordsCount}') == -1) {
        if(gServerListUrl.indexOf('?')==-1) {
            gServerListUrl = gServerListUrl + "?RecordsCount={RecordsCount}";
        }
        else {
            gServerListUrl = gServerListUrl + "&RecordsCount={RecordsCount}";
        }
        
        
    }
    
    window.gCurrentListUrl = gServerListUrl;
    jQuery("#dataList").jqGrid(jqParam);

    //$('#divSearch').addClass('ui-state-default').insertAfter('#gview_dataList div:first');
    $('#divSearch').insertAfter('#gview_dataList div:first');

    var g_resizeTime = 0;
    if (jqParam.autowidth) {
        $(window).resize(function() {
            //Changed by RaoMing 2010-5-26 修正IE下缩放问题。
            if (g_resizeTime) clearTimeout(g_resizeTime);

            g_resizeTime = setTimeout(function() {
                var wd = $('body').width() - 15;
                if ($.browser.msie && $.browser.version == "6.0") {
                    var oldWidth = $("#gbox_dataList").width();
                    if (oldWidth < wd) {
                        jQuery("#dataList").jqGrid().setGridWidth(wd);
                    }
                }
                else {
                    jQuery("#dataList").jqGrid().setGridWidth(wd);
                }


            }, 200);

        });
    }

    $("#divAdvancedSearch").dialog('option', 'width', gAdvancedSearchWidth);
    $('#toExcel').click(function() {
        var excelUrl = jQuery("#dataList").jqGrid('getGridParam', 'url') + "&toexcel=true";
        var postData = jQuery("#dataList").jqGrid('getGridParam', 'postData');
        var urlParams = [];
        urlParams.push(excelUrl);
        urlParams.push("sidx=" + postData.sidx);
        urlParams.push("sord=" + postData.sord);        
        urlParams.push("page=1");
        urlParams.push("rows=1000");
        urlParams.push("_search=false");
        urlParams.push("nd=1273315672479");

        var url = urlParams.join("&");

        //alert(excelUrl);
        //alert(postData);
        location.replace(url);

    }).addClass('ui-button ui-state-default ui-corner-all').hover(
			function() {

			    $(this).addClass("ui-state-hover");
			    //alert('hov');
			},
			function() {
			    $(this).removeClass("ui-state-hover");
			}
		).mousedown(function() {
		    $(this).addClass("ui-state-active");
		}).mouseup(function() {
		    $(this).removeClass("ui-state-active");
		});
}


/* 查询 */
function DoAdvancedSearch() {
    var searchStr = [];
    $("#divAdvancedSearch input").each(function() {
        var id = this.id;
        var value = this.value;
        if (id && value) {
            if (this.type.toString() == "checkbox") {
                if (this.checked.toString() == "true") {
                    value = 1;
                }
                else {
                    value = 0;
                }
                searchStr.push("&", id, "=", escape(value));
                return;
            }
            else {
                searchStr.push("&", id, "=", escape(value));
            }
        }
    });

    $("#divAdvancedSearch select").each(function() {
        var id = this.id;
        var value = this.value;
        if (id && value) {
            if (value.toLowerCase() != "null") {
                searchStr.push("&", id, "=", escape(value));
            }
        }
    });

    gCurrentListUrl = gServerListUrl + searchStr.join("");
    gCurrentRecordCount = 0;
    jQuery("#dataList").jqGrid('setGridParam', { url: gCurrentListUrl, page: 1 }).trigger("reloadGrid");
}

$("#divAdvancedSearch input,#divAdvancedSearch select").keypress(function(e) {
    if (e.keyCode == 13) {
        DoAdvancedSearch();
    }

});

$("#divSearch input,#divSearch select").keypress(function(e) {
    if (e.keyCode == 13) {
        $('#btnSearch').click();
    }

});

$('#btnSearch').click(
    function() {
        var searchStr = [];
        $("#divSearch input,#divSearch select").each(function () {
            var id = this.id;
            var value = this.value;
            var defaultText = $(this).attr("_defaultText");
            if (defaultText == value) {
                value = "";
            }
            if (id && value) {
                searchStr.push("&", id, "=", escape(value));
            }

        });
        gCurrentListUrl = gServerListUrl + searchStr.join("");
        gCurrentRecordCount = 0;
        jQuery("#dataList").jqGrid('setGridParam', { url: gCurrentListUrl, page: 1 }).trigger("reloadGrid");

    });

    $("#divSearch input").each(function() {
    var defaultText = $(this).attr("_defaultText");

    if (defaultText) {
        $(this).addClass('defaultText');
            this.value = $(this).attr("_defaultText");
            $(this).focus(function() {
            $(this).removeClass('defaultText');
                if (this.value == $(this).attr("_defaultText")) {
                    this.value = "";
                }


            }).blur(function() {
                if (this.value == "") {
                    this.value = $(this).attr("_defaultText");
                    $(this).addClass('defaultText');
                }
            });
        }
        //if()

    });

    $("#divAdvancedSearch").dialog({

    autoOpen: false,
    resizable: false,
    bgiframe:true,
    beforeclose: function() { $('input.selectdate').datepicker("hide"); },
    buttons: {

    "关闭对话框": function() {    
        $(this).dialog("close");
        
        },
        "查询": function() {
            DoAdvancedSearch();

        }
    }
});


$("#btnAdvancedSearch").click(function() { $('#divAdvancedSearch').dialog('open'); });

//jQuery('button').addClass('ui-button ui-state-default ui-corner-all').hover(
//			function() {

//			    $(this).addClass("ui-state-hover");
//			    //alert('hov');
//			},
//			function() {
//			    $(this).removeClass("ui-state-hover");
//			}
//		).mousedown(function() {
//		    $(this).addClass("ui-state-active");
//		}).mouseup(function() {
//		    $(this).removeClass("ui-state-active");
//		});

jQuery('button').button();



$('input.selectdate').datepicker();


function ShowWindow(id, url, title, width, height, modal) {
    var frameId = id + "_iframe";
    if (modal) {
        modal = true;
    }
    else {
        modal = false;
    }
    
    var iframe = document.getElementById(frameId);
    if (!iframe) {
        $("<div id='" + id + "' title='" + title + "'><iframe frameborder='0' SCROLLING='0'  height='" + height + "' width='" + width + "' src='" + url + "' id='" + frameId + "'></iframe></div>").appendTo('body').dialog(
        {
            width: (width + 40),
            height: (height + 50),
            resizable: false,
            modal: modal,
            bgiframe:modal

        }
        );
    }
    else {
        iframe.src = url;
        $("#" + id).dialog("open");
    }

}

function RefreshList() {
    gCurrentRecordCount = 0;
    jQuery("#dataList").trigger("reloadGrid");
}


