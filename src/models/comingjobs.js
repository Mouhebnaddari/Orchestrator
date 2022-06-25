const mongoose = require("mongoose");
const {Schema} = mongoose;
const upSchema = new Schema({
    orchestration: [{
        order: String,
        job: String,
        hostname: String,
    }],
    cronExpression: {
        type: String,
        requires: true
    }
})
module.exports = Upcoming = mongoose.model('upcoming', upSchema)