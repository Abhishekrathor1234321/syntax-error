import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../lib/firebase";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

function AuthPage() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 const redirectTo = sessionStorage.getItem("redirectAfterLogin") || "/";
  // Send OTP
  const handleSendOtp = async () => {
    if (!email) { alert("Please enter your email address."); return; }
    setLoading(true);
    try {
      const res = await fetch("https://syntax-error-1xds.vercel.app/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setStep("otp");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) { alert("Please enter the OTP."); return; }
    setLoading(true);
    try {
      const res = await fetch("https://syntax-error-1xds.vercel.app/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.jwtToken);
        localStorage.setItem("user", data.name);
      
       sessionStorage.removeItem("redirectAfterLogin"); 
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const res = await fetch("https://syntax-error-1xds.vercel.app/auth/google-login", {
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
       sessionStorage.removeItem("redirectAfterLogin"); 
      } else {
        alert("Google login failed. Please try again.");
      }
    } catch (error) {
      alert("Google login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-blob blob1" />
      <div className="auth-blob blob2" />

      <div className="auth-card">

        {/* Header */}
        <div className="auth-header">
          <h2 className="auth-title">Welcome to Syntax Error 👋</h2>
          <p className="auth-subtitle">
            Sign in to access notes, courses, roadmaps and more.
          </p>
        </div>

        {/* Step 1 — Email */}
        {step === "email" && (
          <>
            <div className="auth-form">
              <div className="auth-field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  autoFocus
                />
              </div>

              <button
                className="auth-submit"
                onClick={handleSendOtp}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Continue with Email →"}
              </button>

              <div className="auth-divider"><span>or</span></div>

              <button
                className="auth-google"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                {loading ? "Loading..." : (
                  <>
                    <img src="https://www.google.com/favicon.ico" alt="Google" width="16" />
                    Continue with Google
                  </>
                )}
              </button>
            </div>

            <p className="auth-terms">
              By continuing, you agree to our{" "}
              <span onClick={() => navigate("/terms")}>Terms of Service</span>
              {" "}&{" "}
              <span onClick={() => navigate("/privacy-policy")}>Privacy Policy</span>
            </p>
          </>
        )}

        {/* Step 2 — OTP */}
        {step === "otp" && (
          <div className="auth-otp-screen">
            <div className="auth-sent-icon">📧</div>
            <h3>Check Your Inbox!</h3>
            <p>We've sent a 6-digit OTP to</p>
            <p className="auth-sent-email">{email}</p>

            <div className="auth-form" style={{ marginTop: "1.2rem" }}>
              <div className="auth-field">
                <label>Enter OTP</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                  maxLength={6}
                  autoFocus
                  style={{ textAlign: "center", fontSize: "1.4rem", letterSpacing: "8px" }}
                />
              </div>

              <button
                className="auth-submit"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify OTP →"}
              </button>

              <div className="auth-sent-actions">
                <button
                  className="auth-resend-link"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "🔄 Resend OTP"}
                </button>
                <button
                  className="auth-resend"
                  onClick={() => { setStep("email"); setOtp(""); }}
                >
                  ← Use Different Email
                </button>
              </div>
            </div>

            <p className="auth-sent-sub" style={{ marginTop: "1rem" }}>
              OTP expires in 10 minutes.
            </p>
          </div>
        )}

        <p className="auth-back" onClick={() => navigate("/")}>
          ← Back to Home
        </p>

      </div>
    </div>
  );
}

export default AuthPage;