const CsHrQuestion = require("../Models/CsHrQuestion");

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const MAX_PER_REQUEST = 100;

const norm = (s) => String(s == null ? "" : s).toLowerCase().replace(/\s+/g, " ").trim();

function cleanItem(raw) {
  if (!raw || typeof raw !== "object") return { error: "Not a valid question object" };

  const category = String(raw.category == null ? "" : raw.category).trim();
  const question = String(raw.question == null ? "" : raw.question).trim();
  const solution = String(raw.solution == null ? "" : raw.solution).trim();
  const options = Array.isArray(raw.options) ? raw.options.map((o) => String(o == null ? "" : o).trim()) : [];

  let correctIndex = Number(raw.correctIndex);

  if (!CsHrQuestion.CATEGORIES.includes(category)) return { error: `Unknown category "${category}"` };
  if (!question) return { error: "Question text is empty" };
  if (options.length !== 4 || options.some((o) => !o)) return { error: "Exactly 4 non-empty options are required" };
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) return { error: "correctIndex must be 0, 1, 2 or 3" };
  if (!solution) return { error: "Solution is required" };

  const difficulty = DIFFICULTIES.find((d) => d.toLowerCase() === norm(raw.difficulty)) || "Medium";
  let points = Number(raw.points);
  if (!Number.isFinite(points) || points < 1) points = 5;

  return {
    doc: {
      category,
      difficulty,
      question,
      options,
      correctIndex,
      hint: String(raw.hint == null ? "" : raw.hint).trim(),
      solution,
      points,
    },
  };
}

module.exports = function registerCsHrExtras(router, { ensureAuthenticated, ensureAdmin }) {
  router.post("/admin/cshr/bulk", ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
      const list = req.body && req.body.questions;
      if (!Array.isArray(list) || list.length === 0) {
        return res.status(400).json({ success: false, message: "Send { questions: [ ... ] } with at least one question" });
      }
      if (list.length > MAX_PER_REQUEST) {
        return res.status(400).json({ success: false, message: `Send at most ${MAX_PER_REQUEST} questions per request` });
      }

      const existing = await CsHrQuestion.find({}).select("question").lean();
      const seen = new Set(existing.map((q) => norm(q.question)));

      const failed = [];
      const skipped = [];
      const toInsert = [];
      list.forEach((raw, index) => {
        const { doc, error } = cleanItem(raw);
        if (error) return failed.push({ index, message: error });
        const key = norm(doc.question);
        if (seen.has(key)) return skipped.push({ index, reason: "This question already exists" });
        seen.add(key);
        toInsert.push(doc);
      });

      const inserted = toInsert.length ? await CsHrQuestion.insertMany(toInsert) : [];
      res.json({ success: true, inserted: inserted.length, skipped, failed });
    } catch (err) {
      console.error("Error in POST /tcs/admin/cshr/bulk:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
};