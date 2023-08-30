const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: {
        a: String,
        b: String,
        c: String,
        d: String,
    },
    answer: {
        type: String,
        enum: ['a', 'b', 'c', 'd'],
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: false
    },
    material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
        required: true,
    },

}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
