`user script`;


const cdn = {
    AL: '阿里',
    AL13: '阿里13',
    TX: '腾讯',
    TX15: '腾讯',
    HW: '华为',
    HW16: '华为16',
    HS: '火山',
    WS: '网宿',
    HY: '虎牙'
};

function print(params) {
    console.log(JSON.stringify(params));
}

function buildMediaData(id, coverURLString, title, descriptionText, detailURLString) {
    var obj = {
        id: id,
        coverURLString: coverURLString,
        title: title,
        descriptionText: descriptionText,
        detailURLString: detailURLString,
    };

    return obj;
}

function buildEpisodeData(id, title, episodeDetailURL) {
    return {
        id: id,
        title: title,
        episodeDetailURL: episodeDetailURL,
    };
}

function buildURL(href) {
    if (!href.startsWith("http")) {
        href = "https://www.huya.com/" + href;
    }
    return href;
}

function findAllByKey(obj, keyToFind) {
    return (
        Object.entries(obj).reduce(
            (acc, [key, value]) =>
                key === keyToFind
                    ? acc.concat(value)
                    : typeof value === "object" && value
                        ? acc.concat(findAllByKey(value, keyToFind))
                        : acc,
            []
        ) || []
    );
}

// Main

function buildMedias(inputURL) {
    var req = {
        url: inputURL,
        method: "GET",
    };

    let datas = [];

    $http.fetch(req).then(function (res) {
        var vlist = JSON.parse(res.body).vList;
        //print(vlist);

        for (var index = 0; index < vlist.length; index++) {


            var title = vlist[index].sNick + '    ' + vlist[index].sIntroduction;
            // print(title);
            var href = vlist[index].lProfileRoom.toString();
            //print(typeof (href));
            var coverURLString = vlist[index].sScreenshot;
            var descriptionText = vlist[index].sIntroduction;

            datas.push(
                buildMediaData(href, coverURLString, title, descriptionText, href)
            );
        }

        $next.toMedias(JSON.stringify(datas));
    });
}

function Episodes(inputURL) {
    var id = inputURL;



    let datas = [];

    getRoomInfo(id).then(function (info) {
        //print(info);

        getLives(info).then(function (streamInfo) {
            //print(streamInfo.flv);
            var flv = streamInfo.flv;

            //print(1);

            for (var [key, value] of Object.entries(flv)) {
                href = value;
                //print(href);

                title = key;
                datas.push(buildEpisodeData(href, title, href));
            }

            $next.toEpisodes(JSON.stringify(datas));






        })












    });






}

function Player(inputURL) {

    $next.toPlayer(inputURL);


}


function getRoomInfo(id) {

    var req = {
        url: 'https://m.huya.com/' + id,
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) ' +
                'Chrome/75.0.3770.100 Mobile Safari/537.36 '
        }
    };

    return $http.fetch(req).then(function (res) {
        const ptn = /<script> window.HNF_GLOBAL_INIT = (.*) <\/script>/;
        const infoStr = ptn.exec(res.body)[1];
        const info = JSON.parse(infoStr);
        return info;
    });


}
function getLives(ri) {
    var streamInfo = { flv: {}, hls: {} };
    const json = {
        appId: 5002,
        byPass: 3,
        context: '',
        version: '2.4',
        data: {},
    }
    const req = {
        url: 'https://udblgn.huya.com/web/anonymousLogin',
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(json)
    }
    //print(req);

    return $http.fetch(req).then(function (res) {

        const obj = JSON.parse(res.body)
        //print(res.body)
        uid = obj.uid;

        for (let item of ri.roomInfo.tLiveInfo.tLiveStreamInfo.vStreamInfo.value) {
            if (item.sFlvUrl) {
                var anticode = parseAnticode(item.sFlvAntiCode, uid, item.sStreamName)
                //print(item.sFlvAntiCode);
                var url = `${item.sFlvUrl}/${item.sStreamName}.${item.sFlvUrlSuffix}?${anticode}`
                streamInfo['flv'][cdn[item.sCdnType]] = url
            }

            //if (item.sHlsUrl) {
            //var anticode = parseAnticode(item.sHlsAntiCode, uid, item.sStreamName)
            //var url = `${item.sHlsUrl}/${item.sStreamName}.${item.sHlsUrlSuffix}?${anticode}`
            //streamInfo['hls'][cdn[item.sCdnType]] = url
            //}
            //print(streamInfo);


            //}

        };

        return streamInfo;
    })
}




    }


function parseAnticode(code, uid, streamname) {
    var q = {};
    //print(typeof (code));
    q = parseQuery(code);
    //print(q);

    //q['wsSecret'] = '0260c8044e7cdc8c51d992ed92e7a84d';
    //q['wsTime'] = '650d3dd4';
    //q['fm'] = 'RFdxOEJjSjNoNkRKdDZUWV8kMF8kMV8kMl8kMw=='
    //q['ctype'] = 'tars_mobile'
    //q['fs'] = 'bgct'
    //q['sphdcdn'] = 'al_7-tx_3-js_3-ws_7-bd_2-hw_2'
    //q['sphdDC'] = 'huya'
    //q['sphd'] = '264_*-265_*'
    //q['exsphd'] = '264_500,264_2000,264_4000,'
    //q['t'] = '103'


    q['ver'] = '1';
    q['sv'] = '2110211124';
    q['seqid'] = parseInt(uid) + new Date().getTime();
    //q['seqid'] = 3161597560714;
    //print(q['seqid']);

    q['uid'] = uid;
    //q['uid'] = 1466317350993;
    q['uuid'] = newUuid();
    //print(hex_md5('DWq8BcJ3h6DJt6TY_1466272422514_1608993854-1608993854-6910575982394998784-3218111164-10057-A-0-1-imgplus_5504b61871f4af5df4e71f792fc29252_6509ad58'))
    //print(typeof (q['uuid']))

    //print(q);
    var ss = `${q['seqid']}|${q['ctype']}|${q['t']}`;
    //print(ss);
    ss = hex_md5(ss);


    var result = base64Decode(q['fm']);
    //print(result);

    result = result.replace('$0', q['uid']);
    result = result.replace('$1', streamname);
    result = result.replace('$2', ss);
    result = result.replace('$3', q['wsTime']);
    //print(result);

    q['wsSecret'] = hex_md5(result)
    //print(q['wsSecret'])
    delete q['fm']
    //print(q);
    if ('txyp' in q) {
        delete q['txyp']
    }


    var queryString = objectToQueryString(q);
    //print(queryString);
    //print(queryString);
    return queryString;

}

function newUuid() {
    const now = new Date().getTime()
    const rand = Math.floor(Math.random() * 1000) | 0;
    return ((now % 10000000000) * 1000 + rand) % 4294967295;
}
function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}
function objectToQueryString(obj) {
    return Object.entries(obj).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
}


