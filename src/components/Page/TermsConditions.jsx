import React from "react";
import PageLayout from "../PageLayout";

function TermsConditions() {
  return (
    <section id="terms">
      <PageLayout title="Terms & Conditions" subtitle="Last updated: March 2026">
        <div style={{ color: "#9ca3af", lineHeight: "1.8", fontSize: "14px" }}>

          <h2 style={{ color: "white", fontSize: "18px", marginTop: "24px", marginBottom: "8px" }}>Agreement to Terms</h2>
          <p>By accessing our website, you agree to be bound by these Terms and Conditions and agree that you are responsible for compliance with any applicable local laws.</p>

          <h2 style={{ color: "white", fontSize: "18px", marginTop: "24px", marginBottom: "8px" }}>Use License</h2>
          <p>Permission is granted to temporarily access the materials on SYNTAX ERROR's website for personal, non-commercial use only. You must not:</p>
          <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
            <li style={{ marginBottom: "6px" }}>Modify or copy the materials</li>
            <li style={{ marginBottom: "6px" }}>Use the materials for any commercial purpose</li>
            <li style={{ marginBottom: "6px" }}>Attempt to reverse engineer any software on the website</li>
            <li style={{ marginBottom: "6px" }}>Remove any copyright or proprietary notations from the materials</li>
          </ul>

          <h2 style={{ color: "white", fontSize: "18px", marginTop: "24px", marginBottom: "8px" }}>Disclaimer</h2>
          <p>The materials on SYNTAX ERROR's website are provided on an 'as is' basis. SYNTAX ERROR makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.</p>

          <h2 style={{ color: "white", fontSize: "18px", marginTop: "24px", marginBottom: "8px" }}>Limitations</h2>
          <p>In no event shall SYNTAX ERROR or its suppliers be liable for any damages arising out of the use or inability to use the materials on the website, even if SYNTAX ERROR has been notified orally or in writing of the possibility of such damage.</p>

          <h2 style={{ color: "white", fontSize: "18px", marginTop: "24px", marginBottom: "8px" }}>Contact Us</h2>
          <p>If you have any questions about these Terms & Conditions, contact us at:</p>
          <a href="mailto:syntaxerror.community@gmail.com" style={{ color: "#60a5fa" }}>
            📧 syntaxerrorxabhishek@gmail.com
          </a>

        </div>
      </PageLayout>
    </section>
  );
}

export default TermsConditions;