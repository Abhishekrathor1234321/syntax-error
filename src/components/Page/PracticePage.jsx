import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Zap, Flame, Skull, ExternalLink, Code2 } from "lucide-react";
import { solutions } from "./solutionsData";
import Navbar from "../Navbar";

const questions = [
  { id: 1, title: "Two Sum", leetcode: 1, topic: "Arrays", difficulty: "Easy" },
  { id: 2, title: "Best Time to Buy and Sell Stock", leetcode: 121, topic: "Arrays", difficulty: "Easy" },
  { id: 3, title: "Merge Sorted Array", leetcode: 88, topic: "Arrays", difficulty: "Easy" },
  { id: 4, title: "Contains Duplicate", leetcode: 217, topic: "Arrays", difficulty: "Easy" },
  { id: 5, title: "Product of Array Except Self", leetcode: 238, topic: "Arrays", difficulty: "Medium" },
  { id: 6, title: "Maximum Subarray", leetcode: 53, topic: "Arrays", difficulty: "Medium" },
  { id: 7, title: "3Sum", leetcode: 15, topic: "Arrays", difficulty: "Medium" },
  { id: 8, title: "Merge Intervals", leetcode: 56, topic: "Arrays", difficulty: "Medium" },
  { id: 9, title: "Container With Most Water", leetcode: 11, topic: "Arrays", difficulty: "Medium" },
  { id: 10, title: "Rotate Image", leetcode: 48, topic: "Arrays", difficulty: "Medium" },
  { id: 11, title: "Valid Parentheses", leetcode: 20, topic: "Strings", difficulty: "Easy" },
  { id: 12, title: "Valid Palindrome", leetcode: 125, topic: "Strings", difficulty: "Easy" },
  { id: 13, title: "Valid Anagram", leetcode: 242, topic: "Strings", difficulty: "Easy" },
  { id: 14, title: "Group Anagrams", leetcode: 49, topic: "Strings", difficulty: "Medium" },
  { id: 15, title: "Longest Palindromic Substring", leetcode: 5, topic: "Strings", difficulty: "Medium" },
  { id: 16, title: "Minimum Window Substring", leetcode: 76, topic: "Strings", difficulty: "Hard" },
  { id: 17, title: "Find the Index of the First Occurrence", leetcode: 28, topic: "Strings", difficulty: "Easy" },
  { id: 18, title: "String Compression", leetcode: 443, topic: "Strings", difficulty: "Medium" },
  { id: 19, title: "Longest Common Prefix", leetcode: 14, topic: "Strings", difficulty: "Easy" },
  { id: 20, title: "Repeated Substring Pattern", leetcode: 459, topic: "Strings", difficulty: "Easy" },
  { id: 21, title: "Reverse Linked List", leetcode: 206, topic: "Linked Lists", difficulty: "Easy" },
  { id: 22, title: "Merge Two Sorted Lists", leetcode: 21, topic: "Linked Lists", difficulty: "Easy" },
  { id: 23, title: "Remove Nth Node From End of List", leetcode: 19, topic: "Linked Lists", difficulty: "Medium" },
  { id: 24, title: "Linked List Cycle", leetcode: 141, topic: "Linked Lists", difficulty: "Easy" },
  { id: 25, title: "Add Two Numbers", leetcode: 2, topic: "Linked Lists", difficulty: "Medium" },
  { id: 26, title: "Intersection of Two Linked Lists", leetcode: 160, topic: "Linked Lists", difficulty: "Easy" },
  { id: 27, title: "Palindrome Linked List", leetcode: 234, topic: "Linked Lists", difficulty: "Easy" },
  { id: 28, title: "Reverse Nodes in k-Group", leetcode: 25, topic: "Linked Lists", difficulty: "Hard" },
  { id: 29, title: "Implement Queue using Stacks", leetcode: 232, topic: "Stacks & Queues", difficulty: "Easy" },
  { id: 30, title: "Implement Stack using Queues", leetcode: 225, topic: "Stacks & Queues", difficulty: "Easy" },
  { id: 31, title: "Min Stack", leetcode: 155, topic: "Stacks & Queues", difficulty: "Medium" },
  { id: 32, title: "Daily Temperatures", leetcode: 739, topic: "Stacks & Queues", difficulty: "Medium" },
  { id: 33, title: "Evaluate Reverse Polish Notation", leetcode: 150, topic: "Stacks & Queues", difficulty: "Medium" },
  { id: 34, title: "Next Greater Element I", leetcode: 496, topic: "Stacks & Queues", difficulty: "Easy" },
  { id: 35, title: "Next Greater Element II", leetcode: 503, topic: "Stacks & Queues", difficulty: "Medium" },
  { id: 36, title: "Design Circular Queue", leetcode: 622, topic: "Stacks & Queues", difficulty: "Medium" },
  { id: 37, title: "Binary Search", leetcode: 704, topic: "Binary Search", difficulty: "Easy" },
  { id: 38, title: "Find First and Last Position", leetcode: 34, topic: "Binary Search", difficulty: "Medium" },
  { id: 39, title: "Search a 2D Matrix", leetcode: 74, topic: "Binary Search", difficulty: "Medium" },
  { id: 40, title: "Search in Rotated Sorted Array", leetcode: 33, topic: "Binary Search", difficulty: "Medium" },
  { id: 41, title: "Search in Rotated Sorted Array II", leetcode: 81, topic: "Binary Search", difficulty: "Medium" },
  { id: 42, title: "Find Peak Element", leetcode: 162, topic: "Binary Search", difficulty: "Medium" },
  { id: 43, title: "Maximum Depth of Binary Tree", leetcode: 104, topic: "Trees", difficulty: "Easy" },
  { id: 44, title: "Same Tree", leetcode: 100, topic: "Trees", difficulty: "Easy" },
  { id: 45, title: "Symmetric Tree", leetcode: 101, topic: "Trees", difficulty: "Easy" },
  { id: 46, title: "Binary Tree Preorder Traversal", leetcode: 144, topic: "Trees", difficulty: "Easy" },
  { id: 47, title: "Binary Tree Inorder Traversal", leetcode: 94, topic: "Trees", difficulty: "Easy" },
  { id: 48, title: "Binary Tree Postorder Traversal", leetcode: 145, topic: "Trees", difficulty: "Easy" },
  { id: 49, title: "Binary Tree Level Order Traversal", leetcode: 102, topic: "Trees", difficulty: "Medium" },
  { id: 50, title: "Balanced Binary Tree", leetcode: 110, topic: "Trees", difficulty: "Easy" },
  { id: 51, title: "Combination Sum", leetcode: 39, topic: "Recursion & Backtracking", difficulty: "Medium" },
  { id: 52, title: "Permutations", leetcode: 46, topic: "Recursion & Backtracking", difficulty: "Medium" },
  { id: 53, title: "Subsets", leetcode: 78, topic: "Recursion & Backtracking", difficulty: "Medium" },
  { id: 54, title: "N-Queens", leetcode: 51, topic: "Recursion & Backtracking", difficulty: "Hard" },
  { id: 55, title: "Letter Combinations of a Phone Number", leetcode: 17, topic: "Recursion & Backtracking", difficulty: "Medium" },
  { id: 56, title: "Subsets II", leetcode: 90, topic: "Recursion & Backtracking", difficulty: "Medium" },
  { id: 57, title: "Sudoku Solver", leetcode: 37, topic: "Recursion & Backtracking", difficulty: "Hard" },
  { id: 58, title: "Climbing Stairs", leetcode: 70, topic: "Dynamic Programming", difficulty: "Easy" },
  { id: 59, title: "House Robber", leetcode: 198, topic: "Dynamic Programming", difficulty: "Medium" },
  { id: 60, title: "Coin Change", leetcode: 322, topic: "Dynamic Programming", difficulty: "Medium" },
  { id: 61, title: "Longest Increasing Subsequence", leetcode: 300, topic: "Dynamic Programming", difficulty: "Medium" },
  { id: 62, title: "Longest Common Subsequence", leetcode: 1143, topic: "Dynamic Programming", difficulty: "Medium" },
  { id: 63, title: "Unique Paths", leetcode: 62, topic: "Dynamic Programming", difficulty: "Medium" },
  { id: 64, title: "Longest Palindromic Substring", leetcode: 5, topic: "Dynamic Programming", difficulty: "Medium" },
  { id: 65, title: "Maximum Length of Repeated Subarray", leetcode: 718, topic: "Dynamic Programming", difficulty: "Medium" },
  { id: 66, title: "Partition Equal Subset Sum", leetcode: 416, topic: "Dynamic Programming", difficulty: "Medium" },
  { id: 67, title: "Maximum Subarray", leetcode: 53, topic: "Dynamic Programming", difficulty: "Medium" },
  { id: 68, title: "Clone Graph", leetcode: 133, topic: "Graphs", difficulty: "Medium" },
  { id: 69, title: "Number of Islands", leetcode: 200, topic: "Graphs", difficulty: "Medium" },
  { id: 70, title: "Course Schedule", leetcode: 207, topic: "Graphs", difficulty: "Medium" },
  { id: 71, title: "Is Graph Bipartite?", leetcode: 785, topic: "Graphs", difficulty: "Medium" },
  { id: 72, title: "Rotting Oranges", leetcode: 994, topic: "Graphs", difficulty: "Medium" },
  { id: 73, title: "Number of Connected Components", leetcode: 323, topic: "Graphs", difficulty: "Medium" },
  { id: 74, title: "Single Number", leetcode: 136, topic: "Bit Manipulation", difficulty: "Easy" },
  { id: 75, title: "Reverse Bits", leetcode: 190, topic: "Bit Manipulation", difficulty: "Easy" },
  { id: 76, title: "Number of 1 Bits", leetcode: 191, topic: "Bit Manipulation", difficulty: "Easy" },
  { id: 77, title: "Missing Number", leetcode: 268, topic: "Bit Manipulation", difficulty: "Easy" },
];

const topicOrder = [...new Set(questions.map((q) => q.topic))];
const STORAGE_KEY = "syntax-error-practice-progress";

const diffBadge = {
  Easy: { label: "E" },
  Medium: { label: "M" },
  Hard: { label: "H" },
};

const CircularProgress = ({ percent, size = 72, strokeWidth = 5 }) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1f2937" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#22c55e" strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.7s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "16px", fontWeight: "bold", color: "white" }}>{percent}%</span>
      </div>
    </div>
  );
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.025 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.18 } } };

const PracticePage = () => {
  const [topicFilter, setTopicFilter] = useState("All");
  const tabsRef = useRef(null);
  const [selectedQ, setSelectedQ] = useState(null);
  const [activeTab, setActiveTab] = useState("java");

  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  }, [completed]);

  const toggleComplete = (id) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const totalProgress = Math.round((completed.size / questions.length) * 100);
  const easySolved = questions.filter((q) => q.difficulty === "Easy" && completed.has(q.id)).length;
  const medSolved = questions.filter((q) => q.difficulty === "Medium" && completed.has(q.id)).length;
  const hardSolved = questions.filter((q) => q.difficulty === "Hard" && completed.has(q.id)).length;

  const topicStats = useMemo(() => {
    const stats = {};
    questions.forEach((q) => {
      if (!stats[q.topic]) stats[q.topic] = { total: 0, done: 0 };
      stats[q.topic].total++;
      if (completed.has(q.id)) stats[q.topic].done++;
    });
    return stats;
  }, [completed]);

  const grouped = useMemo(() => {
    const filteredTopics = topicFilter === "All" ? topicOrder : [topicFilter];
    return filteredTopics.map((topic) => ({
      topic,
      questions: questions.filter((q) => q.topic === topic),
    }));
  }, [topicFilter]);

  const getLeetcodeUrl = (title) =>
    `https://leetcode.com/problems/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}/`;

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220" }}>
      <Navbar />
      <div style={{ paddingTop: "56px" }}>
        <div style={{ maxWidth: "672px", margin: "0 auto", padding: "32px 20px" }}>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#22c55e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "4px" }}>
              DSA TRACKER • <span style={{ color: "#94a3b8" }}>{questions.length} Problems</span>
            </p>
            <h1 style={{ fontSgitize: "40px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
              GRIND <span style={{ color: "#22c55e" }}>77</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "32px" }}>
              77 handpicked DSA problems. Java, Python & C++ solutions included.
            </p>
          </motion.div>

          {/* Stat Cards */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
            <div style={{ flex: 1, background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
              <Zap style={{ width: "20px", height: "20px", color: "#4ade80", margin: "0 auto 4px" }} />
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{easySolved}</div>
              <div style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace" }}>Easy</div>
            </div>
            <div style={{ flex: 1, background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
              <Flame style={{ width: "20px", height: "20px", color: "#facc15", margin: "0 auto 4px" }} />
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{medSolved}</div>
              <div style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace" }}>Med</div>
            </div>
            <div style={{ flex: 1, background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
              <Skull style={{ width: "20px", height: "20px", color: "#f87171", margin: "0 auto 4px" }} />
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{hardSolved}</div>
              <div style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace" }}>Hard</div>
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CircularProgress percent={totalProgress} />
            </div>
          </motion.div>

          {/* Topic Tabs */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            ref={tabsRef}
            style={{ display: "flex", gap: "4px", overflowX: "auto", paddingBottom: "8px", marginBottom: "24px" }}>
            <button onClick={() => setTopicFilter("All")} style={{
              flexShrink: 0, padding: "8px 16px", borderRadius: "999px", fontSize: "14px", fontWeight: "500",
              background: topicFilter === "All" ? "#22c55e" : "transparent",
              color: topicFilter === "All" ? "black" : "#94a3b8",
              border: "none", cursor: "pointer"
            }}>All</button>
            {topicOrder.map((topic) => (
              <button key={topic} onClick={() => setTopicFilter(topicFilter === topic ? "All" : topic)} style={{
                flexShrink: 0, padding: "8px 16px", borderRadius: "999px", fontSize: "14px", fontWeight: "500",
                background: topicFilter === topic ? "#22c55e" : "transparent",
                color: topicFilter === topic ? "black" : "#94a3b8",
                border: "none", cursor: "pointer", whiteSpace: "nowrap"
              }}>
                {topic} <span style={{ fontSize: "11px", opacity: 0.7 }}>{topicStats[topic]?.done}/{topicStats[topic]?.total}</span>
              </button>
            ))}
          </motion.div>

          {/* Question List */}
          <AnimatePresence mode="wait">
            <motion.div key={topicFilter} variants={container} initial="hidden" animate="show"
              style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {grouped.map(({ topic, questions: qs }) => (
                <motion.div key={topic} variants={item}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <h2 style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#94a3b8", fontWeight: "600" }}>
                      {topic}
                    </h2>
                    <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#94a3b8" }}>
                      {qs.filter((q) => completed.has(q.id)).length}/{qs.length}
                    </span>
                  </div>

                  <div style={{ border: "1px solid #1f2937", borderRadius: "12px", overflow: "hidden" }}>
                    {qs.map((q, idx) => {
                      const done = completed.has(q.id);
                      const leetcodeUrl = getLeetcodeUrl(q.title);
                      return (
                        <div key={q.id} style={{
                          display: "flex", alignItems: "center", gap: "12px",
                          padding: "14px 16px", background: "#111827",
                          borderBottom: idx < qs.length - 1 ? "1px solid #1f2937" : "none"
                        }}>
                          {/* Checkbox */}
                          <button onClick={() => toggleComplete(q.id)} style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                            {done ? <CheckCircle2 style={{ width: "20px", height: "20px", color: "#22c55e" }} />
                              : <Circle style={{ width: "20px", height: "20px", color: "#4b5563" }} />}
                          </button>

                          {/* Number */}
                          <span style={{ fontFamily: "monospace", fontSize: "13px", color: "#94a3b8", width: "28px", flexShrink: 0 }}>
                            {String(idx + 1).padStart(2, "0")}
                          </span>

                          {/* Difficulty Badge */}
                          <span style={{
                            flexShrink: 0, width: "24px", height: "24px", borderRadius: "6px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "10px", fontWeight: "bold",
                            background: q.difficulty === "Easy" ? "#22c55e" : q.difficulty === "Medium" ? "#eab308" : "#ef4444",
                            color: "white"
                          }}>{diffBadge[q.difficulty].label}</span>

                          {/* Title */}
                          <a href={leetcodeUrl} target="_blank" rel="noopener noreferrer" style={{
                            flex: 1, fontSize: "14px", fontWeight: "500",
                            color: done ? "#6b7280" : "white",
                            textDecoration: done ? "line-through" : "none"
                          }}>{q.title}</a>

                          {/* Code Button */}
                          {solutions[q.id] && (
                            <button onClick={() => { setSelectedQ(q); setActiveTab("java"); }}
                              style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "#4b5563", padding: 0 }}
                              title="View Solution">
                              <Code2 style={{ width: "14px", height: "14px" }} />
                            </button>
                          )}

                          {/* LeetCode Link */}
                          <a href={leetcodeUrl} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, color: "#4b5563" }}>
                            <ExternalLink style={{ width: "14px", height: "14px" }} />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Code Solution Popup */}
      {selectedQ && solutions[selectedQ.id] && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedQ(null); }}>
          <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", width: "100%", maxWidth: "620px", maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>

            {/* Popup Header */}
            <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>{selectedQ.title}</span>
                  <span style={{
                    padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold",
                    background: selectedQ.difficulty === "Easy" ? "#22c55e" : selectedQ.difficulty === "Medium" ? "#eab308" : "#ef4444",
                    color: "white"
                  }}>{selectedQ.difficulty}</span>
                </div>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>{selectedQ.topic}</span>
              </div>
              <button onClick={() => setSelectedQ(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "20px", lineHeight: 1 }}>✕</button>
            </div>

            {/* TC & SC */}
            <div style={{ padding: "12px 24px", display: "flex", gap: "20px" }}>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                ⏱ Time: <span style={{ color: "#22c55e", fontFamily: "monospace" }}>{solutions[selectedQ.id].tc}</span>
              </span>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                💾 Space: <span style={{ color: "#22c55e", fontFamily: "monospace" }}>{solutions[selectedQ.id].sc}</span>
              </span>
            </div>

            {/* Language Tabs */}
            <div style={{ padding: "0 24px", display: "flex", gap: "4px", borderBottom: "1px solid #1f2937" }}>
              {["java", "cpp", "python"].map(lang => (
                <button key={lang} onClick={() => setActiveTab(lang)} style={{
                  padding: "8px 16px", background: "none", border: "none", cursor: "pointer",
                  color: activeTab === lang ? "#22c55e" : "#94a3b8",
                  borderBottom: activeTab === lang ? "2px solid #22c55e" : "2px solid transparent",
                  fontSize: "13px", fontWeight: "500", transition: "all 0.2s"
                }}>
                  {lang === "cpp" ? "C++" : lang === "java" ? "Java" : "Python"}
                </button>
              ))}
            </div>


            {/* Copy Button */}
<div style={{ padding: "8px 24px", display: "flex", justifyContent: "flex-end", background: "#0d1117" }}>
  <button
    onClick={() => {
      navigator.clipboard.writeText(solutions[selectedQ.id][activeTab]);
    }}
    style={{ background: "#1f2937", border: "1px solid #374151", color: "#94a3b8", padding: "4px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
  >
    Copy
  </button>
</div>

            {/* Code Block */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#0d1117" }}>
              <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "13px", color: "#e2e8f0", whiteSpace: "pre-wrap", lineHeight: "1.7" }}>
                {solutions[selectedQ.id][activeTab]}
              </pre>
            </div>

            {/* Footer */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => toggleComplete(selectedQ.id)} style={{
                padding: "8px 16px", borderRadius: "8px", border: "1px solid #1f2937",
                background: completed.has(selectedQ.id) ? "#22c55e20" : "transparent",
                color: completed.has(selectedQ.id) ? "#22c55e" : "#94a3b8",
                cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px"
              }}>
                {completed.has(selectedQ.id) ? <CheckCircle2 style={{ width: "14px", height: "14px" }} /> : <Circle style={{ width: "14px", height: "14px" }} />}
                {completed.has(selectedQ.id) ? "Completed" : "Mark Complete"}
              </button>
              <a href={getLeetcodeUrl(selectedQ.title)} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#22c55e", color: "black", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "13px" }}>
                Open on LeetCode <ExternalLink style={{ width: "13px", height: "13px" }} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticePage;