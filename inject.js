TYPE = getType(); //douban | amazon

var BASEURL = "http://202.119.83.14:8080/opac/";

var icon;
var bookTitle;
var isbn = getIsbn(TYPE);
var school = "njust";

getSearchInfo(isbn, school);


function addInfo(TYPE) {
    switch (TYPE) {
        case 'douban':
            $('.book-cart-app-notice').before('<div class="gray_ad" id="njustlib"></div>');
            $('#njustlib').append('<h2>南理工图书馆有没有?</h2><div class="bs" id="isex"></div>');
            break;
        case 'amazon':
            $('.bucket').before('<div class="cBoxInner" id="njustlib"></div>'); //#buyboxDivId
            $('#njustlib').append('<h2>南理工图书馆有没有?</h2><div class="bs" id="isex"></div>');
            break;
        case 'dangdang':
            $('.property').before('<div class="property" id="njustlib"></div>');
            $('#njustlib').append('<h2>南理工图书馆有没有?</h2><div class="bs" id="isex"></div>');
            break;
        case '360buy':
            $('#choose').before('<div id="njustlib" class="njustlib_360buy"></div>');
            $('#njustlib').append('<h2>南理工图书馆有没有?</h2><div class="bs" id="isex"></div>');
            break;
        default:
    }

}

//抓取搜索图书页面
function getSearchInfo(isbn, school) {
    if (!isbn) {
        $('#isex').html('竟然没有！');
        return;
    }
    addInfo(TYPE);

    var url = "http://202.119.83.14:8080/opac/openlink.php?strSearchType=isbn&historyCount=1&strText=" + isbn + "&x=0&y=0&doctype=ALL&match_flag=forward&displaypg=20&sort=CATA_DATE&orderby=desc&showmode=list&dept=ALL";
    $.ajax({
        //type: 'GET',
        dataType: "html",
        url: url, //"http://www.baidu.com/",
        success: function (data) {
            //$('#njustlib').append("state" + data.readyState);
            //$('#njustlib').append("statue" + data.statue);

            if (data.indexOf('本馆没有您检索的馆藏书目') != -1) {
                $('#isex').html('竟然没有！<br />图书馆的书太少啦！');
                var url_full = "http://202.119.83.14:8080/opac/openlink.php?strSearchType=title&historyCount=1&strText=" + bookTitle + "&x=16&y=14&doctype=ALL&match_flag=forward&displaypg=20&sort=CATA_DATE&orderby=desc&showmode=list&dept=ALL"
                $('#njustlib').append('<br /><h2>走，去图书馆搜搜类似的书</h2><p><div class="bs" id="mdt"><a href="' + url_full + '" target="_blank">点我哟！</a></div>');
            } else {
                var $search_page = $(data);
                var bookInfo = $search_page.find("#list_books p span").text()
                var url_bookpage = $search_page.find("h3 a").attr("href");

                var reg = /\d+/g;
                var ary = bookInfo.match(reg);
                var bookNum = ary[0];
                var bookLeft = ary[1];

                if (bookLeft == 0) {
                    $('#isex').html('一共' + bookNum + '本，竟然都被借光了！<br />学霸们太威武啦！');
                } else {
                    $('#isex').html('一共' + bookNum + '本，还剩' + bookLeft + '本，哈哈，是我的啦！');
                }

                getBookInfo(url_bookpage);
            }
        }
    });
}

//抓取具体图书信息页面
function getBookInfo(url_bookpage) {
    var url_full = BASEURL + url_bookpage;
    $.ajax({
        dataType: "html",
        url: url_full,
        success: function (data) {
            var $book = $(data);
            var $status = $book.find("table tbody tr").removeAttr("bgcolor");
            $('#njustlib').append($status);
            $('#njustlib').append('<br /><h2>走，去图书馆看看?</h2><p><div class="bs" id="mdt"><a href="' + url_full + '" target="_blank">点我哟！</a></div>');
            //删除不必要的信息
            for (var i = 0; i <= $('#njustlib tr').length; i++) {
                $('#njustlib tr td').eq(1 + i * 6).hide();
                $('#njustlib tr td').eq(2 + i * 6).hide();
                $('#njustlib tr td').eq(3 + i * 6).hide();
            }
        }
    });
}

function getIsbn() {
    switch (TYPE) {
        case 'douban':
            var items = document.getElementById("info").getElementsByClassName("pl");
            var i;
            for (i = 0; i < items.length; i++) {
                if (items[i].innerText == "ISBN:") {
                    var isbn = items[i].nextSibling.nodeValue.substr(1, 13);
                }
            }
            icon = $('div#mainpic img').attr('src');
            bookTitle = $('h1 span', 0).text();
            break;
        case 'amazon':
            var items = $('div.content b');
            var isbntemp;
            var i;
            for (i = 0; i < items.length; i++) {
                if (items[i].innerText == "ISBN:") {
                    isbook = 1;
                }
                if (items[i].innerText == "条形码:") {
                    var isbntemp = items[i].nextSibling.nodeValue.trim();
                }
            }
            if (isbntemp && isbook)
                var isbn = isbntemp;
            icon = $("#prodImageCell img").attr("src");
            bookTitle = $("#btAsinTitle").text();
            bookTitle = bookTitle.split(' [')[0];
            break;
        case 'dangdang':
            //            var items = $('.book_detailed .clearfix li:eq(2)').text(); //
            //            alert(items);
            isbn = $('.book_detailed .clearfix li:eq(2) span:eq(1)').text().substring(8);
            break;
        case '360buy':
            isbn = $("#summary li:eq(3)").text().substring(5);
//            alert(items);
            break;
        default:
    }
    return isbn;
}

function getType() {
    var domain = document.domain;
    var names = ["amazon", "douban", "360buy", "dangdang"];
    for (var i in names) {
        if (domain.indexOf(names[i]) != -1)
            return names[i];
    }
    //    return domain.split(".")[1];
}
