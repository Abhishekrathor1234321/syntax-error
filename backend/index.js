const express = require('express');
require('dotenv').config();
<<<<<<< HEAD
const connectDB = require('./Models/db'); // ← change
=======
>>>>>>> dev

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const UserRouter = require('./Routes/UserRouter');
const PaymentRouter = require('./Routes/PaymentRouter');
const AdminRouter = require('./Routes/AdminRouter');
const OtpRouter = require('./Routes/OtpRouter'); // ← upar le aao

const PORT = process.env.PORT || 8081;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'https://syntaxerrorr.com',
    'https://www.syntaxerrorr.com',
    'https://syntax-error-9wonngxuv-abhishekrathor7447-3815s-projects.vercel.app',
    'https://syntax-error-ecrj73l4k-abhishekrathor7447-3815s-projects.vercel.app'
  ],
  credentials: true
}));

app.use(bodyParser.json());

<<<<<<< HEAD
=======
// Connect DB on every request (Vercel serverless fix)
app.use(async (req, res, next) => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState >= 1) {
    return next();
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    console.log('MongoDB Connected...');
    next();
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

// Routes
>>>>>>> dev
app.get('/ping', (req, res) => {
  res.send('PONG');
});

// ← har request se pehle DB connect karo
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/user', UserRouter);
app.use('/payment', PaymentRouter);
app.use('/admin', AdminRouter);
app.use('/otp', OtpRouter);

app.listen(PORT, () => {
<<<<<<< HEAD
    console.log(`Server is running on ${PORT}`)
});
=======
  console.log(`Server is running on ${PORT}`);
});

module.exports = app;
>>>>>>> dev
