const message = document.getElementById("form-message");
const list = document.getElementById("problem-list");

const difficultySelect = document.getElementById("difficulty");
const questionTypeSelect = document.getElementById("question_type");
const gradeSelect = document.getElementById("grade");
const topicInput = document.getElementById("topic");
const subTypeInput = document.getElementById("sub_type");
const topicOptions = document.getElementById("topic-options");
const subtopicOptions = document.getElementById("subtopic-options");

const filterDifficulty = document.getElementById("filter_difficulty");
const filterGrade = document.getElementById("filter_grade");
const filterTopic = document.getElementById("filter_topic");
const filterSubType = document.getElementById("filter_sub_type");
const filterTopicOptions = null;
const filterSubtopicOptions = null;
const searchQ = document.getElementById("search_q");
const searchBtn = document.getElementById("search-btn");
const hideResultsBtn = document.getElementById("hide-results-btn");
const refreshBtn = document.getElementById("refresh-btn");

const batchLabelField = document.getElementById("batch-label-field");
const batchLabelSelectWrap = document.getElementById("batch-label-select-wrap");
const batchLabelSelect = document.getElementById("batch-label-select");
const batchLabelTextWrap = document.getElementById("batch-label-text-wrap");
const batchLabelText = document.getElementById("batch-label-text");
const selectAllBtn = document.getElementById("select-all-btn");
const selectNoneBtn = document.getElementById("select-none-btn");
const applyBatchLabelBtn = document.getElementById("apply-batch-label-btn");
const batchLabelMessage = document.getElementById("batch-label-message");

const bulkVariantsInput = document.getElementById("bulk-variants-input");
const loadBulkBtn = document.getElementById("load-bulk-btn");
const generateSolutionsBtn = document.getElementById("generate-solutions-btn");
const uploadBatchBtn = document.getElementById("upload-batch-btn");
const clearGeneratedBtn = document.getElementById("clear-generated-btn");
const generatedList = document.getElementById("generated-list");
const generatorMessage = document.getElementById("generator-message");

const goTopBtn = document.getElementById("go-top-btn");

const ADMIN_KEY_STORAGE_KEY = "qb_admin_access_key";
let adminAccessKey = String(localStorage.getItem(ADMIN_KEY_STORAGE_KEY) || "").trim();

let generatedItems = [];
let currentSearchIds = [];
const selectedProblemIds = new Set();
let difficultyValues = [];
let gradeValues = [];
let questionTypeValues = [];
let allProblemsForFilters = [];
let filterOptionsRequestId = 0;
const knownTopics = new Set();
const knownSubtopics = new Set();
const topicToSubtopics = new Map();
const RELABEL_TOPIC_OPTIONS_ID = "relabel-topic-options";
const RELABEL_SUBTOPIC_OPTIONS_ID = "relabel-subtopic-options";

function setMessage(text, type = "") {
  message.textContent = text;
  message.className = `message ${type}`.trim();
}

function setGeneratorMessage(text, type = "") {
  generatorMessage.textContent = text;
  generatorMessage.className = `message ${type}`.trim();
}

function setBatchLabelMessage(text, type = "") {
  batchLabelMessage.textContent = text;
  batchLabelMessage.className = `message ${type}`.trim();
}

function promptAdminKeyIfNeeded() {
  if (adminAccessKey) return true;
  const input = window.prompt("Enter admin uploader key:");
  if (input === null) return false;
  adminAccessKey = String(input || "").trim();
  localStorage.setItem(ADMIN_KEY_STORAGE_KEY, adminAccessKey);
  return Boolean(adminAccessKey);
}

async function fetchJsonWithAdminKey(url, options = {}) {
  if (!promptAdminKeyIfNeeded()) {
    throw new Error("Admin key is required.");
  }
  const headers = {
    ...(options.headers || {}),
    "x-admin-key": adminAccessKey
  };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = String(data?.error || `Request failed (${res.status})`);
    if (res.status === 403 && /uploader access denied/i.test(msg)) {
      adminAccessKey = "";
      localStorage.removeItem(ADMIN_KEY_STORAGE_KEY);
    }
    throw new Error(msg);
  }
  return data;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function addOptions(select, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function sortedValues(values) {
  return [...new Set([...values].map((value) => String(value || "").trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "en", { numeric: true, sensitivity: "base" })
  );
}

function renderSelectOptions(select, values, allLabel = "All", options = {}) {
  if (!select) return;
  const current = String(select.value || "").trim();
  const optionValues = sortedValues(values);
  select.innerHTML = `<option value="">${escapeHtml(allLabel)}</option>${optionValues.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")}`;
  if (options.clearValue) {
    select.value = "";
    return;
  }
  select.value = current && optionValues.includes(current) ? current : "";
}

function renderDatalist(datalistEl, values) {
  const sorted = sortedValues(values);
  datalistEl.innerHTML = sorted.map((value) => `<option value="${escapeHtml(value)}"></option>`).join("");
}

function ensureDatalistElement(id) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("datalist");
    el.id = id;
    document.body.appendChild(el);
  }
  return el;
}

function upsertPairMap(mainMap, key, value) {
  if (!mainMap.has(key)) mainMap.set(key, new Set());
  mainMap.get(key).add(value);
}

function findTopicKeyInsensitive(topicValue) {
  const topic = String(topicValue || "").trim();
  if (!topic) return "";
  if (topicToSubtopics.has(topic)) return topic;
  const lower = topic.toLowerCase();
  for (const key of topicToSubtopics.keys()) {
    if (String(key || "").toLowerCase() === lower) return key;
  }
  return "";
}

function updateSubtopicDatalistForTopic(topicValue) {
  const topicKey = findTopicKeyInsensitive(topicValue);
  if (topicKey && topicToSubtopics.has(topicKey)) {
    renderDatalist(subtopicOptions, topicToSubtopics.get(topicKey));
    return;
  }
  subtopicOptions.innerHTML = "";
}

function rebuildAutocompleteIndex(problems) {
  knownTopics.clear();
  knownSubtopics.clear();
  topicToSubtopics.clear();
  allProblemsForFilters = Array.isArray(problems) ? problems : [];

  for (const p of allProblemsForFilters) {
    const topic = String(p.topic || "").trim();
    const sub = String(p.sub_type || "").trim();
    if (topic) knownTopics.add(topic);
    if (sub) knownSubtopics.add(sub);
    if (topic && sub) upsertPairMap(topicToSubtopics, topic, sub);
  }

  renderDatalist(topicOptions, knownTopics);
  updateSubtopicDatalistForTopic(topicInput.value.trim());
  updateSearchFilterOptions();
  updateRelabelAutocomplete();
}

function tryPairAutofill() {
  const topic = topicInput.value.trim();
  const sub = subTypeInput.value.trim();
  if (topic && !sub && topicToSubtopics.has(topic)) {
    const subs = [...topicToSubtopics.get(topic)];
    if (subs.length === 1) subTypeInput.value = subs[0];
  }
}

function updateFilterSubtopicDatalistForTopic(topicValue) {
  const topicKey = findTopicKeyInsensitive(topicValue);
  if (topicKey && topicToSubtopics.has(topicKey)) {
    renderSelectOptions(filterSubType, topicToSubtopics.get(topicKey), "All");
    return;
  }
  renderSelectOptions(filterSubType, knownSubtopics, "All");
}

function problemMatchesSearchFilters(problem, omitField = "") {
  const difficulty = String(problem?.difficulty || "").trim();
  const grade = String(problem?.grade || "").trim();
  const topic = String(problem?.topic || "").trim();
  const subType = String(problem?.sub_type || "").trim();
  const latex = String(problem?.latex_code || "").trim();
  const selectedDifficulty = String(filterDifficulty?.value || "").trim();
  const selectedGrade = String(filterGrade?.value || "").trim();
  const selectedTopic = String(filterTopic?.value || "").trim().toLowerCase();
  const selectedSubType = String(filterSubType?.value || "").trim().toLowerCase();
  const selectedSearch = String(searchQ?.value || "").trim().toLowerCase();

  if (omitField !== "difficulty" && selectedDifficulty && difficulty !== selectedDifficulty) return false;
  if (omitField !== "grade" && selectedGrade && grade !== selectedGrade) return false;
  if (omitField !== "topic" && selectedTopic && !topic.toLowerCase().includes(selectedTopic)) return false;
  if (omitField !== "sub_type" && selectedSubType && !subType.toLowerCase().includes(selectedSubType)) return false;
  if (
    omitField !== "q" &&
    selectedSearch &&
    ![latex, topic, subType].some((value) => String(value || "").toLowerCase().includes(selectedSearch))
  ) {
    return false;
  }
  return true;
}

function valuesForSearchFilter(field) {
  return sortedValues(
    allProblemsForFilters
      .filter((problem) => problemMatchesSearchFilters(problem, field))
      .map((problem) => problem?.[field])
  );
}

function searchFilterParams() {
  const params = new URLSearchParams();
  if (filterDifficulty.value) params.set("difficulty", filterDifficulty.value);
  if (filterGrade.value) params.set("grade", filterGrade.value);
  if (filterTopic.value) params.set("topic", filterTopic.value);
  if (filterSubType.value) params.set("sub_type", filterSubType.value);
  if (searchQ.value.trim()) params.set("q", searchQ.value.trim());
  return params;
}

async function fetchSearchFilterOptions() {
  const params = searchFilterParams();
  const query = params.toString() ? `?${params.toString()}` : "";
  return fetchJsonWithAdminKey(`/api/problems/filter-options${query}`);
}

async function updateSearchFilterOptions(changedField = "") {
  const clearTopic = changedField === "grade" || changedField === "difficulty";
  const clearSubType = clearTopic || changedField === "topic";
  if (clearTopic) filterTopic.value = "";
  if (clearSubType) filterSubType.value = "";

  const requestId = ++filterOptionsRequestId;
  let options = null;
  try {
    options = await fetchSearchFilterOptions();
  } catch (_error) {
    if (!allProblemsForFilters.length) return;
    options = {
      grade: valuesForSearchFilter("grade"),
      difficulty: valuesForSearchFilter("difficulty"),
      topic: valuesForSearchFilter("topic"),
      sub_type: valuesForSearchFilter("sub_type")
    };
  }
  if (requestId !== filterOptionsRequestId) return;

  if (changedField !== "grade") renderSelectOptions(filterGrade, options.grade || [], "All");
  if (changedField !== "difficulty") renderSelectOptions(filterDifficulty, options.difficulty || [], "All");
  renderSelectOptions(filterTopic, options.topic || [], "All", { clearValue: clearTopic });
  renderSelectOptions(filterSubType, options.sub_type || [], "All", { clearValue: clearSubType });

  if (filterTopic.value.trim()) {
    const topicExists = (options.topic || []).some((topic) => topic.toLowerCase() === filterTopic.value.trim().toLowerCase());
    if (!topicExists && changedField !== "topic") filterTopic.value = "";
  }
  if (filterSubType.value.trim()) {
    const subTypeExists = (options.sub_type || []).some((subType) => subType.toLowerCase() === filterSubType.value.trim().toLowerCase());
    if (!subTypeExists && changedField !== "sub_type") filterSubType.value = "";
  }
}

function trySearchPairAutofill() {
  const topic = filterTopic.value.trim();
  const sub = filterSubType.value.trim();
  const topicKey = findTopicKeyInsensitive(topic);
  if (topicKey && !sub && topicToSubtopics.has(topicKey)) {
    const subs = [...topicToSubtopics.get(topicKey)];
    if (subs.length === 1) filterSubType.value = subs[0];
  }
}

function updateRelabelAutocomplete() {
  const relabelTopicOptions = ensureDatalistElement(RELABEL_TOPIC_OPTIONS_ID);
  const relabelSubtopicOptions = ensureDatalistElement(RELABEL_SUBTOPIC_OPTIONS_ID);
  renderDatalist(relabelTopicOptions, knownTopics);

  const topicContext = filterTopic.value.trim() || topicInput.value.trim();
  if (topicContext && topicToSubtopics.has(topicContext)) {
    renderDatalist(relabelSubtopicOptions, topicToSubtopics.get(topicContext));
  } else {
    renderDatalist(relabelSubtopicOptions, knownSubtopics);
  }

  if (batchLabelField.value === "topic") {
    batchLabelText.setAttribute("list", RELABEL_TOPIC_OPTIONS_ID);
  } else if (batchLabelField.value === "sub_type") {
    batchLabelText.setAttribute("list", RELABEL_SUBTOPIC_OPTIONS_ID);
    if (!batchLabelText.value.trim() && topicContext && topicToSubtopics.has(topicContext)) {
      const subs = [...topicToSubtopics.get(topicContext)];
      if (subs.length === 1) batchLabelText.value = subs[0];
    }
  } else {
    batchLabelText.removeAttribute("list");
  }
}

async function loadAutocompleteData() {
  const problems = await fetchJsonWithAdminKey("/api/problems");
  rebuildAutocompleteIndex(Array.isArray(problems) ? problems : []);
}

function typesetElement(element) {
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([element]).catch(() => {});
  }
  processTikzAsync();
}

function processTikzAsync() {
  const run = () => {
    try {
      if (window.tikzjax && typeof window.tikzjax.process === "function") {
        window.tikzjax.process();
      } else if (window.TikzJax && typeof window.TikzJax.process === "function") {
        window.TikzJax.process();
      }
    } catch (_error) {}
  };
  run();
  setTimeout(run, 50);
  setTimeout(run, 250);
}

function formatChoicesByLine(text) {
  return String(text || "").replace(/\s+([A-H]\.)\s+/g, "\n$1 ");
}

function toBase64Url(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_");
}

function buildKrokiTikzUrl(tikzSource) {
  if (!window.pako || typeof window.pako.deflate !== "function") return "";
  const source = String(tikzSource || "").trim();
  if (!source) return "";

  const hasDocument = /\\begin\{document\}/.test(source);
  const latexDoc = hasDocument
    ? source
    : [
        "\\documentclass[tikz,border=2pt]{standalone}",
        "\\usepackage[utf8]{inputenc}",
        "\\usepackage{amsmath}",
        "\\usepackage{amssymb}",
        "\\DeclareUnicodeCharacter{2713}{\\ensuremath{\\checkmark}}",
        "\\DeclareUnicodeCharacter{2714}{\\ensuremath{\\checkmark}}",
        "\\DeclareUnicodeCharacter{2717}{\\ensuremath{\\times}}",
        "\\DeclareUnicodeCharacter{2718}{\\ensuremath{\\times}}",
        "\\DeclareUnicodeCharacter{00D7}{\\ensuremath{\\times}}",
        "\\usepackage{tikz}",
        "\\usetikzlibrary{angles,quotes,calc,arrows.meta,positioning,decorations.pathreplacing}",
        "\\begin{document}",
        source,
        "\\end{document}"
      ].join("\n");

  const utf8 = new TextEncoder().encode(latexDoc);
  const compressed = window.pako.deflate(utf8, { level: 9 });
  const encoded = toBase64Url(compressed);
  return `https://kroki.io/tikz/svg/${encoded}`;
}

function extractFigures(text) {
  const raw = String(text || "");
  const figureUrls = [];
  const tikzBlocks = [];

  let withoutToken = raw.replace(/\[FIGURE:([^\]]+)\]/gi, (_m, url) => {
    figureUrls.push(String(url || "").trim());
    return " ";
  });

  withoutToken = withoutToken.replace(/\[TIKZ\]([\s\S]*?)\[\/TIKZ\]/gi, (_m, block) => {
    const trimmed = String(block || "").trim();
    if (trimmed) {
      // Support one-line bulk format where internal newlines are encoded as literal "\n".
      // Important: do not break LaTeX commands that start with \n (e.g. \node, \neq).
      tikzBlocks.push(trimmed.replace(/\\n(?![A-Za-z])/g, "\n"));
    }
    return " ";
  });

  return {
    cleanedText: formatChoicesByLine(withoutToken).replace(/\s+\n/g, "\n").trim(),
    figureUrls: figureUrls.filter((url) => /^https?:\/\/\S+$/i.test(url)),
    tikzBlocks
  };
}

function sanitizeTikzBlock(block) {
  let s = String(block || "");
  // Renderer-safe: avoid \text{...} inside TikZ labels.
  s = s.replace(/\\text\{([^}]*)\}/g, "$1");
  // Fix malformed node labels: \node[...] at (...) $...$; -> \node[...] at (...) {$...$};
  s = s.replace(
    /\\node(\[[^\]]*\])?\s*at\s*\(([^)]*)\)\s*\$([^$]+)\$\s*;/g,
    (_m, opt = "", coord, label) => `\\node${opt} at (${coord}) {$${label}$};`
  );
  // Keep math-mode labels as math-mode labels; bare \theta in text mode breaks TikZ renderers.
  s = s.replace(
    /\\node(\[[^\]]*\])?\s*at\s*\(([^)]*)\)\s*\{\$([^$]+)\$\}\s*;/g,
    (_m, opt = "", coord, label) => `\\node${opt} at (${coord}) {$${label}$};`
  );
  // TikZ/LaTeX does not accept Unicode tick/cross marks directly.
  s = s.replace(
    /\\node(\[[^\]]*\])?\s*at\s*\(([^)]*)\)\s*\{([^{}]*)\}\s*;/g,
    (_m, opt = "", coord, label) => {
      const normalized = String(label || "")
        .trim()
        .replace(/[✓✔]/g, "\\checkmark")
        .replace(/[✗✘×]/g, "\\times");
      if (/^\\(?:checkmark|times)$/.test(normalized)) {
        return `\\node${opt} at (${coord}) {$${normalized}$};`;
      }
      return `\\node${opt} at (${coord}) {${label}};`;
    }
  );
  return s;
}

function hasMathDelimiter(text) {
  const s = String(text || "");
  return /\$[^$]+\$|\$\$[\s\S]*?\$\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/.test(s);
}

function looksLikeLatex(text) {
  const s = String(text || "");
  return /\\[a-zA-Z]+|[_^]|\\frac|\\sqrt|\\left|\\right/.test(s);
}

function textWordCount(text) {
  return (String(text || "").match(/[A-Za-z]{2,}/g) || []).length;
}

function renderEquationBlock(text) {
  return `\\(${escapeHtml(String(text || "").trim())}\\)`;
}

function containsNarrativeCue(text) {
  return /\b(since|therefore|thus|statement|true|false|quadrant|given|wait|corrected|rewrite|cleanly|only)\b/i.test(
    String(text || "")
  );
}

function isMathishExpr(text) {
  const s = String(text || "").trim();
  if (!s) return false;
  if (looksLikeLatex(s)) return true;
  if (/[_^]/.test(s)) return true;
  if (/[=<>+\-*/]/.test(s) && /(?:\b[a-zA-Z]\b|\d)/.test(s)) return true;
  return false;
}

function renderChunk(chunk) {
  const trimmed = String(chunk || "").trim();
  if (!trimmed) return escapeHtml(String(chunk || ""));

  const connectorMatch = trimmed.match(/^(\s*(?:If|Since|Then|So|For|When|Given|Hence|Thus|Let|Therefore)\s+)([\s\S]*)$/i);
  if (connectorMatch) {
    const lead = connectorMatch[1];
    const rest = connectorMatch[2].trim();
    if (isMathishExpr(rest) && textWordCount(rest) <= 2) {
      return `${escapeHtml(lead)}${renderEquationBlock(rest)}`;
    }
    return escapeHtml(trimmed);
  }

  if (isMathishExpr(trimmed) && !containsNarrativeCue(trimmed)) {
    return renderEquationBlock(trimmed);
  }
  return escapeHtml(trimmed);
}

function renderNarrativeMixedLine(raw) {
  const chunks = String(raw || "").split(/([,.;]\s*)/);
  let out = "";

  for (const part of chunks) {
    if (!part) continue;
    if (/^[,.;]\s*$/.test(part)) {
      out += escapeHtml(part);
      continue;
    }
    out += renderChunk(part);
  }
  return out;
}

function renderLineWithAutoMath(line) {
  const raw = String(line || "");
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (hasMathDelimiter(trimmed)) return escapeHtml(raw);
  if (!looksLikeLatex(trimmed)) return escapeHtml(raw);

  if (/^Expression becomes:?$/i.test(trimmed)) return escapeHtml(trimmed);

  const simplifyLead = raw.match(/^(\s*Simplify\s+)([\s\S]+)$/i);
  if (simplifyLead && isMathishExpr(simplifyLead[2])) {
    return `${escapeHtml(simplifyLead[1])}${renderEquationBlock(simplifyLead[2])}`;
  }

  const optionMatch = raw.match(/^(\s*(?:[A-H]|[IVX]+)\.\s*)([\s\S]*)$/i);
  if (optionMatch) {
    const prefix = optionMatch[1];
    const body = optionMatch[2].trim();
    if (isMathishExpr(body) && !containsNarrativeCue(body)) {
      return `${escapeHtml(prefix)}${renderEquationBlock(body)}`;
    }
    return `${escapeHtml(prefix)}${renderNarrativeMixedLine(body)}`;
  }

  const leadingCondition = raw.match(/^(\s*(?:If|Since|Given|When|For)\s+)([^,]+)([\s\S]*)$/i);
  if (leadingCondition && isMathishExpr(leadingCondition[2])) {
    const lead = escapeHtml(leadingCondition[1]);
    const cond = renderEquationBlock(leadingCondition[2]);
    const tail = leadingCondition[3] ? renderNarrativeMixedLine(leadingCondition[3]) : "";
    return `${lead}${cond}${tail}`;
  }

  if (!containsNarrativeCue(trimmed)) {
    return renderEquationBlock(trimmed);
  }

  if (containsNarrativeCue(trimmed) || textWordCount(trimmed) >= 6) {
    return renderNarrativeMixedLine(raw);
  }

  return renderEquationBlock(trimmed);
}

function renderTextWithAutoMath(text) {
  // Convert literal "\n" to line break, but do NOT break LaTeX commands like \node or \neq.
  const normalized = String(text || "").replace(/\\n(?![A-Za-z])/g, "\n");
  return normalized
    .split(/\r?\n/)
    .map((line) => renderLineWithAutoMath(line))
    .join("<br>");
}

function renderMathAndFigures(target, rawText) {
  const { cleanedText, figureUrls, tikzBlocks } = extractFigures(rawText);
  target.innerHTML = "";

  if (cleanedText) {
    const textDiv = document.createElement("div");
    textDiv.className = "math-content";
    textDiv.innerHTML = renderTextWithAutoMath(cleanedText);
    target.appendChild(textDiv);
  }

  if (figureUrls.length) {
    const figureList = document.createElement("div");
    figureList.className = "figure-list";
    for (const url of figureUrls) {
      const img = document.createElement("img");
      img.className = "figure-img";
      img.src = url;
      img.alt = "Question figure";
      img.loading = "lazy";
      figureList.appendChild(img);
    }
    target.appendChild(figureList);
  }

  if (tikzBlocks.length) {
    const tikzList = document.createElement("div");
    tikzList.className = "figure-list";
    for (const block of tikzBlocks) {
      const safeBlock = sanitizeTikzBlock(block);
      const holder = document.createElement("div");
      holder.className = "tikz-figure";
      const krokiUrl = buildKrokiTikzUrl(safeBlock);
      if (krokiUrl) {
        const img = document.createElement("img");
        img.className = "figure-img";
        img.src = krokiUrl;
        img.alt = "TikZ figure";
        img.loading = "lazy";
        let settled = false;
        const renderWithTikzJax = () => {
          if (settled) return;
          settled = true;
          img.remove();
          const script = document.createElement("script");
          script.type = "text/tikz";
          script.textContent = safeBlock;
          holder.appendChild(script);
          setTimeout(() => {
            const hasSvg = holder.querySelector("svg");
            if (!hasSvg) {
              const warn = document.createElement("div");
              warn.className = "message error";
              warn.textContent = "TikZ preview failed. Please use [FIGURE:https://...] image link for this question.";
              holder.appendChild(warn);
            }
          }, 700);
          processTikzAsync();
        };
        img.onload = () => {
          settled = true;
        };
        img.onerror = () => {
          renderWithTikzJax();
        };
        // Some environments keep cross-origin image requests pending forever.
        // Force fallback instead of leaving a blank figure box.
        setTimeout(() => {
          if (!settled) renderWithTikzJax();
        }, 2500);
        holder.appendChild(img);
      } else {
        const script = document.createElement("script");
        script.type = "text/tikz";
        script.textContent = safeBlock;
        holder.appendChild(script);
      }
      tikzList.appendChild(holder);
    }
    target.appendChild(tikzList);
  }
}

function buildVariant(question, solution = "", answer = "") {
  return {
    latex_code: String(question || "").trim(),
    solution_latex: String(solution || "").trim(),
    answer_text: String(answer || "").trim(),
    approved: true
  };
}

function parseLineFormat(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.includes("||"))
    .map((line) => {
      const [question, solution = "", answer = ""] = line.split("||").map((x) => x.trim());
      return buildVariant(question, solution, answer);
    })
    .filter((item) => item.latex_code);
}

function parseBlockFormat(text) {
  const blocks = String(text || "")
    .split(/\r?\n\s*\r?\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const first = block.indexOf("||");
      if (first < 0) return null;
      const second = block.indexOf("||", first + 2);
      if (second < 0) {
        const q = block.slice(0, first);
        const s = block.slice(first + 2);
        return buildVariant(q, s, "");
      }
      const q = block.slice(0, first);
      const s = block.slice(first + 2, second);
      const a = block.slice(second + 2);
      return buildVariant(q, s, a);
    })
    .filter((item) => item && item.latex_code);
}

function parseItemFormat(text) {
  return String(text || "")
    .split(/\\item\b/g)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => buildVariant(part, "", ""))
    .filter((item) => item.latex_code);
}

function parseConcatenatedRecords(text) {
  const input = String(text || "").trim();
  if (!input) return [];

  const records = [];
  let cursor = 0;
  let guard = 0;

  while (cursor < input.length && guard < 10000) {
    guard += 1;

    const sep1 = input.indexOf("||", cursor);
    if (sep1 < 0) break;
    const sep2 = input.indexOf("||", sep1 + 2);
    if (sep2 < 0) break;

    const question = input.slice(cursor, sep1).trim();
    const solution = input.slice(sep1 + 2, sep2).trim();

    let pos = sep2 + 2;
    while (/\s/.test(input[pos] || "")) pos += 1;
    if (pos >= input.length) {
      records.push(buildVariant(question, solution, ""));
      break;
    }

    const rest = input.slice(pos);
    let answer = "";
    let nextCursor = input.length;

    const joinedMc = rest.match(/^([A-D])(?=[A-Z])/);
    if (joinedMc) {
      answer = joinedMc[1];
      nextCursor = pos + 1;
    } else if (/^[A-D](?:\s|$)/.test(rest)) {
      answer = rest[0];
      nextCursor = pos + 1;
    } else {
      const blankRel = rest.search(/\r?\n\s*\r?\n/);
      const lineRel = rest.search(/\r?\n/);
      const nextSepRel = rest.indexOf("||");

      if (blankRel >= 0 && (nextSepRel < 0 || blankRel < nextSepRel)) {
        answer = rest.slice(0, blankRel).trim();
        nextCursor = pos + blankRel;
      } else if (lineRel >= 0 && (nextSepRel < 0 || lineRel < nextSepRel) && lineRel <= 120) {
        answer = rest.slice(0, lineRel).trim();
        nextCursor = pos + lineRel;
      } else if (nextSepRel < 0) {
        answer = rest.trim();
        nextCursor = input.length;
      } else {
        const token = rest.match(/^([^\s]{1,8})/);
        if (!token) break;
        answer = token[1].trim();
        nextCursor = pos + token[1].length;
      }
    }

    if (question) {
      records.push(buildVariant(question, solution, answer));
    }

    while (/\s/.test(input[nextCursor] || "")) nextCursor += 1;
    if (nextCursor <= cursor) break;
    cursor = nextCursor;
  }

  return records.filter((item) => item.latex_code);
}

function parseBulk(text) {
  const content = String(text || "").trim();
  if (!content) return [];

  if (/\\item\b/.test(content)) {
    const parsedItems = parseItemFormat(content);
    if (parsedItems.length) return parsedItems;
  }

  if (content.includes("||")) {
    const parsedConcatenated = parseConcatenatedRecords(content);
    if (parsedConcatenated.length) return parsedConcatenated;

    if (/\r?\n\s*\r?\n/.test(content)) {
      const parsedBlocks = parseBlockFormat(content);
      if (parsedBlocks.length) return parsedBlocks;
    }

    const parsedBlocks = parseBlockFormat(content);
    if (parsedBlocks.length) return parsedBlocks;
    const parsedLines = parseLineFormat(content);
    if (parsedLines.length) return parsedLines;
  }

  // Multiline question without explicit separators should remain ONE variant.
  return [buildVariant(content, "", "")];
}

function getBaseLabels() {
  return {
    difficulty: difficultySelect.value,
    question_type: questionTypeSelect.value,
    topic: topicInput.value.trim(),
    sub_type: subTypeInput.value.trim(),
    grade: gradeSelect.value
  };
}

function validateLabelsClient() {
  const labels = getBaseLabels();
  if (!labels.topic) return "Topic is required.";
  if (!labels.sub_type) return "Sub-topic is required.";
  if (!labels.question_type) return "Question type is required.";
  return null;
}

function renderGeneratedList() {
  if (!generatedItems.length) {
    generatedList.innerHTML = "<p>No generated questions yet.</p>";
    return;
  }

  generatedList.innerHTML = generatedItems
    .map((item, index) => `
      <article class="generated-item">
        <div class="generated-item-header">
          <strong>Variant ${index + 1}</strong>
          <label class="inline-check"><input type="checkbox" data-approve-index="${index}" ${item.approved ? "checked" : ""}/>Approve</label>
        </div>
        <label>Question LaTeX<textarea data-question-index="${index}" rows="3">${escapeHtml(item.latex_code || "")}</textarea></label>
        <div class="problem-render" id="gen-question-render-${index}"></div>
        <label>Solution LaTeX<textarea data-solution-index="${index}" rows="3">${escapeHtml(item.solution_latex || "")}</textarea></label>
        <div class="problem-render" id="gen-solution-render-${index}"></div>
        <label>Answer<textarea data-answer-index="${index}" rows="2">${escapeHtml(item.answer_text || "")}</textarea></label>
        <div class="problem-render" id="gen-answer-render-${index}"></div>
      </article>
    `)
    .join("");

  generatedItems.forEach((item, index) => {
    const qPreview = document.getElementById(`gen-question-render-${index}`);
    const sPreview = document.getElementById(`gen-solution-render-${index}`);
    const aPreview = document.getElementById(`gen-answer-render-${index}`);
    if (qPreview) renderMathAndFigures(qPreview, item.latex_code || "");
    if (sPreview) renderMathAndFigures(sPreview, item.solution_latex || "");
    if (aPreview) renderMathAndFigures(aPreview, item.answer_text || "");
  });

  generatedList.querySelectorAll("input[data-approve-index]").forEach((el) => {
    el.addEventListener("change", () => {
      const i = Number(el.dataset.approveIndex);
      generatedItems[i].approved = el.checked;
    });
  });

  generatedList.querySelectorAll("textarea[data-question-index]").forEach((el) => {
    el.addEventListener("input", () => {
      const i = Number(el.dataset.questionIndex);
      generatedItems[i].latex_code = el.value;
      const preview = document.getElementById(`gen-question-render-${i}`);
      if (preview) {
        renderMathAndFigures(preview, el.value);
        typesetElement(preview);
      }
    });
  });

  generatedList.querySelectorAll("textarea[data-solution-index]").forEach((el) => {
    el.addEventListener("input", () => {
      const i = Number(el.dataset.solutionIndex);
      generatedItems[i].solution_latex = el.value;
      const preview = document.getElementById(`gen-solution-render-${i}`);
      if (preview) {
        renderMathAndFigures(preview, el.value);
        typesetElement(preview);
      }
    });
  });

  generatedList.querySelectorAll("textarea[data-answer-index]").forEach((el) => {
    el.addEventListener("input", () => {
      const i = Number(el.dataset.answerIndex);
      generatedItems[i].answer_text = el.value;
      const preview = document.getElementById(`gen-answer-render-${i}`);
      if (preview) {
        renderMathAndFigures(preview, el.value);
        typesetElement(preview);
      }
    });
  });

  typesetElement(generatedList);
}

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function renderProblems(problems) {
  if (!problems.length) {
    list.innerHTML = "<p>No problems found.</p>";
    return;
  }

  list.innerHTML = problems
    .map((p) => `
      <article class="problem-card">
        <div class="problem-select-row">
          <label class="inline-check"><input type="checkbox" class="problem-select" data-id="${p.id}" ${selectedProblemIds.has(Number(p.id)) ? "checked" : ""} />Select for batch relabel</label>
        </div>
        <div class="problem-meta">
          <span class="tag">${escapeHtml(p.difficulty || "")}</span>
          <span class="tag">${escapeHtml(p.question_type || "")}</span>
          <span class="tag">${escapeHtml(p.topic || "")}</span>
          <span class="tag">${escapeHtml(p.sub_type || "")}</span>
          <span class="tag">${escapeHtml(p.grade || "")}</span>
        </div>
        <div class="problem-render" id="problem-render-${p.id}"></div>
        <pre class="problem-latex" id="problem-latex-view-${p.id}">${escapeHtml(p.latex_code || "")}</pre>
        <div id="problem-edit-${p.id}" style="display:none; margin-top:0.6rem;">
          <label>Question LaTeX<textarea id="problem-q-edit-${p.id}" rows="4">${escapeHtml(p.latex_code || "")}</textarea></label>
          <div class="problem-render" id="problem-q-edit-render-${p.id}"></div>
        </div>
        <details class="solution-details">
          <summary>Solution</summary>
          <div class="problem-render" id="solution-render-${p.id}"></div>
          <pre class="problem-latex" id="solution-latex-view-${p.id}">${escapeHtml(p.solution_latex || "")}</pre>
          <div id="solution-edit-${p.id}" style="display:none; margin-top:0.6rem;">
            <label>Solution LaTeX<textarea id="problem-s-edit-${p.id}" rows="4">${escapeHtml(p.solution_latex || "")}</textarea></label>
            <div class="problem-render" id="problem-s-edit-render-${p.id}"></div>
          </div>
        </details>
        <details class="solution-details">
          <summary>Answer</summary>
          <div class="problem-render" id="answer-render-${p.id}"></div>
          <pre class="problem-latex" id="answer-latex-view-${p.id}">${escapeHtml(p.answer_text || "")}</pre>
          <div id="answer-edit-${p.id}" style="display:none; margin-top:0.6rem;">
            <label>Answer<textarea id="problem-a-edit-${p.id}" rows="2">${escapeHtml(p.answer_text || "")}</textarea></label>
            <div class="problem-render" id="problem-a-edit-render-${p.id}"></div>
          </div>
        </details>
        <div class="problem-footer">
          <small>Created: ${formatDate(p.created_at)}</small>
          <button type="button" class="secondary-btn" data-edit-id="${p.id}">Edit</button>
          <button type="button" style="display:none;" data-cancel-id="${p.id}">Cancel</button>
          <button type="button" style="display:none;" data-save-id="${p.id}">Save</button>
          <button type="button" class="delete-btn" data-delete-id="${p.id}">Delete</button>
        </div>
      </article>
    `)
    .join("");

  list.querySelectorAll(".problem-select").forEach((el) => {
    el.addEventListener("change", () => {
      const id = Number(el.dataset.id);
      if (!id) return;
      if (el.checked) selectedProblemIds.add(id);
      else selectedProblemIds.delete(id);
    });
  });

  list.querySelectorAll("button[data-delete-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.dataset.deleteId);
      if (!id) return;
      if (!confirm("Delete this problem?")) return;

      await fetchJsonWithAdminKey(`/api/problems/${id}`, { method: "DELETE" });
      await loadProblems();
    });
  });

  list.querySelectorAll("button[data-edit-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.editId);
      if (!id) return;
      const p = problems.find((x) => Number(x.id) === id);
      if (!p) return;

      const editWraps = [
        document.getElementById(`problem-edit-${id}`),
        document.getElementById(`solution-edit-${id}`),
        document.getElementById(`answer-edit-${id}`)
      ];
      const viewWraps = [
        document.getElementById(`problem-latex-view-${id}`),
        document.getElementById(`solution-latex-view-${id}`),
        document.getElementById(`answer-latex-view-${id}`)
      ];
      editWraps.forEach((el) => {
        if (el) el.style.display = "";
      });
      viewWraps.forEach((el) => {
        if (el) el.style.display = "none";
      });

      btn.style.display = "none";
      const cancelBtn = list.querySelector(`button[data-cancel-id="${id}"]`);
      const saveBtn = list.querySelector(`button[data-save-id="${id}"]`);
      if (cancelBtn) cancelBtn.style.display = "";
      if (saveBtn) saveBtn.style.display = "";

      const qInput = document.getElementById(`problem-q-edit-${id}`);
      const sInput = document.getElementById(`problem-s-edit-${id}`);
      const aInput = document.getElementById(`problem-a-edit-${id}`);
      const qPreview = document.getElementById(`problem-q-edit-render-${id}`);
      const sPreview = document.getElementById(`problem-s-edit-render-${id}`);
      const aPreview = document.getElementById(`problem-a-edit-render-${id}`);
      if (qInput && qPreview) renderMathAndFigures(qPreview, qInput.value);
      if (sInput && sPreview) renderMathAndFigures(sPreview, sInput.value);
      if (aInput && aPreview) renderMathAndFigures(aPreview, aInput.value);
      if (qPreview) typesetElement(qPreview);
      if (sPreview) typesetElement(sPreview);
      if (aPreview) typesetElement(aPreview);

      [qInput, sInput, aInput].forEach((input, idx) => {
        const preview = [qPreview, sPreview, aPreview][idx];
        if (!input || !preview) return;
        input.addEventListener("input", () => {
          renderMathAndFigures(preview, input.value);
          typesetElement(preview);
        });
      });
    });
  });

  list.querySelectorAll("button[data-cancel-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.cancelId);
      if (!id) return;
      const p = problems.find((x) => Number(x.id) === id);
      if (!p) return;
      const qInput = document.getElementById(`problem-q-edit-${id}`);
      const sInput = document.getElementById(`problem-s-edit-${id}`);
      const aInput = document.getElementById(`problem-a-edit-${id}`);
      if (qInput) qInput.value = p.latex_code || "";
      if (sInput) sInput.value = p.solution_latex || "";
      if (aInput) aInput.value = p.answer_text || "";

      [document.getElementById(`problem-edit-${id}`), document.getElementById(`solution-edit-${id}`), document.getElementById(`answer-edit-${id}`)].forEach((el) => {
        if (el) el.style.display = "none";
      });
      [document.getElementById(`problem-latex-view-${id}`), document.getElementById(`solution-latex-view-${id}`), document.getElementById(`answer-latex-view-${id}`)].forEach((el) => {
        if (el) el.style.display = "";
      });

      const editBtn = list.querySelector(`button[data-edit-id="${id}"]`);
      const saveBtn = list.querySelector(`button[data-save-id="${id}"]`);
      if (editBtn) editBtn.style.display = "";
      btn.style.display = "none";
      if (saveBtn) saveBtn.style.display = "none";
    });
  });

  list.querySelectorAll("button[data-save-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.dataset.saveId);
      if (!id) return;
      const p = problems.find((x) => Number(x.id) === id);
      if (!p) return;

      const latex_code = String(document.getElementById(`problem-q-edit-${id}`)?.value || "").trim();
      const solution_latex = String(document.getElementById(`problem-s-edit-${id}`)?.value || "").trim();
      const answer_text = String(document.getElementById(`problem-a-edit-${id}`)?.value || "").trim();

      if (!latex_code) {
        setBatchLabelMessage("Question LaTeX cannot be empty.", "error");
        return;
      }

      const payload = {
        latex_code,
        solution_latex,
        answer_text,
        difficulty: String(p.difficulty || "").trim(),
        question_type: String(p.question_type || "").trim() || "MC",
        topic: String(p.topic || "").trim(),
        sub_type: String(p.sub_type || "").trim(),
        grade: String(p.grade || "").trim()
      };

      try {
        await fetchJsonWithAdminKey(`/api/problems/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch (error) {
        setBatchLabelMessage(error.message || "Failed to save question.", "error");
        return;
      }

      setBatchLabelMessage(`Saved question #${id}.`, "success");
      await loadProblems();
      await loadAutocompleteData();
    });
  });

  problems.forEach((p) => {
    const qRender = document.getElementById(`problem-render-${p.id}`);
    const sRender = document.getElementById(`solution-render-${p.id}`);
    const aRender = document.getElementById(`answer-render-${p.id}`);
    if (qRender) renderMathAndFigures(qRender, p.latex_code || "");
    if (sRender) renderMathAndFigures(sRender, p.solution_latex || "");
    if (aRender) renderMathAndFigures(aRender, p.answer_text || "");
  });

  typesetElement(list);
}

async function loadMeta() {
  const res = await fetch("/api/meta");
  const meta = await res.json();

  addOptions(difficultySelect, meta.difficulties || []);
  addOptions(gradeSelect, meta.grades || []);
  addOptions(questionTypeSelect, meta.question_types || []);

  addOptions(filterDifficulty, meta.difficulties || []);
  addOptions(filterGrade, meta.grades || []);

  difficultyValues = meta.difficulties || [];
  gradeValues = meta.grades || [];
  questionTypeValues = meta.question_types || [];

  if (difficultyValues.length) difficultySelect.value = difficultyValues[0];
  if (gradeValues.length) gradeSelect.value = gradeValues[0];
  if (questionTypeValues.length) questionTypeSelect.value = questionTypeValues[0];

  renderBatchLabelValueInput();
}

function renderBatchLabelValueInput() {
  const field = batchLabelField.value;
  if (field === "topic" || field === "sub_type") {
    batchLabelSelectWrap.style.display = "none";
    batchLabelTextWrap.style.display = "";
    updateRelabelAutocomplete();
    return;
  }

  batchLabelSelectWrap.style.display = "";
  batchLabelTextWrap.style.display = "none";

  const map = {
    difficulty: difficultyValues,
    question_type: questionTypeValues,
    grade: gradeValues
  };

  batchLabelSelect.innerHTML = "";
  (map[field] || []).forEach((v) => {
    const option = document.createElement("option");
    option.value = v;
    option.textContent = v;
    batchLabelSelect.appendChild(option);
  });
  batchLabelText.removeAttribute("list");
}

function getBatchLabelValue() {
  if (batchLabelField.value === "topic" || batchLabelField.value === "sub_type") return batchLabelText.value.trim();
  return batchLabelSelect.value.trim();
}

function hasActiveSearchCriteria() {
  return Boolean(
    filterDifficulty.value ||
      filterGrade.value ||
      filterTopic.value.trim() ||
      filterSubType.value.trim() ||
      searchQ.value.trim()
  );
}

async function loadProblems() {
  if (!hasActiveSearchCriteria()) {
    currentSearchIds = [];
    selectedProblemIds.clear();
    list.innerHTML = "<p>Set at least one search/filter condition, then press Search.</p>";
    setBatchLabelMessage("No search criteria set, so results are hidden.", "");
    return;
  }

  const params = new URLSearchParams();
  if (filterDifficulty.value) params.set("difficulty", filterDifficulty.value);
  if (filterGrade.value) params.set("grade", filterGrade.value);
  if (filterTopic.value.trim()) params.set("topic", filterTopic.value.trim());
  if (filterSubType.value.trim()) params.set("sub_type", filterSubType.value.trim());
  if (searchQ.value.trim()) params.set("q", searchQ.value.trim());

  const query = params.toString() ? `?${params.toString()}` : "";
  const problems = await fetchJsonWithAdminKey(`/api/problems${query}`);
  if (!Array.isArray(problems)) {
    throw new Error("Invalid search response.");
  }

  currentSearchIds = (problems || []).map((p) => Number(p.id)).filter((x) => Number.isInteger(x));
  selectedProblemIds.clear();
  currentSearchIds.forEach((id) => selectedProblemIds.add(id));

  renderProblems(Array.isArray(problems) ? problems : []);
  setBatchLabelMessage(`Loaded ${Array.isArray(problems) ? problems.length : 0} result(s).`, "success");
}

loadBulkBtn.addEventListener("click", () => {
  const parsed = parseBulk(bulkVariantsInput.value);
  if (!parsed.length) {
    setGeneratorMessage("No valid variants found.", "error");
    return;
  }
  generatedItems = parsed;
  renderGeneratedList();
  setGeneratorMessage(`Loaded ${parsed.length} variants.`, "success");
});

generateSolutionsBtn.addEventListener("click", async () => {
  const approved = generatedItems.filter((x) => x.approved && x.latex_code.trim());
  if (!approved.length) {
    setGeneratorMessage("No approved variants.", "error");
    return;
  }

  const res = await fetch("/api/generate-solutions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questions: approved.map((x) => x.latex_code) })
  });

  const data = await res.json();
  if (!res.ok) {
    setGeneratorMessage(data.error || "Failed to generate solutions.", "error");
    return;
  }

  let i = 0;
  generatedItems.forEach((item) => {
    if (item.approved && item.latex_code.trim()) {
      item.solution_latex = data.solutions[i] || item.solution_latex || "";
      i += 1;
    }
  });

  renderGeneratedList();
  setGeneratorMessage(`Generated ${i} solution(s).`, "success");
});

uploadBatchBtn.addEventListener("click", async () => {
  const labelError = validateLabelsClient();
  if (labelError) {
    setGeneratorMessage(labelError, "error");
    return;
  }

  const approved = generatedItems.filter((x) => x.approved && x.latex_code.trim());
  if (!approved.length) {
    setGeneratorMessage("No approved variants to upload.", "error");
    return;
  }

  const labels = getBaseLabels();
  const confirmText = [
    `Upload ${approved.length} question(s) with these labels?`,
    `Difficulty: ${labels.difficulty || "-"}`,
    `Question Type: ${labels.question_type || "-"}`,
    `Grade: ${labels.grade || "-"}`,
    `Topic: ${labels.topic || "-"}`,
    `Sub-topic: ${labels.sub_type || "-"}`
  ].join("\n");
  if (!window.confirm(confirmText)) {
    setGeneratorMessage("Upload cancelled.", "");
    return;
  }

  const payload = {
    ...labels,
    items: approved.map((item) => ({
      latex_code: item.latex_code,
      solution_latex: item.solution_latex || "",
      answer_text: item.answer_text || ""
    }))
  };

  let data;
  try {
    data = await fetchJsonWithAdminKey("/api/problems/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    setGeneratorMessage(error.message || "Upload failed.", "error");
    return;
  }

  setGeneratorMessage(`Uploaded ${data.inserted || 0} question(s).`, "success");
  setMessage("Batch upload completed.", "success");
  topicInput.value = "";
  subTypeInput.value = "";
  await loadProblems();
  await loadAutocompleteData();
});

clearGeneratedBtn.addEventListener("click", () => {
  generatedItems = [];
  renderGeneratedList();
  setGeneratorMessage("Cleared generated list.");
});

searchBtn.addEventListener("click", async () => {
  try {
    await loadProblems();
  } catch (error) {
    setMessage(error.message || "Search failed.", "error");
    setBatchLabelMessage(error.message || "Search failed.", "error");
  }
});
if (hideResultsBtn) {
  hideResultsBtn.addEventListener("click", () => {
    currentSearchIds = [];
    selectedProblemIds.clear();
    list.innerHTML = "<p>Results hidden. Use Search to show questions again.</p>";
    setBatchLabelMessage("Results hidden.", "");
  });
}
refreshBtn.addEventListener("click", async () => {
  try {
    await loadProblems();
  } catch (error) {
    setMessage(error.message || "Refresh failed.", "error");
    setBatchLabelMessage(error.message || "Refresh failed.", "error");
  }
});

batchLabelField.addEventListener("change", () => {
  renderBatchLabelValueInput();
  setBatchLabelMessage("");
});

selectAllBtn.addEventListener("click", () => {
  currentSearchIds.forEach((id) => selectedProblemIds.add(id));
  document.querySelectorAll(".problem-select").forEach((el) => {
    el.checked = true;
  });
});

selectNoneBtn.addEventListener("click", () => {
  currentSearchIds.forEach((id) => selectedProblemIds.delete(id));
  document.querySelectorAll(".problem-select").forEach((el) => {
    el.checked = false;
  });
});

applyBatchLabelBtn.addEventListener("click", async () => {
  const ids = [...selectedProblemIds].filter((id) => currentSearchIds.includes(id));
  if (!ids.length) {
    setBatchLabelMessage("No selected questions.", "error");
    return;
  }

  const field = batchLabelField.value;
  const value = getBatchLabelValue();
  if (!value) {
    setBatchLabelMessage("New label value is required.", "error");
    return;
  }

  let data;
  try {
    data = await fetchJsonWithAdminKey("/api/problems/batch-label", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, field, value })
    });
  } catch (error) {
    setBatchLabelMessage(error.message || "Batch update failed.", "error");
    return;
  }

  setBatchLabelMessage(`Updated ${data.updated || 0} question(s).`, "success");
  await loadProblems();
  await loadAutocompleteData();
});

topicInput.addEventListener("input", () => {
  updateSubtopicDatalistForTopic(topicInput.value.trim());
  updateRelabelAutocomplete();
});
topicInput.addEventListener("change", () => {
  updateSubtopicDatalistForTopic(topicInput.value.trim());
  tryPairAutofill();
  updateRelabelAutocomplete();
});
subTypeInput.addEventListener("blur", () => {
  tryPairAutofill();
});
filterTopic.addEventListener("input", () => {
  updateSearchFilterOptions("topic");
  const typedSub = filterSubType.value.trim();
  const topicKey = findTopicKeyInsensitive(filterTopic.value.trim());
  if (typedSub && topicKey && topicToSubtopics.has(topicKey)) {
    const allowed = [...topicToSubtopics.get(topicKey)].map((x) => String(x).toLowerCase());
    if (!allowed.includes(typedSub.toLowerCase())) {
      filterSubType.value = "";
    }
  }
  updateRelabelAutocomplete();
});
filterTopic.addEventListener("change", () => {
  updateSearchFilterOptions("topic");
  const typedSub = filterSubType.value.trim();
  const topicKey = findTopicKeyInsensitive(filterTopic.value.trim());
  if (typedSub && topicKey && topicToSubtopics.has(topicKey)) {
    const allowed = [...topicToSubtopics.get(topicKey)].map((x) => String(x).toLowerCase());
    if (!allowed.includes(typedSub.toLowerCase())) {
      filterSubType.value = "";
    }
  }
  trySearchPairAutofill();
  updateRelabelAutocomplete();
});
filterDifficulty.addEventListener("change", () => {
  updateSearchFilterOptions("difficulty");
  updateRelabelAutocomplete();
});
filterGrade.addEventListener("change", () => {
  updateSearchFilterOptions("grade");
  updateRelabelAutocomplete();
});
filterSubType.addEventListener("input", () => {
  updateSearchFilterOptions("sub_type");
  updateRelabelAutocomplete();
});
filterSubType.addEventListener("change", () => {
  updateSearchFilterOptions("sub_type");
  trySearchPairAutofill();
  updateRelabelAutocomplete();
});
searchQ.addEventListener("input", () => {
  updateSearchFilterOptions("q");
});
filterSubType.addEventListener("blur", () => {
  trySearchPairAutofill();
});

window.addEventListener("scroll", () => {
  if (!goTopBtn) return;
  if (window.scrollY > 300) goTopBtn.classList.add("show");
  else goTopBtn.classList.remove("show");
});

if (goTopBtn) {
  goTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

(async function init() {
  try {
    await loadMeta();
    await loadAutocompleteData();
    await loadProblems();
    renderGeneratedList();
  } catch (error) {
    setMessage(error.message || "Failed to initialize app.", "error");
  }
})();



