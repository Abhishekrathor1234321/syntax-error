import { useState } from "react";

function CheckoutModal({ course, onClose, onProceed }) {
  const [name, setName] = useState(localStorage.getItem("user") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [phone, setPhone] = useState("");

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, padding: "16px"
    }}>
      <div style={{
        background: "#0f172a", borderRadius: "16px", padding: "28px",
        width: "100%", maxWidth: "420px", border: "1px solid #1e293b",
        color: "white", position: "relative"
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: "16px", right: "16px",
          background: "none", border: "none", color: "#94a3b8",
          fontSize: "20px", cursor: "pointer"
        }}>✕</button>

        <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "4px" }}>
          Complete Your Order
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "20px" }}>
          {course.title}
        </p>

        {/* Name */}
        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Full Name</label>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px",
              background: "#1e293b", border: "1px solid #334155", color: "white",
              fontSize: "14px", boxSizing: "border-box" }} />
        </div>

        {/* Email */}
        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px",
              background: "#1e293b", border: "1px solid #334155", color: "white",
              fontSize: "14px", boxSizing: "border-box" }} />
        </div>

        {/* Phone */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Phone Number</label>
          <input value={phone} onChange={e => setPhone(e.target.value)}
            placeholder="+91 XXXXXXXXXX"
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px",
              background: "#1e293b", border: "1px solid #334155", color: "white",
              fontSize: "14px", boxSizing: "border-box" }} />
        </div>

        {/* Order Summary */}
        <div style={{ background: "#1e293b", borderRadius: "10px", padding: "14px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>
            <span>{course.title}</span>
            <span>₹{course.amount}</span>
          </div>
          <div style={{ borderTop: "1px solid #334155", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "15px" }}>
            <span>Total</span>
            <span>₹{course.amount}</span>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={() => onProceed({ name, email, phone, finalAmount: course.amount })}
          disabled={!name || !email || !phone}
          style={{
            width: "100%", padding: "13px", borderRadius: "10px",
            background: (!name || !email || !phone) ? "#334155" : "#3b82f6",
            border: "none", color: "white", fontSize: "15px",
            fontWeight: "700", cursor: (!name || !email || !phone) ? "not-allowed" : "pointer"
          }}
        >
          Pay ₹{course.amount} →
        </button>

        <p style={{ textAlign: "center", fontSize: "11px", color: "#475569", marginTop: "10px" }}>
          🔒 Secured by Razorpay
        </p>
      </div>
    </div>
  );
}

export default CheckoutModal;