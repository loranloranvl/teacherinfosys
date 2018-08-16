$(function(){
    $.ajax({
        url: '/jssdk',
        success: function (data) {
            if(data.status==200){
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
    $.ajax({
        url: '/getdailyleave',
        success: function (data) {
            if(data.status==200){
                var str = '';

                if (data.data.length > 0) {
                    for(var i in data.data){
                        str += '<tr>';
                        str +='<td>'+  data.data[i].begin_time + ' ~ '+ data.data[i].end_time+'</td>';
                        str +='<td>'+ data.data[i].leave_reason +'</td>';
                        str += '<td><a class="am-badge am-badge-secondary am-radius am-text-md" href="javascript:void(0)" onclick="xiaojia('+data.data[i].id+')">销假</a></td>'
                        str += '</tr>';
                    }
                } else {
                    str = '<tr><td colspan="3" style="font-size:16px; font-weight:400;" class="am-text-middle am-text-center">不需要销假</td></tr>';
                }
                $('tbody').html(str);
            }
        }
    })
})


function xiaojia(id){
    if(confirm('确认销假？')){
        wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                $.ajax({
                    url: '/deletedailyleave/'+id+'/'+res.latitude+','+res.longitude,
                    success: function (data) {
                        if(data.status==200){
                            dialog.success('销假成功',location.href)
                            return ;
                        }
                    }
                })
            },
            cancel:function(){
                alert('请同意授权！');
            },
            fail:function(res){
                alert('请打开手机定位服务！');
            }
        });
    }
}