import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-container">

       {/* LOGO */}
<div className="footer-logo">
  <h2>SYNTAX ERROR</h2>
  <p>Learn coding, crack interviews and build your future.</p>

  {/* Instagram - logo ke neeche */}
  <a
    href="https://www.instagram.com/code.abhii07?igsh=ZW9wMzFsc3N1ZmUx"
    target="_blank"
    rel="noreferrer"
    className="footer-instagram"
  >
    📸 Follow on Instagram
  </a>
</div>

        {/* QUICK LINKS */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><button onClick={() => goTo("/")}>Home</button></li>
            <li><button onClick={() => goTo("/notes")}>Notes</button></li>
            <li><button onClick={() => goTo("/roadmap")}>Roadmap</button></li>
            <li><button onClick={() => goTo("/jobs")}>Jobs</button></li>
            <li><button onClick={() => goTo("/courses")}>Courses</button></li>
          </ul>
        </div>

        {/* RESOURCES */}
        <div className="footer-links">
          <h3>Resources</h3>
          <ul>
            <li><button onClick={() => goTo("/notes")}>DSA</button></li>
            <li><button onClick={() => goTo("/notes")}>Web Development</button></li>
            <li><button onClick={() => goTo("/notes")}>Interview Prep</button></li>
            <li><button onClick={() => goTo("/courses")}>Courses</button></li>
          </ul>
        </div>

        {/* LEGAL */}
<div className="footer-links">
  <h3>SYNTAX ERROR</h3>
  <ul>
    <li><button onClick={() => goTo("/privacy-policy")}>Privacy Policy</button></li>
    <li><button onClick={() => goTo("/terms")}>Terms & Conditions</button></li>
     <li><button onClick={() => goTo("/support")}>Support</button></li>
    <li>
      <a href="mailto:syntaxerrorxabhishek@gmail.com" className="footer-mail">
         Contact Us
      </a>
    </li>
    
  </ul>
</div>

       

      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        <p>© 2026 SYNTAX ERROR. All rights Reserved</p>
        <p>• Made with ❤️ in India</p>
      </div>
    </footer>
  );
}

export default Footer;