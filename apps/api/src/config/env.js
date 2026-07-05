import dotenv from 'dotenv';

dotenv.config();

const bool = (v, fallback = false) =>
  v === undefined ? fallback : ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase());

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT || 4000),
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    accessTtl: process.env.JWT_ACCESS_TTL || '15m',
    refreshTtl: process.env.JWT_REFRESH_TTL || '7d',
  },
  db: {
    url: process.env.DATABASE_URL || '',
    ssl: bool(process.env.DATABASE_SSL, true),
  },
  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
    bucket: process.env.SUPABASE_STORAGE_BUCKET || 'avaanaspace',
  },
  mail: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.MAIL_FROM || 'AvaanaSpace <no-reply@avaanaspace.com>',
  },
};

export const usingPostgres = Boolean(env.db.url);
