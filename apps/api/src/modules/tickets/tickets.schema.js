import { z } from 'zod';

export const createTicketSchema = z.object({
  businessId: z.string().min(1),
  productId: z.string().min(1).optional(),
  subject: z.string().min(3).max(160),
  message: z.string().min(5).max(4000),
});

export const messageSchema = z.object({
  body: z.string().min(1).max(4000),
});

export const replyCustomerSchema = z.object({
  body: z.string().min(1).max(4000),
  resolve: z.boolean().optional().default(true),
});
