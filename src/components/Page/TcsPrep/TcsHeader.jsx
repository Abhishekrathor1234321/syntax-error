import { Link, useLocation, useNavigate } from "react-router-dom";
import "./TcsHeader.css";
import { useEffect, useState } from "react";
function TcsHeader() {
  const navigate = useNavigate();
  const location = useLocation();


  const [offerTimeLeft, setOfferTimeLeft] = useState(25 * 60);

useEffect(() => {
  const timer = setInterval(() => {
    setOfferTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        return 0;
      }

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, []);

  const isHome =
    location.pathname === "/tcs-prep" ||
    location.pathname === "/tcs-prep/";

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/tcs-prep");
    }
  };

  return (
    <>
      {/* Fixed TCS Header */}
      <header className="tcs-common-header">
        <div className="tcs-common-header-inner">

          {/* LEFT */}
          <div className="tcs-common-left">

            {!isHome && (
              <button
                type="button"
                className="tcs-common-back"
                onClick={handleBack}
              >
                ← Back
              </button>
            )}

            <Link
              to="/tcs-prep"
              className="tcs-common-brand"
            >
              <span>TCS NQT Prep</span>

              <span className="tcs-common-free">
                Free
              </span>
            </Link>

          </div>

          {/* RIGHT */}
        <nav className="tcs-common-nav">


            {/* TCS COURSE OFFER */}
<div className="tcs-navbar-offer">

  <div className="tcs-offer-title">
    TCS NQT Complete Course
  </div>

  <div className="tcs-offer-subtitle">
    Early Bird Offer
  </div>

  <div className="tcs-offer-bottom">

  <div className="tcs-offer-timer">
  <span>Ends in</span>
  <strong>
    {String(Math.floor(offerTimeLeft / 60)).padStart(2, "0")}:
    {String(offerTimeLeft % 60).padStart(2, "0")}
  </strong>
</div>

    <Link
      to="/course-detail/tcs2026"
      className="tcs-offer-claim"
    >
      Claim
    </Link>

  </div>

</div>

  <Link
    to="/tcs-prep/leaderboard"
    className="tcs-common-link"
  >
    <span className="tcs-common-link-label">
      MY RANKING
    </span>

    <span className="tcs-common-link-text">
      🏆 Leaderboard
    </span>
  </Link>
{/* 
  <Link
    to="/tcs-prep/start"
    className="tcs-common-cta"
  >
    <span className="tcs-common-cta-label">
      FREE PRACTICE
    </span>

    <span className="tcs-common-cta-text">
      Start Practicing →
    </span>
  </Link> */}

</nav>
        </div>
      </header>

      {/* Space reserved for fixed header */}
      <div
        className="tcs-common-header-space"
        aria-hidden="true"
      />
    </>
  );
}

export default TcsHeader;