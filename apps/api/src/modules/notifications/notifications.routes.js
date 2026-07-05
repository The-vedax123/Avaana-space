import { Router } from 'express';
import { notificationsService } from './notifications.service.js';
import { asyncHandler, ok } from '../../utils/http.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const items = await notificationsService.listForUser(req.user.id, {
      category: req.query.category,
    });
    const unread = await notificationsService.unreadCount(req.user.id);
    ok(res, { items, unread });
  }),
);

router.get(
  '/unread-count',
  asyncHandler(async (req, res) => {
    ok(res, { unread: await notificationsService.unreadCount(req.user.id) });
  }),
);

router.post(
  '/:id/read',
  asyncHandler(async (req, res) => {
    ok(res, await notificationsService.markRead(req.params.id, req.user.id));
  }),
);

router.post(
  '/read-all',
  asyncHandler(async (req, res) => {
    const count = await notificationsService.markAllRead(req.user.id);
    ok(res, { marked: count });
  }),
);

export default router;
