const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    username: {
        type: String,

    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String, unique: true
    }
})
module.exports = User = mongoose.model("user", userSchema);

