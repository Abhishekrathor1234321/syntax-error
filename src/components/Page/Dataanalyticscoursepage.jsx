import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CoursePage.css";

// 👈 Apna Google Drive notes/source code folder link yahan daalna
const DATA_ANALYTICS_NOTES_LINK = "https://drive.google.com/drive/folders/1HL7W8dIufE-7xjCogNJzaInTaN33OyMB";

// 👈 Har lecture ke videoId me YouTube video ID (ya full link) daalna
// Khali chhodoge to "Video Coming Soon" dikhega
const courseData = {
  "Data Analytics Placement Ready Course With Projects": {
    title: "Data Analytics Placement Ready Course With Projects",
    instructor: "Shreyank Jawai",
    sections: [
      {
        title: " Section 1",
        lectures: [
          { id: 1, title: "Video-1", videoId: "H9KgeD1mTKc", duration: "" },
          { id: 2, title: "Video-2", videoId: "iTQua0XjSXA", duration: "" },
          { id: 3, title: "Video-3", videoId: "bRty2CClnzk", duration: "" },
          { id: 4, title: "Video-4", videoId: "FXwiFA6NAec", duration: "" },
        ]
      },
      {
        title: " Section 2",
        lectures: [
          { id: 5, title: "Video-5", videoId: "saOdarcKXtU", duration: "" },
          { id: 6, title: "Video-6", videoId: "mzYdulENFwM", duration: "" },
          { id: 7, title: "Video-7", videoId: "Ke1LcQBP1D0", duration: "" },
          { id: 8, title: "Video-8", videoId: "fRPU-0aYkPM", duration: "" },
        ]
      },
      {
        title: " Section 3",
        lectures: [
          { id: 9, title: "Video-9", videoId: "ZUifSDTcSvA", duration: "" },
          { id: 10, title: "Video-10", videoId: "7qJykJoSCDU", duration: "" },
          { id: 11, title: "Video-11", videoId: "24aYsPeqY40", duration: "" },
          { id: 12, title: "Video-12", videoId: "vYweoiCSWy0", duration: "" },
        ]
      },
      {
        title: " Section 4",
        lectures: [
          { id: 13, title: "Video-13", videoId: "aMpO0VmLKpU", duration: "" },
          { id: 14, title: "Video-14", videoId: "wpKL_A31o_I", duration: "" },
          { id: 15, title: "Video-15", videoId: "JMrURnuMLYw", duration: "" },
        ]
      },
      {
        title: " Section 5",
        lectures: [
          { id: 16, title: "Video-16", videoId: "UgIfUIkYaUI", duration: "" },
          { id: 17, title: "Video-17", videoId: "js4zFuVYwnM", duration: "" },
        ]
      },
      {
        title: " Section 6",
        lectures: [
          { id: 18, title: "Video-18", videoId: "jZQROVyxiLU", duration: "" },
          { id: 19, title: "Video-19", videoId: "CwcwL4k-7Cs", duration: "" },
          { id: 20, title: "Video-20", videoId: "zRdVq82o0RY", duration: "" },
        ]
      }
    ]
  }
};

function DataAnalyticsCoursePage() {
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
          if (purchased ) {
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
  const progress = totalLectures ? Math.round((completedLectures.length / totalLectures) * 100) : 0;
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
              All PDF notes, source code and project files are available in our Google Drive folder.
            </p>
            {DATA_ANALYTICS_NOTES_LINK ? (
              <a
                href={DATA_ANALYTICS_NOTES_LINK}
                target="_blank"
                rel="noreferrer"
                className="cp-notes-btn"
              >
                📂 Open Notes Folder — PDFs & Source Code
              </a>
            ) : (
              <span className="cp-notes-btn" style={{ opacity: 0.6, cursor: "not-allowed" }}>
                📂 Notes Coming Soon
              </span>
            )}
          </div>

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

export default DataAnalyticsCoursePage;