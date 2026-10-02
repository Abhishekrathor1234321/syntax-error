const {
  createExecutionContainer,
  runTestsInContainer,
  cleanupContainer,
} = require("./judge0Service");


function mapJudge0Status(statusDescription = "") {
  if (statusDescription === "Time Limit Exceeded") return "TLE";
  if (statusDescription === "Compilation Error") return "CE";
  if (statusDescription.startsWith("Runtime Error")) return "RE";
  if (statusDescription === "Accepted") return "AC";
  return "WA";
}


async function evaluateSubmission({
  code,
  language,
  testCases,
  stopOnFirstFail = true,
}) {
  let passed = 0;
  const results = [];

  let execution = null;

  try {
    console.log("🐳 Creating Docker container...");

    execution = await createExecutionContainer({
      code,
      language,
      memoryLimit: 128000,
    });

    /*
      Compilation error
    */
    if (execution.compileError) {
      console.log("❌ Compilation Error");

      return {
        verdict: "CE",
        passed: 0,
        total: testCases.length,
        results: [],
        errorOutput: execution.compileError,
      };
    }

    console.log("✅ Code compiled ONCE");

    /*
      🚀 ALL TEST CASES IN ONE DOCKER EXEC
    */
    const executionResults = await runTestsInContainer({
      containerName: execution.containerName,
      language,
      testCases,
      cpuTimeLimit: 2,
    });

    console.log(
      `⚡ Received ${executionResults.length}/${testCases.length} execution results`
    );

    /*
      Compare outputs in Node.js
    */
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];

      const judgeResult = executionResults[i];

      /*
        Safety check
      */
      if (!judgeResult) {
        return {
          verdict: "RE",
          passed,
          total: testCases.length,
          results,
          errorOutput: "Execution result missing",
        };
      }

      const statusDesc =
        judgeResult.status?.description || "Unknown Error";

      /*
        Runtime error / TLE
      */
      if (statusDesc !== "Accepted") {
        return {
          verdict: mapJudge0Status(statusDesc),
          passed,
          total: testCases.length,
          results,
          errorOutput:
            judgeResult.stderr ||
            statusDesc,
        };
      }

      const actualOutput =
        (judgeResult.stdout || "").trim();

      const expectedOutput =
        (tc.expectedOutput || "").trim();

      const isPass =
        actualOutput === expectedOutput;

      if (!isPass) {
        console.log("❌ TEST CASE FAILED");
        console.log("INPUT:", tc.input);
        console.log("EXPECTED:", expectedOutput);
        console.log("ACTUAL:", actualOutput);
      }

      results.push({
        input: tc.isHidden
          ? undefined
          : tc.input,

        expectedOutput: tc.isHidden
          ? undefined
          : expectedOutput,

        actualOutput: tc.isHidden
          ? undefined
          : actualOutput,

        passed: isPass,
      });

      if (isPass) {
        passed++;
      } else if (stopOnFirstFail) {
        return {
          verdict: "WA",
          passed,
          total: testCases.length,
          results,
        };
      }
    }

    const verdict =
      passed === testCases.length
        ? "AC"
        : "WA";

    console.log(
      `🏁 Submission complete: ${passed}/${testCases.length}`
    );

    return {
      verdict,
      passed,
      total: testCases.length,
      results,
    };

  } catch (error) {
    console.error(
      "❌ evaluateSubmission error:",
      error
    );

    return {
      verdict: "RE",
      passed,
      total: testCases.length,
      results,
      errorOutput:
        error.message ||
        "Execution failed",
    };

  } finally {
    /*
      Container sirf EK baar remove hoga.
    */
    if (execution?.containerName) {
      console.log("🧹 Removing Docker container...");

      await cleanupContainer(
        execution.containerName
      );

      console.log("✅ Docker container removed");
    }
  }
}


module.exports = {
  evaluateSubmission,
  mapJudge0Status,
};