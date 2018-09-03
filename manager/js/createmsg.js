var am_modal_options = {
    relatedTarget: this, 
    closeViaDimmer: false
};

$(document).ready(function() {
    ajaxGetSendToByInfoLevel();
    $('#btn').on('click', function() {
        $('#modal-process1').modal(am_modal_options);
    });

    if (info_level == 0) {
        $('#btn').hide();
    } else if (info_level == 1) {
        $('#mp1-teacherrow').remove();
    }
});

var sendType = '10086'; // 反正不可能是10086
var sendString = ''; // 最终用ajax提交的数据
var sendArray = []; // 方便本地处理的数据
var sendFiles;
var sendLater = false;
var am_modal_options = { // amaze ui 模态窗选项
                        relatedTarget: this, 
                        closeViaDimmer: false
                        }
var sendData = localStorage.sendData; // Data from ajax (grade class teacher etc.)

/*
    type对照表：
    1 本科生 年级
    2 本科生 班级
    3 本科生 专业
    4 本科生 特定学生
    5 本科生 所有人
    6 研究生 年级
    7 研究生 特定学生
    8 研究生 所有人
    9 教师   特定教师
   10 教师   所有人
 */

// handlebars: 动态生成发送对象checkboxes
function deploySendToHTML(data) {
    data.teacher.sort(function(a, b) {
        var _qiujian = '求建';
        if (a.name == '仇建')
            return _qiujian.localeCompare(b.name, 'zh');
        if (b.name == '仇建')
            return a.name.localeCompare(_qiujian, 'zh');
        return a.name.localeCompare(b.name, 'zh');
    });
    var sources = [[1, 1], [1, 2], [1, 3], [2, 1], [3, 4]];
    for (var i = 0; i < sources.length; ++i) {
        var source = sources[i];
        var target = 'mp2-' + source[0] + '-detail' + source[1];
        HDeploy(target, data);
    }
}

function mapuid(value) {
    var result;
    if (value.length == 8)
        $.each(sendData.grade, function(key1, value1) {
            $.each(value1, function(key2, value2) {
                if (value2.uid == value) {
                    result = value2.name;
                }
            });
        });
    else if (value.length == 9)
        $.each(sendData.graduate_grade, function(key1, value1) {
            $.each(value1, function(key2, value2) {
                if (value2.uid == value) {
                    result = value2.name;
                }
            });
        });
    else
        $.each(sendData.teacher, function(key1, value1) {
            if (value1.uid == value) {
                result = value1.name;
            }
        });
    return result;
}

// 收集步骤2选择的对象以在步骤3做确认
function deployConfirm() {
    var sendTypeInt = parseInt(sendType);
    if (sendTypeInt >= 1 && sendTypeInt <= 5) {
        $('#mp3-title').text('您正在给本科生推送通知');
    } else if (sendTypeInt >= 6 && sendTypeInt <= 8) {
        $('#mp3-title').text('您正在给研究生推送通知');
    } else if (sendTypeInt == 9 || sendTypeInt == 10) {
        $('#mp3-title').text('您正在给教师推送通知');
    }

    var sendArrayForHumansToRead;
    var unit;
    if (sendType == '1') {
        sendArrayForHumansToRead = sendArray;
        unit = '个年级';
    } else if (sendType == '2') {
        sendArrayForHumansToRead = $.map(sendArray, function(value) {
            return $('input[value=' + value + ']').prev().text();
        });
        unit = '个班级';
    } else if (sendType == '3') {
        sendArrayForHumansToRead = sendArray;
        unit = '个专业';
    } else if (sendType == '4') {
        sendArrayForHumansToRead = $.map(sendArray, mapuid);
        unit = '位同学';
    } else if (sendType == '5') {
        sendArrayForHumansToRead = null;
        unit = '本科生';
    } else if (sendType == '6') {
        sendArrayForHumansToRead = sendArray;
        unit = '个年级'
    } else if (sendType == '7') {
        sendArrayForHumansToRead = $.map(sendArray, mapuid);
        unit = '位同学';
    } else if (sendType == '8') {
        sendArrayForHumansToRead = null;
        unit = '研究生';
    } else if (sendType == '9') {
        sendArrayForHumansToRead = $.map(sendArray, mapuid);
        unit = '位教师';
    } else if (sendType == '10') {
        sendArrayForHumansToRead = null;
        unit = '教师';
    }

    // 最多显示三个 多出三个就放在title属性里面
    var maxDisplay = 3;
    var tinytitle;
    if (sendArrayForHumansToRead == null) {
        tinytitle = '全体' + unit;
        $('#mp3-tinytitle').text(tinytitle)
            .attr('title', null);
    } else if (sendArrayForHumansToRead.length > 3) {
        tinytitle = sendArrayForHumansToRead.slice(0, 3).join('，')
                  + '... 共' + sendArrayForHumansToRead.length + unit;
        $('#mp3-tinytitle').text(tinytitle)
            .attr('title', sendArrayForHumansToRead.join('，'));
    } else {
        tinytitle = sendArrayForHumansToRead.join('，')
                  + ' 共' + sendArrayForHumansToRead.length + unit;
        $('#mp3-tinytitle').text(tinytitle)
            .attr('title', null);
    }

    // 清空标题和内容
    $("#mp3-form-title").val('');
    $("#mp3-form-body").val('');
}

// 清理数组里面不需要的东西
Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {         
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

// 检验并存储发送类型和发送对象
function storeSendTarget() {
    var typeWithCheckbox = ['1', '2', '3', '5', '6', '8', '9', '10'];
    if (typeWithCheckbox.indexOf(sendType) != -1) {
        sendArray = [];
        var checkboxes = $('div[data-send-type=' + sendType + ']')
            .find('input[type=checkbox]');
        for (var i = 0; i < checkboxes.length; ++i) {
            if (checkboxes[i].checked) {
                sendArray.push(checkboxes[i].value);
            }
        }
    } else if (sendType == '4') {
        var regx = /^( *(\d{8} +)*(\d{8} *)$)$/g;
        var targetValue = $('div[data-send-type=4]')
            .find('input').val()
        if (regx.test(targetValue)) {
            // 去掉空字符串和重复的学号 存到sendArray-定义在最上面
            sendArray = targetValue.split(' ').clean('')
                .filter(function(item, pos, self) {
                    return self.indexOf(item) == pos;
                });
        } else {
            dialog.error('学号格式错误，本科生8位学号，以空格分隔');
            return false;
        }
    } else if (sendType == '7') {
        var regx = /^( *(\d{9} +)*(\d{9} *)$)$/g;
        var targetValue = $('div[data-send-type=7]')
            .find('input').val()
        if (regx.test(targetValue)) {
            // 去掉空字符串和重复的学号 存到sendArray-定义在最上面
            sendArray = targetValue.split(' ').clean('')
                .filter(function(item, pos, self) {
                    return self.indexOf(item) == pos;
                });
        } else {
            dialog.error('学号格式错误，研究生9位学号，以空格分隔');
            return false;
        }
    } else {
        dialog.error('请选择推送对象');
        return false;
    }

    sendString = sendArray.join(' ');
    if (sendString == '') {
        dialog.error('打勾');
        return false;
    }
    return true; // if nothing wrong
}

// handlebars：自定义helper
$(document).ready(function() {
    // 班级号->班级名称
    Handlebars.registerHelper("cnvClsIDToName", function(idnum, options) {
        var result = idnum.slice(0, 2) + '级';
        switch(idnum.slice(4, 6)) {
            case '36': result += '信安' + idnum.slice(7, 8) + ' 班'; 
                break;
            case '24': result += '网工' + idnum.slice(7, 8) + ' 班'; 
                break;
            case '02': result += '信安卓越'; break;
            default: console.log('cnvClsIDToName: 奇怪的专业代码');
        }
        return result;
    });
});

// 发送通知的一些细节
$(document).ready(function() {
    // 当前选择变颜色，存type
    $('#mp2-1-accordion, #mp2-2-accordion, #mp2-3-accordion')
            .find('.am-collapse')
        .on('open.collapse.amui', function() {
            $(this).parent()
                .removeClass('am-panel-secondary')
                .addClass('am-panel-primary');
            sendType = $(this).attr('data-send-type');
        })
        .on('close.collapse.amui', function() {
            $(this).parent()
                .removeClass('am-panel-primary')
                .addClass('am-panel-secondary');
            if (sendType == $(this).attr('data-send-type')) {
                sendType = '10086';
            }
        });

    // 输入动画
    $("input[type='text'], textarea").focus(function(){
        $(this).parent().find(".mpx-label-txt").addClass('mpx-label-active');
    });

    $("input[type='text'], textarea").focusout(function(){
        if ($(this).val() == '') {
          $(this).parent().find(".mpx-label-txt").removeClass('mpx-label-active');
        };
    });

    $("#mp3-form textarea").on('input', function() {
        $(this).css('height', '52px');
        $(this).css('height', this.scrollHeight + 'px');
    });

    // 学号输入：如果输入太多，减少字号
    $("#stunum").on('input', function() {
      
        var textLength = $(this).val().length;
      
        if(textLength < 45) {
            $(this).css('font-size', '24px');
        } else if (textLength < 63) {
            $(this).css('font-size', '17px');
        } else {
            $(this).css('font-size', '12px');
        }

        var text = $(this).val();
        var at = '<i class="am-icon-at"></i>';
        var ques = '<i class="am-icon-question"></i>';
        if (text == '') {
            $('.mpx-username2').html('');
            $('.mpx-username1').html('');
        }
        else if (text[text.length - 1] == ' ') {
            var uids = text.split(' ').clean('');
            var usernames = uids.map(mapuid);
            var _usernames = '';
            usernames.map(function(element, index) {
                if (element) {
                    _usernames += at + element + '&nbsp;&nbsp;';
                } else {
                    _usernames += '<span style="color: #eb4747">' 
                        + ques + uids[index] + '</span>' + '&nbsp;&nbsp;';
                }
            });
            if (uids.length <= 4) {
                $('.mpx-username1').html(_usernames);
                $('.mpx-username2').html('');
            } else {
                $('.mpx-username2').html(_usernames);
                $('.mpx-username1').html('');
            }
        }
      
     //console.log(textLength);
    });

    // 提示上传文件名
    $('#mp3-fileinput').on('change', function() {
        sendFiles = this.files;
        var fileInfoForHumansToRead = '';
        for(var i = 0; i < sendFiles.length; ++i){
            fileInfoForHumansToRead += sendFiles[i].name + '; ';
        }
        $('#mp3-fileresult').text(fileInfoForHumansToRead);
    });

    // amazeui datepicker 禁用今天之前的日子
    var nowTemp = new Date();
    var nowDay = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0).valueOf();
    var nowMoth = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), 1, 0, 0, 0, 0).valueOf();
    var nowYear = new Date(nowTemp.getFullYear(), 0, 1, 0, 0, 0, 0).valueOf();
    var checkin = $('#mp3-datepicker').datepicker({
        onRender: function(date, viewMode) {
            var viewDate = nowDay;
            switch (viewMode) {
                case 1: viewDate = nowMoth; break;
                case 2: viewDate = nowYear; break;
            }
            return date.valueOf() < viewDate ? 'am-disabled' : '';
        }
    });
});

function handleSendLater(checkbox){
    sendLater = checkbox.checked;
    if(checkbox.checked == true){
        $("#mp3-picker").css('display', 'block');
        $("#mp3-settime").css('margin-bottom', '20px');
    }else{
        $("#mp3-picker").css('display', 'none');
        $("#mp3-settime").css('margin-bottom', '0');
    }
}

// 发送通知：上一步、下一步、取消、完成
$(document).ready(function() {
    // 所有步骤的取消按钮
    $('#mp1-cancel, #mp2-1-cancel, #mp2-2-cancel, #mp2-3-cancel, #mp3-cancel')
            .on('click', function() {
        $(this).parents('.am-modal').modal('close');
        $('div[data-send-type=' + sendType + ']').collapse('close');
        sendType = '10086';
    });

    // 步骤1：选择对象的下一步按钮
    $('#mp1-next').on('click', function() {
        var checkedValue = $("input[name='mp1-radioinput']:checked").val();
        if (checkedValue == 'undergraduate') {
            $('#modal-process1').modal('close');
            $('#modal-process2-1').modal(am_modal_options);
        } else if ( checkedValue == 'graduate') {
            $('#modal-process1').modal('close');
            $('#modal-process2-2').modal(am_modal_options);
        } else if ( checkedValue == 'teacher') {
            $('#modal-process1').modal('close');
            $('#modal-process2-3').modal(am_modal_options);
        } else {
            cusAlert('请选择一项');
        }
    });

    // 步骤2-*：上一步
    $('#mp2-1-prev, #mp2-2-prev, #mp2-3-prev').on('click', function() {
        $(this).parents('.am-modal').modal('close');
        $('#modal-process1').modal({
            relatedTarget: this, 
            closeViaDimmer: false
        });
        $('div[data-send-type=' + sendType + ']').collapse('close');
        sendType = '10086';
    });

    // 步骤2-*：下一步
    $('#mp2-1-next, #mp2-2-next, #mp2-3-next').on('click', function() {
        if(storeSendTarget()) {
            $(this).parents('.am-modal').modal('close');
            deployConfirm();
            $('#modal-process3').modal(am_modal_options);
        }
    });

    // 步骤3：上一步
    $('#mp3-prev').on('click', function() {
        $(this).parents('.am-modal').modal('close');
        var sendTypeInt = parseInt(sendType);
        if (sendTypeInt >= 1 && sendTypeInt <= 5) {
            $('#modal-process2-1').modal(am_modal_options);
        } else if (sendTypeInt >= 6 && sendTypeInt <= 8) {
            $('#modal-process2-2').modal(am_modal_options);
        } else if (sendTypeInt == 9 || sendTypeInt == 10) {
            $('#modal-process2-3').modal(am_modal_options);
        }
    });

    // 步骤3：完成
    $('#mp3-submit').on('click', function() {
        if ($('#mp3-form-title').val() == '') {
            dialog.error('请填写标题');
        } else if ($('#mp3-form-body').val() == '') {
            dialog.error('请填写正文');
        } else {
            // var sData = {};
            // sData["title"] = $('#mp3-form-title').val();
            // sData["content"] = $('#mp3-form-body').val();
            // sData["target"] = sendString;
            // sData["type"] = sendType;
            // if (sendFiles) {
            //     for (i = 0; i < sendFiles.length; ++i) {
            //         sData["file[" + i + "]"] = sendFiles[i];
            //     }
            // }
            // if (sendLater && $("#mp3-datepicker").val() == '') {
            //     dialog.error('请填写日期');
            // } else if (sendLater) {
            //     var timeString = $("#mp3-datepicker").val() 
            //                    + ' ' + $("#mp3-timepicker").val();
            //     sData["time"] = timeString;
            // }
            // ajaxpostMsg(sData);

            var formData = new FormData;
            formData.append('title', $('#mp3-form-title').val());
            formData.append('content', $('#mp3-form-body').val());
            formData.append('target', sendString);
            formData.append('type', sendType);
            if (sendFiles) {
                for (i = 0; i < sendFiles.length; ++i) {
                    formData.append('file[' + i + ']', sendFiles[i]);
                }
            }
            if (sendLater && $("#mp3-datepicker").val() == '') {
                dialog.error('请填写日期');
            } else if (sendLater) {
                var timeString = $("#mp3-datepicker").val() 
                               + ' ' + $("#mp3-timepicker").val();
                formData.append('time', timeString);
            }
            ajaxpostMsg(formData);
        }
        
    });
});

/* -------- ajax fetchers --------- */

// ajax获取发送信息的对象
function ajaxGetSendToByInfoLevel() {
    $('#btn-content').html(__SPINNER__);
    $.ajax({
        url: 'info/pc/getInfoTargets',
        success: function (data) {
            if (data.status == 200){
                $('#btn-content').html('创建通知');
                sendData = data.data;
                localStorage.sendData = sendData;
                deploySendToHTML(data.data);
            }
        }
    });
}

// ajax发送信息
function ajaxpostMsg(sData) {
    $('#mp3-submit').html('<i class="am-icon-spinner am-icon-spin"></i>')
        .attr('disabled', true);
    $.ajax({
        method: 'post',
        url: 'info/pc/sendInfo',
        data: sData,
        contentType: false,
        processData: false,
        success: function (data) {
            if(data.status == 200){
                dialog.success('发送成功');
                setTimeout(function() {
                    // location.reload();
                }, 800);
            }
        },
        complete : function(XMLHttpRequest,status) { //请求完成后最终执行参数
            $('#mp3-submit').html('完成').attr('disabled', false);
        }
    })
}

