import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const app = createApp();

const server = app.listen(env.port, () => {
  logger.info(`AvaanaSpace API listening on http://localhost:${env.port}`);
  logger.info(`API docs available at http://localhost:${env.port}/api/docs`);
});

const shutdown = (signal) => {
  logger.info(`${signal} received, shutting down gracefully`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
};

['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));

process.on('unhandledRejection', (reason) => logger.error('Unhandled rejection', reason));
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', err);
  process.exit(1);
});
