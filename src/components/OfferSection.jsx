import React from "react";
import "./OfferSection.css";

function OfferSection() {
return ( <section className="offer-section">


  <h2 className="offer-title">
     What We Offer
  </h2>

  <p className="offer-subtitle">
    Everything you need to kickstart and grow your programming career.
  </p>

  <div className="offer-grid">

    <div className="offer-card">
      <h3>Notes</h3>
      <p>
        Concise programming notes covering DSA, Web Dev, Python, Java and more.
      </p>
      <ul>
        <li>Data Structures & Algorithms</li>
        <li>JavaScript Deep Dive</li>
        <li>Python Essentials</li>
        <li>System Design Basics</li>
      </ul>
    </div>

    <div className="offer-card">
      <h3>Roadmaps</h3>
      <p>
        Step-by-step career roadmaps to guide your journey.
      </p>
      <ul>
        <li>Frontend Developer</li>
        <li>Backend Developer</li>
        <li>Full Stack Path</li>
        <li>DevOps Engineer</li>
      </ul>
    </div>

    <div className="offer-card">
      <h3>Jobs</h3>
      <p>
        Curated job openings, internships and placement updates.
      </p>
      <ul>
        <li>Fresher Openings</li>
        <li>Internship Alerts</li>
        <li>Remote Opportunities</li>
        <li>Resume Tips</li>
      </ul>
    </div>

    <div className="offer-card">
      <h3>Courses</h3>
      <p>
        Hand-picked free and paid courses to accelerate learning.
      </p>
      <ul>
        <li>Free Certifications</li>
        <li>Top Udemy Picks</li>
        <li>YouTube Playlists</li>
        <li>Project Based Learning</li>
      </ul>
    </div>

  </div>

</section>


);
}

export default OfferSection;
