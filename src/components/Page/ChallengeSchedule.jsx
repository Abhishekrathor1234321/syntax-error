import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChallengePage.css";

// 30 Days ka dummy content — baad mein replace karna
const days = [
  { day: 1, topic: "Introduction to Java & Variables", questions: 3 },
  { day: 2, topic: "Conditionals & Loops", questions: 4 },
  { day: 3, topic: "Functions & Recursion", questions: 3 },
  { day: 4, topic: "Arrays — Basics", questions: 4 },
  { day: 5, topic: "Arrays — Advanced", questions: 4 },
  { day: 6, topic: "Strings", questions: 3 },
  { day: 7, topic: "Time & Space Complexity", questions: 2 },
  { day: 8, topic: "Sorting Algorithms", questions: 4 },
  { day: 9, topic: "Binary Search", questions: 4 },
  { day: 10, topic: "Hashing", questions: 3 },
  { day: 11, topic: "Two Pointer", questions: 3 },
  { day: 12, topic: "Sliding Window", questions: 3 },
  { day: 13, topic: "Linked List — Basics", questions: 4 },
  { day: 14, topic: "Linked List — Advanced", questions: 3 },
  { day: 15, topic: "Stack", questions: 4 },
  { day: 16, topic: "Queue & Deque", questions: 3 },
  { day: 17, topic: "Priority Queue / Heap", questions: 3 },
  { day: 18, topic: "Binary Tree — Basics", questions: 4 },
  { day: 19, topic: "Binary Tree — Advanced", questions: 3 },
  { day: 20, topic: "BST", questions: 4 },
  { day: 21, topic: "Greedy Algorithms", questions: 3 },
  { day: 22, topic: "Backtracking", questions: 3 },
  { day: 23, topic: "Graphs — Basics", questions: 3 },
  { day: 24, topic: "BFS & DFS", questions: 4 },
  { day: 25, topic: "Graph — Advanced", questions: 3 },
  { day: 26, topic: "Dynamic Programming — Basics", questions: 4 },
  { day: 27, topic: "DP — 1D Problems", questions: 3 },
  { day: 28, topic: "DP — 2D Problems", questions: 3 },
  { day: 29, topic: "Bit Manipulation", questions: 3 },
  { day: 30, topic: "LeetCode Mixed Problems", questions: 5 },
];

function ChallengeSchedule() {
  const navigate = useNavigate();
  const [unlockedDays, setUnlockedDays] = useState(0);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("https://syntax-error-1xds.vercel.app/challenge/progress", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEnrolled(data.enrolled);
        setUnlockedDays(data.unlockedDays || 0);
      }
    } catch (err) {
      console.error("Progress fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChallenge = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      sessionStorage.setItem("redirectAfterLogin", "/challenge/schedule");
      navigate("/login");
      return;
    }
    try {
      const res = await fetch("https://syntax-error-1xds.vercel.app/challenge/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ language: "java" })
      });
      const data = await res.json();
      if (data.success) {
        setEnrolled(true);
        setUnlockedDays(1);
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  const handleDayClick = (day) => {
    if (day > unlockedDays) return; // locked
    navigate(`/challenge/day/${day}`);
  };

  if (loading) {
    return (
      <div className="cp-wrapper cp-loading">
        <div className="cp-spinner" />
        <p>Loading your progress...</p>
      </div>
    );
  }

  return (
    <div className="cp-wrapper">
      <div className="cp-blob cp-blob1" />
      <div className="cp-blob cp-blob2" />

      {/* Header */}
      <div className="cp-header">
        <button className="cp-back-btn" onClick={() => navigate("/challenge")}>← Back</button>
        <span className="cp-brand">SYNTAX ERROR</span>
      </div>

      {/* Title */}
      <div className="cp-schedule-hero">
        <div className="cp-badge">☕ JAVA · ENGLISH</div>
        <h1 className="cp-title">30 Days DSA Challenge</h1>
        <p className="cp-subtitle">
          Master Data Structures & Algorithms in 30 days — one topic per day.
        </p>

        {!enrolled ? (
          <button className="cp-start-btn" onClick={handleStartChallenge}>
            🚀 Start Challenge — It's Free!
          </button>
        ) : (
          <div className="cp-progress-bar-wrap">
            <div className="cp-progress-info">
              <span>Day {unlockedDays} / 30</span>
              <span>{Math.round((unlockedDays / 30) * 100)}% Complete</span>
            </div>
            <div className="cp-progress-bar">
              <div
                className="cp-progress-fill"
                style={{ width: `${(unlockedDays / 30) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Days Grid */}
      <div className="cp-days-grid">
        {days.map(({ day, topic, questions }) => {
          const isUnlocked = enrolled && day <= unlockedDays;
          const isCurrent = enrolled && day === unlockedDays;

          return (
            <div
              key={day}
              className={`cp-day-card ${isUnlocked ? "cp-day-open" : "cp-day-locked"} ${isCurrent ? "cp-day-current" : ""}`}
              onClick={() => handleDayClick(day)}
            >
              <div className="cp-day-num">
                {isUnlocked ? (
                  <span className="cp-day-check">{isCurrent ? "🔥" : "✅"}</span>
                ) : (
                  <span className="cp-day-lock">🔒</span>
                )}
                <span>Day {day}</span>
              </div>
              <div className="cp-day-topic">{topic}</div>
              <div className="cp-day-meta">
                {isUnlocked ? (
                  <span className="cp-day-questions">{questions} Problems →</span>
                ) : (
                  <span className="cp-day-locked-text">Locked</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChallengeSchedule;