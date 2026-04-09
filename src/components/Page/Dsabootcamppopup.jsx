import { useState, useEffect } from "react";

export default function DSABootcampPopup() {
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2 * 86400 + 14 * 3600 + 30 * 60);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const seen = localStorage.getItem("dsa_popup_v3_closed");
    if (!seen) setTimeout(() => setVisible(true), 1800);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const iv = setInterval(() => setTimeLeft(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const colors = ["#ff6b6b","#ffd93d","#6bcb77","#4d96ff","#c77dff","#ff9f43","#00d2d3","#ff6b9d"];
    setParticles(
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        dur: (Math.random() * 4 + 3).toFixed(1),
        delay: (Math.random() * 3).toFixed(1),
      }))
    );
  }, [visible]);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem("dsa_popup_v3_closed", "true");
  };

  const handleMoreDetails = () => {
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

        .dsa-bd{position:fixed;inset:0;z-index:9990;background:rgba(0,0,0,0.80);backdrop-filter:blur(7px);animation:dsaFdIn .3s ease;}
        .dsa-box{
          position:fixed;top:50%;left:50%;
          transform:translate(-50%,-50%);
          z-index:9999;
          width:min(460px,95vw);
          max-height:92vh;
          overflow-y:auto;
          border-radius:22px;
          background:#080810;
          border:1.5px solid rgba(255,255,255,0.08);
          box-shadow:0 0 0 1px rgba(255,107,107,0.1),0 0 80px rgba(77,150,255,0.15),0 40px 100px rgba(0,0,0,0.85);
          animation:dsaPopIn .45s cubic-bezier(.34,1.56,.64,1);
          scrollbar-width:none;
        }
        .dsa-box::-webkit-scrollbar{display:none;}

        .dsa-rainbow{
          height:3px;
          background:linear-gradient(90deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff,#c77dff,#ff6b9d,#ff6b6b);
          background-size:200% 100%;
          animation:dsaRainbow 3s linear infinite;
        }
        .dsa-ticker{
          overflow:hidden;padding:7px 0;
          background:rgba(255,217,61,0.05);
          border-bottom:1px solid rgba(255,255,255,0.04);
        }
        .dsa-ticker-txt{
          display:inline-block;white-space:nowrap;
          animation:dsaTick 18s linear infinite;
          font-family:'Space Mono',monospace;
          font-size:11px;color:#ffd93d;letter-spacing:.5px;
        }
        .dsa-hdr{
          position:relative;
          background:linear-gradient(145deg,#0d0d1e 0%,#080d1a 60%,#0d0814 100%);
          padding:28px 24px 22px;
          border-bottom:1px solid rgba(255,255,255,0.05);
          overflow:hidden;
        }
        .dsa-particle{position:absolute;border-radius:50%;pointer-events:none;animation:dsaFloat var(--dur,4s) ease-in-out var(--delay,0s) infinite alternate;}
        .dsa-close{
          position:absolute;top:14px;right:14px;
          width:30px;height:30px;border-radius:50%;
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.1);
          color:#667;font-size:14px;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          transition:background .2s,color .2s;z-index:10;
        }
        .dsa-close:hover{background:rgba(255,107,107,.25);color:#ff6b6b;}
        .dsa-live{
          display:inline-flex;align-items:center;gap:7px;
          background:rgba(107,203,119,0.1);
          border:1px solid rgba(107,203,119,.4);border-radius:30px;
          padding:5px 14px;margin-bottom:14px;
          font-family:'Space Mono',monospace;font-size:10px;
          color:#6bcb77;font-weight:700;letter-spacing:1.5px;
        }
        .dsa-live-dot{width:8px;height:8px;background:#6bcb77;border-radius:50%;box-shadow:0 0 8px #6bcb77;animation:dsaBlink 1s infinite;}
        .dsa-title{
          font-family:'Syne',sans-serif;
          font-size:clamp(24px,5vw,30px);font-weight:800;line-height:1.2;
          margin:0 0 10px;
          background:linear-gradient(135deg,#fff 0%,#c0d4ff 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .dsa-title-accent{
          background:linear-gradient(135deg,#ff6b6b,#ffd93d);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .dsa-sub{font-family:'Space Mono',monospace;font-size:12px;color:#4a5870;line-height:1.8;margin:0;}

        .dsa-body{padding:20px 24px 24px;}

        .dsa-highlights{
          display:grid;grid-template-columns:1fr 1fr;gap:10px;
          margin-bottom:20px;
        }
        .dsa-hl-card{
          border-radius:12px;padding:14px 12px;
          border:1px solid rgba(255,255,255,0.06);
          display:flex;align-items:center;gap:10px;
        }
        .dsa-hl-icon{font-size:20px;flex-shrink:0;}
        .dsa-hl-txt-main{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;display:block;}
        .dsa-hl-txt-sub{font-family:'Space Mono',monospace;font-size:10px;color:#445566;display:block;margin-top:1px;}

        .dsa-timer-box{
          background:rgba(255,107,107,.06);
          border:1px solid rgba(255,107,107,.2);
          border-radius:14px;padding:16px;margin-bottom:20px;
        }
        .dsa-timer-lbl{
          margin:0 0 10px;text-align:center;
          font-family:'Space Mono',monospace;font-size:11px;
          color:#ff9f43;letter-spacing:1px;text-transform:uppercase;
        }
        .dsa-timer-row{display:flex;gap:8px;}
        .dsa-t-unit{flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:11px;padding:12px 4px;text-align:center;}
        .dsa-t-num{
          font-family:'Space Mono',monospace;
          font-size:clamp(20px,4vw,26px);font-weight:700;display:block;
          background:linear-gradient(135deg,#ff6b6b,#ffd93d);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .dsa-t-sub{font-family:'Space Mono',monospace;font-size:9px;color:#334455;letter-spacing:1px;text-transform:uppercase;}

        .dsa-enroll{
          width:100%;padding:15px;
          background:linear-gradient(135deg,#ff6b6b,#ff9f43,#ffd93d);
          background-size:200% 200%;
          border:none;border-radius:13px;
          color:#08080f;font-weight:800;
          font-family:'Syne',sans-serif;font-size:15px;cursor:pointer;
          letter-spacing:.5px;
          animation:dsaGrad 3s ease infinite;
          transition:transform .2s,box-shadow .2s;
          margin-bottom:10px;
        }
        .dsa-enroll:hover{transform:translateY(-2px);box-shadow:0 10px 35px rgba(255,107,107,.4);}
        .dsa-enroll:active{transform:scale(.98);}

        .dsa-details-btn{
          width:100%;padding:11px;
          background:rgba(77,150,255,0.07);
          border:1px solid rgba(77,150,255,.2);
          border-radius:11px;color:#4d96ff;
          font-family:'Space Mono',monospace;font-size:12px;cursor:pointer;
          transition:background .2s,box-shadow .2s;
          margin-bottom:10px;
        }
        .dsa-details-btn:hover{background:rgba(77,150,255,.15);box-shadow:0 0 20px rgba(77,150,255,.15);}

        .dsa-later{
          width:100%;padding:9px;
          background:transparent;border:1px solid rgba(255,255,255,.07);
          border-radius:10px;color:#334455;
          font-family:'Space Mono',monospace;font-size:11px;cursor:pointer;
          transition:color .2s,border-color .2s;
        }
        .dsa-later:hover{color:#667788;border-color:rgba(255,255,255,.15);}
        .dsa-foot{margin:12px 0 0;text-align:center;font-family:'Space Mono',monospace;font-size:10px;color:#222d3a;}

        @keyframes dsaFdIn{from{opacity:0}to{opacity:1}}
        @keyframes dsaPopIn{from{opacity:0;transform:translate(-50%,-50%) scale(.82) translateY(20px)}to{opacity:1;transform:translate(-50%,-50%) scale(1) translateY(0)}}
        @keyframes dsaTick{0%{transform:translateX(110%)}100%{transform:translateX(-110%)}}
        @keyframes dsaBlink{0%,100%{opacity:1;box-shadow:0 0 8px #6bcb77}50%{opacity:.3;box-shadow:none}}
        @keyframes dsaFloat{0%{transform:translateY(0) scale(1)}100%{transform:translateY(-16px) scale(1.2)}}
        @keyframes dsaGrad{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes dsaRainbow{0%{background-position:0% 50%}100%{background-position:200% 50%}}

        @media(max-width:400px){
          .dsa-highlights{grid-template-columns:1fr 1fr;}
          .dsa-enroll{font-size:13px;padding:13px;}
          .dsa-title{font-size:22px;}
        }
      `}</style>

      {/* Backdrop */}
      <div className="dsa-bd" onClick={handleClose} />

      {/* Popup */}
      <div className="dsa-box">

        <div className="dsa-rainbow" />

        {/* Ticker */}
        <div className="dsa-ticker">
          <span className="dsa-ticker-txt">
            🚀 LIVE DSA BOOTCAMP 2026 — SESSIONS STARTING SOON &nbsp;·&nbsp; LIMITED SEATS &nbsp;·&nbsp; EARLY BIRD DISCOUNT &nbsp;·&nbsp; BASICS → ADVANCED &nbsp;·&nbsp; 🔥 DON'T MISS IT &nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>

        {/* Header */}
        <div className="dsa-hdr">
          {particles.map(p => (
            <div key={p.id} className="dsa-particle" style={{
              left:`${p.x}%`, top:`${p.y}%`,
              width:p.size, height:p.size,
              background:p.color,
              boxShadow:`0 0 ${p.size*2}px ${p.color}`,
              "--dur":`${p.dur}s`, "--delay":`${p.delay}s`,
              opacity:.5,
            }} />
          ))}

          <button className="dsa-close" onClick={handleClose}>✕</button>

          <div className="dsa-live">
            <span className="dsa-live-dot" />
            LIVE BOOTCAMP
          </div>

          <h2 className="dsa-title">
            DSA Bootcamp<br />
            <span className="dsa-title-accent">2026 🚀</span>
          </h2>

          <p className="dsa-sub">
            Basics se Advanced tak — live sessions,<br />
            doubt solving &amp; placement prep.
          </p>
        </div>

        {/* Body */}
        <div className="dsa-body">

          {/* Highlight cards */}
          <div className="dsa-highlights">
            <div className="dsa-hl-card" style={{background:"rgba(107,203,119,0.07)",borderColor:"rgba(107,203,119,0.15)"}}>
              <span className="dsa-hl-icon">📚</span>
              <div>
                <span className="dsa-hl-txt-main" style={{color:"#6bcb77"}}>30+ Sessions</span>
                <span className="dsa-hl-txt-sub">Live classes</span>
              </div>
            </div>
            <div className="dsa-hl-card" style={{background:"rgba(77,150,255,0.07)",borderColor:"rgba(77,150,255,0.15)"}}>
              <span className="dsa-hl-icon">💡</span>
              <div>
                <span className="dsa-hl-txt-main" style={{color:"#4d96ff"}}>500+ Problems</span>
                <span className="dsa-hl-txt-sub">Practice set</span>
              </div>
            </div>
            <div className="dsa-hl-card" style={{background:"rgba(255,217,61,0.07)",borderColor:"rgba(255,217,61,0.15)"}}>
              <span className="dsa-hl-icon">🎯</span>
              <div>
                <span className="dsa-hl-txt-main" style={{color:"#ffd93d"}}>FREE*</span>
                <span className="dsa-hl-txt-sub">Early access</span>
              </div>
            </div>
            <div className="dsa-hl-card" style={{background:"rgba(199,125,255,0.07)",borderColor:"rgba(199,125,255,0.15)"}}>
              <span className="dsa-hl-icon">🏆</span>
              <div>
                <span className="dsa-hl-txt-main" style={{color:"#c77dff"}}>Certificate</span>
                <span className="dsa-hl-txt-sub">On completion</span>
              </div>
            </div>
          </div>

          {/* Countdown timer */}
          <div className="dsa-timer-box">
            <p className="dsa-timer-lbl">⏳ Early bird offer ends in</p>
            <div className="dsa-timer-row">
              {[[fmt(days),"Days"],[fmt(hrs),"Hours"],[fmt(mins),"Mins"],[fmt(secs),"Secs"]].map(([v,l]) => (
                <div key={l} className="dsa-t-unit">
                  <span className="dsa-t-num">{v}</span>
                  <span className="dsa-t-sub">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enroll CTA */}
          <button className="dsa-enroll" onClick={handleMoreDetails}>
            🔥 Enroll Now — Check Full Details
          </button>

          {/* More details */}
          <button className="dsa-details-btn" onClick={handleMoreDetails}>
            📋 View Complete Course Details →
          </button>

          {/* Maybe later */}
          <button className="dsa-later" onClick={handleClose}>
            Maybe later
          </button>

          <p className="dsa-foot">*Free for first 100 students · Limited time offer</p>
        </div>

        <div className="dsa-rainbow" />
      </div>
    </>
  );
}