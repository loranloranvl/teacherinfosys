var __SPINNER__ = '<i class="am-icon-spinner \
	am-icon-spin"></i>';
var  __URL__ = 'https://tis.hzcloudservice.com/api/v1/';
var  __DURL__ = 'https://tis.hzcloudservice.com/';
var __TOKEN__ = localStorage.getItem('token');
var __INFO__;
var info, info_level;

var czy_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NywidWlkIjoxNjI3MTExMCwibmFtZSI6Ilx1OTY0OFx1NGUyZFx1NmUwYSIsIm9wZW5pZCI6Im9Ua3FJMFpkZm44b1NKcG5aQ0FzNVJXcjU1YXciLCJzZXgiOjEsInBob25lIjoiMTg3NjcxMjAwMTAiLCJlbWFpbCI6IjExOTQ0NTI5NDBAcXEuY29tIiwidW5pdCI6Ilx1N2Y1MVx1N2VkY1x1N2E3YVx1OTVmNFx1NWI4OVx1NTE2OFx1NWI2Nlx1OTY2Mlx1MzAwMVx1NmQ1OVx1NmM1Zlx1NGZkZFx1NWJjNlx1NWI2Nlx1OTY2MiIsImdyYWRlIjoyMDE2LCJtYWpvciI6Ilx1NGZlMVx1NjA2Zlx1NWI4OVx1NTE2OCIsImNsYXNzIjoxNjI3MzYxMSwidGVhY2hlcl9pZCI6NSwiY3JlYXRlZF9hdCI6IjIwMTgtMDUtMDcgMTM6NTY6NTIiLCJ1cGRhdGVkX2F0IjoiMjAxOC0wOS0xMSAyMDowOToyNSJ9.i2KFglsGEiPMJE5DeCIL74mXvQ3lfZuaZKlqbt_7TnI'
var hwt_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NCwidWlkIjo0MTgwNCwibmFtZSI6Ilx1ODBlMVx1NGYxZlx1OTAxYSIsIm9wZW5pZCI6Im9Ua3FJMGRFS2pxMjRRbDlYQTRWWlJKS2hfQmMiLCJzZXgiOjEsInVuaXQiOiJcdTdmNTFcdTdlZGNcdTdhN2FcdTk1ZjRcdTViODlcdTUxNjhcdTViNjZcdTk2NjJcdTMwMDFcdTZkNTlcdTZjNWZcdTRmZGRcdTViYzZcdTViNjZcdTk2NjIiLCJlbWFpbCI6Imh3dEBoZHUuZWR1LmNuIiwicGhvbmUiOiIxMzUxNjcxOTExOSIsImNyZWF0ZWRfYXQiOiIyMDE3LTEwLTE2IDE0OjQ3OjM5IiwidXBkYXRlZF9hdCI6IjIwMTgtMDktMTQgMTA6MTA6NTQifQ.9HPvNROSoccsEzAddeL8tAdkOAgik_uIFXEJURCB23Q'

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

function islocalhost() {
	if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    	return true;
    else
    	return false;
}

function isWeixinBrowser() {
    var agent = navigator.userAgent.toLowerCase();
    if (agent.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

if (islocalhost() && location.href.split('/')[3] == 'manager') {
	// huweitong
	__TOKEN__ = hwt_token;
}

if (islocalhost() && location.href.split('/')[3] == 'client') {
	// chenzhongyuan
	__TOKEN__ = czy_token;
}

if (__TOKEN__) {
	__INFO__ = parseJwt(__TOKEN__)
}
/*
if (!isWeixinBrowser()) {
	info = JSON.parse(localStorage.info);
	info_level = info.info_level;
}
*/

// btn.onclick: disable it and send ajax request
function disableBtn(id) {
	var btn = $('#' + id);
	btn.html(__SPINNER__).attr('disabled', true);
}

// ajax.onsuccess: activate that btn
function activateBtn(id) {
	var btn = $('#' + id);
	btn.html(btn.attr('data-text'))
		.attr('disabled', false);
}

// call Handlebars to dynamically change contents 
// of #id with a given json data
// naming convention: <script> with Handlebars source code
// shall has an id of 'ht-' + targetid
function HDeploy(id, data) {
	var source = $('#ht-' + id).html();
	var template = Handlebars.compile(source);
	$('#' + id).html(template(data));
}

// convert URL parameters to a json
// this one is copied from stackoverflow ^_^
function getParam(url) {
	var search = (typeof url !== 'undefined') 
		? url.slice(url.indexOf('?') + 1)
		: location.search.substring(1);
	if (!search) 
		return false;
	return JSON.parse('{"' + decodeURI(search)
		.replace(/"/g, '\\"')
		.replace(/&/g, '","')
		.replace(/=/g,'":"') + '"}');
}

function deployPagi(data, callback, id) {
    var pagi = $('#pagi')
    pagi.find('.pagi-cur').text(data.current_page);

    // only show when data is correctly received
    // and there is more than 1 page
    if(data.data && data.last_page != 1) {
        pagi.show();
    } else {
        pagi.hide();
    }

    if (data.current_page == 1) {
        pagi.find('.pagi-first, .pagi-prev').hide();
    } else {
        pagi.find('.pagi-first, .pagi-prev').show();
    }

    if (data.current_page == data.last_page) {
        pagi.find('.pagi-next, .pagi-last').hide();
    } else {
        pagi.find('.pagi-next, .pagi-last').show();
    }

    if (data.current_page == 1 && data.last_page == 1) {
        pagi.find('.pagi-cur').hide();
    } else {
        pagi.find('.pagi-cur').show();
    }

    // remove all click event listeners bound by 
    // previous deployers then add our listeners
    pagi.find('div').off('click');
    pagi.find('.pagi-first').on('click', function() {
        pagi.find('.pagi-cur').html(__SPINNER__);
        callback(1, id);
    });
    pagi.find('.pagi-prev').on('click', function() {
        pagi.find('.pagi-cur').html(__SPINNER__);
        callback(data.current_page - 1, id);
    });
    pagi.find('.pagi-next').on('click', function() {
        pagi.find('.pagi-cur').html(__SPINNER__);
        callback(data.current_page + 1, id);
    });
    pagi.find('.pagi-last').on('click', function() {
        pagi.find('.pagi-cur').html(__SPINNER__);
        callback(data.last_page, id);
    });
}


// general ajax settings
var loader = 0;
function closeLoader() {
    layer.close(loader);
    loader = 0;
}
$.ajaxSetup({
    timeout: 10 * 60 * 1000,
    dataType: 'json',
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    headers: {
        Authorization: __TOKEN__
    },
    beforeSend: function() {
        if (!loader) {
            loader = layer.load();
        }
        setTimeout(closeLoader, 500)
    }
});


// general ajax success handler
$(document).ajaxSuccess(function(event, xhr, settings) {
	var rjson = xhr.responseJSON;
	if (rjson.status == 401 && !islocalhost()) {
		location.href = __URL__ + 'login/bind'
	} 

    if (rjson.status == 200) {
        console.log(settings.url, rjson.data);
    } else {
        console.log(settings.url, rjson);
		dialog.error(rjson.msg);
    }
});

// general ajax error handler
$(document).ajaxError(function( event, jqxhr, settings, thrownError ) {
	console.log(event, jqxhr, settings, thrownError);
    dialog.error(thrownError)
});

$(document).ajaxComplete(function() {
	closeLoader();
})

// handle redundant '/'
$.ajaxPrefilter(function( options ) {
	var url = options.url;
	options.url = __URL__ + (url[0] == '/' ? url.slice(1) : url);
});

$(document).ready(function() {
	Handlebars.registerHelper("stringify", function(typeIndex, options) {
		return JSON.stringify(typeIndex);
	});
});

var dialog = {
    error: function(message) {
        layer.open({
            content:message,
            icon:2,
            title : '错误',
        });
    },

	notice: function(message) {
        layer.open({
            content: message,
            icon:3,
            title : '提示',
        });
    },

    success : function(message) {
        layer.open({
            content : message,
            icon : 1
        });
    }
};

function reload() {
    if (!islocalhost()) {
        setTimeout(function() {
            location.reload()
        }, 800)
    }
}

function activateDatepicker(selector) {
    var nowTemp = new Date()
    var nowDay = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0).valueOf()
    var nowMoth = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), 1, 0, 0, 0, 0).valueOf()
    var nowYear = new Date(nowTemp.getFullYear(), 0, 1, 0, 0, 0, 0).valueOf()
    return $(selector).datepicker({
        onRender: function(date, viewMode) {
            var viewDate = nowDay
            switch (viewMode) {
                case 1: viewDate = nowMoth; break;
                case 2: viewDate = nowYear; break;
            }
            return date.valueOf() < viewDate ? 'am-disabled' : ''
        }
    })
}