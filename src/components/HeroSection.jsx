import React from "react";
import "./HeroSection.css";

function HeroSection() {
return ( <section id="home" className="hero" style={{ paddingTop: "80px" }}>


  <div className="hero-content">

    <div className="insta">@code.abhii07</div>

    <h1>
      Learn to <span className="green">Code</span>, <br />
      Build Your <span className="yellow">Future</span>
    </h1>

    <p>
      Your go-to community for programming notes, career roadmaps,
      job updates, and curated courses. Level up your dev skills.
    </p>

    <div className="buttons">

      <a
        href="https://www.instagram.com/code.abhii07?igsh=ZW9wMzFsc3N1ZmUx"
        target="_blank"
        rel="noreferrer"
        className="insta-btn"
      >
        Follow on Instagram
      </a>
  

  <a
       href="https://whatsapp.com/channel/0029VazMK0J30LKTGQxCyi40"
  target="_blank"
  rel="noreferrer"
  className="explore-btn"
>
  WhatsApp Community →
</a>
    </div>

    <div className="code-box">


{`const developer = {
  passion: "infinite",
  learning: true,
  community: "SYNTAX ERROR"
};`} </div>


  </div>

</section>


);
}

export default HeroSection;
