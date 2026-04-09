import { useState, useEffect } from "react";

export default function DSABootcampPopup() {
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2 * 86400 + 14 * 3600 + 30 * 60);

  // Har baar page open hone par show hoga — no localStorage
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const iv = setInterval(() => setTimeLeft(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, [visible]);

  const handleClose = () => setVisible(false);

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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .dp-overlay {
          position: fixed; inset: 0; z-index: 9990;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(5px);
          animation: dpFade .25s ease;
        }
        .dp-card {
          position: fixed; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
          width: min(400px, 92vw);
          border-radius: 20px;
          background: linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.15);
          animation: dpPop .35s cubic-bezier(.34,1.56,.64,1);
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }
        .dp-top {
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
        }
        .dp-body { padding: 28px 24px 24px; position: relative; }
        .dp-close {
          position: absolute; top: 16px; right: 16px;
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: #64748b; font-size: 13px;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          transition: all .2s;
        }
        .dp-close:hover { background: rgba(239,68,68,0.2); color: #ef4444; }

        .dp-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px; padding: 5px 12px;
          font-size: 10px; color: #94a3b8;
          font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; margin-bottom: 16px;
        }
        .dp-tag-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #22c55e; box-shadow: 0 0 6px #22c55e;
          animation: dpBlink 1.2s infinite;
        }

        .dp-title {
          font-size: clamp(20px, 5vw, 24px);
          font-weight: 800; color: #f1f5f9;
          line-height: 1.25; margin: 0 0 6px;
          letter-spacing: -0.3px;
        }
        .dp-year {
          font-size: clamp(20px, 5vw, 24px);
          font-weight: 800;
          background: linear-gradient(90deg, #a855f7, #ec4899);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .dp-desc {
          font-size: 13px; color: #64748b;
          line-height: 1.7; margin: 0 0 20px;
        }

        .dp-price-box {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 16px 18px;
          margin-bottom: 16px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .dp-price-label {
          font-size: 10px; color: #475569;
          letter-spacing: 1.5px; text-transform: uppercase;
          font-weight: 600; margin-bottom: 6px;
        }
        .dp-price-row { display: flex; align-items: center; gap: 10px; }
        .dp-price-main {
          font-size: 30px; font-weight: 800; color: #f1f5f9;
          letter-spacing: -1px;
        }
        .dp-price-old {
          font-size: 16px; color: #475569;
          text-decoration: line-through; font-weight: 500;
        }
        .dp-badge-off {
          background: #22c55e; color: #fff;
          font-size: 11px; font-weight: 700;
          padding: 4px 10px; border-radius: 8px;
          letter-spacing: 0.5px;
        }

        .dp-timer-label {
          font-size: 10px; color: #f97316;
          letter-spacing: 1.5px; text-transform: uppercase;
          text-align: center; margin: 0 0 10px;
          font-weight: 600;
        }
        .dp-timer { display: flex; gap: 6px; margin-bottom: 20px; }
        .dp-unit {
          flex: 1; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; padding: 10px 4px;
          text-align: center;
        }
        .dp-num {
          display: block; font-size: clamp(18px,4vw,22px);
          font-weight: 700; color: #f1f5f9; line-height: 1;
          margin-bottom: 4px; font-variant-numeric: tabular-nums;
        }
        .dp-lbl {
          font-size: 9px; color: #334155;
          letter-spacing: 1px; text-transform: uppercase;
        }

        .dp-btn {
          width: 100%; padding: 14px;
          background: #2563eb;
          border: none; border-radius: 12px;
          color: #fff; font-family: 'Inter', sans-serif;
          font-size: 15px; font-weight: 700;
          cursor: pointer; letter-spacing: 0.2px;
          transition: background .2s, transform .15s, box-shadow .2s;
          margin-bottom: 0;
        }
        .dp-btn:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 8px 25px rgba(37,99,235,0.4); }
        .dp-btn:active { transform: scale(.98); }

        @keyframes dpFade { from{opacity:0} to{opacity:1} }
        @keyframes dpPop { from{opacity:0;transform:translate(-50%,-50%) scale(.88)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        @keyframes dpBlink { 0%,100%{opacity:1} 50%{opacity:.2} }

        @media(max-width:380px){
          .dp-price-main{font-size:26px;}
          .dp-btn{font-size:14px; padding:13px;}
        }
      `}</style>

      <div className="dp-overlay" onClick={handleClose} />

      <div className="dp-card">
        <div className="dp-top" />
        <div className="dp-body">
          <button className="dp-close" onClick={handleClose}>✕</button>

          <div className="dp-tag">
            <span className="dp-tag-dot" />
            Live Bootcamp · 2026
          </div>

          <h2 className="dp-title">
            Complete DSA Course<br />
            <span className="dp-year">2026 🚀</span>
          </h2>
          <p className="dp-desc">
            Basics se Advanced tak — placements, internships aur MAANG interviews ke liye taiyaar karo.
          </p>

          <div className="dp-price-box">
            <div>
              <p className="dp-price-label">Lifetime Access</p>
              <div className="dp-price-row">
                <span className="dp-price-main">₹299</span>
                <span className="dp-price-old">₹1999</span>
                <span className="dp-badge-off">85% OFF</span>
              </div>
            </div>
          </div>

          <p className="dp-timer-label">⏳ Offer ends in</p>
          <div className="dp-timer">
            {[[fmt(days),"Days"],[fmt(hrs),"Hrs"],[fmt(mins),"Min"],[fmt(secs),"Sec"]].map(([v,l]) => (
              <div key={l} className="dp-unit">
                <span className="dp-num">{v}</span>
                <span className="dp-lbl">{l}</span>
              </div>
            ))}
          </div>

          <button className="dp-btn" onClick={handleEnroll}>
            Enroll Now →
          </button>
        </div>
      </div>
    </>
  );
}