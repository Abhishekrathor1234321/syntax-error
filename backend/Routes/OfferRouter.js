// =========================================================
// BACKEND — backend/Routes/OfferRouter.js   (Express + Mongoose, CommonJS)
//
// Register in your main server file:
//   app.use("/offer", require("./Routes/OfferRouter"));
//
// Ye route popup ka offer save karta hai AUR aapke existing Coupon
// collection me wahi coupon apne aap bana/update/band kar deta hai.
// Isliye checkout ka coupon-validation code badalne ki zarurat nahi.
//
// ⚠️ Neeche 3 jagah apne project ke hisaab se adjust karo:
//    1. verifyToken  — aapka JWT middleware
//    2. Coupon       — aapka existing Coupon model ka path
//    3. adminOnly    — req.user me email kahan milta hai
// =========================================================
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const verifyToken = require("../Middlewares/Auth");   // 👈 1  (backend/Middlewares/Auth.js)
const Coupon = require("../Models/Coupon");          // 👈 2  (backend/Models/Coupon.js)
const ADMIN_EMAIL = "abhishekrathor7447@gmail.com";

// ── Offer model (hamesha sirf ek document: key = "main") ──
const offerSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    enabled: { type: Boolean, default: false },
    name: { type: String, default: "" },
    couponCode: { type: String, default: "" },
    discount: { type: Number, default: 0 },
    expiryDate: { type: Date, default: null },
    applicableTo: { type: String, enum: ["all", "specific"], default: "all" },
    courseTitles: { type: [String], default: [] },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);
const Offer = mongoose.models.Offer || mongoose.model("Offer", offerSchema);

const adminOnly = (req, res, next) => {
  const email = req.user?.email;                     // 👈 3
  if (email !== ADMIN_EMAIL) {
    return res.status(403).json({ success: false, message: "Admin only" });
  }
  next();
};

// "YYYY-MM-DD" -> us din ki raat 11:59:59 (IST)
const endOfDayIST = (dateStr) => new Date(`${dateStr}T23:59:59+05:30`);

// ── Coupon collection ko offer ke saath sync rakhta hai ──
async function syncCoupon({ prevCode, code, pct, expiry, enabled, applicableTo, courseTitles }) {
  // Code badla ho to purana coupon band kar do
  if (prevCode && prevCode !== code) {
    await Coupon.updateOne({ code: prevCode }, { $set: { isActive: false } });
  }
  if (!code) return;

  await Coupon.findOneAndUpdate(
    { code },
    {
      $set: {
        code,
        discountType: "percentage",
        discountValue: pct,
        applicableTo: applicableTo === "specific" ? "specific" : "all",
        courseTitles: applicableTo === "specific" ? courseTitles : [],
        perUserLimit: 1,
        expiryDate: expiry,
        isActive: !!enabled,
      },
      $setOnInsert: { usageLimit: null },
    },
    { upsert: true, new: true }
  );
}

// ── PUBLIC: Courses page popup (sirf ON + expire na hua ho tab) ──
router.get("/active", async (req, res) => {
  try {
    const offer = await Offer.findOne({ key: "main" }).lean();
    res.set("Cache-Control", "no-store");
    const expired = offer?.expiryDate && new Date() > new Date(offer.expiryDate);
    if (!offer || !offer.enabled || expired) return res.json({ success: true, offer: null });
    res.json({
      success: true,
      offer: {
        enabled: true,
        name: offer.name,
        couponCode: offer.couponCode,
        discount: offer.discount,
        applicableTo: offer.applicableTo,
        courseTitles: offer.courseTitles,
        message: offer.message,
        updatedAt: offer.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── ADMIN: current offer (ON ho ya OFF) ──
router.get("/admin", verifyToken, adminOnly, async (req, res) => {
  try {
    const offer = await Offer.findOne({ key: "main" }).lean();
    res.json({ success: true, offer: offer || null });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── ADMIN: save / ON-OFF ──
router.put("/admin", verifyToken, adminOnly, async (req, res) => {
  try {
    const { enabled, name, couponCode, discount, expiryDate, message, applicableTo, courseTitles } = req.body;

    const code = String(couponCode || "").toUpperCase().replace(/\s/g, "");
    const pct = Number(discount);
    const expiry = expiryDate ? endOfDayIST(expiryDate) : null;
    const scope = applicableTo === "specific" ? "specific" : "all";
    const titles = scope === "specific" && Array.isArray(courseTitles) ? courseTitles.map(String) : [];

    if (enabled) {
      if (!String(name || "").trim())
        return res.status(400).json({ success: false, message: "Offer name required" });
      if (!/^[A-Z0-9_-]{3,20}$/.test(code))
        return res.status(400).json({ success: false, message: "Invalid coupon code" });
      if (!Number.isInteger(pct) || pct < 1 || pct > 99)
        return res.status(400).json({ success: false, message: "Discount 1-99 hona chahiye" });
      if (!expiry || isNaN(expiry.getTime()) || expiry < new Date())
        return res.status(400).json({ success: false, message: "Expiry date aaj ya future ki honi chahiye" });
      if (scope === "specific" && titles.length === 0)
        return res.status(400).json({ success: false, message: "Kam se kam ek course select karo" });
    }

    const prev = await Offer.findOne({ key: "main" }).lean();

    const offer = await Offer.findOneAndUpdate(
      { key: "main" },
      {
        enabled: !!enabled,
        name: String(name || "").trim().slice(0, 40),
        couponCode: code,
        discount: Number.isFinite(pct) ? pct : 0,
        expiryDate: expiry && !isNaN(expiry.getTime()) ? expiry : null,
        applicableTo: scope,
        courseTitles: titles,
        message: String(message || "").trim().slice(0, 120),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // ✅ Coupon collection sync (checkout me yahi coupon validate hoga)
    await syncCoupon({
      prevCode: prev?.couponCode,
      code,
      pct,
      expiry: offer.expiryDate,
      enabled: offer.enabled,
      applicableTo: offer.applicableTo,
      courseTitles: offer.courseTitles,
    });

    res.json({ success: true, offer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;