import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CoursePage.css";

const APTITUDE_NOTES_LINK = "https://drive.google.com/drive/folders/1OpXdp-roAVNNb59J8cbZ8wdtB6QO1Aiq";

const courseData = {
  "Complete Aptitude Course 2026": {
    title: "Complete Aptitude Course 2026",
    instructor: "Karina Sharma [Infosys-DSE]",
    sections: [
      {
        title: "📊 Section 1 — Arithmetic Fundamentals",
        lectures: [
          { id: 1, title: "Percentage — Concepts & Tricks", videoId: "XFcapf8Mx2c", duration: "" },
          { id: 2, title: "Ratio & Proportion", videoId: "Xv38cd1u5_o", duration: "" },
          { id: 3, title: "Age Problems — Part 1", videoId: "cWhm6yyH24w", duration: "" },
          { id: 4, title: "Age Problems — Part 2", videoId: "d7d09-3O_ro", duration: "" },
          { id: 5, title: "Partnership", videoId: "FtOA4G3tvwI", duration: "" },
          { id: 6, title: "Average", videoId: "fELiGdlv7aE", duration: "" },
          { id: 7, title: "Chain Rule", videoId: "iVgxR8uUOUw", duration: "" },
          { id: 8, title: "Pipes & Cisterns", videoId: "vZKu8YGF7Dw", duration: "" },
        ]
      },
      {
        title: "🔢 Section 2 — Number System & Profit",
        lectures: [
          { id: 9, title: "Number System — Fundamentals", videoId: "a6MOQA3twYo", duration: "" },
          { id: 10, title: "Number System (Contd.) & Profit & Loss Intro", videoId: "uV_mQFfEAbI", duration: "" },
          { id: 11, title: "Profit & Loss — Complete", videoId: "lF-mKVjsMqo", duration: "" },
          { id: 12, title: "HCF & LCM", videoId: "ulU9r9utLA4", duration: "" },
          { id: 13, title: "AP & GP — Part 1", videoId: "KyFarnOr520", duration: "" },
          { id: 14, title: "AP & GP — Part 2", videoId: "tLKpfJb_5DQ", duration: "" },
        ]
      },
      {
        title: "🚀 Section 3 — Speed, Time & Interest",
        lectures: [
          { id: 15, title: "Speed, Distance & Time + Boats & Trains", videoId: "6FfM2JwZkTo", duration: "" },
          { id: 16, title: "Speed, Distance & Time — Practice Session", videoId: "UtauJ_7fXfQ", duration: "" },
          { id: 17, title: "Simple & Compound Interest — Part 1", videoId: "griZ5k8tg_0", duration: "" },
          { id: 18, title: "Simple & Compound Interest — Part 2", videoId: "a_8POPBwY6I", duration: "" },
        ]
      },
      {
        title: "🧠 Section 4 — Reasoning",
        lectures: [
          { id: 19, title: "Blood Relations", videoId: "r0beKnDn7WU", duration: "" },
          { id: 20, title: "Calendar Problems", videoId: "DiDg2wmcqsk", duration: "" },
          { id: 21, title: "Clock Problems", videoId: "-pvs8XLRstw", duration: "" },
          { id: 22, title: "Coding & Decoding", videoId: "BTxThoQiReQ", duration: "" },
          { id: 23, title: "Direction Sense", videoId: "PazYmtyCBi4", duration: "" },
          { id: 24, title: "Seating Arrangement", videoId: "aViI3dCm_Xs", duration: "" },
          { id: 25, title: "Statement & Assumptions", videoId: "CGDCUVq8irk", duration: "" },
          { id: 26, title: "Data Sufficiency", videoId: "9WVr7OXYfrY", duration: "" },
        ]
      },
      {
        title: "📐 Section 5 — Advanced Topics",
        lectures: [
          { id: 27, title: "Permutations & Combinations", videoId: "jzg1nOrZq9g", duration: "" },
          { id: 28, title: "Probability", videoId: "TX-63y4VoTk", duration: "" },
          { id: 29, title: "Number Series & Counting Figures", videoId: "yU39-hz5MtI", duration: "" },
          { id: 30, title: "Statistics (Bonus)", videoId: "RvKCm7vNXDs", duration: "" },
        ]
      }
    ]
  }
};

function AptitudeCoursePage() {
  const { courseTitle } = useParams();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [activeSection, setActiveSection] = useState(0);

  // ✅ Ref for content div scroll
  const contentRef = useRef(null);

  const decodedTitle = decodeURIComponent(courseTitle);
  const course = courseData[decodedTitle];

  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      try {
        const res = await fetch("https://syntax-error-1xds.vercel.app/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const purchased = data.user.purchasedCourses?.some(
            c => c.title === decodedTitle
          );
          if (purchased) {
            setHasAccess(true);
            if (course?.sections?.[0]?.lectures?.[0]) {
              setCurrentLecture(course.sections[0].lectures[0]);
            }
          } else {
            navigate("/courses");
          }
        }
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    checkAccess();
  }, []);

  // ✅ Auto scroll to top — mobile + desktop dono ke liye
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCompleted = (lectureId) => {
    setCompletedLectures(prev =>
      prev.includes(lectureId)
        ? prev.filter(id => id !== lectureId)
        : [...prev, lectureId]
    );
  };

  const getVideoId = (videoId) => {
    if (!videoId) return null;
    if (videoId.startsWith("YOUR_VIDEO")) return null;
    if (videoId.includes("youtu.be/")) return videoId.split("youtu.be/")[1].split("?")[0];
    if (videoId.includes("watch?v=")) return videoId.split("watch?v=")[1].split("&")[0];
    return videoId;
  };

  const totalLectures = course?.sections?.reduce((acc, s) => acc + s.lectures.length, 0) || 0;
  const progress = Math.round((completedLectures.length / totalLectures) * 100);
  const allLectures = course?.sections?.flatMap(s => s.lectures) || [];
  const currentIndex = allLectures.findIndex(l => l.id === currentLecture?.id);

  if (loading) return <div className="cp-loading">⏳ Loading...</div>;
  if (!hasAccess || !course) return null;

  return (
    <div className="cp-wrapper">

      {/* Top Bar */}
      <div className="cp-topbar">
        <button onClick={() => navigate("/dashboard")} className="cp-back">
          ← Dashboard
        </button>
        <h2 className="cp-topbar-title">{course.title}</h2>
        <div className="cp-progress-wrap">
          <div className="cp-progress-bar">
            <div className="cp-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="cp-progress-text">{progress}% Complete</span>
        </div>
      </div>

      <div className="cp-main">

        {/* Left — Content */}
        <div className="cp-content" ref={contentRef}>

          {/* Video Player */}
          <div className="cp-video-container">
            {getVideoId(currentLecture?.videoId) ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${getVideoId(currentLecture.videoId)}?rel=0&modestbranding=1&origin=https://syntaxerrorr.com`}
                title={currentLecture.title}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                className="cp-video"
                style={{ border: "none" }}
              />
            ) : (
              <div className="cp-video-placeholder">
                <span>🎬</span>
                <p>Video Coming Soon</p>
              </div>
            )}
          </div>

          {/* Lecture Info */}
          <div className="cp-lecture-info">
            <h2 className="cp-lecture-title">{currentLecture?.title}</h2>
            <div className="cp-lecture-meta">
              <span>👩‍🏫 {course.instructor}</span>
              <span>📖 Lecture {currentIndex + 1} of {totalLectures}</span>
              <button
                className={`cp-complete-btn ${completedLectures.includes(currentLecture?.id) ? "completed" : ""}`}
                onClick={() => toggleCompleted(currentLecture?.id)}
              >
                {completedLectures.includes(currentLecture?.id) ? "✅ Completed" : "○ Mark as Complete"}
              </button>
            </div>
          </div>

          {/* Notes Section */}
          <div className="cp-notes-section">
            <div className="cp-notes-header">
              <h3>📚 Course Notes & Resources</h3>
            </div>
            <p className="cp-notes-desc">
              All lecture notes are available in our Google Drive folder.
            </p>
            <a
              href={APTITUDE_NOTES_LINK}
              target="_blank"
              rel="noreferrer"
              className="cp-notes-btn"
            >
              📂 Open Notes Folder — All PDFs
            </a>
          </div>

          {/* Navigation */}
          <div className="cp-nav-btns">
            <button
              className="cp-nav-btn"
              disabled={currentIndex === 0}
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentLecture(allLectures[currentIndex - 1]);
                  scrollToTop(); // ✅
                }
              }}
            >
              ← Previous
            </button>
            <span className="cp-lecture-count">
              {currentIndex + 1} / {totalLectures}
            </span>
            <button
              className="cp-nav-btn primary"
              disabled={currentIndex === allLectures.length - 1}
              onClick={() => {
                if (currentIndex < allLectures.length - 1) {
                  toggleCompleted(currentLecture?.id);
                  setCurrentLecture(allLectures[currentIndex + 1]);
                  scrollToTop(); // ✅
                }
              }}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Right — Sidebar */}
        <div className="cp-sidebar">
          <div className="cp-sidebar-header">
            <h3>📋 Course Content</h3>
            <span>{totalLectures} Lectures</span>
          </div>

          <div className="cp-progress-mini">
            <div className="cp-progress-mini-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="cp-progress-mini-text">
            {completedLectures.length}/{totalLectures} completed
          </p>

          <div className="cp-sections">
            {course.sections.map((section, sIndex) => (
              <div key={sIndex} className="cp-section">
                <button
                  className={`cp-section-header ${activeSection === sIndex ? "open" : ""}`}
                  onClick={() => setActiveSection(activeSection === sIndex ? -1 : sIndex)}
                >
                  <span>{section.title}</span>
                  <span className="cp-section-arrow">
                    {activeSection === sIndex ? "▲" : "▼"}
                  </span>
                </button>

                {activeSection === sIndex && (
                  <div className="cp-lectures">
                    {section.lectures.map((lecture) => (
                      <button
                        key={lecture.id}
                        className={`cp-lecture-item 
                          ${currentLecture?.id === lecture.id ? "active" : ""} 
                          ${completedLectures.includes(lecture.id) ? "done" : ""}`}
                        onClick={() => {
                          setCurrentLecture(lecture);
                          scrollToTop(); // ✅
                        }}
                      >
                        <span className="cp-lecture-icon">
                          {completedLectures.includes(lecture.id)
                            ? "✅"
                            : currentLecture?.id === lecture.id
                            ? "▶️"
                            : "○"}
                        </span>
                        <div className="cp-lecture-details">
                          <span className="cp-lecture-name">{lecture.title}</span>
                          {lecture.duration && (
                            <span className="cp-lecture-dur">⏱ {lecture.duration}</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AptitudeCoursePage;