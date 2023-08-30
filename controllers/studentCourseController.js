const Course = require('../models/Course');
const Student = require('../models/Student'); // Import the Student model


exports.viewCourses = async (req, res) => {
    try {
        const user = req.user

        const courses = await Course.find();
        res.render('student/courses', { courses, user });
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while fetching the courses.');
        res.redirect('/student/dashboard');
    }
};



const EnrollmentRequest = require('../models/EnrollmentRequest');

exports.createEnrollmentRequest = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const studentId = req.user._id; // Assuming you have authentication middleware

        const enrollmentRequest = new EnrollmentRequest({
            studentId,
            courseId,
        });

        await enrollmentRequest.save();

        // Redirect to a confirmation or dashboard page
        res.redirect('/student/dashboard');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while creating the enrollment request.');
        res.redirect('/student/dashboard');
    }
};
