import React, { useState } from "react";
import "./NotesPage.css";

const notesData = [
  { title: "Complete DSA Cheat Sheet", category: "DSA", desc: "Arrays, Linked Lists, Trees, Graphs, DP patterns.", pdf: "" },
  { title: "HTML Handwritten Notes", category: "Web Dev", desc: "HTML tags, forms, semantic elements and structure.", pdf: "notes/HTML .pdf" },
  { title: "CSS Handwritten Notes", category: "Web Dev", desc: "Flexbox, Grid, animations and responsive design.", pdf: "notes/CSS.pdf" },
  { title: "JavaScript Handwritten Notes", category: "Web Dev", desc: "ES6+, DOM, closures, promises and async/await.", pdf: "notes/JavaScript.pdf" },
  { title: "Tailwind CSS Handwritten Notes", category: "Web Dev", desc: "Utility classes, responsive design and custom config.", pdf: "notes/Tailwind Css.pdf" },
  { title: "Bootstrap Handwritten Notes", category: "Web Dev", desc: "Grid system, components and responsive utilities.", pdf: "notes/Bootstrap .pdf" },
  { title: "Python Handwritten Notes", category: "Python", desc: "OOP, loops, functions, libraries and core concepts.", pdf: "" },
  { title: "Python with DSA Handwritten Notes", category: "Python", desc: "DSA concepts implemented in Python — arrays, trees, graphs, DP and more.", pdf: "notes/DSA with python.pdf" },
  { title: "Python Interview Questions", category: "Python", desc: "Most asked Python interview questions with best answers.", pdf: "" },
  { title: "SQL Mastery Notes", category: "Database", desc: "Joins, queries and indexing.", pdf: "/notes/SQL interview questions.pdf" },
  { title: "Java OOP Complete Guide", category: "Java", desc: "OOP, Inheritance, polymorphism and abstraction.", pdf: "" },
  { title: "MERN Stack Handwritten Notes", category: "Web Dev", desc: "MongoDB, Express, React, Node.js — complete full stack guide.", pdf: "notes/MERN stack.pdf" },
  { title: "Git & GitHub Handbook", category: "Git", desc: "Branching strategies and workflows.", pdf: "" },
  { title: "C Handwritten Notes", category: "C", desc: "Pointers, arrays, strings, memory management and more.", pdf: "" },
  { title: "C Interview Questions", category: "C", desc: "Most asked C interview questions with best answers.", pdf: "" },
  { title: "C++ Handwritten Notes", category: "C++", desc: "STL, OOP, templates and competitive programming.", pdf: "" },
  { title: "C++ Interview Questions", category: "C++", desc: "Most asked C++ interview questions with best answers.", pdf: "" },
  { title: "C++ with DSA Handwritten Notes", category: "C++", desc: "DSA concepts implemented in C++ — arrays, trees, graphs, DP and more.", pdf: "notes/C++ dsa.pdf" },
  { title: "HR Interview Questions", category: "HR", desc: "Most asked HR questions with best answers for freshers.", pdf: "notes/hr for freshers.pdf" },
  { title: "DBMS Interview Question", category: "CS", desc: "Most asked DBMS questions with best answers.", pdf: "notes/DBMS interview question.pdf" },
  { title: "Computer Network Interview Question", category: "CS", desc: "Most asked Computer Network questions with best answers.", pdf: "notes/computer networks interview.pdf" },
  { title: "Operating System", category: "CS", desc: "Most asked Operating System questions with best answers.", pdf: "notes/oprating system interview question.pdf" },
  { title: "Project Ideas & Guide", category: "Projects", desc: "Top project ideas with tech stack suggestions.", pdf: "" },
];

function NotesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const handleDownload = async (note) => {
    // Download start karo
    const link = document.createElement("a");
    link.href = note.pdf;
    link.download = note.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Backend mein track karo
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch("https://syntax-error-1xds.vercel.app/user/track-download", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ title: note.title, category: note.category })
        });
      } catch (err) {
        console.error("Track error:", err);
      }
    }
  };

  const filteredNotes = notesData.filter(note => {
    return (
      (category === "All" || note.category === category) &&
      note.title.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <section id="notes" className="notes-page">
      <h1 className="notes-title">Notes</h1>
      <p className="notes-sub">Concise programming notes to accelerate your learning.</p>

      <input
        type="text"
        placeholder="Search notes..."
        className="search-bar"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filters">
        {["All", "DSA", "Web Dev", "Python", "Java", "C", "C++", "CS", "HR", "Database", "Git", "Projects"].map((cat) => (
          <button
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="notes-grid">
        {filteredNotes.map((note, index) => (
          <div className="note-card" key={index}>
            <h3>{note.title}</h3>
            <p>{note.desc}</p>
            <span className="tag">{note.category}</span>

            {note.pdf ? (
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <button
                  onClick={() => handleDownload(note)}
                  className="pdf-download-btn"
                >
                  ⬇️ Download
                </button>
              </div>
            ) : (
              <span className="pdf-soon">🔒 Coming Soon</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default NotesPage;