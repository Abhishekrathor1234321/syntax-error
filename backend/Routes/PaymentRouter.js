const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const ensureAuthenticated = require('../Middlewares/Auth');
const UserModel = require('../Models/User');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Order create karo
router.post('/create-order', ensureAuthenticated, async (req, res) => {
    try {
        const { amount, courseTitle } = req.body;
        const options = {
            amount: amount * 100, // Paise mein
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Payment verify karo
router.post('/verify-payment', ensureAuthenticated, async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature, 
            courseTitle,
            amount  // ← Frontend se amount lo
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            await UserModel.findByIdAndUpdate(req.user._id, {
                $push: {
                    purchasedCourses: {
                        title: courseTitle,
                        amount: amount || 0, // ← Actual amount save karo
                        purchasedAt: new Date()
                    }
                }
            });
            res.status(200).json({ success: true, message: "Payment verified!" });
        } else {
            res.status(400).json({ success: false, message: "Payment verification failed!" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;