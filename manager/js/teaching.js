$(document).ready(function() {
	$('#btn').hide();
});
//从localStorge中获取之前页面的个人信息
var info = JSON.parse(localStorage.info);

// 头像的上传接口隐藏，图片增大，localStorge中图片存进去，欢迎信息存进去
$('#headFile').hide();
$('.headimg').css({'height':'100px','width':'100px'}).attr('src',__DURL__+info.icon_path);

var num ;//获得点击下标

$('.option-container .menu li').click(function(){
	num = $(this).index();  //获得点击下标
	$('.option-container .menu li').removeClass('underlist');
	$(this).addClass('underlist');
	$('.content-container').hide();
	$('#content-container'+num).show();
	// 高度自适应
	// var height = $('#content-container'+num).find('.content-inner-rigth').css('height');
	// $('#content-container'+num).find('.content-inner-left').css({'height':height,'line-height':height});
	switch (num) {
		case 0:
			$('.info-container .button').html('上传成绩表');
            var year = new Date().getFullYear();//获得年份
            var str = '';
            for(var i = 0;i<4;i++){
                str += '<option value="'+ (year-i) +'">' + (year-i) + '年</option>'
            }
            var str1 = '';/*
            $.getJSON("../../course_name.json",function(result){
                console.log(result);
                for(var i in result.course_name){
                    str1 += '<option value="' + result.course_name[i] + '">' + result.course_name[i] + '</option>'
                }
                $('#course_name').html(str1);

            });*/
            $('#year').html(str);
			break;
		case 1:
		$('.info-container .button').html('导出教学大纲');

			// $.ajax({
			// 	method: 'post',
			// 	url: __URL__ + ,
			// 	dataType: 'json',
			// 	async:true,
			// 	data:  ,
			// 	contentType: "application/x-www-form-urlencoded; charset=utf-8",
			// 	success: function (data) {
			//
			//
			//
			// 		$('#content'+num).show()
			// 	},
			// 	error: function (XMLHttpRequest, textStatus) {
			// 		dialog.error('错误: '+XMLHttpRequest.textStatus+'请重试');
			// 	}
			// })
			break;
		case 2:
			$('.info-container .button').html('导出授课计划');
			// $.ajax({
			// 	method: 'post',
			// 	url: __URL__ + ,
			// 	dataType: 'json',
			// 	async:true,
			// 	data:  ,
			// 	contentType: "application/x-www-form-urlencoded; charset=utf-8",
			// 	success: function (data) {
			//
			//
			//
			// 		$('#content'+num).show()
			// 	},
			// 	error: function (XMLHttpRequest, textStatus) {
			// 		dialog.error('错误: '+XMLHttpRequest.textStatus+'请重试');
			// 	}
			// })
			break;
		case 3:
			$('.info-container .button').html('导出上课信息');
			// $.ajax({
			// 	method: 'post',
			// 	url: __URL__ + ,
			// 	dataType: 'json',
			// 	async:true,
			// 	data:  ,
			// 	contentType: "application/x-www-form-urlencoded; charset=utf-8",
			// 	success: function (data) {
			//
			//
			//
			// 		$('#content'+num).show()
			// 	},
			// 	error: function (XMLHttpRequest, textStatus) {
			// 		dialog.error('错误: '+XMLHttpRequest.textStatus+'请重试');
			// 	}
			// })
			break;
		case 4:
			$('.info-container .button').html('导出实验报告');
			// $.ajax({
			// 	method: 'post',
			// 	url: __URL__ + ,
			// 	dataType: 'json',
			// 	async:true,
			// 	data:  ,
			// 	contentType: "application/x-www-form-urlencoded; charset=utf-8",
			// 	success: function (data) {
			//
			//
			//
			// 		$('#content'+num).show()
			// 	},
			// 	error: function (XMLHttpRequest, textStatus) {
			// 		dialog.error('错误: '+XMLHttpRequest.textStatus+'请重试');
			// 	}
			// })
			break;
		case 5:
			$('.info-container .button').html('导出公告');
			// $.ajax({
			// 	method: 'post',
			// 	url: __URL__ + ,
			// 	dataType: 'json',
			// 	async:true,
			// 	data:  ,
			// 	contentType: "application/x-www-form-urlencoded; charset=utf-8",
			// 	success: function (data) {
			//
			//
			//
			// 		$('#content'+num).show()
			// 	},
			// 	error: function (XMLHttpRequest, textStatus) {
			// 		dialog.error('错误: '+XMLHttpRequest.textStatus+'请重试');
			// 	}
			// })
			break;
		case 6:
			$('.info-container .button').html('导出获奖信息');
			// $.ajax({
			// 	method: 'post',
			// 	url: __URL__ + ,
			// 	dataType: 'json',
			// 	async:true,
			// 	data:  ,
			// 	contentType: "application/x-www-form-urlencoded; charset=utf-8",
			// 	success: function (data) {
			//
			//
			//
			// 		$('#content'+num).show()
			// 	},
			// 	error: function (XMLHttpRequest, textStatus) {
			// 		dialog.error('错误: '+XMLHttpRequest.textStatus+'请重试');
			// 	}
			// })
			break;
		case 7:
		$('.info-container .button').html('添加新项目');
			// $.ajax({
			// 	method: 'post',
			// 	url: __URL__ + ,
			// 	dataType: 'json',
			// 	async:true,
			// 	data:  ,
			// 	contentType: "application/x-www-form-urlencoded; charset=utf-8",
			// 	success: function (data) {
			//
			//
			//
			// 		$('#content'+num).show()
			// 	},
			// 	error: function (XMLHttpRequest, textStatus) {
			// 		dialog.error('错误: '+XMLHttpRequest.textStatus+'请重试');
			// 	}
			// })
			break;
		case 8:
		$('.info-container .button').html('导出考核表');
			// $.ajax({
			// 	method: 'post',
			// 	url: __URL__ + ,
			// 	dataType: 'json',
			// 	async:true,
			// 	data:  ,
			// 	contentType: "application/x-www-form-urlencoded; charset=utf-8",
			// 	success: function (data) {
			//
			//
			//
			// 		$('#content'+num).show()
			// 	},
			// 	error: function (XMLHttpRequest, textStatus) {
			// 		dialog.error('错误: '+XMLHttpRequest.textStatus+'请重试');
			// 	}
			// })
			break;
		default:

	}
})

// 按钮添加相关操作或弹出层
$('.info-container .button').click(function(){
	switch (num){
		case 0:
            $('#my-prompt').modal({
                relatedTarget: this,
                onConfirm: function() {
                    console.log(123)
                    $.ajax({
                        method: 'post',
                        url: __URL__ + '/calculate',
                        timeout: 10 * 60 * 1000,//十分钟
                        data:new FormData($('.am-form')[0]),
                        crossDomain: true,
                        dataType: 'json',
                        xhrFields: {
                            withCredentials: true
                        },
                        processData:false,
                        contentType:false,
                        xhr: function(){
                            myXhr = $.ajaxSettings.xhr();
                            if(myXhr.upload){
                                $('#progress').modal();
                                myXhr.upload.addEventListener('progress',function(e) {
                                    if (e.lengthComputable) {
                                        var percent = Math.floor(e.loaded/e.total*100);
                                        // if(percent <= 100) {
                                        $("#progress .am-progress-bar").css('width', percent+'%');
                                        // }
                                        // if(percent >= 100) {
                                        //     $("#J_progress_label").html('文件上传完毕，请等待...');
                                        //     $("#J_progress_label").addClass('success');
                                        // }
                                    }
                                }, false);
                            }
                            return myXhr;
                        },
                        success: function (data) {
                            $('#progress').modal('close');
                            $("#progress .am-progress-bar").css('width', 0);
                            if(data.status==200){
                                var str = '创建成功！达成度结果如下：<br>';
                                for(var i in data.data){
                                    var t = JSON.parse(data.data[i])
                                    if(i == 'CG'){
                                        for(var j in t){
                                            if(j == '' || t[j] == '') continue;
                                            str += '课程目标'+j+' : ' + t[j] +'<br>'
                                        }
                                    }
                                    if(i == 'GS'){
                                        for(var j in t){
                                            if(j == '' || t[j] == '') continue;
                                            str += '毕业要求'+j+' : ' + t[j] +'<br>'
                                        }
                                    }
                                }
                                layer.open({

                                    content:str,
                                    icon:1,
                                    btn:false
                                })
                                return ;
                            }
                            else if(data.status == 430 || data.status==460){
                                location.href = '../index.html';
                            }
                            else {
                                dialog.error('错误码：'+ data.status +'</br>错误信息：'+data.msg);
                                return ;
                            }

                        },
                        error: function () {
                            $('#progress').modal('close');
                            $("#progress .am-progress-bar").css('width', 0);
                            $('#progress').modal('close');
                            dialog.error('上传失败，可能是网络问题，请联系管理员')
                            return ;
                        },
                        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                            $('#progress').modal('close');
                            $("#progress .am-progress-bar").css('width', 0);
                            if(status=='timeout'){//超时,status还有success,error等值的情况
                                ajaxTimeoutTest.abort();
                                dialog.error("上传超时，可能是文件过大");
                            }
                        }
                    })
                },
                onCancel: function(e) {
                },
                closeOnConfirm:false
            });
            //等待上传的显示
            $('#doc-form-file').on('change', function() {
                var files = document.getElementById("doc-form-file").files;
                var str = '';
                for(var i=0;i<files.length;i++){
                    str+='<p>'+ files[i].name +'</p>';
                }
                $('.am-modal-content').html(str?str:'');
            });
            $('#model').attr('href',__DURL__+'storage/reach/model.xlsx');
            break;
        default:break;
	}
})

$('.option-container .menu li:eq(0)').click(); //默认点击第一个
// $('td').addClass('am-text-middle'); //给所有td添加垂直居中样式

