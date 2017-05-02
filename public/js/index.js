$(function () {
    // 服务数据
    $.get('/services', function (data) {
        $('#box').append(template('boxTemp', {category: data}));
        $('#secondMenu').append(template('secondMenuTemp', {category: data}));
        ready();
    });
});

function ready() {
    // 菜单点击样式
    $('#navbar-nav').on('click', 'li:not(:last)', function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
    });
    // header固定
    $(window).scroll( function() {
        var top = $(window).scrollTop()
        var $navbar = $('#navbar');
        var $header = $('#header');
        if (top > $header.height()) {
            $header.height(70)
            $navbar.addClass('navbar-fixed-top fixed-animated');
        } else {
            $navbar.removeClass('navbar-fixed-top fixed-animated')
        }
    } );
    // 轮播图
    carousel();
    function carousel() {
        var curIndex = 0; //当前index
        var timer = null;

        $(".hd").find("li").each(function(item){
            $(this).click(function(){
                clearInterval(timer);
                changeTo(item);
                curIndex = item;
                auto(curIndex);
            })
        });
        auto(curIndex)
        function auto(curIndex) {
            timer = setInterval(function(){
                if(curIndex < $(".bd li").length-1){
                    curIndex ++;
                }else{
                    curIndex = 0;
                }
                changeTo(curIndex);
            },5000);
        }
        function changeTo(num){
            $(".bd").find("li").fadeOut(1000)
                .eq(num).fadeIn(1000)
            $(".hd").find("li").removeClass("on")
                .eq(num).addClass("on");
        }
    }
    // 底部城市
    $('.city dd').on('click', 'i', function () {
        $(this).html()
    });
}