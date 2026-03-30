const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const UserRouter = require('./Routes/UserRouter');
const PaymentRouter = require('./Routes/PaymentRouter');
const AdminRouter = require('./Routes/AdminRouter');

const PORT = process.env.PORT || 8081;

// CORS
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
app.get('/ping', (req, res) => {
  res.send('PONG');
});

app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/user', UserRouter);
app.use('/payment', PaymentRouter);
app.use('/admin', AdminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

module.exports = app;