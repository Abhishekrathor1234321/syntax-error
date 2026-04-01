const express = require('express');
const router = express.Router();
const UserModel = require('../Models/User');
const ensureAuthenticated = require('../Middlewares/Auth');

// Admin check middleware
const isAdmin = (req, res, next) => {
    const adminEmails = ['abhishekrathor7447@gmail.com']; // Tumhari email
    if (!adminEmails.includes(req.user.email)) {
        return res.status(403).json({ success: false, message: 'Admin access required!' });
    }
    next();
};

// Saare purchases dekho
router.get('/purchases', ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        const users = await UserModel.find({ 
            'purchasedCourses.0': { $exists: true } 
        }).select('name email purchasedCourses');

        // Stats banao
        const courseStats = {};
        users.forEach(user => {
            user.purchasedCourses.forEach(course => {
                if (!courseStats[course.title]) {
                    courseStats[course.title] = {
                        title: course.title,
                        totalPurchases: 0,
                        buyers: []
                    };
                }
                courseStats[course.title].totalPurchases++;
                courseStats[course.title].buyers.push({
                    name: user.name,
                    email: user.email,
                     amount: course.amount || 0,
                    purchasedAt: course.purchasedAt
                });
            });
        });

        res.status(200).json({ 
            success: true, 
            stats: Object.values(courseStats),
            totalUsers: await UserModel.countDocuments(),
            totalPurchases: users.reduce((acc, u) => acc + u.purchasedCourses.length, 0)
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


router.get('/ref-stats', ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        const refs = await UserModel.aggregate([
            { $match: { refCode: { $ne: "" } } },
            { $group: { _id: "$refCode", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.status(200).json({ success: true, refs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;