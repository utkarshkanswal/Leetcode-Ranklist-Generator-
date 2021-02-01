const express = require("express");
const path = require('path');
const request = require('request-promise');
const cheerio = require('cheerio');
const bodyParser = require('body-parser')
const fs = require('fs');
const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded());
app.get('/', (req, res) => {
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
app.post('/adduser.html', (req, res) => {
    console.log(req.body);
});
app.listen(port, () => {
    console.log(`example app is listening at http://localhost:${port}`);
})