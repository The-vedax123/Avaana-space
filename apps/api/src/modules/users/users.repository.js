import { db } from '../../db/store.js';
import { query } from '../../db/pg.js';
import { usingPostgres } from '../../config/env.js';

const toIso = (value) => {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
};

const fromRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    googleId: row.google_id,
    role: row.role,
    status: row.status,
    avatarUrl: row.avatar_url || '',
    bio: row.bio || '',
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
    deletedAt: toIso(row.deleted_at),
  };
};

const postgresColumns = {
  name: 'name',
  email: 'email',
  passwordHash: 'password_hash',
  googleId: 'google_id',
  role: 'role',
  status: 'status',
  avatarUrl: 'avatar_url',
  bio: 'bio',
};

const publicView = (u) => {
  if (!u) return null;
  const { passwordHash: _passwordHash, ...rest } = u;
  return rest;
};

export const usersRepository = {
  async findById(id) {
    if (usingPostgres) {
      const { rows } = await query(
        'SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL LIMIT 1',
        [id],
      );
      return fromRow(rows[0]);
    }
    return db.users.findById(id);
  },
  async findByEmail(email) {
    const normalisedEmail = String(email).trim().toLowerCase();
    if (usingPostgres) {
      const { rows } = await query(
        'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL LIMIT 1',
        [normalisedEmail],
      );
      return fromRow(rows[0]);
    }
    return db.users.findOne({ email: normalisedEmail });
  },
  async create(data) {
    const email = String(data.email).trim().toLowerCase();
    if (usingPostgres) {
      const { rows } = await query(
        `INSERT INTO users
          (name, email, password_hash, google_id, role, status, avatar_url, bio)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          data.name,
          email,
          data.passwordHash ?? null,
          data.googleId ?? null,
          data.role ?? 'user',
          data.status ?? 'approved',
          data.avatarUrl ?? '',
          data.bio ?? '',
        ],
      );
      return fromRow(rows[0]);
    }
    return db.users.insert({ ...data, email });
  },
  async update(id, patch) {
    if (usingPostgres) {
      const entries = Object.entries(patch).filter(([key]) => postgresColumns[key]);
      if (!entries.length) return this.findById(id);

      const assignments = entries.map(
        ([key], index) => `${postgresColumns[key]} = $${index + 1}`,
      );
      const values = entries.map(([key, value]) =>
        key === 'email' ? String(value).trim().toLowerCase() : value,
      );
      values.push(id);

      const { rows } = await query(
        `UPDATE users
         SET ${assignments.join(', ')}, updated_at = now()
         WHERE id = $${values.length} AND deleted_at IS NULL
         RETURNING *`,
        values,
      );
      return fromRow(rows[0]);
    }
    return db.users.update(id, patch);
  },
  async softDelete(id) {
    if (usingPostgres) {
      const { rows } = await query(
        `UPDATE users
         SET deleted_at = now(), updated_at = now()
         WHERE id = $1 AND deleted_at IS NULL
         RETURNING *`,
        [id],
      );
      return fromRow(rows[0]);
    }
    return db.users.softDelete(id);
  },
  async list(filter = {}) {
    if (usingPostgres) {
      const conditions = ['deleted_at IS NULL'];
      const values = [];
      for (const key of ['role', 'status']) {
        if (filter[key]) {
          values.push(filter[key]);
          conditions.push(`${key} = $${values.length}`);
        }
      }
      const { rows } = await query(
        `SELECT * FROM users
         WHERE ${conditions.join(' AND ')}
         ORDER BY created_at DESC`,
        values,
      );
      return rows.map(fromRow);
    }
    return db.users.find(filter, { sort: 'createdAt', order: 'desc' });
  },
  async count(filter = {}) {
    if (usingPostgres) {
      const users = await this.list(filter);
      return users.length;
    }
    return db.users.count(filter);
  },
  publicView,
};
