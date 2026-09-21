require("dotenv").config();
const mongoose = require("mongoose");

const CodingQuestion = require("../Models/CodingQuestion");
const { sampleCodingQuestions } = require("../Models/CodingQuestion");

const AptitudeQuestion = require("../Models/AptitudeQuestion");
const { sampleAptitudeQuestions } = require("../Models/AptitudeQuestion");

const CsHrQuestion = require("../Models/CsHrQuestion");
const { sampleCsHrQuestions } = require("../Models/CsHrQuestion");

/*
  Yeh script ek hi baar chalani hai, jab database khaali ho ya naye
  sample questions daalne ho. Chalane ka tareeka (backend folder ke andar se):

      node scripts/seedTcsQuestions.js

  Ismein .env se MONGO_URI uthaya jaata hai, isliye .env backend
  ke root mein hona zaroori hai (jahan se yeh command chalayenge).

  Yeh script sirf INSERT karta hai — agar dobara chalaoge to duplicate
  ho sakte hain (kyunki koi unique check nahi hai coding ke slug ke alawa).
  Coding questions "slug" field ki wajah se duplicate nahi honge
  (upsert use kiya hai), lekin Aptitude/CsHr questions har baar
  duplicate ho jayenge agar dobara chalaya — isliye dobara chalane se
  pehle ya to DB se purane hata do, ya neeche wala clearFirst flag on karo.
*/

const CLEAR_FIRST = false; // true karoge to purane TCS-prep questions delete ho jayenge phir se insert hone se pehle

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    if (CLEAR_FIRST) {
      await AptitudeQuestion.deleteMany({});
      await CsHrQuestion.deleteMany({});
      await CodingQuestion.deleteMany({});
      console.log("Cleared old TCS-prep questions");
    }

    // Coding questions: slug ke basis par upsert, taaki dobara chalane par duplicate na banein
    for (const q of sampleCodingQuestions) {
      await CodingQuestion.updateOne({ slug: q.slug }, { $set: q }, { upsert: true });
    }
    console.log(`Coding questions upserted: ${sampleCodingQuestions.length}`);

    // Aptitude aur CsHr mein unique field jaisa kuch nahi hai abhi,
    // isliye insertMany use kar rahe hain. Agar CLEAR_FIRST false hai
    // aur pehle se data hai, to yeh dobara insert ho jayenge.
    const aptitudeCount = await AptitudeQuestion.countDocuments();
    if (aptitudeCount === 0) {
      await AptitudeQuestion.insertMany(sampleAptitudeQuestions);
      console.log(`Aptitude questions inserted: ${sampleAptitudeQuestions.length}`);
    } else {
      console.log(`Aptitude questions already exist (${aptitudeCount}), skipping insert. Set CLEAR_FIRST=true to reseed.`);
    }

    const csHrCount = await CsHrQuestion.countDocuments();
    if (csHrCount === 0) {
      await CsHrQuestion.insertMany(sampleCsHrQuestions);
      console.log(`CS+HR+GenAI questions inserted: ${sampleCsHrQuestions.length}`);
    } else {
      console.log(`CS+HR+GenAI questions already exist (${csHrCount}), skipping insert. Set CLEAR_FIRST=true to reseed.`);
    }

    console.log("Seeding done.");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();