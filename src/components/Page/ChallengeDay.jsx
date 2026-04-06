import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ChallengePage.css";

// Dummy content — baad mein replace karna
const dayContent = {
  1: {
    topic: "Introduction to Java & Variables",
    videoUrl: "https://www.youtube.com/embed/placeholder1",
    questions: [
      {
        title: "Hello World in Java",
        leetcodeUrl: "https://leetcode.com/problems/",
        notesUrl: "#",
        videoUrl: "#"
      },
      {
        title: "Sum of Two Numbers",
        leetcodeUrl: "https://leetcode.com/problems/",
        notesUrl: "#",
        videoUrl: "#"
      },
      {
        title: "Find Maximum of Three Numbers",
        leetcodeUrl: "https://leetcode.com/problems/",
        notesUrl: "#",
        videoUrl: "#"
      },
    ]
  },
  2: {
    topic: "Conditionals & Loops",
    videoUrl: "https://www.youtube.com/embed/placeholder2",
    questions: [
      {
        title: "FizzBuzz",
        leetcodeUrl: "https://leetcode.com/problems/fizz-buzz/",
        notesUrl: "#",
        videoUrl: "#"
      },
      {
        title: "Count Digits",
        leetcodeUrl: "https://leetcode.com/problems/",
        notesUrl: "#",
        videoUrl: "#"
      },
      {
        title: "Reverse a Number",
        leetcodeUrl: "https://leetcode.com/problems/",
        notesUrl: "#",
        videoUrl: "#"
      },
      {
        title: "Check Palindrome Number",
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="cp-wrapper">
      <div className="cp-blob cp-blob1" />
      <div className="cp-blob cp-blob2" />

      {/* Header */}
      <div className="cp-header">
        <button className="cp-back-btn" onClick={() => navigate("/challenge/schedule")}>
          ← Back to Schedule
        </button>
        <span className="cp-brand">SYNTAX ERROR</span>
      </div>

      {/* Day Hero */}
      <div className="cp-day-hero">
        <div className="cp-badge">🔥 DAY {dayNum} OF 30</div>
        <h1 className="cp-title">{content.topic}</h1>
      </div>

      {/* Theory Video */}
      <div className="cp-section">
        <h2 className="cp-section-title">📺 Theory Video</h2>
        <div className="cp-video-wrap">
          <iframe
            src={content.videoUrl}
            title={`Day ${dayNum} Theory`}
            allowFullScreen
            className="cp-video"
          />
        </div>
      </div>

      {/* Questions */}
      <div className="cp-section">
        <h2 className="cp-section-title">💻 Practice Problems</h2>
        <div className="cp-questions">
          {content.questions.map((q, i) => (
            <div key={i} className="cp-question-card">
              <div className="cp-question-num">Q{i + 1}</div>
              <div className="cp-question-info">
                <h3>{q.title}</h3>
                <div className="cp-question-links">
                  <a href={q.leetcodeUrl} target="_blank" rel="noreferrer" className="cp-link cp-link-lc">
                    🔗 LeetCode
                  </a>
                  <a href={q.notesUrl} target="_blank" rel="noreferrer" className="cp-link cp-link-notes">
                    📄 Notes
                  </a>
                  <a href={q.videoUrl} target="_blank" rel="noreferrer" className="cp-link cp-link-video">
                    ▶ Solution Video
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="cp-day-nav">
        {dayNum > 1 && (
          <button className="cp-nav-btn" onClick={() => navigate(`/challenge/day/${dayNum - 1}`)}>
            ← Day {dayNum - 1}
          </button>
        )}
        {dayNum < 30 && (
          <button className="cp-nav-btn cp-nav-next" onClick={() => navigate(`/challenge/day/${dayNum + 1}`)}>
            Day {dayNum + 1} →
          </button>
        )}
      </div>

    </div>
  );
}

export default ChallengeDay;