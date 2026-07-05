import { db } from '../../db/store.js';

export const productsRepository = {
  async create(data) {
    return db.products.insert(data);
  },
  async findById(id) {
    return db.products.findById(id);
  },
  async findBySlug(slug) {
    return db.products.findOne({ slug });
  },
  async update(id, patch) {
    return db.products.update(id, patch);
  },
  async softDelete(id) {
    return db.products.softDelete(id);
  },
  async list(filter = {}, opts = {}) {
    return db.products.find(filter, { sort: 'createdAt', order: 'desc', ...opts });
  },
};
