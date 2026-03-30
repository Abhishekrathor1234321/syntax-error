const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('MongoDB Connected...');
  } catch (err) {
    console.log('MongoDB Connection Error: ', err);
    isConnected = false;
  }
};

connectDB();

module.exports = mongoose;