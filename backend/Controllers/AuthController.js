const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UserModel = require("../Models/User");

// OTP Store (temporary)
const otpStore = {};

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send OTP
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 10 min expiry
    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    };

    // Send Email
    await transporter.sendMail({
      from: `"Syntax Error" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Login OTP — Syntax Error",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0f172a; color: white; border-radius: 16px; padding: 32px;">
          <h2 style="color: #22c55e; margin-bottom: 8px;">Syntax Error</h2>
          <p style="color: #94a3b8; margin-bottom: 24px;">Your one-time login code</p>
          
          <div style="background: #1e293b; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 8px;">Your OTP Code</p>
            <h1 style="color: #22c55e; font-size: 42px; letter-spacing: 8px; margin: 0;">${otp}</h1>
          </div>
          
          <p style="color: #64748b; font-size: 13px;">This code expires in <strong style="color: #94a3b8;">10 minutes</strong>.</p>
          <p style="color: #64748b; font-size: 13px;">If you didn't request this, please ignore this email.</p>
          
          <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;">
          <p style="color: #475569; font-size: 12px;">© 2026 Syntax Error. All rights reserved.</p>
        </div>
      `
    });

    res.status(200).json({ success: true, message: "OTP sent successfully!" });
  } catch (err) {
    console.error("OTP send error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const stored = otpStore[email];

    if (!stored) {
      return res.status(400).json({ success: false, message: "OTP not found. Please request again." });
    }

    if (Date.now() > stored.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ success: false, message: "OTP has expired. Please request again." });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
    }

    // OTP correct — delete it
    delete otpStore[email];

    // Find or create user
    let user = await UserModel.findOne({ email });
    if (!user) {
      const name = email.split("@")[0];
      user = new UserModel({
        name,
        email,
        password: await bcrypt.hash(Math.random().toString(36), 10)
      });
      await user.save();
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: "Login successful!",
      jwtToken,
      name: user.name,
      email: user.email
    });

  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({ message: 'User already exists, please login', success: false });
    }
    const userModel = new UserModel({ name, email, password });
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
    res.status(201).json({ message: "Signup successful", success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = 'Invalid email or password';
    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ message: errorMsg, success: false });
    }
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.status(200).json({
      message: "Login successful",
      success: true,
      jwtToken,
      email,
      name: user.name
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { name, email, googleId } = req.body;
    let user = await UserModel.findOne({ email });
    if (!user) {
      user = new UserModel({
        name,
        email,
        password: await bcrypt.hash(googleId, 10)
      });
      await user.save();
    }
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.status(200).json({
      success: true,
      jwtToken,
      name: user.name,
      email: user.email,
      message: "Google login successful"
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  signup,
  login,
  googleLogin,
  sendOtp,
  verifyOtp
};