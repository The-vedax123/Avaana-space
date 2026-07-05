# AvaanaSpace

Monorepo (npm workspaces) with two apps:

- `apps/api` — Node.js + Express REST API (clean architecture). Dev: `npm run dev:api` → http://localhost:4000 (Swagger UI at `/api/docs`, base path `/api/v1`).
- `apps/web` — React 19 + Vite frontend. Dev: `npm run dev:web` → http://localhost:5173.

Run both together with `npm run dev`. See `README.md` for the full quick start, demo accounts, and workflows.

## Cursor Cloud specific instructions

- Node 20+ is required (`engines.node`); the VM has Node 22, which works.
- The API runs with a **zero-config in-memory store seeded with demo data** by default, so no database is needed for local dev. It only uses PostgreSQL/Supabase if `DATABASE_URL` is set in `apps/api/.env`.
- `.env` files are optional — sensible dev defaults are built in. `README.md` documents copying `apps/api/.env.example` and `apps/web/.env.example` if you want to customize.
- The Vite dev server proxies `/api` → `http://localhost:4000`, so the API must be running for the web app's data calls to work.
- Demo login for testing (all passwords `Password123!`): `super@avaanaspace.com`, `admin@avaanaspace.com`, `priya@brightbrew.com`, `lena@example.com`.
- The in-memory store resets on every API restart (demo data re-seeds); state created during a session is not persisted.
- Known limitation: `npm run lint` fails because `apps/web`'s `lint` script calls `eslint` but ESLint is not declared as a dependency and there is no ESLint config in the repo. This is a pre-existing repo issue, not an environment setup problem. `npm run build` (Vite production build of the web app) works.
