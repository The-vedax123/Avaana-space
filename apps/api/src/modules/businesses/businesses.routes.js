import { Router } from 'express';
import { businessesController } from './businesses.controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate, authorize, optionalAuth } from '../../middleware/auth.js';
import { ROLES } from '../../constants/roles.js';
import {
  createBusinessSchema,
  updateBusinessSchema,
  moderateSchema,
} from './businesses.schema.js';

const router = Router();

router.get('/', optionalAuth, businessesController.list);
router.get('/mine', authenticate, businessesController.mine);
router.get('/:slug', optionalAuth, businessesController.getBySlug);
router.post('/', authenticate, validate(createBusinessSchema), businessesController.create);
router.patch('/:id', authenticate, validate(updateBusinessSchema), businessesController.update);
router.delete('/:id', authenticate, businessesController.remove);
router.post('/:id/follow', authenticate, businessesController.follow);
router.post(
  '/:id/moderate',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validate(moderateSchema),
  businessesController.moderate,
);

export default router;
