import { Router } from 'express';
import { ticketsController } from './tickets.controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { ROLES } from '../../constants/roles.js';
import { createTicketSchema, messageSchema, replyCustomerSchema } from './tickets.schema.js';

const router = Router();

router.use(authenticate);

router.get('/', ticketsController.list);
router.post('/', validate(createTicketSchema), ticketsController.create);
router.get('/:id', ticketsController.get);
router.post(
  '/:id/forward',
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validate(messageSchema),
  ticketsController.forward,
);
router.post('/:id/business-reply', validate(messageSchema), ticketsController.businessReply);
router.post(
  '/:id/reply',
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validate(replyCustomerSchema),
  ticketsController.replyCustomer,
);
router.post('/:id/close', ticketsController.close);

export default router;
