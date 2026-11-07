"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const policy = require("../src/daily-learning");

function attempt(state, date, correct = true, questionId = 1, retest = false) {
  return policy.applyAttempt(state, { date, correct, questionId, retest });
}

test("two correct days lead to reviews on days 3, 7, 14 and 30", () => {
  let state = attempt({ status: "UNKNOWN" }, "2026-11-01").progress;
  state = attempt(state, "2026-11-01", true, 2).progress;
  assert.equal(state.status, "UNKNOWN");
  state = attempt(state, "2026-11-03", true, 2).progress;
  for (const [index, date] of ["2026-11-06", "2026-11-10", "2026-11-17", "2026-12-03"].entries()) {
    assert.equal(state.status, "KNOWN");
    assert.equal(state.review_stage, index + 1);
    assert.equal(state.next_review_date, date);
    state = attempt(state, date).progress;
  }
  assert.equal(state.status, "MASTERED");
  assert.equal(state.next_review_date, null);
});

test("a passed immediate retest stays on the same review round", () => {
  const known = { status: "KNOWN", review_stage: 2, next_review_date: "2026-11-10", wrong_count: 2 };
  const passed = attempt(known, "2026-11-10", true, 3, true);
  assert.equal(passed.progress.status, "KNOWN");
  assert.equal(passed.progress.review_stage, 2);
  assert.equal(passed.progress.next_review_date, "2026-11-14");
  assert.equal(passed.progress.wrong_count, 2);
  const failed = attempt(known, "2026-11-10", false, 3, true);
  assert.equal(failed.progress.status, "UNKNOWN");
  assert.equal(failed.progress.wrong_count, 0);
  assert.equal(failed.alert, true);
});

test("backfill needs a different question and a different day", () => {
  const first = attempt({ status: "BACKFILL" }, "2026-11-01").progress;
  assert.equal(attempt(first, "2026-11-01", true, 2).progress.status, "BACKFILL");
  assert.equal(attempt(first, "2026-11-02").progress.status, "BACKFILL");
  assert.equal(attempt(first, "2026-11-04", true, 2).progress.status, "MASTERED");
  assert.equal(attempt(first, "2026-11-04", false, 2).progress.backfill_correct_count, 0);
});

test("every three wrong events notify and reset without freezing", () => {
  let state = { status: "UNKNOWN" };
  const alerts = [];
  for (let i = 1; i <= 6; i += 1) {
    const date = "2026-11-0" + i;
    const result = attempt(state, date, false, i);
    state = result.progress;
    if (result.alert) alerts.push(i);
    assert.equal(state.status, "UNKNOWN");
    assert.equal(state.wrong_count, i % 3);
    state = attempt(state, date, true, i + 10).progress;
  }
  assert.deepEqual(alerts, [3, 6]);
});

test("old frozen and four-pass progress can be used without rewriting history", () => {
  const combo = { difficulty: "lv2", topic: "Algebra", sub_type: "Factorisation" };
  const normalize = row => policy.normalizeProgress(row, combo, "lv2", "2026-11-07");
  assert.equal(normalize({ ...combo, status: "FROZEN", is_paused: true }).status, "UNKNOWN");
  assert.equal(normalize({ ...combo, status: "KNOWN", review_stage: 5 }).status, "MASTERED");
  assert.equal(normalize({
    ...combo, status: "KNOWN", review_stage: 4, next_review_date: "2026-11-16"
  }).next_review_date, "2026-11-18");
});

test("the plan separates early reviews, mastered questions and per-topic progression", () => {
  const date = "2026-11-07";
  const problems = [
    { id: 1, topic: "A", difficulty: "lv2" },
    { id: 2, topic: "A", difficulty: "lv3" },
    { id: 3, topic: "B", difficulty: "lv2" },
    { id: 4, topic: "B", difficulty: "lv3" },
    { id: 5, topic: "C", difficulty: "lv2" },
    { id: 6, topic: "D", difficulty: "lv2" }
  ].map(row => ({ ...row, sub_type: "Core" }));
  const progress = new Map([
    [policy.comboKey(problems[0]), { ...problems[0], status: "MASTERED", daily_policy_version: 2 }],
    [policy.comboKey(problems[4]), { ...problems[4], status: "KNOWN", daily_policy_version: 2, review_stage: 1, next_review_date: date }],
    [policy.comboKey(problems[5]), { ...problems[5], status: "KNOWN", daily_policy_version: 2, review_stage: 1, next_review_date: "2026-11-10" }]
  ]);
  const context = policy.createContext({ problems, progress, history: [], startDifficulty: "lv2", studentId: "test", date });
  const plan = policy.planDay(context, date);
  assert.equal(plan[0].reason, "review");
  assert.deepEqual(new Set(plan.map(x => x.question_id)), new Set([2, 3, 5]));
  assert.equal(plan.find(x => x.question_id === 2).reason, "advance");
  const days = policy.planSchedule(context, date);
  assert.equal(days.length, 7);
  const upcoming = days.flatMap(day => day.items.map(item => ({ ...item, date: day.date })));
  assert.equal(upcoming.find(x => x.question_id === 6).date, "2026-11-10");
  assert.equal(progress.get(policy.comboKey(problems[5])).next_review_date, "2026-11-10");
});
