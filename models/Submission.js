const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    materialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material', // Reference to the material associated with the submission
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to the course associated with the submission
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Reference to the user who submitted the assignment
        required: true,
    },
    assignmentAnswer: {
        type: String,
        required: true,
    },
}, { timestamps: true });

submissionSchema.index({ userId: 1, materialId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
