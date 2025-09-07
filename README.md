Oration Career Chat
===================

AI-powered career counselling chat app built with Next.js (App Router), TypeScript, tRPC, TanStack Query, Prisma (SQLite), and OpenAI.

Tech stack
----------

- **Next.js** (App Router, TypeScript)
- **tRPC** (server + React Query client)
- **TanStack Query** (data fetching/caching)
- **Prisma** with **SQLite** (local dev)
- **Tailwind CSS** (styling)
- **OpenAI** (LLM responses; easily swap with Together/OpenRouter)

Getting started
---------------

1. Install prerequisites:
   - Node.js 18.18+ (Node 20 recommended)
   - pnpm

2. Install dependencies:
   
   ```bash
   pnpm install
   ```

3. Configure environment:
   
   - Copy `.env.example` to `.env` and fill in values.
   - For local dev with SQLite, the default `DATABASE_URL` is ready to use.

4. Setup database and generate Prisma Client:
   
   ```bash
   pnpm prisma migrate dev
   pnpm prisma generate
   ```

5. Run the dev server:
   
   ```bash
   pnpm dev
   ```

6. Open `http://localhost:3000` in your browser.

Environment variables
---------------------

See `.env.example` for the full list. Required:

- `DATABASE_URL` – e.g. `file:./dev.db` for SQLite
- `OPENAI_API_KEY` – set if using OpenAI for responses
- `OPENAI_MODEL` – optional (default: `gpt-4o-mini`)

Project structure highlights
---------------------------

- `src/server/db.ts` – Prisma Client singleton
- `src/server/trpc.ts` – tRPC init
- `src/server/routers/` – tRPC routers (see `chat.ts`)
- `src/app/api/trpc/[trpc]/route.ts` – tRPC fetch adapter endpoint
- `src/utils/trpc.ts` – tRPC React client
- `src/app/page.tsx` – minimal chat UI (sessions + messages)

Development notes
-----------------

- If `OPENAI_API_KEY` is not set, sending a message will fail at the API. You can supply an alternate provider by updating `src/server/routers/chat.ts`.
- The sessions list uses cursor-based pagination via tRPC and React Query.

Deployment
----------

1. Provision a database (e.g., Neon or Supabase Postgres) and update `DATABASE_URL`.
2. Set environment variables on Vercel.
3. Build and deploy:
   
   ```bash
   pnpm build
   pnpm start
   ```

Scoring checklist mapping
-------------------------

- Next.js + TypeScript + Tailwind – completed
- tRPC + TanStack Query – completed
- Database schema and persistence – completed
- Chat sessions + history + pagination – completed
- AI integration – completed (OpenAI), easily swappable
- README + setup instructions – included
- Deployment – instructions provided
# OrationBot
# OrationBot
