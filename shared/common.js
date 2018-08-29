var log = console.log;
var __SPINNER__ = '<i class="am-icon-spinner \
	am-icon-spin"></i>';
var  __URL__ = 'https://tis.hzcloudservice.com/api/v1/';
var  __DURL__ = 'https://tis.hzcloudservice.com/';
var __TOKEN__ = localStorage['token'];
var info, info_level;
if (!isWeixinBrowser()) {
	info = JSON.parse(localStorage.info);
	info_level = info.info_level;
}

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

function isWeixinBrowser() {
    var agent = navigator.userAgent.toLowerCase();
    if (agent.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
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
	},
	complete: function() {
		layer.close(loader);
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

	}
});

// general ajax error handler
$(document).ajaxError(function( event, jqxhr, settings, thrownError ) {
	log(event, jqxhr, settings, thrownError);
});

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
