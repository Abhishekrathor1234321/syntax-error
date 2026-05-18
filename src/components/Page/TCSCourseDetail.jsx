import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutModal from "../CheckoutModal";
import "./TCSCourseDetail.css";

function TCSCourseDetail() {
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
    if (openCheckout === "tcs2026" && token) {
      sessionStorage.removeItem("openCheckout");
      setShowCheckout(true);
    }
  }, []);

  const handleEnrollClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      sessionStorage.setItem("redirectAfterLogin", "/course-detail/tcs2026");
      sessionStorage.setItem("openCheckout", "tcs2026");
      navigate("/login");
      return;
    }
    setShowCheckout(true);
  };

  const handleProceed = async ({ name, email, phone, finalAmount }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      sessionStorage.setItem("redirectAfterLogin", "/course-detail/tcs2026");
      sessionStorage.setItem("openCheckout", "tcs2026");
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
            courseTitle: "The Complete TCS NQT Course 2026",
          }),
        }
      );
      const data = await res.json();
     const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  amount: data.order.amount,
  currency: "INR",
  name: "Syntax Error",
  description: "The Complete TCS NQT Course 2026",
  order_id: data.order.id,
  prefill: { name, email, contact: phone },
  modal: {
    ondismiss: async function() {
      const token = localStorage.getItem("token");
      const res = await fetch("https://syntax-error-1xds.vercel.app/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const hasCourse = data.user?.purchasedCourses?.some(
        c => c.title === "The Complete TCS NQT Course 2026"
      );
      if (hasCourse) {
        window.location.href = "/dashboard";
      }
    }
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
          courseTitle: "The Complete TCS NQT Course 2026",
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
  theme: { color: "#0ea5e9" },
};

 const rzp = new window.Razorpay(options);

rzp.on('payment.failed', async function(response) {
  console.log("Payment failed:", response.error);
});



rzp.open();
setShowCheckout(false);

const pollInterval = setInterval(async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("https://syntax-error-1xds.vercel.app/user/profile", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  const hasCourse = data.user?.purchasedCourses?.some(
    c => c.title === "The Complete TCS NQT Course 2026"
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
      label: "DSA",
      color: "#6366f1",
      topics: [
         "Arrays & Strings",
        "Sorting & Searching Algorithms",
        "Binary Search & Hashing",
        "Two Pointer & Sliding Window",
        "Linked List, Stack & Queue",
        "Trees (Binary Tree, BST)",
        "Graphs & Dynamic Programming",
        "Greedy, Backtracking & Bit Manipulation",
        "80+ LeetCode Interview Problems",
        "Previous Year Question Solved",
        "& Many More...",
      ],
    },
    {
      icon: "🧠",
      label: "Aptitude",
      color: "#f59e0b",
      topics: [
       "Percentage",
"Ratio and Proportion",
"Age Problems",
"Partnership",
"Average",
"Chain Rule",
"Pipes and Cistern",
"Number System",
"Profit and Loss",
"HCF & LCM",
"AP & GP",
"Speed Distance and Time",
"Boats and Streams",
"Train Problems",
"Simple & Compound Interest",
"Permutations and Combinations",
"Probability",
"Statistics",
"Number Series",
"Counting Figures",
"Blood Relations",
"Calendar Problems",
"Clock Problems",
"Coding & Decoding",
"Direction Sense",
"Seating Arrangement",
"Statement & Assumptions",
"Data Sufficiency",
"Verbal Ability",
        "& Many More...",
      ],
    },
    {
      icon: "💻",
      label: "CS Fundamentals",
      color: "#10b981",
      topics: [
        "Operating Systems",
        "DBMS",
        "Computer Networks",
        "OOPs",
        "Interview Questions",
        "& Many More...",
      
      ],
    },
    {
      icon: "🎯",
      label: "Interview Questions",
      color: "#ec4899",
      topics: [
        "HR Interview — Tell Me About Yourself",
        "Behavioural Questions (STAR Method)",
        "Why TCS? / Why This Role?",
        "Strengths, Weaknesses & Goals",
        "Technical Round — C / Java / Python Questions",
        "& Many More...",
       
      ],
    },
    {
      icon: "🤖",
      label: "Gen AI",
      color: "#8b5cf6",
      topics: [
        "What is AI / ML / Deep Learning",
        "Prompt Engineering Fundamentals",
        "Working with ChatGPT & Claude",
        "LLMs — How They Work (Transformers Basics)",
        "RAG (Retrieval-Augmented Generation)",
        "Many More....",
      ],
    },
  ];

  const faqs = [
    {
      q: "Who is this course for?",
      a: "Anyone preparing for TCS NQT, TCS Digital, TCS Prime, or any mass-recruiter placement drive in 2026-27.",
    },
    {
      q: "What programming languages are supported?",
      a: "Java, Python, and C++ — all three are covered with code examples for every DSA topic.",
    },
    {
      q: "Is this suitable for a complete beginner?",
      a: "Yes! The course starts from absolute basics in every module and builds up to placement-level difficulty.",
    },
    {
      q: "Do I get Lifetime access?",
      a: "Yes, you get lifetime access to all videos, notes, and future updates — including upcoming TCS pattern changes.",
    },
    {
      q: "Will the Gen AI module keep getting updated?",
      a: "Absolutely. Gen AI is a fast-moving space; enrolled students get all new content added at no extra cost.",
    },
    {
      q: "Is a certificate provided?",
      a: "Yes! A Syntax Error completion certificate is sent within 48 hours of enrollment.",
    },
  ];

  const stats = [
    { num: "5", suffix: ".0 ⭐", label: "Avg Rating" },
    { num: "5", suffix: " Modules", label: "Complete Course" },
    { num: "200", suffix: "+", label: "Practice Questions[DSA+Aptitude]"},
    { num: "40", suffix: "h+", label: "Course Content" },
  ];

  return (
    <div className="cd-wrapper tcs-wrapper">
      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          course={{
            title: "The Complete TCS NQT Course 2026",
            amount: 999,
            coupons: {},
          }}
          onClose={() => setShowCheckout(false)}
          onProceed={handleProceed}
        />
      )}

      <div className="cd-page-grid">
        {/* ── HERO ── */}
        <section className="cd-hero tcs-hero">
          <div className="tcs-hero-grid-bg" />
          <div className="tcs-hero-glow tcs-glow-1" />
          <div className="tcs-hero-glow tcs-glow-2" />

          <div className="cd-hero-content">
            {/* Badge */}
            <div className="tcs-badge-row">
              <span className="tcs-badge tcs-badge-blue">🏢 TCS Ninja</span>
              <span className="tcs-badge tcs-badge-purple">⚡ Digital</span>
              <span className="tcs-badge tcs-badge-green">🔥 Prime</span>
            
            </div>

            <h1 className="tcs-title">
              TCS Complete
              <br />
              <span className="tcs-title-accent">Placement Course</span>
              <br />
              <span className="tcs-title-year">2026–27</span>
            </h1>

            <p className="cd-subtitle">
              The only course you need to crack TCS — DSA, Aptitude, CS
              Fundamentals, Interview Questions &amp; Gen AI. All in one bundle,
              at one price.
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
            </div>

            {/* Price */}
            <div className="tcs-price-card">
              <span className="cd-price-label">LIFETIME ACCESS — ALL 5 MODULES</span>
              <div className="cd-price-row">
                <span className="tcs-price">₹999</span>
                <span className="cd-price-og">₹9999</span>
                <span className="tcs-discount-badge">90% OFF</span>
              </div>
            </div>

            <button className="tcs-enroll-btn" onClick={handleEnrollClick}>
              Enroll Now →
            </button>

            {/* Video */}
            <div className="cd-preview-video">
              <p className="cd-preview-label">🎬 Course Preview</p>
              <div className="cd-video-wrapper tcs-video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/zBQ6qV_tJL0"
                  title="TCS Course Preview"
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
                This is the most comprehensive placement preparation course for
                TCS, designed for 2026–27 batch students. We cover everything
                from Data Structures &amp; Algorithms to Aptitude, Computer
                Science Fundamentals, HR &amp; Technical Interview Questions,
                and even the latest Gen AI concepts that TCS is now testing in
                their NQT assessments. Whether you're aiming for TCS NQT, TCS
                Digital, or TCS Prime — this one course has you fully covered.
              </p>

              <div className="tcs-what-you-get">
                <h3>📦 What's Inside This Bundle</h3>
                <div className="tcs-bundle-grid">
                  {[
                    { icon: "⚙️", title: "Full DSA Course", desc: "From basics to TCS Prime-level problems" },
                    { icon: "🧠", title: "Aptitude Mastery", desc: "All TCS NQT quant & reasoning topics" },
                    { icon: "💻", title: "CS Fundamentals", desc: "OS, DBMS, Networks, OOPs, System Design" },
                    { icon: "🎯", title: "Interview Prep", desc: "HR + Technical + Mock rounds" },
                    { icon: "🤖", title: "Gen AI Module", desc: "Prompt Engineering, LLMs, AI Tools" },
                    { icon: "📄", title: "TCS Previous Papers", desc: "NQT, Digital & Prime pattern analysis" },
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
                  <span>Lifetime + Future Updates</span>
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
            <h2 className="cd-section-title">Complete Curriculum</h2>
            <p className="cd-section-sub">
              5 dedicated modules — every topic you need to crack TCS 2026-27.
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
                <span className="tcs-tab-icon" style={{ background: modules[activeTab].color + "22", color: modules[activeTab].color }}>
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
                {
                  icon: "📖",
                  color: "#60a5fa",
                  title: "Structured Notes",
                  desc: "Module-wise PDF notes for every topic — optimized for last-minute revision.",
                  tag: "STUDY MATERIAL",
                },
                {
                  icon: "</> ",
                  color: "#f472b6",
                  title: "80+ Practice Problems",
                  desc: "TCS NQT pattern questions + LeetCode problems with solutions in Java, Python & C++.",
                  tag: "HANDS-ON",
                },
                {
                  icon: "🎯",
                  color: "#34d399",
                  title: "TCS Pattern Focused",
                  desc: "NQT, Digital, Prime, BPS — all exam patterns covered with previous year analysis.",
                  tag: "PLACEMENT READY",
                },
                {
                  icon: "🤖",
                  color: "#a78bfa",
                  title: "Gen AI Ready",
                  desc: "Be ahead of your batch — learn Prompt Engineering, LLMs & AI tools before campus.",
                  tag: "FUTURE SKILLS",
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
            <h2 className="cd-section-title">How to Get Started</h2>
            <p className="cd-section-sub">
              Three steps to your TCS offer letter.
            </p>
            <div className="cd-steps">
              <div className="cd-step">
                <div className="cd-step-num" style={{ background: "#0ea5e9" }}>1</div>
                <h4>Enroll & Get Access</h4>
                <p>Instant access to all 5 modules, notes & practice questions right after payment.</p>
              </div>
              <div className="cd-step-line" />
              <div className="cd-step">
                <div className="cd-step-num" style={{ background: "#8b5cf6" }}>2</div>
                <h4>Follow the Roadmap</h4>
                <p>Complete DSA → Aptitude → CS Fundamentals → Interview Prep → Gen AI in order.</p>
              </div>
              <div className="cd-step-line" />
              <div className="cd-step">
                <div className="cd-step-num" style={{ background: "#10b981" }}>3</div>
                <h4>Crack TCS</h4>
                <p>Appear fully prepared — NQT, technical round, HR, and Gen AI assessment all covered.</p>
              </div>
            </div>
          </section>

          {/* Instructor */}
          <section className="cd-section">
            <div className="cd-instructor-card tcs-instructor-card">
              <div className="cd-instructor-avatar tcs-instructor-avatar">AR</div>
              <h3>Abhishek Rathor & Karina Sharma</h3>
              <p className="cd-instructor-role">Founder of SYNTAX ERROR & Infoys-DSE</p>
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
                  <span key={i} style={{ color: m.color }}>
                    {m.icon} {m.label}
                  </span>
                ))}
              </div>
              <h2>
                Everything You Need to
                <br />
                Crack TCS 2026-27
              </h2>
              <p>
                One bundle. Five modules. DSA + Aptitude + CS Fundamentals +
                Interview Prep + Gen AI. Enroll today at launch price.
              </p>
              <span className="cd-cta-label">LIMITED TIME LAUNCH PRICE</span>
              <div className="cd-cta-price tcs-cta-price">₹999</div>
              <button className="cd-cta-btn tcs-cta-btn" onClick={handleEnrollClick}>
                Enroll Now →
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

export default TCSCourseDetail;