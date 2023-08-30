const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    materialType: {
        type: String,
        enum: ['lecture', 'assignments', 'other'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cloudinaryUrl: { // Add the Cloudinary URL field
        type: String,
        required: true
    },
    publicId: { // Add the Cloudinary public ID field
        type: String,
        required: true
    }
}, { timestamps: true });

const Material = mongoose.model('Material', materialSchema);

module.exports = Material;
