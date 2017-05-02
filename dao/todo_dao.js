var mongoose = require('mongoose');
var dburl = 'mongodb://127.0.0.1:27017/sellerDB';//数据库地址
var db = null;
const sms_util = require('../business_logic/sms_util');


//建立数据库连接
function connect(){
    //连接
    mongoose.connect(dburl);
    //获取连接对象
    db = mongoose.connection;

    //注册事件回调
    db.on('open', function(err){
        if(err){
            throw err;
        }
        console.log('opened');
    });
    //注册时间回调
    db.on('error', function(err){
        if(err){
            throw err;
        }
    });
}
exports.connect = connect;

//断开数据库连接
function disconnect(){
    //断开连接
    mongoose.disconnect();
    db = null;
}
exports.disconnect = disconnect;


var Schema = mongoose.Schema;

/*-------------------------服务商----------------------------------*/
var sellersSchema = new Schema();
//返回值: document 的模板     第一个参数：数据库中的collection的名字    第二参数：Schema 的实例
var SellersDoc = mongoose.model('sellers', sellersSchema);

// 查询大类型服务商数据
var findSellersByType = function(type, cb){
    SellersDoc.find({type_b:{$all:[type]}}, function(err, doc){
        if(err){
            cb(err);
        }
        else {
            cb(null, doc);
        }
    })
};
exports.findSellersByType = findSellersByType;

// 查询某个ID服务商数据
var findSellersById = function(id, cb){
    SellersDoc.find({sellerID: +id}, function(err, doc){
        if(err){
            cb(err);
        }
        else {
            cb(null, doc[0]);
        }
    })
};
exports.findSellersById = findSellersById;

//搜索出所有数据
exports.findSellersAll = function(cb){
    SellersDoc.find({}, function(err, result){
        if(err){
            cb(err);
        }
        else{
            cb(null, result);
        }
    });
};

/*----------------------------服务项-----------------------------*/
var servicesSchema = new Schema({
    title: String
});
var ServicesDoc = mongoose.model('services', servicesSchema);

// 查询大类型服务数据
var findServicesByType = function(type, cb){
    ServicesDoc.find({type:type}, function(err, doc){
        if(err){
            cb(err);
        }
        else {
            cb(null, doc[0]);
        }
    })
};
exports.findServicesByType = findServicesByType;

// 服务全部数据
exports.findServicesAll = function(cb){
    ServicesDoc.find({}, function(err, result){
        if(err){
            cb(err);
        }
        else{
            cb(null, result);
        }
    });
};

/*--------------------------留言---------------------------*/
var ratingsSchema = new Schema({
    title: String
});
var RatingsDoc = mongoose.model('ratings', ratingsSchema);
exports.findRatingsAll = function(cb){
    RatingsDoc.find({}, function(err, result){
        if(err){
            cb(err);
        }
        else{
            cb(null, result);
        }
    });
};

//--------------------------------------------- UserInfo  -----------------------------------------
var name = sms_util.randomCode(9);

//定义user Schema
var usersSchema = new Schema({
    userName: {type:String, default: name},
    password:String,
    registerDate: {type:Date, default: Date.now()},
    tel:String,
    avatar: String,
    avatarFileName : String
});
var userModel = mongoose.model('user', usersSchema);

//新建一个 user 到数据库中
function addAUser(tel, password, cb){
    //1.new 一个实例(传入参数)
    //2.将这个实例save
    var userInfo = {
        password: password,
        tel: tel
    };
    var userTemp = new userModel(userInfo);
    userTemp.save(userTemp, function(err, result){
        if (err) {
            cb(err);
        }
        else{
            cb(null, name);
        }
    });
}
exports.addAUser = addAUser;

//从数据库中找到一个 user
function findUserByName(userOrTel, cb){
    userModel.find({$or:[{userName:userOrTel}, {tel:userOrTel}]}, function(err, result){
        if (err) {
            cb(err);
        }
        else{
            //如果查到的用户的数量为 0 那就是没有找到用户
            //如果查到的用户数量为1， 那就是到了用户
            //如果查到的用户数量为其他， 按摩就是出错了，因为，每个用户名只能注册一次
            var user = null;
            switch (result.length){
                case 0:
                    user = null;
                    break;
                case 1:
                    user = result[0];
                    break;
                default:
                    user = result[0];
                    console.error('too many users were found');
            }
            cb(null, user);
        }
    });
}
exports.findUserByName = findUserByName;

var findUserById = function(id, cb){
    userModel.findOne({_id: id}, function(err, user){
        if (err) {
            cb(err);
        }
        else{
            cb(null, user);
        }
    });
};
exports.findUserById = findUserById;

var findUserByTel = function(tel, cb){
    userModel.findOne({tel: tel}, function(err, user){
        if (err) {
            cb(err);
        }
        else{
            cb(null, user);
        }
    });
};
exports.findUserByTel = findUserByTel;

// 重置密码
var updateUserByTel = function (tel, password, cb) {
    findUserByTel(tel, function(err, result){
        if(err){
            cb(err);
        } else {
            result.password = password;
            result.save(function(err){
                if(err){
                    cb(err);
                }
                else{
                    cb(null, result);
                }
            });
        }
    })
};
exports.updateUserByTel = updateUserByTel;