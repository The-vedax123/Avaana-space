import { ApiError } from '../utils/apiError.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const notFoundHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) logger.error(err.message, err.stack);
  else logger.warn(`${statusCode} ${err.message}`);

  const body = {
    success: false,
    error: {
      message: isServerError && env.isProd ? 'Internal server error' : err.message,
      ...(err.details ? { details: err.details } : {}),
      // Never expose stack traces in production
      ...(!env.isProd && isServerError ? { stack: err.stack } : {}),
    },
  };

  res.status(statusCode).json(body);
};
