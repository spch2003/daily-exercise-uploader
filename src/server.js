const path = require("path");
const fs = require("fs/promises");
const express = require("express");
const dailyPolicy = require("./daily-learning");
const { createDailyExerciseService, isMain } = require("./daily-exercise-service");
const crypto = require("crypto");
const zlib = require("zlib");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const AI_GENERATION_ENABLED = String(process.env.AI_GENERATION_ENABLED || "false").trim().toLowerCase() === "true";
const LOCAL_FALLBACK_ENABLED =
  AI_GENERATION_ENABLED && String(process.env.LOCAL_FALLBACK_ENABLED || "false").trim().toLowerCase() === "true";
const SCHOOL_EMAIL_DOMAIN = (process.env.SCHOOL_EMAIL_DOMAIN || "").toLowerCase().trim();
const APP_TIMEZONE = process.env.APP_TIMEZONE || "Asia/Hong_Kong";
const GOOGLE_CLIENT_ID = String(process.env.GOOGLE_CLIENT_ID || "").trim();
const APP_MODE = String(process.env.APP_MODE || "").trim().toLowerCase();
const ADMIN_ACCESS_KEY = String(process.env.ADMIN_ACCESS_KEY || "").trim();
const DISABLE_SIGNUP = String(process.env.DISABLE_SIGNUP || "").trim().toLowerCase() === "true";
const QUESTION_FIGURE_BUCKET = process.env.QUESTION_FIGURE_BUCKET || "question-figures";
const KROKI_BASE_URL = process.env.KROKI_BASE_URL || "https://kroki.io";
const AUTO_CONVERT_TIKZ = String(process.env.AUTO_CONVERT_TIKZ || "true").trim().toLowerCase() !== "false";
const TEACHER_EMAILS = new Set(
  String(process.env.TEACHER_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);
const ADMIN_EMAILS = new Set(
  String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

const DIFF = ["lv2", "lv3", "lv4", "lv5", "lv5*", "lv5**"];
const GRADES = ["F1", "F2", "F3", "F4", "F5", "F6"];
const QUESTION_TYPES = ["MC", "Short Answer"];
const REVIEW_INTERVAL_DAYS = {
  1: 2,
  2: 4,
  3: 7,
  4: 14,
  5: 30
};
const PROGRESS_STATUS = {
  UNKNOWN: "UNKNOWN",
  KNOWN: "KNOWN",
  MASTERED: "MASTERED",
  BACKFILL: "BACKFILL",
  FROZEN: "FROZEN"
};
const INITIAL_ASSESSMENT_COMPLETION_TOKENS = 100;

const hasCloudConfig = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
const hasAIConfig = Boolean(GEMINI_API_KEY);
const hasGeneratorConfig = AI_GENERATION_ENABLED && (hasAIConfig || LOCAL_FALLBACK_ENABLED);
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
  if (req.path === "/portal.html") {
    return res.redirect("/question-bank.html");
  }
  if (req.path === "/portal.js" || req.path === "/portal.css") {
    return res.status(404).send("Not found.");
  }
  return next();
});
app.use((req, res, next) => {
  if (APP_MODE === "student_portal" && req.path === "/") {
    return res.redirect("/portal.html");
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
      error: "AI generation is disabled."
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
  const now = new Date();
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: APP_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23"
    })
      .formatToParts(now)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );
  const dateString = `${parts.year}-${parts.month}-${parts.day}`;
  return Number(parts.hour || 0) < 8 ? addDaysDateString(dateString, -1) : dateString;
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

function isAdminEmail(email) {
  return ADMIN_EMAILS.has(normalizeEmail(email));
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

function isDontKnowAnswer(value) {
  const answer = String(value || "").trim().toLowerCase();
  return !answer || answer === "__dont_know__" || answer === "don't know" || answer === "dont know";
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

function normalizePracticeSubmissions(rows) {
  return (Array.isArray(rows) ? rows : []).map((row) => ({
    ...row,
    assignment_date: toDateKey(row.submitted_at || new Date().toISOString())
  }));
}

function isMissingTableError(error) {
  const code = String(error?.code || "");
  const message = String(error?.message || "").toLowerCase();
  return code === "42P01" || message.includes("does not exist");
}

async function fetchPracticeSubmissionsForStudents(studentIds, select = "student_id,is_correct,time_spent_seconds,submitted_at") {
  const ids = (Array.isArray(studentIds) ? studentIds : [studentIds]).map((id) => String(id || "").trim()).filter(Boolean);
  if (!ids.length) return [];
  const { data, error } = await supabase.from("student_practice_submissions").select(select).in("student_id", ids);
  if (error) {
    if (isMissingTableError(error)) return [];
    throw new Error(error.message);
  }
  return normalizePracticeSubmissions(data || []);
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

function buildLegacyDoneDateSet(submissions) {
  const counts = new Map();
  for (const row of submissions || []) {
    if (row.assignment_id) continue;
    const key = toDateKey(row.assignment_date);
    if (!key) continue;
    counts.set(key, Number(counts.get(key) || 0) + 1);
  }
  return new Set([...counts.entries()].filter(([, n]) => Number(n) >= 5).map(([k]) => k));
}

async function getCompletedDates(studentIds, submissions) {
  const byStudent = new Map(studentIds.map(id => [id, []]));
  for (const row of submissions || []) {
    byStudent.get(row.student_id)?.push(row);
  }
  const result = new Map(studentIds.map(id => [id, buildLegacyDoneDateSet(byStudent.get(id))]));
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase.from("student_daily_plans").select("student_id,assignment_date,completed_at")
      .in("student_id", studentIds).order("student_id").order("assignment_date").range(offset, offset + 999);
    if (error) throw new Error(error.message);
    for (const row of data) {
      const dates = result.get(row.student_id);
      if (row.completed_at) dates.add(row.assignment_date);
      else dates.delete(row.assignment_date);
    }
    if (data.length < 1000) return result;
  }
}

function clamp01To100(x) {
  return Math.max(0, Math.min(100, Math.round(Number(x) || 0)));
}

function computeAspectMetrics(submissions, diamondsUsed = 0, doneDates = new Set()) {
  const stats = computeSubmissionStats(submissions || []);
  const currentStreakDays = computeCurrentStreakDaysFromDateSet(doneDates);
  const longestStreakDays = computeLongestStreakDaysFromDateSet(doneDates);
  const avgSec = Number(stats.average_time_seconds || 0);

  const metrics = {
    Combo: clamp01To100((longestStreakDays / 21) * 100),
    Aim: clamp01To100(stats.correct_percentage),
    Flash: clamp01To100(avgSec > 0 ? ((150 - avgSec) / 120) * 100 : 0),
    Grind: clamp01To100((Number(stats.questions_done || 0) / 300) * 100),
    Fortune: clamp01To100((Number(diamondsUsed || 0) / 1200) * 100)
  };

  return {
    metrics,
    questions_done: Number(stats.questions_done || 0),
    correct_percentage: Number(stats.correct_percentage || 0),
    average_time_seconds: Number(stats.average_time_seconds || 0),
    current_streak_days: currentStreakDays,
    longest_streak_days: longestStreakDays,
    diamonds_used: Number(diamondsUsed || 0),
    aspect_values: {
      Combo: longestStreakDays,
      Aim: Number(stats.correct_percentage || 0),
      Flash: Number(stats.average_time_seconds || 0),
      Grind: Number(stats.questions_done || 0),
      Fortune: Number(diamondsUsed || 0)
    }
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

async function fetchDiamondsUsedByStudentMap(studentIds) {
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
    if (delta < 0) {
      map.set(sid, Number(map.get(sid) || 0) + Math.abs(delta));
    }
  }
  return map;
}

async function fetchSelectedAvatarFrameMap(studentIds) {
  const ids = (Array.isArray(studentIds) ? studentIds : []).map((x) => String(x || "").trim()).filter(Boolean);
  const empty = { avatars: new Map(), frames: new Map() };
  if (!ids.length) return empty;
  try {
    const [avatarStateResult, frameStateResult] = await Promise.all([
      supabase.from("student_avatar_state").select("student_id,selected_avatar_id").in("student_id", ids),
      supabase.from("student_frame_state").select("student_id,selected_frame_id").in("student_id", ids)
    ]);
    if (avatarStateResult.error || frameStateResult.error) return empty;

    const avatarStateRows = Array.isArray(avatarStateResult.data) ? avatarStateResult.data : [];
    const frameStateRows = Array.isArray(frameStateResult.data) ? frameStateResult.data : [];
    const avatarIds = [...new Set(avatarStateRows.map((x) => Number(x.selected_avatar_id || 0)).filter((x) => x > 0))];
    const frameIds = [...new Set(frameStateRows.map((x) => Number(x.selected_frame_id || 0)).filter((x) => x > 0))];
    const [avatarResult, frameResult] = await Promise.all([
      avatarIds.length
        ? supabase.from("avatar_characters").select("id,name,emoji,image_url").in("id", avatarIds)
        : Promise.resolve({ data: [], error: null }),
      frameIds.length
        ? supabase.from("frame_items").select("id,name,style_key,image_url").in("id", frameIds)
        : Promise.resolve({ data: [], error: null })
    ]);
    if (avatarResult.error || frameResult.error) return empty;

    const avatarById = new Map((avatarResult.data || []).map((x) => [Number(x.id), x]));
    const frameById = new Map((frameResult.data || []).map((x) => [Number(x.id), x]));
    const avatars = new Map();
    const frames = new Map();
    for (const row of avatarStateRows) {
      const avatar = avatarById.get(Number(row.selected_avatar_id || 0));
      if (avatar) avatars.set(String(row.student_id || ""), avatar);
    }
    for (const row of frameStateRows) {
      const frame = frameById.get(Number(row.selected_frame_id || 0));
      if (frame) frames.set(String(row.student_id || ""), frame);
    }
    return { avatars, frames };
  } catch (_error) {
    return empty;
  }
}

async function buildClassAnalytics(className, targetStudentId, fallbackSubmissions, fallbackDates = new Set()) {
  const classKey = String(className || "").trim();
  const labels = ["Combo", "Aim", "Flash", "Grind", "Fortune"];
  if (!classKey) {
    const targetDiamond = 0;
    const target = computeAspectMetrics(fallbackSubmissions || [], targetDiamond, fallbackDates);
    return { labels, student: target.metrics, class_avg: Object.fromEntries(labels.map((k) => [k, 0])), student_values: target.aspect_values, leaders: [], titles: [], classmates_power: [] };
  }

  const { data: classmates, error: classmatesError } = await supabase
    .from("user_profiles")
    .select("user_id,full_name,class_name,role")
    .eq("role", "student")
    .eq("class_name", classKey);
  if (classmatesError) throw new Error(classmatesError.message);
  let members = Array.isArray(classmates) ? classmates : [];
  if (!members.length) {
    const { data: fuzzyClassmates, error: fuzzyClassmatesError } = await supabase
      .from("user_profiles")
      .select("user_id,full_name,class_name,role")
      .eq("role", "student")
      .ilike("class_name", classKey);
    if (fuzzyClassmatesError) throw new Error(fuzzyClassmatesError.message);
    members = Array.isArray(fuzzyClassmates) ? fuzzyClassmates : [];
  }
  const ids = members.map((m) => String(m.user_id || "")).filter(Boolean);
  if (!ids.length) {
    return {
      labels,
      student: Object.fromEntries(labels.map((k) => [k, 0])),
      class_avg: Object.fromEntries(labels.map((k) => [k, 0])),
      student_values: Object.fromEntries(labels.map((k) => [k, 0])),
      leaders: [],
      titles: [],
      classmates_power: []
    };
  }

  const [subsResult, practiceRows, diamondsMap] = await Promise.all([
    supabase
      .from("student_submissions")
      .select("student_id,assignment_date,is_correct,time_spent_seconds,submitted_at,assignment_id,assignment:daily_assignments(kind)")
      .in("student_id", ids),
    fetchPracticeSubmissionsForStudents(ids).catch(() => []),
    fetchDiamondsUsedByStudentMap(ids).catch(() => new Map())
  ]);
  if (subsResult.error) throw new Error(subsResult.error.message);
  const dailyRows = (subsResult.data || []).filter(row => row.assignment?.kind !== "retest");
  const completedByStudent = await getCompletedDates(ids, dailyRows);
  const allSubs = [...dailyRows, ...practiceRows];
  const byStudent = new Map();
  for (const sid of ids) byStudent.set(sid, []);
  for (const row of allSubs) {
    const sid = String(row.student_id || "");
    if (!byStudent.has(sid)) byStudent.set(sid, []);
    byStudent.get(sid).push(row);
  }

  const aspectRows = members.map((m) => {
    const sid = String(m.user_id || "");
    const metricsData = computeAspectMetrics(byStudent.get(sid) || [], Number(diamondsMap.get(sid) || 0), completedByStudent.get(sid));
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
    { metrics: Object.fromEntries(labels.map((k) => [k, 0])), aspect_values: Object.fromEntries(labels.map((k) => [k, 0])), questions_done: 0, current_streak_days: 0 };

  const minQ = 30;
  const titleDefs = [
    { key: "Combo", name: "Longest streaks", sort: (a, b) => Number(b.longest_streak_days || 0) - Number(a.longest_streak_days || 0), eligible: () => true, value: (x) => Number(x.longest_streak_days || 0) },
    { key: "Aim", name: "Correct %", sort: (a, b) => Number(b.correct_percentage || 0) - Number(a.correct_percentage || 0), eligible: (x) => x.questions_done >= minQ, value: (x) => Number(x.correct_percentage || 0) },
    { key: "Flash", name: "Speed", sort: (a, b) => Number(a.average_time_seconds || 0) - Number(b.average_time_seconds || 0), eligible: (x) => x.questions_done >= minQ && Number(x.average_time_seconds || 0) > 0, value: (x) => Number(x.average_time_seconds || 0) },
    { key: "Grind", name: "Questions done", sort: (a, b) => Number(b.questions_done || 0) - Number(a.questions_done || 0), eligible: () => true, value: (x) => Number(x.questions_done || 0) },
    { key: "Fortune", name: "Diamonds used", sort: (a, b) => Number(b.diamonds_used || 0) - Number(a.diamonds_used || 0), eligible: () => true, value: (x) => Number(x.diamonds_used || 0) }
  ];
  const titles = titleDefs
    .map((d) => {
      const eligible = aspectRows.filter((x) => d.eligible(x)).sort(d.sort);
      const top = eligible[0];
      if (!top) return null;
      return { aspect_key: d.key, aspect_name: d.name, title: d.name, student_name: top.student_name, student_id: top.student_id, value: d.value(top) };
    })
    .filter(Boolean);
  const avatarFrameMap = await fetchSelectedAvatarFrameMap(ids);
  const classmatesPower = aspectRows.map((row) => ({
    student_id: row.student_id,
    student_name: row.student_name,
    selected_avatar: avatarFrameMap.avatars.get(String(row.student_id || "")) || null,
    selected_frame: avatarFrameMap.frames.get(String(row.student_id || "")) || null,
    metrics: row.metrics || {},
    aspect_values: row.aspect_values || {}
  }));

  return {
    labels,
    student: targetRow.metrics,
    class_avg: avg,
    student_values: targetRow.aspect_values || {},
    leaders: titles,
    titles,
    classmates_power: classmatesPower
  };
}

function parseBearerToken(req) {
  const authHeader = String(req.headers.authorization || "");
  if (!authHeader.toLowerCase().startsWith("bearer ")) return "";
  return authHeader.slice(7).trim();
}

function pickRandomIds(ids, count) {
  const pool = [...ids];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

function shuffleCopy(items) {
  const arr = Array.isArray(items) ? [...items] : [];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function comboKey(combo) {
  return `${String(combo.difficulty || "").trim()}|||${String(combo.topic || "").trim()}|||${String(combo.sub_type || "").trim()}`;
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

async function fetchLatestStudentProfile(authUserOrProfile) {
  const userId = String(authUserOrProfile?.id || authUserOrProfile?.user_id || "").trim();
  const email = normalizeEmail(authUserOrProfile?.email || "");
  const { data: byId, error: byIdError } = userId ? await fetchProfileByUserId(userId) : { data: null, error: null };
  if (byIdError) throw new Error(byIdError.message);
  if (byId?.class_name || !email) return byId;

  const { data: byEmail, error: byEmailError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("email", email)
    .eq("role", "student")
    .not("class_name", "is", null)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (byEmailError) throw new Error(byEmailError.message);
  return byEmail || byId;
}

async function ensureProfileFromAuthUser(authUser) {
  const fallbackRole = isAdminEmail(authUser.email) ? "admin" : isTeacherEmail(authUser.email) ? "teacher" : "student";
  const { data: existingProfile, error: existingProfileError } = await fetchProfileByUserId(authUser.id);
  if (existingProfileError) throw new Error(existingProfileError.message);
  let latestProfile = null;
  if (!existingProfile?.class_name && normalizeEmail(authUser.email)) {
    latestProfile = await fetchLatestStudentProfile({ ...authUser, user_id: authUser.id }).catch(() => null);
  }
  const metadataClassName = String(authUser.user_metadata?.class_name || "").trim();
  const resolvedClassName = existingProfile?.class_name || latestProfile?.class_name || metadataClassName || "";
  const metadataGrade = String(authUser.user_metadata?.grade || "").trim();
  const inferredGradeNumber = gradeNumberFromValue(resolvedClassName);
  const resolvedGrade = existingProfile?.grade || latestProfile?.grade || metadataGrade || (inferredGradeNumber ? `F${inferredGradeNumber}` : "");

  const profilePayload = {
    user_id: authUser.id,
    email: normalizeEmail(authUser.email),
    full_name: String(authUser.user_metadata?.full_name || existingProfile?.full_name || authUser.email || "").trim(),
    role: String(existingProfile?.role || authUser.user_metadata?.role || fallbackRole)
  };
  if (!existingProfile || resolvedGrade) profilePayload.grade = resolvedGrade || null;
  if (!existingProfile || resolvedClassName) profilePayload.class_name = resolvedClassName || null;

  await supabase.from("user_profiles").upsert(profilePayload, { onConflict: "user_id" });
  return fetchProfileByUserId(authUser.id);
}

async function updateStudentAuthClassMetadata(studentIds, className) {
  const ids = Array.isArray(studentIds) ? studentIds.map((id) => String(id || "").trim()).filter(Boolean) : [];
  for (const studentId of ids) {
    try {
      const { data } = await supabase.auth.admin.getUserById(studentId);
      const current = data?.user?.user_metadata || {};
      await supabase.auth.admin.updateUserById(studentId, {
        user_metadata: {
          ...current,
          class_name: className || null
        }
      });
    } catch (_error) {
      // Profile table is the source of truth; auth metadata sync is best-effort.
    }
  }
}

async function ensureStudentTokenWallet(studentId) {
  const balance = await grantStudentTokens(studentId, 0, "balance");
  return { student_id: studentId, balance };
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

async function grantStudentTokens(studentId, delta, reason, metadata = {}) {
  const { data, error } = await supabase.rpc("adjust_student_tokens", {
    p_student_id: studentId,
    p_amount: Math.round(Number(delta || 0)),
    p_reason: String(reason || "adjustment").trim() || "adjustment",
    p_metadata: metadata
  });
  if (error) throw new Error(error.message);
  return Number(data || 0);
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
    .select("id,name,emoji,image_url,model_url,drop_rate,is_active")
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
  }
  const wallet = await ensureStudentTokenWallet(studentId);
  return {
    token_balance: Number(wallet.balance || 0),
    item: { ...picked, type: "character" },
    duplicate,
    message: duplicate ? "Duplicate character." : "New character unlocked!"
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
  }
  const wallet = await ensureStudentTokenWallet(studentId);
  return {
    token_balance: Number(wallet.balance || 0),
    item: { ...picked, type: "frame", emoji: "🖼️" },
    duplicate,
    message: duplicate ? "Duplicate frame." : "New frame unlocked!"
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
    const allowed = Array.isArray(role) ? role : [role];
    if (!req.profile || !allowed.includes(req.profile.role)) {
      return res.status(403).json({ error: "You do not have permission to access this resource." });
    }
    return next();
  };
}

async function getTeacherAllowedClassNames(profile) {
  if (profile?.role === "admin") return null;
  if (profile?.role !== "teacher") return [];
  const { data, error } = await supabase
    .from("class_teacher_assignments")
    .select("class_name")
    .eq("teacher_id", profile.user_id);
  if (error) {
    if (isMissingTableError(error)) return [];
    throw new Error(error.message);
  }
  return [...new Set((data || []).map((row) => String(row.class_name || "").trim()).filter(Boolean))];
}

function filterRowsByAllowedClasses(rows, allowedClasses) {
  if (!Array.isArray(allowedClasses)) return Array.isArray(rows) ? rows : [];
  const allowed = new Set(allowedClasses);
  return (Array.isArray(rows) ? rows : []).filter((row) => allowed.has(String(row.class_name || row.user_profiles?.class_name || "").trim()));
}

async function ensureTeacherCanAccessStudent(profile, studentId) {
  const allowedClasses = await getTeacherAllowedClassNames(profile);
  if (!Array.isArray(allowedClasses)) return true;
  if (!allowedClasses.length) return false;
  const { data, error } = await supabase
    .from("user_profiles")
    .select("class_name")
    .eq("user_id", studentId)
    .eq("role", "student")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return Boolean(data && allowedClasses.includes(String(data.class_name || "").trim()));
}

async function ensureTeacherCanAccessClass(profile, className) {
  const allowedClasses = await getTeacherAllowedClassNames(profile);
  if (!Array.isArray(allowedClasses)) return true;
  return allowedClasses.includes(String(className || "").trim());
}

async function ensureTeacherCanAccessGroup(profile, groupId) {
  const { data: group, error } = await supabase
    .from("study_groups")
    .select("id,owner_teacher_id")
    .eq("id", groupId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!group) return false;
  if (!group.owner_teacher_id) return true;
  return String(group.owner_teacher_id) === String(profile.user_id);
}

async function fetchProblemRowsPaged({ grade = "", columns = "id,difficulty,topic,sub_type,grade" } = {}) {
  const targetGrade = String(grade || "").trim();
  const pageSize = 1000;
  let from = 0;
  const rows = [];
  for (;;) {
    let query = supabase
      .from("problems")
      .select(columns)
      .order("id", { ascending: true })
      .range(from, from + pageSize - 1);
    if (targetGrade) query = query.eq("grade", targetGrade);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    const page = Array.isArray(data) ? data : [];
    rows.push(...page);
    if (page.length < pageSize) break;
    from += pageSize;
  }
  return rows;
}

async function fetchProblemPoolForStudentGrade(studentGrade) {
  const targetGrade = String(studentGrade || "").trim();
  const targetGradeNumber = gradeNumberFromValue(targetGrade);
  const columns = "id,difficulty,topic,sub_type,grade,answer_text";
  if (targetGradeNumber > 0) {
    const rows = await fetchProblemRowsPaged({ columns });
    const gradeScopedRows = rows.filter((row) => {
      const questionGradeNumber = gradeNumberFromValue(row.grade);
      return questionGradeNumber > 0 && questionGradeNumber <= targetGradeNumber;
    });
    if (gradeScopedRows.length) return gradeScopedRows;
  }

  const rows = await fetchProblemRowsPaged({ grade: targetGrade, columns });
  if (rows.length || !targetGrade) return rows;
  return await fetchProblemRowsPaged({ columns });
}

function gradeNumberFromValue(value) {
  const match = String(value || "").trim().match(/(?:^|[^0-9])([1-6])(?:[^0-9]|$)/);
  return match ? Number(match[1]) : 0;
}

function inferStudentGradeNumber(studentProfile) {
  return gradeNumberFromValue(studentProfile?.grade) || gradeNumberFromValue(studentProfile?.class_name);
}

function nextAssessmentDifficulty(difficulty) {
  const levels = ["lv2", "lv3", "lv4", "lv5"];
  const index = levels.indexOf(String(difficulty || "").trim());
  if (index < 0) return "lv2";
  return levels[Math.min(index + 1, levels.length - 1)];
}

async function fetchInitialAssessmentProblemRows(studentProfile) {
  const studentGradeNumber = inferStudentGradeNumber(studentProfile);
  if (!studentGradeNumber || studentGradeNumber <= 1) return [];
  const rows = await fetchProblemRowsPaged();
  return rows.filter((row) => {
    const questionGradeNumber = gradeNumberFromValue(row.grade);
    return questionGradeNumber > 0 && questionGradeNumber < studentGradeNumber;
  });
}

function summarizeAssessmentPool(rows, usedTopicKeys = new Set(), usedSubtopicKeys = new Set()) {
  const levels = ["lv2", "lv3", "lv4"];
  const summary = {};
  for (const level of levels) {
    const levelRows = (rows || []).filter((row) => String(row.difficulty || "").trim() === level);
    const topics = new Set();
    const subtopics = new Set();
    const unusedTopics = new Set();
    const unusedSubtopics = new Set();
    for (const row of levelRows) {
      const id = Number(row.id);
      const topic = String(row.topic || "").trim().toLowerCase() || `blank-topic-${id}`;
      const subtopic = `${topic}|||${String(row.sub_type || "").trim().toLowerCase() || `blank-subtopic-${id}`}`;
      topics.add(topic);
      subtopics.add(subtopic);
      if (!usedTopicKeys.has(topic)) unusedTopics.add(topic);
      if (!usedSubtopicKeys.has(subtopic)) unusedSubtopics.add(subtopic);
    }
    summary[level] = {
      questions: levelRows.length,
      topics: topics.size,
      subtopics: subtopics.size,
      unused_topics: unusedTopics.size,
      unused_subtopics: unusedSubtopics.size
    };
  }
  return summary;
}

async function fetchScopeRulesForStudent(studentId) {
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("class_name")
    .eq("user_id", studentId)
    .maybeSingle();
  if (profileError) throw new Error(profileError.message);

  const ruleSets = [];
  const className = String(profile?.class_name || "").trim();
  if (className) {
    const { data: classScopes, error: classScopeError } = await supabase
      .from("class_scopes")
      .select("difficulty,min_difficulty,max_difficulty,topic,sub_type")
      .eq("class_name", className);
    if (classScopeError) throw new Error(classScopeError.message);
    if (Array.isArray(classScopes) && classScopes.length) {
      ruleSets.push(classScopes.map(normalizeScopeRule));
    }
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("student_group_memberships")
    .select("group_id")
    .eq("student_id", studentId);
  if (membershipError) throw new Error(membershipError.message);
  const groupIds = (memberships || []).map((m) => Number(m.group_id)).filter((x) => Number.isInteger(x) && x > 0);
  if (!groupIds.length) return ruleSets;

  const { data: scopes, error: scopeError } = await supabase
    .from("study_group_scopes")
    .select("group_id,difficulty,min_difficulty,max_difficulty,topic,sub_type")
    .in("group_id", groupIds);
  if (scopeError) throw new Error(scopeError.message);

  for (const groupId of groupIds) {
    const groupRules = (scopes || []).filter((row) => Number(row.group_id) === Number(groupId)).map(normalizeScopeRule);
    if (groupRules.length) ruleSets.push(groupRules);
  }
  return ruleSets;
}

function normalizeScopeRule(row) {
  return {
    difficulty: String(row.difficulty || "").trim(),
    min_difficulty: String(row.min_difficulty || "").trim(),
    max_difficulty: String(row.max_difficulty || "").trim(),
    topic: String(row.topic || "").trim(),
    sub_type: String(row.sub_type || "").trim()
  };
}

function applyScopeRulesToProblemRows(problemRows, scopeRules) {
  const ruleSets = Array.isArray(scopeRules) ? scopeRules.filter((set) => Array.isArray(set) && set.length) : [];
  if (!ruleSets.length) return problemRows;

  const diffIndex = new Map(DIFF.map((d, i) => [d, i]));

  return (problemRows || []).filter((row) => {
    const difficulty = String(row.difficulty || "").trim();
    const topic = String(row.topic || "").trim();
    const subType = String(row.sub_type || "").trim();
    const rowDiffIdx = diffIndex.has(difficulty) ? diffIndex.get(difficulty) : -1;
    if (rowDiffIdx < 0) return false;

    return ruleSets.every((rules) =>
      rules.some((rule) => {
        if (String(rule.topic || "").trim() !== topic) return false;
        const ruleSub = String(rule.sub_type || "").trim();
        if (ruleSub && ruleSub !== subType) return false;
        const minDiff = String(rule.min_difficulty || "").trim() || DIFF[0];
        const maxDiff = String(rule.max_difficulty || "").trim() || String(rule.difficulty || "").trim();
        const minIdx = diffIndex.has(minDiff) ? diffIndex.get(minDiff) : 0;
        const maxIdx = diffIndex.has(maxDiff) ? diffIndex.get(maxDiff) : -1;
        if (maxIdx < 0) return false;
        return rowDiffIdx >= minIdx && rowDiffIdx <= maxIdx;
      })
    );
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

const FORMULA_SHEET_DIR = path.join(__dirname, "..", "public", "assets", "formula sheet");
const FORMULA_SHEET_URL_BASE = "/assets/formula%20sheet";

function slugifyTopic(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function singularizeSlug(slug) {
  return String(slug || "")
    .split("-")
    .map((part) => (part.length > 3 && part.endsWith("s") ? part.slice(0, -1) : part))
    .join("-");
}

function topicSlugCandidates(topic) {
  const base = slugifyTopic(topic);
  const singular = singularizeSlug(base);
  const aliases = new Map([
    ["equation-of-straight-lines", ["equation-of-straight-line"]],
    ["quadratic-equations", ["quadratic-equation"]],
    ["polynomials", ["polynomial"]],
    ["exponential-functions", ["exponential-function"]],
    ["logarithmic-functions", ["logarithmic-function"]],
    ["complex-numbers", ["complex-number"]]
  ]);
  const withoutTrailingS = base.endsWith("s") ? base.slice(0, -1) : "";
  return [...new Set([base, singular, withoutTrailingS, ...(aliases.get(base) || []), ...(aliases.get(singular) || [])].filter(Boolean))];
}

async function listFormulaSheetsForTopic(topic) {
  const candidates = topicSlugCandidates(topic);
  if (!candidates.length) return [];
  let entries = [];
  try {
    entries = await fs.readdir(FORMULA_SHEET_DIR, { withFileTypes: true });
  } catch (_error) {
    return [];
  }
  return entries
    .filter((entry) => entry.isFile() && /\.(png|jpe?g|webp|gif)$/i.test(entry.name))
    .map((entry) => {
      const match = entry.name.match(/^(.+?)(?:-(\d+))?\.[^.]+$/);
      return {
        name: entry.name,
        slug: String(match?.[1] || "").toLowerCase(),
        order: Number(match?.[2] || 1)
      };
    })
    .filter((entry) => candidates.includes(entry.slug))
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "en", { numeric: true }))
    .map((entry) => ({
      title: `${topic} ${entry.order || ""}`.trim(),
      url: `${FORMULA_SHEET_URL_BASE}/${encodeURIComponent(entry.name)}`
    }));
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

function normalizeProgressStatus(row) {
  const status = String(row?.status || "").trim().toUpperCase();
  if (Object.values(PROGRESS_STATUS).includes(status)) return status;
  if (row?.is_paused === true) return PROGRESS_STATUS.FROZEN;
  if (row?.mastery_achieved === true && Number(row?.review_stage || 0) >= 5) return PROGRESS_STATUS.MASTERED;
  if (row?.mastery_achieved === true || Number(row?.review_stage || 0) > 0) return PROGRESS_STATUS.KNOWN;
  return PROGRESS_STATUS.UNKNOWN;
}

function makeDefaultProgressRow(studentId, combo, status = PROGRESS_STATUS.UNKNOWN) {
  return {
    student_id: studentId,
    difficulty: combo.difficulty,
    topic: combo.topic,
    sub_type: combo.sub_type,
    streak_correct: 0,
    mastery_achieved: status === PROGRESS_STATUS.MASTERED,
    review_stage: 0,
    next_review_date: null,
    consolidation_due_date: null,
    correction_due_date: null,
    correction_wrong_streak: 0,
    ever_wrong: false,
    is_paused: status === PROGRESS_STATUS.FROZEN,
    pending_careless_retry: false,
    careless_retry_date: null,
    status,
    consecutive_correct_count: 0,
    last_correct_date: null,
    wrong_count: 0,
    backfill_correct_count: 0,
    careless_streak: 0,
    pending_retest_question_id: null,
    done_variants: []
  };
}

async function upsertStudentLearningProgress(row) {
  const status = normalizeProgressStatus(row);
  const payload = {
    student_id: row.student_id,
    difficulty: row.difficulty,
    topic: row.topic,
    sub_type: row.sub_type,
    streak_correct: Number(row.streak_correct || row.consecutive_correct_count || 0),
    mastery_achieved: status === PROGRESS_STATUS.MASTERED || Boolean(row.mastery_achieved),
    review_stage: Number(row.review_stage || 0),
    next_review_date: row.next_review_date || null,
    consolidation_due_date: row.consolidation_due_date || null,
    correction_due_date: row.correction_due_date || null,
    correction_wrong_streak: Number(row.correction_wrong_streak || 0),
    ever_wrong: Boolean(row.ever_wrong),
    is_paused: status === PROGRESS_STATUS.FROZEN || Boolean(row.is_paused),
    pending_careless_retry: Boolean(row.pending_careless_retry),
    careless_retry_date: row.careless_retry_date || null,
    status,
    consecutive_correct_count: Number(row.consecutive_correct_count || 0),
    last_correct_date: row.last_correct_date || null,
    wrong_count: Number(row.wrong_count || 0),
    backfill_correct_count: Number(row.backfill_correct_count || 0),
    careless_streak: Number(row.careless_streak || 0),
    pending_retest_question_id:
      Number.isInteger(Number(row.pending_retest_question_id)) && Number(row.pending_retest_question_id) > 0
        ? Number(row.pending_retest_question_id)
        : null,
    done_variants: Array.isArray(row.done_variants) ? row.done_variants.map((x) => Number(x)).filter((x) => Number.isInteger(x) && x > 0) : [],
    initial_assessment_done: Boolean(row.initial_assessment_done)
  };

  const { error } = await supabase.from("student_learning_progress").upsert(payload, {
    onConflict: "student_id,difficulty,topic,sub_type"
  });
  if (error) throw new Error(error.message);
}

function reviewIntervalByStage(stage) {
  return REVIEW_INTERVAL_DAYS[Number(stage)] || 1;
}

async function loadAdaptiveContext(profile, date) {
  const studentId = profile.user_id;
  const [scopes, bank, progress, placement, history] = await Promise.all([
    fetchScopeRulesForStudent(studentId),
    fetchProblemPoolForStudentGrade(profile.grade),
    fetchStudentLearningProgress(studentId),
    hasCompletedInitialAssessment(studentId),
    fetchAdaptiveHistory(studentId, date)
  ]);
  return dailyPolicy.createContext({
    problems: applyScopeRulesToProblemRows(bank.filter(problem => String(problem.answer_text || "").trim()), scopes),
    progress,
    history,
    startDifficulty: placement?.start_difficulty || "lv2",
    date,
    studentId,
    scoped: scopes.length > 0
  });
}

async function fetchAdaptiveHistory(studentId, date) {
  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase.from("daily_assignments")
      .select("question_id,assignment_date,deferred,problems(difficulty,topic,sub_type)")
      .eq("student_id", studentId).eq("deferred", false).lt("assignment_date", date)
      .order("id").range(offset, offset + 999);
    if (error) throw new Error(error.message);
    rows.push(...data);
    if (data.length < 1000) return rows;
  }
}

async function loadAdaptiveProgress(profile, problem, date) {
  const combo = {
    difficulty: String(problem.difficulty || "").trim(),
    topic: String(problem.topic || "").trim(),
    sub_type: String(problem.sub_type || "").trim()
  };
  const { data, error } = await supabase.from("student_learning_progress").select("*")
    .eq("student_id", profile.user_id).eq("difficulty", combo.difficulty)
    .eq("topic", combo.topic).eq("sub_type", combo.sub_type).maybeSingle();
  if (error) throw new Error(error.message);
  const placement = data ? null : await hasCompletedInitialAssessment(profile.user_id);
  return dailyPolicy.normalizeProgress(data, combo, placement?.start_difficulty || "lv2", date);
}

async function hasCompletedInitialAssessment(studentId) {
  const { data, error } = await supabase
    .from("student_initial_assessments")
    .select("student_id,start_difficulty,lv2_correct,lv3_correct,lv4_correct,lv5_correct,completed_at")
    .eq("student_id", studentId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data || null;
}

async function buildInitialAssessmentQuestions(studentProfile) {
  const rows = await fetchInitialAssessmentProblemRows(studentProfile);
  const output = [];
  const usedTopicKeys = new Set();
  const usedSubtopicKeys = new Set();
  const usedIds = new Set();
  const topicKeyFor = (row, id) => String(row?.topic || "").trim().toLowerCase() || `blank-topic-${id}`;
  const subtopicKeyFor = (row, id) => {
    const topic = topicKeyFor(row, id);
    const subType = String(row?.sub_type || "").trim().toLowerCase() || `blank-subtopic-${id}`;
    return `${topic}|||${subType}`;
  };
  const rememberInitialAssessmentPick = (pool, id) => {
    const row = pool.find((item) => Number(item.id) === Number(id));
    output.push(id);
    usedIds.add(id);
    usedTopicKeys.add(topicKeyFor(row, id));
    usedSubtopicKeys.add(subtopicKeyFor(row, id));
  };
  const rebuildInitialAssessmentUsedKeys = () => {
    usedIds.clear();
    usedTopicKeys.clear();
    usedSubtopicKeys.clear();
    for (const id of output) {
      const row = rows.find((item) => Number(item.id) === Number(id));
      usedIds.add(Number(id));
      usedTopicKeys.add(topicKeyFor(row, id));
      usedSubtopicKeys.add(subtopicKeyFor(row, id));
    }
  };
  const pickAssessmentIdsForDifficulty = (pool, count, options = {}) => {
    const allowRepeatedTopic = Boolean(options.allowRepeatedTopic);
    const picked = [];
    const localUsedTopics = new Set(usedTopicKeys);
    const localUsedSubtopics = new Set(usedSubtopicKeys);
    const localUsedIds = new Set(usedIds);
    const candidates = shuffleCopy(pool);
    for (const row of candidates) {
      if (picked.length >= count) break;
      const id = Number(row.id);
      if (!Number.isInteger(id) || id <= 0) continue;
      const topicKey = topicKeyFor(row, id);
      const subtopicKey = subtopicKeyFor(row, id);
      if (localUsedIds.has(id) || localUsedSubtopics.has(subtopicKey)) continue;
      if (!allowRepeatedTopic && localUsedTopics.has(topicKey)) continue;
      picked.push(id);
      localUsedIds.add(id);
      localUsedTopics.add(topicKey);
      localUsedSubtopics.add(subtopicKey);
    }
    return picked;
  };
  const levelsByPriority = ["lv4", "lv3", "lv2"];
  const questionsPerAssessmentLevel = 4;

  for (const difficulty of levelsByPriority) {
    const pool = rows.filter((row) => String(row.difficulty || "").trim() === difficulty);
    const selectedForDifficulty = [];
    const strictPicks = pickAssessmentIdsForDifficulty(pool, questionsPerAssessmentLevel);
    for (const id of strictPicks) {
      rememberInitialAssessmentPick(pool, id);
      selectedForDifficulty.push(id);
    }

    const remainingCount = questionsPerAssessmentLevel - selectedForDifficulty.length;
    const fallbackPicks = remainingCount > 0
      ? pickAssessmentIdsForDifficulty(pool, remainingCount, { allowRepeatedTopic: true })
      : [];
    for (const id of fallbackPicks) {
      rememberInitialAssessmentPick(pool, id);
      selectedForDifficulty.push(id);
    }

    const pickedForDifficulty = output.filter((id) => {
      const row = rows.find((item) => Number(item.id) === Number(id));
      return String(row?.difficulty || "").trim() === difficulty;
    }).length;
    if (pickedForDifficulty < questionsPerAssessmentLevel) {
      const selectedSet = new Set(selectedForDifficulty.map((id) => Number(id)));
      for (let i = output.length - 1; i >= 0; i -= 1) {
        if (selectedSet.has(Number(output[i]))) output.splice(i, 1);
      }
      rebuildInitialAssessmentUsedKeys();
    }
  }
  if (!output.length) return [];

  const { data, error } = await supabase
    .from("problems")
    .select("id,latex_code,question_type,difficulty,topic,sub_type,grade")
    .in("id", output);
  if (error) throw new Error(error.message);
  const byId = new Map((data || []).map((row) => [Number(row.id), row]));
  return pickRandomIds(output, output.length)
    .map((id) => byId.get(Number(id)))
    .filter(Boolean);
}

async function buildInitialAssessmentDebug(studentProfile, selectedQuestions = null) {
  const rows = await fetchInitialAssessmentProblemRows(studentProfile);
  const questions = Array.isArray(selectedQuestions) ? selectedQuestions : await buildInitialAssessmentQuestions(studentProfile);
  const selectedTopics = new Set();
  const selectedSubtopics = new Set();
  const selectedByLevel = { lv2: 0, lv3: 0, lv4: 0, lv5: 0 };
  for (const q of questions) {
    const topic = String(q.topic || "").trim().toLowerCase() || `blank-topic-${q.id}`;
    const subtopic = `${topic}|||${String(q.sub_type || "").trim().toLowerCase() || `blank-subtopic-${q.id}`}`;
    selectedTopics.add(topic);
    selectedSubtopics.add(subtopic);
    if (Object.prototype.hasOwnProperty.call(selectedByLevel, q.difficulty)) selectedByLevel[q.difficulty] += 1;
  }
  const questionsPerAssessmentLevel = 4;
  const level_details = ["lv4", "lv3", "lv2"].map((level) => {
    const levelRows = rows.filter((row) => String(row.difficulty || "").trim() === level);
    const topics = new Set();
    const subtopics = new Set();
    for (const row of levelRows) {
      const topic = String(row.topic || "").trim().toLowerCase() || `blank-topic-${row.id}`;
      const subtopic = `${topic}|||${String(row.sub_type || "").trim().toLowerCase() || `blank-subtopic-${row.id}`}`;
      topics.add(topic);
      subtopics.add(subtopic);
    }
    const selectedCount = selectedByLevel[level] || 0;
    let status = "selected";
    if (selectedCount < questionsPerAssessmentLevel) {
      if (!levelRows.length) {
        status = "skipped: no questions below student grade";
      } else if (subtopics.size < questionsPerAssessmentLevel) {
        status = "skipped: fewer than 4 different sub-topics";
      } else {
        status = "not selected: refresh/restart server if this stays after deploying latest code";
      }
    }
    return {
      difficulty: level,
      available_questions: levelRows.length,
      available_topics: topics.size,
      available_subtopics: subtopics.size,
      selected_count: selectedCount,
      status
    };
  });
  return {
    inferred_student_grade: inferStudentGradeNumber(studentProfile) ? `F${inferStudentGradeNumber(studentProfile)}` : "",
    class_name: studentProfile.class_name || "",
    profile_grade: studentProfile.grade || "",
    selection_rules: "Use grade < student grade. Try lv4, lv3, lv2. Need 4 questions per included level. Never repeat sub-topic. Avoid repeated topic first; allow repeated topic only if needed. Lv5 is not tested, so the highest starting level is lv5.",
    lower_grade_pool_count: rows.length,
    pool_summary: summarizeAssessmentPool(rows),
    level_details,
    selected_by_level: selectedByLevel,
    selected: questions.map((q) => ({
      id: q.id,
      difficulty: q.difficulty,
      grade: q.grade,
      topic: q.topic,
      sub_type: q.sub_type
    })),
    repeated_topics_in_selected: questions.length !== selectedTopics.size,
    repeated_subtopics_in_selected: questions.length !== selectedSubtopics.size
  };
}

async function initializeProgressFromAssessment(studentProfile, counts, totals = {}) {
  const studentId = studentProfile.user_id;
  const levels = ["lv2", "lv3", "lv4", "lv5"];
  const normalizedCounts = Object.fromEntries(levels.map((level) => [level, Number(counts[level] || 0)]));
  const normalizedTotals = Object.fromEntries(levels.map((level) => [level, Number(totals[level] || 0)]));
  let startDifficulty = "lv2";
  const backfillDiffs = [];
  let highestFullyCorrect = "";
  for (const level of levels) {
    if (normalizedTotals[level] <= 0) continue;
    if (normalizedCounts[level] !== normalizedTotals[level]) break;
    highestFullyCorrect = level;
  }
  if (highestFullyCorrect) {
    startDifficulty = nextAssessmentDifficulty(highestFullyCorrect);
    for (const level of levels) {
      if (level === startDifficulty) break;
      if (normalizedTotals[level] > 0 && normalizedCounts[level] === normalizedTotals[level]) {
        backfillDiffs.push(level);
      }
    }
  }

  const allRows = await fetchProblemRowsPaged();
  const { comboList } = buildProblemPoolIndex(allRows);
  const upserts = [];
  for (const combo of comboList) {
    if (combo.difficulty === startDifficulty) {
      upserts.push(upsertStudentLearningProgress({ ...makeDefaultProgressRow(studentId, combo, PROGRESS_STATUS.UNKNOWN), initial_assessment_done: true }));
    } else if (backfillDiffs.includes(combo.difficulty)) {
      upserts.push(upsertStudentLearningProgress({ ...makeDefaultProgressRow(studentId, combo, PROGRESS_STATUS.BACKFILL), initial_assessment_done: true }));
    }
  }
  await Promise.all(upserts);

  const { error } = await supabase.from("student_initial_assessments").upsert(
    {
      student_id: studentId,
      lv2_correct: normalizedCounts.lv2,
      lv3_correct: normalizedCounts.lv3,
      lv4_correct: normalizedCounts.lv4,
      lv5_correct: normalizedCounts.lv5,
      start_difficulty: startDifficulty,
      completed_at: new Date().toISOString()
    },
    { onConflict: "student_id" }
  );
  if (error) throw new Error(error.message);
  return { start_difficulty: startDifficulty, backfill_difficulties: backfillDiffs };
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

function hasTikz(text) {
  return /\[TIKZ\][\s\S]*?\[\/TIKZ\]/i.test(String(text || "")) ||
    /\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}/.test(String(text || ""));
}

function normalizeTikz(block) {
  let s = String(block || "")
    .trim()
    .replace(/\\n(?![A-Za-z])/g, "\n");
  s = s.replace(/\\text\{([^}]*)\}/g, "$1");
  s = s.replace(
    /\\node(\[[^\]]*\])?\s*at\s*\(([^)]*)\)\s*\$([^$]+)\$\s*;/g,
    (_m, opt = "", coord, label) => `\\node${opt} at (${coord}) {$${label}$};`
  );
  s = s.replace(
    /\\node(\[[^\]]*\])?\s*at\s*\(([^)]*)\)\s*\{\$([^$]+)\$\}\s*;/g,
    (_m, opt = "", coord, label) => `\\node${opt} at (${coord}) {$${label}$};`
  );
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

function wrapTikzLatexDocument(tikzSource) {
  const source = normalizeTikz(tikzSource);
  if (/\\begin\{document\}/.test(source)) return source;
  return [
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
}

function toBase64Url(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function buildKrokiTikzSvgUrl(tikzSource) {
  const latexDoc = wrapTikzLatexDocument(tikzSource);
  const compressed = zlib.deflateSync(Buffer.from(latexDoc, "utf8"), { level: 9 });
  return `${KROKI_BASE_URL.replace(/\/+$/g, "")}/tikz/svg/${toBase64Url(compressed)}`;
}

function buildKrokiTikzSvgPostUrl() {
  return `${KROKI_BASE_URL.replace(/\/+$/g, "")}/tikz/svg`;
}

function hashText(text) {
  return crypto.createHash("sha256").update(String(text || "")).digest("hex").slice(0, 16);
}

function sanitizeSvg(svg) {
  const value = String(svg || "").trim();
  if (!value.includes("<svg")) throw new Error("Renderer did not return SVG content.");
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

function stripMathLabel(label) {
  return String(label || "")
    .replace(/^\s*\$|\$\s*$/g, "")
    .replace(/\\\(|\\\)/g, "")
    .trim();
}

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseTikzCoordinate(value) {
  const parts = String(value || "").split(",").map((part) => Number(String(part).trim()));
  if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part))) return null;
  return { x: parts[0], y: parts[1] };
}

function evaluateSimplePlotExpression(expression, x) {
  const jsExpression = String(expression || "").replace(/\\x/g, "x").replace(/\^/g, "**");
  if (!/^[0-9x+\-*/().\s*]+$/.test(jsExpression)) return null;
  try {
    const value = Function("x", `"use strict"; return (${jsExpression});`)(x);
    return Number.isFinite(value) ? value : null;
  } catch (_error) {
    return null;
  }
}

function renderSimpleTikzToSvg(tikzSource) {
  const source = normalizeTikz(tikzSource);
  if (!/\\begin\{tikzpicture\}/.test(source) || !/\\end\{tikzpicture\}/.test(source)) return null;

  const lines = [];
  const labels = [];
  const plots = [];
  const points = [];
  const rememberPoint = (point) => {
    if (point) points.push(point);
  };

  const linePattern = /\\draw(\[[^\]]*\])?\s*\(([^)]*)\)\s*--\s*\(([^)]*)\)(?:\s*node\[([^\]]*)\]\s*\{([^}]*)\})?\s*;/g;
  let lineMatch;
  while ((lineMatch = linePattern.exec(source))) {
    const start = parseTikzCoordinate(lineMatch[2]);
    const end = parseTikzCoordinate(lineMatch[3]);
    if (!start || !end) continue;
    lines.push({ start, end, arrow: String(lineMatch[1] || "").includes("->") });
    rememberPoint(start);
    rememberPoint(end);
    if (lineMatch[5]) labels.push({ point: end, text: stripMathLabel(lineMatch[5]), anchor: String(lineMatch[4] || "") });
  }

  const plotPattern = /\\draw\[([^\]]*domain\s*=\s*([-0-9.]+)\s*:\s*([-0-9.]+)[^\]]*)\]\s*plot\s*\(\s*\{\\x\}\s*,\s*\{([^}]*)\}\s*\)\s*;/g;
  let plotMatch;
  while ((plotMatch = plotPattern.exec(source))) {
    const min = Number(plotMatch[2]);
    const max = Number(plotMatch[3]);
    const expression = plotMatch[4];
    if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) continue;
    const sampled = [];
    for (let i = 0; i <= 80; i += 1) {
      const x = min + ((max - min) * i) / 80;
      const y = evaluateSimplePlotExpression(expression, x);
      if (y === null) {
        sampled.length = 0;
        break;
      }
      const point = { x, y };
      sampled.push(point);
      rememberPoint(point);
    }
    if (sampled.length) plots.push(sampled);
  }

  const nodePattern = /\\node\s+at\s*\(([^)]*)\)\s*\{([^}]*)\}\s*;/g;
  let nodeMatch;
  while ((nodeMatch = nodePattern.exec(source))) {
    const point = parseTikzCoordinate(nodeMatch[1]);
    if (!point) continue;
    labels.push({ point, text: stripMathLabel(nodeMatch[2]), anchor: "" });
    rememberPoint(point);
  }

  if (!lines.length && !plots.length) return null;

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs) - 0.4;
  const maxX = Math.max(...xs) + 0.4;
  const minY = Math.min(...ys) - 0.4;
  const maxY = Math.max(...ys) + 0.4;
  const width = 360;
  const height = 300;
  const pad = 28;
  const scale = Math.min((width - pad * 2) / Math.max(maxX - minX, 1), (height - pad * 2) / Math.max(maxY - minY, 1));
  const toSvgPoint = (point) => ({ x: pad + (point.x - minX) * scale, y: height - pad - (point.y - minY) * scale });
  const svgLines = lines.map((line) => {
    const start = toSvgPoint(line.start);
    const end = toSvgPoint(line.end);
    return `<line x1="${start.x.toFixed(2)}" y1="${start.y.toFixed(2)}" x2="${end.x.toFixed(2)}" y2="${end.y.toFixed(2)}" stroke="#111827" stroke-width="1.5"${line.arrow ? ' marker-end="url(#arrow)"' : ""}/>`;
  });
  const svgPlots = plots.map((plot) => {
    const d = plot.map((point, index) => {
      const svgPoint = toSvgPoint(point);
      return `${index === 0 ? "M" : "L"} ${svgPoint.x.toFixed(2)} ${svgPoint.y.toFixed(2)}`;
    }).join(" ");
    return `<path d="${d}" fill="none" stroke="#0f766e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
  });
  const svgLabels = labels.filter((label) => label.text).map((label) => {
    const point = toSvgPoint(label.point);
    const anchor = String(label.anchor || "");
    const dx = anchor.includes("right") ? 12 : anchor.includes("left") ? -12 : 0;
    const dy = anchor.includes("above") ? -10 : anchor.includes("below") ? 14 : 4;
    const textAnchor = anchor.includes("left") ? "end" : "middle";
    return `<text x="${(point.x + dx).toFixed(2)}" y="${(point.y + dy).toFixed(2)}" font-family="Arial, sans-serif" font-size="14" text-anchor="${textAnchor}" fill="#111827">${escapeXml(label.text)}</text>`;
  });

  return sanitizeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,4 L0,8 Z" fill="#111827"/></marker></defs>
<rect width="100%" height="100%" fill="white"/>
${svgLines.join("\n")}
${svgPlots.join("\n")}
${svgLabels.join("\n")}
</svg>`);
}

async function ensureQuestionFigureBucket() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;
  if ((buckets || []).some((bucket) => bucket.name === QUESTION_FIGURE_BUCKET)) return;

  const { error } = await supabase.storage.createBucket(QUESTION_FIGURE_BUCKET, {
    public: true,
    fileSizeLimit: 1024 * 1024,
    allowedMimeTypes: ["image/svg+xml"]
  });
  if (error && !/already exists/i.test(error.message || "")) throw error;
}

async function renderTikzToSvg(tikzSource) {
  const latexDoc = wrapTikzLatexDocument(tikzSource);
  let response;
  try {
    response = await fetch(buildKrokiTikzSvgPostUrl(), {
      method: "POST",
      headers: {
        Accept: "image/svg+xml",
        "Content-Type": "text/plain"
      },
      body: latexDoc
    });
  } catch (error) {
    const localSvg = renderSimpleTikzToSvg(tikzSource);
    if (localSvg) return localSvg;
    throw new Error(`TikZ render service unavailable: ${error.message || "fetch failed"}`);
  }
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`TikZ render failed (${response.status}): ${body.slice(0, 180)}`);
  }
  return sanitizeSvg(body);
}

async function uploadGeneratedSvg(tikzSource, svg) {
  const fileHash = hashText(tikzSource);
  const objectPath = `generated/${fileHash}.svg`;
  const { error } = await supabase.storage.from(QUESTION_FIGURE_BUCKET).upload(objectPath, svg, {
    contentType: "image/svg+xml",
    cacheControl: "31536000",
    upsert: true
  });
  if (error) throw error;

  const { data } = supabase.storage.from(QUESTION_FIGURE_BUCKET).getPublicUrl(objectPath);
  if (!data?.publicUrl) throw new Error(`Could not build public URL for ${objectPath}`);
  return data.publicUrl;
}

async function replaceTikzWithSvgFigures(text) {
  if (!hasTikz(text)) return { text: String(text || ""), figureCount: 0 };

  await ensureQuestionFigureBucket();
  const source = String(text || "");
  const pattern = /\[TIKZ\]([\s\S]*?)\[\/TIKZ\]|(\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\})/gi;
  let cursor = 0;
  let output = "";
  let figureCount = 0;
  let match;

  while ((match = pattern.exec(source))) {
    output += source.slice(cursor, match.index);
    const tikzSource = normalizeTikz(match[1] || match[2] || "");
    const originalBlock = match[0];
    try {
      const svg = await renderTikzToSvg(tikzSource);
      const publicUrl = await uploadGeneratedSvg(tikzSource, svg);
      output += `[FIGURE:${publicUrl}]`;
      figureCount += 1;
    } catch (error) {
      console.warn("TikZ auto-conversion skipped; keeping original TikZ block:", error.message || error);
      output += originalBlock;
    }
    cursor = pattern.lastIndex;
  }
  output += source.slice(cursor);
  return { text: output, figureCount };
}

async function prepareProblemFigures(problem) {
  if (!AUTO_CONVERT_TIKZ) return { problem, converted_figures: 0 };

  const hasQuestionTikz = hasTikz(problem.latex_code);
  const hasSolutionTikz = hasTikz(problem.solution_latex);
  if (!hasQuestionTikz && !hasSolutionTikz) return { problem, converted_figures: 0 };

  const next = { ...problem };
  let converted_figures = 0;

  if (hasQuestionTikz) {
    next.latex_code_original = problem.latex_code;
    const result = await replaceTikzWithSvgFigures(problem.latex_code);
    next.latex_code = result.text.trim();
    converted_figures += result.figureCount;
  }

  if (hasSolutionTikz) {
    next.solution_latex_original = problem.solution_latex;
    const result = await replaceTikzWithSvgFigures(problem.solution_latex);
    next.solution_latex = result.text.trim();
    converted_figures += result.figureCount;
  }

  return { problem: next, converted_figures };
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
    message.toLowerCase().includes("latex_code_original") ||
    message.toLowerCase().includes("solution_latex_original") ||
    message.toLowerCase().includes("answer_text") ||
    message.toLowerCase().includes("question_type")
  );
}

async function insertWithSolutionFallback(problem) {
  const payload = {
    latex_code: problem.latex_code,
    solution_latex: problem.solution_latex || null,
    latex_code_original: problem.latex_code_original || null,
    solution_latex_original: problem.solution_latex_original || null,
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
    latex_code_original: problem.latex_code_original || null,
    solution_latex_original: problem.solution_latex_original || null,
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
    latex_code_original: item.latex_code_original || null,
    solution_latex_original: item.solution_latex_original || null,
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

app.get("/api/meta", (_req, res) => {
  res.json({
    difficulties: DIFF,
    grades: GRADES,
    question_types: QUESTION_TYPES,
    ai_enabled: hasGeneratorConfig,
    daily_policy_version: 2,
    ai_provider: hasAIConfig ? "gemini" : "fallback",
    school_domain: SCHOOL_EMAIL_DOMAIN || null
  });
});

app.get("/api/meta/scope-options", ensureCloud, requireAuth, requireRole("teacher"), async (_req, res) => {
  let data = [];
  try {
    data = await fetchProblemRowsPaged({ columns: "id,difficulty,topic" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

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

app.get("/api/teacher/question-bank/subtopics", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const topic = String(req.query.topic || "").trim();
  if (!topic) return res.status(400).json({ error: "topic is required." });
  const { data, error } = await supabase
    .from("problems")
    .select("difficulty,topic,sub_type")
    .eq("topic", topic);
  if (error) return res.status(500).json({ error: error.message });

  const dedup = new Map();
  for (const row of data || []) {
    const difficulty = String(row.difficulty || "").trim();
    const subType = String(row.sub_type || "").trim();
    if (!subType) continue;
    const key = `${difficulty}|||${subType}`;
    if (!dedup.has(key)) {
      dedup.set(key, { difficulty, topic, sub_type: subType });
    }
  }
  const subtopics = [...dedup.values()].sort((a, b) => {
    const diffCmp = DIFF.indexOf(a.difficulty) - DIFF.indexOf(b.difficulty);
    if (diffCmp !== 0) return diffCmp;
    return String(a.sub_type || "").localeCompare(String(b.sub_type || ""), "en", { numeric: true, sensitivity: "base" });
  });
  return res.json({ topic, subtopics });
});

app.get("/api/student/practice/options", ensureCloud, requireAuth, requireRole("student"), async (_req, res) => {
  let data = [];
  try {
    data = await fetchProblemRowsPaged({ columns: "id,difficulty,topic,sub_type,grade" });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to load practice options." });
  }
  const dedup = new Map();
  for (const row of data || []) {
    const grade = String(row.grade || "").trim();
    const difficulty = String(row.difficulty || "").trim();
    const topic = String(row.topic || "").trim();
    const subType = String(row.sub_type || "").trim();
    if (!grade || !difficulty || !topic || !subType) continue;
    const key = `${grade}|||${difficulty}|||${topic}|||${subType}`;
    if (!dedup.has(key)) dedup.set(key, { grade, difficulty, topic, sub_type: subType });
  }
  return res.json({ options: [...dedup.values()].sort(compareComboOrder) });
});

app.post("/api/student/practice/question", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  const grade = String(req.body.grade || "").trim();
  const difficulty = String(req.body.difficulty || "").trim();
  const topic = String(req.body.topic || "").trim();
  const subType = String(req.body.sub_type || "").trim();
  const excludeIds = new Set(
    (Array.isArray(req.body.exclude_question_ids) ? req.body.exclude_question_ids : [])
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0)
  );
  let query = supabase
    .from("problems")
    .select("id,question_type,difficulty,topic,sub_type,grade,latex_code,answer_text,solution_latex")
    .limit(500);
  if (grade) query = query.eq("grade", grade);
  if (difficulty) query = query.eq("difficulty", difficulty);
  if (topic) query = query.eq("topic", topic);
  if (subType) query = query.eq("sub_type", subType);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  const rows = Array.isArray(data) ? data : [];
  const fresh = rows.filter((row) => !excludeIds.has(Number(row.id)));
  const pool = fresh.length ? fresh : rows;
  const question = pool[Math.floor(Math.random() * pool.length)] || null;
  if (!question) return res.status(404).json({ error: "No question found for the selected practice scope." });
  return res.json({ question });
});

app.post("/api/student/practice/submit", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  const questionId = Number(req.body.question_id);
  const answerText = String(req.body.answer_text || "").trim();
  const timeSpentSeconds = normalizeTimeSpentSeconds(req.body.time_spent_seconds);
  if (!Number.isInteger(questionId) || questionId <= 0) return res.status(400).json({ error: "Valid question_id is required." });
  if (!answerText) return res.status(400).json({ error: "answer_text is required." });

  const { data: problem, error: problemError } = await supabase
    .from("problems")
    .select("id,answer_text,difficulty,topic,sub_type")
    .eq("id", questionId)
    .maybeSingle();
  if (problemError) return res.status(500).json({ error: problemError.message });
  if (!problem) return res.status(404).json({ error: "Question not found." });

  const isCorrect = compareAnswer(answerText, problem.answer_text);
  const { data: previousPractice, error: previousError } = await supabase
    .from("student_practice_submissions")
    .select("is_correct,submitted_at")
    .eq("student_id", req.profile.user_id)
    .order("submitted_at", { ascending: false })
    .limit(2000);
  if (previousError) {
    if (isMissingTableError(previousError)) {
      return res.status(500).json({
        error: "Practice mode needs the new student_practice_submissions table. Please run the updated Supabase SQL schema once."
      });
    }
    return res.status(500).json({ error: previousError.message });
  }

  const { data, error } = await supabase
    .from("student_practice_submissions")
    .insert({
      student_id: req.profile.user_id,
      question_id: questionId,
      answer_text: answerText,
      is_correct: isCorrect,
      time_spent_seconds: timeSpentSeconds
    })
    .select("id,question_id,answer_text,is_correct,submitted_at,time_spent_seconds")
    .single();
  if (error) {
    if (isMissingTableError(error)) {
      return res.status(500).json({
        error: "Practice mode needs the new student_practice_submissions table. Please run the updated Supabase SQL schema once."
      });
    }
    return res.status(500).json({ error: error.message });
  }

  let tokenReward = 0;
  let tokenBalance = null;
  try {
    const nextCorrectStreak = isCorrect ? computeTrailingCorrectStreak([...(previousPractice || [])].reverse()) + 1 : 0;
    tokenReward = computeQuestionTokenReward({ isCorrect, timeSpentSeconds, nextCorrectStreak });
    tokenBalance = await grantStudentTokens(req.profile.user_id, tokenReward, "practice_submission", {
      question_id: questionId,
      is_correct: isCorrect === true,
      correct_streak_after_submit: nextCorrectStreak
    });
  } catch (_tokenError) {
    tokenReward = 0;
    tokenBalance = null;
  }

  return res.json({
    submission: data,
    is_correct: isCorrect,
    correct_answer: problem.answer_text || "",
    token_reward: tokenReward,
    token_balance: tokenBalance
  });
});

app.get("/api/client-config", ensureClientAuth, (_req, res) => {
  res.json({
    supabase_url: SUPABASE_URL,
    supabase_anon_key: SUPABASE_ANON_KEY,
    school_domain: SCHOOL_EMAIL_DOMAIN || null,
    timezone: APP_TIMEZONE,
    google_client_id: GOOGLE_CLIENT_ID || null,
    signup_disabled: DISABLE_SIGNUP || isAdminUploadOnlyMode
  });
});

app.post("/api/auth/check-email", ensureCloud, ensureClientAuth, async (req, res) => {
  const email = normalizeEmail(req.body.email);
  if (!email) return res.status(400).json({ error: "Email is required." });
  if (!isAllowedSchoolEmail(email)) return res.json({ exists: false });

  const { data, error } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("email", email)
    .limit(1);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ exists: Array.isArray(data) && data.length > 0 });
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

function normalizeAdminAccountPayload(item) {
  const email = normalizeEmail(item?.email);
  const password = String(item?.password || "").trim();
  const role = String(item?.role || "student").trim().toLowerCase();
  const fullName = String(item?.full_name || item?.name || "").trim();
  const className = String(item?.class_name || item?.class || "").trim();
  return {
    email,
    password,
    role,
    full_name: fullName || email,
    class_name: role === "student" ? className || null : null
  };
}

app.post("/api/admin/accounts/batch", ensureCloud, requireAuth, requireRole("admin"), async (req, res) => {
  const accounts = Array.isArray(req.body.accounts) ? req.body.accounts : [];
  if (!accounts.length) {
    return res.status(400).json({ error: "accounts array is required." });
  }
  if (accounts.length > 200) {
    return res.status(400).json({ error: "Create at most 200 accounts per batch." });
  }

  const results = [];
  for (const raw of accounts) {
    const item = normalizeAdminAccountPayload(raw);
    const result = { email: item.email, role: item.role, ok: false };
    try {
      if (!item.email || !item.password) throw new Error("Email and password are required.");
      if (!["student", "teacher"].includes(item.role)) throw new Error("Role must be student or teacher.");
      if (item.password.length < 8) throw new Error("Password must be at least 8 characters.");
      if (!isAllowedSchoolEmail(item.email)) throw new Error("Use a school email account.");

      const metadata = {
        full_name: item.full_name,
        role: item.role,
        grade: null,
        class_name: item.role === "student" ? item.class_name : null
      };
      const { data, error } = await supabase.auth.admin.createUser({
        email: item.email,
        password: item.password,
        email_confirm: true,
        user_metadata: metadata
      });
      if (error) throw new Error(error.message);
      const userId = data?.user?.id;
      if (!userId) throw new Error("Supabase did not return a created user id.");

      const profilePayload = {
        user_id: userId,
        email: item.email,
        full_name: item.full_name,
        role: item.role,
        grade: null,
        class_name: item.role === "student" ? item.class_name : null
      };
      const { error: profileError } = await supabase.from("user_profiles").upsert(profilePayload, { onConflict: "user_id" });
      if (profileError) throw new Error(profileError.message);

      result.ok = true;
      result.user_id = userId;
      result.class_name = profilePayload.class_name;
    } catch (error) {
      result.error = error.message || "Failed to create account.";
    }
    results.push(result);
  }

  const created = results.filter((x) => x.ok).length;
  return res.status(created ? 201 : 400).json({
    created,
    failed: results.length - created,
    results
  });
});

app.get("/api/admin/accounts", ensureCloud, requireAuth, requireRole("admin"), async (_req, res) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("user_id,email,full_name,role,grade,class_name,updated_at")
    .order("role", { ascending: true })
    .order("class_name", { ascending: true })
    .order("full_name", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ accounts: data || [] });
});

app.delete("/api/admin/accounts/:userId", ensureCloud, requireAuth, requireRole("admin"), async (req, res) => {
  const userId = String(req.params.userId || "").trim();
  if (!userId) return res.status(400).json({ error: "User id is required." });
  if (userId === String(req.profile.user_id || "")) {
    return res.status(400).json({ error: "You cannot delete the admin account you are currently using." });
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("user_id,email,full_name,role")
    .eq("user_id", userId)
    .maybeSingle();
  if (profileError) return res.status(500).json({ error: profileError.message });
  if (!profile) return res.status(404).json({ error: "Account not found." });

  const { error: authError } = await supabase.auth.admin.deleteUser(userId);
  if (authError && !/not found|does not exist/i.test(authError.message || "")) {
    return res.status(500).json({ error: authError.message });
  }

  const { error: cleanupError } = await supabase.from("user_profiles").delete().eq("user_id", userId);
  if (cleanupError) return res.status(500).json({ error: cleanupError.message });

  return res.json({ deleted: true, account: profile });
});

function normalizeAdminAccountUpdatePayload(body) {
  const hasRole = Object.prototype.hasOwnProperty.call(body || {}, "role");
  const role = hasRole ? String(body?.role || "").trim().toLowerCase() : "";
  const hasFullName = Object.prototype.hasOwnProperty.call(body || {}, "full_name");
  const fullName = hasFullName ? String(body?.full_name || "").trim() : "";
  const hasGrade = Object.prototype.hasOwnProperty.call(body || {}, "grade");
  const grade = hasGrade ? String(body?.grade || "").trim() : "";
  const hasClassName = Object.prototype.hasOwnProperty.call(body || {}, "class_name");
  const className = hasClassName ? String(body?.class_name || "").trim() : "";
  const password = String(body?.password || "").trim();
  return {
    role,
    full_name: fullName,
    grade: grade || null,
    class_name: className || null,
    password,
    has_role: hasRole && Boolean(role),
    has_full_name: hasFullName,
    has_grade: hasGrade,
    has_class_name: hasClassName
  };
}

async function updateAdminManagedAccount(userId, payload, options = {}) {
  if (!userId) throw new Error("User id is required.");
  const partial = Boolean(options.partial);
  const { data: existing, error: existingError } = await supabase
    .from("user_profiles")
    .select("user_id,email,full_name,role,grade,class_name")
    .eq("user_id", userId)
    .maybeSingle();
  if (existingError) throw new Error(existingError.message);
  if (!existing) throw new Error("Account profile not found.");

  const rawNext = normalizeAdminAccountUpdatePayload(payload);
  const nextRole = partial && !rawNext.role ? String(existing.role || "") : rawNext.role;
  const next = {
    role: nextRole,
    full_name: partial && !rawNext.has_full_name ? String(existing.full_name || "") : rawNext.full_name,
    grade: partial && !rawNext.has_grade ? existing.grade : (nextRole === "student" ? rawNext.grade : null),
    class_name: partial && !rawNext.has_class_name ? existing.class_name : (nextRole === "student" ? rawNext.class_name : null),
    password: rawNext.password
  };
  if (!["student", "teacher", "admin"].includes(next.role)) throw new Error("Role must be student, teacher, or admin.");
  if (!next.full_name) throw new Error("Full name is required.");
  if (next.password && next.password.length < 8) throw new Error("Password must be at least 8 characters.");

  const authUpdates = {
    user_metadata: {
      full_name: next.full_name,
      role: next.role,
      grade: next.grade,
      class_name: next.class_name
    }
  };
  if (next.password) authUpdates.password = next.password;

  const { error: authError } = await supabase.auth.admin.updateUserById(userId, authUpdates);
  if (authError) throw new Error(authError.message);

  const { data, error } = await supabase
    .from("user_profiles")
    .update({
      full_name: next.full_name,
      role: next.role,
      grade: next.grade,
      class_name: next.class_name
    })
    .eq("user_id", userId)
    .select("user_id,email,full_name,role,grade,class_name,updated_at")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Account profile not found.");
  return data;
}

app.patch("/api/admin/accounts/batch", ensureCloud, requireAuth, requireRole("admin"), async (req, res) => {
  const userIds = Array.isArray(req.body.user_ids)
    ? req.body.user_ids.map((id) => String(id || "").trim()).filter(Boolean)
    : [];
  if (!userIds.length) return res.status(400).json({ error: "Select at least one account." });
  if (userIds.length > 200) return res.status(400).json({ error: "Update at most 200 accounts per batch." });

  const results = [];
  for (const userId of userIds) {
    const result = { user_id: userId, ok: false };
    try {
      const account = await updateAdminManagedAccount(userId, req.body || {}, { partial: true });
      result.ok = true;
      result.account = account;
    } catch (error) {
      result.error = error.message || "Failed to update account.";
    }
    results.push(result);
  }
  const updated = results.filter((row) => row.ok).length;
  return res.status(updated ? 200 : 400).json({ updated, failed: results.length - updated, results });
});

app.patch("/api/admin/accounts/:userId", ensureCloud, requireAuth, requireRole("admin"), async (req, res) => {
  const userId = String(req.params.userId || "").trim();
  try {
    const account = await updateAdminManagedAccount(userId, req.body || {});
    return res.json({ account });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to update account." });
  }
});

app.get("/api/admin/teacher-class-assignments", ensureCloud, requireAuth, requireRole("admin"), async (_req, res) => {
  const { data: teachers, error: teacherError } = await supabase
    .from("user_profiles")
    .select("user_id,email,full_name")
    .eq("role", "teacher")
    .order("full_name", { ascending: true });
  if (teacherError) return res.status(500).json({ error: teacherError.message });

  const { data: students, error: studentError } = await supabase
    .from("user_profiles")
    .select("class_name")
    .eq("role", "student");
  if (studentError) return res.status(500).json({ error: studentError.message });

  const classNames = [...new Set((students || []).map((s) => String(s.class_name || "").trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "en", { numeric: true, sensitivity: "base" })
  );

  const { data: assignments, error: assignmentError } = await supabase
    .from("class_teacher_assignments")
    .select("id,class_name,teacher_id,user_profiles(full_name,email)")
    .order("class_name", { ascending: true });
  if (assignmentError) {
    if (isMissingTableError(assignmentError)) {
      return res.json({ teachers: teachers || [], classes: classNames, assignments: [] });
    }
    return res.status(500).json({ error: assignmentError.message });
  }

  return res.json({
    teachers: teachers || [],
    classes: classNames,
    assignments: Array.isArray(assignments) ? assignments : []
  });
});

app.put("/api/admin/teacher-class-assignments", ensureCloud, requireAuth, requireRole("admin"), async (req, res) => {
  const incoming = Array.isArray(req.body.assignments) ? req.body.assignments : [];
  const rows = incoming
    .map((row) => ({
      class_name: String(row?.class_name || "").trim(),
      teacher_id: String(row?.teacher_id || "").trim()
    }))
    .filter((row) => row.class_name && row.teacher_id);

  const { error: clearError } = await supabase.from("class_teacher_assignments").delete().neq("id", 0);
  if (clearError) return res.status(500).json({ error: clearError.message });

  if (rows.length) {
    const { error: insertError } = await supabase
      .from("class_teacher_assignments")
      .upsert(rows, { onConflict: "class_name,teacher_id" });
    if (insertError) return res.status(500).json({ error: insertError.message });
  }

  return res.json({ saved: rows.length });
});

app.get("/api/auth/me", ensureCloud, requireAuth, async (req, res) => {
  let profile = req.profile;
  try {
    profile = (await fetchLatestStudentProfile(req.profile)) || req.profile;
  } catch (_error) {
    profile = req.profile;
  }
  const base = {
    id: profile.user_id,
    email: profile.email,
    full_name: profile.full_name,
    role: profile.role,
    grade: profile.grade,
    class_name: profile.class_name || null
  };
  if (profile.role !== "student") return res.json(base);

  try {
    const [avatarData, frameData] = await Promise.all([
      fetchAvatarCatalogForStudent(profile.user_id),
      fetchFrameCatalogForStudent(profile.user_id).catch(() => [])
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

app.get("/api/student/initial-assessment", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  try {
    const completed = await hasCompletedInitialAssessment(req.profile.user_id);
    if (completed) return res.json({ completed: true, assessment: completed, questions: [] });
    const questions = await buildInitialAssessmentQuestions(req.profile);
    const debug = await buildInitialAssessmentDebug(req.profile, questions);
    if (!questions.length) {
      const placement = await initializeProgressFromAssessment(req.profile, {}, {});
      return res.json({ completed: true, skipped: true, counts: { lv2: 0, lv3: 0, lv4: 0, lv5: 0 }, totals: { lv2: 0, lv3: 0, lv4: 0, lv5: 0 }, debug, ...placement });
    }
    return res.json({ completed: false, questions, debug });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to build initial assessment." });
  }
});

app.get("/api/student/initial-assessment/debug", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  try {
    const completed = await hasCompletedInitialAssessment(req.profile.user_id);
    const debug = await buildInitialAssessmentDebug(req.profile);
    return res.json({ completed: Boolean(completed), assessment: completed || null, debug });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to debug initial assessment." });
  }
});

app.post("/api/student/initial-assessment/submit", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
  if (!answers.length) return res.status(400).json({ error: "answers are required." });
  try {
    const completed = await hasCompletedInitialAssessment(req.profile.user_id);
    if (completed) return res.json({ completed: true, assessment: completed });

    const questionIds = answers.map((a) => Number(a?.question_id)).filter((id) => Number.isInteger(id) && id > 0);
    const { data: problems, error } = await supabase
      .from("problems")
      .select("id,answer_text,difficulty")
      .in("id", questionIds);
    if (error) throw new Error(error.message);
    const problemById = new Map((problems || []).map((p) => [Number(p.id), p]));
    const counts = { lv2: 0, lv3: 0, lv4: 0, lv5: 0 };
    const totals = { lv2: 0, lv3: 0, lv4: 0, lv5: 0 };
    for (const answer of answers) {
      const problem = problemById.get(Number(answer?.question_id));
      const difficulty = String(problem?.difficulty || "").trim();
      if (!Object.prototype.hasOwnProperty.call(counts, difficulty)) continue;
      totals[difficulty] += 1;
      if (!isDontKnowAnswer(answer?.answer_text) && compareAnswer(answer?.answer_text, problem?.answer_text) === true) {
        counts[difficulty] += 1;
      }
    }
    const placement = await initializeProgressFromAssessment(req.profile, counts, totals);
    const answerRows = answers
      .map((answer) => {
        const problem = problemById.get(Number(answer?.question_id));
        if (!problem) return null;
        const answerText = String(answer?.answer_text || "").trim();
        return {
          student_id: req.profile.user_id,
          question_id: Number(problem.id),
          answer_text: answerText,
          is_correct: !isDontKnowAnswer(answerText) && compareAnswer(answerText, problem.answer_text) === true
        };
      })
      .filter(Boolean);
    if (answerRows.length) {
      const { error: answerSaveError } = await supabase
        .from("student_initial_assessment_answers")
        .upsert(answerRows, { onConflict: "student_id,question_id" });
      if (answerSaveError && !isMissingTableError(answerSaveError)) throw new Error(answerSaveError.message);
    }
    let tokenBalance = null;
    try {
      tokenBalance = await grantStudentTokens(
        req.profile.user_id,
        INITIAL_ASSESSMENT_COMPLETION_TOKENS,
        "initial_assessment_completion",
        {
          start_difficulty: placement.start_difficulty || placement.start_level || null,
          counts,
          totals
        }
      );
    } catch (_tokenError) {
      tokenBalance = null;
    }
    return res.json({
      completed: true,
      counts,
      totals,
      token_reward: INITIAL_ASSESSMENT_COMPLETION_TOKENS,
      token_balance: tokenBalance,
      ...placement
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to submit initial assessment." });
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

const dailyExercise = createDailyExerciseService({
  db: supabase,
  today: getTodayDateString,
  loadContext: loadAdaptiveContext,
  loadProgress: loadAdaptiveProgress,
  score: compareAnswer,
  seconds: normalizeTimeSpentSeconds,
  questionReward: computeQuestionTokenReward,
  trailingCorrect: computeTrailingCorrectStreak
});

function dailyRoute(handler) {
  return async (req, res) => {
    try {
      return res.json(await handler(req));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message || "Daily Mission could not be loaded." });
    }
  };
}

app.get("/api/student/daily", ensureCloud, requireAuth, requireRole("student"), dailyRoute(req =>
  dailyExercise.getDaily(req.profile, String(req.query.date || "").trim())
));

app.get("/api/student/schedule", ensureCloud, requireAuth, requireRole("student"), dailyRoute(req =>
  dailyExercise.getSchedule(req.profile)
));

app.post("/api/student/daily/extend", ensureCloud, requireAuth, requireRole("student"), (_req, res) =>
  res.status(410).json({ error: "Use Practice mode to answer extra questions." })
);

app.post("/api/student/daily/refresh-latest", ensureCloud, requireAuth, requireRole("student"), (_req, res) =>
  res.status(410).json({ error: "Today's Daily Mission is already planned." })
);

app.post("/api/student/submit", ensureCloud, requireAuth, requireRole("student"), dailyRoute(req =>
  dailyExercise.submit(req.profile, req.body || {})
));

app.post("/api/student/submit/:questionId/wrong-feedback", ensureCloud, requireAuth, requireRole("student"), dailyRoute(req =>
  dailyExercise.handleWrong(req.profile, req.params.questionId, req.body || {})
));

app.get("/api/student/stats", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  let studentProfile = req.profile;
  try {
    studentProfile = (await fetchLatestStudentProfile(req.profile)) || req.profile;
  } catch (freshProfileError) {
    return res.status(500).json({ error: freshProfileError.message });
  }

  const studentId = req.profile.user_id;
  const todayKey = getTodayDateString();
  const [{ data: submissions, error }, { data: assignments, error: assignmentError }] = await Promise.all([
    supabase.from("student_submissions")
      .select("student_id,question_id,assignment_date,is_correct,time_spent_seconds,submitted_at,assignment_id,assignment:daily_assignments(kind)")
      .eq("student_id", studentId),
    supabase.from("daily_assignments").select("question_id,kind,slot").eq("student_id", studentId)
      .eq("assignment_date", todayKey).eq("deferred", false)
  ]);
  if (error) return res.status(500).json({ error: error.message });
  if (assignmentError) return res.status(500).json({ error: assignmentError.message });

  const submissionRows = (submissions || []).filter(row => row.assignment?.kind !== "retest");
  let practiceRows = [];
  try {
    practiceRows = await fetchPracticeSubmissionsForStudents(req.profile.user_id);
  } catch (_practiceError) {
    practiceRows = [];
  }
  const performanceRows = [...submissionRows, ...practiceRows];
  const stats = computeSubmissionStats(performanceRows);
  const todayIds = new Set((assignments || []).filter(isMain).map(row => row.question_id));
  const todayRows = submissionRows.filter(row => row.assignment_date === todayKey && todayIds.has(row.question_id));
  const submittedToday = todayRows.length;
  const correctToday = todayRows.filter((row) => row.is_correct === true).length;
  let completedDates;
  try {
    completedDates = (await getCompletedDates([studentId], submissionRows)).get(studentId);
  } catch (completionError) {
    return res.status(500).json({ error: completionError.message });
  }
  const finishedToday = completedDates.has(todayKey);
  let tokenBalance = 0;
  try {
    const wallet = await ensureStudentTokenWallet(req.profile.user_id);
    tokenBalance = Number(wallet.balance || 0);
  } catch (_error) {
    tokenBalance = 0;
  }
  let radar = { labels: ["Combo", "Aim", "Flash", "Grind", "Fortune"], student: {}, class_avg: {} };
  let aspectValues = {};
  let aspectLeaders = [];
  let classTitles = [];
  let classmatesPower = [];
  let initialTestLevel = "";
  try {
    const assessment = await hasCompletedInitialAssessment(req.profile.user_id);
    initialTestLevel = String(assessment?.start_difficulty || "");
  } catch (_assessmentError) {
    initialTestLevel = "";
  }
  try {
    const classAnalytics = await buildClassAnalytics(studentProfile.class_name, studentProfile.user_id, performanceRows, completedDates);
    radar = {
      labels: classAnalytics.labels,
      student: classAnalytics.student,
      class_avg: classAnalytics.class_avg
    };
    aspectValues = classAnalytics.student_values || {};
    aspectLeaders = classAnalytics.leaders || [];
    classTitles = classAnalytics.titles || [];
    classmatesPower = classAnalytics.classmates_power || [];
  } catch (_e) {
    // keep stats endpoint available even if class analytics fails
  }
  return res.json({
    student_id: studentProfile.user_id,
    student_name: studentProfile.full_name,
    grade: studentProfile.grade,
    class_name: studentProfile.class_name || null,
    token_balance: tokenBalance,
    today_date: todayKey,
    required_today: todayIds.size,
    submitted_today: submittedToday,
    correct_today: correctToday,
    finished_today: finishedToday,
    initial_test_level: initialTestLevel,
    radar,
    aspect_values: aspectValues,
    aspect_leaders: aspectLeaders,
    class_titles: classTitles,
    classmates_power: classmatesPower,
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
      "id, assignment_date, question_id, answer_text, is_correct, submitted_at, time_spent_seconds, feedback_state, assignment:daily_assignments(kind,reason,review_round), problems(question_type,difficulty,topic,sub_type,grade,latex_code,answer_text,solution_latex)"
    )
    .eq("student_id", req.profile.user_id)
    .order("submitted_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  let rows = (data || []).filter(row => !["pending", "retest"].includes(row.feedback_state))
    .map(row => ({ ...row, source_type: row.assignment?.kind === "retest" ? "retest" : "daily" }));
  const { data: assessmentRows, error: assessmentError } = await supabase
    .from("student_initial_assessment_answers")
    .select(
      "id, question_id, answer_text, is_correct, submitted_at, problems(question_type,difficulty,topic,sub_type,grade,latex_code,answer_text,solution_latex)"
    )
    .eq("student_id", req.profile.user_id)
    .order("submitted_at", { ascending: false });
  if (assessmentError && !isMissingTableError(assessmentError)) return res.status(500).json({ error: assessmentError.message });
  if (!assessmentError && Array.isArray(assessmentRows)) {
    rows.push(
      ...assessmentRows.map((row) => ({
        ...row,
        source_type: "initial_assessment",
        assignment_date: "Initial test",
        time_spent_seconds: null
      }))
    );
  }
  const { data: practiceRows, error: practiceError } = await supabase
    .from("student_practice_submissions")
    .select(
      "id, question_id, answer_text, is_correct, submitted_at, time_spent_seconds, problems(question_type,difficulty,topic,sub_type,grade,latex_code,answer_text,solution_latex)"
    )
    .eq("student_id", req.profile.user_id)
    .order("submitted_at", { ascending: false });
  if (practiceError && !isMissingTableError(practiceError)) return res.status(500).json({ error: practiceError.message });
  if (!practiceError && Array.isArray(practiceRows)) {
    rows.push(
      ...normalizePracticeSubmissions(practiceRows).map((row) => ({
        ...row,
        source_type: "practice"
      }))
    );
  }
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
  rows.sort((a, b) => String(b.submitted_at || "").localeCompare(String(a.submitted_at || "")));

  const stats = computeSubmissionStats(rows);
  return res.json({ count: rows.length, stats, records: rows });
});

function progressRowsToStatusGroups(rows, options = {}) {
  const comboRows = Array.isArray(options.comboRows) ? options.comboRows : [];
  const includeBlankCombos = options.includeBlankCombos !== false;
  const byTopic = new Map();
  const ensureTopic = (topic) => {
    const key = String(topic || "").trim() || "Unknown";
    if (!byTopic.has(key)) byTopic.set(key, []);
    return byTopic.get(key);
  };
  if (includeBlankCombos) {
    for (const combo of comboRows) {
      const topic = String(combo.topic || "").trim() || "Unknown";
      const subType = String(combo.sub_type || "").trim() || "Unknown";
      ensureTopic(topic).push({
        difficulty: combo.difficulty,
        topic,
        sub_type: subType,
        status: "",
        next_review_date: null,
        consecutive_correct_count: 0,
        wrong_count: 0,
        backfill_correct_count: 0
      });
    }
  }
  const rowByKey = new Map();
  for (const source of rows || []) {
    const row = dailyPolicy.normalizeProgress(source, source, "lv2", getTodayDateString());
    const topic = String(row.topic || "").trim() || "Unknown";
    const subType = String(row.sub_type || "").trim() || "Unknown";
    rowByKey.set(comboKey({ difficulty: row.difficulty, topic, sub_type: subType }), {
      difficulty: row.difficulty,
      topic,
      sub_type: subType,
      status: row.status,
      next_review_date: row.next_review_date || null,
      consecutive_correct_count: Number(row.consecutive_correct_count || 0),
      wrong_count: Number(row.wrong_count || 0),
      backfill_correct_count: Number(row.backfill_correct_count || 0)
    });
  }
  for (const [key, progress] of rowByKey.entries()) {
    const target = ensureTopic(progress.topic);
    const idx = target.findIndex((row) => comboKey(row) === key);
    if (idx >= 0) target[idx] = progress;
    else target.push(progress);
  }
  return [...byTopic.entries()]
    .map(([topic, subtopics]) => ({
      topic,
      subtopics: subtopics.sort(compareComboOrder)
    }))
    .sort((a, b) => a.topic.localeCompare(b.topic, "en", { numeric: true, sensitivity: "base" }));
}

async function backfillMissingProgressFromOfficialSubmissions(studentProfiles, options = {}) {
  const profiles = Array.isArray(studentProfiles) ? studentProfiles : [studentProfiles].filter(Boolean);
  const profileById = new Map(profiles.map((profile) => [String(profile?.user_id || ""), profile]).filter(([id]) => id));
  const ids = [...profileById.keys()];
  if (!ids.length) return 0;

  let submissionQuery = supabase
    .from("student_submissions")
    .select("student_id,assignment_date,question_id,is_correct,time_spent_seconds,submitted_at,problems(id,difficulty,topic,sub_type)")
    .in("student_id", ids)
    .order("submitted_at", { ascending: true });
  const { data: submissions, error: submissionError } = await submissionQuery;
  if (submissionError) throw new Error(submissionError.message);
  const submissionRows = (Array.isArray(submissions) ? submissions : []).filter((row) => row.problems);
  if (!submissionRows.length) return 0;

  const dates = [...new Set(submissionRows.map((row) => String(row.assignment_date || "").trim()).filter(Boolean))];
  const { data: assignments, error: assignmentError } = await supabase
    .from("daily_assignments")
    .select("student_id,assignment_date,question_id,slot,kind,reason")
    .in("student_id", ids)
    .in("assignment_date", dates);
  if (assignmentError) throw new Error(assignmentError.message);

  const officialKeys = new Set(
    (assignments || [])
      .filter(row => (row.kind === "legacy" || row.reason === "existing") && isMain(row))
      .map((row) => `${String(row.student_id || "")}|||${String(row.assignment_date || "")}|||${Number(row.question_id || 0)}`)
  );
  const officialSubmissions = submissionRows.filter((row) =>
    officialKeys.has(`${String(row.student_id || "")}|||${String(row.assignment_date || "")}|||${Number(row.question_id || 0)}`)
  );
  if (!officialSubmissions.length) return 0;

  let progressQuery = supabase
    .from("student_learning_progress")
    .select("student_id,difficulty,topic,sub_type")
    .in("student_id", ids);
  if (options.topic) progressQuery = progressQuery.eq("topic", options.topic);
  if (options.sub_type) progressQuery = progressQuery.eq("sub_type", options.sub_type);
  const { data: progressRows, error: progressError } = await progressQuery;
  if (progressError) throw new Error(progressError.message);

  const existingKeys = new Set((progressRows || []).map((row) => `${String(row.student_id || "")}|||${comboKey(row)}`));
  const missingGroups = new Map();
  for (const row of officialSubmissions) {
    const problem = row.problems || {};
    const combo = {
      difficulty: String(problem.difficulty || "").trim(),
      topic: String(problem.topic || "").trim(),
      sub_type: String(problem.sub_type || "").trim()
    };
    if (!combo.difficulty || !combo.topic || !combo.sub_type) continue;
    if (options.topic && combo.topic !== options.topic) continue;
    if (options.sub_type && combo.sub_type !== options.sub_type) continue;
    const key = `${String(row.student_id || "")}|||${comboKey(combo)}`;
    if (existingKeys.has(key)) continue;
    if (!missingGroups.has(key)) missingGroups.set(key, { studentId: String(row.student_id || ""), combo, rows: [] });
    missingGroups.get(key).rows.push(row);
  }

  const placementByStudent = new Map();
  const getPlacementForStudent = async (studentId) => {
    if (!placementByStudent.has(studentId)) {
      placementByStudent.set(studentId, await hasCompletedInitialAssessment(studentId).catch(() => null));
    }
    return placementByStudent.get(studentId);
  };

  const rebuildProgressRow = async (studentId, combo, rows) => {
    const placement = await getPlacementForStudent(studentId);
    const startDifficulty = String(placement?.start_difficulty || "lv2").trim();
    const startIdx = DIFF.indexOf(startDifficulty);
    const diffIdx = DIFF.indexOf(String(combo.difficulty || "").trim());
    const initialStatus = diffIdx >= 0 && startIdx > 0 && diffIdx < startIdx ? PROGRESS_STATUS.BACKFILL : PROGRESS_STATUS.UNKNOWN;
    const next = {
      ...makeDefaultProgressRow(studentId, combo, initialStatus),
      initial_assessment_done: Boolean(placement)
    };
    const sortedRows = [...rows].sort((a, b) => String(a.submitted_at || "").localeCompare(String(b.submitted_at || "")));

    for (const row of sortedRows) {
      const assignmentDate = String(row.assignment_date || "").trim();
      const isCorrect = row.is_correct === true;
      const status = normalizeProgressStatus(next);
      const questionId = Number(row.question_id || row.problems?.id || 0);
      if (Number.isInteger(questionId) && questionId > 0 && !next.done_variants.includes(questionId)) {
        next.done_variants.push(questionId);
      }

      if (status === PROGRESS_STATUS.BACKFILL) {
        if (isCorrect) {
          if (next.last_correct_date === assignmentDate || next.last_evidence_question_id === questionId) continue;
          next.backfill_correct_count = Number(next.backfill_correct_count || 0) + 1;
          next.last_correct_date = assignmentDate;
          next.last_evidence_question_id = questionId;
          next.careless_streak = 0;
          if (Number(next.backfill_correct_count || 0) >= 2) {
            next.status = PROGRESS_STATUS.MASTERED;
            next.mastery_achieved = true;
            next.review_stage = 5;
            next.next_review_date = null;
          }
        } else {
          next.status = PROGRESS_STATUS.UNKNOWN;
          next.mastery_achieved = false;
          next.review_stage = 0;
          next.next_review_date = null;
          next.consecutive_correct_count = 0;
          next.last_correct_date = null;
          next.wrong_count = Number(next.wrong_count || 0) + 1;
          next.backfill_correct_count = 0;
          next.careless_streak = 0;
        }
      } else if (status === PROGRESS_STATUS.KNOWN) {
        if (isCorrect) {
          const stage = Math.max(1, Number(next.review_stage || 1));
          next.pending_careless_retry = false;
          next.pending_retest_question_id = null;
          next.careless_retry_date = null;
          next.careless_streak = 0;
          next.wrong_count = 0;
          if (stage >= 5) {
            next.status = PROGRESS_STATUS.MASTERED;
            next.mastery_achieved = true;
            next.review_stage = 5;
            next.next_review_date = null;
          } else {
            const nextStage = stage + 1;
            next.status = PROGRESS_STATUS.KNOWN;
            next.mastery_achieved = true;
            next.review_stage = nextStage;
            next.next_review_date = addDaysDateString(assignmentDate, reviewIntervalByStage(nextStage));
          }
        } else {
          next.status = PROGRESS_STATUS.UNKNOWN;
          next.mastery_achieved = false;
          next.review_stage = 0;
          next.next_review_date = null;
          next.consecutive_correct_count = 0;
          next.last_correct_date = null;
          next.wrong_count = Number(next.wrong_count || 0) + 1;
          next.careless_streak = 0;
        }
      } else if (status === PROGRESS_STATUS.MASTERED) {
        if (!isCorrect) {
          next.status = PROGRESS_STATUS.UNKNOWN;
          next.mastery_achieved = false;
          next.review_stage = 0;
          next.next_review_date = null;
          next.consecutive_correct_count = 0;
          next.last_correct_date = null;
          next.wrong_count = Number(next.wrong_count || 0) + 1;
        }
      } else if (isCorrect) {
        next.pending_careless_retry = false;
        next.careless_retry_date = null;
        next.correction_wrong_streak = 0;
        next.correction_due_date = null;
        next.is_paused = false;
        const lastCorrectDate = String(next.last_correct_date || "");
        const wasCrossDay = lastCorrectDate && lastCorrectDate < assignmentDate;
        const previousCount = Number(next.consecutive_correct_count || 0);
        next.consecutive_correct_count = wasCrossDay ? previousCount + 1 : Math.max(previousCount, 1);
        next.last_correct_date = assignmentDate;
        next.wrong_count = 0;
        next.careless_streak = 0;
        if (Number(next.consecutive_correct_count || 0) >= 2 && wasCrossDay) {
          next.status = PROGRESS_STATUS.KNOWN;
          next.mastery_achieved = true;
          next.review_stage = 1;
          next.next_review_date = addDaysDateString(assignmentDate, reviewIntervalByStage(1));
          next.consolidation_due_date = null;
        } else {
          next.status = PROGRESS_STATUS.UNKNOWN;
          next.mastery_achieved = false;
          next.review_stage = 0;
          next.next_review_date = null;
        }
      } else {
        next.status = PROGRESS_STATUS.UNKNOWN;
        next.ever_wrong = true;
        next.pending_careless_retry = false;
        next.careless_retry_date = null;
        next.consecutive_correct_count = 0;
        next.last_correct_date = null;
        next.streak_correct = 0;
        next.consolidation_due_date = null;
        next.correction_due_date = null;
        next.wrong_count = Number(next.wrong_count || 0) + 1;
        next.careless_streak = 0;
      }
    }
    return next;
  };

  let repaired = 0;
  for (const group of missingGroups.values()) {
    const profile = profileById.get(group.studentId);
    if (!profile) continue;
    const rebuilt = await rebuildProgressRow(group.studentId, group.combo, group.rows);
    const { error } = await supabase.from("student_learning_progress").upsert(rebuilt, {
      onConflict: "student_id,difficulty,topic,sub_type",
      ignoreDuplicates: true
    });
    if (error) throw new Error(error.message);
    repaired += 1;
  }
  return repaired;
}

app.get("/api/student/progress", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  try {
    await backfillMissingProgressFromOfficialSubmissions(req.profile);
  } catch (backfillError) {
    return res.status(500).json({ error: backfillError.message || "Failed to repair learning status." });
  }
  const { data, error } = await supabase
    .from("student_learning_progress")
    .select("difficulty,topic,sub_type,status,next_review_date,review_stage,is_paused,last_correct_date,last_evidence_question_id,consecutive_correct_count,wrong_count,backfill_correct_count,daily_policy_version")
    .eq("student_id", req.profile.user_id)
    .order("difficulty", { ascending: true })
    .order("topic", { ascending: true })
    .order("sub_type", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  let rows = Array.isArray(data) ? data : [];
  let comboRows = [];
  try {
    const scopeRules = await fetchScopeRulesForStudent(req.profile.user_id);
    const { comboList } = buildProblemPoolIndex(applyScopeRulesToProblemRows(await fetchProblemRowsPaged(), scopeRules));
    comboRows = comboList;
    if (scopeRules.some((rules) => Array.isArray(rules) && rules.length)) {
      rows = applyScopeRulesToProblemRows(rows, scopeRules);
    }
  } catch (scopeError) {
    return res.status(500).json({ error: scopeError.message || "Failed to apply student scope." });
  }
  return res.json({ topics: progressRowsToStatusGroups(rows, { comboRows }) });
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

app.get("/api/student/formula-sheets", ensureCloud, requireAuth, requireRole("student"), async (req, res) => {
  const topic = String(req.query.topic || "").trim();
  if (!topic) return res.status(400).json({ error: "topic is required." });
  const sheets = await listFormulaSheetsForTopic(topic);
  return res.json({ topic, sheets });
});

app.get("/api/teacher/alerts", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const { data, error } = await supabase
    .from("learning_alerts")
    .select("id,student_id,difficulty,topic,sub_type,message,created_at,is_resolved,user_profiles(full_name,email,class_name)")
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  let alerts = Array.isArray(data) ? data : [];
  try {
    const allowedClasses = await getTeacherAllowedClassNames(req.profile);
    alerts = filterRowsByAllowedClasses(alerts, allowedClasses);
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
  }
  return res.json({ alerts });
});

app.get("/api/teacher/alerts/:alertId/wrong-answers", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const alertId = Number(req.params.alertId);
  if (!Number.isInteger(alertId) || alertId <= 0) return res.status(400).json({ error: "Valid alertId is required." });
  const { data: alertRow, error: alertError } = await supabase
    .from("learning_alerts")
    .select("id,student_id,difficulty,topic,sub_type,user_profiles(full_name,class_name)")
    .eq("id", alertId)
    .maybeSingle();
  if (alertError) return res.status(500).json({ error: alertError.message });
  if (!alertRow) return res.status(404).json({ error: "Alert not found." });
  try {
    if (!(await ensureTeacherCanAccessStudent(req.profile, alertRow.student_id))) {
      return res.status(403).json({ error: "You do not have permission to access this student." });
    }
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
  }

  const { data, error } = await supabase
    .from("student_submissions")
    .select(
      "id,assignment_date,question_id,answer_text,is_correct,submitted_at,time_spent_seconds,assignment:daily_assignments(kind),problems(question_type,difficulty,topic,sub_type,latex_code,answer_text,solution_latex)"
    )
    .eq("student_id", alertRow.student_id)
    .eq("is_correct", false)
    .order("submitted_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });

  const rows = (data || []).filter((row) => {
    const p = row.problems || {};
    return (
      String(p.difficulty || "") === String(alertRow.difficulty || "") &&
      String(p.topic || "") === String(alertRow.topic || "") &&
      String(p.sub_type || "") === String(alertRow.sub_type || "")
    );
  });
  return res.json({ alert: alertRow, records: rows.map(row => ({
    ...row, source_type: row.assignment?.kind === "retest" ? "retest" : "daily"
  })) });
});

app.get("/api/teacher/progress", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const className = String(req.query.class_name || "").trim();
  const topic = String(req.query.topic || "").trim();
  const subType = String(req.query.sub_type || "").trim();
  let allowedClasses = [];
  try {
    allowedClasses = await getTeacherAllowedClassNames(req.profile);
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
  }
  if (Array.isArray(allowedClasses)) {
    if (!allowedClasses.length) return res.json({ students: [] });
    if (className && !allowedClasses.includes(className)) return res.json({ students: [] });
  }

  let profileQuery = supabase
    .from("user_profiles")
    .select("user_id,full_name,email,grade,class_name")
    .eq("role", "student")
    .order("class_name", { ascending: true })
    .order("full_name", { ascending: true });
  if (className) profileQuery = profileQuery.eq("class_name", className);
  else if (Array.isArray(allowedClasses)) profileQuery = profileQuery.in("class_name", allowedClasses);
  const { data: students, error: studentError } = await profileQuery;
  if (studentError) return res.status(500).json({ error: studentError.message });
  const studentRows = Array.isArray(students) ? students : [];
  const ids = studentRows.map((s) => String(s.user_id || "")).filter(Boolean);
  if (!ids.length) return res.json({ students: [] });

  try {
    await backfillMissingProgressFromOfficialSubmissions(studentRows, { topic, sub_type: subType });
  } catch (backfillError) {
    return res.status(500).json({ error: backfillError.message || "Failed to repair learning status." });
  }

  let progressQuery = supabase
    .from("student_learning_progress")
    .select("student_id,difficulty,topic,sub_type,status,next_review_date,review_stage,is_paused,last_correct_date,last_evidence_question_id,consecutive_correct_count,wrong_count,backfill_correct_count,daily_policy_version")
    .in("student_id", ids);
  if (topic) progressQuery = progressQuery.eq("topic", topic);
  if (subType) progressQuery = progressQuery.eq("sub_type", subType);
  const { data: progress, error: progressError } = await progressQuery;
  if (progressError) return res.status(500).json({ error: progressError.message });

  const byStudent = new Map();
  for (const row of progress || []) {
    const sid = String(row.student_id || "");
    if (!byStudent.has(sid)) byStudent.set(sid, []);
    byStudent.get(sid).push(row);
  }

  return res.json({
    students: studentRows.map((student) => ({
      ...student,
      topics: progressRowsToStatusGroups(byStudent.get(String(student.user_id || "")) || [])
    }))
  });
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
  try {
    if (!(await ensureTeacherCanAccessStudent(req.profile, alertRow.student_id))) {
      return res.status(403).json({ error: "You do not have permission to resolve this alert." });
    }
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
  }

  const { error: updateAlertError } = await supabase.from("learning_alerts").update({ is_resolved: true }).eq("id", alertId);
  if (updateAlertError) return res.status(500).json({ error: updateAlertError.message });

  return res.json({ resolved: true });
});

app.get("/api/teacher/overview", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const date = String(req.query.date || "").trim() || getTodayDateString();
  const groupId = Number(req.query.group_id || 0);
  let allowedClasses = [];
  try {
    allowedClasses = await getTeacherAllowedClassNames(req.profile);
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
  }
  if (Array.isArray(allowedClasses) && !allowedClasses.length) {
    return res.json({ date, group_id: groupId > 0 ? groupId : null, total_students: 0, students: [] });
  }

  let studentQuery = supabase
    .from("user_profiles")
    .select("user_id, full_name, email, class_name")
    .eq("role", "student")
    .order("full_name", { ascending: true });
  if (Array.isArray(allowedClasses)) studentQuery = studentQuery.in("class_name", allowedClasses);
  const { data: students, error: studentError } = await studentQuery;

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
    .select("student_id,question_id,kind,slot")
    .eq("assignment_date", date).eq("deferred", false).in("student_id", studentIds);
  if (assignmentError) return res.status(500).json({ error: assignmentError.message });

  const { data: submissions, error: submissionError } = await supabase
    .from("student_submissions")
    .select("student_id, question_id, is_correct")
    .eq("assignment_date", date).in("student_id", studentIds);
  if (submissionError) return res.status(500).json({ error: submissionError.message });

  const { data: allSubmissions, error: allSubmissionError } = await supabase
    .from("student_submissions")
    .select("student_id,assignment_date,is_correct,time_spent_seconds,assignment_id,assignment:daily_assignments(kind)")
    .in("student_id", studentIds);
  if (allSubmissionError) return res.status(500).json({ error: allSubmissionError.message });
  const dailySubmissions = (allSubmissions || []).filter(row => row.assignment?.kind !== "retest");
  let completedByStudent;
  try {
    completedByStudent = await getCompletedDates(studentIds, dailySubmissions);
  } catch (completionError) {
    return res.status(500).json({ error: completionError.message });
  }

  const { data: alerts, error: alertError } = await supabase
    .from("learning_alerts")
    .select("student_id,id")
    .in("student_id", studentIds)
    .eq("is_resolved", false);
  if (alertError) return res.status(500).json({ error: alertError.message });

  const { data: assessments, error: assessmentError } = await supabase
    .from("student_initial_assessments")
    .select("student_id,start_difficulty")
    .in("student_id", studentIds);
  if (assessmentError) return res.status(500).json({ error: assessmentError.message });

  const assignedCountByStudent = new Map();
  const submittedCountByStudent = new Map();
  const correctCountByStudent = new Map();
  const answeredCountByStudent = new Map();
  const correctTotalByStudent = new Map();
  const timeSumByStudent = new Map();
  const timeCountByStudent = new Map();
  const primaryAssignments = new Set();
  const alertCountByStudent = new Map();
  const initialLevelByStudent = new Map();

  for (const row of assignments || []) {
    const key = row.student_id;
    if (!isMain(row)) continue;
    primaryAssignments.add(`${key}|${row.question_id}`);
    assignedCountByStudent.set(key, (assignedCountByStudent.get(key) || 0) + 1);
  }
  for (const row of submissions || []) {
    const key = row.student_id;
    if (!primaryAssignments.has(`${key}|${row.question_id}`)) continue;
    submittedCountByStudent.set(key, (submittedCountByStudent.get(key) || 0) + 1);
    if (row.is_correct === true) {
      correctCountByStudent.set(key, (correctCountByStudent.get(key) || 0) + 1);
    }
  }
  for (const row of dailySubmissions) {
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

  }
  for (const row of alerts || []) {
    const key = row.student_id;
    if (!studentIdSet.has(String(key || ""))) continue;
    alertCountByStudent.set(key, (alertCountByStudent.get(key) || 0) + 1);
  }
  for (const row of assessments || []) {
    initialLevelByStudent.set(String(row.student_id || ""), String(row.start_difficulty || ""));
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
    const completedDates = completedByStudent.get(student.user_id);
    const streakDays = computeLongestStreakDaysFromDateSet(completedDates);
    const finishedToday = completedDates.has(date);
    const activeAlerts = alertCountByStudent.get(student.user_id) || 0;

    return {
      student_id: student.user_id,
      full_name: student.full_name,
      email: student.email,
      class_name: student.class_name || null,
      initial_test_level: initialLevelByStudent.get(String(student.user_id || "")) || "",
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
  try {
    if (!(await ensureTeacherCanAccessStudent(req.profile, studentId))) {
      return res.status(403).json({ error: "You do not have permission to edit this student." });
    }
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
  }

  const { error } = await supabase.rpc("reset_student_daily_records", { p_student_id: studentId });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ message: "Student records deleted." });
});

app.get("/api/teacher/students/:studentId/stats", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const studentId = String(req.params.studentId || "").trim();
  if (!studentId) return res.status(400).json({ error: "studentId is required." });
  try {
    if (!(await ensureTeacherCanAccessStudent(req.profile, studentId))) {
      return res.status(403).json({ error: "You do not have permission to view this student." });
    }
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("user_id, full_name, email, class_name")
    .eq("user_id", studentId)
    .eq("role", "student")
    .maybeSingle();
  if (profileError) return res.status(500).json({ error: profileError.message });
  if (!profile) return res.status(404).json({ error: "Student not found." });

  const { data: submissions, error: submissionError } = await supabase
    .from("student_submissions")
    .select(
      "id, assignment_date, assignment_id, question_id, answer_text, is_correct, submitted_at, time_spent_seconds, problems(question_type,difficulty,topic,sub_type,grade,latex_code,answer_text,solution_latex)"
    )
    .eq("student_id", studentId)
    .order("submitted_at", { ascending: false });
  if (submissionError) return res.status(500).json({ error: submissionError.message });

  const rows = Array.isArray(submissions) ? submissions : [];
  const assignmentDates = [...new Set(rows.map((row) => String(row.assignment_date || "").trim()).filter(Boolean))];
  let assignmentRows = [];
  if (assignmentDates.length) {
    const { data: assignedRows, error: assignedRowsError } = await supabase
      .from("daily_assignments")
      .select("id,assignment_date,question_id,slot,kind,reason,review_round")
      .eq("student_id", studentId)
      .in("assignment_date", assignmentDates);
    if (assignedRowsError) return res.status(500).json({ error: assignedRowsError.message });
    assignmentRows = Array.isArray(assignedRows) ? assignedRows : [];
  }
  const assignmentMetaByKey = new Map();
  for (const dateKey of assignmentDates) {
    const rowsForDate = assignmentRows
      .filter((row) => String(row.assignment_date || "") === dateKey)
      .sort((a, b) => {
        const slotA = Number(a.slot || 0);
        const slotB = Number(b.slot || 0);
        if (slotA && slotB && slotA !== slotB) return slotA - slotB;
        if (slotA && !slotB) return -1;
        if (!slotA && slotB) return 1;
        return Number(a.id || 0) - Number(b.id || 0);
      });
    rowsForDate.forEach((row, index) => {
      const effectiveSlot = Number(row.slot || 0) || index + 1;
      assignmentMetaByKey.set(`${dateKey}|||${Number(row.question_id || 0)}`, {
        slot: effectiveSlot,
        affects_learning_progress: isMain({ ...row, slot: effectiveSlot }),
        kind: row.kind, reason: row.reason, review_round: row.review_round
      });
    });
  }
  const records = rows.map((row) => {
    const meta = assignmentMetaByKey.get(`${String(row.assignment_date || "").trim()}|||${Number(row.question_id || 0)}`) || {};
    return {
      ...row,
      assignment_slot: meta.slot || null,
      affects_learning_progress: meta.affects_learning_progress === true,
      source_type: meta.kind === "retest" ? "retest" : "daily",
      assignment: meta
    };
  });
  let practiceRows = [];
  try {
    practiceRows = await fetchPracticeSubmissionsForStudents(studentId);
  } catch (_practiceError) {
    practiceRows = [];
  }
  const mainRows = records.filter(row => row.source_type !== "retest");
  const performanceRows = [...mainRows, ...practiceRows];
  const stats = computeSubmissionStats(performanceRows);
  let radar = { labels: ["Combo", "Aim", "Flash", "Grind", "Fortune"], student: {}, class_avg: {} };
  let aspectValues = {};
  let aspectLeaders = [];
  let classTitles = [];
  let classmatesPower = [];
  try {
    const completedDates = (await getCompletedDates([studentId], mainRows.map(row => ({ ...row, student_id: studentId })))).get(studentId);
    const classAnalytics = await buildClassAnalytics(profile.class_name, profile.user_id, performanceRows, completedDates);
    radar = { labels: classAnalytics.labels, student: classAnalytics.student, class_avg: classAnalytics.class_avg };
    aspectValues = classAnalytics.student_values || {};
    aspectLeaders = classAnalytics.leaders || [];
    classTitles = classAnalytics.titles || [];
    classmatesPower = classAnalytics.classmates_power || [];
  } catch (_e) {
    // keep endpoint available
  }
  return res.json({
    student: profile,
    stats,
    records,
    radar,
    aspect_values: aspectValues,
    aspect_leaders: aspectLeaders,
    class_titles: classTitles,
    classmates_power: classmatesPower
  });
});

app.put("/api/teacher/students/:studentId/class", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const studentId = String(req.params.studentId || "").trim();
  const className = String(req.body.class_name || "").trim();
  if (!studentId) return res.status(400).json({ error: "studentId is required." });
  try {
    if (!(await ensureTeacherCanAccessStudent(req.profile, studentId)) || !(await ensureTeacherCanAccessClass(req.profile, className))) {
      return res.status(403).json({ error: "You do not have permission to move this student to that class." });
    }
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
  }
  const { data, error } = await supabase
    .from("user_profiles")
    .update({ class_name: className || null })
    .eq("user_id", studentId)
    .eq("role", "student")
    .select("user_id,full_name,email,class_name");
  if (error) return res.status(500).json({ error: error.message });
  if (!Array.isArray(data) || data.length !== 1) {
    return res.status(404).json({ error: "Student profile was not updated. Please refresh the student list and try again." });
  }
  await updateStudentAuthClassMetadata([studentId], className || null);
  return res.json({ student_id: studentId, class_name: className || null, updated: 1, profiles: data });
});

app.put("/api/teacher/students/class", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const studentIds = Array.isArray(req.body.student_ids)
    ? req.body.student_ids.map((id) => String(id || "").trim()).filter(Boolean)
    : [];
  const className = String(req.body.class_name || "").trim();
  if (!studentIds.length) return res.status(400).json({ error: "student_ids are required." });
  try {
    if (!(await ensureTeacherCanAccessClass(req.profile, className))) {
      return res.status(403).json({ error: "You do not have permission to assign that class." });
    }
    for (const studentId of studentIds) {
      if (!(await ensureTeacherCanAccessStudent(req.profile, studentId))) {
        return res.status(403).json({ error: "You do not have permission to edit one or more selected students." });
      }
    }
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .update({ class_name: className || null })
    .in("user_id", studentIds)
    .eq("role", "student")
    .select("user_id,full_name,email,class_name");
  if (error) return res.status(500).json({ error: error.message });
  const updatedRows = Array.isArray(data) ? data : [];
  if (updatedRows.length !== studentIds.length) {
    return res.status(409).json({
      error: `Only ${updatedRows.length} of ${studentIds.length} selected student profile(s) were updated. Please refresh the student list and try again.`,
      updated: updatedRows.length,
      expected: studentIds.length,
      profiles: updatedRows
    });
  }
  await updateStudentAuthClassMetadata(updatedRows.map((row) => row.user_id), className || null);
  return res.json({ updated: updatedRows.length, class_name: className || null, profiles: updatedRows });
});

function normalizeScopePayload(scopes) {
  const incoming = Array.isArray(scopes) ? scopes : [];
  const rows = incoming
    .map((row) => ({
      min_difficulty: String(row?.min_difficulty || "").trim(),
      max_difficulty: String(row?.max_difficulty || row?.difficulty || "").trim(),
      topic: String(row?.topic || "").trim(),
      sub_type: String(row?.sub_type || "").trim()
    }))
    .filter((row) => row.max_difficulty && row.topic);

  const diffIndex = new Map(DIFF.map((d, i) => [d, i]));
  const dedup = new Map();
  for (const row of rows) {
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
  return [...dedup.values()];
}

app.get("/api/teacher/classes/:className/scope", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const className = String(req.params.className || "").trim();
  if (!className) return res.status(400).json({ error: "className is required." });
  try {
    if (!(await ensureTeacherCanAccessClass(req.profile, className))) return res.status(403).json({ error: "You do not have permission to access this class." });
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
  }

  const { data, error } = await supabase
    .from("class_scopes")
    .select("id,difficulty,min_difficulty,max_difficulty,topic,sub_type")
    .eq("class_name", className)
    .order("max_difficulty", { ascending: true })
    .order("topic", { ascending: true })
    .order("sub_type", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ class_name: className, scope_rules: Array.isArray(data) ? data : [] });
});

app.put("/api/teacher/classes/:className/scope", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const className = String(req.params.className || "").trim();
  if (!className) return res.status(400).json({ error: "className is required." });
  try {
    if (!(await ensureTeacherCanAccessClass(req.profile, className))) return res.status(403).json({ error: "You do not have permission to edit this class." });
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
  }

  const normalized = normalizeScopePayload(req.body.scopes);
  const { error: clearError } = await supabase.from("class_scopes").delete().eq("class_name", className);
  if (clearError) return res.status(500).json({ error: clearError.message });

  if (normalized.length) {
    const payload = normalized.map((row) => ({
      class_name: className,
      difficulty: row.difficulty,
      min_difficulty: row.min_difficulty,
      max_difficulty: row.max_difficulty,
      topic: row.topic,
      sub_type: row.sub_type || null
    }));
    const { error: insertError } = await supabase.from("class_scopes").insert(payload);
    if (insertError) return res.status(500).json({ error: insertError.message });
  }

  return res.json({ saved: normalized.length });
});

app.get("/api/teacher/groups", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  let groupQuery = supabase
    .from("study_groups")
    .select("id, name, created_at")
    .order("name", { ascending: true });
  if (req.profile.role === "teacher") groupQuery = groupQuery.or(`owner_teacher_id.eq.${req.profile.user_id},owner_teacher_id.is.null`);
  const { data: groups, error: groupError } = await groupQuery;
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

  const memberIds = [...new Set((members || []).map((m) => String(m.student_id || "")).filter(Boolean))];
  const { data: submissions, error: submissionError } = memberIds.length
    ? await supabase.from("student_submissions").select("student_id,is_correct,assignment:daily_assignments(kind)").in("student_id", memberIds)
    : { data: [], error: null };
  if (submissionError) return res.status(500).json({ error: submissionError.message });
  const statsByStudent = new Map();
  for (const row of submissions || []) {
    if (row.assignment?.kind === "retest") continue;
    const sid = String(row.student_id || "");
    if (!statsByStudent.has(sid)) statsByStudent.set(sid, { done: 0, correct: 0 });
    const stat = statsByStudent.get(sid);
    stat.done += 1;
    if (row.is_correct === true) stat.correct += 1;
  }
  const membersByGroup = new Map();
  for (const row of members || []) {
    const gid = Number(row.group_id);
    if (!membersByGroup.has(gid)) membersByGroup.set(gid, []);
    membersByGroup.get(gid).push(String(row.student_id || ""));
  }

  const output = (groups || []).map((g) => {
    const ids = membersByGroup.get(Number(g.id)) || [];
    const totalDone = ids.reduce((acc, sid) => acc + (statsByStudent.get(sid)?.done || 0), 0);
    const totalCorrect = ids.reduce((acc, sid) => acc + (statsByStudent.get(sid)?.correct || 0), 0);
    return {
      ...g,
      member_count: countMap.get(Number(g.id)) || 0,
      members: ids,
      average_correct_percentage: totalDone > 0 ? Math.round((totalCorrect / totalDone) * 100) : 0,
      average_questions_done: ids.length ? Math.round(totalDone / ids.length) : 0
    };
  });
  return res.json(output);
});

app.get("/api/teacher/classes", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  let allowedClasses = [];
  try {
    allowedClasses = await getTeacherAllowedClassNames(req.profile);
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
  }
  if (Array.isArray(allowedClasses) && !allowedClasses.length) return res.json([]);
  let studentQuery = supabase
    .from("user_profiles")
    .select("user_id,full_name,email,class_name")
    .eq("role", "student");
  if (Array.isArray(allowedClasses)) studentQuery = studentQuery.in("class_name", allowedClasses);
  const { data: students, error: studentError } = await studentQuery;
  if (studentError) return res.status(500).json({ error: studentError.message });
  const classMap = new Map();
  for (const student of students || []) {
    const className = String(student.class_name || "").trim();
    if (!className) continue;
    if (!classMap.has(className)) classMap.set(className, []);
    classMap.get(className).push(student);
  }
  const ids = (students || []).map((s) => String(s.user_id || "")).filter(Boolean);
  const { data: submissions, error: submissionError } = ids.length
    ? await supabase.from("student_submissions").select("student_id,is_correct,assignment:daily_assignments(kind)").in("student_id", ids)
    : { data: [], error: null };
  if (submissionError) return res.status(500).json({ error: submissionError.message });
  const statsByStudent = new Map();
  for (const row of submissions || []) {
    if (row.assignment?.kind === "retest") continue;
    const sid = String(row.student_id || "");
    if (!statsByStudent.has(sid)) statsByStudent.set(sid, { done: 0, correct: 0 });
    const stat = statsByStudent.get(sid);
    stat.done += 1;
    if (row.is_correct === true) stat.correct += 1;
  }
  const classes = [...classMap.entries()]
    .map(([name, classStudents]) => {
      const totalDone = classStudents.reduce((acc, s) => acc + (statsByStudent.get(String(s.user_id || ""))?.done || 0), 0);
      const totalCorrect = classStudents.reduce((acc, s) => acc + (statsByStudent.get(String(s.user_id || ""))?.correct || 0), 0);
      return {
        name,
        student_count: classStudents.length,
        average_correct_percentage: totalDone > 0 ? Math.round((totalCorrect / totalDone) * 100) : 0,
        average_questions_done: classStudents.length ? Math.round(totalDone / classStudents.length) : 0
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  return res.json(classes);
});

app.post("/api/teacher/classes", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const name = String(req.body.name || "").trim();
  if (!name) return res.status(400).json({ error: "Class name is required." });
  if (!(await ensureTeacherCanAccessClass(req.profile, name))) return res.status(403).json({ error: "Admin must assign this class to you first." });
  return res.status(201).json({ name });
});

app.delete("/api/teacher/classes/:className", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const className = String(req.params.className || "").trim();
  if (!className) return res.status(400).json({ error: "className is required." });
  if (!(await ensureTeacherCanAccessClass(req.profile, className))) return res.status(403).json({ error: "You do not have permission to delete this class." });
  const { error: profileError } = await supabase.from("user_profiles").update({ class_name: null }).eq("class_name", className);
  if (profileError) return res.status(500).json({ error: profileError.message });
  await supabase.from("class_scopes").delete().eq("class_name", className);
  return res.json({ deleted: true, class_name: className });
});

app.post("/api/teacher/groups", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const name = String(req.body.name || "").trim();
  if (!name) return res.status(400).json({ error: "Group name is required." });

  const { data, error } = await supabase.from("study_groups").insert({ name, owner_teacher_id: req.profile.user_id }).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
});

app.delete("/api/teacher/groups/:groupId", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const groupId = Number(req.params.groupId);
  if (!Number.isInteger(groupId) || groupId <= 0) return res.status(400).json({ error: "Valid groupId is required." });
  try {
    if (!(await ensureTeacherCanAccessGroup(req.profile, groupId))) return res.status(403).json({ error: "You do not have permission to delete this group." });
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
  }
  await supabase.from("student_group_memberships").delete().eq("group_id", groupId);
  await supabase.from("study_group_scopes").delete().eq("group_id", groupId);
  const { error } = await supabase.from("study_groups").delete().eq("id", groupId);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ deleted: true, group_id: groupId });
});

app.get("/api/teacher/students/:studentId/groups", ensureCloud, requireAuth, requireRole("teacher"), async (req, res) => {
  const studentId = String(req.params.studentId || "").trim();
  if (!studentId) return res.status(400).json({ error: "studentId is required." });
  try {
    if (!(await ensureTeacherCanAccessStudent(req.profile, studentId))) return res.status(403).json({ error: "You do not have permission to view this student." });
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
  }

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
  try {
    if (!(await ensureTeacherCanAccessStudent(req.profile, studentId))) return res.status(403).json({ error: "You do not have permission to edit this student." });
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
  }

  const groupIds = Array.isArray(req.body.group_ids)
    ? req.body.group_ids.map((x) => Number(x)).filter((x) => Number.isInteger(x) && x > 0)
    : [];
  for (const groupId of groupIds) {
    try {
      if (!(await ensureTeacherCanAccessGroup(req.profile, groupId))) return res.status(403).json({ error: "You do not have permission to use one or more selected groups." });
    } catch (accessError) {
      return res.status(500).json({ error: accessError.message });
    }
  }

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
  try {
    if (!(await ensureTeacherCanAccessGroup(req.profile, groupId))) return res.status(403).json({ error: "You do not have permission to view this group." });
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
  }

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
  try {
    if (!(await ensureTeacherCanAccessGroup(req.profile, groupId))) return res.status(403).json({ error: "You do not have permission to view this group." });
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
  }

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
  try {
    if (!(await ensureTeacherCanAccessGroup(req.profile, groupId))) return res.status(403).json({ error: "You do not have permission to edit this group." });
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
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
  try {
    if (!(await ensureTeacherCanAccessGroup(req.profile, groupId))) return res.status(403).json({ error: "You do not have permission to edit this group." });
  } catch (accessError) {
    return res.status(500).json({ error: accessError.message });
  }

  const studentIds = Array.isArray(req.body.student_ids)
    ? req.body.student_ids.map((x) => String(x || "").trim()).filter(Boolean)
    : [];
  if (!studentIds.length) {
    return res.status(400).json({ error: "student_ids is required." });
  }

  const { data: validStudents, error: validError } = await supabase
    .from("user_profiles")
    .select("user_id,class_name")
    .eq("role", "student")
    .in("user_id", studentIds);
  if (validError) return res.status(500).json({ error: validError.message });
  const allowedClasses = await getTeacherAllowedClassNames(req.profile);
  const scopedStudents = Array.isArray(allowedClasses)
    ? (validStudents || []).filter((student) => allowedClasses.includes(String(student.class_name || "").trim()))
    : validStudents || [];

  const validStudentIds = (scopedStudents || []).map((s) => String(s.user_id || "")).filter(Boolean);
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

function problemMatchesOptionFilters(row, filters, omitField = "") {
  const difficulty = String(row?.difficulty || "").trim();
  const grade = String(row?.grade || "").trim();
  const topic = String(row?.topic || "").trim();
  const subType = String(row?.sub_type || "").trim();
  const latex = String(row?.latex_code || "").trim();
  const selectedDifficulty = String(filters.difficulty || "").trim();
  const selectedGrade = String(filters.grade || "").trim();
  const selectedTopic = String(filters.topic || "").trim().toLowerCase();
  const selectedSubType = String(filters.sub_type || "").trim().toLowerCase();
  const selectedSearch = String(filters.q || "").trim().toLowerCase();

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

app.get("/api/problems/filter-options", ensureCloud, requireAdminUploadAccess, async (req, res) => {
  try {
    const rows = await fetchProblemRowsPaged({ columns: "id,difficulty,topic,sub_type,grade,latex_code" });
    const fields = ["grade", "difficulty", "topic", "sub_type"];
    const options = {};
    for (const field of fields) {
      options[field] = [
        ...new Set(
          rows
            .filter((row) => problemMatchesOptionFilters(row, req.query, field))
            .map((row) => String(row?.[field] || "").trim())
            .filter(Boolean)
        )
      ].sort((a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }));
    }
    return res.json(options);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to load filter options." });
  }
});

app.get("/api/problems", ensureCloud, requireAdminUploadAccess, async (req, res) => {
  const { difficulty, topic, sub_type, grade, q } = req.query;

  const pageSize = 1000;
  let from = 0;
  const rows = [];
  for (;;) {
    let query = supabase
      .from("problems")
      .select("*")
      .order("id", { ascending: false })
      .range(from, from + pageSize - 1);

    if (difficulty) query = query.eq("difficulty", difficulty);
    if (grade) query = query.eq("grade", grade);
    if (topic) query = query.ilike("topic", `%${topic}%`);
    if (sub_type) query = query.ilike("sub_type", `%${sub_type}%`);
    if (q) query = query.or(`latex_code.ilike.%${q}%,topic.ilike.%${q}%,sub_type.ilike.%${q}%`);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    const page = Array.isArray(data) ? data : [];
    rows.push(...page);
    if (page.length < pageSize) break;
    from += pageSize;
  }
  return res.json(rows);
});

app.post("/api/problems", ensureCloud, requireAdminUploadAccess, async (req, res) => {
  const p = norm(req.body);
  const err = validateProblem(p);
  if (err) return res.status(400).json({ error: err });

  let prepared;
  try {
    prepared = await prepareProblemFigures(p);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to convert TikZ figures." });
  }

  const { data, error, solution_saved } = await insertWithSolutionFallback(prepared.problem);
  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({ ...data, solution_saved, converted_figures: prepared.converted_figures });
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

  let preparedItems = [];
  let convertedFigures = 0;
  try {
    for (const item of cleanItems) {
      const prepared = await prepareProblemFigures(item);
      preparedItems.push(prepared.problem);
      convertedFigures += prepared.converted_figures;
    }
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to convert TikZ figures." });
  }

  const { data, error, solution_saved } = await batchInsertWithSolutionFallback(baseLabels, preparedItems);
  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({ inserted: (data || []).length, solution_saved, converted_figures: convertedFigures });
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

  let prepared;
  try {
    prepared = await prepareProblemFigures(p);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to convert TikZ figures." });
  }

  const { data, error, solution_saved } = await updateWithSolutionFallback(id, prepared.problem);
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Problem not found." });

  return res.json({ ...data, solution_saved, converted_figures: prepared.converted_figures });
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
    if (!AI_GENERATION_ENABLED) {
      console.log("AI generation is disabled.");
    } else if (LOCAL_FALLBACK_ENABLED) {
      console.log("Gemini key not found. Using local fallback generator.");
    } else {
      console.log("AI generation is disabled until GEMINI_API_KEY is set in .env.");
    }
  }
});
