var express=require('express');
var fs=require("fs");
var app=express();

var http = require('http').Server(app); 
var io=require('socket.io')(http);

//  加载路由模块
var router=require('./router');

let clients = {};
// 在线人数
let clientcount = -1;
// 进入房间的人名
let clientname=[];






// 必须放在路由前面，才能有效，解析表单post请求的内容
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.engine("html",require("express-art-template"));



app.use("/public/",express.static('./public/'));


// 把路由容器挂载到app服务中
app.use(router);


// socket.emit()只会给当前独立客户端发一次，(既每启动一个客户端都是一个独立的)注意但重启服务器时，会执行下面
// 这个函数此时socket就是全部的独立socket客户端发送。

// socket.broadcast.emit给除了自己以外的所有客户端发送。

// io.emit给所用的客户端发送包括自己。

// 在服务器中socket.on('message'),当客户端用send（）方法时会触发。
// sockt.on('disconnect')当客户端离开时触发

// 在客户端中，sockt.on('message');参数名字和服务器的一样，当服务器广播时触发。
// 在客户端中sockt。send（）方法只会触发服务端的socket.on（）带‘message’参数的方法


io.on('connection',function(socket){
    clientcount++;
    console.log("新用户来了");
    console.log("在线人数：",clientcount+1);


    // 用户进来发送进来时间给客户端
    io.emit('message',null,{'da':new Date().format("yyyy-MM-dd hh:mm:ss"),'na':clientname[clientcount]});
    // 响应客户端发送的消息
    socket.on('message',function(data,mm){
        console.log("客户端发送的聊天内容",data);
        io.emit('message',data,mm)
    })

    socket.on('disconnect', function() {
        clientname.splice(clientcount,1);
        clientcount--;
        console.log("有用户断开链接");
     
       
   
     console.log("服务器中在线人数："+clientcount,clientname);
    });
  
})


// 加载socket
app.post('/names',function(req,res){
    var name=req.body.usename;
    clientname.push({name});
    console.log(clientname);
    res.render('socket.html')
    

})



http.listen('3008',function(){

    console.log('app.js is running...');
    console.log('服务器端口号3008');
})

app.set()



 //Date的原型中扩展了format方法，使其可以方便的格式化日期格式输出
 Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
