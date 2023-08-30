
const Course = require('../models/Course');
const Material = require('../models/Material');
const Student = require('../models/Student');
const Question = require('../models/Question');
const { request } = require('express');

exports.watchLectures = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId).populate('materials');
        const questions = await Question.find({ course: courseId });

        res.render('student/watch-lectures', { course, questions });
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while loading lectures and questions.');
        res.redirect('/student/dashboard');
    }
};



exports.viewEnrolledCourses = async (req, res) => {
    try {
        const user = req.user
        const userId = req.user._id; // Assuming the user ID is available in the req.user object

        // Find the student by user ID and populate the enrolledCourses field
        const student = await Student.findById(userId).populate('enrolledCourses');

        if (!student) {
            req.flash('error', 'Student not found.');
            return res.redirect('/student/dashboard');
        }

        res.render('student/enrolled-courses', { student, user });
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while loading enrolled courses.');
        res.redirect('/student/dashboard');
    }
};


exports.viewCourseMaterials = async (req, res) => {
    try {

        const user = req.user;
        const courseId = req.params.courseId;

        const questions = await Question.find({ course: courseId });


        const course = await Course.findById(courseId).populate('materials');

        const materials = await Material.find({ course: courseId }).populate('course');


        if (!course) {
            console.log('Course not found. Redirecting...');
            req.flash('error', 'Course not found.');
            return res.redirect('/student/enrolled-courses');
        }

        res.render('student/course-materials', { course, questions, materials, user });
    } catch (error) {
        console.error(error);
        console.log('Error loading course materials. Redirecting...');
        req.flash('error', 'An error occurred while loading course materials.');
        res.redirect('/student/enrolled-courses');
    }
};

