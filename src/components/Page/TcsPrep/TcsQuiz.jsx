import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./tcs.css";

// TODO: production me deploy karte waqt yahan backend ka live URL daalo
const API_BASE = "https://syntax-error-1xds.vercel.app";
const TIME_PER_QUESTION = 120; // seconds — 2 minutes per question

const TOPIC_TO_SECTION = {
  // Quant
  "Percentage": "Quant",
  "Profit & Loss": "Quant",
  "Time & Work": "Quant",
  "Ratio": "Quant",
  "Number System": "Quant",
  "Probability": "Quant",
  "Time, Speed & Distance": "Quant",
  "Simple & Compound Interest": "Quant",
  "Permutations & Combinations": "Quant",
  "Pipes & Cisterns": "Quant",
  // Reasoning
  "Logical Reasoning": "Reasoning",
  "Number Series": "Reasoning",
  "Coding-Decoding": "Reasoning",
  "Blood Relations": "Reasoning",
  "Direction Sense": "Reasoning",
  "Seating Arrangement": "Reasoning",
  "Syllogism": "Reasoning",
  "Analogy": "Reasoning",
  "Clocks": "Reasoning",
  "Ranking": "Reasoning",
  // Verbal
  "Verbal Ability": "Verbal",
  "Synonyms": "Verbal",
  "Antonyms": "Verbal",
  "Fill in the Blanks": "Verbal",
  "Subject-Verb Agreement": "Verbal",
  "Error Spotting": "Verbal",
  "One-Word Substitution": "Verbal",
  "Idioms": "Verbal",
  "Sentence Ordering": "Verbal",
  "Reading Comprehension": "Verbal",
};



const SECTION_CONFIG = {
  aptitude: { title: "Aptitude Practice", groupField: "section" },   // अब भी "section" ही रहेगा
  cshr: { title: "CS + HR + GenAI Practice", groupField: "category" },
};
export default function TcsQuiz({ type }) {
  const config = SECTION_CONFIG[type];
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]); // saare fetched questions
  const [selectedTopic, setSelectedTopic] = useState(null); // null = abhi topic choose nahi hua
  const [activeQuestions, setActiveQuestions] = useState([]); // selected topic ke questions
  const [index, setIndex] = useState(0);

  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { isCorrect, correctIndex, solution, pointsAwarded }
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const [sessionPoints, setSessionPoints] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetch(`${API_BASE}/tcs/${type}`)
      .then((res) => res.json())
    .then((data) => {
  if (!Array.isArray(data)) {
    setError("Failed to load questions");
  } else {
    const withSection = data.map((q) => ({
      ...q,
      section: q.section || TOPIC_TO_SECTION[q.topic] || q.topic,
    }));
    setQuestions(withSection);
  }
  setLoading(false);
})
.catch(() => {
  setError("Could not connect to server");
  setLoading(false);

      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // Available topics/categories nikalo fetched questions se (jaise "Verbal Ability", "Reasoning Ability")
  const topics = Array.from(new Set(questions.map((q) => q[config.groupField]).filter(Boolean)));

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setActiveQuestions(questions.filter((q) => q[config.groupField] === topic));
    setIndex(0);
    setSessionPoints(0);
    setSessionCorrect(0);
  };

  const currentQuestion = activeQuestions[index];

  const submitAnswer = useCallback(
    async (chosenIndex) => {
      if (!currentQuestion || submitted) return;
      setSubmitting(true);
      try {
        const res = await fetch(`${API_BASE}/tcs/${type}/${currentQuestion._id}/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ selectedIndex: chosenIndex }),
        });
        const data = await res.json();
        if (data.success) {
          setResult(data);
          setSubmitted(true);
          setSessionPoints((p) => p + (data.pointsAwarded || 0));
          if (data.isCorrect) setSessionCorrect((c) => c + 1);
        } else {
          setError(data.message || "Submit nahi ho paya");
        }
      } catch {
        setError("Server se connect nahi ho paya");
      } finally {
        setSubmitting(false);
      }
    },
    [currentQuestion, submitted, token, type]
  );

  // Timer — question badalte hi reset, submit hote hi ruk jaata hai
  useEffect(() => {
    if (loading || !currentQuestion || submitted) return;
    setTimeLeft(TIME_PER_QUESTION);
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          submitAnswer(-1); // time khatam — answer galat mark hoga
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, loading, currentQuestion]);

  const handleNext = () => {
    setSelected(null);
    setSubmitted(false);
    setResult(null);
    setIndex((i) => i + 1);
  };

  if (loading) {
    return (
      <div className="tcs-wrap" style={{ padding: "4rem 0", textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="tcs-wrap" style={{ padding: "4rem 0", textAlign: "center" }}>
        <p style={{ color: "#f87171" }}>{error}</p>
      </div>
    );
  }

  // Topic choose nahi hua abhi tak — topic-selection screen dikhao
  if (!selectedTopic) {
    return (
      <div className="tcs-wrap" style={{ padding: "3rem 0", maxWidth: 640 }}>
        <h1>{config.title}</h1>
        <p style={{ color: "#94a3b8" }}>Ek topic choose karo practice shuru karne ke liye.</p>
        <Link to={`/tcs-prep/leaderboard?type=${type}`} style={{ fontSize: "0.9rem" }}>
          🏆 View {config.title} Leaderboard →
        </Link>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "14px",
            marginTop: "1.5rem",
          }}
        >
          {topics.map((topic) => {
            const count = questions.filter((q) => q[config.groupField] === topic).length;
            return (
              <button
                key={topic}
                className="card"
                style={{ textAlign: "left", cursor: "pointer", border: "1px solid #334155" }}
                onClick={() => handleSelectTopic(topic)}
              >
                <h3 style={{ margin: 0 }}>{topic}</h3>
                <p style={{ color: "#94a3b8", margin: "6px 0 0" }}>{count} questions</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Saare questions ho gaye — summary dikhao
  if (index >= activeQuestions.length) {
    return (
      <div className="tcs-wrap" style={{ padding: "4rem 0", maxWidth: 480 }}>
        <h1>Session complete! 🎉</h1>
        <p>
          {sessionCorrect} out of {activeQuestions.length} correct — {selectedTopic}
        </p>
        <p>Points earned this session: <b>{sessionPoints}</b></p>
        <div style={{ display: "flex", gap: "12px", marginTop: "1.5rem", flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => setSelectedTopic(null)}>
            Choose another topic
          </button>
          <Link to={`/tcs-prep/leaderboard?type=${type}`} className="btn">
            View {config.title} Leaderboard
          </Link>
          <button className="btn" onClick={() => handleSelectTopic(selectedTopic)}>
            Restart this topic
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tcs-wrap" style={{ padding: "3rem 0", maxWidth: 640 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>{config.title} — {selectedTopic}</h1>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "1.2rem",
            color: timeLeft <= 20 ? "#f87171" : "inherit",
          }}
        >
          ⏱ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </span>
      </div>
      <Link to={`/tcs-prep/leaderboard?type=${type}`} style={{ fontSize: "0.9rem" }}>
        🏆 View {config.title} Leaderboard →
      </Link>
      <p style={{ color: "#94a3b8" }}>
        Question {index + 1} of {activeQuestions.length}
      </p>
<div className="card" style={{ marginTop: "1rem" }}>
  {currentQuestion.topic && (
    <p
      style={{
        display: "inline-block",
        fontSize: "0.8rem",
        color: "#94a3b8",
        border: "1px solid #334155",
        borderRadius: "999px",
        padding: "2px 10px",
        marginBottom: "8px",
      }}
    >
      {currentQuestion.topic}
    </p>
  )}
  <h3>{currentQuestion.question}</h3>

  {currentQuestion.hint && (
          <p style={{ fontStyle: "italic", color: "#94a3b8" }}>💡 Hint: {currentQuestion.hint}</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "1rem" }}>
          {currentQuestion.options.map((opt, i) => {
            let bg = "transparent";
            if (submitted && result) {
              if (i === result.correctIndex) bg = "rgba(34,197,94,0.15)";
              else if (i === selected && !result.isCorrect) bg = "rgba(248,113,113,0.15)";
            }
            return (
              <label
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  background: bg,
                  cursor: submitted ? "default" : "pointer",
                }}
              >
                <input
                  type="radio"
                  name="option"
                  disabled={submitted}
                  checked={selected === i}
                  onChange={() => setSelected(i)}
                />
                {opt}
              </label>
            );
          })}
        </div>

        {!submitted ? (
          <button
            className="btn btn-primary"
            style={{ marginTop: "1.2rem" }}
            disabled={selected === null || submitting}
            onClick={() => submitAnswer(selected)}
          >
            {submitting ? "Submitting..." : "Submit Answer"}
          </button>
        ) : (
          <div style={{ marginTop: "1.2rem" }}>
            <p style={{ color: result.isCorrect ? "#22c55e" : "#f87171", fontWeight: 600 }}>
              {result.isCorrect ? `Correct! +${result.pointsAwarded} points` : "Not quite right."}
            </p>
            {result.solution && (
              <p style={{ color: "#94a3b8" }}>
                <b>Explanation:</b> {result.solution}
              </p>
            )}
            <button className="btn btn-primary" onClick={handleNext}>
              Next Question →
            </button>
          </div>
        )}

        {error && <p style={{ color: "#f87171", marginTop: "10px" }}>{error}</p>}
      </div>
    </div>
  );
}