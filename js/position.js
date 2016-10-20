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

var translateTags = {
    "wimi": {
        "short": "研究员",
        "long": "和大学或研究所签订工作合同的研究员",
        "type": "position"
    },
    "phd": {
        "short": "博士生",
        "long": "面向硕士的3到5年的博士研究生",
        "type": "position"
    },
    "hiwi": {
        "short": "学生助理",
        "long": "和大学或研究所签订工作合同的本科或硕士在读生",
        "type": "position"
    },
    "postdoc": {
        "short": "博士后",
        "long": "面向博士的1到3年的教职工作",
        "type": "position"
    },
    "prof": {
        "short": "教授",
        "long": "",
        "type": "position"
    },
    "juniorprof": {
        "short": "青年教授",
        "long": "部分德国大学改制后面向优秀青年学者的教授职位",
        "type": "position"
    },
    "mthesis": {
        "short": "硕士毕设",
        "long": "面向硕士生的3-6个月的毕业设计(论文)",
        "type": "position"
    },
    "practical": {
        "short": "实习",
        "long": "",
        "type": "position"
    },
    "scholarship": {
        "short": "奖学金",
        "long": "",
        "type": "position"
    },
    "lifescience": {
        "short": "生命科学",
        "long": "",
        "type": "subject"
    },
    "biologie": {
        "short": "生物",
        "long": "",
        "type": "subject"
    },
    "chemie": {
        "short": "化学",
        "long": "",
        "type": "subject"
    },
    "physic": {
        "short": "物理",
        "long": "",
        "type": "subject"
    },
    "medizin": {
        "short": "医药",
        "long": "",
        "type": "subject"
    },
    "psychologie": {
        "short": "心理学",
        "long": "",
        "type": "subject"
    },
    "mathematik": {
        "short": "数学",
        "long": "",
        "type": "subject"
    },
    "informatik": {
        "short": "计算机",
        "long": "",
        "type": "subject"
    },
    "engineer": {
        "short": "工科",
        "long": "",
        "type": "subject"
    },
    "economics": {
        "short": "经济学",
        "long": "",
        "type": "subject"
    },
    "politic": {
        "short": "政治",
        "long": "",
        "type": "subject"
    },
    "geisteswissen": {
        "short": "文史哲",
        "long": "",
        "type": "subject"
    },
    "soziologie": {
        "short": "社会学",
        "long": "",
        "type": "subject"
    },
    "kulturwissen": {
        "short": "文化研究",
        "long": "",
        "type": "subject"
    }
};
/**
 * Created by hxiao on 15/9/27.
 */


var myApp = new Framework7();
var $$ = Dom7;
var allData;
var jsel = JSONSelect;
var curId;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    domCache: true //enable inline pages
});

moment.locale('zh-cn');

var dataUrl = 'http://ojins.com/data/phd/database/compressed/segment-' + Math.abs(QueryString.id % 50) + '.json.lz';


console.log(QueryString.id +' will redirect to '+ dataUrl);

function showDetails() {
    var query = ':has(:root > .positionId:expr(x=' + curId + '))';
    var re = jsel.match(query, allData);

    vm = new Vue({
        el: '#all-positions',
        data: {
            searchEngine: "bing",
            focusPosition: re[0]
        },
        ready: function () {
            myApp.hideIndicator();
            $('.views').css('visibility','visible').hide().fadeIn();
        },
        methods: {
            checkWechat: function () {
                if (typeof Wechat == "undefined") {
                    this.hasWechat = false;
                } else {
                    Wechat.isInstalled(function (installed) {
                        vm.hasWechat = true;
                    }, function (reason) {
                        vm.hasWechat = false;
                    });
                }
            },
            renderVal: function (val, typ) {
                return renderValue(val, typ);
            },
            transTag: function (val) {
                return translateTags[val].short;
            },
            removeMailto: function (val) {
                return val.replace('mailto:', '');
            }
        },
        computed: {
            focusWiki: function () {
                if (this.focusPosition) {
                    return "https://en.m.wikipedia.org/wiki/" +
                        this.focusPosition.institute.replace(/\(.*\)/, "").trim();
                }
                return false;
            },
            focusSearch: function () {
                var par = encodeURIComponent(this.focusPosition.title + ' ' + this.focusPosition.institute);
                switch (this.searchEngine) {
                    case "bing":
                        return "https://www.bing.com/search?q=" + par;
                    case "google":
                        return "https://www.google.com/search?q=" + par;
                    case "baidu":
                        return "http://www.baidu.com/s?wd=" + par;
                }
                return "";
            },
            focusHtml: function () {
                var doc = "";
                if (this.focusPosition) {
                    doc = this.focusPosition.mainContent;
                    doc = $('<p>').html(doc).find('img').remove().end().html();
                }
                return doc;
            },
            richHtml: function () {
                if (this.focusHtml.length > 0) {
                    var doc = $(this.focusHtml);
                    $('a', doc).each(function (idx, x) {
                        $(x).attr('target', '_blank');
                        $(x).addClass('external');
                    });
                    return doc.html();
                }
                return "";
            },
            focusLinks: function () {
                var result = [];
                if (this.focusHtml.length > 0) {
                    var tmp = new Set();
                    var links = $('a', this.focusHtml);
                    $.each(links, function (idx, x) {
                        if (!tmp.has(x.href) && isValidUrl(x.href)) {
                            tmp.add(x.href);
                            result.push(x.href);
                        }
                    });
                }
                return result;
            },
            favPositions: function () {
                return this.allPos.filter(function (x) {
                    return x.isFav;
                });
            },
            tagList: function () {
                var translateTagsList = [];
                for (var key in this.tagMap) {
                    var tmp = this.tagMap[key];
                    tmp["key"] = key;
                    translateTagsList.push(tmp);
                }
                return translateTagsList;
            },
            totalSize: function () {
                var i = 0;
                var pi = 0;
                while (i < this.allPos.length) {
                    var arr2 = this.curTag;
                    var isSuperset = true;

                    if (arr2.length > 0) {
                        var arr1 = this.allPos[i].tags;
                        isSuperset = arr2.every(function (val) {
                            return arr1.indexOf(val) >= 0;
                        });
                    }

                    if (isSuperset) {
                        pi++;
                    }
                    i++;
                }
                return pi;
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
    $.get(filename, function() {
            console.log( "fetching data..." );})
        .done(function(data) {
            allData =  JSON.parse(LZString.decompressFromEncodedURIComponent(data));
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