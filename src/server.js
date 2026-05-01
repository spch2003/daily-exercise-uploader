const path = require("path");
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const LOCAL_FALLBACK_ENABLED = process.env.LOCAL_FALLBACK_ENABLED !== "false";
const SCHOOL_EMAIL_DOMAIN = (process.env.SCHOOL_EMAIL_DOMAIN || "").toLowerCase().trim();
const APP_TIMEZONE = process.env.APP_TIMEZONE || "Asia/Hong_Kong";
const GOOGLE_CLIENT_ID = String(process.env.GOOGLE_CLIENT_ID || "").trim();
const APP_MODE = String(process.env.APP_MODE || "").trim().toLowerCase();
const ADMIN_ACCESS_KEY = String(process.env.ADMIN_ACCESS_KEY || "").trim();
const DISABLE_SIGNUP = String(process.env.DISABLE_SIGNUP || "").trim().toLowerCase() === "true";
const TEACHER_EMAILS = new Set(
  String(process.env.TEACHER_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

const DIFF = ["lv2", "lv3", "lv4", "lv5", "lv5*", "lv5**"];
const GRADES = ["F1", "F2", "F3", "F4", "F5", "F6"];
const QUESTION_TYPES = ["MC", "Short Answer"];
const REVIEW_INTERVAL_DAYS = {
  1: 1,
  2: 3,
  3: 7,
  4: 21,
  5: 60,
  6: 180
};
const STARTER_TOKENS = 120;

const hasCloudConfig = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
const hasAIConfig = Boolean(GEMINI_API_KEY);
const hasGeneratorConfig = hasAIConfig || LOCAL_FALLBACK_ENABLED;
const hasClientAuthConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const isAdminUploadOnlyMode = APP_MODE === "admin_upload_only";

const supabase = hasCloudConfig
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : null;

app.use(express.json({ limit: "2mb" }));
app.use((req, res, next) => {
  if (!isAdminUploadOnlyMode) return next();
  if (req.path === "/" || req.path === "/index.html" || req.path === "/portal.html") {
    return res.redirect("/question-bank.html");
  }
  if (req.path === "/portal.js" || req.path === "/portal.css") {
    return res.status(404).send("Not found.");
  }
  return next();
});
app.use(express.static(path.join(__dirname, "..", "public")));

function ensureCloud(req, res, next) {
  if (!supabase) {
    return res.status(500).json({
      error:
        "Cloud database is not configured yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env, then restart the server."
    });
  }
  return next();
}

function ensureGenerator(req, res, next) {
  if (!hasGeneratorConfig) {
    return res.status(500).json({
      error: "Generator is not configured. Set GEMINI_API_KEY or enable LOCAL_FALLBACK_ENABLED."
    });
  }
  return next();
}

function ensureClientAuth(req, res, next) {
  if (!hasClientAuthConfig) {
    return res.status(500).json({
      error: "Client auth is not configured. Add SUPABASE_ANON_KEY to .env, then restart the server."
    });
  }
  return next();
}

function requireAdminUploadAccess(req, res, next) {
  if (!isAdminUploadOnlyMode) return next();
  if (!ADMIN_ACCESS_KEY) {
    return res.status(500).json({
      error: "ADMIN_ACCESS_KEY is required when APP_MODE=admin_upload_only."
    });
  }
  const key = String(req.headers["x-admin-key"] || "").trim();
  if (!key || key !== ADMIN_ACCESS_KEY) {
    return res.status(403).json({ error: "Forbidden: uploader access denied." });
  }
  return next();
}

function getTodayDateString() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: APP_TIMEZONE }).format(new Date());
}

function addDaysDateString(dateString, days) {
  const base = new Date(`${String(dateString)}T00:00:00Z`);
  if (Number.isNaN(base.getTime())) return getTodayDateString();
  base.setUTCDate(base.getUTCDate() + Number(days || 0));
  const y = base.getUTCFullYear();
  const m = String(base.getUTCMonth() + 1).padStart(2, "0");
  const d = String(base.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isTeacherEmail(email) {
  return TEACHER_EMAILS.has(normalizeEmail(email));
}

function isAllowedSchoolEmail(email) {
  if (!SCHOOL_EMAIL_DOMAIN) return true;
  return normalizeEmail(email).endsWith(`@${SCHOOL_EMAIL_DOMAIN}`);
}

function compareAnswer(studentAnswer, expectedAnswer) {
  const a = String(studentAnswer || "").trim().toLowerCase().replace(/\s+/g, " ");
  const b = String(expectedAnswer || "").trim().toLowerCase().replace(/\s+/g, " ");
  if (!a || !b) return null;
  return a === b;
}

function normalizeAnswerForCompare(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function normalizeTimeSpentSeconds(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  if (n <= 0) return null;
  return Math.min(Math.round(n), 24 * 60 * 60);
}

function computeSubmissionStats(submissions) {
  const totalDone = submissions.length;
  const correctDone = submissions.filter((row) => row.is_correct === true).length;
  const correctPercentage = totalDone > 0 ? Math.round((correctDone / totalDone) * 100) : 0;
  const timed = submissions.map((row) => Number(row.time_spent_seconds || 0)).filter((x) => Number.isFinite(x) && x > 0);
  const averageTimeSeconds = timed.length ? Math.round(timed.reduce((acc, x) => acc + x, 0) / timed.length) : 0;

  return {
    questions_done: totalDone,
    correct_count: correctDone,
    correct_percentage: correctPercentage,
    average_time_seconds: averageTimeSeconds
  };
}

function toDateKey(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function computeLongestStreakDaysFromDateSet(dateKeys) {
  const sorted = [...dateKeys].filter(Boolean).sort();
  if (!sorted.length) return 0;
  let best = 1;
  let cur = 1;
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = new Date(`${sorted[i - 1]}T00:00:00Z`);
    const now = new Date(`${sorted[i]}T00:00:00Z`);
    const diff = Math.round((now.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000));
    if (diff === 1) {
      cur += 1;
      if (cur > best) best = cur;
    } else {
      cur = 1;
    }
  }
  return best;
}

function computeCurrentStreakDaysFromDateSet(dateKeys, endDateKey = getTodayDateString()) {
  const set = new Set([...dateKeys].filter(Boolean));
  let streak = 0;
  let cursor = String(endDateKey || "").trim();
  while (cursor && set.has(cursor)) {
    streak += 1;
    const prev = new Date(`${cursor}T00:00:00Z`);
    prev.setUTCDate(prev.getUTCDate() - 1);
    cursor = prev.toISOString().slice(0, 10);
  }
  return streak;
}

function buildDailyDoneDateSetFromSubmissions(submissions) {
  const counts = new Map();
  for (const row of submissions || []) {
    const key = toDateKey(row.assignment_date || row.submitted_at);
    if (!key) continue;
    counts.set(key, Number(counts.get(key) || 0) + 1);
  }
  return new Set([...counts.entries()].filter(([, n]) => Number(n) >= 5).map(([k]) => k));
}

function clamp01To100(x) {
  return Math.max(0, Math.min(100, Math.round(Number(x) || 0)));
}

function computeAspectMetrics(submissions, diamondGained = 0) {
  const stats = computeSubmissionStats(submissions || []);
  const doneDates = buildDailyDoneDateSetFromSubmissions(submissions || []);
  const currentStreakDays = computeCurrentStreakDaysFromDateSet(doneDates);
  const longestStreakDays = computeLongestStreakDaysFromDateSet(doneDates);
  const avgSec = Number(stats.average_time_seconds || 0);

  const metrics = {
    Combo: clamp01To100((currentStreakDays / 21) * 100),
    Aim: clamp01To100(stats.correct_percentage),
    Flash: clamp01To100(avgSec > 0 ? ((150 - avgSec) / 120) * 100 : 0),
    Grind: clamp01To100((Number(stats.questions_done || 0) / 300) * 100),
    Fortune: clamp01To100((Number(diamondGained || 0) / 1200) * 100)
  };

  return {
    metrics,
    questions_done: Number(stats.questions_done || 0),
    correct_percentage: Number(stats.correct_percentage || 0),
    average_time_seconds: Number(stats.average_time_seconds || 0),
    current_streak_days: currentStreakDays,
    longest_streak_days: longestStreakDays
  };
}

function weightedPick(items, weightKey) {
  const rows = (items || []).filter((x) => Number(x?.[weightKey] || 0) > 0);
  if (!rows.length) return null;
  const total = rows.reduce((acc, x) => acc + Number(x[weightKey] || 0), 0);
  if (total <= 0) return rows[Math.floor(Math.random() * rows.length)] || null;
  let r = Math.random() * total;
  for (const row of rows) {
    r -= Number(row[weightKey] || 0);
    if (r <= 0) return row;
  }
  return rows[rows.length - 1] || null;
}

async function fetchDiamondGainedByStudentMap(studentIds) {
  if (!Array.isArray(studentIds) || !studentIds.length) return new Map();
  const { data, error } = await supabase
    .from("student_token_ledger")
    .select("student_id,delta_tokens,reason")
    .in("student_id", studentIds);
  if (error) throw new Error(error.message);
  const map = new Map();
  for (const row of data || []) {
    const sid = String(row.student_id || "").trim();
    if (!sid) continue;
    const delta = Number(row.delta_tokens || 0);
    const reason = String(row.reason || "").trim();
    if (delta > 0 && (reason === "question_submission" || reason === "gacha_duplicate_compensation")) {
      map.set(sid, Number(map.get(sid) || 0) + delta);
    }
  }
  return map;
}

async function buildClassAnalytics(className, targetStudentId, fallbackSubmissions) {
  const classKey = String(className || "").trim();
  const labels = ["Combo", "Aim", "Flash", "Grind", "Fortune"];
  if (!classKey) {
    const targetDiamond = 0;
    const target = computeAspectMetrics(fallbackSubmissions || [], targetDiamond);
    return { labels, student: target.metrics, class_avg: Object.fromEntries(labels.map((k) => [k, 0])), titles: [] };
  }

  const { data: classmates, error: classmatesError } = await supabase
    .from("user_profiles")
    .select("user_id,full_name,class_name,role")
    .eq("role", "student")
    .eq("class_name", classKey);
  if (classmatesError) throw new Error(classmatesError.message);
  const members = Array.isArray(classmates) ? classmates : [];
  const ids = members.map((m) => String(m.user_id || "")).filter(Boolean);
  if (!ids.length) {
    return { labels, student: Object.fromEntries(labels.map((k) => [k, 0])), class_avg: Object.fromEntries(labels.map((k) => [k, 0])), titles: [] };
  }

  const [subsResult, diamondsMap] = await Promise.all([
    supabase
      .from("student_submissions")
      .select("student_id,assignment_date,is_correct,time_spent_seconds,submitted_at")
      .in("student_id", ids),
    fetchDiamondGainedByStudentMap(ids)
  ]);
  if (subsResult.error) throw new Error(subsResult.error.message);
  const allSubs = Array.isArray(subsResult.data) ? subsResult.data : [];
  const byStudent = new Map();
  for (const sid of ids) byStudent.set(sid, []);
  for (const row of allSubs) {
    const sid = String(row.student_id || "");
    if (!byStudent.has(sid)) byStudent.set(sid, []);
    byStudent.get(sid).push(row);
  }

  const aspectRows = members.map((m) => {
    const sid = String(m.user_id || "");
    const metricsData = computeAspectMetrics(byStudent.get(sid) || [], Number(diamondsMap.get(sid) || 0));
    return {
      student_id: sid,
      student_name: String(m.full_name || "").trim() || "Student",
      ...metricsData
    };
  });

  const avg = Object.fromEntries(labels.map((k) => [k, 0]));
  if (aspectRows.length) {
    for (const k of labels) {
      avg[k] = Math.round(aspectRows.reduce((acc, r) => acc + Number(r.metrics[k] || 0), 0) / aspectRows.length);
    }
  }

  const targetRow =
    aspectRows.find((x) => String(x.student_id) === String(targetStudentId)) ||
    { metrics: Object.fromEntries(labels.map((k) => [k, 0])), questions_done: 0, current_streak_days: 0 };

  const minQ = 30;
  const minStreakDays = 7;
  const titleDefs = [
    { key: "Combo", name: "Combo King", sort: (a, b) => Number(b.current_streak_days || 0) - Number(a.current_streak_days || 0), eligible: (x) => x.current_streak_days >= minStreakDays },
    { key: "Aim", name: "Aim Master", sort: (a, b) => Number(b.correct_percentage || 0) - Number(a.correct_percentage || 0), eligible: (x) => x.questions_done >= minQ },
    { key: "Flash", name: "Flash Solver", sort: (a, b) => Number(a.average_time_seconds || 0) - Number(b.average_time_seconds || 0), eligible: (x) => x.questions_done >= minQ && Number(x.average_time_seconds || 0) > 0 },
    { key: "Grind", name: "Grind Titan", sort: (a, b) => Number(b.questions_done || 0) - Number(a.questions_done || 0), eligible: (x) => x.questions_done >= minQ },
    { key: "Fortune", name: "Diamond Tycoon", sort: (a, b) => Number(b.metrics?.Fortune || 0) - Number(a.metrics?.Fortune || 0), eligible: (x) => x.questions_done >= minQ }
  ];
  const titles = titleDefs
    .map((d) => {
      const eligible = aspectRows.filter((x) => d.eligible(x)).sort(d.sort);
      const top = eligible[0];
      if (!top) return null;
      return { aspect_key: d.key, aspect_name: d.key, title: d.name, student_name: top.student_name, student_id: top.student_id };
    })
    .filter(Boolean);

  return {
    labels,
    student: targetRow.metrics,
    class_avg: avg,
    titles
  };
}

function parseBearerToken(req) {
  const authHeader = String(req.headers.authorization || "");
  if (!authHeader.toLowerCase().startsWith("bearer ")) return "";
  return authHeader.slice(7).trim();
}

async function withTimeout(promise, ms, label = "operation") {
  let timer = null;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out`)), Number(ms) || 8000);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function pickRandomIds(ids, count) {
  const pool = [...ids];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

function pickRandomOne(ids) {
  if (!Array.isArray(ids) || !ids.length) return null;
  return ids[Math.floor(Math.random() * ids.length)];
}

function comboKey(combo) {
  return `${String(combo.difficulty || "").trim()}|||${String(combo.topic || "").trim()}|||${String(combo.sub_type || "").trim()}`;
}

function parseComboKey(key) {
  const [difficulty, topic, sub_type] = String(key || "").split("|||");
  return {
    difficulty: String(difficulty || "").trim(),
    topic: String(topic || "").trim(),
    sub_type: String(sub_type || "").trim()
  };
}

function compareComboOrder(a, b) {
  const da = DIFF.indexOf(String(a.difficulty || ""));
  const db = DIFF.indexOf(String(b.difficulty || ""));
  if (da !== db) return da - db;
  const ta = String(a.topic || "");
  const tb = String(b.topic || "");
  if (ta !== tb) return ta.localeCompare(tb, "en", { numeric: true, sensitivity: "base" });
  const sa = String(a.sub_type || "");
  const sb = String(b.sub_type || "");
  return sa.localeCompare(sb, "en", { numeric: true, sensitivity: "base" });
}

async function fetchProfileByUserId(userId) {
  return supabase.from("user_profiles").select("*").eq("user_id", userId).maybeSingle();
}

async function ensureProfileFromAuthUser(authUser) {
  const fallbackRole = isTeacherEmail(authUser.email) ? "teacher" : "student";
  const profilePayload = {
    user_id: authUser.id,
    email: normalizeEmail(authUser.email),
    full_name: String(authUser.user_metadata?.full_name || authUser.email || "").trim(),
    role: String(authUser.user_metadata?.role || fallbackRole),
    grade: String(authUser.user_metadata?.grade || "").trim() || null,
    class_name: String(authUser.user_metadata?.class_name || "").trim() || null
  };

  await supabase.from("user_profiles").upsert(profilePayload, { onConflict: "user_id" });
  return fetchProfileByUserId(authUser.id);
}

async function ensureStudentTokenWallet(studentId) {
  const { data: existing, error: existingError } = await supabase
    .from("student_token_wallets")
    .select("student_id,balance")
    .eq("student_id", studentId)
    .maybeSingle();
  if (existingError) throw new Error(existingError.message);
  if (existing) return existing;

  const { data: created, error: createError } = await supabase
    .from("student_token_wallets")
    .insert({
      student_id: studentId,
      balance: STARTER_TOKENS
    })
    .select("student_id,balance")
    .single();
  if (createError) throw new Error(createError.message);

  await supabase.from("student_token_ledger").insert({
    student_id: studentId,
    delta_tokens: STARTER_TOKENS,
    reason: "starter_bonus",
    metadata: {}
  });
  return created;
}

function previousDateString(dateString) {
  const d = new Date(`${String(dateString || "").trim()}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

function computeTrailingCorrectStreak(submissions) {
  if (!Array.isArray(submissions) || submissions.length === 0) return 0;
  let streak = 0;
  for (let i = submissions.length - 1; i >= 0; i -= 1) {
    if (submissions[i]?.is_correct === true) streak += 1;
    else break;
  }
  return streak;
}

function computeQuestionTokenReward({ isCorrect, timeSpentSeconds, nextCorrectStreak }) {
  if (isCorrect !== true) return 0;
  const sec = Number(timeSpentSeconds || 0);
  let reward = 3;
  if (sec > 0 && sec <= 30) reward += 1;
  if (Number(nextCorrectStreak) === 3) reward += 2;
  if (Number(nextCorrectStreak) === 5) reward += 4;
  return Math.max(0, Math.round(reward));
}

async function computeDailyCompletionBonus(studentId, assignmentDate) {
  const day = String(assignmentDate || "").trim();
  if (!day) return 0;
  const { data, error } = await supabase
    .from("student_submissions")
    .select("assignment_date")
    .eq("student_id", studentId)
    .lte("assignment_date", day);
  if (error) throw new Error(error.message);

  const countByDate = new Map();
  for (const row of data || []) {
    const d = String(row?.assignment_date || "").trim();
    if (!d) continue;
    countByDate.set(d, Number(countByDate.get(d) || 0) + 1);
  }

  let streakDays = 0;
  let cursor = day;
  while (cursor && Number(countByDate.get(cursor) || 0) >= 5) {
    streakDays += 1;
    cursor = previousDateString(cursor);
  }

  if (streakDays === 3) return 5;
  if (streakDays === 7) return 10;
  if (streakDays === 14) return 20;
  if (streakDays === 21) return 40;
  return 0;
}

async function grantStudentTokens(studentId, delta, reason, metadata = {}) {
  const amount = Math.round(Number(delta || 0));
  if (!Number.isFinite(amount) || amount === 0) {
    const wallet0 = await ensureStudentTokenWallet(studentId);
    return Number(wallet0.balance || 0);
  }

  const wallet = await ensureStudentTokenWallet(studentId);
  const current = Number(wallet.balance || 0);
  const next = current + amount;
  if (next < 0) {
    throw new Error("Insufficient tokens.");
  }

  const { error: updateError } = await supabase
    .from("student_token_wallets")
    .update({ balance: next })
    .eq("student_id", studentId);
  if (updateError) throw new Error(updateError.message);

  const { error: ledgerError } = await supabase.from("student_token_ledger").insert({
    student_id: studentId,
    delta_tokens: amount,
    reason: String(reason || "adjustment").trim() || "adjustment",
    metadata
  });
  if (ledgerError) throw new Error(ledgerError.message);

  return next;
}

async function fetchAvatarCatalogForStudent(studentId) {
  const [walletResult, avatarResult, ownedResult, stateResult] = await Promise.all([
    ensureStudentTokenWallet(studentId),
    supabase
      .from("avatar_characters")
      .select("id,avatar_key,name,tier,token_cost,emoji,image_url,model_url,drop_rate,is_active")
      .eq("is_active", true)
      .order("tier", { ascending: true })
      .order("token_cost", { ascending: true })
      .order("id", { ascending: true }),
    supabase.from("student_avatar_inventory").select("avatar_id").eq("student_id", studentId),
    supabase.from("student_avatar_state").select("selected_avatar_id").eq("student_id", studentId).maybeSingle()
  ]);

  if (avatarResult.error) throw new Error(avatarResult.error.message);
  if (ownedResult.error) throw new Error(ownedResult.error.message);
  if (stateResult.error) throw new Error(stateResult.error.message);

  const avatars = Array.isArray(avatarResult.data) ? avatarResult.data : [];
  const ownedSet = new Set((ownedResult.data || []).map((x) => Number(x.avatar_id)).filter((x) => Number.isInteger(x)));
  const freeIds = avatars.filter((a) => String(a.tier) === "basic").map((a) => Number(a.id));
  freeIds.forEach((id) => ownedSet.add(id));

  let selectedAvatarId = Number(stateResult.data?.selected_avatar_id || 0);
  if (!Number.isInteger(selectedAvatarId) || !ownedSet.has(selectedAvatarId)) {
    selectedAvatarId = freeIds[0] || Number(avatars[0]?.id || 0);
    if (Number.isInteger(selectedAvatarId) && selectedAvatarId > 0) {
      await supabase.from("student_avatar_state").upsert(
        {
          student_id: studentId,
          selected_avatar_id: selectedAvatarId
        },
        { onConflict: "student_id" }
      );
    }
  }

  const tokenBalance = Number(walletResult?.balance || 0);
  const catalog = avatars.map((avatar) => {
    const id = Number(avatar.id);
    const owned = ownedSet.has(id);
    return {
      ...avatar,
      owned,
      selected: id === selectedAvatarId,
      can_purchase: !owned && String(avatar.tier) === "premium" && tokenBalance >= Number(avatar.token_cost || 0)
    };
  });

  return { token_balance: tokenBalance, selected_avatar_id: selectedAvatarId, avatars: catalog };
}

async function setSelectedAvatarForStudent(studentId, avatarId) {
  const catalog = await fetchAvatarCatalogForStudent(studentId);
  const chosen = (catalog.avatars || []).find((a) => Number(a.id) === Number(avatarId));
  if (!chosen) throw new Error("Avatar not found.");
  if (!chosen.owned) throw new Error("Avatar is locked. Purchase it first.");

  const { error } = await supabase.from("student_avatar_state").upsert(
    {
      student_id: studentId,
      selected_avatar_id: Number(avatarId)
    },
    { onConflict: "student_id" }
  );
  if (error) throw new Error(error.message);
}

async function purchaseAvatarForStudent(studentId, avatarId) {
  const id = Number(avatarId);
  if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid avatar id.");

  const { data: avatar, error: avatarError } = await supabase
    .from("avatar_characters")
    .select("id,name,tier,token_cost,is_active")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();
  if (avatarError) throw new Error(avatarError.message);
  if (!avatar) throw new Error("Avatar not found.");
  if (String(avatar.tier) !== "premium") throw new Error("This avatar is already free.");

  const { data: existing, error: existingError } = await supabase
    .from("student_avatar_inventory")
    .select("avatar_id")
    .eq("student_id", studentId)
    .eq("avatar_id", id)
    .maybeSingle();
  if (existingError) throw new Error(existingError.message);
  if (existing) throw new Error("You already own this avatar.");

  const cost = Number(avatar.token_cost || 0);
  const newBalance = await grantStudentTokens(studentId, -cost, "avatar_purchase", {
    avatar_id: id,
    avatar_name: avatar.name
  });

  const { error: insertError } = await supabase.from("student_avatar_inventory").insert({
    student_id: studentId,
    avatar_id: id,
    source: "purchase"
  });
  if (insertError) {
    await grantStudentTokens(studentId, cost, "avatar_purchase_refund", {
      avatar_id: id,
      reason: insertError.message
    }).catch(() => {});
    throw new Error(insertError.message);
  }

  return { token_balance: newBalance, avatar_id: id };
}

async function fetchFrameCatalogForStudent(studentId) {
  const [framesResult, ownedResult, stateResult] = await Promise.all([
    supabase
      .from("frame_items")
      .select("id,frame_key,name,tier,style_key,image_url,drop_rate,is_active")
      .eq("is_active", true)
      .order("id", { ascending: true }),
    supabase.from("student_frame_inventory").select("frame_id").eq("student_id", studentId),
    supabase.from("student_frame_state").select("selected_frame_id").eq("student_id", studentId).maybeSingle()
  ]);

  if (framesResult.error) throw new Error(framesResult.error.message);
  if (ownedResult.error) throw new Error(ownedResult.error.message);
  if (stateResult.error) throw new Error(stateResult.error.message);

  const frames = Array.isArray(framesResult.data) ? framesResult.data : [];
  const ownedSet = new Set((ownedResult.data || []).map((x) => Number(x.frame_id)).filter((x) => Number.isInteger(x)));
  const freeIds = frames.filter((f) => String(f.tier || "") === "basic").map((f) => Number(f.id));
  freeIds.forEach((id) => ownedSet.add(id));

  let selectedFrameId = Number(stateResult.data?.selected_frame_id || 0);
  if (!Number.isInteger(selectedFrameId) || !ownedSet.has(selectedFrameId)) {
    selectedFrameId = freeIds[0] || Number(frames[0]?.id || 0);
    if (Number.isInteger(selectedFrameId) && selectedFrameId > 0) {
      await supabase.from("student_frame_state").upsert(
        { student_id: studentId, selected_frame_id: selectedFrameId },
        { onConflict: "student_id" }
      );
    }
  }

  return frames.map((f) => ({
    ...f,
    owned: ownedSet.has(Number(f.id)),
    selected: Number(f.id) === selectedFrameId
  }));
}

async function setSelectedFrameForStudent(studentId, frameId) {
  const catalog = await fetchFrameCatalogForStudent(studentId);
  const chosen = (catalog || []).find((f) => Number(f.id) === Number(frameId));
  if (!chosen) throw new Error("Frame not found.");
  if (!chosen.owned) throw new Error("Frame is locked.");
  const { error } = await supabase.from("student_frame_state").upsert(
    { student_id: studentId, selected_frame_id: Number(frameId) },
    { onConflict: "student_id" }
  );
  if (error) throw new Error(error.message);
}

async function fetchGachaStateForStudent(studentId) {
  const [avatarData, frames, wallet] = await Promise.all([
    fetchAvatarCatalogForStudent(studentId),
    fetchFrameCatalogForStudent(studentId),
    ensureStudentTokenWallet(studentId)
  ]);
  return {
    token_balance: Number(wallet.balance || 0),
    packs: {
      character: { cost: 100 },
      frame: { cost: 50 }
    },
    avatars: avatarData.avatars || [],
    selected_avatar_id: avatarData.selected_avatar_id,
    frames
  };
}

async function drawCharacterGacha(studentId) {
  const cost = 100;
  await grantStudentTokens(studentId, -cost, "gacha_draw_character", { cost });
  const { data: pool, error } = await supabase
    .from("avatar_characters")
    .select("id,name,emoji,image_url,drop_rate,is_active")
    .eq("is_active", true);
  if (error) throw new Error(error.message);
  const picked = weightedPick(pool || [], "drop_rate") || (pool || [])[0];
  if (!picked) throw new Error("No characters in pool.");
  const avatarId = Number(picked.id);

  const { data: existing, error: existingError } = await supabase
    .from("student_avatar_inventory")
    .select("avatar_id")
    .eq("student_id", studentId)
    .eq("avatar_id", avatarId)
    .maybeSingle();
  if (existingError) throw new Error(existingError.message);
  const duplicate = Boolean(existing);
  if (!duplicate) {
    const { error: insertError } = await supabase.from("student_avatar_inventory").insert({
      student_id: studentId,
      avatar_id: avatarId,
      source: "gacha"
    });
    if (insertError) throw new Error(insertError.message);
    await setSelectedAvatarForStudent(studentId, avatarId).catch(() => {});
  } else {
    await grantStudentTokens(studentId, 15, "gacha_duplicate_compensation", { pack: "character", avatar_id: avatarId }).catch(() => {});
  }
  const wallet = await ensureStudentTokenWallet(studentId);
  return {
    token_balance: Number(wallet.balance || 0),
    item: { ...picked, type: "character" },
    duplicate,
    message: duplicate ? "Duplicate character. +15 diamonds compensation." : "New character unlocked!"
  };
}

async function drawFrameGacha(studentId) {
  const cost = 50;
  await grantStudentTokens(studentId, -cost, "gacha_draw_frame", { cost });
  const { data: pool, error } = await supabase
    .from("frame_items")
    .select("id,name,style_key,image_url,drop_rate,is_active")
    .eq("is_active", true);
  if (error) throw new Error(error.message);
  const picked = weightedPick(pool || [], "drop_rate") || (pool || [])[0];
  if (!picked) throw new Error("No frames in pool.");
  const frameId = Number(picked.id);
  const { data: existing, error: existingError } = await supabase
    .from("student_frame_inventory")
    .select("frame_id")
    .eq("student_id", studentId)
    .eq("frame_id", frameId)
    .maybeSingle();
  if (existingError) throw new Error(existingError.message);
  const duplicate = Boolean(existing);
  if (!duplicate) {
    const { error: insertError } = await supabase.from("student_frame_inventory").insert({
      student_id: studentId,
      frame_id: frameId,
      source: "gacha"
    });
    if (insertError) throw new Error(insertError.message);
    await setSelectedFrameForStudent(studentId, frameId).catch(() => {});
  } else {
    await grantStudentTokens(studentId, 8, "gacha_duplicate_compensation", { pack: "frame", frame_id: frameId }).catch(() => {});
  }
  const wallet = await ensureStudentTokenWallet(studentId);
  return {
    token_balance: Number(wallet.balance || 0),
    item: { ...picked, type: "frame", emoji: "🖼️" },
    duplicate,
    message: duplicate ? "Duplicate frame. +8 diamonds compensation." : "New frame unlocked!"
  };
}

async function requireAuth(req, res, next) {
  const token = parseBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: "Missing access token." });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  const { data: profile, error: profileError } = await ensureProfileFromAuthUser(data.user);
  if (profileError || !profile) {
    return res.status(500).json({ error: profileError?.message || "Failed to load user profile." });
  }

  req.authUser = data.user;
  req.profile = profile;
  return next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.profile || req.profile.role !== role) {
      return res.status(403).json({ error: "You do not have permission to access this resource." });
    }
    return next();
  };
}

async function getAssignmentsForDate(studentId, dateString) {
  const { data, error } = await supabase
    .from("daily_assignments")
    .select("id, slot, assignment_date, question_id, problems(*)")
    .eq("student_id", studentId)
    .eq("assignment_date", dateString)
    .order("slot", { ascending: true });

  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data : [];
}

async function fetchProblemPoolForStudentGrade(studentGrade) {
  const targetGrade = String(studentGrade || "").trim();
  let query = supabase.from("problems").select("id,difficulty,topic,sub_type,grade");
  if (targetGrade) query = query.eq("grade", targetGrade);

  let { data, error } = await query;
  if (error) throw new Error(error.message);
  let rows = Array.isArray(data) ? data : [];

  if (!rows.length && targetGrade) {
    const fallback = await supabase.from("problems").select("id,difficulty,topic,sub_type,grade");
    if (fallback.error) throw new Error(fallback.error.message);
    rows = Array.isArray(fallback.data) ? fallback.data : [];
  }

  return rows;
}

async function fetchScopeRulesForStudent(studentId) {
  const { data: memberships, error: membershipError } = await supabase
    .from("student_group_memberships")
    .select("group_id")
    .eq("student_id", studentId);
  if (membershipError) throw new Error(membershipError.message);
  const groupIds = (memberships || []).map((m) => Number(m.group_id)).filter((x) => Number.isInteger(x) && x > 0);
  if (!groupIds.length) return [];

  const { data: scopes, error: scopeError } = await supabase
    .from("study_group_scopes")
    .select("group_id,difficulty,min_difficulty,max_difficulty,topic,sub_type")
    .in("group_id", groupIds);
  if (scopeError) throw new Error(scopeError.message);

  return (scopes || []).map((row) => ({
    difficulty: String(row.difficulty || "").trim(),
    min_difficulty: String(row.min_difficulty || "").trim(),
    max_difficulty: String(row.max_difficulty || "").trim(),
    topic: String(row.topic || "").trim(),
    sub_type: String(row.sub_type || "").trim()
  }));
}

function applyScopeRulesToProblemRows(problemRows, scopeRules) {
  const rules = Array.isArray(scopeRules) ? scopeRules : [];
  if (!rules.length) return problemRows;

  const diffIndex = new Map(DIFF.map((d, i) => [d, i]));

  return (problemRows || []).filter((row) => {
    const difficulty = String(row.difficulty || "").trim();
    const topic = String(row.topic || "").trim();
    const subType = String(row.sub_type || "").trim();
    const rowDiffIdx = diffIndex.has(difficulty) ? diffIndex.get(difficulty) : -1;
    if (rowDiffIdx < 0) return false;

    return rules.some((rule) => {
      if (String(rule.topic || "").trim() !== topic) return false;
      const ruleSub = String(rule.sub_type || "").trim();
      if (ruleSub && ruleSub !== subType) return false;
      const minDiff = String(rule.min_difficulty || "").trim() || DIFF[0];
      const maxDiff = String(rule.max_difficulty || "").trim() || String(rule.difficulty || "").trim();
      const minIdx = diffIndex.has(minDiff) ? diffIndex.get(minDiff) : 0;
      const maxIdx = diffIndex.has(maxDiff) ? diffIndex.get(maxDiff) : -1;
      if (maxIdx < 0) return false;
      return rowDiffIdx >= minIdx && rowDiffIdx <= maxIdx;
    });
  });
}

function buildProblemPoolIndex(problemRows) {
  const byCombo = new Map();
  const comboList = [];
  const seen = new Set();

  for (const row of problemRows || []) {
    const combo = {
      difficulty: String(row.difficulty || "").trim(),
      topic: String(row.topic || "").trim(),
      sub_type: String(row.sub_type || "").trim()
    };
    if (!combo.difficulty || !combo.topic || !combo.sub_type) continue;
    const key = comboKey(combo);
    if (!byCombo.has(key)) byCombo.set(key, []);
    byCombo.get(key).push(Number(row.id));
    if (!seen.has(key)) {
      seen.add(key);
      comboList.push(combo);
    }
  }

  comboList.sort(compareComboOrder);
  return { byCombo, comboList };
}

async function fetchStudentLearningProgress(studentId) {
  const { data, error } = await supabase
    .from("student_learning_progress")
    .select("*")
    .eq("student_id", studentId);
  if (error) throw new Error(error.message);
  const rows = Array.isArray(data) ? data : [];
  const byKey = new Map();
  for (const row of rows) {
    byKey.set(
      comboKey({
        difficulty: row.difficulty,
        topic: row.topic,
        sub_type: row.sub_type
      }),
      row
    );
  }
  return byKey;
}

async function upsertStudentLearningProgress(row) {
  const payload = {
    student_id: row.student_id,
    difficulty: row.difficulty,
    topic: row.topic,
    sub_type: row.sub_type,
    streak_correct: Number(row.streak_correct || 0),
    mastery_achieved: Boolean(row.mastery_achieved),
    review_stage: Number(row.review_stage || 0),
    next_review_date: row.next_review_date || null,
    consolidation_due_date: row.consolidation_due_date || null,
    correction_due_date: row.correction_due_date || null,
    correction_wrong_streak: Number(row.correction_wrong_streak || 0),
    ever_wrong: Boolean(row.ever_wrong),
    is_paused: Boolean(row.is_paused),
    pending_careless_retry: Boolean(row.pending_careless_retry),
    careless_retry_date: row.careless_retry_date || null
  };

  const { error } = await supabase.from("student_learning_progress").upsert(payload, {
    onConflict: "student_id,difficulty,topic,sub_type"
  });
  if (error) throw new Error(error.message);
}

async function createLearningAlert(studentId, combo, message) {
  const { error } = await supabase.from("learning_alerts").insert({
    student_id: studentId,
    difficulty: combo.difficulty,
    topic: combo.topic,
    sub_type: combo.sub_type,
    message
  });
  if (error) throw new Error(error.message);
}

function isDateDue(dueDate, onDate) {
  const due = String(dueDate || "").trim();
  const today = String(onDate || "").trim();
  if (!due || !today) return false;
  return due <= today;
}

function reviewIntervalByStage(stage) {
  const n = Number(stage);
  return REVIEW_INTERVAL_DAYS[n] || 1;
}

function getUnlockedDifficulty(comboList, progressByKey) {
  for (const diff of DIFF) {
    const inLevel = comboList.filter((c) => c.difficulty === diff);
    if (!inLevel.length) continue;
    const allMastered = inLevel.every((c) => {
      const row = progressByKey.get(comboKey(c));
      return row && row.mastery_achieved === true;
    });
    if (!allMastered) return diff;
  }
  return DIFF[DIFF.length - 1];
}

function pickQuestionForCombo(poolByCombo, combo, usedQuestionIds) {
  const ids = (poolByCombo.get(comboKey(combo)) || []).filter((x) => Number.isInteger(Number(x)));
  if (!ids.length) return null;
  const fresh = ids.filter((id) => !usedQuestionIds.has(Number(id)));
  return Number(pickRandomOne(fresh.length ? fresh : ids));
}

async function deferOverflowReviews(studentId, overflowRows, dateString) {
  const cappedRows = (overflowRows || []).slice(0, 30);
  const updates = [];
  for (const row of cappedRows) {
    const stage = Number(row.review_stage || 0);
    if (stage < 2) continue;
    if (!isDateDue(row.next_review_date, dateString)) continue;
    const delayDays = 1 + Math.floor(Math.random() * 3);
    updates.push(
      supabase
        .from("student_learning_progress")
        .update({ next_review_date: addDaysDateString(dateString, delayDays) })
        .eq("student_id", studentId)
        .eq("difficulty", String(row.difficulty || "").trim())
        .eq("topic", String(row.topic || "").trim())
        .eq("sub_type", String(row.sub_type || "").trim())
    );
  }
  if (updates.length) {
    await Promise.allSettled(updates);
  }
}

async function buildPriorityQuestionQueue(studentProfile, dateString, neededCount, usedQuestionIds) {
  const studentId = studentProfile.user_id;
  const scopeRules = await fetchScopeRulesForStudent(studentId);
  const allProblemRows = await fetchProblemPoolForStudentGrade(studentProfile.grade);
  const problemRows = applyScopeRulesToProblemRows(allProblemRows, scopeRules);
  if (!problemRows.length) {
    throw new Error("No questions found in question bank.");
  }

  const { byCombo: poolByCombo, comboList } = buildProblemPoolIndex(problemRows);
  const progressByKey = await fetchStudentLearningProgress(studentId);
  const comboCountByKey = new Map();
  const queue = [];
  let slotsLeft = Math.max(Number(neededCount || 0), 0);

  const getComboCount = (combo) => comboCountByKey.get(comboKey(combo)) || 0;
  const bumpComboCount = (combo) => {
    const key = comboKey(combo);
    comboCountByKey.set(key, (comboCountByKey.get(key) || 0) + 1);
  };

  const availableQuestionIdsForCombo = (combo) =>
    (poolByCombo.get(comboKey(combo)) || [])
      .map((x) => Number(x))
      .filter((id) => Number.isInteger(id) && id > 0 && !usedQuestionIds.has(id));

  const pushByComboIfPossible = (combo, priorityTag) => {
    if (slotsLeft <= 0) return false;
    const key = comboKey(combo);
    if (getComboCount(combo) >= 2) return false;
    const questionId = pickQuestionForCombo(poolByCombo, combo, usedQuestionIds);
    if (!Number.isInteger(questionId) || questionId <= 0) return false;
    usedQuestionIds.add(questionId);
    bumpComboCount(combo);
    queue.push({ question_id: questionId, combo, priority: priorityTag });
    slotsLeft -= 1;
    return true;
  };

  const pushBlock = (combo, priorityTag, blockSize, requireFullBlock) => {
    const target = Math.min(Number(blockSize || 1), 2);
    if (target <= 0) return 0;
    if (requireFullBlock && slotsLeft < target) return 0;
    const maxPossible = Math.min(target, slotsLeft);
    if (availableQuestionIdsForCombo(combo).length <= 0) return 0;
    let added = 0;
    for (let i = 0; i < maxPossible; i += 1) {
      const ok = pushByComboIfPossible(combo, priorityTag);
      if (!ok) break;
      added += 1;
    }
    return added;
  };

  // Priority 1: due reviews (single each).
  const dueReviewRows = [...progressByKey.values()]
    .filter((row) => !row.is_paused)
    .filter((row) => Number(row.review_stage || 0) >= 1 && Number(row.review_stage || 0) <= 6)
    .filter((row) => isDateDue(row.next_review_date, dateString));

  const level1Rows = dueReviewRows.filter((row) => Number(row.review_stage || 0) === 1);
  const level2PlusRows = dueReviewRows
    .filter((row) => Number(row.review_stage || 0) >= 2)
    .sort((a, b) => {
      const aw = a.ever_wrong ? 1 : 0;
      const bw = b.ever_wrong ? 1 : 0;
      if (aw !== bw) return bw - aw;
      const da = String(a.next_review_date || "");
      const db = String(b.next_review_date || "");
      if (da !== db) return da.localeCompare(db);
      return Number(a.review_stage || 0) - Number(b.review_stage || 0);
    });

  for (const row of level1Rows) {
    if (slotsLeft <= 0) break;
    pushByComboIfPossible(
      {
        difficulty: row.difficulty,
        topic: row.topic,
        sub_type: row.sub_type
      },
      "review"
    );
  }

  const remainingAfterLevel1 = Math.max(slotsLeft, 0);
  const selectedLevel2Rows = level2PlusRows.slice(0, remainingAfterLevel1);
  const overflowLevel2Rows = level2PlusRows.slice(remainingAfterLevel1);
  for (const row of selectedLevel2Rows) {
    if (slotsLeft <= 0) break;
    pushByComboIfPossible(
      {
        difficulty: row.difficulty,
        topic: row.topic,
        sub_type: row.sub_type
      },
      "review"
    );
  }
  await deferOverflowReviews(studentId, overflowLevel2Rows, dateString);

  // Priority 2: corrections (2-in-row block).
  const correctionRows = [...progressByKey.values()]
    .filter((row) => !row.is_paused)
    .filter((row) => Number(row.correction_wrong_streak || 0) < 3)
    .filter((row) => isDateDue(row.correction_due_date, dateString))
    .sort((a, b) => {
      const da = String(a.correction_due_date || "");
      const db = String(b.correction_due_date || "");
      if (da !== db) return da.localeCompare(db);
      return compareComboOrder(a, b);
    });
  for (const row of correctionRows) {
    if (slotsLeft <= 0) break;
    pushBlock(
      {
        difficulty: row.difficulty,
        topic: row.topic,
        sub_type: row.sub_type
      },
      "correction",
      2,
      true
    );
  }

  // Priority 3: consolidation (single to chase 2-in-row).
  const consolidationRows = [...progressByKey.values()]
    .filter((row) => !row.is_paused)
    .filter((row) => !row.mastery_achieved)
    .filter((row) => Number(row.streak_correct || 0) === 1)
    .filter((row) => isDateDue(row.consolidation_due_date, dateString))
    .sort((a, b) => {
      const da = String(a.consolidation_due_date || "");
      const db = String(b.consolidation_due_date || "");
      if (da !== db) return da.localeCompare(db);
      return compareComboOrder(a, b);
    });
  for (const row of consolidationRows) {
    if (slotsLeft <= 0) break;
    pushByComboIfPossible(
      {
        difficulty: row.difficulty,
        topic: row.topic,
        sub_type: row.sub_type
      },
      "consolidation"
    );
  }

  // Priority 4: new progression (up to 2 in same sub-topic, then move on).
  while (slotsLeft > 0) {
    const unlockedDifficulty = getUnlockedDifficulty(comboList, progressByKey);
    const unlockedCombos = comboList.filter((c) => c.difficulty === unlockedDifficulty);
    const nextCombo = unlockedCombos.find((combo) => {
      const row = progressByKey.get(comboKey(combo));
      if (!row) return true;
      if (row.is_paused) return false;
      if (row.mastery_achieved) return false;
      if (Number(row.review_stage || 0) > 0) return false;
      if (isDateDue(row.correction_due_date, dateString) || isDateDue(row.consolidation_due_date, dateString)) return false;
      return Number(row.streak_correct || 0) === 0;
    });

    if (!nextCombo) break;
    const added = pushBlock(nextCombo, "new_topic", 2, false);
    if (!added) break;
    const key = comboKey(nextCombo);
    if (!progressByKey.has(key)) {
      const fresh = {
        student_id: studentId,
        difficulty: nextCombo.difficulty,
        topic: nextCombo.topic,
        sub_type: nextCombo.sub_type,
        streak_correct: 0,
        mastery_achieved: false,
        review_stage: 0,
        next_review_date: null,
        consolidation_due_date: null,
        correction_due_date: null,
        correction_wrong_streak: 0,
        ever_wrong: false,
        is_paused: false,
        pending_careless_retry: false,
        careless_retry_date: null
      };
      progressByKey.set(key, fresh);
      await upsertStudentLearningProgress(fresh);
    }
  }

  // Final rescue fill: keep scope + pause rules, but relax progression priority to avoid hard fail.
  if (slotsLeft > 0) {
    const rescueCombos = comboList
      .filter((combo) => {
        const row = progressByKey.get(comboKey(combo));
        return !row || !row.is_paused;
      })
      .sort(compareComboOrder);

    let progressed = true;
    while (slotsLeft > 0 && progressed) {
      progressed = false;
      for (const combo of rescueCombos) {
        if (slotsLeft <= 0) break;
        const added = pushBlock(combo, "rescue", 1, false);
        if (added > 0) progressed = true;
      }
    }
  }

  return queue.slice(0, neededCount);
}

async function appendAssignmentsForStudentDate(studentProfile, dateString, count) {
  const needed = Number(count);
  if (!Number.isInteger(needed) || needed <= 0) return await getAssignmentsForDate(studentProfile.user_id, dateString);

  const studentId = studentProfile.user_id;
  let assignments = await getAssignmentsForDate(studentId, dateString);
  const usedQuestionIds = new Set(assignments.map((a) => Number(a.question_id)).filter((id) => Number.isInteger(id)));

  const queue = await buildPriorityQuestionQueue(studentProfile, dateString, needed, usedQuestionIds);
  if (!queue.length) {
    throw new Error("No assignable questions found under current group scope and progress rules.");
  }

  const startSlot = assignments.reduce((acc, row) => Math.max(acc, Number(row.slot || 0)), 0);
  const inserts = queue.map((item, index) => ({
    student_id: studentId,
    assignment_date: dateString,
    question_id: item.question_id,
    slot: startSlot + index + 1
  }));
  const { error: insertError } = await supabase.from("daily_assignments").insert(inserts);
  if (insertError) throw new Error(insertError.message);

  return await getAssignmentsForDate(studentId, dateString);
}

async function appendAssignmentsForStudentDateWithBlocked(studentProfile, dateString, count, blockedQuestionIds = []) {
  const needed = Number(count);
  if (!Number.isInteger(needed) || needed <= 0) return await getAssignmentsForDate(studentProfile.user_id, dateString);

  const studentId = studentProfile.user_id;
  let assignments = await getAssignmentsForDate(studentId, dateString);
  const usedQuestionIds = new Set(assignments.map((a) => Number(a.question_id)).filter((id) => Number.isInteger(id)));
  for (const qid of blockedQuestionIds || []) {
    const n = Number(qid);
    if (Number.isInteger(n) && n > 0) usedQuestionIds.add(n);
  }

  const queue = await buildPriorityQuestionQueue(studentProfile, dateString, needed, usedQuestionIds);
  if (!queue.length) {
    throw new Error("No assignable questions found under current group scope and progress rules.");
  }

  const startSlot = assignments.reduce((acc, row) => Math.max(acc, Number(row.slot || 0)), 0);
  const inserts = queue.map((item, index) => ({
    student_id: studentId,
    assignment_date: dateString,
    question_id: item.question_id,
    slot: startSlot + index + 1
  }));
  const { error: insertError } = await supabase.from("daily_assignments").insert(inserts);
  if (insertError) throw new Error(insertError.message);

  return await getAssignmentsForDate(studentId, dateString);
}

async function ensureDailyAssignments(studentProfile, dateString) {
  const assignments = await getAssignmentsForDate(studentProfile.user_id, dateString);
  if (assignments.length >= 5) return assignments;
  return await appendAssignmentsForStudentDate(studentProfile, dateString, 5 - assignments.length);
}

async function redistributePendingAssignmentsForDate(studentProfile, dateString) {
  const studentId = studentProfile.user_id;
  const assignments = await getAssignmentsForDate(studentId, dateString);
  if (!assignments.length) {
    return await ensureDailyAssignments(studentProfile, dateString);
  }

  const questionIds = assignments.map((a) => Number(a.question_id)).filter((id) => Number.isInteger(id));
  const { data: submissions, error: submissionsError } = await supabase
    .from("student_submissions")
    .select("question_id")
    .eq("student_id", studentId)
    .eq("assignment_date", dateString)
    .in("question_id", questionIds);
  if (submissionsError) throw new Error(submissionsError.message);

  const submittedSet = new Set((submissions || []).map((row) => Number(row.question_id)).filter((id) => Number.isInteger(id)));
  const pendingAssignmentIds = assignments
    .filter((a) => !submittedSet.has(Number(a.question_id)))
    .map((a) => Number(a.id))
    .filter((id) => Number.isInteger(id));

  if (!pendingAssignmentIds.length) return assignments;

  const desiredTotal = Math.max(5, assignments.length);
  if (pendingAssignmentIds.length) {
    const { error: deleteError } = await supabase.from("daily_assignments").delete().in("id", pendingAssignmentIds);
    if (deleteError) throw new Error(deleteError.message);
  }

  const remaining = await getAssignmentsForDate(studentId, dateString);
  const needed = Math.max(desiredTotal - remaining.length, 0);
  if (needed <= 0) return remaining;
  return await appendAssignmentsForStudentDate(studentProfile, dateString, needed);
}

async function refreshTodayAssignmentsByLatestRules(studentProfile, dateString, count = 5) {
  const studentId = studentProfile.user_id;
  const targetCount = Math.max(1, Math.min(20, Number(count) || 5));

  const { data: subs, error: subErr } = await supabase
    .from("student_submissions")
    .select("question_id")
    .eq("student_id", studentId)
    .eq("assignment_date", dateString);
  if (subErr) throw new Error(subErr.message);
  const blockedQuestionIds = (subs || []).map((row) => Number(row.question_id)).filter((id) => Number.isInteger(id) && id > 0);

  const { error: delErr } = await supabase
    .from("daily_assignments")
    .delete()
    .eq("student_id", studentId)
    .eq("assignment_date", dateString);
  if (delErr) throw new Error(delErr.message);

  return await appendAssignmentsForStudentDateWithBlocked(studentProfile, dateString, targetCount, blockedQuestionIds);
}

function norm(body) {
  return {
    latex_code: (body.latex_code || "").trim(),
    solution_latex: (body.solution_latex || "").trim(),
    answer_text: (body.answer_text || "").trim(),
    question_type: (body.question_type || "").trim(),
    difficulty: (body.difficulty || "").trim(),
    topic: (body.topic || "").trim(),
    sub_type: (body.sub_type || "").trim(),
    grade: (body.grade || "").trim()
  };
}

function validateLabels(p) {
  if (!DIFF.includes(p.difficulty)) {
    return "Difficulty must be one of: lv2, lv3, lv4, lv5, lv5*, lv5**.";
  }
  if (!QUESTION_TYPES.includes(p.question_type)) {
    return "Question type must be MC or Short Answer.";
  }
  if (!p.topic) return "Topic is required.";
  if (!p.sub_type) return "Sub-topic is required.";
  if (!GRADES.includes(p.grade)) return "Grade is invalid.";
  return null;
}

function validateProblem(p) {
  if (!p.latex_code) return "LaTeX code is required.";
  return validateLabels(p);
}

function isMissingSolutionColumn(error) {
  const message = (error && error.message) || "";
  return (
    message.toLowerCase().includes("solution_latex") ||
    message.toLowerCase().includes("answer_text") ||
    message.toLowerCase().includes("question_type")
  );
}

async function insertWithSolutionFallback(problem) {
  const payload = {
    latex_code: problem.latex_code,
    solution_latex: problem.solution_latex || null,
    answer_text: problem.answer_text || null,
    question_type: problem.question_type,
    difficulty: problem.difficulty,
    topic: problem.topic,
    sub_type: problem.sub_type,
    grade: problem.grade
  };

  let result = await supabase.from("problems").insert(payload).select("*").single();
  if (!result.error) return { ...result, solution_saved: true };

  if (!isMissingSolutionColumn(result.error)) return { ...result, solution_saved: false };

  const fallbackPayload = {
    latex_code: problem.latex_code,
    difficulty: problem.difficulty,
    topic: problem.topic,
    sub_type: problem.sub_type,
    grade: problem.grade
  };
  result = await supabase.from("problems").insert(fallbackPayload).select("*").single();
  return { ...result, solution_saved: false };
}

async function updateWithSolutionFallback(id, problem) {
  const payload = {
    latex_code: problem.latex_code,
    solution_latex: problem.solution_latex || null,
    answer_text: problem.answer_text || null,
    question_type: problem.question_type,
    difficulty: problem.difficulty,
    topic: problem.topic,
    sub_type: problem.sub_type,
    grade: problem.grade
  };

  let result = await supabase.from("problems").update(payload).eq("id", id).select("*").maybeSingle();
  if (!result.error) return { ...result, solution_saved: true };

  if (!isMissingSolutionColumn(result.error)) return { ...result, solution_saved: false };

  const fallbackPayload = {
    latex_code: problem.latex_code,
    difficulty: problem.difficulty,
    topic: problem.topic,
    sub_type: problem.sub_type,
    grade: problem.grade
  };
  result = await supabase.from("problems").update(fallbackPayload).eq("id", id).select("*").maybeSingle();
  return { ...result, solution_saved: false };
}

async function batchInsertWithSolutionFallback(baseLabels, items) {
  const withSolution = items.map((item) => ({
    latex_code: item.latex_code,
    solution_latex: item.solution_latex || null,
    answer_text: item.answer_text || null,
    question_type: baseLabels.question_type,
    difficulty: baseLabels.difficulty,
    topic: baseLabels.topic,
    sub_type: baseLabels.sub_type,
    grade: baseLabels.grade
  }));

  let result = await supabase.from("problems").insert(withSolution).select("id");
  if (!result.error) return { ...result, solution_saved: true };

  if (!isMissingSolutionColumn(result.error)) return { ...result, solution_saved: false };

  const withoutSolution = items.map((item) => ({
    latex_code: item.latex_code,
    difficulty: baseLabels.difficulty,
    topic: baseLabels.topic,
    sub_type: baseLabels.sub_type,
    grade: baseLabels.grade
  }));

  result = await supabase.from("problems").insert(withoutSolution).select("id");
  return { ...result, solution_saved: false };
}

function getGeminiOutputText(responseJson) {
  const candidates = Array.isArray(responseJson.candidates) ? responseJson.candidates : [];
  for (const candidate of candidates) {
    const parts = Array.isArray(candidate?.content?.parts) ? candidate.content.parts : [];
    for (const part of parts) {
      if (typeof part?.text === "string" && part.text.trim()) {
        return part.text;
      }
    }
  }
  return "";
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatNumberLike(original, value) {
  const isInt = !String(original).includes(".");
  if (isInt) return String(Math.trunc(value));
  const decimals = String(original).split(".")[1]?.length || 2;
  return Number(value).toFixed(decimals);
}

function buildReplacementMap(seedLatex, variantIndex) {
  const regex = /-?\d+(?:\.\d+)?/g;
  const all = seedLatex.match(regex) || [];
  const unique = [...new Set(all)];
  const map = new Map();

  unique.forEach((raw, i) => {
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;

    const delta = ((variantIndex + i) % 5) + 1;
    let next = parsed;

    if (parsed === 0) next = delta;
    else if (Math.abs(parsed) <= 2) next = parsed + Math.sign(parsed) * delta;
    else next = parsed + Math.sign(parsed) * (delta + 1);

    map.set(raw, formatNumberLike(raw, next));
  });

  return map;
}

function applyReplacementMap(seedLatex, map) {
  let result = seedLatex;
  for (const [from, to] of map.entries()) {
    const pattern = new RegExp(`(?<![\\\\\\w.])${escapeRegExp(from)}(?![\\\\\\w.])`, "g");
    result = result.replace(pattern, to);
  }
  return result;
}

function generateFallbackVariants(seedLatex, count) {
  const variants = [];
  for (let i = 0; i < count; i += 1) {
    const replacements = buildReplacementMap(seedLatex, i + 1);
    const latex_code = applyReplacementMap(seedLatex, replacements);
    const solution_latex = [
      "\\text{Fallback solution template:}",
      "\\text{Solve this variant using the same method as the seed question after number substitution.}"
    ].join("\n");

    variants.push({ latex_code, solution_latex });
  }
  return variants;
}

async function generateVariantsGemini(seedLatex, count) {
  const schema = {
    type: "object",
    properties: {
      variants: {
        type: "array",
        minItems: count,
        maxItems: count,
        items: {
          type: "object",
          properties: {
            latex_code: { type: "string" },
            solution_latex: { type: "string" }
          },
          required: ["latex_code", "solution_latex"]
        }
      }
    },
    required: ["variants"]
  };

  const prompt = [
    "Generate similar math questions from this seed.",
    "Keep structure and topic the same.",
    "Only change numbers/constants/signs.",
    "Provide concise worked solutions in LaTeX.",
    `Generate exactly ${count} variants.`,
    "",
    "Return strict JSON matching this shape:",
    "{\"variants\":[{\"latex_code\":\"...\",\"solution_latex\":\"...\"}]}",
    "",
    "Seed question LaTeX:",
    seedLatex
  ].join("\n");

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    })
  });

  const json = await response.json();
  if (!response.ok) {
    const msg = (json && json.error && json.error.message) || "Gemini request failed.";
    throw new Error(msg);
  }

  const text = getGeminiOutputText(json);
  if (!text) throw new Error("Model returned empty output.");

  const parsed = JSON.parse(text);
  const variants = Array.isArray(parsed.variants) ? parsed.variants : [];

  if (variants.length !== count) {
    throw new Error("Generated variant count mismatch.");
  }

  const cleaned = variants.map((item) => ({
    latex_code: String(item.latex_code || "").trim(),
    solution_latex: String(item.solution_latex || "").trim()
  }));

  if (cleaned.some((v) => !v.latex_code || !v.solution_latex)) {
    throw new Error("Generated output missing question or solution.");
  }

  return cleaned;
}

async function generateSolutionsGemini(questions) {
  const count = questions.length;
  const schema = {
    type: "object",
    properties: {
      solutions: {
        type: "array",
        minItems: count,
        maxItems: count,
        items: { type: "string" }
      }
    },
    required: ["solutions"]
  };

  const numberedQuestions = questions.map((q, i) => `Q${i + 1}: ${q}`).join("\n\n");
  const prompt = [
    "Generate LaTeX worked solutions for each question below.",
    "Keep answer concise and step-by-step.",
    "Return strict JSON as: {\"solutions\":[\"...\",\"...\"]}.",
    "",
    numberedQuestions
  ].join("\n");

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    })
  });

  const json = await response.json();
  if (!response.ok) {
    const msg = (json && json.error && json.error.message) || "Gemini request failed.";
    throw new Error(msg);
  }

  const text = getGeminiOutputText(json);
  if (!text) throw new Error("Model returned empty output.");

  const parsed = JSON.parse(text);
  const solutions = Array.isArray(parsed.solutions) ? parsed.solutions.map((s) => String(s || "").trim()) : [];
  if (solutions.length !== count || solutions.some((s) => !s)) {
    throw new Error("Generated solution count mismatch.");
  }
  return solutions;
}

function generateFallbackSolutions(questions) {
  return questions.map(() =>
    [
      "\\text{Fallback solution template:}",
      "\\text{Apply index laws, simplify coefficients, and rewrite with positive indices.}"
    ].join("\n")
  );
}

async function generateVariants(seedLatex, count) {
  if (!hasAIConfig) {
    if (!LOCAL_FALLBACK_ENABLED) {
      throw new Error("Gemini key is missing and fallback mode is disabled.");
    }
    return {
      variants: generateFallbackVariants(seedLatex, count),
      mode: "fallback",
      warning: "Gemini key not set. Used local fallback generator."
    };
  }

  try {
    const variants = await generateVariantsGemini(seedLatex, count);
    return { variants, mode: "gemini" };
  } catch (error) {
    if (!LOCAL_FALLBACK_ENABLED) throw error;
    return {
      variants: generateFallbackVariants(seedLatex, count),
      mode: "fallback",
      warning: `Gemini unavailable: ${error.message || "unknown error"}. Used local fallback generator.`
    };
  }
}

async function generateSolutions(questions) {
  if (!hasAIConfig) {
    if (!LOCAL_FALLBACK_ENABLED) {
      throw new Error("Gemini key is missing and fallback mode is disabled.");
    }
    return {
      solutions: generateFallbackSolutions(questions),
      mode: "fallback",
      warning: "Gemini key not set. Used local fallback solution generator."
    };
  }

  try {
    const solutions = await generateSolutionsGemini(questions);
    return { solutions, mode: "gemini" };
  } catch (error) {
    if (!LOCAL_FALLBACK_ENABLED) throw error;
    return {
      solutions: generateFallbackSolutions(questions),
      mode: "fallback",
      warning: `Gemini unavailable: ${error.message || "unknown error"}. Used local fallback solution generator.`
    };
  }
}

async function findProgressRow(studentId, combo) {
  const { data, error } = await supabase
    .from("student_learning_progress")
    .select("*")
    .eq("student_id", studentId)
    .eq("difficulty", combo.difficulty)
    .eq("topic", combo.topic)
    .eq("sub_type", combo.sub_type)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (data) return data;
  return {
    student_id: studentId,
    difficulty: combo.difficulty,
    topic: combo.topic,
    sub_type: combo.sub_type,
    streak_correct: 0,
    mastery_achieved: false,
    review_stage: 0,
    next_review_date: null,
    consolidation_due_date: null,
    correction_due_date: null,
    correction_wrong_streak: 0,
    ever_wrong: false,
    is_paused: false,
    pending_careless_retry: false,
    careless_retry_date: null
  };
}

async function hasOpenAlertForCombo(studentId, combo) {
  const { data, error } = await supabase
    .from("learning_alerts")
    .select("id")
    .eq("student_id", studentId)
    .eq("difficulty", combo.difficulty)
    .eq("topic", combo.topic)
    .eq("sub_type", combo.sub_type)
    .eq("is_resolved", false)
    .limit(1);
  if (error) throw new Error(error.message);
  return Array.isArray(data) && data.length > 0;
}

async function appendCarelessRetryAssignment(studentProfile, assignmentDate, combo) {
  const studentId = String(studentProfile.user_id || "").trim();
  if (!studentId) return;

  const assignments = await getAssignmentsForDate(studentId, assignmentDate);
  const usedQuestionIds = new Set(assignments.map((a) => Number(a.question_id)));
  const scopeRules = await fetchScopeRulesForStudent(studentId);
  const allRows = await fetchProblemPoolForStudentGrade(studentProfile.grade);
  const problemRows = applyScopeRulesToProblemRows(allRows, scopeRules);
  const { byCombo } = buildProblemPoolIndex(problemRows);
  const questionId = pickQuestionForCombo(byCombo, combo, usedQuestionIds);
  if (!Number.isInteger(questionId) || questionId <= 0) return;

  const slot = assignments.length + 1;
  const { error } = await supabase.from("daily_assignments").insert({
    student_id: studentId,
    assignment_date: assignmentDate,
    question_id: questionId,
    slot
  });
  if (error && String(error.code || "") !== "23505") {
    throw new Error(error.message);
  }
}

async function updateLearningProgressAfterSubmission(studentProfile, assignmentDate, problemRow, isCorrect, carelessError) {
  const combo = {
    difficulty: String(problemRow?.difficulty || "").trim(),
    topic: String(problemRow?.topic || "").trim(),
    sub_type: String(problemRow?.sub_type || "").trim()
  };
  if (!combo.difficulty || !combo.topic || !combo.sub_type) return;

  const studentId = studentProfile.user_id;
  const progress = await findProgressRow(studentId, combo);
  const next = { ...progress };

  const { data: sameDaySubs, error: sameDaySubsError } = await supabase
    .from("student_submissions")
    .select("is_correct, submitted_at, problems(difficulty,topic,sub_type)")
    .eq("student_id", studentId)
    .eq("assignment_date", assignmentDate)
    .order("submitted_at", { ascending: true });
  if (sameDaySubsError) throw new Error(sameDaySubsError.message);
  const comboDaySubs = (sameDaySubs || []).filter(
    (row) =>
      String(row?.problems?.difficulty || "").trim() === combo.difficulty &&
      String(row?.problems?.topic || "").trim() === combo.topic &&
      String(row?.problems?.sub_type || "").trim() === combo.sub_type
  );
  const wrongCountTodayForCombo = comboDaySubs.filter((row) => row.is_correct === false).length;
  const firstWrongOfTodayForCombo = wrongCountTodayForCombo === 1;

  if (isCorrect === true) {
    const wasCarelessRetry = next.pending_careless_retry && String(next.careless_retry_date || "") === assignmentDate;
    next.pending_careless_retry = false;
    next.careless_retry_date = null;
    next.correction_wrong_streak = 0;
    next.correction_due_date = null;
    next.is_paused = false;

    if (Number(next.review_stage || 0) >= 1) {
      if (Number(next.review_stage || 0) >= 6) {
        next.review_stage = 6;
        next.next_review_date = null;
      } else {
        next.review_stage = Number(next.review_stage || 0) + 1;
        const interval = reviewIntervalByStage(next.review_stage);
        next.next_review_date = addDaysDateString(assignmentDate, interval);
      }
      next.streak_correct = 2;
      next.mastery_achieved = true;
      next.consolidation_due_date = null;

      if (wasCarelessRetry && Number(next.review_stage || 0) >= 1 && next.next_review_date) {
        const stageInterval = reviewIntervalByStage(Number(next.review_stage || 1));
        const shortened = Math.max(1, Math.floor(stageInterval / 2));
        next.next_review_date = addDaysDateString(assignmentDate, shortened);
      }
    } else {
      next.streak_correct = Math.min(2, Number(next.streak_correct || 0) + 1);
      if (Number(next.streak_correct || 0) >= 2) {
        next.mastery_achieved = true;
        next.review_stage = 1;
        next.next_review_date = addDaysDateString(assignmentDate, reviewIntervalByStage(1));
        next.consolidation_due_date = null;
      } else {
        next.mastery_achieved = false;
        next.review_stage = 0;
        next.next_review_date = null;
        next.consolidation_due_date = addDaysDateString(assignmentDate, 1);
      }
    }
  } else if (isCorrect === false) {
    next.ever_wrong = true;

    if (carelessError) {
      next.pending_careless_retry = true;
      next.careless_retry_date = assignmentDate;
      await appendCarelessRetryAssignment(studentProfile, assignmentDate, combo);
    } else {
      next.pending_careless_retry = false;
      next.careless_retry_date = null;
      next.streak_correct = 0;
      next.consolidation_due_date = null;
      next.correction_due_date = addDaysDateString(assignmentDate, 1);
      if (firstWrongOfTodayForCombo) {
        next.correction_wrong_streak = Number(next.correction_wrong_streak || 0) + 1;
      }

      if (Number(next.review_stage || 0) >= 1) {
        const current = Number(next.review_stage || 1);
        if (current <= 1) {
          next.mastery_achieved = false;
          next.review_stage = 0;
          next.next_review_date = null;
        } else {
          let fallbackStage = Math.max(1, current - 2);
          if (current === 2) fallbackStage = 1;
          next.review_stage = fallbackStage;
          next.next_review_date = addDaysDateString(assignmentDate, reviewIntervalByStage(fallbackStage));
        }
      } else {
        next.review_stage = 0;
        next.next_review_date = null;
      }

      if (Number(next.correction_wrong_streak || 0) >= 3) {
        next.is_paused = true;
        if (!(await hasOpenAlertForCombo(studentId, combo))) {
          await createLearningAlert(
            studentId,
            combo,
            `Student needs teacher support on ${combo.difficulty} / ${combo.topic} / ${combo.sub_type} (repeated correction errors).`
          );
        }
      }
    }
  }

  await upsertStudentLearningProgress(next);
}

app.get("/api/meta", (_req, res) => {
  res.json({
    difficulties: DIFF,
    grades: GRADES,
    question_types: QUESTION_TYPES,
    ai_enabled: hasGeneratorConfig,
    ai_provider: hasAIConfig ? "gemini" : "fallback",
    school_domain: SCHOOL_EMAIL_DOMAIN || null
  });
});

app.get("/api/meta/scope-options", ensureCloud, requireAuth, requireRole("teacher"), async (_req, res) => {
  const { data, error } = await supabase.from("problems").select("difficulty,topic");
  if (error) return res.status(500).json({ error: error.message });

  const byDifficulty = {};
  for (const diff of DIFF) byDifficulty[diff] = [];
  const allTopicSet = new Set();
  for (const row of data || []) {
    const difficulty = String(row.difficulty || "").trim();
    const topic = String(row.topic || "").trim();
    if (!difficulty || !topic) continue;
    allTopicSet.add(topic);
    if (!byDifficulty[difficulty]) byDifficulty[difficulty] = [];
    if (!byDifficulty[difficulty].includes(topic)) byDifficulty[difficulty].push(topic);
  }
  for (const diff of Object.keys(byDifficulty)) {
    byDifficulty[diff].sort((a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }));
  }
  const allTopics = [...allTopicSet].sort((a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }));

  return res.json({ topics_by_difficulty: byDifficulty, all_topics: allTopics });
});

app.get("/api/client-config", ensureClientAuth, (_req, res) => {
  res.json({
    supabase_url: SUPABASE_URL,
    supabase_anon_key: SUPABASE_ANON_KEY,
    school_domain: SCHOOL_EMAIL_DOMAIN || null,
    timezone: APP_TIMEZONE,
    google_client_id: GOOGLE_CLIENT_ID || null
  });
});

app.post("/api/auth/register", ensureCloud, ensureClientAuth, async (req, res) => {
  if (DISABLE_SIGNUP || isAdminUploadOnlyMode) {
    return res.status(403).json({ error: "Sign up is disabled on this deployment." });
  }
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");
  const fullName = String(req.body.full_name || "").trim();
  const grade = String(req.body.grade || "").trim();
  const className = String(req.body.class_name || "").trim();

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }
  if (!isAllowedSchoolEmail(email)) {
    return res.status(400).json({ error: "Use your school email account to register." });
  }

  const role = isTeacherEmail(email) ? "teacher" : "student";
  const metadata = {
    full_name: fullName || email,
    role,
    grade: role === "student" ? grade || null : null,
    class_name: role === "student" ? className || null : null
  };

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata
  });

  if (error) return res.status(400).json({ error: error.message });

  const profilePayload = {
    user_id: data.user.id,
    email,
    full_name: metadata.full_name,
    role,
    grade: metadata.grade,
    class_name: metadata.class_name
  };
  const { error: profileError } = await supabase.from("user_profiles").upsert(profilePayload, { onConflict: "user_id" });
  if (profileError) return res.status(500).json({ error: profileError.message });

  return res.status(201).json({
    message: role === "teacher" ? "Teacher account created." : "Student account created.",
    role
  });
});

app.get("/api/auth/me", ensureCloud, requireAuth, async (req, res) => {
  const base = {
    id: req.profile.user_id,
    email: req.profile.email,
    full_name: req.profile.full_name,
    role: req.profile.role,
    grade: req.profile.grade,
    class_name: req.profile.class_name || null
  };
  if (req.profile.role !== "student") return res.json(base);

  try {
    const [avatarData, frameData] = await Promise.all([
      fetchAvatarCatalogForStudent(req.profile.user_id),
      fetchFrameCatalogForStudent(req.profile.user_id).catch(() => [])
    ]);
    const selected = (avatarData.avatars || []).find((a) => Number(a.id) === Number(avatarData.selected_avatar_id)) || null;
    const selectedFrame = (frameData || []).find((f) => f.selected) || null;
    return res.json({
      ...base,
      token_balance: avatarData.token_balance,
      selected_avatar: selected,
      selected_frame: selectedFrame
    });
  } catch (_error) {
    return res.json(base);
  }
});

app.get("/api/student/avatars", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  try {
    const data = await fetchAvatarCatalogForStudent(req.profile.user_id);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to load avatar shop." });
  }
});

app.post("/api/student/avatars/select", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  const avatarId = Number(req.body.avatar_id);
  if (!Number.isInteger(avatarId) || avatarId <= 0) {
    return res.status(400).json({ error: "Valid avatar_id is required." });
  }
  try {
    await setSelectedAvatarForStudent(req.profile.user_id, avatarId);
    const data = await fetchAvatarCatalogForStudent(req.profile.user_id);
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to select avatar." });
  }
});

app.post("/api/student/avatars/purchase", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  const avatarId = Number(req.body.avatar_id);
  if (!Number.isInteger(avatarId) || avatarId <= 0) {
    return res.status(400).json({ error: "Valid avatar_id is required." });
  }
  try {
    await purchaseAvatarForStudent(req.profile.user_id, avatarId);
    await setSelectedAvatarForStudent(req.profile.user_id, avatarId);
    const data = await fetchAvatarCatalogForStudent(req.profile.user_id);
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to purchase avatar." });
  }
});

app.get("/api/student/gacha/state", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  try {
    const state = await fetchGachaStateForStudent(req.profile.user_id);
    return res.json(state);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to load gacha state." });
  }
});

app.post("/api/student/gacha/draw", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  const pack = String(req.body.pack || "").trim().toLowerCase();
  try {
    if (pack === "character") {
      const result = await drawCharacterGacha(req.profile.user_id);
      return res.json(result);
    }
    if (pack === "frame") {
      const result = await drawFrameGacha(req.profile.user_id);
      return res.json(result);
    }
    return res.status(400).json({ error: "pack must be 'character' or 'frame'." });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Draw failed." });
  }
});

app.post("/api/student/frames/select", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  const frameId = Number(req.body.frame_id);
  if (!Number.isInteger(frameId) || frameId <= 0) {
    return res.status(400).json({ error: "Valid frame_id is required." });
  }
  try {
    await setSelectedFrameForStudent(req.profile.user_id, frameId);
    const state = await fetchGachaStateForStudent(req.profile.user_id);
    return res.json(state);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to select frame." });
  }
});

app.get("/api/student/daily", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  const date = String(req.query.date || "").trim() || getTodayDateString();
  const applyLatest = String(req.query.apply_latest || "").trim() === "1";

  try {
    let assignments = [];
    if (applyLatest) {
      try {
        assignments = await withTimeout(redistributePendingAssignmentsForDate(req.profile, date), 9000, "daily_scheduler");
      } catch (_slowError) {
        assignments = await getAssignmentsForDate(req.profile.user_id, date);
        if (!assignments.length) {
          assignments = await withTimeout(ensureDailyAssignments(req.profile, date), 5000, "daily_scheduler_fallback");
        }
      }
    } else {
      assignments = await withTimeout(ensureDailyAssignments(req.profile, date), 9000, "daily_scheduler_stable");
    }
    const questionIds = assignments.map((a) => Number(a.question_id)).filter((id) => Number.isInteger(id));

    const { data: submissions, error: submissionsError } = await supabase
      .from("student_submissions")
      .select("id, question_id, answer_text, is_correct, submitted_at, time_spent_seconds")
      .eq("student_id", req.profile.user_id)
      .eq("assignment_date", date)
      .in("question_id", questionIds);

    if (submissionsError) return res.status(500).json({ error: submissionsError.message });

    const submissionMap = new Map();
    for (const row of submissions || []) {
      submissionMap.set(Number(row.question_id), row);
    }

    const output = assignments.map((item) => {
      const submission = submissionMap.get(Number(item.question_id));
      return {
        assignment_id: item.id,
        slot: item.slot,
        assignment_date: item.assignment_date,
        question: item.problems,
        submission: submission || null
      };
    });

    return res.json({ date, assignments: output });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to build daily assignment." });
  }
});

app.post("/api/student/daily/extend", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  const date = String(req.body.date || "").trim() || getTodayDateString();
  const count = Number(req.body.count || 5);

  if (!Number.isInteger(count) || count <= 0 || count > 20) {
    return res.status(400).json({ error: "count must be an integer between 1 and 20." });
  }

  try {
    const assignments = await appendAssignmentsForStudentDate(req.profile, date, count);
    return res.json({ date, total_assignments: assignments.length });
  } catch (error) {
    const msg = String(error?.message || "");
    if (msg.includes("daily_assignments_slot_check")) {
      return res.status(500).json({
        error:
          "Database still limits daily slots to 1-5. Please run the updated SQL migration to change daily_assignments slot check to slot > 0."
      });
    }
    return res.status(500).json({ error: error.message || "Failed to append assignments." });
  }
});

app.post("/api/student/daily/refresh-latest", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  const date = String(req.body.date || "").trim() || getTodayDateString();
  const count = Number(req.body.count || 5);
  if (!Number.isInteger(count) || count <= 0 || count > 20) {
    return res.status(400).json({ error: "count must be an integer between 1 and 20." });
  }

  try {
    const assignments = await withTimeout(
      refreshTodayAssignmentsByLatestRules(req.profile, date, count),
      12000,
      "daily_refresh_latest"
    );
    return res.json({ date, total_assignments: assignments.length });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to refresh daily assignments by latest rules." });
  }
});

app.post("/api/student/submit", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  const questionId = Number(req.body.question_id);
  const assignmentDate = String(req.body.assignment_date || "").trim() || getTodayDateString();
  const answerText = String(req.body.answer_text || "").trim();
  const timeSpentSeconds = normalizeTimeSpentSeconds(req.body.time_spent_seconds);
  const carelessError = req.body.careless_error === true;

  if (!Number.isInteger(questionId) || questionId <= 0) {
    return res.status(400).json({ error: "Valid question_id is required." });
  }
  if (!answerText) {
    return res.status(400).json({ error: "answer_text is required." });
  }

  const { data: assignment, error: assignmentError } = await supabase
    .from("daily_assignments")
    .select("question_id")
    .eq("student_id", req.profile.user_id)
    .eq("assignment_date", assignmentDate)
    .eq("question_id", questionId)
    .maybeSingle();

  if (assignmentError) return res.status(500).json({ error: assignmentError.message });
  if (!assignment) {
    return res.status(403).json({ error: "This question is not assigned to you for the selected date." });
  }

  const { data: daySubmissions, error: existingError } = await supabase
    .from("student_submissions")
    .select("id,question_id,is_correct,submitted_at")
    .eq("student_id", req.profile.user_id)
    .eq("assignment_date", assignmentDate)
    .order("submitted_at", { ascending: true })
    .order("id", { ascending: true });
  if (existingError) return res.status(500).json({ error: existingError.message });
  const existingSubmission = (daySubmissions || []).find((row) => Number(row?.question_id) === questionId);
  if (existingSubmission) {
    return res.status(409).json({ error: "Answer already submitted. Re-attempt is not allowed." });
  }
  const preSubmitCount = Array.isArray(daySubmissions) ? daySubmissions.length : 0;
  const prevCorrectStreak = computeTrailingCorrectStreak(daySubmissions || []);

  const { data: problem, error: problemError } = await supabase
    .from("problems")
    .select("answer_text,difficulty,topic,sub_type")
    .eq("id", questionId)
    .maybeSingle();
  if (problemError) return res.status(500).json({ error: problemError.message });

  const isCorrect = compareAnswer(answerText, problem?.answer_text);
  const payload = {
    student_id: req.profile.user_id,
    assignment_date: assignmentDate,
    question_id: questionId,
    answer_text: answerText,
    is_correct: isCorrect,
    time_spent_seconds: timeSpentSeconds
  };

  const { data, error } = await supabase
    .from("student_submissions")
    .insert(payload)
    .select("assignment_date, question_id, answer_text, is_correct, submitted_at")
    .single();
  if (error) {
    if (String(error.code || "") === "23505") {
      return res.status(409).json({ error: "Answer already submitted. Re-attempt is not allowed." });
    }
    return res.status(500).json({ error: error.message });
  }

  try {
    await updateLearningProgressAfterSubmission(req.profile, assignmentDate, problem || {}, isCorrect, carelessError);
  } catch (progressError) {
    return res.status(500).json({ error: progressError.message || "Submission saved, but learning progress update failed." });
  }
  let tokenReward = 0;
  let tokenBalance = null;
  try {
    const nextCorrectStreak = isCorrect ? prevCorrectStreak + 1 : 0;
    const questionReward = computeQuestionTokenReward({
      isCorrect,
      timeSpentSeconds,
      nextCorrectStreak
    });
    const reachedFiveToday = preSubmitCount < 5 && preSubmitCount + 1 >= 5;
    const completionBonus = reachedFiveToday
      ? await computeDailyCompletionBonus(req.profile.user_id, assignmentDate)
      : 0;
    tokenReward = questionReward + completionBonus;
    tokenBalance = await grantStudentTokens(req.profile.user_id, tokenReward, "question_submission", {
      assignment_date: assignmentDate,
      question_id: questionId,
      is_correct: isCorrect === true,
      reward_breakdown: {
        question: questionReward,
        completion_streak: completionBonus,
        correct_streak_after_submit: nextCorrectStreak
      }
    });
  } catch (_tokenError) {
    tokenReward = 0;
    tokenBalance = null;
  }

  return res.json({
    ...data,
    token_reward: tokenReward,
    token_balance: tokenBalance
  });
});

app.get("/api/student/stats", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  const { data: submissions, error } = await supabase
    .from("student_submissions")
    .select("assignment_date,is_correct, time_spent_seconds, submitted_at")
    .eq("student_id", req.profile.user_id);
  if (error) return res.status(500).json({ error: error.message });

  const submissionRows = Array.isArray(submissions) ? submissions : [];
  const stats = computeSubmissionStats(submissionRows);
  const todayKey = getTodayDateString();
  const todayRows = submissionRows.filter((row) => String(row.assignment_date || "") === todayKey);
  const submittedToday = todayRows.length;
  const correctToday = todayRows.filter((row) => row.is_correct === true).length;
  const finishedToday = submittedToday >= 5;
  let tokenBalance = 0;
  try {
    const wallet = await ensureStudentTokenWallet(req.profile.user_id);
    tokenBalance = Number(wallet.balance || 0);
  } catch (_error) {
    tokenBalance = 0;
  }
  let radar = { labels: ["Combo", "Aim", "Flash", "Grind", "Fortune"], student: {}, class_avg: {} };
  let classTitles = [];
  try {
    const classAnalytics = await buildClassAnalytics(req.profile.class_name, req.profile.user_id, submissionRows);
    radar = {
      labels: classAnalytics.labels,
      student: classAnalytics.student,
      class_avg: classAnalytics.class_avg
    };
    classTitles = classAnalytics.titles || [];
  } catch (_e) {
    // keep stats endpoint available even if class analytics fails
  }
  return res.json({
    student_id: req.profile.user_id,
    student_name: req.profile.full_name,
    grade: req.profile.grade,
    class_name: req.profile.class_name || null,
    token_balance: tokenBalance,
    today_date: todayKey,
    submitted_today: submittedToday,
    correct_today: correctToday,
    finished_today: finishedToday,
    radar,
    class_titles: classTitles,
    ...stats
  });
});

app.get("/api/student/review", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  const filterDifficulty = String(req.query.difficulty || "").trim();
  const filterTopic = String(req.query.topic || "").trim().toLowerCase();
  const filterResult = String(req.query.result || "").trim().toLowerCase();

  const { data, error } = await supabase
    .from("student_submissions")
    .select(
      "id, assignment_date, question_id, answer_text, is_correct, submitted_at, time_spent_seconds, problems(question_type,difficulty,topic,sub_type,grade,latex_code,answer_text,solution_latex)"
    )
    .eq("student_id", req.profile.user_id)
    .order("submitted_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  let rows = Array.isArray(data) ? data : [];
  if (filterDifficulty) {
    rows = rows.filter((row) => String(row.problems?.difficulty || "") === filterDifficulty);
  }
  if (filterTopic) {
    rows = rows.filter((row) => String(row.problems?.topic || "").toLowerCase().includes(filterTopic));
  }
  if (filterResult === "correct") {
    rows = rows.filter((row) => row.is_correct === true);
  } else if (filterResult === "wrong") {
    rows = rows.filter((row) => row.is_correct === false);
  }

  const stats = computeSubmissionStats(rows);
  return res.json({ count: rows.length, stats, records: rows });
});

app.get("/api/student/alerts", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  const { data, error } = await supabase
    .from("learning_alerts")
    .select("id,difficulty,topic,sub_type,message,created_at")
    .eq("student_id", req.profile.user_id)
    .eq("is_resolved", false)
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ alerts: Array.isArray(data) ? data : [] });
});

app.get("/api/teacher/alerts", ensureCloud, requireAuth, requireRole("teacher"), async (_req, res) => {
  const { data, error } = await supabase
    .from("learning_alerts")
    .select("id,student_id,difficulty,topic,sub_type,message,created_at,user_profiles(full_name,email,grade)")
    .eq("is_resolved", false)
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ alerts: Array.isArray(data) ? data : [] });
});

app.post("/api/teacher/alerts/:alertId/resolve", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const alertId = Number(req.params.alertId);
  if (!Number.isInteger(alertId) || alertId <= 0) return res.status(400).json({ error: "Valid alertId is required." });

  const { data: alertRow, error: alertError } = await supabase
    .from("learning_alerts")
    .select("*")
    .eq("id", alertId)
    .maybeSingle();
  if (alertError) return res.status(500).json({ error: alertError.message });
  if (!alertRow) return res.status(404).json({ error: "Alert not found." });

  const { error: updateAlertError } = await supabase.from("learning_alerts").update({ is_resolved: true }).eq("id", alertId);
  if (updateAlertError) return res.status(500).json({ error: updateAlertError.message });

  const { error: unpauseError } = await supabase
    .from("student_learning_progress")
    .update({ is_paused: false, correction_wrong_streak: 0, correction_due_date: getTodayDateString() })
    .eq("student_id", alertRow.student_id)
    .eq("difficulty", alertRow.difficulty)
    .eq("topic", alertRow.topic)
    .eq("sub_type", alertRow.sub_type);
  if (unpauseError) return res.status(500).json({ error: unpauseError.message });

  return res.json({ resolved: true });
});

app.get("/api/teacher/overview", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const date = String(req.query.date || "").trim() || getTodayDateString();
  const groupId = Number(req.query.group_id || 0);

  const { data: students, error: studentError } = await supabase
    .from("user_profiles")
    .select("user_id, full_name, email, grade, class_name")
    .eq("role", "student")
    .order("full_name", { ascending: true });

  if (studentError) return res.status(500).json({ error: studentError.message });
  let filteredStudents = Array.isArray(students) ? students : [];

  if (Number.isInteger(groupId) && groupId > 0) {
    const { data: memberships, error: membershipError } = await supabase
      .from("student_group_memberships")
      .select("student_id")
      .eq("group_id", groupId);
    if (membershipError) return res.status(500).json({ error: membershipError.message });
    const memberIds = new Set((memberships || []).map((m) => String(m.student_id || "")).filter(Boolean));
    filteredStudents = filteredStudents.filter((s) => memberIds.has(String(s.user_id || "")));
  }
  const studentIds = filteredStudents.map((s) => String(s.user_id || "")).filter(Boolean);
  const studentIdSet = new Set(studentIds);
  if (!studentIds.length) {
    return res.json({ date, group_id: groupId > 0 ? groupId : null, total_students: 0, students: [] });
  }

  const { data: assignments, error: assignmentError } = await supabase
    .from("daily_assignments")
    .select("student_id, question_id")
    .eq("assignment_date", date);
  if (assignmentError) return res.status(500).json({ error: assignmentError.message });

  const { data: submissions, error: submissionError } = await supabase
    .from("student_submissions")
    .select("student_id, question_id, is_correct")
    .eq("assignment_date", date);
  if (submissionError) return res.status(500).json({ error: submissionError.message });

  const { data: allSubmissions, error: allSubmissionError } = await supabase
    .from("student_submissions")
    .select("student_id, assignment_date, is_correct, time_spent_seconds")
    .in("student_id", studentIds);
  if (allSubmissionError) return res.status(500).json({ error: allSubmissionError.message });

  const { data: alerts, error: alertError } = await supabase
    .from("learning_alerts")
    .select("student_id,id")
    .in("student_id", studentIds)
    .eq("is_resolved", false);
  if (alertError) return res.status(500).json({ error: alertError.message });

  const assignedCountByStudent = new Map();
  const submittedCountByStudent = new Map();
  const correctCountByStudent = new Map();
  const answeredCountByStudent = new Map();
  const correctTotalByStudent = new Map();
  const timeSumByStudent = new Map();
  const timeCountByStudent = new Map();
  const perDateDoneCountByStudent = new Map();
  const alertCountByStudent = new Map();

  for (const row of assignments || []) {
    const key = row.student_id;
    if (!studentIdSet.has(String(key || ""))) continue;
    assignedCountByStudent.set(key, (assignedCountByStudent.get(key) || 0) + 1);
  }
  for (const row of submissions || []) {
    const key = row.student_id;
    if (!studentIdSet.has(String(key || ""))) continue;
    submittedCountByStudent.set(key, (submittedCountByStudent.get(key) || 0) + 1);
    if (row.is_correct === true) {
      correctCountByStudent.set(key, (correctCountByStudent.get(key) || 0) + 1);
    }
  }
  for (const row of allSubmissions || []) {
    const key = row.student_id;
    if (!studentIdSet.has(String(key || ""))) continue;
    answeredCountByStudent.set(key, (answeredCountByStudent.get(key) || 0) + 1);
    if (row.is_correct === true) {
      correctTotalByStudent.set(key, (correctTotalByStudent.get(key) || 0) + 1);
    }
    const sec = Number(row.time_spent_seconds || 0);
    if (Number.isFinite(sec) && sec > 0) {
      timeSumByStudent.set(key, (timeSumByStudent.get(key) || 0) + sec);
      timeCountByStudent.set(key, (timeCountByStudent.get(key) || 0) + 1);
    }

    if (!perDateDoneCountByStudent.has(key)) perDateDoneCountByStudent.set(key, new Map());
    const dkey = toDateKey(row.assignment_date);
    if (dkey) {
      const dmap = perDateDoneCountByStudent.get(key);
      dmap.set(dkey, (dmap.get(dkey) || 0) + 1);
    }
  }
  for (const row of alerts || []) {
    const key = row.student_id;
    if (!studentIdSet.has(String(key || ""))) continue;
    alertCountByStudent.set(key, (alertCountByStudent.get(key) || 0) + 1);
  }

  const overview = filteredStudents.map((student) => {
    const assigned = assignedCountByStudent.get(student.user_id) || 0;
    const submitted = submittedCountByStudent.get(student.user_id) || 0;
    const correct = correctCountByStudent.get(student.user_id) || 0;
    const completionRate = assigned > 0 ? Math.round((submitted / assigned) * 100) : 0;
    const accuracyRate = submitted > 0 ? Math.round((correct / submitted) * 100) : 0;
    const questionsAnswered = answeredCountByStudent.get(student.user_id) || 0;
    const totalCorrect = correctTotalByStudent.get(student.user_id) || 0;
    const correctPercentage = questionsAnswered > 0 ? Math.round((totalCorrect / questionsAnswered) * 100) : 0;
    const avgTime =
      (timeCountByStudent.get(student.user_id) || 0) > 0
        ? Math.round((timeSumByStudent.get(student.user_id) || 0) / (timeCountByStudent.get(student.user_id) || 1))
        : 0;
    const doneDateMap = perDateDoneCountByStudent.get(student.user_id) || new Map();
    const streakDays = computeLongestStreakDaysFromDateSet(
      new Set([...doneDateMap.entries()].filter(([, count]) => Number(count) >= 5).map(([dateKey]) => dateKey))
    );
    const finishedToday = submitted >= 5;
    const activeAlerts = alertCountByStudent.get(student.user_id) || 0;

    return {
      student_id: student.user_id,
      full_name: student.full_name,
      email: student.email,
      grade: student.grade,
      class_name: student.class_name || null,
      assigned,
      submitted,
      correct,
      completion_rate: completionRate,
      accuracy_rate: accuracyRate,
      questions_answered: questionsAnswered,
      correct_percentage: correctPercentage,
      average_time_seconds: avgTime,
      longest_streak_days: streakDays,
      finished_today: finishedToday,
      active_alerts: activeAlerts
    };
  });

  return res.json({
    date,
    group_id: Number.isInteger(groupId) && groupId > 0 ? groupId : null,
    total_students: overview.length,
    students: overview
  });
});

app.delete("/api/teacher/students/:studentId/records", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const studentId = String(req.params.studentId || "").trim();
  if (!studentId) return res.status(400).json({ error: "studentId is required." });

  const { error: submissionError } = await supabase.from("student_submissions").delete().eq("student_id", studentId);
  if (submissionError) return res.status(500).json({ error: submissionError.message });

  const { error: assignmentError } = await supabase.from("daily_assignments").delete().eq("student_id", studentId);
  if (assignmentError) return res.status(500).json({ error: assignmentError.message });

  const { error: progressError } = await supabase.from("student_learning_progress").delete().eq("student_id", studentId);
  if (progressError) return res.status(500).json({ error: progressError.message });

  const { error: alertError } = await supabase.from("learning_alerts").delete().eq("student_id", studentId);
  if (alertError) return res.status(500).json({ error: alertError.message });

  return res.json({ message: "Student records deleted." });
});

app.get("/api/teacher/students/:studentId/stats", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const studentId = String(req.params.studentId || "").trim();
  if (!studentId) return res.status(400).json({ error: "studentId is required." });

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("user_id, full_name, email, grade, class_name")
    .eq("user_id", studentId)
    .eq("role", "student")
    .maybeSingle();
  if (profileError) return res.status(500).json({ error: profileError.message });
  if (!profile) return res.status(404).json({ error: "Student not found." });

  const { data: submissions, error: submissionError } = await supabase
    .from("student_submissions")
    .select(
      "id, assignment_date, question_id, answer_text, is_correct, submitted_at, time_spent_seconds, problems(question_type,difficulty,topic,sub_type,grade,latex_code,answer_text,solution_latex)"
    )
    .eq("student_id", studentId)
    .order("submitted_at", { ascending: false });
  if (submissionError) return res.status(500).json({ error: submissionError.message });

  const rows = Array.isArray(submissions) ? submissions : [];
  const stats = computeSubmissionStats(rows);
  let radar = { labels: ["Combo", "Aim", "Flash", "Grind", "Fortune"], student: {}, class_avg: {} };
  let classTitles = [];
  try {
    const classAnalytics = await buildClassAnalytics(profile.class_name, profile.user_id, rows);
    radar = { labels: classAnalytics.labels, student: classAnalytics.student, class_avg: classAnalytics.class_avg };
    classTitles = classAnalytics.titles || [];
  } catch (_e) {
    // keep endpoint available
  }
  return res.json({
    student: profile,
    stats,
    records: rows,
    radar,
    class_titles: classTitles
  });
});

app.put("/api/teacher/students/:studentId/class", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const studentId = String(req.params.studentId || "").trim();
  const className = String(req.body.class_name || "").trim();
  if (!studentId) return res.status(400).json({ error: "studentId is required." });
  const { error } = await supabase
    .from("user_profiles")
    .update({ class_name: className || null })
    .eq("user_id", studentId)
    .eq("role", "student");
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ student_id: studentId, class_name: className || null });
});

app.get("/api/teacher/groups", ensureCloud, requireAuth, requireRole("teacher"), async (_req, res) => {
  const { data: groups, error: groupError } = await supabase
    .from("study_groups")
    .select("id, name, created_at")
    .order("name", { ascending: true });
  if (groupError) return res.status(500).json({ error: groupError.message });

  const { data: members, error: memberError } = await supabase
    .from("student_group_memberships")
    .select("group_id, student_id");
  if (memberError) return res.status(500).json({ error: memberError.message });

  const countMap = new Map();
  for (const row of members || []) {
    const key = Number(row.group_id);
    countMap.set(key, (countMap.get(key) || 0) + 1);
  }

  const output = (groups || []).map((g) => ({
    ...g,
    member_count: countMap.get(Number(g.id)) || 0
  }));
  return res.json(output);
});

app.post("/api/teacher/groups", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const name = String(req.body.name || "").trim();
  if (!name) return res.status(400).json({ error: "Group name is required." });

  const { data, error } = await supabase.from("study_groups").insert({ name }).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
});

app.get("/api/teacher/students/:studentId/groups", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const studentId = String(req.params.studentId || "").trim();
  if (!studentId) return res.status(400).json({ error: "studentId is required." });

  const { data, error } = await supabase
    .from("student_group_memberships")
    .select("group_id, study_groups(id,name)")
    .eq("student_id", studentId);
  if (error) return res.status(500).json({ error: error.message });
  return res.json(Array.isArray(data) ? data : []);
});

app.put("/api/teacher/students/:studentId/groups", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const studentId = String(req.params.studentId || "").trim();
  if (!studentId) return res.status(400).json({ error: "studentId is required." });

  const groupIds = Array.isArray(req.body.group_ids)
    ? req.body.group_ids.map((x) => Number(x)).filter((x) => Number.isInteger(x) && x > 0)
    : [];

  const { error: clearError } = await supabase.from("student_group_memberships").delete().eq("student_id", studentId);
  if (clearError) return res.status(500).json({ error: clearError.message });

  if (!groupIds.length) return res.json({ assigned: 0 });

  const inserts = groupIds.map((groupId) => ({ student_id: studentId, group_id: groupId }));
  const { data, error } = await supabase.from("student_group_memberships").insert(inserts).select("id");
  if (error) return res.status(500).json({ error: error.message });

  return res.json({ assigned: (data || []).length });
});

app.get("/api/teacher/groups/:groupId/stats", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const groupId = Number(req.params.groupId);
  if (!Number.isInteger(groupId) || groupId <= 0) {
    return res.status(400).json({ error: "Valid groupId is required." });
  }

  const { data: group, error: groupError } = await supabase.from("study_groups").select("*").eq("id", groupId).maybeSingle();
  if (groupError) return res.status(500).json({ error: groupError.message });
  if (!group) return res.status(404).json({ error: "Group not found." });

  const { data: members, error: memberError } = await supabase
    .from("student_group_memberships")
    .select("student_id, user_profiles(full_name,email,grade)")
    .eq("group_id", groupId);
  if (memberError) return res.status(500).json({ error: memberError.message });

  const { data: scopes, error: scopeError } = await supabase
    .from("study_group_scopes")
    .select("id,difficulty,min_difficulty,max_difficulty,topic,sub_type")
    .eq("group_id", groupId)
    .order("max_difficulty", { ascending: true })
    .order("topic", { ascending: true })
    .order("sub_type", { ascending: true });
  if (scopeError) return res.status(500).json({ error: scopeError.message });

  const studentIds = (members || []).map((m) => m.student_id).filter(Boolean);
  if (!studentIds.length) {
    return res.json({ group, stats: computeSubmissionStats([]), members: [] });
  }

  const { data: submissions, error: submissionError } = await supabase
    .from("student_submissions")
    .select("student_id, is_correct, time_spent_seconds")
    .in("student_id", studentIds);
  if (submissionError) return res.status(500).json({ error: submissionError.message });

  const memberStats = studentIds.map((studentId) => {
    const rows = (submissions || []).filter((s) => s.student_id === studentId);
    const stats = computeSubmissionStats(rows);
    const profile = (members || []).find((m) => m.student_id === studentId)?.user_profiles || {};
    return {
      student_id: studentId,
      full_name: profile.full_name || "",
      email: profile.email || "",
      grade: profile.grade || "",
      ...stats
    };
  });

  const groupStats = computeSubmissionStats(Array.isArray(submissions) ? submissions : []);
  return res.json({
    group,
    scope_rules: Array.isArray(scopes) ? scopes : [],
    stats: groupStats,
    members: memberStats
  });
});

app.get("/api/teacher/groups/:groupId/scope", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const groupId = Number(req.params.groupId);
  if (!Number.isInteger(groupId) || groupId <= 0) {
    return res.status(400).json({ error: "Valid groupId is required." });
  }

  const { data: group, error: groupError } = await supabase.from("study_groups").select("id,name").eq("id", groupId).maybeSingle();
  if (groupError) return res.status(500).json({ error: groupError.message });
  if (!group) return res.status(404).json({ error: "Group not found." });

  const { data, error } = await supabase
    .from("study_group_scopes")
    .select("id,difficulty,min_difficulty,max_difficulty,topic,sub_type")
    .eq("group_id", groupId)
    .order("max_difficulty", { ascending: true })
    .order("topic", { ascending: true })
    .order("sub_type", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });

  return res.json({ group, scope_rules: Array.isArray(data) ? data : [] });
});

app.put("/api/teacher/groups/:groupId/scope", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const groupId = Number(req.params.groupId);
  if (!Number.isInteger(groupId) || groupId <= 0) {
    return res.status(400).json({ error: "Valid groupId is required." });
  }

  const incoming = Array.isArray(req.body.scopes) ? req.body.scopes : [];
  const scopes = incoming
    .map((row) => ({
      min_difficulty: String(row?.min_difficulty || "").trim(),
      max_difficulty: String(row?.max_difficulty || row?.difficulty || "").trim(),
      topic: String(row?.topic || "").trim(),
      sub_type: String(row?.sub_type || "").trim()
    }))
    .filter((row) => row.max_difficulty && row.topic);

  const diffIndex = new Map(DIFF.map((d, i) => [d, i]));
  const dedup = new Map();
  for (const row of scopes) {
    const minDifficulty = row.min_difficulty && diffIndex.has(row.min_difficulty) ? row.min_difficulty : DIFF[0];
    const maxDifficulty = row.max_difficulty;
    const minIdx = diffIndex.has(minDifficulty) ? diffIndex.get(minDifficulty) : 0;
    const maxIdx = diffIndex.has(maxDifficulty) ? diffIndex.get(maxDifficulty) : -1;
    if (maxIdx < 0 || minIdx > maxIdx) continue;

    const normalizedRow = {
      min_difficulty: minDifficulty,
      max_difficulty: maxDifficulty,
      difficulty: maxDifficulty,
      topic: row.topic,
      sub_type: row.sub_type
    };
    const key = `${normalizedRow.topic}|||${normalizedRow.sub_type}`;
    const existing = dedup.get(key);
    if (!existing) {
      dedup.set(key, normalizedRow);
      continue;
    }
    const oldMaxIdx = diffIndex.has(existing.max_difficulty) ? diffIndex.get(existing.max_difficulty) : -1;
    const newMaxIdx = diffIndex.has(normalizedRow.max_difficulty) ? diffIndex.get(normalizedRow.max_difficulty) : -1;
    if (newMaxIdx > oldMaxIdx) dedup.set(key, normalizedRow);
  }
  const normalized = [...dedup.values()];

  const { error: clearError } = await supabase.from("study_group_scopes").delete().eq("group_id", groupId);
  if (clearError) return res.status(500).json({ error: clearError.message });

  if (normalized.length) {
    const payload = normalized.map((row) => ({
      group_id: groupId,
      difficulty: row.difficulty,
      min_difficulty: row.min_difficulty,
      max_difficulty: row.max_difficulty,
      topic: row.topic,
      sub_type: row.sub_type || null
    }));
    const { error: insertError } = await supabase.from("study_group_scopes").insert(payload);
    if (insertError) return res.status(500).json({ error: insertError.message });
  }

  return res.json({ saved: normalized.length });
});

app.post("/api/teacher/groups/:groupId/add-students", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const groupId = Number(req.params.groupId);
  if (!Number.isInteger(groupId) || groupId <= 0) {
    return res.status(400).json({ error: "Valid groupId is required." });
  }

  const studentIds = Array.isArray(req.body.student_ids)
    ? req.body.student_ids.map((x) => String(x || "").trim()).filter(Boolean)
    : [];
  if (!studentIds.length) {
    return res.status(400).json({ error: "student_ids is required." });
  }

  const { data: validStudents, error: validError } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("role", "student")
    .in("user_id", studentIds);
  if (validError) return res.status(500).json({ error: validError.message });

  const validStudentIds = (validStudents || []).map((s) => String(s.user_id || "")).filter(Boolean);
  if (!validStudentIds.length) {
    return res.status(400).json({ error: "No valid student ids found." });
  }

  const payload = validStudentIds.map((studentId) => ({ student_id: studentId, group_id: groupId }));
  const { data, error } = await supabase
    .from("student_group_memberships")
    .upsert(payload, { onConflict: "student_id,group_id" })
    .select("id");
  if (error) return res.status(500).json({ error: error.message });

  return res.json({ assigned: (data || []).length });
});

app.post("/api/teacher/groups/:groupId/remove-students", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const groupId = Number(req.params.groupId);
  if (!Number.isInteger(groupId) || groupId <= 0) {
    return res.status(400).json({ error: "Valid groupId is required." });
  }

  const studentIds = Array.isArray(req.body.student_ids)
    ? req.body.student_ids.map((x) => String(x || "").trim()).filter(Boolean)
    : [];
  if (!studentIds.length) {
    return res.status(400).json({ error: "student_ids is required." });
  }

  const { data, error } = await supabase
    .from("student_group_memberships")
    .delete()
    .eq("group_id", groupId)
    .in("student_id", studentIds)
    .select("id");
  if (error) return res.status(500).json({ error: error.message });

  return res.json({ removed: (data || []).length });
});

app.get("/api/problems", ensureCloud, requireAdminUploadAccess, async (req, res) => {
  const { difficulty, topic, sub_type, grade, q } = req.query;

  let query = supabase.from("problems").select("*").order("id", { ascending: false });

  if (difficulty) query = query.eq("difficulty", difficulty);
  if (grade) query = query.eq("grade", grade);
  if (topic) query = query.ilike("topic", `%${topic}%`);
  if (sub_type) query = query.ilike("sub_type", `%${sub_type}%`);
  if (q) query = query.or(`latex_code.ilike.%${q}%,topic.ilike.%${q}%,sub_type.ilike.%${q}%`);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

app.post("/api/problems", ensureCloud, requireAdminUploadAccess, async (req, res) => {
  const p = norm(req.body);
  const err = validateProblem(p);
  if (err) return res.status(400).json({ error: err });

  const { data, error, solution_saved } = await insertWithSolutionFallback(p);
  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({ ...data, solution_saved });
});
app.post("/api/problems/batch", ensureCloud, requireAdminUploadAccess, async (req, res) => {
  const baseLabels = {
    difficulty: (req.body.difficulty || "").trim(),
    question_type: (req.body.question_type || "").trim(),
    topic: (req.body.topic || "").trim(),
    sub_type: (req.body.sub_type || "").trim(),
    grade: (req.body.grade || "").trim()
  };

  const labelErr = validateLabels(baseLabels);
  if (labelErr) return res.status(400).json({ error: labelErr });

  const items = Array.isArray(req.body.items) ? req.body.items : [];
  if (!items.length) return res.status(400).json({ error: "No approved items to upload." });

  if (items.some((i) => !String(i.latex_code || "").trim())) {
    return res.status(400).json({ error: "Each item needs LaTeX code." });
  }

  const cleanItems = items.map((i) => ({
    latex_code: String(i.latex_code || "").trim(),
    solution_latex: String(i.solution_latex || "").trim(),
    answer_text: String(i.answer_text || "").trim()
  }));

  const { data, error, solution_saved } = await batchInsertWithSolutionFallback(baseLabels, cleanItems);
  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({ inserted: (data || []).length, solution_saved });
});

app.patch("/api/problems/batch-label", ensureCloud, requireAdminUploadAccess, async (req, res) => {
  const ids = Array.isArray(req.body.ids)
    ? req.body.ids.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)
    : [];
  const field = String(req.body.field || "").trim();
  const value = String(req.body.value || "").trim();

  if (!ids.length) return res.status(400).json({ error: "At least one problem id is required." });
  if (!field) return res.status(400).json({ error: "Label field is required." });

  const allowedFields = ["difficulty", "question_type", "topic", "sub_type", "grade"];
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ error: "Unsupported label field." });
  }
  if (!value) return res.status(400).json({ error: "New label value is required." });

  if (field === "difficulty" && !DIFF.includes(value)) {
    return res.status(400).json({ error: "Invalid difficulty value." });
  }
  if (field === "question_type" && !QUESTION_TYPES.includes(value)) {
    return res.status(400).json({ error: "Invalid question type value." });
  }
  if (field === "grade" && !GRADES.includes(value)) {
    return res.status(400).json({ error: "Invalid grade value." });
  }

  const payload = { [field]: value };
  const { data, error } = await supabase.from("problems").update(payload).in("id", ids).select("id");
  if (error) return res.status(500).json({ error: error.message });

  return res.json({ updated: (data || []).length });
});

app.post("/api/generate-variants", ensureGenerator, async (req, res) => {
  const seed = String(req.body.seed_latex || "").trim();
  const count = Number(req.body.count);

  if (!seed) return res.status(400).json({ error: "Seed LaTeX is required." });
  if (!Number.isInteger(count) || count < 1 || count > 20) {
    return res.status(400).json({ error: "Count must be an integer from 1 to 20." });
  }

  try {
    const generated = await generateVariants(seed, count);
    return res.json(generated);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to generate variants." });
  }
});

app.post("/api/generate-solutions", ensureGenerator, async (req, res) => {
  const questions = Array.isArray(req.body.questions)
    ? req.body.questions.map((q) => String(q || "").trim()).filter(Boolean)
    : [];

  if (!questions.length) {
    return res.status(400).json({ error: "At least one question is required." });
  }
  if (questions.length > 50) {
    return res.status(400).json({ error: "Maximum 50 questions per request." });
  }

  try {
    const generated = await generateSolutions(questions);
    return res.json(generated);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to generate solutions." });
  }
});

app.put("/api/problems/:id", ensureCloud, requireAdminUploadAccess, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid problem id." });
  }

  const p = norm(req.body);
  const err = validateProblem(p);
  if (err) return res.status(400).json({ error: err });

  const { data, error, solution_saved } = await updateWithSolutionFallback(id, p);
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Problem not found." });

  return res.json({ ...data, solution_saved });
});

app.delete("/api/problems/:id", ensureCloud, requireAdminUploadAccess, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid problem id." });
  }

  const { data, error } = await supabase.from("problems").delete().eq("id", id).select("id").maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Problem not found." });
  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (!hasCloudConfig) {
    console.log("Missing cloud config. Create .env from .env.example and add Supabase credentials.");
  }
  if (!hasClientAuthConfig) {
    console.log("Missing SUPABASE_ANON_KEY. Client login/signup UI will not work.");
  }
  if (SCHOOL_EMAIL_DOMAIN) {
    console.log(`School domain restriction enabled: @${SCHOOL_EMAIL_DOMAIN}`);
  }
  if (!hasAIConfig) {
    if (LOCAL_FALLBACK_ENABLED) {
      console.log("Gemini key not found. Using local fallback generator.");
    } else {
      console.log("AI generation is disabled until GEMINI_API_KEY is set in .env.");
    }
  }
});
