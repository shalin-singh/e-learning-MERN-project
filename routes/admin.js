const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { promisify } = require('util');
const cloudinary = require('../config/cloudinary');
const Material = require('../models/Material');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Result = require('../models/Result');
const Submission = require('../models/Submission');
const mongoose = require('mongoose');

// Controllers
const adminLoginController = require('../controllers/adminLoginController');
const adminDashboardController = require('../controllers/adminDashboardController');
const adminCourseController = require('../controllers/adminCourseController');
const adminStudentController = require('../controllers/adminStudentController');
const adminQuestionsController = require('../controllers/adminQuestionsController');
const adminEnrollmentController = require('../controllers/adminEnrollmentController');

// Routes
router.get('/login', adminLoginController.showLoginForm);
router.post('/login', adminLoginController.handleLogin);

// Admin authentication required for all routes below this middleware
router.use(ensureAuthenticated);
router.get('/dashboard', adminDashboardController.dashboard);

// Course Routes
router.get('/add-course', adminCourseController.addCourseForm);
router.post('/add-course', adminCourseController.addCourse);
router.get('/edit-course/:id', adminCourseController.editCourseForm);
router.post('/edit-course/:id', adminCourseController.editCourse);
router.post('/delete-course/:id', adminCourseController.deleteCourse);
router.get('/manage-courses', adminCourseController.manageCourses);

// Students Routes
router.get('/add-student', adminStudentController.addStudentForm);
router.post('/add-student', adminStudentController.addStudent);
router.get('/edit-student/:id', adminStudentController.editStudentForm);
router.post('/edit-student/:id', adminStudentController.editStudent);
router.post('/delete-student/:id', adminStudentController.deleteStudent);
router.get('/manage-students', adminStudentController.manageStudents);

// Questions Routes
router.get('/add-questions/:courseId', adminQuestionsController.addQuestionForm);
router.post('/add-questions', adminQuestionsController.addQuestion);


// Controller for rendering pending enrollment requests
router.get('/enrollment-requests', adminEnrollmentController.listEnrollmentRequests)
// Controller for approving or rejecting enrollment requests
router.post('/enrollment-requests/:requestId', adminEnrollmentController.manageEnrollmentRequest)


// Upload Materials Routes
router.get('/upload-materials', async (req, res) => {
    try {
        const courses = await Course.find({});
        res.render('admin/upload-materials', { courses });
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.render('admin/upload-materials', { errorMessages: ['Error fetching courses'] });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        cb(null, `file-${timestamp}${extension}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 40 * 1024 * 1024 }
});

router.post('/upload-materials', upload.single('file'), async (req, res) => {
    try {
        const { course, materialType, title, description } = req.body;
        const file = req.file;

        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto"
        });

        const newMaterial = new Material({
            course,
            materialType,
            title,
            description,
            cloudinaryUrl: result.secure_url,
            publicId: result.public_id
        });

        await newMaterial.save();

        req.flash('success', 'Material uploaded successfully');
        res.redirect('/admin/manage-materials');
    } catch (error) {
        console.error('Error uploading material:', error);
        req.flash('error', 'An error occurred while uploading the material.');
        res.redirect('/admin/manage-materials');
    }
});

router.get('/manage-materials', async (req, res) => {
    try {
        const materials = await Material.find().populate('course');

        res.render('admin/manage-materials', { materials });
    } catch (error) {
        console.error('Error fetching materials:', error);
        res.status(500).json({ message: 'An error occurred while fetching materials.' });
    }
});


// Delete Material Route
router.get('/delete-material/:id', async (req, res) => {
    try {
        const materialId = req.params.id;
        const material = await Material.findById(materialId);

        if (!material) {
            req.flash('error', 'Material not found.');
            return res.redirect('/admin/manage-materials');
        }

        // Delete the file from Cloudinary
        await cloudinary.uploader.destroy(material.publicId);

        await Material.deleteOne({ _id: materialId });

        req.flash('success', 'Material deleted successfully.');
        res.redirect('/admin/manage-materials');
    } catch (error) {
        console.error('Error deleting material:', error);
        req.flash('error', 'An error occurred while deleting the material.');
        res.redirect('/admin/manage-materials');
    }
});

// Edit Material Routes
router.get('/edit-material/:id', ensureAuthenticated, async (req, res) => {
    try {
        const materialId = req.params.id;
        const material = await Material.findById(materialId);

        if (!material) {
            req.flash('error', 'Material not found.');
            return res.redirect('/admin/manage-materials');
        }

        res.render('admin/edit-material', { material });
    } catch (error) {
        console.error('Error fetching material:', error);
        req.flash('error', 'Error fetching material.');
        res.redirect('/admin/manage-materials');
    }
});

router.post('/edit-material/:id', ensureAuthenticated, async (req, res) => {
    try {
        const materialId = req.params.id;
        const { course, materialType, title, description } = req.body;

        const updatedMaterial = await Material.findByIdAndUpdate(materialId, {
            course,
            materialType,
            title,
            description
        });

        req.flash('success', 'Material updated successfully.');
        res.redirect('/admin/manage-materials');
    } catch (error) {
        console.error('Error updating material:', error);
        req.flash('error', 'An error occurred while updating the material.');
        res.redirect('/admin/manage-materials');
    }
});


// Result Submission Route
router.post('/submit-marks', async (req, res) => {
    try {
        const { studentId, courseId, materialId, assignmentMarks } = req.body;

        const result = new Result({
            student: new mongoose.Types.ObjectId(studentId),
            course: new mongoose.Types.ObjectId(courseId),
            material: new mongoose.Types.ObjectId(materialId),
            score: assignmentMarks,
        });

        await result.save();

        req.flash("success", "Marks submitted successfully.");
        res.redirect("/admin/view-results");
    } catch (error) {
        console.error('Error submitting marks:', error);
        res.status(500).json({ message: 'An error occurred while submitting marks.' });
    }
});

// View Results Route
router.get('/view-results', async (req, res) => {
    try {
        const results = await Result.find()
            .populate('student')
            .populate('course')
            .populate('material')
            .populate('answers.question');

        res.render('admin/view-results', { results });
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ message: 'An error occurred while fetching results.' });
    }
});


// Route to render the form
router.get('/assign-course/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const student = await Student.findById(studentId);
        const courses = await Course.find();

        res.render('admin/assign-course', { student, courses });
    } catch (error) {
        console.error('Error rendering assign course form:', error);
        res.status(500).json({ message: 'An error occurred while rendering the form.' });
    }
});


router.get('/view-submissions', async (req, res) => {
    try {
        const submissions = await Submission.find()
            .populate('userId')
            .populate('courseId')   // Populate the course reference using courseId
            .populate('materialId'); // Populate the material reference using materialId

        res.render('admin/view-submissions', { submissions });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ message: 'An error occurred while fetching submissions.' });
    }
});


// Route to handle the form submission
router.post('/assign-course/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const { courseId } = req.body;

        const student = await Student.findById(studentId);
        const course = await Course.findById(courseId);

        if (student && course) {
            student.enrolledCourses.push(courseId);
            await student.save();
            req.flash('success', 'Course assigned successfully.');
        } else {
            req.flash('error', 'Student or course not found.');
        }

        res.redirect('/admin/manage-students'); // Change the redirect URL as needed
    } catch (error) {
        console.error('Error assigning course to student:', error);
        req.flash('error', 'An error occurred while assigning the course.');
        res.redirect('/admin/manage-students'); // Change the redirect URL as needed
    }
});





router.get('/logout', adminLoginController.logout);

module.exports = router;
