import { db } from '../../db/store.js';

const publicView = (u) => {
  if (!u) return null;
  const { passwordHash, ...rest } = u;
  return rest;
};

export const usersRepository = {
  async findById(id) {
    return db.users.findById(id);
  },
  async findByEmail(email) {
    return db.users.findOne({ email: String(email).toLowerCase() });
  },
  async create(data) {
    return db.users.insert({ ...data, email: data.email.toLowerCase() });
  },
  async update(id, patch) {
    return db.users.update(id, patch);
  },
  async softDelete(id) {
    return db.users.softDelete(id);
  },
  async list(filter = {}) {
    return db.users.find(filter, { sort: 'createdAt', order: 'desc' });
  },
  publicView,
};
