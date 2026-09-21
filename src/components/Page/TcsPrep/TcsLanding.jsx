import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Content yahin se badlo. Salary / pattern har saal badal sakta hai.  */
/* ------------------------------------------------------------------ */

const glance = [
  { k: "Total time", v: "About 190 minutes" },
  { k: "Part A, Foundation", v: "75 minutes" },
  { k: "Part B, Advanced", v: "115 minutes" },
  { k: "Negative marking", v: "None" },
  { k: "Mode", v: "Online, on TCS iON" },
];

const roles = [
  {
    name: "TCS Ninja",
    tone: "ninja",
    pkg: "₹3.36 to 3.6 LPA",
    who: "The main entry-level software role, and the most common way into TCS.",
    need: "Clear the Foundation section. Your aptitude and reasoning score decides this role.",
  },
  {
    name: "TCS Digital",
    tone: "digital",
    pkg: "₹7 to 7.3 LPA",
    who: "For students with strong programming and CS basics. Works on newer technology projects.",
    need: "Strong scores in both Foundation and Advanced, with at least some coding problems solved.",
  },
  {
    name: "TCS Prime",
    tone: "prime",
    pkg: "₹9 to 11.5 LPA",
    who: "The highest fresher band, meant for the top performers.",
    need: "Top scores in Advanced, including strong coding. The competition here is the toughest.",
  },
];

const partA = [
  { s: "Numerical Ability", q: "20", t: "25 min" },
  { s: "Verbal Ability", q: "25", t: "25 min" },
  { s: "Reasoning Ability", q: "20", t: "25 min" },
];
const partB = [
  { s: "Advanced Quantitative and Reasoning", q: "About 15", t: "25 min" },
  { s: "Advanced Coding", q: "2 to 3 programs", t: "90 min" },
];

const aptitudeTopics = ["Percentage", "Profit & Loss", "Time & Work", "Ratio", "Number System", "Probability", "Logical Reasoning", "Verbal Ability"];
const csTopics = ["DBMS", "OOPs", "Operating Systems", "Computer Networks", "SQL", "Data Structures", "Gen AI", "HR questions"];

const board = [
  { r: 1, u: "aarav_codes", s: 41, p: 690 },
  { r: 2, u: "neha.dev", s: 38, p: 655 },
  { r: 3, u: "rohan_07", s: 36, p: 610 },
  { r: 247, u: "your_username", s: 12, p: 180, me: true },
];

function PaperTable({ rows, label }) {
  return (
    <table className="paper-table">
      <caption className="sr-only">{label}</caption>
      <thead>
        <tr>
          <th scope="col">Section</th>
          <th scope="col">Questions</th>
          <th scope="col">Time</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.s}>
            <th scope="row">{r.s}</th>
            <td>{r.q}</td>
            <td>{r.t}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function TcsLanding() {
  return (
    <main>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="tcs-wrap hero-grid">
          <div className="hero-copy">
            <h1>TCS NQT preparation, completely free.</h1>
            <p className="lead">
              Practice coding, aptitude, CS fundamentals, HR and Gen AI questions in one place. Your code is graded instantly on hidden test cases, in Java, Python or C++.
            </p>
            <div className="hero-actions">
              <Link to="/tcs-prep/start" className="btn btn-primary">
                Start practicing
              </Link>
            </div>
            <p className="fine">Free for every student. Log in with your SYNTAX ERROR account to save your progress.</p>
          </div>

          <aside className="glance" aria-label="TCS NQT at a glance">
            <h2>TCS NQT at a glance</h2>
            <dl>
              {glance.map((g) => (
                <div className="glance-row" key={g.k}>
                  <dt>{g.k}</dt>
                  <dd>{g.v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* ---------- ABOUT NQT ---------- */}
      <section className="block block-tint">
        <div className="tcs-wrap about-grid">
          <div>
            <h2>What is the TCS NQT?</h2>
          </div>
          <div className="about-text">
            <p>
              The TCS National Qualifier Test (NQT) is the online test TCS uses to hire freshers. You take one test, and how you score decides which role you are considered for: Ninja, Digital or Prime.
            </p>
            <p>
              The test is taken on the TCS iON platform. Students who do well are called for interviews, which usually include a technical round and an HR round. That is why this site has practice for aptitude, coding, CS fundamentals and HR questions.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- ROLES ---------- */}
      <section className="block">
        <div className="tcs-wrap">
          <div className="block-head">
            <h2>Three roles you can get through the NQT</h2>
            <p>The role depends on your score. A higher role means a higher package, and it needs a stronger Advanced section.</p>
          </div>
          <div className="roles">
            {roles.map((r) => (
              <article className={`role role-${r.tone}`} key={r.name}>
                <h3>{r.name}</h3>
                <p className="pkg">{r.pkg}</p>
                <p className="pkg-note">yearly package (CTC), approx.</p>
                <p>
                  <b>Who it is for.</b> {r.who}
                </p>
                <p>
                  <b>What you need.</b> {r.need}
                </p>
              </article>
            ))}
          </div>
          <p className="footnote">
            CTC is the yearly package before deductions, so your monthly in-hand pay is lower. Exact figures depend on your offer letter, education level and hiring year. Check the official TCS careers page before you plan around a number.
          </p>
        </div>
      </section>

      {/* ---------- PAPER FORMAT ---------- */}
      <section className="block block-tint">
        <div className="tcs-wrap">
          <div className="block-head">
            <h2>NQT paper format: two parts, about 190 minutes</h2>
            <p>The test has two parts. Every timed section has its own clock, so time you save in one section does not carry over to the next.</p>
          </div>

          <div className="paper-grid">
            <article className="paper">
              <div className="paper-head">
                <div>
                  <h3>Part A: Foundation</h3>
                  <p>Compulsory for every candidate. This is what decides the Ninja role.</p>
                </div>
                <span className="paper-time">75 min</span>
              </div>
              <PaperTable rows={partA} label="Part A Foundation sections" />
              <p className="paper-total">65 multiple-choice questions in total.</p>
            </article>

            <article className="paper">
              <div className="paper-head">
                <div>
                  <h3>Part B: Advanced</h3>
                  <p>Needed for the Digital and Prime roles. It is harder than Part A.</p>
                </div>
                <span className="paper-time">115 min</span>
              </div>
              <PaperTable rows={partB} label="Part B Advanced sections" />
              <p className="paper-total">Aptitude questions are multiple choice. In coding, you write a complete program.</p>
            </article>
          </div>

          <ul className="tips">
            <li>
              <b>No negative marking.</b> A wrong answer costs the same as a blank one, so attempt every question.
            </li>
            <li>
              <b>Coding is a full program.</b> You read input, write the whole solution and it is checked against hidden test cases. You can use languages like C, C++, Java and Python.
            </li>
            <li>
              <b>Numbers can change.</b> Question counts and timings change slightly from one hiring drive to the next, and sources differ on the coding count. Confirm on the official TCS NQT page for your batch.
            </li>
          </ul>
        </div>
      </section>

      {/* ---------- PRACTICE SECTIONS ---------- */}
      <section className="block">
        <div className="tcs-wrap">
          <div className="block-head">
            <h2>Practice each part of the NQT here</h2>
            <p>Three free sections, each matched to a part of the test and the interviews after it.</p>
          </div>

          <div className="inside-grid">
            <article className="card card-coding">
              <h3>Coding</h3>
              <p className="helps">Helps with: Advanced Coding in Part B.</p>
              <p>
                Real problems with a built-in editor. Press Run to test with your own input, or Submit to be checked against hidden test cases. Every question has a hint and a full solution.
              </p>
              <div className="chips chips-lang" aria-label="Supported languages">
                <span>Java</span>
                <span>Python</span>
                <span>C++</span>
              </div>
              <ul className="levels">
                <li>
                  <b>Easy</b>
                  <span>Loops, strings, basic math</span>
                </li>
                <li>
                  <b>Medium</b>
                  <span>Arrays, stacks, searching</span>
                </li>
                <li>
                  <b>Hard</b>
                  <span>Dynamic programming, graphs</span>
                </li>
              </ul>
            </article>

            <article className="card">
              <h3>Aptitude</h3>
              <p className="helps">Helps with: Numerical, Verbal and Reasoning in Part A, and Advanced Quant in Part B.</p>
              <p>Multiple-choice practice with a hint and a step-by-step solution for every question.</p>
              <div className="chips">
                {aptitudeTopics.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </article>

            <article className="card">
              <h3>CS Fundamentals, HR and Gen AI</h3>
              <p className="helps">Helps with: the technical and HR interviews after the test.</p>
              <p>Concept questions for technical rounds, plus sample answers for the HR questions everyone gets asked.</p>
              <div className="chips">
                {csTopics.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ---------- POINTS + LEADERBOARD ---------- */}
      <section className="block block-tint">
        <div className="tcs-wrap compete-grid">
          <div>
            <h2>Earn points and climb the leaderboard</h2>
            <p className="prose">
              Coding points depend on difficulty. You earn them only when your code passes every hidden test case. Solving the same question again gives no extra points, so to climb, solve new problems.
            </p>
            <div className="scale" role="img" aria-label="Easy is 10 points, Medium is 20 points, Hard is 30 points">
              <div className="bar-col">
                <div className="bar bar-easy">10</div>
                <span>Easy</span>
              </div>
              <div className="bar-col">
                <div className="bar bar-med">20</div>
                <span>Medium</span>
              </div>
              <div className="bar-col">
                <div className="bar bar-hard">30</div>
                <span>Hard</span>
              </div>
            </div>
          </div>

          <div>
            <p className="prose prose-top">
              There are four leaderboards: Overall, Coding, Aptitude, and CS + HR + Gen AI. Your username is what everyone sees, and your own rank always shows, even outside the top 100.
            </p>
            <div className="lb" role="table" aria-label="Sample leaderboard">
              <div className="lb-row lb-head" role="row">
                <span role="columnheader">Rank</span>
                <span role="columnheader">User</span>
                <span role="columnheader">Solved</span>
                <span role="columnheader">Points</span>
              </div>
              {board.map((b) => (
                <div className={`lb-row ${b.me ? "lb-me" : ""}`} role="row" key={b.u}>
                  <span role="cell">#{b.r}</span>
                  <span role="cell">{b.u}</span>
                  <span role="cell">{b.s}</span>
                  <span role="cell">{b.p}</span>
                </div>
              ))}
              <p className="lb-note">Sample data. Real rankings start when students do.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section className="final">
        <div className="tcs-wrap final-in">
          <h2>Solve your first question today.</h2>
          <Link to="/tcs-prep/start" className="btn btn-light">
            Start practicing
          </Link>
        </div>
      </section>
    </main>
  );
}