import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      try {
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
  const price = course.title.includes("Aptitude") ? 99 : 299;
  return total + (course.totalPurchases * price);
}, 0) || 0}</h3>
            <p>Est. Revenue</p>
          </div>
        </div>
      </div>

      <div className="admin-main">

        {/* Left — Course List */}
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
  <span>💵 Total: ₹{course.totalPurchases * (course.title.includes("Aptitude") ? 99 : 299)}</span>
</div>
              <div className="admin-course-bar">
                <div
                  className="admin-course-bar-fill"
                  style={{ width: `${Math.min((course.totalPurchases / (stats?.totalPurchases || 1)) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
          {stats?.stats?.length === 0 && (
            <p className="admin-empty">Abhi koi purchase nahi hua!</p>
          )}
        </div>

        {/* Right — Buyers List */}
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
                      <td style={{color: '#4ade80', fontWeight: '600'}}>
    ₹{selectedCourse?.title?.includes("Aptitude") ? 99 : 299}
  </td>
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
    </div>
  );
}

export default AdminDashboard;