import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import AdminTcsAptitude from "./AdminTcsAptitude";
import AdminTcsCsHr from "./AdminTcsCsHr";

const COURSES = [
  "The Complete Data Structure & Algorithm Course 2026",
  "Complete Aptitude Course 2026",
  "The Complete TCS NQT Course 2026",
];

const API_BASE = "https://syntax-error-1xds.vercel.app";

// TCS Prep routes abhi sirf local backend pe hain — jab production me deploy
// karo, isko production URL se badal dena (ya API_BASE hi use kar lena agar
// tab tak TCS routes bhi wahi deploy ho chuke hon).
const TCS_API_BASE = "https://syntax-error-1xds.vercel.app";

const EMPTY_COUPON_FORM = {
  code: "",
  discountValue: "",       // percentage off
  applicableTo: "all",     // "all" ya "specific"
  courseTitles: [],
  usageLimit: "",          // total kitne users use kar sakte hain
  expiryDate: "",
};

// ---------- TCS Prep form defaults ----------
const EMPTY_MCQ_FORM = {
  groupValue: "",   // aptitude ke liye "topic", cshr ke liye "category"
  question: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  hint: "",
  solution: "",
  points: 5,
};

const EMPTY_CODING_FORM = {
  title: "",
  slug: "",
  description: "",
  difficulty: "easy",
  hint: "",
  explanation: "",
  inputFormat: "",
  constraints: "",
  points: 10,
  testCases: [{ input: "", expectedOutput: "", isHidden: false }],
};

const CSHR_CATEGORIES = ["DBMS", "OOPs", "Operating Systems", "Computer Networks", "SQL", "Data Structures", "Gen AI", "HR"];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [refStats, setRefStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("sales");
  const [newRefName, setNewRefName] = useState("");
  const [selectedPage, setSelectedPage] = useState("course-detail/dsa");
  const [copiedLink, setCopiedLink] = useState("");

  // Grant Access state
  const [grantEmail, setGrantEmail] = useState("");
  const [grantCourse, setGrantCourse] = useState(COURSES[0]);
  const [grantLoading, setGrantLoading] = useState(false);
  const [grantMsg, setGrantMsg] = useState(null);

  // Coupons state
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponForm, setCouponForm] = useState(EMPTY_COUPON_FORM);
  const [couponMsg, setCouponMsg] = useState(null);
  const [couponSaving, setCouponSaving] = useState(false);

  // ---------- TCS Prep state ----------
  const [tcsSection, setTcsSection] = useState("aptitude"); // "aptitude" | "cshr" | "coding"
  const [tcsQuestions, setTcsQuestions] = useState([]);
  const [tcsLoading, setTcsLoading] = useState(false);
  const [tcsError, setTcsError] = useState("");
  const [tcsSaving, setTcsSaving] = useState(false);
  const [mcqForm, setMcqForm] = useState(EMPTY_MCQ_FORM);
  const [codingForm, setCodingForm] = useState(EMPTY_CODING_FORM);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      try {
        const res = await fetch(`${API_BASE}/admin/purchases`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data);
          if (data.stats.length > 0) setSelectedCourse(data.stats[0]);
        } else {
          alert("Admin access nahi hai!");
          navigate("/");
        }

        const refRes = await fetch(`${API_BASE}/admin/ref-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const refData = await refRes.json();
        if (refData.success) setRefStats(refData.refs || []);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch coupons jab "coupons" tab khule
  useEffect(() => {
    if (activeTab === "coupons") {
      fetchCoupons();
    }
  }, [activeTab]);

  // Fetch TCS questions jab "tcsprep" tab ya section badle
  useEffect(() => {
    if (activeTab === "tcsprep") {
      loadTcsQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, tcsSection]);

  const fetchCoupons = async () => {
    setCouponsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/coupons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setCoupons(data.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setCouponsLoading(false);
    }
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(""), 2000);
  };

  const generateLink = () => {
    if (!newRefName.trim()) return "";
    return `https://syntaxerrorr.com/${selectedPage}?ref=${newRefName.trim().toLowerCase().replace(/\s+/g, "-")}`;
  };

  const handleGrantAccess = async () => {
    if (!grantEmail.trim()) {
      setGrantMsg({ type: "error", text: "Email daalo!" });
      return;
    }
    setGrantLoading(true);
    setGrantMsg(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/admin/grant-access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: grantEmail.trim(), courseTitle: grantCourse }),
      });
      const data = await res.json();
      if (data.success) {
        setGrantMsg({ type: "success", text: data.message });
        setGrantEmail("");
      } else {
        setGrantMsg({ type: "error", text: data.message });
      }
    } catch (err) {
      setGrantMsg({ type: "error", text: "Server error — dobara try karo!" });
    } finally {
      setGrantLoading(false);
    }
  };

  // ---------- Coupon handlers ----------

  const toggleCourseInForm = (course) => {
    setCouponForm((prev) => {
      const already = prev.courseTitles.includes(course);
      return {
        ...prev,
        courseTitles: already
          ? prev.courseTitles.filter((c) => c !== course)
          : [...prev.courseTitles, course],
      };
    });
  };

  const handleCreateCoupon = async () => {
    if (!couponForm.code.trim() || !couponForm.discountValue || !couponForm.expiryDate) {
      setCouponMsg({ type: "error", text: "Code, discount value aur expiry date zaroori hain!" });
      return;
    }
    if (couponForm.applicableTo === "specific" && couponForm.courseTitles.length === 0) {
      setCouponMsg({ type: "error", text: "Kam se kam ek course select karo!" });
      return;
    }

    setCouponSaving(true);
    setCouponMsg(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: couponForm.code.trim(),
          discountType: "percentage",
          discountValue: Number(couponForm.discountValue),
          applicableTo: couponForm.applicableTo,
          courseTitles: couponForm.courseTitles,
          usageLimit: couponForm.usageLimit ? Number(couponForm.usageLimit) : null,
          perUserLimit: 1, // ek user sirf ek baar use kar sakta hai
          expiryDate: couponForm.expiryDate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCouponMsg({ type: "success", text: `✅ Coupon "${data.coupon.code}" ban gaya!` });
        setCouponForm(EMPTY_COUPON_FORM);
        fetchCoupons();
      } else {
        setCouponMsg({ type: "error", text: data.message });
      }
    } catch (err) {
      setCouponMsg({ type: "error", text: "Server error — dobara try karo!" });
    } finally {
      setCouponSaving(false);
    }
  };

  const handleToggleCoupon = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/coupons/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (id, code) => {
    if (!window.confirm(`Pakka "${code}" coupon delete karna hai?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/coupons/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- TCS Prep handlers ----------

  const loadTcsQuestions = async () => {
    setTcsLoading(true);
    setTcsError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${TCS_API_BASE}/tcs/admin/${tcsSection}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setTcsQuestions(data.questions);
      else setTcsError(data.message || "Could not load questions");
    } catch (err) {
      setTcsError("Could not connect to the server");
    } finally {
      setTcsLoading(false);
    }
  };

  const handleMcqOptionChange = (i, value) => {
    const newOptions = [...mcqForm.options];
    newOptions[i] = value;
    setMcqForm({ ...mcqForm, options: newOptions });
  };

  const handleMcqSubmit = async (e) => {
    e.preventDefault();
    setTcsError("");
    if (mcqForm.options.some((o) => !o.trim())) {
      setTcsError("Please fill all 4 options");
      return;
    }
    setTcsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const body =
        tcsSection === "aptitude"
          ? { topic: mcqForm.groupValue, question: mcqForm.question, options: mcqForm.options, correctIndex: mcqForm.correctIndex, hint: mcqForm.hint, solution: mcqForm.solution, points: mcqForm.points }
          : { category: mcqForm.groupValue, question: mcqForm.question, options: mcqForm.options, correctIndex: mcqForm.correctIndex, hint: mcqForm.hint, solution: mcqForm.solution, points: mcqForm.points };

      const res = await fetch(`${TCS_API_BASE}/tcs/admin/${tcsSection}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setMcqForm(EMPTY_MCQ_FORM);
        loadTcsQuestions();
      } else {
        setTcsError(data.message || "Could not save the question");
      }
    } catch (err) {
      setTcsError("Could not connect to the server");
    } finally {
      setTcsSaving(false);
    }
  };

  const handleCodingTestCaseChange = (i, field, value) => {
    const newTestCases = [...codingForm.testCases];
    newTestCases[i] = { ...newTestCases[i], [field]: value };
    setCodingForm({ ...codingForm, testCases: newTestCases });
  };

  const addTestCaseRow = () => {
    setCodingForm({
      ...codingForm,
      testCases: [...codingForm.testCases, { input: "", expectedOutput: "", isHidden: false }],
    });
  };

  const removeTestCaseRow = (i) => {
    setCodingForm({
      ...codingForm,
      testCases: codingForm.testCases.filter((_, idx) => idx !== i),
    });
  };

  const handleCodingSubmit = async (e) => {
    e.preventDefault();
    setTcsError("");
    if (codingForm.testCases.some((tc) => !tc.input.trim() && !tc.expectedOutput.trim())) {
      setTcsError("Please fill in at least the input/output for every test case row (or remove empty ones)");
      return;
    }
    setTcsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${TCS_API_BASE}/tcs/admin/coding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(codingForm),
      });
      const data = await res.json();
      if (data.success) {
        setCodingForm(EMPTY_CODING_FORM);
        loadTcsQuestions();
      } else {
        setTcsError(data.message || "Could not save the question");
      }
    } catch (err) {
      setTcsError("Could not connect to the server");
    } finally {
      setTcsSaving(false);
    }
  };

  const handleDeleteTcsQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${TCS_API_BASE}/tcs/admin/${tcsSection}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTcsQuestions((qs) => qs.filter((q) => q._id !== id));
      } else {
        setTcsError(data.message || "Could not delete the question");
      }
    } catch (err) {
      setTcsError("Could not connect to the server");
    }
  };

  if (loading) return <div className="admin-loading">⏳ Loading...</div>;

  return (
    <div className="admin-wrapper">

      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>🛡️ Admin Dashboard</h1>
          <p>Syntax Error — Sales Overview</p>
        </div>
        <button onClick={() => navigate("/")} className="admin-back">
          ← Back to Site
        </button>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <span className="admin-stat-icon">👥</span>
          <div><h3>{stats?.totalUsers || 0}</h3><p>Total Users</p></div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">💰</span>
          <div><h3>{stats?.totalPurchases || 0}</h3><p>Total Purchases</p></div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">📚</span>
          <div><h3>{stats?.stats?.length || 0}</h3><p>Active Courses</p></div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">💵</span>
          <div>
            <h3>₹{stats?.stats?.reduce((total, course) =>
              total + course.buyers.reduce((sum, buyer) => sum + (buyer.amount || 0), 0), 0) || 0}
            </h3>
            <p>Est. Revenue</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "12px", margin: "24px 0 16px", flexWrap: "wrap" }}>
        {["sales", "tracking", "grant", "coupons", "tcsprep"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 20px", borderRadius: "8px", border: "none",
              background: activeTab === tab ? "#3b82f6" : "#1e293b",
              color: "white", fontWeight: "600", cursor: "pointer"
            }}
          >
            {tab === "sales" && "📊 Sales"}
            {tab === "tracking" && "🔗 Tracking Links"}
            {tab === "grant" && "🎁 Grant Access"}
            {tab === "coupons" && "🎟️ Coupons"}
            {tab === "tcsprep" && "🎯 TCS Prep"}
          </button>
        ))}
      </div>

      {/* Sales Tab */}
      {activeTab === "sales" && (
        <div className="admin-main">
          <div className="admin-courses">
            <h2>📚 Courses</h2>
            {stats?.stats?.map((course, i) => (
              <div
                key={i}
                className={`admin-course-card ${selectedCourse?.title === course.title ? "active" : ""}`}
                onClick={() => setSelectedCourse(course)}
              >
                <h4>{course.title}</h4>
                <div className="admin-course-meta">
                  <span>👥 {course.totalPurchases} purchases</span>
                  <span>💰 ₹{course.title.includes("Aptitude") ? 99 : 299} per course</span>
                  <span>💵 Total: ₹{course.buyers.reduce((sum, buyer) => sum + (buyer.amount || 0), 0)}</span>
                </div>
                <div className="admin-course-bar">
                  <div
                    className="admin-course-bar-fill"
                    style={{ width: `${Math.min((course.totalPurchases / (stats?.totalPurchases || 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {stats?.stats?.length === 0 && <p className="admin-empty">Abhi koi purchase nahi hua!</p>}
          </div>

          <div className="admin-buyers">
            <h2>👤 Buyers — {selectedCourse?.title}</h2>
            {selectedCourse?.buyers?.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr><th>#</th><th>Name</th><th>Email</th><th>Amount</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {[...selectedCourse.buyers]
                    .sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt))
                    .map((buyer, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{buyer.name}</td>
                      <td>{buyer.email}</td>
                      <td style={{ color: '#4ade80', fontWeight: '600' }}>₹{buyer.amount || 0}</td>
                      <td>{new Date(buyer.purchasedAt).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: true
                      })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="admin-empty">Is course ke liye koi buyer nahi!</p>
            )}
          </div>
        </div>
      )}

      {/* Tracking Tab */}
      {activeTab === "tracking" && (
        <div style={{ padding: "0 0 40px" }}>
          <div style={{ background: "#1e293b", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
            <h2 style={{ color: "white", marginBottom: "16px" }}>🔗 New Tracking Link Banao</h2>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <input
                value={newRefName}
                onChange={e => setNewRefName(e.target.value)}
                placeholder="Link naam likho (e.g. instagram1, whatsapp)"
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: "8px",
                  background: "#0f172a", border: "1px solid #334155",
                  color: "white", fontSize: "14px", minWidth: "200px"
                }}
              />
              <select
                value={selectedPage}
                onChange={e => setSelectedPage(e.target.value)}
                style={{
                  padding: "10px 14px", borderRadius: "8px",
                  background: "#0f172a", border: "1px solid #334155",
                  color: "white", fontSize: "14px"
                }}
              >
                <option value="course-detail/dsa">DSA Course</option>
                <option value="course-detail/aptitude">Aptitude Course</option>
              </select>
            </div>
            {newRefName && (
              <div style={{
                marginTop: "16px", background: "#0f172a", borderRadius: "8px",
                padding: "12px 16px", display: "flex", justifyContent: "space-between",
                alignItems: "center", gap: "12px"
              }}>
                <span style={{ color: "#94a3b8", fontSize: "13px", wordBreak: "break-all" }}>
                  {generateLink()}
                </span>
                <button
                  onClick={() => copyLink(generateLink())}
                  style={{
                    padding: "8px 16px", borderRadius: "6px",
                    background: copiedLink === generateLink() ? "#22c55e" : "#3b82f6",
                    border: "none", color: "white", fontSize: "13px",
                    fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"
                  }}
                >
                  {copiedLink === generateLink() ? "✅ Copied!" : "Copy Link"}
                </button>
              </div>
            )}
          </div>

          <div style={{ background: "#1e293b", borderRadius: "12px", padding: "24px" }}>
            <h2 style={{ color: "white", marginBottom: "16px" }}>📊 Link Performance</h2>
            {refStats && refStats.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr><th>#</th><th>Link / Source</th><th>Registrations</th><th>Copy Link</th></tr>
                </thead>
                <tbody>
                  {[...refStats].sort((a, b) => b.count - a.count).map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td style={{ color: "#3b82f6", fontWeight: "600" }}>{item._id}</td>
                      <td>{item.count}</td>
                      <td>
                        <button
                          onClick={() => copyLink(`https://syntaxerrorr.com/course-detail/dsa?ref=${item._id}`)}
                          style={{
                            padding: "4px 10px", borderRadius: "4px",
                            background: "#334155", border: "none",
                            color: "white", fontSize: "11px", cursor: "pointer"
                          }}
                        >
                          {copiedLink.includes(item._id) ? "✅ Copied!" : "Copy"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="admin-empty">Abhi koi tracking data nahi hai — pehle koi link share karo!</p>
            )}
          </div>
        </div>
      )}

      {/* Grant Access Tab */}
      {activeTab === "grant" && (
        <div style={{ padding: "0 0 40px" }}>
          <div style={{ background: "#1e293b", borderRadius: "12px", padding: "24px", maxWidth: "520px" }}>
            <h2 style={{ color: "white", marginBottom: "8px" }}>🎁 Kisi ko Free Access Do</h2>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "24px" }}>
              User ka email aur course select karo — directly unke account mein add ho jaayega.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <input
                value={grantEmail}
                onChange={e => setGrantEmail(e.target.value)}
                placeholder="User ka email (e.g. student@gmail.com)"
                style={{
                  padding: "12px 14px", borderRadius: "8px",
                  background: "#0f172a", border: "1px solid #334155",
                  color: "white", fontSize: "14px"
                }}
              />
              <select
                value={grantCourse}
                onChange={e => setGrantCourse(e.target.value)}
                style={{
                  padding: "12px 14px", borderRadius: "8px",
                  background: "#0f172a", border: "1px solid #334155",
                  color: "white", fontSize: "14px"
                }}
              >
                {COURSES.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
              <button
                onClick={handleGrantAccess}
                disabled={grantLoading}
                style={{
                  padding: "12px", borderRadius: "8px", border: "none",
                  background: grantLoading ? "#334155" : "#22c55e",
                  color: "white", fontWeight: "700", fontSize: "15px",
                  cursor: grantLoading ? "not-allowed" : "pointer"
                }}
              >
                {grantLoading ? "⏳ De raha hoon..." : "✅ Access Do"}
              </button>
              {grantMsg && (
                <div style={{
                  padding: "12px 16px", borderRadius: "8px",
                  background: grantMsg.type === "success" ? "#14532d" : "#450a0a",
                  color: grantMsg.type === "success" ? "#4ade80" : "#f87171",
                  fontSize: "14px", fontWeight: "600"
                }}>
                  {grantMsg.text}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Coupons Tab */}
      {activeTab === "coupons" && (
        <div style={{ padding: "0 0 40px" }}>

          {/* Create coupon form */}
          <div style={{ background: "#1e293b", borderRadius: "12px", padding: "24px", marginBottom: "24px", maxWidth: "640px" }}>
            <h2 style={{ color: "white", marginBottom: "16px" }}>🎟️ Naya Coupon Banao</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ color: "#94a3b8", fontSize: "13px", display: "block", marginBottom: "8px" }}>
                  Coupon Code
                </label>
                <input
                  value={couponForm.code}
                  onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. DIWALI50"
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: "8px",
                    background: "#0f172a", border: "1px solid #334155",
                    color: "white", fontSize: "14px"
                  }}
                />
              </div>

              <div>
                <label style={{ color: "#94a3b8", fontSize: "13px", display: "block", marginBottom: "8px" }}>
                  Discount Percentage (%)
                </label>
                <input
                  type="number"
                  value={couponForm.discountValue}
                  onChange={e => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                  placeholder="e.g. 50 (matlab 50% off)"
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: "8px",
                    background: "#0f172a", border: "1px solid #334155",
                    color: "white", fontSize: "14px"
                  }}
                />
              </div>

              <div>
                <label style={{ color: "#94a3b8", fontSize: "13px", display: "block", marginBottom: "8px" }}>
                  Kitne users use kar sakte hain?
                </label>
                <input
                  type="number"
                  value={couponForm.usageLimit}
                  onChange={e => setCouponForm({ ...couponForm, usageLimit: e.target.value })}
                  placeholder="e.g. 100 (blank chhodo agar unlimited chahiye)"
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: "8px",
                    background: "#0f172a", border: "1px solid #334155",
                    color: "white", fontSize: "14px"
                  }}
                />
              </div>

              <div>
                <label style={{ color: "#94a3b8", fontSize: "13px", display: "block", marginBottom: "8px" }}>
                  Ye coupon kahan chalega?
                </label>
                <select
                  value={couponForm.applicableTo}
                  onChange={e => setCouponForm({ ...couponForm, applicableTo: e.target.value })}
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: "8px",
                    background: "#0f172a", border: "1px solid #334155",
                    color: "white", fontSize: "14px"
                  }}
                >
                  <option value="all">✅ Sabhi Courses par</option>
                  <option value="specific">🎯 Sirf select kiye hue courses par</option>
                </select>
              </div>

              {couponForm.applicableTo === "specific" && (
                <div style={{ background: "#0f172a", borderRadius: "8px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {COURSES.map((course, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "center", gap: "10px", color: "#e2e8f0", fontSize: "13px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={couponForm.courseTitles.includes(course)}
                        onChange={() => toggleCourseInForm(course)}
                      />
                      {course}
                    </label>
                  ))}
                </div>
              )}

              <div>
                <label style={{ color: "#94a3b8", fontSize: "13px", display: "block", marginBottom: "8px" }}>
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={couponForm.expiryDate}
                  onChange={e => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: "8px",
                    background: "#0f172a", border: "1px solid #334155",
                    color: "white", fontSize: "14px"
                  }}
                />
              </div>

              <button
                onClick={handleCreateCoupon}
                disabled={couponSaving}
                style={{
                  padding: "12px", borderRadius: "8px", border: "none",
                  background: couponSaving ? "#334155" : "#22c55e",
                  color: "white", fontWeight: "700", fontSize: "15px",
                  cursor: couponSaving ? "not-allowed" : "pointer"
                }}
              >
                {couponSaving ? "⏳ Ban raha hoon..." : "✅ Coupon Banao"}
              </button>

              {couponMsg && (
                <div style={{
                  padding: "12px 16px", borderRadius: "8px",
                  background: couponMsg.type === "success" ? "#14532d" : "#450a0a",
                  color: couponMsg.type === "success" ? "#4ade80" : "#f87171",
                  fontSize: "14px", fontWeight: "600"
                }}>
                  {couponMsg.text}
                </div>
              )}
            </div>
          </div>

          {/* Coupons list */}
          <div style={{ background: "#1e293b", borderRadius: "12px", padding: "24px" }}>
            <h2 style={{ color: "white", marginBottom: "16px" }}>📋 Sabhi Coupons</h2>
            {couponsLoading ? (
              <p className="admin-empty">⏳ Loading...</p>
            ) : coupons.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code</th><th>Discount</th><th>Applicable</th>
                    <th>Used</th><th>Expiry</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => {
                    const expired = new Date() > new Date(c.expiryDate);
                    return (
                      <tr key={c._id}>
                        <td style={{ color: "#3b82f6", fontWeight: "700" }}>{c.code}</td>
                        <td>{c.discountValue}%</td>
                        <td style={{ fontSize: "12px" }}>
                          {c.applicableTo === "all" ? "Sabhi Courses" : `${c.courseTitles.length} course(s)`}
                        </td>
                        <td>{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                        <td style={{ fontSize: "12px" }}>
                          {new Date(c.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td>
                          {expired ? (
                            <span style={{ color: "#f87171", fontSize: "12px", fontWeight: "700" }}>Expired</span>
                          ) : c.isActive ? (
                            <span style={{ color: "#4ade80", fontSize: "12px", fontWeight: "700" }}>Active</span>
                          ) : (
                            <span style={{ color: "#94a3b8", fontSize: "12px", fontWeight: "700" }}>Inactive</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              onClick={() => handleToggleCoupon(c._id)}
                              style={{
                                padding: "4px 10px", borderRadius: "4px",
                                background: "#334155", border: "none",
                                color: "white", fontSize: "11px", cursor: "pointer"
                              }}
                            >
                              {c.isActive ? "Disable" : "Enable"}
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(c._id, c.code)}
                              style={{
                                padding: "4px 10px", borderRadius: "4px",
                                background: "#450a0a", border: "none",
                                color: "#f87171", fontSize: "11px", cursor: "pointer"
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="admin-empty">Abhi koi coupon nahi bana — upar se bana lo!</p>
            )}
          </div>
        </div>
      )}

      {/* TCS Prep Tab */}
      {activeTab === "tcsprep" && (
        <div style={{ padding: "0 0 40px" }}>

          {/* Section switcher */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            {["aptitude", "cshr", "coding"].map((sec) => (
              <button
                key={sec}
                onClick={() => setTcsSection(sec)}
                style={{
                  padding: "8px 18px", borderRadius: "8px", border: "1px solid #334155",
                  background: tcsSection === sec ? "#22c55e" : "#1e293b",
                  color: "white", fontWeight: "600", cursor: "pointer"
                }}
              >
                {sec === "aptitude" && "🧮 Aptitude"}
                {sec === "cshr" && "🧠 CS + HR + GenAI"}
                {sec === "coding" && "💻 Coding"}
              </button>
            ))}
          </div>

          {tcsError && (
            <div style={{ background: "#450a0a", color: "#f87171", padding: "10px 16px", borderRadius: "8px", marginBottom: "16px" }}>
              {tcsError}
            </div>
          )}

          {/* ---------- Aptitude / CS+HR (MCQ) form ---------- */}
            {tcsSection === "aptitude" && <AdminTcsAptitude apiBase={TCS_API_BASE} />}
{tcsSection === "cshr" && <AdminTcsCsHr apiBase={TCS_API_BASE} />}

          {/* ---------- Coding form ---------- */}
          {tcsSection === "coding" && (
            <form
              onSubmit={handleCodingSubmit}
              style={{
                background: "#1e293b", borderRadius: "12px", padding: "24px",
                marginBottom: "24px", maxWidth: "720px", display: "flex",
                flexDirection: "column", gap: "14px"
              }}
            >
              <h2 style={{ color: "white", margin: 0 }}>Add New Coding Question</h2>

              <div>
                <label style={labelStyle}>Title</label>
                <input value={codingForm.title} onChange={e => setCodingForm({ ...codingForm, title: e.target.value })} required style={fieldStyle} />
              </div>

              <div>
                <label style={labelStyle}>Slug (unique, e.g. "two-sum")</label>
                <input value={codingForm.slug} onChange={e => setCodingForm({ ...codingForm, slug: e.target.value })} required style={fieldStyle} />
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={codingForm.description} onChange={e => setCodingForm({ ...codingForm, description: e.target.value })} required rows={3} style={fieldStyle} />
              </div>

              <div>
                <label style={labelStyle}>Difficulty</label>
                <select value={codingForm.difficulty} onChange={e => setCodingForm({ ...codingForm, difficulty: e.target.value })} style={fieldStyle}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Input Format</label>
                <textarea value={codingForm.inputFormat} onChange={e => setCodingForm({ ...codingForm, inputFormat: e.target.value })} rows={2} style={fieldStyle} />
              </div>

              <div>
                <label style={labelStyle}>Constraints</label>
                <textarea value={codingForm.constraints} onChange={e => setCodingForm({ ...codingForm, constraints: e.target.value })} rows={2} style={fieldStyle} />
              </div>

              <div>
                <label style={labelStyle}>Hint (optional)</label>
                <input value={codingForm.hint} onChange={e => setCodingForm({ ...codingForm, hint: e.target.value })} style={fieldStyle} />
              </div>

              <div>
                <label style={labelStyle}>Explanation (shown after all test cases pass)</label>
                <textarea value={codingForm.explanation} onChange={e => setCodingForm({ ...codingForm, explanation: e.target.value })} rows={2} style={fieldStyle} />
              </div>

              <div>
                <label style={labelStyle}>Points</label>
                <input type="number" value={codingForm.points} onChange={e => setCodingForm({ ...codingForm, points: Number(e.target.value) })} min={1} style={fieldStyle} />
              </div>

              <div>
                <label style={{ ...labelStyle, marginBottom: "10px" }}>Test Cases</label>
                {codingForm.testCases.map((tc, i) => (
                  <div key={i} style={{ background: "#0f172a", borderRadius: "8px", padding: "12px", marginBottom: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <textarea
                      placeholder="Input"
                      value={tc.input}
                      onChange={e => handleCodingTestCaseChange(i, "input", e.target.value)}
                      rows={2}
                      style={fieldStyle}
                    />
                    <textarea
                      placeholder="Expected Output"
                      value={tc.expectedOutput}
                      onChange={e => handleCodingTestCaseChange(i, "expectedOutput", e.target.value)}
                      rows={2}
                      style={fieldStyle}
                    />
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#94a3b8", fontSize: "13px" }}>
                      <input
                        type="checkbox"
                        checked={tc.isHidden}
                        onChange={e => handleCodingTestCaseChange(i, "isHidden", e.target.checked)}
                      />
                      Hidden (not shown to students as a sample)
                    </label>
                    {codingForm.testCases.length > 1 && (
                      <button type="button" onClick={() => removeTestCaseRow(i)} style={{ alignSelf: "flex-start", background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "13px" }}>
                        Remove this test case
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addTestCaseRow} style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #334155", background: "transparent", color: "white", cursor: "pointer", fontSize: "13px" }}>
                  + Add Another Test Case
                </button>
              </div>

              <button
                type="submit"
                disabled={tcsSaving}
                style={{
                  padding: "12px", borderRadius: "8px", border: "none",
                  background: tcsSaving ? "#334155" : "#22c55e",
                  color: "white", fontWeight: "700", fontSize: "15px",
                  cursor: tcsSaving ? "not-allowed" : "pointer"
                }}
              >
                {tcsSaving ? "Saving..." : "Add Question"}
              </button>
            </form>
          )}

          {/* ---------- Existing questions list ---------- */}
         <div style={{ background: "#1e293b", borderRadius: "12px",   padding: "24px", maxWidth: "760px", display: (tcsSection === "aptitude" || tcsSection === "cshr") ? "none" : "block" }}>
            <h2 style={{ color: "white", marginBottom: "16px" }}>
              Existing {tcsSection === "aptitude" ? "Aptitude" : tcsSection === "cshr" ? "CS + HR + GenAI" : "Coding"} Questions ({tcsQuestions.length})
            </h2>
            {tcsLoading ? (
              <p className="admin-empty">⏳ Loading...</p>
            ) : tcsQuestions.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {tcsQuestions.map((q) => (
                  <div
                    key={q._id}
                    style={{
                      border: "1px solid #334155", borderRadius: "8px", padding: "12px 16px",
                      display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px"
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {q.topic || q.category || q.difficulty}
                      </span>
                      <p style={{ margin: "4px 0", color: "white" }}>{q.question || q.title}</p>
                      {q.options && (
                        <p style={{ margin: 0, fontSize: "13px", color: "#4ade80" }}>
                          Correct: {q.options[q.correctIndex]}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteTcsQuestion(q._id)}
                      style={{
                        padding: "6px 12px", borderRadius: "6px", border: "1px solid #ef4444",
                        background: "transparent", color: "#ef4444", cursor: "pointer",
                        whiteSpace: "nowrap", fontSize: "13px"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="admin-empty">No questions yet — add one above!</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

const fieldStyle = {
  width: "100%", padding: "10px 12px", borderRadius: "8px",
  background: "#0f172a", border: "1px solid #334155",
  color: "white", fontSize: "14px",
};

const labelStyle = {
  color: "#94a3b8", fontSize: "13px", display: "block", marginBottom: "8px",
};

export default AdminDashboard;