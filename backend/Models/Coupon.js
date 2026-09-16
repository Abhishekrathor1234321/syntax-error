const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },

        // "percentage" -> jaise 20% off | "flat" -> jaise ₹200 off
        discountType: {
            type: String,
            enum: ['percentage', 'flat'],
            required: true,
        },

        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },

        // agar percentage hai to max cap (optional)
        maxDiscountAmount: {
            type: Number,
            default: null,
        },

        minPurchaseAmount: {
            type: Number,
            default: 0,
        },

        // "all" -> sabhi courses par | "specific" -> sirf niche di list par
        applicableTo: {
            type: String,
            enum: ['all', 'specific'],
            default: 'all',
        },

        // Course ka koi separate model nahi hai, isliye title (string) se match karenge
        // e.g. "DSA Course", "TCS 2026 Course" — jo purchasedCourses.title me store hota hai
        courseTitles: [
            {
                type: String,
            },
        ],

        usageLimit: {
            type: Number,
            default: null, // null = unlimited
        },
        usedCount: {
            type: Number,
            default: 0,
        },

        perUserLimit: {
            type: Number,
            default: 1,
        },
        usedBy: [
            {
                email: { type: String },
                count: { type: Number, default: 1 },
            },
        ],

        expiryDate: {
            type: Date,
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);