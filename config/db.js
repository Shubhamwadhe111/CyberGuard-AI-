const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.warn('Warning: MONGO_URI is not defined in .env. Skipping MongoDB connection. Application will run with mock data or limited functionality.');
            return;
        }
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.warn('Continuing without MongoDB...');
    }
};

module.exports = connectDB;
