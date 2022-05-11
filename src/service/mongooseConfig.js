const config = require("config");
const mongoose = require("mongoose");

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
exports.connect = connect