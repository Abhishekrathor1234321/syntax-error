const express = require('express');
const router = express.Router();
const UserModel = require('../Models/User');
const ensureAuthenticated = require('../Middlewares/Auth');

// Profile data fetch karo
router.get('/profile', ensureAuthenticated, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id)
            .select('-password');
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Note download track karo
router.post('/track-download', ensureAuthenticated, async (req, res) => {
    try {
        const { title, category } = req.body;
        await UserModel.findByIdAndUpdate(req.user._id, {
            $push: { downloadedNotes: { title, category } }
        });
        res.status(200).json({ success: true, message: 'Download tracked' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;