import React, { useEffect, useRef, useState } from "react";
import "./LiveDSA.css";

const ENROLL_LINK = "https://rzp.io/rzp/4GnkyWu";

const DAYS = [
  ["Day 1", "Conditional Statements (if–else, switch)"],
  ["Day 2", "Loops"],
  ["Day 3", "Functions + Recursion"],
  ["Day 4", "Backtracking"],
  ["Day 5", "Time & Space Complexity"],
  ["Day 6", "Arrays"],
  ["Day 7", "Strings"],
  ["Day 8", "Sorting & Searching"],
  ["Day 9", "Two Pointers"],
  ["Day 10", "Greedy Approach"],
  ["Day 11", "Sliding Window"],
  ["Day 12", "Linked List"],
  ["Day 13", "Fast & Slow Pointer"],
  ["Day 14", "Hash Set"],
  ["Day 15", "Hash Map"],
  ["Day 16", "Stack"],
  ["Day 17", "Queue"],
  ["Day 18", "Bit Manipulation"],
  ["Day 19–21", "Trees (Binary Tree, BST, Traversals)"],
  ["Day 22–25", "Graphs "],
  ["Day 26–30", "Dynamic Programming"],
];

const REVIEWS = [
  { id: "VlDPCPBmn94", text: "Hear directly from a student who completed the bootcamp." },
  { id: "eeb3-dyM5ZE", text: "Another student shares their learning experience and growth." },
  { id: "cG7rmhZHt_8", text: "Real feedback from someone who went through the full program." },
  { id: "ILI2gWizim0", text: "A genuine experience shared by a student after completing the program." },
  { id: "Qm-TanCV0ks", text: "A student shares their experience and learning journey." },
  { id: "DM6vEPVyfk8", text: "Honest feedback about the bootcamp and overall experience." },
  { id: "p7zsslYBDwc", text: "Hear about the student's progress and success journey." },
];

const FAQS = [
  {
    q: "I am a complete beginner in DSA, can I join?",
    a: "Yes, absolutely! This bootcamp is built keeping beginners in mind. You don't need any prior DSA knowledge — we start from absolute zero and take you step by step to an interview-ready level. All you need is basic programming knowledge and the willingness to learn.",
  },
  {
    q: "Which programming language will be used?",
    a: "We focus first on logic building. After that, solutions are provided in Java, C++ and Python — every code explained line by line, because DSA is all about logic building.",
  },
  {
    q: "What are the class timings?",
    a: "Every day at 9:00 PM IST. Duration is 2 to 3 hours depending on the topic.",
  },
  {
    q: "How many classes will there be?",
    a: "Exactly 30 proper live teaching classes over 30 days. Doubt sessions and discussions are extra (not counted in the 30). No fake numbers, no fluff.",
  },
  {
    q: "Is this suitable for a complete beginner?",
    a: "Yes! The bootcamp starts from absolute basics (if-else, loops) and goes all the way to Graphs and Dynamic Programming.",
  },
  {
    q: "Will I get recordings if I miss a class?",
    a: "Yes, recordings of every session are available for revision. You won't miss anything.",
  },
  {
    q: "Will this help with placements?",
    a: "Absolutely. The bootcamp is designed specifically for TCS, Infosys, Wipro, and MAANG-level placements — with PYQs and company-specific insights.",
  },
];

const LiveDSA = () => {
  const carouselRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const prev = document.title;
    document.title = "30-Day Live DSA Bootcamp – Syntax Error";
    return () => {
      document.title = prev;
    };
  }, []);

  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el || !el.firstElementChild) return;
    const cardWidth = el.firstElementChild.offsetWidth + 16; // card + gap (1rem)
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveDot(Math.min(idx, REVIEWS.length - 1));
  };

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div className="ld-wrapper">
      {/* HERO */}
      <section className="ld-hero">
        <div className="ld-hero-bg"></div>
        <div className="ld-hero-content">
          <div className="ld-live-badge">
            <span className="ld-live-dot"></span>
            LIVE BOOTCAMP
          </div>
          <div className="ld-badge">⚡ LANGUAGE SUPPORT: JAVA / PYTHON / C++</div>
          <h1 className="ld-title">
            30-Day Live DSA<br />Bootcamp<br />
            <span className="ld-title-accent">2026</span>
          </h1>
          <p className="ld-subtitle">
            30 Days. 30 Live Classes. 100+ LeetCode Problems. Master DSA from zero to hero
            and crack placements at MAANG, top product-based companies, and beyond.
          </p>

          <div className="ld-date-strip">
            <div className="ld-date-item">📅 Starts from 20 November 2026</div>
            <div className="ld-date-item">🕘 Daily @ 9:00 PM IST</div>
            <div className="ld-date-item">⏱ 2–3 hrs/class</div>
          </div>

          <div className="ld-price-card">
            <span className="ld-price-label">LIMITED SEATS</span>
            <div className="ld-price-row">
              <span className="ld-price">₹699</span>
              <span className="ld-price-og">₹2999</span>
              <span className="ld-discount-badge">80% OFF</span>
            </div>
          </div>
          <br /><br />
          <a href={ENROLL_LINK} target="_blank" rel="noreferrer" className="ld-enroll-btn">Enroll Now →</a>

          <div className="ld-preview-video">
            <p className="ld-preview-label">🎬 See What You'll Learn</p>
            <div className="ld-video-wrapper">
              <iframe
                src="https://www.youtube.com/embed/A7xxmiuuoEI"
                title="DSA Bootcamp Preview"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="ld-stats">
        <div className="ld-stat"><span className="ld-stat-num">30 🔴</span><span className="ld-stat-label">Live Classes</span></div>
        <div className="ld-stat"><span className="ld-stat-num">20+</span><span className="ld-stat-label">DSA Topics</span></div>
        <div className="ld-stat"><span className="ld-stat-num">100+</span><span className="ld-stat-label">LeetCode Problems</span></div>
        <div className="ld-stat"><span className="ld-stat-num">5.0 ⭐</span><span className="ld-stat-label">Average Rating</span></div>
      </div>

      {/* DESCRIPTION */}
      <section className="ld-section" style={{ paddingTop: "2rem", paddingBottom: "1.5rem" }}>
        <div className="ld-description-card">
          <p className="ld-desc-text">
            This is a 30-day intensive live bootcamp covering all Data Structures and Algorithms
            from basics to advanced — with daily live sessions, structured notes, LeetCode practice,
            and real interview preparation. Every class is interactive, recorded for revision, and
            built to get you placement-ready.
          </p>

          <div className="ld-curriculum-card" style={{ marginBottom: "1.5rem" }}>
            <h3>What You Will Get</h3>
            <p>Everything you need to crack placements and coding interviews.</p>

            <ul className="ld-topics-list">
              <li><span style={{ color: "#22c55e" }}>✅</span> 30 Daily LIVE Classes (No breaks, full consistency)</li>
              <li><span style={{ color: "#22c55e" }}>✅</span> Structured Notes + Practice Sheets after every class</li>
              <li><span style={{ color: "#22c55e" }}>✅</span> 100+ LeetCode + PYQ Problems (Amazon, Google, Microsoft…)</li>
              <li><span style={{ color: "#22c55e" }}>✅</span> Live Doubt Sessions — Ask anything, anytime</li>
              <li><span style={{ color: "#22c55e" }}>✅</span> Recorded Videos for every session</li>
              <li><span style={{ color: "#22c55e" }}>✅</span> Pattern-Based Problem Solving</li>
              <li><span style={{ color: "#22c55e" }}>✅</span> Company-Specific Insights &amp; Hiring Links</li>
              <li><span style={{ color: "#22c55e" }}>✅</span> Certificate of Completion</li>
              <li><span style={{ color: "#22c55e" }}></span></li>
            </ul>

            {/* BONUS SECTION */}
            <div className="ld-bonus-box">
              <h3>
                🎁 Bonus: Free Resources <span style={{ color: "#facc15" }}>(Worth ₹2400+)</span>
              </h3>

              <ul className="ld-topics-list">
                <li><span style={{ color: "#22c55e" }}>✅</span> Resume Building</li>
                <li><span style={{ color: "#22c55e" }}>✅</span> Live Mock Coding Test in Interview Style</li>
                <li><span style={{ color: "#22c55e" }}>✅</span>All Subjects Placement Handwritten Notes</li>
                <li><span style={{ color: "#22c55e" }}>✅</span>1-1 Guidance Session with Abhishek</li>
                <li><span style={{ color: "#facc15" }}>⭐</span> And Many More Learning Materials</li>
              </ul>
            </div>
          </div>

          <div className="ld-desc-info">
            <div className="ld-desc-info-item"><span>📅 Start Date</span><span>  20 November, 2026</span></div>
            <div className="ld-desc-info-item"><span>🕘 Class Time</span><span>Every Day @ 9 PM IST</span></div>
            <div className="ld-desc-info-item"><span>💻 Languages</span><span>Java, Python, C++</span></div>
            <div className="ld-desc-info-item"><span>🌐 Taught In</span><span>English (Beginner-friendly)</span></div>
            <div className="ld-desc-info-item"><span>📍 Mode</span><span>Online (Zoom / Google Meet)</span></div>
            <div className="ld-desc-info-item"><span>🏆 Certificate</span><span>After completion</span></div>
          </div>
        </div>
      </section>

      {/* WHY DIFFERENT */}
      <section className="ld-section">
        <h2 className="ld-section-title">Why This Bootcamp is Different</h2>
        <p className="ld-section-sub">No fluff. No fake numbers. Just 30 proper live teaching classes.</p>
        <div className="ld-compare-grid">
          <div className="ld-compare-card good">
            <div className="ld-compare-title good">✅ SYNTAX ERROR Bootcamp</div>
            <ul className="ld-compare-list">
              <li><span>✔</span> 30 Days | 30 LIVE Classes — full consistency</li>
              <li><span>✔</span> Each class: 2 to 3 hours of deep concepts + hands-on coding</li>
              <li><span>✔</span> Live Doubt Sessions — ask anything, anytime</li>
              <li><span>✔</span> Structured Notes + Practice Sheets after every class</li>
              <li><span>✔</span> Recordings available — watch anytime</li>
              <li><span>✔</span> Full focus on Live, Interactive Learning</li>
            </ul>
          </div>
          <div className="ld-compare-card bad">
            <div className="ld-compare-title bad">❌ Other DSA Courses</div>
            <ul className="ld-compare-list">
              <li><span>✗</span> 3-month course, but only 10–12 classes per month</li>
              <li><span>✗</span> Big gaps between classes — no consistency</li>
              <li><span>✗</span> Mostly recorded content, no real interaction</li>
              <li><span>✗</span> Rare or no doubt support</li>
              <li><span>✗</span> No proper practice, no structured notes</li>
              <li><span>✗</span> Limited depth in topics, rushed coverage</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 30-DAY PLAN */}
      <section className="ld-section">
        <h2 className="ld-section-title">30-Day Curriculum</h2>
        <p className="ld-section-sub">100+ LeetCode problems across 30 days of structured, progressive learning.</p>
        <div className="ld-day-grid">
          {DAYS.map(([day, topic]) => (
            <div className="ld-day-item" key={day}>
              <span className="ld-day-num">{day}</span>
              <span className="ld-day-topic">{topic}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="ld-section">
        <div className="ld-features-grid">
          <div className="ld-feature-card">
            <span className="ld-feature-icon" style={{ color: "#60a5fa" }}>📖</span>
            <h4>Structured Notes</h4>
            <p>Handwritten + PDF notes for every single topic, optimized for quick revision before interviews.</p>
            <span className="ld-feature-tag">STUDY MATERIAL</span>
          </div>
          <div className="ld-feature-card">
            <span className="ld-feature-icon" style={{ color: "#f472b6" }}>&lt;/&gt;</span>
            <h4>100+ Practice Problems</h4>
            <p>LeetCode + PYQs from Amazon, Google, Microsoft, Flipkart — all with solutions in Java, Python &amp; C++.</p>
            <span className="ld-feature-tag">HANDS-ON</span>
          </div>
          <div className="ld-feature-card">
            <span className="ld-feature-icon" style={{ color: "#a78bfa" }}>🎯</span>
            <h4>Placement Focused</h4>
            <p>Interview patterns from TCS, Infosys, Wipro, Amazon, Google &amp; Microsoft with company-specific insights.</p>
            <span className="ld-feature-tag">CAREER READY</span>
          </div>
        </div>
      </section>

      {/* STUDENT REVIEWS */}
      <section className="ld-section">
        <h2 className="ld-section-title">Student Reviews</h2>
        <p className="ld-section-sub">Real students. Real results. Hear what they have to say.</p>

        {/* Carousel: Student Reviews */}
        <div className="ld-reviews-carousel-wrap">
          <div className="ld-reviews-carousel-label">
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#a78bfa",
                display: "inline-block",
              }}
            ></span>
            STUDENT REVIEWS · SCROLL TO EXPLORE
          </div>

          <div className="ld-reviews-carousel" ref={carouselRef} onScroll={handleCarouselScroll}>
            {REVIEWS.map((r, i) => (
              <div className="ld-carousel-card" key={r.id}>
                <div className="ld-video-wrapper">
                  <iframe
                    src={`https://www.youtube.com/embed/${r.id}`}
                    title={`Student Review ${i + 1}`}
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="ld-carousel-meta">
                  <strong>Student Review #{i + 1}</strong>
                  <p>{r.text}</p>
                  <span className="ld-review-tag">⭐ STUDENT REVIEW</span>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Dots */}
          <div className="ld-carousel-dots">
            {REVIEWS.map((r, i) => (
              <div key={r.id} className={`ld-carousel-dot${i === activeDot ? " active" : ""}`}></div>
            ))}
          </div>
        </div>

        {/* Placement 1 */}
        <div className="ld-placement-card">
          <div className="ld-video-wrapper" style={{ borderRadius: "16px 16px 0 0" }}>
            <iframe
              src="https://www.youtube.com/embed/bBLzXF8Yuqk"
              title="Cracked Product Based Company"
              allowFullScreen
            ></iframe>
          </div>
          <div className="ld-placement-meta">
            <strong>Cracked a Product-Based Company 🎉</strong>
            <p>A student shares their journey from joining the bootcamp to landing an offer at a top product-based company.</p>
            <span className="ld-placement-tag">🏆 PLACEMENT SUCCESS</span>
          </div>
        </div>

        {/* Placement 2 */}
        <div className="ld-placement-card">
          <div className="ld-video-wrapper" style={{ borderRadius: "16px 16px 0 0" }}>
            <iframe
              src="https://www.youtube.com/embed/VL4z-7CrT-I"
              title="Pawan Raj Salary Hike Success"
              allowFullScreen
            ></iframe>
          </div>
          <div className="ld-placement-meta">
            <strong>Pawan Raj Got 100% Salary Hike 🎉</strong>
            <p>Pawan Raj achieved a 100% salary hike by switching from Capgemini to HCLTech.</p>
            <span className="ld-placement-tag">🏆 PLACEMENT SUCCESS</span>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="ld-section ld-steps-section">
        <h2 className="ld-section-title">How to Get Started</h2>
        <p className="ld-section-sub">Three simple steps to kickstart your coding journey.</p>
        <div className="ld-steps">
          <div className="ld-step">
            <div className="ld-step-num" style={{ background: "#7c3aed" }}>1</div>
            <h4>Register &amp; Pay</h4>
            <p>Fill the form, pay ₹699, and confirm your seat. Limited spots available.</p>
          </div>
          <div className="ld-step-line"></div>
          <div className="ld-step">
            <div className="ld-step-num" style={{ background: "#2563eb" }}>2</div>
            <h4>Attend Live Classes</h4>
            <p>Join every day at 9 PM IST. Solve problems, ask doubts, and stay consistent.</p>
          </div>
          <div className="ld-step-line"></div>
          <div className="ld-step">
            <div className="ld-step-num" style={{ background: "#db2777" }}>3</div>
            <h4>Crack Interviews</h4>
            <p>Apply your DSA skills to real placement and MAANG interview problems.</p>
          </div>
        </div>
      </section>

      {/* INSTRUCTOR */}
      <section className="ld-section">
        <div className="ld-instructor-card">
          <div className="ld-instructor-avatar">AR</div>
          <h3>Abhishek Rathor</h3>
          <span className="ld-instructor-role">Founder of SYNTAX ERROR</span>
          <p>
            A passionate tech educator focused on making complex DSA concepts accessible for everyone.
            Taught 5000+ students and mentored 50+ international students in 1-on-1 classes. With a 5.0
            rating and a track record of helping students crack placements, Abhishek provides the
            perfect bridge between theory and interview success.
          </p>
          <div className="ld-instructor-tags">
            <span>🎓 5000+ Students Taught</span>
            <span>🌍 50+ International Students</span>
            <span>⭐ 5.0 Rating</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ld-section">
        <h2 className="ld-section-title">Frequently Asked Questions</h2>
        <div className="ld-faqs">
          {FAQS.map((f, i) => (
            <div
              key={f.q}
              className={`ld-faq${openFaq === i ? " open" : ""}`}
              onClick={() => toggleFaq(i)}
            >
              <div className="ld-faq-q">
                <span>{f.q}</span>
                <span className="ld-faq-icon">+</span>
              </div>
              <p className="ld-faq-a">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="ld-cta">
        <div className="ld-cta-card">
          <h2>Ready to Crack Your<br />Dream Interview?</h2>
          <p>Join the 30-Day Live DSA Bootcamp starting 20 November. Limited seats — secure yours now.</p>
          <span className="ld-cta-label">LIMITED TIME PRICE</span>
          <div className="ld-cta-price">₹699</div>
          <a href={ENROLL_LINK} target="_blank" rel="noreferrer" className="ld-cta-btn">Enroll Now →</a>
        </div>
      </div>

      {/* WHATSAPP FLOATING CHAT BUTTON */}
      <a
        href="https://wa.me/919232169325?text=I%20have%20doubts%20regarding%2030%20days%20live%20dsa%20bootcamp"
        target="_blank"
        rel="noreferrer"
        className="ld-whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        <svg className="ld-whatsapp-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#fff"
            d="M16.001 3C9.373 3 4 8.373 4 15c0 2.36.7 4.55 1.902 6.393L4 29l7.86-1.858A11.93 11.93 0 0 0 16.001 27C22.63 27 28 21.627 28 15S22.63 3 16.001 3zm.001 21.6c-1.99 0-3.85-.55-5.45-1.5l-.39-.23-4.64 1.1 1.13-4.52-.25-.4A9.55 9.55 0 0 1 5.4 15c0-5.85 4.75-10.6 10.6-10.6S26.6 9.15 26.6 15 22.85 24.6 16.002 24.6z"
          />
          <path
            fill="#fff"
            d="M21.6 18.15c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.8-1.68-2.1-.17-.3-.02-.47.13-.62.15-.15.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.35-.02-.5-.07-.15-.65-1.57-.9-2.15-.24-.57-.48-.5-.66-.5-.17-.02-.37-.02-.57-.02-.2 0-.52.07-.8.35-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.1 3.2 5.1 4.37 2.55 1 2.55.85 3.02.77.47-.07 1.77-.72 2.03-1.42.25-.7.25-1.3.17-1.42-.07-.15-.27-.22-.57-.37z"
          />
        </svg>
        <span className="ld-whatsapp-text">Have doubts? Chat now</span>
      </a>
    </div>
  );
};

export default LiveDSA;