var http = require('http');
var url = require('url');

var hostname = "10.10.10.1";
var port = 2000;

var rootDir = __dirname;
var server = http.createServer();

server.on("request",function(req,res){
    console.log("有客户端请求");
    console.log(req);

});


server.listen(8008,'localhost',function(){
    console.log("successfully listening...");
});
// server.listen(port,hostname,function(){
//     console.log("server running at http://" + hostname + ":"+ port + "/");
// });