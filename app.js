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

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.set("views", __dirname + "/views"); // set express to look in this folder to render our view
app.use(express.urlencoded());
mongoose.connect('mongodb+srv://Leetcode:MxRHS4xx5ijHk8IO@leetcoderanklist.dlhii.mongodb.net/UserDetails?retryWrites=true&w=majority', {
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
let myJson = [];
app.get("/", function (req, res) {
    res.render("index");
});
app.get("/adduser", function (req, res) {
    res.render("adduser");
});
app.get('/Data.JSON', (req, res) => {
    res.sendFile(path.join(__dirname + '/Data.JSON'));
});

app.post('/adduser', function (req, res) {
    var mydata = new Student(req.body);
    mydata.save().then(() => {
        Student.find(function (err, obj) {
            if (err) return console.error(err);
            console.log(obj);
            for (let i = 0; i < obj.length; i++) {
                const studentUrl = `https://competitive-coding-api.herokuapp.com/api/leetcode/${obj[i].username}`;
                (async () => {
                    const response = await request({
                        url: studentUrl,
                        headers: {
                            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                            "accept-encoding": "gzip, deflate, br",
                            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8"
                        },
                        gzip: true
                    });
                    var temp = JSON.parse(response);
                    if (temp.static != "Failed") {
                        temp.year = `${obj[i].year+2016}`;
                        temp.username = `${obj[i].username}`;
                        myJson.push(temp);
                    } else
                        i--;
                })();
            }
        });
        setTimeout(function () {
            var final = JSON.stringify(myJson);
            fs.writeFileSync("", final);
        }, 10000)
        res.send("This Item has been added to the data base:");
    }).catch(() => {
        res.status(400).send("It was not save dto the data base");
    });
});
app.listen(port, () => {
    console.log(`example app is listening at http://localhost:${port}`);
})