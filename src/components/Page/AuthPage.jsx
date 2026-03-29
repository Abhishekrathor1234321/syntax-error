import { useState } from "react";
import {
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from "firebase/auth";
import { auth, googleProvider } from "../../../lib/firebase";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

function AuthPage() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const redirectTo = new URLSearchParams(window.location.search).get("redirect") || "/";

  const actionCodeSettings = {
    url: `https://syntaxerrorr.com/login?redirect=${redirectTo}`,
    handleCodeInApp: true,
  };

  // Send magic link to email
  const handleSendLink = async () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem("emailForSignIn", email);
      setStep("sent");
    } catch (error) {
      alert("Failed to send link. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle magic link login
  const handleEmailLinkLogin = async () => {
    const savedEmail = localStorage.getItem("emailForSignIn");
    if (!savedEmail) return;
    setLoading(true);
    try {
      const result = await signInWithEmailLink(auth, savedEmail, window.location.href);
      const user = result.user;

      const res = await fetch("https://syntax-error-1xds.vercel.app/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName || savedEmail.split("@")[0],
          email: user.email,
          googleId: user.uid
        })
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.jwtToken);
        localStorage.setItem("user", data.name);
        localStorage.removeItem("emailForSignIn");
        window.location.href = redirectTo;
      }
    } catch (error) {
      alert("Authentication failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Google login
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
        window.location.href = redirectTo;
      } else {
        alert("Google login failed. Please try again.");
      }
    } catch (error) {
      alert("Google login failed: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-handle magic link redirect
  if (isSignInWithEmailLink(auth, window.location.href)) {
    const savedEmail = localStorage.getItem("emailForSignIn");
    if (savedEmail) handleEmailLinkLogin();
  }

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

        {/* Step 1 — Email Input */}
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
                  onKeyDown={(e) => e.key === "Enter" && handleSendLink()}
                  autoFocus
                />
              </div>

              <button
                className="auth-submit"
                onClick={handleSendLink}
                disabled={loading}
              >
                {loading ? "Sending..." : "Continue with Email →"}
              </button>

              <div className="auth-divider"><span>or</span></div>

              <button
                className="auth-google"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                {loading ? "Loading..." : (
                  <>
                    <img
                      src="https://www.google.com/favicon.ico"
                      alt="Google"
                      width="16"
                    />
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

        {/* Step 2 — Email Sent */}
        {step === "sent" && (
          <div className="auth-sent">
            <div className="auth-sent-icon">📧</div>
            <h3>Check Your Inbox!</h3>
            <p>We've sent a secure sign-in link to</p>
            <p className="auth-sent-email">{email}</p>
            <p className="auth-sent-sub">
              Click the link in your email to sign in instantly.
              The link expires in 10 minutes.
            </p>

            <div className="auth-sent-actions">
              <button
                className="auth-resend-link"
                onClick={handleSendLink}
                disabled={loading}
              >
                {loading ? "Sending..." : "🔄 Resend Link"}
              </button>

              <button
                className="auth-resend"
                onClick={() => {
                  setStep("email");
                  setEmail("");
                }}
              >
                ← Use Different Email
              </button>
            </div>
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