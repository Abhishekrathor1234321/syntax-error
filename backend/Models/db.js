const mongoose = require("mongoose");

const connectDB = async () => {
    console.log(
        "🔍 DB connect called. State:",
        mongoose.connection.readyState
    );

    // Already connected
    if (mongoose.connection.readyState === 1) {
        console.log("✅ MongoDB already connected");
        return;
    }

    // Connection is currently being established
    if (mongoose.connection.readyState === 2) {
        console.log("⏳ MongoDB connection already in progress...");
        return mongoose.connection.asPromise();
    }

    // Not connected — create connection
    try {
        console.log("🔌 Trying MongoDB connection...");

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
        });

        console.log("✅ MongoDB connected");
    } catch (error) {
        console.error(
            "❌ MongoDB connection error:",
            error.message
        );

        throw error;
    }
};

module.exports = connectDB;