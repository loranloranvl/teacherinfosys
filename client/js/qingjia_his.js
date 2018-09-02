$(document).ready(function() {
	ajaxGetHistory('1');
});

function ajaxGetHistory(page) {
	$.ajax({
	    url: '/leave/wx/getLeaveHistory',
	    data: {
	    	page: page
	    },
	    success: function (data) {
	        if(data.status == 200){
	            deployHisTable(data.data);
	            deployPagi(data.data, ajaxGetHistory);
	        }
	    }
	});
}

function ajaxCancelRequest(id) {
	$('.detail-cancel').html(__SPINNER__)
		.attr('disabled', true);
	$.ajax({
	    url: '/cancel/' + id,
	    success: function (data) {
	    	$('.detail-cancel').html('撤回申请')
	    		.attr('disabled', false);
	        if(data.status == 200){
	        	dialog.success('撤回成功', location.href, 1500);
	        }
	    }
	});
}

function deployHisTable(data) {
	var source = $('#handlebars-template-histable').html();
	var template = Handlebars.compile(source);
	$('#histable').html(template(data));
	if (data.data.length > 0) {
		$('#plzclick').text('点击查看详情');
	}
	$('#histable .record-status').each(function() {
		switch($(this).attr('data-status')) {
			case '2':
				$(this).find('span').text('已通过').css('color', '#5cb85c');
				break;
			case '1':
				$(this).find('span').text('待审核').css('color', '#99979c');
				break;
			case '3':
				$(this).find('span').text('未通过').css('color', '#d9534f');
				break;
		}
	});
	$('#histable .record').on('click', function() {
		deployHisDetail(data.data[$(this).attr('data-index')]);
	});
	$('#btngroup1 button').on('click', function() {
		var pageURL = $(this).attr('data-targetpage');
		if (pageURL) {
			$('#histable').hide();
			var page = pageURL.split('=').pop();
			ajaxGetHistory(page);
		}
	});
	if (data.last_page <= 1) {
		$('#btngroup1').remove();
	} else if (data.current_page == 1) {
		$('#pagi-first, #pagi-prev').remove();
	} else if (data.current_page == data.last_page) {
		$('#pagi-next, #pagi-last').remove();
	}
	$('#histable').fadeIn(200);
}

function deployHisDetail(data) {
	var source = $('#handlebars-template-hisdetail').html();
	var template = Handlebars.compile(source);
	$('#hisdetail').html(template(data));
	$('#plzclick').text('');
	$('#histable').hide();
	switch(data.status) {
		case 1:
			$('#detail-status').text('同意了').css('color', '#5cb85c');
			$('.detail-cancel').attr('disabled', true);
			break;
		case 2:
			$('#detail-status').text('还没做出决定').css('color', '#666666');
			$('.detail-cancel').attr('disabled', false);
			break;
		case 3:
			$('#detail-status').text('拒绝了').css('color', '#d9534f');
			$('.detail-cancel').attr('disabled', true);
			break;
	}
	$('#hisdetail').fadeIn(200);
}

function backToTable() {
	$('#hisdetail').hide();
	$('#plzclick').text('点击查看详情');
	$('#histable').fadeIn(200);
}