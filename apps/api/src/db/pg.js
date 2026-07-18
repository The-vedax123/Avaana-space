import pg from 'pg';
import { env, usingPostgres } from '../config/env.js';
import { logger } from '../utils/logger.js';

let pool = null;

export const getPool = () => {
  if (!usingPostgres) return null;
  if (!pool) {
    pool = new pg.Pool({
      connectionString: env.db.url,
      ssl: env.db.ssl ? { rejectUnauthorized: false } : false,
      max: 10,
    });
    pool.on('error', (err) => logger.error('Unexpected PG pool error', err.message));
    logger.info('PostgreSQL pool initialised');
  }
  return pool;
};

export const query = async (text, params) => {
  const p = getPool();
  if (!p) throw new Error('PostgreSQL is not configured (set DATABASE_URL)');
  return p.query(text, params);
};
