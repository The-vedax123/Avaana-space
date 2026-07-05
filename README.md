# AvaanaSpace — Accessible Discovery

> One intelligent platform to discover businesses, products, services, communities, opportunities and professionals.

AvaanaSpace unifies a **business directory**, **marketplace**, **discovery engine**, **community spaces**, **global search**, **CRM/admin**, **analytics** and a **notification system** into a single, premium, accessible ecosystem.

<p align="center">
  <strong>Business Directory · Marketplace · Discovery · Spaces · Search · Admin · Analytics</strong>
</p>

---

## Monorepo structure

```
apps/
  web/            React 19 + Vite + Tailwind + Framer Motion frontend
  api/            Node.js + Express REST API (clean architecture)
packages/         Shared packages (reserved)
docs/             Architecture & API documentation
scripts/          Dev & ops scripts
infrastructure/   Deployment configuration (Vercel, Render, Docker)
```

## Tech stack

**Frontend** — React 19, Vite, Tailwind CSS, Framer Motion, React Router, TanStack Query, Axios, React Hook Form, Zod, Lucide, Recharts.

**Backend** — Node.js, Express, JWT (access + refresh), bcrypt, Helmet, rate limiting, Zod validation, Swagger, Multer, `pg` (PostgreSQL / Supabase).

**Persistence** — Normalised PostgreSQL schema (see `apps/api/src/db/migrations`). Ships with a zero-config in-memory store seeded with demo data so the whole platform runs instantly; set `DATABASE_URL` to use Supabase/PostgreSQL.

## Quick start

```bash
# 1. Install everything (npm workspaces)
npm install

# 2. Configure env (optional — sensible dev defaults are built in)
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 3. Run API (http://localhost:4000) and web (http://localhost:5173) together
npm run dev
# …or individually
npm run dev:api
npm run dev:web
```

- API docs (Swagger UI): `http://localhost:4000/api/docs`
- Web app: `http://localhost:5173`

### Demo accounts

Password for all: `Password123!`

| Role | Email |
| --- | --- |
| Super Admin | `super@avaanaspace.com` |
| Admin | `admin@avaanaspace.com` |
| Business Owner | `priya@brightbrew.com` |
| User | `lena@example.com` |

## Core workflows

- **Businesses & products require admin approval** before appearing publicly.
- **Marketplace enquiries never go seller ↔ customer directly.** Every enquiry is mediated:
  `Customer → Admin → Business → Admin → Customer`.
- **Role-based access control** across five roles: Visitor, User, Business Owner, Admin, Super Admin.

## Design system

Brand palette from the AvaanaSpace logo:

| Token | Value |
| --- | --- |
| Primary | `#0B5C73` |
| Secondary | `#063F52` |
| Accent | `#1FA6B8` |
| Background | `#F4FBFD` |
| Cards | `#FFFFFF` |
| Dark | `#0E1726` |

Premium UI: glass effects, rounded corners, whitespace, Framer Motion micro-interactions, skeleton loading, beautiful empty states, dark mode, and WCAG-minded accessibility.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system architecture & clean-architecture layering
- [`docs/API.md`](docs/API.md) — REST API reference
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — deploying to Vercel / Render / Supabase

## License

MIT
