const Student = require('../models/Student');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
require('util');
const Course = require('../models/Course')
// controllers/adminController.js
const EnrollmentRequest = require('../models/EnrollmentRequest');


exports.addStudentForm = (req, res) => {
    const messages = {
        error: req.flash('error'),
        success: req.flash('success')
    };
    res.render('admin/add-student', { messages });
};


exports.addStudent = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Validate form data using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'Validation errors occurred.');
        return res.redirect('/admin/add-student');
    }

    try {
        const newStudent = new Student({
            firstName,
            lastName,
            email,
            password // The password will be automatically hashed when saved
        });

        await newStudent.save();

        req.flash('success', 'Student added successfully.');
        res.redirect('/admin/manage-students');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while adding the student.');
        res.redirect('/admin/add-student');
    }
};



exports.manageStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('enrolledCourses'); // Populate the enrolledCourses field
        res.render('admin/manage-students', { students });
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while loading the students.');
        res.redirect('/admin/dashboard');
    }
};


exports.editStudentForm = async (req, res) => {
    try {
        const studentId = req.params.id;
        const courses = await Course.find(); // Fetch the courses
        const student = await Student.findById(studentId);

        if (!student) {
            req.flash('error', 'Student not found.');
            return res.redirect('/admin/manage-students');
        }

        res.render('admin/edit-student', { student, courses });
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred.');
        res.redirect('/admin/manage-students');
    }
};

exports.editStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const { firstName, lastName, email, password } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
            req.flash('error', 'Student not found.');
            return res.redirect('/admin/manage-students');
        }

        // Update student details
        student.firstName = firstName;
        student.lastName = lastName;
        student.email = email;
        student.password = password;

        // Save the updated student
        await student.save();

        req.flash('success', 'Student updated successfully.');
        res.redirect('/admin/manage-students');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred.');
        res.redirect('/admin/manage-students');
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const studentId = req.params.id;

        const student = await Student.findByIdAndDelete(studentId);
        if (!student) {
            req.flash('error', 'Student not found.');
        } else {
            req.flash('success', 'Student deleted successfully.');
        }

        res.redirect('/admin/manage-students');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred.');
        res.redirect('/admin/manage-students');
    }
};




