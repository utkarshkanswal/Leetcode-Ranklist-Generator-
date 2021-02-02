const express = require("express");
const path = require('path');
const request = require('request-promise');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const fs = require('fs');
const app = express();
const port = 3000;
const db = mongoose.connection;
const Schema = mongoose.Schema;
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded());
mongoose.connect('mongodb://localhost/Leetcode', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("We are connected");
});
const postSchema = new Schema({
    email: String,
    year: Number,
    username: String
});
var Student = mongoose.model('Student', postSchema);
app.get('/', (req, res) => {
    Student.find(function (err, obj) {
        if (err) return console.error(err);
        console.log(obj);
        for (let i = 0; i < obj.length; i++) {
            const studentUrl = `https://competitive-coding-api.herokuapp.com/api/leetcode/${obj[i].username}`;
            (async () => {
                let data = [];
                const response = await request({
                    url: studentUrl,
                    headers: {
                        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                        "accept-encoding": "gzip, deflate, br",
                        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8"
                    },
                    gzip: true
                });
                // console.log(response);
                var myJson = JSON.stringify(response);
                fs.writeFileSync("Data.JSON", myJson);
            })();
        }
    });
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/CSS/style.css', (req, res) => {
    res.sendFile(path.join(__dirname + '/CSS/style.css'))
});
app.get('/adduser.html', (req, res) => {
    res.sendFile(path.join(__dirname + '/adduser.html'))
});
app.get('/CSS/style1.css', (req, res) => {
    res.sendFile(path.join(__dirname + '/CSS/style1.css'))
});
app.get('/Images/sv1.jpg', (req, res) => {
    res.sendFile(path.join(__dirname + '/Images/sv1.jpg'))
});
app.post('/adduser.html', function (req, res) {
    var mydata = new Student(req.body);
    mydata.save().then(() => {
        res.send("This Item has been added to the data base:");
    }).catch(() => {
        res.status(400).send("It was not save dto the data base");
    });
});
app.listen(port, () => {
    console.log(`example app is listening at http://localhost:${port}`);
})