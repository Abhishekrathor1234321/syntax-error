import React from "react";

const cards = [
  { id: 1, title: "DSA in JAVA", desc: "Master Data Structures & Algorithms using Java with detailed concepts and problems.", link: "#" },
  { id: 2, title: "DSA in C++", desc: "Learn DSA in C++ from basics to advanced with coding examples and tricks.", link: "/exercise-1" },
  { id: 3, title: "DSA in Python", desc: "Practice DSA in Python with easy-to-understand syntax and real problems.", link: "#" },
  { id: 4, title: "DSA in JavaScript", desc: "Learn DSA in JavaScript from basics to advanced with coding examples and tricks.", link: "#" , badge: "Coming Soon" },
  { id: 5, title: "DSA in C", desc: "Learn DSA in C from basics to advanced with coding examples and tricks.", link: "#" , badge: "Coming Soon"},
  { id: 6, title: "DSA in C#", desc: "Learn DSA in C# from basics to advanced with coding examples and tricks.", link: "#" , badge: "Coming Soon"},
];

export default function DppSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((c) => (
        <div key={c.id} className="card shadow-lg bg-white rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-700 mb-2">{c.title}</h3>
          <p className="text-gray-600 mb-4">{c.desc}</p>
          {c.badge ? (
            <span className="inline-block bg-red-500 text-white px-4 py-2 rounded">{c.badge}</span>
          ) : (
            <a href={c.link} className="inline-block bg-blue-600 text-white px-4 py-2 rounded">Start Now</a>
          )}
        </div>
      ))}
    </div>
  );
}
