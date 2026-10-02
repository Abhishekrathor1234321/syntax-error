const express = require('express');
require('dotenv').config();
const connectDB = require('./Models/db'); // ← change

const CouponRouter = require('./Routes/CouponRouter');

const TcsRouter = require('./Routes/TcsRouter');
const CodingRouter = require('./Routes/CodingRouter');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const UserRouter = require('./Routes/UserRouter');
const PaymentRouter = require('./Routes/PaymentRouter');
const AdminRouter = require('./Routes/AdminRouter');
const OtpRouter = require('./Routes/OtpRouter'); // ← upar le aao


const challengeRoutes = require('./Routes/ChallengeRouter');
app.use('/challenge', challengeRoutes);
const PORT = process.env.PORT || 8081;

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

app.get('/ping', (req, res) => {
    res.send('PONG');
});

// ← har request se pehle DB connect karo
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("❌ Database middleware error:", err.message);

        return res.status(503).json({
            success: false,
            message: "Database connection unavailable",
        });
    }
});

app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/user', UserRouter);
app.use('/payment', PaymentRouter);
app.use('/admin', AdminRouter);
app.use('/otp', OtpRouter);
app.use('/coupons', CouponRouter);

app.use('/tcs', TcsRouter);
app.use('/coding', CodingRouter);

// Start server only after MongoDB connection is ready
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Server startup failed:", err.message);
    }
};

startServer();