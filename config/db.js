const mongoose = require('mongoose');
require('dotenv').config({ path: '../config/.env'});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
};

module.exports = connectDB;
