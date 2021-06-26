const mongoose = require("mongoose");
const Schema = mongoose.Schema
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
module.exports = mongoose.model("userLeetCodeData", userLeetCodeData);