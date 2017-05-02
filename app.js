var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//引入模块
var router = require('./routes/router.js');
var db = require('./dao/todo_dao.js');
var expressSession = require('express-session');


var app = express();
//打开数据库连接
db.connect();
//当程序关闭的时候 关闭数据库连接
app.on('close', function(err){
    console.error(err);
    db.disconnect();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//维护 session
app.use(cookieParser());
//使用 expressSession,
//需要注意的是参数
//重要的参数有 secret，resave, saveUninitailized, cookie, name
app.use(expressSession({
    secret: 'keyboard cat',   //加密解密用的秘钥
    name: 'todoList', //cookie name, //可以打开浏览器观察
    resave: true, //每次请求都重新设置session cookie，假设你的cookie是30分钟过期，每次请求都会再设置30分钟
    saveUninitialized: false, //无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
    cookie: {maxAge: 1000 * 60 * 30} //过期时间，30分钟
}));

//静态资源服务
app.use(express.static(path.join(__dirname, 'public')));

//把所有的访问导入到 专门处理路由的模块 router
app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
