import { customAlphabet } from 'nanoid';
import { usingPostgres } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { seedData } from './seed-data.js';

/**
 * Lightweight in-memory data store used as the default persistence layer so the
 * platform runs out-of-the-box for demos and local development. When
 * DATABASE_URL is provided, the SQL migrations in ./migrations describe the
 * equivalent normalised PostgreSQL schema (Supabase). The repository layer keeps
 * business logic decoupled from whichever backend is active.
 */
export const genId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);

const collections = new Map();

export const nowIso = () => new Date().toISOString();

const matchesFilter = (row, filter) =>
  Object.entries(filter).every(([key, value]) => {
    if (typeof value === 'function') return value(row[key], row);
    return row[key] === value;
  });

export const createCollection = (name, seed = []) => {
  const rows = new Map();
  seed.forEach((r) => rows.set(r.id, { ...r }));

  const api = {
    name,
    _rows: rows,
    insert(doc) {
      const id = doc.id || genId();
      const record = {
        id,
        ...doc,
        createdAt: doc.createdAt || nowIso(),
        updatedAt: nowIso(),
        deletedAt: doc.deletedAt || null,
      };
      rows.set(id, record);
      return { ...record };
    },
    findById(id, { withDeleted = false } = {}) {
      const row = rows.get(id);
      if (!row) return null;
      if (!withDeleted && row.deletedAt) return null;
      return { ...row };
    },
    findOne(filter = {}, { withDeleted = false } = {}) {
      for (const row of rows.values()) {
        if (!withDeleted && row.deletedAt) continue;
        if (matchesFilter(row, filter)) return { ...row };
      }
      return null;
    },
    find(filter = {}, { withDeleted = false, sort, order = 'desc' } = {}) {
      let result = [...rows.values()].filter((row) => {
        if (!withDeleted && row.deletedAt) return false;
        return matchesFilter(row, filter);
      });
      if (sort) {
        result.sort((a, b) => {
          const av = a[sort];
          const bv = b[sort];
          if (av === bv) return 0;
          const cmp = av > bv ? 1 : -1;
          return order === 'asc' ? cmp : -cmp;
        });
      }
      return result.map((r) => ({ ...r }));
    },
    update(id, patch) {
      const row = rows.get(id);
      if (!row) return null;
      const updated = { ...row, ...patch, id, updatedAt: nowIso() };
      rows.set(id, updated);
      return { ...updated };
    },
    softDelete(id) {
      const row = rows.get(id);
      if (!row) return null;
      const updated = { ...row, deletedAt: nowIso(), updatedAt: nowIso() };
      rows.set(id, updated);
      return { ...updated };
    },
    hardDelete(id) {
      return rows.delete(id);
    },
    count(filter = {}) {
      return this.find(filter).length;
    },
    all() {
      return [...rows.values()].map((r) => ({ ...r }));
    },
  };

  collections.set(name, api);
  return api;
};

export const db = {
  users: createCollection('users', seedData.users),
  refreshTokens: createCollection('refreshTokens'),
  businesses: createCollection('businesses', seedData.businesses),
  products: createCollection('products', seedData.products),
  spaces: createCollection('spaces', seedData.spaces),
  posts: createCollection('posts', seedData.posts),
  comments: createCollection('comments'),
  likes: createCollection('likes'),
  follows: createCollection('follows'),
  tickets: createCollection('tickets', seedData.tickets),
  ticketMessages: createCollection('ticketMessages', seedData.ticketMessages),
  notifications: createCollection('notifications', seedData.notifications),
  reports: createCollection('reports'),
  auditLogs: createCollection('auditLogs'),
  searchLogs: createCollection('searchLogs'),
};

logger.info(
  `Data layer ready → ${usingPostgres ? 'PostgreSQL configured' : 'in-memory store'} ` +
    `(${db.users.count()} users, ${db.businesses.count()} businesses, ${db.products.count()} products seeded)`,
);
