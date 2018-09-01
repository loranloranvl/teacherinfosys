var log = console.log;
var __SPINNER__ = '<i class="am-icon-spinner \
	am-icon-spin"></i>';
var  __URL__ = 'https://tis.hzcloudservice.com/api/v1/';
var  __DURL__ = 'https://tis.hzcloudservice.com/';
var __TOKEN__ = localStorage['token'];
var __INFO__;
var info, info_level;

var czy_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwidWlkIjoxNjI3MTExMCwibmFtZSI6Ilx1OTY0OFx1NGUyZFx1NmUwYSIsIm9wZW5pZCI6Im9Ua3FJMFpkZm44b1NKcG5aQ0FzNVJXcjU1YXciLCJzZXgiOjEsInBob25lIjoiMTg3NjcxMjAwMTAiLCJlbWFpbCI6IjExOTQ0NUBxcS5jb20iLCJ1bml0IjoiXHU3ZjUxXHU3ZWRjXHU3YTdhXHU5NWY0XHU1Yjg5XHU1MTY4XHU1YjY2XHU5NjYyXHUzMDAxXHU2ZDU5XHU2YzVmXHU0ZmRkXHU1YmM2XHU1YjY2XHU5NjYyIiwiZ3JhZGUiOjIwMTYsIm1ham9yIjoiXHU0ZmUxXHU2MDZmXHU1Yjg5XHU1MTY4IiwiY2xhc3MiOjE2MjczNjExLCJ0ZWFjaGVyX2lkIjoxLCJjcmVhdGVkX2F0IjoiMjAxOC0wOC0yOSAxMDo0MDoxMSIsInVwZGF0ZWRfYXQiOiIyMDE4LTA4LTMxIDExOjEwOjQxIn0.hDVwaFdSF4E5skNtQnUKx50cO_VbHn0Tt7IEcH7BX3A';
var hwt_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidWlkIjo0MTgwNCwibmFtZSI6Ilx1ODBlMVx1NGYxZlx1OTAxYSIsIm9wZW5pZCI6Im9Ua3FJMGZLQ0I2Szk3VkVqZi1FOHJOcGtEenciLCJzZXgiOjEsInVuaXQiOiJcdTdmNTFcdTdlZGNcdTdhN2FcdTk1ZjRcdTViODlcdTUxNjhcdTViNjZcdTk2NjJcdTMwMDFcdTZkNTlcdTZjNWZcdTRmZGRcdTViYzZcdTViNjZcdTk2NjIiLCJlbWFpbCI6Imh3dEBoZHUuZWR1LmNuIiwicGhvbmUiOiIxMzUxNjcxOTExOSIsImNyZWF0ZWRfYXQiOiIyMDE4LTA4LTI5IDEwOjE0OjM1IiwidXBkYXRlZF9hdCI6IjIwMTgtMDgtMzAgMjM6MTc6NTMifQ.FsIbe3cKWdxPAoJ1kIVhs3T8GlUlabkCb7MB4Fj6r7c';

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

if (islocalhost() && !isWeixinBrowser()) {
	// huweitong
	__TOKEN__ = hwt_token;
}

if (islocalhost() && isWeixinBrowser()) {
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


// general ajax settings
var loader;
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
		loader = layer.load();
	}
});

// general ajax success handler
$(document).ajaxSuccess(function(event, xhr, settings) {
	var rjson = xhr.responseJSON;
	log(settings.url, rjson);
	if (rjson.status == 401 && !isWeixinBrowser()) {
		location.href = __URL__ + 'login/bind'
	} else if (rjson.status == 401 && isWeixinBrowser()) {
		location.href = __URL__+'login/bind'
	} else if (rjson.status != 200) {
		dialog.error(rjson.msg);
	}
});

// general ajax error handler
$(document).ajaxError(function( event, jqxhr, settings, thrownError ) {
	log(event, jqxhr, settings, thrownError);
});

$(document).ajaxComplete(function() {
	layer.close(loader);
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



