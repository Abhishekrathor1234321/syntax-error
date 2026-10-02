import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./tcs.css";
import TcsHeader from "./TcsHeader";
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap";

/**
 * /tcs-prep ke saare pages is layout ke andar khulte hain.
 * Tumhara App ka baaki header/footer waise hi rahega, ye sirf apna chhota bar aur styles lagata hai.
 */
export default function TcsLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu (☰)

  // /tcs-prep (home) par back button nahi dikhana
  const showBack = location.pathname.replace(/\/$/, "") !== "/tcs-prep";

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/tcs-prep");
  };

  const closeMenu = () => setMenuOpen(false);

  // page badalne par mobile menu band ho jaye
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Google Fonts sirf ek baar load hote hain
  useEffect(() => {
    if (document.getElementById("tcs-fonts")) return;
    const link = document.createElement("link");
    link.id = "tcs-fonts";
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const prev = document.title;
    document.title = "TCS NQT Preparation | SYNTAX ERROR";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="tcs">
      <TcsHeader />
      <Outlet />
    </div>
  );
}