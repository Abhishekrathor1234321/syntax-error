const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  return mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
  });
};

<<<<<<< HEAD
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

=======
>>>>>>> dev
module.exports = connectDB;