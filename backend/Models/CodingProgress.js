const mongoose = require("mongoose");

const codingProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      index: true,
    },

    language: {
      type: String,
      enum: ["python", "cpp", "java"],
      required: true,
    },

    code: {
      type: String,
      default: "",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    lastSubmittedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Same user + same question + same language = only one record
codingProgressSchema.index(
  {
    userId: 1,
    slug: 1,
    language: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "CodingProgress",
  codingProgressSchema
);