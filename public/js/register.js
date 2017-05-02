$(function () {
    var $inputTel = $('#inputTel'); // 手机号输入框
    var $alert = $('#alert'); // 错误信息提示框
    var $text = $('#text'); // 错误信息内容
    var $getCode = $('#getCode'); // 验证码按钮
    var $putCode = $('#putCode'); // 验证码输入框
    var $putCodeImg = $('#putCodeImg'); // 图片验证码输入框
    var $password = $('#password'); // 密码输入框
    var $register = $('#register'); // 注册按钮
    $inputTel.focus();
    // 图片验证码
    var verifyCode = new GVerify('codeImg');

    // 电话输入框失去焦点
    $inputTel.blur(isTel);
    // 验证码输入框失去焦点
    isCode();
    // 密码输入框获得焦点
    $password.focus(function () {
        if (!$inputTel.val() || !$putCode.val()) {
            $text.html('手机号或验证码不能为空');
            $alert.css('display', 'block');
        }
    });

    // 点击发送验证码
    var wait = 60; // 倒计时
    var interValObj = null; // 定时器
    var telSto = '';
    var codeSto = '';
    $getCode.click(function () {
        if (wait !== 60) return;
        if (isTel()) {
            var res = verifyCode.validate($putCodeImg.val());
            if (res) {
                console.log('验证正确');
                $alert.css('display', 'none');
                // 发送获取验证码的Ajax请求
                telSto = $inputTel.val();
                $.get('/sendcode', {tel: telSto, register: true}, function (data) {
                    console.log(data);
                    if (!data.state) {
                        $text.html(data.msg);
                        $alert.css('display', 'block');
                    }else if (data.state === 2) {
                        $text.html('该手机号已被注册，请直接登录');
                        $alert.css('display', 'block');
                    } else {
                        // 处理验证码按钮
                        $getCode.html("重新发送" + wait);
                        interValObj = setInterval(setRemainTime, 1000);
                        isCode(data.code);
                        codeSto = data.code;
                    }
                });
            } else {
                if (!$putCodeImg.val()) {
                    $text.html('请输入验证码');
                } else {
                    $text.html('验证码错误');
                }
                $alert.css('display', 'block');
            }
        }
    });

    // 注册
    $register.click(function () {
        var tel = $inputTel.val();
        var code = $putCode.val();
        var password = $password.val();
        if (tel !== telSto || code !== codeSto) {
            $text.html('手机号或验证码不正确，请重新输入');
            $alert.css('display', 'block');
        } else if ($password.val().length < 6) {
            $text.html('请输入6-20位密码');
            $alert.css('display', 'block');
        } else if (!$('#checked').prop('checked')) {
            $text.html('您未确认并同意到位用户协议');
            $alert.css('display', 'block');
        } else {
            $alert.css('display', 'none');
            $.post('/register', {tel: tel, code: code, password: password}, function (data) {
                if (data.state === 0) {
                    // $putCode.val('');
                    $password.val('').attr('type', 'text');
                    // $alert.css('display', 'none');
                    window.location.href = 'user.html?username='+data.username;
                }
            });
        }
    });

    // 关闭错误信息提示
    $('.close').click(function () {
        $alert.css('display', 'none');
    });

    // 手机号判断
    function isTel() {
        // 判断手机号是否为空
        if (!$inputTel.val()) {
            $text.html('手机号不能为空');
            $alert.css('display', 'block');
            $inputTel.focus();
        } else if ($inputTel.val().length < 11) { // 判断手机位数
            $text.html('请输入11位手机号');
            $alert.css('display', 'block');
            $inputTel.focus();
        } else {
            return true;
        }
    }
    // 验证码判断
    function isCode(code) {
        $putCode.blur(function () {
            if ($putCode.val() !== code) {
                console.log($putCode.val(), code, 2);
                $text.html('验证码不正确，请重新输入');
                $alert.css('display', 'block');
            } else {
                $alert.css('display', 'none');
            }
        });
    }
    // 定时器
    function setRemainTime() {
        if (wait === 0) {
            clearInterval(interValObj);
            $getCode.html("重新发送");
            $putCode.val('');
            wait = 60;
        }
        else {
            wait--;
            $getCode.html("重新发送" + wait);
        }
    }
});