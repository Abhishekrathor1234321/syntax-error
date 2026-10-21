import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutModal from "../CheckoutModal";
import "./TCSCourseDetailPractice.css"; // same CSS as TCS

// ───────── CONFIG ─────────
const COURSE_TITLE = "The Complete Infosys Course 2026"; // must match the player's title exactly
const COURSE_SLUG = "infosys-2026";
const PRICE = 999;
const ORIGINAL_PRICE = 9999;
const WHATSAPP_NUMBER = "919232169325"; // your WhatsApp number with country code, no "+"
const PREVIEW_VIDEO_ID = "jeY0Bq9XL7U";
const API = "https://syntax-error-1xds.vercel.app";

function InfosysCourseDetail() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const refCode =
    new URLSearchParams(window.location.search).get("ref") ||
    localStorage.getItem("courseRef") ||
    "";
  if (refCode) localStorage.setItem("courseRef", refCode);

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem("token");
    const openCheckout = sessionStorage.getItem("openCheckout");
    if (openCheckout === COURSE_SLUG && token) {
      sessionStorage.removeItem("openCheckout");
      setShowCheckout(true);
    }
  }, []);

  const redirectToLogin = () => {
    sessionStorage.setItem("redirectAfterLogin", `/course-detail/${COURSE_SLUG}`);
    sessionStorage.setItem("openCheckout", COURSE_SLUG);
    navigate("/login");
  };

  const handleEnrollClick = () => {
    if (!localStorage.getItem("token")) {
      redirectToLogin();
      return;
    }
    setShowCheckout(true);
  };

const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi, I have some doubts regarding the Infosys Complete Placement Course. Can you help me?"
)}`;
  const hasCourse = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    return data.user?.purchasedCourses?.some((c) => c.title === COURSE_TITLE);
  };

  const handleProceed = async ({ name, email, phone, finalAmount }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      redirectToLogin();
      return;
    }
    try {
      const res = await fetch(`${API}/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: finalAmount, courseTitle: COURSE_TITLE }),
      });
      const data = await res.json();
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Syntax Error",
        description: COURSE_TITLE,
        order_id: data.order.id,
        prefill: { name, email, contact: phone },
        modal: {
          ondismiss: async function () {
            if (await hasCourse()) window.location.href = "/dashboard";
          },
        },
        handler: async (response) => {
          const verifyRes = await fetch(`${API}/payment/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              ...response,
              courseTitle: COURSE_TITLE,
              amount: finalAmount,
              ref: refCode,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment successful! Course enrolled!");
            window.location.href = "/dashboard";
          } else {
            alert("Payment verification failed!");
          }
        },
        theme: { color: "#f97316" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => console.log("Payment failed:", response.error));
      rzp.open();
      setShowCheckout(false);

      const pollInterval = setInterval(async () => {
        if (await hasCourse()) {
          clearInterval(pollInterval);
          window.location.href = "/dashboard";
        }
      }, 3000);
      setTimeout(() => clearInterval(pollInterval), 30000);
    } catch (err) {
      alert("Payment error!");
    }
  };

  // ── Curriculum tabs ──
  const modules = [
    {
      icon: "🧠",
      label: "Aptitude",
      color: "#eab308",
      topics: [
        "Percentage, Ratio, Age, Partnership, Average",
        "Chain Rule, Pipes & Cisterns",
        "Number System, HCF & LCM, AP & GP",
        "Profit & Loss, Simple & Compound Interest",
        "Speed, Distance & Time, Boats & Trains",
        "Blood Relations, Calendar, Clock",
        "Coding-Decoding, Direction Sense, Seating Arrangement",
        "Statement & Assumptions, Data Sufficiency",
        "Permutations, Combinations, Probability",
        "Number Series, Statistics",
        "Verbal Ability (4 Parts)",
        "Aptitude PYQs",
      ],
    },
    {
      icon: "⚙️",
      label: "DSA & Coding",
      color: "#f97316",
      topics: [
        "Day 1 — Conditional Statement",
        "Day 2 — Loop",
        "Day 3 — Function",
        "Day 4 — Recursion & Backtracking",
        "Day 5 — Time & Space Complexity",
        "Day 6 — Array  |  Day 7 — String",
        "Day 8 — Sorting & Searching",
        "Day 9 — Two Pointers  |  Day 10 — Greedy",
        "Day 11 — Sliding Window",
        "Day 12 — Linked List  |  Day 13 — Fast & Slow Pointer",
        "Day 14 — Hash Set  |  Day 15 — Hash Map",
        "Day 16 — Stack  |  Day 17 — Queue",
        "Day 18 — Bit Manipulation",
        "Day 19-21 — Trees",
        "Day 22-25 — Graphs",
        "Day 26-30 — Dynamic Programming",
      ],
    },
    {
      icon: "🗄️",
      label: "CS Fundamentals",
      color: "#22c55e",
      topics: ["DBMS", "OOPs Concepts", "Operating System", "Computer Networks"],
    },
    {
      icon: "🤖",
      label: "Generative AI",
      color: "#a78bfa",
      topics: ["Generative AI — Part 1", "Generative AI — Part 2", "Notes for every topic"],
    },
  ];

  const faqs = [
    {
      q: "Who is this course for?",
      a: "Any student preparing for Infosys hiring (System Engineer, Digital Specialist Engineer or Specialist Programmer) in 2026-27. It starts from the basics, so beginners can follow along too.",
    },
    {
      q: "What does the course cover?",
      a: "Complete Aptitude (Quant, Reasoning, Verbal), DSA & Coding, Core CS Fundamentals (DBMS, OOPs, OS, CN) and Generative AI.",
    },
    {
      q: "How is the DSA part taught?",
      a: "Day-wise, one topic per day. It starts from Conditional Statements, Loops and Functions and goes up to Trees, Graphs and Dynamic Programming.",
    },
    {
      q: "Do I get notes as well?",
      a: "Yes. Notes for every module are shared in Google Drive folders, available right inside the course page.",
    },
    {
      q: "Do I get lifetime access?",
      a: "Yes, lifetime access to all videos, notes and future updates at no extra cost.",
    },
    {
      q: "Is a certificate provided?",
      a: "Yes. A Syntax Error completion certificate is issued within 48 hours of enrollment.",
    },
  ];

  const stats = [
    { num: "1600+", suffix: "+", label: "Students Taught" },
    { num: "4", suffix: " Modules", label: "Aptitude, DSA, CS, GenAI" },
    { num: "80+", suffix: "+", label: "Video Lectures" },
    { num: "5", suffix: ".0 ⭐", label: "Avg Rating" },
  ];

  return (
    <div className="cd-wrapper tcs-wrapper">
      {showCheckout && (
        <CheckoutModal
          course={{ title: COURSE_TITLE, amount: PRICE, coupons: {} }}
          onClose={() => setShowCheckout(false)}
          onProceed={handleProceed}
        />
      )}

      {/* Floating WhatsApp button */}
     {/* Floating WhatsApp button */}
<a
  href={whatsappLink}
  target="_blank"
  rel="noreferrer"
  style={{
    position: "fixed", bottom: "20px", right: "20px", zIndex: 999,
    background: "#25D366", color: "#fff", padding: "12px 18px",
    borderRadius: "999px", fontWeight: 600, textDecoration: "none",
    boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
  }}
>
  Have Doubts? Chat Now
</a>

      <div className="cd-page-grid">
        {/* ── HERO ── */}
        <section className="cd-hero tcs-hero">
          <div className="tcs-hero-grid-bg" />
          <div className="tcs-hero-glow" />

          <div className="cd-hero-content">
            <div className="tcs-badge-row">
              <span className="tcs-badge">Infosys SE</span>
              <span className="tcs-badge">DSE</span>
              <span className="tcs-badge">Specialist Programmer</span>
            </div>

            <h1 className="tcs-title">
              The Complete
              <br />
              <span className="tcs-title-accent">Infosys Course</span>
              <br />
              <span className="tcs-title-year">2026-27</span>
            </h1>

            <p className="cd-subtitle">
              Aptitude + DSA &amp; Coding + CS Fundamentals + Generative AI, in one course.
            </p>

            <div className="tcs-module-pills">
              {modules.map((m, i) => (
                <span key={i} className="tcs-pill" style={{ "--pill-color": m.color }}>
                  {m.icon} {m.label}
                </span>
              ))}
              <span className="tcs-pill" style={{ "--pill-color": "#22c55e" }}>📄 Notes Included</span>
            </div>

            <div className="cd-price-card">
              <span className="cd-price-label">LIFETIME ACCESS — COMPLETE INFOSYS PREPARATION</span>
              <div className="cd-price-row">
                <span className="tcs-price">₹{PRICE}</span>
                <span className="cd-price-og">₹{ORIGINAL_PRICE}</span>
                <span className="tcs-discount-badge">
                  {Math.round((1 - PRICE / ORIGINAL_PRICE) * 100)}% OFF
                </span>
              </div>
            </div>

            <button className="tcs-enroll-btn" onClick={handleEnrollClick}>
              Enroll Now →
            </button>

            {/* <div className="cd-preview-video">
              <p className="cd-preview-label">🎬 Course Preview</p>
              <div className="cd-video-wrapper tcs-video-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${PREVIEW_VIDEO_ID}`}
                  title="Infosys Course Preview"
                  allowFullScreen
                />
              </div>
            </div> */}
          </div>
        </section>

        {/* ── CENTER COLUMN ── */}
        <div className="cd-center-col">
          <section className="cd-section" style={{ paddingTop: "2rem" }}>
            <div className="cd-description-card tcs-desc-card">
              <p className="cd-desc-text">
                Infosys hires through System Engineer, Digital Specialist Engineer and Specialist
                Programmer roles, and the online assessment tests Aptitude, Reasoning, Verbal Ability
                and Coding. This course covers all of it: a complete aptitude program, a day-wise DSA
                plan from the basics to Dynamic Programming, Core CS revision (DBMS, OOPs, OS, CN) and
                Generative AI, with video lectures and notes for every topic.
              </p>

         <div className="tcs-what-you-get">
  <h3>📦 What's Inside This Course</h3>

  <div className="tcs-bundle-grid">
    {[
      { icon: "🧠", title: "Complete Aptitude", desc: "Quant + Reasoning + Verbal Ability with PYQs" },
      { icon: "⚙️", title: "DSA & Coding", desc: "Day-wise videos, from Conditionals to Graphs & DP" },
      { icon: "🗄️", title: "Core CS Fundamentals", desc: "DBMS, OOPs, Operating System & Computer Networks" },
      { icon: "🤖", title: "Generative AI", desc: "Modern GenAI concepts every fresher should know" },
      { icon: "📄", title: "Notes for Everything", desc: "Organised Google Drive folders for each module" },
      { icon: "🏆", title: "Certificate", desc: "Within 48 hours of enrolling" },
      { icon: "♾️", title: "Lifetime Access", desc: "Lifetime access + future updates" },
      { icon: "🌐", title: "Language", desc: "English (Beginner Friendly)" },
    ].map((item, i) => (
      <div className="tcs-bundle-item" key={i}>
        <span className="tcs-bundle-icon">{item.icon}</span>
        <div>
          <strong>{item.title}</strong>
          <p>{item.desc}</p>
        </div>
      </div>
    ))}
  </div>
</div>
            </div>
          </section>

          {/* Stats */}
          <section className="cd-stats tcs-stats">
            {stats.map((s, i) => (
              <div className="cd-stat" key={i}>
                <span className="cd-stat-num">
                  {s.num}
                  <span className="tcs-stat-suffix">{s.suffix}</span>
                </span>
                <span className="cd-stat-label">{s.label}</span>
              </div>
            ))}
          </section>

          {/* Curriculum Tabs */}
          <section className="cd-section">
            <h2 className="cd-section-title">Complete Curriculum</h2>
            <p className="cd-section-sub">4 focused modules for Infosys 2026-27.</p>

            <div className="tcs-tabs">
              {modules.map((m, i) => (
                <button
                  key={i}
                  className={`tcs-tab ${activeTab === i ? "tcs-tab-active" : ""}`}
                  style={{ "--tab-color": m.color }}
                  onClick={() => setActiveTab(i)}
                >
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            <div
              className="cd-curriculum-card tcs-tab-content"
              style={{ "--tab-accent": modules[activeTab].color }}
            >
              <div className="tcs-tab-header">
                <span
                  className="tcs-tab-icon"
                  style={{ background: modules[activeTab].color + "22", color: modules[activeTab].color }}
                >
                  {modules[activeTab].icon}
                </span>
                <div>
                  <h3>{modules[activeTab].label} Module</h3>
                  <p>{modules[activeTab].topics.length} topics covered</p>
                </div>
              </div>
              <ul className="cd-topics-list">
                {modules[activeTab].topics.map((topic, i) => (
                  <li key={i}>
                    <span className="cd-check" style={{ color: modules[activeTab].color }}>◎</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Features */}
          <section className="cd-section">
            <div className="cd-features-grid tcs-features-grid">
              {[
                { icon: "🧠", color: "#eab308", title: "Aptitude from Scratch", desc: "Every Quant, Reasoning and Verbal topic explained with tricks and practice.", tag: "APTITUDE" },
                { icon: "⚙️", color: "#f97316", title: "DSA & Coding", desc: "One topic per day, from basics to Graphs and DP, with notes.", tag: "CODING" },
                { icon: "🗄️", color: "#22c55e", title: "Core CS Covered", desc: "DBMS, OOPs, OS and CN, the theory Infosys interviews ask.", tag: "CS FUNDAMENTALS" },
                { icon: "🤖", color: "#a78bfa", title: "Generative AI", desc: "Stay ahead of other candidates with GenAI fundamentals.", tag: "FUTURE READY" },
              ].map((f, i) => (
                <div className="cd-feature-card" key={i}>
                  <span className="cd-feature-icon" style={{ color: f.color }}>{f.icon}</span>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                  <span className="cd-feature-tag">{f.tag}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Steps */}
          <section className="cd-section cd-steps-section">
            <h2 className="cd-section-title">How to Use This Course</h2>
            <p className="cd-section-sub">Three steps to crack Infosys.</p>
            <div className="cd-steps">
              <div className="cd-step">
                <div className="cd-step-num" style={{ background: "#f97316" }}>1</div>
                <h4>Follow the Daily Plan</h4>
                <p>Watch the day-wise DSA video and solve the practice problems on your own.</p>
              </div>
              <div className="cd-step-line" />
              <div className="cd-step">
                <div className="cd-step-num" style={{ background: "#eab308" }}>2</div>
                <h4>Practice Aptitude Daily</h4>
                <p>Cover Quant, Reasoning and Verbal alongside coding for balanced prep.</p>
              </div>
              <div className="cd-step-line" />
              <div className="cd-step">
                <div className="cd-step-num" style={{ background: "#22c55e" }}>3</div>
                <h4>Revise with Notes</h4>
                <p>Use the notes folders for CS Fundamentals, GenAI and quick revision before the exam.</p>
              </div>
            </div>
          </section>

          {/* Instructor */}
          <section className="cd-section">
            <div className="cd-instructor-card tcs-instructor-card">
              <div className="cd-instructor-avatar tcs-instructor-avatar">AR</div>
              <h3>Abhishek Rathor & Karina Sharma</h3>
              <p className="cd-instructor-role">Founder of SYNTAX ERROR & Infosys-DSE</p>
              <p>
                A passionate tech educator focused on making complex DSA and placement concepts
                accessible. Taught 1600+ students and mentored 50+ international students in 1-1
                sessions, with a 5.0 rating and a proven track record of helping students crack
                TCS, Infosys, Wipro and MAANG placements.
              </p>
              <div className="cd-instructor-tags">
                <span>🎓 1600+ Students Taught</span>
                <span>🌍 50+ International Students</span>
                <span>⭐ 5.0 Rating</span>
                <span>💼 Infosys Placement Expert</span>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="cd-section">
            <h2 className="cd-section-title">Frequently Asked Questions</h2>
            <div className="cd-faqs">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`cd-faq tcs-faq ${openFaq === i ? "open" : ""}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="cd-faq-q">
                    <span>{faq.q}</span>
                    <span className="cd-faq-icon">{openFaq === i ? "−" : "+"}</span>
                  </div>
                  {openFaq === i && <p className="cd-faq-a">{faq.a}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* CTA Bottom */}
          <section className="cd-cta">
            <div className="cd-cta-card tcs-cta-card">
              <div className="tcs-cta-modules">
                {modules.map((m, i) => (
                  <span key={i} style={{ color: m.color }}>{m.icon} {m.label}</span>
                ))}
              </div>
              <h2>
                One Course. Complete
                <br />
                Infosys Preparation.
              </h2>
              <p>
                Aptitude + DSA + CS Fundamentals + Generative AI, with notes for every topic.
              </p>
              <span className="cd-cta-label">LIMITED TIME LAUNCH PRICE</span>
              <div className="cd-cta-price tcs-cta-price">₹{PRICE}</div>
              <button className="cd-cta-btn tcs-cta-btn" onClick={handleEnrollClick}>
                Enroll Now →
              </button>
            </div>
          </section>
        </div>

        <aside className="cd-right-col" />
      </div>
    </div>
  );
}

export default InfosysCourseDetail;