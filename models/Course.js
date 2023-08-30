const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    materials: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Material' }
    ],
    examQuestions: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }
    ],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
