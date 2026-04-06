import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ChallengePage.css";
import "./ChallengeDay.css";

// PURANA dummy content — safe hai, sirf theory aur description add ki
const dayContent = {
  1: {
    topic: "Introduction to Java & Variables",
    description: "Variables, Data Types, Type Casting, aur basic Input/Output seekhenge.",
    theory: `Java ek object-oriented, platform-independent programming language hai.

## Variables
Variable ek container hai jisme hum data store karte hain.

int age = 20;
String name = "Rahul";
double marks = 95.5;
boolean isPassed = true;

## Data Types
- int — Integer numbers (e.g., 10, -5)
- double — Decimal numbers (e.g., 3.14)
- String — Text (e.g., "Hello")
- boolean — true or false
- char — Single character (e.g., 'A')

## Input/Output
import java.util.Scanner;
Scanner sc = new Scanner(System.in);
int n = sc.nextInt();
System.out.println("Input: " + n);`,
    videoUrl: "https://www.youtube.com/embed/placeholder1",
    questions: [
      {
        title: "Hello World in Java",
        difficulty: "Easy",
        hint: "public class Main { public static void main(String[] args) }",
        leetcodeUrl: "https://leetcode.com/problems/",
        notesUrl: "#",
        videoUrl: "#"
      },
      {
        title: "Sum of Two Numbers",
        difficulty: "Easy",
        hint: "Scanner se input lo, add karo, print karo",
        leetcodeUrl: "https://leetcode.com/problems/",
        notesUrl: "#",
        videoUrl: "#"
      },
      {
        title: "Find Maximum of Three Numbers",
        difficulty: "Easy",
        hint: "if-else ya Math.max() use karo",
        leetcodeUrl: "https://leetcode.com/problems/",
        notesUrl: "#",
        videoUrl: "#"
      },
    ]
  },
  2: {
    topic: "Conditionals & Loops",
    description: "if-else, switch, for, while, do-while loops ke saath problem solving.",
    theory: `## Conditionals
if-else se conditions check karte hain.

if (age >= 18) {
    System.out.println("Adult");
} else {
    System.out.println("Minor");
}

## Loops
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

while (condition) { ... }
do { ... } while (condition);`,
    videoUrl: "https://www.youtube.com/embed/placeholder2",
    questions: [
      {
        title: "FizzBuzz",
        difficulty: "Easy",
        hint: "% operator use karo — 3 se divisible = Fizz, 5 se = Buzz",
        leetcodeUrl: "https://leetcode.com/problems/fizz-buzz/",
        notesUrl: "#",
        videoUrl: "#"
      },
      {
        title: "Count Digits",
        difficulty: "Easy",
        hint: "n ko 10 se divide karte raho jab tak 0 na ho jaye",
        leetcodeUrl: "https://leetcode.com/problems/",
        notesUrl: "#",
        videoUrl: "#"
      },
      {
        title: "Reverse a Number",
        difficulty: "Easy",
        hint: "Last digit nikalo (n%10), result = result*10 + digit",
        leetcodeUrl: "https://leetcode.com/problems/",
        notesUrl: "#",
        videoUrl: "#"
      },
      {
        title: "Check Palindrome Number",
        difficulty: "Easy",
        hint: "Number reverse karo, original se compare karo",
        leetcodeUrl: "https://leetcode.com/problems/palindrome-number/",
        notesUrl: "#",
        videoUrl: "#"
      },
    ]
  },
};

function ChallengeDay() {
  const { day } = useParams();
  const navigate = useNavigate();
  const dayNum = parseInt(day);
  const content = dayContent[dayNum];

  // ✅ NAYA states
  const [activeSection, setActiveSection] = useState("theory");
  const [expandedQ, setExpandedQ] = useState(null);
  const [personalNotes, setPersonalNotes] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [markingDone, setMarkingDone] = useState(false);
  const [savedNote, setSavedNote] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // ✅ NAYA — localStorage se notes aur completion load karo
    const notes = localStorage.getItem(`challenge_notes_day${dayNum}`) || "";
    const completed = localStorage.getItem(`challenge_completed_day${dayNum}`) === "true";
    setPersonalNotes(notes);
    setIsCompleted(completed);
  }, [day]);

  // ✅ NAYA — notes save karo
  const handleSaveNotes = () => {
    localStorage.setItem(`challenge_notes_day${dayNum}`, personalNotes);
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 2000);
  };

  // ✅ NAYA — mark complete
  const handleMarkComplete = async () => {
    setMarkingDone(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://syntax-error-1xds.vercel.app/challenge/complete-day", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ day: dayNum })
      });
      const data = await res.json();
      if (data.success) {
        setIsCompleted(true);
        localStorage.setItem(`challenge_completed_day${dayNum}`, "true");
        setTimeout(() => navigate("/challenge/schedule"), 1200);
      } else {
        alert(data.message || "Error marking complete");
      }
    } catch {
      // Offline fallback
      setIsCompleted(true);
      localStorage.setItem(`challenge_completed_day${dayNum}`, "true");
    } finally {
      setMarkingDone(false);
    }
  };

  const difficultyColor = (d) => {
    if (d === "Easy") return "#22c55e";
    if (d === "Medium") return "#f59e0b";
    return "#ef4444";
  };

  // PURANA — content nahi hai to ye dikhao
  if (!content) {
    return (
      <div className="cp-wrapper cp-loading">
        <p>Content coming soon for Day {dayNum}! 🚀</p>
        <button className="cp-back-btn" onClick={() => navigate("/challenge/schedule")}>
          ← Back to Schedule
        </button>
      </div>
    );
  }

  return (
    <div className="cd-wrapper">

      {/* ✅ NAYA Sidebar */}
      <aside className="cd-sidebar">
        <button className="cd-back" onClick={() => navigate("/challenge/schedule")}>
          ← Back to Schedule
        </button>

        <div className="cd-day-badge">DAY {dayNum} OF 30</div>
        <h2 className="cd-sidebar-topic">{content.topic}</h2>
        <p className="cd-sidebar-desc">{content.description}</p>

        <nav className="cd-nav">
          {["theory", "video", "questions", "notes"].map(s => (
            <button
              key={s}
              className={`cd-nav-btn ${activeSection === s ? "active" : ""}`}
              onClick={() => setActiveSection(s)}
            >
              {s === "theory" && "📖 Theory"}
              {s === "video" && "🎥 Video"}
              {s === "questions" && `❓ Questions (${content.questions.length})`}
              {s === "notes" && "📝 My Notes"}
            </button>
          ))}
        </nav>

        {/* ✅ NAYA Mark Complete */}
        <div className="cd-complete-wrap">
          {isCompleted ? (
            <div className="cd-completed-badge">✅ Day {dayNum} Completed!</div>
          ) : (
            <button
              className="cd-complete-btn"
              onClick={handleMarkComplete}
              disabled={markingDone}
            >
              {markingDone ? "Marking..." : "✅ Mark as Complete"}
            </button>
          )}
        </div>

        {/* PURANA day navigation — same */}
        <div className="cd-day-nav">
          {dayNum > 1 && (
            <button className="cd-prev-btn" onClick={() => navigate(`/challenge/day/${dayNum - 1}`)}>
              ← Day {dayNum - 1}
            </button>
          )}
          {dayNum < 30 && (
            <button className="cd-next-btn" onClick={() => navigate(`/challenge/day/${dayNum + 1}`)}>
              Day {dayNum + 1} →
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="cd-main">

        {/* ✅ NAYA — Theory Section */}
        {activeSection === "theory" && (
          <div className="cd-section">
            <div className="cd-section-header">
              <h2>📖 Theory</h2>
              <span className="cd-section-sub">Read & understand the concept</span>
            </div>
            <div className="cd-theory-body">
              {content.theory.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h3 key={i} className="cd-theory-h2">{line.replace('## ', '')}</h3>;
                if (line.startsWith('- ')) return <p key={i} className="cd-theory-bullet">• {line.replace('- ', '')}</p>;
                if (line.trim() === '') return <br key={i} />;
                if (
                  line.includes('{') || line.includes('}') || line.includes('System.') ||
                  line.includes('import ') || line.includes('Scanner') ||
                  line.startsWith('int ') || line.startsWith('String ') ||
                  line.startsWith('double ') || line.startsWith('boolean ') ||
                  line.startsWith('for ') || line.startsWith('while ') ||
                  line.startsWith('if ') || line.startsWith('do ')
                ) {
                  return <code key={i} className="cd-theory-code-line">{line}</code>;
                }
                return <p key={i} className="cd-theory-p">{line}</p>;
              })}
            </div>
          </div>
        )}

        {/* PURANA Video — same, sirf section wrapper naya */}
        {activeSection === "video" && (
          <div className="cd-section">
            <div className="cd-section-header">
              <h2>🎥 Theory Video</h2>
              <span className="cd-section-sub">Watch the full explanation</span>
            </div>
            <div className="cd-video-wrap">
              <iframe
                src={content.videoUrl}
                title={`Day ${dayNum} Theory`}
                allowFullScreen
                className="cd-video"
              />
            </div>
          </div>
        )}

        {/* PURANA Questions — same structure, sirf expand aur hint naya */}
        {activeSection === "questions" && (
          <div className="cd-section">
            <div className="cd-section-header">
              <h2>💻 Practice Problems</h2>
              <span className="cd-section-sub">{content.questions.length} problems for today</span>
            </div>
            <div className="cd-questions-list">
              {content.questions.map((q, i) => (
                <div key={i} className="cd-question-card">
                  <div
                    className="cd-question-header"
                    onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                  >
                    <div className="cd-q-left">
                      <span className="cd-q-num">Q{i + 1}</span>
                      <span className="cd-q-title">{q.title}</span>
                      {q.difficulty && (
                        <span className="cd-q-diff" style={{ color: difficultyColor(q.difficulty) }}>
                          {q.difficulty}
                        </span>
                      )}
                    </div>
                    <span className="cd-q-toggle">{expandedQ === i ? "▲" : "▼"}</span>
                  </div>

                  {expandedQ === i && (
                    <div className="cd-question-body">
                      {/* ✅ NAYA Hint */}
                      {q.hint && (
                        <div className="cd-q-hint">
                          <span className="cd-q-hint-label">💡 Hint</span>
                          <p>{q.hint}</p>
                        </div>
                      )}

                      {/* PURANA links — same, sirf style naya */}
                      <div className="cd-q-actions">
                        <a href={q.leetcodeUrl} target="_blank" rel="noreferrer" className="cd-q-btn cd-q-problem">
                          🔗 LeetCode
                        </a>
                        <a href={q.notesUrl} target="_blank" rel="noreferrer" className="cd-q-btn cd-q-notes">
                          📄 Notes
                        </a>
                        <a href={q.videoUrl} target="_blank" rel="noreferrer" className="cd-q-btn cd-q-video-link">
                          ▶ Solution Video
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ NAYA Notes Section */}
        {activeSection === "notes" && (
          <div className="cd-section">
            <div className="cd-section-header">
              <h2>📝 My Notes</h2>
              <span className="cd-section-sub">Important cheezein yahan likho</span>
            </div>
            <div className="cd-notes-body">
              <textarea
                className="cd-notes-textarea"
                placeholder={`Day ${dayNum} ke liye apne notes yahan likho...\n\nExample:\n- Important concepts\n- Tricky points\n- Formulas to remember`}
                value={personalNotes}
                onChange={e => setPersonalNotes(e.target.value)}
                rows={18}
              />
              <div className="cd-notes-footer">
                <span className="cd-notes-chars">{personalNotes.length} characters</span>
                <button className="cd-notes-save" onClick={handleSaveNotes}>
                  {savedNote ? "✅ Saved!" : "💾 Save Notes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ChallengeDay;