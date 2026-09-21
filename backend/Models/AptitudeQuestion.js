const mongoose = require("mongoose");

/*
  One aptitude MCQ.

  - section   : "Quant" | "Reasoning" | "Verbal".
                You do NOT have to send it. If it is missing, it is filled in automatically from `topic`.
  - topic     : the sub-topic (Percentage, Syllogism, Idioms, ...). Every topic belongs to exactly one section.
  - difficulty: "Easy" | "Medium" | "Hard" (optional, defaults to "Medium").
  - options   : exactly 4 options, with `correctIndex` pointing to the right one (0-based).
  - hint      : a short hint.
  - solution  : step-by-step explanation, shown after the student submits (whether right or wrong).
  - points    : points earned for a correct answer (only the first time).

  Old questions that were saved before `section` and `difficulty` existed keep working as they are.
*/

const SECTIONS = ["Quant", "Reasoning", "Verbal"];

const TOPICS_BY_SECTION = {
  Quant: [
    "Percentage",
    "Profit & Loss",
    "Time & Work",
    "Ratio",
    "Number System",
    "Probability",
    "Time, Speed & Distance",
    "Simple & Compound Interest",
    "Permutations & Combinations",
    "Pipes & Cisterns",
  ],
  Reasoning: [
    "Logical Reasoning",
    "Number Series",
    "Coding-Decoding",
    "Blood Relations",
    "Direction Sense",
    "Seating Arrangement",
    "Syllogism",
    "Analogy",
    "Clocks",
    "Ranking",
  ],
  Verbal: [
    "Verbal Ability",
    "Synonyms",
    "Antonyms",
    "Fill in the Blanks",
    "Subject-Verb Agreement",
    "Error Spotting",
    "One-Word Substitution",
    "Idioms",
    "Sentence Ordering",
    "Reading Comprehension",
  ],
};

const ALL_TOPICS = SECTIONS.flatMap((s) => TOPICS_BY_SECTION[s]);

// Returns the section a topic belongs to, or null if the topic is unknown.
const sectionForTopic = (topic) => SECTIONS.find((s) => TOPICS_BY_SECTION[s].includes(topic)) || null;

const aptitudeQuestionSchema = new mongoose.Schema(
  {
    section: { type: String, enum: SECTIONS }, // optional, auto-filled from topic
    topic: { type: String, enum: ALL_TOPICS, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    question: { type: String, required: true },
    options: {
      type: [String],
      validate: (arr) => arr.length === 4,
      required: true,
    },
    correctIndex: { type: Number, min: 0, max: 3, required: true }, // 0-based
    hint: { type: String },
    solution: { type: String, required: true }, // step-by-step explanation
    points: { type: Number, default: 5 },
  },
  { timestamps: true }
);

// Fill in `section` from `topic` whenever it was not provided.
aptitudeQuestionSchema.pre("validate", async function () {
  if (!this.section) {
    const found = sectionForTopic(this.topic);
    if (found) this.section = found;
  }
});

module.exports = mongoose.models.AptitudeQuestion || mongoose.model("AptitudeQuestion", aptitudeQuestionSchema);

module.exports.SECTIONS = SECTIONS;
module.exports.TOPICS_BY_SECTION = TOPICS_BY_SECTION;
module.exports.sectionForTopic = sectionForTopic;

/* ------------------------------------------------------------------ */
/*  SAMPLE DATA: one or two questions from the original topics         */
/* ------------------------------------------------------------------ */
module.exports.sampleAptitudeQuestions = [
  {
    section: "Quant",
    topic: "Percentage",
    difficulty: "Easy",
    question: "A number is first increased by 20% and then decreased by 20%. What is the net percentage change?",
    options: ["No change", "4% decrease", "4% increase", "24% decrease"],
    correctIndex: 1,
    hint: "Use the successive change formula: a + b + (ab/100). Here b is negative.",
    solution:
      "Net change = 20 + (-20) + (20 × -20)/100 = 0 - 4 = -4%. So the number decreases by 4%. An increase of 20% followed by a decrease of 20% does not cancel out, because each change is calculated on a different base.",
    points: 5,
  },
  {
    section: "Quant",
    topic: "Profit & Loss",
    difficulty: "Easy",
    question: "A shopkeeper buys an article for Rs. 800 and sells it for Rs. 960. What is the profit percentage?",
    options: ["15%", "20%", "18%", "25%"],
    correctIndex: 1,
    hint: "Profit % = (Profit / Cost Price) × 100.",
    solution: "Profit = 960 - 800 = 160. Profit % = (160 / 800) × 100 = 20%.",
    points: 5,
  },
  {
    section: "Quant",
    topic: "Time & Work",
    difficulty: "Medium",
    question: "A alone can finish a piece of work in 12 days, and B alone can finish it in 18 days. How many days will they take working together?",
    options: ["7.2 days", "6 days", "8 days", "9 days"],
    correctIndex: 0,
    hint: "Add their one-day work, 1/12 + 1/18, and then take the reciprocal.",
    solution:
      "A's one-day work = 1/12 and B's one-day work = 1/18. Together = 1/12 + 1/18 = 3/36 + 2/36 = 5/36. The whole work takes 36/5 = 7.2 days.",
    points: 5,
  },
  {
    section: "Quant",
    topic: "Ratio",
    difficulty: "Easy",
    question: "Two numbers are in the ratio 3:5 and their sum is 96. What is the larger number?",
    options: ["36", "60", "48", "72"],
    correctIndex: 1,
    hint: "Total parts = 3 + 5 = 8. One part = sum / total parts.",
    solution: "One part = 96 / 8 = 12. The larger number = 5 × 12 = 60.",
    points: 5,
  },
  {
    section: "Quant",
    topic: "Number System",
    difficulty: "Easy",
    question: "How many numbers from 1 to 100 are divisible by 7?",
    options: ["12", "13", "14", "15"],
    correctIndex: 2,
    hint: "Use the formula floor(100 / 7).",
    solution: "100 ÷ 7 = 14.28..., and the floor value is 14. So 7, 14, 21, ..., 98 gives a total of 14 numbers.",
    points: 5,
  },
  {
    section: "Quant",
    topic: "Probability",
    difficulty: "Easy",
    question: "A fair coin is tossed 2 times. What is the probability of getting heads both times?",
    options: ["1/2", "1/3", "1/4", "3/4"],
    correctIndex: 2,
    hint: "The two tosses are independent events, so multiply the individual probabilities.",
    solution: "P(Head) = 1/2 on each toss. The tosses are independent, so P(both heads) = 1/2 × 1/2 = 1/4.",
    points: 5,
  },
  {
    section: "Reasoning",
    topic: "Logical Reasoning",
    difficulty: "Medium",
    question: "Complete the series: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "36"],
    correctIndex: 1,
    hint: "Look at the differences: 4, 6, 8, 10, ... They follow a pattern of their own.",
    solution:
      "Each term is n(n+1): 1×2 = 2, 2×3 = 6, 3×4 = 12, 4×5 = 20, 5×6 = 30, 6×7 = 42. So the next term is 42.",
    points: 5,
  },
  {
    section: "Verbal",
    topic: "Verbal Ability",
    difficulty: "Easy",
    question: "Choose the most suitable synonym: 'Meticulous'",
    options: ["Careless", "Thorough", "Fast", "Confused"],
    correctIndex: 1,
    hint: "Meticulous means paying great attention to detail.",
    solution: "'Meticulous' means very careful and detail-oriented in one's work. Its closest synonym is 'Thorough'.",
    points: 5,
  },
];