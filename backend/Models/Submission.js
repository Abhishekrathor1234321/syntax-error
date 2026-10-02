const mongoose = require("mongoose");

/*
  Har "Submit" ka record yaha store hoga.
  - verdict: "AC" (Accepted) | "WA" (Wrong Answer) | "TLE" | "CE" (Compile Error) | "RE" (Runtime Error)
  - isFirstAC: true jab user pehli baar us question ko AC kare — isi se leaderboard points decide honge
    (dobara submit karne pe points dobara nahi milenge, warna user spam karke points farm kar lega)
*/
const submissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "CodingQuestion", required: true },
    language: { type: String, enum: ["java", "python", "cpp"], required: true },
    code: { type: String, required: true },
    verdict: {
      type: String,
      enum: ["AC", "WA", "TLE", "CE", "RE"],
      required: true,
    },
    passedTestCases: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
    isFirstAC: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ek user ke ek question ke saare submissions jaldi fetch karne ke liye
submissionSchema.index({ userId: 1, questionId: 1 });

module.exports = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);