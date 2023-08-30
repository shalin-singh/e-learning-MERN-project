const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    material: { type: Schema.Types.ObjectId, ref: 'Material' },
    score: { type: Number, default: 0 }, // Default value is set to 0
    answers: [
        {
            question: { type: Schema.Types.ObjectId, ref: 'Question' },
            selectedOptionIndex: String,
        },
    ],
}, { timestamps: true });

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
