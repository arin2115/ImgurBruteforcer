const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const request = require('request');
const path = require('path');
const serverIp = "https://..."

var download = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    https.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);
        });
    });
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.get('/random', (req, res) => {
    request.get(serverIp + '/random', function (error, response, body) {
        console.log(body);
        var code = body.split('https://i.imgur.com/')[1].split('\r\n')[0];
        download(body, code, (resp) => {
            res.sendFile(path.join(__dirname, code));
            setTimeout(() => {
                fs.unlinkSync(path.join(__dirname, code))
            }, 5000);
        })

    })
})

app.listen(3010, () => {
    console.log("Imgur Frontend listening on 3010");
})