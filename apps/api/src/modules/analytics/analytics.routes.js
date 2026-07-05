import { Router } from 'express';
import { analyticsService } from './analytics.service.js';
import { asyncHandler, ok } from '../../utils/http.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { ROLES } from '../../constants/roles.js';
import { ApiError } from '../../utils/apiError.js';
import { businessesRepository } from '../businesses/businesses.repository.js';
import { ROLE_RANK } from '../../constants/roles.js';

const router = Router();
router.use(authenticate);

router.get(
  '/platform',
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  asyncHandler(async (_req, res) => ok(res, await analyticsService.platform())),
);

router.get(
  '/search',
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  asyncHandler(async (_req, res) => ok(res, await analyticsService.search())),
);

router.get(
  '/community',
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  asyncHandler(async (_req, res) => ok(res, await analyticsService.community())),
);

router.get(
  '/business/:id',
  asyncHandler(async (req, res) => {
    const business = await businessesRepository.findById(req.params.id);
    if (!business) throw ApiError.notFound('Business not found');
    const staff = ROLE_RANK[req.user.role] >= ROLE_RANK[ROLES.ADMIN];
    if (business.ownerId !== req.user.id && !staff) {
      throw ApiError.forbidden('You can only view analytics for your own business');
    }
    ok(res, await analyticsService.forBusiness(req.params.id));
  }),
);

export default router;
