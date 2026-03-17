import React from "react";
import PageLayout from "../PageLayout";

function SupportPage() {
  return (
    <section id="support">
      <PageLayout title="Support" subtitle="We're here to help you!">
        <div style={{ color: "#9ca3af", lineHeight: "1.8", fontSize: "14px" }}>

          <h2 style={{ color: "white", fontSize: "18px", marginTop: "24px", marginBottom: "8px" }}>How can we help?</h2>
          <p>If you are facing any issues with our platform, notes, courses or anything else — feel free to reach out to us. We typically respond within 24 hours.</p>

          <h2 style={{ color: "white", fontSize: "18px", marginTop: "24px", marginBottom: "8px" }}>Email Support</h2>
          <p>Send us your query at:</p>
          <a href="mailto:syntaxerror.community@gmail.com" style={{
            display: "inline-block",
            marginTop: "8px",
            padding: "10px 20px",
            background: "rgba(59,130,246,0.15)",
            color: "#60a5fa",
            border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "14px"
          }}>
            📧 syntaxerrorxabhishek@gmail.com
          </a>

          <h2 style={{ color: "white", fontSize: "18px", marginTop: "24px", marginBottom: "8px" }}>Instagram</h2>
          <p>You can also DM us on Instagram for quick support:</p>
          <a href="https://www.instagram.com/code.abhii07?igsh=ZW9wMzFsc3N1ZmUx"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              marginTop: "8px",
              padding: "10px 20px",
              background: "rgba(236,72,153,0.15)",
              color: "#f472b6",
              border: "1px solid rgba(236,72,153,0.3)",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px"
            }}>
            📸 @code.abhii07
          </a>

          <h2 style={{ color: "white", fontSize: "18px", marginTop: "24px", marginBottom: "8px" }}>FAQs</h2>
          <div style={{ marginTop: "8px" }}>
            {[
              { q: "How do I access the notes?", a: "Go to Notes section from the navbar and download any PDF." },
              { q: "How do I enroll in a course?", a: "Click the Enroll Now button on any course card." },
              { q: "Are the notes free?", a: "Yes! Most notes are completely free to download." },
              { q: "How do I contact for course queries?", a: "Email us at syntaxerror.community@gmail.com" },
            ].map((faq, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px"
              }}>
                <p style={{ color: "white", fontWeight: "bold", marginBottom: "6px" }}>Q: {faq.q}</p>
                <p>A: {faq.a}</p>
              </div>
            ))}
          </div>

        </div>
      </PageLayout>
    </section>
  );
}

export default SupportPage;