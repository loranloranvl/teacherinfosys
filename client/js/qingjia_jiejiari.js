var sData = {};

function ajaxSendLeaveRequest(params) {
	$.ajax({
	    method: 'post',
	    url: '/leave/wx/addHolidayLeave',
	    data: params,
	    success: function(data) {
	    	if (data.status == 200) {
	    		dialog.success('发送成功');
	    		setTimeout(function() {
	    			location.href = 'qingjia_entry.html'
	    		}, 800)
	    	}
	    }
	})
}

function ajaxGetLeaveInfo() {
	$.ajax({
		url: 'leave/wx/getHolidayLeaveModel',
		success: function(data) {
			if (data.status == 200) {
				if (!data.data.length) {
					layer.alert('现在不用登记', {icon: 6});
					setTimeout(function() {
						location.href = 'qingjia_entry.html'
					}, 800)
				} else {
					deployLeaveInfo(data);
					$('#main').show();
				}
			}
		}
	})
}

function deployLeaveInfo(data) {
	data.data.sort(function(a, b) {
		return new Date(b.from) - new Date(a.from);
	})
	HDeploy('holidays', data);
	$('#holidays').on('change', function() {
		var title = $(this).find('option:selected').text();
		var curHoliday = '';
		if (title.match(/端午/)) {	
			curHoliday = 'duanwu'
		} else if (title.match(/国庆/)) {
			curHoliday = 'guoqing'
		} else if (title.match(/劳动/)) {
			curHoliday = 'laodong'
		} else if (title.match(/清明/)) {
			curHoliday = 'qingming'
		} else if (title.match(/元旦/)) {
			curHoliday = 'yuandan'
		} else if (title.match(/中秋/)) {
			curHoliday = 'zhongqiu'
		}

		var holidays = {
			duanwu: {
				slogan: '你要吃个粽子吗',
				extension: 'jpg',
			},
			guoqing: {
				slogan: '国庆小长假',
				extension: 'jpg',
			},
			laodong: {
				slogan: '劳动节快乐',
				extension: 'jpg',
			},
			qingming: {
				slogan: '清明节快乐',
				extension: 'jpg',
			},
			yuandan: {
				slogan: '新年好',
				extension: 'jpg',
			},
			zhongqiu: {
				slogan: '中秋节快乐',
				extension: 'jpg',
			}
		};
		$('#holidayicon').attr('src', '../shared/img/holidays/' 
			+ curHoliday + '.' + holidays[curHoliday].extension);
		$('.sometitle').text(holidays[curHoliday].slogan);
	})
	$('#submit').on('click', function() {
		if (!$('#where').val()) {
			alert('你要去哪');
			return;
		}
		ajaxSendLeaveRequest({
			id: $('#holidays').val(),
			destination: $('#where').val()
		});
	})
}

$(document).ready(function() {
	ajaxGetLeaveInfo()
})