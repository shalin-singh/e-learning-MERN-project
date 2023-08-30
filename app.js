const db = require('./config/db')
const passport = require('./config/passport');
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/student');

const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
require('dotenv').config()



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('tiny'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const pathToPartials = path.join(__dirname, 'views', 'layouts');
app.set('partials', pathToPartials);


app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});

app.use('/admin', adminRoutes);
app.use('/student', userRoutes);
app.post('/submit-form', (req, res) => {
    const formData = req.body;

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // e.g., Gmail, Yahoo, etc.
        auth: {
            user: process.env.SENDMAIL,
            pass: process.env.SENDMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SENDMAIL,
        to: process.env.RECEIVINGMAIL,
        subject: 'New Form Submission',
        text: `
      Name: ${formData.name}
      Email: ${formData.email}
      Subject: ${formData.subject}
      Message: ${formData.message}
    `,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});

app.all('*', (req, res) => {
    res.render('error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
