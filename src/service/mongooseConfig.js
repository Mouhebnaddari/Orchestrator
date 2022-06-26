const config = require("config");
const mongoose = require("mongoose");
const Job = require('../models/jobs')
const Upcoming = require('../models/comingjobs')
const initDBConnection = () => {
    const {url} = config.get('database')

    return mongoose.connect(url, (err, done) => {
        if (err) {
            throw err;
        }
        if (done) {
            console.log("DATA BASE CONNECTED")
        }

    });
}
//return auto
const getHistory = () => Job.find({})
const getUpcoming = () => Upcoming.find({})
const deleteJob = (id) => Upcoming.deleteOne({id})

exports.getHistory = getHistory
exports.initDBConnection = initDBConnection
exports.getUpcoming = getUpcoming
exports.deleteJob = deleteJob
