import { z } from 'zod';

export const createProductSchema = z.object({
  businessId: z.string().min(1),
  name: z.string().min(2).max(140),
  price: z.number().nonnegative(),
  currency: z.string().length(3).default('USD'),
  category: z.string().min(2).max(80),
  description: z.string().min(10).max(4000),
  imageUrl: z.string().url().optional().or(z.literal('')).default(''),
  stock: z.number().int().nonnegative().default(0),
});

export const updateProductSchema = createProductSchema.partial().omit({ businessId: true });

export const moderateProductSchema = z.object({
  status: z.enum(['approved', 'rejected', 'suspended', 'pending']),
  reason: z.string().max(500).optional(),
});
