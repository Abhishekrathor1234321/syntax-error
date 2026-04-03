import React, { useState } from "react";
import PageLayout from "../PageLayout";

const roadmaps = [
  {
    title: "Data Structure & Algorithm",
    description: "Master Data Structures and Algorithms for placements and interviews.",
    totalMonths: "3 months",
    emoji: "",
    topics: ["Arrays", "Linked List", "Trees", "Graphs", "DP", "LeetCode"],
    pdfUrl: "notes/DSA_Roadmap_SyntaxError.pdf",
  },
  {
    title: "Frontend Developer",
    description: "From HTML basics to building modern React apps with Tailwind.",
    totalMonths: "3 months",
    emoji: "",
    topics: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"],
    pdfUrl: "notes/Frontend_3Month_SyntaxError.pdf",
  },
  {
    title: "Backend Developer",
    description: "Learn server-side development with Node.js, APIs and databases.",
    totalMonths: "3 months",
    emoji: "",
    topics: ["Node.js", "Express", "MongoDB", "REST APIs", "SQL"],
    pdfUrl: "notes/Backend_3Month_v2_SyntaxError (1).pdf",
  },
  {
    title: "Full Stack Developer",
    description: "Frontend + Backend together — end-to-end app development.",
    totalMonths: "6 months",
    emoji: "",
    topics: ["HTML", "CSS", "React", "Node.js", "MongoDB", "Deployment"],
    pdfUrl: "notes/FullStack_Planner_SyntaxError (1).pdf",
  },
  {
    title: "Machine Learning",
    description: "From Python basics to building and deploying ML models.",
    totalMonths: "6 months",
    emoji: "",
    topics: ["Python", "NumPy", "Pandas", "Scikit-learn", "Neural Nets", "TensorFlow"],
    pdfUrl: "notes/ML_Roadmap_SyntaxError.pdf",
  },
  {
    title: "High Level Design",
    description: "System design concepts for distributed, scalable architectures.",
    totalMonths: "4 months",
    emoji: "",
    topics: ["Scalability", "Load Balancing", "Caching", "Microservices", "CAP Theorem", "Databases"],
    pdfUrl: "notes/HLD_SystemDesign_Roadmap_SyntaxError (1).pdf",
  },
  {
    title: "Low Level Design",
    description: "OOP, design patterns, and writing clean, maintainable code.",
    totalMonths: "3 months",
    emoji: "",
    topics: ["OOP", "SOLID", "Design Patterns", "UML", "Clean Code", "Refactoring"],
    pdfUrl: "notes/LLD_LowLevelDesign_Roadmap_SyntaxError (1).pdf",
  },
  {
    title: "AI & ML Engineering",
    description: "Advanced AI — LLMs, prompt engineering, RAG, and AI deployment.",
    totalMonths: "3 months",
    emoji: "",
    topics: ["LLMs", "Prompt Engineering", "RAG", "LangChain", "Fine-tuning", "HuggingFace"],
    pdfUrl: "notes/AIML_Roadmap_SyntaxError.pdf",
  },
  {
    title: "Data Science",
    description: "End-to-end data science — from statistics to building and deploying predictive models.",
    totalMonths: "6 months",
    emoji: "",
    topics: ["Python", "Statistics", "Pandas", "Matplotlib", "Scikit-learn", "ML Models", "Feature Engineering"],
    pdfUrl: "notes/DataScience_Roadmap_SyntaxError.pdf",
  },
  {
    title: "Data Analytics",
    description: "Learn to collect, clean, and visualize data to drive business decisions.",
    totalMonths: "3 months",
    emoji: "",
    topics: ["Excel", "SQL", "Python", "Power BI", "Tableau", "Data Cleaning", "Dashboards"],
    pdfUrl: "notes/DataAnalytics_Roadmap_SyntaxError (1).pdf",
  },
];

function RoadmapPage() {
  const [downloadingIndex, setDownloadingIndex] = useState(null);

  const handleDownload = (e, rm, index) => {
    e.stopPropagation();
    setDownloadingIndex(index);
    const link = document.createElement("a");
    link.href = rm.pdfUrl;
    link.download = `${rm.title.replace(/\s+/g, "_")}_Roadmap.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingIndex(null), 2000);
  };

  return (
    <section id="roadmap">
      <PageLayout
        title="Developer Roadmaps with Free Resources"
        subtitle="Step-by-step learning paths to fast-track your developer career."
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse-green {
            0%, 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.4); }
            50% { box-shadow: 0 0 0 6px rgba(52,211,153,0); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes bounce-down {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(3px); }
          }

          .roadmap-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            padding: 24px;
            border-radius: 16px;
            transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s, background 0.3s;
            animation: fadeIn 0.5s ease both;
            position: relative;
            overflow: hidden;
          }
          .roadmap-card::after {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse at top left, rgba(99,102,241,0.07) 0%, transparent 65%);
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            border-radius: 16px;
          }
          .roadmap-card:hover {
            border-color: rgba(99,102,241,0.45);
            box-shadow: 0 8px 30px rgba(99,102,241,0.13), 0 0 0 1px rgba(99,102,241,0.08);
            transform: translateY(-3px);
            background: rgba(255,255,255,0.045);
          }
          .roadmap-card:hover::after {
            opacity: 1;
          }

          .topic-tag {
            font-size: 11px;
            padding: 3px 10px;
            border-radius: 999px;
            background: rgba(99,102,241,0.1);
            color: #a5b4fc;
            border: 1px solid rgba(99,102,241,0.18);
            transition: background 0.25s, color 0.25s, border-color 0.25s;
          }
          .roadmap-card:hover .topic-tag {
            background: rgba(99,102,241,0.18);
            color: #c7d2fe;
            border-color: rgba(99,102,241,0.3);
          }

          .download-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            margin-top: 18px;
            padding: 10px 16px;
            border-radius: 10px;
            border: 1px solid rgba(99,102,241,0.28);
            background: rgba(99,102,241,0.09);
            color: #a5b4fc;
            font-size: 12.5px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.22s, border-color 0.22s, color 0.22s, transform 0.15s, box-shadow 0.22s;
            letter-spacing: 0.025em;
            position: relative;
            overflow: hidden;
            z-index: 1;
          }
          .download-btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1));
            opacity: 0;
            transition: opacity 0.22s;
            z-index: -1;
          }
          .download-btn:hover {
            border-color: rgba(99,102,241,0.6);
            color: #e0e7ff;
            transform: translateY(-1px);
            box-shadow: 0 4px 20px rgba(99,102,241,0.22);
          }
          .download-btn:hover::before {
            opacity: 1;
          }
          .download-btn:hover .btn-arrow {
            animation: bounce-down 0.7s ease infinite;
          }
          .download-btn:active {
            transform: scale(0.97) translateY(0);
          }
          .download-btn.downloading {
            border-color: rgba(52,211,153,0.45);
            background: rgba(52,211,153,0.08);
            color: #6ee7b7;
            animation: pulse-green 1.2s ease infinite;
            pointer-events: none;
          }
          .download-btn.downloading .btn-arrow {
            animation: spin 0.75s linear infinite;
          }
        `}</style>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px"
        }}>
          {roadmaps.map((rm, index) => {
            const isDownloading = downloadingIndex === index;
            return (
              <div
                key={index}
                className="roadmap-card"
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                {/* Header */}
               <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#f0f4f8", margin: 0 }}>
    {rm.title}
  </h3>
  <span style={{
    fontSize: "11px",
    padding: "3px 10px",
    borderRadius: "999px",
    background: "rgba(16,185,129,0.1)",
    color: "#34d399",
    border: "1px solid rgba(16,185,129,0.2)",
    whiteSpace: "nowrap",
    flexShrink: 0,
    marginLeft: "10px",
  }}>
    ⏱ {rm.totalMonths}
  </span>
</div>

                {/* Title & Description */}
                <h2 style={{ fontSize: "17px", fontWeight: "700", color: "white", marginBottom: "6px" }}>
                  {rm.title}
                </h2>
                <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "14px", lineHeight: "1.6" }}>
                  {rm.description}
                </p>

                {/* Topics */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {rm.topics.map((topic, i) => (
                    <span key={i} className="topic-tag">{topic}</span>
                  ))}
                </div>

                {/* Download PDF Button */}
                <button
                  className={`download-btn ${isDownloading ? "downloading" : ""}`}
                  onClick={(e) => handleDownload(e, rm, index)}
                >
                  <span className="btn-arrow" style={{ fontSize: "15px", lineHeight: 1 }}>
                    {isDownloading ? "↻" : "↓"}
                  </span>
                  <span>{isDownloading ? "Downloading..." : "Download Roadmap PDF"}</span>
                </button>
              </div>
            );
          })}
        </div>
      </PageLayout>
    </section>
  );
}

export default RoadmapPage;