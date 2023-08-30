const { validationResult } = require('express-validator');
const { promisify } = require('util');
const passport = require('passport');


// Display the admin login form
exports.showLoginForm = (req, res) => {
    res.render('admin/login', { message: req.flash('error') });
};

// Handle admin login form submission using Passport.js
exports.handleLogin = passport.authenticate('admin-local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    failureFlash: true
});


exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            // Handle error if any
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.redirect('/');
        req.flash('success', 'You have been successfully logged out.');
    });

};