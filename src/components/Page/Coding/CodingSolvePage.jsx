import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";

import TcsHeader from "../TcsPrep/TcsHeader";

import {
  getQuestion,
  runCode,
  submitCode,
  getQuestionProgress,
  saveCodingProgress,
  completeCodingQuestion,
  getSavedCode,
  saveCode,
  markQuestionCompleted,
} from "../../../api/codingApi";

import "./CodingSolvePage.css";

const LANGUAGES = [
  { value: "python", label: "Python", monaco: "python" },
  { value: "cpp", label: "C++", monaco: "cpp" },
  { value: "java", label: "Java", monaco: "java" },
];

const STARTER_CODE = {
  python:
    "# Write your code here\n",

  cpp:
    "#include <bits/stdc++.h>\n" +
    "using namespace std;\n\n" +
    "int main() {\n\n" +
    "    // Write your code here\n\n" +
    "    return 0;\n" +
    "}\n",

  java:
    "import java.util.*;\n\n" +
    "public class Main {\n" +
    "    public static void main(String[] args) {\n\n" +
    "        // Write your code here\n\n" +
    "    }\n" +
    "}\n",
};
const isOldStarterCode = (code) => {
  if (!code) return true;

  const normalized = code
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ");

  // Old Python starter
  if (normalized === "# apna solution yaha likho") {
    return true;
  }

  // Old Python/Java generic starter
  if (normalized === "# Write your code here") {
    return true;
  }

  // Old C++ starter
  if (
    normalized.includes("#include <bits/stdc++.h>") &&
    normalized.includes("using namespace std;") &&
    normalized.includes("int main()") &&
    normalized.includes("// apna solution yaha likho") &&
    normalized.includes("return 0;")
  ) {
    return true;
  }

  // Old Java starter
  if (
    normalized.includes("import java.util.*;") &&
    normalized.includes("public class Main") &&
    normalized.includes("public static void main") &&
    normalized.includes("// apna solution yaha likho")
  ) {
    return true;
  }

  return false;
};
function CodingSolvePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);

  const [language, setLanguage] = useState("python");

  const [code, setCode] = useState(
    STARTER_CODE.python
  );

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] = useState(null);

  const [notFound, setNotFound] = useState(false);

  // MongoDB se progress load hone tak auto-save mat karo
  const [progressLoaded, setProgressLoaded] = useState(false);

  const switchingLanguageRef = useRef(false);

  /*
    Question + MongoDB progress load
  */
  useEffect(() => {
    let cancelled = false;
async function loadQuestionAndProgress() {
  setProgressLoaded(false);

  try {
    const questionData = await getQuestion(slug);

    if (!questionData.success) {
      setNotFound(true);
      return;
    }

    if (cancelled) return;

    setQuestion(questionData.question);

    /*
      Login hai to MongoDB progress load karo
    */
    let progressData = null;

    if (localStorage.getItem("token")) {
      try {
        progressData = await getQuestionProgress(slug);
      } catch (error) {
        console.error(
          "Failed to load coding progress:",
          error
        );
      }
    }

    if (cancelled) return;

    const progressList =
      progressData?.success &&
      Array.isArray(progressData.progress)
        ? progressData.progress
        : [];

    /*
      Previously selected language
    */
    const savedLanguage = localStorage.getItem(
      `coding_language_${slug}`
    );

    /*
      Agar language already saved hai
      to wahi use karo.

      Otherwise MongoDB me jis language ka
      saved code hai usko prefer karo.
    */
    let initialLanguage = "python";

    if (
      savedLanguage &&
      LANGUAGES.some(
        (l) => l.value === savedLanguage
      )
    ) {
      initialLanguage = savedLanguage;
    } else if (progressList.length > 0) {
      const latestProgress = [...progressList].sort(
        (a, b) =>
          new Date(b.updatedAt || 0) -
          new Date(a.updatedAt || 0)
      )[0];

      if (
        latestProgress?.language &&
        LANGUAGES.some(
          (l) => l.value === latestProgress.language
        )
      ) {
        initialLanguage = latestProgress.language;
      }
    }

    setLanguage(initialLanguage);

    localStorage.setItem(
      `coding_language_${slug}`,
      initialLanguage
    );

    /*
      MongoDB se selected language ka code
    */
    const mongoProgress = progressList.find(
      (item) => item.language === initialLanguage
    );

    /*
      1. MongoDB ka actual saved code hai
         → wahi load karo

      2. MongoDB me sirf old starter code hai
         → new starter code load karo

      3. MongoDB me code nahi hai
         → LocalStorage check karo

      4. LocalStorage me bhi old starter hai
         → new starter code load karo

      5. Kuch bhi nahi hai
         → new starter code load karo
    */
    if (
      mongoProgress &&
      typeof mongoProgress.code === "string" &&
      !isOldStarterCode(mongoProgress.code)
    ) {
      setCode(mongoProgress.code);

      /*
        LocalStorage ko bhi sync kar do
      */
      saveCode(
        slug,
        initialLanguage,
        mongoProgress.code
      );
    } else {
      /*
        MongoDB me valid code nahi mila,
        ab LocalStorage check karo.
      */
      const localCode = getSavedCode(
        slug,
        initialLanguage
      );

      if (
        localCode !== null &&
        !isOldStarterCode(localCode)
      ) {
        setCode(localCode);
      } else {
        /*
          New language/question ke liye
          fresh starter code.
        */
        setCode(
          STARTER_CODE[initialLanguage]
        );
      }
    }

    setProgressLoaded(true);
  } catch (error) {
    console.error(
      "Failed to load question:",
      error
    );

    if (!cancelled) {
      setNotFound(true);
    }
  }
}
    loadQuestionAndProgress();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  /*
    AUTO SAVE

    User typing stop karega ->
    1 second ke baad MongoDB me save.
  */
  useEffect(() => {
    if (
        !question ||
        !progressLoaded ||
        switchingLanguageRef.current
    ) {
        return;
    }

    // LocalStorage save
    saveCode(
        slug,
        language,
        code
    );

    // Login nahi hai
    if (!localStorage.getItem("token")) {
        return;
    }

    const timer = setTimeout(async () => {
        // Language switch ke beech me save mat karo
        if (switchingLanguageRef.current) {
            return;
        }

        try {
            await saveCodingProgress(
                slug,
                language,
                code
            );

            console.log(
                "💾 Coding progress auto-saved:",
                language
            );
        } catch (error) {
            console.error(
                "❌ Failed to save coding progress:",
                error
            );
        }
    }, 1000);

    return () => {
        clearTimeout(timer);
    };
}, [
    code,
    language,
    slug,
    question,
    progressLoaded,
]);
  /*
    Language change
  */
 const handleLanguageChange = async (lang) => {
    // 🔒 Language switch ke time auto-save completely stop
    switchingLanguageRef.current = true;

    try {
        // Current language ka code save karo
        saveCode(
            slug,
            language,
            code
        );

        // Language change
        setLanguage(lang);

        localStorage.setItem(
            `coding_language_${slug}`,
            lang
        );

        let loadedCode = null;

        // MongoDB se selected language ka code
        if (localStorage.getItem("token")) {
            try {
                const data =
                    await getQuestionProgress(slug);

                if (
                    data.success &&
                    Array.isArray(data.progress)
                ) {
                    const progress =
                        data.progress.find(
                            (item) =>
                                item.language === lang
                        );

                    if (
                        progress &&
                        typeof progress.code === "string" &&
                        !isOldStarterCode(progress.code)
                    ) {
                        loadedCode = progress.code;
                    }
                }
            } catch (error) {
                console.error(
                    "Failed to load language progress:",
                    error
                );
            }
        }

        // MongoDB me code nahi mila
        if (loadedCode === null) {
            const localCode =
                getSavedCode(
                    slug,
                    lang
                );

            if (
                localCode !== null &&
                !isOldStarterCode(localCode)
            ) {
                loadedCode = localCode;
            }
        }

        // Final code set
        setCode(
            loadedCode !== null
                ? loadedCode
                : STARTER_CODE[lang]
        );

        setResult(null);

    } finally {
        // 🔓 Code set hone ke baad auto-save allow
        setTimeout(() => {
            switchingLanguageRef.current = false;
        }, 100);
    }
};

  /*
    RUN
  */
  const handleRun = async () => {
    setRunning(true);
    setResult(null);

    try {
      /*
        IMPORTANT:
        Run button -> runCode
        Submit button -> submitCode
      */
      const data = await runCode(
        slug,
        code,
        language
      );

      setResult({
        ...data,
        mode: "run",
      });
    } catch {
      setResult({
        success: false,
        message: "Run failed. Try again.",
        mode: "run",
      });
    } finally {
      setRunning(false);
    }
  };

  /*
    SUBMIT
  */
  const handleSubmit = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      const data = await submitCode(
        slug,
        code,
        language
      );

      /*
        Accepted hone par MongoDB me
        completed = true
      */
      if (
        data.success &&
        data.verdict === "AC"
      ) {
        try {
          await completeCodingQuestion(
            slug,
            language,
            code
          );

          /*
            LocalStorage fallback bhi update
          */
          markQuestionCompleted(slug);

          console.log(
            "✅ Question marked as completed"
          );
        } catch (progressError) {
          console.error(
            "❌ Failed to save completion:",
            progressError
          );
        }
      }

      setResult({
        ...data,
        mode: "submit",
      });
    } catch {
      setResult({
        success: false,
        message:
          "Submission failed. Try again.",
        mode: "submit",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /*
    Question not found
  */
  if (notFound) {
  return (
    <>
      <TcsHeader />

      <div className="solve-page solve-empty">
        <p>Question not found.</p>

        <button
          className="solve-btn"
          onClick={() =>
            navigate("/coding")
          }
        >
          ← Back to questions
        </button>

      </div>
    </>
  );
}

  /*
    Loading
  */
  if (!question) {
    return (
       <>
      <TcsHeader />
      <div className="solve-page solve-empty">
        Loading question...
      </div>

        </>

    );
  }

  return (
      <>
    <TcsHeader />
    <div className="solve-page">

      {/* LEFT — QUESTION */}
      <div className="solve-left">

        <button
          className="solve-back"
          onClick={() =>
            navigate("/coding")
          }
        >
          ← Back
        </button>

        <div className="solve-title-row">
          <h1>{question.title}</h1>

          <span
            className={`solve-diff-tag diff-${question.difficulty}`}
          >
            {question.difficulty}
          </span>
        </div>

        <div className="solve-meta">
          <span>{question.topic}</span>
          <span>·</span>
          <span>
            {question.points} pts
          </span>
        </div>

        <p className="solve-description">
          {question.description}
        </p>

        {question.inputFormat && (
          <>
            <h3>Input Format</h3>

            <p className="solve-description">
              {question.inputFormat}
            </p>
          </>
        )}

        {question.outputFormat && (
          <>
            <h3>Output Format</h3>

            <p className="solve-description">
              {question.outputFormat}
            </p>
          </>
        )}

        {question.constraints && (
          <>
            <h3>Constraints</h3>

            <p className="solve-description">
              {question.constraints}
            </p>
          </>
        )}
{/* EXAMPLES */}

{Array.isArray(question.samples) &&
  question.samples.length > 0 && (
    <>
      <h3>Examples</h3>

      {question.samples.map((sample, index) => (
        <div
          className="solve-sample"
          key={index}
          style={{ marginBottom: "20px" }}
        >
          <h4>Example {index + 1}</h4>

          <div>
            <span className="solve-sample-label">
              Input
            </span>

            <pre>{sample.input}</pre>
          </div>

          <div>
            <span className="solve-sample-label">
              Output
            </span>

            <pre>{sample.output}</pre>
          </div>

    {sample.explanation && (
    <div
        style={{
            marginTop: "14px",
            padding: "14px 16px",
            background: "#172033",
            borderLeft: "3px solid #22c55e",
            borderRadius: "8px",
        }}
    >
        <span
            className="solve-sample-label"
            style={{
                display: "block",
                color: "#22c55e",
                fontWeight: "600",
                marginBottom: "8px",
            }}
        >
            Explanation
        </span>

        <div
            style={{
                color: "#dbeafe",
                lineHeight: "1.7",
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
                background: "transparent",
            }}
        >
            {sample.explanation}
        </div>
    </div>
)}

        </div>
      ))}
    </>
  )}

        {question.hint && (
          <details className="solve-hint">
            <summary>
              Show hint
            </summary>

            <p>
              {question.hint}
            </p>
          </details>
        )}

      </div>


      {/* RIGHT — EDITOR */}
      <div className="solve-right">

        <div className="solve-editor-toolbar">

          <div className="solve-lang-tabs">

            {LANGUAGES.map((l) => (
              <button
                key={l.value}
                className={`solve-lang-tab ${
                  language === l.value
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleLanguageChange(
                    l.value
                  )
                }
              >
                {l.label}
              </button>
            ))}

          </div>

        </div>


        <div className="solve-editor-wrapper">
<Editor
  height="100%"
  width="100%"
  language={
    LANGUAGES.find(
      (l) => l.value === language
    ).monaco
  }
  value={code}
  onChange={(value) =>
    setCode(value ?? "")
  }
  theme="vs-dark"
  options={{
    fontSize: 14,

    minimap: {
      enabled: false,
    },

    scrollBeyondLastLine: false,

    automaticLayout: true,

    wordWrap: "off",

    padding: {
      top: 12,
      bottom: 12,
    },

    scrollbar: {
      vertical: "auto",
      horizontal: "auto",
    },

    lineNumbers: "on",

    renderLineHighlight: "line",

    smoothScrolling: true,
  }}
/>
        </div>


        <div className="solve-actions">

          <button
            className="solve-btn solve-btn-run"
            onClick={handleRun}
            disabled={
              running ||
              submitting
            }
          >
            {running
              ? "Running..."
              : "Run"}
          </button>

          <button
            className="solve-btn solve-btn-submit"
            onClick={handleSubmit}
            disabled={
              running ||
              submitting
            }
          >
            {submitting
              ? "Submitting..."
              : "Submit"}
          </button>

        </div>


        {result && (
          <div
            className={`solve-result ${
              result.verdict === "AC"
                ? "result-ac"
                : "result-fail"
            }`}
          >

            {result.success === false ? (
              <p>
                {result.message ||
                  "Something went wrong."}
              </p>
            ) : (
              <>
                <div className="solve-result-top">

                  <span className="solve-verdict">
                    {result.verdict === "AC"
                      ? "✅ Accepted"
                      : `❌ ${result.verdict}`}
                  </span>

                  <span className="solve-result-count">
                    {result.passed}/
                    {result.total} test cases
                    passed
                  </span>

                </div>

                {result.mode === "submit" &&
                  result.pointsEarned > 0 && (
                    <p className="solve-points-earned">
                      +{result.pointsEarned} points
                      earned 🎉
                    </p>
                  )}

                {result.errorOutput && (
                  <pre className="solve-error-output">
                    {result.errorOutput}
                  </pre>
                )}

              </>
            )}

          </div>
        )}

      </div>

    </div>
   </>
    
  );
}

export default CodingSolvePage;