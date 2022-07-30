/**
 * 封装读取数据文件的api
 * 封装操作学生的API
 * 
 */


var fs = require('fs');
const { stringify } = require('querystring');

var dataname = './data.json';

/**
 * 获取data.json文件中全部学生的信息
 * @param {'是一个回调函数：获取异步操作里面的数据'} callback 
 */
// parse()方法接受字符串，并转化为对象
// 可设置utf8转码为字符串
exports.find = function (callback) {
    // var callback=function(err,data){}
    fs.readFile(dataname, 'utf8', function (err, data) {
        if (err) {
            return callback(err);
        }
        callback(null, JSON.parse(data).students);
    })
}

/**
 * 根据id获取学生信息对象
 * @param {Number} id       学生id
 * @param {Function} callback  回调函数
 *
 */
exports.findById = function (id, callback) {
    fs.readFile(dataname, 'utf8', function (err, data) {
        if (err) {
            return callback(err);
        }
        // 拿取读到文件的数据。
        var students = JSON.parse(data).students;

        var ret = students.find(function (item) {

            return item.id === parseInt(id);
        })

        //  把查找到的id对象传过去。
        callback(null, ret);
    })

}


/**
 * 添加学生
 * 
 */
exports.sava = function (addstudent, callback) {
    fs.readFile(dataname, 'utf8', function (err, data) {
        if (err) {
            return callback(err);
        }
        // 拿取读到文件的数据。
        var students = JSON.parse(data).students;

        // 处理id重复问题
        if (students.length > 0) {
            addstudent.id = students[students.length - 1].id + 1;
        } else {
            //处理数组长度为0时即没有学生时
            addstudent.id = 0;
        }


        // 把用户传递的对象保存在数组中
        students.push(addstudent);

        // 把对象字符串数组转化为字符串
        // 有三个参数，最后一是以什么空格或则缩进格式.
        var fileData = JSON.stringify({
            students: students

        }, null, '\t')

        // 把处理好的字符数组对象写入到数据文件中
        fs.writeFile(dataname, fileData, function (err) {
            if (err) {
                callback(err);
            }
            callback(null);
        })
    })


}

/**
 * 更新学生
 */
exports.updataById = function (student, callback) {
    fs.readFile(dataname, 'utf8', function (err, data) {
        if (err) {
            return callback(err);
        }
        // 拿取读到文件的数据。
        // 这里的students是个数组。
        var students = JSON.parse(data).students;

        // 注意统一把id转化为数字类型。不然存入文件的id是字符串类型
        // 在下面遍历student对象也要处理转换id为数字类型
        students.id = parseInt(student.id);

        // 更具id找到对应数据
        // EcmaScript 6 中的一个数组方法：find
        // Find对数组中的每个元素按升序调用predicate一次，直到找到predicate返回true的元素为止。如果找到这样一个元素，find立即返回该元素值。否则，find返回undefined。
        // 在这里是，遍历students数组，然后找到目标返回数组中的对象元素，
        var stu = students.find(function (item) {
            // 不能用全等，因为用req.query获取的是url字符串类型的。
            // 而在这里id只需要数值相等即可。
            return item.id === students.id;
        })

        // 遍历对象属性，全部赋值给stu实现覆盖更新。
        for (var key in student) {

            stu[key] = student[key];

            // 因为参数student是表单穿来的字符串，所以对id进行转换，以此不影响存data。json中。
            stu.id = parseInt(stu.id);
        }
        // 把对象字符串数组转化为字符串
        // 有三个参数，最后一是以什么空格或则缩进格式.
        var fileData = JSON.stringify({
            students: students

        }, null, '\t')
        console.log(fileData);
        // 把处理好的字符数组对象写入到数据文件中
        fs.writeFile(dataname, fileData, function (err) {
            if (err) {
                callback(err);
            }
            callback(null);
        })
    })
}

/**
 * 删除学生
 */

exports.delete = function (id, callback) {
    fs.readFile(dataname, 'utf8', function (err, data) {
        if (err) {
            return callback(err);
        }
        // 拿取读到文件的数据。
        var students = JSON.parse(data).students;

        // var i = -1;
        // var stu = students.find(function (item) {
            
        //     return item.id === parseInt(id),i++;
        // })
        /**
         * findIndex:ES6语法，和find（）相似，不过是返回对应索引
         */
        var idindex=students.findIndex(function(item){
            return item.id===parseInt(id);
        })
     
        students.splice(idindex, 1);


        var fileData = JSON.stringify({
            students: students

        }, null, '\t')

        // 把处理好的字符数组对象写入到数据文件中
        fs.writeFile(dataname, fileData, function (err) {
            if (err) {
                callback(err);
            }
            callback(null);
        })

    })
    
}

/**
 * ES6的find方法源码
 */
var mymusic=[
    {id:0,name:'hsyh',activ:'jav'},
    {id:1,name:'bsfc',activ:'jav'},
    {id:2,name:'dx',activ:'jav'},
    {id:3,name:'qt',activ:'jav'}
];

Array.prototype.myfind=function(ifn){
    for(var i=0;i<this.length;i++){
       if(ifn(this[i],i)){
            return this[i];
       }
      
    }
}
var demos=mymusic.myfind(function(item,index){
    return item.id===3;
})

