$(document).ready(function() {
    Handlebars.registerPartial('tongzhi', 
        $('#ht-tongzhi-partial').html());
    ajaxGetTongzhi(getParam().id);
});

/* -------------- ajax fetchers -------------*/
function ajaxGetTongzhi(id) {
    $.ajax({
        url: 'info/wx/getInfoDetail',
        data: {
            batch_id: id
        },
        success: function (data) {
            if (data.status == 200){
                deployTongzhi(data.data);
            }
        }
    })
}

/* -------------- deployers -----------------*/
function deployTongzhi(data) {
    HDeploy('tongzhis', data);

    /*
        rendering files
        for every microsoft word document
        the server will provide a pair of msword and pdf
        and the pdf is directly preceded by its msword counterpart

        here we map through _urls
        for every msword, we push an object with these keys:
            dual: indicates it is a pair of msword and pdf
            data:
                isdoc: indicates its extension is .doc instread of .docx
                name: file name without extension
                mswordurl and pdfurl: just corresponding urls
        for every pdf that is not preceded by a msword counterpart
        we know it is uploaded in pdf rather then converted from a msword
            dual: always false
            data:
                name: file name with extension
                url: url
    */
    $('.tongzhi .files').each(function() {
        var urls = $(this).attr('data-urls');
        if (urls) {
            var _urls = urls.split(',');
            var files2 = [];
            _urls.map(function(element, index) {
                var type;
                switch (element.match(/[^/]*$/)[0].split('.')[1]) {
                    case 'xls':
                    case 'xlsx':
                        type = 'excel'; break;
                    case 'pdf':
                        type = 'pdf'; break;
                    case 'doc':
                    case 'docx':
                        type = 'word'; break;
                    case 'rar':
                    case 'zip':
                        type = 'zip'; break;
                    default:
                        type = 'file'; break;
                }
                files2.push({
                    name: element.match(/[^/]*$/)[0],
                    url: 'element',
                    type: type
                })
            })
            var template = Handlebars.compile($('#ht-files').html());
            $(this).html(template(files2));
        }
    });

    // translate dataType into human-readable labels
    $('.tongzhi .sendee').each(function() {
        var type = parseInt($(this).attr('data-type'));
        var text = '';
        switch(type) {
            case 1: text = '特定年级'; break;
            case 2: text = '特定班级'; break;
            case 3: text = '特定专业'; break;
            case 4: text = '特定学生'; break;
            case 5: text = '全体本科生'; break;
            case 6: text = '特定年级'; break;
            case 7: text = '特定研究生'; break;
            case 8: text = '全体研究生'; break;
            case 9: text = '特定教师'; break;
            case 10: text = '全体教师'; break;
        }
        $(this).text(text);
    });

    $('.sendee').on('click', function() {
        window.open('tzdetail.html?' + $.param({
            id: $(this).attr('data-id')
        }));
    });

    $('.sendee').each(function() {
        var type = parseInt($(this).attr('data-type'));
        var sendTo = $(this).attr('data-send-to');
        if ([1, 3, 6].indexOf(type) != -1)
            $(this).text(sendTo);
    });

    $('.tongzhi').each(function() {
        var now = new Date();
        var appointment = new Date($(this).attr('data-time'));
        if (appointment && appointment <= now) {
            $(this).find('.pre').css({
                color: '#5eb95e',
                borderColor: '#5eb95e'
            });
            $(this).find('.date').eq(1).find('i').attr('class', 'am-icon-calendar-check-o')
        }
    });
}