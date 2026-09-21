const express = require("express");
const router = express.Router();

const CodingQuestion = require("../Models/CodingQuestion");
const AptitudeQuestion = require("../Models/AptitudeQuestion");
const CsHrQuestion = require("../Models/CsHrQuestion");
const ensureAuthenticated = require("../Middlewares/Auth");
const UserModel = require("../Models/User");

// Admin check — sirf yeh email hi questions add/delete kar sakta hai.
// Yeh AdminRoute (frontend, App.jsx) me use ho rahe email se match karta hai.
const ADMIN_EMAIL = "abhishekrathor7447@gmail.com";
function ensureAdmin(req, res, next) {
  if (req.user?.email !== ADMIN_EMAIL) {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
}

// GET /tcs/admin/aptitude -> saare aptitude questions, poora data (answer samet) — sirf admin ke liye
router.get("/admin/aptitude", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const questions = await AptitudeQuestion.find({}).sort({ createdAt: -1 });
    res.json({ success: true, questions });
  } catch (err) {
    console.error("Error in GET /tcs/admin/aptitude:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /tcs/admin/aptitude -> naya aptitude question add karna
router.post("/admin/aptitude", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const { topic, question, options, correctIndex, hint, solution, points } = req.body;
    if (!topic || !question || !options || options.length !== 4 || correctIndex === undefined || !solution) {
      return res.status(400).json({ success: false, message: "All required fields must be filled (topic, question, 4 options, correct answer, solution)" });
    }
    const newQuestion = new AptitudeQuestion({
      topic,
      question,
      options,
      correctIndex,
      hint,
      solution,
      points: points || 5,
    });
    await newQuestion.save();
    res.json({ success: true, question: newQuestion });
  } catch (err) {
    console.error("Error in POST /tcs/admin/aptitude:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE /tcs/admin/aptitude/:id -> ek aptitude question delete karna
router.delete("/admin/aptitude/:id", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    await AptitudeQuestion.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error in DELETE /tcs/admin/aptitude/:id:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------- CS + HR + GenAI admin routes ----------

router.get("/admin/cshr", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const questions = await CsHrQuestion.find({}).sort({ createdAt: -1 });
    res.json({ success: true, questions });
  } catch (err) {
    console.error("Error in GET /tcs/admin/cshr:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/admin/cshr", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const { category, question, options, correctIndex, hint, solution, points } = req.body;
    if (!category || !question || !options || options.length !== 4 || correctIndex === undefined || !solution) {
      return res.status(400).json({ success: false, message: "All required fields must be filled (category, question, 4 options, correct answer, solution)" });
    }
    const newQuestion = new CsHrQuestion({
      category,
      question,
      options,
      correctIndex,
      hint,
      solution,
      points: points || 5,
    });
    await newQuestion.save();
    res.json({ success: true, question: newQuestion });
  } catch (err) {
    console.error("Error in POST /tcs/admin/cshr:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/admin/cshr/:id", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    await CsHrQuestion.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error in DELETE /tcs/admin/cshr/:id:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------- Coding admin routes ----------

router.get("/admin/coding", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const questions = await CodingQuestion.find({}).sort({ createdAt: -1 });
    res.json({ success: true, questions });
  } catch (err) {
    console.error("Error in GET /tcs/admin/coding:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/admin/coding", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const {
      title, slug, description, difficulty, hint, explanation,
      inputFormat, constraints, points, testCases, solutionCode,
    } = req.body;

    if (!title || !slug || !description || !testCases || testCases.length === 0) {
      return res.status(400).json({ success: false, message: "Title, slug, description and at least one test case are required" });
    }

    const newQuestion = new CodingQuestion({
      title,
      slug,
      description,
      difficulty: difficulty || "easy",
      hint,
      explanation,
      inputFormat,
      constraints,
      points: points || 10,
      testCases,
      solution: solutionCode ? { code: solutionCode } : undefined,
    });
    await newQuestion.save();
    res.json({ success: true, question: newQuestion });
  } catch (err) {
    console.error("Error in POST /tcs/admin/coding:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/admin/coding/:id", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    await CodingQuestion.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error in DELETE /tcs/admin/coding/:id:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Piston (piston.rest) ek free public code-run service hai, isme kisi
// API key ki zaroorat nahi. Yahan bas humari app ki language names ko
// Piston ke language+version se map kar rahe hain.
const PISTON_LANG_MAP = {
  java: { language: "java", version: "15.0.2" },
  python: { language: "python", version: "3.10.0" },
  cpp: { language: "cpp", version: "10.2.0" },
};

async function runOnPiston(code, pistonLang, stdin) {
  const response = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: pistonLang.language,
      version: pistonLang.version,
      files: [{ content: code }],
      stdin: stdin || "",
    }),
  });
  const data = await response.json();
  if (data.run) {
    // stderr me compile/runtime errors aate hain, stdout me normal output
    return {
      output: data.run.stdout || "",
      error: data.run.stderr || data.compile?.stderr || "",
    };
  }
  throw new Error(data.message || "Code run nahi ho paya");
}

// GET /tcs/me  -> logged-in user ka naam aur tcsPrep info
router.get("/me", ensureAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User nahi mila" });
    }
    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        nameNeedsConfirm: !user.tcsPrep?.nameConfirmed,
        tcsPrep: user.tcsPrep,
      },
    });
  } catch (err) {
    console.error("Error in /tcs/me:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /tcs/name  -> naam confirm/update karna, sirf TCS section ke liye
router.put("/name", ensureAuthenticated, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Naam khaali nahi ho sakta" });
    }
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User nahi mila" });
    }
    user.name = name.trim();
    if (!user.tcsPrep) user.tcsPrep = {};
    user.tcsPrep.nameConfirmed = true;
    await user.save();
    res.json({ success: true, name: user.name });
  } catch (err) {
    console.error("Error in /tcs/name:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /tcs/coding  -> saare coding questions
router.get("/coding", async (req, res) => {
  try {
    const questions = await CodingQuestion.find({});
    res.json(questions);
  } catch (err) {
    console.error("Error fetching coding questions:", err);
    res.status(500).json({ message: "Coding questions laane me error aaya" });
  }
});

// GET /tcs/aptitude  -> saare aptitude questions
// Note: correctIndex aur solution yahan nahi bheje jaate (taaki koi Network
// tab me dekh ke jawab na jaan le). Hint hamesha visible rehta hai, solution
// sirf submit ke baad milta hai, /aptitude/:id/submit se.
router.get("/aptitude", async (req, res) => {
  try {
    const questions = await AptitudeQuestion.find({});
    const safeQuestions = questions.map((q) => {
      const obj = q.toObject();
      delete obj.correctIndex;
      delete obj.solution;
      return obj;
    });
    res.json(safeQuestions);
  } catch (err) {
    console.error("Error fetching aptitude questions:", err);
    res.status(500).json({ message: "Aptitude questions laane me error aaya" });
  }
});

// POST /tcs/aptitude/:id/submit -> student ka selected option check karo.
// Timeout hone par frontend selectedIndex: -1 bhejega, jo hamesha galat count hoga.
router.post("/aptitude/:id/submit", ensureAuthenticated, async (req, res) => {
  try {
    const { selectedIndex } = req.body;
    if (selectedIndex === undefined || selectedIndex === null) {
      return res.status(400).json({ success: false, message: "Ek option select karo" });
    }
    const question = await AptitudeQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question nahi mila" });
    }

    const isCorrect = Number(selectedIndex) === question.correctIndex;
    let pointsAwarded = 0;

    if (isCorrect) {
      const user = await UserModel.findById(req.user._id);
      if (!user.tcsPrep) user.tcsPrep = {};
      if (!user.tcsPrep.aptitudeSolved) user.tcsPrep.aptitudeSolved = [];
      const alreadySolved = user.tcsPrep.aptitudeSolved.some(
        (id) => id.toString() === question._id.toString()
      );
      if (!alreadySolved) {
        user.tcsPrep.aptitudeSolved.push(question._id);
        pointsAwarded = question.points || 5;
        user.tcsPrep.aptitudePoints = (user.tcsPrep.aptitudePoints || 0) + pointsAwarded;
        user.tcsPrep.points = (user.tcsPrep.points || 0) + pointsAwarded;
        await user.save();
      }
    }

    res.json({
      success: true,
      isCorrect,
      correctIndex: question.correctIndex,
      solution: question.solution,
      pointsAwarded,
    });
  } catch (err) {
    console.error("Error in /tcs/aptitude/:id/submit:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /tcs/cshr  -> saare CS + HR + GenAI questions
// Note: correctIndex aur solution yahan nahi bheje jaate. Hint hamesha
// visible rehta hai, solution sirf submit ke baad /cshr/:id/submit se.
router.get("/cshr", async (req, res) => {
  try {
    const questions = await CsHrQuestion.find({});
    const safeQuestions = questions.map((q) => {
      const obj = q.toObject();
      delete obj.correctIndex;
      delete obj.solution;
      return obj;
    });
    res.json(safeQuestions);
  } catch (err) {
    console.error("Error fetching CS/HR questions:", err);
    res.status(500).json({ message: "CS/HR questions laane me error aaya" });
  }
});

// POST /tcs/cshr/:id/submit -> student ka selected option check karo.
// Timeout hone par frontend selectedIndex: -1 bhejega, jo hamesha galat count hoga.
router.post("/cshr/:id/submit", ensureAuthenticated, async (req, res) => {
  try {
    const { selectedIndex } = req.body;
    if (selectedIndex === undefined || selectedIndex === null) {
      return res.status(400).json({ success: false, message: "Ek option select karo" });
    }
    const question = await CsHrQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question nahi mila" });
    }

    const isCorrect = Number(selectedIndex) === question.correctIndex;
    let pointsAwarded = 0;

    if (isCorrect) {
      const user = await UserModel.findById(req.user._id);
      if (!user.tcsPrep) user.tcsPrep = {};
      if (!user.tcsPrep.csHrSolved) user.tcsPrep.csHrSolved = [];
      const alreadySolved = user.tcsPrep.csHrSolved.some(
        (id) => id.toString() === question._id.toString()
      );
      if (!alreadySolved) {
        user.tcsPrep.csHrSolved.push(question._id);
        pointsAwarded = question.points || 5;
        user.tcsPrep.csHrPoints = (user.tcsPrep.csHrPoints || 0) + pointsAwarded;
        user.tcsPrep.points = (user.tcsPrep.points || 0) + pointsAwarded;
        await user.save();
      }
    }

    res.json({
      success: true,
      isCorrect,
      correctIndex: question.correctIndex,
      solution: question.solution,
      pointsAwarded,
    });
  } catch (err) {
    console.error("Error in /tcs/cshr/:id/submit:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /tcs/coding/:id -> ek specific coding question (hidden test cases ka
// input/output chhupa ke, solution bhi nahi bheja jaata)
router.get("/coding/:id", async (req, res) => {
  try {
    const q = await CodingQuestion.findById(req.params.id);
    if (!q) {
      return res.status(404).json({ success: false, message: "Question nahi mila" });
    }
    const safeQuestion = q.toObject();
    safeQuestion.testCases = (safeQuestion.testCases || []).map((tc) =>
      tc.isHidden ? { isHidden: true } : tc
    );
    delete safeQuestion.solution;
    res.json({ success: true, question: safeQuestion });
  } catch (err) {
    console.error("Error in GET /tcs/coding/:id:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /tcs/coding/:id/run -> sirf sample (non-hidden) test case pe check,
// koi points nahi milte, sirf apna code try karne ke liye
router.post("/coding/:id/run", ensureAuthenticated, async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({ success: false, message: "Code aur language dono chahiye" });
    }
    const pistonLang = PISTON_LANG_MAP[language];
    if (!pistonLang) {
      return res.status(400).json({ success: false, message: "Yeh language abhi supported nahi hai" });
    }
    const question = await CodingQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question nahi mila" });
    }
    const sample = question.testCases.find((tc) => !tc.isHidden) || question.testCases[0];
    const result = await runOnPiston(code, pistonLang, sample.input);
    res.json({
      success: true,
      input: sample.input,
      expectedOutput: sample.expectedOutput,
      actualOutput: result.output,
      error: result.error,
    });
  } catch (err) {
    console.error("Error in /tcs/coding/:id/run:", err);
    res.status(500).json({ success: false, message: "Code run karne me error aaya" });
  }
});

// POST /tcs/coding/:id/submit -> SAARE test cases pe check, sab pass ho to points milte hain
router.post("/coding/:id/submit", ensureAuthenticated, async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({ success: false, message: "Code aur language dono chahiye" });
    }
    const pistonLang = PISTON_LANG_MAP[language];
    if (!pistonLang) {
      return res.status(400).json({ success: false, message: "Yeh language abhi supported nahi hai" });
    }
    const question = await CodingQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question nahi mila" });
    }

    const results = [];
    for (const tc of question.testCases) {
      const result = await runOnPiston(code, pistonLang, tc.input);
      const passed = result.output.trim() === (tc.expectedOutput || "").trim();
      results.push({
        isHidden: !!tc.isHidden,
        input: tc.isHidden ? undefined : tc.input,
        expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
        actualOutput: tc.isHidden ? undefined : result.output,
        error: result.error || undefined,
        passed,
      });
    }

    const allPassed = results.length > 0 && results.every((r) => r.passed);
    let pointsAwarded = 0;

    if (allPassed) {
      const user = await UserModel.findById(req.user._id);
      if (!user.tcsPrep) user.tcsPrep = {};
      if (!user.tcsPrep.codingSolved) user.tcsPrep.codingSolved = [];
      const alreadySolved = user.tcsPrep.codingSolved.some(
        (id) => id.toString() === question._id.toString()
      );
      if (!alreadySolved) {
        user.tcsPrep.codingSolved.push(question._id);
        pointsAwarded = question.points || 10;
        user.tcsPrep.codingPoints = (user.tcsPrep.codingPoints || 0) + pointsAwarded;
        user.tcsPrep.points = (user.tcsPrep.points || 0) + pointsAwarded;
        await user.save();
      }
    }

    res.json({ success: true, allPassed, results, pointsAwarded });
  } catch (err) {
    console.error("Error in /tcs/coding/:id/submit:", err);
    res.status(500).json({ success: false, message: "Submit karne me error aaya" });
  }
});

// GET /tcs/my-stats -> logged-in user ke apne TCS Prep points + har category
// me apna rank (Dashboard ke andar wale per-topic view ke liye)
router.get("/my-stats", ensureAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User nahi mila" });
    }
    const tcsPrep = user.tcsPrep || {};

    const [codingAhead, aptitudeAhead, csHrAhead, overallAhead] = await Promise.all([
      UserModel.countDocuments({ "tcsPrep.codingPoints": { $gt: tcsPrep.codingPoints || 0 } }),
      UserModel.countDocuments({ "tcsPrep.aptitudePoints": { $gt: tcsPrep.aptitudePoints || 0 } }),
      UserModel.countDocuments({ "tcsPrep.csHrPoints": { $gt: tcsPrep.csHrPoints || 0 } }),
      UserModel.countDocuments({ "tcsPrep.points": { $gt: tcsPrep.points || 0 } }),
    ]);

    res.json({
      success: true,
      stats: {
        name: user.name,
        points: tcsPrep.points || 0,
        codingPoints: tcsPrep.codingPoints || 0,
        aptitudePoints: tcsPrep.aptitudePoints || 0,
        csHrPoints: tcsPrep.csHrPoints || 0,
        codingSolvedCount: (tcsPrep.codingSolved || []).length,
        aptitudeSolvedCount: (tcsPrep.aptitudeSolved || []).length,
        csHrSolvedCount: (tcsPrep.csHrSolved || []).length,
        overallRank: overallAhead + 1,
        codingRank: codingAhead + 1,
        aptitudeRank: aptitudeAhead + 1,
        csHrRank: csHrAhead + 1,
      },
    });
  } catch (err) {
    console.error("Error in /tcs/my-stats:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /tcs/leaderboard?category=overall|coding|aptitude|cshr
// PUBLIC leaderboard (login ki zaroorat nahi). Sirf naam aur points
// bheja jaata hai, koi private info nahi.
const LEADERBOARD_FIELDS = {
  overall: "tcsPrep.points",
  coding: "tcsPrep.codingPoints",
  aptitude: "tcsPrep.aptitudePoints",
  cshr: "tcsPrep.csHrPoints",
};

router.get("/leaderboard", async (req, res) => {
  try {
    const category = LEADERBOARD_FIELDS[req.query.category] ? req.query.category : "overall";
    const field = LEADERBOARD_FIELDS[category];

    const users = await UserModel.find({ [field]: { $gt: 0 } })
      .sort({ [field]: -1 })
      .limit(50)
      .select(`name ${field}`);

    const leaderboard = users.map((u, i) => {
      const obj = u.toObject();
      const points = field.split(".").reduce((o, k) => (o ? o[k] : undefined), obj) || 0;
      return { rank: i + 1, name: u.name, points };
    });

    res.json({ success: true, category, leaderboard });
  } catch (err) {
    console.error("Error in /tcs/leaderboard:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Aptitude sections (Quant / Reasoning / Verbal) + bulk import
require("./TcsAptitudeExtras")(router, { ensureAuthenticated, ensureAdmin });
require("./TcsCsHrExtras")(router, { ensureAuthenticated, ensureAdmin });  

module.exports = router;

