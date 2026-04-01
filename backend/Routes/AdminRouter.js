const express = require('express');
const router = express.Router();
const UserModel = require('../Models/User');
const ensureAuthenticated = require('../Middlewares/Auth');

const isAdmin = (req, res, next) => {
    const adminEmails = ['abhishekrathor7447@gmail.com'];
    if (!adminEmails.includes(req.user.email)) {
        return res.status(403).json({ success: false, message: 'Admin access required!' });
    }
    next();
};

router.get('/purchases', ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        const users = await UserModel.find({ 
            'purchasedCourses.0': { $exists: true } 
        }).select('name email purchasedCourses');

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
        const users = await UserModel.find({ 
            'purchasedCourses.0': { $exists: true } 
        }).select('purchasedCourses');

        const refStats = {};
        users.forEach(user => {
            user.purchasedCourses.forEach(course => {
                const ref = course.ref;
                if (!ref || ref === "") return;
                if (!refStats[ref]) refStats[ref] = { count: 0 };
                refStats[ref].count++;
            });
        });

        const refs = Object.entries(refStats)
            .map(([_id, data]) => ({ _id, count: data.count }))
            .sort((a, b) => b.count - a.count);

        res.status(200).json({ success: true, refs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;