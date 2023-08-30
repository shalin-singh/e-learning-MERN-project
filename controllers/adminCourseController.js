const Course = require('../models/Course');
const { validationResult } = require('express-validator');
require('util');


exports.addCourseForm = (req, res) => {
    const messages = {
        error: req.flash('error'),
        success: req.flash('success')
    };
    res.render('admin/add-course', { messages });
};

exports.addCourse = async (req, res) => {
    const { title, description } = req.body;

    // Validate form data using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'Validation errors occurred.');
        return res.redirect('/admin/add-course');
    }

    try {
        const newCourse = new Course({
            title,
            description,
        });

        await newCourse.save();

        req.flash('success', 'Course added successfully.');
        res.redirect('/admin/manage-courses');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while adding the course.');
        res.redirect('/admin/add-course');
    }
};

exports.manageCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.render('admin/manage-courses', { courses });
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while loading the courses.');
        res.redirect('/admin/dashboard');
    }
};


exports.deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;

        const course = await Course.findByIdAndDelete(courseId);
        if (!course) {
            req.flash('error', 'Course not found.');
        } else {
            req.flash('success', 'Course deleted successfully.');
        }

        res.redirect('/admin/manage-courses');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred.');
        res.redirect('/admin/manage-courses');
    }
};



exports.editCourseForm = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId);

        if (!course) {
            req.flash('error', 'Course not found.');
            return res.redirect('/admin/manage-courses');
        }

        res.render('admin/edit-course', { course });
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred.');
        res.redirect('/admin/manage-courses');
    }
};

exports.editCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const { title, description } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            req.flash('error', 'Course not found.');
            return res.redirect('/admin/manage-courses');
        }

        // Update course details
        course.title = title;
        course.description = description;

        // Save the updated course
        await course.save();

        req.flash('success', 'Course updated successfully.');
        res.redirect('/admin/manage-courses');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred.');
        res.redirect('/admin/manage-courses');
    }
};

