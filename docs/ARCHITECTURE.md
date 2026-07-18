# AvaanaSpace — Architecture

AvaanaSpace is a monorepo (npm workspaces) with two deployable apps and shared tooling.

## High-level

```
┌────────────────────┐        HTTPS / JSON        ┌────────────────────┐
│      apps/web       │  ───────────────────────▶  │      apps/api       │
│  React 19 + Vite    │   Bearer JWT + refresh     │  Express (Node.js)  │
│  Tailwind + Motion  │  ◀───────────────────────  │  Clean architecture │
└────────────────────┘                            └─────────┬──────────┘
                                                             │
                                                   ┌─────────▼──────────┐
                                                   │  PostgreSQL /       │
                                                   │  Supabase (or the   │
                                                   │  in-memory store)   │
                                                   └────────────────────┘
```

## Backend — clean architecture

Each module follows **Controllers → Services → Repository → Database**:

```
src/
  config/         env, swagger
  constants/      roles, statuses
  middleware/     auth (JWT), rbac, validate (Zod), rate limiting, error handling
  utils/          security (jwt/bcrypt), http helpers, ApiError, logger
  db/             pg pool, in-memory store, seed data, SQL migrations
  modules/
    <module>/
      *.routes.js        HTTP routing + middleware wiring
      *.controller.js    request/response mapping (thin)
      *.service.js       business logic (transactional intent)
      *.repository.js    data access (swappable persistence)
      *.schema.js        Zod request validation
  routes/index.js  versioned API router (/api/v1)
```

Modules: `auth`, `users`, `businesses`, `products`, `spaces`, `tickets` (marketplace),
`discovery`, `search`, `notifications`, `analytics`, `admin`.

### Persistence strategy

The repository layer decouples business logic from storage. The default runtime uses a
seeded **in-memory store** (`db/store.js`) so the platform runs with zero setup. The
equivalent **normalised PostgreSQL schema** lives in `db/migrations/001_init.sql` with
foreign keys, indexes, enums and soft-delete columns (`deleted_at`). Set `DATABASE_URL`
and run `npm run migrate` to provision Supabase/PostgreSQL.

## Security

- JWT access tokens (short-lived) + refresh tokens (httpOnly cookie + rotation).
- Hierarchical RBAC (`requireRank`) and explicit `authorize(...roles)` guards.
- Helmet, CORS allow-list, global + auth-specific rate limiting.
- Zod validation on every mutating endpoint.
- Centralised error handler that never leaks stack traces in production.
- Audit logging for privileged actions.

## Frontend

- **Routing & code splitting**: every page is `React.lazy` loaded.
- **Data**: TanStack Query for caching, background refresh and mutations.
- **Auth**: `AuthContext` bootstraps via silent refresh; Axios interceptor auto-refreshes on 401.
- **Design system**: reusable primitives in `components/ui`, app widgets in `components/app`.
- **UX**: splash screen, skeleton loaders, empty states, toasts, dark mode, motion.

## The marketplace ticket workflow

Customers never contact sellers directly. The mediated flow is enforced server-side via
message `audience` and ticket `status` transitions:

```
Customer ──opens ticket──▶ Admin ──forwards──▶ Business
Business ──responds──▶ Admin ──relays──▶ Customer ──▶ resolved
```
