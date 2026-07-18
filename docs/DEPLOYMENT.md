# AvaanaSpace — Deployment

## Overview

| Component | Recommended host |
| --- | --- |
| Web (`apps/web`) | Vercel (static + SPA) |
| API (`api/index.js`) | Vercel Function (same-origin) |
| Database & Storage | Supabase (PostgreSQL + Storage) |
| CDN / DNS | Cloudflare |

## 1. Database (Supabase / PostgreSQL)

1. Create a Supabase project and copy the connection string.
2. Copy both the direct connection string (for migrations) and the pooled
   connection string (for the serverless runtime).
3. Apply the schema:

   ```bash
   cd apps/api
   DATABASE_URL="postgresql://…" npm run migrate
   ```

4. Set Vercel's `DATABASE_URL` to the pooled Supabase connection string.

## 2. Web + API (Vercel)

Deploy from the repository root. The root [`vercel.json`](../vercel.json)
builds the Vite application and deploys the Express app as a catch-all Vercel
Function under `/api/*`.

- Root directory: `.`
- Install command: `npm install`
- Build command: `npm run build:web`
- Output directory: `apps/web/dist`
- `VITE_API_URL`: leave unset (the frontend defaults to same-origin `/api/v1`)
- Required environment:
  - `DATABASE_URL` (pooled Supabase/PostgreSQL connection string)
  - `JWT_ACCESS_SECRET`
  - `JWT_REFRESH_SECRET`
  - `NODE_ENV=production`

After deployment, verify `https://your-domain/api/v1/health`. The response
must report `"database": "postgresql"` before accepting production traffic.

## 3. API alternative (Render)

- Root directory: `apps/api`
- Build command: `npm install`
- Start command: `npm start`
- Environment: copy from `apps/api/.env.example` (set strong `JWT_ACCESS_SECRET`,
  `JWT_REFRESH_SECRET`, `DATABASE_URL`, `CORS_ORIGIN=https://your-web-domain`).
- A ready-made blueprint is provided at [`infrastructure/render.yaml`](../infrastructure/render.yaml).
- Set `VITE_API_URL=https://your-render-domain/api/v1` in Vercel and redeploy
  if the API is hosted separately.

## 4. Docker (self-hosting the API)

```bash
docker build -f infrastructure/Dockerfile.api -t avaanaspace-api .
docker run -p 4000:4000 --env-file apps/api/.env avaanaspace-api
```

## Production checklist

- [ ] Rotate JWT secrets and set them via environment variables.
- [ ] Restrict `CORS_ORIGIN` to your web domain.
- [ ] Provision `DATABASE_URL` and run migrations.
- [ ] Configure SMTP (`SMTP_*`) for transactional email.
- [ ] Set `NODE_ENV=production` (disables verbose errors / stack traces).
