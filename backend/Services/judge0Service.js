const { spawn } = require("child_process");
const crypto = require("crypto");

const LANGUAGE_IMAGES = {
  cpp: "gcc:15.3.0",
  python: "python:3.12-slim",
  java: "eclipse-temurin:17-jdk",
};

function execDocker(args, input = "") {
  return new Promise((resolve, reject) => {
    const child = spawn("docker", args, {
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("error", reject);

    child.on("close", (exitCode) => {
      resolve({
        exitCode,
        stdout,
        stderr,
      });
    });

    if (input) {
      child.stdin.write(input);
    }

    child.stdin.end();
  });
}

async function createExecutionContainer({
  code,
  language,
  memoryLimit = 128000,
}) {
  const image = LANGUAGE_IMAGES[language];

  if (!image) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const id = crypto.randomBytes(8).toString("hex");
  const containerName = `syntax-exec-${id}`;

  const startResult = await execDocker([
    "run",
    "-d",
    "--name",
    containerName,

    "--network",
    "none",

    "--cpus",
    "1",
    "--memory",
    `${Math.max(64, Math.floor(memoryLimit / 1024))}m`,

    "--pids-limit",
    "64",

    "--security-opt",
    "no-new-privileges",

    image,
    "bash",
    "-c",
    "sleep 3600",
  ]);

  if (startResult.exitCode !== 0) {
    throw new Error(
      startResult.stderr || "Failed to start Docker container"
    );
  }

  try {
    const sourceFile =
      language === "java"
        ? "/tmp/Main.java"
        : language === "python"
          ? "/tmp/main.py"
          : "/tmp/main.cpp";

    const sourceBase64 = Buffer.from(code, "utf8").toString("base64");

    const writeResult = await execDocker(
      [
        "exec",
        "-i",
        containerName,
        "bash",
        "-c",
        `base64 -d > ${sourceFile}`,
      ],
      sourceBase64
    );

    if (writeResult.exitCode !== 0) {
      throw new Error(
        writeResult.stderr || "Failed to write source code"
      );
    }

    let compileCommand;

    if (language === "cpp") {
      compileCommand =
        "g++ /tmp/main.cpp -O2 -std=c++17 -o /tmp/main";
    } else if (language === "java") {
      compileCommand =
        "javac /tmp/Main.java";
    } else {
      compileCommand =
        "python3 -m py_compile /tmp/main.py";
    }

    const compileResult = await execDocker([
      "exec",
      containerName,
      "bash",
      "-c",
      compileCommand,
    ]);

    if (compileResult.exitCode !== 0) {
      await cleanupContainer(containerName);

      return {
        containerName: null,
        compileError:
          compileResult.stderr ||
          compileResult.stdout ||
          "Compilation failed",
      };
    }

    return {
      containerName,
      compileError: null,
    };
  } catch (error) {
    await cleanupContainer(containerName);
    throw error;
  }
}


/*
  🚀 BATCH EXECUTION

  Saare test cases ek hi docker exec ke andar run honge.
  Docker exec overhead sirf 1 baar.
*/
async function runTestsInContainer({
  containerName,
  language,
  testCases,
  cpuTimeLimit = 2,
}) {
  let runCommand;

  if (language === "cpp") {
    runCommand =
      `timeout ${cpuTimeLimit}s /tmp/main < /tmp/input.txt`;
  } else if (language === "python") {
    runCommand =
      `timeout ${cpuTimeLimit}s python3 /tmp/main.py < /tmp/input.txt`;
  } else {
    runCommand =
      `timeout ${cpuTimeLimit}s java -cp /tmp Main < /tmp/input.txt`;
  }

  /*
    Har input ko base64 me bhejenge.
    Isse special characters/newlines safe rahenge.
  */
  const encodedInputs = testCases
    .map((tc) =>
      Buffer.from(tc.input || "", "utf8").toString("base64")
    )
    .join("\n");

  const script = `
set +e

while IFS= read -r INPUT_B64
do
    echo "$INPUT_B64" | base64 -d > /tmp/input.txt

    rm -f /tmp/out.txt /tmp/err.txt

    timeout ${cpuTimeLimit}s ${runCommand.replace(
      `timeout ${cpuTimeLimit}s `,
      ""
    )} > /tmp/out.txt 2> /tmp/err.txt

    EXIT_CODE=$?

    STDOUT_B64=$(base64 -w 0 /tmp/out.txt 2>/dev/null || base64 /tmp/out.txt | tr -d '\\n')
    STDERR_B64=$(base64 -w 0 /tmp/err.txt 2>/dev/null || base64 /tmp/err.txt | tr -d '\\n')

    echo "RESULT_START"
    echo "$EXIT_CODE"
    echo "$STDOUT_B64"
    echo "$STDERR_B64"
    echo "RESULT_END"

done
`;

  const result = await execDocker(
    [
      "exec",
      "-i",
      containerName,
      "bash",
      "-c",
      script,
    ],
    encodedInputs + "\n"
  );

  const output = result.stdout;

  const results = [];
  const blocks = output.split("RESULT_START").slice(1);

  for (const block of blocks) {
    const clean = block.split("RESULT_END")[0].trim();
    const lines = clean.split(/\r?\n/);

    const exitCode = Number(lines[0] || 0);

    let stdout = "";
    let stderr = "";

    try {
      stdout = lines[1]
        ? Buffer.from(lines[1], "base64").toString("utf8")
        : "";
    } catch {
      stdout = "";
    }

    try {
      stderr = lines[2]
        ? Buffer.from(lines[2], "base64").toString("utf8")
        : "";
    } catch {
      stderr = "";
    }

    if (exitCode === 124) {
      results.push({
        stdout,
        stderr,
        status: {
          id: 5,
          description: "Time Limit Exceeded",
        },
      });
    } else if (exitCode !== 0) {
      results.push({
        stdout,
        stderr,
        status: {
          id: 7,
          description: "Runtime Error",
        },
      });
    } else {
      results.push({
        stdout,
        stderr: stderr || null,
        status: {
          id: 3,
          description: "Accepted",
        },
      });
    }
  }

  return results;
}

/*
  Reference Solution Runner

  Used by automatic test-case generation.
  Sirf reference solution ko generated inputs par run karta hai
  aur stdout return karta hai.
*/
async function runReferenceSolution({
  code,
  language,
  testCases,
  cpuTimeLimit = 2,
  memoryLimit = 128000,
}) {
  let execution = null;

  try {
    execution = await createExecutionContainer({
      code,
      language,
      memoryLimit,
    });

    if (execution.compileError) {
      throw new Error(
        `Reference solution compilation failed: ${execution.compileError}`
      );
    }

    const results = await runTestsInContainer({
      containerName: execution.containerName,
      language,
      testCases,
      cpuTimeLimit,
    });

    return results.map((result) => {
      const status =
        result.status?.description || "Unknown Error";
if (status !== "Accepted") {
    console.log("=================================");
    console.log("❌ REFERENCE TEST FAILED");
    console.log("Status:", status);
    console.log("Input:", result.stdin);
    console.log("STDOUT:", result.stdout);
    console.log("STDERR:", result.stderr);
    console.log("COMPILE OUTPUT:", result.compile_output);
    console.log("=================================");

    return null;
}
      return (result.stdout || "").trim();
    });

  } finally {
    if (execution?.containerName) {
      await cleanupContainer(execution.containerName);
    }
  }
}


/*
  Existing Run button compatibility.
*/
async function runOnJudge0({
  code,
  language,
  input,
  cpuTimeLimit = 2,
  memoryLimit = 128000,
}) {
  const execution = await createExecutionContainer({
    code,
    language,
    memoryLimit,
  });

  if (execution.compileError) {
    return {
      stdout: null,
      stderr: null,
      compile_output: execution.compileError,
      status: {
        id: 6,
        description: "Compilation Error",
      },
    };
  }

  try {
    const results = await runTestsInContainer({
      containerName: execution.containerName,
      language,
      testCases: [{ input }],
      cpuTimeLimit,
    });

    return results[0];
  } finally {
    await cleanupContainer(execution.containerName);
  }
}


async function cleanupContainer(containerName) {
  if (!containerName) return;

  await execDocker([
    "rm",
    "-f",
    containerName,
  ]);
}


module.exports = {
  runOnJudge0,
  runReferenceSolution,
  createExecutionContainer,
  runTestsInContainer,
  cleanupContainer,
  LANGUAGE_IMAGES,
};