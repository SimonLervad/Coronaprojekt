const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true,        
        default: Date.now
    },
    deadline: {
        type: Date,
        required: true
    },
    priority: {
        type: Number,
        default: 2,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    concede: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Todo", todoSchema, 'todo');
