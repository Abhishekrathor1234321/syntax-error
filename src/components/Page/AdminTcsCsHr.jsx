import { useEffect, useMemo, useState } from "react";

/*
  Admin panel for CS + HR + Gen AI questions.
  - Add one question (Category -> Difficulty)
  - Bulk import many questions from JSON (paste or upload a file)
  - See, filter and delete existing questions

  Used inside AdminDashboard.jsx:  <AdminTcsCsHr apiBase={TCS_API_BASE} />
  It uses the admin token from localStorage ("token"), the same as the rest of the dashboard.
*/

const CATEGORIES = ["DBMS", "OOPs", "Operating Systems", "Computer Networks", "SQL", "Data Structures", "Gen AI", "HR"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const CHUNK_SIZE = 25;
const PAGE_SIZE = 40;

const DIFF_COLOR = { Easy: "#4ade80", Medium: "#fbbf24", Hard: "#fb7185" };

const fieldStyle = {
  width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: "8px",
  background: "#0f172a", border: "1px solid #334155", color: "white", fontSize: "14px",
};
const labelStyle = { color: "#94a3b8", fontSize: "13px", display: "block", marginBottom: "8px" };
const cardStyle = { background: "#1e293b", borderRadius: "12px", padding: "24px", marginBottom: "24px" };
const primaryBtn = (disabled) => ({
  padding: "12px", borderRadius: "8px", border: "none", color: "white", fontWeight: "700", fontSize: "15px",
  background: disabled ? "#334155" : "#22c55e", cursor: disabled ? "not-allowed" : "pointer",
});

const emptyForm = () => ({
  category: CATEGORIES[0], difficulty: "Easy", question: "", options: ["", "", "", ""],
  correctIndex: 0, hint: "", solution: "", points: 5,
});

function Message({ msg }) {
  if (!msg) return null;
  const good = msg.type === "success";
  return (
    <div style={{
      padding: "12px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "600",
      background: good ? "#14532d" : "#450a0a", color: good ? "#4ade80" : "#f87171", whiteSpace: "pre-line",
    }}>
      {msg.text}
    </div>
  );
}

function AdminTcsCsHr({ apiBase }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [filter, setFilter] = useState("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [formMsg, setFormMsg] = useState(null);

  const [bulkText, setBulkText] = useState("");
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkMsg, setBulkMsg] = useState(null);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    setListError("");
    try {
      const res = await fetch(`${apiBase}/tcs/admin/cshr`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setQuestions(data.questions);
      else setListError(data.message || "Could not load questions");
    } catch (err) {
      setListError("Could not connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const postBulk = async (items) => {
    const res = await fetch(`${apiBase}/tcs/admin/cshr/bulk`, {
      method: "POST", headers: authHeaders(), body: JSON.stringify({ questions: items }),
    });
    return res.json();
  };

  // ---------- add ONE question ----------
  const changeOption = (i, v) => {
    const options = [...form.options];
    options[i] = v;
    setForm({ ...form, options });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormMsg(null);
    if (form.options.some((o) => !o.trim())) {
      setFormMsg({ type: "error", text: "Please fill all 4 options" });
      return;
    }
    setSaving(true);
    try {
      const data = await postBulk([form]);
      if (!data.success) setFormMsg({ type: "error", text: data.message || "Could not save the question" });
      else if (data.inserted === 1) {
        setFormMsg({ type: "success", text: "Question added" });
        setForm({ ...emptyForm(), category: form.category, difficulty: form.difficulty });
        loadQuestions();
      } else if (data.skipped?.length) setFormMsg({ type: "error", text: "This question already exists" });
      else setFormMsg({ type: "error", text: data.failed?.[0]?.message || "Could not save the question" });
    } catch (err) {
      setFormMsg({ type: "error", text: "Could not connect to the server" });
    } finally {
      setSaving(false);
    }
  };

  // ---------- BULK import ----------
  const bulk = useMemo(() => {
    if (!bulkText.trim()) return null;
    try {
      const data = JSON.parse(bulkText);
      const list = Array.isArray(data) ? data : data?.questions;
      if (!Array.isArray(list)) return { error: "The JSON must be a list of questions: [ {...}, {...} ] or { questions: [...] }" };
      const counts = {};
      list.forEach((q) => {
        const c = q?.category || "Unknown";
        counts[c] = (counts[c] || 0) + 1;
      });
      return { list, counts };
    } catch (err) {
      return { error: "This is not valid JSON yet. Paste the full content of the .json file." };
    }
  }, [bulkText]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkText(await file.text());
    setBulkMsg(null);
    e.target.value = "";
  };

  const handleImport = async () => {
    if (!bulk?.list?.length) return;
    setBulkBusy(true);
    setBulkMsg(null);
    let inserted = 0;
    const skipped = [];
    const failed = [];
    try {
      for (let start = 0; start < bulk.list.length; start += CHUNK_SIZE) {
        const data = await postBulk(bulk.list.slice(start, start + CHUNK_SIZE));
        if (!data.success) throw new Error(data.message || "Server rejected the request");
        inserted += data.inserted;
        (data.skipped || []).forEach((s) => skipped.push(`#${start + s.index + 1}: ${s.reason}`));
        (data.failed || []).forEach((f) => failed.push(`#${start + f.index + 1}: ${f.message}`));
      }
      let text = `Imported ${inserted} new question${inserted === 1 ? "" : "s"}.`;
      if (skipped.length) text += `\nSkipped ${skipped.length} (already in the database).`;
      if (failed.length) text += `\n${failed.length} could not be imported:\n${failed.slice(0, 10).join("\n")}${failed.length > 10 ? "\n..." : ""}`;
      setBulkMsg({ type: failed.length ? "error" : "success", text });
      if (!failed.length) setBulkText("");
    } catch (err) {
      setBulkMsg({ type: "error", text: `Stopped early. ${err.message}\nAlready imported before the problem: ${inserted}.` });
    } finally {
      setBulkBusy(false);
      loadQuestions();
    }
  };

  // ---------- list / delete ----------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      const res = await fetch(`${apiBase}/tcs/admin/cshr/${id}`, { method: "DELETE", headers: authHeaders() });
      const data = await res.json();
      if (data.success) setQuestions((qs) => qs.filter((q) => q._id !== id));
      else setListError(data.message || "Could not delete the question");
    } catch (err) {
      setListError("Could not connect to the server");
    }
  };

  const tabs = ["All", ...CATEGORIES];
  const countFor = (t) => (t === "All" ? questions.length : questions.filter((q) => q.category === t).length);
  const shown = questions.filter((q) => filter === "All" || q.category === filter);

  return (
    <div>
      {/* ---------- Add one question ---------- */}
      <form onSubmit={handleAdd} style={{ ...cardStyle, maxWidth: "720px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <h2 style={{ color: "white", margin: 0 }}>Add a new CS + HR + Gen AI question</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
          <div>
            <label style={labelStyle}>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={fieldStyle}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Difficulty</label>
            <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} style={fieldStyle}>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Question</label>
          <textarea value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required rows={3} style={fieldStyle} />
        </div>

        <div>
          <label style={labelStyle}>Options (select the radio button next to the correct one)</label>
          {form.options.map((opt, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <input type="radio" name="cshrCorrect" checked={form.correctIndex === i} onChange={() => setForm({ ...form, correctIndex: i })} />
              <input value={opt} onChange={(e) => changeOption(i, e.target.value)} placeholder={`Option ${i + 1}${form.correctIndex === i ? " (correct)" : ""}`} required style={{ ...fieldStyle, flex: 1 }} />
            </div>
          ))}
        </div>

        <div>
          <label style={labelStyle}>Hint (optional, always visible to students before they answer)</label>
          <input value={form.hint} onChange={(e) => setForm({ ...form, hint: e.target.value })} style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}>Solution / Explanation (shown after submit)</label>
          <textarea value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} required rows={3} style={fieldStyle} />
        </div>
        <div style={{ maxWidth: "200px" }}>
          <label style={labelStyle}>Points</label>
          <input type="number" min={1} value={form.points} onChange={(e) => setForm({ ...form, points: Number(e.target.value) })} style={fieldStyle} />
        </div>

        <button type="submit" disabled={saving} style={primaryBtn(saving)}>{saving ? "Saving..." : "Add Question"}</button>
        <Message msg={formMsg} />
      </form>

      {/* ---------- Bulk import ---------- */}
      <div style={{ ...cardStyle, maxWidth: "720px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <h2 style={{ color: "white", margin: 0 }}>Bulk import from JSON</h2>
        <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
          Upload the .json file or paste its content. Questions that already exist are skipped, so importing the same file twice is safe.
        </p>
        <input type="file" accept=".json,application/json" onChange={handleFile} style={{ color: "#94a3b8", fontSize: "13px" }} />
        <textarea value={bulkText} onChange={(e) => { setBulkText(e.target.value); setBulkMsg(null); }} rows={6} placeholder='{ "questions": [ { "category": "DBMS", "question": "...", ... } ] }' style={{ ...fieldStyle, fontFamily: "monospace", fontSize: "12px" }} />
        {bulk?.error && <div style={{ color: "#f87171", fontSize: "13px" }}>{bulk.error}</div>}
        {bulk?.list && (
          <div style={{ color: "#4ade80", fontSize: "13px" }}>
            {bulk.list.length} question{bulk.list.length === 1 ? "" : "s"} found:{" "}
            {Object.entries(bulk.counts).map(([k, v]) => `${k} ${v}`).join(", ")}
          </div>
        )}
        <button type="button" onClick={handleImport} disabled={bulkBusy || !bulk?.list?.length} style={primaryBtn(bulkBusy || !bulk?.list?.length)}>
          {bulkBusy ? "Importing..." : "Import Questions"}
        </button>
        <Message msg={bulkMsg} />
      </div>

      {/* ---------- Existing questions ---------- */}
      <div style={{ ...cardStyle, maxWidth: "820px" }}>
        <h2 style={{ color: "white", marginBottom: "16px" }}>Existing CS + HR + Gen AI questions ({questions.length})</h2>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
          {tabs.map((t) => (
            <button key={t} type="button" onClick={() => { setFilter(t); setVisible(PAGE_SIZE); }} style={{
              padding: "6px 14px", borderRadius: "999px", border: "1px solid #334155", cursor: "pointer", fontSize: "13px", fontWeight: "600",
              background: filter === t ? "#3b82f6" : "transparent", color: "white",
            }}>
              {t} ({countFor(t)})
            </button>
          ))}
        </div>

        {listError && <div style={{ color: "#f87171", marginBottom: "12px" }}>{listError}</div>}
        {loading ? (
          <p className="admin-empty">Loading...</p>
        ) : shown.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {shown.slice(0, visible).map((q) => (
              <div key={q._id} style={{ border: "1px solid #334155", borderRadius: "8px", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "12px", color: "#94a3b8", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <span>{q.category}</span>
                    <span style={{ color: DIFF_COLOR[q.difficulty] || DIFF_COLOR.Medium, fontWeight: 700 }}>{q.difficulty || "Medium"}</span>
                    <span>{q.points} pts</span>
                  </div>
                  <p style={{ margin: "4px 0", color: "white", whiteSpace: "pre-line", wordBreak: "break-word" }}>{q.question}</p>
                  <p style={{ margin: 0, fontSize: "13px", color: "#4ade80" }}>Correct: {q.options?.[q.correctIndex]}</p>
                </div>
                <button type="button" onClick={() => handleDelete(q._id)} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #ef4444", background: "transparent", color: "#ef4444", cursor: "pointer", whiteSpace: "nowrap", fontSize: "13px" }}>
                  Delete
                </button>
              </div>
            ))}
            {shown.length > visible && (
              <button type="button" onClick={() => setVisible(visible + PAGE_SIZE)} style={{ padding: "8px", borderRadius: "8px", border: "1px solid #334155", background: "transparent", color: "white", cursor: "pointer" }}>
                Show more ({shown.length - visible} left)
              </button>
            )}
          </div>
        ) : (
          <p className="admin-empty">No questions here yet.</p>
        )}
      </div>
    </div>
  );
}

export default AdminTcsCsHr;