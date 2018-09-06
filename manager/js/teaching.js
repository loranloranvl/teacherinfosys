function ajaxUpload(formData) {
    $.ajax({
        url: 'teach/calculateReachState',
        method: 'post',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            if (data.status == 200) {
                dialog.success('上传成功')
                reload()
            }
        }
    })
}

function ajaxGetStates(page) {
    $.ajax({
        url: 'teach/getAllReachState',
        data: {
            page: page
        },
        success: function(data) {
            if (data.status == 200) {
                deployStates(data.data)
                deployPagi(data.data, ajaxGetStates)
            }
        }
    })
}

function deployStates(data) {
    if (!data.data.length) {
        $('h2').text('您还没有计算过达成度')
        return
    }
    data.data.map(function(element) {
        element.cg = JSON.parse(element.cg)
        element.gg = JSON.parse(element.gg)
    })
    HDeploy('results', data)
    deployPagi(data, function() {})
    $('[data-created]').each(function() {
        created = $(this).attr('data-created')
        $(this).html(created.replace(' ', '<br>'))
    })
    
    var curYear = new Date().getFullYear()
    $('option[value="2018-2019"]').remove()
    for (var i = curYear - 1; i < curYear + 3; ++i) {
        var year = i - 1 + '-' + i
        var data = {
            year: year,
            year_: year.replace('-', ' - '),
            i: i
        }
        var template = Handlebars.compile($('#ht-option').html())
        $('#year').append(template(data))
    }
}

$(document).ready(function() {
    ajaxGetStates()
    $('#btn-content').text('上传表格')
    $('#btn').on('click', function() {
        $('#upload-prompt').modal({
            relatedTarget: this,
            closeOnConfirm: false,
            onConfirm: function() {
                var formData = new FormData
                var year = $('#year').val()
                var term = $('#term').val()
                var course = $('#course').val()
                var file = $('#fileinput').prop('files')[0]
                if (!course) {
                    dialog.error('请填写课程名称')
                    return
                }
                if (!file) {
                    dialog.error('请选择文件')
                    return
                }
                formData.append('year', year)
                formData.append('term', term)
                formData.append('course_name', course)
                formData.append('file', file)
                ajaxUpload(formData)
            }
        })
    })
    $('#fileinput').on('change', function() {
        var fileNames = ''
        $.each(this.files, function() {
            fileNames += '<span class="am-badge">' + this.name + '</span> '
        })
        $('#filelist').html(fileNames)
    })
})