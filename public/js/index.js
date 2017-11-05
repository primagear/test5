$(function(){
    $('#login').find('a').on('click',function(){
        $('#login').hide();
        $('#regis').show();
    });

    $('#regis').find('a').on('click',function(){
        $('#login').show();
        $('#regis').hide();
    });

    $('#regis').find('button').on('click',function(){
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$('#regis').find("input[name='username']").val(),
                password:$('#regis').find("input[name='password']").val(),
                repassword:$('#regis').find("input[name='repassword']").val()
            },
            dataType:'json',
            success:function(res){
                $('#regis').find('p.warning').html(res.message);
                if(!res.code){
                    setTimeout(function(){
                        $('#login').show();
                        $('#regis').hide();
                    },1000)
                }
            }
        })
    });

    $('#login').find('button').on('click',function(){
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$('#login').find("input[name='username']").val(),
                password:$('#login').find("input[name='password']").val()
            },
            dataType:'json',
            success:function(res){
                if(!res.code){
                    console.log(res);
                    //登录成功

                    setTimeout(function(){
                        $('#login').hide();
                        $('#regis').hide();
                        $('#adminPanel').show();

                        //显示登录用户的信息
                        // $('#adminPanel').find(".username").html(res.userInfo.username);
                        // $('#adminPanel').find(".info").html("欢迎登录");
                    },1000)


                }
            }
        })
    });

    $('#quit').on('click',function(){
        $('#login').show();
        $('#regis').show();
        $('#adminPanel').hide();
    })
})

