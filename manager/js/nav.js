$(document).ready(function() {
	// 点击条形图案，弹出小屏幕导航栏
	$('#nav-bars').on('click', function() {
		$(this).toggleClass('bars-active');
		$('#nav-dropdown').toggle(200);
	})

	// 读取url以改变导航按钮样式
	var htmlregex = /[a-z\-]+\.html/;
	var curPage = window.location.pathname.match(htmlregex)[0];
	$("li").each(function(index) {
		var a = $(this).find('a');
	    if (a.attr('href').match(htmlregex)[0] == curPage) {
	        a.css('color', 'white');
	    }
	});
});