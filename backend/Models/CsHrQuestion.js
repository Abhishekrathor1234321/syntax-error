const mongoose = require("mongoose");
const CATEGORIES = ["DBMS", "OOPs", "Operating Systems", "Computer Networks", "SQL", "Data Structures", "Gen AI", "HR"];

/*
  CS Fundamentals + HR + Gen AI ke MCQs.
  - category: "DBMS" | "OOPs" | "Operating Systems" | "Computer Networks" | "SQL" |
              "Data Structures" | "Gen AI" | "HR"
  - baaki structure Aptitude jaisa hi hai: 4 options, correctIndex, hint, solution
*/
const csHrQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["DBMS", "OOPs", "Operating Systems", "Computer Networks", "SQL", "Data Structures", "Gen AI", "HR"],
      required: true,
    },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" }, // ADD THIS
    question: { type: String, required: true },
    options: {
      type: [String],
      validate: (arr) => arr.length === 4,
      required: true,
    },
    correctIndex: { type: Number, min: 0, max: 3, required: true },
    hint: { type: String },
    solution: { type: String, required: true },
    points: { type: Number, default: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.CsHrQuestion || mongoose.model("CsHrQuestion", csHrQuestionSchema);

module.exports.CATEGORIES = CATEGORIES; 

/* ------------------------------------------------------------------ */
/*  SAMPLE DATA — har category se 1                                     */
/* ------------------------------------------------------------------ */


module.exports.sampleCsHrQuestions = [
  {
    category: "DBMS",
    question: "Normalization ka mukhya purpose kya hai?",
    options: [
      "Data redundancy badhana",
      "Data redundancy kam karna aur data integrity improve karna",
      "Queries ko slow karna",
      "Tables ki number kam karna",
    ],
    correctIndex: 1,
    hint: "Sochiye agar same data multiple jagah repeat ho raha ho to update karte waqt kya problem aayegi.",
    solution:
      "Normalization database tables ko organize karne ka process hai jisse data redundancy kam ho aur data integrity (anomalies se bachaav) improve ho. Isse insertion, update aur deletion anomalies avoid hoti hain.",
    points: 5,
  },
  {
    category: "OOPs",
    question: "Polymorphism ka matlab kya hai?",
    options: [
      "Ek class ke multiple objects banana",
      "Ek hi interface ke through alag-alag data types/forms ko handle karna",
      "Data ko hide karna",
      "Multiple classes ko ek class me combine karna",
    ],
    correctIndex: 1,
    hint: "'Poly' matlab 'many', 'morph' matlab 'forms'.",
    solution:
      "Polymorphism ka matlab hai ek hi function/method/interface ka alag-alag context me alag behavior hona — jaise method overloading (compile-time) aur method overriding (run-time).",
    points: 5,
  },
  {
    category: "Operating Systems",
    question: "Deadlock hone ke liye kaunsi condition zaroori NAHI hai?",
    options: ["Mutual Exclusion", "Hold and Wait", "Preemption", "Circular Wait"],
    correctIndex: 2,
    hint: "Deadlock hone ke liye 4 conditions chahiye: in me se ek 'Preemption' ka opposite hai.",
    solution:
      "Deadlock ke liye 4 zaroori conditions hoti hain: Mutual Exclusion, Hold and Wait, No Preemption (Preemption nahi honi chahiye), aur Circular Wait. Isliye 'Preemption' khud ek deadlock condition nahi hai — 'No Preemption' hoti hai.",
    points: 5,
  },
  {
    category: "Computer Networks",
    question: "HTTP ka default port number kya hai?",
    options: ["21", "25", "80", "443"],
    correctIndex: 2,
    hint: "HTTPS ka port 443 hota hai, HTTP thoda different hai.",
    solution: "HTTP (unencrypted web traffic) ka default port 80 hota hai, jabki HTTPS (encrypted) ka default port 443 hota hai.",
    points: 5,
  },
  {
    category: "SQL",
    question: "Kaunsa SQL clause result ko groups me categorize karke aggregate functions ke saath use hota hai?",
    options: ["WHERE", "ORDER BY", "GROUP BY", "HAVING"],
    correctIndex: 2,
    hint: "Yeh clause aggregate functions (COUNT, SUM, AVG) ke saath rows ko categories me baantne ke liye use hota hai.",
    solution:
      "GROUP BY clause rows ko ek ya zyada columns ke basis par groups me baant deta hai, taaki har group par SUM(), COUNT(), AVG() jaise aggregate functions apply kiye ja sakein.",
    points: 5,
  },
  {
    category: "Data Structures",
    question: "Ek balanced Binary Search Tree me search operation ka time complexity kya hoti hai?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctIndex: 1,
    hint: "Balanced tree me har step par roughly aadha data discard ho jata hai.",
    solution:
      "Balanced BST (jaise AVL ya Red-Black Tree) me height O(log n) hoti hai, aur search me har step par ek subtree discard ho jata hai, isliye search time complexity O(log n) hoti hai.",
    points: 5,
  },
  {
    category: "Gen AI",
    question: "'Hallucination' term ka use LLMs (Large Language Models) ke context me kis cheez ke liye hota hai?",
    options: [
      "Model bahut fast response deta hai",
      "Model confident tarike se galat ya fabricated information deta hai",
      "Model ka training data corrupt ho jata hai",
      "Model images generate karta hai",
    ],
    correctIndex: 1,
    hint: "Sochiye jab AI kuch bilkul confidently bolta hai jo sach nahi hota.",
    solution:
      "Hallucination tab hota hai jab ek LLM confident tone me aisi information generate karta hai jo factually galat ya completely fabricated hoti hai, bina yeh signal diye ki wah uncertain hai.",
    points: 5,
  },
  {
    category: "HR",
    question: "Interview me poocha gaya: 'Apni sabse badi weakness batao.' Sabse behtar approach kya hai?",
    options: [
      "Kehna ki koi weakness nahi hai",
      "Ek real weakness batao jo job ke liye critical na ho, saath me batao usko improve karne ke liye kya kar rahe ho",
      "Kisi aur ki weakness ke baare me baat karo",
      "Question ko avoid kar do",
    ],
    correctIndex: 1,
    hint: "Interviewer honesty aur self-awareness dekhna chahta hai, saath me growth mindset.",
    solution:
      "Sabse behtar approach hai ek genuine weakness share karna jo role ke liye deal-breaker na ho, aur usके saath yeh bhi batana ki aap usko actively improve karne ke liye kya kadam utha rahe ho. Yeh self-awareness aur growth mindset dikhata hai.",
    points: 5,
  },
];