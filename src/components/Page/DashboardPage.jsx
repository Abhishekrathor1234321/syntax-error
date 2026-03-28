import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

const notesPdfMap = {
  "HTML Handwritten Notes": "notes/HTML.pdf",
  "CSS Handwritten Notes": "notes/CSS.pdf",
  "JavaScript Handwritten Notes": "notes/JavaScript.pdf",
  "Tailwind CSS Handwritten Notes": "notes/Tailwind Css.pdf",
  "Bootstrap Handwritten Notes": "notes/Boostrap.pdf",
  "Python with DSA Handwritten Notes": "notes/DSA with python.pdf",
  "SQL Mastery Notes": "notes/SQL interview questions.pdf",
  "MERN Stack Handwritten Notes": "notes/MERN stack.pdf",
  "C++ with DSA Handwritten Notes": "notes/C++ dsa.pdf",
  "HR Interview Questions": "notes/hr for freshers.pdf",
  "DBMS Interview Question": "notes/DBMS interview question.pdf",
  "Computer Network Interview Question": "notes/computer networks interview.pdf",
  "Operating System": "notes/oprating system interview question.pdf",
};

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const userName = localStorage.getItem("user");

      if (!token) {
        navigate("/login");
        return;
      }

      if (userName && !token.startsWith("ey")) {
        setUser({
          name: userName,
          email: "",
          downloadedNotes: [],
          purchasedCourses: []
        });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://syntax-error-1xds.vercel.app/user/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="dash-loading">⏳ Loading...</div>;

  return (
    <div className="dash-wrapper">
      {/* Sidebar */}
      <div className="dash-sidebar">
        <div className="dash-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <h3 className="dash-name">{user?.name}</h3>
        <p className="dash-email">{user?.email}</p>

        <div className="dash-menu">
          <button
            className={`dash-menu-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview
          </button>
          <button
            className={`dash-menu-item ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            📥 Downloaded Notes
          </button>
          <button
            className={`dash-menu-item ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            🎓 My Courses
          </button>
          <button
            className={`dash-menu-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dash-main">

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
            <h1 className="dash-heading">Welcome back, {user?.name}! 👋</h1>

            <div className="dash-stats">
              <div className="dash-stat-card">
                <span className="stat-icon">📥</span>
                <div>
                  <h4>{user?.downloadedNotes?.length || 0}</h4>
                  <p>Notes Downloaded</p>
                </div>
              </div>
              <div className="dash-stat-card">
                <span className="stat-icon">🎓</span>
                <div>
                  <h4>{user?.purchasedCourses?.length || 0}</h4>
                  <p>Courses Enrolled</p>
                </div>
              </div>
              <div className="dash-stat-card">
                <span className="stat-icon">🔥</span>
                <div>
                  <h4>Active</h4>
                  <p>Account Status</p>
                </div>
              </div>
            </div>

            {/* Recent Downloads */}
            <div className="dash-section">
              <h2>📥 Recently Downloaded Notes</h2>
              {user?.downloadedNotes?.length > 0 ? (
                <div className="dash-notes-list">
                  {[...user.downloadedNotes].reverse().slice(0, 5).map((note, i) => (
                    <div className="dash-note-item" key={i}>
                      <span className="dash-note-tag">{note.category}</span>
                      <span className="dash-note-title">{note.title}</span>
                      <div className="dash-note-actions">
                        <span className="dash-note-date">
                          {new Date(note.downloadedAt).toLocaleDateString()}
                        </span>
                        {notesPdfMap[note.title] && (
                          <button
                            className="dash-view-btn"
                            onClick={() => window.open(`/${notesPdfMap[note.title]}`, "_blank")}
                          >
                            👁️ View
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="dash-empty">
                  Abhi koi notes download nahi kiye!
                  <span onClick={() => navigate("/notes")}> Notes dekho →</span>
                </p>
              )}
            </div>

            {/* Recent Courses */}
            {user?.purchasedCourses?.length > 0 && (
              <div className="dash-section">
                <h2>🎓 My Courses</h2>
                <div className="dash-notes-list">
                  {user.purchasedCourses.slice(0, 3).map((course, i) => (
                    <div className="dash-note-item" key={i}>
                      <span className="dash-note-tag">Course</span>
                      <span className="dash-note-title">{course.title}</span>
                      <div className="dash-note-actions">
                        <span className="dash-note-date">
                          {new Date(course.purchasedAt).toLocaleDateString()}
                        </span>
                        <button
                          className="dash-view-btn"
                          onClick={() => navigate(`/course/${encodeURIComponent(course.title)}`)}
                        >
                          ▶️ Watch Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* DOWNLOADED NOTES TAB */}
        {activeTab === "notes" && (
          <>
            <h1 className="dash-heading">📥 Downloaded Notes</h1>
            <div className="dash-section">
              {user?.downloadedNotes?.length > 0 ? (
                <div className="dash-notes-list">
                  {[...user.downloadedNotes].reverse().map((note, i) => (
                    <div className="dash-note-item" key={i}>
                      <span className="dash-note-tag">{note.category}</span>
                      <span className="dash-note-title">{note.title}</span>
                      <div className="dash-note-actions">
                        <span className="dash-note-date">
                          {new Date(note.downloadedAt).toLocaleDateString()}
                        </span>
                        {notesPdfMap[note.title] && (
                          <>
                            <button
                              className="dash-view-btn"
                              onClick={() => window.open(`/${notesPdfMap[note.title]}`, "_blank")}
                            >
                              👁️ View
                            </button>
                            <a
                              href={`/${notesPdfMap[note.title]}`}
                              download
                              className="dash-download-btn"
                            >
                              ⬇️ Download
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="dash-empty">
                  Abhi koi notes download nahi kiye!
                  <span onClick={() => navigate("/notes")}> Notes dekho →</span>
                </p>
              )}
            </div>
          </>
        )}

        {/* COURSES TAB */}
        {activeTab === "courses" && (
          <>
            <h1 className="dash-heading">🎓 My Courses</h1>
            <div className="dash-section">
              {user?.purchasedCourses?.length > 0 ? (
                <div className="dash-notes-list">
                  {user.purchasedCourses.map((course, i) => (
                    <div className="dash-note-item" key={i}>
                      <span className="dash-note-tag">Course</span>
                      <span className="dash-note-title">{course.title}</span>
                      <div className="dash-note-actions">
                        <span className="dash-note-date">
                          {new Date(course.purchasedAt).toLocaleDateString()}
                        </span>
                        <button
                          className="dash-view-btn"
                          onClick={() => navigate(`/course/${encodeURIComponent(course.title)}`)}
                        >
                          ▶️ Watch Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="dash-empty">
                  No course enrolled yet!
                  <span onClick={() => navigate("/courses")}> Courses dekho →</span>
                </p>
              )}
            </div>
          </>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <>
            <h1 className="dash-heading">⚙️ Settings</h1>
            <div className="dash-section">
              <div className="dash-settings">
                <div className="dash-setting-item">
                  <label>Full Name</label>
                  <input type="text" defaultValue={user?.name} disabled />
                </div>
                <div className="dash-setting-item">
                  <label>Email Address</label>
                  <input type="email" defaultValue={user?.email} disabled />
                </div>
                <button
                  className="dash-logout-btn"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                    window.location.reload();
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default DashboardPage;