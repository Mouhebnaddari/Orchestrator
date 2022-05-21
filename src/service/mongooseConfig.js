const config = require("config");
const mongoose = require("mongoose");
const Job = require('../models/jobs')
//const {getHistory} = require("./mongooseConfig");


const connect = () => {
    const {url} = config.get('database')
    mongoose.connect(url, (err, done) => {
        if (err) {
            throw err;
        }
        if (done) {
            console.log("DATA BASE CONNECTED")
        }

    });
}
//return auto
const getHistory = () => Job.find({});

exports.getHistory = getHistory
exports.connect = connect
