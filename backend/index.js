const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const authCode = "...";

app.get('/random', (req, res) => {
    var fileName = 'bruteforced.txt';
    fs.readFile('./' + fileName, 'utf8' , (err, data) => {
        if (err) {
            console.error(err)
            return res.status(500).send("Error.");
        }

        var howMany = req.query.count ? req.query.count : 1;

        data = data.split('\n');
        var random = [];
        for (let i = 0; i < howMany; i++) {
            var rand = data[Math.floor(Math.random() * data.length)];
            random.push(rand);
        }

        var randomString = "";
        for (let i = 0; i < random.length; i++) {
            randomString += random[i] + "\n";
        }

        res.header("Access-Control-Allow-Origin", "*")
        res.header("Content-type", "text/plain")
        res.send(randomString);
    })
})

app.get('/list', (req, res) => {
    var options = {
        root: path.join(__dirname)
    };
     
    var fileName = 'bruteforced.txt';
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Content-type", "text/plain")
    res.sendFile(fileName, options)
})

app.post('/upload/:url', (req, res) => {
    // AUTH CHECK
    if (req.query.auth != authCode) return res.status(400);

    // REQUEST LOGGING
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    var today = new Date();
    var date = today. getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes();
    var dateTime = date + ' ' + time;
    console.log(`[${dateTime}] Upload ${req.params.url} from ${ip}`);

    // TODO: NSFW CHECK

    // SAVE TO FILE
    fs.appendFile('./bruteforced.txt', "https://i.imgur.com/" + req.params.url + "\n", err => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error.");
        }

        return res.status(200).send("Done.");
    })
})

app.listen(3009, () => {
    console.log("Imgur Bruteforcer API listening on 3009");
})