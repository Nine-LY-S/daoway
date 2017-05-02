$(function () {
    var $alert = $('#alert'); // 错误信息提示框
    var $text = $('#text'); // 错误信息内容
    $('input:first').focus();
    var $input = $('input');
    var userOrTel = '';
    var password = '';
    $input.keyup(function (ev) {
        if (ev.keyCode === 13) {
            ev.preventDefault();
            var nextInput = $input[$input.index(this) + 1];
            if (nextInput !== undefined) {
                nextInput.focus();
            } else {
                check();
            }
        }
    });

    $('.close').click(function () {
        $('#alert').css('display', 'none');
    });
    $('#logining').click(function () {
        check();
    });
    // 检查判断
    function check() {
        userOrTel = $('#username').val();
        password = $('#password').val();
        if (!userOrTel) {
            $text.html('请输入您的昵称或手机号');
            $alert.css('display', 'block');
        } else if (password.length < 6) {
            $text.html('请输入6-20位密码');
            $alert.css('display', 'block');
        } else {
            $alert.css('display', 'none');
            succeed();
        }
    }

    function succeed() {
        $.post('/login', {userOrTel: userOrTel, password: password}, function (data) {
            if (data === 'false') {
                $text.html('昵称/手机号或密码有误！');
                $alert.css('display', 'block');
            } else {
                /*$alert.css('display', 'none');
                 $('#username').val('');*/
                 $('#password').val('').attr('type', 'text');
                window.location.href = 'user.html?username='+data.userName;
            }
        });
    }
});