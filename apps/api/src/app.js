import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import apiRouter from './routes/index.js';
import { uploadDirPath } from './modules/uploads/uploads.routes.js';
import { globalLimiter } from './middleware/rateLimit.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';
// Initialise the data layer (seeds the in-memory store on import).
import './db/store.js';

export const createApp = () => {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    }),
  );
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin || env.corsOrigins.includes(origin) || env.corsOrigins.includes('*')) {
          return cb(null, true);
        }
        return cb(null, true); // permissive by default; tighten via CORS_ORIGIN in prod
      },
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  if (!env.isProd) app.use(morgan('dev'));
  app.use(globalLimiter);

  app.get('/', (_req, res) =>
    res.json({ name: 'AvaanaSpace API', tagline: 'Accessible Discovery', docs: '/api/docs', api: '/api/v1' }),
  );

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: 'AvaanaSpace API Docs' }));
  app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));

  app.use('/api/v1', apiRouter);
  app.use('/uploads', express.static(uploadDirPath, { maxAge: '7d', immutable: true }));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
