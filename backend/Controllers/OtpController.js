const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const otpStore = {};

const sendOtp = async (req, res) => {
  try {
    console.log("🔥 NEW OTP CODE IS RUNNING");
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    };

    const { data, error } = await resend.emails.send({
      from: 'Syntax Error <noreply@syntaxerrorr.com>',
      to: [email],
      subject: 'Your OTP - Syntax Error',
      html: `
        <div style="font-family: Arial; max-width: 400px; margin: 0 auto; padding: 20px;">
          <h2>🔐 Your OTP - Syntax Error</h2>
          <p>Your one-time password is:</p>
          <h1 style="color: #3b82f6; letter-spacing: 8px; font-size: 40px;">
            ${otp}
          </h1>
          <p>Valid for <b>5 minutes</b> only.</p>
          <p style="color: gray;">
            If you did not request this OTP, please ignore this email.
          </p>
        </div>
      `
    });

    if (error) {
      console.error('RESEND ERROR:', error);

      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to send OTP email.'
      });
    }

    console.log('RESEND SUCCESS:', data);

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully!'
    });

  } catch (err) {
    console.error('OTP ERROR:', err);

    return res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong while sending OTP.'
    });
  }
};


const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const stored = otpStore[email];

    if (!stored) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found!'
      });
    }

    if (Date.now() > stored.expiresAt) {
      delete otpStore[email];

      return res.status(400).json({
        success: false,
        message: 'OTP has expired!'
      });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect OTP!'
      });
    }

    delete otpStore[email];

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully!'
    });

  } catch (err) {
    console.error('VERIFY OTP ERROR:', err);

    return res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong while verifying OTP.'
    });
  }
};


module.exports = {
  sendOtp,
  verifyOtp
};