var localStorageInfo;
// 文件上传
$(document).ready(function() {
	$('#btn').hide();

	var addedFiles;

	// -------------------
	var operator = 'baiyan';
	var password = CryptoJS.MD5('qlc_2017-#*m').toString();
	var date = new Date().toGMTString();
	var method = 'POST';
	var uri = '/cbs-service';
	var options = {
		'bucket': 'cbs-service',
		'save-key': '/{year}/{mon}{day}/{filename}{.suffix}',
		'expiration': new Date().getTime() + 3600,
		'date': date
	};
	localStorageInfo = JSON.parse(localStorage.info);
	// !!! 假设某天推广到了其它学院 记得把这里的cbs改成学院代号变量 !!!
	options['save-key'] = '/cbs/file/' + localStorageInfo.id + options['save-key'];

	var policy = window.btoa(JSON.stringify(options));

	var str = method + '&' + uri + '&' + date + '&' + policy;
	//var signature = window.btoa(CryptoJS.HmacSHA1(str, password));
	var signature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(str, password));

	var authorization = 'UPYUN ' + operator + ':' + signature; 

	// -------------------

	var uploader = new plupload.Uploader({
		runtimes : 'html5,flash,silverlight',
		url : 'https://v0.api.upyun.com/cbs-service',
		browse_button : 'pickfiles', // you can pass in id...
		container: document.getElementById('leftcontainer'), // ... or DOM Element itself
		flash_swf_url : '../dist/js/Moxie.swf',
		silverlight_xap_url : '../dist/js/Moxie.xap',

		multipart: true,
		multipart_params: {
			'Content-Type': 'multipart/form-data',
			'policy': policy,
			'authorization': authorization
		},

		init: {
			PostInit: function() {
				$('#startup').on('click', function() {
					cusAlert('正在尝试上传文件');
					uploader.start();
					return false;
				});
			},

			FilesAdded: function(up, files) {
				addedFiles = files;
				$('#filelist').html('');
				if (files) {
					$('#nofilechosen').hide();
				} else {
					$('#nofilechosen').show();
				}
				plupload.each(files, function(file) {
					var newHtml = $('#filelist').html() 
					            + '<div class="fileitem" id="' 
					            + file.id + '">' + file.name 
					            + ' (' + plupload.formatSize(file.size) 
					            + ') <b></b></div>';
					$('#filelist').html(newHtml);
				});
			},

			UploadProgress: function(up, file) {
				$('#' + file.id).find('b').html('<span>' + (file.percent - 1) + "%</span>");
			},

			FileUploaded: function(up, file, info) {
				var response = JSON.parse(info.response);

				var formData = new FormData();
				var fdfilename;
				var curfileid;
				plupload.each(addedFiles, function(addedfile) {
					if (addedfile['origSize'] == response['file_size']) {
						fdfilename = addedfile['name'];
						curfileid = addedfile['id'];
						// $('#' + addedfile.id).find('b').html('<span>100% 上传成功!</span>');
						return;
					}
				});
				formData.append('filename', fdfilename);
				formData.append('url', 'https://cbs-service.b0.upaiyun.com' + response.url);
				ajaxUploadDetail(formData, curfileid);
				//document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML += ' [Url]: http://cbs-service.b0.upaiyun.com' + response.url;
			},

			Error: function(up, err) {
				
			}
		}
	});

	uploader.init();
});

$(document).ready(function() {
	// 获取自己的文件
	ajaxGetFileList('');

	// 教务老师获取教师列表
	if (localStorageInfo.file_level > 0) {
		$('#teachersandfiles').show();
		ajaxGetTeachersList();
		$('#return').on('click', function() {
			$('#return span').html('<i class="am-icon-spinner am-icon-spin"></i>');
			ajaxGetTeachersList();
		});
		$('#edit').on('click', function() {
			$('#return, #edit').hide();
			$('#return2').show();
			$('#teachersandfiles a').hide();
			$('#teachersandfiles .fileicon-container-delete').css('display', 'inline-block');
		});
		$('#return2').on('click', function() {
			$('#return2').hide();
			$('#return, #edit').show();
			$('#teachersandfiles a').show();
			$('#teachersandfiles .fileicon-container-delete').hide();
		});
	}
});

// 上传文件到又拍云之后，用这个函数上传具体信息到咱的服务器
function ajaxUploadDetail(formData, curfileid) {
	$.ajax({
	    type: 'POST',
	    url: '/file',
	    data: formData,
	    processData: false,
	    success: function (data) {
	        if (data.status == 200) {
	        	$('#' + curfileid).find('b').html('上传成功！');
	        } else {
	        	$('#' + curfileid).find('b').html(data.status + ' ' + data.msg);
	        }
	        var allSucceeded = true;
	        $('.fileitem').each(function() {
	        	if($(this).find('b').html() != '上传成功！') {
	        		allSucceeded = false;
	        	}
	        });
	        if (allSucceeded) {
	        	cusAlert('全部上传完成！');
	        	location.reload();
	        }
	    }
	})
}

// 获取文件列表，不传id获取自己的
function ajaxGetFileList(id, deleteMode) {
	deleteMode = deleteMode || false;
	$.ajax({
	    type: 'GET',
	    url: '/file' + (id?('/'+id):''),
	    success: function (data) {
	        if(data.status == 200){
	            if (id == '') {
	            	deployFileList(data.data, 'files', id);
	            } else {
	            	deployFileList(data.data, 'teachersandfiles', id);
	            }
	            if (deleteMode) {
	            	$('#edit').click();
	            }
	        }
	    }
	});
}

// 获取教师列表
function ajaxGetTeachersList() {
	$.ajax({
	    type: 'GET',
	    url: '/teachers',
	    success: function (data) {
	        if(data.status == 200){
	            deployTeachersList(data.data);
	        }
	    },
	    complete: function() {
	        $('#return span').html('返回');
	    }
	});
}

function ajaxDeleteFile(fileid, teacherid) {
	$.ajax({
	    type: 'DELETE',
	    url: '/file/' + fileid,
	    success: function (data) {
	        if (data.status == 200) {
	            cusAlert('成功删除该文件');
	            ajaxGetFileList(teacherid, true);
	            if (localStorageInfo.id == teacherid) {
	            	ajaxGetFileList('');
	            }
	        }
	    },
	    complete: function() {
	        $('#delete-confirm').modal('close');
	    }
	});
}

function deployFileList(data, target, teacherid) {
	var source = $('#handlebars-template-files').html();
	var template = Handlebars.compile(source);
	$('#' + target).html(template(data));
	if (target == 'files') {
		appendFloatTitle(target, '我上传的文件');
	} else {
		appendFloatTitle(target, '教师文件');
		$('#return').show();
		if (data.length) {
			$('#edit').show();
		}
	}
	$('.fileicon-container').each(function() {
		var wholename = $(this).find('p').eq(0).text();
		var filename = wholename.split('.')[0];
		var suffix = wholename.split('.').slice(1).join('.');
		var imgname = 'iconfile.png';
		switch(suffix) {
			case 'txt':
				imgname = 'icontxt.png'; break;
			case 'doc':
			case 'docx':
				imgname = 'icondoc.png'; break;
			case 'ppt':
			case 'pptx':
				imgname = 'iconppt.png'; break;
			case 'xls':
			case 'xlsx':
				imgname = 'iconxls.png'; break;
			case 'pdf':
				imgname = 'iconpdf.png'; break;
			case 'bmp':
			case 'gif':
			case 'jpg':
			case 'jpeg':
			case 'png':
				imgname = 'iconpic.png'; break;
			case 'zip':
			case 'rar':
			case '7z':
				imgname = 'iconzip.png'; break;
			case 'mov':
			case 'mp4':
			case 'flv':
			case 'avi':
			case 'wmv':
			case 'mkv':
			case 'rm':
			case 'rmvb':
			case 'asf':
				imgname = 'iconmovie.png'; break;
		}
		var src = '../shared/img/' + imgname;
		$(this).find('img').eq(0).attr('src', src);
		
		var maxL = 9;
		if(filename.length > maxL) {
			filename = filename.slice(0, maxL - 1) + '...' + suffix;
			$(this).find('p').text(filename);
		}

	});

	$('.updatedat').each(function() {
		var updatedat = $(this).attr('data-time').split(' ')[0];
		$(this).text(updatedat);
	});

	// 教务老师删文件
	$('#teachersandfiles .fileicon-delete').on('click', function() {
		var fileid = $(this).parent().attr('data-id');
		var filename = $(this).parent().attr('title');
		$('#dc-body').html('你确定要删除这个文件吗？');
		$('#dc-title').text(filename);
		$('#delete-confirm').modal({
			relatedTarget: this,
			onConfirm: function(options) {
				fileid = $(this.relatedTarget).parent().attr('data-id');
				$('#dc-body').html('<i class="am-icon-spinner am-icon-spin"></i>');
				ajaxDeleteFile(fileid, teacherid);
			},
	        closeOnConfirm: false,
	    });
	});
}

function deployTeachersList(data) {
	if (!(/metasr/i.test(window.navigator.userAgent))) {
		data.sort(function(a, b) {
        var _qiujian = '求建';
        if (a.name == '仇建')
            return _qiujian.localeCompare(b.name, 'zh');
        if (b.name == '仇建')
            return a.name.localeCompare(_qiujian, 'zh');
        return a.name.localeCompare(b.name, 'zh');
    });
	}
	var source = $('#handlebars-template-teachersandfiles').html();
	var template = Handlebars.compile(source);
	$('#teachersandfiles').html(template(data));
	appendFloatTitle('teachersandfiles', '选择教师');
	$('.teacher-container').on('click', function() {
		$(this).find('span').html('<i class="am-icon-spinner am-icon-spin"></i>');
		ajaxGetFileList($(this).attr('data-id'));
	});
	$('#return, #edit').hide();
}

// 贴在右边的那个标题
function appendFloatTitle(domid, text) {
	if (window.innerWidth > 639) {
		var floattitle = $('#' + domid + ' .floattitle-container');
		if (floattitle.length) {
			floattitle.find('span').text(text);
		} else {
			var source = $('#handlebars-template-floattitle').html();
			var template = Handlebars.compile(source);
			$('#' + domid).css({
				'position': 'relative',
				'overflow': 'visible'
			}).append(template({
				'text': text
			}));
			$('#rightcontainer').children().addClass('floatbase-margin');
		}
	}
}