const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    refCode: { type: String, default: "" },
    downloadedNotes: [
        {
            title: String,
            category: String,
            downloadedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    purchasedCourses: [
        {
            title: String,
            amount: { type: Number, default: 0 },
            ref: { type: String, default: "" },
            purchasedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    // ✅ Purana field — safe hai, kuch change nahi kiya
    dsaChallenge: {
        enrolled: { type: Boolean, default: false },
        startDate: { type: Date, default: null },
        language: { type: String, default: "java" }
    },

    // ✅ Naya field — progress track karne ke liye
    challenge: {
        enrolled: { type: Boolean, default: false },
        enrolledAt: { type: Date, default: null },
        language: { type: String, default: "java" },
        unlockedDays: { type: Number, default: 0 },
        completedDays: [{ type: Number }],
        lastCompletedAt: { type: Date, default: null }
    }
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;