const Course = require('../models/Course');
const Student = require('../models/Student')
const Result = require('../models/Result');
const Question = require('../models/Question');
const Material = require('../models/Material');
require('express-validator');
require('util');


exports.dashboard = async (req, res) => {
    try {
        const courseCount = await Course.countDocuments();
        const studentCount = await Student.countDocuments();
        const questionCount = await Question.countDocuments();
        const resultCount = await Result.countDocuments();
        const materialCount = await Material.countDocuments();

        res.render('admin/dashboard', {
            courseCount,
            studentCount,
            questionCount,
            resultCount,
            materialCount,
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while loading the admin dashboard.');
        res.redirect('/admin/dashboard');
    }
};


