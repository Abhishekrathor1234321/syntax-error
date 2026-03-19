import React from "react";
import "./OfferSection.css";

const offers = [
  {
    icon: "📝",
    title: "Notes",
    description: "Concise programming notes covering DSA, Web Dev, Python, Java and more.",
    items: ["Data Structures & Algorithms", "JavaScript Deep Dive", "Python Essentials", "System Design Basics"],
  },
  {
    icon: "🗺️",
    title: "Roadmaps",
    description: "Step-by-step career roadmaps to guide your journey.",
    items: ["Frontend Developer", "Backend Developer", "Full Stack Path", "DevOps Engineer"],
  },
  {
    icon: "💼",
    title: "Jobs",
    description: "Curated job openings, internships and placement updates.",
    items: ["Fresher Openings", "Internship Alerts", "Remote Opportunities", "Resume Tips"],
  },
  {
    icon: "🎓",
    title: "Courses",
    description: "Hand-picked free and paid courses to accelerate your learning.",
    items: ["Free Certifications", "Structured Learning Paths", "Project Based Learning", "Interview Preparation"],
  },
];

function OfferSection() {
  return (
    <section className="offer-section">
      <div className="offer-header">
        <h2 className="offer-title">What We Offer</h2>
        <p className="offer-subtitle">
          Everything you need to kickstart and grow your programming career.
        </p>
      </div>

      <div className="offer-grid">
        {offers.map((offer, index) => (
          <div className="offer-card" key={index}>
            <div className="offer-icon">{offer.icon}</div>
            <h3 className="offer-card-title">{offer.title}</h3>
            <p className="offer-card-desc">{offer.description}</p>
            <ul className="offer-list">
              {offer.items.map((item, i) => (
                <li key={i}>
                  <span className="offer-dot">▹</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OfferSection;