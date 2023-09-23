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
        href = "https://www.libvio.pro" + href;
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
            url: 'https://www.libvio.pro' + '/static/player/' + from + '.js',
            method: "GET",
        };

        $http.fetch(req2).then(
            function (res) {
                paurl = res.body.match(/ src="(.*?)'/)[1];
                var playAPIURL =
                    paurl + url + '&next=' + next + '&id=' + id + '&nid=' + nid;




                var req = {
                    url: playAPIURL,
                    headers: {
                        Referer: 'https://www.libvio.pro/'
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

        );






    });
}

