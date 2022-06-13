const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String, unique: true
    },
    token: {
        type: String
    }
})
module.exports = signup = mongoose.model('user', userSchema)

