const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    approved: {
        type:Boolean,
        default:false
    },
    admin: {
        type:Boolean,
        default:false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", userSchema, 'user');
