import { useEffect, useRef, useState } from "react";
import "./OfferPopup.css";


const API = "https://syntax-error-1xds.vercel.app";
/**
 * Courses page ka offer popup.
 * Sab kuch (name, coupon code, discount %, ON/OFF) backend se aata hai:
 *   GET /offer/active  ->  { success, offer: { enabled, name, couponCode, discount, message, updatedAt } }
 * Admin dashboard se change karte hi yahan apne aap update ho jata hai.
 */
export default function OfferPopup() {
  const [offer, setOffer] = useState(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  // ── Offer fetch ──
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API}/offer/active`, { cache: "no-store" });
        const data = await res.json();
        if (cancelled || !data?.success || !data.offer?.enabled) return;

        const o = data.offer;
        // Ek session me ek hi baar dikhao (offer change hone par dobara dikhega)
        const seenKey = `offerSeen:${o.couponCode}:${o.discount}:${o.name}:${o.updatedAt || ""}`;
        if (sessionStorage.getItem(seenKey)) return;

        setOffer({ ...o, seenKey });
        timerRef.current = setTimeout(() => setOpen(true), 600);
      } catch (err) {
        // Offer na aaye to page normal chalega
        console.error("Offer fetch failed:", err);
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
    };
  }, []);

  const close = () => {
    if (offer?.seenKey) sessionStorage.setItem(offer.seenKey, "1");
    setOpen(false);
  };

  // ── Esc se close + background scroll lock ──
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(offer.couponCode);
    } catch {
      // Purane browsers ke liye fallback
      const ta = document.createElement("textarea");
      ta.value = offer.couponCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open || !offer) return null;

  return (
    <div className="op-overlay" onClick={close} role="dialog" aria-modal="true" aria-label={offer.name}>
      <div className="op-card" onClick={(e) => e.stopPropagation()}>
        <button className="op-close" onClick={close} aria-label="Close offer">×</button>

        <div className="op-glow" aria-hidden="true" />
        <div className="op-sparkles" aria-hidden="true">
          {[...Array(8)].map((_, i) => (
            <span key={i} style={{ "--i": i }} />
          ))}
        </div>

        <span className="op-tag">🎉 LIMITED TIME OFFER</span>

        <h2 className="op-title">{offer.name}</h2>

        <div className="op-discount">
          <span className="op-percent">{offer.discount}%</span>
          <span className="op-off">OFF</span>
        </div>
        <p className="op-sub">
          {offer.applicableTo === "specific" ? "on selected courses" : "on all courses"}
        </p>

        {offer.applicableTo === "specific" && offer.courseTitles?.length > 0 && (
          <ul className="op-courses">
            {offer.courseTitles.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}

        {offer.message && <p className="op-message">{offer.message}</p>}

        <div className="op-coupon">
          <div className="op-coupon-info">
            <span className="op-coupon-label">USE COUPON CODE</span>
            <span className="op-coupon-code">{offer.couponCode}</span>
          </div>
          <button className={`op-copy ${copied ? "copied" : ""}`} onClick={copyCode}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>

        <button className="op-cta" onClick={close}>
          Grab the Deal →
        </button>
        <p className="op-note">Apply this code at checkout while enrolling.</p>
      </div>
    </div>
  );
}