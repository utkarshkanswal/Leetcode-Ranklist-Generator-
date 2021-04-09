const express = require("express");
const path = require('path');
const request = require('request-promise');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const fs = require('fs');
const app = express();
const port = process.env.PORT || 8000;

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
    acceptance_rate: Number,
    easy_questions_solved: Number,
    total_easy_questions: Number,
    medium_questions_solved: Number,
    total_medium_questions: Number,
    hard_questions_solved: Number,
    total_hard_questions: Number,
    contribution_points: Number,
    contribution_problems: Number,
    contribution_testcases: Number,
    reputation: String,
    username: String,
});
var Student = mongoose.model('Student', userLeetCodeData);
app.get("/", function (req, res) {
    Student.find(function (err, obj) {
        if (err)
            res.send("Error occured");
        else
            res.render("index", {
                arr: obj,
                index: 0,
                direction: -1,
            });
    }).sort({
        total_problems_solved: -1
    });

});
app.get("/delete/:id", function (req, res) {
    let Foundid = req.params.id;
    Student.deleteOne({
        username: Foundid
    }, function (err, obj) {
        res.send("Item deleted");
    });
});
app.get("/adduser", function (req, res) {
    res.render("adduser");
});
app.post("/", function (req, res) {
    var data = req.body;
    // console.log(data);
    Student.find({
        username: data.username
    }, function (err, obj) {
        if (err)
            res.send("Error occured");
        else
            res.render("index", {
                arr: obj,
                index: 1,
                direction: -1,
            });
    });
});
app.post("/sortby", function (req, res) {
    let data = req.body.field;
    console.log(data);
    Student.find(function (err, obj) {
        if (err)
            res.send("Error occured");
        else
            res.render("index", {
                arr: obj,
                index: 0,
                direction: -1,
            });
    }).sort({
        [data]: -1,
    });
});
app.post("/sort", function (req, res) {
    let data = req.body;
    let id;
    if (data[Object.keys(data)[0]] == 'up') {
        id = -1;
    } else {
        id = 1;
    }
    Student.find(function (err, obj) {
        if (err)
            res.send("Some Error Occurred");
        else {
            res.render("index", {
                arr: obj,
                index: 0,
                direction: id,
            });
        }
    }).sort({
        [Object.keys(data)[0]]: [id],
    });
    // res.send("Successfull");
});
app.post('/adduser', function (req, res) {
    var mydata = req.body;
    // console.log(mydata);
    console.log(mydata);
    Student.find({
        username: mydata.username
    }, function (err, obj) {
        if (err)
            res.render("Incorrect1");
        else {
            if (obj.length >= 1) {
                res.render("Already");
            } else {

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
                    if (temp.status == "Failed") {
                        res.render("Incorrect");
                    } else {
                        // console.log(temp);
                        temp["username"] = mydata.username;
                        if (temp.ranking[0] == '~')
                            temp["ranking"] = 100000;
                        else
                            temp["ranking"] = parseInt(temp.ranking);
                        temp.acceptance_rate = temp.acceptance_rate.slice(0, -1) //'abcde'
                        temp["acceptance_rate"] = parseInt(temp.acceptance_rate);
                        temp["easy_questions_solved"] = parseInt(temp.easy_questions_solved);
                        temp["hard_questions_solved"] = parseInt(temp.hard_questions_solved);
                        temp["total_easy_questions"] = parseInt(temp.total_easy_questions);
                        temp["total_hard_questions"] = parseInt(temp.total_hard_questions);
                        temp["total_medium_questions"] = parseInt(temp.total_medium_questions);
                        temp["medium_questions_solved"] = parseInt(temp.medium_questions_solved);
                        temp["contribution_points"] = parseInt(temp.contribution_points);
                        temp["contribution_problems"] = parseInt(temp.contribution_problems);
                        temp["contribution_testcases"] = parseInt(temp.contribution_testcases);
                        temp["total_problems_solved"] = parseInt(temp.total_problems_solved);
                        console.log(temp);
                        var user = new Student(temp);
                        user.save().then(() => {
                            res.redirect("/");
                        });
                    }
                })();
            }
        }
    });
});
app.listen(port, () => {
    console.log(`example app is listening at http://localhost:${port}`);
})