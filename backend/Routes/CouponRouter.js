const express = require('express');
const router = express.Router();
const CouponModel = require('../Models/Coupon');
const ensureAuthenticated = require('../Middlewares/Auth');

const isAdmin = (req, res, next) => {
    const adminEmails = ['abhishekrathor7447@gmail.com'];
    if (!adminEmails.includes(req.user.email)) {
        return res.status(403).json({ success: false, message: 'Admin access required!' });
    }
    next();
};

// ================= ADMIN ROUTES =================

// ✅ Create new coupon
router.post('/', ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        const {
            code,
            discountType,
            discountValue,
            maxDiscountAmount,
            minPurchaseAmount,
            applicableTo,
            courseTitles,
            usageLimit,
            perUserLimit,
            expiryDate,
        } = req.body;

        if (!code || !discountType || !discountValue || !expiryDate) {
            return res.status(400).json({
                success: false,
                message: 'code, discountType, discountValue aur expiryDate zaroori hain',
            });
        }

        const existing = await CouponModel.findOne({ code: code.toUpperCase() });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Ye coupon code pehle se maujood hai' });
        }

        const coupon = await CouponModel.create({
            code: code.toUpperCase(),
            discountType,
            discountValue,
            maxDiscountAmount: maxDiscountAmount || null,
            minPurchaseAmount: minPurchaseAmount || 0,
            applicableTo: applicableTo || 'all',
            courseTitles: applicableTo === 'specific' ? courseTitles : [],
            usageLimit: usageLimit || null,
            perUserLimit: perUserLimit || 1,
            expiryDate,
        });

        res.status(201).json({ success: true, coupon });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ✅ Get all coupons
router.get('/', ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        const coupons = await CouponModel.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, coupons });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ✅ Get single coupon
router.get('/:id', ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        const coupon = await CouponModel.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon nahi mila' });
        }
        res.status(200).json({ success: true, coupon });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ✅ Update coupon
router.put('/:id', ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        if (req.body.code) req.body.code = req.body.code.toUpperCase();

        const coupon = await CouponModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon nahi mila' });
        }

        res.status(200).json({ success: true, coupon });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ✅ Delete coupon
router.delete('/:id', ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        const coupon = await CouponModel.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon nahi mila' });
        }
        res.status(200).json({ success: true, message: 'Coupon delete ho gaya' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ✅ Toggle active/inactive (delete kiye bina turant band/chalu karne ke liye)
router.patch('/:id/toggle', ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        const coupon = await CouponModel.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon nahi mila' });
        }
        coupon.isActive = !coupon.isActive;
        await coupon.save();
        res.status(200).json({ success: true, coupon });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ================= USER (CHECKOUT) ROUTE =================

// ✅ Validate & apply coupon before payment
// body: { code, courseTitle, coursePrice }
router.post('/apply', ensureAuthenticated, async (req, res) => {
    try {
        const { code, courseTitle, coursePrice } = req.body;
        const userEmail = req.user.email;

        if (!code || !courseTitle || coursePrice === undefined) {
            return res.status(400).json({
                success: false,
                message: 'code, courseTitle aur coursePrice zaroori hain',
            });
        }

        const coupon = await CouponModel.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid coupon code' });
        }
        if (!coupon.isActive) {
            return res.status(400).json({ success: false, message: 'Ye coupon abhi active nahi hai' });
        }
        if (new Date() > new Date(coupon.expiryDate)) {
            return res.status(400).json({ success: false, message: 'Coupon expire ho chuka hai' });
        }

        if (coupon.applicableTo === 'specific' && !coupon.courseTitles.includes(courseTitle)) {
            return res.status(400).json({ success: false, message: 'Ye coupon is course par apply nahi hota' });
        }

        if (coursePrice < coupon.minPurchaseAmount) {
            return res.status(400).json({
                success: false,
                message: `Ye coupon minimum ₹${coupon.minPurchaseAmount} ki purchase par hi lagega`,
            });
        }

        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ success: false, message: 'Coupon ki usage limit khatam ho chuki hai' });
        }

        const userUsage = coupon.usedBy.find((u) => u.email === userEmail);
        if (userUsage && userUsage.count >= coupon.perUserLimit) {
            return res.status(400).json({ success: false, message: 'Aap is coupon ko already use kar chuke hain' });
        }

        let discountAmount =
            coupon.discountType === 'percentage'
                ? (coursePrice * coupon.discountValue) / 100
                : coupon.discountValue;

        if (coupon.discountType === 'percentage' && coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
            discountAmount = coupon.maxDiscountAmount;
        }
        if (discountAmount > coursePrice) discountAmount = coursePrice;

        const finalPrice = Math.round((coursePrice - discountAmount) * 100) / 100;

        res.status(200).json({
            success: true,
            message: 'Coupon apply ho gaya',
            code: coupon.code,
            discountAmount,
            originalPrice: coursePrice,
            finalPrice,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;

// -----------------------------------------------------------------
// Payment SUCCESS hone ke baad, apne PaymentRouter.js me is function ko
// call karein taaki usage count update ho jaaye (nahi to user isi coupon
// ko baar-baar use kar payega):
//
//   const CouponModel = require('../Models/Coupon');
//
//   async function markCouponUsed(code, email) {
//       const coupon = await CouponModel.findOne({ code: code.toUpperCase() });
//       if (!coupon) return;
//       coupon.usedCount += 1;
//       const u = coupon.usedBy.find((x) => x.email === email);
//       if (u) u.count += 1;
//       else coupon.usedBy.push({ email, count: 1 });
//       await coupon.save();
//   }
//
// Payment success wale route me, jahan aap purchasedCourses push karte hain,
// wahin pe agar coupon use hua tha to markCouponUsed(couponCode, req.user.email)
// call kar dein.
// -----------------------------------------------------------------