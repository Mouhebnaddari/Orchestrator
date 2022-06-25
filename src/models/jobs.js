

const mongoose = require('mongoose')
const { Schema } = mongoose;
const jobSchema =  new Schema({
    job: {
        type: String,
        required: true
    },
    hostname: {
        type: String,
        required: true
    },
    timestamp: {
      type: Date,

    },
    log: {
        type: String,

    }
})

module.exports = Job = mongoose.model('job', jobSchema)
