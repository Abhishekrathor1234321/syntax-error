import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutModal from "../CheckoutModal";
import "./CourseDetail.css";

const COURSE_TITLE = "CS Fundamentals + GenAI Placement Ready Course";
const COURSE_KEY = "cs-genai"; // used in openCheckout flag
const COURSE_ROUTE = "/course-detail/cs-genai";
const COURSE_PRICE = 299;
const COURSE_OG_PRICE = 2999;
const PREVIEW_VIDEO_ID = ""; // 👈 preview YouTube video ID yahan daalna (optional)

function CSGenAICourseDetail() {
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
    "DBMS — Core Concepts, Keys & Normalization",
    "DBMS — Transactions, ACID & Interview Questions",
    "OOPs — Classes, Objects & Pillars of OOP",
    "OOPs — Interview Questions & Real Examples",
    "Generative AI — Fundamentals & How LLMs Work",
    "Generative AI — Prompt Engineering & Applications",
    "Operating System — Complete Concepts",
    "Computer Networks — Complete Concepts",
  ];

  const faqs = [
    {
      q: "Who is this course for?",
      a: "Anyone preparing for campus placements and technical interviews who wants to master CS fundamentals and Generative AI."
    },
    {
      q: "Is prior knowledge required?",
      a: "No! The course starts from the basics and builds up step by step."
    },
    {
      q: "Do I get lifetime access?",
      a: "Yes, lifetime access to all video lectures, PDF notes and future additions."
    },
    {
      q: "Which subjects are covered?",
      a: "DBMS, OOPs, Generative AI, Operating System and Computer Networks — the core subjects asked in placement interviews."
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
              // "CSAI10": 10,
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
            <div className="cd-badge">🧠 DBMS · OOPS · GEN AI · OS · CN</div>
            <h1 className="cd-title">
              CS Fundamentals + GenAI<br />Placement Ready
              <span className="cd-title-accent"> Course</span>
            </h1>
            <p className="cd-subtitle">
              Master the core CS subjects asked in every placement interview — DBMS, OOPs,
              Operating System and Computer Networks — along with Generative AI, all in one place.
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
                    title="CS Fundamentals + GenAI Course Preview"
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
                This course covers the most important CS fundamentals — DBMS, OOPs, Operating
                System and Computer Networks — along with Generative AI, with a placement-focused
                approach. If you want to crack technical interviews and campus placements, this
                course gives you everything in one place with clear concepts and PDF notes.
              </p>

              <div className="cd-curriculum-card" style={{ marginTop: "1rem" }}>
                <h3>What You Will Get in This Course</h3>
                <p>Everything you need to clear CS fundamentals rounds.</p>
                <ul className="cd-topics-list">
                  {[
                    "DBMS, OOPs, Operating System & Computer Networks",
                    "Generative AI Fundamentals",
                    "Placement-Focused Video Lectures",
                    "PDF Notes for Every Subject",
                    "Interview Questions Coverage",
                    "Lifetime Access",
                    "Certificate of Completion",
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
              <span className="cd-stat-num">8</span>
              <span className="cd-stat-label">Video Lectures</span>
            </div>
            <div className="cd-stat">
              <span className="cd-stat-num">5</span>
              <span className="cd-stat-label">Core Subjects</span>
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
            <h2 className="cd-section-title">Master Every Subject</h2>
            <p className="cd-section-sub">
              The CS fundamentals and GenAI topics placement interviews focus on.
            </p>
            <div className="cd-curriculum-card">
              <h3>Complete Syllabus</h3>
              <p>Every concept you need to clear technical interview rounds.</p>
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
                <p>Subject-wise PDF notes for quick revision before interviews.</p>
                <span className="cd-feature-tag">STUDY MATERIAL</span>
              </div>
              <div className="cd-feature-card">
                <span className="cd-feature-icon" style={{ color: "#fbbf24" }}>🤖</span>
                <h4>Generative AI Included</h4>
                <p>Learn GenAI fundamentals along with core CS subjects.</p>
                <span className="cd-feature-tag">FUTURE READY</span>
              </div>
              <div className="cd-feature-card">
                <span className="cd-feature-icon" style={{ color: "#f87171" }}>🎯</span>
                <h4>Placement Focused</h4>
                <p>Built around what is actually asked in campus placements and interviews.</p>
                <span className="cd-feature-tag">INTERVIEW READY</span>
              </div>
            </div>
          </section>

          {/* How to Get Started */}
          <section className="cd-section cd-steps-section">
            <h2 className="cd-section-title">How to Get Started</h2>
            <p className="cd-section-sub">Three simple steps to ace your technical rounds.</p>
            <div className="cd-steps">
              <div className="cd-step">
                <div className="cd-step-num" style={{ background: "#059669" }}>1</div>
                <h4>Enroll & Access</h4>
                <p>Get instant access to all video lectures and PDF notes after enrollment.</p>
              </div>
              <div className="cd-step-line" />
              <div className="cd-step">
                <div className="cd-step-num" style={{ background: "#d97706" }}>2</div>
                <h4>Learn Subject-wise</h4>
                <p>Go through DBMS, OOPs, GenAI, OS and CN one by one.</p>
              </div>
              <div className="cd-step-line" />
              <div className="cd-step">
                <div className="cd-step-num" style={{ background: "#dc2626" }}>3</div>
                <h4>Crack Interviews</h4>
                <p>Revise with PDF notes and face technical interviews with confidence.</p>
              </div>
            </div>
          </section>

          {/* Instructor */}
          <section className="cd-section">
            <div className="cd-instructor-card">
              <div className="cd-instructor-avatar cd-instructor-avatar-apt">KS</div>
              <h3>Learn from Karina Sharma</h3>
              <p>
                Infosys DSE with experience training students for campus placements.
                Known for simplifying complex concepts for interviews.
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
              <h2>Ready to Crack Every<br />Technical Round?</h2>
              <p>Get CS Fundamentals + GenAI in one placement-ready course today.</p>
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

export default CSGenAICourseDetail;