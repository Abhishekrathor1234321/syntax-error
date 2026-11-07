import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SessionExpiredModal.css";

export default function SessionExpiredModal() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("session-expired", show);
    return () => window.removeEventListener("session-expired", show);
  }, []);

  const handleLogin = () => {
    // Remember the page the user was on
    sessionStorage.setItem(
      "redirectAfterLogin",
      location.pathname + location.search
    );

    // Clear old login data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("email");

    setOpen(false);
    navigate("/login");
  };

  if (!open) return null;

  return (
    <div className="se-overlay">
      <div className="se-card">
        <div className="se-icon">⏰</div>
        <h2>Session Expired</h2>
        <p>
          Your session has expired.
          <br />
          Please log in again to continue.
        </p>
        <button className="se-btn" onClick={handleLogin}>
          Login Now
        </button>
      </div>
    </div>
  );
}