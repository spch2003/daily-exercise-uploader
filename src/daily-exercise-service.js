"use strict";

const policy = require("./daily-learning");

function fail(status, message) {
  throw Object.assign(new Error(message), { status });
}

async function checked(query) {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

function isMain(item) {
  return item.kind === "main" || (item.kind === "legacy" && Number(item.slot) >= 1 && Number(item.slot) <= 5);
}

function orderedAssignments(assignments) {
  const retests = new Map(assignments.filter(item => item.kind === "retest").map(item => [item.retest_for, item]));
  return assignments.filter(isMain).flatMap(item => [item, retests.get(item.id)].filter(Boolean));
}

function pendingItem(items, submissions) {
  return items.find(item => {
    const submission = submissions.get(item.question_id);
    return !submission || submission.feedback_state === "pending";
  });
}

function feedback(transition, message) {
  if (!transition && !message) return null;
  return {
    progress_status: transition?.progress.status,
    teacher_notified: transition?.alert === true,
    message: transition?.alert ? "Your teacher has been notified. You can continue practising this topic." : message
  };
}

function feedbackMessage(transition, previous) {
  if (transition?.progress.status === "MASTERED" && previous !== "MASTERED") return "You have mastered this sub-topic.";
  if (transition?.progress.status === "KNOWN" && previous !== "KNOWN") return "Cross-day check passed. Your first review is due in 3 days.";
  if (transition?.progress.status === "UNKNOWN" && previous === "KNOWN") return "This sub-topic is back in learning.";
  return "";
}

function createDailyExerciseService({ db, today, loadContext, loadProgress, score, seconds, questionReward, trailingCorrect }) {
  async function withVersion(studentId, operation) {
    for (let retry = 0; retry < 4; retry += 1) {
      const row = await checked(db.from("user_profiles").select("daily_action_version").eq("user_id", studentId).single());
      const result = await operation(row.daily_action_version);
      if (!result?.conflict) return result;
    }
    fail(409, "The exercise changed in another tab. Refresh and try again.");
  }

  async function readDay(studentId, date) {
    const [rows, saved, plan] = await Promise.all([
      checked(db.from("daily_assignments")
        .select("id,slot,question_id,kind,reason,review_round,due_date,evidence_count,retest_for,problems(*)")
        .eq("student_id", studentId).eq("assignment_date", date).eq("deferred", false).order("slot")),
      checked(db.from("student_submissions")
        .select("id,question_id,assignment_date,answer_text,is_correct,submitted_at,time_spent_seconds,feedback_state")
        .eq("student_id", studentId).eq("assignment_date", date).order("submitted_at").order("id")),
      checked(db.from("student_daily_plans").select("completed_at").eq("student_id", studentId).eq("assignment_date", date).maybeSingle())
    ]);
    return {
      rows,
      items: orderedAssignments(rows),
      saved,
      submissions: new Map(saved.map(row => [row.question_id, row])),
      plan
    };
  }

  function commit(studentId, date, version, assignment, change) {
    return checked(db.rpc("commit_student_daily_action", {
      p_student_id: studentId,
      p_date: date,
      p_expected_version: version,
      p_assignment_id: assignment.id,
      p_change: change
    }));
  }

  function stateTransition(state, assignment, correct, date, retest = false) {
    if (state.status === "MASTERED" || correct == null) return null;
    if (!retest && state.status === "KNOWN" && !dueReview(state, assignment, date)) return null;
    return policy.applyAttempt(state, { correct, date, questionId: assignment.question_id, retest });
  }

  function dueReview(state, assignment, date) {
    return state.status === "KNOWN" && state.next_review_date <= date &&
      (assignment.reason === "existing" || Number(assignment.review_round) === Number(state.review_stage));
  }

  function requireCurrentDate(date) {
    if (date !== today()) fail(409, "This task day has ended. Open today's Daily Mission to continue.");
  }

  async function expireOldChoices(profile, date) {
    const studentId = profile.user_id;
    const old = await checked(db.from("student_submissions")
      .select("question_id,assignment_date").eq("student_id", studentId)
      .in("feedback_state", ["pending", "retest"]).lt("assignment_date", date)
      .order("assignment_date").order("id"));
    for (const { question_id, assignment_date } of old) {
      await withVersion(studentId, async version => {
        const day = await readDay(studentId, assignment_date);
        const original = day.items.find(item => item.question_id === question_id);
        const from = day.submissions.get(question_id)?.feedback_state;
        if (!original || !["pending", "retest"].includes(from)) return null;
        const state = await loadProgress(profile, original.problems, assignment_date);
        const transition = stateTransition(state, original, false, assignment_date, from === "retest");
        return commit(studentId, assignment_date, version, original, {
          feedback: { assignment_id: original.id, from, to: "expired" },
          expire_retest: from === "retest",
          skip_completion: true,
          ...changesFor(transition)
        });
      });
    }
  }

  function changesFor(transition) {
    if (!transition) return {};
    return { progress: transition.progress, alert: transition.alert };
  }

  async function ensurePlan(profile, date) {
    const studentId = profile.user_id;
    await withVersion(studentId, async version => {
      const existing = await checked(db.from("student_daily_plans").select("assignment_date")
        .eq("student_id", studentId).eq("assignment_date", date).maybeSingle());
      if (existing) return null;
      const context = await loadContext(profile, date);
      const plan = policy.planDay(context, date);
      return checked(db.rpc("save_student_daily_plan", {
        p_student_id: studentId, p_date: date, p_expected_version: version, p_items: plan
      }));
    });
  }

  function presentDay(day, date) {
    const next = pendingItem(day.items, day.submissions);
    const main = day.items.filter(isMain);
    return {
      date,
      next_assignment_id: next?.id || null,
      required_count: main.length,
      submitted_count: main.filter(item => day.submissions.has(item.question_id)).length,
      completed: day.plan ? Boolean(day.plan.completed_at) : main.length > 0 && !next,
      assignments: day.items.map((item, index) => {
        const submission = day.submissions.get(item.question_id) || null;
        const question = { ...item.problems };
        if (!submission || ["pending", "retest"].includes(submission.feedback_state)) {
          delete question.answer_text;
          delete question.solution_latex;
          delete question.solution_latex_original;
        }
        return {
          assignment_id: item.id,
          assignment_date: date,
          slot: index + 1,
          kind: item.kind,
          reason: item.reason,
          due_date: item.due_date,
          evidence_count: item.evidence_count,
          review_round: item.review_round,
          retest_for: item.retest_for,
          question,
          submission
        };
      })
    };
  }

  async function getDaily(profile, requestedDate) {
    const current = today();
    const date = requestedDate || current;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) ||
        new Date(date + "T00:00:00Z").toISOString().slice(0, 10) !== date) fail(400, "Invalid task date.");
    if (date === current) {
      await expireOldChoices(profile, date);
      await ensurePlan(profile, date);
    }
    return presentDay(await readDay(profile.user_id, date), date);
  }

  async function getSchedule(profile) {
    const date = today();
    const context = await loadContext(profile, date);
    const days = policy.planSchedule(context, date).map(day => ({
      date: day.date,
      items: day.items.map(({ question_id, combo_key, ...item }) => item)
    }));
    return { date, days };
  }

  async function submit(profile, body) {
    const date = String(body.assignment_date || today());
    requireCurrentDate(date);
    const questionId = Number(body.question_id);
    const answer = String(body.answer_text || "").trim();
    if (!Number.isInteger(questionId) || questionId <= 0 || !answer) fail(400, "A question and answer are required.");
    const studentId = profile.user_id;
    return withVersion(studentId, async version => {
      const day = await readDay(studentId, date);
      const assignment = day.items.find(item => item.question_id === questionId);
      if (!assignment) fail(403, "This question is not assigned for this task day.");
      if (day.submissions.has(questionId)) fail(409, "Answer already submitted. Refresh the Daily Mission to continue.");
      if (pendingItem(day.items, day.submissions)?.id !== assignment.id) fail(409, "Complete the current question first.");

      const state = await loadProgress(profile, assignment.problems, date);
      const correct = score(answer, assignment.problems?.answer_text);
      const time = seconds(body.time_spent_seconds);
      const retest = assignment.kind === "retest";
      const needsFeedback = !retest && correct === false && dueReview(state, assignment, date);
      const transition = needsFeedback ? null : stateTransition(state, assignment, correct, date, retest);
      const mainIds = new Set(day.items.filter(isMain).map(item => item.question_id));
      const streak = correct ? trailingCorrect(day.saved.filter(row => mainIds.has(row.question_id))) + 1 : 0;
      const change = {
        submission: { answer_text: answer, is_correct: correct, time_spent_seconds: time, feedback_state: needsFeedback ? "pending" : null },
        question_reward: retest ? 0 : questionReward({ isCorrect: correct, timeSpentSeconds: time, nextCorrectStreak: streak }),
        ...changesFor(transition)
      };
      if (retest) change.feedback = { assignment_id: assignment.retest_for, from: "retest", to: correct ? "passed" : "failed" };
      const result = await commit(studentId, date, version, assignment, change);
      if (result.conflict) return result;
      const message = retest
        ? correct ? "Retest passed. You stay on the same review round." : "Retest ended. This sub-topic is back in learning."
        : feedbackMessage(transition, state.status);
      return {
        ...result.submission,
        token_reward: result.token_reward,
        token_balance: result.token_balance,
        needs_wrong_feedback: needsFeedback,
        progress_feedback: feedback(transition, message)
      };
    });
  }

  async function handleWrong(profile, questionId, body) {
    const date = String(body.assignment_date || today());
    requireCurrentDate(date);
    const studentId = profile.user_id;
    return withVersion(studentId, async version => {
      const day = await readDay(studentId, date);
      const assignment = day.items.find(item => isMain(item) && item.question_id === Number(questionId));
      if (!assignment || day.submissions.get(assignment.question_id)?.feedback_state !== "pending") {
        fail(409, "That answer no longer needs a choice. Refresh the Daily Mission to continue.");
      }
      const state = await loadProgress(profile, assignment.problems, date);
      let retestId;
      if (body.careless_error === true) {
        const context = await loadContext(profile, date);
        const combo = context.byCombo.get(policy.comboKey(assignment.problems));
        if (combo) {
          const allIds = await checked(db.from("daily_assignments").select("question_id")
            .eq("student_id", studentId).eq("assignment_date", date));
          retestId = policy.pickVariant(combo, context, date, new Set(allIds.map(row => Number(row.question_id))));
        }
      }
      const transition = retestId ? null : stateTransition(state, assignment, false, date);
      const result = await commit(studentId, date, version, assignment, {
        feedback: { assignment_id: assignment.id, from: "pending", to: retestId ? "retest" : "forgot" },
        retest_question_id: retestId,
        ...changesFor(transition)
      });
      if (result.conflict) return result;
      const message = retestId ? "Your retest is ready." : body.careless_error
        ? "A different retest question is unavailable. This sub-topic is back in learning."
        : feedbackMessage(transition, state.status);
      return {
        retest_assignment_id: result.retest_assignment_id,
        token_reward: result.token_reward,
        token_balance: result.token_balance,
        progress_feedback: feedback(transition, message)
      };
    });
  }

  return { getDaily, getSchedule, submit, handleWrong };
}

module.exports = { createDailyExerciseService, isMain };
