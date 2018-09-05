/* ajax data interface */

function ajaxAgree(params) {
    $.ajax({
        method: 'post',
        url: 'leave/pc/authLeave',
        data: params,
        success: function(data) {
            if (data.status == 200) {
                dialog.success('审批成功');
                reload();
            }
        }
    })
}

function ajaxGetLeaveRequests(page) {
    $.ajax({
        url: 'leave/pc/getAuthingLeave',
        data: {
            page: page
        },
        success: function(data) {
            if (data.status == 200) {
                deployLeaveRequests(data.data);
            }
        }
    })
}

function ajaxGetDailyLeave(page) {
    $.ajax({
        url: 'leave/pc/getLeaveAuthHistory',
        data: {
            page: page
        },
        success: function(data) {
            if (data.status == 200) {
                deployDaily(data.data)
            }
        }
    })
}

function ajaxCreateHolidayLeave(params) {
    $.ajax({
        method: 'post',
        url: 'leave/pc/addHolidayLeaveModel',
        data: params,
        success: function(data) {
            if (data.status == 200) {
                dialog.success('创建成功');
                reload();
            }
        }
    })
}

function ajaxGetHolidayList(page) {
    $.ajax({
        url: 'leave/pc/getHolidayLeaveModelHistory',
        data: {
            page: page
        },
        success: function(data) {
            if (data.status == 200) {
                deployHolidayList(data.data);
            }
        }
    })
}

function ajaxGetHolidayDetail(page, id) {
    $.ajax({
        url: 'leave/pc/getHolidayLeaveDetail',
        data: {
            page: page,
            id: id
        },
        success: function(data) {
            if (data.status == 200) {
                deployHolidayDetail(data.data, id);
            }
        }
    })
}

/* deployers */

function deployLeaveRequests(data) {
    HDeploy('awaiting', data);
    deployPagi(data, ajaxGetLeaveRequests);
    $("#awaiting button").on('click', function() {
        $('#agree-prompt').modal({
            relatedTarget: this,
            onConfirm: function() {
                ajaxAgree({
                    status: $(this.relatedTarget).attr('data-status'),
                    id: $(this.relatedTarget).parent().attr('data-id'),
                    auth_reason: $('#agree-prompt input').val()
                })
            }
        }).find('input').val($(this).text())
    });
}

function deployDaily(data) {
    HDeploy('daily', data);
    deployPagi(data, ajaxGetDailyLeave);
    $('td[data-status]').each(function() {
        switch($(this).attr('data-status')) {
            case '2':
                $(this).text('已通过').css('color', '#5cb85c');
                break;
            case '1':
                $(this).text('待审核').css('color', '#99979c');
                break;
            case '3':
                $(this).text('已拒绝').css('color', '#d9534f');
                break;
        };
    });
}

var holiday = {
    title: '',
    from: '',
    to: ''
}

function deployHolidayList(data) {
    HDeploy('jiejiari', data);
    deployPagi(data, ajaxGetHolidayList);
    $('#jiejiari').find('.lg tr, .md').on('click', function() {
        ajaxGetHolidayDetail(1, $(this).attr('data-id'));
        for (var key in holiday) {
            holiday[key] = $(this).attr('data-' + key);
        }
    })
}

function deployHolidayDetail(data, id) {
    $('#jiejiari').hide();
    holiday.students = data.data;
    HDeploy('jiejiari-detail', holiday);
    $('#jiejiari-detail').show();
    deployPagi(data, ajaxGetHolidayDetail, id);
    $('#detail-return').on('click', function() {
        $('#jiejiari-detail').hide();
        $('#jiejiari').show();
    })
}

// function ajaxGetHolidayLeave() {
//     $.ajax({
//         url: 'holidayleave',
//         success: function(data) {
//             if (data.status == 200) {
                
//             }
//         }
//     })
// }

$(document).ready(function() {
    $('#jiejiari-end').on('change', function() {
        var year = $(this).val().split('-')[0];
        $('#title option').each(function() {
            var title = year + ' ' + $(this).attr('data-holiday');
            $(this).text(title).attr('value', title);
        })
    })
    $('#btn-content').text('新节假日');
    activateDatepicker('#add-prompt input');
    $('#btn').on('click', function() {
        $('#add-prompt').modal({
            relatedTarget: this,
            onConfirm: function() {
                var title = $('#title').val();
                var begin = $('#jiejiari-begin').val();
                var end = $('#jiejiari-end').val();
                if (!(begin && end)) {
                    dialog.error('请完善节假日信息');
                    return;
                }
                ajaxCreateHolidayLeave({
                    title: title,
                    from: begin,
                    to: end
                })
            }
        });
    })

    Handlebars.registerPartial('where', $('#ht-where').html());
    $('#top li').on('click', function() {
        var target = $(this).attr('data-target');
        $('#main > div').hide();
        switch (target) {
            case 'awaiting': ajaxGetLeaveRequests(); break;
            case 'daily': ajaxGetDailyLeave(); break;
            case 'jiejiari': ajaxGetHolidayList(); break;
        }
        $('#' + target).show();
        $('#top li').css({
            color: '#999',
            textDecoration: 'none'
        });
        $(this).css({
            color: 'black',
            textDecoration: 'underline'
        })
    })
    $('#top li').eq(2).click();

    $('.submit-agree').on('click', function() {
        ajaxAgree({
            id: $(this).parent().attr('data-id'),
            status: 2,
            auth_reason: ''
        })
    })
})



// /*
//     功能：批量同意日常请假
//  */
// function agreeAll(){
//     layer.prompt({
//         formType: 0,
//         value: '',
//         title: '请输入同意备注',
//     }, function(value, index, elem){

//         var formData = new FormData();
//         formData.append('is_pass', 1);
//         formData.append('pass_reason', value);
//         $.ajax({
//             method: 'post',
//             url: '/dailyleave',
//             data: formData,
//             processData: false,
//             success: function (data) {
//                 if(data.status == 200){
//                     dialog.success('提交成功',document.URL);
//                 }
//             }
//         });

//         layer.close(index);
//     });
// }
// /*
//     功能：返回表格中应显示信息的html
//     参数：信息数组
//  */
// function getUnverifyTrHtml(data){
//     var str = '';
//     for(var i in data){
//         str += '<tr>';
//         str += '<td class="am-text-middle">'+data[i].uid+'</td>';
//         str += '<td class="am-text-middle">'+data[i].name+'</td>';
//         str += '<td class="am-text-middle">'+data[i].phone+'</td>';
//         str += '<td class="am-text-middle">'+data[i].major+data[i].class+'班</td>';
//         str += '<td class="am-text-middle" style="width: 12%">'+data[i].begin_time+' 第'+data[i].begin_course +'节课<br>'+data[i].end_time + ' 第'+data[i].end_course +'节课</td>';
//         str += '<td class="am-text-middle">'+data[i].leave_reason+'</td>';
//         str += '<td class="am-text-middle">'+(data[i].teacher_course?data[i].teacher_course:'')+'</td>';
//         str += '<td class="am-text-middle">'+(data[i].teacher_name?data[i].teacher_name:'')+'</td>';
//         str += '<td class="am-text-middle">'+(data[i].teacher_phone?data[i].teacher_phone:'')+'</td>';
//         str += '<td class="am-text-middle">'+(data[i].is_leave?'是':'否')+'</td>';
//         str += '<td class="am-text-middle">'+data[i].where+'</td>';
//         str += '<td class="am-text-middle"><a style="margin:0 3px;" class="am-badge am-badge-success am-radius am-text-md"href="javascript:void(0)"onclick="saveResult('+ data[i].id +',1)">同意</a><a style="margin:0 3px;" class="am-badge am-badge-danger am-radius am-text-md"href="javascript:void(0)"onclick="saveResult('+ data[i].id +',-1)">拒绝</a><a style="margin:0 3px;" class="am-badge am-badge-secondary am-radius am-text-md"href="http://apis.map.qq.com/uri/v1/geocoder?coord='+data[i].begin_location+'&referer=myapp" target="_blank" ">查看请假地点</a></td>'
//         str += '</tr>';
//     }

//     return str;
// }

// /*
//     功能：弹出允许/拒绝的理由窗口，上传结果
//     参数：id：请假id,type：1->同意，-1->拒绝
//  */
// function saveResult(id,type){
//     layer.prompt({
//         formType: 0,
//         value: '',
//         title: '请输入'+(type==1?'同意备注':'拒绝理由'),
//     }, function(value, index, elem){

//             var formData = new FormData();
//             formData.append('id', id);
//             formData.append('is_pass', type);
//             formData.append('pass_reason', value);

//             $.ajax({
//                 method: 'post',
//                 url: '/dailyleave',
//                 data: formData,
//                 processData: false,
//                 success: function (data) {
//                     if(data.status==200){
//                         dialog.success('提交成功',document.URL);
//                     }
//                 }
//             })

//         layer.close(index);
//     });
// }

// /*
//     功能：返回ul li数据
//     参数：信息数组
//  */
// function getQingjiaLiHtml(data){
//     var str = '';
//     for(var i in data){
//         str += '<li><a href="#tab'+i+'">'+i+'班</a></li>';
//     }
//     str += '<li><a  class="download-excel"  >导出请假表格</a></li>';
//     return str
// }

// /*
//      功能：返回div 里面需要展示数据
//      参数：data:信息数组，type：1：日常请假,2：节假日登记
//  */
// function getQingjiaDivHtml(data,type){
//     var str = '';
//     for(var i in data){
//         if(type==1){
//             str += '<div class="am-tab-panel" id="tab'+ i +'"><table class="am-table am-table-bordered "><thead><tr><th>学号</th><th>姓名</th><th>联系电话</th><th>班级</th><th>请假时间</th><th>请假原因</th><th>请假期间涉及课程</th><th>请假期间涉及课程教师姓名</th><th>请假期间涉及课程教师手机号</th><th>是否离杭</th><th>去往何处</th><th>销假日期</th><th>操作</th></tr></thead><tbody>';
//         }
//         else{
//             str += '<div class="am-tab-panel" id="tab'+ i +'"><table class="am-table am-table-bordered "><thead><tr><th>学号</th><th>姓名</th><th>联系电话</th><th>班级</th><th>请假时间</th><th>是否离杭</th><th>去往何处</th><th>销假日期</th></tr></thead><tbody>';
//         }

//         for(var j in data[i]){

//             if(type == 1 && data[i][j].is_leave && !data[i][j].cancel_time){
//                 str += '<tr class="am-danger">';
//             }
//             else if(type == 2 && data[i][j].is_leave && !data[i][j].cancel_time){
//                 str += '<tr class="am-danger">';
//             }
//             else{
//                 str += '<tr>';
//             }
//             str += '<td>' + data[i][j].uid + '</td>';
//             str += '<td>' + data[i][j].name + '</td>';
//             str += '<td>' + data[i][j].phone + '</td>';
//             str += '<td>' + data[i][j].major+ data[i][j].class + '班</td>';
//             str += '<td>'+ data[i][j].begin_time + ' ~ ' + data[i][j].end_time + '</td>';
//             if(type == 1){
//                 str += '<td>'+data[i][j].leave_reason+'</td>';
//                 str += '<td>'+data[i][j].teacher_course+'</td>';
//                 str += '<td>'+data[i][j].teacher_name+'</td>';
//                 str += '<td>'+data[i][j].teacher_phone+'</td>';
//             }
//             str += '<td>'+(data[i][j].is_leave?'是':'否')+'</td>';
//             str += '<td>'+data[i][j].where+'</td>';
//             str += '<td>'+(data[i][j].cancel_time?data[i][j].cancel_time:'')+'</td>';
//             if(type==1){
//                 if(data[i][j].cancel_location){
//                     str += '<td><a class="am-badge am-badge-secondary am-radius am-text-md"href="http://apis.map.qq.com/uri/v1/geocoder?coord='+data[i][j].begin_location+'&referer=myapp" target="_blank" ">查看请假地点</a><a class="am-badge am-badge-primary am-radius am-text-md"href="http://apis.map.qq.com/uri/v1/geocoder?coord='+data[i][j].cancel_location+'&referer=myapp" target="_blank" ">查看销假地点</a></td>'
//                 }
//                 else{
//                     str += '<td><a class="am-badge am-badge-secondary am-radius am-text-md"href="http://apis.map.qq.com/uri/v1/geocoder?coord='+data[i][j].begin_location+'&referer=myapp" target="_blank" ">查看请假地点</a></td>'
//                 }
//             }
//             str += '</tr>';
//         }

//         str +='</tbody></table></div>';
//     }
//     return str;

// }

// $(function(){

//     //从localStorge中获取之前页面的个人信息
//     var info = JSON.parse(localStorage.info);


//     // 头像的上传接口隐藏，图片增大，localStorge中图片存进去，欢迎信息存进去

//     $('#headFile').hide();
//     $('.headimg').css({'height':'100px','width':'100px'}).attr('src',__DURL__+info.icon_path);

//     //  li样式与所属div的对应显示与隐藏

//     $('.option-container .menu li').click(function(){
//         var num = $(this).index();  //获得点击下标
//         $('.option-container .menu li').removeClass('underlist');
//         $(this).addClass('underlist');
//         $('.content-container').hide();
//         $('.content-container').eq(num).show();
//     })

//     //添加按钮的文字改变

//     $('.info-container .button').html('添加节假日登记').on('click',function(){

//         $('#my-prompt').modal({
//             relatedTarget: this,
//             onConfirm: function(e) {
//                var arr = $('#my-prompt form').serializeArray();
//                for(var i in arr){
//                    if(!arr[i].value){
//                        dialog.error('请完善您的信息！');
//                        return false;
//                    }
//                }
//                if($('input[name="from"]').val()>$('input[name="to"]').val() == true ){
//                    dialog.error('开始日期应小于结束日期！');
//                    return false;
//                }
//                var formData = new FormData();
//                arr.map(function(item) {
//                     formData.append(item.name, item.value);
//                });
//                 $.ajax({
//                     method: 'post',
//                     url: '/leaveinfo',
//                     data: formData,
//                     processData: false,
//                     success: function (data) {
//                         if(data.status==200){
//                             dialog.success('创建成功',document.URL);
//                         }
//                     }
//                 });
//             },
//         });
//     });

//     // 待审核页面

//     $('.option-container .menu li:eq(0)').click(function(){
//         $.ajax({
//             type: 'GET',
//             url: '/notVerifiedLeaves',
//             success: function (data) {
//                 if(data.status==200){
//                     if(data.data.length){
//                         $('#agreeAll').show();
//                     }
//                     $('#unverify tbody').html(getUnverifyTrHtml(data.data));
//                     return ;
//                 }
//             }
//         })
//     })

//     // 日常页面

//     $('.option-container .menu li:eq(1)').click(function(){
//         $.ajax({
//             type: 'GET',
//             url: '/dailyleave',
//             success: function (data) {
//                 if(data.status==200){
//                     $('#richang .am-tabs ul').html(getQingjiaLiHtml(data.data));
//                     $('#richang .am-tabs>div').html(getQingjiaDivHtml(data.data,1));
//                     $('#richang .download-excel').click(function(){
//                         window.open(__URL__ + 'dailyleaveexport')
//                     })
//                     return ;
//                 }
//             }
//         })
//     })

//     // 节假日页面

//     $('.option-container .menu li:eq(2)').click(function(){

//         //  获取节假日详细信息

//         $.ajax({
//             type: 'GET',
//             url: '/holidayleave',
//             success: function (data) {
//                 console.log('holiday leave', data.data);
//                 if(data.status==200){
//                     $('#jiejiari .am-tabs ul').html(getQingjiaLiHtml(data.data));
//                     $('#jiejiari .am-tabs>div').html(getQingjiaDivHtml(data.data,2));
//                     $('#jiejiari .download-excel').click(function(){
//                        window.open(__URL__ + 'dailyleaveexport')
//                     })

//                     for(var i in data.data){
//                         $('#jiejiari>p:eq(1)').html("当前通知是：" + data.data[i][0].title);
//                         break;
//                     }

//                     return ;
//                 }
//             }
//         })



//     })


//     //默认点击url里面default的值，如果没有，默认为0

//     // $('.option-container .menu li:eq('+ (getQueryString('default')?getQueryString('default'):'0') +')').click();
// })

