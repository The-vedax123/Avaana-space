import crypto from 'node:crypto';
import { usersRepository } from '../users/users.repository.js';
import {
  comparePassword,
  hashPassword,
  issueTokens,
  verifyRefreshToken,
} from '../../utils/security.js';
import { ApiError } from '../../utils/apiError.js';
import { ROLES, STATUS } from '../../constants/roles.js';
import { auditService } from '../admin/audit.service.js';
import { notificationsService } from '../notifications/notifications.service.js';

// Short-lived password reset tokens (in-memory demo store).
const resetTokens = new Map();

export const authService = {
  async register({ name, email, password }) {
    const existing = await usersRepository.findByEmail(email);
    if (existing) throw ApiError.conflict('An account with this email already exists');
    const passwordHash = await hashPassword(password);
    const user = await usersRepository.create({
      name,
      email,
      passwordHash,
      role: ROLES.USER,
      status: STATUS.APPROVED,
      avatarUrl: '',
      bio: '',
    });
    await auditService.record({ actorId: user.id, action: 'user.register', target: user.id });
    await notificationsService.create({
      userId: user.id,
      category: 'system',
      title: 'Welcome to AvaanaSpace',
      body: 'Your account is ready. Start discovering businesses, products and communities.',
    });
    const tokens = issueTokens(user);
    return { user: usersRepository.publicView(user), ...tokens };
  },

  async login({ email, password }) {
    const user = await usersRepository.findByEmail(email);
    if (!user || !user.passwordHash) throw ApiError.unauthorized('Invalid email or password');
    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) throw ApiError.unauthorized('Invalid email or password');
    if (user.status === STATUS.SUSPENDED) throw ApiError.forbidden('Account suspended');
    await auditService.record({ actorId: user.id, action: 'user.login', target: user.id });
    const tokens = issueTokens(user);
    return { user: usersRepository.publicView(user), ...tokens };
  },

  async googleLogin({ email, name, googleId, avatarUrl }) {
    let user = await usersRepository.findByEmail(email);
    if (!user) {
      user = await usersRepository.create({
        name,
        email,
        passwordHash: null,
        googleId,
        role: ROLES.USER,
        status: STATUS.APPROVED,
        avatarUrl: avatarUrl || '',
        bio: '',
      });
    }
    const tokens = issueTokens(user);
    return { user: usersRepository.publicView(user), ...tokens };
  },

  async refresh(token) {
    if (!token) throw ApiError.unauthorized('Refresh token required');
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }
    const user = await usersRepository.findById(decoded.sub);
    if (!user) throw ApiError.unauthorized('Account not found');
    const tokens = issueTokens(user);
    return { user: usersRepository.publicView(user), ...tokens };
  },

  async forgotPassword(email) {
    const user = await usersRepository.findByEmail(email);
    // Always behave the same to avoid account enumeration.
    if (!user) return { delivered: true };
    const token = crypto.randomBytes(24).toString('hex');
    resetTokens.set(token, { userId: user.id, expiresAt: Date.now() + 30 * 60 * 1000 });
    // In production this token is emailed via Nodemailer. For local dev we return it.
    return { delivered: true, devToken: token };
  },

  async resetPassword({ token, password }) {
    const entry = resetTokens.get(token);
    if (!entry || entry.expiresAt < Date.now()) {
      throw ApiError.badRequest('Reset link is invalid or has expired');
    }
    const passwordHash = await hashPassword(password);
    await usersRepository.update(entry.userId, { passwordHash });
    resetTokens.delete(token);
    await auditService.record({
      actorId: entry.userId,
      action: 'user.reset_password',
      target: entry.userId,
    });
    return { reset: true };
  },
};
