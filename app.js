
var express =  require('express');
//加载express模块,创建app应用，nodejs Http.createServer()
var app = express();
//加载模板处理模块
var swig = require('swig');
//加载数据库模块
var mongoose = require('mongoose');
//加载body-parser，用来处理post提交过来的数据
var bodyParser = require('body-parser');
//加载cookie模块
var cookieParser = require('cookie-parser');
//bodyParser设置
app.use(bodyParser.urlencoded({extend:true}));
app.use(cookieParser());

var usermodel = require('./models/usermodel');

//路由信息（接口地址）存放在./routers目录下，并在app中注册接口
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));


//设置cookie, 无论何时只要用户访问就会执行如下中间件
// req.cookies无法获取可能原因：
// 1)前台请求是post请求吗？前后台的method必须一致，如不能确定method类型就用app.all
// 2)路由必须写在app.use(cookieparser())之后才能通过cookie-parser中间件拿到cookie，不然只能通过req.headers.cookie来获取
app.use('/',function(req,res,next){
    req.userInfo = {};
    if(req.cookies['userInfo']){
        req.userInfo = JSON.parse(req.cookies['userInfo']);
        usermodel.findById(req.userInfo._id).then(function(userInfo){
            req.userInfo.isAdmin = userInfo.isAdmin;
            console.log(req.userInfo.isAdmin);
            next();
        })
    }
    console.log(req.cookies.userInfo);

    next();
});
/*app.get('/',function(req,res){
    if(req.cookies.userInfo){
        console.log("userInfo已存在");
    }else{
        req.cookies('userInfo', {'_id':'','username':''}, {maxAge: 6 * 1000, path: '/'});
        console.log("welcome the first time");
    }
});*/


//======模板开始======//
//设置静态文件托管
//当用户访问的url以/public开始，那么直接返回对应__dirname+'/public'下的文件
app.use('/public',express.static(__dirname+'/public'));
//配置应用模板,使用swig.renderFile方法解析后缀为html的文件
app.engine('html',swig.renderFile);
//设置模板存放目录
app.set('views','./views');
//注册模板引擎
app.set('view engine','html');
//======模板结束======//



// mongoose.Promise = global.Promise;
// var promise = mongoose.connect('mongodb://localhost:27018/nodejsdemo',{
//     useMongoClient:true
// });
// promise.then(function(err) {
//     if (err) {
//         console.log('数据库连接失败');
//     }
//     else {
//         console.log('数据库连接成功');
//         app.listen(8088, function () {
//             console.log("hello nodejs");
//
//         });
//     }
// });

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27018/nodejsdemo',{useMongoClient:true},function(err){
    if(err){
        console.log('数据库连接失败');
    }
    else {
        console.log('数据库连接成功');
        app.listen(8088, function(){
            console.log("hello nodejs");
        });
    }
});


// app.get('/',function(req,res){
    // res.send("<h1>this is response</h1>");
    // res.download();

    //读取views目录下的指定文件，解析并返回给客户端
    //第一个参数：表示模板的文件，相对于views目录
    //第二个参数：传递给模板使用的数据
    // res.render('index');

    // 用户发送http请求-> url -> 解析路由 -> 找到匹配的规则 -> 指定绑定函数，返回对应内容到用户
    //  /public -> 静态 -> 直接读取指定目录下的文件，返回给用户
    //  动态 -> 处理业务逻辑，加载模板，解析模板 ->返回数据给用户
    // res.send(__dirname);
// });

//启动一个服务并监听从8088端口进入的所有连接请求，
//并对所有（/)URL或路由返回""
