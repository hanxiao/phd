
/**
 * Created by han on 9/23/15.
 */



function switchLanguage() {

    var screenshotPath;
    var downloadBtnIOS;
    var downloadBtnAndroid;

    screenshotPath = "zh";
    downloadBtnIOS = "Download_on_the_App_Store_Badge_CN_135x40.svg";
    downloadBtnAndroid = "zh-cn_generic_rgb_wo_60.png";

    $("#swipeSlides").empty();
    for (var i = 0; i< 5; i++) {
        $("#swipeSlides").append('<div class="swiper-slide" style=background-image:url("' +
            'img/' + screenshotPath + '/5.5-inch%20(iPhone%206+)%20-%20Screenshot%20' + i + '.jpg")></div>');
    }


    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 0
    });

    swiper.update();
    $('#download-app').css('background-image','url(' + 'img/' + screenshotPath + '/' + downloadBtnIOS +')');
    $('#download-google').css('background-image','url(' + 'img/' + screenshotPath + '/' + downloadBtnAndroid +')');
}


function init() {

    switchLanguage();
    showWechatWarn();

}

function showWechatWarn() {
    if (isWeixinBrowser()) {
        alert("由于微信不支持打开指向App Store和Google Play的链接，请点击右上角并选择“从Safari/浏览器中打开”，再进行下载安装。");
    }
}

function goAppStore() {
    showWechatWarn();
    var a = document.createElement('a');
    a.setAttribute("href", 'https://itunes.apple.com/us/app/zhao-dao-zui-quan-zui-xin/id1166618336?ls=1&mt=8');
    a.setAttribute("target", "_blank");
    fireClick(a);
}

function goAndroidStore() {
    showWechatWarn();
    var a = document.createElement('a');
    a.setAttribute("href", 'https://play.google.com/store/apps/details?id=de.ojins.phd');
    a.setAttribute("target", "_blank");
    fireClick(a);
}

function goApkStore() {
    showWechatWarn();
    var a = document.createElement('a');
    a.setAttribute("href", 'release/zhaodedao-arm7-1.2.apk');
    a.setAttribute("target", "_blank");
    fireClick(a);
}

function fireClick(node){
    if ( document.createEvent ) {
        var evt = document.createEvent('MouseEvents');
        evt.initEvent('click', true, false);
        node.dispatchEvent(evt);
    } else if( document.createEventObject ) {
        node.fireEvent('onclick') ;
    } else if (typeof node.onclick == 'function' ) {
        node.onclick();
    }
}

function isWeixinBrowser() {
    var ua = navigator.userAgent.toLowerCase();
    return (/micromessenger/.test(ua)) ? true : false ;
}


init();
