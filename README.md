# algoTrace

AI-powered behavioral coding coach for DSA built with Next.js, TypeScript, Tailwind, and shadcn-style UI patterns.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Radix UI + class-variance-authority (shadcn-style primitives)
- Monaco Editor
- Recharts
- Zod

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## StackAuth Setup (Dashboard Protection)

1. Copy `.env.example` to `.env.local`.
2. Add StackAuth credentials:
   - `NEXT_PUBLIC_STACK_PROJECT_ID`
   - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
   - `STACK_SECRET_SERVER_KEY`
3. Open `/handler/sign-up` or `/handler/sign-in`.

`/dashboard` is protected and requires authentication.

## Current Routes

- `/` Landing page
- `/workspace` Monaco coding workspace + live weakness tracker + hints + coach panel
- `/dashboard` Longitudinal trend chart
- `/handler/[...stack]` StackAuth handler routes (sign-in, sign-up, account settings)
- `/api/infer` Feature vector -> weakness prediction (ML-service ready, fallback model included)
- `/api/coach` Socratic coaching response endpoint
- `/api/report` Post-session intelligence report endpoint
- `/api/sessions` Session and event ingestion endpoint
- `/api/problems` Problem taxonomy endpoint

## Notes

- `ML_SERVICE_URL` can be set to a FastAPI model service. If not set, an internal fallback scorer is used.
- Data persistence is currently in-memory (`src/lib/storage.ts`) and can be swapped with Postgres/SQLite.
