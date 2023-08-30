const mongoose = require('mongoose');
require('dotenv').config()
const dbURL = process.env.MONGODB_URL;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(dbURL, options)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

module.exports = mongoose