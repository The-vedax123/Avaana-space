const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const current = levels[process.env.LOG_LEVEL] ?? levels.info;

const ts = () => new Date().toISOString();

const log = (level, ...args) => {
  if (levels[level] > current) return;
  const line = `[${ts()}] ${level.toUpperCase()}`;
  console[level === 'debug' ? 'log' : level](line, ...args);
};

export const logger = {
  error: (...a) => log('error', ...a),
  warn: (...a) => log('warn', ...a),
  info: (...a) => log('info', ...a),
  debug: (...a) => log('debug', ...a),
};
