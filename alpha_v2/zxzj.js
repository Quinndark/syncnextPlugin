`user script`;

function buildMediaData(
    id,
    coverURLString,
    title,
    descriptionText,
    detailURLString
) {
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
// Main

function buildMedias(inputURL) {
    var req = {
        url: inputURL,
        method: "GET",
    };

    let datas = [];

    $http.fetch(req).then(function (res) {
        var content = tXml.getElementsByClassName(res.body, "stui-vodlist__box");

        for (var index = 0; index < content.length; index++) {

            var dom = content[index];
            //print(content.length)

            var title = findAllByKey(dom, "title")[0];
            var href = findAllByKey(dom, "href")[0];
            var coverURLString = findAllByKey(dom, "data-original")[0];
            var descriptionText = '';

            href = buildURL(href);

            datas.push(
                buildMediaData(href, coverURLString, title, descriptionText, href)
            );
        }

        $next.toMedias(JSON.stringify(datas));
    });
}
function buildURL(href) {
    if (!href.startsWith("http")) {
        href = "https://www.zxzja.com" + href;
    }
    return href;
}

function Episodes(inputURL) {
    var req = {
        url: inputURL,
        method: "GET",
    };

    let datas = [];

    $http.fetch(req).then(function (res) {
        var content = tXml.getElementsByClassName(res.body, "stui-content__playlist")[0];
        //print(content.children.length);

        for (var index = 0; index < content.children.length; index++) {
            var element = content.children[index].children[0];
            //print(element);

            var href = element.attributes ? element.attributes.href : '';
            var title = element.children.toString();

            href = buildURL(href);

            datas.push(buildEpisodeData(href, title, href));
        }

        $next.toEpisodes(JSON.stringify(datas));
    });
}
function Player(inputURL) {
    var req = {
        url: inputURL,
        method: "GET",
    };

    $http.fetch(req).then(function (res) {
        var xml = res.body;
        html = xml.match(/r player_.*?=(.*?)</)[1];
        const json = JSON.parse(html);
        const url = json.url;
        const from = json.from;
        print(json.encrypt)

        if (json.encrypt == '1') {
            url = url
            $next.toPlayer(url);
        } else if (json.encrypt == '2') {
            url = base64Decode(url)
            $next.toPlayer(url);
        } else if (json.encrypt == '3') {
            var req = {
                url: url,
                method: "GET",
                headers: {
                    'Referer': 'https://www.zxzja.com',
                    'Sec-Fetch-Dest': 'iframe',
                    'Sec-Fetch-Site': 'cross-site',
                    'Sec-Fetch-Mode': 'navigate',
                }
            };
            $http.fetch(req).then(function (res) {
                const ifrwy = res.body
                var code = ifrwy.match(/(?<={).+?(?=})/);
                //var code = ifrwy.compile('result_v2 =(.+);')
                code = "{" + code + "}"

                code = JSON.parse(code)
                //print(typeof (code))

                code = code["data"]
                //print(code)


                _0x3a1d23 = strRevers(code);
                //print(_0x3a1d23)
                _0x3a1d23 = htoStr(_0x3a1d23);
                //print(_0x3a1d23)
                $next.toPlayer(decodeStr(_0x3a1d23))
            })
        }

        if (url.indexOf('m3u8') >= 0 || url.indexOf('mp4') >= 0) {
            // console.debug('在线之家url =====>' + url); // js_debug.log
            $next.toPlayer(url);
        } else if (from.indexOf('line3') >= 0 || from.indexOf('line5') >= 0) {

            var req = {
                url: url,
                method: "GET",
                headers: {
                    'Referer': 'https://www.zxzja.com',
                    'Sec-Fetch-Dest': 'iframe',
                    'Sec-Fetch-Site': 'cross-site',
                    'Sec-Fetch-Mode': 'navigate',
                }
            };
            $http.fetch(req).then(function (res) {
                const ifrwy = res.body
                const code = ifrwy.match(/var url = '(.*?)'/)[1].split('').reverse().join('');
                let temp = '';
                for (let i = 0x0; i < code.length; i = i + 0x2) {
                    temp += String.fromCharCode(parseInt(code[i] + code[i + 0x1], 0x10))
                }
                const url = temp.substring(0x0, (temp.length - 0x7) / 0x2) + temp.substring((temp.length - 0x7) / 0x2 + 0x7);
                $next.toPlayer(url);
            })

        }



    })
}
function Search(inputURL, key) {
    const req = {
        //url: "https://www.histar.tv/_next/data/" + buildId + "/search.json?word=" + inputURL,
        url: inputURL,//直接從網頁獲取搜索結果
        method: "GET",
    };
    $http.fetch(req).then(res => {
        var content = tXml.getElementsByClassName(res.body, "hl-item-div");

        let datas = [];
        for (var index = 0; index < content.length; index++) {
            var dom = content[index];
            //print(content.length)

            var title = findAllByKey(dom, "title")[0];
            var href = findAllByKey(dom, "href")[0];

            href = buildURL(href);

            datas.push(buildEpisodeData(href, title, href));
        }

        $next.toSearchMedias(JSON.stringify(returnDatas), key);
    });
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
function print(params) {
    console.log(JSON.stringify(params));
}
function jie(_0x3a1d23) {
    _0x3a1d23 = this.strRevers(_0x3a1d23);
    _0x3a1d23 = this.htoStr(_0x3a1d23);
    return decodeStr(_0x3a1d23);
}
function htoStr(_0x335e0c) {
    var _0x19492b = '';
    for (var _0x53a455 = 0; _0x53a455 < _0x335e0c.length; _0x53a455 = _0x53a455 + 2) {
        var _0x4091f2 = _0x335e0c[_0x53a455] + _0x335e0c[_0x53a455 + 1];
        _0x4091f2 = parseInt(_0x4091f2, 16);
        _0x19492b += String.fromCharCode(_0x4091f2);
    }
    return _0x19492b;
}
function strRevers(_0x5d6b71) {
    return _0x5d6b71.split('').reverse();
}
function decodeStr(_0x267828) {
    var _0x5cd2b5 = (_0x267828.length - 7) / 2, _0x2191ed = _0x267828.substring(0, _0x5cd2b5), _0x35a256 = _0x267828.substring(_0x5cd2b5 + 7);
    return _0x2191ed + _0x35a256;
}