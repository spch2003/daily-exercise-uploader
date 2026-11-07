"use strict";

const LEVELS = ["lv2", "lv3", "lv4", "lv5", "lv5*", "lv5**"];
const MAIN_TARGET = 8;
const DAILY_LIMIT = 10;
const REVIEW_LIMIT = 4;
const REVIEW_GAPS = [3, 4, 7, 16];
const LEGACY_REVIEW_GAPS = [2, 4, 7, 14];

function addDays(date, days) {
  const value = new Date(date + "T00:00:00Z");
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function comboKey(row) {
  return [row.difficulty, row.topic, row.sub_type].map(value => String(value || "").trim()).join("|||");
}

function normalizeProgress(row, combo, startDifficulty, date) {
  const start = Math.max(0, LEVELS.indexOf(startDifficulty));
  const status = LEVELS.indexOf(combo.difficulty) < start ? "BACKFILL" : "UNKNOWN";
  if (!row) return { ...combo, status, review_stage: 0, wrong_count: 0, daily_policy_version: 2 };
  if (row.daily_policy_version === 2) return row;

  const next = { ...row, wrong_count: 0, daily_policy_version: 2 };
  if (next.status === "FROZEN" || next.is_paused) {
    return resetToLearning({ ...next, ever_wrong: true });
  }
  if (!["UNKNOWN", "KNOWN", "MASTERED", "BACKFILL"].includes(next.status)) {
    next.status = next.review_stage >= 5 ? "MASTERED" : next.review_stage > 0 ? "KNOWN" : "UNKNOWN";
  }
  if (next.status === "KNOWN") {
    const stage = Math.max(1, Number(next.review_stage || 1));
    if (stage > REVIEW_GAPS.length) return master(next);
    next.review_stage = stage;
    next.next_review_date = next.next_review_date
      ? addDays(next.next_review_date, REVIEW_GAPS[stage - 1] - LEGACY_REVIEW_GAPS[stage - 1])
      : addDays(next.last_correct_date || date, REVIEW_GAPS[stage - 1]);
  }
  if (next.status === "BACKFILL" && (!next.last_correct_date || !next.last_evidence_question_id)) {
    next.backfill_correct_count = 0;
  }
  return next;
}

function master(row) {
  return {
    ...row,
    status: "MASTERED",
    mastery_achieved: true,
    review_stage: REVIEW_GAPS.length,
    next_review_date: null
  };
}

function resetToLearning(row) {
  return {
    ...row,
    status: "UNKNOWN",
    is_paused: false,
    mastery_achieved: false,
    review_stage: 0,
    next_review_date: null,
    consecutive_correct_count: 0,
    backfill_correct_count: 0,
    last_correct_date: null,
    last_evidence_question_id: null
  };
}

function applyAttempt(state, { correct, date, questionId, retest = false }) {
  if (correct == null || state.status === "MASTERED") return { progress: state, alert: false };
  if (!correct) {
    const count = Number(state.wrong_count || 0) + 1;
    const alert = count >= 3;
    return {
      progress: resetToLearning({ ...state, wrong_count: alert ? 0 : count, ever_wrong: true }),
      alert
    };
  }

  if (state.status === "KNOWN") {
    const round = Number(state.review_stage);
    if (retest) {
      return { progress: { ...state, next_review_date: addDays(date, REVIEW_GAPS[round - 1]) }, alert: false };
    }
    if (round === REVIEW_GAPS.length) return { progress: master(state), alert: false };
    return {
      progress: { ...state, review_stage: round + 1, next_review_date: addDays(date, REVIEW_GAPS[round]) },
      alert: false
    };
  }

  if (state.last_correct_date && state.last_correct_date >= date) return { progress: state, alert: false };
  if (state.status === "BACKFILL" && Number(state.last_evidence_question_id) === Number(questionId)) {
    return { progress: state, alert: false };
  }
  const next = { ...state, last_correct_date: date, last_evidence_question_id: questionId };
  if (state.status === "BACKFILL") {
    next.backfill_correct_count = Number(state.backfill_correct_count || 0) + 1;
    return { progress: next.backfill_correct_count >= 2 ? master(next) : next, alert: false };
  }
  next.consecutive_correct_count = Number(state.consecutive_correct_count || 0) + 1;
  if (next.consecutive_correct_count >= 2) {
    next.status = "KNOWN";
    next.mastery_achieved = true;
    next.review_stage = 1;
    next.next_review_date = addDays(date, REVIEW_GAPS[0]);
  }
  return { progress: next, alert: false };
}

function recordLatest(map, key, date) {
  if (date > (map.get(key) || "")) map.set(key, date);
}

function sortSalt(value) {
  let hash = 0;
  for (const char of value) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) | 0;
  return hash >>> 0;
}

function createContext({ problems, progress, history, startDifficulty, date, studentId, scoped = false }) {
  const byCombo = new Map();
  const byTopic = new Map();
  const byId = new Map();
  const lastTopic = new Map();
  const lastCombo = new Map();
  const lastQuestion = new Map();
  const start = Math.max(0, LEVELS.indexOf(startDifficulty));

  for (const row of problems) {
    const combo = {
      difficulty: String(row.difficulty || "").trim(),
      topic: String(row.topic || "").trim(),
      sub_type: String(row.sub_type || "").trim()
    };
    const level = LEVELS.indexOf(combo.difficulty);
    if (level < 0 || !combo.topic || !combo.sub_type) continue;
    const key = comboKey(combo);
    if (!byCombo.has(key)) {
      const item = { ...combo, key, level, ids: [], state: normalizeProgress(progress.get(key), combo, startDifficulty, date) };
      byCombo.set(key, item);
      if (!byTopic.has(combo.topic)) byTopic.set(combo.topic, new Map());
      const topicLevels = byTopic.get(combo.topic);
      if (!topicLevels.has(level)) topicLevels.set(level, []);
      topicLevels.get(level).push(item);
    }
    const id = Number(row.id);
    byCombo.get(key).ids.push(id);
    byId.set(id, byCombo.get(key));
  }

  for (const row of history) {
    if (row.deferred || row.assignment_date >= date) continue;
    const id = Number(row.question_id);
    const combo = byId.get(id) || row.problems;
    if (!combo?.topic) continue;
    recordLatest(lastTopic, combo.topic, row.assignment_date);
    recordLatest(lastCombo, comboKey(combo), row.assignment_date);
    recordLatest(lastQuestion, id, row.assignment_date);
  }

  const frontier = new Map();
  for (const [topic, topicLevels] of byTopic) {
    let level = start;
    if (!topicLevels.has(level) && scoped) {
      level = [...topicLevels.keys()].filter(candidate => candidate >= start).sort((a, b) => a - b)[0];
    }
    if (!topicLevels.has(level)) continue;
    while (topicLevels.has(level + 1) && topicLevels.get(level).every(item => item.state.status === "MASTERED")) {
      level += 1;
    }
    frontier.set(topic, level);
  }
  return { byCombo, frontier, lastTopic, lastCombo, lastQuestion, start, studentId };
}

function pickVariant(item, context, date, blocked = new Set(), distinctEvidence = false) {
  const state = item.state;
  const legacySeen = new Set((state.done_variants || []).map(Number));
  const compare = (a, b) =>
    String(context.lastQuestion.get(a) || (legacySeen.has(a) ? "0001" : "")).localeCompare(
      String(context.lastQuestion.get(b) || (legacySeen.has(b) ? "0001" : ""))
    ) || sortSalt(context.studentId + date + a) - sortSalt(context.studentId + date + b);
  return item.ids.filter(id => !blocked.has(id) && (!distinctEvidence || id !== Number(state.last_evidence_question_id))).sort(compare)[0];
}

function reviewDates(stage, first) {
  const dates = [first];
  for (let i = stage; i < REVIEW_GAPS.length; i += 1) dates.push(addDays(dates.at(-1), REVIEW_GAPS[i]));
  return dates;
}

function planDay(context, date, excluded = new Set()) {
  const { byCombo, frontier, lastTopic, lastCombo, start } = context;
  const review = [];
  const learning = [];
  const fresh = [];
  const futureLoad = new Map();
  const reserve = dates => {
    for (const day of dates) futureLoad.set(day, (futureLoad.get(day) || 0) + 1);
  };
  for (const item of byCombo.values()) {
    const state = item.state;
    if (state.status === "MASTERED") continue;
    if (state.status === "KNOWN") {
      const due = state.next_review_date;
      if (due && !excluded.has(item.key)) {
        reserve(reviewDates(Number(state.review_stage), due < date ? date : due));
        if (due <= date) review.push({ item, reason: "review", due });
      }
      continue;
    }
    if (excluded.has(item.key)) continue;
    if (state.status === "BACKFILL") {
      learning.push({ item, reason: "backfill" });
      continue;
    }
    const started = state.ever_wrong || state.last_correct_date || state.consecutive_correct_count > 0;
    if (started) {
      if (state.last_correct_date === date) continue;
      learning.push({ item, reason: state.consecutive_correct_count > 0 ? "confirm" : "learning" });
    } else if (item.level <= (frontier.get(item.topic) ?? -1)) {
      fresh.push({ item, reason: item.level > start ? "advance" : "new" });
    }
  }
  const rotate = (a, b) => (lastTopic.get(a.item.topic) || "").localeCompare(lastTopic.get(b.item.topic) || "") ||
    (lastCombo.get(a.item.key) || "").localeCompare(lastCombo.get(b.item.key) || "") ||
    sortSalt(context.studentId + date + a.item.key) - sortSalt(context.studentId + date + b.item.key);
  review.sort((a, b) => a.due.localeCompare(b.due) || rotate(a, b));
  learning.sort((a, b) => Number(b.reason === "confirm") - Number(a.reason === "confirm") || rotate(a, b));
  fresh.sort(rotate);

  const picked = [];
  const topics = new Set();
  const used = new Set();
  const confirmationDates = reviewDates(1, addDays(date, REVIEW_GAPS[0]));
  const add = (candidates, repeatTopic = false) => {
    if (picked.length >= MAIN_TARGET) return false;
    for (const candidate of candidates) {
      const { item, reason } = candidate;
      if (used.has(item.key) || (!repeatTopic && topics.has(item.topic))) continue;
      if (reason === "confirm" && confirmationDates.some(day => (futureLoad.get(day) || 0) >= REVIEW_LIMIT)) continue;
      const questionId = pickVariant(item, context, date, new Set(), reason === "backfill");
      if (!questionId) continue;
      if (reason === "confirm") reserve(confirmationDates);
      picked.push({
        question_id: questionId,
        difficulty: item.difficulty,
        topic: item.topic,
        sub_type: item.sub_type,
        combo_key: item.key,
        reason,
        review_round: reason === "review" ? Number(item.state.review_stage) : null,
        due_date: candidate.due || null,
        evidence_count: reason === "backfill" ? Number(item.state.backfill_correct_count || 0) : null
      });
      used.add(item.key);
      topics.add(item.topic);
      return true;
    }
    return false;
  };

  let reviewCount = 0;
  let learningCount = 0;
  let newCount = 0;
  while (reviewCount < 3 && (add(review) || add(review, true))) reviewCount += 1;
  if (reviewCount < REVIEW_LIMIT && (add(review) || add(review.filter(item => item.due < date), true))) reviewCount += 1;
  if (add(learning.filter(item => item.reason === "confirm"))) learningCount += 1;
  if (add(learning.filter(item => item.reason === "backfill"))) learningCount += 1;
  while (learningCount < 3 && add(learning)) learningCount += 1;
  while (newCount < 2 && add(fresh)) newCount += 1;
  while (picked.length < MAIN_TARGET) {
    if (add(fresh) || add(learning)) continue;
    if (reviewCount < REVIEW_LIMIT && (add(review) || add(review, true))) {
      reviewCount += 1;
      continue;
    }
    if (!add(learning, true) && !add(fresh, true)) break;
  }
  return picked.sort((a, b) => Number(b.reason === "review") - Number(a.reason === "review"));
}

function planSchedule(context, today) {
  const seen = new Set();
  const days = [];
  for (let offset = 1; offset <= 7; offset += 1) {
    const date = addDays(today, offset);
    const items = planDay(context, date, seen);
    for (const item of items) seen.add(item.combo_key);
    days.push({ date, items });
  }
  return days;
}

module.exports = {
  MAIN_TARGET,
  DAILY_LIMIT,
  LEVELS,
  addDays,
  comboKey,
  normalizeProgress,
  applyAttempt,
  createContext,
  pickVariant,
  planDay,
  planSchedule
};
