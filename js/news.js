/**
 * Created by hxiao on 2016/10/20.
 */
var QueryString = function () {
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}();

var myApp = new Framework7();

var allData;
var jsel = JSONSelect;
var curId;

// Add view
myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    domCache: true //enable inline pages
});

moment.locale('zh-cn');

var dataUrl = 'http://ojins.com/data/phd/database/embassynews.json';


console.log(QueryString.id +' will redirect to '+ dataUrl);

function showDetails() {
    var query = ':has(:root > .title:expr(x="' + curId + '"))';
    var re = jsel.match(query, allData);

    vm = new Vue({
        el: '#all-positions',
        data: {
            focusPosition: re[0]
        },
        ready: function () {
            myApp.hideIndicator();
            $('.views').css('visibility','visible').hide().fadeIn();
        },
        methods: {
            renderVal: function (val, typ) {
                return renderValue(val, typ);
            }
        }
    });
}

function loadError() {
    myApp.addNotification({
        title: '无法加载职位，请稍后再试',
        media: '<i class="fa fa-exclamation-circle"></i>',
        hold: 8000
    });
}

function loadCompressedData(filename, id) {
    myApp.showIndicator();
    //var updateNotif = myApp.addNotification({
    //    title: '正在请求更新...',
    //    media: '<i class="fa fa-refresh"></i>',
    //});
    $.getJSON(filename, function() {
            console.log( "fetching data..." );})
        .done(function(data) {
            allData =  data;
            curId = id;
            showDetails();
        })
        .fail(loadError)
        .always(function() {
            myApp.hideIndicator();
        });
}


function renderValue(x, type) {
    switch (type) {
        case "cur":
            return accounting.formatMoney(x);
        case "pct":
            return accounting.formatNumber(x, 2) + '%';
        case "num":
            return accounting.formatNumber(x, 2);
        case "day":
            return x + (x > 1 ? " days" : " day");
        case "date":
            var tmpDate = new Date(x);
            return moment(tmpDate).fromNow();
        case "fulldate":
            tmpDate = new Date(x);
            return moment(tmpDate).format('MMMM Do YYYY, h:mm:ss a');
        default:
            return x;
    }
}


function isValidUrl(x) {
    if (x.indexOf("file:") > 0) {
        return false;
    }
    return true;
}
loadCompressedData(dataUrl, QueryString.id);