const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
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
        default: 3,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    concede: {
        type: Boolean,
        default: false
    },
    completeDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Todo", todoSchema, 'todo');
