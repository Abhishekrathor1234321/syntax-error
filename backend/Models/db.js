const mongoose = require('mongoose');
require('dotenv').config();

const mongo_url = process.env.MONGO_URI;

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(mongo_url, {
            serverSelectionTimeoutMS: 10000,
            bufferCommands: false,
        });
        isConnected = true;
        console.log('MongoDB Connected...');
    } catch (err) {
        console.log('MongoDB Connection Error: ', err);
    }
};

module.exports = connectDB;