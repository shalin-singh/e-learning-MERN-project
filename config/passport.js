const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Student = require('../models/Student');
const Admin = require('../models/Admin'); // Import the Admin model
const bcrypt = require('bcrypt');

passport.use('student-local', new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done) => {
    try {
        const student = await Student.findOne({ email });

        if (!student) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        const passwordsMatch = await bcrypt.compare(password, student.password);

        if (!passwordsMatch) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        return done(null, student);
    } catch (err) {
        return done(err);
    }
}));

passport.use('admin-local', new LocalStrategy({
    usernameField: 'username',
}, async (username, password, done) => {
    try {
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }

        const passwordsMatch = await admin.validPassword(password);

        if (!passwordsMatch) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }

        return done(null, admin);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((student, done) => {
    done(null, student.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const admin = await Admin.findById(id);
        if (admin) {
            return done(null, admin);
        } else {
            const student = await Student.findById(id);
            return done(null, student);
        }
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
