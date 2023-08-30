// const path = require('path');
// const multer = require('multer'); // For handling file uploads
// const { promisify } = require('util');
// const { validationResult } = require('express-validator');
// const fs = require('fs/promises'); // Import the promises version of fs
// const Course = require('../models/Course');
// const Material = require('../models/Material'); // Import your Material model


// exports.showUploadForm = async (req, res) => {
//     try {
//         const courses = await Course.find({});
//         console.log("Course Fetched:", courses);
//         res.render('admin/upload-materials', { courses });
//     } catch (err) {
//         console.error('Error fetching courses:', err);
//         res.render('admin/upload-materials', { errorMessages: ['Error fetching courses'] });
//     }
// };


// // Configure multer storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Uploads will be saved to the 'uploads' folder
//     },
//     filename: (req, file, cb) => {
//         const timestamp = Date.now();
//         const extension = path.extname(file.originalname);
//         cb(null, `file-${timestamp}${extension}`);
//     }
// });

// const upload = multer({ storage });

// exports.uploadMaterials = upload.single('file'), async (req, res) => {
//     try {
//         const { course, materialType, title, description } = req.body;
//         const file = req.file;

//         // Create a new Material instance and save it to the database
//         const newMaterial = new Material({
//             course,
//             materialType,
//             title,
//             description,
//             filePath: file.path // Save the file path in the Material schema
//         });

//         await newMaterial.save();

//         res.status(200).json({ message: 'Material uploaded successfully.' });
//     } catch (error) {
//         console.error('Error uploading material:', error);
//         res.status(500).json({ message: 'An error occurred while uploading the material.' });
//     }
// };
