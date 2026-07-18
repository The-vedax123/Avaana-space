# AvaanaSpace — API Reference

Base URL: `/api/v1` · Interactive docs: `/api/docs` (Swagger UI)

All responses use a consistent envelope:

```json
{ "success": true, "data": { }, "meta": { "page": 1, "limit": 20, "total": 42 } }
```

Errors:

```json
{ "success": false, "error": { "message": "Validation failed", "details": [] } }
```

Authentication: send `Authorization: Bearer <accessToken>`. Refresh tokens are stored in an
httpOnly cookie and rotated via `POST /auth/refresh`.

## Auth

| Method | Path | Description |
| --- | --- | --- |
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login |
| POST | `/auth/google` | Google sign-in |
| POST | `/auth/refresh` | Rotate tokens |
| POST | `/auth/logout` | Clear session |
| GET | `/auth/me` | Current user |
| POST | `/auth/forgot-password` | Request reset |
| POST | `/auth/reset-password` | Complete reset |

## Businesses

`GET /businesses` · `GET /businesses/mine` · `GET /businesses/:slug` ·
`POST /businesses` · `PATCH /businesses/:id` · `DELETE /businesses/:id` ·
`POST /businesses/:id/follow` · `POST /businesses/:id/moderate` (admin)

## Marketplace (products)

`GET /products` · `GET /products/:slug` · `POST /products` ·
`PATCH /products/:id` · `DELETE /products/:id` · `POST /products/:id/moderate` (admin)

## Marketplace enquiries (tickets)

`GET /tickets` · `POST /tickets` · `GET /tickets/:id` ·
`POST /tickets/:id/forward` (admin) · `POST /tickets/:id/business-reply` ·
`POST /tickets/:id/reply` (admin) · `POST /tickets/:id/close`

## Spaces

`GET /spaces` · `POST /spaces` · `GET /spaces/:slug` · `POST /spaces/:id/join` ·
`GET|POST /spaces/:id/posts` · `POST /spaces/posts/:postId/like` ·
`GET|POST /spaces/posts/:postId/comments` · `DELETE /spaces/posts/:postId` (moderation)

## Discovery & Search

`GET /discovery` · `GET /discovery/search?q=` · `GET /discovery/search/autocomplete?q=` ·
`GET /discovery/search/recent`

## Notifications

`GET /notifications` · `GET /notifications/unread-count` ·
`POST /notifications/:id/read` · `POST /notifications/read-all`

## Analytics (admin unless noted)

`GET /analytics/platform` · `GET /analytics/search` · `GET /analytics/community` ·
`GET /analytics/business/:id` (owner or admin)

## Admin

`GET /admin/dashboard` · `GET /admin/users` · `PATCH /admin/users/:id` ·
`DELETE /admin/users/:id` · `GET /admin/queues/:type` (`businesses`|`products`) ·
`GET|POST /admin/reports` · `PATCH /admin/reports/:id` · `GET /admin/audit-logs`

## Uploads

`POST /uploads` — authenticated multipart upload (field name `file`). Accepts images only
(jpeg, png, webp, gif, svg), max 5 MB. Returns `{ url, filename, size, mimetype }`; files are
served from `/uploads/:filename`. In production, swap the disk storage for Supabase Storage.

## Query conventions

Pagination & sorting on list endpoints: `?page=1&limit=20&sort=createdAt&order=desc&q=term`.
