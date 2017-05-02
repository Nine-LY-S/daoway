$(function () {
    var query = GetQueryString("query");
    var detailId = GetQueryString("detailId");
    var sellerID = GetQueryString("sellerID");

    $.get('/detail_type', {query: query, detailId: detailId, sellerID: sellerID}, function (data) {
        $('#detail').append(template('detailTemp',
            {service: data.service, seller: data.seller})
        );
        ready();
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
        // 底部城市
        $('.city dd').on('click', 'i', function () {
            $(this).html()
        });
    }
});


// 获得参数对应的值
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r) {
        return decodeURI(r[2]);
    } else {
        return null;
    }
}

