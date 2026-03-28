import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../lib/firebase";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  // Original URL jahan jana tha
  const redirectTo = new URLSearchParams(window.location.search).get("redirect") || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        window.location.href = redirectTo; // ← Original URL pe jao
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
        ? "https://syntax-error-1xds.vercel.app/auth/login"
        : "https://syntax-error-1xds.vercel.app/auth/signup";

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
          localStorage.setItem("token", data.jwtToken);
          localStorage.setItem("user", data.name);
          localStorage.setItem("email", data.email);
          window.location.href = redirectTo; // ← Original URL pe jao
        } else {
          alert("Signup successful! Ab login karo.");
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