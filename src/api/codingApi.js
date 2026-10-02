import { API_BASE } from "../config";

// login ke baad localStorage me "token" key se JWT save hota hai (AuthPage.jsx dekh ke)
function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// sidebar ke liye — topic + difficulty ke count
export async function getTopics() {
  const res = await fetch(`${API_BASE}/coding/topics`);
  return res.json();
}

// topic/difficulty se filter karke question list
export async function getQuestions(topic, difficulty) {
  const params = new URLSearchParams();
  if (topic) params.set("topic", topic);
  if (difficulty) params.set("difficulty", difficulty);
  const query = params.toString();
  const res = await fetch(`${API_BASE}/coding/questions${query ? `?${query}` : ""}`);
  return res.json();
}

// ek single question ki puri detail
export async function getQuestion(slug) {
  const res = await fetch(`${API_BASE}/coding/question/${slug}`);
  return res.json();
}

// "Run" button — sample tests pe
export async function runCode(slug, code, language) {
  const res = await fetch(`${API_BASE}/coding/question/${slug}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ code, language }),
  });
  return res.json();
}

// "Submit" button — sample + hidden tests pe, points milenge
export async function submitCode(slug, code, language) {
  const res = await fetch(`${API_BASE}/coding/question/${slug}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ code, language }),
  });
  return res.json();
}

// coding leaderboard
export async function getLeaderboard() {
  const res = await fetch(`${API_BASE}/coding/leaderboard`);
  return res.json();
}









// -----------------------------------------
// Coding Progress / Saved Code Helpers
// -----------------------------------------

function getCodingUserKey() {
  const token = localStorage.getItem("token");

  if (!token) {
    return "guest";
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    const userId =
      payload.id ||
      payload._id ||
      payload.userId ||
      payload.sub ||
      payload.email;

    return userId ? String(userId) : token;
  } catch {
    return token;
  }
}

export function getSavedCode(slug, language) {
  const userKey = getCodingUserKey();

  const key = `coding_code_${userKey}_${slug}_${language}`;

  return localStorage.getItem(key);
}

export function saveCode(slug, language, code) {
  const userKey = getCodingUserKey();

  const key = `coding_code_${userKey}_${slug}_${language}`;

  localStorage.setItem(key, code);
}

export function isQuestionCompleted(slug) {
  const userKey = getCodingUserKey();

  const key = `coding_completed_${userKey}_${slug}`;

  return localStorage.getItem(key) === "true";
}

export function markQuestionCompleted(slug) {
  const userKey = getCodingUserKey();

  const key = `coding_completed_${userKey}_${slug}`;

  localStorage.setItem(key, "true");
}



// -----------------------------------------
// MongoDB Coding Progress
// -----------------------------------------

export async function getCodingProgress() {
  const res = await fetch(
    `${API_BASE}/coding/progress`,
    {
      headers: {
        ...authHeaders(),
      },
    }
  );

  return res.json();
}


export async function getQuestionProgress(slug) {
  const res = await fetch(
    `${API_BASE}/coding/progress/${slug}`,
    {
      headers: {
        ...authHeaders(),
      },
    }
  );

  return res.json();
}


export async function saveCodingProgress(
  slug,
  language,
  code
) {
  const res = await fetch(
    `${API_BASE}/coding/progress/${slug}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        language,
        code,
      }),
    }
  );

  return res.json();
}


export async function completeCodingQuestion(
  slug,
  language,
  code
) {
  const res = await fetch(
    `${API_BASE}/coding/progress/${slug}/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        language,
        code,
      }),
    }
  );

  return res.json();
}