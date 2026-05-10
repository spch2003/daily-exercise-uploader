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
const adminView = document.getElementById("admin-view");
const adminAccountBatchInput = document.getElementById("admin-account-batch-input");
const adminCreateAccountsBtn = document.getElementById("admin-create-accounts-btn");
const adminMessage = document.getElementById("admin-message");
const adminAccountResults = document.getElementById("admin-account-results");
const adminLoadAccountsBtn = document.getElementById("admin-load-accounts-btn");
const adminAccountListWrap = document.getElementById("admin-account-list-wrap");
const adminAccountListMessage = document.getElementById("admin-account-list-message");
const adminBatchAccountRole = document.getElementById("admin-batch-account-role");
const adminBatchAccountGrade = document.getElementById("admin-batch-account-grade");
const adminBatchAccountClass = document.getElementById("admin-batch-account-class");
const adminBatchAccountPassword = document.getElementById("admin-batch-account-password");
const adminBatchUpdateAccountsBtn = document.getElementById("admin-batch-update-accounts-btn");
const adminLoadClassTeachersBtn = document.getElementById("admin-load-class-teachers-btn");
const adminSaveClassTeachersBtn = document.getElementById("admin-save-class-teachers-btn");
const adminClassTeacherWrap = document.getElementById("admin-class-teacher-wrap");
const adminClassTeacherMessage = document.getElementById("admin-class-teacher-message");
const studentDailyPanel = document.getElementById("student-daily-panel");
const studentAssessmentPanel = document.getElementById("student-assessment-panel");
const assessmentList = document.getElementById("assessment-list");
const assessmentSubmitBtn = document.getElementById("assessment-submit-btn");
const assessmentMessage = document.getElementById("assessment-message");
const studentProfilePanel = document.getElementById("student-profile-panel");
const studentPracticePanel = document.getElementById("student-practice-panel");
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
const studentReviewBackBtn = document.getElementById("student-review-back-btn");
const studentReviewList = document.getElementById("student-review-list");
const studentTopicLvMatrix = document.getElementById("student-topic-lv-matrix");
const studentLearningStatusTable = document.getElementById("student-learning-status-table");
const openPracticeModeBtn = document.getElementById("open-practice-mode-btn");
const practiceBackProfileBtn = document.getElementById("practice-back-profile-btn");
const practiceLvSelect = document.getElementById("practice-lv-select");
const practiceTopicSelect = document.getElementById("practice-topic-select");
const practiceSubtopicSelect = document.getElementById("practice-subtopic-select");
const practiceStartBtn = document.getElementById("practice-start-btn");
const practiceNextBtn = document.getElementById("practice-next-btn");
const practiceMessage = document.getElementById("practice-message");
const practiceQuestionList = document.getElementById("practice-question-list");
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
const teacherMainTitle = document.getElementById("teacher-main-title");
const teacherSummary = document.getElementById("teacher-summary");
const teacherAlertList = document.getElementById("teacher-alert-list");
const teacherStatusClassInput = document.getElementById("teacher-status-class-input");
const teacherStatusTopicInput = document.getElementById("teacher-status-topic-input");
const teacherStatusSubtypeInput = document.getElementById("teacher-status-subtype-input");
const teacherStatusLoadBtn = document.getElementById("teacher-status-load-btn");
const teacherStatusTable = document.getElementById("teacher-status-table");
const teacherStudentTools = document.getElementById("teacher-student-tools");
const teacherStudentTabContent = document.getElementById("teacher-student-tab-content");
const teacherAlertTabContent = document.getElementById("teacher-alert-tab-content");
const teacherStatusTabContent = document.getElementById("teacher-status-tab-content");
const teacherClassScopeTabContent = document.getElementById("teacher-class-scope-tab-content");
const teacherClassScopeName = document.getElementById("teacher-class-scope-name");
const teacherClassScopeLoadBtn = document.getElementById("teacher-class-scope-load-btn");
const teacherClassScopeMinDifficulty = document.getElementById("teacher-class-scope-min-difficulty");
const teacherClassScopeMaxDifficulty = document.getElementById("teacher-class-scope-max-difficulty");
const teacherClassScopeTopics = document.getElementById("teacher-class-scope-topics");
const teacherClassScopeSubtype = document.getElementById("teacher-class-scope-subtype");
const teacherClassScopeAddBtn = document.getElementById("teacher-class-scope-add-btn");
const teacherClassScopeList = document.getElementById("teacher-class-scope-list");
const teacherClassScopeSaveBtn = document.getElementById("teacher-class-scope-save-btn");
const teacherTableWrap = document.getElementById("teacher-table-wrap");
const teacherBatchTableWrap = document.getElementById("teacher-batch-table-wrap");
const teacherBatchGroupSelect = document.getElementById("teacher-batch-group-select");
const teacherBatchClassInput = document.getElementById("teacher-batch-class-input");
const teacherBatchSetClassBtn = document.getElementById("teacher-batch-set-class-btn");
const teacherClassTableWrap = document.getElementById("teacher-class-table-wrap");
const teacherGroupTableWrap = document.getElementById("teacher-group-table-wrap");
const newClassGroupName = document.getElementById("new-class-group-name");
const newClassGroupType = document.getElementById("new-class-group-type");
const addClassGroupBtn = document.getElementById("add-class-group-btn");
const deleteSelectedClassGroupBtn = document.getElementById("delete-selected-class-group-btn");
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
const statusDetailDialog = document.getElementById("status-detail-dialog");
const statusDetailTitle = document.getElementById("status-detail-title");
const statusDetailBody = document.getElementById("status-detail-body");
const alertWrongDialog = document.getElementById("alert-wrong-dialog");
const alertWrongTitle = document.getElementById("alert-wrong-title");
const alertWrongBody = document.getElementById("alert-wrong-body");
const alertWrongBackBtn = document.getElementById("alert-wrong-back-btn");
const classGroupDetailDialog = document.getElementById("class-group-detail-dialog");
const classGroupDetailTitle = document.getElementById("class-group-detail-title");
const classGroupDetailBody = document.getElementById("class-group-detail-body");
const teacherStudentPage = document.getElementById("teacher-student-page");
const teacherStudentPageTitle = document.getElementById("teacher-student-page-title");
const teacherStudentBackBtn = document.getElementById("teacher-student-back-btn");
const teacherStudentPageMessage = document.getElementById("teacher-student-page-message");
const teacherStudentPageStats = document.getElementById("teacher-student-page-stats");
const teacherStudentRadarWrap = document.getElementById("teacher-student-radar-wrap");
const teacherStudentClassTitles = document.getElementById("teacher-student-class-titles");
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
let initPromise = null;
const DIAMOND_RULE_TOOLTIP =
  "Diamond rules: Correct +3, wrong +0, correct within 30s +1, 3 correct in a row +2, 5 correct in a row +4. Daily streak bonus (finish >=5/day): 3d +5, 7d +10, 14d +20, 21d +40.";
let verifiedBrowserEmail = "";
const STUDENT_THEME_KEY = "student_theme_mode";
const STUDENT_PAGE_KEY = "student_page_tab";
const TEACHER_PAGE_KEY = "teacher_page_tab";
const TEACHER_PROFILE_STUDENT_KEY = "teacher_profile_student_id";
const STUDENT_FORCE_PROFILE_ONCE_KEY = "student_force_profile_once";
const STUDENT_ASSESSMENT_CACHE_PREFIX = "student_initial_assessment_v12_";
const questionStartTimes = new Map();
let teacherStudentViewData = null;
let difficultyOrder = ["lv2", "lv3", "lv4", "lv5", "lv5*", "lv5**"];
let currentTeacherStudentIds = [];
const selectedTeacherStudentIds = new Set();
let currentGroupMemberIds = [];
const selectedGroupMemberIds = new Set();
let teacherStudentBackTarget = "dashboard";
let currentTeacherPage = "dashboard";
let teacherStatusReturnContext = null;
let latestTeacherOverviewStudents = [];
let teacherOverviewDate = "";
let latestTeacherClasses = [];
let latestTeacherGroups = [];
let teacherStudentSort = { key: "full_name", dir: "asc" };
const teacherStudentFilters = {};
let teacherStatusSort = { key: "sub_type", dir: "asc" };
const teacherStatusFilters = {};
let classGroupStatusSort = { key: "student", dir: "asc" };
const classGroupStatusFilters = {};
const selectedClassNames = new Set();
const selectedClassGroupIds = new Set();
let classGroupStudentPickerSort = { key: "full_name", dir: "asc" };
const classGroupStudentPickerFilters = {};
const classGroupStudentPickerSelected = new Set();
let radarPowerSort = { key: "student_name", dir: "asc" };
let studentLearningStatusSort = { key: "topic", dir: "asc" };
const studentLearningStatusFilters = {};
let latestStudentReviewRecords = [];
let studentStatusReturnContext = null;
let practiceOptions = [];
let currentPracticeQuestion = null;
let currentPracticeSubmitted = null;
const practiceSeenQuestionIds = new Set();
let practiceQuestionStartTime = 0;
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
let classScopeDraft = [];
let assessmentQuestions = [];
const assessmentAnswers = new Map();
let initialAssessmentRequired = false;
let allScopeTopics = [];
let latestStudentProgressTopics = [];
let latestTeacherProgressStudents = [];
let studentAvatarData = null;
let todayMissionCompleted = false;
let serverTokenBalance = 0;
let styleShopState = null;
let frameStyleValueMap = new Map();
let frameImageUrlMap = new Map();
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

function buildFramePreviewVisual(styleKeyRaw, imageUrlRaw = "", nameRaw = "Frame") {
  const imageUrl = String(imageUrlRaw || "").trim();
  if (imageUrl) {
    return `<div class="frame-preview-visual image-frame"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(String(nameRaw || "Frame"))}" class="frame-preview-img" /></div>`;
  }
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
  topTokenBadge.title = DIAMOND_RULE_TOOLTIP;
}

function getSelectedStyleValue(category, fallback = "") {
  const sid = String(styleShopState?.selected?.[category] || "").trim();
  if (category === "frame" && frameStyleValueMap.has(sid)) {
    return String(frameStyleValueMap.get(sid) || fallback);
  }
  const item = STYLE_SHOP_CATALOG.find((x) => x.id === sid && x.category === category);
  return String(item?.value || fallback);
}

function getSelectedFrameImageUrl() {
  const sid = String(styleShopState?.selected?.frame || "").trim();
  return String(frameImageUrlMap.get(sid) || "").trim();
}

function applyStyleShopVisuals() {
  const frame = getSelectedStyleValue("frame", "basic");
  document.body.setAttribute("data-style-frame", frame);
  if (!welcomeAvatarImage) return;
  const wrap = welcomeAvatarImage.closest(".welcome-avatar-wrap");
  if (!wrap) return;
  wrap.querySelectorAll(".welcome-frame-overlay-img").forEach((node) => node.remove());
  const imageUrl = getSelectedFrameImageUrl();
  if (!imageUrl) return;
  const img = document.createElement("img");
  img.className = "welcome-frame-overlay-img";
  img.alt = "";
  img.setAttribute("aria-hidden", "true");
  img.src = imageUrl;
  wrap.appendChild(img);
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
      "Why was it wrong?\nOK = Careless: one retest will be scheduled; pass it to keep your review schedule.\nCancel = Forgot: this type returns to learning mode."
    )
      ? "careless"
      : "forgot";
  }
  return new Promise((resolve) => {
    const onClose = () => {
      wrongFeedbackDialog.removeEventListener("close", onClose);
      const v = String(wrongFeedbackDialog.returnValue || "").trim();
      resolve(v === "careless" ? "careless" : "forgot");
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
  renderScopeDraftList(teacherScopeList, groupScopeDraft, "scope");
}

function renderClassScopeDraft() {
  renderScopeDraftList(teacherClassScopeList, classScopeDraft, "class-scope");
}

function renderScopeDraftList(target, draft, removeKey) {
  if (!target) return;
  const rows = Array.isArray(draft) ? draft : [];
  if (!rows.length) {
    target.innerHTML = "<p>No scope rules (all topics allowed).</p>";
    return;
  }
  target.innerHTML = rows
    .map(
      (row, idx) => `
      <span class="stat">
        ${escapeHtml(row.min_difficulty || "lv2")} ~ ${escapeHtml(row.max_difficulty)} | ${escapeHtml(row.topic)}${
          row.sub_type ? ` | ${escapeHtml(row.sub_type)}` : ""
        }
        <button type="button" class="secondary" data-${removeKey}-remove="${idx}">X</button>
      </span>
    `
    )
    .join("");
  target.querySelectorAll(`button[data-${removeKey}-remove]`).forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute(`data-${removeKey}-remove`));
      if (!Number.isInteger(idx) || idx < 0 || idx >= rows.length) return;
      rows.splice(idx, 1);
      if (removeKey === "class-scope") renderClassScopeDraft();
      else renderGroupScopeDraft();
    });
  });
}

function getSelectedValues(selectEl) {
  if (!selectEl) return [];
  return [...selectEl.selectedOptions].map((o) => String(o.value || "").trim()).filter(Boolean);
}

function renderScopeTopicOptions() {
  const topics = Array.isArray(allScopeTopics) ? allScopeTopics : [];
  const html = topics.length
    ? topics.map((t) => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("")
    : `<option value="" disabled>No topics available</option>`;
  if (teacherScopeTopics) teacherScopeTopics.innerHTML = html;
  if (teacherClassScopeTopics) teacherClassScopeTopics.innerHTML = html;
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
  return v === "practice" || v === "today-review" || v === "settings" ? v : "profile";
}

function saveStudentPagePreference(page) {
  if (page === "daily") return;
  const v = page === "practice" || page === "today-review" || page === "settings" ? page : "profile";
  localStorage.setItem(STUDENT_PAGE_KEY, v);
}

function loadTeacherPagePreference() {
  const v = String(localStorage.getItem(TEACHER_PAGE_KEY) || "").trim();
  return v === "groups" || v === "batch" || v === "alert" || v === "student_profile" ? v : "dashboard";
}

function saveTeacherPagePreference(page) {
  const v = page === "groups" || page === "batch" || page === "alert" || page === "student_profile" ? page : "dashboard";
  localStorage.setItem(TEACHER_PAGE_KEY, v);
}

function saveTeacherProfileStudentId(studentId) {
  const id = String(studentId || "").trim();
  if (id) localStorage.setItem(TEACHER_PROFILE_STUDENT_KEY, id);
}

function loadTeacherProfileStudentId() {
  return String(localStorage.getItem(TEACHER_PROFILE_STUDENT_KEY) || "").trim();
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

function clearDailyCursor(dateValue) {
  if (!dateValue) return;
  localStorage.removeItem(getDailyCursorKey(dateValue));
}

async function switchStudentPage(page) {
  if (initialAssessmentRequired) {
    hideStudentLearningSurfacesForAssessment();
    setMessage(studentMessage, "Complete the placement test first. Daily questions will open after it is submitted.", "success");
    return;
  }
  const requested =
    page === "profile"
      ? "profile"
      : page === "practice"
        ? "practice"
        : page === "today-review"
          ? "today-review"
          : page === "settings"
            ? "settings"
            : "daily";
  const target = requested === "today-review" && !dailyReviewAvailable ? "daily" : requested;
  if (studentAssessmentPanel) studentAssessmentPanel.hidden = true;
  document.body.setAttribute("data-student-page", target);
  saveStudentPagePreference(target);
  if (studentDailyPanel) studentDailyPanel.hidden = target !== "daily";
  if (studentProfilePanel) studentProfilePanel.hidden = target !== "profile";
  if (studentPracticePanel) studentPracticePanel.hidden = target !== "practice";
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
    const showMission = target === "profile" || target === "practice";
    profileDailyMissionBtn.hidden = !showMission;
    profileDailyMissionBtn.style.display = showMission ? "" : "none";
  }
  if (openPracticeModeBtn && me?.role === "student") {
    const showPractice = target === "profile" || target === "practice";
    openPracticeModeBtn.hidden = !showPractice;
    openPracticeModeBtn.style.display = showPractice ? "" : "none";
  }

  if (target === "profile") {
    await loadStudentStats();
    await loadStudentReview();
  } else if (target === "practice") {
    await loadPracticeOptions();
  } else if (target === "today-review") {
    renderTodayReview(dailyAssignments, dailyDate);
    await typeset(dailyReviewList || studentList);
  }
}

function switchProfileTab(tabName) {
  const selected = String(tabName || "class-performance");
  document.querySelectorAll("[data-profile-tab]").forEach((btn) => {
    const active = String(btn.getAttribute("data-profile-tab") || "") === selected;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });
  document.querySelectorAll("[data-profile-panel]").forEach((panel) => {
    const active = String(panel.getAttribute("data-profile-panel") || "") === selected;
    panel.hidden = !active;
    panel.classList.toggle("active", active);
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cssEscape(value) {
  if (window.CSS?.escape) return window.CSS.escape(String(value));
  return String(value).replace(/["\\]/g, "\\$&");
}

function shuffleCopy(items) {
  const arr = Array.isArray(items) ? [...items] : [];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatChoicesOnSeparateLines(text) {
  return String(text || "")
    .replace(/\s+([A-H])\.\s*/g, "\n$1. ")
    .replace(/^\s+/, "");
}

function assessmentCacheKey() {
  return `${STUDENT_ASSESSMENT_CACHE_PREFIX}${me?.user_id || "anonymous"}`;
}

function getCachedAssessmentQuestions() {
  try {
    const raw = localStorage.getItem(assessmentCacheKey());
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed?.questions) ? parsed.questions : null;
  } catch (_error) {
    return null;
  }
}

function setCachedAssessmentQuestions(questions) {
  try {
    localStorage.setItem(assessmentCacheKey(), JSON.stringify({ questions, cached_at: Date.now() }));
  } catch (_error) {
    // Cache is only for keeping the in-progress test stable.
  }
}

function clearCachedAssessmentQuestions() {
  try {
    localStorage.removeItem(assessmentCacheKey());
  } catch (_error) {
    // Ignore storage failures.
  }
}

function assessmentQuestionsHaveUniqueSubtopics(questions) {
  const subtopicSet = new Set();
  for (const q of Array.isArray(questions) ? questions : []) {
    const id = String(q?.id || "");
    const topic = String(q?.topic || "").trim().toLowerCase() || `blank-topic-${id}`;
    const subtopic = `${topic}|||${String(q?.sub_type || "").trim().toLowerCase() || `blank-subtopic-${id}`}`;
    if (subtopicSet.has(subtopic)) return false;
    subtopicSet.add(subtopic);
  }
  return subtopicSet.size === (Array.isArray(questions) ? questions.length : 0);
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
  // \node[...] at (...) $...$; -> \node[...] at (...) {$...$};
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
  value = value
    .replace(/(\d+(?:\.\d+)?)\s*\^?\\?circ\s*/g, "$1\u00b0")
    .replace(/\\circ(?=[A-Za-z])/g, "\\circ ");

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

  const bracesBalanced = (textValue) => {
    let depth = 0;
    for (const char of String(textValue || "")) {
      if (char === "{") depth += 1;
      if (char === "}") depth -= 1;
      if (depth < 0) return false;
    }
    return depth === 0;
  };

  const wrapUndelimitedLatexLine = (line) => {
    if (hasMathDelimiters(line) || !/\\[a-zA-Z]+/.test(line)) return line;

    const choiceMatch = line.match(/^([A-Z]\.\s*)(.+)$/);
    const prefix = choiceMatch ? choiceMatch[1] : "";
    const body = choiceMatch ? choiceMatch[2] : line;
    const latexStart = body.search(/\\[a-zA-Z]+/);
    if (latexStart < 0) return line;

    const leadingText = body.slice(0, latexStart);
    let latexText = body.slice(latexStart).trim();
    let trailingText = "";
    const trailingMatch = latexText.match(/^([\s\S]*?)([.!?。])$/);
    if (trailingMatch && bracesBalanced(trailingMatch[1])) {
      latexText = trailingMatch[1].trim();
      trailingText = trailingMatch[2];
    }

    return `${prefix}${leadingText}\\(${latexText}\\)${trailingText}`;
  };

  const wrapLineIfNeeded = (line) => {
    const alreadyDisplay = /^\\\[[\s\S]*\\\]$/.test(line) || /^\$\$[\s\S]*\$\$$/.test(line);
    if (alreadyDisplay) return line;

    return wrapUndelimitedLatexLine(line);
  };

  if (multiline) {
    value = lines.map((line) => wrapLineIfNeeded(line)).join("\n\n");
  } else if (lines.length > 1) {
    value = lines.map((line) => wrapLineIfNeeded(line)).join("\n");
  } else {
    value = wrapLineIfNeeded(lines[0]);
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
    const readableText = formatChoicesOnSeparateLines(cleanedText);
    textDiv.textContent = formatLatexForReadableLines(readableText, multiline);
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

function getSelectedMcAnswer(questionId, root = studentList) {
  const group = root?.querySelector(`.mc-options[data-question-id='${questionId}']`);
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

function wireMcButtons(root = studentList) {
  root?.querySelectorAll(".mc-options").forEach((group) => {
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
  if (adminView) adminView.hidden = true;
  if (studentAssessmentPanel) studentAssessmentPanel.hidden = true;
  if (studentPracticePanel) studentPracticePanel.hidden = true;
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

  if (me.role === "admin") {
    document.body.setAttribute("data-student-page", "teacher");
    if (welcomeTitle) welcomeTitle.textContent = "";
    if (welcomeSubtitle) welcomeSubtitle.textContent = "";
    if (welcomeProfile) welcomeProfile.hidden = true;
    if (topShopBtn) topShopBtn.hidden = true;
    if (profileDailyMissionBtn) profileDailyMissionBtn.hidden = true;
    if (openPracticeModeBtn) openPracticeModeBtn.hidden = true;
    if (topTokenBadge) topTokenBadge.hidden = true;
    studentView.hidden = true;
    teacherView.hidden = true;
    if (teacherBatchPage) teacherBatchPage.hidden = true;
    if (teacherGroupPage) teacherGroupPage.hidden = true;
    if (teacherStudentPage) teacherStudentPage.hidden = true;
    if (adminView) adminView.hidden = false;
    if (topChangePwBtn) topChangePwBtn.hidden = false;
    if (topChangePwPanel) topChangePwPanel.hidden = true;
    await loadAdminAccounts().catch((error) => {
      setMessage(adminAccountListMessage, error.message || "Failed to load accounts.", "error");
    });
    await loadAdminClassTeacherAssignments().catch((error) => {
      setMessage(adminClassTeacherMessage, error.message || "Failed to load class teacher settings.", "error");
    });
    return;
  }

  if (me.role === "teacher") {
    document.body.setAttribute("data-student-page", "teacher");
    if (welcomeTitle) welcomeTitle.textContent = "";
    if (welcomeSubtitle) welcomeSubtitle.textContent = "";
    if (welcomeProfile) welcomeProfile.hidden = true;
    if (welcomeAvatarImage) welcomeAvatarImage.textContent = "👩‍🏫";
    if (openAvatarShopBtn) openAvatarShopBtn.hidden = true;
    if (topShopBtn) topShopBtn.hidden = true;
    if (profileDailyMissionBtn) profileDailyMissionBtn.hidden = true;
    if (openPracticeModeBtn) openPracticeModeBtn.hidden = true;
    if (topTokenBadge) topTokenBadge.hidden = true;
    studentView.hidden = true;
    if (adminView) adminView.hidden = true;
    const preferredTeacherPage = loadTeacherPagePreference();
    const preferredProfileStudentId = loadTeacherProfileStudentId();
    if (preferredTeacherPage === "student_profile" && preferredProfileStudentId) {
      showTeacherStudentPage();
    } else if (preferredTeacherPage === "groups") showTeacherGroupPage();
    else if (preferredTeacherPage === "alert" || preferredTeacherPage === "batch") showTeacherAlertPage();
    else showTeacherDashboardPage();
    if (themeLightBtn) themeLightBtn.disabled = false;
    if (themeDarkBtn) themeDarkBtn.disabled = false;
    if (topChangePwBtn) topChangePwBtn.hidden = false;
    if (topChangePwPanel) topChangePwPanel.hidden = true;
    applyStudentTheme("light");
    await loadScopeTopicOptions();
    if (!latestTeacherOverviewStudents.length) await loadTeacherOverview();
    if (preferredTeacherPage === "groups" && teacherGroupSelect?.value) {
      try {
        await loadTeacherGroupStats();
      } catch (_e) {
        // Keep teacher page usable.
      }
    }
    if (preferredTeacherPage === "student_profile" && preferredProfileStudentId) {
      try {
        await openTeacherStudentPage(preferredProfileStudentId);
      } catch (_e) {
        showTeacherGroupPage();
      }
    }
  } else {
    styleShopState = loadStyleShopState(me.user_id);
    serverTokenBalance = Number(me.token_balance || 0);
    if (me.selected_frame) {
      frameStyleValueMap.set(String(me.selected_frame.id), String(me.selected_frame.style_key || "basic"));
      frameImageUrlMap.set(String(me.selected_frame.id), String(me.selected_frame.image_url || ""));
      styleShopState.selected.frame = String(me.selected_frame.id);
      saveStyleShopState(me.user_id, styleShopState);
    }
    renderStudentWelcomeName();
    welcomeSubtitle.textContent = "";
    if (welcomeProfile) {
      welcomeProfile.hidden = false;
      welcomeProfile.classList.add("student-header");
    }
    renderWelcomeAvatar(me.selected_avatar || null);
    applyStyleShopVisuals();
    if (openAvatarShopBtn) openAvatarShopBtn.hidden = true;
    if (topShopBtn) topShopBtn.hidden = false;
    if (profileDailyMissionBtn) profileDailyMissionBtn.hidden = true;
    if (openPracticeModeBtn) openPracticeModeBtn.hidden = true;
    setTopTokenBadge();
    teacherView.hidden = true;
    if (adminView) adminView.hidden = true;
    if (teacherStudentPage) teacherStudentPage.hidden = true;
    studentView.hidden = false;
    if (themeLightBtn) themeLightBtn.disabled = false;
    if (themeDarkBtn) themeDarkBtn.disabled = false;
    if (topChangePwBtn) topChangePwBtn.hidden = false;
    applyStudentTheme(loadStudentTheme());
    const needsAssessment = await loadInitialAssessmentIfNeeded();
    if (needsAssessment) return;
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
    updateDailyCompletionActions(false);
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
  const isLastQuestion = currentDailyIndex >= dailyAssignments.length - 1;

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
        const submitResult = await api("/api/student/submit", {
          method: "POST",
          body: JSON.stringify({
            question_id: questionId,
            assignment_date: assignmentDate,
            answer_text: answer,
            time_spent_seconds: elapsedSeconds,
            careless_error: false,
            defer_wrong_feedback: true
          })
        });
        const reward = Number(submitResult?.token_reward || 0);
        if (Number.isFinite(Number(submitResult?.token_balance))) {
          serverTokenBalance = Number(submitResult.token_balance);
          setTopTokenBadge();
        }
        const progressMessage = String(submitResult?.progress_feedback?.message || "").trim();
        if (progressMessage) {
          setMessage(studentMessage, progressMessage, submitResult?.progress_feedback?.teacher_notified ? "error" : "success");
        } else if (reward > 0) setMessage(studentMessage, `Answer submitted. +${reward} diamonds`, "success");
        else setMessage(studentMessage, "Answer submitted.", "success");
        clearDrawStateForQuestion(questionId);
        lastSubmittedQuestionId = questionId;
        questionStartTimes.delete(questionId);
        await loadStudentDaily();
        if (submitResult?.needs_wrong_feedback === true) {
          const feedbackChoice = await askWrongFeedbackChoice();
          const feedbackResult = await api(`/api/student/submit/${encodeURIComponent(questionId)}/wrong-feedback`, {
            method: "POST",
            body: JSON.stringify({
              assignment_date: assignmentDate,
              time_spent_seconds: elapsedSeconds,
              careless_error: feedbackChoice === "careless"
            })
          });
          const feedbackMessage = String(feedbackResult?.progress_feedback?.message || "").trim();
          if (feedbackMessage) {
            setMessage(studentMessage, feedbackMessage, feedbackResult?.progress_feedback?.teacher_notified ? "error" : "success");
          }
          await loadStudentDaily();
        }
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
  updateDailyCompletionActions(isLastQuestion && isSubmitted);

  await typeset(studentList);
}

function updateDailyCompletionActions(show) {
  const visible = Boolean(show && dailyReviewAvailable);
  if (dailyGoReviewBtn) dailyGoReviewBtn.hidden = !visible;
  if (dailyRefreshLatestBtn) {
    dailyRefreshLatestBtn.hidden = !visible;
    dailyRefreshLatestBtn.disabled = !visible;
  }
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
      const passThroughTarget = under.closest(".mc-choice:not([disabled]), button[data-submit-id]:not([disabled]), button[data-practice-submit-id]:not([disabled])");
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
      const clickable =
        under instanceof Element
          ? under.closest(".mc-choice:not([disabled]), button[data-submit-id]:not([disabled]), button[data-practice-submit-id]:not([disabled])")
          : null;
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
    const alerts = Array.isArray(alertData.alerts) ? alertData.alerts : [];

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
    dailyReviewAvailable = allAssignedDone;
    updateDailyCompletionActions(false);

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
    if (alerts.length) {
      setMessage(
        studentMessage,
        `Teacher support needed: ${alerts.length} question type(s) are paused. Your teacher has been notified. Please find your teacher for help with those question types.`,
        "error"
      );
    }

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

function hideStudentLearningSurfacesForAssessment() {
  if (studentDailyPanel) studentDailyPanel.hidden = true;
  if (studentProfilePanel) studentProfilePanel.hidden = true;
  if (studentPracticePanel) studentPracticePanel.hidden = true;
  if (studentTodayReviewPage) studentTodayReviewPage.hidden = true;
  if (studentAvatarShopPage) studentAvatarShopPage.hidden = true;
  if (studentOwnedOverlay) studentOwnedOverlay.hidden = true;
  if (studentSettingsPage) studentSettingsPage.hidden = true;
  if (studentAssessmentPanel) studentAssessmentPanel.hidden = false;
}

function renderAssessmentQuestions(questions) {
  if (!assessmentList) return;
  assessmentAnswers.clear();
  assessmentQuestions = Array.isArray(questions) ? questions : [];
  if (!assessmentQuestions.length) {
    assessmentList.innerHTML = "<p>No placement questions are available. Please tell your teacher.</p>";
    return;
  }
  assessmentList.innerHTML = assessmentQuestions
    .map(
      (q, idx) => `
      <article class="question-card is-pending" data-assessment-question="${escapeHtml(q.id)}">
        <div class="question-head">
          <div class="question-head-main">
            <strong>Question ${idx + 1}</strong>
          </div>
        </div>
        <div class="question-split">
          <div class="question-main">
            <div class="question-body assessment-question-body"></div>
            <div class="mc-wrap">
              <div class="answer-label">Choose one answer</div>
              <div class="mc-options assessment-options">
                ${detectMcLabels(q.latex_code)
                  .map((label) => `<button type="button" class="mc-choice" data-assessment-answer="${escapeHtml(label)}">${escapeHtml(label)}</button>`)
                  .join("")}
                <button type="button" class="mc-choice dont-know-choice" data-assessment-answer="__dont_know__">Don't know</button>
              </div>
            </div>
          </div>
        </div>
      </article>
    `
    )
    .join("");
  assessmentQuestions.forEach((q) => {
    const card = assessmentList.querySelector(`[data-assessment-question="${cssEscape(String(q.id))}"]`);
    const body = card?.querySelector(".assessment-question-body");
    if (body) renderQuestionBody(body, formatChoicesOnSeparateLines(q.latex_code || ""), { multiline: true });
  });
  assessmentList.querySelectorAll("button[data-assessment-answer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest("[data-assessment-question]");
      const questionId = String(card?.getAttribute("data-assessment-question") || "");
      const answer = String(btn.getAttribute("data-assessment-answer") ?? "");
      if (!questionId) return;
      assessmentAnswers.set(questionId, answer);
      card.querySelectorAll("button[data-assessment-answer]").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });
}

async function loadInitialAssessmentIfNeeded() {
  if (!studentAssessmentPanel) return false;
  const data = await api("/api/student/initial-assessment", { timeout_ms: 15000 });
  if (data.completed) {
    initialAssessmentRequired = false;
    clearCachedAssessmentQuestions();
    studentAssessmentPanel.hidden = true;
    return false;
  }
  initialAssessmentRequired = true;
  hideStudentLearningSurfacesForAssessment();
  let questions = getCachedAssessmentQuestions();
  const serverQuestions = Array.isArray(data.questions) ? data.questions : [];
  if (
    !questions ||
    !questions.length ||
    questions.length !== serverQuestions.length ||
    !assessmentQuestionsHaveUniqueSubtopics(questions)
  ) {
    if (questions && questions.length) clearCachedAssessmentQuestions();
    questions = shuffleCopy(serverQuestions);
    setCachedAssessmentQuestions(questions);
  }
  if (data.debug) {
    const displayedByLevel = { lv2: 0, lv3: 0, lv4: 0, lv5: 0 };
    for (const q of questions) {
      if (Object.prototype.hasOwnProperty.call(displayedByLevel, q.difficulty)) displayedByLevel[q.difficulty] += 1;
    }
    console.log("Initial assessment debug (displayed questions)", {
      ...data.debug,
      displayed_question_count: questions.length,
      displayed_by_level: displayedByLevel
    });
    console.table(
      questions.map((q) => ({
        id: q.id,
        difficulty: q.difficulty,
        grade: q.grade,
        topic: q.topic,
        sub_type: q.sub_type
      }))
    );
  }
  renderAssessmentQuestions(questions);
  await typeset(assessmentList);
  setMessage(studentMessage, "");
  return true;
}

async function loadStudentStats() {
  if (!studentStats) return;
  const data = await api("/api/student/stats");
  serverTokenBalance = Number(data.token_balance || 0);
  updateDailyMissionIndicator(Number(data.submitted_today || 0), 5);
  studentStats.innerHTML = "";
  renderStudentRadar(data);
  renderClassTitles([]);
  setTopTokenBadge();
}

function practiceSelection() {
  return {
    difficulty: String(practiceLvSelect?.value || "").trim(),
    topic: String(practiceTopicSelect?.value || "").trim(),
    sub_type: String(practiceSubtopicSelect?.value || "").trim()
  };
}

function practiceOptionMatches(option, selected, omitField = "") {
  if (omitField !== "difficulty" && selected.difficulty && option.difficulty !== selected.difficulty) return false;
  if (omitField !== "topic" && selected.topic && option.topic !== selected.topic) return false;
  if (omitField !== "sub_type" && selected.sub_type && option.sub_type !== selected.sub_type) return false;
  return true;
}

function uniquePracticeValues(field, selected, omitField) {
  return [...new Set(
    practiceOptions
      .filter((option) => practiceOptionMatches(option, selected, omitField))
      .map((option) => String(option?.[field] || "").trim())
      .filter(Boolean)
  )];
}

function renderPracticeOptions() {
  if (!practiceLvSelect || !practiceTopicSelect || !practiceSubtopicSelect) return;
  const selected = practiceSelection();
  const lvList = uniquePracticeValues("difficulty", selected, "difficulty")
    .sort((a, b) => difficultyOrder.indexOf(a) - difficultyOrder.indexOf(b));
  practiceLvSelect.innerHTML = `<option value="">All Lv</option>${lvList
    .map((lv) => `<option value="${escapeHtml(lv)}">${escapeHtml(lv)}</option>`)
    .join("")}`;
  if (selected.difficulty && lvList.includes(selected.difficulty)) practiceLvSelect.value = selected.difficulty;

  const selectedAfterLv = { ...selected, difficulty: String(practiceLvSelect.value || "") };
  const topicList = uniquePracticeValues("topic", selectedAfterLv, "topic")
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }));
  practiceTopicSelect.innerHTML = `<option value="">All Topics</option>${topicList
    .map((topic) => `<option value="${escapeHtml(topic)}">${escapeHtml(topic)}</option>`)
    .join("")}`;
  if (selected.topic && topicList.includes(selected.topic)) practiceTopicSelect.value = selected.topic;

  const selectedAfterTopic = {
    ...selectedAfterLv,
    topic: String(practiceTopicSelect.value || "")
  };
  const subList = uniquePracticeValues("sub_type", selectedAfterTopic, "sub_type")
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }));
  practiceSubtopicSelect.innerHTML = `<option value="">All Sub-topics</option>${subList
    .map((subType) => `<option value="${escapeHtml(subType)}">${escapeHtml(subType)}</option>`)
    .join("")}`;
  if (selected.sub_type && subList.includes(selected.sub_type)) practiceSubtopicSelect.value = selected.sub_type;
}

async function loadPracticeOptions() {
  if (!practiceOptions.length) {
    const data = await api("/api/student/practice/options", { timeout_ms: 15000 });
    practiceOptions = Array.isArray(data?.options) ? data.options : [];
    renderPracticeOptions();
  }
}

async function loadPracticeQuestion() {
  const selected = practiceSelection();
  setMessage(practiceMessage, "Loading practice question...");
  const data = await api("/api/student/practice/question", {
    method: "POST",
    body: JSON.stringify({ ...selected, exclude_question_ids: [...practiceSeenQuestionIds] }),
    timeout_ms: 15000
  });
  currentPracticeQuestion = data.question || null;
  currentPracticeSubmitted = null;
  if (currentPracticeQuestion?.id) practiceSeenQuestionIds.add(Number(currentPracticeQuestion.id));
  practiceQuestionStartTime = Date.now();
  renderPracticeQuestion();
  setMessage(practiceMessage, "");
}

function renderPracticeQuestion() {
  if (!practiceQuestionList) return;
  const q = currentPracticeQuestion || {};
  if (!q.id) {
    practiceQuestionList.innerHTML = "<p>Choose a sub-topic and start practice.</p>";
    return;
  }
  const isSubmitted = Boolean(currentPracticeSubmitted);
  const state = buildSubmissionState(currentPracticeSubmitted);
  const isMc = String(q.question_type || "").trim() === "MC";
  const answerValue = String(currentPracticeSubmitted?.answer_text || "").trim();
  const mcLabels = detectMcLabels(q.latex_code || "");
  const roughKey = -Math.abs(Number(q.id));
  practiceQuestionList.innerHTML = `
    <article class="question-card ${state.cardClass}">
      <div class="question-head">
        <div class="question-head-main">
          <strong>Practice question</strong>
          <div class="inline-tools rough-tools top-rough-tools">
            <button type="button" class="secondary tool-btn draw-main-btn" id="rough-draw-${roughKey}" title="Draw on screen" aria-label="Draw on screen">Draw On Screen</button>
            <button type="button" class="secondary tool-btn icon-tool-btn pen-tool-btn" id="rough-pen-${roughKey}" hidden title="Pen colors" aria-label="Pen colors"><span class="tool-art pen-art" aria-hidden="true"></span></button>
            <div class="color-palette" id="rough-pen-palette-${roughKey}" hidden>
              ${PEN_COLOR_OPTIONS.map((c) => `<button type="button" class="color-dot" data-pen-color="${escapeHtml(c)}" style="--dot:${escapeHtml(c)}" aria-label="Pen color ${escapeHtml(c)}"></button>`).join("")}
            </div>
            <button type="button" class="secondary tool-btn icon-tool-btn highlighter-tool-btn" id="rough-highlighter-${roughKey}" hidden title="Highlight colors" aria-label="Highlight colors"><span class="tool-art highlighter-art" aria-hidden="true"></span></button>
            <div class="color-palette" id="rough-highlighter-palette-${roughKey}" hidden>
              ${HIGHLIGHTER_COLOR_OPTIONS.map((c) => `<button type="button" class="color-dot" data-highlighter-color="${escapeHtml(c)}" style="--dot:${escapeHtml(c)}" aria-label="Highlighter color ${escapeHtml(c)}"></button>`).join("")}
            </div>
            <button type="button" class="secondary tool-btn icon-tool-btn eraser-tool-btn" id="rough-eraser-${roughKey}" hidden title="Eraser" aria-label="Eraser"><span class="tool-art eraser-art" aria-hidden="true"></span></button>
            <button type="button" class="secondary tool-btn icon-tool-btn undo-tool-btn" id="rough-undo-${roughKey}" hidden title="Undo" aria-label="Undo">↶</button>
            <button type="button" class="secondary tool-btn icon-tool-btn clear-tool-btn" id="rough-clear-${roughKey}" hidden title="Clear drawing" aria-label="Clear drawing">✕</button>
          </div>
        </div>
        <div class="question-head-right">
          <div class="question-labels question-head-labels">
            <span class="mini-tag topic-tag">${escapeHtml(String(q.topic || "General"))}</span>
            <span class="mini-tag lv-tag">${escapeHtml(String(q.difficulty || "-"))}</span>
            <span class="mini-tag type-tag">${escapeHtml(String(q.question_type || "Short Answer"))}</span>
          </div>
          <span class="badge ${state.badgeClass}">${escapeHtml(state.text)}</span>
        </div>
      </div>
      <div class="question-split ${isSubmitted ? "has-solution" : ""}">
        <div class="question-main">
          <div class="question-body" id="practice-question-body-${q.id}"></div>
          ${
            isMc
              ? `
                <div class="mc-wrap">
                  <div class="answer-label">Choose one answer</div>
                  <div class="mc-options" data-question-id="${q.id}" data-selected="${escapeHtml(answerValue.toUpperCase())}">
                    ${mcLabels
                      .map((label) => `<button type="button" class="mc-choice" data-option="${label}" aria-pressed="false" ${isSubmitted ? "disabled" : ""}>${label}</button>`)
                      .join("")}
                  </div>
                </div>
              `
              : `
                <label>
                  Your answer
                  <textarea data-practice-question-id="${q.id}" rows="2" placeholder="Type your answer here..." ${isSubmitted ? "readonly disabled" : ""}>${escapeHtml(answerValue)}</textarea>
                </label>
              `
          }
          <button type="button" data-practice-submit-id="${q.id}" ${isSubmitted ? "disabled" : ""}>${isSubmitted ? "Submitted" : "Submit Answer"}</button>
        </div>
        ${
          isSubmitted
            ? `
              <aside class="question-side">
                <div class="answer-reveal side-answer-reveal">
                  <div class="answer-reveal-label">Correct Answer</div>
                  <div class="answer-reveal-value">${escapeHtml(String(q.answer_text || "").trim())}</div>
                </div>
                ${
                  String(q.solution_latex || "").trim()
                    ? `<details class="solution-panel side-solution-panel" open><summary>Solution</summary><div class="solution-body" id="practice-solution-body-${q.id}"></div></details>`
                    : ""
                }
              </aside>
            `
            : ""
        }
      </div>
      <button type="button" class="secondary tool-btn rough-float-toggle icon-tool-btn" id="rough-float-${roughKey}" hidden title="Stop drawing (Esc)" aria-label="Stop drawing">✕</button>
      <canvas id="rough-canvas-${roughKey}" class="rough-screen-canvas" aria-label="Rough work drawing area"></canvas>
    </article>
  `;
  const body = document.getElementById(`practice-question-body-${q.id}`);
  if (body) renderQuestionBody(body, q.latex_code || "");
  const solutionBody = document.getElementById(`practice-solution-body-${q.id}`);
  if (solutionBody) renderQuestionBody(solutionBody, q.solution_latex || "", { multiline: true });
  initializeRoughWorkCanvas(roughKey);
  wireMcButtons(practiceQuestionList);
  practiceQuestionList.querySelectorAll(".mc-options").forEach((group) => {
    setSelectedMcAnswer(group, group.getAttribute("data-selected") || "");
  });
  const submitBtn = practiceQuestionList.querySelector("button[data-practice-submit-id]");
  if (submitBtn) {
    submitBtn.addEventListener("click", submitPracticeAnswer);
  }
  typeset(practiceQuestionList);
}

async function submitPracticeAnswer() {
  const q = currentPracticeQuestion || {};
  const questionId = Number(q.id);
  const mcAnswer = getSelectedMcAnswer(questionId, practiceQuestionList);
  const textarea = practiceQuestionList?.querySelector(`textarea[data-practice-question-id='${questionId}']`);
  const answer = mcAnswer || String(textarea?.value || "").trim();
  if (!answer) {
    setMessage(practiceMessage, "Please choose/type an answer before submitting.", "error");
    return;
  }
  const elapsedSeconds = practiceQuestionStartTime ? Math.max(1, Math.round((Date.now() - practiceQuestionStartTime) / 1000)) : null;
  const roughKey = -Math.abs(questionId);
  disableDrawModeForQuestion(roughKey);
  const result = await api("/api/student/practice/submit", {
    method: "POST",
    body: JSON.stringify({ question_id: questionId, answer_text: answer, time_spent_seconds: elapsedSeconds })
  });
  currentPracticeSubmitted = {
    answer_text: answer,
    is_correct: result?.is_correct,
    submitted_at: result?.submission?.submitted_at,
    time_spent_seconds: elapsedSeconds
  };
  const reward = Number(result?.token_reward || 0);
  if (Number.isFinite(Number(result?.token_balance))) {
    serverTokenBalance = Number(result.token_balance);
    setTopTokenBadge();
  }
  setMessage(
    practiceMessage,
    `${result?.is_correct === true ? "Correct." : "Submitted."}${reward > 0 ? ` +${reward} diamonds` : ""} Practice does not change your learning status or daily questions.`,
    result?.is_correct === true ? "success" : "error"
  );
  clearDrawStateForQuestion(roughKey);
  renderPracticeQuestion();
  if (practiceNextBtn) practiceNextBtn.hidden = false;
  await loadStudentStats();
}

function renderClassTitles(titles) {
  if (!studentClassTitles) return;
  studentClassTitles.innerHTML = "";
}

const RADAR_DISPLAY_LABELS = {
  Combo: "Longest streaks",
  Aim: "Correct %",
  Flash: "Speed",
  Grind: "Questions done",
  Fortune: "Diamonds used"
};

function formatAspectRawValue(key, value) {
  const n = Number(value || 0);
  if (key === "Aim") return `${Math.round(n)}%`;
  if (key === "Flash") return formatSeconds(Math.round(n));
  if (key === "Combo") return `${Math.round(n)} day(s)`;
  return `${Math.round(n)}`;
}

function getFrameClassName(frame) {
  const style = String(frame?.style_key || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return style ? ` classmate-frame-${style}` : "";
}

function initialsFromName(name) {
  const parts = String(name || "Student").trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "S";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

function renderClassmateAvatar(row) {
  const avatar = row?.selected_avatar || {};
  const imageUrl = String(avatar.image_url || "").trim();
  const emoji = String(avatar.emoji || "").trim();
  const frameImageUrl = String(row?.selected_frame?.image_url || "").trim();
  const frameClass = getFrameClassName(row?.selected_frame);
  const name = String(row?.student_name || "Student");
  const content = imageUrl
    ? `<img src="${escapeHtml(imageUrl)}" alt="" class="classmate-avatar-img" />`
    : `<span class="classmate-avatar-text">${escapeHtml(emoji || initialsFromName(name))}</span>`;
  const frameImg = frameImageUrl
    ? `<img src="${escapeHtml(frameImageUrl)}" alt="" class="classmate-avatar-frame-img" />`
    : "";
  return `<span class="classmate-avatar${frameClass}${frameImageUrl ? " has-image-frame" : ""}" aria-hidden="true">${content}${frameImg}</span>`;
}

function getClassmatePowerSortValue(row, key) {
  if (key === "student_name") return String(row?.student_name || "").toLowerCase();
  return Number(row?.aspect_values?.[key] ?? row?.metrics?.[key] ?? 0);
}

function renderClassmatePowerTable(rows, labels, className) {
  const classmates = Array.isArray(rows) ? [...rows] : [];
  const displayClassName = String(className || "").trim() || "Class";
  const sort = radarPowerSort || { key: "student_name", dir: "asc" };
  const dir = sort.dir === "desc" ? -1 : 1;
  classmates.sort((a, b) => {
    const av = getClassmatePowerSortValue(a, sort.key);
    const bv = getClassmatePowerSortValue(b, sort.key);
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });
  const sortMark = (key) => (sort.key === key ? (sort.dir === "asc" ? " ↑" : " ↓") : "");
  const headerButton = (key, label) =>
    `<button type="button" class="table-sort-btn radar-sort-btn" data-radar-sort="${escapeHtml(key)}">${escapeHtml(label)}${sortMark(key)}</button>`;
  if (!classmates.length) {
    return `
      <div class="radar-classmates">
        <h4>${escapeHtml(displayClassName)}</h4>
        <div class="empty-note radar-classmates-body">No classmate power data to show yet.</div>
      </div>
    `;
  }
  return `
    <div class="radar-classmates">
      <h4>${escapeHtml(displayClassName)}</h4>
      <div class="radar-classmates-body">
        <table class="compact-table radar-classmate-table">
          <thead>
            <tr>
              <th>${headerButton("student_name", "Name")}</th>
              ${labels
                .map((key) => `<th>${headerButton(key, RADAR_DISPLAY_LABELS[key] || key)}</th>`)
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${classmates
              .map(
                (row) => `
                  <tr>
                    <td>
                      <div class="classmate-name-cell">
                        ${renderClassmateAvatar(row)}
                        <span>${escapeHtml(String(row.student_name || "Student"))}</span>
                      </div>
                    </td>
                    ${labels
                      .map((key) => `<td>${escapeHtml(formatAspectRawValue(key, row?.aspect_values?.[key] ?? 0))}</td>`)
                      .join("")}
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderRadarChart(target, data, labelsForLegend = { student: "You", classAvg: "Class Avg" }) {
  if (!target) return;
  const studentMetrics = data?.radar?.student || {};
  const classMetrics = data?.radar?.class_avg || {};
  const classmatesPower = Array.isArray(data?.classmates_power) ? data.classmates_power : [];
  const className = data?.class_name || data?.student?.class_name || "";
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
      const displayName = RADAR_DISPLAY_LABELS[name] || name;
      return `
        <line x1="${cx}" y1="${cy}" x2="${end[0]}" y2="${end[1]}" stroke="#a9c5e8" stroke-width="1" />
        <text x="${labelPt[0]}" y="${labelPt[1]}" class="radar-label">${escapeHtml(String(displayName))}</text>
      `;
    })
    .join("");
  const rings = [20, 40, 60, 80, 100]
    .map((rPct) => `<polygon points="${poly(labels.map(() => rPct))}" fill="none" stroke="#d4e3f8" stroke-width="1" />`)
    .join("");
  target.innerHTML = `
    <div class="radar-layout">
      <div class="radar-chart-panel">
        <h4>Power Pentagon</h4>
        <svg viewBox="0 0 ${size} ${size}" class="radar-svg" role="img" aria-label="Student vs class average radar chart">
          ${rings}
          ${axis}
          <polygon points="${poly(valsClass)}" class="radar-class" />
          <polygon points="${poly(valsStudent)}" class="radar-student" />
          <circle cx="${cx}" cy="${cy}" r="2.2" fill="#1b3f6e" />
        </svg>
        <div class="inline-tools">
          <span class="stat"><span class="legend-dot legend-student"></span> ${escapeHtml(labelsForLegend.student)}</span>
          <span class="stat"><span class="legend-dot legend-class"></span> ${escapeHtml(labelsForLegend.classAvg)}</span>
        </div>
      </div>
      ${renderClassmatePowerTable(classmatesPower, labels, className)}
    </div>
  `;
  target.querySelectorAll("[data-radar-sort]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = String(btn.dataset.radarSort || "student_name");
      radarPowerSort = {
        key,
        dir: radarPowerSort.key === key && radarPowerSort.dir === "asc" ? "desc" : "asc"
      };
      renderRadarChart(target, data, labelsForLegend);
    });
  });
}

function renderStudentRadar(data) {
  renderRadarChart(studentRadarWrap, data, { student: "You", classAvg: "Class Avg" });
}

function renderWelcomeAvatar(selectedAvatar) {
  if (!welcomeAvatarImage) return;
  welcomeAvatarImage.innerHTML = buildAvatarVisual(selectedAvatar, {
    photoClass: "welcome-avatar-photo",
    modelClass: "welcome-avatar-model",
    alt: "Profile avatar"
  });
}

function buildAvatarVisual(avatar, options = {}) {
  const modelUrl = String(avatar?.model_url || "").trim();
  const imageUrl = String(avatar?.image_url || "").trim();
  const emoji = String(avatar?.emoji || "").trim() || "🐾";
  const name = String(options.alt || avatar?.name || "Avatar");
  const photoClass = String(options.photoClass || "avatar-photo");
  const modelClass = String(options.modelClass || "avatar-model");
  if (modelUrl) {
    return `<model-viewer
      src="${escapeHtml(modelUrl)}"
      alt="${escapeHtml(name)}"
      class="${escapeHtml(modelClass)}"
      camera-controls
      auto-rotate
      camera-orbit="0deg 75deg 105%"
      field-of-view="28deg"
      rotation-per-second="24deg"
      interaction-prompt="none"
      loading="lazy"
      reveal="auto"
      shadow-intensity="0.35"
    ><span class="avatar-model-fallback">3D</span></model-viewer>`;
  }
  if (imageUrl) {
    return `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(name)}" class="${escapeHtml(photoClass)}" />`;
  }
  return escapeHtml(emoji);
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
              <div class="avatar-emoji ${avatar.model_url ? "has-3d-model" : ""}">
                ${buildAvatarVisual(avatar)}
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
              ${buildFramePreviewVisual(item.style_key, item.image_url, item.name)}
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
  welcomeTitle.innerHTML = `<span class="welcome-word">Welcome</span><button id="welcome-name-link" type="button" class="welcome-name-link">${safeName}</button>`;
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
  frameImageUrlMap = new Map(frameCatalog.map((f) => [String(f.id), String(f.image_url || "")]));
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
        return `<div class="preview-pic-item">${buildAvatarVisual(avatar, {
          photoClass: "preview-pic-img",
          modelClass: "preview-pic-model",
          alt: String(avatar.name || "Character")
        })}</div>`;
      })
      .join("");
  }
  if (previewFramesGrid) {
    previewFramesGrid.innerHTML = frameCatalog
      .map((item) => {
        return `<div class="preview-pic-item">${buildFramePreviewVisual(item.style_key, item.image_url, item.name)}</div>`;
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
          const isFrameReward = String(item.type || "").trim().toLowerCase() === "frame";
          const icon = isFrameReward
            ? buildFramePreviewVisual(item.style_key, item.image_url, item.name)
            : buildAvatarVisual(item, { alt: String(item.name || "Item") });
          shopDrawRevealContent.innerHTML = `
            <div class="gacha-result reveal">
              <div class="avatar-emoji ${item.model_url ? "has-3d-model" : ""}">${icon}</div>
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
  window.studentAvatarData = data;
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

function populateTopicFilter(selectEl, records, selected = "", extraTopics = []) {
  if (!selectEl) return;
  const selectedValue = String(selected || "").trim();
  const topics = [
    ...new Set([
      ...(records || []).map((r) => String(r?.problems?.topic || "").trim()).filter(Boolean),
      ...(extraTopics || []).map((topic) => String(topic || "").trim()).filter(Boolean)
    ])
  ].sort((a, b) => a.localeCompare(b));
  selectEl.innerHTML = `<option value="">All Topics</option>${topics
    .map((topic) => `<option value="${escapeHtml(topic)}" ${topic === selectedValue ? "selected" : ""}>${escapeHtml(topic)}</option>`)
    .join("")}`;
}

function filterReviewRecords(records, filters = {}) {
  const lv = String(filters.difficulty || "").trim();
  const topic = String(filters.topic || "").trim();
  const subType = String(filters.sub_type || "").trim();
  const result = String(filters.result || "").trim();
  const date = String(filters.date || "").trim();

  return (records || []).filter((row) => {
    const q = row.problems || {};
    if (lv && String(q.difficulty || "") !== lv) return false;
    if (topic && String(q.topic || "") !== topic) return false;
    if (subType && String(q.sub_type || "") !== subType) return false;
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

function renderTopicLevelMatrix(target, records, levels, onTopicClick = showStudentTopicStatus) {
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
      return `<tr><td><button type="button" class="student-link" data-topic-status="${escapeHtml(row.topic)}">${escapeHtml(row.topic)}</button></td>${lvCells}<td class="${overallClass}">${overallPct === null ? "-" : `${overallPct}%`}</td></tr>`;
    })
    .join("");

  target.innerHTML = `
    <table class="matrix-table">
      <thead>${thead}</thead>
      <tbody>${tbody}</tbody>
    </table>
  `;
  target.querySelectorAll("button[data-topic-status]").forEach((btn) => {
    btn.addEventListener("click", () => {
      Promise.resolve(onTopicClick(String(btn.getAttribute("data-topic-status") || ""))).catch((error) => {
        setMessage(teacherStudentPageMessage || teacherMessage || studentMessage, error.message || "Failed to load status.", "error");
      });
    });
  });
}

function renderTeacherStatusTopicMatrix(target, records, levels, progressTopics) {
  renderTopicLevelMatrix(target, records, levels, (topic) => showTeacherStudentTopicStatus(topic, progressTopics || []));
}

async function showTeacherStudentTopicStatus(topic, topics) {
  if (!statusDetailDialog || !statusDetailBody) return;
  const entry = (topics || []).find((x) => String(x.topic || "") === topic);
  if (statusDetailTitle) statusDetailTitle.textContent = `${topic || "Topic"} Status`;
  const bankData = await api(`/api/teacher/question-bank/subtopics?topic=${encodeURIComponent(topic)}`).catch(() => ({ subtopics: [] }));
  const progressRows = entry?.subtopics || [];
  const progressByKey = new Map(
    progressRows.map((row) => [`${String(row.difficulty || "")}|||${String(row.sub_type || "")}`, row])
  );
  const bankRows = Array.isArray(bankData.subtopics) ? bankData.subtopics : [];
  const fallbackRows = progressRows.map((row) => ({ difficulty: row.difficulty, topic, sub_type: row.sub_type }));
  const rows = (bankRows.length ? bankRows : fallbackRows).map((row) => {
    const progress = progressByKey.get(`${String(row.difficulty || "")}|||${String(row.sub_type || "")}`) || {};
    return {
      difficulty: row.difficulty || progress.difficulty || "",
      topic,
      sub_type: row.sub_type || progress.sub_type || "",
      status: progress.status || "",
      note: progress.status ? teacherStatusNote(progress.status) : ""
    };
  });
  const columns = [
    ["status", "Status"],
    ["difficulty", "Level"],
    ["sub_type", "Sub-topic"],
    ["note", "Note"]
  ];
  const tableRows = rows;
  const optionHtmlFor = (key) => {
    const values = [...new Set(tableRows.map((row) => String(row[key] ?? "").trim() || "-"))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    return `<option value="">All</option>${values
      .map((v) => `<option value="${escapeHtml(v)}" ${String(teacherStatusFilters[key] || "") === v ? "selected" : ""}>${escapeHtml(v)}</option>`)
      .join("")}`;
  };
  const filteredRows = tableRows.filter((row) =>
    columns.every(([key]) => {
      const value = String(teacherStatusFilters[key] || "").trim();
      if (!value) return true;
      return String(row[key] ?? "").trim() === value;
    })
  );
  const sortedRows = [...filteredRows].sort((a, b) => {
    const av = a[teacherStatusSort.key];
    const bv = b[teacherStatusSort.key];
    const cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true });
    return teacherStatusSort.dir === "desc" ? -cmp : cmp;
  });
  statusDetailBody.innerHTML = `
    <div class="status-note-list">
      ${["UNKNOWN", "KNOWN", "MASTERED", "BACKFILL", "FROZEN"]
        .map((s) => `<div><strong>${s}:</strong> ${escapeHtml(teacherStatusNote(s))}</div>`)
        .join("")}
    </div>
    ${
      tableRows.length
        ? `
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  ${columns.map(([key, label]) => `<th><button type="button" class="table-sort-btn" data-status-sort="${key}">${escapeHtml(label)}${teacherStatusSort.key === key ? (teacherStatusSort.dir === "asc" ? " ↑" : " ↓") : ""}</button></th>`).join("")}
                </tr>
                <tr>
                  ${columns.map(([key]) => `<th><select class="table-filter-input" data-status-filter="${key}">${optionHtmlFor(key)}</select></th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${sortedRows
                  .map(
                    (row) => `
                    <tr>
                      <td>${escapeHtml(row.status || "-")}</td>
                      <td>${escapeHtml(row.difficulty || "-")}</td>
                      <td><button type="button" class="student-link" data-status-subtopic="${escapeHtml(row.sub_type || "")}" data-status-level="${escapeHtml(row.difficulty || "")}">${escapeHtml(row.sub_type || "-")}</button></td>
                      <td>${escapeHtml(row.note || "-")}</td>
                    </tr>
                  `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        `
        : "<p>No learning status recorded for this topic yet.</p>"
    }
  `;
  statusDetailBody.querySelectorAll("button[data-status-sort]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = String(btn.getAttribute("data-status-sort") || "");
      if (teacherStatusSort.key === key) teacherStatusSort.dir = teacherStatusSort.dir === "asc" ? "desc" : "asc";
      else teacherStatusSort = { key, dir: "asc" };
      showTeacherStudentTopicStatus(topic, topics);
    });
  });
  statusDetailBody.querySelectorAll("select[data-status-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      teacherStatusFilters[String(select.getAttribute("data-status-filter") || "")] = select.value;
      showTeacherStudentTopicStatus(topic, topics);
    });
  });
  statusDetailBody.querySelectorAll("button[data-status-subtopic]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await showTeacherAnsweredQuestionsForSubtopic(
        topic,
        String(btn.getAttribute("data-status-subtopic") || ""),
        String(btn.getAttribute("data-status-level") || "")
      );
    });
  });
  if (typeof statusDetailDialog.showModal === "function") statusDetailDialog.showModal();
  else statusDetailDialog.setAttribute("open", "open");
}

async function showTeacherAnsweredQuestionsForSubtopic(topic, subType, difficulty = "") {
  if (!alertWrongDialog || !alertWrongBody) return;
  const student = teacherStudentViewData?.student || {};
  teacherStatusReturnContext = { topic, topics: teacherStudentViewData?.progressTopics || [] };
  if (alertWrongBackBtn) alertWrongBackBtn.hidden = false;
  const records = (teacherStudentViewData?.records || []).filter((row) => {
    const p = row.problems || {};
    return (
      String(p.topic || "") === String(topic || "") &&
      String(p.sub_type || "") === String(subType || "") &&
      (!difficulty || String(p.difficulty || "") === String(difficulty || ""))
    );
  });
  if (alertWrongTitle) alertWrongTitle.textContent = `${student.full_name || "Student"} - ${subType || "Sub-topic"} Answered Questions`;
  alertWrongBody.innerHTML = records.length
    ? records
        .map((row) => {
          const q = row.problems || {};
          return `
            <article class="question-card ${row.is_correct === true ? "is-correct" : "is-wrong"}">
              <div class="question-head">
                <strong>${escapeHtml(row.assignment_date || "-")}</strong>
                <span class="badge">${row.is_correct === true ? "Correct" : "Wrong"}</span>
              </div>
              <div class="question-body" id="status-history-q-${escapeHtml(row.id)}"></div>
              <div class="summary">
                <div class="stat"><strong>Student answer:</strong> ${escapeHtml(row.answer_text || "-")}</div>
                <div class="stat"><strong>Correct answer:</strong> ${escapeHtml(q.answer_text || "-")}</div>
              </div>
            </article>
          `;
        })
        .join("")
    : "<p>This student has not answered questions in this sub-topic yet.</p>";
  for (const row of records) {
    const body = alertWrongBody.querySelector(`#status-history-q-${cssEscape(String(row.id))}`);
    if (body) renderQuestionBody(body, row.problems?.latex_code || "", { multiline: true });
  }
  await typeset(alertWrongBody);
  if (statusDetailDialog?.open) statusDetailDialog.close();
  if (typeof alertWrongDialog.showModal === "function") alertWrongDialog.showModal();
  else alertWrongDialog.setAttribute("open", "open");
}

function studentStatusSymbol(status) {
  const s = String(status || "").toUpperCase();
  if (s === "MASTERED") return "Green";
  if (s === "KNOWN" || s === "BACKFILL") return "Yellow";
  return "Red";
}

function studentStatusLabel(status) {
  const s = String(status || "").toUpperCase();
  if (s === "MASTERED") return "Mastered";
  if (s === "KNOWN" || s === "BACKFILL") return "Learning on track";
  return "Needs work";
}

function studentStatusColourClass(status) {
  const s = String(status || "").toUpperCase();
  if (s === "MASTERED") return "status-green";
  if (s === "KNOWN" || s === "BACKFILL") return "status-yellow";
  return "status-red";
}

function studentStatusDisplay(status) {
  const s = String(status || "").toUpperCase();
  if (s === "MASTERED") return "Mastered";
  if (s === "KNOWN" || s === "BACKFILL") return "On track";
  return "Needs work";
}

function uniqueSortedValues(rows, key) {
  return [...new Set((rows || []).map((row) => String(row?.[key] || "").trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
}

function studentLearningStatusSortValue(row, key) {
  if (key === "status") return studentStatusDisplay(row.status);
  return String(row?.[key] || "");
}

async function showStudentAnsweredQuestionsForSubtopic(topic, subType, difficulty = "") {
  studentStatusReturnContext = { topic };
  if (studentReviewBackBtn) studentReviewBackBtn.hidden = false;
  let records = filterReviewRecords(latestStudentReviewRecords, {
    topic,
    sub_type: subType
  });
  if (!records.length && subType) {
    records = filterReviewRecords(latestStudentReviewRecords, { sub_type: subType });
  }
  if (statusDetailDialog?.open) statusDetailDialog.close();
  switchProfileTab("review");
  renderReviewRecords(records, studentReviewList);
  populateTopicFilter(reviewFilterTopic, latestStudentReviewRecords, topic, latestStudentProgressTopics.map((row) => row.topic));
  if (reviewFilterTopic) reviewFilterTopic.value = topic || "";
  if (reviewFilterLv) reviewFilterLv.value = "";
  const message = records.length
    ? `Showing ${records.length} answered question(s) for ${subType || "this sub-topic"}.`
    : `${subType || "This sub-topic"} is in the learning plan, but no answered question is saved under it yet.`;
  setMessage(studentMessage, message, records.length ? "success" : "error");
  await typeset(studentReviewList);
}

function renderStudentLearningStatusTable(topics) {
  if (!studentLearningStatusTable) return;
  const rows = (Array.isArray(topics) ? topics : [])
    .flatMap((topic) =>
      (Array.isArray(topic.subtopics) ? topic.subtopics : []).map((row) => ({
        topic: String(topic.topic || ""),
        sub_type: String(row.sub_type || ""),
        difficulty: String(row.difficulty || ""),
        status: String(row.status || "")
      }))
    )
    .filter((row) => row.sub_type || row.difficulty || row.status);
  if (!rows.length) {
    studentLearningStatusTable.innerHTML = `<p class="hint">No learning status recorded yet.</p>`;
    return;
  }
  const filterOptions = {
    topic: uniqueSortedValues(rows, "topic"),
    sub_type: uniqueSortedValues(rows, "sub_type"),
    difficulty: uniqueSortedValues(rows, "difficulty"),
    status: uniqueSortedValues(rows.map((row) => ({ status: studentStatusDisplay(row.status) })), "status")
  };
  const activeFilters = {
    topic: String(studentLearningStatusFilters.topic || ""),
    sub_type: String(studentLearningStatusFilters.sub_type || ""),
    difficulty: String(studentLearningStatusFilters.difficulty || ""),
    status: String(studentLearningStatusFilters.status || "")
  };
  const filteredRows = rows.filter((row) => {
    if (activeFilters.topic && row.topic !== activeFilters.topic) return false;
    if (activeFilters.sub_type && row.sub_type !== activeFilters.sub_type) return false;
    if (activeFilters.difficulty && row.difficulty !== activeFilters.difficulty) return false;
    if (activeFilters.status && studentStatusDisplay(row.status) !== activeFilters.status) return false;
    return true;
  });
  const sort = studentLearningStatusSort || { key: "topic", dir: "asc" };
  const dir = sort.dir === "desc" ? -1 : 1;
  const sortMark = (key) => (sort.key === key ? (sort.dir === "asc" ? " ↑" : " ↓") : "");
  const sortButton = (key, label) =>
    `<button type="button" class="table-sort-btn" data-student-status-sort="${escapeHtml(key)}">${escapeHtml(label)}${sortMark(key)}</button>`;
  const filterSelect = (key, options) => `
    <select class="table-filter-input" data-student-status-filter="${escapeHtml(key)}">
      <option value="">All</option>
      ${options
        .map((option) => `<option value="${escapeHtml(option)}" ${activeFilters[key] === option ? "selected" : ""}>${escapeHtml(option)}</option>`)
        .join("")}
    </select>
  `;
  filteredRows.sort((a, b) => {
    if (sort.key === "difficulty") {
      const aIdx = difficultyOrder.indexOf(a.difficulty);
      const bIdx = difficultyOrder.indexOf(b.difficulty);
      const cmp = (aIdx < 0 ? 999 : aIdx) - (bIdx < 0 ? 999 : bIdx);
      if (cmp) return cmp * dir;
    }
    const av = studentLearningStatusSortValue(a, sort.key);
    const bv = studentLearningStatusSortValue(b, sort.key);
    return av.localeCompare(bv) * dir;
  });
  studentLearningStatusTable.innerHTML = `
    <table class="learning-status-table">
      <thead>
        <tr>
          <th>${sortButton("topic", "Topic")}</th>
          <th>${sortButton("sub_type", "Sub-topic")}</th>
          <th>${sortButton("difficulty", "Level")}</th>
          <th>${sortButton("status", "Status")}</th>
        </tr>
        <tr>
          <th>${filterSelect("topic", filterOptions.topic)}</th>
          <th>${filterSelect("sub_type", filterOptions.sub_type)}</th>
          <th>${filterSelect("difficulty", filterOptions.difficulty)}</th>
          <th>${filterSelect("status", filterOptions.status)}</th>
        </tr>
      </thead>
      <tbody>
        ${filteredRows
          .map(
            (row) => `
              <tr>
                <td>${escapeHtml(row.topic || "-")}</td>
                <td><button type="button" class="link-button" data-student-status-subtopic="${escapeHtml(row.sub_type)}" data-student-status-topic="${escapeHtml(row.topic)}" data-student-status-level="${escapeHtml(row.difficulty)}">${escapeHtml(row.sub_type || "-")}</button></td>
                <td>${escapeHtml(row.difficulty || "-")}</td>
                <td><span class="learning-status-badge ${studentStatusColourClass(row.status)}">${escapeHtml(studentStatusDisplay(row.status))}</span></td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
  studentLearningStatusTable.querySelectorAll("[data-student-status-sort]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = String(btn.getAttribute("data-student-status-sort") || "topic");
      if (studentLearningStatusSort.key === key) studentLearningStatusSort.dir = studentLearningStatusSort.dir === "asc" ? "desc" : "asc";
      else studentLearningStatusSort = { key, dir: "asc" };
      renderStudentLearningStatusTable(latestStudentProgressTopics);
    });
  });
  studentLearningStatusTable.querySelectorAll("[data-student-status-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      studentLearningStatusFilters[String(select.getAttribute("data-student-status-filter") || "")] = select.value;
      renderStudentLearningStatusTable(latestStudentProgressTopics);
    });
  });
  studentLearningStatusTable.querySelectorAll("[data-student-status-subtopic]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await showStudentAnsweredQuestionsForSubtopic(
        String(btn.getAttribute("data-student-status-topic") || ""),
        String(btn.getAttribute("data-student-status-subtopic") || "")
      );
    });
  });
}

function teacherStatusNote(status) {
  const s = String(status || "").toUpperCase();
  const notes = {
    UNKNOWN: "Learning now: student needs cross-day correct answers.",
    KNOWN: "Review mode: student is following the spaced review schedule.",
    MASTERED: "Mastered: review cycle completed.",
    BACKFILL: "Backfill: checking skipped lower-level foundations.",
    FROZEN: "Frozen: paused for teacher support after repeated errors."
  };
  return notes[s] || "No status yet.";
}

function showStudentTopicStatus(topic) {
  if (!statusDetailDialog || !statusDetailBody) return;
  const entry = latestStudentProgressTopics.find((x) => String(x.topic || "") === topic);
  if (statusDetailTitle) statusDetailTitle.textContent = topic || "Learning Status";
  const rows = entry?.subtopics || [];
  statusDetailBody.innerHTML = rows.length
    ? `
      <table class="learning-status-table">
        <thead>
          <tr>
            <th>Sub-topic</th>
            <th>Level</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
                <tr>
                  <td><button type="button" class="link-button" data-student-popup-subtopic="${escapeHtml(row.sub_type || "")}" data-student-popup-topic="${escapeHtml(topic || "")}" data-student-popup-level="${escapeHtml(row.difficulty || "")}">${escapeHtml(row.sub_type || "-")}</button></td>
                  <td>${escapeHtml(row.difficulty || "-")}</td>
                  <td><span class="learning-status-badge ${studentStatusColourClass(row.status)}">${escapeHtml(studentStatusDisplay(row.status))}</span></td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `
    : "<p>No learning status recorded for this topic yet.</p>";
  statusDetailBody.querySelectorAll("[data-student-popup-subtopic]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await showStudentAnsweredQuestionsForSubtopic(
        String(btn.getAttribute("data-student-popup-topic") || ""),
        String(btn.getAttribute("data-student-popup-subtopic") || "")
      );
    });
  });
  if (typeof statusDetailDialog.showModal === "function") statusDetailDialog.showModal();
  else statusDetailDialog.setAttribute("open", "open");
}

async function loadStudentReview() {
  if (!studentReviewList) return;
  studentStatusReturnContext = null;
  if (studentReviewBackBtn) studentReviewBackBtn.hidden = true;
  const [data, progressData] = await Promise.all([
    api("/api/student/review"),
    api("/api/student/progress").catch(() => ({ topics: [] }))
  ]);
  const allRecords = Array.isArray(data.records) ? data.records : [];
  latestStudentReviewRecords = allRecords;
  latestStudentProgressTopics = Array.isArray(progressData.topics) ? progressData.topics : [];
  renderStudentLearningStatusTable(latestStudentProgressTopics);
  renderTopicLevelMatrix(studentTopicLvMatrix, allRecords, difficultyOrder);
  populateTopicFilter(reviewFilterTopic, allRecords, reviewFilterTopic?.value || "", latestStudentProgressTopics.map((row) => row.topic));
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
  if (!teacherTableWrap) return;
  currentTeacherStudentIds = students.map((s) => String(s.student_id || "")).filter(Boolean);
  if (!students.length) {
    teacherTableWrap.innerHTML = "<p>No student accounts found.</p>";
    return;
  }

  const dateLabel = teacherOverviewDate || teacherDate?.value || today();
  const columns = [
    ["full_name", "Student"],
    ["class_name", "Class"],
    ["initial_test_level", "Initial test level"],
    ["submitted", `Answered in ${dateLabel}`],
    ["questions_answered", "Answered (All Time)"],
    ["correct_percentage", "Correct %"],
    ["average_time_seconds", "Avg Time / Q"],
    ["longest_streak_days", "Longest Streak"],
    ["finished_today", "5+ Done"],
    ["active_alerts", "Alerts"]
  ];
  const optionHtmlFor = (key) => {
    const values = [...new Set(students.map((student) => {
      if (key === "finished_today") return student.finished_today ? "Finished" : "Not Yet";
      if (key === "average_time_seconds") return formatSeconds(student.average_time_seconds || 0);
      if (key === "correct_percentage") return `${student.correct_percentage || 0}%`;
      return String(student[key] ?? "").trim() || "-";
    }))].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
    return `<option value="">All</option>${values.map((v) => `<option value="${escapeHtml(v)}" ${String(teacherStudentFilters[key] || "") === String(v) ? "selected" : ""}>${escapeHtml(v)}</option>`).join("")}`;
  };
  const filtered = students.filter((student) =>
    columns.every(([key]) => {
      const filterValue = String(teacherStudentFilters[key] || "").trim().toLowerCase();
      if (!filterValue) return true;
      const raw =
        key === "finished_today"
          ? (student.finished_today ? "Finished" : "Not Yet")
          : key === "average_time_seconds"
            ? formatSeconds(student.average_time_seconds || 0)
            : key === "correct_percentage"
              ? `${student.correct_percentage || 0}%`
              : student[key];
      return String(raw ?? "").toLowerCase().includes(filterValue);
    })
  );
  const sorted = [...filtered].sort((a, b) => {
    const key = teacherStudentSort.key;
    const av = a[key];
    const bv = b[key];
    const an = Number(av);
    const bn = Number(bv);
    const cmp = Number.isFinite(an) && Number.isFinite(bn) ? an - bn : String(av ?? "").localeCompare(String(bv ?? ""));
    return teacherStudentSort.dir === "desc" ? -cmp : cmp;
  });

  const rows = sorted
    .map(
      (student) => `
      <tr class="${student.finished_today ? "" : "incomplete-row"}">
        <td><button type="button" class="student-link" data-profile-student="${escapeHtml(student.student_id)}">${escapeHtml(
          student.full_name || "-"
        )}</button></td>
        <td>${escapeHtml(student.class_name || "-")}</td>
        <td>${escapeHtml(student.initial_test_level || "-")}</td>
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
          ${columns.map(([key, label]) => `<th>${
            key === "submitted"
              ? `<label class="date-header-label">Answered in <input id="teacher-table-date-filter" type="date" value="${escapeHtml(dateLabel)}" /></label>`
              : `<button type="button" class="table-sort-btn" data-teacher-sort="${key}">${escapeHtml(label)}${teacherStudentSort.key === key ? (teacherStudentSort.dir === "asc" ? " ↑" : " ↓") : ""}</button>`
          }</th>`).join("")}
          <th>Actions</th>
        </tr>
        <tr>
          ${columns.map(([key]) => `<th><select class="table-filter-input" data-teacher-filter="${key}">${optionHtmlFor(key)}</select></th>`).join("")}
          <th></th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  teacherTableWrap.querySelectorAll("button[data-teacher-sort]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = String(btn.getAttribute("data-teacher-sort") || "");
      if (teacherStudentSort.key === key) teacherStudentSort.dir = teacherStudentSort.dir === "asc" ? "desc" : "asc";
      else teacherStudentSort = { key, dir: "asc" };
      renderTeacherTable(latestTeacherOverviewStudents);
    });
  });
  teacherTableWrap.querySelectorAll("select[data-teacher-filter]").forEach((input) => {
    input.addEventListener("change", () => {
      teacherStudentFilters[String(input.getAttribute("data-teacher-filter") || "")] = input.value;
      renderTeacherTable(latestTeacherOverviewStudents);
    });
  });
  const dateInput = teacherTableWrap.querySelector("#teacher-table-date-filter");
  if (dateInput) {
    dateInput.addEventListener("change", async () => {
      teacherOverviewDate = dateInput.value || today();
      if (teacherDate) teacherDate.value = teacherOverviewDate;
      try {
        await loadTeacherOverview();
      } catch (error) {
        setMessage(teacherMessage, error.message, "error");
      }
    });
  }

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
  currentTeacherStudentIds = students.map((s) => String(s.student_id || "")).filter(Boolean);
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
  const [groups, classes] = await Promise.all([
    api("/api/teacher/groups"),
    api("/api/teacher/classes").catch(() => [])
  ]);
  latestTeacherGroups = Array.isArray(groups) ? groups : [];
  latestTeacherClasses = Array.isArray(classes) ? classes : [];
  renderGroupOptions(groups);
  renderClassGroupTables();
}

function renderClassGroupTables() {
  if (teacherClassTableWrap) {
    teacherClassTableWrap.innerHTML = latestTeacherClasses.length
      ? `
        <table>
          <thead><tr><th>Select</th><th>Class</th><th>Students</th><th>Avg Correct %</th><th>Avg Questions Done</th></tr></thead>
          <tbody>
            ${latestTeacherClasses
              .map(
                (c) => `
                <tr>
                  <td><input type="checkbox" data-class-select="${escapeHtml(c.name)}" ${selectedClassNames.has(String(c.name || "")) ? "checked" : ""} /></td>
                  <td><button type="button" class="student-link" data-open-class="${escapeHtml(c.name)}">${escapeHtml(c.name)}</button></td>
                  <td>${c.student_count || 0}</td>
                  <td>${c.average_correct_percentage || 0}%</td>
                  <td>${c.average_questions_done || 0}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      `
      : "<p>No classes yet.</p>";
  }
  if (teacherGroupTableWrap) {
    teacherGroupTableWrap.innerHTML = latestTeacherGroups.length
      ? `
        <table>
          <thead><tr><th>Select</th><th>Group</th><th>Students</th><th>Avg Correct %</th><th>Avg Questions Done</th></tr></thead>
          <tbody>
            ${latestTeacherGroups
              .map(
                (g) => `
                <tr>
                  <td><input type="checkbox" data-group-select="${escapeHtml(g.id)}" ${selectedClassGroupIds.has(String(g.id || "")) ? "checked" : ""} /></td>
                  <td><button type="button" class="student-link" data-open-group="${escapeHtml(g.id)}">${escapeHtml(g.name)}</button></td>
                  <td>${g.member_count || 0}</td>
                  <td>${g.average_correct_percentage || 0}%</td>
                  <td>${g.average_questions_done || 0}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      `
      : "<p>No groups yet.</p>";
  }
  document.querySelectorAll("input[data-class-select]").forEach((input) => {
    input.addEventListener("change", () => {
      const name = String(input.getAttribute("data-class-select") || "");
      if (input.checked) selectedClassNames.add(name);
      else selectedClassNames.delete(name);
    });
  });
  document.querySelectorAll("input[data-group-select]").forEach((input) => {
    input.addEventListener("change", () => {
      const id = String(input.getAttribute("data-group-select") || "");
      if (input.checked) selectedClassGroupIds.add(id);
      else selectedClassGroupIds.delete(id);
    });
  });
  document.querySelectorAll("button[data-open-class]").forEach((btn) => {
    btn.addEventListener("click", async () => openClassGroupDialog("class", String(btn.getAttribute("data-open-class") || "")));
  });
  document.querySelectorAll("button[data-open-group]").forEach((btn) => {
    btn.addEventListener("click", async () => openClassGroupDialog("group", String(btn.getAttribute("data-open-group") || "")));
  });
}

async function openClassGroupDialog(kind, id) {
  if (!classGroupDetailDialog || !classGroupDetailBody) return;
  const item = kind === "class" ? latestTeacherClasses.find((c) => String(c.name) === String(id)) : latestTeacherGroups.find((g) => String(g.id) === String(id));
  if (!item) return;
  const title = kind === "class" ? `Class ${item.name}` : `Group ${item.name}`;
  if (classGroupDetailTitle) classGroupDetailTitle.textContent = title;
  classGroupDetailDialog.dataset.kind = kind;
  classGroupDetailDialog.dataset.id = String(id);
  classGroupDetailDialog.dataset.name = String(item.name || id);
  await renderClassGroupTab("stat");
  if (typeof classGroupDetailDialog.showModal === "function") classGroupDetailDialog.showModal();
  else classGroupDetailDialog.setAttribute("open", "open");
}

async function renderClassGroupTab(tab) {
  if (!classGroupDetailDialog || !classGroupDetailBody) return;
  const kind = classGroupDetailDialog.dataset.kind;
  const id = classGroupDetailDialog.dataset.id;
  const name = classGroupDetailDialog.dataset.name;
  classGroupDetailDialog.querySelectorAll("button[data-class-group-tab]").forEach((btn) => {
    btn.classList.toggle("active", String(btn.getAttribute("data-class-group-tab")) === tab);
  });
  const students =
    kind === "class"
      ? latestTeacherOverviewStudents.filter((s) => String(s.class_name || "") === name)
      : latestTeacherOverviewStudents.filter((s) => latestTeacherGroups.find((g) => String(g.id) === id)?.members?.includes?.(s.student_id));
  if (tab === "students") {
    const scopedStudents = students;
    classGroupDetailBody.innerHTML = `
      <div class="top-row"><h4>Student list</h4><button type="button" id="modal-add-student-btn">Add student</button></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Student</th><th>Email</th><th>Class</th><th>Initial Level</th><th>Done</th><th>Correct %</th><th>Remove</th></tr></thead>
          <tbody>
            ${scopedStudents
              .map(
                (s) => `<tr><td><button type="button" class="student-link" data-profile-student="${escapeHtml(s.student_id)}">${escapeHtml(s.full_name || "-")}</button></td><td>${escapeHtml(s.email || "-")}</td><td>${escapeHtml(s.class_name || "-")}</td><td>${escapeHtml(s.initial_test_level || "-")}</td><td>${s.questions_answered || 0}</td><td>${s.correct_percentage || 0}%</td><td><button type="button" class="secondary" data-modal-remove-student="${escapeHtml(s.student_id)}">Remove</button></td></tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
    classGroupDetailBody.querySelectorAll("button[data-profile-student]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (classGroupDetailDialog.open) classGroupDetailDialog.close();
        teacherStudentBackTarget = kind === "class" || kind === "group" ? "groups" : teacherStudentBackTarget;
        await openTeacherStudentPage(String(btn.getAttribute("data-profile-student") || ""));
      });
    });
    classGroupDetailBody.querySelectorAll("button[data-modal-remove-student]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const studentId = String(btn.getAttribute("data-modal-remove-student") || "");
        if (!studentId) return;
        if (kind === "class") {
          await api(`/api/teacher/students/${encodeURIComponent(studentId)}/class`, {
            method: "PUT",
            body: JSON.stringify({ class_name: "" })
          });
        } else {
          await api(`/api/teacher/groups/${encodeURIComponent(id)}/remove-students`, {
            method: "POST",
            body: JSON.stringify({ student_ids: [studentId] })
          });
        }
        await loadTeacherOverview();
        await loadTeacherGroups();
        await renderClassGroupTab("students");
      });
    });
    classGroupDetailBody.querySelector("#modal-add-student-btn")?.addEventListener("click", async () => {
      renderClassGroupStudentPicker(kind, id, name);
    });
    return;
  }
  if (tab === "scope") {
    classGroupDetailBody.innerHTML = `
      <h4>${kind === "class" ? "Class" : "Group"} Scope</h4>
      <p class="hint">A student's questions must be inside the intersection of the class scope and every group scope they belong to.</p>
      <div class="inline-tools">
        <select id="modal-scope-min-difficulty">
          <option value="">Min Lv</option>
          ${difficultyOrder.map((x) => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join("")}
        </select>
        <select id="modal-scope-max-difficulty">
          <option value="">Max Lv</option>
          ${difficultyOrder.map((x) => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join("")}
        </select>
        <select id="modal-scope-topics" multiple size="6" aria-label="Select scope topics">
          ${
            allScopeTopics.length
              ? allScopeTopics.map((topic) => `<option value="${escapeHtml(topic)}">${escapeHtml(topic)}</option>`).join("")
              : `<option value="" disabled>No topics available</option>`
          }
        </select>
        <input id="modal-scope-subtype" type="text" placeholder="Sub-topic (optional)" />
        <button type="button" id="modal-scope-add-btn">Add Scope</button>
      </div>
      <div id="modal-scope-list" class="summary"></div>
      <button type="button" id="modal-scope-save-btn">Save Scope</button>
    `;
    const getDraft = () => (kind === "class" ? classScopeDraft : groupScopeDraft);
    const setDraft = (rows) => {
      if (kind === "class") classScopeDraft = rows;
      else groupScopeDraft = rows;
    };
    const scopeList = classGroupDetailBody.querySelector("#modal-scope-list");
    const renderModalScopeDraft = () => {
      const draft = getDraft();
      if (!scopeList) return;
      if (!draft.length) {
        scopeList.innerHTML = "<p>No scope rules. All topics are allowed.</p>";
        return;
      }
      scopeList.innerHTML = draft
        .map(
          (row, idx) => `
            <span class="stat">
              <strong>${escapeHtml(row.min_difficulty || "lv2")} - ${escapeHtml(row.max_difficulty || row.difficulty || "-")}</strong>
              ${escapeHtml(row.topic || "-")}
              ${row.sub_type ? ` / ${escapeHtml(row.sub_type)}` : ""}
              <button type="button" class="secondary" data-modal-scope-remove="${idx}">Remove</button>
            </span>
          `
        )
        .join("");
      scopeList.querySelectorAll("button[data-modal-scope-remove]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.getAttribute("data-modal-scope-remove"));
          const next = getDraft().slice();
          if (!Number.isInteger(idx) || idx < 0 || idx >= next.length) return;
          next.splice(idx, 1);
          setDraft(next);
          renderModalScopeDraft();
        });
      });
    };
    try {
      const data =
        kind === "class"
          ? await api(`/api/teacher/classes/${encodeURIComponent(name)}/scope`)
          : await api(`/api/teacher/groups/${encodeURIComponent(id)}/scope`);
      setDraft(Array.isArray(data.scope_rules) ? data.scope_rules.map((row) => normalizeScopeRow(row)) : []);
    } catch (error) {
      setMessage(teacherGroupMessage || teacherMessage, error.message || "Failed to load scope.", "error");
      setDraft([]);
    }
    renderModalScopeDraft();
    classGroupDetailBody.querySelector("#modal-scope-add-btn")?.addEventListener("click", () => {
      const minDifficulty = String(classGroupDetailBody.querySelector("#modal-scope-min-difficulty")?.value || "").trim();
      const maxDifficulty = String(classGroupDetailBody.querySelector("#modal-scope-max-difficulty")?.value || "").trim();
      const topics = getSelectedValues(classGroupDetailBody.querySelector("#modal-scope-topics"));
      const subType = String(classGroupDetailBody.querySelector("#modal-scope-subtype")?.value || "").trim();
      const next = getDraft().slice();
      const result = addScopeRowsToDraft(next, minDifficulty, maxDifficulty, topics, subType);
      if (!result.ok) {
        setMessage(teacherGroupMessage || teacherMessage, result.message || "Invalid scope.", "error");
        return;
      }
      setDraft(next);
      classGroupDetailBody.querySelector("#modal-scope-subtype").value = "";
      classGroupDetailBody.querySelectorAll("#modal-scope-topics option").forEach((option) => {
        option.selected = false;
      });
      renderModalScopeDraft();
      setMessage(teacherGroupMessage || teacherMessage, "Scope item added. Click Save Scope to apply.", "success");
    });
    classGroupDetailBody.querySelector("#modal-scope-save-btn")?.addEventListener("click", async () => {
      try {
        const payload = getDraft()
          .map((row) => normalizeScopeRow(row))
          .filter((row) => row.max_difficulty && row.topic);
        if (kind === "class") {
          await api(`/api/teacher/classes/${encodeURIComponent(name)}/scope`, {
            method: "PUT",
            body: JSON.stringify({ scopes: payload })
          });
        } else {
          await api(`/api/teacher/groups/${encodeURIComponent(id)}/scope`, {
            method: "PUT",
            body: JSON.stringify({ scopes: payload })
          });
          await loadTeacherGroups();
        }
        setMessage(teacherGroupMessage || teacherMessage, "Scope saved.", "success");
      } catch (error) {
        setMessage(teacherGroupMessage || teacherMessage, error.message || "Failed to save scope.", "error");
      }
    });
    return;
  }
  if (tab === "status") {
    classGroupStatusFilters.student = "";
    classGroupStatusFilters.class_name = "";
    classGroupStatusFilters.status = "";
    classGroupStatusSort = { key: "student", dir: "asc" };
    classGroupDetailBody.innerHTML = `
      <div class="inline-tools">
        <select id="modal-status-topic" aria-label="Topic">
          <option value="">All topics</option>
          ${allScopeTopics.map((topic) => `<option value="${escapeHtml(topic)}">${escapeHtml(topic)}</option>`).join("")}
        </select>
        <select id="modal-status-subtype" aria-label="Sub-topic">
          <option value="">All sub-topics</option>
        </select>
        <button type="button" id="modal-load-status-btn">Load Status</button>
      </div>
      <div id="modal-status-table" class="table-wrap"></div>
    `;
    const topicSelect = classGroupDetailBody.querySelector("#modal-status-topic");
    const subTypeSelect = classGroupDetailBody.querySelector("#modal-status-subtype");
    const loadSubtopics = async () => {
      const topic = String(topicSelect?.value || "").trim();
      if (!subTypeSelect) return;
      subTypeSelect.innerHTML = `<option value="">All sub-topics</option>`;
      if (!topic) return;
      try {
        const data = await api(`/api/teacher/question-bank/subtopics?topic=${encodeURIComponent(topic)}`);
        const rows = Array.isArray(data.subtopics) ? data.subtopics : [];
        const subtypes = [...new Set(rows.map((row) => String(row.sub_type || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
        subTypeSelect.innerHTML = `<option value="">All sub-topics</option>${subtypes
          .map((subtype) => `<option value="${escapeHtml(subtype)}">${escapeHtml(subtype)}</option>`)
          .join("")}`;
      } catch (error) {
        subTypeSelect.innerHTML = `<option value="">Failed to load sub-topics</option>`;
        setMessage(teacherGroupMessage || teacherMessage, error.message || "Failed to load sub-topics.", "error");
      }
    };
    topicSelect?.addEventListener("change", loadSubtopics);
    classGroupDetailBody.querySelector("#modal-load-status-btn")?.addEventListener("click", async () => {
      const params = new URLSearchParams();
      const topic = String(topicSelect?.value || "").trim();
      const subType = String(subTypeSelect?.value || "").trim();
      if (!subType) {
        const target = classGroupDetailBody.querySelector("#modal-status-table");
        if (target) target.innerHTML = "<p>Please choose a sub-topic first to see the class/group status.</p>";
        return;
      }
      if (topic) params.set("topic", topic);
      if (subType) params.set("sub_type", subType);
      const data = await api(`/api/teacher/progress${params.toString() ? `?${params}` : ""}`);
      const target = classGroupDetailBody.querySelector("#modal-status-table");
      const progressByStudentId = new Map((data.students || []).map((s) => [String(s.user_id || ""), s]));
      const rows = students.map((student) => {
        const progressStudent = progressByStudentId.get(String(student.student_id || student.user_id || "")) || {};
        const flat = (progressStudent.topics || []).flatMap((t) => t.subtopics || []);
        const statusRow = flat.find((r) => String(r.sub_type || "") === subType) || flat[0] || null;
        return {
          student: String(student.full_name || progressStudent.full_name || "-"),
          class_name: String(student.class_name || progressStudent.class_name || "-"),
          status: statusRow ? String(statusRow.status || "-") : "-"
        };
      });
      renderClassGroupStatusTable(target, rows);
    });
    return;
  }
  classGroupDetailBody.innerHTML = `
    <div class="summary">
      <div class="stat"><strong>Average correct:</strong> ${itemValueForClassGroup(kind, id, "average_correct_percentage")}%</div>
      <div class="stat"><strong>Average questions done:</strong> ${itemValueForClassGroup(kind, id, "average_questions_done")}</div>
    </div>
    <p class="hint">Topic x Level stat uses the student table data currently loaded in the dashboard.</p>
  `;
}

function renderClassGroupStatusTable(target, rows) {
  if (!target) return;
  const tableRows = Array.isArray(rows) ? rows : [];
  if (!tableRows.length) {
    target.innerHTML = "<p>No matching student status found.</p>";
    return;
  }
  const columns = [
    ["student", "Student"],
    ["class_name", "Class"],
    ["status", "Status"]
  ];
  const optionHtmlFor = (key) => {
    const values = [...new Set(tableRows.map((row) => String(row[key] || "").trim()).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );
    return `<option value="">All</option>${values
      .map((value) => `<option value="${escapeHtml(value)}" ${String(classGroupStatusFilters[key] || "") === value ? "selected" : ""}>${escapeHtml(value)}</option>`)
      .join("")}`;
  };
  const filtered = tableRows.filter((row) =>
    columns.every(([key]) => {
      const filterValue = String(classGroupStatusFilters[key] || "").trim();
      if (!filterValue) return true;
      return String(row[key] || "").trim() === filterValue;
    })
  );
  const sorted = [...filtered].sort((a, b) => {
    const av = String(a[classGroupStatusSort.key] || "");
    const bv = String(b[classGroupStatusSort.key] || "");
    const cmp = av.localeCompare(bv, undefined, { numeric: true });
    return classGroupStatusSort.dir === "desc" ? -cmp : cmp;
  });
  target.innerHTML = `
    <table>
      <thead>
        <tr>
          ${columns
            .map(
              ([key, label]) =>
                `<th><button type="button" class="table-sort-btn" data-modal-status-sort="${key}">${escapeHtml(label)}${
                  classGroupStatusSort.key === key ? (classGroupStatusSort.dir === "asc" ? " ↑" : " ↓") : ""
                }</button></th>`
            )
            .join("")}
        </tr>
        <tr>
          ${columns.map(([key]) => `<th><select class="table-filter-input" data-modal-status-filter="${key}">${optionHtmlFor(key)}</select></th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${sorted
          .map(
            (row) => `
              <tr>
                <td>${escapeHtml(row.student)}</td>
                <td>${escapeHtml(row.class_name)}</td>
                <td>${escapeHtml(row.status).replace(/\n/g, "<br>")}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
  target.querySelectorAll("button[data-modal-status-sort]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = String(btn.getAttribute("data-modal-status-sort") || "");
      if (classGroupStatusSort.key === key) classGroupStatusSort.dir = classGroupStatusSort.dir === "asc" ? "desc" : "asc";
      else classGroupStatusSort = { key, dir: "asc" };
      renderClassGroupStatusTable(target, tableRows);
    });
  });
  target.querySelectorAll("select[data-modal-status-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      classGroupStatusFilters[String(select.getAttribute("data-modal-status-filter") || "")] = select.value;
      renderClassGroupStatusTable(target, tableRows);
    });
  });
}

function itemValueForClassGroup(kind, id, key) {
  const item = kind === "class" ? latestTeacherClasses.find((c) => String(c.name) === String(id)) : latestTeacherGroups.find((g) => String(g.id) === String(id));
  return item?.[key] || 0;
}

function renderClassGroupStudentPicker(kind, id, name) {
  const memberIds = new Set(
    kind === "group"
      ? (latestTeacherGroups.find((g) => String(g.id) === String(id))?.members || []).map((x) => String(x))
      : latestTeacherOverviewStudents.filter((s) => String(s.class_name || "") === String(name)).map((s) => String(s.student_id || ""))
  );
  const candidates = latestTeacherOverviewStudents.filter((s) => !memberIds.has(String(s.student_id || "")));
  const columns = [
    ["full_name", "Student"],
    ["class_name", "Class"],
    ["initial_test_level", "Initial Level"],
    ["questions_answered", "Done"],
    ["correct_percentage", "Correct %"]
  ];
  const optionHtmlFor = (key) => {
    const values = [...new Set(candidates.map((s) => String(s[key] ?? "").trim() || "-"))].sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );
    return `<option value="">All</option>${values
      .map((v) => `<option value="${escapeHtml(v)}" ${String(classGroupStudentPickerFilters[key] || "") === v ? "selected" : ""}>${escapeHtml(v)}</option>`)
      .join("")}`;
  };
  const filtered = candidates.filter((s) =>
    columns.every(([key]) => {
      const value = String(classGroupStudentPickerFilters[key] || "").trim();
      if (!value) return true;
      return String(s[key] ?? "").trim() === value;
    })
  );
  const filteredIds = filtered.map((s) => String(s.student_id || "")).filter(Boolean);
  const allFilteredSelected = filteredIds.length > 0 && filteredIds.every((sid) => classGroupStudentPickerSelected.has(sid));
  const sorted = [...filtered].sort((a, b) => {
    const av = a[classGroupStudentPickerSort.key];
    const bv = b[classGroupStudentPickerSort.key];
    const an = Number(av);
    const bn = Number(bv);
    const cmp = Number.isFinite(an) && Number.isFinite(bn) ? an - bn : String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true });
    return classGroupStudentPickerSort.dir === "desc" ? -cmp : cmp;
  });
  classGroupDetailBody.innerHTML = `
    <div class="top-row">
      <h4>Add student</h4>
      <div class="inline-tools">
        <button type="button" id="picker-add-selected-btn">Add selected</button>
        <button type="button" class="secondary" id="picker-back-btn">Back</button>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th><label class="compact-check"><input type="checkbox" id="picker-select-all" ${allFilteredSelected ? "checked" : ""} /> Select all</label></th>${columns
            .map(([key, label]) => `<th><button type="button" class="table-sort-btn" data-picker-sort="${key}">${escapeHtml(label)}${classGroupStudentPickerSort.key === key ? (classGroupStudentPickerSort.dir === "asc" ? " ↑" : " ↓") : ""}</button></th>`)
            .join("")}</tr>
          <tr><th></th>${columns
            .map(([key]) => `<th><select class="table-filter-input" data-picker-filter="${key}">${optionHtmlFor(key)}</select></th>`)
            .join("")}</tr>
        </thead>
        <tbody>
          ${sorted
            .map(
              (s) => `
              <tr>
                <td><input type="checkbox" data-picker-student="${escapeHtml(s.student_id)}" ${classGroupStudentPickerSelected.has(String(s.student_id || "")) ? "checked" : ""} /></td>
                <td>${escapeHtml(s.full_name || "-")}</td>
                <td>${escapeHtml(s.class_name || "-")}</td>
                <td>${escapeHtml(s.initial_test_level || "-")}</td>
                <td>${s.questions_answered || 0}</td>
                <td>${s.correct_percentage || 0}%</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
  classGroupDetailBody.querySelectorAll("input[data-picker-student]").forEach((input) => {
    input.addEventListener("change", () => {
      const sid = String(input.getAttribute("data-picker-student") || "");
      if (input.checked) classGroupStudentPickerSelected.add(sid);
      else classGroupStudentPickerSelected.delete(sid);
    });
  });
  classGroupDetailBody.querySelector("#picker-select-all")?.addEventListener("change", (event) => {
    const checked = Boolean(event.currentTarget.checked);
    filteredIds.forEach((sid) => {
      if (checked) classGroupStudentPickerSelected.add(sid);
      else classGroupStudentPickerSelected.delete(sid);
    });
    renderClassGroupStudentPicker(kind, id, name);
  });
  classGroupDetailBody.querySelectorAll("button[data-picker-sort]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = String(btn.getAttribute("data-picker-sort") || "");
      if (classGroupStudentPickerSort.key === key) classGroupStudentPickerSort.dir = classGroupStudentPickerSort.dir === "asc" ? "desc" : "asc";
      else classGroupStudentPickerSort = { key, dir: "asc" };
      renderClassGroupStudentPicker(kind, id, name);
    });
  });
  classGroupDetailBody.querySelectorAll("select[data-picker-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      classGroupStudentPickerFilters[String(select.getAttribute("data-picker-filter") || "")] = select.value;
      renderClassGroupStudentPicker(kind, id, name);
    });
  });
  classGroupDetailBody.querySelector("#picker-back-btn")?.addEventListener("click", async () => renderClassGroupTab("students"));
  classGroupDetailBody.querySelector("#picker-add-selected-btn")?.addEventListener("click", async () => {
    const studentIds = [...classGroupStudentPickerSelected].filter(Boolean);
    if (!studentIds.length) {
      setMessage(teacherGroupMessage || teacherMessage, "Please select at least one student.", "error");
      return;
    }
    if (kind === "class") {
      const result = await api("/api/teacher/students/class", {
        method: "PUT",
        body: JSON.stringify({ student_ids: studentIds, class_name: name })
      });
      if (Number(result.updated || 0) !== studentIds.length) {
        setMessage(teacherGroupMessage || teacherMessage, "Class was not saved for every selected student. Please refresh and try again.", "error");
        return;
      }
    } else {
      await api(`/api/teacher/groups/${encodeURIComponent(id)}/add-students`, {
        method: "POST",
        body: JSON.stringify({ student_ids: studentIds })
      });
    }
    classGroupStudentPickerSelected.clear();
    await loadTeacherOverview();
    await loadTeacherGroups();
    await renderClassGroupTab("students");
    setMessage(teacherGroupMessage || teacherMessage, kind === "class" ? "Class saved to selected student(s)." : "Student(s) added to group.", "success");
  });
}

async function loadTeacherAlerts() {
  if (!teacherAlertList) return;
  const data = await api("/api/teacher/alerts").catch(() => ({ alerts: [] }));
  const alerts = Array.isArray(data.alerts) ? data.alerts : [];
  const active = alerts.filter((a) => !a.is_resolved);
  const resolved = alerts.filter((a) => a.is_resolved);
  const renderRows = (items) =>
    items
      .map((a) => {
        const profile = a.user_profiles || {};
        return `
          <tr class="${a.is_resolved ? "alert-resolved-row" : "alert-open-row"}">
            <td><button type="button" class="student-link" data-profile-student="${escapeHtml(a.student_id)}">${escapeHtml(profile.full_name || "Student")}</button></td>
            <td>${escapeHtml(profile.class_name || "-")}</td>
            <td>${escapeHtml(a.sub_type || "-")}</td>
            <td>${escapeHtml(a.topic || "-")}</td>
            <td><button type="button" class="secondary" data-view-alert-wrong="${escapeHtml(a.id)}">View wrong answers</button></td>
            <td>${a.is_resolved ? "Resolved" : `<button type="button" data-resolve-alert="${escapeHtml(a.id)}">Resolved</button>`}</td>
          </tr>
        `;
      })
      .join("");
  teacherAlertList.innerHTML = alerts.length
    ? `
      <div class="table-wrap">
        <table>
          <thead><tr><th>Student</th><th>Class</th><th>Sub-topic</th><th>Topic</th><th>Wrong answers</th><th>Action</th></tr></thead>
          <tbody>${renderRows(active)}</tbody>
        </table>
      </div>
      <div class="section-title-row"><h4>Archived Alerts</h4></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Student</th><th>Class</th><th>Sub-topic</th><th>Topic</th><th>Wrong answers</th><th>Status</th></tr></thead>
          <tbody>${renderRows(resolved)}</tbody>
        </table>
      </div>
    `
    : "<p>No open learning alerts.</p>";
  teacherAlertList.querySelectorAll("button[data-profile-student]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const studentId = String(btn.getAttribute("data-profile-student") || "");
      if (!studentId) return;
      teacherStudentBackTarget = "alert";
      await openTeacherStudentPage(studentId);
    });
  });
  teacherAlertList.querySelectorAll("button[data-view-alert-wrong]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await showAlertWrongAnswers(String(btn.getAttribute("data-view-alert-wrong") || ""));
    });
  });
  teacherAlertList.querySelectorAll("button[data-resolve-alert]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = String(btn.getAttribute("data-resolve-alert") || "");
      if (!id) return;
      await api(`/api/teacher/alerts/${encodeURIComponent(id)}/resolve`, { method: "POST" });
      await loadTeacherAlerts();
      await loadTeacherOverview();
    });
  });
}

async function showAlertWrongAnswers(alertId) {
  if (!alertWrongDialog || !alertWrongBody || !alertId) return;
  teacherStatusReturnContext = null;
  if (alertWrongBackBtn) alertWrongBackBtn.hidden = true;
  const data = await api(`/api/teacher/alerts/${encodeURIComponent(alertId)}/wrong-answers`);
  const alert = data.alert || {};
  const profile = alert.user_profiles || {};
  if (alertWrongTitle) alertWrongTitle.textContent = `${profile.full_name || "Student"} - ${alert.sub_type || "Wrong Answers"}`;
  const records = Array.isArray(data.records) ? data.records : [];
  alertWrongBody.innerHTML = records.length
    ? records
        .map((row) => {
          const q = row.problems || {};
          return `
            <article class="question-card is-wrong">
              <div class="question-head"><strong>${escapeHtml(row.assignment_date || "-")}</strong></div>
              <div class="question-body" id="alert-wrong-q-${escapeHtml(row.id)}"></div>
              <div class="summary">
                <div class="stat"><strong>Answered at:</strong> ${escapeHtml(formatDateTime(row.submitted_at || row.assignment_date || "-"))}</div>
                <div class="stat"><strong>Answer time:</strong> ${formatSeconds(row.time_spent_seconds)}</div>
                <div class="stat"><strong>Student answer:</strong> ${escapeHtml(row.answer_text || "-")}</div>
                <div class="stat"><strong>Correct answer:</strong> ${escapeHtml(q.answer_text || "-")}</div>
              </div>
            </article>
          `;
        })
        .join("")
    : "<p>No wrong answers found for this alert.</p>";
  for (const row of records) {
    const body = alertWrongBody.querySelector(`#alert-wrong-q-${cssEscape(String(row.id))}`);
    if (body) renderQuestionBody(body, row.problems?.latex_code || "", { multiline: true });
  }
  await typeset(alertWrongBody);
  if (typeof alertWrongDialog.showModal === "function") alertWrongDialog.showModal();
  else alertWrongDialog.setAttribute("open", "open");
}

async function loadTeacherStatusTable() {
  if (!teacherStatusTable) return;
  const params = new URLSearchParams();
  if (teacherStatusClassInput?.value.trim()) params.set("class_name", teacherStatusClassInput.value.trim());
  if (teacherStatusTopicInput?.value.trim()) params.set("topic", teacherStatusTopicInput.value.trim());
  if (teacherStatusSubtypeInput?.value.trim()) params.set("sub_type", teacherStatusSubtypeInput.value.trim());
  const data = await api(`/api/teacher/progress${params.toString() ? `?${params}` : ""}`);
  latestTeacherProgressStudents = Array.isArray(data.students) ? data.students : [];
  if (!latestTeacherProgressStudents.length) {
    teacherStatusTable.innerHTML = "<p>No matching student status found.</p>";
    return;
  }
  const rows = latestTeacherProgressStudents
    .map((student) => {
      const flat = (student.topics || []).flatMap((t) => t.subtopics || []);
      const cells = flat.length
        ? flat.map((r) => `${escapeHtml(r.topic)} / ${escapeHtml(r.sub_type)}: <strong>${escapeHtml(r.status)}</strong>`).join("<br>")
        : "-";
      return `<tr><td>${escapeHtml(student.full_name || "-")}</td><td>${escapeHtml(student.class_name || "-")}</td><td>${cells}</td></tr>`;
    })
    .join("");
  teacherStatusTable.innerHTML = `
    <table>
      <thead><tr><th>Student</th><th>Class</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function addScopeRowsToDraft(draft, minDifficulty, maxDifficulty, topics, subType) {
  if (!maxDifficulty || !topics.length) return { ok: false, message: "Scope needs Max Lv and at least one topic." };
  const minIdx = minDifficulty ? difficultyOrder.indexOf(minDifficulty) : 0;
  const maxIdx = difficultyOrder.indexOf(maxDifficulty);
  if (maxIdx < 0 || minIdx < 0 || minIdx > maxIdx) {
    return { ok: false, message: "Min Lv must be lower than or equal to Max Lv." };
  }
  for (const topic of topics) {
    const row = normalizeScopeRow({
      min_difficulty: minDifficulty || difficultyOrder[0] || "lv2",
      max_difficulty: maxDifficulty,
      topic,
      sub_type: subType
    });
    const key = `${row.min_difficulty}|||${row.max_difficulty}|||${row.topic}|||${row.sub_type}`;
    const exists = draft.some(
      (x) => `${x.min_difficulty || ""}|||${x.max_difficulty || x.difficulty || ""}|||${x.topic}|||${x.sub_type}` === key
    );
    if (!exists) draft.push(row);
  }
  return { ok: true };
}

async function loadClassScope() {
  const className = String(teacherClassScopeName?.value || "").trim();
  if (!className) {
    setMessage(teacherMessage, "Please enter a class name first.", "error");
    return;
  }
  const data = await api(`/api/teacher/classes/${encodeURIComponent(className)}/scope`);
  classScopeDraft = Array.isArray(data.scope_rules) ? data.scope_rules.map((row) => normalizeScopeRow(row)) : [];
  renderClassScopeDraft();
  setMessage(teacherMessage, `Loaded scope for class ${className}.`, "success");
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
            <span class="badge">${escapeHtml(m.class_name || "-")}</span>
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
  currentTeacherPage = "dashboard";
  if (teacherMainTitle) teacherMainTitle.textContent = "Teacher - Student";
  if (teacherView) teacherView.hidden = false;
  if (teacherBatchPage) teacherBatchPage.hidden = true;
  if (teacherGroupPage) teacherGroupPage.hidden = true;
  if (teacherStudentPage) teacherStudentPage.hidden = true;
  if (teacherStudentTools) teacherStudentTools.hidden = true;
  if (teacherStudentTabContent) teacherStudentTabContent.hidden = false;
  if (teacherAlertTabContent) teacherAlertTabContent.hidden = true;
  if (teacherStatusTabContent) teacherStatusTabContent.hidden = true;
  if (teacherClassScopeTabContent) teacherClassScopeTabContent.hidden = true;
  [teacherDashboardLink, teacherDashboardLink2, teacherDashboardLink3].forEach((el) => el && el.classList.add("active"));
  [teacherBatchLink, teacherBatchLink2, teacherBatchLink3].forEach((el) => el && el.classList.remove("active"));
  [teacherGroupsLink, teacherGroupsLink2, teacherGroupsLink3].forEach((el) => el && el.classList.remove("active"));
  if (!teacherTableWrap?.innerHTML.trim() && latestTeacherOverviewStudents.length) {
    renderTeacherTable(latestTeacherOverviewStudents);
  }
}

function showTeacherAlertPage() {
  saveTeacherPagePreference("alert");
  currentTeacherPage = "alert";
  if (teacherMainTitle) teacherMainTitle.textContent = "Teacher - Alert";
  if (teacherView) teacherView.hidden = false;
  if (teacherBatchPage) teacherBatchPage.hidden = true;
  if (teacherGroupPage) teacherGroupPage.hidden = true;
  if (teacherStudentPage) teacherStudentPage.hidden = true;
  if (teacherStudentTools) teacherStudentTools.hidden = true;
  if (teacherStudentTabContent) teacherStudentTabContent.hidden = true;
  if (teacherAlertTabContent) teacherAlertTabContent.hidden = false;
  if (teacherStatusTabContent) teacherStatusTabContent.hidden = true;
  if (teacherClassScopeTabContent) teacherClassScopeTabContent.hidden = true;
  [teacherDashboardLink, teacherDashboardLink2, teacherDashboardLink3].forEach((el) => el && el.classList.remove("active"));
  [teacherBatchLink, teacherBatchLink2, teacherBatchLink3].forEach((el) => el && el.classList.add("active"));
  [teacherGroupsLink, teacherGroupsLink2, teacherGroupsLink3].forEach((el) => el && el.classList.remove("active"));
}

function showTeacherStudentPage() {
  saveTeacherPagePreference("student_profile");
  currentTeacherPage = "student_profile";
  if (teacherView) teacherView.hidden = true;
  if (teacherBatchPage) teacherBatchPage.hidden = true;
  if (teacherGroupPage) teacherGroupPage.hidden = true;
  if (teacherStudentPage) teacherStudentPage.hidden = false;
}

function showTeacherGroupPage() {
  saveTeacherPagePreference("groups");
  currentTeacherPage = "groups";
  if (teacherView) teacherView.hidden = true;
  if (teacherBatchPage) teacherBatchPage.hidden = true;
  if (teacherGroupPage) teacherGroupPage.hidden = false;
  if (teacherStudentPage) teacherStudentPage.hidden = true;
  if (teacherStudentTools) teacherStudentTools.hidden = true;
  [teacherDashboardLink, teacherDashboardLink2, teacherDashboardLink3].forEach((el) => el && el.classList.remove("active"));
  [teacherBatchLink, teacherBatchLink2, teacherBatchLink3].forEach((el) => el && el.classList.remove("active"));
  [teacherGroupsLink, teacherGroupsLink2, teacherGroupsLink3].forEach((el) => el && el.classList.add("active"));
}

function showTeacherBatchPage() {
  showTeacherAlertPage();
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
  saveTeacherProfileStudentId(studentId);
  const [statsData, groupsData, allGroups, progressData] = await Promise.all([
    api(`/api/teacher/students/${encodeURIComponent(studentId)}/stats`),
    api(`/api/teacher/students/${encodeURIComponent(studentId)}/groups`),
    api("/api/teacher/groups"),
    api(`/api/teacher/progress?class_name=&topic=&sub_type=`).catch(() => ({ students: [] }))
  ]);
  const student = statsData.student || {};
  const stats = statsData.stats || {};
  const records = Array.isArray(statsData.records) ? statsData.records : [];
  const selectedGroupIds = new Set((groupsData || []).map((g) => Number(g.group_id)));
  const progressStudent = (progressData.students || []).find((s) => String(s.user_id || "") === String(studentId)) || {};
  const progressTopics = Array.isArray(progressStudent.topics) ? progressStudent.topics : [];
  teacherStudentViewData = { student, stats, records, selectedGroupIds, allGroups, progressTopics };

  if (teacherStudentPageTitle) {
    teacherStudentPageTitle.textContent = `Student Profile: ${student.full_name || "Student"}`;
  }
  if (teacherStudentPageStats) {
    teacherStudentPageStats.innerHTML = "";
    if (teacherStudentClassTitles) {
      teacherStudentClassTitles.innerHTML = "";
    }
    renderRadarChart(teacherStudentRadarWrap, statsData, { student: "Student", classAvg: "Class Avg" });
  }

  renderTeacherStatusTopicMatrix(teacherStudentTopicLvMatrix, records, difficultyOrder, progressTopics);

  populateTopicFilter(teacherStudentFilterTopic, records, teacherStudentFilterTopic?.value || "");
  await applyTeacherStudentFilters();
  showTeacherStudentPage();
}

async function loadTeacherOverview() {
  const date = teacherOverviewDate || teacherDate?.value || today();
  teacherOverviewDate = date;
  const groupId = String(teacherDashboardGroupSelect?.value || "").trim();
  if (teacherDate) teacherDate.value = date;
  setMessage(teacherMessage, "");

  const qs = new URLSearchParams();
  qs.set("date", date);
  if (groupId) qs.set("group_id", groupId);
  const data = await api(`/api/teacher/overview?${qs.toString()}`);
  const students = Array.isArray(data.students) ? data.students : [];
  latestTeacherOverviewStudents = students;

  if (teacherSummary) teacherSummary.innerHTML = "";

  renderTeacherTable(students);
  renderTeacherBatchTable(students);
  await loadTeacherAlerts();
  try {
    await loadTeacherGroups();
  } catch (_error) {
    // Group tables may be unavailable before DB migration; keep overview usable.
  }
  setMessage(teacherMessage, "");
}

async function refreshAuthState() {
  if (!supabase?.auth) return;
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
  if (initPromise) return initPromise;
  initPromise = initInternal();
  return initPromise;
}

async function initInternal() {
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
    if (signupForm) {
      signupForm.hidden = clientConfig.signup_disabled !== false;
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
      if (teacherClassScopeMinDifficulty) {
        teacherClassScopeMinDifficulty.innerHTML = `<option value="">Min Lv</option>${difficulties
          .map((x) => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`)
          .join("")}`;
      }
      if (teacherClassScopeMaxDifficulty) {
        teacherClassScopeMaxDifficulty.innerHTML = `<option value="">Max Lv</option>${difficulties
          .map((x) => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`)
          .join("")}`;
      }
    }

    if (teacherDate) teacherDate.value = today();

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

async function ensureSupabaseReady() {
  if (supabase?.auth) return true;
  await init();
  if (supabase?.auth) return true;
  setMessage(authMessage, "Login is still loading. Please wait a moment and try again.", "error");
  return false;
}

function parseAdminAccountBatch(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const parts = line.split(/\t|,/).map((part) => part.trim());
      return {
        role: parts[0] || "student",
        email: parts[1] || "",
        password: parts[2] || "",
        full_name: parts[3] || "",
        class_name: parts[4] || ""
      };
    });
}

function renderAdminAccountResults(results) {
  if (!adminAccountResults) return;
  const rows = Array.isArray(results) ? results : [];
  if (!rows.length) {
    adminAccountResults.innerHTML = "";
    return;
  }
  adminAccountResults.innerHTML = `
    <table class="matrix-table">
      <thead>
        <tr>
          <th>Email</th>
          <th>Role</th>
          <th>Class</th>
          <th>Status</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
              <tr class="${row.ok ? "resolved-row" : "alert-row"}">
                <td>${escapeHtml(row.email || "")}</td>
                <td>${escapeHtml(row.role || "")}</td>
                <td>${escapeHtml(row.class_name || "")}</td>
                <td>${row.ok ? "Created" : "Failed"}</td>
                <td>${escapeHtml(row.error || row.user_id || "")}</td>
              </tr>`
          )
          .join("")}
      </tbody>
    </table>`;
}

function renderAdminAccounts(accounts) {
  if (!adminAccountListWrap) return;
  latestAdminAccounts = Array.isArray(accounts) ? accounts : latestAdminAccounts;
  const rows = latestAdminAccounts.filter(adminAccountMatchesFilters);
  const roleFilterOptions = ["", "student", "teacher", "admin"]
    .map((role) => `<option value="${role}" ${adminAccountFilters.role === role ? "selected" : ""}>${role || "All"}</option>`)
    .join("");
  const adminFilterSelectOptions = (field) => {
    const values = [...new Set(latestAdminAccounts.map((account) => String(account?.[field] || "").trim()).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, "en", { numeric: true, sensitivity: "base" })
    );
    return `<option value="">All</option>${values
      .map((value) => `<option value="${escapeHtml(value)}" ${adminAccountFilters[field] === value ? "selected" : ""}>${escapeHtml(value)}</option>`)
      .join("")}`;
  };
  adminAccountListWrap.innerHTML = `
    <table class="matrix-table admin-account-table">
      <thead>
        <tr>
          <th>Select<br /><label class="inline-check"><input id="admin-account-select-all" type="checkbox" />All</label></th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Grade</th>
          <th>Class</th>
          <th>Action</th>
        </tr>
        <tr>
          <th></th>
          <th><input class="table-filter-input admin-account-filter" data-admin-account-filter="full_name" value="${escapeHtml(adminAccountFilters.full_name)}" placeholder="Filter" /></th>
          <th><input class="table-filter-input admin-account-filter" data-admin-account-filter="email" value="${escapeHtml(adminAccountFilters.email)}" placeholder="Filter" /></th>
          <th><select class="table-filter-input admin-account-filter" data-admin-account-filter="role">${roleFilterOptions}</select></th>
          <th><select class="table-filter-input admin-account-filter" data-admin-account-filter="grade">${adminFilterSelectOptions("grade")}</select></th>
          <th><select class="table-filter-input admin-account-filter" data-admin-account-filter="class_name">${adminFilterSelectOptions("class_name")}</select></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${
          rows.length
            ? rows
                .map((account) => {
                  const userId = String(account.user_id || "");
                  const isSelf = userId && String(me?.user_id || "") === userId;
                  return `
              <tr data-admin-account-row="${escapeHtml(userId)}">
                <td><input type="checkbox" class="admin-account-select" data-admin-account-select="${escapeHtml(userId)}" ${isSelf ? "disabled" : ""} /></td>
                <td><input class="table-filter-input" data-admin-account-field="full_name" value="${escapeHtml(account.full_name || "")}" /></td>
                <td>${escapeHtml(account.email || "-")}</td>
                <td>
                  <select class="table-filter-input" data-admin-account-field="role">
                    ${["student", "teacher", "admin"].map((role) => `<option value="${role}" ${account.role === role ? "selected" : ""}>${role}</option>`).join("")}
                  </select>
                </td>
                <td><input class="table-filter-input" data-admin-account-field="grade" value="${escapeHtml(account.grade || "")}" /></td>
                <td><input class="table-filter-input" data-admin-account-field="class_name" value="${escapeHtml(account.class_name || "")}" /></td>
                <td>
                  <input class="table-filter-input admin-row-password" type="password" data-admin-account-field="password" placeholder="New password" />
                  <button type="button" data-admin-save-account="${escapeHtml(userId)}">Save</button>
                  <button type="button" class="secondary" data-admin-delete-account="${escapeHtml(userId)}" ${isSelf ? "disabled" : ""}>
                    Delete
                  </button>
                </td>
              </tr>`;
                })
                .join("")
            : `<tr><td colspan="7" class="hint">No accounts match the current filters.</td></tr>`
        }
      </tbody>
    </table>`;

  const selectAll = adminAccountListWrap.querySelector("#admin-account-select-all");
  if (selectAll) {
    selectAll.addEventListener("change", () => {
      adminAccountListWrap.querySelectorAll(".admin-account-select:not(:disabled)").forEach((input) => {
        input.checked = selectAll.checked;
      });
    });
  }

  adminAccountListWrap.querySelectorAll(".admin-account-filter").forEach((input) => {
    input.addEventListener("input", () => {
      const field = input.getAttribute("data-admin-account-filter");
      if (!field) return;
      adminAccountFilters[field] = input.value || "";
      renderAdminAccounts(latestAdminAccounts);
    });
    input.addEventListener("change", () => {
      const field = input.getAttribute("data-admin-account-filter");
      if (!field) return;
      adminAccountFilters[field] = input.value || "";
      renderAdminAccounts(latestAdminAccounts);
    });
  });

  adminAccountListWrap.querySelectorAll("[data-admin-save-account]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const userId = String(btn.getAttribute("data-admin-save-account") || "");
      const rowEl = adminAccountListWrap.querySelector(`[data-admin-account-row="${cssEscape(userId)}"]`);
      if (!userId || !rowEl) return;
      const payload = {
        full_name: rowEl.querySelector('[data-admin-account-field="full_name"]')?.value || "",
        role: rowEl.querySelector('[data-admin-account-field="role"]')?.value || "",
        grade: rowEl.querySelector('[data-admin-account-field="grade"]')?.value || "",
        class_name: rowEl.querySelector('[data-admin-account-field="class_name"]')?.value || "",
        password: rowEl.querySelector('[data-admin-account-field="password"]')?.value || ""
      };
      btn.disabled = true;
      setMessage(adminAccountListMessage, "Updating account...");
      try {
        await api(`/api/admin/accounts/${encodeURIComponent(userId)}`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
        setMessage(adminAccountListMessage, "Update completed.", "success");
        await loadAdminAccounts({ keepMessage: true });
        await loadAdminClassTeacherAssignments().catch(() => {});
      } catch (error) {
        btn.disabled = false;
        const message = /404/.test(String(error.message || ""))
          ? "The account edit API is not available on the running server yet. Restart the local server or redeploy Render, then refresh this page."
          : error.message || "Failed to save account.";
        setMessage(adminAccountListMessage, message, "error");
      }
    });
  });

  adminAccountListWrap.querySelectorAll("[data-admin-delete-account]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const userId = String(btn.getAttribute("data-admin-delete-account") || "");
      const row = rows.find((account) => String(account.user_id || "") === userId);
      if (!userId || !row) return;
      const label = row.full_name || row.email || "this account";
      if (!window.confirm(`Delete ${label}? This removes the login account and related profile data.`)) return;
      btn.disabled = true;
      setMessage(adminAccountListMessage, "Deleting account...");
      try {
        await api(`/api/admin/accounts/${encodeURIComponent(userId)}`, { method: "DELETE" });
        setMessage(adminAccountListMessage, `Deleted ${label}.`, "success");
        await loadAdminAccounts();
        await loadAdminClassTeacherAssignments().catch(() => {});
      } catch (error) {
        btn.disabled = false;
        setMessage(adminAccountListMessage, error.message || "Failed to delete account.", "error");
      }
    });
  });
}

async function loadAdminAccounts(options = {}) {
  if (!adminAccountListWrap) return;
  if (!options.keepMessage) setMessage(adminAccountListMessage, "Loading accounts...");
  let data;
  try {
    data = await api("/api/admin/accounts");
  } catch (error) {
    if (/404/.test(String(error.message || ""))) {
      throw new Error("The admin account list API is not available on the running server yet. Restart the local server or redeploy Render, then refresh this page.");
    }
    throw error;
  }
  renderAdminAccounts(data.accounts || []);
  if (!options.keepMessage) setMessage(adminAccountListMessage, `Loaded ${(data.accounts || []).length} account(s).`, "success");
}

let latestAdminClassTeacherPayload = { teachers: [], classes: [], assignments: [] };
let latestAdminAccounts = [];
let adminAccountFilters = { full_name: "", email: "", role: "", grade: "", class_name: "" };

function adminAccountMatchesFilters(account) {
  const checks = {
    full_name: String(account.full_name || ""),
    email: String(account.email || ""),
    role: String(account.role || ""),
    grade: String(account.grade || ""),
    class_name: String(account.class_name || "")
  };
  return Object.entries(adminAccountFilters).every(([key, value]) => {
    const needle = String(value || "").trim().toLowerCase();
    if (!needle) return true;
    return checks[key].toLowerCase().includes(needle);
  });
}

function renderAdminClassTeacherAssignments(payload) {
  latestAdminClassTeacherPayload = payload || { teachers: [], classes: [], assignments: [] };
  if (!adminClassTeacherWrap) return;
  const teachers = Array.isArray(payload?.teachers) ? payload.teachers : [];
  const classes = Array.isArray(payload?.classes) ? payload.classes : [];
  const assignedByClass = new Map(
    (Array.isArray(payload?.assignments) ? payload.assignments : []).map((row) => [
      String(row.class_name || ""),
      String(row.teacher_id || "")
    ])
  );
  if (!classes.length) {
    adminClassTeacherWrap.innerHTML = `<p class="hint">No student classes found yet.</p>`;
    return;
  }
  const teacherOptions = (selectedId) =>
    `<option value="">No teacher</option>${teachers
      .map((teacher) => {
        const id = String(teacher.user_id || "");
        const label = `${teacher.full_name || teacher.email || id}${teacher.email ? ` (${teacher.email})` : ""}`;
        return `<option value="${escapeHtml(id)}" ${id === selectedId ? "selected" : ""}>${escapeHtml(label)}</option>`;
      })
      .join("")}`;
  adminClassTeacherWrap.innerHTML = `
    <table class="matrix-table">
      <thead>
        <tr>
          <th>Class</th>
          <th>Subject teacher</th>
        </tr>
      </thead>
      <tbody>
        ${classes
          .map((className) => {
            const selected = assignedByClass.get(String(className || "")) || "";
            return `
              <tr>
                <td>${escapeHtml(className)}</td>
                <td>
                  <select class="admin-class-teacher-select" data-class-name="${escapeHtml(className)}">
                    ${teacherOptions(selected)}
                  </select>
                </td>
              </tr>`;
          })
          .join("")}
      </tbody>
    </table>`;
}

async function loadAdminClassTeacherAssignments() {
  if (!adminClassTeacherWrap) return;
  setMessage(adminClassTeacherMessage, "Loading class teacher settings...");
  let data;
  try {
    data = await api("/api/admin/teacher-class-assignments");
  } catch (error) {
    if (/404/.test(String(error.message || ""))) {
      throw new Error("The admin class-teacher API is not available on the running server yet. Restart the local server or redeploy Render, then refresh this page.");
    }
    throw error;
  }
  renderAdminClassTeacherAssignments(data);
  setMessage(adminClassTeacherMessage, "Class teacher settings loaded.", "success");
}

async function saveAdminClassTeacherAssignments() {
  const assignments = [...document.querySelectorAll(".admin-class-teacher-select")]
    .map((select) => ({
      class_name: select.getAttribute("data-class-name") || "",
      teacher_id: select.value || ""
    }))
    .filter((row) => row.class_name && row.teacher_id);
  setMessage(adminClassTeacherMessage, "Saving class teacher settings...");
  let data;
  try {
    data = await api("/api/admin/teacher-class-assignments", {
      method: "PUT",
      body: JSON.stringify({ assignments })
    });
  } catch (error) {
    if (/404/.test(String(error.message || ""))) {
      throw new Error("The admin class-teacher API is not available on the running server yet. Restart the local server or redeploy Render, then refresh this page.");
    }
    throw error;
  }
  setMessage(adminClassTeacherMessage, `Saved ${data.saved || 0} class teacher assignment(s).`, "success");
  await loadAdminClassTeacherAssignments();
}

if (adminLoadClassTeachersBtn) {
  adminLoadClassTeachersBtn.addEventListener("click", () => {
    loadAdminClassTeacherAssignments().catch((error) => setMessage(adminClassTeacherMessage, error.message || "Failed to load.", "error"));
  });
}

if (adminLoadAccountsBtn) {
  adminLoadAccountsBtn.addEventListener("click", () => {
    loadAdminAccounts().catch((error) => setMessage(adminAccountListMessage, error.message || "Failed to load accounts.", "error"));
  });
}

if (adminBatchUpdateAccountsBtn) {
  adminBatchUpdateAccountsBtn.addEventListener("click", async () => {
    const userIds = [...document.querySelectorAll(".admin-account-select:checked")]
      .map((input) => String(input.getAttribute("data-admin-account-select") || ""))
      .filter(Boolean);
    if (!userIds.length) {
      setMessage(adminAccountListMessage, "Select at least one account.", "error");
      return;
    }
    const payload = {
      user_ids: userIds
    };
    if (adminBatchAccountRole?.value) payload.role = adminBatchAccountRole.value;
    if (adminBatchAccountGrade?.value.trim()) payload.grade = adminBatchAccountGrade.value.trim();
    if (adminBatchAccountClass?.value.trim()) payload.class_name = adminBatchAccountClass.value.trim();
    if (adminBatchAccountPassword?.value.trim()) payload.password = adminBatchAccountPassword.value.trim();
    if (!payload.role && !payload.grade && !payload.class_name && !payload.password) {
      setMessage(adminAccountListMessage, "Type at least one new value for batch update.", "error");
      return;
    }
    const confirmText = `Update ${userIds.length} selected account(s)?`;
    if (!window.confirm(confirmText)) return;
    adminBatchUpdateAccountsBtn.disabled = true;
    setMessage(adminAccountListMessage, "Updating selected accounts...");
    try {
      const data = await api("/api/admin/accounts/batch", {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
      setMessage(adminAccountListMessage, `Updated ${data.updated || 0}. Failed ${data.failed || 0}.`, data.failed ? "error" : "success");
      if (adminBatchAccountPassword) adminBatchAccountPassword.value = "";
      await loadAdminAccounts({ keepMessage: true });
      await loadAdminClassTeacherAssignments().catch(() => {});
    } catch (error) {
      const message = /404/.test(String(error.message || ""))
        ? "The batch account edit API is not available on the running server yet. Restart the local server or redeploy Render, then refresh this page."
        : error.message || "Failed to update selected accounts.";
      setMessage(adminAccountListMessage, message, "error");
    } finally {
      adminBatchUpdateAccountsBtn.disabled = false;
    }
  });
}

if (adminSaveClassTeachersBtn) {
  adminSaveClassTeachersBtn.addEventListener("click", () => {
    saveAdminClassTeacherAssignments().catch((error) => setMessage(adminClassTeacherMessage, error.message || "Failed to save.", "error"));
  });
}

if (adminCreateAccountsBtn) {
  adminCreateAccountsBtn.addEventListener("click", async () => {
    const accounts = parseAdminAccountBatch(adminAccountBatchInput?.value || "");
    if (!accounts.length) {
      setMessage(adminMessage, "Paste at least one account row.", "error");
      return;
    }
    setMessage(adminMessage, "Creating accounts...");
    try {
      const data = await api("/api/admin/accounts/batch", {
        method: "POST",
        body: JSON.stringify({ accounts })
      });
      renderAdminAccountResults(data.results || []);
      setMessage(adminMessage, `Created ${data.created || 0}. Failed ${data.failed || 0}.`, data.failed ? "error" : "success");
      await loadAdminAccounts().catch(() => {});
    } catch (error) {
      setMessage(adminMessage, error.message || "Failed to create accounts.", "error");
    }
  });
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
  if (!(await ensureSupabaseReady())) return;
  const typedEmail = normalizeEmail(loginEmail.value);

  try {
    const emailCheck = await api("/api/auth/check-email", {
      method: "POST",
      body: JSON.stringify({ email: typedEmail })
    });
    if (!emailCheck.exists) {
      setMessage(authMessage, "Incorrect Email", "error");
      return;
    }
  } catch (error) {
    setMessage(authMessage, error.message || "Failed to check email.", "error");
    return;
  }

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
    const message = /invalid login credentials/i.test(String(error.message || ""))
      ? "Incorrect Password"
      : error.message;
    setMessage(authMessage, message, "error");
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
  if (supabase?.auth) await supabase.auth.signOut();
  verifiedBrowserEmail = "";
  if (topChangePwPanel) topChangePwPanel.hidden = true;
  showAuthView();
  setMessage(authMessage, "Logged out.", "success");
});

if (loadOverviewBtn) {
  loadOverviewBtn.addEventListener("click", async () => {
    try {
      await loadTeacherOverview();
    } catch (error) {
      setMessage(teacherMessage, error.message, "error");
    }
  });
}

if (teacherStatusLoadBtn) {
  teacherStatusLoadBtn.addEventListener("click", async () => {
    try {
      await loadTeacherStatusTable();
      setMessage(teacherMessage, "Status table loaded.", "success");
    } catch (error) {
      setMessage(teacherMessage, error.message || "Failed to load status table.", "error");
    }
  });
}

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

if (studentReviewBackBtn) {
  studentReviewBackBtn.addEventListener("click", () => {
    const topic = String(studentStatusReturnContext?.topic || "");
    switchProfileTab("topic-level");
    if (topic) showStudentTopicStatus(topic);
    studentStatusReturnContext = null;
    studentReviewBackBtn.hidden = true;
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
      clearDailyCursor(date);
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
    if (!(await ensureSupabaseReady())) return;
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

if (openPracticeModeBtn) {
  openPracticeModeBtn.addEventListener("click", async () => {
    await switchStudentPage("practice");
  });
}

if (practiceBackProfileBtn) {
  practiceBackProfileBtn.addEventListener("click", async () => {
    await switchStudentPage("profile");
  });
}

if (practiceLvSelect) {
  practiceLvSelect.addEventListener("change", () => {
    renderPracticeOptions();
    currentPracticeQuestion = null;
    currentPracticeSubmitted = null;
    if (practiceQuestionList) practiceQuestionList.innerHTML = "";
  });
}

if (practiceTopicSelect) {
  practiceTopicSelect.addEventListener("change", () => {
    renderPracticeOptions();
    currentPracticeQuestion = null;
    currentPracticeSubmitted = null;
    if (practiceQuestionList) practiceQuestionList.innerHTML = "";
  });
}

if (practiceSubtopicSelect) {
  practiceSubtopicSelect.addEventListener("change", () => {
    currentPracticeQuestion = null;
    currentPracticeSubmitted = null;
    if (practiceQuestionList) practiceQuestionList.innerHTML = "";
  });
}

if (practiceStartBtn) {
  practiceStartBtn.addEventListener("click", async () => {
    try {
      practiceSeenQuestionIds.clear();
      if (practiceNextBtn) practiceNextBtn.hidden = true;
      await loadPracticeQuestion();
    } catch (error) {
      setMessage(practiceMessage, error.message || "Failed to load practice question.", "error");
    }
  });
}

if (practiceNextBtn) {
  practiceNextBtn.addEventListener("click", async () => {
    try {
      practiceNextBtn.hidden = true;
      await loadPracticeQuestion();
    } catch (error) {
      setMessage(practiceMessage, error.message || "Failed to load the next question.", "error");
    }
  });
}

document.querySelectorAll("[data-profile-tab]").forEach((btn) => {
  btn.addEventListener("click", () => {
    switchProfileTab(String(btn.getAttribute("data-profile-tab") || "class-performance"));
  });
});

if (studentTodayReviewLink) {
  studentTodayReviewLink.addEventListener("click", async () => {
    await switchStudentPage("today-review");
  });
}

if (assessmentSubmitBtn) {
  assessmentSubmitBtn.addEventListener("click", async () => {
    const missingCount = assessmentQuestions.filter((q) => !assessmentAnswers.has(String(q.id))).length;
    if (missingCount) {
      setMessage(assessmentMessage || studentMessage, `Please answer all questions first. ${missingCount} left.`, "error");
      return;
    }
    try {
      assessmentSubmitBtn.disabled = true;
      const answers = assessmentQuestions.map((q) => ({
        question_id: Number(q.id),
        answer_text: assessmentAnswers.get(String(q.id))
      }));
      const result = await api("/api/student/initial-assessment/submit", {
        method: "POST",
        body: JSON.stringify({ answers }),
        timeout_ms: 15000
      });
      const counts = result.counts || {};
      const totals = result.totals || {};
      const reward = Number(result.token_reward || 0);
      if (Number.isFinite(Number(result.token_balance))) {
        serverTokenBalance = Number(result.token_balance);
        renderTopTokenBadge();
      }
      setMessage(
        assessmentMessage || studentMessage,
        `Placement completed. Starting level: ${result.start_difficulty || result.start_level || "-"}.${reward > 0 ? ` +${reward} diamonds for completing the placement test.` : ""} Lv2 ${counts.lv2 || 0}/${totals.lv2 || 0}, Lv3 ${counts.lv3 || 0}/${totals.lv3 || 0}, Lv4 ${counts.lv4 || 0}/${totals.lv4 || 0}.`,
        "success"
      );
      initialAssessmentRequired = false;
      clearCachedAssessmentQuestions();
      if (studentAssessmentPanel) studentAssessmentPanel.hidden = true;
      await loadStudentDaily();
      await switchStudentPage("daily");
    } catch (error) {
      setMessage(assessmentMessage || studentMessage, error.message || "Failed to submit placement test.", "error");
    } finally {
      assessmentSubmitBtn.disabled = false;
    }
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
    if (me?.role === "teacher") {
      if (studentSettingsPage) studentSettingsPage.hidden = true;
    } else {
      await switchStudentPage("profile");
    }
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
    if (me?.role === "teacher") {
      if (studentSettingsPage) studentSettingsPage.hidden = false;
    } else {
      await switchStudentPage("settings");
    }
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

if (addClassGroupBtn) {
  addClassGroupBtn.addEventListener("click", async () => {
    const name = String(newClassGroupName?.value || "").trim();
    const type = String(newClassGroupType?.value || "class");
    if (!name) {
      setMessage(teacherGroupMessage || teacherMessage, "Name is required.", "error");
      return;
    }
    try {
      await api(type === "group" ? "/api/teacher/groups" : "/api/teacher/classes", {
        method: "POST",
        body: JSON.stringify({ name })
      });
      if (newClassGroupName) newClassGroupName.value = "";
      await loadTeacherGroups();
      setMessage(teacherGroupMessage || teacherMessage, `${type === "group" ? "Group" : "Class"} added.`, "success");
    } catch (error) {
      setMessage(teacherGroupMessage || teacherMessage, error.message, "error");
    }
  });
}

if (deleteSelectedClassGroupBtn) {
  deleteSelectedClassGroupBtn.addEventListener("click", async () => {
    if (!selectedClassNames.size && !selectedClassGroupIds.size) {
      setMessage(teacherGroupMessage || teacherMessage, "Please select at least one class or group.", "error");
      return;
    }
    if (!confirm("Delete selected classes/groups? Classes will be removed from students; groups will be deleted.")) return;
    try {
      for (const name of [...selectedClassNames]) {
        await api(`/api/teacher/classes/${encodeURIComponent(name)}`, { method: "DELETE" });
      }
      for (const id of [...selectedClassGroupIds]) {
        await api(`/api/teacher/groups/${encodeURIComponent(id)}`, { method: "DELETE" });
      }
      selectedClassNames.clear();
      selectedClassGroupIds.clear();
      await loadTeacherOverview();
      await loadTeacherGroups();
      setMessage(teacherGroupMessage || teacherMessage, "Selected class/group deleted.", "success");
    } catch (error) {
      setMessage(teacherGroupMessage || teacherMessage, error.message, "error");
    }
  });
}

document.querySelectorAll("button[data-class-group-tab]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    await renderClassGroupTab(String(btn.getAttribute("data-class-group-tab") || "stat"));
  });
});

if (teacherClassScopeLoadBtn) {
  teacherClassScopeLoadBtn.addEventListener("click", async () => {
    try {
      await loadClassScope();
    } catch (error) {
      setMessage(teacherMessage, error.message || "Failed to load class scope.", "error");
    }
  });
}

if (teacherClassScopeAddBtn) {
  teacherClassScopeAddBtn.addEventListener("click", () => {
    const minDifficulty = String(teacherClassScopeMinDifficulty?.value || "").trim();
    const maxDifficulty = String(teacherClassScopeMaxDifficulty?.value || "").trim();
    const topics = getSelectedValues(teacherClassScopeTopics);
    const subType = String(teacherClassScopeSubtype?.value || "").trim();
    const result = addScopeRowsToDraft(classScopeDraft, minDifficulty, maxDifficulty, topics, subType);
    if (!result.ok) {
      setMessage(teacherMessage, result.message || "Invalid class scope.", "error");
      return;
    }
    if (teacherClassScopeSubtype) teacherClassScopeSubtype.value = "";
    if (teacherClassScopeTopics) [...teacherClassScopeTopics.options].forEach((o) => (o.selected = false));
    renderClassScopeDraft();
    setMessage(teacherMessage, "Class scope item added. Click Save Class Scope to apply.", "success");
  });
}

if (teacherClassScopeSaveBtn) {
  teacherClassScopeSaveBtn.addEventListener("click", async () => {
    const className = String(teacherClassScopeName?.value || "").trim();
    if (!className) {
      setMessage(teacherMessage, "Please enter a class name first.", "error");
      return;
    }
    try {
      const payload = classScopeDraft
        .map((row) => normalizeScopeRow(row))
        .filter((row) => row.max_difficulty && row.topic);
      await api(`/api/teacher/classes/${encodeURIComponent(className)}/scope`, {
        method: "PUT",
        body: JSON.stringify({ scopes: payload })
      });
      setMessage(teacherMessage, `Class scope saved for ${className}.`, "success");
    } catch (error) {
      setMessage(teacherMessage, error.message || "Failed to save class scope.", "error");
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

if (teacherBatchSetClassBtn) {
  teacherBatchSetClassBtn.addEventListener("click", async () => {
    const className = String(teacherBatchClassInput?.value || "").trim();
    const studentIds = [...selectedTeacherStudentIds].filter(Boolean);
    if (!studentIds.length) {
      setMessage(teacherBatchMessage || teacherMessage, "Please select at least one student.", "error");
      return;
    }
    try {
      const result = await api("/api/teacher/students/class", {
        method: "PUT",
        body: JSON.stringify({ student_ids: studentIds, class_name: className })
      });
      setMessage(
        teacherBatchMessage || teacherMessage,
        `Class ${className || "(blank)"} saved to ${result.updated || studentIds.length} student(s).`,
        "success"
      );
      await loadTeacherOverview();
    } catch (error) {
      setMessage(teacherBatchMessage || teacherMessage, error.message || "Failed to update class.", "error");
    }
  });
}

if (teacherStudentBackBtn) {
  teacherStudentBackBtn.addEventListener("click", () => {
    const target = teacherStudentBackTarget || currentTeacherPage || loadTeacherPagePreference();
    if (target === "groups") showTeacherGroupPage();
    else if (target === "batch" || target === "alert") showTeacherAlertPage();
    else showTeacherDashboardPage();
  });
}

if (alertWrongBackBtn) {
  alertWrongBackBtn.addEventListener("click", async () => {
    const ctx = teacherStatusReturnContext;
    if (!ctx?.topic) return;
    if (alertWrongDialog?.open) alertWrongDialog.close();
    await showTeacherStudentTopicStatus(ctx.topic, ctx.topics || []);
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
    if (!latestTeacherGroups.length) {
      try {
        await loadTeacherGroups();
      } catch (error) {
        setMessage(teacherGroupMessage || teacherMessage, error.message, "error");
      }
    }
    if (teacherGroupSelect?.value && !currentGroupMemberIds.length) {
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
    showTeacherAlertPage();
    if (!teacherAlertList?.innerHTML.trim()) {
      try {
        await loadTeacherAlerts();
      } catch (error) {
        setMessage(teacherMessage, error.message, "error");
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

