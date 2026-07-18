import { db } from '../../db/store.js';

export const auditService = {
  async record({ actorId, action, target, meta }) {
    return db.auditLogs.insert({ actorId, action, target: target || null, meta: meta || null });
  },
  async list({ sort = 'createdAt', order = 'desc' } = {}) {
    return db.auditLogs.find({}, { sort, order });
  },
};
