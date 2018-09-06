$(document).ready(function() {
	var params = getParam();
	if (!params)
		window.location = 'tongzhi.html';
	var id = params.id;
	ajaxGetFeedback(id);

	// $('#btn-content').text('发送提醒');
	// $('#btn').on('click', function() {
	// 	ajaxNotifyThem(id);
	// });
	$('#btn').hide();
});

function ajaxGetFeedback(id) {
	$.ajax({
		url: 'info/pc/getInfoFeedbackStatus',
		data: {
			batch_id: id
		},
		success: function(data) {
			if (data.status == 200) {
				deployFeedback(data.data);
			}
		}
	});
}

function ajaxNotifyThem(id) {
    $.ajax({
        url: '/notify/'+ id,
        success: function (data) {
            if(data.status == 200){
                dialog.success('已发送提醒');
            }
        }
    })
}

function deployFeedback(data) {
	HDeploy('main', data);
	$('#title').text(data[0].title);
	var read = 0;
	var nonRead = 0;
	data.map(function(element) {
		if (element.status === 1) 
			read++;
		else if (element.status === 0)
			nonRead++;
	});
	var statistics = $('#subtitle span');
	statistics.eq(0).text(read + nonRead);
	statistics.eq(1).text(read);
	statistics.eq(2).text(nonRead);
	statistics.eq(3).text(Math.round(1000 * read / (read + nonRead)) / 10 + '%');
	$('#subtitle').show();
}
