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
        url: '/studentindex',
        data: {
            page: page
        },
        success: function (data) {
            console.log(data.data);
            if(data.status==200){
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
    $('#btngroup1 .pagibtn').on('click', function() {
            $('#pagi-cur span').html(__SPINNER__);
            var pageURL = $(this).attr('data-targetpage');
            if (pageURL) {
                $('#histable').hide();
                var page = pageURL.split('=').pop();
                ajaxGetTongzhiByStudentIndex(page);
            }
        });

    if (data.last_page <= 1) {
            $('#btngroup1').remove();
        } else if (data.current_page == 1) {
            $('#pagi-first, #pagi-prev').remove();
        } else if (data.current_page == data.last_page) {
            $('#pagi-next, #pagi-last').remove();
        }

    $('.clickme').on('click', function() {
        location.href = 'tongzhi_detail.html?id=' + $(this).attr('data-tongzhiid');
    });

    $('.splitme').each(function() {
        var timeString = $(this).text();
        $(this).text(timeString.split(' ')[0]);
    });

    $('.sliceme').each(function() {
        var maxL = 8;
        if ($(this).text().length > maxL) {
            $(this).text($(this).text().slice(0, maxL - 1) + '...');
        }
    });
}

