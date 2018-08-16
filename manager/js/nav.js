$(document).ready(function() {
	// 重复的html用脚本生成
	var data = [
	    {name: '教学页面', ref: 'teaching'},
	    {name: '文件系统', ref: 'filesharing'},
	    {name: '通知系统', ref: 'tongzhi'},
	    {name: '请假页面', ref: 'qingjia'}
	];
	data.forEach(function(el) {
	    el.short = el.name.slice(0, 2)
	});
	HDeploy('navc', data);
	var hrs = $('#nav-dropdown hr');
	hrs.eq(hrs.length - 1).hide();

	// 点击条形图案，弹出小屏幕导航栏
	$('#nav-bars').on('click', function() {
		$(this).toggleClass('bars-active');
		$('#nav-dropdown').toggle(200);
	})

	// 读取url以改变导航按钮样式
	var htmlregex = /[a-z\-]+\.html/;
	var curPage = window.location.pathname.match(htmlregex)[0];
	$("nav li").each(function(index) {
		var a = $(this).find('a');
	    if ($(this).attr('id') != 'btn' 
	    		&& a.attr('href').match(htmlregex)[0] == curPage) {
	        a.css('color', 'white');
	    }
	});
});