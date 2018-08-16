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
        type: 'GET',
        url: __URL__ + '/studentindex' + '?page=' + page,
        crossDomain: true,
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        async:true,
        success: function (data) {
            console.log(data.data);
            if(data.status==200){
                deployTongzhiTable(data.data);
                return ;
            }
            else if(data.status==400){
                dialog.error('请完善您的信息');
                return ;
            }
            else if(data.status == 402){
                dialog.error('操作失败，请重试');
                return ;
            }
            else if(data.status == 404){
                dialog.error('操作失败，出现内部错误');
                return ;
            }
            else if(data.status == 401){
                dialog.errorto('请先绑定信息',__DURL__+'bind',1500);
                return ;
            }
            else{
                dialog.error('操作失败，出现未知错误');
                return ;
            }

        },
        error: function () {
            alert('操作失败，可能是网络问题，请联系管理员')
            return ;
        }
    });
}

function deployTongzhiTable(data) {
    var source = $('#handlebars-template-tongzhitable').html();
    var template = Handlebars.compile(source);
    $('#tongzhitable').html(template(data));
    $('#spinorclick').html('点击查看详情');
    $('#btngroup1 button').on('click', function() {
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
        location.href = 'detail.html?id=' + $(this).attr('data-tongzhiid');
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

