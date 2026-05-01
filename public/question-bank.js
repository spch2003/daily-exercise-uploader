const difficultyEl = document.getElementById("difficulty");
const questionTypeEl = document.getElementById("question_type");
const gradeEl = document.getElementById("grade");
const topicEl = document.getElementById("topic");
const subTypeEl = document.getElementById("sub_type");

const bulkInput = document.getElementById("bulk-input");
const uploadBtn = document.getElementById("upload-btn");
const uploadMessage = document.getElementById("upload-message");

const qEl = document.getElementById("q");
const filterDifficultyEl = document.getElementById("filter_difficulty");
const filterGradeEl = document.getElementById("filter_grade");
const searchBtn = document.getElementById("search-btn");
const searchMessage = document.getElementById("search-message");
const resultList = document.getElementById("result-list");
const adminKeyBtn = document.getElementById("admin-key-btn");
const adminKeyNote = document.getElementById("admin-key-note");

const ADMIN_KEY_STORAGE_KEY = "qb_admin_access_key";
let adminAccessKey = String(localStorage.getItem(ADMIN_KEY_STORAGE_KEY) || "").trim();

function setMessage(el, text, type = "") {
  el.textContent = text;
  el.className = `message ${type}`.trim();
}

function setAdminKeyNote() {
  if (!adminKeyNote) return;
  adminKeyNote.textContent = adminAccessKey ? "Admin key is set." : "Admin key is not set.";
}

function promptAdminKey() {
  const input = window.prompt("Enter admin uploader key:", adminAccessKey || "");
  if (input === null) return false;
  adminAccessKey = String(input || "").trim();
  localStorage.setItem(ADMIN_KEY_STORAGE_KEY, adminAccessKey);
  setAdminKeyNote();
  return Boolean(adminAccessKey);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function addOptions(el, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    el.appendChild(option);
  });
}

function parseBulk(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [latex_code, solution_latex = "", answer_text = ""] = line.split("||").map((part) => part.trim());
      return { latex_code, solution_latex, answer_text };
    })
    .filter((item) => item.latex_code);
}

async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (adminAccessKey) headers["x-admin-key"] = adminAccessKey;

  const response = await fetch(path, {
    ...options,
    headers
  });

  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (_err) {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 403 && data.error && String(data.error).toLowerCase().includes("uploader access denied")) {
      adminAccessKey = "";
      localStorage.removeItem(ADMIN_KEY_STORAGE_KEY);
      setAdminKeyNote();
    }
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  return data;
}

async function loadMeta() {
  const meta = await api("/api/meta");
  addOptions(difficultyEl, meta.difficulties || []);
  addOptions(questionTypeEl, meta.question_types || []);
  addOptions(gradeEl, meta.grades || []);
  addOptions(filterDifficultyEl, meta.difficulties || []);
  addOptions(filterGradeEl, meta.grades || []);

  if (difficultyEl.options.length) difficultyEl.selectedIndex = 0;
  if (questionTypeEl.options.length) questionTypeEl.selectedIndex = 0;
  if (gradeEl.options.length) gradeEl.selectedIndex = 0;
}

function renderResults(items) {
  if (!items.length) {
    resultList.innerHTML = "<p>No questions found.</p>";
    return;
  }

  resultList.innerHTML = items
    .map(
      (item) => `
      <article class="question-card">
        <div class="question-head">
          <strong>#${item.id}</strong>
          <span class="badge">${escapeHtml(item.difficulty || "")}</span>
        </div>
        <div><strong>Type:</strong> ${escapeHtml(item.question_type || "")}</div>
        <div><strong>Grade:</strong> ${escapeHtml(item.grade || "")}</div>
        <div><strong>Topic:</strong> ${escapeHtml(item.topic || "")}</div>
        <div><strong>Sub-topic:</strong> ${escapeHtml(item.sub_type || "")}</div>
        <div class="question-body">${escapeHtml(item.latex_code || "")}</div>
        <button type="button" data-delete-id="${item.id}">Delete</button>
      </article>
    `
    )
    .join("");

  resultList.querySelectorAll("button[data-delete-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.getAttribute("data-delete-id"));
      if (!id) return;
      if (!confirm(`Delete question #${id}?`)) return;

      try {
        await api(`/api/problems/${id}`, { method: "DELETE" });
        setMessage(searchMessage, `Deleted #${id}.`, "success");
        await runSearch();
      } catch (error) {
        setMessage(searchMessage, error.message, "error");
      }
    });
  });
}

async function runSearch() {
  if (!adminAccessKey) {
    const ok = promptAdminKey();
    if (!ok) throw new Error("Admin key is required.");
  }
  const params = new URLSearchParams();
  if (qEl.value.trim()) params.set("q", qEl.value.trim());
  if (filterDifficultyEl.value) params.set("difficulty", filterDifficultyEl.value);
  if (filterGradeEl.value) params.set("grade", filterGradeEl.value);

  const query = params.toString() ? `?${params.toString()}` : "";
  const items = await api(`/api/problems${query}`);
  renderResults(Array.isArray(items) ? items : []);
  setMessage(searchMessage, `Loaded ${Array.isArray(items) ? items.length : 0} question(s).`, "success");
}

uploadBtn.addEventListener("click", async () => {
  const topic = topicEl.value.trim();
  const sub_type = subTypeEl.value.trim();
  if (!topic || !sub_type) {
    setMessage(uploadMessage, "Topic and Sub-topic are required.", "error");
    return;
  }

  const items = parseBulk(bulkInput.value);
  if (!items.length) {
    setMessage(uploadMessage, "No valid lines found.", "error");
    return;
  }

  const confirmText = [
    `Upload ${items.length} question(s) with these labels?`,
    `Difficulty: ${difficultyEl.value || "-"}`,
    `Question Type: ${questionTypeEl.value || "-"}`,
    `Grade: ${gradeEl.value || "-"}`,
    `Topic: ${topic || "-"}`,
    `Sub-topic: ${sub_type || "-"}`
  ].join("\n");
  if (!window.confirm(confirmText)) {
    setMessage(uploadMessage, "Upload cancelled.", "");
    return;
  }

  try {
    const data = await api("/api/problems/batch", {
      method: "POST",
      body: JSON.stringify({
        difficulty: difficultyEl.value,
        question_type: questionTypeEl.value,
        grade: gradeEl.value,
        topic,
        sub_type,
        items
      })
    });

    setMessage(uploadMessage, `Uploaded ${data.inserted || 0} question(s).`, "success");
    topicEl.value = "";
    subTypeEl.value = "";
    await runSearch();
  } catch (error) {
    setMessage(uploadMessage, error.message, "error");
  }
});

searchBtn.addEventListener("click", async () => {
  try {
    await runSearch();
  } catch (error) {
    setMessage(searchMessage, error.message, "error");
  }
});

(async function init() {
  try {
    setAdminKeyNote();
    await loadMeta();
    await runSearch();
  } catch (error) {
    setMessage(uploadMessage, error.message, "error");
  }
})();

if (adminKeyBtn) {
  adminKeyBtn.addEventListener("click", async () => {
    const ok = promptAdminKey();
    if (!ok) return;
    try {
      await runSearch();
      setMessage(searchMessage, "Admin key updated.", "success");
    } catch (error) {
      setMessage(searchMessage, error.message, "error");
    }
  });
}
