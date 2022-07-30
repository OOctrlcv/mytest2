var fs=require("fs");

var student=require('./student');
// 第一种提取路由模块的方法
// module.exports=function(app){

//     app.get('/',function(req,res){
//         // 文件读取的数据“data”参数是一个字符串类型，所以想要使用得用Json.parse()转化为对象。
//         // 并且读文件都是异步操作。
//         fs.readFile("./data.json",'utf8',function(err,data){
//             if(err){
//                 return res.status(500).send('Server error')
//             }
    
//             res.render('index.html',{
//                 title:[
//                   {name:"赖泽森",src:"/public/imgs/lzs.png"},
//                   {name:"王前成",src:"/public/imgs/wqc.png"}
//                    ],
//                    students:JSON.parse(data).students
//                })
//         })
    
//     })
//     app.get('/login',function(req,res){
//         res.render('login.html');
//     })
    
// }

// 第二种提出模块的方法
// Express 提供了一种更好的方式，专门用来包装路由

var express=require("express"); 
//const { type } = require("os");


// 1.创建一个路由容器
var router=express.Router()

// 2.把路由都挂载到router路由容器中
/**
 * 渲染处理主页面
 */
router.get('/',function(req,res){
    // 文件读取的数据“data”参数是一个字符串类型，所以想要使用得用Json.parse()转化为对象。
    // 并且读文件都是异步操作。
    
    // fs.readFile("./data.json",'utf8',function(err,data){
    //     if(err){
    //         return res.status(500).send('Server error')
    //     }

    //     res.render('index.html',{
    //         title:[
    //           {name:"赖泽森",src:"/public/imgs/lzs.png"},
    //           {name:"王前成",src:"/public/imgs/wqc.png"}
    //            ],
    //            students:JSON.parse(data).students
    //        })
    // })

    student.find(function(err,students){
        if(err){
            return res.status(500).send('Server error.');
        }
        res.render('index.html',{
            title:[
                {name:"女仆",src:"/public/imgs/女仆.png"},
                {name:"钟离",src:"/public/imgs/钟离.png"},
                {name:"琴",src:"/public/imgs/琴.png"}
                 ],
                 students:students
             })
        })
    })

/**
 * 加载学生添加编辑界面
 */
router.get('/students/new',function(req,res){
    res.render('new.html');
})


/**
 * 处理添加学生页面
 */
// 处理表单提交的数据，存放到data文件中
router.post('/students/new',function(req,res){

    
    student.sava(req.body,function(err){
        if(err){
            return res.status(500).send('Server error.');
        }
        res.status(302).redirect('/');
        // res.redirect('/')可以直接这么写，express已经封装好了重定向
    })
    
    
})

/**
 * 渲染编辑学生页面
 * req.query:读取的是字符串对象，因为url拿到的是字符串
 */
router.get('/students/edit',function(req,res){

    student.findById(parseInt(req.query.id),function(err,student){
        if(err){
            return res.status(500).send('Server error.');
        }
        console.log(req.query);
        res.render('edit.html',{
            student:student
        })
    })
    
    

})

/**
 * 处理编辑学生
 */
router.post('/students/edit',function(req,res){
   
    student.updataById(req.body,function(err){
        if(err){
            return res.status(500).send('Server error.');
        }
        res.redirect('/')
    })
})


/**
 * 删除学生
 */

router.get('/students/delete',function(req,res){
    student.delete(parseInt(req.query.id),function(err){
        if(err){
            return res.status(500).send('Server error.');
        }
        // 两种删除后渲染页面方法，
        // 第一种服务器渲染，但是要重新加载，影响体验，
        // 第二种客户端渲染，不用加载
        // res.redirect('/')
        res.redirect('/')
    })
})



/**
 * 加载渲染博客页面
 */

 router.get('/boke',function(req,res){
    res.render('boke.html');
    fs.readFile('./views/boke.html','utf-8',function(err,data){
    //    JSON.stringify()和toString()区别，前者保留原有字符格式转为josn
    // 字符串，后者是把对象类型转化为字符串类型的形式（改变数据类型）。
    })
})

// 加载聊天name提交页面。
router.get('/liaotianname',function(req,res){
    res.render('liaotianname.html');
})
router.get('/login',function(req,res){
    res.render('login.html');
})

// 下面等价于exports.属性名=value
module.exports=router;

