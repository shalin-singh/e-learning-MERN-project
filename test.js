const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin'); // Update the path to your Admin model

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const adminData = [
    {
        username: 'admin1',
        password: bcrypt.hashSync('password123', bcrypt.genSaltSync(10)),
    },
    {
        username: 'admin2',
        password: bcrypt.hashSync('secure456', bcrypt.genSaltSync(10)),
    },
];

async function seedAdminData() {
    try {
        // Clear existing data
        await Admin.deleteMany({});

        // Insert test data
        await Admin.insertMany(adminData);

        console.log('Test admin data has been inserted successfully.');
    } catch (error) {
        console.error('Error seeding admin data:', error);
    } finally {
        // Close the connection after seeding
        mongoose.connection.close();
    }
}

seedAdminData();
