# Daily Exercise Portal (Supabase)

This app supports:
- School account login/signup
- Role-based access (`student` / `teacher`)
- Adaptive Daily Missions with up to **8 main questions** and at most **10 including immediate retests**
- Teacher dashboard for completion and accuracy
- Questions stored in Supabase table `public.problems`

## 1. Supabase SQL setup

For a fresh database, run `supabase-schema.sql`, then run the SQL files in `supabase/migrations/` in order. Apply the new migration to an existing database before starting the updated server.

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

## 4. Deploy Student Portal on Render

This repo includes `render.yaml` for a Render web service named `daily-exercise-portal`.

Use these settings if you create the service manually:

```text
Build Command: npm install
Start Command: npm start
```

Set these Render environment variables:

```env
APP_MODE=student_portal
APP_TIMEZONE=Asia/Hong_Kong
DISABLE_SIGNUP=true
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_EMAILS=admin@example.com
GOOGLE_CLIENT_ID=...
SCHOOL_EMAIL_DOMAIN=
```

Notes:
- `APP_MODE=student_portal` makes the Render root URL open `/portal.html`, the student/teacher/admin login portal.
- Do not use `APP_MODE=admin_upload_only` for the student portal service. That mode is for the question-bank uploader only and hides the portal.
- If you also want a separate batch uploader deployment, create another Render service from the same repo with `APP_MODE=admin_upload_only`.

## Main endpoints

- `GET /api/client-config`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/student/daily`
- `GET /api/student/schedule`
- `POST /api/student/submit`
- `GET /api/teacher/overview`

## Daily assignment behavior

- A Daily Mission opens on the Hong Kong task day and aims for three reviews, three learning or backfill questions, and two new questions within the student's scope.
- A sub-topic enters review after correct answers on two separate task days. Successful reviews are due on days 3, 7, 14, and 30. Mastered sub-topics retire from the daily pool, and each topic can advance independently.
- An immediate retest uses a different question and counts towards the ten-question limit. Every three counted errors in the same sub-topic trigger a new teacher alert.
- Run `npm test` to verify the daily learning policy.
