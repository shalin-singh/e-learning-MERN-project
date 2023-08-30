const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true });

// Hash the password before saving
studentSchema.pre('save', async function (next) {
    const student = this;

    if (!student.isModified('password')) {
        return next();
    }

    const hash = await bcrypt.hash(student.password, 10);
    student.password = hash;
    next();
});

// Method to compare passwords
studentSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
