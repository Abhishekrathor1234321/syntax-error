import { useState } from "react";

const API_BASE = "https://syntax-error-1xds.vercel.app";

function CheckoutModal({ course, onClose, onProceed }) {
  const [name, setName] = useState(localStorage.getItem("user") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [phone, setPhone] = useState("");

  // Coupon state
  const [showCouponBox, setShowCouponBox] = useState(false); // NEW: collapsed by default (Topmate-style)
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discountAmount, finalPrice }

  const finalAmount = appliedCoupon ? appliedCoupon.finalPrice : course.amount;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/coupons/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: couponInput.trim(),
          courseTitle: course.title,
          coursePrice: course.amount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({
          code: data.code,
          discountAmount: data.discountAmount,
          finalPrice: data.finalPrice,
        });
      } else {
        setCouponError(data.message || "Invalid coupon");
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError("Kuch galat ho gaya, dobara try karo");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
    setShowCouponBox(false); // collapse back to the small pill after removing
  };

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

        {/* Coupon — Topmate-style: collapsed pill until clicked */}
        <div style={{ marginBottom: "16px" }}>
          {appliedCoupon ? (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "#14532d", border: "1px solid #22c55e", borderRadius: "8px",
              padding: "10px 12px"
            }}>
              <span style={{ fontSize: "13px", color: "#4ade80", fontWeight: "700" }}>
                ✅ {appliedCoupon.code} applied — ₹{appliedCoupon.discountAmount} off
              </span>
              <button
                onClick={handleRemoveCoupon}
                style={{ background: "none", border: "none", color: "#f87171", fontSize: "12px", cursor: "pointer", fontWeight: "600" }}
              >
                Remove
              </button>
            </div>
          ) : !showCouponBox ? (
            // Collapsed pill button (matches the "Add Discount Code" reference) — small, left-aligned
            <button
              onClick={() => setShowCouponBox(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                width: "auto",
                padding: "2px 6px",
                borderRadius: "999px",
                background: "#f1f5f9",
                border: "none",
                color: "#0f172a",
                fontSize: "10px",
                fontWeight: "700",
                cursor: "pointer",
                textAlign: "center"
              }}
            >
              🏷️ Add Discount Code
            </button>
          ) : (
            <div>
              <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Coupon Code</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  autoFocus
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  style={{
                    flex: 1, padding: "10px 12px", borderRadius: "8px",
                    background: "#1e293b", border: "1px solid #334155", color: "white",
                    fontSize: "14px", boxSizing: "border-box"
                  }}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponInput.trim()}
                  style={{
                    padding: "10px 16px", borderRadius: "8px", border: "none",
                    background: couponLoading || !couponInput.trim() ? "#334155" : "#3b82f6",
                    color: "white", fontSize: "13px", fontWeight: "700",
                    cursor: couponLoading || !couponInput.trim() ? "not-allowed" : "pointer",
                    whiteSpace: "nowrap"
                  }}
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </div>

              {couponError && (
                <p style={{ color: "#f87171", fontSize: "12px", marginTop: "6px" }}>{couponError}</p>
              )}

              <button
                onClick={() => { setShowCouponBox(false); setCouponInput(""); setCouponError(""); }}
                style={{
                  background: "none", border: "none", color: "#64748b",
                  fontSize: "12px", cursor: "pointer", marginTop: "6px", padding: 0
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div style={{ background: "#1e293b", borderRadius: "10px", padding: "14px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>
            <span>{course.title}</span>
            <span>₹{course.amount}</span>
          </div>

          {appliedCoupon && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#4ade80", marginBottom: "6px" }}>
              <span>Coupon ({appliedCoupon.code})</span>
              <span>− ₹{appliedCoupon.discountAmount}</span>
            </div>
          )}

          <div style={{ borderTop: "1px solid #334155", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "15px" }}>
            <span>Total</span>
            <span>₹{finalAmount}</span>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={() => onProceed({
            name,
            email,
            phone,
            finalAmount,
            couponCode: appliedCoupon ? appliedCoupon.code : null,
          })}
          disabled={!name || !email || !phone}
          style={{
            width: "100%", padding: "13px", borderRadius: "10px",
            background: (!name || !email || !phone) ? "#334155" : "#3b82f6",
            border: "none", color: "white", fontSize: "15px",
            fontWeight: "700", cursor: (!name || !email || !phone) ? "not-allowed" : "pointer"
          }}
        >
          Pay ₹{finalAmount} →
        </button>

        <p style={{ textAlign: "center", fontSize: "11px", color: "#475569", marginTop: "10px" }}>
          🔒 Secured by Razorpay
        </p>
      </div>
    </div>
  );
}

export default CheckoutModal;