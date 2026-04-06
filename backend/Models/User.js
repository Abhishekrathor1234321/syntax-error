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
    // ✅ 30 Days DSA Challenge
    dsaChallenge: {
        enrolled: { type: Boolean, default: false },
        startDate: { type: Date, default: null },
        language: { type: String, default: "java" }
    }
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;