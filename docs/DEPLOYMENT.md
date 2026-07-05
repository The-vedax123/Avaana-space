# AvaanaSpace — Deployment

## Overview

| Component | Recommended host |
| --- | --- |
| Web (`apps/web`) | Vercel (static + SPA) |
| API (`apps/api`) | Render (Node web service) |
| Database & Storage | Supabase (PostgreSQL + Storage) |
| CDN / DNS | Cloudflare |

## 1. Database (Supabase / PostgreSQL)

1. Create a Supabase project and copy the connection string.
2. Set `DATABASE_URL` in the API environment.
3. Apply the schema:

   ```bash
   cd apps/api
   DATABASE_URL="postgresql://…" npm run migrate
   ```

## 2. API (Render)

- Root directory: `apps/api`
- Build command: `npm install`
- Start command: `npm start`
- Environment: copy from `apps/api/.env.example` (set strong `JWT_ACCESS_SECRET`,
  `JWT_REFRESH_SECRET`, `DATABASE_URL`, `CORS_ORIGIN=https://your-web-domain`).
- A ready-made blueprint is provided at [`infrastructure/render.yaml`](../infrastructure/render.yaml).

## 3. Web (Vercel)

- Root directory: `apps/web`
- Build command: `npm run build`
- Output directory: `dist`
- Environment: `VITE_API_URL=https://your-api-domain/api/v1`
- SPA routing is handled by [`infrastructure/vercel.json`](../infrastructure/vercel.json).

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
