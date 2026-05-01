(function () {
let createClient = window.supabase?.createClient;
window.__PORTAL_JS_OK__ = true;

const authCard = document.getElementById("auth-card");
const appCard = document.getElementById("app-card");
const schoolNote = document.getElementById("school-note");
const authMessage = document.getElementById("auth-message");

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");

const signupName = document.getElementById("signup-name");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupGrade = document.getElementById("signup-grade");
const signupClass = document.getElementById("signup-class");

const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

const logoutBtn = document.getElementById("logout-btn");
const welcomeTitle = document.getElementById("welcome-title");
const welcomeSubtitle = document.getElementById("welcome-subtitle");
const welcomeProfile = document.getElementById("welcome-profile");
const welcomeAvatarImage = document.getElementById("welcome-avatar-image");
const topTokenBadge = document.getElementById("top-token-badge");
const topShopBtn = document.getElementById("top-shop-btn");

const studentView = document.getElementById("student-view");
const studentDailyPanel = document.getElementById("student-daily-panel");
const studentProfilePanel = document.getElementById("student-profile-panel");
const studentTodayReviewPage = document.getElementById("student-today-review-page");
const studentAvatarShopPage = document.getElementById("student-avatar-shop-page");
const shopPreviewCharacters = document.getElementById("shop-preview-characters");
const shopPreviewFrames = document.getElementById("shop-preview-frames");
const closePreviewCharactersBtn = document.getElementById("close-preview-characters-btn");
const closePreviewFramesBtn = document.getElementById("close-preview-frames-btn");
const previewCharactersGrid = document.getElementById("preview-characters-grid");
const previewFramesGrid = document.getElementById("preview-frames-grid");
const shopDrawRevealOverlay = document.getElementById("shop-draw-reveal-overlay");
const closeDrawRevealBtn = document.getElementById("close-draw-reveal-btn");
const shopDrawRevealContent = document.getElementById("shop-draw-reveal-content");
const studentOwnedOverlay = document.getElementById("student-owned-overlay");
const closeOwnedOverlayBtn = document.getElementById("close-owned-overlay-btn");
const ownedCharactersList = document.getElementById("owned-characters-list");
const ownedFramesList = document.getElementById("owned-frames-list");
const studentSettingsPage = document.getElementById("student-settings-page");
const closeDailyOverlayBtn = document.getElementById("close-daily-overlay-btn");
const closeSettingsOverlayBtn = document.getElementById("close-settings-overlay-btn");
const studentDailyLink = document.getElementById("student-daily-link");
const studentProfileLink = document.getElementById("student-profile-link");
const studentTodayReviewLink = document.getElementById("student-today-review-link");
const profileDailyMissionBtn = document.getElementById("profile-daily-mission-btn");
const profileDailyMissionAlert = document.getElementById("profile-daily-mission-alert");
const openAvatarShopBtn = document.getElementById("open-avatar-shop-btn");
const closeAvatarShopBtn = document.getElementById("close-avatar-shop-btn");
const dailyPrevBtn = document.getElementById("daily-prev-btn");
const dailyNextBtn = document.getElementById("daily-next-btn");
const dailyGoReviewBtn = document.getElementById("daily-go-review-btn");
const dailyRefreshLatestBtn = document.getElementById("daily-refresh-latest-btn");
const dailyProgressLabel = document.getElementById("daily-progress-label");
const dailyReviewStats = document.getElementById("daily-review-stats");
const dailyReviewList = document.getElementById("daily-review-list");
const studentMessage = document.getElementById("student-message");
const studentList = document.getElementById("student-list");
const themeLightBtn = document.getElementById("theme-light-btn");
const themeDarkBtn = document.getElementById("theme-dark-btn");
const studentStats = document.getElementById("student-stats");
const studentAvatarCatalog = document.getElementById("student-avatar-catalog");
const studentStyleCatalog = document.getElementById("student-style-catalog");
const studentRadarWrap = document.getElementById("student-radar-wrap");
const studentClassTitles = document.getElementById("student-class-titles");
const reviewFilterLv = document.getElementById("review-filter-lv");
const reviewFilterTopic = document.getElementById("review-filter-topic");
const reviewFilterResult = document.getElementById("review-filter-result");
const reviewFilterDate = document.getElementById("review-filter-date");
const reviewSortField = document.getElementById("review-sort-field");
const reviewSortOrder = document.getElementById("review-sort-order");
const reviewLoadBtn = document.getElementById("review-load-btn");
const studentReviewList = document.getElementById("student-review-list");
const studentTopicLvMatrix = document.getElementById("student-topic-lv-matrix");
const topChangePwBtn = document.getElementById("top-change-pw-btn");
const topChangePwPanel = document.getElementById("top-change-pw-panel");
const changePwCurrent = document.getElementById("change-pw-current");
const changePwNew = document.getElementById("change-pw-new");
const changePwBtn = document.getElementById("change-pw-btn");
const changePwMessage = document.getElementById("change-pw-message");

const teacherView = document.getElementById("teacher-view");
const teacherBatchPage = document.getElementById("teacher-batch-page");
const teacherGroupPage = document.getElementById("teacher-group-page");
const teacherDashboardLink = document.getElementById("teacher-dashboard-link");
const teacherGroupsLink = document.getElementById("teacher-groups-link");
const teacherDashboardLink2 = document.getElementById("teacher-dashboard-link-2");
const teacherGroupsLink2 = document.getElementById("teacher-groups-link-2");
const teacherDashboardLink3 = document.getElementById("teacher-dashboard-link-3");
const teacherBatchLink = document.getElementById("teacher-batch-link");
const teacherBatchLink2 = document.getElementById("teacher-batch-link-2");
const teacherBatchLink3 = document.getElementById("teacher-batch-link-3");
const teacherGroupsLink3 = document.getElementById("teacher-groups-link-3");
const teacherDashboardGroupSelect = document.getElementById("teacher-dashboard-group-select");
const teacherDate = document.getElementById("teacher-date");
const loadOverviewBtn = document.getElementById("load-overview-btn");
const teacherMessage = document.getElementById("teacher-message");
const teacherBatchMessage = document.getElementById("teacher-batch-message");
const teacherGroupMessage = document.getElementById("teacher-group-message");
const teacherSummary = document.getElementById("teacher-summary");
const teacherTableWrap = document.getElementById("teacher-table-wrap");
const teacherBatchTableWrap = document.getElementById("teacher-batch-table-wrap");
const teacherBatchGroupSelect = document.getElementById("teacher-batch-group-select");
const teacherSelectAllStudentsBtn = document.getElementById("teacher-select-all-students-btn");
const teacherClearSelectedStudentsBtn = document.getElementById("teacher-clear-selected-students-btn");
const teacherBatchAssignGroupBtn = document.getElementById("teacher-batch-assign-group-btn");
const newGroupName = document.getElementById("new-group-name");
const createGroupBtn = document.getElementById("create-group-btn");
const teacherGroupSelect = document.getElementById("teacher-group-select");
const loadGroupStatsBtn = document.getElementById("load-group-stats-btn");
const teacherGroupSelectAllBtn = document.getElementById("teacher-group-select-all-btn");
const teacherGroupClearSelectedBtn = document.getElementById("teacher-group-clear-selected-btn");
const teacherGroupRemoveSelectedBtn = document.getElementById("teacher-group-remove-selected-btn");
const teacherGroupStats = document.getElementById("teacher-group-stats");
const teacherGroupStudents = document.getElementById("teacher-group-students");
const teacherScopeMinDifficulty = document.getElementById("teacher-scope-min-difficulty");
const teacherScopeMaxDifficulty = document.getElementById("teacher-scope-max-difficulty");
const teacherScopeTopics = document.getElementById("teacher-scope-topics");
const teacherScopeSubtype = document.getElementById("teacher-scope-subtype");
const teacherScopeAddBtn = document.getElementById("teacher-scope-add-btn");
const teacherScopeList = document.getElementById("teacher-scope-list");
const teacherScopeSaveBtn = document.getElementById("teacher-scope-save-btn");
const wrongFeedbackDialog = document.getElementById("wrong-feedback-dialog");
const teacherStudentPage = document.getElementById("teacher-student-page");
const teacherStudentPageTitle = document.getElementById("teacher-student-page-title");
const teacherStudentBackBtn = document.getElementById("teacher-student-back-btn");
const teacherStudentPageMessage = document.getElementById("teacher-student-page-message");
const teacherStudentPageStats = document.getElementById("teacher-student-page-stats");
const teacherStudentTopicLvMatrix = document.getElementById("teacher-student-topic-lv-matrix");
const teacherStudentGroupAssign = document.getElementById("teacher-student-group-assign");
const teacherStudentSaveGroupsBtn = document.getElementById("teacher-student-save-groups-btn");
const teacherStudentClassInput = document.getElementById("teacher-student-class-input");
const teacherStudentSaveClassBtn = document.getElementById("teacher-student-save-class-btn");
const teacherStudentFilterLv = document.getElementById("teacher-student-filter-lv");
const teacherStudentFilterTopic = document.getElementById("teacher-student-filter-topic");
const teacherStudentFilterResult = document.getElementById("teacher-student-filter-result");
const teacherStudentFilterDate = document.getElementById("teacher-student-filter-date");
const teacherStudentFilterApplyBtn = document.getElementById("teacher-student-filter-apply-btn");
const teacherStudentPageList = document.getElementById("teacher-student-page-list");

let supabase = null;
let authToken = "";
let me = null;
let clientConfig = null;
const DIAMOND_RULE_TOOLTIP =
  "Diamond rules: Correct +3, wrong +0, correct within 30s +1, 3 correct in a row +2, 5 correct in a row +4. Daily streak bonus (finish >=5/day): 3d +5, 7d +10, 14d +20, 21d +40.";
let verifiedBrowserEmail = "";
const STUDENT_THEME_KEY = "student_theme_mode";
const STUDENT_PAGE_KEY = "student_page_tab";
const TEACHER_PAGE_KEY = "teacher_page_tab";
const STUDENT_FORCE_PROFILE_ONCE_KEY = "student_force_profile_once";
const questionStartTimes = new Map();
let teacherStudentViewData = null;
let difficultyOrder = ["lv2", "lv3", "lv4", "lv5", "lv5*", "lv5**"];
let currentTeacherStudentIds = [];
const selectedTeacherStudentIds = new Set();
let currentGroupMemberIds = [];
const selectedGroupMemberIds = new Set();
let teacherStudentBackTarget = "dashboard";
let latestTeacherOverviewStudents = [];
let dailyAssignments = [];
let dailyDate = "";
let currentDailyIndex = 0;
let dailyReviewAvailable = false;
let lastSubmittedQuestionId = null;
const roughWorkDataByQuestion = new Map();
const roughWorkHistoryByQuestion = new Map();
const roughWorkToolByQuestion = new Map();
const roughWorkDrawEnabledByQuestion = new Map();
const roughWorkPenColorByQuestion = new Map();
const roughWorkHighlighterColorByQuestion = new Map();
let activeRoughQuestionId = null;
let roughKeyboardBound = false;
let groupScopeDraft = [];
let allScopeTopics = [];
let studentAvatarData = null;
let todayMissionCompleted = false;
let serverTokenBalance = 0;
let styleShopState = null;
let frameStyleValueMap = new Map();
const PEN_COLOR_OPTIONS = ["#ff8a00", "#16a34a", "#2563eb", "#e11d48"];
const HIGHLIGHTER_COLOR_OPTIONS = ["#fde047", "#93c5fd", "#86efac", "#fdba74"];
const GACHA_DRAW_VIDEO_BY_PACK = {
  character: "/assets/shop/draw-character.mp4",
  frame: "/assets/shop/draw-frame.mp4"
};

const STYLE_SHOP_CATALOG = [
  { id: "frame_basic", category: "frame", name: "Classic Frame", tier: "free", cost: 0, value: "basic" },
  { id: "frame_neon", category: "frame", name: "Neon Frame", tier: "premium", cost: 0, value: "neon" },
  { id: "frame_sakura", category: "frame", name: "Sakura Frame", tier: "premium", cost: 0, value: "sakura" },
  { id: "frame_aurora", category: "frame", name: "Aurora Crown", tier: "premium", cost: 0, value: "aurora" },
  { id: "frame_inferno", category: "frame", name: "Inferno Ring", tier: "premium", cost: 0, value: "inferno" },
  { id: "frame_holo", category: "frame", name: "Holo Prism", tier: "premium", cost: 0, value: "holo" },
  { id: "frame_mythic", category: "frame", name: "Mythic Orbit", tier: "premium", cost: 0, value: "mythic" }
];

function getStyleStorageKey(studentId) {
  return `student_style_shop_${String(studentId || "anon")}`;
}

function createDefaultStyleShopState() {
  return {
    spent: 0,
    owned: STYLE_SHOP_CATALOG.filter((x) => x.tier === "free").map((x) => x.id),
    selected: {
      frame: "frame_basic"
    }
  };
}

function loadStyleShopState(studentId) {
  const key = getStyleStorageKey(studentId);
  const raw = String(localStorage.getItem(key) || "").trim();
  let parsed = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch (_e) {
    parsed = null;
  }
  const base = createDefaultStyleShopState();
  if (!parsed || typeof parsed !== "object") return base;
  const ownedSet = new Set(base.owned);
  for (const id of Array.isArray(parsed.owned) ? parsed.owned : []) {
    if (STYLE_SHOP_CATALOG.some((x) => x.id === id)) ownedSet.add(id);
  }
  const selected = { ...base.selected, ...(parsed.selected || {}) };
  for (const cat of ["frame"]) {
    const sid = String(selected[cat] || "").trim();
    if (!sid || !ownedSet.has(sid)) selected[cat] = base.selected[cat];
  }
  return {
    spent: Math.max(0, Math.round(Number(parsed.spent || 0))),
    owned: Array.from(ownedSet),
    selected
  };
}

function saveStyleShopState(studentId, state) {
  localStorage.setItem(getStyleStorageKey(studentId), JSON.stringify(state));
}

function normalizeDropRate(rate) {
  const n = Number(rate);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n <= 1 ? n * 100 : n;
}

function formatDropRate(rate) {
  const pct = normalizeDropRate(rate);
  if (!pct) return "-";
  return `${pct.toFixed(pct >= 10 ? 0 : 1)}%`;
}

function buildFramePreviewVisual(styleKeyRaw) {
  const styleKey = String(styleKeyRaw || "basic").trim().toLowerCase();
  const safe = /^(basic|neon|sakura|aurora|inferno|holo|mythic)$/.test(styleKey) ? styleKey : "basic";
  return `<div class="frame-preview-visual ${safe}"><div class="frame-preview-core"></div></div>`;
}

function getDisplayedTokenBalance() {
  if (me?.role !== "student") return Number(serverTokenBalance || 0);
  const spent = Math.max(0, Math.round(Number(styleShopState?.spent || 0)));
  return Math.max(0, Number(serverTokenBalance || 0) - spent);
}

function setTopTokenBadge() {
  if (!topTokenBadge || me?.role !== "student") return;
  topTokenBadge.hidden = false;
  topTokenBadge.textContent = `💎 ${getDisplayedTokenBalance()}`;
  topTokenBadge.title = `${DIAMOND_RULE_TOOLTIP}\n\nStyle Shop is preview-only now (local browser).`;
}

function getSelectedStyleValue(category, fallback = "") {
  const sid = String(styleShopState?.selected?.[category] || "").trim();
  if (category === "frame" && frameStyleValueMap.has(sid)) {
    return String(frameStyleValueMap.get(sid) || fallback);
  }
  const item = STYLE_SHOP_CATALOG.find((x) => x.id === sid && x.category === category);
  return String(item?.value || fallback);
}

function applyStyleShopVisuals() {
  const frame = getSelectedStyleValue("frame", "basic");
  document.body.setAttribute("data-style-frame", frame);
}

function disableDrawModeForQuestion(questionId) {
  const key = Number(questionId);
  if (!Number.isFinite(key)) return;
  roughWorkDrawEnabledByQuestion.set(key, false);
  const canvas = document.getElementById(`rough-canvas-${key}`);
  const drawBtn = document.getElementById(`rough-draw-${key}`);
  const floatBtn = document.getElementById(`rough-float-${key}`);
  const penBtn = document.getElementById(`rough-pen-${key}`);
  const penPalette = document.getElementById(`rough-pen-palette-${key}`);
  const highlighterBtn = document.getElementById(`rough-highlighter-${key}`);
  const highlighterPalette = document.getElementById(`rough-highlighter-palette-${key}`);
  const eraserBtn = document.getElementById(`rough-eraser-${key}`);
  const undoBtn = document.getElementById(`rough-undo-${key}`);
  const clearBtn = document.getElementById(`rough-clear-${key}`);

  if (canvas) {
    canvas.classList.remove("enabled");
    canvas.style.cursor = "";
    canvas.style.pointerEvents = "";
  }
  if (drawBtn) {
    drawBtn.classList.remove("active-tool");
    drawBtn.textContent = "Draw On Screen";
  }
  if (floatBtn) floatBtn.hidden = true;
  if (penBtn) penBtn.hidden = true;
  if (highlighterBtn) highlighterBtn.hidden = true;
  if (eraserBtn) eraserBtn.hidden = true;
  if (undoBtn) undoBtn.hidden = true;
  if (clearBtn) clearBtn.hidden = true;
  if (penPalette) penPalette.hidden = true;
  if (highlighterPalette) highlighterPalette.hidden = true;
}

function clearDrawStateForQuestion(questionId) {
  const key = Number(questionId);
  if (!Number.isFinite(key)) return;
  const canvas = document.getElementById(`rough-canvas-${key}`);
  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    canvas.style.cursor = "";
    canvas.style.pointerEvents = "";
  }
  roughWorkDataByQuestion.delete(key);
  roughWorkHistoryByQuestion.set(key, [""]);
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeAnswerForCompare(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function compareAnswerClient(studentAnswer, expectedAnswer) {
  const a = normalizeAnswerForCompare(studentAnswer);
  const b = normalizeAnswerForCompare(expectedAnswer);
  if (!a || !b) return null;
  return a === b;
}

function today() {
  const tz = String(clientConfig?.timezone || "").trim() || "Asia/Hong_Kong";
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date());
}

function setMessage(el, text, type = "") {
  el.textContent = text;
  el.className = `message ${type}`.trim();
}

async function askWrongFeedbackChoice() {
  if (!wrongFeedbackDialog || typeof wrongFeedbackDialog.showModal !== "function") {
    return window.confirm(
      "Is this a careless mistake?\nOK = Careless (you must do 1 extra question at the end today)\nCancel = Not understand"
    )
      ? "careless"
      : "not_understand";
  }
  return new Promise((resolve) => {
    const onClose = () => {
      wrongFeedbackDialog.removeEventListener("close", onClose);
      const v = String(wrongFeedbackDialog.returnValue || "").trim();
      resolve(v === "careless" ? "careless" : "not_understand");
    };
    wrongFeedbackDialog.addEventListener("close", onClose);
    wrongFeedbackDialog.showModal();
  });
}

function normalizeScopeRow(row) {
  const minDifficulty = String(row?.min_difficulty || "").trim();
  const maxDifficulty = String(row?.max_difficulty || row?.difficulty || "").trim();
  return {
    min_difficulty: minDifficulty,
    max_difficulty: maxDifficulty,
    topic: String(row?.topic || "").trim(),
    sub_type: String(row?.sub_type || "").trim()
  };
}

function renderGroupScopeDraft() {
  if (!teacherScopeList) return;
  if (!groupScopeDraft.length) {
    teacherScopeList.innerHTML = "<p>No scope rules (all topics allowed).</p>";
    return;
  }
  teacherScopeList.innerHTML = groupScopeDraft
    .map(
      (row, idx) => `
      <span class="stat">
        ${escapeHtml(row.min_difficulty || "lv2")} ~ ${escapeHtml(row.max_difficulty)} | ${escapeHtml(row.topic)}${
          row.sub_type ? ` | ${escapeHtml(row.sub_type)}` : ""
        }
        <button type="button" class="secondary" data-scope-remove="${idx}">X</button>
      </span>
    `
    )
    .join("");
  teacherScopeList.querySelectorAll("button[data-scope-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-scope-remove"));
      if (!Number.isInteger(idx) || idx < 0 || idx >= groupScopeDraft.length) return;
      groupScopeDraft.splice(idx, 1);
      renderGroupScopeDraft();
    });
  });
}

function getSelectedValues(selectEl) {
  if (!selectEl) return [];
  return [...selectEl.selectedOptions].map((o) => String(o.value || "").trim()).filter(Boolean);
}

function renderScopeTopicOptions() {
  if (!teacherScopeTopics) return;
  const topics = Array.isArray(allScopeTopics) ? allScopeTopics : [];
  teacherScopeTopics.innerHTML = topics.length
    ? topics.map((t) => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("")
    : `<option value="" disabled>No topics available</option>`;
}

async function loadScopeTopicOptions() {
  try {
    const data = await api("/api/meta/scope-options");
    allScopeTopics = Array.isArray(data?.all_topics) ? data.all_topics : [];
    renderScopeTopicOptions();
  } catch (_error) {
    allScopeTopics = [];
    renderScopeTopicOptions();
  }
}

function formatSeconds(value) {
  const sec = Number(value || 0);
  if (!Number.isFinite(sec) || sec <= 0) return "-";
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

function formatDateTime(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value || "-");
  return d.toLocaleString();
}

function isTabletLikeDevice() {
  const coarse = window.matchMedia ? window.matchMedia("(pointer: coarse)").matches : false;
  const touchPoints = Number(navigator.maxTouchPoints || 0);
  const shortSide = Math.min(window.innerWidth || 0, window.innerHeight || 0);
  return coarse && touchPoints >= 1 && shortSide >= 700;
}

function applyStudentTheme(mode) {
  const normalized = mode === "dark" ? "dark" : "light";
  document.body.setAttribute("data-student-theme", normalized);
  if (themeLightBtn) themeLightBtn.classList.toggle("active", normalized === "light");
  if (themeDarkBtn) themeDarkBtn.classList.toggle("active", normalized === "dark");
}

function loadStudentTheme() {
  const stored = String(localStorage.getItem(STUDENT_THEME_KEY) || "").trim().toLowerCase();
  return stored === "dark" ? "dark" : "light";
}

function setStudentTheme(mode) {
  const normalized = mode === "dark" ? "dark" : "light";
  localStorage.setItem(STUDENT_THEME_KEY, normalized);
  applyStudentTheme(normalized);
}

function loadStudentPagePreference() {
  const v = String(localStorage.getItem(STUDENT_PAGE_KEY) || "").trim();
  return v === "profile" || v === "today-review" || v === "settings" ? v : "daily";
}

function saveStudentPagePreference(page) {
  const v = page === "profile" || page === "today-review" || page === "settings" ? page : "daily";
  localStorage.setItem(STUDENT_PAGE_KEY, v);
}

function loadTeacherPagePreference() {
  const v = String(localStorage.getItem(TEACHER_PAGE_KEY) || "").trim();
  return v === "groups" || v === "batch" ? v : "dashboard";
}

function saveTeacherPagePreference(page) {
  const v = page === "groups" || page === "batch" ? page : "dashboard";
  localStorage.setItem(TEACHER_PAGE_KEY, v);
}

function getDailyCursorKey(dateValue) {
  const uid = String(me?.id || me?.user_id || "anon");
  return `daily_cursor_${uid}_${String(dateValue || "")}`;
}

function saveDailyCursor(dateValue, index) {
  if (!dateValue) return;
  localStorage.setItem(getDailyCursorKey(dateValue), String(Math.max(0, Number(index || 0))));
}

function loadDailyCursor(dateValue) {
  if (!dateValue) return null;
  const raw = String(localStorage.getItem(getDailyCursorKey(dateValue)) || "").trim();
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

async function switchStudentPage(page) {
  const requested =
    page === "profile"
      ? "profile"
      : page === "today-review"
        ? "today-review"
        : page === "settings"
          ? "settings"
          : "daily";
  const target = requested === "today-review" && !dailyReviewAvailable ? "daily" : requested;
  document.body.setAttribute("data-student-page", target);
  saveStudentPagePreference(target);
  if (studentDailyPanel) studentDailyPanel.hidden = target !== "daily";
  if (studentProfilePanel) studentProfilePanel.hidden = target === "today-review";
  if (studentTodayReviewPage) studentTodayReviewPage.hidden = target !== "today-review";
  if (studentSettingsPage) studentSettingsPage.hidden = target !== "settings";
  if (studentAvatarShopPage && target !== "profile") studentAvatarShopPage.hidden = true;
  if (studentOwnedOverlay && target !== "profile") studentOwnedOverlay.hidden = true;
  if (shopPreviewCharacters && target !== "profile") shopPreviewCharacters.hidden = true;
  if (shopPreviewFrames && target !== "profile") shopPreviewFrames.hidden = true;
  if (shopDrawRevealOverlay && target !== "profile") shopDrawRevealOverlay.hidden = true;
  if (studentDailyLink) studentDailyLink.classList.toggle("active", target === "daily");
  if (studentProfileLink) studentProfileLink.classList.toggle("active", target === "profile");
  if (studentTodayReviewLink) studentTodayReviewLink.classList.toggle("active", target === "today-review");
  if (studentTodayReviewLink) studentTodayReviewLink.disabled = !dailyReviewAvailable;
  if (profileDailyMissionBtn) {
    const showMission = target === "profile";
    profileDailyMissionBtn.hidden = !showMission;
    profileDailyMissionBtn.style.display = showMission ? "" : "none";
  }

  if (target === "profile") {
    await loadStudentStats();
    await loadStudentReview();
  } else if (target === "today-review") {
    renderTodayReview(dailyAssignments, dailyDate);
    await typeset(dailyReviewList || studentList);
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
        "\\usepackage{tikz}",
        "\\usetikzlibrary{angles,quotes,calc}",
        "\\begin{document}",
        source,
        "\\end{document}"
      ].join("\n");

  const utf8 = new TextEncoder().encode(latexDoc);
  const compressed = window.pako.deflate(utf8, { level: 9 });
  const encoded = toBase64Url(compressed);
  return `https://kroki.io/tikz/svg/${encoded}`;
}

function extractQuestionAssets(rawText) {
  const raw = String(rawText || "");
  const figureUrls = [];
  const tikzBlocks = [];

  let text = raw.replace(/\[FIGURE:([^\]]+)\]/gi, (_m, url) => {
    figureUrls.push(String(url || "").trim());
    return "\n";
  });

  text = text.replace(/\[TIKZ\]([\s\S]*?)\[\/TIKZ\]/gi, (_m, block) => {
    const trimmed = String(block || "").trim();
    if (trimmed) {
      // Convert literal "\n" to real line breaks, but do not break commands like \node/\neq.
      tikzBlocks.push(trimmed.replace(/\\n(?![A-Za-z])/g, "\n"));
    }
    return "\n";
  });

  text = text.replace(/\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}/g, (block) => {
    const trimmed = String(block || "").trim();
    if (trimmed) {
      tikzBlocks.push(trimmed.replace(/\\n(?![A-Za-z])/g, "\n"));
    }
    return "\n";
  });

  return {
    cleanedText: text.replace(/\n{3,}/g, "\n\n").trim(),
    figureUrls: figureUrls.filter((url) => /^https?:\/\/\S+$/i.test(url)),
    tikzBlocks
  };
}

function sanitizeTikzBlockForPortal(block) {
  let s = String(block || "");
  // Keep renderer-safe labels in TikZ nodes.
  s = s.replace(/\\text\{([^}]*)\}/g, "$1");
  // \node[...] at (...) $...$; -> \node[...] at (...) {...};
  s = s.replace(
    /\\node(\[[^\]]*\])?\s*at\s*\(([^)]*)\)\s*\$([^$]+)\$\s*;/g,
    (_m, opt = "", coord, label) => `\\node${opt} at (${coord}) {${label}};`
  );
  // \node[...] at (...) {$...$}; -> \node[...] at (...) {...};
  s = s.replace(
    /\\node(\[[^\]]*\])?\s*at\s*\(([^)]*)\)\s*\{\$([^$]+)\$\}\s*;/g,
    (_m, opt = "", coord, label) => `\\node${opt} at (${coord}) {${label}};`
  );
  // Avoid plain-text underscore parse errors after sanitization.
  s = s.replace(/\{([^{}]*?)h_a([^{}]*?)\}/g, (_m, a, b) => `{${a}h\\_a${b}}`);
  return s;
}

function processTikzAsyncPortal() {
  const run = () => {
    try {
      if (window.tikzjax && typeof window.tikzjax.process === "function") {
        window.tikzjax.process();
      } else if (window.TikzJax && typeof window.TikzJax.process === "function") {
        window.TikzJax.process();
      }
    } catch (_err) {}
  };
  run();
  setTimeout(run, 50);
  setTimeout(run, 250);
}

function formatLatexForReadableLines(text, multiline = false) {
  let value = String(text || "").replace(/\\n/g, "\n").trim();
  if (!value) return "";

  const hasMathDelimiters = (line) => /(\$|\\\(|\\\[|\\begin\{)/.test(line);
  const normalizeUndelimitedLatexLine = (line) => {
    if (hasMathDelimiters(line)) return line;
    return line
      .replace(/\\Delta\b/g, "Delta")
      .replace(/\\geq?\b/g, ">=")
      .replace(/\\leq?\b/g, "<=")
      .replace(/\\neq\b/g, "!=")
      .replace(/\\approx\b/g, "~")
      .replace(/\\pm\b/g, "+/-")
      .replace(/\\angle\b/g, "angle ")
      .replace(/\\triangle\b/g, "triangle ")
      .replace(/\\circ\b/g, " degrees")
      .replace(/\\times\b/g, "x")
      .replace(/\\cdot\b/g, ".")
      .replace(/\\to\b/g, "->")
      .replace(/\\implies\b|\\Rightarrow\b/g, "=>")
      .replace(/\\left\b|\\right\b/g, "")
      .replace(/\\,/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  };

  if (multiline) {
    value = value
      .replace(/\s*(\\text\{Step\s*\d+[^}]*\})\s*/gi, "\n$1\n")
      .replace(/\s*(\\text\{Final:?[^}]*\})\s*/gi, "\n$1\n")
      .replace(/\s*(\\implies|\\Rightarrow)\s*/g, "\n$1 ")
      .replace(/\\text\{([^}]*)\}/g, "$1")
      .replace(/\\\(/g, "$")
      .replace(/\\\)/g, "$")
      .replace(/\\\[/g, "$$")
      .replace(/\\\]/g, "$$");
  }

  const lines = value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return "";

  const wrapLineIfNeeded = (line) => {
    const alreadyDisplay = /^\\\[[\s\S]*\\\]$/.test(line) || /^\$\$[\s\S]*\$\$$/.test(line);
    if (alreadyDisplay) return line;

    // If a line already has explicit inline math, still wrap whole line as display
    // so mixed LaTeX like \text{Step...} \(x+1\) is rendered consistently.
    const hasLatexCommand = /\\[a-zA-Z]+/.test(line);
    if (hasLatexCommand) return `\\[${line}\\]`;
    return line;
  };

  if (multiline) {
    // Keep solution lines as plain text with inline math markers;
    // wrapping whole lines in display math makes normal text lose spaces.
    value = lines.map((line) => normalizeUndelimitedLatexLine(line)).join("\n\n");
  } else if (lines.length > 1) {
    value = lines.map((line) => wrapLineIfNeeded(line)).join("\n");
  } else {
    const single = lines[0];
    const hasLatexCommand = /\\[a-zA-Z]+/.test(single);
    if (hasLatexCommand) {
      value = `\\[${single}\\]`;
    } else {
      value = single;
    }
  }

  return value;
}

function renderQuestionBody(target, rawText, options = {}) {
  const multiline = Boolean(options.multiline);
  const { cleanedText, figureUrls, tikzBlocks } = extractQuestionAssets(rawText);
  target.innerHTML = "";

  if (cleanedText) {
    const textDiv = document.createElement("div");
    textDiv.className = "math-content";
    textDiv.textContent = multiline ? formatLatexForReadableLines(cleanedText, true) : cleanedText;
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
      const safeBlock = sanitizeTikzBlockForPortal(block);
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
        const fallbackToTikzJax = () => {
          if (settled) return;
          settled = true;
          img.remove();
          const script = document.createElement("script");
          script.type = "text/tikz";
          script.textContent = safeBlock;
          holder.appendChild(script);
          processTikzAsyncPortal();
          setTimeout(() => {
            if (!holder.querySelector("svg")) {
              const warn = document.createElement("div");
              warn.className = "message error";
              warn.textContent = "TikZ preview failed. Please use [FIGURE:https://...] image link for this question.";
              holder.appendChild(warn);
            }
          }, 700);
        };
        img.onload = () => {
          settled = true;
        };
        img.onerror = fallbackToTikzJax;
        setTimeout(() => {
          if (!settled) fallbackToTikzJax();
        }, 2500);
        holder.appendChild(img);
      } else {
        const script = document.createElement("script");
        script.type = "text/tikz";
        script.textContent = safeBlock;
        holder.appendChild(script);
        processTikzAsyncPortal();
      }

      tikzList.appendChild(holder);
    }
    target.appendChild(tikzList);
  }
}

function detectMcLabels(latexCode) {
  const labels = [];
  const seen = new Set();
  const matches = String(latexCode || "").match(/\b([A-H])\./g) || [];
  for (const token of matches) {
    const label = token[0];
    if (seen.has(label)) continue;
    seen.add(label);
    labels.push(label);
  }
  if (labels.length >= 2) {
    const order = ["A", "B", "C", "D", "E", "F", "G", "H"];
    return labels.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }
  return ["A", "B", "C", "D"];
}

function buildSubmissionState(submission) {
  if (!submission) {
    return { text: "Unsubmitted", cardClass: "is-pending", badgeClass: "is-pending" };
  }
  if (submission.is_correct === true) {
    return { text: "Correct", cardClass: "is-correct", badgeClass: "is-correct" };
  }
  if (submission.is_correct === false) {
    return { text: "Wrong", cardClass: "is-wrong", badgeClass: "is-wrong" };
  }
  return { text: "Submitted", cardClass: "is-submitted", badgeClass: "is-submitted" };
}

function getSelectedMcAnswer(questionId) {
  const group = studentList.querySelector(`.mc-options[data-question-id='${questionId}']`);
  if (!group) return "";
  return String(group.getAttribute("data-selected") || "").trim();
}

function setSelectedMcAnswer(group, selected) {
  const normalized = String(selected || "").trim().toUpperCase();
  group.setAttribute("data-selected", normalized);
  group.querySelectorAll("button[data-option]").forEach((btn) => {
    const isSelected = String(btn.getAttribute("data-option") || "") === normalized;
    btn.classList.toggle("selected", isSelected);
    btn.setAttribute("aria-pressed", isSelected ? "true" : "false");
  });
}

function wireMcButtons() {
  studentList.querySelectorAll(".mc-options").forEach((group) => {
    group.querySelectorAll("button[data-option]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const option = String(btn.getAttribute("data-option") || "");
        setSelectedMcAnswer(group, option);
      });
    });
  });
}

function base64UrlToJson(tokenPart) {
  const base64 = String(tokenPart || "").replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4 || 4)) % 4);
  return JSON.parse(atob(padded));
}

function decodeGoogleCredential(credential) {
  const parts = String(credential || "").split(".");
  if (parts.length < 2) throw new Error("Invalid Google credential token.");
  return base64UrlToJson(parts[1]);
}

async function requestBrowserGoogleEmail(clientId) {
  return new Promise((resolve, reject) => {
    if (!window.google?.accounts?.id) {
      reject(new Error("Google account verifier is not available in this browser."));
      return;
    }

    let done = false;
    const finish = (fn, value) => {
      if (done) return;
      done = true;
      clearTimeout(timeout);
      fn(value);
    };

    const timeout = setTimeout(() => {
      finish(reject, new Error("Google account verification timed out. Please try again."));
    }, 60000);

    window.google.accounts.id.cancel();
    window.google.accounts.id.initialize({
      client_id: clientId,
      auto_select: false,
      callback: (response) => {
        try {
          const payload = decodeGoogleCredential(response?.credential);
          const email = normalizeEmail(payload?.email);
          if (!email || payload?.email_verified !== true) {
            finish(reject, new Error("Google account email is not verified."));
            return;
          }
          finish(resolve, email);
        } catch (_error) {
          finish(reject, new Error("Failed to verify browser Google account."));
        }
      }
    });

    window.google.accounts.id.prompt((notification) => {
      if (done) return;
      const notDisplayed = notification?.isNotDisplayed && notification.isNotDisplayed();
      const skipped = notification?.isSkippedMoment && notification.isSkippedMoment();
      const dismissed = notification?.isDismissedMoment && notification.isDismissedMoment();
      if (notDisplayed || skipped || dismissed) {
        finish(reject, new Error("Please choose your browser Google account to continue."));
      }
    });
  });
}

async function verifyBrowserAccountEmail(typedEmail) {
  const googleClientId = String(clientConfig?.google_client_id || "").trim();
  if (!googleClientId) {
    return { enforced: false };
  }

  if (verifiedBrowserEmail && verifiedBrowserEmail === typedEmail) return { enforced: true };

  const browserEmail = await requestBrowserGoogleEmail(googleClientId);
  if (browserEmail !== typedEmail) {
    throw new Error(`Typed email must match your browser Google account (${browserEmail}).`);
  }

  verifiedBrowserEmail = browserEmail;
  return { enforced: true };
}

async function typeset(target) {
  if (window.MathJax && window.MathJax.typesetPromise) {
    try {
      await window.MathJax.typesetPromise([target]);
    } catch (_err) {
      // Ignore rendering errors to keep app responsive.
    }
  }
}

async function api(path, options = {}) {
  const { timeout_ms, ...fetchOptions } = options || {};
  const headers = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers || {})
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const timeoutMs = Number(timeout_ms || 12000);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch(path, { ...fetchOptions, headers, signal: controller.signal });
  } catch (error) {
    if (String(error?.name || "") === "AbortError") {
      throw new Error(`Request timeout after ${Math.round(timeoutMs / 1000)}s: ${path}`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
  const text = await response.text();
  let payload = {};

  try {
    payload = text ? JSON.parse(text) : {};
  } catch (_err) {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.error || `Request failed (${response.status})`);
  }

  return payload;
}

function showAuthView() {
  authCard.hidden = false;
  appCard.hidden = true;
  studentView.hidden = true;
  teacherView.hidden = true;
  if (teacherBatchPage) teacherBatchPage.hidden = true;
  if (teacherGroupPage) teacherGroupPage.hidden = true;
  if (teacherStudentPage) teacherStudentPage.hidden = true;
}

function showAppView() {
  authCard.hidden = true;
  appCard.hidden = false;
}

async function loadMe() {
  me = await api("/api/auth/me");

  if (me.role === "teacher") {
    document.body.setAttribute("data-student-page", "teacher");
    welcomeTitle.textContent = `Welcome, ${me.full_name}`;
    welcomeSubtitle.textContent = "Teacher account: monitor student completion and accuracy.";
    if (welcomeProfile) welcomeProfile.classList.remove("student-header");
    if (welcomeAvatarImage) welcomeAvatarImage.textContent = "👩‍🏫";
    if (openAvatarShopBtn) openAvatarShopBtn.hidden = true;
    if (topShopBtn) topShopBtn.hidden = true;
    if (profileDailyMissionBtn) profileDailyMissionBtn.hidden = true;
    if (topTokenBadge) topTokenBadge.hidden = true;
    studentView.hidden = true;
    const preferredTeacherPage = loadTeacherPagePreference();
    if (preferredTeacherPage === "groups") showTeacherGroupPage();
    else if (preferredTeacherPage === "batch") showTeacherBatchPage();
    else showTeacherDashboardPage();
    if (themeLightBtn) themeLightBtn.disabled = true;
    if (themeDarkBtn) themeDarkBtn.disabled = true;
    if (topChangePwBtn) topChangePwBtn.hidden = true;
    if (topChangePwPanel) topChangePwPanel.hidden = true;
    applyStudentTheme("light");
    await loadScopeTopicOptions();
    await loadTeacherOverview();
    if (preferredTeacherPage === "groups" && teacherGroupSelect?.value) {
      try {
        await loadTeacherGroupStats();
      } catch (_e) {
        // Keep teacher page usable.
      }
    }
  } else {
    styleShopState = loadStyleShopState(me.user_id);
    serverTokenBalance = Number(me.token_balance || 0);
    if (me.selected_frame) {
      frameStyleValueMap.set(String(me.selected_frame.id), String(me.selected_frame.style_key || "basic"));
      styleShopState.selected.frame = String(me.selected_frame.id);
      saveStyleShopState(me.user_id, styleShopState);
    }
    renderStudentWelcomeName();
    welcomeSubtitle.textContent = "";
    if (welcomeProfile) welcomeProfile.classList.add("student-header");
    renderWelcomeAvatar(me.selected_avatar || null);
    applyStyleShopVisuals();
    if (openAvatarShopBtn) openAvatarShopBtn.hidden = true;
    if (topShopBtn) topShopBtn.hidden = false;
    if (profileDailyMissionBtn) profileDailyMissionBtn.hidden = true;
    setTopTokenBadge();
    teacherView.hidden = true;
    if (teacherStudentPage) teacherStudentPage.hidden = true;
    studentView.hidden = false;
    if (themeLightBtn) themeLightBtn.disabled = false;
    if (themeDarkBtn) themeDarkBtn.disabled = false;
    if (topChangePwBtn) topChangePwBtn.hidden = false;
    applyStudentTheme(loadStudentTheme());
    await loadStudentDaily();
    const forceProfile = String(localStorage.getItem(STUDENT_FORCE_PROFILE_ONCE_KEY) || "") === "1";
    if (forceProfile) localStorage.removeItem(STUDENT_FORCE_PROFILE_ONCE_KEY);
    await switchStudentPage(forceProfile ? "profile" : loadStudentPagePreference());
  }
}

function renderTodayReview(assignments, date) {
  if (!studentTodayReviewPage || !dailyReviewStats || !dailyReviewList) return;
  const allItems = Array.isArray(assignments) ? assignments : [];
  const submittedItems = allItems.filter((x) => Boolean(x.submission));
  const missionDone = allItems.length > 0 && submittedItems.length >= allItems.length;
  studentTodayReviewPage.hidden = !missionDone;
  if (!missionDone) return;

  const correctCount = submittedItems.filter((x) => x.submission?.is_correct === true).length;
  const total = allItems.length;
  const avgTime = Math.round(
    submittedItems.reduce((acc, x) => acc + Number(x.submission?.time_spent_seconds || 0), 0) / Math.max(submittedItems.length, 1)
  );

  dailyReviewStats.innerHTML = `
    <div class="stat"><strong>Date:</strong> ${escapeHtml(date)}</div>
    <div class="stat"><strong>Done:</strong> ${submittedItems.length}/${total}</div>
    <div class="stat"><strong>Correct:</strong> ${Math.round((correctCount / Math.max(total, 1)) * 100)}%</div>
    <div class="stat"><strong>Avg Time:</strong> ${formatSeconds(avgTime)}</div>
  `;

  dailyReviewList.innerHTML = submittedItems
    .map((item) => {
      const q = item.question || {};
      const state = buildSubmissionState(item.submission);
      return `
        <details class="solution-panel review-card">
          <summary>
            <span class="badge ${state.badgeClass}">${escapeHtml(state.text)}</span>
            Question ${item.slot} ??${escapeHtml(String(q.topic || "Topic"))} ??${escapeHtml(String(q.difficulty || "-"))}
          </summary>
          <div class="question-body" id="today-review-question-${item.assignment_id}"></div>
          <div class="summary">
            <div class="stat"><strong>Time Spent:</strong> ${formatSeconds(item.submission?.time_spent_seconds)}</div>
            <div class="stat"><strong>Your Answer:</strong> ${escapeHtml(String(item.submission?.answer_text || "-"))}</div>
            <div class="stat"><strong>Correct Answer:</strong> ${escapeHtml(String(q.answer_text || "-"))}</div>
          </div>
          <details class="solution-panel" open>
            <summary>Solution</summary>
            <div class="solution-body" id="today-review-solution-${item.assignment_id}"></div>
          </details>
        </details>
      `;
    })
    .join("");

  submittedItems.forEach((item) => {
    const q = item.question || {};
    const qBody = document.getElementById(`today-review-question-${item.assignment_id}`);
    const sBody = document.getElementById(`today-review-solution-${item.assignment_id}`);
    if (qBody) renderQuestionBody(qBody, q.latex_code || "");
    if (sBody) renderQuestionBody(sBody, q.solution_latex || "", { multiline: true });
  });
}

function updateDailyMissionIndicator(submittedCount, totalCount) {
  const submitted = Number(submittedCount || 0);
  const done = submitted >= 5;
  todayMissionCompleted = done;
  if (profileDailyMissionAlert) {
    profileDailyMissionAlert.hidden = done;
    profileDailyMissionAlert.style.display = done ? "none" : "inline-grid";
  }
}

async function renderCurrentDailyQuestion() {
  if (!dailyAssignments.length) {
    studentList.innerHTML = "<p>No questions assigned yet.</p>";
    if (dailyProgressLabel) dailyProgressLabel.textContent = "Question 0 / 0";
    return;
  }

  const item = dailyAssignments[currentDailyIndex];
  const q = item.question || {};
  const isSubmitted = Boolean(item.submission);
  const answerValue = String(item.submission?.answer_text || "").trim();
  const state = buildSubmissionState(item.submission);
  const questionType = String(q.question_type || "").trim();
  const isMc = questionType === "MC";
  const mcLabels = detectMcLabels(q.latex_code || "");
  const topic = String(q.topic || "").trim() || "General";
  const difficulty = String(q.difficulty || "").trim() || "-";
  const hasSolution = isSubmitted && String(q.solution_latex || "").trim();
  const hasCorrectAnswer = isSubmitted && String(q.answer_text || "").trim();

  studentList.innerHTML = `
    <article class="question-card ${state.cardClass}">
      <div class="question-head">
        <div class="question-head-main">
          <strong>Question ${item.slot}</strong>
          <div class="inline-tools rough-tools top-rough-tools">
            <button type="button" class="secondary tool-btn draw-main-btn" id="rough-draw-${q.id}" title="Draw on screen" aria-label="Draw on screen">Draw On Screen</button>
            <button type="button" class="secondary tool-btn icon-tool-btn pen-tool-btn" id="rough-pen-${q.id}" hidden title="Pen colors" aria-label="Pen colors"><span class="tool-art pen-art" aria-hidden="true"></span></button>
            <div class="color-palette" id="rough-pen-palette-${q.id}" hidden>
              ${PEN_COLOR_OPTIONS.map((c) => `<button type="button" class="color-dot" data-pen-color="${escapeHtml(c)}" style="--dot:${escapeHtml(c)}" aria-label="Pen color ${escapeHtml(c)}"></button>`).join("")}
            </div>
            <button type="button" class="secondary tool-btn icon-tool-btn highlighter-tool-btn" id="rough-highlighter-${q.id}" hidden title="Highlight colors" aria-label="Highlight colors"><span class="tool-art highlighter-art" aria-hidden="true"></span></button>
            <div class="color-palette" id="rough-highlighter-palette-${q.id}" hidden>
              ${HIGHLIGHTER_COLOR_OPTIONS.map((c) => `<button type="button" class="color-dot" data-highlighter-color="${escapeHtml(c)}" style="--dot:${escapeHtml(c)}" aria-label="Highlighter color ${escapeHtml(c)}"></button>`).join("")}
            </div>
            <button type="button" class="secondary tool-btn icon-tool-btn eraser-tool-btn" id="rough-eraser-${q.id}" hidden title="Eraser" aria-label="Eraser"><span class="tool-art eraser-art" aria-hidden="true"></span></button>
            <button type="button" class="secondary tool-btn icon-tool-btn undo-tool-btn" id="rough-undo-${q.id}" hidden title="Undo" aria-label="Undo">↶</button>
            <button type="button" class="secondary tool-btn icon-tool-btn clear-tool-btn" id="rough-clear-${q.id}" hidden title="Clear drawing" aria-label="Clear drawing">✕</button>
          </div>
        </div>
        <div class="question-head-right">
          <div class="question-labels question-head-labels">
            <span class="mini-tag topic-tag">${escapeHtml(topic)}</span>
            <span class="mini-tag lv-tag">${escapeHtml(difficulty)}</span>
            <span class="mini-tag type-tag">${escapeHtml(questionType || "Short Answer")}</span>
          </div>
          <span class="badge ${state.badgeClass}">${escapeHtml(state.text)}</span>
        </div>
      </div>
      <div class="question-split ${hasSolution ? "has-solution" : ""}">
        <div class="question-main">
          <div class="question-body" id="question-body-${q.id}"></div>
          ${
            isMc
              ? `
                <div class="mc-wrap">
                  <div class="answer-label">Choose one answer</div>
                  <div class="mc-options" data-question-id="${q.id}" data-selected="${escapeHtml(answerValue.toUpperCase())}">
                    ${mcLabels
                      .map(
                        (label) =>
                          `<button type="button" class="mc-choice" data-option="${label}" aria-pressed="false" ${
                            isSubmitted ? "disabled" : ""
                          }>${label}</button>`
                      )
                      .join("")}
                  </div>
                </div>
              `
              : `
                <label>
                  Your answer
                  <textarea data-question-id="${q.id}" rows="2" placeholder="Type your answer here..." ${
                    isSubmitted ? "readonly disabled" : ""
                  }>${escapeHtml(answerValue)}</textarea>
                </label>
              `
          }
          <button type="button" data-submit-id="${q.id}" data-date="${escapeHtml(item.assignment_date)}" ${
            isSubmitted ? "disabled" : ""
          }>${isSubmitted ? "Submitted" : "Submit Answer"}</button>
        </div>
        ${
          hasSolution
            ? `
              <aside class="question-side">
                ${
                  hasCorrectAnswer
                    ? `
                      <div class="answer-reveal side-answer-reveal">
                        <div class="answer-reveal-label">Correct Answer</div>
                        <div class="answer-reveal-value">${escapeHtml(String(q.answer_text || "").trim())}</div>
                      </div>
                    `
                    : ""
                }
                <details class="solution-panel side-solution-panel" open>
                  <summary>Solution</summary>
                  <div class="solution-body" id="solution-body-${q.id}"></div>
                </details>
              </aside>
            `
            : ""
        }
      </div>
      <button type="button" class="secondary tool-btn rough-float-toggle icon-tool-btn" id="rough-float-${q.id}" hidden title="Stop drawing (Esc)" aria-label="Stop drawing">✕</button>
      <canvas id="rough-canvas-${q.id}" class="rough-screen-canvas" aria-label="Rough work drawing area"></canvas>
    </article>
  `;

  const body = document.getElementById(`question-body-${q.id}`);
  if (body) renderQuestionBody(body, q.latex_code || "");
  const solutionBody = document.getElementById(`solution-body-${q.id}`);
  if (solutionBody) renderQuestionBody(solutionBody, q.solution_latex || "", { multiline: true });
  initializeRoughWorkCanvas(q.id);
  if (!item.submission && q.id && !questionStartTimes.has(Number(q.id))) {
    questionStartTimes.set(Number(q.id), Date.now());
  }

  wireMcButtons();
  studentList.querySelectorAll(".mc-options").forEach((group) => {
    setSelectedMcAnswer(group, group.getAttribute("data-selected") || "");
  });

  const submitBtn = studentList.querySelector("button[data-submit-id]");
  if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
      const questionId = Number(submitBtn.getAttribute("data-submit-id"));
      const assignmentDate = submitBtn.getAttribute("data-date");
      const mcAnswer = getSelectedMcAnswer(questionId);
      const textarea = studentList.querySelector(`textarea[data-question-id='${questionId}']`);
      const textAnswer = String(textarea?.value || "").trim();
      const answer = mcAnswer || textAnswer;

      if (!answer) {
        setMessage(studentMessage, "Please choose/type an answer before submitting.", "error");
        return;
      }
      disableDrawModeForQuestion(questionId);

      submitBtn.disabled = true;
      try {
        const started = questionStartTimes.get(questionId);
        const elapsedSeconds = started ? Math.max(1, Math.round((Date.now() - started) / 1000)) : null;
        let carelessError = false;
        const expectedAnswer = String(q.answer_text || "").trim();
        const judged = compareAnswerClient(answer, expectedAnswer);
        if (judged === false) {
          const feedbackChoice = await askWrongFeedbackChoice();
          carelessError = feedbackChoice === "careless";
        }
        const submitResult = await api("/api/student/submit", {
          method: "POST",
          body: JSON.stringify({
            question_id: questionId,
            assignment_date: assignmentDate,
            answer_text: answer,
            time_spent_seconds: elapsedSeconds,
            careless_error: carelessError
          })
        });
        const reward = Number(submitResult?.token_reward || 0);
        if (Number.isFinite(Number(submitResult?.token_balance))) {
          serverTokenBalance = Number(submitResult.token_balance);
          setTopTokenBadge();
        }
        if (reward > 0) setMessage(studentMessage, `Answer submitted. +${reward} tokens`, "success");
        else setMessage(studentMessage, "Answer submitted.", "success");
        clearDrawStateForQuestion(questionId);
        lastSubmittedQuestionId = questionId;
        questionStartTimes.delete(questionId);
        await loadStudentDaily();
      } catch (error) {
        setMessage(studentMessage, error.message, "error");
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  if (dailyProgressLabel) {
    dailyProgressLabel.textContent = `Question ${currentDailyIndex + 1} / ${dailyAssignments.length}`;
  }
  saveDailyCursor(dailyDate, currentDailyIndex);
  if (dailyPrevBtn) dailyPrevBtn.disabled = currentDailyIndex <= 0;
  if (dailyNextBtn) {
    const canForward = isSubmitted && currentDailyIndex < dailyAssignments.length - 1;
    dailyNextBtn.disabled = !canForward;
  }

  await typeset(studentList);
}

function initializeRoughWorkCanvas(questionId) {
  const canvas = document.getElementById(`rough-canvas-${questionId}`);
  const drawBtn = document.getElementById(`rough-draw-${questionId}`);
  const floatToggleBtn = document.getElementById(`rough-float-${questionId}`);
  const penBtn = document.getElementById(`rough-pen-${questionId}`);
  const penPalette = document.getElementById(`rough-pen-palette-${questionId}`);
  const highlighterBtn = document.getElementById(`rough-highlighter-${questionId}`);
  const highlighterPalette = document.getElementById(`rough-highlighter-palette-${questionId}`);
  const eraserBtn = document.getElementById(`rough-eraser-${questionId}`);
  const undoBtn = document.getElementById(`rough-undo-${questionId}`);
  const clearBtn = document.getElementById(`rough-clear-${questionId}`);
  if (!canvas) return;
  activeRoughQuestionId = Number(questionId);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const penColorDots = penPalette ? [...penPalette.querySelectorAll("button[data-pen-color]")] : [];
  const highlighterColorDots = highlighterPalette
    ? [...highlighterPalette.querySelectorAll("button[data-highlighter-color]")]
    : [];
  const toRgba = (hex, alpha) => {
    const normalized = String(hex || "").trim().replace("#", "");
    if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return `rgba(255,235,59,${alpha})`;
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const applyStrokeStyle = () => {
    const tool = roughWorkToolByQuestion.get(Number(questionId)) || "pen";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = 18;
    } else if (tool === "highlighter") {
      ctx.globalCompositeOperation = "source-over";
      const c = roughWorkHighlighterColorByQuestion.get(Number(questionId)) || HIGHLIGHTER_COLOR_OPTIONS[0];
      ctx.strokeStyle = toRgba(c, 0.04);
      ctx.lineWidth = 7;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = roughWorkPenColorByQuestion.get(Number(questionId)) || PEN_COLOR_OPTIONS[0];
      ctx.lineWidth = 3;
    }
  };

  const updateToolButtons = () => {
    const tool = roughWorkToolByQuestion.get(Number(questionId)) || "pen";
    const drawEnabled = Boolean(roughWorkDrawEnabledByQuestion.get(Number(questionId)));
    const penColor = roughWorkPenColorByQuestion.get(Number(questionId)) || PEN_COLOR_OPTIONS[0];
    const highlighterColor = roughWorkHighlighterColorByQuestion.get(Number(questionId)) || HIGHLIGHTER_COLOR_OPTIONS[0];
    if (drawBtn) drawBtn.classList.toggle("active-tool", drawEnabled);
    if (drawBtn) drawBtn.textContent = drawEnabled ? "Stop Drawing" : "Draw On Screen";
    if (floatToggleBtn) floatToggleBtn.hidden = !drawEnabled;
    if (penBtn) penBtn.hidden = !drawEnabled;
    if (highlighterBtn) highlighterBtn.hidden = !drawEnabled;
    if (eraserBtn) eraserBtn.hidden = !drawEnabled;
    if (undoBtn) undoBtn.hidden = !drawEnabled;
    if (clearBtn) clearBtn.hidden = !drawEnabled;
    if (penBtn) penBtn.classList.toggle("active-tool", tool === "pen");
    if (highlighterBtn) highlighterBtn.classList.toggle("active-tool", tool === "highlighter");
    if (eraserBtn) eraserBtn.classList.toggle("active-tool", tool === "eraser");
    if (penBtn) penBtn.style.setProperty("--tool-accent", penColor);
    if (highlighterBtn) highlighterBtn.style.setProperty("--tool-accent", highlighterColor);
    penColorDots.forEach((btn) => {
      const c = String(btn.getAttribute("data-pen-color") || "").trim().toLowerCase();
      btn.classList.toggle("active", c === penColor.toLowerCase());
    });
    highlighterColorDots.forEach((btn) => {
      const c = String(btn.getAttribute("data-highlighter-color") || "").trim().toLowerCase();
      btn.classList.toggle("active", c === highlighterColor.toLowerCase());
    });
    if (!drawEnabled) {
      if (penPalette) penPalette.hidden = true;
      if (highlighterPalette) highlighterPalette.hidden = true;
    }
    canvas.classList.toggle("enabled", drawEnabled);
  };

  const restoreFromSaved = () => {
    const dataUrl = roughWorkDataByQuestion.get(Number(questionId));
    if (!dataUrl) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = dataUrl;
  };

  const clearCanvasAndState = () => {
    const key = Number(questionId);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    roughWorkDataByQuestion.delete(key);
    roughWorkHistoryByQuestion.set(key, [""]);
  };

  const renderFromHistoryTop = () => {
    const history = roughWorkHistoryByQuestion.get(Number(questionId)) || [];
    const top = history.length ? history[history.length - 1] : "";
    roughWorkDataByQuestion.set(Number(questionId), top);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!top) return;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = top;
  };

  const resizeCanvas = () => {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const targetWidth = Math.max(Math.floor(window.innerWidth * ratio), 1);
    const targetHeight = Math.max(Math.floor(window.innerHeight * ratio), 1);
    if (canvas.width === targetWidth && canvas.height === targetHeight) return;

    const previous = roughWorkDataByQuestion.get(Number(questionId)) || "";
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    applyStrokeStyle();
    if (previous) restoreFromSaved();
  };

  resizeCanvas();
  restoreFromSaved();
  if (!roughWorkToolByQuestion.has(Number(questionId))) {
    roughWorkToolByQuestion.set(Number(questionId), "pen");
  }
  if (!roughWorkPenColorByQuestion.has(Number(questionId))) {
    roughWorkPenColorByQuestion.set(Number(questionId), PEN_COLOR_OPTIONS[0]);
  }
  if (!roughWorkHighlighterColorByQuestion.has(Number(questionId))) {
    roughWorkHighlighterColorByQuestion.set(Number(questionId), HIGHLIGHTER_COLOR_OPTIONS[0]);
  }
  roughWorkDrawEnabledByQuestion.set(Number(questionId), false);
  updateToolButtons();

  let isDrawing = false;
  let activePointerId = null;

  const getPos = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };

  const saveSnapshot = () => {
    const dataUrl = canvas.toDataURL("image/png");
    roughWorkDataByQuestion.set(Number(questionId), dataUrl);
    const key = Number(questionId);
    if (!roughWorkHistoryByQuestion.has(key)) roughWorkHistoryByQuestion.set(key, []);
    const history = roughWorkHistoryByQuestion.get(key);
    if (history.length && history[history.length - 1] === dataUrl) return;
    history.push(dataUrl);
    if (history.length > 100) history.shift();
  };

  canvas.addEventListener("pointerdown", (event) => {
    if (!roughWorkDrawEnabledByQuestion.get(Number(questionId))) return;
    const prevPointerEvents = canvas.style.pointerEvents;
    canvas.style.pointerEvents = "none";
    const under = document.elementFromPoint(event.clientX, event.clientY);
    canvas.style.pointerEvents = prevPointerEvents;
    if (under instanceof Element) {
      const passThroughTarget = under.closest(".mc-choice:not([disabled]), button[data-submit-id]:not([disabled])");
      if (passThroughTarget instanceof HTMLElement) {
        passThroughTarget.click();
        return;
      }
    }
    event.preventDefault();
    const { x, y } = getPos(event);
    isDrawing = true;
    activePointerId = event.pointerId;
    applyStrokeStyle();
    ctx.beginPath();
    ctx.moveTo(x, y);
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!roughWorkDrawEnabledByQuestion.get(Number(questionId))) return;
    if (!isDrawing || activePointerId !== event.pointerId) {
      const prevPointerEvents = canvas.style.pointerEvents;
      canvas.style.pointerEvents = "none";
      const under = document.elementFromPoint(event.clientX, event.clientY);
      canvas.style.pointerEvents = prevPointerEvents;
      const clickable = under instanceof Element ? under.closest(".mc-choice:not([disabled]), button[data-submit-id]:not([disabled])") : null;
      canvas.style.cursor = clickable ? "pointer" : "crosshair";
      return;
    }
    event.preventDefault();
    canvas.style.cursor = "crosshair";
    const { x, y } = getPos(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  });

  const endDraw = (event) => {
    if (!isDrawing || activePointerId !== event.pointerId) return;
    event.preventDefault();
    isDrawing = false;
    activePointerId = null;
    canvas.style.cursor = "crosshair";
    saveSnapshot();
  };

  canvas.addEventListener("pointerup", endDraw);
  canvas.addEventListener("pointercancel", endDraw);
  canvas.addEventListener("lostpointercapture", () => {
    if (!isDrawing) return;
    isDrawing = false;
    activePointerId = null;
    saveSnapshot();
  });

  if (drawBtn) {
    drawBtn.addEventListener("click", () => {
      const key = Number(questionId);
      const nextEnabled = !roughWorkDrawEnabledByQuestion.get(key);
      roughWorkDrawEnabledByQuestion.set(key, nextEnabled);
      if (!nextEnabled) clearCanvasAndState();
      updateToolButtons();
    });
  }

  if (floatToggleBtn) {
    floatToggleBtn.addEventListener("click", () => {
      const key = Number(questionId);
      roughWorkDrawEnabledByQuestion.set(key, false);
      clearCanvasAndState();
      updateToolButtons();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const key = Number(questionId);
      roughWorkDataByQuestion.delete(key);
      roughWorkHistoryByQuestion.set(key, [""]);
      if (penPalette) penPalette.hidden = true;
      if (highlighterPalette) highlighterPalette.hidden = true;
    });
  }

  if (undoBtn) {
    undoBtn.addEventListener("click", () => {
      const key = Number(questionId);
      const history = roughWorkHistoryByQuestion.get(key) || [];
      if (!history.length) return;
      history.pop();
      roughWorkHistoryByQuestion.set(key, history);
      renderFromHistoryTop();
      if (penPalette) penPalette.hidden = true;
      if (highlighterPalette) highlighterPalette.hidden = true;
      applyStrokeStyle();
    });
  }

  const closePalettes = () => {
    if (penPalette) penPalette.hidden = true;
    if (highlighterPalette) highlighterPalette.hidden = true;
  };

  const positionPalette = (paletteEl, anchorBtn) => {
    if (!paletteEl || !anchorBtn) return;
    const left = Math.max(0, anchorBtn.offsetLeft);
    const top = anchorBtn.offsetTop + anchorBtn.offsetHeight + 6;
    paletteEl.style.left = `${left}px`;
    paletteEl.style.top = `${top}px`;
  };

  if (penBtn) {
    penBtn.addEventListener("click", () => {
      roughWorkToolByQuestion.set(Number(questionId), "pen");
      if (penPalette) {
        const show = penPalette.hidden;
        closePalettes();
        if (show) positionPalette(penPalette, penBtn);
        penPalette.hidden = !show;
      } else {
        closePalettes();
      }
      applyStrokeStyle();
      updateToolButtons();
    });
  }

  if (highlighterBtn) {
    highlighterBtn.addEventListener("click", () => {
      roughWorkToolByQuestion.set(Number(questionId), "highlighter");
      if (highlighterPalette) {
        const show = highlighterPalette.hidden;
        closePalettes();
        if (show) positionPalette(highlighterPalette, highlighterBtn);
        highlighterPalette.hidden = !show;
      } else {
        closePalettes();
      }
      applyStrokeStyle();
      updateToolButtons();
    });
  }

  penColorDots.forEach((btn) => {
    btn.addEventListener("click", () => {
      const c = String(btn.getAttribute("data-pen-color") || "").trim();
      if (!c) return;
      roughWorkToolByQuestion.set(Number(questionId), "pen");
      roughWorkPenColorByQuestion.set(Number(questionId), c);
      closePalettes();
      applyStrokeStyle();
      updateToolButtons();
    });
  });

  highlighterColorDots.forEach((btn) => {
    btn.addEventListener("click", () => {
      const c = String(btn.getAttribute("data-highlighter-color") || "").trim();
      if (!c) return;
      roughWorkToolByQuestion.set(Number(questionId), "highlighter");
      roughWorkHighlighterColorByQuestion.set(Number(questionId), c);
      closePalettes();
      applyStrokeStyle();
      updateToolButtons();
    });
  });

  if (eraserBtn) {
    eraserBtn.addEventListener("click", () => {
      roughWorkToolByQuestion.set(Number(questionId), "eraser");
      closePalettes();
      applyStrokeStyle();
      updateToolButtons();
    });
  }


if (!roughKeyboardBound) {
    window.addEventListener("keydown", (event) => {
      const key = Number(activeRoughQuestionId || 0);
      if (!key) return;
      if (event.key === "Escape") {
        roughWorkDrawEnabledByQuestion.set(key, false);
        const activeCanvas = document.getElementById(`rough-canvas-${key}`);
        if (activeCanvas) {
          const activeCtx = activeCanvas.getContext("2d");
          if (activeCtx) {
            activeCtx.globalCompositeOperation = "source-over";
            activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
            roughWorkDataByQuestion.delete(key);
            roughWorkHistoryByQuestion.set(key, [""]);
          }
        }
      } else if (event.key === "d" || event.key === "D") {
        const nextEnabled = !roughWorkDrawEnabledByQuestion.get(key);
        roughWorkDrawEnabledByQuestion.set(key, nextEnabled);
        if (!nextEnabled) {
          const activeCanvas = document.getElementById(`rough-canvas-${key}`);
          if (activeCanvas) {
            const activeCtx = activeCanvas.getContext("2d");
            if (activeCtx) {
              activeCtx.globalCompositeOperation = "source-over";
              activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
              roughWorkDataByQuestion.delete(key);
              roughWorkHistoryByQuestion.set(key, [""]);
            }
          }
        }
      } else {
        return;
      }
      const activeCanvas = document.getElementById(`rough-canvas-${key}`);
      const activeDrawBtn = document.getElementById(`rough-draw-${key}`);
      const activeFloatBtn = document.getElementById(`rough-float-${key}`);
      const activePenBtn = document.getElementById(`rough-pen-${key}`);
      const activePenPalette = document.getElementById(`rough-pen-palette-${key}`);
      const activeHighlighterBtn = document.getElementById(`rough-highlighter-${key}`);
      const activeHighlighterPalette = document.getElementById(`rough-highlighter-palette-${key}`);
      const activeEraserBtn = document.getElementById(`rough-eraser-${key}`);
      const activeUndoBtn = document.getElementById(`rough-undo-${key}`);
      const activeClearBtn = document.getElementById(`rough-clear-${key}`);
      if (activeCanvas) {
        const drawEnabled = Boolean(roughWorkDrawEnabledByQuestion.get(key));
        activeCanvas.classList.toggle("enabled", drawEnabled);
        if (activeDrawBtn) {
          activeDrawBtn.classList.toggle("active-tool", drawEnabled);
          activeDrawBtn.textContent = drawEnabled ? "Stop Drawing" : "Draw On Screen";
        }
        if (activeFloatBtn) activeFloatBtn.hidden = !drawEnabled;
        if (activePenBtn) activePenBtn.hidden = !drawEnabled;
        if (activeHighlighterBtn) activeHighlighterBtn.hidden = !drawEnabled;
        if (activeEraserBtn) activeEraserBtn.hidden = !drawEnabled;
        if (activeUndoBtn) activeUndoBtn.hidden = !drawEnabled;
        if (activeClearBtn) activeClearBtn.hidden = !drawEnabled;
        if (!drawEnabled) {
          if (activePenPalette) activePenPalette.hidden = true;
          if (activeHighlighterPalette) activeHighlighterPalette.hidden = true;
        }
        const tool = roughWorkToolByQuestion.get(key) || "pen";
        if (activePenBtn) activePenBtn.classList.toggle("active-tool", tool === "pen");
        if (activeHighlighterBtn) activeHighlighterBtn.classList.toggle("active-tool", tool === "highlighter");
        if (activeEraserBtn) activeEraserBtn.classList.toggle("active-tool", tool === "eraser");
      }
    });
    roughKeyboardBound = true;
  }
  window.addEventListener("resize", resizeCanvas);
}

async function loadStudentDaily() {
  try {
    setMessage(studentMessage, "");
    const date = today();
    const data = await api(`/api/student/daily?date=${encodeURIComponent(date)}`, { timeout_ms: 15000 });
    const alertData = await api("/api/student/alerts", { timeout_ms: 5000 }).catch(() => ({ alerts: [] }));

    dailyAssignments = Array.isArray(data.assignments) ? data.assignments : [];
    dailyDate = data.date || date;
    if (!dailyAssignments.length) {
      updateDailyMissionIndicator(0, 0);
      if (dailyRefreshLatestBtn) {
        dailyRefreshLatestBtn.disabled = true;
        dailyRefreshLatestBtn.hidden = true;
      }
      studentList.innerHTML = "<p>No questions assigned yet.</p>";
      if (studentTodayReviewPage) studentTodayReviewPage.hidden = true;
      if (dailyGoReviewBtn) dailyGoReviewBtn.hidden = true;
      setMessage(studentMessage, "No assignment found.", "error");
      return;
    }

    const firstPending = dailyAssignments.findIndex((x) => !x.submission);
    const submittedCount = dailyAssignments.filter((item) => item.submission).length;
    const correctCount = dailyAssignments.filter((item) => item.submission?.is_correct === true).length;
    const totalCount = dailyAssignments.length;
    updateDailyMissionIndicator(submittedCount, totalCount);
    const allAssignedDone = totalCount > 0 && submittedCount >= totalCount;
    if (dailyRefreshLatestBtn) {
      dailyRefreshLatestBtn.disabled = !allAssignedDone;
      dailyRefreshLatestBtn.hidden = !allAssignedDone;
    }
    dailyReviewAvailable = allAssignedDone;
    if (dailyGoReviewBtn) dailyGoReviewBtn.hidden = !dailyReviewAvailable;

    const savedIndex = loadDailyCursor(dailyDate);
    if (savedIndex !== null && savedIndex >= 0 && savedIndex < dailyAssignments.length) {
      currentDailyIndex = savedIndex;
    } else if (lastSubmittedQuestionId) {
      const idx = dailyAssignments.findIndex((x) => Number(x.question?.id) === Number(lastSubmittedQuestionId));
      if (idx >= 0) currentDailyIndex = idx;
      else currentDailyIndex = firstPending >= 0 ? firstPending : dailyAssignments.length - 1;
    } else {
      currentDailyIndex = firstPending >= 0 ? firstPending : dailyAssignments.length - 1;
    }

    setMessage(studentMessage, "");

    await renderCurrentDailyQuestion();
    renderTodayReview(dailyAssignments, dailyDate);
    await typeset(dailyReviewList || studentList);

  } catch (error) {
    updateDailyMissionIndicator(0, 0);
    if (dailyRefreshLatestBtn) {
      dailyRefreshLatestBtn.disabled = true;
      dailyRefreshLatestBtn.hidden = true;
    }
    studentList.innerHTML = "<p>Failed to load daily questions.</p>";
    if (dailyGoReviewBtn) dailyGoReviewBtn.hidden = true;
    setMessage(studentMessage, error.message || "Failed to load daily questions.", "error");
  }
}

async function loadStudentStats() {
  if (!studentStats) return;
  const data = await api("/api/student/stats");
  serverTokenBalance = Number(data.token_balance || 0);
  updateDailyMissionIndicator(Number(data.submitted_today || 0), 5);
  studentStats.innerHTML = `
    <div class="stat"><strong>Done:</strong> ${data.questions_done}</div>
    <div class="stat"><strong>Correct:</strong> ${data.correct_percentage}%</div>
    <div class="stat"><strong>Avg Time:</strong> ${formatSeconds(data.average_time_seconds)}</div>
    <div class="stat"><strong>Class:</strong> ${escapeHtml(String(data.class_name || "-"))}</div>
  `;
  renderStudentRadar(data);
  renderClassTitles(data.class_titles || []);
  setTopTokenBadge();
}

function renderClassTitles(titles) {
  if (!studentClassTitles) return;
  const rows = Array.isArray(titles) ? titles : [];
  if (!rows.length) {
    studentClassTitles.innerHTML = `<div class="stat"><strong>Class Titles:</strong> No titles yet.</div>`;
    return;
  }
  studentClassTitles.innerHTML = rows
    .map(
      (t) =>
        `<div class="stat"><strong>${escapeHtml(String(t.aspect_name || "Aspect"))}:</strong> ${escapeHtml(
          String(t.title || "-")
        )} · ${escapeHtml(String(t.student_name || "-"))}</div>`
    )
    .join("");
}

function renderStudentRadar(data) {
  if (!studentRadarWrap) return;
  const studentMetrics = data?.radar?.student || {};
  const classMetrics = data?.radar?.class_avg || {};
  const labels = Array.isArray(data?.radar?.labels) && data.radar.labels.length === 5
    ? data.radar.labels
    : ["Combo", "Aim", "Flash", "Grind", "Fortune"];
  const valsStudent = labels.map((k) => Number(studentMetrics[k] || 0));
  const valsClass = labels.map((k) => Number(classMetrics[k] || 0));
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 95;
  const toPoint = (idx, valuePct) => {
    const ang = -Math.PI / 2 + (idx * 2 * Math.PI) / labels.length;
    const r = (Math.max(0, Math.min(100, Number(valuePct || 0))) / 100) * radius;
    return [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r];
  };
  const poly = (arr) => arr.map((v, i) => toPoint(i, v).join(",")).join(" ");
  const axis = labels
    .map((name, i) => {
      const end = toPoint(i, 100);
      const labelPt = toPoint(i, 112);
      return `
        <line x1="${cx}" y1="${cy}" x2="${end[0]}" y2="${end[1]}" stroke="#a9c5e8" stroke-width="1" />
        <text x="${labelPt[0]}" y="${labelPt[1]}" class="radar-label">${escapeHtml(String(name))}</text>
      `;
    })
    .join("");
  const rings = [20, 40, 60, 80, 100]
    .map((rPct) => `<polygon points="${poly(labels.map(() => rPct))}" fill="none" stroke="#d4e3f8" stroke-width="1" />`)
    .join("");
  studentRadarWrap.innerHTML = `
    <svg viewBox="0 0 ${size} ${size}" class="radar-svg" role="img" aria-label="Student vs class average radar chart">
      ${rings}
      ${axis}
      <polygon points="${poly(valsClass)}" class="radar-class" />
      <polygon points="${poly(valsStudent)}" class="radar-student" />
      <circle cx="${cx}" cy="${cy}" r="2.2" fill="#1b3f6e" />
    </svg>
    <div class="inline-tools">
      <span class="stat"><span class="legend-dot legend-student"></span> You</span>
      <span class="stat"><span class="legend-dot legend-class"></span> Class Avg</span>
    </div>
  `;
}

function renderWelcomeAvatar(selectedAvatar) {
  if (!welcomeAvatarImage) return;
  const imageUrl = String(selectedAvatar?.image_url || "").trim();
  const emoji = String(selectedAvatar?.emoji || "").trim() || "🐾";
  if (imageUrl) {
    welcomeAvatarImage.innerHTML = `<img src="${escapeHtml(imageUrl)}" alt="Profile avatar" class="welcome-avatar-photo" />`;
  } else {
    welcomeAvatarImage.textContent = emoji;
  }
}

function renderOwnedCollection(data) {
  if (!ownedCharactersList || !ownedFramesList) return;
  const avatars = Array.isArray(data?.avatars) ? data.avatars : [];
  const frames = Array.isArray(data?.frames) ? data.frames : [];
  const ownedCharacters = avatars.filter((a) => a.owned);
  const ownedFrames = frames.filter((f) => f.owned);

  ownedCharactersList.innerHTML = ownedCharacters.length
    ? ownedCharacters
        .map((avatar) => {
          const id = Number(avatar.id);
          return `
            <article class="avatar-card ${avatar.selected ? "selected" : ""}">
              <div class="avatar-emoji">
                ${
                  avatar.image_url
                    ? `<img src="${escapeHtml(String(avatar.image_url))}" alt="${escapeHtml(String(avatar.name || "Avatar"))}" class="avatar-photo" />`
                    : escapeHtml(avatar.emoji || "🐾")
                }
              </div>
              ${
                avatar.selected
                  ? `<button type="button" class="secondary avatar-action-btn" disabled>Using</button>`
                  : `<button type="button" class="avatar-action-btn" data-owned-avatar-select="${id}">Use</button>`
              }
            </article>
          `;
        })
        .join("")
    : "<p>No characters owned yet.</p>";

  ownedFramesList.innerHTML = ownedFrames.length
    ? ownedFrames
        .map((item) => {
          const fid = Number(item.id);
          return `
            <article class="avatar-card ${item.selected ? "selected" : ""}">
              ${buildFramePreviewVisual(item.style_key)}
              ${
                item.selected
                  ? `<button type="button" class="secondary avatar-action-btn" disabled>Using</button>`
                  : `<button type="button" class="avatar-action-btn" data-owned-frame-select="${fid}">Use</button>`
              }
            </article>
          `;
        })
        .join("")
    : "<p>No frames owned yet.</p>";

  ownedCharactersList.querySelectorAll("button[data-owned-avatar-select]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const avatarId = Number(btn.getAttribute("data-owned-avatar-select"));
      if (!Number.isInteger(avatarId) || avatarId <= 0) return;
      try {
        await api("/api/student/avatars/select", { method: "POST", body: JSON.stringify({ avatar_id: avatarId }) });
        await loadStudentAvatarShop();
      } catch (error) {
        setMessage(studentMessage, error.message || "Failed to select character.", "error");
      }
    });
  });

  ownedFramesList.querySelectorAll("button[data-owned-frame-select]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const frameId = Number(btn.getAttribute("data-owned-frame-select"));
      if (!Number.isInteger(frameId) || frameId <= 0) return;
      try {
        await api("/api/student/frames/select", {
          method: "POST",
          body: JSON.stringify({ frame_id: frameId })
        });
        await loadStudentAvatarShop();
      } catch (error) {
        setMessage(studentMessage, error.message || "Failed to select frame.", "error");
      }
    });
  });
}

function renderStudentWelcomeName() {
  if (!welcomeTitle || !me || me.role !== "student") return;
  const safeName = escapeHtml(String(me?.full_name || "Student"));
  welcomeTitle.innerHTML = `Welcome, <button id="welcome-name-link" type="button" class="welcome-name-link">${safeName}</button>`;
  const welcomeNameLink = document.getElementById("welcome-name-link");
  if (welcomeNameLink) {
    welcomeNameLink.addEventListener("click", async () => {
      await switchStudentPage("profile");
    });
  }
}

function renderStudentAvatarShop(data) {
  if (!studentAvatarCatalog) return;
  const tokenBalance = Number(data?.token_balance || 0);
  serverTokenBalance = tokenBalance;
  setTopTokenBadge();
  const avatars = Array.isArray(data?.avatars) ? data.avatars : [];
  const selectedAvatar = avatars.find((a) => a.selected) || null;
  renderWelcomeAvatar(selectedAvatar);

  const frameCatalog = Array.isArray(data?.frames) ? data.frames : [];
  frameStyleValueMap = new Map(frameCatalog.map((f) => [String(f.id), String(f.style_key || "basic")]));
  const selectedFrame = frameCatalog.find((f) => f.selected) || null;
  if (styleShopState) {
    if (!Array.isArray(styleShopState.owned)) styleShopState.owned = [];
    const ownedFrameIds = frameCatalog.filter((f) => f.owned).map((f) => String(f.id));
    styleShopState.owned = Array.from(new Set([...styleShopState.owned, ...ownedFrameIds]));
    if (selectedFrame) styleShopState.selected.frame = String(selectedFrame.id);
    saveStyleShopState(me.user_id, styleShopState);
    applyStyleShopVisuals();
  }

  const charDrawCost = Number(data?.packs?.character?.cost || 100);
  const frameDrawCost = Number(data?.packs?.frame?.cost || 50);
  const canDrawCharacter = tokenBalance >= charDrawCost;
  const canDrawFrame = tokenBalance >= frameDrawCost;

  studentAvatarCatalog.innerHTML = `
    <section class="subpanel gacha-pack-panel">
      <div class="shop-two-boxes">
        <article class="treasure-box-column">
          <button type="button" class="secondary preview-btn" data-open-preview="characters">preview characters</button>
          <div class="treasure-photo-wrap">
            <img src="/assets/shop/treasure-character.png" alt="Character treasure box" class="treasure-photo" onerror="this.hidden=true;this.nextElementSibling.hidden=false;" />
            <div class="treasure-photo-fallback" hidden>🎁</div>
          </div>
          <button type="button" class="draw-pack-btn ${canDrawCharacter ? "ok" : "insufficient"}" data-gacha-draw="character" ${canDrawCharacter ? "" : "disabled"}>
            ${canDrawCharacter ? `Draw ${charDrawCost} 💎` : `Need ${charDrawCost} diamonds`}
          </button>
        </article>
        <article class="treasure-box-column">
          <button type="button" class="secondary preview-btn" data-open-preview="frames">preview frames</button>
          <div class="treasure-photo-wrap">
            <img src="/assets/shop/treasure-frame.png" alt="Frame treasure box" class="treasure-photo" onerror="this.hidden=true;this.nextElementSibling.hidden=false;" />
            <div class="treasure-photo-fallback" hidden>🧰</div>
          </div>
          <button type="button" class="draw-pack-btn ${canDrawFrame ? "ok" : "insufficient"}" data-gacha-draw="frame" ${canDrawFrame ? "" : "disabled"}>
            ${canDrawFrame ? `Draw ${frameDrawCost} 💎` : `Need ${frameDrawCost} diamonds`}
          </button>
        </article>
      </div>
    </section>
  `;

  if (previewCharactersGrid) {
    previewCharactersGrid.innerHTML = avatars
      .map((avatar) => {
        const image = String(avatar.image_url || "").trim();
        return `<div class="preview-pic-item">${
          image
            ? `<img src="${escapeHtml(image)}" class="preview-pic-img" alt="character" onerror="this.hidden=true;this.nextElementSibling.hidden=false;" /><div class="preview-pic-emoji" hidden>${escapeHtml(String(avatar.emoji || "🐾"))}</div>`
            : `<div class="preview-pic-emoji">${escapeHtml(String(avatar.emoji || "🐾"))}</div>`
        }</div>`;
      })
      .join("");
  }
  if (previewFramesGrid) {
    previewFramesGrid.innerHTML = frameCatalog
      .map((item) => {
        return `<div class="preview-pic-item">${buildFramePreviewVisual(item.style_key)}</div>`;
      })
      .join("");
  }

  studentAvatarCatalog.querySelectorAll("button[data-open-preview]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = String(btn.getAttribute("data-open-preview") || "").trim();
      if (key === "characters" && shopPreviewCharacters) shopPreviewCharacters.hidden = false;
      if (key === "frames" && shopPreviewFrames) shopPreviewFrames.hidden = false;
    });
  });

  studentAvatarCatalog.querySelectorAll("button[data-gacha-draw]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const pack = String(btn.getAttribute("data-gacha-draw") || "").trim();
      if (!pack) return;
      const drawVideoSrc = GACHA_DRAW_VIDEO_BY_PACK[pack] || GACHA_DRAW_VIDEO_BY_PACK.character;
      if (shopDrawRevealOverlay && shopDrawRevealContent) {
        shopDrawRevealOverlay.hidden = false;
        shopDrawRevealContent.innerHTML = `
          <div class="draw-loader">
            <video class="draw-loader-video" autoplay muted playsinline preload="auto">
              <source src="${escapeHtml(drawVideoSrc)}" type="video/mp4" />
            </video>
            <div class="draw-loader-text">Opening treasure...</div>
          </div>
        `;
      }
      try {
        await new Promise((resolve) => setTimeout(resolve, 1400));
        const result = await api("/api/student/gacha/draw", {
          method: "POST",
          body: JSON.stringify({ pack })
        });
        if (shopDrawRevealContent) {
          const item = result.item || {};
          const img = String(item.image_url || "").trim();
          const isFrameReward = String(item.type || "").trim().toLowerCase() === "frame";
          const icon = isFrameReward
            ? buildFramePreviewVisual(item.style_key)
            : img
              ? `<img src="${escapeHtml(img)}" class="avatar-photo" alt="${escapeHtml(String(item.name || "Item"))}" onerror="this.hidden=true;this.nextElementSibling.hidden=false;" /><div class="preview-pic-emoji" hidden>${escapeHtml(String(item.emoji || "🐾"))}</div>`
              : escapeHtml(String(item.emoji || "🎁"));
          shopDrawRevealContent.innerHTML = `
            <div class="gacha-result reveal">
              <div class="avatar-emoji">${icon}</div>
              <div class="avatar-name">${escapeHtml(String(item.name || "Reward"))}</div>
              <div class="avatar-meta">${escapeHtml(String(result.message || "Draw complete"))}</div>
            </div>
          `;
        }
        await loadStudentAvatarShop();
        await loadStudentStats();
      } catch (error) {
        if (shopDrawRevealContent) {
          shopDrawRevealContent.innerHTML = `
            <div class="gacha-result">
              <div class="avatar-meta">${escapeHtml(String(error.message || "Draw failed"))}</div>
            </div>
          `;
        }
        setMessage(studentMessage, error.message || "Draw failed.", "error");
      }
    });
  });
  renderOwnedCollection(data);
}

async function loadStudentAvatarShop() {
  if (!studentAvatarCatalog) return;
  const data = await api("/api/student/gacha/state");
  studentAvatarData = data;
  renderStudentAvatarShop(data);
}

function renderReviewRecords(records, target) {
  if (!target) return;
  if (!records.length) {
    target.innerHTML = "<p>No answered questions match the filter.</p>";
    return;
  }

  target.innerHTML = records
    .map((row) => {
      const q = row.problems || {};
      const state = buildSubmissionState(row);
      return `
        <details class="solution-panel review-card">
          <summary>
            <span class="badge ${state.badgeClass}">${escapeHtml(state.text)}</span>
            ${escapeHtml(String(q.topic || "Topic"))} ??${escapeHtml(String(q.difficulty || "-"))} ??${formatDateTime(row.submitted_at)}
          </summary>
          <div class="question-body" id="review-question-${row.id}"></div>
          <div class="summary">
            <div class="stat"><strong>Attempt Date:</strong> ${escapeHtml(String(row.assignment_date || "-"))}</div>
            <div class="stat"><strong>Time Spent:</strong> ${formatSeconds(row.time_spent_seconds)}</div>
            <div class="stat"><strong>Your Answer:</strong> ${escapeHtml(String(row.answer_text || "-"))}</div>
            <div class="stat"><strong>Correct Answer:</strong> ${escapeHtml(String(q.answer_text || "-"))}</div>
          </div>
          <details class="solution-panel" open>
            <summary>Solution</summary>
            <div class="solution-body" id="review-solution-${row.id}"></div>
          </details>
        </details>
      `;
    })
    .join("");

  records.forEach((row) => {
    const q = row.problems || {};
    const qBody = document.getElementById(`review-question-${row.id}`);
    const sBody = document.getElementById(`review-solution-${row.id}`);
    if (qBody) renderQuestionBody(qBody, q.latex_code || "");
    if (sBody) renderQuestionBody(sBody, q.solution_latex || "", { multiline: true });
  });
}

function populateTopicFilter(selectEl, records, selected = "") {
  if (!selectEl) return;
  const selectedValue = String(selected || "").trim();
  const topics = [...new Set((records || []).map((r) => String(r?.problems?.topic || "").trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
  selectEl.innerHTML = `<option value="">All Topics</option>${topics
    .map((topic) => `<option value="${escapeHtml(topic)}" ${topic === selectedValue ? "selected" : ""}>${escapeHtml(topic)}</option>`)
    .join("")}`;
}

function filterReviewRecords(records, filters = {}) {
  const lv = String(filters.difficulty || "").trim();
  const topic = String(filters.topic || "").trim();
  const result = String(filters.result || "").trim();
  const date = String(filters.date || "").trim();

  return (records || []).filter((row) => {
    const q = row.problems || {};
    if (lv && String(q.difficulty || "") !== lv) return false;
    if (topic && String(q.topic || "") !== topic) return false;
    if (result === "correct" && row.is_correct !== true) return false;
    if (result === "wrong" && row.is_correct !== false) return false;
    if (date && String(row.assignment_date || "") !== date) return false;
    return true;
  });
}

function sortReviewRecords(records, field, order) {
  const dir = order === "asc" ? 1 : -1;
  const list = [...(records || [])];
  list.sort((a, b) => {
    if (field === "difficulty") {
      const av = String(a?.problems?.difficulty || "");
      const bv = String(b?.problems?.difficulty || "");
      return av.localeCompare(bv) * dir;
    }
    if (field === "topic") {
      const av = String(a?.problems?.topic || "");
      const bv = String(b?.problems?.topic || "");
      return av.localeCompare(bv) * dir;
    }
    const ad = String(a?.assignment_date || "");
    const bd = String(b?.assignment_date || "");
    return ad.localeCompare(bd) * dir;
  });
  return list;
}

function buildTopicLevelAccuracy(records, levels) {
  const topicMap = new Map();
  const levelSet = new Set(levels || []);

  for (const row of records || []) {
    const q = row.problems || {};
    const topic = String(q.topic || "").trim() || "Unknown";
    const lv = String(q.difficulty || "").trim();
    if (!topicMap.has(topic)) {
      topicMap.set(topic, {
        overall: { correct: 0, total: 0 },
        byLevel: new Map()
      });
    }
    const entry = topicMap.get(topic);
    entry.overall.total += 1;
    if (row.is_correct === true) entry.overall.correct += 1;

    if (levelSet.has(lv)) {
      if (!entry.byLevel.has(lv)) {
        entry.byLevel.set(lv, { correct: 0, total: 0 });
      }
      const lvEntry = entry.byLevel.get(lv);
      lvEntry.total += 1;
      if (row.is_correct === true) lvEntry.correct += 1;
    }
  }

  return [...topicMap.entries()]
    .map(([topic, data]) => ({ topic, ...data }))
    .sort((a, b) => a.topic.localeCompare(b.topic));
}

function percentOrNull(correct, total) {
  if (!total) return null;
  return Math.round((correct / total) * 100);
}

function renderTopicLevelMatrix(target, records, levels) {
  if (!target) return;
  const lvList = Array.isArray(levels) && levels.length ? levels : difficultyOrder;
  const rows = buildTopicLevelAccuracy(records, lvList);
  if (!rows.length) {
    target.innerHTML = "<p>No answered records yet.</p>";
    return;
  }

  const thead = `<tr><th>Topic</th>${lvList.map((lv) => `<th>${escapeHtml(lv)}</th>`).join("")}<th>Overall</th></tr>`;
  const tbody = rows
    .map((row) => {
      const lvCells = lvList
        .map((lv) => {
          const d = row.byLevel.get(lv) || { correct: 0, total: 0 };
          const pct = percentOrNull(d.correct, d.total);
          if (pct === null) return `<td class="matrix-cell">-</td>`;
          const cls = pct < 60 ? "matrix-cell low" : "matrix-cell";
          return `<td class="${cls}">${pct}%</td>`;
        })
        .join("");
      const overallPct = percentOrNull(row.overall.correct, row.overall.total);
      const overallClass = overallPct !== null && overallPct < 60 ? "matrix-cell low" : "matrix-cell";
      return `<tr><td>${escapeHtml(row.topic)}</td>${lvCells}<td class="${overallClass}">${overallPct === null ? "-" : `${overallPct}%`}</td></tr>`;
    })
    .join("");

  target.innerHTML = `
    <table class="matrix-table">
      <thead>${thead}</thead>
      <tbody>${tbody}</tbody>
    </table>
  `;
}

async function loadStudentReview() {
  if (!studentReviewList) return;
  const data = await api("/api/student/review");
  const allRecords = Array.isArray(data.records) ? data.records : [];
  renderTopicLevelMatrix(studentTopicLvMatrix, allRecords, difficultyOrder);
  populateTopicFilter(reviewFilterTopic, allRecords, reviewFilterTopic?.value || "");
  const filtered = filterReviewRecords(allRecords, {
    difficulty: reviewFilterLv?.value,
    topic: reviewFilterTopic?.value,
    result: reviewFilterResult?.value,
    date: reviewFilterDate?.value
  });
  const sorted = sortReviewRecords(filtered, reviewSortField?.value || "date", reviewSortOrder?.value || "desc");
  renderReviewRecords(sorted, studentReviewList);
  await typeset(studentReviewList);
}

function renderTeacherTable(students) {
  if (!students.length) {
    teacherTableWrap.innerHTML = "<p>No student accounts found.</p>";
    return;
  }

  const rows = students
    .map(
      (student) => `
      <tr class="${student.finished_today ? "" : "incomplete-row"}">
        <td><button type="button" class="student-link" data-profile-student="${escapeHtml(student.student_id)}">${escapeHtml(
          student.full_name || "-"
        )}</button></td>
        <td>${escapeHtml(student.email || "-")}</td>
        <td>${escapeHtml(student.grade || "-")}</td>
        <td>${escapeHtml(student.class_name || "-")}</td>
        <td>${student.submitted || 0}</td>
        <td>${student.questions_answered || 0}</td>
        <td>${student.correct_percentage || 0}%</td>
        <td>${formatSeconds(student.average_time_seconds || 0)}</td>
        <td>${student.longest_streak_days || 0}</td>
        <td>${student.finished_today ? "Finished" : "Not Yet"}</td>
        <td>${student.active_alerts || 0}</td>
        <td>
          <button type="button" class="secondary" data-delete-records-student="${escapeHtml(student.student_id)}">Delete Records</button>
        </td>
      </tr>
    `
    )
    .join("");

  teacherTableWrap.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Student</th>
          <th>Email</th>
          <th>Grade</th>
          <th>Class</th>
          <th>Answered (Selected Date)</th>
          <th>Answered (All Time)</th>
          <th>Correct %</th>
          <th>Avg Time / Q</th>
          <th>Longest Streak</th>
          <th>5+ Done Today</th>
          <th>Alerts</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  teacherTableWrap.querySelectorAll("button[data-profile-student]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const studentId = String(btn.getAttribute("data-profile-student") || "");
      if (!studentId) return;
      try {
        teacherStudentBackTarget = "dashboard";
        await openTeacherStudentPage(studentId);
      } catch (error) {
        setMessage(teacherMessage, error.message, "error");
      }
    });
  });

  teacherTableWrap.querySelectorAll("button[data-delete-records-student]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const studentId = String(btn.getAttribute("data-delete-records-student") || "");
      if (!studentId) return;
      if (!confirm("Delete ALL assignment/submission records of this student?")) return;

      try {
        await api(`/api/teacher/students/${encodeURIComponent(studentId)}/records`, { method: "DELETE" });
        setMessage(teacherMessage, "Student records deleted.", "success");
        await loadTeacherOverview();
      } catch (error) {
        setMessage(teacherMessage, error.message, "error");
      }
    });
  });
}

function renderTeacherBatchTable(students) {
  if (!teacherBatchTableWrap) return;
  if (!students.length) {
    teacherBatchTableWrap.innerHTML = "<p>No student accounts found.</p>";
    return;
  }
  currentTeacherStudentIds = students.map((s) => String(s.student_id || "")).filter(Boolean);

  const rows = students
    .map(
      (student) => `
      <tr>
        <td>
          <input type="checkbox" data-teacher-student-check="${escapeHtml(student.student_id)}" ${
            selectedTeacherStudentIds.has(String(student.student_id || "")) ? "checked" : ""
          } />
        </td>
        <td><button type="button" class="student-link" data-profile-student="${escapeHtml(student.student_id)}">${escapeHtml(
          student.full_name || "-"
        )}</button></td>
        <td>${escapeHtml(student.email || "-")}</td>
        <td>${escapeHtml(student.grade || "-")}</td>
        <td>${escapeHtml(student.class_name || "-")}</td>
      </tr>
    `
    )
    .join("");

  teacherBatchTableWrap.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Select</th>
          <th>Student</th>
          <th>Email</th>
          <th>Grade</th>
          <th>Class</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  teacherBatchTableWrap.querySelectorAll("input[data-teacher-student-check]").forEach((el) => {
    el.addEventListener("change", () => {
      const id = String(el.getAttribute("data-teacher-student-check") || "");
      if (!id) return;
      if (el.checked) selectedTeacherStudentIds.add(id);
      else selectedTeacherStudentIds.delete(id);
    });
  });
  teacherBatchTableWrap.querySelectorAll("button[data-profile-student]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const studentId = String(btn.getAttribute("data-profile-student") || "");
      if (!studentId) return;
      try {
        teacherStudentBackTarget = "batch";
        await openTeacherStudentPage(studentId);
      } catch (error) {
        setMessage(teacherBatchMessage || teacherMessage, error.message, "error");
      }
    });
  });
}

function renderGroupOptions(groups) {
  if (!teacherGroupSelect) return;
  const prevGroupValue = String(teacherGroupSelect.value || "");
  const prevDashboardGroupValue = String(teacherDashboardGroupSelect?.value || "");
  const prevBatchGroupValue = String(teacherBatchGroupSelect?.value || "");
  teacherGroupSelect.innerHTML = `
    <option value="">Select a group</option>
    ${(groups || [])
      .map((g) => `<option value="${g.id}">${escapeHtml(g.name)} (${g.member_count || 0})</option>`)
      .join("")}
  `;
  if (teacherDashboardGroupSelect) {
    teacherDashboardGroupSelect.innerHTML = `
      <option value="">All Students</option>
      ${(groups || [])
        .map((g) => `<option value="${g.id}">${escapeHtml(g.name)} (${g.member_count || 0})</option>`)
        .join("")}
    `;
  }
  if (teacherBatchGroupSelect) {
    teacherBatchGroupSelect.innerHTML = teacherGroupSelect.innerHTML;
  }
  if (prevGroupValue) teacherGroupSelect.value = prevGroupValue;
  if (teacherDashboardGroupSelect && prevDashboardGroupValue) teacherDashboardGroupSelect.value = prevDashboardGroupValue;
  if (teacherBatchGroupSelect && prevBatchGroupValue) teacherBatchGroupSelect.value = prevBatchGroupValue;
}

async function loadTeacherGroups() {
  const groups = await api("/api/teacher/groups");
  renderGroupOptions(groups);
}

async function loadTeacherGroupStats() {
  if (!teacherGroupSelect?.value) {
    if (teacherGroupStats) teacherGroupStats.innerHTML = "<p>Please select a group.</p>";
    if (teacherGroupStudents) teacherGroupStudents.innerHTML = "";
    groupScopeDraft = [];
    renderGroupScopeDraft();
    currentGroupMemberIds = [];
    selectedGroupMemberIds.clear();
    return;
  }

  const data = await api(`/api/teacher/groups/${encodeURIComponent(teacherGroupSelect.value)}/stats`);
  if (teacherGroupStats) {
    teacherGroupStats.innerHTML = `
      <div class="stat"><strong>Group:</strong> ${escapeHtml(data.group?.name || "-")}</div>
      <div class="stat"><strong>Done:</strong> ${data.stats?.questions_done || 0}</div>
      <div class="stat"><strong>Correct:</strong> ${data.stats?.correct_percentage || 0}%</div>
      <div class="stat"><strong>Avg Time:</strong> ${formatSeconds(data.stats?.average_time_seconds || 0)}</div>
    `;
  }

  const members = Array.isArray(data.members) ? data.members : [];
  groupScopeDraft = Array.isArray(data.scope_rules) ? data.scope_rules.map((row) => normalizeScopeRow(row)) : [];
  renderGroupScopeDraft();
  currentGroupMemberIds = members.map((m) => String(m.student_id || "")).filter(Boolean);
  if (teacherGroupStudents) {
    teacherGroupStudents.innerHTML = members.length
      ? members
          .map(
            (m) => `
        <article class="question-card">
          <div class="question-head">
            <div class="inline-tools">
              <input type="checkbox" data-group-member-check="${escapeHtml(m.student_id)}" ${
                selectedGroupMemberIds.has(String(m.student_id || "")) ? "checked" : ""
              } />
              <button type="button" class="student-link" data-profile-student="${escapeHtml(m.student_id)}">${escapeHtml(
                m.full_name || "-"
              )}</button>
            </div>
            <span class="badge">${escapeHtml(m.grade || "-")}</span>
          </div>
          <p>${escapeHtml(m.email || "-")}</p>
          <div class="summary">
            <div class="stat"><strong>Done:</strong> ${m.questions_done}</div>
            <div class="stat"><strong>Correct:</strong> ${m.correct_percentage}%</div>
            <div class="stat"><strong>Avg Time:</strong> ${formatSeconds(m.average_time_seconds)}</div>
          </div>
        </article>
      `
          )
          .join("")
      : "<p>No students in this group.</p>";
  }

  if (teacherGroupStudents) {
    teacherGroupStudents.querySelectorAll("input[data-group-member-check]").forEach((el) => {
      el.addEventListener("change", () => {
        const id = String(el.getAttribute("data-group-member-check") || "");
        if (!id) return;
        if (el.checked) selectedGroupMemberIds.add(id);
        else selectedGroupMemberIds.delete(id);
      });
    });
    teacherGroupStudents.querySelectorAll("button[data-profile-student]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const studentId = String(btn.getAttribute("data-profile-student") || "");
        if (!studentId) return;
        try {
          teacherStudentBackTarget = "groups";
          await openTeacherStudentPage(studentId);
        } catch (error) {
          setMessage(teacherGroupMessage || teacherMessage, error.message, "error");
        }
      });
    });
  }
}

function showTeacherDashboardPage() {
  saveTeacherPagePreference("dashboard");
  if (teacherView) teacherView.hidden = false;
  if (teacherBatchPage) teacherBatchPage.hidden = true;
  if (teacherGroupPage) teacherGroupPage.hidden = true;
  if (teacherStudentPage) teacherStudentPage.hidden = true;
  [teacherDashboardLink, teacherDashboardLink2, teacherDashboardLink3].forEach((el) => el && el.classList.add("active"));
  [teacherBatchLink, teacherBatchLink2, teacherBatchLink3].forEach((el) => el && el.classList.remove("active"));
  [teacherGroupsLink, teacherGroupsLink2, teacherGroupsLink3].forEach((el) => el && el.classList.remove("active"));
}

function showTeacherStudentPage() {
  if (teacherView) teacherView.hidden = true;
  if (teacherBatchPage) teacherBatchPage.hidden = true;
  if (teacherGroupPage) teacherGroupPage.hidden = true;
  if (teacherStudentPage) teacherStudentPage.hidden = false;
}

function showTeacherGroupPage() {
  saveTeacherPagePreference("groups");
  if (teacherView) teacherView.hidden = true;
  if (teacherBatchPage) teacherBatchPage.hidden = true;
  if (teacherGroupPage) teacherGroupPage.hidden = false;
  if (teacherStudentPage) teacherStudentPage.hidden = true;
  [teacherDashboardLink, teacherDashboardLink2, teacherDashboardLink3].forEach((el) => el && el.classList.remove("active"));
  [teacherBatchLink, teacherBatchLink2, teacherBatchLink3].forEach((el) => el && el.classList.remove("active"));
  [teacherGroupsLink, teacherGroupsLink2, teacherGroupsLink3].forEach((el) => el && el.classList.add("active"));
}

function showTeacherBatchPage() {
  saveTeacherPagePreference("batch");
  if (teacherView) teacherView.hidden = true;
  if (teacherBatchPage) teacherBatchPage.hidden = false;
  if (teacherGroupPage) teacherGroupPage.hidden = true;
  if (teacherStudentPage) teacherStudentPage.hidden = true;
  [teacherDashboardLink, teacherDashboardLink2, teacherDashboardLink3].forEach((el) => el && el.classList.remove("active"));
  [teacherBatchLink, teacherBatchLink2, teacherBatchLink3].forEach((el) => el && el.classList.add("active"));
  [teacherGroupsLink, teacherGroupsLink2, teacherGroupsLink3].forEach((el) => el && el.classList.remove("active"));
}

async function applyTeacherStudentFilters() {
  if (!teacherStudentViewData) return;
  const filtered = filterReviewRecords(teacherStudentViewData.records, {
    difficulty: teacherStudentFilterLv?.value,
    topic: teacherStudentFilterTopic?.value,
    result: teacherStudentFilterResult?.value,
    date: teacherStudentFilterDate?.value
  });
  renderReviewRecords(filtered, teacherStudentPageList);
  if (teacherStudentPageMessage) {
    setMessage(teacherStudentPageMessage, `Showing ${filtered.length} record(s).`, "success");
  }
  await typeset(teacherStudentPageList);
}

async function openTeacherStudentPage(studentId) {
  const [statsData, groupsData, allGroups] = await Promise.all([
    api(`/api/teacher/students/${encodeURIComponent(studentId)}/stats`),
    api(`/api/teacher/students/${encodeURIComponent(studentId)}/groups`),
    api("/api/teacher/groups")
  ]);
  const student = statsData.student || {};
  const stats = statsData.stats || {};
  const records = Array.isArray(statsData.records) ? statsData.records : [];
  const selectedGroupIds = new Set((groupsData || []).map((g) => Number(g.group_id)));
  teacherStudentViewData = { student, stats, records, selectedGroupIds, allGroups };

  if (teacherStudentPageTitle) {
    teacherStudentPageTitle.textContent = `Student Profile: ${student.full_name || "Student"}`;
  }
  if (teacherStudentPageStats) {
    const titles = Array.isArray(statsData.class_titles) ? statsData.class_titles : [];
    teacherStudentPageStats.innerHTML = `
      <div class="stat"><strong>Name:</strong> ${escapeHtml(student.full_name || "-")}</div>
      <div class="stat"><strong>Email:</strong> ${escapeHtml(student.email || "-")}</div>
      <div class="stat"><strong>Grade:</strong> ${escapeHtml(student.grade || "-")}</div>
      <div class="stat"><strong>Class:</strong> ${escapeHtml(student.class_name || "-")}</div>
      <div class="stat"><strong>Done:</strong> ${stats.questions_done || 0}</div>
      <div class="stat"><strong>Correct:</strong> ${stats.correct_percentage || 0}%</div>
      <div class="stat"><strong>Avg Time:</strong> ${formatSeconds(stats.average_time_seconds || 0)}</div>
      ${titles
        .map(
          (t) =>
            `<div class="stat"><strong>${escapeHtml(String(t.aspect_name || "Aspect"))}:</strong> ${escapeHtml(
              String(t.title || "-")
            )} · ${escapeHtml(String(t.student_name || "-"))}</div>`
        )
        .join("")}
    `;
  }
  if (teacherStudentClassInput) {
    teacherStudentClassInput.value = String(student.class_name || "");
  }

  renderTopicLevelMatrix(teacherStudentTopicLvMatrix, records, difficultyOrder);
  if (teacherStudentGroupAssign) {
    teacherStudentGroupAssign.innerHTML = (allGroups || [])
      .map(
        (g) => `
      <label class="stat">
        <input type="checkbox" data-teacher-student-group="${g.id}" ${selectedGroupIds.has(Number(g.id)) ? "checked" : ""} />
        ${escapeHtml(g.name)}
      </label>
    `
      )
      .join("");
  }

  populateTopicFilter(teacherStudentFilterTopic, records, teacherStudentFilterTopic?.value || "");
  await applyTeacherStudentFilters();
  showTeacherStudentPage();
}

async function loadTeacherOverview() {
  const date = teacherDate.value || today();
  const groupId = String(teacherDashboardGroupSelect?.value || "").trim();
  teacherDate.value = date;
  setMessage(teacherMessage, "Loading teacher overview...");

  const qs = new URLSearchParams();
  qs.set("date", date);
  if (groupId) qs.set("group_id", groupId);
  const data = await api(`/api/teacher/overview?${qs.toString()}`);
  const students = Array.isArray(data.students) ? data.students : [];
  latestTeacherOverviewStudents = students;

  const submittedTotal = students.reduce((acc, s) => acc + Number(s.submitted || 0), 0);
  const answeredAllTime = students.reduce((acc, s) => acc + Number(s.questions_answered || 0), 0);
  const finishedCount = students.filter((s) => s.finished_today).length;

  teacherSummary.innerHTML = `
    <div class="stat"><strong>Date:</strong> ${escapeHtml(data.date)}</div>
    <div class="stat"><strong>Group:</strong> ${
      groupId && teacherDashboardGroupSelect
        ? escapeHtml(teacherDashboardGroupSelect.options[teacherDashboardGroupSelect.selectedIndex]?.text || "Selected Group")
        : "All Students"
    }</div>
    <div class="stat"><strong>Students:</strong> ${data.total_students}</div>
    <div class="stat"><strong>Answered (Date):</strong> ${submittedTotal}</div>
    <div class="stat"><strong>Answered (All):</strong> ${answeredAllTime}</div>
    <div class="stat"><strong>Finished 5+:</strong> ${finishedCount}</div>
  `;

  renderTeacherTable(students);
  renderTeacherBatchTable(students);
  try {
    await loadTeacherGroups();
  } catch (_error) {
    // Group tables may be unavailable before DB migration; keep overview usable.
  }
  setMessage(teacherMessage, "Teacher overview loaded.", "success");
}

async function refreshAuthState() {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  authToken = session?.access_token || "";

  if (!authToken) {
    showAuthView();
    return;
  }

  showAppView();
  await loadMe();
}

async function init() {
  try {
    if (typeof createClient !== "function") {
      await new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-supabase-fallback="1"]');
        if (existing) {
          existing.addEventListener("load", resolve, { once: true });
          existing.addEventListener("error", () => reject(new Error("Failed to load local Supabase SDK.")), { once: true });
          return;
        }
        const script = document.createElement("script");
        script.src = "/vendor/supabase.js";
        script.setAttribute("data-supabase-fallback", "1");
        script.onload = resolve;
        script.onerror = () => reject(new Error("Failed to load local Supabase SDK."));
        document.head.appendChild(script);
      });
      createClient = window.supabase?.createClient;
    }
    if (typeof createClient !== "function") {
      throw new Error("Login SDK failed to load. Please hard refresh (Ctrl+F5) and try again.");
    }
    clientConfig = await api("/api/client-config");
    const meta = await api("/api/meta");
    supabase = createClient(clientConfig.supabase_url, clientConfig.supabase_anon_key);
    if (clientConfig.school_domain) {
      schoolNote.textContent = `Use your school account: @${clientConfig.school_domain}`;
    } else {
      schoolNote.textContent = "School domain restriction is not configured yet.";
    }
    if (clientConfig.google_client_id) {
      schoolNote.textContent += " Browser Google-account matching is enabled for login.";
    }
    if (reviewFilterLv) {
      const difficulties = Array.isArray(meta.difficulties) ? meta.difficulties : [];
      if (difficulties.length) difficultyOrder = difficulties;
      reviewFilterLv.innerHTML = `<option value="">All Lv</option>${difficulties
        .map((x) => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`)
        .join("")}`;
      if (teacherStudentFilterLv) {
        teacherStudentFilterLv.innerHTML = reviewFilterLv.innerHTML;
      }
      if (teacherScopeMinDifficulty) {
        teacherScopeMinDifficulty.innerHTML = `<option value="">Min Lv</option>${difficulties
          .map((x) => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`)
          .join("")}`;
      }
      if (teacherScopeMaxDifficulty) {
        teacherScopeMaxDifficulty.innerHTML = `<option value="">Max Lv</option>${difficulties
          .map((x) => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`)
          .join("")}`;
        renderScopeTopicOptions();
      }
    }

    teacherDate.value = today();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      authToken = session?.access_token || "";
      if (!authToken) {
        showAuthView();
        return;
      }

      showAppView();
      try {
        await loadMe();
      } catch (error) {
        setMessage(authMessage, error.message, "error");
      }
    });

    await refreshAuthState();
  } catch (error) {
    setMessage(authMessage, error.message, "error");
  }
}

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(authMessage, "Creating account...");

  try {
    await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: signupEmail.value,
        password: signupPassword.value,
        full_name: signupName.value,
        grade: signupGrade.value,
        class_name: signupClass?.value || ""
      })
    });

    setMessage(authMessage, "Account created. You can now log in.", "success");
    signupForm.reset();
  } catch (error) {
    setMessage(authMessage, `Create account failed: ${error.message || "network/runtime error"}`, "error");
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(authMessage, "Checking login account...");
  const typedEmail = normalizeEmail(loginEmail.value);

  let browserCheck = { enforced: false };
  try {
    browserCheck = await verifyBrowserAccountEmail(typedEmail);
  } catch (error) {
    setMessage(authMessage, error.message, "error");
    return;
  }

  setMessage(authMessage, "Logging in...");
  const loginOnce = () =>
    supabase.auth.signInWithPassword({
      email: typedEmail,
      password: loginPassword.value
    });

  let data = null;
  let error = null;
  try {
    ({ data, error } = await loginOnce());
    if (error && /Lock "lock:sb-.*-auth-token" was released/i.test(String(error.message || ""))) {
      // Rare race from auth lock contention; retry once.
      await new Promise((resolve) => setTimeout(resolve, 120));
      ({ data, error } = await loginOnce());
    }
  } catch (err) {
    setMessage(authMessage, `Login failed: ${err?.message || "network/runtime error"}`, "error");
    return;
  }

  if (error) {
    setMessage(authMessage, error.message, "error");
    return;
  }

  const sessionEmail = normalizeEmail(data?.user?.email);
  if (!sessionEmail || sessionEmail !== typedEmail) {
    await supabase.auth.signOut();
    setMessage(authMessage, "Login verification failed: signed-in account is different from typed email.", "error");
    return;
  }

  localStorage.setItem(STUDENT_FORCE_PROFILE_ONCE_KEY, "1");
  setMessage(
    authMessage,
    browserCheck.enforced ? "Logged in with browser account verified." : "Logged in. Browser account check is not configured.",
    "success"
  );
  loginForm.reset();
});

loginEmail.addEventListener("input", () => {
  const typed = normalizeEmail(loginEmail.value);
  if (!typed || typed !== verifiedBrowserEmail) {
    verifiedBrowserEmail = "";
  }
});

logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  verifiedBrowserEmail = "";
  if (topChangePwPanel) topChangePwPanel.hidden = true;
  showAuthView();
  setMessage(authMessage, "Logged out.", "success");
});

loadOverviewBtn.addEventListener("click", async () => {
  try {
    await loadTeacherOverview();
  } catch (error) {
    setMessage(teacherMessage, error.message, "error");
  }
});

if (teacherDashboardGroupSelect) {
  teacherDashboardGroupSelect.addEventListener("change", async () => {
    try {
      await loadTeacherOverview();
    } catch (error) {
      setMessage(teacherMessage, error.message, "error");
    }
  });
}

if (reviewLoadBtn) {
  reviewLoadBtn.addEventListener("click", async () => {
    try {
      await loadStudentReview();
    } catch (error) {
      setMessage(studentMessage, error.message, "error");
    }
  });
}

if (dailyPrevBtn) {
  dailyPrevBtn.addEventListener("click", async () => {
    if (currentDailyIndex <= 0) return;
    currentDailyIndex -= 1;
    await renderCurrentDailyQuestion();
  });
}

if (dailyNextBtn) {
  dailyNextBtn.addEventListener("click", async () => {
    if (!dailyAssignments.length) return;
    const current = dailyAssignments[currentDailyIndex];
    if (!current?.submission) {
      setMessage(studentMessage, "Submit this question before going forward.", "error");
      return;
    }
    if (currentDailyIndex >= dailyAssignments.length - 1) return;
    currentDailyIndex += 1;
    await renderCurrentDailyQuestion();
  });
}

if (dailyGoReviewBtn) {
  dailyGoReviewBtn.addEventListener("click", async () => {
    if (!dailyReviewAvailable) {
      setMessage(studentMessage, "Finish all questions first.", "error");
      return;
    }
    await switchStudentPage("today-review");
  });
}

if (dailyRefreshLatestBtn) {
  dailyRefreshLatestBtn.addEventListener("click", async () => {
    if (!dailyReviewAvailable) return;
    const confirmRefresh = window.confirm("Get 5 more questions now? You will start from Q1.");
    if (!confirmRefresh) return;
    const date = dailyDate || today();
    try {
      setMessage(studentMessage, "Preparing 5 more questions... You will start from Q1.");
      await api("/api/student/daily/refresh-latest", {
        method: "POST",
        body: JSON.stringify({ date, count: 5 }),
        timeout_ms: 20000
      });
      lastSubmittedQuestionId = null;
      currentDailyIndex = 0;
      dailyReviewAvailable = false;
      if (dailyGoReviewBtn) dailyGoReviewBtn.hidden = true;
      if (dailyRefreshLatestBtn) dailyRefreshLatestBtn.hidden = true;
      await switchStudentPage("daily");
      await loadStudentDaily();
      setMessage(studentMessage, "5 more questions ready. You will start from Q1.", "success");
    } catch (error) {
      setMessage(studentMessage, error.message || "Failed to refresh questions.", "error");
    }
  });
}

if (changePwBtn) {
  changePwBtn.addEventListener("click", async () => {
    const current = String(changePwCurrent?.value || "").trim();
    const next = String(changePwNew?.value || "").trim();
    if (!current || !next) {
      setMessage(changePwMessage, "Please fill in current and new password.", "error");
      return;
    }
    if (next.length < 8) {
      setMessage(changePwMessage, "New password must be at least 8 characters.", "error");
      return;
    }
    if (!me?.email) {
      setMessage(changePwMessage, "Unable to verify account email. Please re-login.", "error");
      return;
    }

    setMessage(changePwMessage, "Updating password...");
    const verify = await supabase.auth.signInWithPassword({ email: me.email, password: current });
    if (verify.error) {
      setMessage(changePwMessage, "Current password is incorrect.", "error");
      return;
    }
    const update = await supabase.auth.updateUser({ password: next });
    if (update.error) {
      setMessage(changePwMessage, update.error.message || "Failed to update password.", "error");
      return;
    }

    if (changePwCurrent) changePwCurrent.value = "";
    if (changePwNew) changePwNew.value = "";
    setMessage(changePwMessage, "Password updated successfully.", "success");
  });
}

if (studentDailyLink) {
  studentDailyLink.addEventListener("click", async () => {
    await switchStudentPage("daily");
  });
}

if (studentProfileLink) {
  studentProfileLink.addEventListener("click", async () => {
    await switchStudentPage("profile");
  });
}

if (studentTodayReviewLink) {
  studentTodayReviewLink.addEventListener("click", async () => {
    await switchStudentPage("today-review");
  });
}

function renderStudentStyleShop(frameCatalog) {
  if (!studentStyleCatalog || !me || me.role !== "student") return;
  if (!styleShopState) styleShopState = loadStyleShopState(me.user_id);
  const frames = Array.isArray(frameCatalog) ? frameCatalog : [];
  if (!frames.length) {
    studentStyleCatalog.innerHTML = "<p>No frames yet. Draw from Frame Pack.</p>";
    return;
  }
  const cards = frames
    .filter((f) => f.owned)
    .map((item) => {
      const fid = String(item.id);
      const selected = Boolean(item.selected);
      const action = selected
        ? `<button type="button" class="secondary avatar-action-btn" disabled>Using</button>`
        : `<button type="button" class="avatar-action-btn" data-frame-select="${escapeHtml(fid)}">Use</button>`;
      return `
        <article class="avatar-card ${selected ? "selected" : ""}">
          <div class="avatar-name">${escapeHtml(String(item.name || "Frame"))}</div>
          <div class="avatar-meta">${escapeHtml(String(item.tier || "common"))}</div>
          ${action}
        </article>
      `;
    })
    .join("");

  studentStyleCatalog.innerHTML = `
    <section class="subpanel">
      <h4>Owned Frames</h4>
      <div class="style-grid">${cards || "<p>No frames unlocked yet.</p>"}</div>
    </section>
  `;

  studentStyleCatalog.querySelectorAll("button[data-frame-select]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const frameId = Number(btn.getAttribute("data-frame-select"));
      if (!Number.isInteger(frameId) || frameId <= 0) return;
      try {
        await api("/api/student/frames/select", {
          method: "POST",
          body: JSON.stringify({ frame_id: frameId })
        });
        await loadStudentAvatarShop();
      } catch (error) {
        setMessage(studentMessage, error.message || "Failed to select frame.", "error");
      }
    });
  });
}

if (profileDailyMissionBtn) {
  profileDailyMissionBtn.addEventListener("click", async () => {
    await switchStudentPage("daily");
  });
}

if (closeDailyOverlayBtn) {
  closeDailyOverlayBtn.addEventListener("click", async () => {
    await switchStudentPage("profile");
  });
}

if (closeSettingsOverlayBtn) {
  closeSettingsOverlayBtn.addEventListener("click", async () => {
    await switchStudentPage("profile");
  });
}

if (openAvatarShopBtn) {
  openAvatarShopBtn.hidden = true;
}

if (closeAvatarShopBtn) {
  closeAvatarShopBtn.addEventListener("click", async () => {
    if (studentAvatarShopPage) studentAvatarShopPage.hidden = true;
    if (shopPreviewCharacters) shopPreviewCharacters.hidden = true;
    if (shopPreviewFrames) shopPreviewFrames.hidden = true;
    if (shopDrawRevealOverlay) shopDrawRevealOverlay.hidden = true;
  });
}

if (topShopBtn) {
  topShopBtn.addEventListener("click", async () => {
    await switchStudentPage("profile");
    if (studentOwnedOverlay) studentOwnedOverlay.hidden = true;
    if (shopPreviewCharacters) shopPreviewCharacters.hidden = true;
    if (shopPreviewFrames) shopPreviewFrames.hidden = true;
    if (shopDrawRevealOverlay) shopDrawRevealOverlay.hidden = true;
    if (studentAvatarShopPage) studentAvatarShopPage.hidden = false;
    await loadStudentAvatarShop();
  });
}

if (welcomeAvatarImage) {
  const openOwned = async () => {
    if (!me || me.role !== "student") return;
    try {
      await switchStudentPage("profile");
      if (studentAvatarShopPage) studentAvatarShopPage.hidden = true;
      if (!studentAvatarData) {
        await loadStudentAvatarShop();
      } else {
        renderOwnedCollection(studentAvatarData);
      }
      if (studentOwnedOverlay) studentOwnedOverlay.hidden = false;
    } catch (error) {
      setMessage(studentMessage, error.message || "Failed to open collection.", "error");
    }
  };
  welcomeAvatarImage.addEventListener("click", openOwned);
  welcomeAvatarImage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openOwned();
    }
  });
}

if (closeOwnedOverlayBtn) {
  closeOwnedOverlayBtn.addEventListener("click", () => {
    if (studentOwnedOverlay) studentOwnedOverlay.hidden = true;
  });
}

if (closePreviewCharactersBtn) {
  closePreviewCharactersBtn.addEventListener("click", () => {
    if (shopPreviewCharacters) shopPreviewCharacters.hidden = true;
  });
}

if (closePreviewFramesBtn) {
  closePreviewFramesBtn.addEventListener("click", () => {
    if (shopPreviewFrames) shopPreviewFrames.hidden = true;
  });
}

if (closeDrawRevealBtn) {
  closeDrawRevealBtn.addEventListener("click", () => {
    if (shopDrawRevealOverlay) shopDrawRevealOverlay.hidden = true;
  });
}

if (topChangePwBtn) {
  topChangePwBtn.addEventListener("click", async () => {
    await switchStudentPage("settings");
    setMessage(changePwMessage, "");
  });
}

if (createGroupBtn) {
  createGroupBtn.addEventListener("click", async () => {
    const name = String(newGroupName?.value || "").trim();
    if (!name) {
      setMessage(teacherMessage, "Group name is required.", "error");
      return;
    }
    try {
      await api("/api/teacher/groups", {
        method: "POST",
        body: JSON.stringify({ name })
      });
      if (newGroupName) newGroupName.value = "";
      await loadTeacherGroups();
      setMessage(teacherMessage, "Group created.", "success");
    } catch (error) {
      setMessage(teacherMessage, error.message, "error");
    }
  });
}

if (loadGroupStatsBtn) {
  loadGroupStatsBtn.addEventListener("click", async () => {
    try {
      await loadTeacherGroupStats();
    } catch (error) {
      setMessage(teacherGroupMessage || teacherMessage, error.message, "error");
    }
  });
}

if (teacherGroupSelectAllBtn) {
  teacherGroupSelectAllBtn.addEventListener("click", () => {
    currentGroupMemberIds.forEach((id) => selectedGroupMemberIds.add(id));
    document.querySelectorAll("input[data-group-member-check]").forEach((el) => {
      el.checked = true;
    });
  });
}

if (teacherGroupClearSelectedBtn) {
  teacherGroupClearSelectedBtn.addEventListener("click", () => {
    selectedGroupMemberIds.clear();
    document.querySelectorAll("input[data-group-member-check]").forEach((el) => {
      el.checked = false;
    });
  });
}

if (teacherGroupRemoveSelectedBtn) {
  teacherGroupRemoveSelectedBtn.addEventListener("click", async () => {
    const groupId = Number(teacherGroupSelect?.value || 0);
    const studentIds = [...selectedGroupMemberIds].filter(Boolean);
    if (!Number.isInteger(groupId) || groupId <= 0) {
      setMessage(teacherGroupMessage || teacherMessage, "Please select a group first.", "error");
      return;
    }
    if (!studentIds.length) {
      setMessage(teacherGroupMessage || teacherMessage, "Please select at least one member.", "error");
      return;
    }
    try {
      const result = await api(`/api/teacher/groups/${groupId}/remove-students`, {
        method: "POST",
        body: JSON.stringify({ student_ids: studentIds })
      });
      setMessage(teacherGroupMessage || teacherMessage, `Removed ${result.removed || 0} membership(s).`, "success");
      selectedGroupMemberIds.clear();
      await loadTeacherGroupStats();
      await loadTeacherGroups();
    } catch (error) {
      setMessage(teacherGroupMessage || teacherMessage, error.message, "error");
    }
  });
}

if (teacherScopeAddBtn) {
  teacherScopeAddBtn.addEventListener("click", () => {
    const minDifficulty = String(teacherScopeMinDifficulty?.value || "").trim();
    const maxDifficulty = String(teacherScopeMaxDifficulty?.value || "").trim();
    const topics = getSelectedValues(teacherScopeTopics);
    const subType = String(teacherScopeSubtype?.value || "").trim();
    if (!maxDifficulty || !topics.length) {
      setMessage(teacherGroupMessage || teacherMessage, "Scope needs Max Lv and at least one topic.", "error");
      return;
    }
    const minIdx = minDifficulty ? difficultyOrder.indexOf(minDifficulty) : 0;
    const maxIdx = difficultyOrder.indexOf(maxDifficulty);
    if (maxIdx < 0 || minIdx < 0 || minIdx > maxIdx) {
      setMessage(teacherGroupMessage || teacherMessage, "Min Lv must be lower than or equal to Max Lv.", "error");
      return;
    }
    for (const topic of topics) {
      const row = normalizeScopeRow({
        min_difficulty: minDifficulty || difficultyOrder[0] || "lv2",
        max_difficulty: maxDifficulty,
        topic,
        sub_type: subType
      });
      const key = `${row.min_difficulty}|||${row.max_difficulty}|||${row.topic}|||${row.sub_type}`;
      const exists = groupScopeDraft.some(
        (x) => `${x.min_difficulty || ""}|||${x.max_difficulty || x.difficulty || ""}|||${x.topic}|||${x.sub_type}` === key
      );
      if (!exists) groupScopeDraft.push(row);
    }
    if (teacherScopeSubtype) teacherScopeSubtype.value = "";
    if (teacherScopeTopics) [...teacherScopeTopics.options].forEach((o) => (o.selected = false));
    renderGroupScopeDraft();
    setMessage(teacherGroupMessage || teacherMessage, "Scope item added. Click Save Group Scope to apply.", "success");
  });
}

if (teacherScopeSaveBtn) {
  teacherScopeSaveBtn.addEventListener("click", async () => {
    const groupId = Number(teacherGroupSelect?.value || 0);
    if (!Number.isInteger(groupId) || groupId <= 0) {
      setMessage(teacherGroupMessage || teacherMessage, "Please select a group first.", "error");
      return;
    }
    try {
      const payload = groupScopeDraft
        .map((row) => normalizeScopeRow(row))
        .filter((row) => row.max_difficulty && row.topic);
      await api(`/api/teacher/groups/${groupId}/scope`, {
        method: "PUT",
        body: JSON.stringify({ scopes: payload })
      });
      setMessage(teacherGroupMessage || teacherMessage, "Group scope saved.", "success");
      await loadTeacherGroupStats();
    } catch (error) {
      setMessage(teacherGroupMessage || teacherMessage, error.message, "error");
    }
  });
}

if (teacherSelectAllStudentsBtn) {
  teacherSelectAllStudentsBtn.addEventListener("click", () => {
    currentTeacherStudentIds.forEach((id) => selectedTeacherStudentIds.add(id));
    document.querySelectorAll("input[data-teacher-student-check]").forEach((el) => {
      el.checked = true;
    });
  });
}

if (teacherClearSelectedStudentsBtn) {
  teacherClearSelectedStudentsBtn.addEventListener("click", () => {
    selectedTeacherStudentIds.clear();
    document.querySelectorAll("input[data-teacher-student-check]").forEach((el) => {
      el.checked = false;
    });
  });
}

if (teacherBatchAssignGroupBtn) {
  teacherBatchAssignGroupBtn.addEventListener("click", async () => {
    const groupId = Number(teacherBatchGroupSelect?.value || 0);
    const studentIds = [...selectedTeacherStudentIds].filter(Boolean);
    if (!Number.isInteger(groupId) || groupId <= 0) {
      setMessage(teacherBatchMessage || teacherMessage, "Please select a group first.", "error");
      return;
    }
    if (!studentIds.length) {
      setMessage(teacherBatchMessage || teacherMessage, "Please select at least one student.", "error");
      return;
    }
    try {
      const result = await api(`/api/teacher/groups/${groupId}/add-students`, {
        method: "POST",
        body: JSON.stringify({ student_ids: studentIds })
      });
      setMessage(teacherBatchMessage || teacherMessage, `Assigned group to ${result.assigned || 0} student(s).`, "success");
      await loadTeacherOverview();
    } catch (error) {
      setMessage(teacherBatchMessage || teacherMessage, error.message, "error");
    }
  });
}

if (teacherStudentFilterApplyBtn) {
  teacherStudentFilterApplyBtn.addEventListener("click", async () => {
    try {
      await applyTeacherStudentFilters();
    } catch (error) {
      if (teacherStudentPageMessage) setMessage(teacherStudentPageMessage, error.message, "error");
    }
  });
}

if (teacherStudentSaveGroupsBtn) {
  teacherStudentSaveGroupsBtn.addEventListener("click", async () => {
    if (!teacherStudentViewData?.student?.user_id) return;
    const checks = [...document.querySelectorAll("input[data-teacher-student-group]")];
    const groupIds = checks
      .filter((c) => c.checked)
      .map((c) => Number(c.getAttribute("data-teacher-student-group")))
      .filter((x) => Number.isInteger(x) && x > 0);
    try {
      await api(`/api/teacher/students/${encodeURIComponent(teacherStudentViewData.student.user_id)}/groups`, {
        method: "PUT",
        body: JSON.stringify({ group_ids: groupIds })
      });
      setMessage(teacherStudentPageMessage, "Group assignment saved.", "success");
      await loadTeacherGroups();
    } catch (error) {
      setMessage(teacherStudentPageMessage, error.message, "error");
    }
  });
}

if (teacherStudentSaveClassBtn) {
  teacherStudentSaveClassBtn.addEventListener("click", async () => {
    const studentId = String(teacherStudentViewData?.student?.user_id || "").trim();
    if (!studentId) return;
    try {
      await api(`/api/teacher/students/${encodeURIComponent(studentId)}/class`, {
        method: "PUT",
        body: JSON.stringify({ class_name: String(teacherStudentClassInput?.value || "").trim() })
      });
      setMessage(teacherStudentPageMessage, "Class updated.", "success");
      await openTeacherStudentPage(studentId);
      await loadTeacherOverview();
    } catch (error) {
      setMessage(teacherStudentPageMessage, error.message, "error");
    }
  });
}

if (teacherStudentBackBtn) {
  teacherStudentBackBtn.addEventListener("click", () => {
    if (teacherStudentBackTarget === "groups") showTeacherGroupPage();
    else if (teacherStudentBackTarget === "batch") showTeacherBatchPage();
    else showTeacherDashboardPage();
  });
}

[teacherDashboardLink, teacherDashboardLink2, teacherDashboardLink3].forEach((btn) => {
  if (!btn) return;
  btn.addEventListener("click", () => {
    showTeacherDashboardPage();
  });
});

[teacherGroupsLink, teacherGroupsLink2, teacherGroupsLink3].forEach((btn) => {
  if (!btn) return;
  btn.addEventListener("click", async () => {
    showTeacherGroupPage();
    if (teacherGroupSelect?.value) {
      try {
        await loadTeacherGroupStats();
      } catch (error) {
        setMessage(teacherGroupMessage || teacherMessage, error.message, "error");
      }
    }
  });
});

[teacherBatchLink, teacherBatchLink2, teacherBatchLink3].forEach((btn) => {
  if (!btn) return;
  btn.addEventListener("click", async () => {
    showTeacherBatchPage();
    if (!latestTeacherOverviewStudents.length) {
      try {
        await loadTeacherOverview();
      } catch (error) {
        setMessage(teacherBatchMessage || teacherMessage, error.message, "error");
      }
    }
  });
});

if (themeLightBtn) {
  themeLightBtn.addEventListener("click", () => {
    setStudentTheme("light");
  });
}

if (themeDarkBtn) {
  themeDarkBtn.addEventListener("click", () => {
    setStudentTheme("dark");
  });
}

init();





})();

