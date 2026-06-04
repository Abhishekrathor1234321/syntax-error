import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutModal from "../CheckoutModal";
import "./TCSCourseDetailPractice.css";

function TCSPYQCourseDetail() {
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
    if (openCheckout === "tcs-pyq-2026" && token) {
      sessionStorage.removeItem("openCheckout");
      setShowCheckout(true);
    }
  }, []);

  const handleEnrollClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      sessionStorage.setItem("redirectAfterLogin", "/course-detail/tcs-pyq-2026");
      sessionStorage.setItem("openCheckout", "tcs-pyq-2026");
      navigate("/login");
      return;
    }
    setShowCheckout(true);
  };

  const handleProceed = async ({ name, email, phone, finalAmount }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      sessionStorage.setItem("redirectAfterLogin", "/course-detail/tcs-pyq-2026");
      sessionStorage.setItem("openCheckout", "tcs-pyq-2026");
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(
        "https://syntax-error-1xds.vercel.app/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: finalAmount,
            courseTitle: "TCS PYQ Practice — DSA + Aptitude 2026",
          }),
        }
      );
      const data = await res.json();
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Syntax Error",
        description: "TCS PYQ Practice — DSA + Aptitude 2026",
        order_id: data.order.id,
        prefill: { name, email, contact: phone },
        modal: {
          ondismiss: async function () {
            const token = localStorage.getItem("token");
            const res = await fetch(
              "https://syntax-error-1xds.vercel.app/user/profile",
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            const hasCourse = data.user?.purchasedCourses?.some(
              (c) => c.title === "TCS PYQ Practice — DSA + Aptitude 2026"
            );
            if (hasCourse) {
              window.location.href = "/dashboard";
            }
          },
        },
        handler: async (response) => {
          const verifyRes = await fetch(
            "https://syntax-error-1xds.vercel.app/payment/verify-payment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                ...response,
                courseTitle: "TCS PYQ Practice — DSA + Aptitude 2026",
                amount: finalAmount,
                ref: refCode,
              }),
            }
          );
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("🎉 Payment successful! Course enrolled!");
            window.location.href = "/dashboard";
          } else {
            alert("Payment verification failed!");
          }
        },
        theme: { color: "#f97316" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async function (response) {
        console.log("Payment failed:", response.error);
      });

      rzp.open();
      setShowCheckout(false);

      const pollInterval = setInterval(async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://syntax-error-1xds.vercel.app/user/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        const hasCourse = data.user?.purchasedCourses?.some(
          (c) => c.title === "TCS PYQ Practice — DSA + Aptitude 2026"
        );
        if (hasCourse) {
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
      icon: "⚙️",
      label: "DSA PYQs",
      color: "#f97316",
      topics: [
        "Arrays",
        "Strings",
        "Linked List",
        "Stack & Queue",
        "Binary Search",
        "Trees & BST",
        "Graphs",
        "Dynamic Programming",
        "Greedy & Backtracking",
        "Bit Manipulation",
        "Hashing",
        "Two Pointer & Sliding Window",
      ],
    },
    {
      icon: "🧠",
      label: "Aptitude PYQs",
      color: "#eab308",
       topics: [
    "Quantitative Aptitude",
    "Verbal Ability",
    "Logical Reasoning",
    "Mathematics",
  ],

    },
  ];
  const faqs = [
    {
      q: "Who is this course for?",
      a: "Any student preparing for TCS NQT, TCS Digital, or TCS Prime in 2026-27. If you want focused PYQ practice with video solutions — this is for you.",
    },
    {
      q: "What makes this different from the Full Course?",
      a: "This course is 100% focused on Previous Year Questions — 50 DSA + 150 Aptitude — each with a detailed video solution. No theory, just targeted practice.",
    },
    {
      q: "What programming languages are used in DSA solutions?",
      a: "All 50 DSA problems are solved in Java, Python, and C++ so you can follow along in your preferred language.",
    },
    {
      q: "Do I get notes as well?",
      a: "Yes! Every aptitude topic comes with concise revision notes alongside the video solution — perfect for last-minute prep.",
    },
    {
      q: "Do I get Lifetime access?",
      a: "Yes, lifetime access to all 200 questions, video solutions, and any new PYQs added in future updates — at no extra cost.",
    },
    {
      q: "Is a certificate provided?",
      a: "Yes! A Syntax Error completion certificate is issued within 48 hours of enrollment.",
    },
  ];

  const stats = [
    { num: "50", suffix: " DSA", label: "Previous Year Questions" },
    { num: "150", suffix: " Aptitude", label: "Previous Year Questions" },
    { num: "200", suffix: "+", label: "Video Solutions" },
    { num: "5", suffix: ".0 ⭐", label: "Avg Rating" },
  ];

  return (
    <div className="cd-wrapper tcs-wrapper pyq-wrapper">
      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          course={{
            title: "TCS PYQ Practice — DSA + Aptitude 2026",
            amount: 799,
            coupons: {},
          }}
          onClose={() => setShowCheckout(false)}
          onProceed={handleProceed}
        />
      )}

      <div className="cd-page-grid">
        {/* ── HERO ── */}
        <section className="cd-hero tcs-hero pyq-hero">
          <div className="tcs-hero-grid-bg pyq-grid-bg" />
          <div className="tcs-hero-glow pyq-glow-1" />
          <div className="tcs-hero-glow pyq-glow-2" />

          <div className="cd-hero-content">
            {/* Badge */}
            <div className="tcs-badge-row">
              <span className="tcs-badge pyq-badge-orange">🔥 TCS NQT</span>
              <span className="tcs-badge pyq-badge-yellow">⚡ Digital</span>
              <span className="tcs-badge pyq-badge-red">🎯 Prime</span>
              <span className="tcs-badge pyq-badge-green">✅ PYQ Focused</span>
            </div>

            <h1 className="tcs-title">
              TCS PYQ
              <br />
              <span className="tcs-title-accent pyq-title-accent">
                Practice Bundle
              </span>
              <br />
              <span className="tcs-title-year">DSA + APTITUDE 2026</span>
            </h1>

            <p className="cd-subtitle">
              200 hand-picked Previous Year Questions — 50 DSA &amp; 150
              Aptitude — each with a step-by-step Video Solution &amp; Notes.
              The fastest way to crack TCS.
            </p>

            {/* Module Pills */}
            <div className="tcs-module-pills">
              {modules.map((m, i) => (
                <span
                  key={i}
                  className="tcs-pill"
                  style={{ "--pill-color": m.color }}
                >
                  {m.icon} {m.label}
                </span>
              ))}
              <span
                className="tcs-pill"
                style={{ "--pill-color": "#22c55e" }}
              >
                📄 Notes Included
              </span>
              <span
                className="tcs-pill"
                style={{ "--pill-color": "#a78bfa" }}
              >
                🎬 Video Solutions
              </span>
            </div>

            {/* Price */}
            <div className="cd-price-card">
              <span className="cd-price-label pyq-price-label">
                LIFETIME ACCESS — 200 PYQs WITH VIDEO SOLUTIONS
              </span>
              <div className="cd-price-row">
                <span className="tcs-price pyq-price">₹799</span>
                <span className="cd-price-og">₹7999</span>
                <span className="tcs-discount-badge pyq-discount-badge">
                  90% OFF
                </span>
              </div>
            </div>

            <button className="tcs-enroll-btn pyq-enroll-btn" onClick={handleEnrollClick}>
              Start Practicing Now →
            </button>

            {/* Video */}
            <div className="cd-preview-video">
              <p className="cd-preview-label">🎬 Course Preview</p>
              <div className="cd-video-wrapper tcs-video-wrapper pyq-video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/_7wYB5rEJnE"
                  title="TCS PYQ Practice Course Preview"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── CENTER COLUMN ── */}
        <div className="cd-center-col">

          {/* About */}
          <section className="cd-section" style={{ paddingTop: "2rem" }}>
            <div className="cd-description-card tcs-desc-card">
              <p className="cd-desc-text">
                Stop reading theory — start solving real TCS questions. This
                course gives you 50 actual DSA questions and 150 Aptitude
                questions asked in previous TCS NQT, Digital, and Prime exams.
                Every single question has a dedicated video solution walking you
                through the exact approach, with DSA solutions available in
                Java, Python, and C++. Aptitude topics also come with concise
                revision notes so you can revise fast before exam day.
              </p>

              <div className="tcs-what-you-get">
                <h3>📦 What's Inside This Bundle</h3>
                <div className="tcs-bundle-grid">
                  {[
                    {
                      icon: "⚙️",
                      title: "50 DSA PYQs",
                      desc: "Arrays, Strings, DP, Graphs, Trees & more — all from actual TCS papers",
                    },
                    {
                      icon: "🧠",
                      title: "150 Aptitude PYQs",
                      desc: "Quant + Logical Reasoning + Verbal — TCS NQT pattern",
                    },
                    {
                      icon: "🎬",
                      title: "200 Video Solutions",
                      desc: "Every question explained step-by-step in a dedicated video",
                    },
                    {
                      icon: "📄",
                      title: "Topic-wise Notes",
                      desc: "Concise PDF notes for every aptitude topic — great for revision",
                    },
                    {
                      icon: "💻",
                      title: "3 Language Support",
                      desc: "All DSA solutions in Java, Python & C++",
                    },
                    {
                      icon: "🔄",
                      title: "Lifetime Updates",
                      desc: "New PYQs added as TCS releases new patterns — free forever",
                    },
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

              <div className="cd-desc-info">
                <div className="cd-desc-info-item">
                  <span>🏆 Certificate</span>
                  <span>Within 48 hours of enrolling</span>
                </div>
                <div className="cd-desc-info-item">
                  <span>♾️ Access</span>
                  <span>Lifetime + Future PYQ Updates</span>
                </div>
                <div className="cd-desc-info-item">
                  <span>💻 Languages</span>
                  <span>Java, Python, C++</span>
                </div>
                <div className="cd-desc-info-item">
                  <span>🌐 Language</span>
                  <span>English (Beginner Friendly)</span>
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
            <h2 className="cd-section-title">Complete Question Bank</h2>
            <p className="cd-section-sub">
              2 focused modules — every PYQ you need to crack TCS 2026-27.
            </p>

            {/* Tab Headers */}
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

            {/* Tab Content */}
            <div
              className="cd-curriculum-card tcs-tab-content"
              style={{ "--tab-accent": modules[activeTab].color }}
            >
              <div className="tcs-tab-header">
                <span
                  className="tcs-tab-icon"
                  style={{
                    background: modules[activeTab].color + "22",
                    color: modules[activeTab].color,
                  }}
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
                    <span
                      className="cd-check"
                      style={{ color: modules[activeTab].color }}
                    >
                      ◎
                    </span>
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
                {
                  icon: "⚙️",
                  color: "#f97316",
                  title: "50 Real DSA PYQs",
                  desc: "Actual questions from TCS NQT, Digital & Prime papers — sorted by topic with difficulty tags.",
                  tag: "DSA PRACTICE",
                },
                {
                  icon: "🧠",
                  color: "#eab308",
                  title: "150 Aptitude PYQs",
                  desc: "Full Quant + Logical Reasoning + Verbal coverage matching the exact TCS NQT exam pattern.",
                  tag: "APTITUDE PRACTICE",
                },
                {
                  icon: "🎬",
                  color: "#22c55e",
                  title: "Video Solutions",
                  desc: "Every question has a step-by-step video — no more staring at answers without understanding.",
                  tag: "LEARN BY DOING",
                },
                {
                  icon: "📄",
                  color: "#a78bfa",
                  title: "Notes + 3 Languages",
                  desc: "Topic notes for revision & DSA solved in Java, Python and C++ for maximum flexibility.",
                  tag: "COMPLETE PACKAGE",
                },
              ].map((f, i) => (
                <div className="cd-feature-card" key={i}>
                  <span className="cd-feature-icon" style={{ color: f.color }}>
                    {f.icon}
                  </span>
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
            <p className="cd-section-sub">
              Three steps to ace the TCS exam.
            </p>
            <div className="cd-steps">
              <div className="cd-step">
                <div
                  className="cd-step-num"
                  style={{ background: "#f97316" }}
                >
                  1
                </div>
                <h4>Pick a Topic</h4>
                <p>
                  Choose a DSA or Aptitude topic from the question bank and
                  attempt the PYQ on your own first.
                </p>
              </div>
              <div className="cd-step-line" />
              <div className="cd-step">
                <div
                  className="cd-step-num"
                  style={{ background: "#eab308" }}
                >
                  2
                </div>
                <h4>Watch the Video Solution</h4>
                <p>
                  After attempting, watch the detailed video walkthrough to
                  understand the optimal approach and edge cases.
                </p>
              </div>
              <div className="cd-step-line" />
              <div className="cd-step">
                <div
                  className="cd-step-num"
                  style={{ background: "#22c55e" }}
                >
                  3
                </div>
                <h4>Revise with Notes</h4>
                <p>
                  Use topic notes before exam day for a quick revision of
                  formulas, patterns, and key approaches.
                </p>
              </div>
            </div>
          </section>

          {/* Instructor */}
          <section className="cd-section">
            <div className="cd-instructor-card tcs-instructor-card">
              <div className="cd-instructor-avatar tcs-instructor-avatar pyq-instructor-avatar">
                AR
              </div>
              <h3>Abhishek Rathor & Karina Sharma</h3>
              <p className="cd-instructor-role">
                Founder of SYNTAX ERROR & Infoys-DSE
              </p>
              <p>
                A passionate tech educator focused on making complex DSA and
                placement concepts accessible. Taught 1600+ students and
                mentored 50+ international students in 1-1 sessions. With a 5.0
                rating and a proven track record of helping students crack TCS,
                Infosys, Wipro and MAANG placements — Abhishek is the mentor you
                need for your 2026-27 placement journey.
              </p>
              <div className="cd-instructor-tags">
                <span>🎓 1600+ Students Taught</span>
                <span>🌍 50+ International Students</span>
                <span>⭐ 5.0 Rating</span>
                <span>💼 TCS Placement Expert</span>
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
                  className={`cd-faq tcs-faq pyq-faq ${openFaq === i ? "open" : ""}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="cd-faq-q">
                    <span>{faq.q}</span>
                    <span className="cd-faq-icon">
                      {openFaq === i ? "−" : "+"}
                    </span>
                  </div>
                  {openFaq === i && <p className="cd-faq-a">{faq.a}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* CTA Bottom */}
          <section className="cd-cta">
            <div className="cd-cta-card tcs-cta-card pyq-cta-card">
              <div className="tcs-cta-modules">
                {modules.map((m, i) => (
                  <span key={i} style={{ color: m.color }}>
                    {m.icon} {m.label}
                  </span>
                ))}
                <span style={{ color: "#22c55e" }}>🎬 Video Solutions</span>
                <span style={{ color: "#a78bfa" }}>📄 Notes</span>
              </div>
              <h2>
                200 PYQs. Every Answer
                <br />
                Explained on Video.
              </h2>
              <p>
                50 DSA + 150 Aptitude Previous Year Questions — each with a
                detailed video solution &amp; notes. The fastest path to cracking
                TCS 2026-27.
              </p>
              <span className="cd-cta-label">LIMITED TIME LAUNCH PRICE</span>
              <div className="cd-cta-price tcs-cta-price pyq-cta-price">
                ₹799
              </div>
              <button
                className="cd-cta-btn tcs-cta-btn pyq-cta-btn"
                onClick={handleEnrollClick}
              >
                Start Practicing Now →
              </button>
            </div>
          </section>
        </div>
        {/* end cd-center-col */}

        {/* RIGHT SIDEBAR — hidden via CSS */}
        <aside className="cd-right-col" />
      </div>
    </div>
  );
}

export default TCSPYQCourseDetail;