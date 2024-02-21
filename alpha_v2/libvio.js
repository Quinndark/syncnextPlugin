`user script`;

function print(params) {
    console.log(JSON.stringify(params));
}

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

function buildURL(href) {
    if (!href.startsWith("http")) {
        href = "https://www.libvio.vip" + href;
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
        var content = tXml.getElementsByClassName(res.body, "stui-vodlist__box");

        for (var index = 0; index < content.length; index++) {
            var dom = content[index];

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

        var js = JSON.parse(html);
        //print(js);
        var url = js.url;
        var from = js.from;
        var next = js.link_next;
        var id = js.id;
        var nid = js.nid;
        var paurl = 'https://p2.cfnode1.xyz/ty3.php?url=';
        var req2 = {
            url: 'https://www.libvio.vip' + '/static/player/' + from + '.js',
            method: "GET",
        };

        if (from === 'tweb') {

            $http.fetch(req2).then(
                function (res) {
                    paurl = res.body.match(/ src="(.*?)'/)[1];
                    var playAPIURL =
                        paurl + url;

                    var req = {
                        url: playAPIURL,
                        headers: {
                            Referer: 'https://www.libvio.vip/'
                        }
                    };
                    //print(req);

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
                    });


                }

            );





        } else if (from == 'ty_new1') {
            $http.fetch(req2).then(
                function (res) {
                    paurl = res.body.match(/ src="(.*?)'/)[1];
                    var paurl = 'https://p2.cfnode1.xyz/ty4.php?url='
                    var playAPIURL =
                        paurl + url;

                    var req = {
                        url: playAPIURL,
                        headers: {
                            Referer: 'https://www.libvio.vip/'
                        }
                    };
                    //print(req);

                    $http.fetch(req).then(function (res) {

                        var body = res.body;

                        var url = body.match(/var .* = '(.*?)'/)[0];
                        url = url.match(/'([^']*)'/)[0];
                        //console.log(typeof (url));
                        //print(url);
                        url = url.substring(1, url.length - 1);
                        //print(url);
                        $next.toPlayer(url);


                    });


                }

            );




        } else {
            $http.fetch(req2).then(
                function (res) {
                    paurl = res.body.match(/ src="(.*?)'/)[1];
                    var playAPIURL =
                        paurl + url + '&next=' + next + '&id=' + id + '&nid=' + nid;




                    var req = {
                        url: playAPIURL,
                        headers: {
                            Referer: 'https://www.libvio.vip/'
                        }
                    };
                    //print(req);

                    $http.fetch(req).then(function (res) {

                        var body = res.body;

                        var url = body.match(/var .* = '(.*?)'/)[0];

                        url = url.match(/'([^']*)'/)[0];
                        //console.log(typeof (url));
                        //print(url);
                        url = url.substring(1, url.length - 1);
                        print(url);
                        $next.toPlayer(url);
                    });

                }

            )
        }






    });
}
function Search(inputURL, key) {
    const req = {
        //url: "https://www.histar.tv/_next/data/" + buildId + "/search.json?word=" + inputURL,
        url: inputURL,//直接從網頁獲取搜索結果
        method: "GET",
    };
    $http.fetch(req).then(res => {
        var content = tXml.getElementsByClassName(res.body, "stui-vodlist__box");

        let datas = [];
        for (var index = 0; index < content.length; index++) {
            var dom = content[index];
            //print(content.length)

            var title = findAllByKey(dom, "title")[0];
            var href = findAllByKey(dom, "href")[0];

            href = buildURL(href);

            datas.push(buildEpisodeData(href, title, href));
        }

        $next.toSearchMedias(JSON.stringify(returnDatas), key);;
    });
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