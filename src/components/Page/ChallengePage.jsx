import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChallengePage.css";

function ChallengePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("language"); // language -> programming -> schedule

  const handleLanguageSelect = (lang) => {
    if (lang === "hindi") return; // locked
    setStep("programming");
  };

  const handleProgrammingSelect = (lang) => {
    if (lang !== "java") return; // locked
    navigate("/challenge/schedule");
  };

  return (
    <div className="cp-wrapper">
      <div className="cp-blob cp-blob1" />
      <div className="cp-blob cp-blob2" />

      {/* Header */}
      <div className="cp-header">
        <button className="cp-back-btn" onClick={() => navigate("/")}>← Back</button>
        <span className="cp-brand">SYNTAX ERROR</span>
      </div>

      {/* Step 1 — Choose Language */}
      {step === "language" && (
        <div className="cp-card">
          <div className="cp-badge">🔥 30 DAYS DSA CHALLENGE</div>
          <h1 className="cp-title">Choose Your Language</h1>
          <p className="cp-subtitle">Select the language you want to follow the challenge in.</p>

          <div className="cp-options">
            {/* English — Open */}
            <div
              className="cp-option cp-option-active"
              onClick={() => handleLanguageSelect("english")}
            >
              <span className="cp-option-flag">🇬🇧</span>
              <div className="cp-option-info">
                <h3>English</h3>
                <p>Available now</p>
              </div>
              <span className="cp-option-badge cp-open">OPEN</span>
            </div>

            {/* Hindi — Locked */}
            <div
              className="cp-option cp-option-locked"
              onClick={() => handleLanguageSelect("hindi")}
            >
              <span className="cp-option-flag">🇮🇳</span>
              <div className="cp-option-info">
                <h3>Hindi</h3>
                <p>Coming soon</p>
              </div>
              <span className="cp-option-badge cp-locked">🔒 LOCKED</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 — Choose Programming Language */}
      {step === "programming" && (
        <div className="cp-card">
          <div className="cp-badge">🔥 30 DAYS DSA CHALLENGE</div>
          <h1 className="cp-title">Select Programming Language</h1>
          <p className="cp-subtitle">Choose the language you want to code in.</p>

          <div className="cp-options">
            {/* Java — Open */}
            <div
              className="cp-option cp-option-active"
              onClick={() => handleProgrammingSelect("java")}
            >
              <span className="cp-option-flag">☕</span>
              <div className="cp-option-info">
                <h3>Java</h3>
                <p>Available now</p>
              </div>
              <span className="cp-option-badge cp-open">OPEN</span>
            </div>

            {/* C++ — Locked */}
            <div className="cp-option cp-option-locked">
              <span className="cp-option-flag">⚙️</span>
              <div className="cp-option-info">
                <h3>C++</h3>
                <p>Coming soon</p>
              </div>
              <span className="cp-option-badge cp-locked">🔒 LOCKED</span>
            </div>

            {/* Python — Locked */}
            <div className="cp-option cp-option-locked">
              <span className="cp-option-flag">🐍</span>
              <div className="cp-option-info">
                <h3>Python</h3>
                <p>Coming soon</p>
              </div>
              <span className="cp-option-badge cp-locked">🔒 LOCKED</span>
            </div>
          </div>

          <button className="cp-back-step" onClick={() => setStep("language")}>
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

export default ChallengePage;