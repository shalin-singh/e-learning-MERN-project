const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const studentLoginDashboardController = require('../controllers/studentLoginDashboardController');
const studentCourseController = require('../controllers/studentCourseController');
const studentViewMaterialController = require('../controllers/studentViewMaterialController');
const EnrollmentRequest = require('../models/EnrollmentRequest');
const Course = require('../models/Course');
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const Result = require('../models/Result');
const Material = require('../models/Material');

router.get('/login', studentLoginDashboardController.showLoginForm);
router.post('/login', studentLoginDashboardController.handleLogin);
router.get('/register', studentLoginDashboardController.showRegisterForm);
router.post('/register', studentLoginDashboardController.handleRegistration);

router.use(ensureAuthenticated);
router.get('/dashboard', studentLoginDashboardController.dashboard);

router.get('/view-courses', studentCourseController.viewCourses);
router.get('/enroll/:courseId', studentCourseController.createEnrollmentRequest);

router.get('/enrolled-courses', studentViewMaterialController.viewEnrolledCourses);
router.get('/enrolled-courses/:courseId/materials', studentViewMaterialController.viewCourseMaterials);

router.post('/request', async (req, res) => {
    const { courseId } = req.body;
    const studentId = req.user._id; // Assuming you have authentication in place
    try {
        const enrollmentRequest = new EnrollmentRequest({ studentId, courseId });
        await enrollmentRequest.save();
        res.redirect('/student/view-courses');
    } catch (error) {
        console.error('Error creating enrollment request:', error);
        res.render('error', { error }); // Render an error page
    }
});


router.get('/quiz/:materialId', async (req, res) => {
    try {
        const userId = req.user;
        const materialId = req.params.materialId;

        const questions = await Question.find({ material: materialId }).populate('material');

        if (!questions || questions.length === 0) {
            return res.status(404).send('No quiz questions found for this material.');
        }

        const courseId = questions[0].material.course; // Access the course property from the first question's material

        console.log("Questions:", questions);
        res.render('student/quiz', { questions, courseId, userId });
    } catch (error) {
        res.status(500).send('An error occurred while fetching quiz questions.');
        console.error("Error occurred:", error);
    }
});


router.post('/quiz/submit/:materialId', async (req, res) => {
    const materialId = req.params.materialId;
    const answers = req.body;
    const studentId = req.user._id;

    try {
        const questions = await Question.find({ material: materialId });

        let score = 0;
        const results = [];

        questions.forEach((question) => {
            const questionId = question._id.toString();
            const userAnswer = answers[questionId];

            if (userAnswer && userAnswer === question.answer) {
                score++;
            }

            results.push({
                question: question._id,
                selectedOptionIndex: userAnswer,
            });
        });

        const totalQuestions = questions.length;
        const finalScore = (score / totalQuestions) * 100;

        const roundedScore = isNaN(finalScore) ? 0 : Math.round(finalScore * 100) / 100; // Handle NaN case

        const result = new Result({
            student: studentId,
            material: materialId,
            answers: results,
        });

        await result.save();

        res.render('student/quiz-results', { finalScore: roundedScore, results });
    } catch (error) {
        console.error('Error processing quiz:', error);
        res.render('error')
    }
});





router.post('/submit-assignment', async (req, res) => {
    try {
        const { materialId, courseId, userId, assignmentAnswer } = req.body;
        const existingSubmission = await Submission.findOne({ userId, materialId });

        if (existingSubmission) {
            req.flash('error', 'You have already submitted an assignment for this material.');
            return res.redirect('/student/enrolled-courses');
        }

        const submission = new Submission({
            materialId,
            courseId,
            userId,
            assignmentAnswer,
            submittedAt: new Date(),
        });

        await submission.save();
        req.flash('success', 'Assignment submitted successfully.');
        res.redirect('/student/enrolled-courses');
    } catch (error) {
        console.error('Error submitting assignment:', error);
        req.flash('error', 'An error occurred while submitting the assignment.');
        res.redirect('/student/enrolled-courses');
    }
});

router.get('/view-results/:studentId', async (req, res) => {
    try {
        const user = req.user;
        const studentId = req.params.studentId;
        const results = await Result.find({ student: studentId })
            .populate('student')
            .populate('course')
            .populate('material')
            .populate('answers.question');

        console.log("resul is :", results);
        res.render('student/view-results', { results, user });
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ message: 'An error occurred while fetching results.' });
    }
});

router.get('/logout', studentLoginDashboardController.logout);

module.exports = router;
