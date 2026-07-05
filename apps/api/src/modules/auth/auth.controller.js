import { authService } from './auth.service.js';
import { asyncHandler, ok, created } from '../../utils/http.js';
import { env } from '../../config/env.js';
import { usersRepository } from '../users/users.repository.js';

const cookieOpts = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const setRefreshCookie = (res, token) => res.cookie('refreshToken', token, cookieOpts);

export const authController = {
  register: asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    setRefreshCookie(res, result.refreshToken);
    created(res, result);
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    setRefreshCookie(res, result.refreshToken);
    ok(res, result);
  }),

  google: asyncHandler(async (req, res) => {
    const result = await authService.googleLogin(req.body);
    setRefreshCookie(res, result.refreshToken);
    ok(res, result);
  }),

  refresh: asyncHandler(async (req, res) => {
    const token = req.body?.refreshToken || req.cookies?.refreshToken;
    const result = await authService.refresh(token);
    setRefreshCookie(res, result.refreshToken);
    ok(res, result);
  }),

  logout: asyncHandler(async (_req, res) => {
    res.clearCookie('refreshToken', { ...cookieOpts, maxAge: undefined });
    ok(res, { loggedOut: true });
  }),

  me: asyncHandler(async (req, res) => {
    const user = await usersRepository.findById(req.user.id);
    ok(res, { user: usersRepository.publicView(user) });
  }),

  forgotPassword: asyncHandler(async (req, res) => {
    const result = await authService.forgotPassword(req.body.email);
    ok(res, result);
  }),

  resetPassword: asyncHandler(async (req, res) => {
    const result = await authService.resetPassword(req.body);
    ok(res, result);
  }),
};
