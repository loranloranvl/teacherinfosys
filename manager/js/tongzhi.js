$(document).ready(function() {
    Handlebars.registerPartial('tongzhi', 
        $('#ht-tongzhi-partial').html());
    ajaxGetTongzhi(11);

});

/* -------------- ajax fetchers -------------*/
function ajaxGetTongzhi(page) {
    $.ajax({
        url: 'infocontent/2',
        data: {
            page: page
        },
        success: function (data) {
            if(data.status == 200){
                deployTongzhi(data.data);
            }
        }
    })
}

/* -------------- deployers -----------------*/
function deployTongzhi(data) {
    data = data.data;

    // estimate height
    function eh(x) {
        if (x)
            return x.content.length
                + (x.title.length > 20 ? 2 : 1) * 35
                + x.attach_url.split(',').length * 45;
        else
            return 0;
    }
    if (window.innerWidth > 1025) {
        data.sort(function(a, b) {
            return eh(b) - eh(a);
        });
        var empty = {
            index0: false,
            index1: false,
            index2: false,
            title: false
        }
        if (eh(data[2]) + eh(data[3]) < eh(data[1])) {
            data = [data[2], data[1], data[0], 
                data[3], empty, empty, data[4]];
        } else {
            data = [data[2], data[1], data[0], data[3], data[4]];
        }
        data.map(function(element, index) {
            if (element) {
                element.index0 = element.title && index % 3 == 0;
                element.index1 = element.title && index % 3 == 1;
                element.index2 = element.title && index % 3 == 2;
            }
        })
    }
    HDeploy('tongzhis', data);
    $('.tongzhi .sendee').each(function() {
        // blabla
    })
    $('.tongzhi .files').each(function() {
        var urls = $(this).attr('data-urls');
        if (urls) {
            var _urls = urls.split(',');
            var files = [];
            _urls.map(function(element, index) {
                if (element.match(/(\.doc|\.docx)$/i)) {
                    files.push({
                        dual: true,
                        data: {
                            isdoc: element.match(/\.doc$/i),
                            name: element.match(/[^/]*$/)[0]
                                .split('.')[0],
                            mswordurl: element,
                            pdfurl: _urls[index + 1]
                        }
                    });
                } else if (element.match(/\.pdf$/i)
                           && index > 0
                           && !_urls[index - 1].match(/(\.doc|\.docx)$/i)
                           || !element.match(/\.pdf$/i)) {
                    files.push({
                        dual: false,
                        data: {
                            name: element.match(/[^/]*$/)[0],
                            url: element
                        }
                    });
                }
            })
            var template = Handlebars.compile($('#ht-files').html());
            $(this).html(template(files));
        }
    })
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
    })
}