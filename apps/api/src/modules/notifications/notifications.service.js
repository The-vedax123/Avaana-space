import { db } from '../../db/store.js';

export const notificationsService = {
  async create({ userId, category, title, body }) {
    return db.notifications.insert({ userId, category, title, body, read: false });
  },
  async listForUser(userId, { category } = {}) {
    const filter = { userId };
    if (category) filter.category = category;
    return db.notifications.find(filter, { sort: 'createdAt', order: 'desc' });
  },
  async unreadCount(userId) {
    return db.notifications.find({ userId, read: false }).length;
  },
  async markRead(id, userId) {
    const n = db.notifications.findById(id);
    if (!n || n.userId !== userId) return null;
    return db.notifications.update(id, { read: true });
  },
  async markAllRead(userId) {
    const items = db.notifications.find({ userId, read: false });
    items.forEach((n) => db.notifications.update(n.id, { read: true }));
    return items.length;
  },
};
