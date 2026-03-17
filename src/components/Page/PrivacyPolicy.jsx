import React from "react";
import PageLayout from "../PageLayout";

function PrivacyPolicy() {
  return (
    <section id="privacy-policy">
      <PageLayout title="Privacy Policy" subtitle="Last updated: March 2026">
        <div style={{ color: "#9ca3af", lineHeight: "1.8", fontSize: "14px" }}>

          <h2 style={{ color: "white", fontSize: "18px", marginTop: "24px", marginBottom: "8px" }}>Introduction</h2>
          <p>At SYNTAX ERROR, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by SYNTAX ERROR and how we use it.</p>

          <h2 style={{ color: "white", fontSize: "18px", marginTop: "24px", marginBottom: "8px" }}>Your Rights</h2>
          <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
          <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
            <li style={{ marginBottom: "6px" }}>The right to access — You have the right to request copies of your personal data.</li>
            <li style={{ marginBottom: "6px" }}>The right to rectification — You have the right to request that we correct any information you believe is inaccurate.</li>
            <li style={{ marginBottom: "6px" }}>The right to erasure — You have the right to request that we erase your personal data, under certain conditions.</li>
            <li style={{ marginBottom: "6px" }}>The right to data portability — You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
          </ul>
          <p style={{ marginTop: "8px" }}>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>

          <h2 style={{ color: "white", fontSize: "18px", marginTop: "24px", marginBottom: "8px" }}>Children's Information</h2>
          <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>
          <p style={{ marginTop: "8px" }}>SYNTAX ERROR does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>

          <h2 style={{ color: "white", fontSize: "18px", marginTop: "24px", marginBottom: "8px" }}>Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.</p>

          <h2 style={{ color: "white", fontSize: "18px", marginTop: "24px", marginBottom: "8px" }}>Contact Us</h2>
          <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at:</p>
          <a href="mailto:syntaxerror.community@gmail.com" style={{ color: "#60a5fa" }}>
            📧 syntaxerrorxabhishek@gmail.com
          </a>

        </div>
      </PageLayout>
    </section>
  );
}

export default PrivacyPolicy;