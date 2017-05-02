//声明一个 router 相当于一个 mini app
var router = require('express').Router();
//处理商业逻辑
var todoLogic = require('../business_logic/todo_logic.js');

// 服务全部数据
router.get('/services', todoLogic.servicesData);

// 大类型服务数据
router.get('/services_type', todoLogic.servicesQueryData);

// 服务详情
router.get('/detail_type', todoLogic.detailData);


//提交用户注册信息  上传数据
router.post('/register', todoLogic.registerPost);

//处理用户登录逻辑  上传数据
router.post('/login', todoLogic.loginPost);

// 验证码
router.get('/sendcode', todoLogic.sendCode);

// 重置密码
router.post('/reset', todoLogic.resetPassword);

//显示主页
router.get('/', todoLogic.indexPage);

//404 未找到
router.get('*', function (req, res, next) {
    res.redirect('/404.html');
});


module.exports = router;