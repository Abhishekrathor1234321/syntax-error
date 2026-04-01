import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [refStats, setRefStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("sales");
  const [newRefName, setNewRefName] = useState("");
  const [selectedPage, setSelectedPage] = useState("course-detail/dsa");
  const [copiedLink, setCopiedLink] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      try {
        // Sales fetch
        const res = await fetch("https://syntax-error-1xds.vercel.app/admin/purchases", {
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

        // Ref stats fetch
        const refRes = await fetch("https://syntax-error-1xds.vercel.app/admin/ref-stats", {
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

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(""), 2000);
  };

  const generateLink = () => {
    if (!newRefName.trim()) return "";
    return `https://syntaxerrorr.com/${selectedPage}?ref=${newRefName.trim().toLowerCase().replace(/\s+/g, "-")}`;
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
          <div>
            <h3>{stats?.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">💰</span>
          <div>
            <h3>{stats?.totalPurchases || 0}</h3>
            <p>Total Purchases</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">📚</span>
          <div>
            <h3>{stats?.stats?.length || 0}</h3>
            <p>Active Courses</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">💵</span>
          <div>
            <h3>₹{stats?.stats?.reduce((total, course) => {
              return total + course.buyers.reduce((sum, buyer) => sum + (buyer.amount || 0), 0);
            }, 0) || 0}</h3>
            <p>Est. Revenue</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "12px", margin: "24px 0 16px" }}>
        <button
          onClick={() => setActiveTab("sales")}
          style={{
            padding: "8px 20px", borderRadius: "8px", border: "none",
            background: activeTab === "sales" ? "#3b82f6" : "#1e293b",
            color: "white", fontWeight: "600", cursor: "pointer"
          }}
        >📊 Sales</button>
        <button
          onClick={() => setActiveTab("tracking")}
          style={{
            padding: "8px 20px", borderRadius: "8px", border: "none",
            background: activeTab === "tracking" ? "#3b82f6" : "#1e293b",
            color: "white", fontWeight: "600", cursor: "pointer"
          }}
        >🔗 Tracking Links</button>
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
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
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

          {/* Link Generator */}
          <div style={{
            background: "#1e293b", borderRadius: "12px", padding: "24px", marginBottom: "24px"
          }}>
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

          {/* Ref Stats */}
          <div style={{ background: "#1e293b", borderRadius: "12px", padding: "24px" }}>
            <h2 style={{ color: "white", marginBottom: "16px" }}>📊 Link Performance</h2>
            {refStats && refStats.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Link / Source</th>
                    <th>Registrations</th>
                    <th>Copy Link</th>
                  </tr>
                </thead>
                <tbody>
                  {[...refStats]
                    .sort((a, b) => b.count - a.count)
                    .map((item, i) => (
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
    </div>
  );
}

export default AdminDashboard;