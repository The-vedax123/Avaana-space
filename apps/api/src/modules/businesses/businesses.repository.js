import { db } from '../../db/store.js';

export const businessesRepository = {
  async create(data) {
    return db.businesses.insert(data);
  },
  async findById(id) {
    return db.businesses.findById(id);
  },
  async findBySlug(slug) {
    return db.businesses.findOne({ slug });
  },
  async update(id, patch) {
    return db.businesses.update(id, patch);
  },
  async softDelete(id) {
    return db.businesses.softDelete(id);
  },
  async list(filter = {}, opts = {}) {
    return db.businesses.find(filter, { sort: 'createdAt', order: 'desc', ...opts });
  },
  async listByOwner(ownerId) {
    return db.businesses.find({ ownerId }, { sort: 'createdAt', order: 'desc' });
  },
};
