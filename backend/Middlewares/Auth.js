const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    console.log("🔐 Auth middleware reached");

    const auth = req.headers['authorization'];

    console.log("🔑 Authorization header exists:", !!auth);

    if (!auth) {
        console.log("❌ No authorization header");

        return res.status(403)
            .json({ message: 'Unauthorized, JWT token is required' });
    }

    try {
        // "Bearer <token>" se sirf token nikalo
        const token = auth.startsWith('Bearer ')
            ? auth.split(' ')[1]
            : auth;

        console.log("🔍 Verifying JWT...");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("✅ JWT verified");

        req.user = decoded;

        console.log("➡️ Calling next()");

        next();

    } catch (err) {
        console.error("❌ JWT error:", err.message);

        return res.status(403)
            .json({
                message:
                    'Unauthorized, JWT token wrong or expired. Please log out from this website and log in again.'
            });
    }
};

module.exports = ensureAuthenticated;