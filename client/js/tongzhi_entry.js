$(document).ready(function() {
    ajaxGetTongzhiByStudentIndex('1');
    $('#spinorclick').html(__SPINNER__);
});

function preventLongText(str, maxLength) {
    if (str.length <= maxLength) {
        return str;
    } else {
        return str.substr(0, maxLength - 1) + '...';
    }
}

function ajaxGetTongzhiByStudentIndex(page) {
    $.ajax({
        url: '/info/wx/getReceivedInfoList',
        data: {
            page: page
        },
        success: function (data) {
            if(data.status == 200){
                deployTongzhiTable(data.data);
            }
        }
    });
}

function deployTongzhiTable(data) {
    var source = $('#handlebars-template-tongzhitable').html();
    var template = Handlebars.compile(source);
    $('#tongzhitable').html(template(data));
    $('#spinorclick').html('点击查看详情');

    deployPagi(data, ajaxGetTongzhiByStudentIndex)

    $('.clickme').on('click', function() {
        location.href = 'tongzhi_detail.html?id=' + $(this).attr('data-tongzhiid');
    });

    $('.splitme').each(function() {
        var timeString = $(this).text();
        $(this).text(timeString.split(' ')[0]);
    });

    $('.sliceme').each(function() {
        var maxL = 9;
        if ($(this).text().length > maxL) {
            $(this).text($(this).text().slice(0, maxL - 1) + '...');
        }
    });

    $('.slicedate').each(function() {
        var text = $(this).text();
        text = text.slice(0, text.length - 3)
        $(this).text(text)
    });
}

