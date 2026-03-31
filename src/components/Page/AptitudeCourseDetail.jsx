import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CourseDetail.css";

function AptitudeCourseDetail() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ✅ Payment handler — inside component
  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    try {
      const res = await fetch("https://syntax-error-1xds.vercel.app/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: 99, courseTitle: "Complete Aptitude Course 2026" })
      });
      const data = await res.json();
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Syntax Error",
        description: "Complete Aptitude Course 2026",
        order_id: data.order.id,
        handler: async function (response) {
          const verifyRes = await fetch("https://syntax-error-1xds.vercel.app/payment/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              ...response,
              courseTitle: "Complete Aptitude Course 2026"
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("🎉 Payment successful!");
            window.location.href = "/dashboard";
          }
        },
        theme: { color: "#3b82f6" }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment error!");
    }
  };

  const topics = [
    "Percentage — Concepts & Tricks",
    "Ratio & Proportion",
    "Age Problems",
    "Partnership",
    "Average & Chain Rule",
    "Pipes & Cisterns",
    "Number System — Fundamentals",
    "Profit & Loss — Complete",
    "HCF & LCM",
    "AP & GP Series",
    "Speed, Distance & Time",
    "Boats & Trains",
    "Simple & Compound Interest",
    "Blood Relations",
    "Calendar & Clock Problems",
    "Coding & Decoding",
    "Direction Sense",
    "Seating Arrangement",
    "Permutations & Combinations",
    "Probability & Statistics",
  ];

  const faqs = [
    {
      q: "Who is this course for?",
      a: "Anyone preparing for TCS, Infosys, Wipro, Accenture, Capgemini or any campus placement aptitude round."
    },
    {
      q: "Is prior math knowledge required?",
      a: "No! The course starts from basics and builds up gradually. Class 10 math is more than enough."
    },
    {
      q: "Do I get lifetime access?",
      a: "Yes, lifetime access to all 30+ videos, PDF notes, and future additions."
    },
    {
      q: "How is this different from YouTube?",
      a: "Structured, placement-focused content with PDF notes and practice problems — not scattered tutorials."
    },
  ];

  return (
    <div className="cd-wrapper">

      {/* Navbar back */}
      <div className="cd-topbar">
        <button onClick={() => navigate("/courses")} className="cd-back-btn">
          ← Back to Courses
        </button>
        <span className="cd-brand">SYNTAX ERROR</span>
      </div>

      {/* Hero Section */}
      <section className="cd-hero cd-hero-aptitude">
        <div className="cd-hero-bg" />
        <div className="cd-hero-content">
          <div className="cd-badge">⚡ QUANTITATIVE · VERBAL · REASONING</div>
          <h1 className="cd-title">
            Complete Aptitude<br />Course
            <span className="cd-title-accent"> 2026</span>
          </h1>
          <p className="cd-subtitle">
            Crack any campus placement aptitude test with confidence. Master
            Quantitative, Verbal, and Logical Reasoning with shortcut tricks
            and timed practice.
          </p>

          <div className="cd-price-card">
            <span className="cd-price-label">LIFETIME ACCESS</span>
            <div className="cd-price-row">
              <span className="cd-price">₹99</span>
              <span className="cd-price-og">₹999</span>
              <span className="cd-discount-badge">90% OFF</span>
            </div>
          </div>

          <button className="cd-enroll-btn" onClick={handlePayment}>
            Enroll Now →
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="cd-stats">
        <div className="cd-stat">
          <span className="cd-stat-num">4.9 ⭐</span>
          <span className="cd-stat-label">Average Rating</span>
        </div>
        <div className="cd-stat">
          <span className="cd-stat-num">20+</span>
          <span className="cd-stat-label">Topics Covered</span>
        </div>
        <div className="cd-stat">
          <span className="cd-stat-num">5k+</span>
          <span className="cd-stat-label">Students Enrolled</span>
        </div>
        <div className="cd-stat">
          <span className="cd-stat-num">40h+</span>
          <span className="cd-stat-label">Course Content</span>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="cd-section">
        <h2 className="cd-section-title">Master Every Topic</h2>
        <p className="cd-section-sub">
          A complete placement aptitude syllabus — every topic asked in TCS,
          Infosys, Wipro, and AMCAT tests.
        </p>

        <div className="cd-curriculum-card cd-curriculum-aptitude">
          <div className="cd-curriculum-icon">📊</div>
          <h3>Complete Aptitude Syllabus</h3>
          <p>Every formula, shortcut trick and concept you need to clear any placement aptitude round.</p>
          <ul className="cd-topics-list">
            {topics.map((topic, i) => (
              <li key={i}>
                <span className="cd-check">◎</span> {topic}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Features */}
      <section className="cd-section">
        <div className="cd-features-grid">
          <div className="cd-feature-card">
            <span className="cd-feature-icon" style={{ color: "#34d399" }}>📖</span>
            <h4>PDF Notes</h4>
            <p>Chapterwise formula sheets and shortcut tricks for last-minute revision.</p>
            <span className="cd-feature-tag">STUDY MATERIAL</span>
          </div>
          <div className="cd-feature-card">
            <span className="cd-feature-icon" style={{ color: "#fbbf24" }}>⏱</span>
            <h4>Speed Math Tricks</h4>
            <p>Learn calculation shortcuts to solve aptitude questions 3x faster in tests.</p>
            <span className="cd-feature-tag">SHORTCUT TRICKS</span>
          </div>
          <div className="cd-feature-card">
            <span className="cd-feature-icon" style={{ color: "#f87171" }}>🎯</span>
            <h4>Placement Focused</h4>
            <p>100% aligned with TCS NQT, Infosys, Wipro, Accenture & AMCAT patterns.</p>
            <span className="cd-feature-tag">EXAM READY</span>
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="cd-section cd-steps-section">
        <h2 className="cd-section-title">How to Get Started</h2>
        <p className="cd-section-sub">Three simple steps to ace your placement aptitude.</p>

        <div className="cd-steps">
          <div className="cd-step">
            <div className="cd-step-num" style={{ background: "#059669" }}>1</div>
            <h4>Enroll & Access</h4>
            <p>Get instant access to all 30+ videos and PDF notes after enrollment.</p>
          </div>
          <div className="cd-step-line" />
          <div className="cd-step">
            <div className="cd-step-num" style={{ background: "#d97706" }}>2</div>
            <h4>Learn with Tricks</h4>
            <p>Master speed math shortcuts and formula-based solving techniques.</p>
          </div>
          <div className="cd-step-line" />
          <div className="cd-step">
            <div className="cd-step-num" style={{ background: "#dc2626" }}>3</div>
            <h4>Clear Aptitude</h4>
            <p>Score 90%+ in any campus placement aptitude round with confidence.</p>
          </div>
        </div>
      </section>

      {/* Instructor */}
      <section className="cd-section">
        <div className="cd-instructor-card cd-instructor-aptitude">
          <div className="cd-instructor-avatar cd-instructor-avatar-apt">KS</div>
          <h3>Learn from Karina Sharma</h3>
          <p>
            Infosys DSE with experience training students for campus placements.
            Known for simplifying complex aptitude concepts using shortcut tricks,
            smart problem-solving techniques, and real exam strategies.
          </p>
          <div className="cd-instructor-tags">
            <span>◎ Infosys DSE</span>
            <span>🎓 Placement Expert</span>
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
              className={`cd-faq ${openFaq === i ? "open" : ""}`}
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
        <div className="cd-cta-card cd-cta-aptitude">
          <h2>Ready to Clear Every<br />Aptitude Round?</h2>
          <p>Get the complete aptitude bundle today and never fear a placement test again.</p>
          <span className="cd-cta-label">LIMITED TIME PRICE</span>
          <div className="cd-cta-price">₹99</div>
          <button className="cd-cta-btn" onClick={handlePayment}>
            Enroll Now →
          </button>
        </div>
      </section>

    </div>
  );
}

export default AptitudeCourseDetail;