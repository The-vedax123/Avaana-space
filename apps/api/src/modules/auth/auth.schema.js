import { z } from 'zod';

const email = z.string().email('A valid email is required').max(255);
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128)
  .regex(/[a-z]/, 'Include a lowercase letter')
  .regex(/[A-Z]/, 'Include an uppercase letter')
  .regex(/[0-9]/, 'Include a number');

export const registerSchema = z.object({
  name: z.string().min(2, 'Name is too short').max(120),
  email,
  password,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z.object({
  token: z.string().min(10, 'Reset token is required'),
  password,
});

export const googleSchema = z.object({
  email,
  name: z.string().min(1).max(120),
  googleId: z.string().min(1),
  avatarUrl: z.string().url().optional(),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10).optional(),
});
