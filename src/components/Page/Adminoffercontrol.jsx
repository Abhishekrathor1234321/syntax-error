import { useEffect, useState } from "react";
import "./Offerpopup.css";

// AdminDashboard se apiBase prop milta hai; na mile to ye default use hoga
const DEFAULT_API = "https://syntax-error-1xds.vercel.app";

// Individual courses ke option ke liye course list (title exact wahi jo CoursesPage me hai)
const COURSE_LIST = [
  "The Complete Data Structure & Algorithm Course 2026",
  "Complete Aptitude Course 2026",
  "The Complete TCS NQT Course 2026",
  "Data Analytics Placement Ready Course With Projects",
  "CS Fundamentals + GenAI Placement Ready Course",
];

/**
 * Admin Dashboard me ye component daal do:
 *   import AdminOfferControl from "./AdminOfferControl";
 *   <AdminOfferControl />
 * Yahan se offer ka name, coupon code, discount % aur popup ON/OFF control hota hai.
 */
export default function AdminOfferControl({ apiBase }) {
  const API = apiBase || DEFAULT_API;
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    enabled: false,
    name: "",
    couponCode: "",
    discount: "",
    expiryDate: "",
    applicableTo: "all",
    courseTitles: [],
    message: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ── Current offer load ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/offer/admin`, { headers: authHeaders });
        const data = await res.json();
        if (data.success && data.offer) {
          const o = data.offer;
          setForm({
            enabled: !!o.enabled,
            name: o.name || "",
            couponCode: o.couponCode || "",
            discount: o.discount ?? "",
            expiryDate: o.expiryDate ? String(o.expiryDate).slice(0, 10) : "",
            applicableTo: o.applicableTo === "specific" ? "specific" : "all",
            courseTitles: Array.isArray(o.courseTitles) ? o.courseTitles : [],
            message: o.message || "",
          });
        }
      } catch (err) {
        setStatus({ type: "err", text: "Offer load nahi ho paya." });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (key) => (e) => {
    const value = key === "couponCode"
      ? e.target.value.toUpperCase().replace(/\s/g, "")
      : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const toggleCourse = (title) => {
    setForm((f) => ({
      ...f,
      courseTitles: f.courseTitles.includes(title)
        ? f.courseTitles.filter((c) => c !== title)
        : [...f.courseTitles, title],
    }));
  };

  const validate = (data) => {
    if (!data.enabled) return ""; // OFF karte waqt validation nahi chahiye
    if (!data.name.trim()) return "Offer ka name likho (jaise Happy Diwali).";
    if (!/^[A-Z0-9_-]{3,20}$/.test(data.couponCode))
      return "Coupon code 3-20 characters ka ho (A-Z, 0-9, - ya _).";
    const d = Number(data.discount);
    if (!Number.isInteger(d) || d < 1 || d > 99) return "Discount 1 se 99 ke beech ka number ho.";
    if (!data.expiryDate) return "Expiry date zaroori hai.";
    if (data.applicableTo === "specific" && data.courseTitles.length === 0)
      return "Kam se kam ek course select karo.";
    return "";
  };

  const save = async (next) => {
    const error = validate(next);
    if (error) {
      setStatus({ type: "err", text: error });
      return;
    }
    setSaving(true);
    setStatus({ type: "", text: "" });
    try {
      const res = await fetch(`${API}/offer/admin`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          enabled: next.enabled,
          name: next.name.trim(),
          couponCode: next.couponCode,
          discount: Number(next.discount) || 0,
          expiryDate: next.expiryDate,
          applicableTo: next.applicableTo,
          courseTitles: next.applicableTo === "specific" ? next.courseTitles : [],
          message: next.message.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setForm(next);
        setStatus({
          type: "ok",
          text: next.enabled ? "✅ Offer popup ON hai aur save ho gaya." : "⛔ Offer popup OFF kar diya.",
        });
      } else {
        setStatus({ type: "err", text: data.message || "Save nahi hua." });
      }
    } catch (err) {
      setStatus({ type: "err", text: "Server error. Dobara try karo." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="ao-card">⏳ Loading offer...</div>;

  return (
    <div className="ao-card">
      <div className="ao-head">
        <h3>🎁 Offer Popup</h3>
        <button
          type="button"
          className={`ao-toggle ${form.enabled ? "on" : ""}`}
          disabled={saving}
          onClick={() => save({ ...form, enabled: !form.enabled })}
        >
          <span className="ao-track" />
          {form.enabled ? "ON" : "OFF"}
        </button>
      </div>
      <p className="ao-sub">
        Courses page par aane wale popup ka offer yahan se badlo. Toggle se poora popup ON/OFF hota hai.
      </p>

      <div className="ao-field">
        <label>Offer Name</label>
        <input value={form.name} onChange={update("name")} placeholder="Happy Diwali" maxLength={40} />
      </div>

      <div className="ao-row">
        <div className="ao-field">
          <label>Coupon Code</label>
          <input value={form.couponCode} onChange={update("couponCode")} placeholder="DIWALI50" maxLength={20} />
        </div>
        <div className="ao-field">
          <label>Discount %</label>
          <input
            type="number"
            min="1"
            max="99"
            value={form.discount}
            onChange={update("discount")}
            placeholder="20"
          />
        </div>
      </div>

      <div className="ao-field">
        <label>Ye offer kahan chalega?</label>
        <select value={form.applicableTo} onChange={update("applicableTo")}>
          <option value="all">✅ Sabhi Courses par</option>
          <option value="specific">🎯 Sirf select kiye hue courses par</option>
        </select>
      </div>

      {form.applicableTo === "specific" && (
        <div className="ao-courses">
          {COURSE_LIST.map((c) => (
            <label key={c}>
              <input
                type="checkbox"
                checked={form.courseTitles.includes(c)}
                onChange={() => toggleCourse(c)}
              />
              {c}
            </label>
          ))}
        </div>
      )}

      <div className="ao-field">
        <label>Expiry Date (iske baad popup + coupon band)</label>
        <input type="date" value={form.expiryDate} onChange={update("expiryDate")} />
      </div>

      <div className="ao-field">
        <label>Message (optional)</label>
        <textarea
          value={form.message}
          onChange={update("message")}
          placeholder="Festival offer — sirf kuch din ke liye!"
          maxLength={120}
        />
      </div>

      <button className="ao-save" disabled={saving} onClick={() => save(form)}>
        {saving ? "Saving..." : "Save Offer"}
      </button>

      {status.text && <p className={`ao-msg ${status.type}`}>{status.text}</p>}
    </div>
  );
}