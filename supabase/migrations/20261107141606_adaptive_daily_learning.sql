alter table public.user_profiles
  add column if not exists daily_action_version bigint not null default 0;

alter table public.daily_assignments
  add column if not exists kind text not null default 'legacy' check (kind in ('legacy', 'main', 'retest')),
  add column if not exists reason text,
  add column if not exists review_round integer check (review_round between 1 and 4),
  add column if not exists due_date date,
  add column if not exists evidence_count integer,
  add column if not exists retest_for bigint references public.daily_assignments(id) on delete cascade,
  add column if not exists deferred boolean not null default false;

create unique index if not exists daily_assignments_one_retest
  on public.daily_assignments (retest_for) where retest_for is not null;

alter table public.student_submissions
  add column if not exists assignment_id bigint references public.daily_assignments(id) on delete set null,
  add column if not exists feedback_state text
    check (feedback_state in ('pending', 'forgot', 'retest', 'passed', 'failed', 'expired'));

create unique index if not exists student_submissions_one_per_assignment
  on public.student_submissions (assignment_id) where assignment_id is not null;

alter table public.student_learning_progress
  add column if not exists daily_policy_version integer not null default 1,
  add column if not exists last_evidence_question_id bigint;

-- Preserve a verified first backfill pass when its old row has no date or question.
with evidence as (
  select distinct on (p.student_id, p.difficulty, p.topic, p.sub_type)
    p.student_id, p.difficulty, p.topic, p.sub_type, s.assignment_date, s.question_id
  from public.student_learning_progress p
  join public.student_submissions s on s.student_id = p.student_id and s.is_correct
  join public.daily_assignments a on a.student_id = s.student_id and a.assignment_date = s.assignment_date
    and a.question_id = s.question_id and a.slot between 1 and 5 and a.kind = 'legacy'
  join public.problems q on q.id = s.question_id and btrim(q.difficulty) = p.difficulty
    and btrim(q.topic) = p.topic and btrim(q.sub_type) = p.sub_type
  where p.daily_policy_version = 1 and p.status = 'BACKFILL'
    and p.backfill_correct_count = 1 and p.last_evidence_question_id is null
  order by p.student_id, p.difficulty, p.topic, p.sub_type, s.assignment_date desc, s.id desc
)
update public.student_learning_progress p
set last_correct_date = e.assignment_date, last_evidence_question_id = e.question_id
from evidence e
where (p.student_id, p.difficulty, p.topic, p.sub_type) = (e.student_id, e.difficulty, e.topic, e.sub_type);

create table if not exists public.student_daily_plans (
  student_id uuid not null references public.user_profiles(user_id) on delete cascade,
  assignment_date date not null,
  completed_at timestamptz,
  primary key (student_id, assignment_date)
);

alter table public.student_daily_plans enable row level security;
revoke all on public.student_daily_plans from public, anon, authenticated;
grant select, insert, update, delete on public.student_daily_plans to service_role;

create or replace function public.adjust_student_tokens(p_student_id uuid, p_amount integer, p_reason text, p_metadata jsonb)
returns integer
language plpgsql security invoker set search_path = ''
as $$
declare
  v_balance integer;
begin
  insert into public.student_token_wallets(student_id, balance) values (p_student_id, 0)
  on conflict (student_id) do nothing;

  if p_amount = 0 then
    select balance into v_balance from public.student_token_wallets where student_id = p_student_id;
    return v_balance;
  end if;

  update public.student_token_wallets set balance = balance + p_amount
  where student_id = p_student_id and balance + p_amount >= 0
  returning balance into v_balance;
  if not found then raise exception 'Insufficient tokens.'; end if;

  insert into public.student_token_ledger(student_id, delta_tokens, reason, metadata)
  values (p_student_id, p_amount, p_reason, coalesce(p_metadata, '{}'::jsonb));
  return v_balance;
end;
$$;

create or replace function public.save_student_daily_plan(p_student_id uuid, p_date date, p_expected_version bigint, p_items jsonb)
returns jsonb
language plpgsql security invoker set search_path = ''
as $$
declare
  v_version bigint;
begin
  select daily_action_version into v_version from public.user_profiles where user_id = p_student_id for update;
  if v_version is distinct from p_expected_version then return jsonb_build_object('conflict', true); end if;
  if exists (select 1 from public.student_daily_plans where student_id = p_student_id and assignment_date = p_date) then
    return jsonb_build_object('conflict', false);
  end if;
  if jsonb_array_length(p_items) > 8 then raise exception 'Daily plan exceeds eight primary questions.'; end if;

  insert into public.student_daily_plans(student_id, assignment_date) values (p_student_id, p_date);
  if exists (select 1 from public.daily_assignments where student_id = p_student_id and assignment_date = p_date and slot between 1 and 5) then
    update public.daily_assignments set kind = 'main', reason = 'existing'
    where student_id = p_student_id and assignment_date = p_date and slot between 1 and 5 and kind = 'legacy';
    -- A task day already completed under the old rules keeps its completion.
    update public.student_daily_plans set completed_at = now()
    where student_id = p_student_id and assignment_date = p_date
      and not exists (
        select 1 from public.daily_assignments a
        left join public.student_submissions s using (student_id, assignment_date, question_id)
        where a.student_id = p_student_id and a.assignment_date = p_date and a.kind = 'main' and s.id is null
      );
  else
    insert into public.daily_assignments(student_id, assignment_date, question_id, slot, kind, reason, review_round, due_date, evidence_count)
    select p_student_id, p_date, (item->>'question_id')::bigint, ordinality, 'main', item->>'reason',
      (item->>'review_round')::integer, (item->>'due_date')::date, (item->>'evidence_count')::integer
    from jsonb_array_elements(p_items) with ordinality as planned(item, ordinality);
  end if;
  update public.user_profiles set daily_action_version = v_version + 1 where user_id = p_student_id;
  return jsonb_build_object('conflict', false);
end;
$$;

create or replace function public.commit_student_daily_action(
  p_student_id uuid, p_date date, p_expected_version bigint, p_assignment_id bigint, p_change jsonb
)
returns jsonb
language plpgsql security invoker set search_path = ''
as $$
declare
  v_version bigint;
  v_assignment public.daily_assignments%rowtype;
  v_submission public.student_submissions%rowtype;
  v_problem public.problems%rowtype;
  v_answer jsonb := p_change->'submission';
  v_feedback jsonb := p_change->'feedback';
  v_progress jsonb := p_change->'progress';
  v_retest_question bigint := (p_change->>'retest_question_id')::bigint;
  v_retest_id bigint;
  v_deferred_id bigint;
  v_completed boolean;
  v_streak integer;
  v_bonus integer := 0;
  v_reward integer := coalesce((p_change->>'question_reward')::integer, 0);
  v_balance integer;
begin
  select daily_action_version into v_version from public.user_profiles where user_id = p_student_id for update;
  if v_version is distinct from p_expected_version then return jsonb_build_object('conflict', true); end if;
  select * into strict v_assignment from public.daily_assignments
  where id = p_assignment_id and student_id = p_student_id and assignment_date = p_date and not deferred;

  if v_answer is not null then
    insert into public.student_submissions(student_id, assignment_date, assignment_id, question_id, answer_text, is_correct, time_spent_seconds, feedback_state)
    values (p_student_id, p_date, v_assignment.id, v_assignment.question_id, v_answer->>'answer_text',
      (v_answer->>'is_correct')::boolean, (v_answer->>'time_spent_seconds')::integer, v_answer->>'feedback_state')
    returning * into v_submission;
  end if;

  if v_feedback is not null then
    update public.student_submissions set feedback_state = v_feedback->>'to'
    where assignment_id = (v_feedback->>'assignment_id')::bigint and student_id = p_student_id
      and assignment_date = p_date and feedback_state = v_feedback->>'from';
    if not found then raise exception 'The answer feedback has already been handled.'; end if;
  end if;

  if v_retest_question is not null then
    if (select count(*) from public.daily_assignments
        where student_id = p_student_id and assignment_date = p_date and kind in ('main', 'retest') and not deferred) >= 10 then
      select a.id into v_deferred_id from public.daily_assignments a
      left join public.student_submissions s using (student_id, assignment_date, question_id)
      where a.student_id = p_student_id and a.assignment_date = p_date and a.kind = 'main'
        and not a.deferred and a.reason <> 'review' and s.id is null
      order by (a.reason in ('new', 'advance')) desc, a.slot desc limit 1;
      if v_deferred_id is null then raise exception 'Daily question limit reached.'; end if;
      update public.daily_assignments set deferred = true where id = v_deferred_id;
    end if;
    insert into public.daily_assignments(student_id, assignment_date, question_id, slot, kind, reason, retest_for)
    select p_student_id, p_date, v_retest_question, max(slot) + 1, 'retest', 'retest', v_assignment.id
    from public.daily_assignments where student_id = p_student_id and assignment_date = p_date
    returning id into v_retest_id;
  end if;

  if coalesce((p_change->>'expire_retest')::boolean, false) then
    update public.daily_assignments set deferred = true where retest_for = v_assignment.id and not deferred;
  end if;

  if v_progress is not null then
    select * into strict v_problem from public.problems where id = v_assignment.question_id;
    insert into public.student_learning_progress(
      student_id, difficulty, topic, sub_type, status, mastery_achieved, review_stage, next_review_date,
      consecutive_correct_count, last_correct_date, last_evidence_question_id, wrong_count,
      backfill_correct_count, ever_wrong, daily_policy_version
    ) values (
      p_student_id, btrim(v_problem.difficulty), btrim(v_problem.topic), btrim(v_problem.sub_type),
      v_progress->>'status', coalesce((v_progress->>'mastery_achieved')::boolean, false),
      coalesce((v_progress->>'review_stage')::integer, 0), (v_progress->>'next_review_date')::date,
      coalesce((v_progress->>'consecutive_correct_count')::integer, 0), (v_progress->>'last_correct_date')::date,
      (v_progress->>'last_evidence_question_id')::bigint, coalesce((v_progress->>'wrong_count')::integer, 0),
      coalesce((v_progress->>'backfill_correct_count')::integer, 0), coalesce((v_progress->>'ever_wrong')::boolean, false), 2
    )
    on conflict (student_id, difficulty, topic, sub_type) do update set
      status = excluded.status, mastery_achieved = excluded.mastery_achieved,
      review_stage = excluded.review_stage, next_review_date = excluded.next_review_date,
      consecutive_correct_count = excluded.consecutive_correct_count, last_correct_date = excluded.last_correct_date,
      last_evidence_question_id = excluded.last_evidence_question_id, wrong_count = excluded.wrong_count,
      backfill_correct_count = excluded.backfill_correct_count, ever_wrong = excluded.ever_wrong,
      daily_policy_version = 2, is_paused = false, pending_careless_retry = false, pending_retest_question_id = null;

    if coalesce((p_change->>'alert')::boolean, false) then
      insert into public.learning_alerts(student_id, difficulty, topic, sub_type, message)
      values (p_student_id, btrim(v_problem.difficulty), btrim(v_problem.topic), btrim(v_problem.sub_type),
        'The student has made three new errors on this sub-topic. Practice continues.');
    end if;
  end if;

  if not coalesce((p_change->>'skip_completion')::boolean, false) then
    update public.student_daily_plans set completed_at = now()
    where student_id = p_student_id and assignment_date = p_date and completed_at is null
      and exists (
        select 1 from public.daily_assignments
        where student_id = p_student_id and assignment_date = p_date and kind = 'main' and not deferred
      ) and not exists (
        select 1 from public.daily_assignments a
        left join public.student_submissions s using (student_id, assignment_date, question_id)
        where a.student_id = p_student_id and a.assignment_date = p_date and not a.deferred
          and a.kind in ('main', 'retest') and (s.id is null or s.feedback_state in ('pending', 'retest'))
      )
    returning true into v_completed;

    if v_completed then
      with old_days as (
        select assignment_date from public.student_submissions
        where student_id = p_student_id and assignment_date between p_date - 21 and p_date
        group by assignment_date having count(*) >= 5
      )
      select coalesce(min(n) filter (where
        case when p.assignment_date is not null then p.completed_at is null else o.assignment_date is null end
      ), 22) into v_streak
      from generate_series(0, 21) as days(n)
      left join public.student_daily_plans p on p.student_id = p_student_id and p.assignment_date = p_date - days.n
      left join old_days o on o.assignment_date = p_date - days.n;
      v_bonus := case v_streak when 3 then 5 when 7 then 10 when 14 then 20 when 21 then 40 else 0 end;
    end if;
  end if;

  v_balance := public.adjust_student_tokens(p_student_id, v_reward + v_bonus, 'question_submission',
    jsonb_build_object('assignment_date', p_date, 'question_id', v_assignment.question_id,
      'reward_breakdown', jsonb_build_object('question', v_reward, 'completion_streak', v_bonus)));
  update public.user_profiles set daily_action_version = v_version + 1 where user_id = p_student_id;
  return jsonb_build_object('conflict', false, 'submission', to_jsonb(v_submission),
    'retest_assignment_id', v_retest_id, 'token_reward', v_reward + v_bonus, 'token_balance', v_balance);
end;
$$;

create or replace function public.reset_student_daily_records(p_student_id uuid)
returns void
language plpgsql security invoker set search_path = ''
as $$
begin
  update public.user_profiles set daily_action_version = daily_action_version + 1 where user_id = p_student_id;
  delete from public.student_submissions where student_id = p_student_id;
  delete from public.student_practice_submissions where student_id = p_student_id;
  delete from public.daily_assignments where student_id = p_student_id;
  delete from public.student_daily_plans where student_id = p_student_id;
  delete from public.student_learning_progress where student_id = p_student_id;
  delete from public.learning_alerts where student_id = p_student_id;
end;
$$;

revoke execute on function public.adjust_student_tokens(uuid, integer, text, jsonb) from public, anon, authenticated;
revoke execute on function public.save_student_daily_plan(uuid, date, bigint, jsonb) from public, anon, authenticated;
revoke execute on function public.commit_student_daily_action(uuid, date, bigint, bigint, jsonb) from public, anon, authenticated;
revoke execute on function public.reset_student_daily_records(uuid) from public, anon, authenticated;
grant execute on function public.adjust_student_tokens(uuid, integer, text, jsonb) to service_role;
grant execute on function public.save_student_daily_plan(uuid, date, bigint, jsonb) to service_role;
grant execute on function public.commit_student_daily_action(uuid, date, bigint, bigint, jsonb) to service_role;
grant execute on function public.reset_student_daily_records(uuid) to service_role;

notify pgrst, 'reload schema';
