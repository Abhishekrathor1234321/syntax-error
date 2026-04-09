import { useState, useEffect } from "react";

export default function DSABootcampPopup() {
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2 * 86400 + 14 * 3600 + 30 * 60);

  useEffect(() => {
    const seen = localStorage.getItem("dsa_popup_v4_closed");
    if (!seen) setTimeout(() => setVisible(true), 1800);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const iv = setInterval(() => setTimeLeft(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, [visible]);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem("dsa_popup_v4_closed", "true");
  };

  const handleEnroll = () => {
    window.open("https://live-dsa.vercel.app/", "_blank");
  };

  if (!visible) return null;

  const fmt = n => String(n).padStart(2, "0");
  const days = Math.floor(timeLeft / 86400);
  const hrs  = Math.floor((timeLeft % 86400) / 3600);
  const mins = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');

        .dp-backdrop {
          position: fixed; inset: 0; z-index: 9990;
          background: rgba(0,0,0,0.72);
          backdrop-filter: blur(6px);
          animation: dpFade .3s ease;
        }
        .dp-card {
          position: fixed; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
          width: min(420px, 94vw);
          border-radius: 20px;
          background: #0c0c14;
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: 0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(99,102,241,0.12);
          animation: dpPop .4s cubic-bezier(.34,1.56,.64,1);
          overflow: hidden;
        }
        .dp-top-bar {
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #f97316, #eab308);
          background-size: 200% 100%;
          animation: dpBar 4s linear infinite;
        }
        .dp-inner { padding: 28px 26px 26px; }
        .dp-close {
          position: absolute; top: 16px; right: 16px;
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #555; font-size: 13px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all .2s;
        }
        .dp-close:hover { background: rgba(239,68,68,0.2); color: #ef4444; border-color: rgba(239,68,68,0.3); }
        .dp-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.3);
          border-radius: 20px; padding: 4px 12px;
          font-family: 'Space Mono', monospace;
          font-size: 10px; color: #22c55e;
          font-weight: 700; letter-spacing: 1.5px;
          margin-bottom: 16px;
        }
        .dp-badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #22c55e; box-shadow: 0 0 6px #22c55e;
          animation: dpBlink 1s infinite;
        }
        .dp-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(26px, 6vw, 32px);
          font-weight: 800; line-height: 1.15;
          margin: 0 0 8px; color: #f1f5f9;
          letter-spacing: -0.5px;
        }
        .dp-title span {
          background: linear-gradient(90deg, #a855f7, #ec4899);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .dp-desc {
          font-family: 'Space Mono', monospace;
          font-size: 12px; color: #475569;
          line-height: 1.8; margin: 0 0 22px;
        }
        .dp-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 0 -26px 22px;
        }
        .dp-timer-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px; color: #f97316;
          letter-spacing: 1.5px; text-transform: uppercase;
          text-align: center; margin: 0 0 12px;
        }
        .dp-timer {
          display: flex; gap: 8px; margin-bottom: 22px;
        }
        .dp-unit {
          flex: 1; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; padding: 10px 4px;
          text-align: center;
        }
        .dp-num {
          display: block;
          font-family: 'Space Mono', monospace;
          font-size: clamp(20px,5vw,26px); font-weight: 700;
          color: #f1f5f9; line-height: 1;
          margin-bottom: 4px;
        }
        .dp-lbl {
          font-family: 'Space Mono', monospace;
          font-size: 9px; color: #334155;
          letter-spacing: 1px; text-transform: uppercase;
        }
        .dp-btn-main {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
          background-size: 200% 200%;
          animation: dpGrad 4s ease infinite;
          border: none; border-radius: 12px;
          color: #fff; font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 800;
          cursor: pointer; letter-spacing: 0.3px;
          transition: transform .2s, box-shadow .2s;
          margin-bottom: 10px;
        }
        .dp-btn-main:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(168,85,247,0.35); }
        .dp-btn-main:active { transform: scale(.98); }
        .dp-btn-skip {
          width: 100%; padding: 10px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; color: #334155;
          font-family: 'Space Mono', monospace;
          font-size: 11px; cursor: pointer;
          transition: color .2s, border-color .2s;
        }
        .dp-btn-skip:hover { color: #64748b; border-color: rgba(255,255,255,0.14); }
        .dp-note {
          margin: 12px 0 0; text-align: center;
          font-family: 'Space Mono', monospace;
          font-size: 10px; color: #1e293b;
        }

        @keyframes dpFade { from{opacity:0} to{opacity:1} }
        @keyframes dpPop { from{opacity:0;transform:translate(-50%,-50%) scale(.85)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        @keyframes dpBar { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes dpBlink { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes dpGrad { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

        @media(max-width:380px){
          .dp-title{font-size:24px;}
          .dp-btn-main{font-size:13px;padding:12px;}
        }
      `}</style>

      <div className="dp-backdrop" onClick={handleClose} />

      <div className="dp-card">
        <div className="dp-top-bar" />

        <div className="dp-inner">
          <button className="dp-close" onClick={handleClose}>✕</button>

          <div className="dp-badge">
            <span className="dp-badge-dot" />
            LIVE BOOTCAMP
          </div>

          <h2 className="dp-title">
            DSA Bootcamp<br />
            <span>2026 🚀</span>
          </h2>

          <p className="dp-desc">
            Basics se Advanced tak — live sessions,<br />
            doubt solving &amp; placement prep.
          </p>

          <div className="dp-divider" />

          <p className="dp-timer-label">⏳ Early bird offer ends in</p>
          <div className="dp-timer">
            {[[fmt(days),"Days"],[fmt(hrs),"Hrs"],[fmt(mins),"Min"],[fmt(secs),"Sec"]].map(([v,l]) => (
              <div key={l} className="dp-unit">
                <span className="dp-num">{v}</span>
                <span className="dp-lbl">{l}</span>
              </div>
            ))}
          </div>

          <button className="dp-btn-main" onClick={handleEnroll}>
            🔥 Enroll Now — Check Full Details
          </button>

          <button className="dp-btn-skip" onClick={handleClose}>
            Maybe later
          </button>

          <p className="dp-note">*Free for first 100 students · Limited time</p>
        </div>
      </div>
    </>
  );
}