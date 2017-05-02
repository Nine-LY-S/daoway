var dao = require('../dao/todo_dao');
var crypto = require('crypto');
const sms_util = require('./sms_util');

// 服务全部数据
var servicesData = function(req, res, next){
    dao.findServicesAll(function (err, doc) {
        if(err){
            console.log(err);
        }
        else {
            res.json(doc);
        }
    })
};
exports.servicesData = servicesData;


// 大类型服务数据
var servicesQueryData = function(req, res, next){
    var query = req.query.query;
    var result = {};
    dao.findServicesByType(+query, function (err, doc) {
        if(err){
            console.log(err);
        }
        else {
            result.services = doc;
            dao.findSellersByType(query, function (err, doc) {
                if(err){
                    console.log(err);
                }
                else {
                    result.sellers = doc;
                    res.json(result);
                }
            });
        }
    });
};
exports.servicesQueryData = servicesQueryData;

// 服务详情数据
var detailData = function(req, res, next){
    var query = req.query.query;
    var detailId = req.query.detailId;
    var sellerID = req.query.sellerID;
    var result = {};
    dao.findServicesByType(+query, function (err, doc) {
        if(err){
            console.log(err);
        }
        else {
            doc._doc.genre.forEach(function (ele) {
               ele.service.forEach(function (ser) {
                   if (ser.detailId === +detailId) {
                       result.service = ser;
                       result.service.name_b = doc._doc.name;
                       result.service.name_s = ele.name;
                   }
               })
            });
            dao.findSellersById(sellerID, function (err, doc) {
                if(err){
                    console.log(err);
                }
                else {
                    result.seller = doc;
                    res.json(result);
                }
            });
        }
    });
};
exports.detailData = detailData;

//用户登录逻辑
var loginPost = function(req, res, next){
    var userOrTel = req.body.userOrTel;
    var password = req.body.password;
    dao.findUserByName(userOrTel,function(err, user){
        if(err){
            next(err);
        }else {
            //如果查询结果（用户名）存在
            if(user){
                //md5散列
                var md5 = crypto.createHash('md5');
                md5.update(password);
                var passwordMD5 = md5.digest('hex');
                //验证密码
                if(user.password == passwordMD5){
                    // req.session.user = user;
                    //找到对应的数据
                    dao.findUserById(user._id, function(err, result){
                        if(err){
                            next(err);
                        }else {
                            res.send(result);
                        }
                    });
                }
                //如果验证错误，那么就返回："输入正确的用户名和密码"
                else {
                    res.writeHeader(200, {'Content-type':'text/html;charset=utf-8'});
                    res.end('false');
                }
            }
            //如果查询结果不存在
            else {
                res.writeHeader(200, {'Content-type':'text/html;charset=utf-8'});
                res.end('false');
            }
        }
    });
};
exports.loginPost = loginPost;

// 验证码
var codes = {}, codes2 = {};
var sendCode = function(req, res, next){
    var tel = req.query.tel;
    var register = req.query.register;
    dao.findUserByTel(tel, function(err, result){
        if(err){
            next(err);
        }else {
            if (register) { // 若是注册
                if (result) { // 数据库有手机号
                    res.send({state: 2}); // 该手机号已被注册，请直接登录
                } else {
                    var code2 = sms_util.randomCode(4);
                    sms_util.sendCode(tel, code2, function (body) {
                        if(body.statusCode==='000000') {
                            //保存number--code
                            codes2[tel] = code2;
                            res.send({state: 1, code: code2});
                        } else {
                            res.send({state: 0, msg: body.statusMsg}); // 手机号不正确
                        }
                    });
                }
            } else {
                if (result) { // 数据库有手机号
                    var code = sms_util.randomCode(4);
                    sms_util.sendCode(tel, code, function (body) {
                     if(body.statusCode==='000000') {
                     //保存number--code
                     codes[tel] = code;
                     res.send({state: 1, code: code});
                     }
                     });
                } else {
                    res.send({state: 0}); // 数据库没有手机号
                }
            }
        }
    });
};
exports.sendCode = sendCode;

// 重置密码
var resetPassword = function(req, res, next){
    const tel = req.body.tel;
    const code = req.body.code;
    const password = req.body.password;
    console.log(11111111111);
    //验证code
    if(!codes[tel] || codes[tel]!==code) { // 说明
        res.send({
            state: 1
        });
        return
    }
    //删除验证码
    delete codes[tel];
    //md5散列
    var md5 = crypto.createHash('md5');
    md5.update(password);
    var passwordMD5 = md5.digest('hex');
    dao.updateUserByTel(tel, passwordMD5, function(err, result){
        if(err){
            next(err);
        }else {
            //返回响应
            res.send({
                state: 0,
                result: result
            })
        }
    });
};
exports.resetPassword = resetPassword;

// 注册
var registerPost = function(req, res, next){
    const tel = req.body.tel;
    const code = req.body.code;
    const password = req.body.password;

    //验证code
    if(!codes2[tel] || codes2[tel]!==code) { // 说明
        res.send({
            state: 1
        });
        return
    }
    //删除验证码
    delete codes2[tel];

    //md5散列
    var md5 = crypto.createHash('md5');
    md5.update(password);
    var passwordMD5 = md5.digest('Hex');

    dao.addAUser(tel, passwordMD5, function(err, name){
        if(err){
            next(err);
        }else {
            //返回响应
            res.send({
                state: 0,
                username: name
            })
        }
    });
};
exports.registerPost = registerPost;


//显示主页
var indexPage = function(req, res, next){
    dao.findServicesAll(function (err, doc) {
        if(err){
            console.log(err);
        }
        else {
            res.send('../src/index.html')
            // res.render('../src/index.html', {data: doc});
        }
    })
};
exports.indexPage = indexPage;