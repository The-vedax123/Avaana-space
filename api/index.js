import { createApp } from '../apps/api/src/app.js';

// Vercel rewrites every /api/* request to this single function while
// preserving the original request URL for Express to route.
export default createApp();
