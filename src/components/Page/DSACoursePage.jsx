import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CoursePage.css";

const DSA_NOTES_LINK = "https://drive.google.com/drive/folders/1t1OjMoxwKtXEvuNAroHAIwtN42SDvpP4";

const courseData = {
  "The Complete Data Structure & Algorithm Course 2026": {
    title: "The Complete Data Structure & Algorithm Course 2026",
    instructor: "Abhishek Rathor [Founder/DSA-Mentor]",
    sections: [
      {
        title: "🚀 Section 1 — Programming Fundamentals",
        lectures: [
          { id: 1, title: "Day-0 | Variables, Data Types & Operators", videoId: "Irakjt8BlHQ", duration: "" },
          { id: 2, title: "Day-1 | Conditional Statements (if-else, switch) + Questions", videoId: "siSSIseKN6s", duration: "" },
          { id: 3, title: "Day-2 | Loops + Questions", videoId: "f9m4G1ZISHg", duration: "" },
          { id: 4, title: "Day-3 | Functions + Recursion + Questions", videoId: "TGh-S6z0ulo", duration: "" },
          { id: 5, title: "Day-4 | Backtracking + Questions", videoId: "IwryqR38TNE", duration: "" },
          { id: 6, title: "Day-5 | Time and Space Complexity + Questions", videoId: "kHybbHVzZS8", duration: "" },
        ]
      },
      {
        title: "📊 Section 2 — Arrays, Strings & Sorting",
        lectures: [
          { id: 7, title: "Day-6 | Arrays + Questions", videoId: "w1NNAEsO4N8", duration: "" },
          { id: 8, title: "Day-7 | Strings + Questions", videoId: "ERznKBypaM8", duration: "" },
          { id: 9, title: "Day-7 Part-2 | All Sorting Algorithms", videoId: "bM66Ii_rpX4", duration: "" },
          { id: 10, title: "Day-8 | Sorting & Searching + Questions", videoId: "4tfE_5VeWOM", duration: "" },
          { id: 11, title: "Day-9 | Two Pointers + Questions", videoId: "S__chMlIjec", duration: "" },
          { id: 12, title: "Day-10 | Greedy Approach + Questions", videoId: "TdL1fy2kYD8", duration: "" },
          { id: 13, title: "Day-11 | Sliding Window + Questions", videoId: "zpIHKNGpdFc", duration: "" },
        ]
      },
      {
        title: "🔗 Section 3 — Linked List & Hashing",
        lectures: [
          { id: 14, title: "Day-12 | Linked List + Questions", videoId: "7-Yb7u_zdmw", duration: "" },
          { id: 15, title: "Day-13 | Fast and Slow Pointer + Questions", videoId: "Of8e5lqMSKI", duration: "" },
          { id: 16, title: "Day-14 | Hash Set + Questions", videoId: "w0Ty1Ad21cQ", duration: "" },
          { id: 17, title: "Day-15 | Hash Map + Questions", videoId: "3vDT7Jz7qn8", duration: "" },
        ]
      },
      {
        title: "📚 Section 4 — Stack, Queue & Bit Manipulation",
        lectures: [
          { id: 18, title: "Day-16 | Stack + Questions", videoId: "hVMTRnoIgfY", duration: "" },
          { id: 19, title: "Day-17 | Queue + Questions", videoId: "0VkyWYQfzAI", duration: "" },
          { id: 20, title: "Day-18 | Bit Manipulation + Questions", videoId: "EBXmDVEY1b0", duration: "" },
        ]
      },
      {
        title: "🌳 Section 5 — Trees",
        lectures: [
          { id: 21, title: "Day-19 | Tree + Questions", videoId: "VSf1UwZs7Ts", duration: "" },
          { id: 22, title: "Day-20 | Tree + Questions", videoId: "AXVFWja6CFY", duration: "" },
          { id: 23, title: "Day-21 | Tree + Questions", videoId: "o9B6_w6s-cc", duration: "" },
        ]
      },
      {
        title: "🕸️ Section 6 — Graphs",
        lectures: [
          { id: 24, title: "Day-22 | Graph + Questions", videoId: "UJb_VA7v3JM", duration: "" },
          { id: 25, title: "Day-23 | Graph + Questions", videoId: "bBIAjKD2lmc", duration: "" },
          { id: 26, title: "Day-24 | Graph + Questions", videoId: "MHCu5TyOHBQ", duration: "" },
          { id: 27, title: "Day-25 | Graph + Questions", videoId: "gI-q_1pAg8w", duration: "" },
        ]
      },
      {
        title: "⚡ Section 7 — Dynamic Programming",
        lectures: [
          { id: 28, title: "Day-26 | Dynamic Programming + Questions", videoId: "ZKRK6I-kkv4", duration: "" },
          { id: 29, title: "Day-27 | Dynamic Programming + Questions", videoId: "2l-s1vSUqVI", duration: "" },
          { id: 30, title: "Day-28 | Dynamic Programming + Questions", videoId: "NSMAPEvZuGo", duration: "" },
          { id: 31, title: "Day-29 | Dynamic Programming + Questions", videoId: "wBE6SRt2Fjs", duration: "" },
          { id: 32, title: "Day-30 | Dynamic Programming + Questions", videoId: "3xoY4PwIOAQ", duration: "" },
        ]
      }
    ]
  }
};

function DSACoursePage() {
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
              <span>👨‍💻 {course.instructor}</span>
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
              href={DSA_NOTES_LINK}
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

export default DSACoursePage;