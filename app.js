const express = require("express");
const path = require('path');
const request = require('request-promise');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

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
let myJson = [];
const userLeetCodeData = new Schema({
    status: String,
    ranking: Number,
    total_problems_solved: Number,
    acceptance_rate: String,
    easy_questions_solved: Number,
    total_easy_questions: Number,
    medium_questions_solved: Number,
    total_medium_questions: Number,
    hard_questions_solved: Number,
    total_hard_questions: Number,
    contribution_points: Number,
    contribution_problems: Number,
    contribution_testcases: Number,
    reputation: Number,
    username: String,
    Year: Number
});
var Student = mongoose.model('Student', userLeetCodeData);
app.get("/", function (req, res) {
    Student.find(function (err, obj) {
        if (err)
            res.send("Error occured");
        else
            res.render("index", {
                arr: obj
            });
    }).sort({
        total_problems_solved: -1
    });

});
app.get("/adduser", function (req, res) {
    res.render("adduser");
});
app.post('/adduser', function (req, res) {
    var mydata = req.body;
    console.log(mydata);
    const studentUrl = `https://competitive-coding-api.herokuapp.com/api/leetcode/${mydata.username}`;
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
        temp["username"] = mydata.username;
        temp["Year"] = mydata.year + 2016;
        console.log(typeof (temp));
        var user = new Student(temp);
        user.save().then(() => {
            res.redirect("/");
        });
    })();

});
app.listen(port, () => {
    console.log(`example app is listening at http://localhost:${port}`);
})