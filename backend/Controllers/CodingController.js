const CodingQuestion = require("../Models/CodingQuestion");
const Submission = require("../Models/Submission");
const { evaluateSubmission } = require("../Services/testRunner");
const { generateTestCases } = require("../Services/testCaseGenerator");
const CodingProgress = require("../Models/CodingProgress");
const UserModel = require("../Models/User");
// ✅ Sidebar ke liye — topic + difficulty ke hisaab se question counts
exports.getTopics = async (req, res) => {
    try {
        const topics = await CodingQuestion.aggregate([
            {
                $group: {
                    _id: { topic: "$topic", difficulty: "$difficulty" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.topic": 1 } },
        ]);

        res.status(200).json({ success: true, topics });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Topic + difficulty se filter karke questions ki list (sirf list view ke liye — halka data)
exports.getQuestions = async (req, res) => {
    try {
        const { topic, difficulty } = req.query;
        const filter = {};
        if (topic) filter.topic = topic;
        if (difficulty) filter.difficulty = difficulty;

        const questions = await CodingQuestion.find(filter).select(
            "title slug topic difficulty points tags"
        );

        res.status(200).json({ success: true, questions });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Single question ki full detail (editor khulne pe) — hidden test cases ka answer client ko nahi jayega
// ✅ Single question ki full detail
exports.getQuestionBySlug = async (req, res) => {
    console.log("🔥 getQuestionBySlug HIT");

    try {
        console.log("🔎 Slug:", req.params.slug);

        const question = await CodingQuestion.findOne({
            slug: req.params.slug,
        });

        console.log("📦 Question found:", !!question);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        // Sirf non-hidden test cases frontend ko dikhao
        const visibleTestCases = question.testCases.filter(
            (tc) => !tc.isHidden
        );

        // New samples[] → old sampleInput → visible test cases
        const examples =
            Array.isArray(question.samples) &&
            question.samples.length > 0
                ? question.samples
                : question.sampleInput
                    ? [
                        {
                            input: question.sampleInput,
                            output: question.sampleOutput || "",
                            explanation: "",
                        },
                    ]
                    : visibleTestCases.map((tc) => ({
                        input: tc.input,
                        output: tc.expectedOutput,
                        explanation: "",
                    }));

                    console.log("⭐ DB SAMPLES:", question.samples);
console.log("⭐ DB SAMPLE INPUT:", question.sampleInput);
console.log("⭐ FINAL EXAMPLES:", examples);

        res.status(200).json({
            success: true,
            question: {
                _id: question._id,
                title: question.title,
                slug: question.slug,
                topic: question.topic,
                difficulty: question.difficulty,
                points: question.points,
                tags: question.tags,

                description: question.description,
                inputFormat: question.inputFormat,
                outputFormat: question.outputFormat,
                constraints: question.constraints,

                // ⭐ IMPORTANT
                samples: examples,

                hint: question.hint,

                // Existing visible test cases
                sampleTestCases: visibleTestCases,
            },
        });
    } catch (err) {
        console.error("❌ Get coding question error:", err);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// ✅ "Show Answer" — reference solution dikhane ke liye alag route (taaki normal fetch me leak na ho)
exports.getSolution = async (req, res) => {
    try {
        const question = await CodingQuestion.findOne({ slug: req.params.slug }).select("solution");
        if (!question) {
            return res.status(404).json({ success: false, message: "Question not found" });
        }
        res.status(200).json({ success: true, solution: question.solution });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ "Run" button — sirf sample (non-hidden) test cases pe chalega, turant output dikhane ke liye
exports.runCode = async (req, res) => {
    try {
        const { slug } = req.params;
        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({ success: false, message: "code aur language dono chahiye" });
        }

        const question = await CodingQuestion.findOne({ slug });
        if (!question) {
            return res.status(404).json({ success: false, message: "Question not found" });
        }

        const sampleTestCases = question.testCases.filter((tc) => !tc.isHidden);
        const result = await evaluateSubmission({
            code,
            language,
            testCases: sampleTestCases,
            stopOnFirstFail: false, // Run me sab sample tests ka result dikhana hai
        });

        res.status(200).json({ success: true, ...result });
    } catch (err) {
        res.status(500).json({ success: false, message: "Code execution failed. Judge0 check karo." });
    }
};

// ✅ "Submit" button — sample + hidden dono test cases pe chalega, verdict + points decide karega
exports.submitCode = async (req, res) => {
    try {
        const { slug } = req.params;
        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({ success: false, message: "code aur language dono chahiye" });
        }

        const question = await CodingQuestion.findOne({ slug });
        if (!question) {
            return res.status(404).json({ success: false, message: "Question not found" });
        }

      console.log("🚀 Submit controller reached");
console.log("📝 Language:", language);
console.log("🧪 Total test cases:", question.testCases.length);
console.log("▶️ Starting evaluateSubmission...");

const result = await evaluateSubmission({
    code,
    language,
    testCases: question.testCases,
    stopOnFirstFail: true,
});

console.log("✅ evaluateSubmission completed");
console.log("📊 Result:", result);

        // pata karo yeh user ka is question pe pehla AC hai ya nahi (points sirf pehli baar milenge)
        let isFirstAC = false;
        if (result.verdict === "AC") {
            const alreadyAC = await Submission.exists({
                userId: req.user._id,
                questionId: question._id,
                verdict: "AC",
            });
            isFirstAC = !alreadyAC;
        }

        await Submission.create({
            userId: req.user._id,
            questionId: question._id,
            language,
            code,
            verdict: result.verdict,
            passedTestCases: result.passed,
            totalTestCases: result.total,
            isFirstAC,
        });


        // Coding leaderboard points update
if (isFirstAC) {
    const user = await UserModel.findById(req.user._id);

    if (user) {
        if (!user.tcsPrep) user.tcsPrep = {};

        user.tcsPrep.codingSolved = user.tcsPrep.codingSolved || [];

        const alreadyCounted = user.tcsPrep.codingSolved.some(
            (id) => id.toString() === question._id.toString()
        );

        if (!alreadyCounted) {
            user.tcsPrep.codingSolved.push(question._id);

            const points = question.points || 10;

            user.tcsPrep.codingPoints =
                (user.tcsPrep.codingPoints || 0) + points;

            user.tcsPrep.points =
                (user.tcsPrep.points || 0) + points;

            await user.save();

            console.log(
                `🏆 Coding points added: ${points} | User: ${req.user._id}`
            );
        }
    }
}

        res.status(200).json({
            success: true,
            verdict: result.verdict,
            passed: result.passed,
            total: result.total,
            pointsEarned: isFirstAC ? question.points : 0,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Submission failed. Judge0 check karo." });
    }
};

// ✅ Coding leaderboard — total points (sirf first-AC wale) ke hisaab se
exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Submission.aggregate([
            { $match: { isFirstAC: true } },
            {
                $lookup: {
                    from: "codingquestions",
                    localField: "questionId",
                    foreignField: "_id",
                    as: "question",
                },
            },
            { $unwind: "$question" },
            {
                $group: {
                    _id: "$userId",
                    totalPoints: { $sum: "$question.points" },
                    solvedCount: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 0,
                    name: "$user.name",
                    totalPoints: 1,
                    solvedCount: 1,
                },
            },
            { $sort: { totalPoints: -1 } },
            { $limit: 50 },
        ]);

        res.status(200).json({ success: true, leaderboard });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// ✅ Automatically generate hidden test cases for a coding question
// Automatically generate hidden test cases for a coding question
exports.generateTestCases = async (req, res) => {
    try {
        console.log("1️⃣ Generate tests request received");

        const { slug } = req.params;

        // Default = 20 test cases
        // Maximum = 100
        const count = Math.min(
            Math.max(Number(req.body?.count) || 20, 1),
            100
        );

        console.log("2️⃣ Slug:", slug, "Count:", count);

        const question = await CodingQuestion.findOne({ slug });

        console.log("3️⃣ Question found:", !!question);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        // Generate test cases according to question type
       const existingInputs = question.testCases.map(
    (testCase) => testCase.input
);

const generatedTestCases = await generateTestCases(
    slug,
    count,
    existingInputs,
    question
);

        console.log(
            "4️⃣ Test cases generated:",
            generatedTestCases.length
        );

        // Existing test cases ko delete nahi karna
        question.testCases.push(...generatedTestCases);

        await question.save();

        console.log("5️⃣ Question saved successfully");

        res.status(200).json({
            success: true,
            message: `${generatedTestCases.length} test cases generated successfully.`,
            slug,
            generated: generatedTestCases.length,
            totalTestCases: question.testCases.length,
        });
    } catch (err) {
        console.error("❌ Test case generation error:", err);

        res.status(500).json({
            success: false,
            message: err.message || "Failed to generate test cases.",
        });
    }
};


// TEMPORARY: Reset Two Sum test cases
// Original 3 test cases ko preserve karega
exports.resetTwoSumTestCases = async (req, res) => {
    try {
        console.log("🔄 Reset Two Sum request received");

        console.log("🔎 Searching Two Sum question...");

        const question = await CodingQuestion.findOne({
            slug: "two-sum",
        });

        console.log("📌 Question found:", !!question);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Two Sum question not found",
            });
        }

        console.log(
            "📦 Current test cases:",
            question.testCases?.length
        );

        // Original 3 test cases preserve karo
        // Generated hidden test cases remove ho jayenge
        question.testCases = question.testCases.slice(0, 3);

        console.log(
            "✂️ After reset:",
            question.testCases.length
        );

        await question.save();

        console.log("✅ Two Sum question saved successfully");

        return res.status(200).json({
            success: true,
            message: "Two Sum test cases reset successfully.",
            totalTestCases: question.testCases.length,
        });

    } catch (err) {
        console.error("❌ Two Sum reset error:", err);

        return res.status(500).json({
            success: false,
            message: err.message || "Failed to reset Two Sum test cases.",
        });
    }
};



// -----------------------------------------
// CODING PROGRESS
// -----------------------------------------

function getUserId(req) {
    return String(
        req.user?.id ||
        req.user?._id ||
        req.user?.userId ||
        req.user?.email ||
        ""
    );
}


// Get all progress of logged-in user
exports.getCodingProgress = async (req, res) => {
    try {
        console.log("📥 getCodingProgress reached");

        const userId = getUserId(req);

        console.log("👤 User ID:", userId);

        if (!userId) {
            console.log("❌ User ID not found");

            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        console.log("🔎 Finding coding progress...");

        const progress = await CodingProgress.find({
            userId,
        }).lean();

        console.log(
            "✅ Coding progress found:",
            progress.length
        );

        console.log(
            "📊 Progress data:",
            progress
        );

        return res.status(200).json({
            success: true,
            progress,
        });

    } catch (err) {
        console.error(
            "❌ Get coding progress error:",
            err
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load coding progress",
            error: err.message,
        });
    }
};


// Get progress of one question
exports.getQuestionProgress = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { slug } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const progress = await CodingProgress.find({
            userId,
            slug,
        }).lean();

        res.status(200).json({
            success: true,
            progress,
        });
    } catch (err) {
        console.error("Get question progress error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to load question progress",
        });
    }
};


// Save code
exports.saveCodingProgress = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { slug } = req.params;

        const {
            language,
            code,
        } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        if (!language) {
            return res.status(400).json({
                success: false,
                message: "Language is required",
            });
        }

        const progress =
            await CodingProgress.findOneAndUpdate(
                {
                    userId,
                    slug,
                    language,
                },
                {
                    $set: {
                        code: code || "",
                    },
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                }
            );

        res.status(200).json({
            success: true,
            progress,
        });
    } catch (err) {
        console.error("Save coding progress error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to save code",
        });
    }
};


// Mark question completed
exports.completeCodingQuestion = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { slug } = req.params;

        const {
            language,
            code,
        } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        if (!language) {
            return res.status(400).json({
                success: false,
                message: "Language is required",
            });
        }

        const progress =
            await CodingProgress.findOneAndUpdate(
                {
                    userId,
                    slug,
                    language,
                },
                {
                    $set: {
                        code: code || "",
                        completed: true,
                        lastSubmittedAt: new Date(),
                    },
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                }
            );

        res.status(200).json({
            success: true,
            message: "Question marked as completed",
            progress,
        });
    } catch (err) {
        console.error("Complete coding question error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to mark question completed",
        });
    }
};



// =====================================================
// ADMIN CODING QUESTION CRUD
// =====================================================

// GET all coding questions for admin
exports.getAdminQuestions = async (req, res) => {
      console.log("🚀 getAdminQuestions reached");
    try {
        const questions = await CodingQuestion.find({})
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            questions,
        });
    } catch (err) {
        console.error("❌ Admin coding questions fetch error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to load coding questions",
        });
    }
};


// GET single coding question for admin
exports.getAdminQuestionById = async (req, res) => {
    try {
        const question = await CodingQuestion.findById(req.params.id).lean();

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Coding question not found",
            });
        }

        return res.status(200).json({
            success: true,
            question,
        });
    } catch (err) {
        console.error("❌ Admin coding question fetch error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to load coding question",
        });
    }
};


// CREATE coding question
exports.createAdminQuestion = async (req, res) => {
    try {
        const {
            title,
            slug,
            topic,
            difficulty,
            points,
            tags,
            description,
            inputFormat,
            outputFormat,
            constraints,
             samples,
            hint,
            solution,
            testCases,
        } = req.body;

        if (!title || !slug || !topic || !description) {
            return res.status(400).json({
                success: false,
                message: "Title, slug, topic and description are required",
            });
        }

        if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one test case is required",
            });
        }

        const existingQuestion = await CodingQuestion.findOne({ slug });

        if (existingQuestion) {
            return res.status(400).json({
                success: false,
                message: "A question with this slug already exists",
            });
        }

        const question = await CodingQuestion.create({
            title: title.trim(),
            slug: slug.trim(),
            topic: topic.trim(),
            difficulty: difficulty || "easy",
            points: Number(points) || 10,
            tags: Array.isArray(tags) ? tags : [],
            description,
            inputFormat,
            outputFormat,
            constraints,
           samples,
            hint,
            solution,
            testCases,
        });

        return res.status(201).json({
            success: true,
            message: "Coding question created successfully",
            question,
        });
    } catch (err) {
        console.error("❌ Create coding question error:", err);

        return res.status(500).json({
            success: false,
            message: err.message || "Failed to create coding question",
        });
    }
};


// BULK CREATE coding questions
exports.bulkCreateAdminQuestions = async (req, res) => {
    try {
        const { questions } = req.body;

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Questions array is required",
            });
        }

        const insertedQuestions = [];
        const skippedQuestions = [];

        for (const questionData of questions) {
            if (
                !questionData.title ||
                !questionData.slug ||
                !questionData.topic ||
                !questionData.description
            ) {
                skippedQuestions.push({
                    slug: questionData.slug || "",
                    reason: "Required fields missing",
                });

                continue;
            }

            const exists = await CodingQuestion.findOne({
                slug: questionData.slug,
            });

            if (exists) {
                skippedQuestions.push({
                    slug: questionData.slug,
                    reason: "Slug already exists",
                });

                continue;
            }

            const question = await CodingQuestion.create({
                ...questionData,
                points: Number(questionData.points) || 10,
                difficulty: questionData.difficulty || "easy",
                tags: Array.isArray(questionData.tags)
                    ? questionData.tags
                    : [],
            });

            insertedQuestions.push(question);
        }

        return res.status(201).json({
            success: true,
            message: `${insertedQuestions.length} questions imported successfully`,
            inserted: insertedQuestions.length,
            skipped: skippedQuestions.length,
            questions: insertedQuestions,
            skippedQuestions,
        });
    } catch (err) {
        console.error("❌ Bulk coding import error:", err);

        return res.status(500).json({
            success: false,
            message: err.message || "Failed to import coding questions",
        });
    }
};


// UPDATE coding question
exports.updateAdminQuestion = async (req, res) => {
    try {
        const question = await CodingQuestion.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Coding question not found",
            });
        }

        const {
            title,
            slug,
            topic,
            difficulty,
            points,
            tags,
            description,
            inputFormat,
            outputFormat,
            constraints,
           samples,
            hint,
            solution,
            testCases,
        } = req.body;

        // Slug duplicate check
        if (slug && slug !== question.slug) {
            const slugExists = await CodingQuestion.findOne({
                slug,
                _id: { $ne: question._id },
            });

            if (slugExists) {
                return res.status(400).json({
                    success: false,
                    message: "Another question already uses this slug",
                });
            }
        }

        if (title !== undefined) question.title = title.trim();
        if (slug !== undefined) question.slug = slug.trim();
        if (topic !== undefined) question.topic = topic.trim();
        if (difficulty !== undefined) question.difficulty = difficulty;
        if (points !== undefined) question.points = Number(points) || 10;
        if (tags !== undefined) {
            question.tags = Array.isArray(tags) ? tags : [];
        }

        if (description !== undefined) question.description = description;
        if (inputFormat !== undefined) question.inputFormat = inputFormat;
        if (outputFormat !== undefined) question.outputFormat = outputFormat;
      if (constraints !== undefined) {
    question.constraints = constraints;
}

console.log("🔥 UPDATE BODY SAMPLES:", samples);
console.log("🔥 UPDATE BODY SAMPLE LENGTH:", samples?.length);

if (samples !== undefined) {
    question.samples = Array.isArray(samples)
        ? samples
        : [];
}

console.log(
    "🔥 QUESTION SAMPLES BEFORE SAVE:",
    question.samples
);

if (hint !== undefined) question.hint = hint;
if (solution !== undefined) question.solution = solution;
if (testCases !== undefined) question.testCases = testCases;

await question.save();

console.log(
    "🔥 SAVED SAMPLES:",
    question.samples
);
    
      

        return res.status(200).json({
            success: true,
            message: "Coding question updated successfully",
            question,
        });
    } catch (err) {
        console.error("❌ Update coding question error:", err);

        return res.status(500).json({
            success: false,
            message: err.message || "Failed to update coding question",
        });
    }
};


// DELETE coding question
exports.deleteAdminQuestion = async (req, res) => {
    try {
        const question = await CodingQuestion.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Coding question not found",
            });
        }

        await CodingQuestion.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Coding question deleted successfully",
        });
    } catch (err) {
        console.error("❌ Delete coding question error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to delete coding question",
        });
    }
};