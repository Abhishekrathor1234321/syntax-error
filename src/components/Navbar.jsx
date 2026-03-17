import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Notes", path: "/notes" },
  { label: "Roadmap", path: "/roadmap" },
  // { label: "Jobs", path: "/jobs" },
  { label: "Courses", path: "/courses" },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;