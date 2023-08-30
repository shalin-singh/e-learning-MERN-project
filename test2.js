const mongoose = require('mongoose');
const Student = require('./models/Student');

// Connect to your MongoDB database
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create a new student instance with test data
const testStudent = new Student({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'test123', // The password will be hashed automatically
    enrolledCourses: [] // Populate this array with course ObjectIDs if needed
});

// Save the test student to the database
testStudent.save()
    .then(() => {
        console.log('Test student data created successfully');
    })
    .catch(error => {
        console.error('Error creating test student data:', error);
    })
    .finally(() => {
        // Close the database connection
        mongoose.connection.close();
    });
