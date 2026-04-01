import React from "react";
import { useNavigate } from "react-router-dom";
import "./OfferSection.css";

const offers = [
  {
    icon: "",
    title: "Notes",
    description: "Concise programming notes covering DSA, Web Dev, Python, Java and more.",
    items: ["Data Structures & Algorithms", "JavaScript Deep Dive", "Python Essentials", "System Design Basics"],
    path: "/notes",
  },
  {
    icon: "",
    title: "Roadmaps",
    description: "Step-by-step career roadmaps to guide your journey.",
    items: ["Frontend Developer", "Backend Developer", "Full Stack Path", "DevOps Engineer"],
    path: "/roadmap",
  },
  {
    icon: "",
    title: "Jobs",
    description: "Curated job openings, internships and placement updates.",
    items: ["Fresher Openings", "Internship Alerts", "Remote Opportunities", "Resume Tips"],
    path: null,
  },
  {
    icon: "",
    title: "Courses",
    description: "Hand-picked free and paid courses to accelerate your learning.",
    items: ["Free Certifications", "Structured Learning Paths", "Project Based Learning", "Interview Preparation"],
    path: "/courses",
  },
];

function OfferSection({ setShowJobsPopup }) {
  const navigate = useNavigate();

  const handleClick = (offer) => {
    if (offer.title === "Jobs") {
      setShowJobsPopup(true);
    } else {
      navigate(offer.path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
          <div
            className="offer-card"
            key={index}
            onClick={() => handleClick(offer)}
            style={{ cursor: "pointer" }}
          >
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
            <div className="offer-card-footer">
              {offer.title === "Jobs" ? "Join WhatsApp →" : `Explore ${offer.title} →`}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OfferSection;