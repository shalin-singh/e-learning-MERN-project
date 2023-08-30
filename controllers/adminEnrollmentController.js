const EnrollmentRequest = require('../models/EnrollmentRequest');
const Course = require('../models/Course');

exports.listEnrollmentRequests = async (req, res) => {
    try {
        console.log('Fetching pending enrollment requests...');
        const pendingRequests = await EnrollmentRequest.find({ status: 'pending' })
            .populate('studentId')
            .populate('courseId');

        console.log('Rendering enrollment-requests view... :', pendingRequests);
        res.render('admin/enrollment-requests', { pendingRequests });
    } catch (error) {
        console.error('Error fetching enrollment requests:', error);
        res.status(500).send('An error occurred while fetching enrollment requests.');
    }
};

async function approveEnrollment(enrollmentRequest) {
    try {
        enrollmentRequest.status = 'approved';
        await enrollmentRequest.save();

        // Check if studentId is properly populated and has the enrolledCourses property
        if (enrollmentRequest.studentId && enrollmentRequest.studentId.enrolledCourses) {
            enrollmentRequest.studentId.enrolledCourses.push(enrollmentRequest.courseId);
            await enrollmentRequest.studentId.save();
            console.log('Enrollment approved and course added to student.');
        } else {
            console.error('Student ID or enrolledCourses is missing or not properly populated.');
            console.log('Student ID:', enrollmentRequest.studentId);
        }
    } catch (error) {
        console.error('Error approving enrollment:', error);
    }
}


async function rejectEnrollment(enrollmentRequest) {
    try {
        enrollmentRequest.status = 'rejected';
        await enrollmentRequest.save();
        console.log('Enrollment rejected.');
    } catch (error) {
        console.error('Error rejecting enrollment:', error);
    }
}

exports.manageEnrollmentRequest = async (req, res) => {
    const { requestId } = req.params;
    const { action } = req.body;

    try {
        console.log(`Managing enrollment request with ID: ${requestId}`);
        const enrollmentRequest = await EnrollmentRequest.findById(requestId).populate('studentId');

        if (!enrollmentRequest) {
            console.log('Enrollment request not found.');
            return res.status(404).send('Enrollment request not found.');
        }

        if (action === 'approve') {
            console.log('Approving enrollment request...');
            await approveEnrollment(enrollmentRequest);
        } else if (action === 'reject') {
            console.log('Rejecting enrollment request...');
            await rejectEnrollment(enrollmentRequest);
        }

        console.log('Redirecting to /admin/enrollment-requests');
        res.redirect('/admin/enrollment-requests');
    } catch (error) {
        console.error('Error managing enrollment request:', error);
        res.status(500).send('An error occurred while managing enrollment request.');
    }
};

