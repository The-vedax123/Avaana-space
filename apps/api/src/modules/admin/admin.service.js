import { db } from '../../db/store.js';
import { ApiError } from '../../utils/apiError.js';
import { ROLES, STATUS, ROLE_RANK } from '../../constants/roles.js';
import { paginate } from '../../utils/http.js';
import { usersRepository } from '../users/users.repository.js';
import { auditService } from './audit.service.js';

export const adminService = {
  async dashboard() {
    const businesses = db.businesses.find({});
    const products = db.products.find({});
    return {
      stats: {
        users: db.users.count(),
        businesses: businesses.length,
        products: products.length,
        spaces: db.spaces.count(),
        openTickets: db.tickets.find({}).filter((t) => t.status !== 'closed').length,
      },
      queues: {
        pendingBusinesses: businesses.filter((b) => b.status === STATUS.PENDING).length,
        pendingProducts: products.filter((p) => p.status === STATUS.PENDING).length,
        openReports: db.reports.find({ status: 'open' }).length,
      },
      recentAudit: (await auditService.list()).slice(0, 8),
    };
  },

  async listUsers(query) {
    let items = db.users.find({}, { sort: 'createdAt', order: 'desc' });
    if (query.role) items = items.filter((u) => u.role === query.role);
    if (query.search) {
      const q = query.search.toLowerCase();
      items = items.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }
    return paginate(items.map(usersRepository.publicView), query);
  },

  async updateUser(actor, id, { role, status }) {
    const user = db.users.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    if (role && ROLE_RANK[actor.role] < ROLE_RANK[ROLES.SUPER_ADMIN] && ROLE_RANK[role] >= ROLE_RANK[ROLES.ADMIN]) {
      throw ApiError.forbidden('Only a super admin can grant admin roles');
    }
    const patch = {};
    if (role) patch.role = role;
    if (status) patch.status = status;
    const updated = await usersRepository.update(id, patch);
    await auditService.record({ actorId: actor.id, action: 'user.update', target: id, meta: patch });
    return usersRepository.publicView(updated);
  },

  async deleteUser(actor, id) {
    const user = db.users.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    if (ROLE_RANK[user.role] >= ROLE_RANK[ROLES.SUPER_ADMIN]) {
      throw ApiError.forbidden('Super admin accounts cannot be deleted');
    }
    await usersRepository.softDelete(id);
    await auditService.record({ actorId: actor.id, action: 'user.delete', target: id });
    return { deleted: true };
  },

  async moderationQueue(type, query) {
    if (type === 'businesses') {
      return paginate(db.businesses.find({ status: STATUS.PENDING }, { sort: 'createdAt', order: 'asc' }), query);
    }
    if (type === 'products') {
      const items = db.products.find({ status: STATUS.PENDING }, { sort: 'createdAt', order: 'asc' }).map((p) => ({
        ...p,
        business: db.businesses.findById(p.businessId),
      }));
      return paginate(items, query);
    }
    throw ApiError.badRequest('Unknown moderation queue');
  },

  async listReports(query) {
    return paginate(db.reports.find({}, { sort: 'createdAt', order: 'desc' }), query);
  },

  async createReport(actor, { targetType, targetId, reason }) {
    return db.reports.insert({
      reporterId: actor.id,
      targetType,
      targetId,
      reason,
      status: 'open',
    });
  },

  async resolveReport(actor, id, status) {
    const report = db.reports.findById(id);
    if (!report) throw ApiError.notFound('Report not found');
    const updated = db.reports.update(id, { status });
    await auditService.record({ actorId: actor.id, action: `report.${status}`, target: id });
    return updated;
  },

  async auditLogs(query) {
    return paginate(await auditService.list(), query);
  },
};
