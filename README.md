# Daily Exercise Portal (Supabase)

This app supports:
- School account login/signup
- Role-based access (`student` / `teacher`)
- Automatic daily assignment of **5 questions** per student
- Teacher dashboard for completion and accuracy
- Questions stored in Supabase table `public.problems`

## 1. Supabase SQL setup

Run `supabase-schema.sql` in Supabase SQL Editor.

This creates/updates:
- `public.problems`
- `public.user_profiles`
- `public.daily_assignments`
- `public.student_submissions`

## 2. Environment setup

Copy `.env.example` to `.env` and fill in:

```env
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SCHOOL_EMAIL_DOMAIN=myschool.edu
TEACHER_EMAILS=teacher1@myschool.edu,teacher2@myschool.edu
APP_TIMEZONE=Asia/Hong_Kong
PORT=3000
```

Notes:
- `SCHOOL_EMAIL_DOMAIN` restricts signup to that domain.
- Emails listed in `TEACHER_EMAILS` become `teacher` accounts; others become `student`.

## 3. Run

```bash
npm install
npm start
```

Open: [http://localhost:3000](http://localhost:3000)

## Main endpoints

- `GET /api/client-config`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/student/daily`
- `POST /api/student/submit`
- `GET /api/teacher/overview`

## Daily assignment behavior

- When a student opens daily tasks, the server checks `daily_assignments` for that date.
- If fewer than 5 exist, it auto-assigns more from `public.problems`.
- It prefers questions matching the student grade, then falls back to any grade.
