var express = require('express');

var router = express.Router();
//引入数据库进行登录名比较
var userobj = require('../models/usermodel.js');

//统一返回格式
var responseData;
router.use(function(req,res,next){
    responseData = {
        code: 0,
        message:''
    };
    next();
});

/*
* 用户注册
*   注册逻辑
*   1.用户名不能为空
*   2.密码不能为空
*   3.两次输入密码必须一致
*
* */


router.post('/user/register',function(req,res,next){

    // 熟悉req的属性
    // console.log(req.method);
    // console.log(req.hostname);
    // console.log(req.ip);
    // console.log(req.path);
    // console.log(req.baseUrl);
    // console.log(req.originalUrl);
    // console.log(req.body);
    // console.log(req.route);
    // console.log(req.query);
    // console.log(req.params);

    var usernamedata = req.body.username;
    var passworddata = req.body.password;
    var repassworddata = req.body.repassword;

    //用户名是否为空
    if(usernamedata==''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }

    //密码是否为空
    if(passworddata==''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }

    //两次输入的密码必须一致
    if(passworddata != repassworddata){
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json(responseData);
        return;
    }

    //用户名是否已经被注册，如果数据库已经存在和我们要的注册名同名的数据，表示该用户名已被注册
    userobj.findOne({'username':usernamedata})
        .then(function(userInfo){
            if(userInfo){
            //数据库中已有该数据
            responseData.code = 4;
            responseData.message = '用户名已被注册';
            res.json(responseData);
            return;
            }
            //保存用户注册的信息到数据库中
            var userNew = new userobj({
                username:usernamedata,
                password:passworddata
            });
             return userNew.save();
    }).then(function(userNewInfo){
        responseData.message = '注册成功';
        res.json(responseData);
    });
});

router.post('/user/login',function(req,res,next){
    var usernamedata = req.body.username;
    var passworddata = req.body.password;

    //打印http请求传入的数据
    console.log("成功接收请求用户数据：("+ usernamedata + "," + passworddata + ")");

    if(usernamedata=='' || passworddata==''){
        responseData.code = 1;
        responseData.message = '用户名或密码不能为空';
        res.json(responseData);
        return;
    }
    console.log("正在查询用户信息是否匹配...");
    //查询数据库中相同用户名和密码是否存在，如存在则登录成功
    userobj.findOne({
        'username':usernamedata,
        'password':passworddata
    }).then(function(userInfo){
                if(!userInfo){
                responseData.code = 2;
                responseData.message = '用户名或密码错误';
                res.json(responseData);
                console.log("2 - 用户名或密码错误");
                return;
                }
                //用户名和密码正确
                responseData.message = '登录成功';
                responseData.userInfo = {
                    _id : userInfo._id,
                    username:userInfo.username
                };
                //json的字段名称在双引号中,"firstName":"John" 等价于 firstName = "John"
                res.cookie('userInfo',JSON.stringify({
                                        "_id":userInfo._id,
                                        "username":userInfo.username})
                    // {maxAge:5000,path:'/'}
                );

                res.json(responseData);
                console.log(responseData);
                console.log("responseData & cookie successfully send");
            //登录成功发送cookie给浏览器

                return;
    });

});
module.exports = router;