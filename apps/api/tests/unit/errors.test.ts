import express from 'express';
import request from 'supertest';
import { APIError } from 'better-auth/api';
import { describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

import { errorHandler } from '../../src/errors.js';

describe('error responses', () => {
  it.each([new Error('private database detail'), 'unexpected rejection'])(
    'hides unexpected failure details', async (error) => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const app = express();
      app.get('/', () => { throw error; });
      app.use(errorHandler);
      await request(app).get('/').expect(500, {
        code: 'INTERNAL_ERROR', message: 'Something went wrong. Try again.',
      });
    },
  );

  it('keeps expected authentication errors', async () => {
    const app = express();
    app.get('/', () => { throw new APIError('UNAUTHORIZED', { code: 'UNAUTHORIZED', message: 'Sign in first.' }); });
    app.use(errorHandler);
    await request(app).get('/').expect(401, { code: 'UNAUTHORIZED', message: 'Sign in first.' });
  });

  it('delegates errors after the response has started', () => {
    const next = vi.fn();
    const error = new Error('stream failed');
    errorHandler(error, {} as Request, { headersSent: true } as Response, next as NextFunction);
    expect(next).toHaveBeenCalledWith(error);
  });
});
