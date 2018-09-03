function ajaxAddLeave(detail) {
    for (var i = 0; i < detail.courses.length; ++i) {
        delete detail.courses[i].first
    }
    $.ajax({
        url: 'leave/wx/addLeave',
        method: 'post',
        data: detail,
        // data: JSON.stringify(detail),
        // processData: false,
        success: function(data) {
            if (data.status == 200) {
                dialog.success('已发送申请')
                localStorage.setItem('qingjiadata', '')
                setTimeout(function() {
                    location.reload()
                }, 600)
            }
        }
    })
}

var teachers
(function ajaxGetTeachers() {
    $.ajax({
        url: 'leave/wx/getTeacherInfo',
        success: function(data) {
            teachers = data.data
        }
    })
})()

$(document).ready(function() {
    // amazeui datepicker 禁用今天之前的日子
    var nowTemp = new Date()
    var nowDay = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0).valueOf()
    var nowMoth = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), 1, 0, 0, 0, 0).valueOf()
    var nowYear = new Date(nowTemp.getFullYear(), 0, 1, 0, 0, 0, 0).valueOf()
    var checkin = $('.form-datepicker').datepicker({
        onRender: function(date, viewMode) {
            var viewDate = nowDay
            switch (viewMode) {
                case 1: viewDate = nowMoth; break;
                case 2: viewDate = nowYear; break;
            }
            return date.valueOf() < viewDate ? 'am-disabled' : ''
        }
    })

    // 皮
    var pis = [
        '日常请假',
        '又来请假了呢'
    ]

    var random = new Date().getTime() % 10
    $('#pi').text(random == 0 ? pis[1] : pis[0])

    // submit
    var course_ = {
        course_name: '',
        teacher_name: '',
        teacher_phone: '',
        first: true
    }
    var vm = new Vue({
        el: '#coursesc',
        data: {
            courses: [course_]
        },
        created: function() {
            var sData = localStorage.qingjiadata
            if (sData) {
                sData = JSON.parse(sData)
                for (var key in sData) {
                    $('#' + key).val(sData[key])
                }
                this.courses = sData.courses
            }
        },
        methods: {
            addCourse: function() {
                this.courses.push({
                    course_name: '',
                    teacher_name: '',
                    teacher_phone: '',
                    first: false
                })
            },
            removeCourse: function(index) {
                this.courses.splice(index, 1)
            },
            findTeacherPhone: function(index) {
                var self = this.$data
                for (var i = 0; i < teachers.length; ++i) {
                    var target = self.courses[index]
                    if (teachers[i].name == target.teacher_name && target.teacher_phone == '') {
                        target.teacher_phone = teachers[i].phone
                    }
                }
            },
            submit: function() {
                var self = this.$data
                log(self)
                var sData = {courses: self.courses}
                $('#basicc input, #basicc textarea').each(function() {
                    sData[$(this).attr('id')] = $(this).val()
                })
                for (var key in sData) {
                    if (key != 'destination' && sData[key] == '') {
                        dialog.error('请完善信息')
                        return
                    }
                }
                localStorage.setItem('qingjiadata', JSON.stringify(sData))
                ajaxAddLeave(sData)
            }
        }
    })

})


/*
$(function(){
    var isIll = false;
    $('#leave_reason').on('input', function() {
        var patn = /(伤|崴|肿|晕|疼|痛|病|医|摔|吐|咳|发烧|骨折|发炎|点滴|盐水|输液|打针|过敏|感冒|难受|恶心|乏力|不适|急性|着凉|看牙|腹泻|拉肚|落枕|拔牙|溃疡|韧带|扭伤)/;
        if (patn.test($(this).val())) {
            isIll = true;
        } else {
            isIll = false;
        }
        console.log(isIll);
    });

    var pis = [
        '日常请假',
        '又来请假了呢'
    ];

    var random = new Date().getTime() % 10;
    $('#pi').text(random == 0 ? pis[1] : pis[0])

    $.ajax({
        url: '/jssdk',
        success: function (data) {
            if(data.status==200 && isWeixinBrowser()){
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.data.appId, // 必填，公众号的唯一标识
                    timestamp: data.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
                    signature: data.data.signature,// 必填，签名，见附录1
                    jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            }
        }
    })


    // 结束日期应大于开始日期
    var $alert = $('#my-alert');
    $('#end_time').datepicker().
    on('changeDate.datepicker.amui', function(event) {
        if (event.date.valueOf() < new Date($('input[name="begin_time"]').val().replace(/-/g, '/')).getTime()) {
            $alert.find('p').css('text-align', 'center').text('结束日期应大于开始日期！').end().show();
            $('button').html('<i class="am-icon-spinner am-icon-spin"></i>');
            $('form button').attr('disabled','disabled');
        } else {
            $alert.hide();
            endDate = new Date(event.date);
            $('#end_time').text($('#end_time').data('date'));
            $('button').html('提交');
            $('form button').removeAttr('disabled');
        }
        $(this).datepicker('close');
    });

    // “去往何处”的显示
    $('input[name="is_leave"]').on('click',function(){
        if($(this).is(':checked')){
            $('#where').parent('div').show();
            $('#where').removeAttr('disabled');
        }
        else{
            $('#where').parent('div').hide();
            $('#where').attr('disabled','disabled');
        }
    })

    // 提交
    $('form button').click(function(e){
    	if (!isWeixinBrowser()) {
    		alert('请在微信中打开本页面');
    		return;
    	}

        e.preventDefault();
        $('button').html('<i class="am-icon-spinner am-icon-spin"></i>');
        $('button').attr('disabled','disabled');

        var arr = $('form').serializeArray();
        var teacher_phone = $('input[name="teacher_phone"]').val();
        var teacher_name = $('input[name="teacher_name"]').val();
        var teacher_course = $('input[name="teacher_course"]').val();
        if(teacher_phone){
            var phone_arr = teacher_phone.split(' ');
            for(var j in phone_arr){
                if(!(/^1[34578]\d{9}$/.test(phone_arr[j]))){
                    alert("手机号码格式有误，请重填");
                    $('button').html('提交');
                    $('button').removeAttr('disabled');
                    return false ;
                }
            }
        }

        for(var i in arr){
            if(arr[i].name=='teacher_phone' || arr[i].name=='teacher_name' || arr[i].name=='teacher_course'){
                continue;
            }
            else if(arr[i].value == ''){
                alert('请完善您的信息！');
                $('button').html('提交');
                $('button').removeAttr('disabled');
                return false ;
            }
        }

        if(teacher_phone=='' && teacher_name=='' && teacher_course==''){

        }
        else{
            if(teacher_phone=='' || teacher_name=='' || teacher_course==''){ //部分是空，部分已填
                alert("“名称”“姓名”“手机号”数量不对应");
                $('button').html('提交');
                $('button').removeAttr('disabled');
                return false;
            }
            else if(teacher_phone.split(' ').length != teacher_course.split(' ').length || teacher_phone.split(' ').length != teacher_name.split(' ').length || teacher_course.split(' ').length != teacher_name.split(' ').length){ //全填但数量不一致
                alert("“名称”“姓名”“手机号”数量不对应");
                $('button').html('提交');
                $('button').removeAttr('disabled');
                return false;
            }
        }

        wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                arr.push({name:'begin_location',value:res.latitude+','+res.longitude});
//                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
//                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
//                    var speed = res.speed; // 速度，以米/每秒计
//                    var accuracy = res.accuracy; // 位置精度
                var formData = new FormData();
                arr.map(function(item) {
                    formData.append(item.name, item.value);
                });
                $.ajax({
                    method: 'post',
                    url: '/createdailyleave',
                    data: formData,
                    processData: false,
                    success: function (data) {
                        if(data.status==200){
                            var sucString = '提交成功，请等待审核';
                            if (isIll) {
                                sucString += '，祝早日康复';
                            }
                            dialog.success(sucString, location.href, 1500);
                        }
                    },
                    error: function () {
                        alert('操作失败，可能是网络问题，请联系管理员');
                    }
                })
            },
            cancel:function(){
                alert('请同意授权');
            },
            fail:function(res){
                alert('请打开手机定位服务');
            },
            complete: function() {
                $('button').html('提交');
                $('button').removeAttr('disabled');
            }
        });

    })
})


*/