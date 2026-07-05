import { Router } from 'express';
import { discoveryService } from './discovery.service.js';
import { searchService } from '../search/search.service.js';
import { asyncHandler, ok } from '../../utils/http.js';
import { optionalAuth } from '../../middleware/auth.js';

const router = Router();

router.get(
  '/',
  optionalAuth,
  asyncHandler(async (_req, res) => {
    ok(res, await discoveryService.overview());
  }),
);

router.get(
  '/search',
  optionalAuth,
  asyncHandler(async (req, res) => {
    ok(res, await searchService.global(req.query.q, req.user?.id));
  }),
);

router.get(
  '/search/autocomplete',
  asyncHandler(async (req, res) => {
    ok(res, await searchService.autocomplete(req.query.q));
  }),
);

router.get(
  '/search/recent',
  optionalAuth,
  asyncHandler(async (req, res) => {
    ok(res, req.user ? await searchService.recent(req.user.id) : []);
  }),
);

export default router;
