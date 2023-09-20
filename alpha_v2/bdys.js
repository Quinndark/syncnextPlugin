`user script`;

function buildURL(href) {
    if (!href.startsWith("http")) {
      href = "https://www.bdys10.com" + href;
    }
    return href;
}

// Main
function buildMedias(inputURL) {
    const req = {
        url: inputURL,
        method: "GET",
    };
    
    let datas = [];

    $http.fetch(req).then(res => {
        const content = tXml.getElementsByClassName(res.body, "card card-sm card-link");
        content.forEach(dom => {
            _len = dom.children.length;
    
            let href  = findAllByKey(dom, "href")[0];
            // print(href);
            const title = dom.children[_len-1].children[0].children[0];
            // print(title);
            const coverURLString = findAllByKey(dom, "src")[0];
            // print(coverURLString);
            let descriptionText = dom.children[_len-1].children[1].children[0];
            /* 不知道為什麽本地node環境可以正常輸出，但是在插件里會報錯，後續找到原因再調試。
            const _array = dom.children[_len-2].children[1] || dom.children[_len-1].children[1];
            const descriptionText = _array.children[0];
            */
            // print(descriptionText);
            href = buildURL(href);
    
            datas.push(
                buildMediaData(href, coverURLString, title, descriptionText, href)
            );
        });

        $next.toMedias(JSON.stringify(datas));
    });
}

function Episodes(inputURL) {
    const req = {
        url: inputURL,
        method: "GET",
    };
    
    let datas = [];

    $http.fetch(req).then(res => {
        const content = tXml.getElementsByClassName(res.body, "btn btn-square me-2");

        content.forEach(element => {
            let href  = element.attributes.href;
            const title = element.children[0];

            href = buildURL(href);

            datas.push(buildEpisodeData(href, title, href));
        });

        $next.toEpisodes(JSON.stringify(datas));
    });
}

function Search(inputURL) {
}