import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Notes", path: "/notes" },
  { label: "Roadmap", path: "/roadmap" },
  { label: "Practice", path: "/Practice" },
  // { label: "Courses", path: "/courses" },
];

const WHATSAPP_LINK = "https://whatsapp.com/channel/0029VazMK0J30LKTGQxCyi40";
const ADMIN_EMAIL = "abhishekrathor7447@gmail.com";

function Navbar({ showJobsPopup, setShowJobsPopup }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [userEmail, setUserEmail] = useState(localStorage.getItem("email"));
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(localStorage.getItem("user"));
    setUserEmail(localStorage.getItem("email"));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    setUser(null);
    setUserEmail(null);
    navigate("/login");
  };

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

            {user ? (
              <>
                {/* Admin Button — sirf admin ko dikhega */}
                {userEmail === ADMIN_EMAIL && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 text-sm rounded-md bg-red-500/20 text-red-400 hover:text-red-300 font-semibold"
                  >
                    👑 Admin
                  </Link>
                )}

                {/* Jobs Button */}
                <button
                  onClick={() => setShowJobsPopup(true)}
                  className="jobs-btn"
                >
                  💼 Jobs
                </button>

                {/* Profile Icon */}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 hover:opacity-80 transition"
                >
                  <div style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "white",
                    flexShrink: 0
                  }}>
                    {user.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-green-400 font-semibold">
                    {user}
                  </span>
                </Link>

                {/* Logout */}
                <button onClick={handleLogout} className="login-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="login-btn">
                  Login
                </Link>
                <button
                  onClick={() => setShowJobsPopup(true)}
                  className="jobs-btn"
                >
                  💼 Jobs
                </button>
              </>
            )}
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

                {user ? (
                  <div className="flex flex-col gap-2">
                    {/* Mobile Admin Button */}
                    {userEmail === ADMIN_EMAIL && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-2 text-sm rounded-md bg-red-500/20 text-red-400 font-semibold text-center"
                      >
                        👑 Admin
                      </Link>
                    )}

                    {/* Mobile Jobs */}
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        setShowJobsPopup(true);
                      }}
                      className="jobs-btn-mobile"
                    >
                      💼 Jobs
                    </button>

                    {/* Mobile Profile */}
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2"
                    >
                      <div style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "13px",
                        color: "white"
                      }}>
                        {user.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-green-400 font-semibold">
                        {user}
                      </span>
                    </Link>

                    {/* Mobile Logout */}
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogout();
                      }}
                      className="login-btn"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="login-btn text-center"
                    >
                      Login
                    </Link>
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
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Jobs Popup */}
      <AnimatePresence>
        {showJobsPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="jobs-backdrop"
              onClick={() => setShowJobsPopup(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="jobs-popup"
            >
              <button
                className="jobs-popup-close"
                onClick={() => setShowJobsPopup(false)}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="jobs-popup-icon">💼</div>
              <h2 className="jobs-popup-title">Jobs & Opportunities</h2>
              <p className="jobs-popup-desc">
                Join our WhatsApp channel for all latest:
              </p>

              <ul className="jobs-popup-list">
                <li>✅ Job & Internship Openings</li>
                <li>🏆 Hackathon Opportunities</li>
                <li>🎯 Placement Updates</li>
                <li>📄 Resume & Interview Tips</li>
              </ul>

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