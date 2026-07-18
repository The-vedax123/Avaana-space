import { Router } from 'express';
import { productsController } from './products.controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate, authorize, optionalAuth } from '../../middleware/auth.js';
import { ROLES } from '../../constants/roles.js';
import {
  createProductSchema,
  updateProductSchema,
  moderateProductSchema,
} from './products.schema.js';

const router = Router();

router.get('/', optionalAuth, productsController.list);
router.get('/:slug', optionalAuth, productsController.getBySlug);
router.post('/', authenticate, validate(createProductSchema), productsController.create);
router.patch('/:id', authenticate, validate(updateProductSchema), productsController.update);
router.delete('/:id', authenticate, productsController.remove);
router.post(
  '/:id/moderate',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validate(moderateProductSchema),
  productsController.moderate,
);

export default router;
