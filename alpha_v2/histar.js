`user script`;

const buildId = "q8W6nBlNzAV8WMV3Oaf5w";

// Main
function buildMedias(inputURL) {
    const postBodyList = inputURL.split("-");
    //print(postBodyList);
    
    const postBody = {
        'page' : parseInt(postBodyList[0]),
        'pageSize' : 20
    };

    if (postBodyList.length > 1) {
        postBody.chName = postBodyList[1];

        if (postBodyList.length > 2) {
            postBody.country = postBodyList[2];
        }
    }
    //print(postBody);

    const req = {
        url: 'https://aws.ulivetv.net/v3/web/api/filter',
        method: 'POST',
        body:JSON.stringify(postBody),
        headers: {
            'Content-Type': 'application/json',
            'Referer':'https://www.histar.tv/'
        }
    };

    $http.fetch(req).then(res => {
        const items =  JSON.parse(res.body).data.list;
        let datas = [];
        items.forEach(item => {
            const title = item.name;
            //const href = "https://www.histar.tv/_next/data/" + buildId + "/vod/detail/" + item.id + ".json?id=" + item.id;//由於編譯id總是變化，暫時改回直接從網頁獲取分集數據
            const href = "https://www.histar.tv/vod/detail/" + item.id; //直接從網頁獲取分集數據
            const coverURLString = item.img;
            let descriptionText = item.countStr;
            if (descriptionText == null||descriptionText ==""||descriptionText ==undefined) {
                descriptionText = item.name;
            }
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

    $http.fetch(req).then(res => {
        let jsonData = res.body;
        if (jsonData.indexOf('{"props":') != -1) {
            jsonData = jsonData.match(/{"props":(.+),"page"/)[1];
        }

        const items = JSON.parse(jsonData).pageProps.pageData.videos; 
        let datas = [];
        items.forEach(item => {
            const href = item.purl;
            const title = item.epInfo;
            datas.push(buildEpisodeData(href, title, href));
        });
        $next.toEpisodes(JSON.stringify(datas));
    });
}

function Player(inputURL) {
    $next.toPlayer(inputURL);
}

function Search(inputURL) {
    const req = {
        //url: "https://www.histar.tv/_next/data/" + buildId + "/search.json?word=" + inputURL,
        url: "https://www.histar.tv/search?word=" + inputURL,//直接從網頁獲取搜索結果
        method: "GET",
    };
    $http.fetch(req).then(res => {
        let jsonData = res.body;
        if (jsonData.indexOf('{"props":') != -1) {
            jsonData = jsonData.match(/{"props":(.+),"page"/)[1];
        }
        const items = JSON.parse(jsonData).pageProps.initList;
        let datas = [];
        items.forEach(item => {
            const title = item.name;
            //const href = "https://www.histar.tv/_next/data/" + buildId + "/vod/detail/" + item.id + ".json?id=" + item.id;
            const href = "https://www.histar.tv/vod/detail/" + item.id; //直接從網頁獲取分集數據
            const coverURLString = item.picurl;
            const descriptionText = item.desc;
        
            datas.push(
                buildMediaData(href, coverURLString, title, descriptionText, href)
            );
        });
        $next.toMedias(JSON.stringify(datas));
    });
}