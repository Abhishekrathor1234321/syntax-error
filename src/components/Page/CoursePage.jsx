import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CoursePage.css";

// Dummy data — baad mein real links daalna
const courseData = {
  "Complete Aptitude Course 2026": {
    title: "Complete Aptitude Course 2026",
    instructor: "Karina Sharma [Infosys-DSE]",
    totalLectures: 30,
    sections: [
      {
        title: "Section 1 — Introduction",
        lectures: [
          { id: 1, title: "Percentage", videoId: "https://youtu.be/XFcapf8Mx2c", duration: "", notes: "" },
          { id: 2, title: "RATIO AND PROPORTION   ", videoId: "https://www.youtube.com/watch?v=Xv38cd1u5_o", duration: "", notes: "" },
        ]
      },
      {
        title: "Section 2 — Quantitative Aptitude",
        lectures: [
          { id: 3, title: "Number System", videoId: "YOUR_VIDEO_ID_3", duration: "25:00", notes: "DRIVE_LINK_1" },
          { id: 4, title: "Percentages", videoId: "YOUR_VIDEO_ID_4", duration: "20:00", notes: "DRIVE_LINK_2" },
          { id: 5, title: "Profit & Loss", videoId: "YOUR_VIDEO_ID_5", duration: "22:00", notes: "DRIVE_LINK_3" },
          { id: 6, title: "Simple & Compound Interest", videoId: "YOUR_VIDEO_ID_6", duration: "18:00", notes: "" },
          { id: 7, title: "Time & Work", videoId: "YOUR_VIDEO_ID_7", duration: "20:00", notes: "" },
          { id: 8, title: "Time Speed Distance", videoId: "YOUR_VIDEO_ID_8", duration: "25:00", notes: "" },
        ]
      },
      {
        title: "Section 3 — Verbal Reasoning",
        lectures: [
          { id: 9, title: "Synonyms & Antonyms", videoId: "YOUR_VIDEO_ID_9", duration: "15:00", notes: "" },
          { id: 10, title: "Reading Comprehension", videoId: "YOUR_VIDEO_ID_10", duration: "20:00", notes: "" },
          { id: 11, title: "Sentence Completion", videoId: "YOUR_VIDEO_ID_11", duration: "18:00", notes: "" },
        ]
      },
      {
        title: "Section 4 — Logical Reasoning",
        lectures: [
          { id: 12, title: "Blood Relations", videoId: "YOUR_VIDEO_ID_12", duration: "20:00", notes: "" },
          { id: 13, title: "Seating Arrangement", videoId: "YOUR_VIDEO_ID_13", duration: "25:00", notes: "" },
          { id: 14, title: "Coding Decoding", videoId: "YOUR_VIDEO_ID_14", duration: "18:00", notes: "" },
          { id: 15, title: "Syllogism", videoId: "YOUR_VIDEO_ID_15", duration: "22:00", notes: "" },
        ]
      },
      {
        title: "Section 5 — Data Interpretation",
        lectures: [
          { id: 16, title: "Bar Graphs", videoId: "YOUR_VIDEO_ID_16", duration: "20:00", notes: "" },
          { id: 17, title: "Pie Charts", videoId: "YOUR_VIDEO_ID_17", duration: "18:00", notes: "" },
          { id: 18, title: "Line Graphs", videoId: "YOUR_VIDEO_ID_18", duration: "15:00", notes: "" },
          { id: 19, title: "Tables & Caselets", videoId: "YOUR_VIDEO_ID_19", duration: "22:00", notes: "" },
        ]
      },
      {
        title: "Section 6 — Puzzles",
        lectures: [
          { id: 20, title: "Floor Puzzles", videoId: "YOUR_VIDEO_ID_20", duration: "25:00", notes: "" },
          { id: 21, title: "Box Puzzles", videoId: "YOUR_VIDEO_ID_21", duration: "20:00", notes: "" },
          { id: 22, title: "Scheduling Puzzles", videoId: "YOUR_VIDEO_ID_22", duration: "22:00", notes: "" },
        ]
      },
      {
        title: "Section 7 — Speed Math",
        lectures: [
          { id: 23, title: "Vedic Math Tricks", videoId: "YOUR_VIDEO_ID_23", duration: "20:00", notes: "" },
          { id: 24, title: "Shortcuts for Multiplication", videoId: "YOUR_VIDEO_ID_24", duration: "15:00", notes: "" },
          { id: 25, title: "Division Tricks", videoId: "YOUR_VIDEO_ID_25", duration: "18:00", notes: "" },
        ]
      },
      {
        title: "Section 8 — Mock Tests",
        lectures: [
          { id: 26, title: "Mock Test 1", videoId: "YOUR_VIDEO_ID_26", duration: "45:00", notes: "" },
          { id: 27, title: "Mock Test 2", videoId: "YOUR_VIDEO_ID_27", duration: "45:00", notes: "" },
          { id: 28, title: "Mock Test 3", videoId: "YOUR_VIDEO_ID_28", duration: "45:00", notes: "" },
          { id: 29, title: "Mock Test 4", videoId: "YOUR_VIDEO_ID_29", duration: "45:00", notes: "" },
          { id: 30, title: "Final Mock Test", videoId: "YOUR_VIDEO_ID_30", duration: "60:00", notes: "" },
        ]
      }
    ]
  }
};

function CoursePage() {
  const { courseTitle } = useParams();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [activeSection, setActiveSection] = useState(0);

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
            // Pehla lecture set karo
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

  const toggleCompleted = (lectureId) => {
    setCompletedLectures(prev =>
      prev.includes(lectureId)
        ? prev.filter(id => id !== lectureId)
        : [...prev, lectureId]
    );
  };

  const totalLectures = course?.sections?.reduce((acc, s) => acc + s.lectures.length, 0) || 0;
  const progress = Math.round((completedLectures.length / totalLectures) * 100);

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
        <div className="cp-progress-bar">
          <div className="cp-progress-fill" style={{ width: `${progress}%` }} />
          <span>{progress}% Complete</span>
        </div>
      </div>

      <div className="cp-main">

        {/* Left — Video Player */}
        <div className="cp-content">

          {/* Video Player */}
          <div className="cp-video-container">
            {currentLecture?.videoId && currentLecture.videoId !== `YOUR_VIDEO_ID_${currentLecture.id}` ? (
              <iframe
                src={`https://www.youtube.com/embed/${currentLecture.videoId}?rel=0&modestbranding=1`}
                title={currentLecture.title}
                allowFullScreen
                className="cp-video"
              />
            ) : (
              <div className="cp-video-placeholder">
                <span>▶️</span>
                <p>Video Coming Soon</p>
              </div>
            )}
          </div>

          {/* Lecture Info */}
          <div className="cp-lecture-info">
            <h2>{currentLecture?.title}</h2>
            <div className="cp-lecture-meta">
              <span>👨‍🏫 {course.instructor}</span>
              <span>⏱️ {currentLecture?.duration}</span>
              <button
                className={`cp-complete-btn ${completedLectures.includes(currentLecture?.id) ? "completed" : ""}`}
                onClick={() => toggleCompleted(currentLecture?.id)}
              >
                {completedLectures.includes(currentLecture?.id) ? "✅ Completed" : "Mark as Complete"}
              </button>
            </div>
          </div>

          {/* Notes Section */}
          <div className="cp-notes-section">
            <h3>📚 Lecture Notes & Resources</h3>
            {currentLecture?.notes ? (
              <a
                href={currentLecture.notes}
                target="_blank"
                rel="noreferrer"
                className="cp-notes-btn"
              >
                📥 Download Notes
              </a>
            ) : (
              <p className="cp-no-notes">Notes coming soon for this lecture!</p>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="cp-nav-btns">
            <button
              className="cp-nav-btn"
              onClick={() => {
                const allLectures = course.sections.flatMap(s => s.lectures);
                const currentIndex = allLectures.findIndex(l => l.id === currentLecture?.id);
                if (currentIndex > 0) setCurrentLecture(allLectures[currentIndex - 1]);
              }}
            >
              ← Previous
            </button>
            <button
              className="cp-nav-btn primary"
              onClick={() => {
                const allLectures = course.sections.flatMap(s => s.lectures);
                const currentIndex = allLectures.findIndex(l => l.id === currentLecture?.id);
                if (currentIndex < allLectures.length - 1) {
                  toggleCompleted(currentLecture?.id);
                  setCurrentLecture(allLectures[currentIndex + 1]);
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

          <div className="cp-sections">
            {course.sections.map((section, sIndex) => (
              <div key={sIndex} className="cp-section">
                <button
                  className="cp-section-header"
                  onClick={() => setActiveSection(activeSection === sIndex ? -1 : sIndex)}
                >
                  <span>{section.title}</span>
                  <span>{activeSection === sIndex ? "▲" : "▼"}</span>
                </button>

                {activeSection === sIndex && (
                  <div className="cp-lectures">
                    {section.lectures.map((lecture) => (
                      <button
                        key={lecture.id}
                        className={`cp-lecture-item ${currentLecture?.id === lecture.id ? "active" : ""} ${completedLectures.includes(lecture.id) ? "done" : ""}`}
                        onClick={() => setCurrentLecture(lecture)}
                      >
                        <span className="cp-lecture-icon">
                          {completedLectures.includes(lecture.id) ? "✅" : "▶️"}
                        </span>
                        <div className="cp-lecture-details">
                          <span className="cp-lecture-name">{lecture.title}</span>
                          <span className="cp-lecture-dur">{lecture.duration}</span>
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

export default CoursePage;