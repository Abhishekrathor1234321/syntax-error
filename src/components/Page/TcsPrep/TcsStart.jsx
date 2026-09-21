import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./tcs.css";

// TODO: jab site live/deploy karoge, yahan production backend URL daal dena
const API_BASE = "https://syntax-error-1xds.vercel.app";

const categories = [
  { key: "coding", label: "Coding", desc: "Real coding problems, tested against hidden test cases.", comingSoon: true },
  { key: "aptitude", label: "Aptitude", desc: "Numerical, Verbal, and Reasoning MCQs." },
  { key: "cshr", label: "CS + HR + GenAI", desc: "Concept questions and interview prep." },
];

export default function TcsStart() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [needsName, setNeedsName] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_BASE}/tcs/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setError(data.message || "Kuch galat ho gaya, dobara try karo");
          setLoading(false);
          return;
        }
        setName(data.user.name || "");
        setNeedsName(!!data.user.nameNeedsConfirm);
        setLoading(false);
      })
      .catch(() => {
        setError("Couldn’t connect to the server. Please check if the backend is running.");
        setLoading(false);
      });
  }, [navigate]);

  const handleConfirmName = async () => {
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/tcs/name`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Couldn’t save the name.");
        setSaving(false);
        return;
      }
      localStorage.setItem("user", data.name);
      setNeedsName(false);
    } catch {
      setError("Couldn’t connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="tcs-wrap" style={{ padding: "4rem 0", textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (needsName) {
    return (
      <div className="tcs-wrap" style={{ padding: "4rem 0", maxWidth: 420 }}>
        <h1>Enter Your Name</h1>
    <p>This name will be displayed on the leaderboard and dashboard.</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Apna naam likho"
          style={{ width: "100%", padding: "10px", margin: "12px 0", fontSize: "1rem", borderRadius: "8px", border: "1px solid #334155" }}
        />
        {error && <p style={{ color: "#f87171" }}>{error}</p>}
        <button className="btn btn-primary" onClick={handleConfirmName} disabled={saving}>
          {saving ? "Saving..." : "Confirm and Continue"}
        </button>
      </div>
    );
  }

  return (
    <div className="tcs-wrap" style={{ padding: "3rem 0" }}>
      <h1>Namaste, {name} 👋</h1>
      <p>Choose a category to start practicing.</p>
      {error && <p style={{ color: "#f87171" }}>{error}</p>}
      <div className="inside-grid" style={{ marginTop: "2rem" }}>
        {categories.map((c) =>
 c.comingSoon ? (
  <div
    key={c.key}
    className="card"
    aria-disabled="true"
    style={{
      position: "relative",
      overflow: "hidden",
      cursor: "not-allowed",
      pointerEvents: "none",
      color: "inherit",
    }}
  >
    <div className="soon-strip">
      <div className="soon-track">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i}> COMING SOON</span>
        ))}
      </div>
    </div>

    <div style={{ opacity: 0.55, paddingTop: 26 }}>
      <h3>{c.label}</h3>
      <p>{c.desc}</p>
    </div>
  </div>
) : (
  /* yahan aapka purana <Link ...> wala block jaisa hai waisa hi rehne do */

    <Link
      key={c.key}
      to={`/tcs-prep/${c.key}`}
      className="card"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <h3>{c.label}</h3>
      <p>{c.desc}</p>
    </Link>
  )
)}
      </div>
    </div>
  );
}