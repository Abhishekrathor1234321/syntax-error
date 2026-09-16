const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const ensureAuthenticated = require('../Middlewares/Auth');
const UserModel = require('../Models/User');
const CouponModel = require('../Models/Coupon');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Coupon validate karke discount amount nikalne wala helper
// (security ke liye ye SERVER par hota hai, frontend par nahi — taaki koi tamper na kar sake)
async function validateAndApplyCoupon(couponCode, courseTitle, originalAmount, userEmail) {
    const coupon = await CouponModel.findOne({ code: couponCode.toUpperCase() });

    if (!coupon) throw new Error('Invalid coupon code');
    if (!coupon.isActive) throw new Error('Ye coupon abhi active nahi hai');
    if (new Date() > new Date(coupon.expiryDate)) throw new Error('Coupon expire ho chuka hai');

    if (coupon.applicableTo === 'specific' && !coupon.courseTitles.includes(courseTitle)) {
        throw new Error('Ye coupon is course par apply nahi hota');
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        throw new Error('Coupon ki usage limit khatam ho chuki hai');
    }

    const userUsage = coupon.usedBy.find((u) => u.email === userEmail);
    if (userUsage && userUsage.count >= coupon.perUserLimit) {
        throw new Error('Aap is coupon ko already use kar chuke hain');
    }

    let discountAmount = (originalAmount * coupon.discountValue) / 100;
    if (discountAmount > originalAmount) discountAmount = originalAmount;

    const finalAmount = Math.round((originalAmount - discountAmount) * 100) / 100;

    return { finalAmount, discountAmount, couponCode: coupon.code };
}

// Payment success hone ke baad coupon ka usage count badhana
async function markCouponUsed(couponCode, userEmail) {
    const coupon = await CouponModel.findOne({ code: couponCode.toUpperCase() });
    if (!coupon) return;

    coupon.usedCount += 1;
    const userUsage = coupon.usedBy.find((u) => u.email === userEmail);
    if (userUsage) {
        userUsage.count += 1;
    } else {
        coupon.usedBy.push({ email: userEmail, count: 1 });
    }
    await coupon.save();
}

// Order create karo
router.post('/create-order', ensureAuthenticated, async (req, res) => {
    try {
        const { amount, courseTitle, couponCode } = req.body; // amount = original course price

        let finalAmount = amount;
        let discountAmount = 0;
        let appliedCoupon = null;

        if (couponCode) {
            try {
                const result = await validateAndApplyCoupon(couponCode, courseTitle, amount, req.user.email);
                finalAmount = result.finalAmount;
                discountAmount = result.discountAmount;
                appliedCoupon = result.couponCode;
            } catch (couponErr) {
                return res.status(400).json({ success: false, message: couponErr.message });
            }
        }

        const options = {
            amount: Math.round(finalAmount * 100), // Paise mein
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order,
            finalAmount,
            discountAmount,
            appliedCoupon,
        });
    } catch (err) {
      console.error("create-order error:", err);
const message = err?.error?.description || err.message || "An error occurred while creating the order";
res.status(500).json({ success: false, message });
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
            amount, // ← ye ab FINAL (discounted) amount hoga
            ref,
            couponCode, // ← agar coupon use hua tha
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
                        amount: amount || 0,
                        ref: ref || "",
                        purchasedAt: new Date()
                    }
                }
            });

            // Agar coupon use hua tha, to usage count badhao
            if (couponCode) {
                await markCouponUsed(couponCode, req.user.email);
            }

            res.status(200).json({ success: true, message: "Payment verified!" });
        } else {
            res.status(400).json({ success: false, message: "Payment verification failed!" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;