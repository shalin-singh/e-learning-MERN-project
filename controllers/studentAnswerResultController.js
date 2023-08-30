const Course = require('../models/Course');
const Result = require('../models/Result');


exports.answerQuestionsForm = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId).populate('examQuestions');

        if (!course) {
            req.flash('error', 'Invalid course.');
            return res.redirect('/student/dashboard');
        }

        res.render('student/answer-questions', { course });
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while loading the questions.');
        res.redirect('/student/dashboard');
    }
};

exports.answerQuestions = async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.student._id; // Assuming the student ID is available in the req object
        const answers = req.body.answers; // Assuming answers are submitted as an array of selected option indices

        const course = await Course.findById(courseId).populate('examQuestions');

        if (!course) {
            req.flash('error', 'Invalid course.');
            return res.redirect('/student/dashboard');
        }

        const score = calculateScore(course.examQuestions, answers);

        const result = new Result({
            student: userId,
            course: courseId,
            score: score,
            answers: answers.map((selectedOptionIndex, index) => ({
                question: course.examQuestions[index]._id,
                selectedOptionIndex: selectedOptionIndex,
            })),
        });

        await result.save();

        req.flash('success', `Your score is ${score}.`);
        res.redirect('/student/view-results');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while submitting the answers.');
        res.redirect('/student/dashboard');
    }
};

function calculateScore(questions, answers) {
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].correctOptionIndex === answers[i]) {
            score++;
        }
    }
    return score;
}

exports.viewResults = async (req, res) => {
    try {
        const userId = req.student._id; // Assuming the student ID is available in the req object
        const results = await Result.find({ student: userId }).populate('course', 'title');

        res.render('student/results', { results });
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while loading your results.');
        res.redirect('/student/dashboard');
    }
};