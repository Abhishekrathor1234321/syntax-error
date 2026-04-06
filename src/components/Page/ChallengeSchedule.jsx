import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChallengePage.css";
import "./ChallengeSchedule.css";

// 30 Days ka dummy content — baad mein replace karna
const days = [
  { day: 1, topic: "Introduction to Java & Variables", questions: 3, description: "Variables, Data Types, Type Casting, Input/Output" },
  { day: 2, topic: "Conditionals & Loops", questions: 4, description: "if-else, switch, for, while, do-while loops" },
  { day: 3, topic: "Functions & Recursion", questions: 3, description: "Methods, Parameters, Return types, Recursive calls" },
  { day: 4, topic: "Arrays — Basics", questions: 4, description: "1D Arrays, Traversal, Insertion, Deletion" },
  { day: 5, topic: "Arrays — Advanced", questions: 4, description: "2D Arrays, Prefix Sum, Kadane's Algorithm" },
  { day: 6, topic: "Strings", questions: 3, description: "String methods, StringBuilder, Pattern Matching" },
  { day: 7, topic: "Time & Space Complexity", questions: 2, description: "Big O notation, Best/Worst/Average case analysis" },
  { day: 8, topic: "Sorting Algorithms", questions: 4, description: "Bubble, Selection, Insertion, Merge, Quick Sort" },
  { day: 9, topic: "Binary Search", questions: 4, description: "Classic Binary Search, Search in rotated array" },
  { day: 10, topic: "Hashing", questions: 3, description: "HashMap, HashSet, Frequency counting" },
  { day: 11, topic: "Two Pointer", questions: 3, description: "Pair sum, Remove duplicates, Container with most water" },
  { day: 12, topic: "Sliding Window", questions: 3, description: "Fixed & Variable window problems" },
  { day: 13, topic: "Linked List — Basics", questions: 4, description: "Singly LL, Insertion, Deletion, Reversal" },
  { day: 14, topic: "Linked List — Advanced", questions: 3, description: "Doubly LL, Cycle detection, Merge two LLs" },
  { day: 15, topic: "Stack", questions: 4, description: "Stack implementation, NGE, Valid parentheses" },
  { day: 16, topic: "Queue & Deque", questions: 3, description: "Queue, Circular Queue, Deque, Sliding window max" },
  { day: 17, topic: "Priority Queue / Heap", questions: 3, description: "Min/Max heap, Kth largest/smallest element" },
  { day: 18, topic: "Binary Tree — Basics", questions: 4, description: "Traversals: Inorder, Preorder, Postorder, Level order" },
  { day: 19, topic: "Binary Tree — Advanced", questions: 3, description: "Height, Diameter, LCA, Zigzag traversal" },
  { day: 20, topic: "BST", questions: 4, description: "Search, Insert, Delete, Validate BST" },
  { day: 21, topic: "Greedy Algorithms", questions: 3, description: "Activity selection, Fractional Knapsack, Job sequencing" },
  { day: 22, topic: "Backtracking", questions: 3, description: "N-Queens, Sudoku Solver, Subsets, Permutations" },
  { day: 23, topic: "Graphs — Basics", questions: 3, description: "Graph representation, Adjacency list/matrix" },
  { day: 24, topic: "BFS & DFS", questions: 4, description: "Breadth-First, Depth-First traversal, Flood fill" },
  { day: 25, topic: "Graph — Advanced", questions: 3, description: "Dijkstra, Bellman-Ford, Topological Sort" },
  { day: 26, topic: "Dynamic Programming — Basics", questions: 4, description: "Memoization, Tabulation, Fibonacci, Climbing stairs" },
  { day: 27, topic: "DP — 1D Problems", questions: 3, description: "House Robber, Coin change, Longest Increasing Subsequence" },
  { day: 28, topic: "DP — 2D Problems", questions: 3, description: "0/1 Knapsack, LCS, Edit Distance" },
  { day: 29, topic: "Bit Manipulation", questions: 3, description: "AND, OR, XOR tricks, Set/Clear/Toggle bits" },
  { day: 30, topic: "LeetCode Mixed Problems", questions: 5, description: "Top interview problems — revision & practice" },
];

function ChallengeSchedule() {
  const navigate = useNavigate();
  const [unlockedDays, setUnlockedDays] = useState(0);
  const [completedDays, setCompletedDays] = useState([]); // ✅ NAYA
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("schedule"); // ✅ NAYA
  const [leaderboard, setLeaderboard] = useState([]);     // ✅ NAYA

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProgress();
    fetchLeaderboard(); // ✅ NAYA
  }, []);

  // PURANA — same logic, sirf completedDays bhi set kiya
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
        setCompletedDays(data.completedDays || []); // ✅ NAYA
      }
    } catch (err) {
      console.error("Progress fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NAYA — leaderboard fetch
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("https://syntax-error-1xds.vercel.app/challenge/leaderboard");
      const data = await res.json();
      if (data.success) setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error("Leaderboard fetch error", err);
    }
  };

  // PURANA — same
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

  // PURANA — same
  const handleDayClick = (day) => {
    if (day > unlockedDays) return;
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

  const completedCount = completedDays.length;
  const progressPercent = Math.round((completedCount / 30) * 100);

  return (
    <div className="cs-wrapper">

      {/* ✅ NAYA Sidebar */}
      <aside className="cs-sidebar">
        <div className="cs-sidebar-logo" onClick={() => navigate("/")}>SE</div>

        <div className="cs-circular-wrap">
          <svg className="cs-circular-svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#1e1e2e" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke="url(#progressGrad)" strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - progressPercent / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="cs-circular-text">
            <span className="cs-circular-num">{completedCount}</span>
            <span className="cs-circular-sub">/ 30</span>
          </div>
        </div>
        <p className="cs-progress-label">Days Completed</p>

        <div className="cs-sidebar-stats">
          <div className="cs-stat">
            <span className="cs-stat-val">{completedCount}</span>
            <span className="cs-stat-label">Done</span>
          </div>
          <div className="cs-stat">
            <span className="cs-stat-val">{30 - completedCount}</span>
            <span className="cs-stat-label">Left</span>
          </div>
          <div className="cs-stat">
            <span className="cs-stat-val">{progressPercent}%</span>
            <span className="cs-stat-label">Progress</span>
          </div>
        </div>

        <nav className="cs-nav">
          <button className={`cs-nav-btn ${activeTab === "schedule" ? "active" : ""}`} onClick={() => setActiveTab("schedule")}>
            📅 Schedule
          </button>
          <button className={`cs-nav-btn ${activeTab === "leaderboard" ? "active" : ""}`} onClick={() => setActiveTab("leaderboard")}>
            🏆 Leaderboard
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="cs-main">
        <div className="cs-topbar">
          <div className="cs-topbar-left">
            <button className="cs-back" onClick={() => navigate("/challenge")}>← Back</button>
            <div className="cs-badge">☕ JAVA · ENGLISH</div>
          </div>
          <h1 className="cs-title">30 Days DSA Challenge</h1>
          <p className="cs-subtitle">Master Data Structures & Algorithms in 30 days — one topic per day.</p>

          {/* PURANA progress bar */}
          {!enrolled ? (
            <button className="cp-start-btn" onClick={handleStartChallenge}>
              🚀 Start Challenge — It's Free!
            </button>
          ) : (
            <div className="cp-progress-bar-wrap">
              <div className="cp-progress-info">
                <span>Day {unlockedDays} / 30 Unlocked</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="cp-progress-bar">
                <div className="cp-progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <div className="cs-days-grid">
            {days.map(({ day, topic, questions, description }) => {
              const isUnlocked = enrolled && day <= unlockedDays;
              const isCurrent = enrolled && day === unlockedDays;
              const isCompleted = completedDays.includes(day); // ✅ NAYA

              return (
                <div
                  key={day}
                  className={`cs-day-card ${isUnlocked ? "cp-day-open" : "cs-locked"} ${isCurrent ? "cs-current" : ""} ${isCompleted ? "cs-done" : ""}`}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="cs-day-header">
                    <span className="cs-day-label">DAY {day}</span>
                    <span className="cs-day-icon">
                      {isCompleted ? "✅" : isCurrent ? "🔥" : !isUnlocked ? "🔒" : "▶"}
                    </span>
                  </div>
                  <div className="cs-day-topic">{topic}</div>
                  <div className="cs-day-desc">{description}</div>
                  <div className="cs-day-footer">
                    {isUnlocked ? (
                      <span className="cs-day-q">{questions} Problems →</span>
                    ) : (
                      <span className="cs-day-locked-txt">Locked</span>
                    )}
                    {isCompleted && <span className="cs-day-done-badge">Completed</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ✅ NAYA Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <div className="cs-leaderboard">
            <h2 className="cs-lb-title">🏆 Challenge Leaderboard</h2>
            <p className="cs-lb-sub">Top students crushing the 30 Days DSA Challenge</p>
            <div className="cs-lb-table">
              <div className="cs-lb-head">
                <span>Rank</span>
                <span>Student</span>
                <span>Days Done</span>
                <span>Progress</span>
              </div>
              {leaderboard.length === 0 ? (
                <div className="cs-lb-empty">
                  <p>🚀 No students enrolled yet. Be the first!</p>
                </div>
              ) : (
                leaderboard.map((user, i) => (
                  <div key={i} className={`cs-lb-row ${i < 3 ? "cs-lb-top" : ""}`}>
                    <span className="cs-lb-rank">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </span>
                    <span className="cs-lb-name">{user.name}</span>
                    <span className="cs-lb-days">{user.completedDays} / 30</span>
                    <div className="cs-lb-bar-wrap">
                      <div className="cs-lb-bar" style={{ width: `${(user.completedDays / 30) * 100}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ChallengeSchedule;