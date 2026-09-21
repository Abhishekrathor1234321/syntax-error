const AptitudeQuestion = require("../Models/AptitudeQuestion");

/*
  Extra Aptitude routes: sections (Quant / Reasoning / Verbal) and bulk import.
  This file only ADDS new routes. None of the existing routes in TcsRouter.js are changed.

  New routes (all under /tcs):
    GET  /aptitude/meta                 -> sections, their topics, difficulties (public)
    GET  /aptitude/sections             -> question counts per section and difficulty (public)
    GET  /aptitude/section/:section     -> questions of one section, WITHOUT answers (public)
                                           optional: ?difficulty=Easy|Medium|Hard
    POST /admin/aptitude/bulk           -> add one or many questions at once (admin only)
*/

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const DEFAULT_POINTS = { Easy: 5, Medium: 10, Hard: 15 };
const MAX_PER_REQUEST = 100;

const norm = (s) => String(s == null ? "" : s).toLowerCase().replace(/\s+/g, " ").trim();

// "quant" / "QUANT" / "Quant" -> "Quant" (or null if it is not a real section)
function pickSection(name) {
  const n = norm(name);
  return AptitudeQuestion.SECTIONS.find((s) => s.toLowerCase() === n) || null;
}

// Checks one incoming question and returns either { doc } (clean, ready to save) or { error }.
function cleanItem(raw) {
  if (!raw || typeof raw !== "object") return { error: "Not a valid question object" };

  const topic = String(raw.topic == null ? "" : raw.topic).trim();
  const question = String(raw.question == null ? "" : raw.question).trim();
  const solution = String(raw.solution == null ? "" : raw.solution).trim();
  const options = Array.isArray(raw.options) ? raw.options.map((o) => String(o == null ? "" : o).trim()) : [];

  // Accept either correctIndex (0-3) or correctOption ("A"-"D")
  let correctIndex = raw.correctIndex;
  if ((correctIndex === undefined || correctIndex === null || correctIndex === "") && typeof raw.correctOption === "string") {
    correctIndex = "ABCD".indexOf(raw.correctOption.trim().toUpperCase());
  }
  correctIndex = Number(correctIndex);

  if (!question) return { error: "Question text is empty" };
  if (options.length !== 4 || options.some((o) => !o)) return { error: "Exactly 4 non-empty options are required" };
  if (new Set(options.map(norm)).size !== 4) return { error: "All 4 options must be different" };
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) return { error: "correctIndex must be 0, 1, 2 or 3" };
  if (!solution) return { error: "Solution is required" };

  const topicSection = AptitudeQuestion.sectionForTopic(topic);
  if (!topicSection) return { error: `Unknown topic "${topic}"` };
  if (raw.section && pickSection(raw.section) !== topicSection) {
    return { error: `Topic "${topic}" belongs to ${topicSection}, not ${raw.section}` };
  }

  const difficulty = DIFFICULTIES.find((d) => d.toLowerCase() === norm(raw.difficulty)) || "Medium";
  let points = Number(raw.points);
  if (!Number.isFinite(points) || points < 1) points = DEFAULT_POINTS[difficulty];

  return {
    doc: {
      section: topicSection,
      topic,
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

module.exports = function registerAptitudeExtras(router, { ensureAuthenticated, ensureAdmin }) {
  const { SECTIONS, TOPICS_BY_SECTION, sectionForTopic } = AptitudeQuestion;

  // ---------- PUBLIC ----------

  router.get("/aptitude/meta", (req, res) => {
    res.json({
      success: true,
      sections: SECTIONS.map((name) => ({ name, topics: TOPICS_BY_SECTION[name] })),
      difficulties: DIFFICULTIES,
    });
  });

  router.get("/aptitude/sections", async (req, res) => {
    try {
      const docs = await AptitudeQuestion.find({}).select("section topic difficulty").lean();
      const rows = SECTIONS.map((name) => ({ name, total: 0, Easy: 0, Medium: 0, Hard: 0 }));
      docs.forEach((d) => {
        const row = rows.find((r) => r.name === (d.section || sectionForTopic(d.topic)));
        if (!row) return;
        row.total += 1;
        row[DIFFICULTIES.includes(d.difficulty) ? d.difficulty : "Medium"] += 1;
      });
      res.json({ success: true, sections: rows });
    } catch (err) {
      console.error("Error in GET /tcs/aptitude/sections:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  // Never sends correctIndex or solution (same rule as the existing GET /aptitude).
  router.get("/aptitude/section/:section", async (req, res) => {
    try {
      const section = pickSection(req.params.section);
      if (!section) return res.status(404).json({ success: false, message: "Unknown section" });

      // Old questions saved before `section` existed have no section, so match them through their topic.
      const filter = { $or: [{ section }, { section: null, topic: { $in: TOPICS_BY_SECTION[section] } }] };
      const wanted = DIFFICULTIES.find((d) => d.toLowerCase() === norm(req.query.difficulty));

      const docs = await AptitudeQuestion.find(filter).sort({ createdAt: 1 }).lean();
      const rank = (d) => DIFFICULTIES.indexOf(d);
      const questions = docs
        .map((d) => ({
          _id: d._id,
          section,
          topic: d.topic,
          difficulty: DIFFICULTIES.includes(d.difficulty) ? d.difficulty : "Medium",
          question: d.question,
          options: d.options,
          hint: d.hint,
          points: d.points,
        }))
        .filter((q) => !wanted || q.difficulty === wanted)
        .sort((a, b) => rank(a.difficulty) - rank(b.difficulty)); // Easy -> Medium -> Hard, order kept inside each level

      res.json({ success: true, section, count: questions.length, questions });
    } catch (err) {
      console.error("Error in GET /tcs/aptitude/section/:section:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  // ---------- ADMIN ONLY ----------

  // Body: { questions: [ {section?, topic, difficulty?, question, options[4], correctIndex | correctOption, hint?, solution, points?} ] }
  router.post("/admin/aptitude/bulk", ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
      const list = req.body && req.body.questions;
      if (!Array.isArray(list) || list.length === 0) {
        return res.status(400).json({ success: false, message: "Send { questions: [ ... ] } with at least one question" });
      }
      if (list.length > MAX_PER_REQUEST) {
        return res.status(400).json({ success: false, message: `Send at most ${MAX_PER_REQUEST} questions per request` });
      }

      const existing = await AptitudeQuestion.find({}).select("question").lean();
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

      const inserted = toInsert.length ? await AptitudeQuestion.insertMany(toInsert) : [];
      res.json({ success: true, inserted: inserted.length, skipped, failed });
    } catch (err) {
      console.error("Error in POST /tcs/admin/aptitude/bulk:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
};

module.exports.cleanItem = cleanItem; // exported only so it can be tested