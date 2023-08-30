// Assuming you have a route like '/student/assignments/:assignmentId'
exports.viewAssignment = async (req, res) => {
    try {
        const assignmentId = req.params.assignmentId;
        const assignment = await Assignment.findById(assignmentId).populate('questions');

        // Check if the student has already submitted the assignment
        const studentId = req.user._id; // Assuming you have authenticated user
        const submission = assignment.submissions.find(sub => sub.student.toString() === studentId.toString());

        res.render('student/view-assignment', { assignment, submission });
    } catch (error) {
        console.error('Error in viewAssignment:', error);
        res.status(500).send('An error occurred.');
    }
};

exports.submitAssignment = async (req, res) => {
    try {
        const assignmentId = req.params.assignmentId;
        const studentId = req.user._id;
        const fileUrl = req.file ? req.file.path : null; // Assuming file upload middleware

        const submission = {
            student: studentId,
            submittedAt: new Date(),
            fileUrl,
        };

        await Assignment.findByIdAndUpdate(
            assignmentId,
            { $addToSet: { submissions: submission } },
            { new: true }
        );

        res.redirect(`/student/assignments/${assignmentId}`);
    } catch (error) {
        console.error('Error in submitAssignment:', error);
        res.status(500).send('An error occurred.');
    }
};
