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
        var content = tXml.getElementsByClassName(res.body, "public-list-div");

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
        href = "https://www.anfuns.cc" + href;
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
        var content = tXml.getElementsByClassName(res.body, "hl-plays-list")[0];
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
        urlEncode = base64Decode(js.url)
        url = decodeURIComponent(urlEncode)
        $next.toPlayer(url);

    })
}

function Search(inputURL) {
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

        $next.toMedias(JSON.stringify(datas));
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
