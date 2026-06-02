import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CoursePage.css";

const courseData = {
  "TCS PYQ Practice — DSA + Aptitude 2026": {
    title: "TCS PYQ Practice — DSA + Aptitude 2026",
    instructor: "Abhishek Rathor[Founder of SYNTAX ERROR] & Karina Sharma [Infosys-DSE]",
    sections: [
      {
        title: "📐 Section 1 - Aptitude PYQ",
        lectures: [
          { id: 1,  title: "Part-1",  videoId: "XFcapf8Mx2c", duration: "" },
          { id: 2,  title: "Part-2",  videoId: "Xv38cd1u5_o", duration: "" },
          { id: 3,  title: "Part-3",  videoId: "cWhm6yyH24w", duration: "" },
          { id: 4,  title: "Part-4",  videoId: "d7d09-3O_ro", duration: "" },
          { id: 5,  title: "Part-5",  videoId: "FtOA4G3tvwI", duration: "" },
          { id: 6,  title: "Part-6",  videoId: "fELiGdlv7aE", duration: "" },
          { id: 7,  title: "Part-7",  videoId: "iVgxR8uUOUw", duration: "" },
          { id: 8,  title: "Part-8",  videoId: "vZKu8YGF7Dw", duration: "" },
          { id: 9,  title: "Part-9",  videoId: "a6MOQA3twYo", duration: "" },
          { id: 10, title: "Part-10", videoId: "uV_mQFfEAbI", duration: "" },
        ]
      },
      {
        title: "🔢 Section 2 — DSA Easy[10]",
        lectures: [
          { id: 11, title: "Question-1",  videoId: "lF-mKVjsMqo", duration: "" },
          { id: 12, title: "Question-2",  videoId: "ulU9r9utLA4", duration: "" },
          { id: 13, title: "Question-3",  videoId: "KyFarnOr520", duration: "" },
          { id: 14, title: "Question-4",  videoId: "tLKpfJb_5DQ", duration: "" },
          { id: 15, title: "Question-5",  videoId: "6FfM2JwZkTo", duration: "" },
          { id: 16, title: "Question-6",  videoId: "UtauJ_7fXfQ", duration: "" },
          { id: 17, title: "Question-7",  videoId: "griZ5k8tg_0", duration: "" },
          { id: 18, title: "Question-8",  videoId: "a_8POPBwY6I", duration: "" },
          { id: 19, title: "Question-9",  videoId: "r0beKnDn7WU", duration: "" },
          { id: 20, title: "Question-10", videoId: "DiDg2wmcqsk", duration: "" },
        ]
      },
      {
        title: "🕸️ Section 3 — DSA Medium[20]",
        lectures: [
          { id: 21, title: "Question-1",  videoId: "-pvs8XLRstw", duration: "" },
          { id: 22, title: "Question-2",  videoId: "BTxThoQiReQ", duration: "" },
          { id: 23, title: "Question-3",  videoId: "PazYmtyCBi4", duration: "" },
          { id: 24, title: "Question-4",  videoId: "aViI3dCm_Xs", duration: "" },
          { id: 25, title: "Question-5",  videoId: "CGDCUVq8irk", duration: "" },
          { id: 26, title: "Question-6",  videoId: "9WVr7OXYfrY", duration: "" },
          { id: 27, title: "Question-7",  videoId: "jzg1nOrZq9g", duration: "" },
          { id: 28, title: "Question-8",  videoId: "TX-63y4VoTk", duration: "" },
          { id: 29, title: "Question-9",  videoId: "yU39-hz5MtI", duration: "" },
          { id: 30, title: "Question-10", videoId: "RvKCm7vNXDs", duration: "" },
          { id: 31, title: "Question-11", videoId: "y2nm1NPaRdo", duration: "" },
          { id: 32, title: "Question-12", videoId: "TPOyYFrnNAk", duration: "" },
          { id: 33, title: "Question-13", videoId: "QTI8V18obSE", duration: "" },
          { id: 34, title: "Question-14", videoId: "-0jBDciIk7o", duration: "" },
          { id: 35, title: "Question-15", videoId: "pCvDSgH4-L0", duration: "" },
          { id: 36, title: "Question-16", videoId: "U_BoPsu0qgs", duration: "" },
          { id: 37, title: "Question-17", videoId: "0f22VrRN1_c", duration: "" },
          { id: 38, title: "Question-18", videoId: "En8Bfg_ZnFA", duration: "" },
          { id: 39, title: "Question-19", videoId: "f-wZWGTG8ow", duration: "" },
          { id: 40, title: "Question-20", videoId: "TdL1fy2kYD8", duration: "" },
        ]
      },
      {
        title: "🟢 Section 4 — DSA Hard[20]",
        lectures: [
          { id: 41, title: "Question-1",  videoId: "-pvs8XLRstw", duration: "" },
          { id: 42, title: "Question-2",  videoId: "BTxThoQiReQ", duration: "" },
          { id: 43, title: "Question-3",  videoId: "PazYmtyCBi4", duration: "" },
          { id: 44, title: "Question-4",  videoId: "aViI3dCm_Xs", duration: "" },
          { id: 45, title: "Question-5",  videoId: "CGDCUVq8irk", duration: "" },
          { id: 46, title: "Question-6",  videoId: "9WVr7OXYfrY", duration: "" },
          { id: 47, title: "Question-7",  videoId: "jzg1nOrZq9g", duration: "" },
          { id: 48, title: "Question-8",  videoId: "TX-63y4VoTk", duration: "" },
          { id: 49, title: "Question-9",  videoId: "yU39-hz5MtI", duration: "" },
          { id: 50, title: "Question-10", videoId: "RvKCm7vNXDs", duration: "" },
          { id: 51, title: "Question-11", videoId: "y2nm1NPaRdo", duration: "" },
          { id: 52, title: "Question-12", videoId: "TPOyYFrnNAk", duration: "" },
          { id: 53, title: "Question-13", videoId: "QTI8V18obSE", duration: "" },
          { id: 54, title: "Question-14", videoId: "-0jBDciIk7o", duration: "" },
          { id: 55, title: "Question-15", videoId: "pCvDSgH4-L0", duration: "" },
          { id: 56, title: "Question-16", videoId: "U_BoPsu0qgs", duration: "" },
          { id: 57, title: "Question-17", videoId: "0f22VrRN1_c", duration: "" },
          { id: 58, title: "Question-18", videoId: "En8Bfg_ZnFA", duration: "" },
          { id: 59, title: "Question-19", videoId: "f-wZWGTG8ow", duration: "" },
          { id: 60, title: "Question-20", videoId: "TdL1fy2kYD8", duration: "" },
        ]
      },
    ]
  }
};

function TCSCoursePracticePage() {
  const { courseTitle } = useParams();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [activeSection, setActiveSection] = useState(0);

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

  // Notes link logic — only 4 folders, based on section
  const getNotesInfo = (id) => {
    const aptitudeIds = Array.from({ length: 10 }, (_, i) => i + 1); // 1–10
    const dsaEasyIds  = Array.from({ length: 10 }, (_, i) => i + 11); // 11–20
    const dsaMedIds   = Array.from({ length: 20 }, (_, i) => i + 21); // 21–40
    const dsaHardIds  = Array.from({ length: 20 }, (_, i) => i + 41); // 41–60

    if (aptitudeIds.includes(id)) return {
      link: "https://drive.google.com/drive/folders/1ADp-3BK5ejEtut6niu9vGELFMn_dctXq",
      label: "📂 Open Aptitude Notes Folder — All PDFs"
    };
    if (dsaEasyIds.includes(id)) return {
      link: "https://drive.google.com/drive/folders/1mJo2l2t1qkOQHPhwxhlXTAjzcMAY7KFm",
      label: "📂 Open DSA Easy Notes Folder — All PDFs"
    };
    if (dsaMedIds.includes(id)) return {
      link: "https://drive.google.com/drive/folders/1kNYJ9KETKQ-K9OAFN3w3IQZjcgMaHbQj",
      label: "📂 Open DSA Medium Notes Folder — All PDFs"
    };
    if (dsaHardIds.includes(id)) return {
      link: "https://drive.google.com/drive/folders/1pY0hK3YBr53zkcO2iuIm4S5QmvPQibCy",
      label: "📂 Open DSA Hard Notes Folder — All PDFs"
    };
    return null;
  };

  if (loading) return <div className="cp-loading">⏳ Loading...</div>;
  if (!hasAccess || !course) return (
    <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>
      ❌ Course not found. Title: "{decodedTitle}"
    </div>
  );

  const notesInfo = getNotesInfo(currentLecture?.id);

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
            {currentLecture?.notesOnly ? (
              <div className="cp-video-placeholder">
                <span>📂</span>
                <p>Notes & Resources Section</p>
                <p style={{ fontSize: "0.85rem", opacity: 0.6 }}>Open the notes folder below</p>
              </div>
            ) : getVideoId(currentLecture?.videoId) ? (
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
          {notesInfo && (
            <div className="cp-notes-section">
              <div className="cp-notes-header">
                <h3>📚 Course Notes & Resources</h3>
              </div>
              <p className="cp-notes-desc">
                All lecture notes are available in our Google Drive folder.
              </p>
              <a href={notesInfo.link} target="_blank" rel="noreferrer" className="cp-notes-btn">
                {notesInfo.label}
              </a>
            </div>
          )}

          {/* Navigation */}
          <div className="cp-nav-btns">
            <button
              className="cp-nav-btn"
              disabled={currentIndex === 0}
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentLecture(allLectures[currentIndex - 1]);
                  scrollToTop();
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
                  scrollToTop();
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
                          if (lecture.notesOnly) {
                            window.open("https://drive.google.com/drive/folders/1zIsN2U9q2ynsLzBDwHwjjGesfDiRZb32", "_blank");
                            return;
                          }
                          setCurrentLecture(lecture);
                          scrollToTop();
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

export default TCSCoursePracticePage;