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

          {/* Social Links */}
        {/* Social Links */}
        {/* Social Links */}
<div className="footer-socials">

  {/* Instagram */}
  <a
    href="https://www.instagram.com/code.abhii07"
    target="_blank"
    rel="noreferrer"
    className="footer-social-btn instagram"
    aria-label="Instagram"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" className="fill-dot" />
    </svg>
  </a>

  {/* Telegram */}
  <a
    href="https://t.me/syntax_errore"
    target="_blank"
    rel="noreferrer"
    className="footer-social-btn telegram"
    aria-label="Telegram"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.4 3.6 2.9 10.7c-1.3.5-1.3 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.5.1.7.6.7.4 0 .6-.2.8-.4l2.3-2.2 4.8 3.5c.9.5 1.6.3 1.8-.8l3.1-14.8c.3-1.4-.5-2-1.2-1.7Z" />
      <path
        d="m8.1 13.4 10.7-6.7-8.7 8.2-.3 3.1"
        className="telegram-detail"
      />
    </svg>
  </a>

  {/* LinkedIn */}
  <a
    href="https://www.linkedin.com/posts/syntax-error-commuinty_syntaxerror-coding-dsa-activity-7469859365378768896-oy1J"
    target="_blank"
    rel="noreferrer"
    className="footer-social-btn linkedin"
    aria-label="LinkedIn"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.2 8.4H2.8V21h2.4V8.4ZM4 3C3.2 3 2.5 3.7 2.5 4.5S3.2 6 4 6s1.5-.7 1.5-1.5S4.8 3 4 3ZM21 13.8c0-3.8-2-5.6-4.7-5.6-2.2 0-3.1 1.2-3.7 2v-1.8h-2.4V21h2.4v-6.2c0-1.6.3-3.2 2.4-3.2 2 0 2 1.8 2 3.3V21h2.4v-7.2Z" />
    </svg>
  </a>

  {/* YouTube */}
  <a
    href="https://youtube.com/@syntaxerr0r-code"
    target="_blank"
    rel="noreferrer"
    className="footer-social-btn youtube"
    aria-label="YouTube"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23 12s0-3.6-.5-5.3c-.3-1.2-1.2-2.1-2.4-2.4C18.4 3.8 12 3.8 12 3.8s-6.4 0-8.1.5C2.7 4.6 1.8 5.5 1.5 6.7 1 8.4 1 12 1 12s0 3.6.5 5.3c.3 1.2 1.2 2.1 2.4 2.4 1.7.5 8.1.5 8.1.5s6.4 0 8.1-.5c1.2-.3 2.1-1.2 2.4-2.4C23 15.6 23 12 23 12Z" />
      <path d="m10 8.5 5.5 3.5-5.5 3.5v-7Z" className="youtube-play" />
    </svg>
  </a>

</div>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><button onClick={() => goTo("/")}>Home</button></li>
            <li><button onClick={() => goTo("/notes")}>Notes</button></li>
            <li><button onClick={() => goTo("/roadmap")}>Roadmap</button></li>
           
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