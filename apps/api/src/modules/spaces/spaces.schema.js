import { z } from 'zod';

export const createSpaceSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(10).max(2000),
  visibility: z.enum(['public', 'private']).default('public'),
  official: z.boolean().optional().default(false),
});

export const createPostSchema = z.object({
  title: z.string().min(3).max(200),
  body: z.string().min(1).max(8000),
});

export const commentSchema = z.object({
  body: z.string().min(1).max(2000),
});
