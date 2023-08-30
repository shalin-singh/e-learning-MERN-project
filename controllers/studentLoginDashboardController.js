const Result = require('../models/Result');
const passport = require('passport');
const Student = require('../models/Student'); // Import the Student model

exports.showLoginForm = (req, res) => {
    res.render('student/login', { message: req.flash('error') });
};

exports.showRegisterForm = (req, res) => {
    res.render('student/register', { message: req.flash('error') });
};
exports.handleRegistration = (req, res) => {

    const { firstName, lastName, email, password } = req.body

    if (firstName && email && password) {
        const student = new Student(
            firstName,
            lastName,
            email,
            password,
        )

        student.save()

        req.flash('success', "Student registered successfully...")
        res.redirect('student/login')
    }
    else {
        req.flash('error', "Registration failed Contact to admin")
    }
};


// Handle login form submission using Passport.js
exports.handleLogin = passport.authenticate('student-local', {
    successRedirect: '/student/dashboard',
    failureRedirect: '/student/login',
    failureFlash: true
});

exports.dashboard = async (req, res) => {
    try {
        const userId = req.user._id; // Make sure user ID is available in req.user
        const student = await Student.findById(userId).populate('enrolledCourses', 'title');

        // Check if student was found
        if (!student) {
            req.flash('error', 'Student not found.');
            return res.redirect('/student/dashboard');
        }

        console.log("Student: ", student);

        res.render('student/dashboard', { student });
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while loading the dashboard.');
        res.redirect('/student/dashboard');
    }
};


exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            // Handle error if any
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.redirect('/');
        req.flash('success', 'You have been successfully logged out.');
    });

};