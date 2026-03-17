import React from "react";
import "./CommunitySection.css";

function CommunitySection() {
return ( <section className="community">


  {/* STATS */}

  <div className="stats">

    <div className="stat-card">
      <h2>270K+</h2>
      <p>Followers</p>
    </div>

    <div className="stat-card">
      <h2>350k+</h2>
      <p>Community Members</p>
    </div>

    <div className="stat-card">
      <h2>500+</h2>
      <p>Free Resources</p>
    </div>

    <div className="stat-card">
      <h2>1,200+</h2>
      <p>5-Star Reviews</p>
    </div>

  </div>


  {/* COMMUNITY LOVE */}

  <h2 className="community-title">  Community Love</h2>

  <p className="community-sub">
    Hear from developers who leveled up with SYNTAX ERROR.
  </p>


  <div className="testimonials">

    <div className="testimonial">
      <p>
      "SYNTAX ERROR's DSA notes helped me crack my first tech interview.
      The roadmaps are a game-changer!"
      </p>
      <h4>Priya Sharma</h4>
      <span>@priya_codes</span>
    </div>

    <div className="testimonial">
      <p>
      "Best programming community on Instagram.
      The job alerts are always on point and the notes are concise."
      </p>
      <h4>Rahul Menon</h4>
      <span>@rahul.dev</span>
    </div>

    <div className="testimonial">
      <p>
      "I went from zero coding knowledge to landing a frontend role
      in 6 months, all thanks to their roadmaps and courses."
      </p>
      <h4>Ananya Gupta</h4>
      <span>@ananya.js</span>
    </div>

  </div>

</section>


);
}

export default CommunitySection;
