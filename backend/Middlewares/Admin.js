const ADMIN_EMAIL = "abhishekrathor7447@gmail.com";

const ensureAdmin = (req, res, next) => {
    console.log("🛡️ Admin middleware reached");
    console.log("👤 User:", req.user?.email);

    if (req.user?.email !== ADMIN_EMAIL) {
        console.log("❌ Admin access denied");

        return res.status(403).json({
            success: false,
            message: "Admin access required",
        });
    }

    console.log("✅ Admin verified");
    next();
};

module.exports = ensureAdmin;