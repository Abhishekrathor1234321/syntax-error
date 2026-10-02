import React, { useEffect, useState } from "react";


const emptyForm = {


    title: "",


    slug: "",


    topic: "",


    difficulty: "easy",


    points: 10,


    tags: "",


    description: "",


    inputFormat: "",


    outputFormat: "",


    constraints: "",


  samples: [


    {


        input: "",


        output: "",


        explanation: "",


    },


],


    hint: "",


    testCases: [],


    solution: {


        explanation: "",


        code: {


            cpp: "",


            java: "",


            python: "",


        },


    },


};


const makeSlug = (title) => {

    return String(title || "")

        .toLowerCase()

        .trim()

        .replace(/[^a-z0-9\s-]/g, "")

        .replace(/\s+/g, "-")

        .replace(/-+/g, "-")

        .replace(/^-|-$/g, "");

};


const generateAutoTags = (title, topic, description) => {

    const text =

        `${title || ""} ${topic || ""} ${description || ""}`.toLowerCase();


    const tagMap = [

        ["array", "Array"],

        ["arrays", "Array"],

        ["string", "String"],

        ["strings", "String"],

        ["linked list", "Linked List"],

        ["stack", "Stack"],

        ["queue", "Queue"],

        ["binary tree", "Binary Tree"],

        ["tree", "Tree"],

        ["bst", "BST"],

        ["graph", "Graph"],

        ["heap", "Heap"],

        ["priority queue", "Priority Queue"],

        ["hashmap", "HashMap"],

        ["hash map", "HashMap"],

        ["hash", "Hashing"],

        ["two pointer", "Two Pointer"],

        ["two pointers", "Two Pointer"],

        ["sliding window", "Sliding Window"],

        ["binary search", "Binary Search"],

        ["recursion", "Recursion"],

        ["backtracking", "Backtracking"],

        ["greedy", "Greedy"],

        ["dynamic programming", "Dynamic Programming"],

        ["dp", "Dynamic Programming"],

        ["bit manipulation", "Bit Manipulation"],

        ["prefix sum", "Prefix Sum"],

        ["kadane", "Kadane"],

        ["sorting", "Sorting"],

        ["searching", "Searching"],

        ["matrix", "Matrix"],

        ["math", "Math"],

    ];


    const tags = [];


    for (const [keyword, tag] of tagMap) {

        if (text.includes(keyword) && !tags.includes(tag)) {

            tags.push(tag);

        }

    }


    if (

        topic &&

        !tags.some(

            (tag) => tag.toLowerCase() === topic.trim().toLowerCase()

        )

    ) {

        tags.unshift(topic.trim());

    }


    return tags.slice(0, 6);

};


const normalizeSamplesToVisibleTests = (samples) => {

    if (!Array.isArray(samples)) return [];


    return samples

        .filter(

            (sample) =>

                sample &&

                String(sample.input || "").trim() &&

                String(sample.output || "").trim()

        )

        .map((sample) => ({

            input: sample.input,

            expectedOutput: sample.output,

            isHidden: false,

        }));

};


const AdminTcsCoding = ({ apiBase }) => {


    const [questions, setQuestions] = useState([]);


    const [loading, setLoading] = useState(false);


    const [showForm, setShowForm] = useState(false);


    const [editingId, setEditingId] = useState(null);


    const [viewingQuestion, setViewingQuestion] = useState(null);


    const [form, setForm] = useState(emptyForm);


    const [topicFilter, setTopicFilter] = useState("");


    const [difficultyFilter, setDifficultyFilter] = useState("");


    const token = localStorage.getItem("token");


    const authHeaders = {


        "Content-Type": "application/json",


        Authorization: `Bearer ${token}`,


    };


    // =====================================================


    // LOAD QUESTIONS


    // =====================================================


    const loadQuestions = async () => {


        try {


            setLoading(true);


const response = await fetch(


    `${apiBase}/coding/admin/questions`,


    {


        headers: authHeaders,


    }


);


            const data = await response.json();


            if (!response.ok) {


                throw new Error(data.message || "Failed to load questions");


            }


            setQuestions(data.questions || []);


        } catch (error) {


            console.error(error);


            alert(error.message);


        } finally {


            setLoading(false);


        }


    };


    useEffect(() => {


        loadQuestions();


    }, []);


    // =====================================================


    // FORM HANDLER


    // =====================================================


    const handleChange = (e) => {


        const { name, value } = e.target;


        setForm((prev) => ({


            ...prev,


            [name]: value,


        }));


    };


    const handleSolutionChange = (language, value) => {


        setForm((prev) => ({


            ...prev,


            solution: {


                ...prev.solution,


                code: {


                    ...prev.solution.code,


                    [language]: value,


                },


            },


        }));


    };


    const handleExplanationChange = (value) => {


        setForm((prev) => ({


            ...prev,


            solution: {


                ...prev.solution,


                explanation: value,


            },


        }));


    };


    // =====================================================


    // ADD TEST CASE


    // =====================================================


    const addTestCase = (isHidden = true) => {


        setForm((prev) => ({


            ...prev,


            testCases: [


                ...prev.testCases,


                {


                    input: "",


                    expectedOutput: "",


                    isHidden,


                },


            ],


        }));


    };


    const updateTestCase = (index, field, value) => {


        setForm((prev) => {


            const updated = [...prev.testCases];


            updated[index] = {


                ...updated[index],


                [field]: value,


            };


            return {


                ...prev,


                testCases: updated,


            };


        });


    };


    const removeTestCase = (index) => {


        setForm((prev) => ({


            ...prev,


            testCases: prev.testCases.filter((_, i) => i !== index),


        }));


    };


    const addSample = () => {


    setForm((prev) => ({


        ...prev,


        samples: [


            ...prev.samples,


            {


                input: "",


                output: "",


                explanation: "",


            },


        ],


    }));


};


const updateSample = (index, field, value) => {


    setForm((prev) => {


        const updated = [...prev.samples];


        updated[index] = {


            ...updated[index],


            [field]: value,


        };


        return {


            ...prev,


            samples: updated,


        };


    });


};


const removeSample = (index) => {


    setForm((prev) => ({


        ...prev,


        samples: prev.samples.filter((_, i) => i !== index),


    }));


};


const handleView = (question) => {


    setViewingQuestion(question);


};


    // =====================================================


    // EDIT


    // =====================================================


 const handleEdit = async (question) => {


    try {


        console.log("🟡 EDIT CLICKED:", question._id);


        const url = `${apiBase}/coding/admin/questions/${question._id}`;


        console.log("🟡 EDIT URL:", url);


        const response = await fetch(url, {


            method: "GET",


            headers: authHeaders,


        });


        console.log("🟡 EDIT RESPONSE STATUS:", response.status);


        const data = await response.json();


        console.log("🟡 FULL EDIT DATA:", data);


        if (!response.ok) {


            throw new Error(


                data.message || "Failed to load question"


            );


        }


        const q = data.question;


        console.log("🟢 EDIT SAMPLES:", q.samples);


        setEditingId(q._id);


        setForm({


            title: q.title || "",


            slug: q.slug || "",


            topic: q.topic || "",


            difficulty: q.difficulty || "easy",


            points: q.points || 10,


            tags: Array.isArray(q.tags)


                ? q.tags.join(", ")


                : "",


            description: q.description || "",


            inputFormat: q.inputFormat || "",


            outputFormat: q.outputFormat || "",


            constraints: q.constraints || "",


            samples:


                Array.isArray(q.samples) &&


                q.samples.length > 0


                    ? q.samples.map((sample) => ({


                          input: sample.input || "",


                          output: sample.output || "",


                          explanation:


                              sample.explanation || "",


                      }))


                    : [


                          {


                              input: q.sampleInput || "",


                              output: q.sampleOutput || "",


                              explanation: "",


                          },


                      ],


            hint: q.hint || "",


            testCases: q.testCases || [],


            solution: {


                explanation:


                    q.solution?.explanation || "",


                code: {


                    cpp:


                        q.solution?.code?.cpp || "",


                    java:


                        q.solution?.code?.java || "",


                    python:


                        q.solution?.code?.python || "",


                },


            },


        });


        setShowForm(true);


        window.scrollTo({


            top: 0,


            behavior: "smooth",


        });


    } catch (error) {


        console.error("❌ EDIT ERROR:", error);


        alert(error.message);


    }


};


    // =====================================================


    // RESET FORM


    // =====================================================


    const resetForm = () => {


        setForm(emptyForm);


        setEditingId(null);


        setShowForm(false);


    };


    // =====================================================


    // SAVE


    // =====================================================


    const handleSubmit = async (e) => {


        e.preventDefault();


        if (!form.title || !form.topic || !form.description) {

            alert("Please fill Title, Topic and Description.");

            return;

        }


        const normalizedSamples = Array.isArray(form.samples)

            ? form.samples.filter(

                  (sample) =>

                      sample &&

                      String(sample.input || "").trim() &&

                      String(sample.output || "").trim()

              )

            : [];


        // Preserve manually-added test cases.

        // If none exist, Examples become visible test cases.

        const normalizedTestCases =

            Array.isArray(form.testCases) && form.testCases.length

                ? form.testCases

                : normalizeSamplesToVisibleTests(normalizedSamples);


        const baseSlug = makeSlug(form.title);


        // Avoid frontend slug collisions before the request reaches the backend.

        // Existing questions keep their original slug while editing.

        let autoSlug = baseSlug;

        let slugCounter = 2;


        while (

            !editingId &&

            questions.some(

                (question) =>

                    String(question.slug || "").toLowerCase() ===

                    autoSlug.toLowerCase()

            )

        ) {

            autoSlug = `${baseSlug}-${slugCounter}`;

            slugCounter++;

        }


        const autoTags = generateAutoTags(

            form.title,

            form.topic,

            form.description

        );


        const payload = {

            ...form,


            // New question -> automatic slug.

            // Existing question -> preserve old slug.

            slug: editingId ? form.slug : autoSlug,


            samples: normalizedSamples,


            testCases: normalizedTestCases,


            points: Number(form.points) || 10,


            // New question -> automatic tags.

            // Existing question -> preserve old tags.

            tags: editingId

                ? String(form.tags || "")

                      .split(",")

                      .map((tag) => tag.trim())

                      .filter(Boolean)

                : autoTags,

        };


        if (!payload.testCases.length) {

            alert(

                "Please add at least one example with input and output, or add a test case."

            );

            return;

        }


        console.log("🔥 FORM SAMPLES:", form.samples);

        console.log("🔥 AUTO SLUG:", payload.slug);

        console.log("🔥 AUTO TAGS:", payload.tags);

        console.log("🔥 PAYLOAD SAMPLES:", payload.samples);

        console.log("🔥 PAYLOAD TEST CASES:", payload.testCases);


        try {


            setLoading(true);


const url = editingId


    ? `${apiBase}/coding/admin/questions/${editingId}`


    : `${apiBase}/coding/admin/questions`;


            const method = editingId ? "PUT" : "POST";


            const response = await fetch(url, {


                method,


                headers: authHeaders,


                body: JSON.stringify(payload),


            });


            const data = await response.json();


            if (!response.ok) {


                throw new Error(data.message || "Failed to save question");


            }


            alert(


                editingId


                    ? "Question updated successfully!"


                    : "Question added successfully!"


            );


            resetForm();


            await loadQuestions();


        } catch (error) {


            console.error(error);


            alert(error.message);


        } finally {


            setLoading(false);


        }


    };


    // =====================================================


    // DELETE


    // =====================================================


    const handleDelete = async (id) => {


        const confirmed = window.confirm(


            "Are you sure you want to delete this coding question?"


        );


        if (!confirmed) return;


        try {


            const response = await fetch(


              `${apiBase}/coding/admin/questions/${id}`,


                {


                    method: "DELETE",


                    headers: authHeaders,


                }


            );


            const data = await response.json();


            if (!response.ok) {


                throw new Error(data.message || "Failed to delete question");


            }


            alert("Question deleted successfully.");


            await loadQuestions();


        } catch (error) {


            console.error(error);


            alert(error.message);


        }


    };


    // =====================================================


// GENERATE HIDDEN TEST CASES


// =====================================================


const handleGenerateTests = async (question) => {


    const confirmed = window.confirm(


        `Generate 25 hidden test cases for "${question.title}"?`


    );


    if (!confirmed) return;


    try {


        setLoading(true);


        const response = await fetch(


            `${apiBase}/coding/question/${question.slug}/generate-tests`,


            {


                method: "POST",


                headers: authHeaders,


                body: JSON.stringify({


                    count: 25,


                }),


            }


        );


        const data = await response.json();


        if (!response.ok) {


            throw new Error(


                data.message || "Failed to generate test cases"


            );


        }


        alert(


            `${data.generated} hidden test cases generated successfully!`


        );


        await loadQuestions();


    } catch (error) {


        console.error(error);


        alert(error.message);


    } finally {


        setLoading(false);


    }


};


    // =====================================================


    // FILTER


    // =====================================================


    const filteredQuestions = questions.filter((question) => {


        const topicMatch =


            !topicFilter ||


            question.topic?.toLowerCase() === topicFilter.toLowerCase();


        const difficultyMatch =


            !difficultyFilter ||


            question.difficulty === difficultyFilter;


        return topicMatch && difficultyMatch;


    });


    const topics = [


        ...new Set(


            questions


                .map((question) => question.topic)


                .filter(Boolean)


        ),


    ];


    return (


        <div style={{ padding: "20px" }}>


            {viewingQuestion && (


    <div


        style={{


            position: "fixed",


            inset: 0,


            background: "rgba(0, 0, 0, 0.75)",


            zIndex: 9999,


            display: "flex",


            justifyContent: "center",


            alignItems: "center",


            padding: "30px",


            overflow: "hidden",


        }}


    >


        <div


            style={{


                background: "#111827",


                color: "#fff",


                width: "95%",


                maxWidth: "1100px",


                maxHeight: "90vh",


                overflowY: "auto",


                borderRadius: "14px",


                padding: "30px",


                position: "relative",


                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",


            }}


        >


            <button


                onClick={() => setViewingQuestion(null)}


                style={{


                    position: "absolute",


                    right: "20px",


                    top: "18px",


                    background: "#dc2626",


                    color: "#fff",


                    border: "none",


                    borderRadius: "8px",


                    padding: "8px 14px",


                    cursor: "pointer",


                }}


            >


                ✕ Close


            </button>


            <h1>{viewingQuestion.title}</h1>


            <div


                style={{


                    display: "flex",


                    gap: "10px",


                    flexWrap: "wrap",


                    marginBottom: "25px",


                }}


            >


                <span>Topic: {viewingQuestion.topic}</span>


                <span>


                    Difficulty: {viewingQuestion.difficulty}


                </span>


                <span>


                    Points: {viewingQuestion.points}


                </span>


                <span>


                    Slug: {viewingQuestion.slug}


                </span>


            </div>


            <section>


                <h2>Description</h2>


                <div


                    style={{


                        whiteSpace: "pre-wrap",


                        lineHeight: "1.7",


                        background: "#1f2937",


                        padding: "18px",


                        borderRadius: "10px",


                    }}


                >


                    {viewingQuestion.description}


                </div>


            </section>


            <section>


                <h2>Input Format</h2>


                <div


                    style={{


                        whiteSpace: "pre-wrap",


                        lineHeight: "1.7",


                    }}


                >


                    {viewingQuestion.inputFormat || "Not provided"}


                </div>


            </section>


            <section>


                <h2>Output Format</h2>


                <div


                    style={{


                        whiteSpace: "pre-wrap",


                        lineHeight: "1.7",


                    }}


                >


                    {viewingQuestion.outputFormat || "Not provided"}


                </div>


            </section>


            <section>


                <h2>Constraints</h2>


                <div


                    style={{


                        whiteSpace: "pre-wrap",


                        lineHeight: "1.7",


                        background: "#1f2937",


                        padding: "15px",


                        borderRadius: "8px",


                    }}


                >


                    {viewingQuestion.constraints || "Not provided"}


                </div>


            </section>


<div>


    <h3>Examples</h3>


    {viewingQuestion.samples?.length > 0 ? (


        viewingQuestion.samples.map((sample, index) => (


            <div


                key={index}


                style={{


                    marginBottom: "20px",


                }}


            >


                <h4>Example {index + 1}</h4>


                <p>Input</p>


                <pre


                    style={{


                        whiteSpace: "pre-wrap",


                    }}


                >


                    {sample.input}


                </pre>


                <p>Output</p>


                <pre


                    style={{


                        whiteSpace: "pre-wrap",


                    }}


                >


                    {sample.output}


                </pre>


                {sample.explanation && (


                    <>


                        <p>Explanation</p>


                        <pre


                            style={{


                                whiteSpace: "pre-wrap",


                            }}


                        >


                            {sample.explanation}


                        </pre>


                    </>


                )}


            </div>


        ))


    ) : viewingQuestion.sampleInput ? (


        <div>


            <h4>Example 1</h4>


            <p>Input</p>


            <pre>


                {viewingQuestion.sampleInput}


            </pre>


            <p>Output</p>


            <pre>


                {viewingQuestion.sampleOutput}


            </pre>


        </div>


    ) : (


        <p>No examples available.</p>


    )}


</div>


            <section>


                <h2>Hint</h2>


                <div


                    style={{


                        whiteSpace: "pre-wrap",


                        lineHeight: "1.7",


                        background: "#1f2937",


                        padding: "15px",


                        borderRadius: "8px",


                    }}


                >


                    {viewingQuestion.hint || "No hint provided"}


                </div>


            </section>


            <section>


                <h2>Test Cases</h2>


                {(viewingQuestion.testCases || []).map(


                    (testCase, index) => (


                        <div


                            key={index}


                            style={{


                                background: "#1f2937",


                                padding: "15px",


                                borderRadius: "8px",


                                marginBottom: "12px",


                            }}


                        >


                            <strong>


                                Test Case {index + 1} —{" "}


                                {testCase.isHidden


                                    ? "Hidden"


                                    : "Visible"}


                            </strong>


                            <h4>Input</h4>


                            <pre


                                style={{


                                    background: "#0b1220",


                                    padding: "10px",


                                    borderRadius: "6px",


                                    whiteSpace: "pre-wrap",


                                }}


                            >


                                {testCase.input}


                            </pre>


                            <h4>Expected Output</h4>


                            <pre


                                style={{


                                    background: "#0b1220",


                                    padding: "10px",


                                    borderRadius: "6px",


                                    whiteSpace: "pre-wrap",


                                }}


                            >


                                {testCase.expectedOutput}


                            </pre>


                        </div>


                    )


                )}


            </section>


            <section>


                <h2>Reference Solution</h2>


                <h3>Explanation</h3>


                <div


                    style={{


                        whiteSpace: "pre-wrap",


                        lineHeight: "1.7",


                        background: "#1f2937",


                        padding: "15px",


                        borderRadius: "8px",


                    }}


                >


                    {viewingQuestion.solution?.explanation ||


                        "No explanation provided"}


                </div>


                <h3>C++ Solution</h3>


                <pre


                    style={{


                        background: "#0b1220",


                        padding: "15px",


                        borderRadius: "8px",


                        overflowX: "auto",


                    }}


                >


                    {viewingQuestion.solution?.code?.cpp ||


                        "No C++ solution"}


                </pre>


                <h3>Java Solution</h3>


                <pre


                    style={{


                        background: "#0b1220",


                        padding: "15px",


                        borderRadius: "8px",


                        overflowX: "auto",


                    }}


                >


                    {viewingQuestion.solution?.code?.java ||


                        "No Java solution"}


                </pre>


                <h3>Python Solution</h3>


                <pre


                    style={{


                        background: "#0b1220",


                        padding: "15px",


                        borderRadius: "8px",


                        overflowX: "auto",


                    }}


                >


                    {viewingQuestion.solution?.code?.python ||


                        "No Python solution"}


                </pre>


            </section>


        </div>


    </div>


)}


            <div


                style={{


                    display: "flex",


                    justifyContent: "space-between",


                    alignItems: "center",


                    marginBottom: "20px",


                }}


            >


                <div>


                    <h2>Coding Questions</h2>


                    <p>


                        Manage coding questions, test cases and solutions.


                    </p>


                </div>


                <button


                    onClick={() => {


                        if (showForm) {


                            resetForm();


                        } else {


                            setForm(emptyForm);


                            setEditingId(null);


                            setShowForm(true);


                        }


                    }}


                >


                    {showForm ? "Close Form" : "+ Add Question"}


                </button>


            </div>


            {showForm && (


            <form


    onSubmit={handleSubmit}


    style={{


        background: "#1e293b",


        borderRadius: "12px",


        padding: "24px",


        marginBottom: "30px",


        maxWidth: "720px",


        display: "flex",


        flexDirection: "column",


        gap: "14px",


    }}


>


                    <h3>


                        {editingId


                            ? "Edit Coding Question"


                            : "Add Coding Question"}


                    </h3>

                    {!editingId && (

                        <p

                            style={{

                                margin: "0 0 4px",

                                color: "#94a3b8",

                                fontSize: "13px",

                            }}

                        >

                            Slug and tags will be generated automatically from

                            the title, topic and description.

                        </p>

                    )}


                    <input


                        name="title"


                        placeholder="Question Title"


                        value={form.title}


                        onChange={handleChange}


                    />


<input


                        name="topic"


                        placeholder="Topic e.g. Arrays"


                        value={form.topic}


                        onChange={handleChange}


                    />


                    <select


                        name="difficulty"


                        value={form.difficulty}


                        onChange={handleChange}


                    >


                        <option value="easy">Easy</option>


                        <option value="medium">Medium</option>


                        <option value="hard">Hard</option>


                    </select>


                    <input


                        type="number"


                        name="points"


                        placeholder="Points"


                        value={form.points}


                        onChange={handleChange}


                    />


<textarea


                        name="description"


                        placeholder="Question Description / Story"


                        value={form.description}


                        onChange={handleChange}


                        rows={8}


                    />


                    <textarea


                        name="inputFormat"


                        placeholder="Input Format"


                        value={form.inputFormat}


                        onChange={handleChange}


                        rows={4}


                    />


                    <textarea


                        name="outputFormat"


                        placeholder="Output Format"


                        value={form.outputFormat}


                        onChange={handleChange}


                        rows={4}


                    />


                    <textarea


                        name="constraints"


                        placeholder="Constraints"


                        value={form.constraints}


                        onChange={handleChange}


                        rows={4}


                    />


<div style={{ marginTop: "10px" }}>


    <h3>Examples</h3>


    {form.samples.map((sample, index) => (


        <div


            key={index}


            style={{


                border: "1px solid #475569",


                padding: "15px",


                marginTop: "15px",


                borderRadius: "8px",


            }}


        >


            <div


                style={{


                    display: "flex",


                    justifyContent: "space-between",


                    alignItems: "center",


                    marginBottom: "10px",


                }}


            >


                <strong>Example {index + 1}</strong>


                {form.samples.length > 1 && (


                    <button


                        type="button"


                        onClick={() => removeSample(index)}


                    >


                        Remove


                    </button>


                )}


            </div>


            <textarea


                placeholder="Sample Input"


                value={sample.input}


                onChange={(e) =>


                    updateSample(


                        index,


                        "input",


                        e.target.value


                    )


                }


                rows={4}


                style={{ width: "100%", marginBottom: "10px" }}


            />


            <textarea


                placeholder="Sample Output"


                value={sample.output}


                onChange={(e) =>


                    updateSample(


                        index,


                        "output",


                        e.target.value


                    )


                }


                rows={4}


                style={{ width: "100%", marginBottom: "10px" }}


            />


            <textarea


                placeholder="Explanation (Optional)"


                value={sample.explanation}


                onChange={(e) =>


                    updateSample(


                        index,


                        "explanation",


                        e.target.value


                    )


                }


                rows={4}


                style={{ width: "100%" }}


            />


        </div>


    ))}


    <button


        type="button"


        onClick={addSample}


        style={{ marginTop: "12px" }}


    >


        + Add Another Example


    </button>


</div>


                    <textarea


                        name="hint"


                        placeholder="Hint"


                        value={form.hint}


                        onChange={handleChange}


                        rows={5}


                    />


                    <div style={{ marginTop: "25px" }}>


                        <h3>Test Cases</h3>


                        <button


                            type="button"


                            onClick={() => addTestCase(false)}


                        >


                            + Add Visible Test Case


                        </button>


                        <button


                            type="button"


                            onClick={() => addTestCase(true)}


                            style={{ marginLeft: "10px" }}


                        >


                            + Add Hidden Test Case


                        </button>


                        {form.testCases.map((testCase, index) => (


                            <div


                                key={index}


                                style={{


                                    border: "1px solid #ddd",


                                    padding: "15px",


                                    marginTop: "15px",


                                    borderRadius: "8px",


                                }}


                            >


                                <strong>


                                    Test Case {index + 1} —{" "}


                                    {testCase.isHidden


                                        ? "Hidden"


                                        : "Visible"}


                                </strong>


                                <textarea


                                    placeholder="Input"


                                    value={testCase.input}


                                    onChange={(e) =>


                                        updateTestCase(


                                            index,


                                            "input",


                                            e.target.value


                                        )


                                    }


                                    rows={3}


                                />


                                <textarea


                                    placeholder="Expected Output"


                                    value={testCase.expectedOutput}


                                    onChange={(e) =>


                                        updateTestCase(


                                            index,


                                            "expectedOutput",


                                            e.target.value


                                        )


                                    }


                                    rows={3}


                                />


                                <button


                                    type="button"


                                    onClick={() => removeTestCase(index)}


                                >


                                    Remove


                                </button>


                            </div>


                        ))}


                    </div>


                    <div style={{ marginTop: "25px" }}>


                        <h3>Reference Solution</h3>


                        <textarea


                            placeholder="Solution Explanation"


                            value={form.solution.explanation}


                            onChange={(e) =>


                                handleExplanationChange(e.target.value)


                            }


                            rows={6}


                        />


                        <textarea


                            placeholder="C++ Solution"


                            value={form.solution.code.cpp}


                            onChange={(e) =>


                                handleSolutionChange(


                                    "cpp",


                                    e.target.value


                                )


                            }


                            rows={12}


                        />


                        <textarea


                            placeholder="Java Solution"


                            value={form.solution.code.java}


                            onChange={(e) =>


                                handleSolutionChange(


                                    "java",


                                    e.target.value


                                )


                            }


                            rows={12}


                        />


                        <textarea


                            placeholder="Python Solution"


                            value={form.solution.code.python}


                            onChange={(e) =>


                                handleSolutionChange(


                                    "python",


                                    e.target.value


                                )


                            }


                            rows={12}


                        />


                    </div>


                    <div style={{ marginTop: "20px" }}>


                        <button type="submit" disabled={loading}>


                            {loading


                                ? "Saving..."


                                : editingId


                                ? "Update Question"


                                : "Save Question"}


                        </button>


                        <button


                            type="button"


                            onClick={resetForm}


                            style={{ marginLeft: "10px" }}


                        >


                            Cancel


                        </button>


                    </div>


                </form>


            )}


            <div


                style={{


                    display: "flex",


                    gap: "10px",


                    marginBottom: "20px",


                }}


            >


                <select


                    value={topicFilter}


                    onChange={(e) => setTopicFilter(e.target.value)}


                >


                    <option value="">All Topics</option>


                    {topics.map((topic) => (


                        <option key={topic} value={topic}>


                            {topic}


                        </option>


                    ))}


                </select>


                <select


                    value={difficultyFilter}


                    onChange={(e) =>


                        setDifficultyFilter(e.target.value)


                    }


                >


                    <option value="">All Difficulties</option>


                    <option value="easy">Easy</option>


                    <option value="medium">Medium</option>


                    <option value="hard">Hard</option>


                </select>


            </div>


            {loading && <p>Loading...</p>}


            {!loading && filteredQuestions.length === 0 && (


                <p>No coding questions found.</p>


            )}


            <div>


                {filteredQuestions.map((question) => (


                    <div


                        key={question._id}


                        style={{


                            border: "1px solid #ddd",


                            borderRadius: "10px",


                            padding: "15px",


                            marginBottom: "12px",


                        }}


                    >


                        <h3>{question.title}</h3>


                        <p>


                            <strong>Topic:</strong>{" "}


                            {question.topic}


                        </p>


                        <p>


                            <strong>Difficulty:</strong>{" "}


                            {question.difficulty}


                        </p>


                        <p>


                            <strong>Points:</strong>{" "}


                            {question.points}


                        </p>


                        <p>


                            <strong>Slug:</strong>{" "}


                            {question.slug}


                        </p>


<button onClick={() => handleView(question)}>


    👁 View


</button>


<button


    onClick={() => {


        console.log("🔥 EDIT BUTTON CLICKED:", question._id);


        handleEdit(question);


    }}


    style={{ marginLeft: "8px" }}


>


    ✏️ Edit


</button>


<button


    onClick={() => handleGenerateTests(question)}


    style={{ marginLeft: "8px" }}


>


    🧪 Generate 25 Tests


</button>


<button


    onClick={() => handleDelete(question._id)}


    style={{ marginLeft: "8px" }}


>


    🗑 Delete


</button>          </div>


                ))}


            </div>


        </div>


    );


};


export default AdminTcsCoding;
