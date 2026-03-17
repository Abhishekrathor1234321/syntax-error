import React from "react";
import PageLayout from "../PageLayout";

const roadmaps = [
  {
    title: "Frontend Developer",
    description: "From HTML basics to building React apps.",
    totalMonths: "6 months",
    emoji: "🎨",
    topics: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"],
  },
  {
    title: "Backend Developer",
    description: "Learn server-side development with Node.js.",
    totalMonths: "6 months",
    emoji: "⚙️",
    topics: ["Node.js", "Express", "MongoDB", "REST APIs", "SQL"],
  },
  {
    title: "Full Stack Developer",
    description: "Frontend + Backend together.",
    totalMonths: "9 months",
    emoji: "🚀",
    topics: ["HTML", "CSS", "React", "Node.js", "MongoDB", "Deployment"],
  },
  {
    title: "DSA & Competitive Programming",
    description: "Master Data Structures and Algorithms for interviews.",
    totalMonths: "4 months",
    emoji: "🧠",
    topics: ["Arrays", "Linked List", "Trees", "Graphs", "DP", "LeetCode"],
  },
  {
    title: "Java Developer",
    description: "Core Java to advanced concepts for placements.",
    totalMonths: "3 months",
    emoji: "☕",
    topics: ["Core Java", "OOP", "Collections", "JDBC", "Spring Boot"],
  },
];

function RoadmapPage() {
  return (
    <section id="roadmap" >
      <PageLayout
        title="Developer Roadmaps"
        subtitle="Step-by-step learning paths to fast-track your developer career."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {roadmaps.map((rm, index) => (
            <div
              key={index}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "24px",
                borderRadius: "12px",
                transition: "border 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={e => e.currentTarget.style.border = "1px solid rgba(99,102,241,0.5)"}
              onMouseLeave={e => e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)"}
            >
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>{rm.emoji}</div>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
                {rm.title}
              </h2>
              <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "12px" }}>
                {rm.description}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                {rm.topics.map((topic, i) => (
                  <span key={i} style={{
                    fontSize: "11px",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    background: "rgba(99,102,241,0.15)",
                    color: "#a5b4fc",
                    border: "1px solid rgba(99,102,241,0.2)"
                  }}>
                    {topic}
                  </span>
                ))}
              </div>

              <p style={{ fontSize: "12px", color: "#6b7280" }}>
                ⏱ Duration: <span style={{ color: "#e5e7eb" }}>{rm.totalMonths}</span>
              </p>
            </div>
          ))}
        </div>
      </PageLayout>
    </section>
  );
}

export default RoadmapPage;