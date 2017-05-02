var md5 = require('blueimp-md5');
var moment = require('moment');
var Base64 = require('js-base64').Base64;
var request = require('request');
var captchapng = require('captchapng');

/*
 生成指定长度的随机数
 */
function randomCode(length) {
    var chars = ['0','1','2','3','4','5','6','7','8','9'];
    var result = ""; //统一改名: alt + shift + R
    for(var i = 0; i < length ; i ++) {
        var index = Math.ceil(Math.random()*9);
        result += chars[index];
    }
    return result;
}
exports.randomCode = randomCode;

/*
向指定号码发送指定验证码
 */
function sendCode(phone, code, callback) {
    var ACCOUNT_SID = '8aaf07085bad886c015bc24e6114047b';
    var AUTH_TOKEN = 'be6a97375576486ab045127d802758b8';
    var Rest_URL = 'https://app.cloopen.com:8883';
    var AppID = '8aaf07085bad886c015bc24e621d0481';
    //1. 准备请求url
    /*
     1.使用MD5加密（账户Id + 账户授权令牌 + 时间戳）。其中账户Id和账户授权令牌根据url的验证级别对应主账户。
     时间戳是当前系统时间，格式"yyyyMMddHHmmss"。时间戳有效时间为24小时，如：20140416142030
     2.SigParameter参数需要大写，如不能写成sig=abcdefg而应该写成sig=ABCDEFG
     */
    var sigParameter = '';
    var time = moment().format('YYYYMMDDHHmmss');
    sigParameter = md5(ACCOUNT_SID+AUTH_TOKEN+time);
    var url = Rest_URL+'/2013-12-26/Accounts/'+ACCOUNT_SID+'/SMS/TemplateSMS?sig='+sigParameter;

    //2. 准备请求体
    var body = {
        to : phone,
        appId : AppID,
        templateId : '1',
        "datas":[code,"1"]
    };
    //body = JSON.stringify(body);

    //3. 准备请求头
    /*
     1.使用Base64编码（账户Id + 冒号 + 时间戳）其中账户Id根据url的验证级别对应主账户
     2.冒号为英文冒号
     3.时间戳是当前系统时间，格式"yyyyMMddHHmmss"，需与SigParameter中时间戳相同。
     */
    var authorization = ACCOUNT_SID + ':' + time;
    authorization = Base64.encode(authorization);
    var headers = {
        'Accept' :'application/json',
        'Content-Type' :'application/json;charset=utf-8',
        'Content-Length': JSON.stringify(body).length+'',
        'Authorization' : authorization
    };

    //4. 发送请求, 并得到返回的结果, 调用callback

    request({
        method : 'POST',
        url : url,
        headers : headers,
        body : body,
        json : true
    }, function (error, response, body) {
        // console.log(error, response, body);
        callback(body, body.statusCode==='000000');
    });
}
exports.sendCode = sendCode;


// 图片验证码
function randomCodePng(length) {
    var code = randomCode(length);
    var p = new captchapng(80,30,parseInt(code));
    p.color(0, 0, 0, 0);
    p.color(80, 80, 80, 255);

    var img = p.getBase64();
    var imgbase64 = new Buffer(img,'base64');
    response.writeHead(200, {
        'Content-Type': 'image/png'
    });
    return imgbase64;
}
exports.randomCodePng = randomCodePng;

/*
 生成指定长度的随机用户名
 */
function randomName(length) {
    var chars = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f',
    'g','h','i','g','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    var result = ""; //统一改名: alt + shift + R
    for(var i = 0; i < length ; i ++) {
        var index = Math.ceil(Math.random()*35);
        result += chars[index];
    }
    return result;
}
exports.randomName = randomName;