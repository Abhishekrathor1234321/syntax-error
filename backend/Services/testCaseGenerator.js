// backend/Services/testCaseGenerator.js

const {
    runReferenceSolution,
} = require("./judge0Service");

/* =========================================================
   RANDOM HELPERS
   ========================================================= */

function randomInt(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function randomChoice(array) {
    return array[
        randomInt(0, array.length - 1)
    ];
}

function normalizeText(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[-\_]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/* =========================================================
   QUESTION TEXT
   ========================================================= */

function getQuestionText(question) {
    const parts = [
        question?.title,
        question?.topic,
        question?.description,
        question?.inputFormat,
        question?.outputFormat,
        question?.constraints,
        question?.hint,
    ];

    if (Array.isArray(question?.tags)) {
        parts.push(...question.tags);
    }

    return parts
        .filter(Boolean)
        .map(normalizeText)
        .join(" ");
}

/* =========================================================
   REFERENCE SOLUTION
   ========================================================= */

function getReferenceSolution(question) {
    const code = question?.solution?.code;

    if (!code) {
        return null;
    }

    /*
       Prefer C++ because your platform already supports
       C++ compilation through Docker.
    */

    if (code.cpp?.trim()) {
        return {
            language: "cpp",
            code: code.cpp,
        };
    }

    if (code.python?.trim()) {
        return {
            language: "python",
            code: code.python,
        };
    }

    if (code.java?.trim()) {
        return {
            language: "java",
            code: code.java,
        };
    }

    return null;
}

/* =========================================================
   TWO SUM
   ========================================================= */

function generateTwoSumInput() {
    const n = randomInt(2, 50);

    const nums = Array.from(
        { length: n },
        () => randomInt(-100, 100)
    );

    const a = randomInt(1000, 5000);
    const b = randomInt(6000, 9000);

    const target = a + b;

    const i = randomInt(0, n - 2);
    const j = randomInt(i + 1, n - 1);

    nums[i] = a;
    nums[j] = b;

    return `${n} ${target}\n${nums.join(" ")}`;
}

/* =========================================================
   MAXIMUM / LARGEST ELEMENT
   ========================================================= */

function generateMaximumElementInput() {
    const n = randomInt(1, 100);

    const arr = Array.from(
        { length: n },
        () => randomInt(-1000, 1000)
    );

    return `${n}\n${arr.join(" ")}`;
}

/* =========================================================
   MINIMUM ELEMENT
   ========================================================= */

function generateMinimumElementInput() {
    const n = randomInt(1, 100);

    const arr = Array.from(
        { length: n },
        () => randomInt(-1000, 1000)
    );

    return `${n}\n${arr.join(" ")}`;
}

/* =========================================================
   MAXIMUM SUBARRAY
   ========================================================= */

function generateMaximumSubarrayInput() {
    const n = randomInt(1, 100);

    const arr = Array.from(
        { length: n },
        () => randomInt(-100, 100)
    );

    return `${n}\n${arr.join(" ")}`;
}

/* =========================================================
   TRAPPING RAIN WATER
   ========================================================= */

function generateTrappingRainWaterInput() {
    const n = randomInt(3, 50);

    const heights = Array.from(
        { length: n },
        () => randomInt(0, 20)
    );

    return `${n}\n${heights.join(" ")}`;
}

/* =========================================================
   LONGEST SUBSTRING
   ========================================================= */

function generateLongestSubstringInput() {
    const chars =
        "abcdefghijklmnopqrstuvwxyz";

    const length = randomInt(1, 50);

    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars[
            randomInt(0, chars.length - 1)
        ];
    }

    return result;
}

/* =========================================================
   REVERSE WORDS
   ========================================================= */

function generateReverseWordsInput() {
    const words = [
        "hello",
        "world",
        "coding",
        "student",
        "developer",
        "javascript",
        "python",
        "java",
        "array",
        "string",
        "practice",
        "syntax",
        "error",
        "computer",
        "algorithm",
        "future",
    ];

    const count = randomInt(2, 10);

    const selected = [];

    for (let i = 0; i < count; i++) {
        selected.push(
            randomChoice(words)
        );
    }

    return selected
        .map(word => {
            const left =
                " ".repeat(randomInt(0, 2));

            const right =
                " ".repeat(randomInt(0, 2));

            return `${left}${word}${right}`;
        })
        .join(" ");
}

/* =========================================================
   GROUP ANAGRAMS
   ========================================================= */

function generateGroupAnagramsInput() {
    const groups = [
        ["eat", "tea", "ate"],
        ["tan", "nat"],
        ["bat", "tab"],
        ["cat", "act"],
        ["dog", "god"],
        ["listen", "silent"],
    ];

    const selected = [];

    const groupCount =
        randomInt(1, Math.min(4, groups.length));

    for (let i = 0; i < groupCount; i++) {
        const group =
            randomChoice(groups);

        const word =
            randomChoice(group);

        selected.push(word);

        if (Math.random() < 0.6) {
            selected.push(
                randomChoice(group)
            );
        }
    }

    return `${selected.length}\n${selected.join(" ")}`;
}

/* =========================================================
   RANDOM ARRAY
   ========================================================= */

function generateRandomArrayInput() {
    const n = randomInt(1, 100);

    const arr = Array.from(
        { length: n },
        () => randomInt(-1000, 1000)
    );

    return `${n}\n${arr.join(" ")}`;
}

/* =========================================================
   SAMPLE INPUT MUTATION
   ========================================================= */

/*
   Fallback generator.

   Agar exact problem pattern identify nahi hota,
   sampleInput ka structure preserve karke values mutate
   karta hai.

   Example:

   Sample:
   5
   10 20 30 40 50

   Generated:
   5
   -17 82 4 91 33
*/

function generateScalarInput(question) {
    const min = 1;
    const max = 100;

    return String(
        randomInt(min, max)
    );
}

function mutateSampleInput(question) {
    // Universal fallback:
    // Works with new samples[] and old sampleInput.

    let sample = "";

    if (
        Array.isArray(question?.samples) &&
        question.samples.length > 0
    ) {
        const validSamples = question.samples.filter(
            (s) => s?.input
        );

        if (validSamples.length > 0) {
            const selected =
                validSamples[
                    randomInt(0, validSamples.length - 1)
                ];

            sample = String(selected.input).trim();
        }
    }

    // Backward compatibility
    if (!sample && question?.sampleInput) {
        sample = String(question.sampleInput).trim();
    }

    if (!sample) {
        return null;
    }

    const lines = sample.split(/\r?\n/);

    const mutatedLines = lines.map((line) => {
        if (!line.trim()) {
            return line;
        }

        const tokens = line.trim().split(/\s+/);

        const mutatedTokens = tokens.map((token) => {

            // Integer
            if (/^-?\d+$/.test(token)) {
                const value = Number(token);

                const range = Math.max(
                    10,
                    Math.abs(value) * 3
                );

                return String(
                    randomInt(-range, range)
                );
            }

            // Decimal
            if (/^-?\d+\.\d+$/.test(token)) {
                const value = Number(token);

                const range = Math.max(
                    10,
                    Math.abs(value) * 3
                );

                return (
                    Math.random() * range * 2 - range
                ).toFixed(2);
            }

            // String / word
            if (/^[a-zA-Z]+$/.test(token)) {
                const chars =
                    "abcdefghijklmnopqrstuvwxyz";

                /*
                 * Preserve repeated-character pattern.
                 *
                 * Example:
                 * ABAB → XYXY
                 * AABB → XXYY
                 * ABCD → WXYZ
                 */

                const pattern = new Map();
                let nextCharIndex = 0;

                let result = "";

                for (const ch of token) {
                    const key = ch.toLowerCase();

                    if (!pattern.has(key)) {
                        pattern.set(
                            key,
                            chars[
                                nextCharIndex %
                                chars.length
                            ]
                        );

                        nextCharIndex++;
                    }

                    result += pattern.get(key);
                }

                return result;
            }

            // Unknown token:
            // Preserve it exactly.

            return token;
        });

        return mutatedTokens.join(" ");
    });

    return mutatedLines.join("\n");
}

/* =========================================================
   SAMPLES
   ========================================================= */

function getSamples(question) {
    if (
        Array.isArray(question?.samples) &&
        question.samples.length > 0
    ) {
        return question.samples
            .filter((sample) => sample?.input)
            .map((sample) => ({
                input: String(sample.input).trim(),
                output: String(sample.output || "").trim(),
            }));
    }

    // Old format support
    if (question?.sampleInput) {
        return [
            {
                input: String(question.sampleInput).trim(),
                output: String(
                    question.sampleOutput || ""
                ).trim(),
            },
        ];
    }

    return [];
}

/* =========================================================
   TREE INPUT
   ========================================================= */

function generateParentTreeInput(question) {
    const n = randomInt(2, 30);

    const parents = [];

    for (let node = 2; node <= n; node++) {
        parents.push(
            randomInt(1, node - 1)
        );
    }

    const x = randomInt(1, n);

    return `${n}\n${parents.join(" ")}\n${x}`;
}

/* =========================================================
   UNIVERSAL STRING INPUT GENERATOR
   ========================================================= */

function getMaxStringLength(question) {
    const constraints = String(
        question?.constraints || ""
    ).toLowerCase();

    const patterns = [
        /(?:\|s\||length|size)\s*(?:<=|<)\s*(\d+)/i,
        /(?:n)\s*(?:<=|<)\s*(\d+)/i,
    ];

    for (const pattern of patterns) {
        const match = constraints.match(pattern);

        if (match) {
            const value = Number(match[1]);

            if (Number.isFinite(value) && value > 0) {
                return Math.min(value, 100000);
            }
        }
    }

    return 50;
}

function generateRandomString(
    minLength = 1,
    maxLength = 50
) {
    const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const safeMin = Math.max(
        1,
        Number(minLength) || 1
    );

    const safeMax = Math.max(
        safeMin,
        Number(maxLength) || safeMin
    );

    const length = randomInt(
        safeMin,
        safeMax
    );

    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars[
            randomInt(0, chars.length - 1)
        ];
    }

    return result;
}

function generateStringFromSampleShape(question) {
    const samples = getSamples(question);

    if (!samples.length) {
        return generateRandomString(
            1,
            getMaxStringLength(question)
        );
    }

    const sampleInput = String(
        samples[0]?.input || ""
    ).trim();

    if (!sampleInput) {
        return generateRandomString(
            1,
            getMaxStringLength(question)
        );
    }

    const lines = sampleInput
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    if (!lines.length) {
        return generateRandomString(
            1,
            getMaxStringLength(question)
        );
    }

    /*
     * PURE STRING INPUT
     *
     * Example:
     * AGGTAB
     * GXTXAYB
     *
     * Generate exactly the same number of
     * string lines. Do NOT split them into tokens.
     */
    const isPureStringShape = lines.every((line) =>
        /^[a-zA-Z]+$/.test(line)
    );

    if (isPureStringShape) {
        return lines
            .map(() => {
                const maxLength =
                    getMaxStringLength(question);

                return generateRandomString(
                    1,
                    Math.max(1, maxLength)
                );
            })
            .join("\n");
    }

    /*
     * Mixed input:
     *
     * Preserve numeric / string token structure.
     */
    const generatedLines = lines.map((line) => {
        const tokens = line.split(/\s+/);

        return tokens
            .map((token) => {

                // Alphabetic token
                if (/^[a-zA-Z]+$/.test(token)) {
                    const originalLength = token.length;

                    const maxLength = Math.min(
                        Math.max(originalLength, 30),
                        getMaxStringLength(question)
                    );

                    return generateRandomString(
                        1,
                        maxLength
                    );
                }

                // Integer
                if (/^-?\d+$/.test(token)) {
                    return token;
                }

                // Decimal
                if (/^-?\d+\.\d+$/.test(token)) {
                    return token;
                }

                return token;
            })
            .join(" ");
    });

    return generatedLines.join("\n");
}
function generateStringInput(question) {
    /*
     * IMPORTANT:
     * We do NOT identify a particular problem.
     *
     * We only preserve the INPUT SHAPE of the
     * examples and generate fresh valid strings.
     */

    return generateStringFromSampleShape(question);
}

/* =========================================================
   GRAPH INPUT
   ========================================================= */

function generateGraphInput(question) {
    const n = randomInt(2, 10);

    const maxEdges = Math.min(
        n * (n - 1) / 2,
        20
    );

    const m = randomInt(
        n - 1,
        Math.max(n - 1, maxEdges)
    );

    const edges = new Set();

    while (edges.size < m) {
        const u = randomInt(1, n);
        const v = randomInt(1, n);

        if (u === v) {
            continue;
        }

        const a = Math.min(u, v);
        const b = Math.max(u, v);

        edges.add(`${a} ${b}`);
    }

    return `${n} ${edges.size}\n${[
        ...edges
    ].join("\n")}`;
}

/* =========================================================
   MATRIX INPUT
   ========================================================= */

function generateMatrixInput(question) {
    const rows = randomInt(1, 8);
    const cols = randomInt(1, 8);

    const matrix = [];

    for (let i = 0; i < rows; i++) {
        const row = [];

        for (let j = 0; j < cols; j++) {
            row.push(randomInt(-100, 100));
        }

        matrix.push(row.join(" "));
    }

    return `${rows} ${cols}\n${matrix.join("\n")}`;
}

/* =========================================================
   AUTOMATIC INPUT DETECTION
   ========================================================= */

function generateInput(question) {
    const samples = getSamples(question);

    const title = normalizeText(
        question?.title
    );

    const topic = normalizeText(
        question?.topic
    );

    const tags = Array.isArray(question?.tags)
        ? question.tags
            .map(normalizeText)
            .join(" ")
        : "";

    const text = [
        title,
        topic,
        tags,
        normalizeText(question?.description),
        normalizeText(question?.inputFormat),
        normalizeText(question?.hint),
    ].join(" ");

    /* =====================================================
       TREE
       ===================================================== */

    if (
        topic === "tree" ||
        topic === "trees" ||
        text.includes("tree") ||
        text.includes("descendant") ||
        text.includes("ancestor") ||
        text.includes("parent node") ||
        text.includes("binary tree")
    ) {
        return generateParentTreeInput(question);
    }

    /* =====================================================
       GRAPH
       ===================================================== */

    if (
        topic === "graph" ||
        topic === "graphs" ||
        text.includes("graph") ||
        text.includes("vertices") ||
        text.includes("edges")
    ) {
        return generateGraphInput(question);
    }

    /* =====================================================
       TWO SUM
       ===================================================== */

    if (
        text.includes("two sum") ||
        (
            text.includes("two numbers") &&
            text.includes("target")
        )
    ) {
        return generateTwoSumInput();
    }

    /* =====================================================
       TRAPPING RAIN WATER
       ===================================================== */

    if (
        text.includes("trapping rain water") ||
        text.includes("elevation map") ||
        (
            text.includes("water") &&
            text.includes("heights")
        )
    ) {
        return generateTrappingRainWaterInput();
    }

    /* =====================================================
       LONGEST SUBSTRING
       ===================================================== */

    if (
        text.includes("longest substring") &&
        (
            text.includes("without repeating") ||
            text.includes("unique characters")
        )
    ) {
        return generateLongestSubstringInput();
    }

    /* =====================================================
       REVERSE WORDS
       ===================================================== */

    if (
        text.includes("reverse words") ||
        text.includes("reverse the words")
    ) {
        return generateReverseWordsInput();
    }

    /* =====================================================
       GROUP ANAGRAMS
       ===================================================== */

    if (
        text.includes("group anagrams") ||
        text.includes("group the anagrams")
    ) {
        return generateGroupAnagramsInput();
    }

    /* =====================================================
       MAXIMUM SUBARRAY
       ===================================================== */

    if (
        text.includes("maximum subarray") ||
        text.includes("maximum contiguous subarray") ||
        text.includes("kadane")
    ) {
        return generateMaximumSubarrayInput();
    }

    /* =====================================================
       MAXIMUM / LARGEST
       ===================================================== */

    if (
        (
            text.includes("maximum element") ||
            text.includes("largest element") ||
            text.includes("find maximum") ||
            text.includes("find largest")
        ) &&
        (
            topic === "arrays" ||
            topic === "array" ||
            text.includes("array")
        )
    ) {
        return generateMaximumElementInput();
    }

    /* =====================================================
       MINIMUM / SMALLEST
       ===================================================== */

    if (
        (
            text.includes("minimum element") ||
            text.includes("smallest element") ||
            text.includes("find minimum") ||
            text.includes("find smallest")
        ) &&
        (
            topic === "arrays" ||
            topic === "array" ||
            text.includes("array")
        )
    ) {
        return generateMinimumElementInput();
    }

    /* =====================================================
       MATRIX
       ===================================================== */

    if (
        text.includes("matrix") ||
        text.includes("grid") ||
        samples.some((sample) =>
            looksLikeMatrix(sample.input)
        )
    ) {
        return generateMatrixInput(question);
    }

    /* =====================================================
       STRING
       ===================================================== */

    if (
        topic === "string" ||
        topic === "strings" ||
        samples.some((sample) => {
            const input = String(
                sample?.input || ""
            ).trim();

            return (
                input.length > 0 &&
                /^[a-zA-Z\s]+$/.test(input)
            );
        }) ||
        text.includes("string") ||
        text.includes("substring") ||
        text.includes("character") ||
        text.includes("word")
    ) {
        return generateStringInput(question);
    }
    

     /* =====================================================
   RECURSION / NUMERIC INPUT
   ===================================================== */

if (
    topic === "recursion" ||
    topic === "recursive" ||
    tags.includes("recursion")
) {
    const constraints = String(
        question?.constraints || ""
    ).toLowerCase();

    const numbers = constraints.match(/\d+/g);

    if (numbers && numbers.length >= 2) {
        const min = Number(numbers[0]);
        const max = Number(numbers[1]);

        if (
            Number.isFinite(min) &&
            Number.isFinite(max) &&
            min <= max
        ) {
            return String(
                randomInt(min, max)
            );
        }
    }

    return String(
        randomInt(1, 30)
    );
}
    /* =====================================================
       GENERIC ARRAY
       ===================================================== */

    if (
        topic === "arrays" ||
        topic === "array" ||
        tags.includes("arrays") ||
        tags.includes("array") ||
        text.includes("array")
    ) {
        return generateRandomArrayInput();
    }

    /* =====================================================
       UNIVERSAL SAMPLE FALLBACK
       ===================================================== */

    if (samples.length > 0) {
        const universalInput =
            mutateSampleInput(question);

        if (universalInput) {
            return universalInput;
        }
    }

    return generateScalarInput(question);
}

/* =========================================================
   MATRIX DETECTOR
   ========================================================= */

function looksLikeMatrix(input) {
    if (!input || typeof input !== "string") {
        return false;
    }

    const lines = input.trim().split(/\r?\n/);

    if (lines.length < 2) {
        return false;
    }

    const firstLine =
        lines[0]
            .trim()
            .split(/\s+/)
            .map(Number);

    if (firstLine.length !== 2) {
        return false;
    }

    const rows = firstLine[0];
    const cols = firstLine[1];

    if (
        !Number.isInteger(rows) ||
        !Number.isInteger(cols) ||
        rows <= 0 ||
        cols <= 0
    ) {
        return false;
    }

    const values = lines
        .slice(1)
        .join(" ")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    return values.length === rows * cols;
}

/* =========================================================
   GENERATE TEST CASES
   ========================================================= */

async function generateTestCases(
    slug,
    count = 20,
    existingInputs = [],
    question = null
) {
    if (!question) {
        throw new Error(
            "Question data is required for automatic test generation."
        );
    }

    const reference =
        getReferenceSolution(question);

    if (!reference) {
        throw new Error(
            `No reference solution found for question: ${slug}`
        );
    }

    const usedInputs = new Set(
        (existingInputs || []).map((input) =>
            String(input).trim()
        )
    );

    const generated = [];

    let attempts = 0;

    const maxAttempts = Math.max(
        count * 10,
        50
    );

    /*
       Har baar count tests nahi,
       ek batch me extra candidates generate karenge.
    */

    while (
        generated.length < count &&
        attempts < maxAttempts
    ) {
        attempts++;

        const remaining =
            count - generated.length;

        /*
           Extra candidates rakho because
           kuch reference solution fail ho sakte hain.
        */

        const batchSize = Math.min(
            Math.max(remaining * 2, 10),
            50
        );

        const candidates = [];

        let generationAttempts = 0;

        while (
            candidates.length < batchSize &&
            generationAttempts < batchSize * 5
        ) {
            generationAttempts++;

            let input;

            try {
                input = generateInput(question);
            } catch (error) {
                console.error(
                    "⚠️ Input generation error:",
                    error.message
                );

                continue;
            }

            if (!input || !input.trim()) {
                continue;
            }

            input = input.trim();

            /*
               Existing duplicate
            */

            if (usedInputs.has(input)) {
                continue;
            }

            /*
               Same batch duplicate
            */

            if (candidates.includes(input)) {
                continue;
            }

            candidates.push(input);
        }

        if (candidates.length === 0) {
            console.log(
                "⚠️ No new candidates generated."
            );

            continue;
        }

        console.log(
            `🧪 Running ${candidates.length} candidates in ONE batch...`
        );

        /*
           IMPORTANT:
           Saare candidates ek hi reference execution
           me jayenge.
        */

        let outputs;

        try {
            outputs = await runReferenceSolution({
                code: reference.code,
                language: reference.language,

                testCases: candidates.map((input) => ({
                    input,
                })),

                cpuTimeLimit: 2,
                memoryLimit: 512000,
            });

            console.log(
                "🔍 REFERENCE OUTPUTS:",
                outputs
            );
        } catch (error) {
            console.error(
                "❌ Reference solution batch failed:",
                error.message
            );

            continue;
        }

        if (!Array.isArray(outputs)) {
            console.log(
                "⚠️ Reference solution returned invalid output."
            );

            continue;
        }

        console.log(
            `⚡ Received ${outputs.length} outputs`
        );

        /*
           Input + output pair karo
        */

        for (
            let i = 0;
            i < candidates.length;
            i++
        ) {
            if (generated.length >= count) {
                break;
            }

            const input = candidates[i];

            const expectedOutput =
                outputs[i];

            /*
               Failed reference execution
            */

            if (
                expectedOutput === undefined ||
                expectedOutput === null
            ) {
                console.log(
                    `⚠️ Candidate ${i + 1} ignored`
                );

                continue;
            }

            const output =
                String(expectedOutput).trim();

            /*
               Valid test
            */

            generated.push({
                input,
                expectedOutput: output,
                isHidden: true,
            });

            usedInputs.add(input);

            console.log(
                `✅ Generated ${generated.length}/${count}`
            );
        }
    }

    if (generated.length < count) {
        throw new Error(
            `Could only generate ${generated.length}/${count} valid test cases for "${slug}" after ${attempts} batches.`
        );
    }

    console.log(
        `🎯 Successfully generated ${generated.length} test cases`
    );

    return generated;
}

/* =========================================================
   EXPORT
   ========================================================= */

module.exports = {
    generateTestCases,
};