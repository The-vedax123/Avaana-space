import { Router } from 'express';
import { z } from 'zod';
import { adminService } from './admin.service.js';
import { asyncHandler, ok, created, parseQuery } from '../../utils/http.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { ROLES } from '../../constants/roles.js';

const router = Router();

// Reporting is available to any authenticated user.
const reportSchema = z.object({
  targetType: z.enum(['business', 'product', 'post', 'user', 'space']),
  targetId: z.string().min(1),
  reason: z.string().min(5).max(1000),
});
router.post(
  '/reports',
  authenticate,
  validate(reportSchema),
  asyncHandler(async (req, res) => created(res, await adminService.createReport(req.user, req.body))),
);

// Everything below requires admin privileges.
router.use(authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN));

router.get(
  '/dashboard',
  asyncHandler(async (_req, res) => ok(res, await adminService.dashboard())),
);

router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const query = { ...parseQuery(req.query), role: req.query.role };
    const { data, meta } = await adminService.listUsers(query);
    ok(res, data, meta);
  }),
);

const updateUserSchema = z.object({
  role: z.enum(Object.values(ROLES)).optional(),
  status: z.enum(['approved', 'pending', 'suspended', 'rejected']).optional(),
});
router.patch(
  '/users/:id',
  validate(updateUserSchema),
  asyncHandler(async (req, res) => ok(res, await adminService.updateUser(req.user, req.params.id, req.body))),
);

router.delete(
  '/users/:id',
  asyncHandler(async (req, res) => ok(res, await adminService.deleteUser(req.user, req.params.id))),
);

router.get(
  '/queues/:type',
  asyncHandler(async (req, res) => {
    const { data, meta } = await adminService.moderationQueue(req.params.type, parseQuery(req.query));
    ok(res, data, meta);
  }),
);

router.get(
  '/reports',
  asyncHandler(async (req, res) => {
    const { data, meta } = await adminService.listReports(parseQuery(req.query));
    ok(res, data, meta);
  }),
);

const resolveSchema = z.object({ status: z.enum(['open', 'resolved', 'dismissed']) });
router.patch(
  '/reports/:id',
  validate(resolveSchema),
  asyncHandler(async (req, res) => ok(res, await adminService.resolveReport(req.user, req.params.id, req.body.status))),
);

router.get(
  '/audit-logs',
  asyncHandler(async (req, res) => {
    const { data, meta } = await adminService.auditLogs(parseQuery(req.query));
    ok(res, data, meta);
  }),
);

export default router;
