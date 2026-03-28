const express = require('express');
require('dotenv').config();
require('./Models/db');

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
    'https://syntax-error-9wonngxuv-abhishekrathor7447-3815s-projects.vercel.app'
  ],
  credentials: true
}));

app.use(bodyParser.json());

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
    console.log(`Server is running on ${PORT}`)
});