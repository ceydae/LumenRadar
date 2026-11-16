import { APIError } from 'better-auth/api';
import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  if (
    error instanceof APIError &&
    (error.statusCode < 500 ||
      (error.statusCode === 502 && error.body?.code === 'UMAMI_REQUEST_FAILED') ||
      (error.statusCode === 503 && error.body?.code === 'UMAMI_NOT_CONFIGURED'))
  ) {
    res.status(error.statusCode).json(error.body);
    return;
  }
  console.error('Request failed.', error instanceof Error ? error.message : 'Unknown error');
  res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Something went wrong. Try again.' });
};
