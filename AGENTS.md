# ARS Futuro Agent Guide

## Package manager

- Use `pnpm` exclusively. Do not run `npm`, `npx`, or update either `package-lock.json`.
- This is not a root workspace: run package commands from `backend/` or `frontend/`, which each have an independent `pnpm-lock.yaml`.

## Project layout

- `backend/` is the Express 5 API. `src/app.ts` wires middleware and mounts `src/routes/index.ts` at `/api`; `src/server.ts` starts the listener.
- `backend/prisma/schema.prisma` is the PostgreSQL data model. The API uses Prisma and Zod request validation in the route module.
- `frontend/` is a Vite React client. `src/App.tsx` is the current application shell; `src/api/client.ts` owns HTTP calls, token injection, and `VITE_API_URL` (default: `http://localhost:4000/api`).

## Commands

- Backend install and checks: `cd backend && pnpm install && pnpm run typecheck && pnpm test`.
- Run one backend test: `cd backend && pnpm exec vitest run tests/auth.test.ts`.
- Backend formatting/linting has no package script: `cd backend && pnpm exec biome check src tests prisma` (append `--write` only when intentionally applying fixes).
- Start the API: `cd backend && pnpm run dev`. It serves `/health`, `/api`, and `/api/docs` on port `4000` by default.
- Frontend install/build: `cd frontend && pnpm install && pnpm run build`.
- Frontend formatting/linting has no package script: `cd frontend && pnpm exec biome check src`.
- Start the client: `cd frontend && pnpm run dev` (Vite default port `5173`). Set `VITE_API_URL` in `frontend/.env` when the API is elsewhere.

## Database and environment

- Backend startup requires `DATABASE_URL` and `JWT_SECRET` outside `NODE_ENV=test`; copy `backend/.env.example` to `backend/.env` and configure PostgreSQL first.
- After changing `backend/prisma/schema.prisma`, run `cd backend && pnpm run prisma:generate`.
- There are no committed Prisma migrations. Initialize local Prisma-managed tables with `cd backend && pnpm exec prisma db push`, then seed with `pnpm run prisma:seed`.
- Do not combine `prisma db push` with the manual scripts in `backend/sql/` on the same initialized database.

## Conventions and integration

- Biome is configured in each package: tabs and double quotes, recommended lint rules, and import organization. Use its output rather than introducing another formatter or linter.
- Backend source is ESM (`type: module` and `NodeNext`), so local TypeScript imports use `.js` specifiers.
- Keep frontend payload keys and Spanish-facing models aligned through `frontend/src/api/adapters.ts`; do not bypass the API client when adding an API-backed UI flow.
- K6 suites in `backend/k6/` require a running API plus seeded credentials. Run them with `cd backend && k6 run k6/auth-smoke.js` (or the other suite files).
