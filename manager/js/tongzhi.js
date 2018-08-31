$(document).ready(function() {
    Handlebars.registerPartial('tongzhi', 
        $('#ht-tongzhi-partial').html());
    ajaxGetTongzhi(1);
});

/* -------------- ajax fetchers -------------*/
function ajaxGetTongzhi(page) {
    $.ajax({
        url: 'info/pc/getInfoList',
        data: {
            page: page
        },
        success: function (data) {
            if (data.status == 200){
                deployTongzhi(data.data);
                deployPagi(data.data, 'pagi');
            }
        }
    })
}

/* -------------- deployers -----------------*/
function deployTongzhi(data) {
    var isLast = data.current_page == data.last_page;
    data = data.data;

    // estimate height
    function eh(x) {
        if (x)
            return x.content.length
                + (x.title.length > 20 ? 2 : 1) * 35
                + x.attachment.split(',').length * 45;
        else
            return 0;
    }

    if (!isLast && window.innerWidth > 1025) {
        data.sort(function(a, b) {
            // sort reversely
            return eh(b) - eh(a);
        });

        // empty tongzhi object used for layout
        var empty = {
            index0: false,
            index1: false,
            index2: false,
            title: false
        };

        /*
            for large screens
            we have three columns and five messages
            we put the longest message on column2
            the second longest one on column1
            the third longest one on column0
            the fourth longest one on column0

            if the estimated height of column0 is greater than column1
            then we put the shortest one on column1
            else we put the shortest one on column0

            and we sort the three columns respectively in order to
            make the latest tongzhis on the top

            we use modular arithmatic, i.e. % operator
            to render layout of diffent columns, see the map function below

            for small and middle screens
            we only render a vertically linear layout
        */

        function swap(array, i, j) {
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        if (eh(data[2]) + eh(data[3]) < eh(data[1])) {
            data = [data[2], data[1], data[0], 
                data[3], empty, empty, data[4]];
            if (data[0].id < data[3].id) swap(data, 0, 3);
            if (data[3].id < data[6].id) swap(data, 3, 6);
            if (data[0].id < data[3].id) swap(data, 0, 3);
        } else {
            data = [data[2], data[1], data[0], data[3], data[4]];
            for (var i = 0; i < 2; ++i)
                if (data[i].id < data[i+3].id) swap(data, i, i+3);
        }
    }

    data.map(function(element, index) {
        element.index0 = element.title && index % 3 == 0;
        element.index1 = element.title && index % 3 == 1;
        element.index2 = element.title && index % 3 == 2;
    });

    // deploy the main part with Handlebars 
    // this function is defined in shared/common.js
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
            var files = [];
            // _urls.map(function(element, index) {
            //     if (element.match(/(\.doc|\.docx)$/i)) {
            //         files.push({
            //             dual: true,
            //             data: {
            //                 isdoc: element.match(/\.doc$/i),
            //                 name: element.match(/[^/]*$/)[0]
            //                     .split('.')[0],
            //                 mswordurl: element,
            //                 pdfurl: _urls[index + 1]
            //             }
            //         });
            //     } else if (element.match(/\.pdf$/i)
            //                && index > 0
            //                && !_urls[index - 1].match(/(\.doc|\.docx)$/i)
            //                || !element.match(/\.pdf$/i)) {
            //         files.push({
            //             dual: false,
            //             data: {
            //                 name: element.match(/[^/]*$/)[0],
            //                 url: element
            //             }
            //         });
            //     } // end else if
            // });
            // var template = Handlebars.compile($('#ht-files').html());
            // $(this).html(template(files));

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

function deployPagi(data, id) {
    var pagi = $('#' + id)
    pagi.find('.pagi-cur').text(data.current_page);

    // only show when data is correctly received
    // and there is more than 1 page
    if(data.data && data.last_page != 1) {
        pagi.show();
    } else {
        pagi.hide();
    }

    if (data.current_page == 1) {
        pagi.find('.pagi-first, .pagi-prev').hide();
    } else {
        pagi.find('.pagi-first, .pagi-prev').show();
    }

    if (data.current_page == data.last_page) {
        pagi.find('.pagi-next, .pagi-last').hide();
    } else {
        pagi.find('.pagi-next, .pagi-last').show();
    }

    // remove all click event listeners bound by 
    // previous deployers then add our listeners
    pagi.find('div').off('click');
    pagi.find('.pagi-first').on('click', function() {
        pagi.find('.pagi-cur').html(__SPINNER__);
        ajaxGetTongzhi(1);
    });
    pagi.find('.pagi-prev').on('click', function() {
        pagi.find('.pagi-cur').html(__SPINNER__);
        ajaxGetTongzhi(data.current_page - 1);
    });
    pagi.find('.pagi-next').on('click', function() {
        pagi.find('.pagi-cur').html(__SPINNER__);
        ajaxGetTongzhi(data.current_page + 1);
    });
    pagi.find('.pagi-last').on('click', function() {
        pagi.find('.pagi-cur').html(__SPINNER__);
        ajaxGetTongzhi(data.last_page);
    });
}