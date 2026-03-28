import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../lib/firebase";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const BACKEND = "https://syntax-error-1xds.vercel.app";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingData, setPendingData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const res = await fetch(`${BACKEND}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          googleId: user.uid
        })
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.jwtToken);
        localStorage.setItem("user", data.name);
        localStorage.setItem("email", data.email);
        window.location.href = "/";
      } else {
        alert("Google login failed!");
      }
    } catch (error) {
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      alert("Email aur password required hai!");
      return;
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords match nahi kar rahe!");
      return;
    }

    setLoading(true);
    try {
      const url = isLogin
        ? `${BACKEND}/auth/login`
        : `${BACKEND}/auth/signup`;

      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        if (isLogin) {
          // OTP bhejo
          const otpRes = await fetch(`${BACKEND}/otp/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email })
          });
          const otpData = await otpRes.json();
          if (otpData.success) {
            setPendingData(data);
            setShowOtp(true);
            alert("OTP aapke email pe bheja gaya hai!");
          } else {
            alert("OTP send karne mein error: " + otpData.message);
          }
        } else {
          alert(data.message);
          setIsLogin(true);
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server se connect nahi ho pa raha!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      alert("6 digit OTP daalo!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp })
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", pendingData.jwtToken);
        localStorage.setItem("user", pendingData.name);
        localStorage.setItem("email", pendingData.email);
        window.location.href = "/";
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP dobara bheja gaya!");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // OTP Screen
  if (showOtp) {
    return (
      <div className="auth-wrapper">
        <div className="auth-blob blob1" />
        <div className="auth-blob blob2" />
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">🔐 Verify OTP</h2>
            <p className="auth-subtitle">
              OTP bheja gaya hai: <b>{formData.email}</b>
            </p>
          </div>

          <div className="auth-form">
            <div className="auth-field">
              <label>Enter OTP</label>
              <input
                type="text"
                placeholder="6 digit OTP"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ letterSpacing: "8px", fontSize: "24px", textAlign: "center" }}
              />
            </div>

            <button
              className="auth-submit"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP ✓"}
            </button>

            <p style={{ textAlign: "center", marginTop: "12px", color: "#888" }}>
              OTP nahi mila?{" "}
              <span
                onClick={handleResendOtp}
                style={{ color: "#3b82f6", cursor: "pointer" }}
              >
                Resend OTP
              </span>
            </p>

            <p
              className="auth-back"
              onClick={() => setShowOtp(false)}
              style={{ textAlign: "center", marginTop: "12px" }}
            >
              ← Back to Login
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-blob blob1" />
      <div className="auth-blob blob2" />

      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">
            {isLogin ? "Welcome Back 👋" : "Join the Community 🚀"}
          </h2>
          <p className="auth-subtitle">
            {isLogin
              ? "Login to continue your coding journey"
              : "Create your free account and start learning"}
          </p>
        </div>

        <div className="auth-toggle">
          <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>
            Sign Up
          </button>
        </div>

        <div className="auth-form">
          {!isLogin && (
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                onChange={handleChange}
              />
            </div>
          )}

          <div className="auth-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
            />
          </div>

          {!isLogin && (
            <div className="auth-field">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>
          )}

          {isLogin && (
            <div className="auth-forgot">
              <span>Forgot password?</span>
            </div>
          )}

          <button
            className="auth-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Loading..." : isLogin ? "Login →" : "Create Account →"}
          </button>

          <div className="auth-divider"><span>or</span></div>

          <button
            className="auth-google"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? "Loading..." : (
              <>
                <img src="https://www.google.com/favicon.ico" alt="google" width="16" />
                Continue with Google
              </>
            )}
          </button>
        </div>

        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>

        <p className="auth-back" onClick={() => navigate("/")}>
          ← Back to Home
        </p>
      </div>
    </div>
  );
}

export default AuthPage;