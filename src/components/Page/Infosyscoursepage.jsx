import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CoursePage.css"; // same CSS as TCS

// ─────────────── NOTES LINKS ───────────────
const CS_NOTES_LINK = "https://drive.google.com/drive/folders/1IGkTc-wTDR0gZLEsjW-VhJXZ8S7cJCda";
const GENAI_NOTES_LINK = "https://drive.google.com/drive/folders/1fVJ3d3VGlf3qfbhPwSdgtQg3-ndMG4ZO";
const APTITUDE_NOTES_LINK = "https://drive.google.com/drive/folders/1OpXdp-roAVNNb59J8cbZ8wdtB6QO1Aiq";
const APTI_PYQ_NOTES_LINK = "https://drive.google.com/drive/folders/1ADp-3BK5ejEtut6niu9vGELFMn_dctXq";
const OTHER_NOTES_LINK = "https://drive.google.com/drive/folders/1zIsN2U9q2ynsLzBDwHwjjGesfDiRZb32";
const DSA_NOTES_LINK = "https://drive.google.com/drive/folders/1t1OjMoxwKtXEvuNAroHAIwtN42SDvpP4";

const COURSE_TITLE = "The Complete Infosys Course 2026"; // must match backend purchasedCourses title
const API = "https://syntax-error-1xds.vercel.app";

// ─────────────── DSA DAY-WISE ───────────────
const dsaDays = [
  { day: 0, topic: "Extra Class", videos: [["Day-0 — Extra Class", "jeY0Bq9XL7U"]] },
  { day: 1, topic: "Conditional Statement", videos: [["Day-1 — Conditional Statement", "IF83m1yU-GQ"]] },
  { day: 2, topic: "Loop", videos: [["Day-2 — Loop", "t6MLMsDNxYY"]] },
  { day: 3, topic: "Function", videos: [["Day-3 — Function", "9fmwlZTypPE"]] },
  { day: 4, topic: "Recursion", videos: [["Day-4 — Recursion", "upP1aENGEF0"]] },
  { day: 4, topic: "Backtracking", videos: [["Day-4 — Backtracking", "IwryqR38TNE"]] },
  { day: 5, topic: "Time & Space Complexity", videos: [["Day-5 — Time & Space Complexity", "PMhX3ShjH30"]] },
  { day: 6, topic: "Array", videos: [["Day-6 — Array", "UfbvWvHTGtY"]] },
  { day: 7, topic: "String", videos: [["Day-7 — String", "_nz8HesSj6o"]] },
  {
    day: 8,
    topic: "Sorting & Searching",
    videos: [
      ["Day-8 — Sorting & Searching", "90bQTxM9jPo"],
      ["Day-8 — Sorting Algorithms", "bM66Ii_rpX4"],
    ],
  },
  { day: 9, topic: "Two Pointers", videos: [["Day-9 — Two Pointers", "OoMC8b__vDY"]] },
  { day: 10, topic: "Greedy Approach", videos: [["Day-10 — Greedy Approach", "TdL1fy2kYD8"]] },
  { day: 11, topic: "Sliding Window", videos: [["Day-11 — Sliding Window", "6drIqk34MKM"]] },
  { day: 12, topic: "Linked List", videos: [["Day-12 — Linked List", "W2Amo9J2QE0"]] },
  { day: 13, topic: "Fast & Slow Pointer", videos: [["Day-13 — Fast & Slow Pointer", "OiuJrWAHpw4"]] },
  { day: 14, topic: "Hash Set", videos: [["Day-14 — Hash Set", "IqBRLq1gDoU"]] },
  { day: 15, topic: "Hash Map", videos: [["Day-15 — Hash Map", "37h4zBSn6Lk"]] },
  { day: 16, topic: "Stack", videos: [["Day-16 — Stack", "SwEhTKX4ACg"]] },
  { day: 17, topic: "Queue", videos: [["Day-17 — Queue", "0VkyWYQfzAI"]] },
  { day: 18, topic: "Bit Manipulation", videos: [["Day-18 — Bit Manipulation", "1fkt1FjSI5Q"]] },
  { day: 19, topic: "Tree — Part 1", videos: [["Day-19 — Tree (Part 1)", "oTnsjPUE6A0"]] },
  { day: 20, topic: "Tree — Part 2", videos: [["Day-20 — Tree (Part 2)", "-IIaBnMk21U"]] },
  { day: 21, topic: "Tree — Part 3", videos: [["Day-21 — Tree (Part 3)", "9YZ-5NrcHeg"]] },
  { day: 22, topic: "Graph — Part 1", videos: [["Day-22 — Graph (Part 1)", "z0OZTqD7dRM"]] },
  { day: 23, topic: "Graph — Part 2", videos: [["Day-23 — Graph (Part 2)", "S_QteRQjlfQ"]] },
  { day: 24, topic: "Graph — Part 3", videos: [["Day-24 — Graph (Part 3)", "MHCu5TyOHBQ"]] },
  { day: 25, topic: "Graph — Part 4", videos: [["Day-25 — Graph (Part 4)", "gI-q_1pAg8w"]] },
  { day: 26, topic: "DP — Part 1", videos: [["Day-26 — DP (Part 1)", "WKmLF8Qpkh4"]] },
  { day: 27, topic: "DP — Part 2", videos: [["Day-27 — DP (Part 2)", "BkqHH7pM-lQ"]] },
  { day: 28, topic: "DP — Part 3", videos: [["Day-28 — DP (Part 3)", "EdYvuPSONZo"]] },
  { day: 29, topic: "DP — Part 4", videos: [["Day-29 — DP (Part 4)", "jYvX9-PJzd4"]] },
  { day: 30, topic: "DP — Part 5", videos: [["Day-30 — DP (Part 5)", "6-daoWMNr5I"]] },
];

// DSA lecture ids start from 101 so they never clash with other ids
let dsaIdCounter = 101;
const dsaSections = [
  {
    title: "💻 Section 2 — DSA & Coding",
    lectures: dsaDays.flatMap((d) =>
      d.videos.map(([title, videoId]) => ({
        id: dsaIdCounter++,
        title,
        videoId,
        duration: "",
        notesGroup: "dsa",
      }))
    ),
  },
];
const courseData = {
  [COURSE_TITLE]: {
    title: COURSE_TITLE,
    instructor: "Abhishek Rathor & Karina Sharma",
    sections: [
      // ───────── APTITUDE ─────────
      {
        title: "📐 Section 1.1 — Arithmetic Fundamentals",
        lectures: [
          { id: 1, title: "Percentage — Concepts & Tricks", videoId: "XFcapf8Mx2c", duration: "" },
          { id: 2, title: "Ratio & Proportion", videoId: "Xv38cd1u5_o", duration: "" },
          { id: 3, title: "Age Problems — Part 1", videoId: "cWhm6yyH24w", duration: "" },
          { id: 4, title: "Age Problems — Part 2", videoId: "d7d09-3O_ro", duration: "" },
          { id: 5, title: "Partnership", videoId: "FtOA4G3tvwI", duration: "" },
          { id: 6, title: "Average", videoId: "fELiGdlv7aE", duration: "" },
          { id: 7, title: "Chain Rule", videoId: "iVgxR8uUOUw", duration: "" },
          { id: 8, title: "Pipes & Cisterns", videoId: "vZKu8YGF7Dw", duration: "" },
        ],
      },
      {
        title: "🔢 Section 1.2 — Number System & Profit",
        lectures: [
          { id: 9, title: "Number System — Fundamentals", videoId: "a6MOQA3twYo", duration: "" },
          { id: 10, title: "Number System (Contd.) & Profit & Loss Intro", videoId: "uV_mQFfEAbI", duration: "" },
          { id: 11, title: "Profit & Loss — Complete", videoId: "lF-mKVjsMqo", duration: "" },
          { id: 12, title: "HCF & LCM", videoId: "ulU9r9utLA4", duration: "" },
          { id: 13, title: "AP & GP — Part 1", videoId: "KyFarnOr520", duration: "" },
          { id: 14, title: "AP & GP — Part 2", videoId: "tLKpfJb_5DQ", duration: "" },
        ],
      },
      {
        title: "⏱️ Section 1.3 — Speed, Time & Interest",
        lectures: [
          { id: 15, title: "Speed, Distance & Time + Boats & Trains", videoId: "6FfM2JwZkTo", duration: "" },
          { id: 16, title: "Speed, Distance & Time — Practice Session", videoId: "UtauJ_7fXfQ", duration: "" },
          { id: 17, title: "Simple & Compound Interest — Part 1", videoId: "griZ5k8tg_0", duration: "" },
          { id: 18, title: "Simple & Compound Interest — Part 2", videoId: "a_8POPBwY6I", duration: "" },
        ],
      },
      {
        title: "🧠 Section 1.4 — Reasoning",
        lectures: [
          { id: 19, title: "Blood Relations", videoId: "r0beKnDn7WU", duration: "" },
          { id: 20, title: "Calendar Problems", videoId: "DiDg2wmcqsk", duration: "" },
          { id: 21, title: "Clock Problems", videoId: "-pvs8XLRstw", duration: "" },
          { id: 22, title: "Coding & Decoding", videoId: "BTxThoQiReQ", duration: "" },
          { id: 23, title: "Direction Sense", videoId: "PazYmtyCBi4", duration: "" },
          { id: 24, title: "Seating Arrangement", videoId: "aViI3dCm_Xs", duration: "" },
          { id: 25, title: "Statement & Assumptions", videoId: "CGDCUVq8irk", duration: "" },
          { id: 26, title: "Data Sufficiency", videoId: "9WVr7OXYfrY", duration: "" },
        ],
      },
      {
        title: "📊 Section 1.5 — Advanced Aptitude",
        lectures: [
          { id: 27, title: "Permutations & Combinations", videoId: "jzg1nOrZq9g", duration: "" },
          { id: 28, title: "Probability", videoId: "TX-63y4VoTk", duration: "" },
          { id: 29, title: "Number Series & Counting Figures", videoId: "yU39-hz5MtI", duration: "" },
          { id: 30, title: "Statistics (Bonus)", videoId: "RvKCm7vNXDs", duration: "" },
        ],
      },
      {
        title: "🗣️ Section 1.6 — Verbal Ability",
        lectures: [
          { id: 31, title: "Verbal Ability — Part 1", videoId: "y2nm1NPaRdo", duration: "" },
          { id: 32, title: "Verbal Ability — Part 2", videoId: "TPOyYFrnNAk", duration: "" },
          { id: 33, title: "Verbal Ability — Part 3", videoId: "QTI8V18obSE", duration: "" },
          { id: 34, title: "Verbal Ability — Part 4", videoId: "-0jBDciIk7o", duration: "" },
        ],
      },

      // ───────── DSA & CODING ─────────
      ...dsaSections,

      // ───────── CS FUNDAMENTALS ─────────
      {
        title: "🗄️ Section 3 — DBMS",
        lectures: [
          { id: 50, title: "DBMS — Part 1", videoId: "-AVkAFCB9yE", duration: "" },
          { id: 51, title: "DBMS — Part 2", videoId: "qOylUHEdOzc", duration: "" },
        ],
      },
      {
        title: "🧩 Section 4 — OOPs Concepts",
        lectures: [
          { id: 52, title: "OOPs — Part 1", videoId: "AmXCxd5N9UQ", duration: "" },
          { id: 53, title: "OOPs — Part 2", videoId: "y48-cjrDey0", duration: "" },
        ],
      },

      // ───────── GENERATIVE AI ─────────
      {
        title: "🤖 Section 5 — Generative AI",
        lectures: [
          { id: 54, title: "Generative AI — Part 1", videoId: "_I4_dIZjcRs", duration: "" },
          { id: 55, title: "Generative AI — Part 2", videoId: "tWfAdclOGc4", duration: "" },
        ],
      },
      {
        title: "🧠 Section 6 — Operating System",
        lectures: [{ id: 56, title: "Operating System", videoId: "bnPBSrle5sU", duration: "" }],
      },
      {
        title: "🚀 Section 7 — Computer Network",
        lectures: [{ id: 57, title: "Computer Network", videoId: "u1Kfzud_aPY", duration: "" }],
      },

      // ───────── APTITUDE PYQ ─────────
      {
        title: "🔥 Section 8 — Aptitude PYQ",
        lectures: [
          { id: 59, title: "Part 1", videoId: "RHFBA-V6rH4", duration: "" },
          { id: 60, title: "Part 2", videoId: "QSkxO-UQdYo", duration: "" },
          { id: 61, title: "Part 3", videoId: "E-SA_H2kL74", duration: "" },
          { id: 62, title: "Part 4", videoId: "mukhc_2Kl9U", duration: "" },
        ],
      },

      // ───────── OTHER RESOURCES ─────────
      {
        title: "📁 Section 9 — Other Resources",
        lectures: [
          {
            id: 58,
            title: "All Other Stuffs — Notes + HR Questions + PYQ",
            videoId: null,
            duration: "",
            notesOnly: true,
          },
        ],
      },
    ],
  },
};

// ─────────────── NOTES RESOLVER ───────────────
const getNotesInfo = (lecture) => {
  const id = lecture?.id;
  if (lecture?.notesGroup === "dsa")
    return { link: DSA_NOTES_LINK, label: "📂 Open DSA & Coding Notes — All PDFs" };
  if (id >= 1 && id <= 34)
    return { link: APTITUDE_NOTES_LINK, label: "📂 Open Aptitude Notes Folder — All PDFs" };
  if ([54, 55].includes(id))
    return { link: GENAI_NOTES_LINK, label: "📂 Open GenAI Notes Folder — All PDFs" };
  if ([59, 60, 61, 62].includes(id))
    return { link: APTI_PYQ_NOTES_LINK, label: "📂 Open Apti PYQ Notes — All PDFs" };
  if (id === 58)
    return { link: OTHER_NOTES_LINK, label: "📂 All Other Stuffs — Notes + HR Questions + PYQ" };
  return { link: CS_NOTES_LINK, label: "📂 Open Core CS Notes Folder — All PDFs" };
};

function InfosysCoursePage() {
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
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await fetch(`${API}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.success) {
          navigate("/login");
          return;
        }
        const purchased = data.user.purchasedCourses?.some((c) => c.title === decodedTitle);
        if (purchased && course) {
          setHasAccess(true);
          setCurrentLecture(course.sections[0].lectures[0]);
        } else {
          navigate("/courses");
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
    setCompletedLectures((prev) =>
      prev.includes(lectureId) ? prev.filter((id) => id !== lectureId) : [...prev, lectureId]
    );
  };

  const getVideoId = (videoId) => {
    if (!videoId) return null;
    if (videoId.includes("youtu.be/")) return videoId.split("youtu.be/")[1].split("?")[0];
    if (videoId.includes("watch?v=")) return videoId.split("watch?v=")[1].split("&")[0];
    return videoId;
  };

  const allLectures = course?.sections?.flatMap((s) => s.lectures) || [];
  const totalLectures = allLectures.length;
  const progress = totalLectures ? Math.round((completedLectures.length / totalLectures) * 100) : 0;
  const currentIndex = allLectures.findIndex((l) => l.id === currentLecture?.id);

  if (loading) return <div className="cp-loading">⏳ Loading...</div>;
  if (!hasAccess || !course)
    return (
      <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>
        ❌ Course not found. Title: "{decodedTitle}"
      </div>
    );

  const { link: notesLink, label: notesLabel } = getNotesInfo(currentLecture);

  return (
    <div className="cp-wrapper">
      {/* Top Bar */}
      <div className="cp-topbar">
        <button onClick={() => navigate("/dashboard")} className="cp-back">← Dashboard</button>
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
          <div className="cp-video-container">
            {currentLecture?.notesOnly ? (
              <div className="cp-video-placeholder">
                <span>📂</span>
                <p>Notes & Resources Section</p>
                <p style={{ fontSize: "0.85rem", opacity: 0.6 }}>Open the notes folder below</p>
              </div>
            ) : getVideoId(currentLecture?.videoId) ? (
              <iframe
                key={currentLecture.id}
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

          <div className="cp-notes-section">
            <div className="cp-notes-header">
              <h3>📚 Course Notes & Resources</h3>
            </div>
            <p className="cp-notes-desc">All lecture notes are available in our Google Drive folder.</p>
            <a href={notesLink} target="_blank" rel="noreferrer" className="cp-notes-btn">
              {notesLabel}
            </a>
          </div>

          <div className="cp-nav-btns">
            <button
              className="cp-nav-btn"
              disabled={currentIndex <= 0}
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentLecture(allLectures[currentIndex - 1]);
                  scrollToTop();
                }
              }}
            >
              ← Previous
            </button>
            <span className="cp-lecture-count">{currentIndex + 1} / {totalLectures}</span>
            <button
              className="cp-nav-btn primary"
              disabled={currentIndex === allLectures.length - 1}
              onClick={() => {
                if (currentIndex < allLectures.length - 1) {
                  if (!completedLectures.includes(currentLecture?.id)) toggleCompleted(currentLecture?.id);
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
          <p className="cp-progress-mini-text">{completedLectures.length}/{totalLectures} completed</p>

          <div className="cp-sections">
            {course.sections.map((section, sIndex) => (
              <div key={sIndex} className="cp-section">
                <button
                  className={`cp-section-header ${activeSection === sIndex ? "open" : ""}`}
                  onClick={() => setActiveSection(activeSection === sIndex ? -1 : sIndex)}
                >
                  <span>{section.title}</span>
                  <span className="cp-section-arrow">{activeSection === sIndex ? "▲" : "▼"}</span>
                </button>

                {activeSection === sIndex && (
                  <div className="cp-lectures">
                    {section.lectures.map((lecture) => (
                      <button
                        key={lecture.id}
                        className={`cp-lecture-item ${currentLecture?.id === lecture.id ? "active" : ""} ${
                          completedLectures.includes(lecture.id) ? "done" : ""
                        }`}
                        onClick={() => {
                          if (lecture.notesOnly) {
                            window.open(OTHER_NOTES_LINK, "_blank");
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
                          {lecture.duration && <span className="cp-lecture-dur">⏱ {lecture.duration}</span>}
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

export default InfosysCoursePage;