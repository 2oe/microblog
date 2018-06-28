require(['jquery','swiper','render'],function($,swiper,render){
    var listSwiper = new swiper('.listCon');
    var local = window.localStorage;
    $('.tab_list').on('click', '.tab_item', function () {
        var idx = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        listSwiper.slideTo(idx);
    })
    $.ajax({
        url: '/api/list',
        dataType: 'json',
        success: function(res){
            console.log(res)
            render('#showTpl','.show',res.recommend);
            var arr = JSON.parse(local.getItem('great')) || [];
            arr.forEach(function(item){
                $('.show .like').eq(item.key).html(item.val);
                $('.show .like').eq(item.key).addClass('active');
            })
            $('.show').on('click','.like', function(){
                var index = $(this).parents('li').index();
                if(local.getItem('uid')){
                    if($(this).hasClass('active')){
                        var num = $(this).text() * 1;
                        num --;
                        $(this).text(num);
                        $(this).removeClass('active');
                        arr.forEach(function(item,idx){
                            if(item.key === index) {
                                arr.splice(idx,1);
                            }
                        })
                        local.setItem('great',JSON.stringify(arr));
                    } else {
                        var num = $(this).text() * 1;
                        num ++;
                        $(this).text(num);
                        $(this).addClass('active');
                        var obj = {};
                        obj.key = index;
                        obj.val = num;
                        arr.push(obj);
                        local.setItem('great',JSON.stringify(arr));
                    }
                } else {
                    $('.mark').show();
                }
            })
        },
        error:function(error){
            console.warn(error);
        }
    })
    $('.back').on('click',function(){
        location.href = '/';
        $('.mark').hide();
    })
    $('.login_btn').on('click',function(){
        $('.mark').show();        
    })
    $('#sub_btn').on('click',function(){
        var user = $('#user').val();
        var pwd = $('#pwd').val();
        $.ajax({
            url: '/api/login',
            dataType: 'json',
            type:'post',
            data:{
                user:user,
                pwd:pwd
            },
            success:function(res){
                console.log(res);
                if(res.code){
                    alert(res.msg);
                    local.setItem('uid',res.code);
                    $('.mark').hide();
                } else {
                    alert(res.msg);
                }
            },
            error:function(error){
                console.warn(error);
            }
        })
    })
})