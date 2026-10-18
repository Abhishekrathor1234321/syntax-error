import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutModal from "../CheckoutModal";
import "./CourseDetail.css";

const COURSE_TITLE = "Data Analytics Placement Ready Course With Projects";
const COURSE_KEY = "data-analytics"; // used in route + openCheckout flag
const COURSE_ROUTE = "/course-detail/data-analytics";
const COURSE_PRICE = 499;
const COURSE_OG_PRICE = 4999;
const PREVIEW_VIDEO_ID = ""; // 👈 preview YouTube video ID yahan daalna (optional)

function DataAnalyticsCourseDetail() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // ✅ Referral tracking
  const refCode = new URLSearchParams(window.location.search).get("ref") ||
    sessionStorage.getItem("courseRef") || "";
  if (refCode) sessionStorage.setItem("courseRef", refCode);

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem("token");
    const openCheckout = sessionStorage.getItem("openCheckout");
    if (openCheckout === COURSE_KEY && token) {
      sessionStorage.removeItem("openCheckout");
      setShowCheckout(true);
    }
  }, []);

  const handlePayment = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      sessionStorage.setItem("redirectAfterLogin", COURSE_ROUTE);
      sessionStorage.setItem("openCheckout", COURSE_KEY);
      navigate("/login");
      return;
    }
    setShowCheckout(true);
  };

  const handleProceedPayment = async ({ name, email, phone, finalAmount, couponCode }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      sessionStorage.setItem("redirectAfterLogin", COURSE_ROUTE);
      sessionStorage.setItem("openCheckout", COURSE_KEY);
      navigate("/login");
      return;
    }
    setShowCheckout(false);
    try {
      const res = await fetch("https://syntax-error-1xds.vercel.app/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: COURSE_PRICE, courseTitle: COURSE_TITLE, couponCode: couponCode || null, ref: refCode })
      });
      const data = await res.json();

      // Coupon invalid / expire / limit khatam hone par server message bhejta hai
      if (!data.order) {
        alert(data.message || "Order banane me dikkat aayi. Dobara try karo.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Syntax Error",
        description: COURSE_TITLE,
        order_id: data.order.id,
        prefill: { name, email, contact: phone },
        handler: async function (response) {
          const verifyRes = await fetch("https://syntax-error-1xds.vercel.app/payment/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              ...response,
              courseTitle: COURSE_TITLE,
              amount: finalAmount,
              couponCode: couponCode || null,  // ✅ coupon usage count ke liye
              ref: refCode
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
      alert("Your session has expired. Please logout and login again, then try the payment again!");
    }
  };

  const topics = [
    "Excel — Formulas, Functions & Pivot Tables",
    "Excel — Dashboards & Data Cleaning",
    "SQL — Basics (SELECT, WHERE, ORDER BY)",
    "SQL — Joins, Subqueries & CTEs",
    "SQL — Window Functions & Advanced Queries",
    "Python — Fundamentals for Data Analysis",
    "NumPy — Arrays & Numerical Computing",
    "Pandas — Data Manipulation & Analysis",
    "Data Cleaning & Preprocessing",
    "Exploratory Data Analysis (EDA)",
    "Statistics for Data Analytics",
    "Data Visualization — Matplotlib & Seaborn",
    "Dashboard Creation",
    "Real-World Analytics Projects",
    "Portfolio Building & Interview Preparation",
  ];

  const faqs = [
    {
      q: "Who is this course for?",
      a: "Beginners, college students and working professionals who want to become job-ready Data Analysts and crack internships and Data Analyst roles."
    },
    {
      q: "Is prior experience required?",
      a: "No! The course starts from the basics and builds up step by step. No prior coding or analytics experience is needed."
    },
    {
      q: "Do I get lifetime access?",
      a: "Yes, lifetime access to all 20 HD video lectures, PDF notes, source code and future additions."
    },
    {
      q: "Will I get project source code?",
      a: "Yes, you get the complete source code for all projects so you can build your own portfolio."
    },
    {
      q: "Do I get a certificate?",
      a: "Yes, you receive a Certificate of Completion after enrolling."
    },
  ];

  return (
    <div className="cd-wrapper">

      {showCheckout && (
        <CheckoutModal
          course={{
            title: COURSE_TITLE,
            amount: COURSE_PRICE,
            coupons: {
              // "DATA10": 10,
              // "SYNTAX20": 20,
            }
          }}
          onClose={() => setShowCheckout(false)}
          onProceed={handleProceedPayment}
        />
      )}

      <div className="cd-page-grid">

        {/* ── Hero ── */}
        <section className="cd-hero">
          <div className="cd-hero-bg" />
          <div className="cd-hero-content">
            <div className="cd-badge">📊 EXCEL · SQL · PYTHON · VISUALIZATION</div>
            <h1 className="cd-title">
              Data Analytics Placement<br />Ready Course
              <span className="cd-title-accent"> With Projects</span>
            </h1>
            <p className="cd-subtitle">
              Master Data Analytics from Basics to Advanced and build the skills required
              to become a Job-Ready Data Analyst. Learn Excel, SQL, Python, Data
              Visualization, Statistics, and Real-World Analytics step by step.
            </p>

            <div className="cd-price-card">
              <span className="cd-price-label">LIFETIME ACCESS</span>
              <div className="cd-price-row">
                <span className="cd-price">₹{COURSE_PRICE}</span>
                <span className="cd-price-og">₹{COURSE_OG_PRICE}</span>
                <span className="cd-discount-badge">90% OFF</span>
              </div>
            </div>

            <button className="cd-enroll-btn" onClick={handlePayment}>
              Enroll Now →
            </button>

            {PREVIEW_VIDEO_ID && (
              <div className="cd-preview-video">
                <p className="cd-preview-label">🎬 See What You'll Learn</p>
                <div className="cd-video-wrapper">
                  <iframe
                    src={`https://www.youtube.com/embed/${PREVIEW_VIDEO_ID}`}
                    title="Data Analytics Course Preview"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── CENTER COLUMN ── */}
        <div className="cd-center-col">

          {/* Description */}
          <section className="cd-section" style={{ paddingTop: "2rem", paddingBottom: "1rem" }}>
            <div className="cd-description-card">
              <p className="cd-desc-text">
                Master Data Analytics from Basics to Advanced and build the skills required to
                become a Job-Ready Data Analyst. This comprehensive course covers Excel, SQL,
                Python, Data Visualization, Statistics, and Real-World Analytics through a
                step-by-step learning approach. Whether you're a beginner, college student, or
                working professional, this course will help you gain practical skills and
                confidence to crack internships and Data Analyst roles.
              </p>

              <div className="cd-curriculum-card" style={{ marginTop: "1rem" }}>
                <h3>What You Will Get in This Course</h3>
                <p>Everything you need to become a job-ready Data Analyst.</p>
                <ul className="cd-topics-list">
                  {[
                    "🎥 HD Video Lectures with lifetime access",
                    "📚 Premium PDF Notes for every module",
                    "💻 Complete Source Code for all projects",
                    "📊 Real-World Data Analytics Projects",
                    "📝 Practice Assignments",
                    "📈 Excel, SQL, Python (Pandas & NumPy), Data Cleaning, Data Analysis, Data Visualization & Dashboard Creation",
                    "🚀 Build an industry-ready portfolio with hands-on projects",
                    "🏆 Certificate of Completion",
                  ].map((item, i) => (
                    <li key={i}>
                      <span style={{ color: "#22c55e" }}>✅</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cd-desc-info">
                <div className="cd-desc-info-item">
                  <span>🏆 Certificate</span>
                  <span>Within 48 hours after enrolling</span>
                </div>
                <div className="cd-desc-info-item">
                  <span>♾️ Access</span>
                  <span>Permanent / Lifetime Access</span>
                </div>
                <div className="cd-desc-info-item">
                  <span>📚 Language</span>
                  <span>English</span>
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="cd-stats">
            <div className="cd-stat">
              <span className="cd-stat-num">20</span>
              <span className="cd-stat-label">Video Lectures</span>
            </div>
            <div className="cd-stat">
              <span className="cd-stat-num">6</span>
              <span className="cd-stat-label">Core Skills</span>
            </div>
            <div className="cd-stat">
              <span className="cd-stat-num">♾️</span>
              <span className="cd-stat-label">Lifetime Access</span>
            </div>
            <div className="cd-stat">
              <span className="cd-stat-num">🏆</span>
              <span className="cd-stat-label">Certificate</span>
            </div>
          </section>

          {/* What You'll Learn */}
          <section className="cd-section">
            <h2 className="cd-section-title">Master Every Skill</h2>
            <p className="cd-section-sub">
              A complete Data Analytics roadmap — from Excel to Python, SQL to dashboards.
            </p>
            <div className="cd-curriculum-card">
              <h3>Complete Data Analytics Syllabus</h3>
              <p>Every tool, technique and project you need to land an internship or Data Analyst role.</p>
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
                <h4>PDF Notes & Source Code</h4>
                <p>Premium notes for every module plus complete source code of all projects.</p>
                <span className="cd-feature-tag">STUDY MATERIAL</span>
              </div>
              <div className="cd-feature-card">
                <span className="cd-feature-icon" style={{ color: "#fbbf24" }}>📊</span>
                <h4>Real-World Projects</h4>
                <p>Hands-on analytics projects to build an industry-ready portfolio.</p>
                <span className="cd-feature-tag">HANDS-ON</span>
              </div>
              <div className="cd-feature-card">
                <span className="cd-feature-icon" style={{ color: "#f87171" }}>🎯</span>
                <h4>Placement Focused</h4>
                <p>Built to help you crack internships and Data Analyst interviews.</p>
                <span className="cd-feature-tag">JOB READY</span>
              </div>
            </div>
          </section>

          {/* How to Get Started */}
          <section className="cd-section cd-steps-section">
            <h2 className="cd-section-title">How to Get Started</h2>
            <p className="cd-section-sub">Three simple steps to become a job-ready Data Analyst.</p>
            <div className="cd-steps">
              <div className="cd-step">
                <div className="cd-step-num" style={{ background: "#059669" }}>1</div>
                <h4>Enroll & Access</h4>
                <p>Get instant access to all 20 videos, PDF notes and source code after enrollment.</p>
              </div>
              <div className="cd-step-line" />
              <div className="cd-step">
                <div className="cd-step-num" style={{ background: "#d97706" }}>2</div>
                <h4>Learn & Practice</h4>
                <p>Learn Excel, SQL, Python and solve practice assignments step by step.</p>
              </div>
              <div className="cd-step-line" />
              <div className="cd-step">
                <div className="cd-step-num" style={{ background: "#dc2626" }}>3</div>
                <h4>Build Portfolio</h4>
                <p>Complete real-world projects and get ready for Data Analyst roles.</p>
              </div>
            </div>
          </section>

          {/* Instructor */}
          <section className="cd-section">
            <div className="cd-instructor-card">
              <div className="cd-instructor-avatar cd-instructor-avatar-apt">SJ</div>
              <h3>Learn from Shreyank Jawai</h3>
              <p>
                Data Analytics mentor who teaches Excel, SQL, Python and dashboards
                with a practical, project-based approach to make you job-ready.
              </p>
              <div className="cd-instructor-tags">
                <span>📊 Data Analytics Mentor</span>
                <span>🎓 Placement Focused</span>
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
              <h2>Ready to Become a<br />Job-Ready Data Analyst?</h2>
              <p>Get the complete Data Analytics course with projects today and start building your portfolio.</p>
              <span className="cd-cta-label">LIMITED TIME PRICE</span>
              <div className="cd-cta-price">₹{COURSE_PRICE}</div>
              <button className="cd-cta-btn" onClick={handlePayment}>
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

export default DataAnalyticsCourseDetail;