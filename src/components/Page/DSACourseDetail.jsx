import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutModal from "../CheckoutModal";
import "./CourseDetail.css";

function DSACourseDetail() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleProceed = async ({ name, email, phone, finalAmount }) => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }
    try {
      const res = await fetch("https://syntax-error-1xds.vercel.app/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: finalAmount,
          courseTitle: "The Complete Data Structure & Algorithm Course 2026"
        })
      });
      const data = await res.json();
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Syntax Error",
        description: "The Complete Data Structure & Algorithm Course 2026",
        order_id: data.order.id,
        prefill: { name, email, contact: phone },
        handler: async (response) => {
          const verifyRes = await fetch("https://syntax-error-1xds.vercel.app/payment/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
           body: JSON.stringify({ ...response, courseTitle: "The Complete Data Structure & Algorithm Course 2026", amount: finalAmount })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("🎉 Payment successful! Course enrolled!");
            window.location.href = "/dashboard";
          } else {
            alert("Payment verification failed!");
          }
        },
        theme: { color: "#3b82f6" }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
      setShowCheckout(false);
    } catch (err) {
      alert("Payment error!");
    }
  };

  const topics = [
    "Variables, Data Types & Operators",
    "Input / Output & If-Else",
    "Loops (for, while, do-while)",
    "Functions & Recursion",
    "Time & Space Complexity",
    "Arrays & Strings",
    "Sorting & Searching Algorithms",
    "Binary Search & Hashing",
    "Two Pointer & Sliding Window",
    "Linked List, Stack & Queue",
    "Deque & Priority Queue (Heap)",
    "Trees (Binary Tree, BST)",
    "Greedy & Backtracking",
    "Graphs & Dynamic Programming",
    "Bit Manipulation",
    "LeetCode & Interview Problems",
  ];

  const faqs = [
    {
      q: "What programming languages are supported?",
      a: "Java, Python, and C++ — all three languages are covered with code examples for every topic."
    },
    {
      q: "Is this suitable for a complete beginner?",
      a: "Yes! The course starts from absolute basics and goes all the way to MAANG-level problems."
    },
    {
      q: "Do I get lifetime access?",
      a: "Yes, you get lifetime access to all videos, notes, and future updates."
    },
    {
      q: "Will this help with placements?",
      a: "Absolutely. The course is designed specifically for TCS, Infosys, Wipro, and MAANG placements."
    },
  ];

  return (
    <div className="cd-wrapper">

      {/* ✅ Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          course={{
            title: "The Complete Data Structure & Algorithm Course 2026",
            amount: 299,
            coupons: {
              "SYNTAX10": 10,
              "DSA20": 20,
              "ABHISHEKA99": 99,
            }
          }}
          onClose={() => setShowCheckout(false)}
          onProceed={handleProceed}
        />
      )}

      {/* Navbar back */}
      <div className="cd-topbar">
        <button onClick={() => navigate("/courses")} className="cd-back-btn">
          ← Back to Courses
        </button>
        <span className="cd-brand">SYNTAX ERROR</span>
      </div>

      {/* Hero Section */}
      <section className="cd-hero">
        <div className="cd-hero-bg" />
        <div className="cd-hero-content">
          <div className="cd-badge">⚡ LANGUAGE SUPPORT: JAVA / PYTHON / C++</div>
          <h1 className="cd-title">
            Complete Data Structure<br />& Algorithm Course<br />
            <span className="cd-title-accent">2026</span>
          </h1>
          <p className="cd-subtitle">
            Master Data Structures and Algorithms from zero to hero. Prepare for
            placements, internships, and MAANG interviews with structured concepts
            and LeetCode practice.
          </p>

          <div className="cd-price-card">
            <span className="cd-price-label">LIFETIME ACCESS</span>
            <div className="cd-price-row">
              <span className="cd-price">₹299</span>
              <span className="cd-price-og">₹1999</span>
              <span className="cd-discount-badge">85% OFF</span>
            </div>
          </div>

          <button className="cd-enroll-btn" onClick={() => setShowCheckout(true)}>
            Enroll Now →
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="cd-stats">
        <div className="cd-stat">
          <span className="cd-stat-num">5.0 ⭐</span>
          <span className="cd-stat-label">Average Rating</span>
        </div>
        <div className="cd-stat">
          <span className="cd-stat-num">20+</span>
          <span className="cd-stat-label">DSA Topics</span>
        </div>
        <div className="cd-stat">
          <span className="cd-stat-num">100+</span>
          <span className="cd-stat-label">LeetCode Problems</span>
        </div>
        <div className="cd-stat">
          <span className="cd-stat-num">70h+</span>
          <span className="cd-stat-label">Course Content</span>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="cd-section">
        <h2 className="cd-section-title">Master the Foundations</h2>
        <p className="cd-section-sub">
          A comprehensive roadmap designed to take you from writing your first
          line of code to solving complex graph problems.
        </p>

        <div className="cd-curriculum-card">
          <div className="cd-curriculum-icon">⚡</div>
          <h3>Comprehensive Curriculum</h3>
          <p>Every topic you need to master DSA and crack top-tier technical interviews.</p>
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
            <span className="cd-feature-icon" style={{ color: "#60a5fa" }}>📖</span>
            <h4>Structured Notes</h4>
            <p>Detailed PDF notes for every single topic, optimized for quick revision before interviews.</p>
            <span className="cd-feature-tag">STUDY MATERIAL</span>
          </div>
          <div className="cd-feature-card">
            <span className="cd-feature-icon" style={{ color: "#f472b6" }}>&lt;/&gt;</span>
            <h4>Practice Problems</h4>
            <p>100+ handpicked LeetCode problems with solutions in Java, Python & C++.</p>
            <span className="cd-feature-tag">HANDS-ON</span>
          </div>
          <div className="cd-feature-card">
            <span className="cd-feature-icon" style={{ color: "#a78bfa" }}>🎯</span>
            <h4>Placement Focused</h4>
            <p>Interview patterns from TCS, Infosys, Wipro, Amazon, Google & Microsoft.</p>
            <span className="cd-feature-tag">CAREER READY</span>
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="cd-section cd-steps-section">
        <h2 className="cd-section-title">How to Get Started</h2>
        <p className="cd-section-sub">Three simple steps to kickstart your coding journey.</p>

        <div className="cd-steps">
          <div className="cd-step">
            <div className="cd-step-num" style={{ background: "#7c3aed" }}>1</div>
            <h4>Secure Access</h4>
            <p>Instant access to all videos and notes immediately after booking.</p>
          </div>
          <div className="cd-step-line" />
          <div className="cd-step">
            <div className="cd-step-num" style={{ background: "#2563eb" }}>2</div>
            <h4>Learn & Practice</h4>
            <p>Follow the structured modules and solve the curated LeetCode questions.</p>
          </div>
          <div className="cd-step-line" />
          <div className="cd-step">
            <div className="cd-step-num" style={{ background: "#db2777" }}>3</div>
            <h4>Crack Interviews</h4>
            <p>Apply your knowledge to real placement and MAANG interview problems.</p>
          </div>
        </div>
      </section>

      {/* Instructor */}
      <section className="cd-section">
        <div className="cd-instructor-card">
          <div className="cd-instructor-avatar">AR</div>
          <h3>Learn from Abhishek</h3>
          <p>
            A passionate tech educator focused on making complex DSA concepts
            accessible for everyone. With a 5.0 rating and a track record of
            helping students master data structures, Abhishek provides the
            perfect bridge between theory and placement success.
          </p>
          <div className="cd-instructor-tags">
            <span>◎ Expert Mentor</span>
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
        <div className="cd-cta-card">
          <h2>Ready to Crack Your<br />Dream Interview?</h2>
          <p>Get the complete DSA bundle today and start your journey toward MAANG placements.</p>
          <span className="cd-cta-label">LIMITED TIME PRICE</span>
          <div className="cd-cta-price">₹299</div>
          <button className="cd-cta-btn" onClick={() => setShowCheckout(true)}>
            Enroll Now →
          </button>
        </div>
      </section>

    </div>
  );
}

export default DSACourseDetail;