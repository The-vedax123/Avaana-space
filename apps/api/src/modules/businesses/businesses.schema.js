import { z } from 'zod';

export const createBusinessSchema = z.object({
  name: z.string().min(2).max(140),
  category: z.string().min(2).max(80),
  tagline: z.string().max(160).optional().default(''),
  description: z.string().min(10).max(4000),
  logoUrl: z.string().url().optional().or(z.literal('')).default(''),
  coverUrl: z.string().url().optional().or(z.literal('')).default(''),
  gallery: z.array(z.string().url()).max(12).optional().default([]),
  website: z.string().url().optional().or(z.literal('')).default(''),
  location: z.string().max(120).optional().default(''),
});

export const updateBusinessSchema = createBusinessSchema.partial();

export const moderateSchema = z.object({
  status: z.enum(['approved', 'rejected', 'suspended', 'pending']),
  reason: z.string().max(500).optional(),
});
