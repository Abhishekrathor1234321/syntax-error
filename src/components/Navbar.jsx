import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Notes", path: "/notes" },
  { label: "Roadmap", path: "/roadmap" },
  { label: "Practice", path: "/Practice" },
  { label: "Courses", path: "/courses" },
];

const WHATSAPP_LINK = "https://whatsapp.com/channel/0029VazMK0J30LKTGQxCyi40";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showJobsPopup, setShowJobsPopup] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black text-white border-b">
        <div className="w-full flex items-center justify-between px-8 py-3">

          {/* Logo */}
          <Link to="/" className="logo">
            <img src="/syntax-logo.jpeg" alt="logo" />
            <span>SYNTAX ERROR</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`px-4 py-2 text-sm rounded-md ${
                  location.pathname === link.path
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Jobs Button */}
            <button
              onClick={() => setShowJobsPopup(true)}
              className="jobs-btn"
            >
              💼 Jobs
            </button>
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t bg-black"
            >
              <div className="flex flex-col p-4 gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2 rounded-md text-sm ${
                      location.pathname === link.path
                        ? "bg-blue-500/20 text-blue-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Jobs Button */}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setShowJobsPopup(true);
                  }}
                  className="jobs-btn-mobile"
                >
                  💼 Jobs
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Jobs Popup */}
      <AnimatePresence>
        {showJobsPopup && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="jobs-backdrop"
              onClick={() => setShowJobsPopup(false)}
            />

            {/* Popup Card */}
          <motion.div
  initial={{ opacity: 0, scale: 0.85 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.85 }}
  transition={{ type: "spring", stiffness: 300, damping: 25 }}
  className="jobs-popup"
>
              {/* Close */}
              <button
                className="jobs-popup-close"
                onClick={() => setShowJobsPopup(false)}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div className="jobs-popup-icon">💼</div>

              {/* Title */}
              <h2 className="jobs-popup-title">Jobs & Opportunities</h2>
              <p className="jobs-popup-desc">
                Join our WhatsApp channel for all latest:
              </p>

              {/* Features */}
              <ul className="jobs-popup-list">
                <li>✅ Job & Internship Openings</li>
                <li>🏆 Hackathon Opportunities</li>
                <li>🎯 Placement Updates</li>
                <li>📄 Resume & Interview Tips</li>
              </ul>

              {/* CTA Button */}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="jobs-popup-btn"
                onClick={() => setShowJobsPopup(false)}
              >
                Join WhatsApp Channel →
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;