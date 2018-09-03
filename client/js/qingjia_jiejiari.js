var sData = {};

function ajaxSendLeaveRequest(where) {
	$.ajax({
	    method: 'post',
	    url: '/createholidayleave',
	    data: {
	    	is_leave: 1,
	    	begin_time: sData.from,
	    	end_time: sData.to,
	    	where: where,
	    	id: sData.id
	    }
	})
}

function ajaxGetLeaveInfo() {
	$.ajax({
		url: 'getleaveinfo',
		success: function(data) {
			if (data.status == 200) {
				sData = data[0]
			}
		}
	})
}

$(document).ready(function() {
	ajaxGetLeaveInfo()
	var curHoliday = 'duanwu';
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
	$('#submit').on('click', function() {
		if (!$('#where').val()) {
			alert('你要去哪');
			return;
		}
		ajaxSendLeaveRequest($('#where').val());
	})
})