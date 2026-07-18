import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPool } from './pg.js';
import { usingPostgres } from '../config/env.js';
import { logger } from '../utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const run = async () => {
  if (!usingPostgres) {
    logger.warn('DATABASE_URL not set — nothing to migrate. The in-memory store is used at runtime.');
    process.exit(0);
  }
  const pool = getPool();
  const dir = join(__dirname, 'migrations');
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  for (const file of files) {
    logger.info(`Applying migration ${file}`);
    const sql = readFileSync(join(dir, file), 'utf8');
    await pool.query(sql);
  }
  logger.info('Migrations complete');
  await pool.end();
  process.exit(0);
};

run().catch((err) => {
  logger.error('Migration failed', err.message);
  process.exit(1);
});
