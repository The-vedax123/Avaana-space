import { Router } from 'express';
import { z } from 'zod';
import { usersRepository } from './users.repository.js';
import { asyncHandler, ok } from '../../utils/http.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { ApiError } from '../../utils/apiError.js';

const router = Router();

const updateProfileSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

router.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    ok(res, usersRepository.publicView(await usersRepository.findById(req.user.id)));
  }),
);

router.patch(
  '/me',
  authenticate,
  validate(updateProfileSchema),
  asyncHandler(async (req, res) => {
    const updated = await usersRepository.update(req.user.id, req.body);
    ok(res, usersRepository.publicView(updated));
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const user = await usersRepository.findById(req.params.id);
    if (!user) throw ApiError.notFound('User not found');
    ok(res, usersRepository.publicView(user));
  }),
);

export default router;
