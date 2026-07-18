import { createApp } from '../apps/api/src/app.js';

// Vercel invokes the Express application as a serverless function for every
// /api/* request. Express keeps the original URL, so the existing /api/v1
// routes work unchanged and the frontend can use a same-origin API.
export default createApp();
