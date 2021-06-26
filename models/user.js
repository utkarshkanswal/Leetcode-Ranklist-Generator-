const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    leetcodeusername: String,
});

module.exports = mongoose.model("User", user);