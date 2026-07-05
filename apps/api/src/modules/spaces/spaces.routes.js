import { Router } from 'express';
import { spacesController } from './spaces.controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate, optionalAuth } from '../../middleware/auth.js';
import { createSpaceSchema, createPostSchema, commentSchema } from './spaces.schema.js';

const router = Router();

router.get('/', optionalAuth, spacesController.list);
router.post('/', authenticate, validate(createSpaceSchema), spacesController.create);
router.get('/:slug', optionalAuth, spacesController.getBySlug);
router.post('/:id/join', authenticate, spacesController.join);

router.get('/:id/posts', optionalAuth, spacesController.listPosts);
router.post('/:id/posts', authenticate, validate(createPostSchema), spacesController.createPost);

router.post('/posts/:postId/like', authenticate, spacesController.likePost);
router.get('/posts/:postId/comments', optionalAuth, spacesController.listComments);
router.post(
  '/posts/:postId/comments',
  authenticate,
  validate(commentSchema),
  spacesController.addComment,
);
router.delete('/posts/:postId', authenticate, spacesController.moderatePost);

export default router;
