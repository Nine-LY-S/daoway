$(function () {
    var query = GetQueryString("query");
    var pages = 0;
    var page = 1;
    var family = 0;
    var sort_by = '';
    var dataSto = null;
    $.get('/services_type', {query: query}, function (data) {
        dataSto = data;
        handleData(dataSto);
        ready();
    });
    
    function handleData(data, family, sort_by, page) {
        family = family?family:0;
        page = page?page:1;
        sort_by = sort_by?sort_by:'recommend';
        console.log(data, family);
        var length = 0;
        var service = [];
        data.services.genre.forEach(function (ele, i) {
            // 小分类
            if (+family === 0) {
                service = service.concat(ele.service);
                length += ele.service.length;
            } else if (ele.type === +family) {
                service = service.concat(ele.service);
                length = ele.service.length;
            }
        });
        pages = Math.ceil(length/10);
        // 排序
        (sort_by !== 'recommend') && service.sort(compare(sort_by));
        var html = template('serviceTemp',
            {category: data.services, family: +family, sort_by: sort_by,
                page: page, pages: pages, service: service, sellers: data.sellers
            });
        $('#service').html('').html(html);
        ready();
    }

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


        // 分类导航
        $('.clickAble').click(function () {
            family = $(this).attr('data-family');
            page = 1;
            handleData(dataSto, family, sort_by);
        });
        // 排序菜单
        $('.top i').click(function () {
            sort_by = $(this).attr('id');
            page = 1;
            handleData(dataSto, family, sort_by);
        });
        // 翻页
        paging();
        function paging() {
            $('.pagedown').click(function () {
                if (+page + 1 > pages) return;
                ++page;
                handleData(dataSto, family, sort_by, page);
            });
            $('.pageup').click(function () {
                if (page <= 1) return;
                --page;
                handleData(dataSto, family, sort_by, page);
            });
            $('#showPage').on('click','a',function () {
                page = $(this).html();
                handleData(dataSto, family, sort_by, page);
            });
        }
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

// 排序
function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        if (property !== 'price' && property !== 'fastTime') {
            return value2 - value1;
        } else {
            return value1 - value2;
        }
    }
}