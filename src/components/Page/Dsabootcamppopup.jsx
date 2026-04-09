import { useState, useEffect, useRef } from "react";

// const TOPICS = [
//   { label: "Arrays", icon: "▦", color: "#ff6b6b" },
//   { label: "Linked Lists", icon: "⬡", color: "#ffd93d" },
//   { label: "Trees", icon: "⌥", color: "#6bcb77" },
//   { label: "Graphs", icon: "◈", color: "#4d96ff" },
//   { label: "Dynamic Prog.", icon: "◉", color: "#c77dff" },
//   { label: "Sorting", icon: "⇅", color: "#ff9f43" },
//   { label: "Recursion", icon: "↺", color: "#00d2d3" },
//   { label: "Mock Interview", icon: "⌘", color: "#ff6b9d" },
// ];

// const STATS = [
//   { value: "30+", label: "Live Sessions", color: "#6bcb77", bg: "rgba(107,203,119,0.12)" },
//   { value: "500+", label: "Problems", color: "#4d96ff", bg: "rgba(77,150,255,0.12)" },
//   { value: "FREE", label: "Early Access", color: "#ffd93d", bg: "rgba(255,217,61,0.12)" },
//   { value: "∞", label: "Doubt Solving", color: "#c77dff", bg: "rgba(199,125,255,0.12)" },
// ];

// const DETAILS = [
//   { icon: "✓", color: "#6bcb77", bg: "rgba(107,203,119,0.15)", text: "Free notes — Arrays, Trees, DP & more" },
//   { icon: "✓", color: "#4d96ff", bg: "rgba(77,150,255,0.15)", text: "Live doubt-solving after every session" },
//   { icon: "✓", color: "#c77dff", bg: "rgba(199,125,255,0.15)", text: "Placement interview preparation included" },
//   { icon: "✓", color: "#ffd93d", bg: "rgba(255,217,61,0.15)", text: "Certificate of completion" },
//   { icon: "✓", color: "#ff9f43", bg: "rgba(255,159,67,0.15)", text: "Active WhatsApp + Instagram community" },
// ];

export default function DSABootcampPopup() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2 * 86400 + 14 * 3600 + 30 * 60);
  const [particles, setParticles] = useState([]);
  const [hoveredTopic, setHoveredTopic] = useState(null);

  useEffect(() => {
    const seen = localStorage.getItem("dsa_popup_v2_closed");
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
      Array.from({ length: 20 }, (_, i) => ({
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
    localStorage.setItem("dsa_popup_v2_closed", "true");
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

        .dsa-bd {
          position:fixed;inset:0;z-index:9990;
          background:rgba(0,0,0,0.78);
          backdrop-filter:blur(7px);
          animation:dsaFdIn .3s ease;
        }
        .dsa-box {
          position:fixed;top:50%;left:50%;
          transform:translate(-50%,-50%);
          z-index:9999;
          width:min(500px,96vw);
          max-height:94vh;
          overflow-y:auto;
          border-radius:20px;
          background:#080810;
          border:1.5px solid rgba(255,255,255,0.08);
          box-shadow:0 0 0 1px rgba(255,107,107,0.12),0 0 80px rgba(77,150,255,0.18),0 40px 100px rgba(0,0,0,0.8);
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
          background:linear-gradient(90deg,rgba(255,107,107,.08),rgba(77,150,255,.12),rgba(107,203,119,.08));
          border-bottom:1px solid rgba(255,255,255,0.05);
          overflow:hidden;padding:7px 0;
        }
        .dsa-ticker-txt{
          display:inline-block;white-space:nowrap;
          animation:dsaTick 16s linear infinite;
          font-family:'Space Mono',monospace;
          font-size:11px;color:#ffd93d;letter-spacing:.5px;
        }
        .dsa-hdr{
          position:relative;
          background:linear-gradient(145deg,#0d0d1e 0%,#080d1a 60%,#0d0814 100%);
          padding:26px 22px 20px;
          border-bottom:1px solid rgba(255,255,255,0.05);
          overflow:hidden;
        }
        .dsa-particle{
          position:absolute;border-radius:50%;pointer-events:none;
          animation:dsaFloat var(--dur,4s) ease-in-out var(--delay,0s) infinite alternate;
        }
        .dsa-close{
          position:absolute;top:14px;right:14px;
          width:30px;height:30px;border-radius:50%;
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.1);
          color:#556;font-size:14px;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          transition:background .2s,color .2s;z-index:10;
        }
        .dsa-close:hover{background:rgba(255,107,107,.2);color:#ff6b6b;}
        .dsa-live{
          display:inline-flex;align-items:center;gap:7px;
          background:linear-gradient(90deg,rgba(107,203,119,.15),rgba(107,203,119,.04));
          border:1px solid rgba(107,203,119,.4);border-radius:30px;
          padding:5px 14px;margin-bottom:13px;
          font-family:'Space Mono',monospace;font-size:10px;
          color:#6bcb77;font-weight:700;letter-spacing:1.5px;
        }
        .dsa-live-dot{
          width:8px;height:8px;background:#6bcb77;border-radius:50%;
          box-shadow:0 0 8px #6bcb77;animation:dsaBlink 1s infinite;
        }
        .dsa-title{
          font-family:'Syne',sans-serif;
          font-size:clamp(22px,5vw,28px);font-weight:800;line-height:1.2;
          margin:0 0 9px;
          background:linear-gradient(135deg,#fff 0%,#c0d4ff 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .dsa-sub{
          font-family:'Space Mono',monospace;font-size:12px;
          color:#4a5568;line-height:1.7;margin:0 0 16px;
        }
        .dsa-chip{
          display:inline-flex;align-items:center;gap:5px;
          border-radius:8px;padding:5px 11px;
          font-family:'Space Mono',monospace;font-size:11px;font-weight:700;
          border:1px solid;cursor:default;
          transition:transform .2s,box-shadow .2s;
        }
        .dsa-chip:hover{transform:translateY(-2px);}
        .dsa-body{padding:18px 22px;}
        .dsa-stat{
          border-radius:11px;padding:13px 6px;text-align:center;
          border:1px solid rgba(255,255,255,0.06);
          transition:transform .2s;
        }
        .dsa-stat:hover{transform:scale(1.05);}
        .dsa-stat-n{
          font-family:'Syne',sans-serif;font-size:21px;font-weight:800;
          margin:0 0 3px;display:block;
        }
        .dsa-stat-l{
          font-family:'Space Mono',monospace;font-size:10px;
          color:#3a4a5a;margin:0;letter-spacing:.3px;
        }
        .dsa-timer-box{
          background:rgba(255,107,107,.06);
          border:1px solid rgba(255,107,107,.2);
          border-radius:14px;padding:15px;margin-bottom:17px;
        }
        .dsa-timer-lbl{
          margin:0 0 9px;text-align:center;
          font-family:'Space Mono',monospace;font-size:11px;
          color:#ff9f43;letter-spacing:1px;text-transform:uppercase;
        }
        .dsa-t-unit{
          flex:1;background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:11px;padding:11px 4px;text-align:center;
        }
        .dsa-t-num{
          font-family:'Space Mono',monospace;
          font-size:clamp(18px,4vw,24px);font-weight:700;display:block;
          background:linear-gradient(135deg,#ff6b6b,#ffd93d);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .dsa-t-sub{font-family:'Space Mono',monospace;font-size:9px;color:#334;letter-spacing:1px;}
        .dsa-toggle{
          width:100%;padding:10px;
          background:rgba(77,150,255,.08);
          border:1px solid rgba(77,150,255,.25);
          border-radius:10px;color:#4d96ff;
          font-family:'Space Mono',monospace;font-size:12px;cursor:pointer;
          transition:background .2s;margin-bottom:13px;
        }
        .dsa-toggle:hover{background:rgba(77,150,255,.16);}
        .dsa-details{
          background:rgba(255,255,255,.03);
          border:1px solid rgba(255,255,255,.07);
          border-radius:12px;padding:15px;margin-bottom:15px;
          animation:dsaSlide .3s ease;
        }
        .dsa-d-row{display:flex;align-items:center;gap:10px;padding:4px 0;}
        .dsa-d-icon{
          width:20px;height:20px;border-radius:50%;flex-shrink:0;
          display:flex;align-items:center;justify-content:center;font-size:11px;
        }
        .dsa-d-txt{font-family:'Space Mono',monospace;font-size:11px;color:#6677aa;line-height:1.5;}
        .dsa-enroll{
          width:100%;padding:14px;
          background:linear-gradient(135deg,#ff6b6b,#ff9f43,#ffd93d);
          background-size:200% 200%;
          border:none;border-radius:12px;
          color:#08080f;font-weight:800;
          font-family:'Syne',sans-serif;font-size:15px;cursor:pointer;
          letter-spacing:.5px;
          animation:dsaGrad 3s ease infinite;
          transition:transform .2s,box-shadow .2s;margin-bottom:9px;
        }
        .dsa-enroll:hover{transform:translateY(-2px);box-shadow:0 10px 35px rgba(255,107,107,.45);}
        .dsa-enroll:active{transform:scale(.98);}
        .dsa-later{
          width:100%;padding:10px;
          background:transparent;
          border:1px solid rgba(255,255,255,.09);
          border-radius:10px;color:#3a4a58;
          font-family:'Space Mono',monospace;font-size:12px;cursor:pointer;
          transition:color .2s,border-color .2s;
        }
        .dsa-later:hover{color:#778;border-color:rgba(255,255,255,.18);}
        .dsa-foot{
          margin:11px 0 0;text-align:center;
          font-family:'Space Mono',monospace;font-size:10px;color:#25303a;
        }

        @keyframes dsaFdIn{from{opacity:0}to{opacity:1}}
        @keyframes dsaPopIn{from{opacity:0;transform:translate(-50%,-50%) scale(.82) translateY(24px)}to{opacity:1;transform:translate(-50%,-50%) scale(1) translateY(0)}}
        @keyframes dsaTick{0%{transform:translateX(110%)}100%{transform:translateX(-110%)}}
        @keyframes dsaBlink{0%,100%{opacity:1;box-shadow:0 0 8px #6bcb77}50%{opacity:.3;box-shadow:none}}
        @keyframes dsaFloat{0%{transform:translateY(0) scale(1)}100%{transform:translateY(-18px) scale(1.25)}}
        @keyframes dsaGrad{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes dsaRainbow{0%{background-position:0% 50%}100%{background-position:200% 50%}}
        @keyframes dsaSlide{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}

        @media (max-width:400px){
          .dsa-stat-n{font-size:17px;}
          .dsa-enroll{font-size:13px;padding:12px;}
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
            🚀Live DSA BOOTCAMP 2026 — LIVE SESSIONS STARTING SOON &nbsp;·&nbsp; LIMITED SEATS &nbsp;·&nbsp; EARLY BIRD DISCOUNT &nbsp;·&nbsp; Basics → Advance →  &nbsp;·&nbsp; 🔥 DON'T MISS IT &nbsp;&nbsp;&nbsp;&nbsp;
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
              opacity:.55,
            }} />
          ))}

          <button className="dsa-close" onClick={handleClose}>✕</button>

          <div className="dsa-live">
            <span className="dsa-live-dot" />
            LIVE BOOTCAMP
          </div>

          <h2 className="dsa-title">
            DSA Bootcamp<br />
            <span style={{background:"linear-gradient(135deg,#ff6b6b,#ffd93d)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
              2025 🚀
            </span>
          </h2>

          <p className="dsa-sub">
            Master Data Structures & Algorithms from scratch —<br />
            live sessions · doubt solving · placement prep
          </p>

          <div style={{display:"flex",flexWrap:"wrap",gap:"7px"}}>
            {TOPICS.map(t => (
              <span key={t.label} className="dsa-chip"
                onMouseEnter={() => setHoveredTopic(t.label)}
                onMouseLeave={() => setHoveredTopic(null)}
                style={{
                  color:t.color,
                  borderColor:`${t.color}44`,
                  background: hoveredTopic===t.label ? `${t.color}22` : `${t.color}0d`,
                  boxShadow: hoveredTopic===t.label ? `0 0 14px ${t.color}44` : "none",
                }}
              >
                <span style={{fontSize:"13px"}}>{t.icon}</span>{t.label}
              </span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="dsa-body">

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"8px",marginBottom:"18px"}}>
            {STATS.map(s => (
              <div key={s.label} className="dsa-stat" style={{background:s.bg}}>
                <span className="dsa-stat-n" style={{color:s.color}}>{s.value}</span>
                <p className="dsa-stat-l">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Countdown */}
          <div className="dsa-timer-box">
            <p className="dsa-timer-lbl">⏳ Early bird offer ends in</p>
            <div style={{display:"flex",gap:"8px"}}>
              {[[fmt(days),"Days"],[fmt(hrs),"Hours"],[fmt(mins),"Mins"],[fmt(secs),"Secs"]].map(([v,l]) => (
                <div key={l} className="dsa-t-unit">
                  <span className="dsa-t-num">{v}</span>
                  <span className="dsa-t-sub">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details toggle */}
          <button className="dsa-toggle" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "▲ Hide Details" : "▼ Check More Details"}
          </button>

          {showDetails && (
            <div className="dsa-details">
              {DETAILS.map((d, i) => (
                <div key={i} className="dsa-d-row">
                  <div className="dsa-d-icon" style={{background:d.bg,color:d.color}}>{d.icon}</div>
                  <span className="dsa-d-txt">{d.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <button className="dsa-enroll" onClick={() => window.open("https://live-dsa.vercel.app/","_blank")}>
            🔥 Check More Detail
          </button>
          {/* <button className="dsa-later" onClick={handleClose}>Maybe later</button> */}
          <p className="dsa-foot"> Limited time offer</p>
        </div>

        <div className="dsa-rainbow" />
      </div>
    </>
  );
}