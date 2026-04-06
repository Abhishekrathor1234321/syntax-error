const express = require('express');
const router = express.Router();
const UserModel = require('../Models/User');
const ensureAuthenticated = require('../Middlewares/Auth');

// ✅ Challenge enroll — Day 1 start karo (PURANA CODE — safe hai)
router.post('/start', ensureAuthenticated, async (req, res) => {
    try {
        const { language } = req.body;
        const user = await UserModel.findById(req.user._id);

        // Pehle se enrolled hai to wahi startDate rakho
        if (user.dsaChallenge && user.dsaChallenge.enrolled) {
            return res.status(200).json({
                success: true,
                message: 'Already enrolled',
                startDate: user.dsaChallenge.startDate,
                language: user.dsaChallenge.language
            });
        }

        // Naya enroll
        await UserModel.findByIdAndUpdate(req.user._id, {
            dsaChallenge: {
                enrolled: true,
                startDate: new Date(),
                language: language || "java"
            }
        });

        res.status(200).json({
            success: true,
            message: 'Challenge started!',
            startDate: new Date(),
            language: language || "java"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ✅ Challenge progress fetch karo — konsa day unlock hai (PURANA CODE — safe hai)
router.get('/progress', ensureAuthenticated, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id).select('dsaChallenge challenge');

        if (!user.dsaChallenge || !user.dsaChallenge.enrolled) {
            return res.status(200).json({
                success: true,
                enrolled: false,
                unlockedDays: 0,
                completedDays: []
            });
        }

        const startDate = new Date(user.dsaChallenge.startDate);
        const today = new Date();

        // Subah 7 baje ke baad next day unlock hoga
        const startAt7 = new Date(startDate);
        startAt7.setHours(7, 0, 0, 0);

        // Kitne din ho gaye enroll kiye — 7AM ke baad count karo
        const msPerDay = 24 * 60 * 60 * 1000;
        const diffMs = today - startAt7;
        const daysPassed = Math.floor(diffMs / msPerDay);

        // Day 1 hamesha open, phir +1 har din
        const unlockedDays = Math.min(daysPassed + 1, 30);

        res.status(200).json({
            success: true,
            enrolled: true,
            unlockedDays,
            completedDays: user.challenge?.completedDays || [],
            startDate: user.dsaChallenge.startDate,
            language: user.dsaChallenge.language
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ✅ NAYA — Day complete mark karo (next day time-based unlock hoga automatically)
router.post('/complete-day', ensureAuthenticated, async (req, res) => {
    try {
        const { day } = req.body;
        if (!day || day < 1 || day > 30) {
            return res.status(400).json({ success: false, message: 'Invalid day' });
        }

        const user = await UserModel.findById(req.user._id);
        if (!user.dsaChallenge || !user.dsaChallenge.enrolled) {
            return res.status(400).json({ success: false, message: 'Not enrolled in challenge' });
        }

        const completedDays = user.challenge?.completedDays || [];
        if (!completedDays.includes(day)) {
            completedDays.push(day);
        }

        await UserModel.findByIdAndUpdate(req.user._id, {
            'challenge.completedDays': completedDays,
            'challenge.lastCompletedAt': new Date()
        });

        res.status(200).json({
            success: true,
            message: `Day ${day} completed!`,
            completedDays
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ✅ NAYA — Leaderboard — saare enrolled students ki ranking
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await UserModel.find(
            { 'dsaChallenge.enrolled': true },
            { name: 1, 'challenge.completedDays': 1, 'dsaChallenge.startDate': 1 }
        );

        const leaderboard = users
            .map(u => ({
                name: u.name,
                completedDays: (u.challenge?.completedDays || []).length,
                enrolledAt: u.dsaChallenge?.startDate
            }))
            .sort((a, b) => b.completedDays - a.completedDays || new Date(a.enrolledAt) - new Date(b.enrolledAt))
            .slice(0, 50);

        res.status(200).json({
            success: true,
            leaderboard,
            totalStudents: users.length
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;