const Course = require('../models/Course');
const Material = require('../models/Material');
const Question = require('../models/Question');
const { validationResult } = require('express-validator');

exports.addQuestionForm = async (req, res) => {
    try {
        const courseId = req.params.courseId
        const materials = await Material.find({ course: courseId })
        console.log(materials);
        const messages = {
            success: req.flash('success'),
            error: req.flash('error'),
        };

        res.render('admin/add-question', { materials, messages });
    } catch (error) {
        console.error('Error in addQuestionForm:', error);
        req.flash('error', 'An error occurred while loading courses.');
        res.render('admin/add-question', { messages: { error: 'An error occurred while loading courses.' } });
    }
};


// Create a submit handler function
exports.addQuestion = async (req, res) => {
    try {
        const questionsData = req.body.questions;

        const savedQuestions = [];

        // Iterate through each question data
        for (const questionData of questionsData) {
            const { question, options, answer, course, material } = questionData;

            // Create a new question instance
            const newQuestion = new Question({
                question: question,
                options: options,
                answer: answer,
                material: material, // Assuming this is a valid Material ObjectId
            });

            // Save the new question and add it to the savedQuestions array
            const savedQuestion = await newQuestion.save();
            savedQuestions.push(savedQuestion);
        }

        console.log("Questions added successfully");
        // res.status(201).json({ message: 'Questions added successfully', questions: savedQuestions });
        res.redirect('/admin/manage-courses')
    } catch (error) {
        console.error('Error in submitQuestion:', error);
        res.status(500).json({ error: 'An error occurred while submitting the questions' });
    }
};
