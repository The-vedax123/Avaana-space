import { ApiError } from '../utils/apiError.js';
import { verifyAccessToken } from '../utils/security.js';
import { ROLE_RANK } from '../constants/roles.js';
import { usersRepository } from '../modules/users/users.repository.js';

const extractToken = (req) => {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);
  if (req.cookies?.accessToken) return req.cookies.accessToken;
  return null;
};

export const authenticate = async (req, _res, next) => {
  try {
    const token = extractToken(req);
    if (!token) throw ApiError.unauthorized('Authentication required');
    const decoded = verifyAccessToken(token);
    const user = await usersRepository.findById(decoded.sub);
    if (!user || user.deletedAt) throw ApiError.unauthorized('Account not found');
    if (user.status === 'suspended') throw ApiError.forbidden('Account suspended');
    req.user = { id: user.id, role: user.role, email: user.email, name: user.name };
    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    return next(ApiError.unauthorized('Invalid or expired token'));
  }
};

/** Optional auth — attaches req.user when a valid token is present, never fails. */
export const optionalAuth = async (req, _res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return next();
    const decoded = verifyAccessToken(token);
    const user = await usersRepository.findById(decoded.sub);
    if (user && !user.deletedAt) {
      req.user = { id: user.id, role: user.role, email: user.email, name: user.name };
    }
  } catch {
    /* ignore — visitor */
  }
  next();
};

export const authorize = (...allowedRoles) => (req, _res, next) => {
  if (!req.user) return next(ApiError.unauthorized());
  if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
    return next(ApiError.forbidden('You do not have permission to perform this action'));
  }
  next();
};

/** Require at least the given role rank (hierarchical RBAC). */
export const requireRank = (minRole) => (req, _res, next) => {
  if (!req.user) return next(ApiError.unauthorized());
  if ((ROLE_RANK[req.user.role] ?? -1) < (ROLE_RANK[minRole] ?? 99)) {
    return next(ApiError.forbidden('Insufficient privileges'));
  }
  next();
};
