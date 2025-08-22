# StatLynk HR & Payroll (Frontend MVP)

A Next.js + Tailwind web app that bundles **Core HR, Payroll, Time & Attendance, Performance, Hiring, and Analytics** for a 10-person team.

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy to Vercel

1. Create a new GitHub repo (e.g., `statlynk-hr`) and push this project.
2. Go to https://vercel.com → New Project → Import the repo.
3. Framework preset: **Next.js** (auto).
4. Click **Deploy**.

## Notes

- This is a frontend-only MVP. State is in-memory; add a backend (NestJS/FastAPI) + DB (Postgres/Supabase) for persistence.
- Email/Calendar are placeholders for Gmail/Microsoft OAuth integrations.
- All charts use `recharts`. No extra UI frameworks required.
