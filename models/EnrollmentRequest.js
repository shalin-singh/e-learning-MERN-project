// models/EnrollmentRequest.js
const mongoose = require('mongoose');

const enrollmentRequestSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    // Add more fields if needed
}, { timestamps: true });

const EnrollmentRequest = mongoose.model('EnrollmentRequest', enrollmentRequestSchema);

module.exports = EnrollmentRequest;
