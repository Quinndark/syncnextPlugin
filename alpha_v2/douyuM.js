`user script`;

// Main
function buildMedias(inputURL) {
    const q = inputURL.split("-");
    let url = "https://m.douyu.com/api/room/list?page="+q[0]+"&type=";
    if (q.length > 1) {
        url += q[1];
    }

    const req = {
        url: url,
        method: "GET",
    };

    $http.fetch(req).then(res => {
        const items =  JSON.parse(res.body).data.list;
        // print(items);
        var datas = [];
        items.forEach(item => {
            const title = item.nickname;
            const href = String(item.rid);
            const coverURLString = item.verticalSrc;
            var descriptionText = item.roomName;
            datas.push(
                buildMediaData(href, coverURLString, title, descriptionText, href)
            );
        });
        $next.toMedias(JSON.stringify(datas));
    });
}

function Episodes(inputURL) {
    const rid = inputURL;
    const did = "10000000000000000000000000001501";
    const tt0 = Math.round(new Date().getTime()/1000).toString();
    let req = {
        url: "https://m.douyu.com/"+rid,
        method: "GET",
    };

    $http.fetch(req).then(res => {
        let jsUb9  = res.body.match(/(function ub98484234[\s\S]*?)\s(var.*)/)[0];
        eval(jsUb9);
        const params = ub98484234(rid,did,tt0) + "&iar=0&ive=0&hevc=0&fa=0&cdn=tct-h5&rate=0&rid=" + rid;

        req = {
            url: "https://m.douyu.com/api/room/ratestream",
            method: "POST",
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };

        $http.fetch(req).then(res => {
            const _json =  JSON.parse(res.body).data;
            const playURL = _json.url;
            //print(playURL);
            let datas = [];
            const href = playURL;
            const title = "原畫";
            datas.push(buildEpisodeData(href, title, href));
            $next.toEpisodes(JSON.stringify(datas));
        }); 
    });    
}

function Player(inputURL) {
    $next.toPlayer(inputURL);
}

function Search(inputURL) {
}