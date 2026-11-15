import { APIError } from 'better-auth/api';
import type { Request, Response, NextFunction } from 'express';

export const projectBodyError = (error: unknown, _req: Request, _res: Response, next: NextFunction): void => {
  if (error instanceof Error && 'type' in error && error.type === 'entity.parse.failed') {
    next(new APIError('BAD_REQUEST', { code: 'INVALID_JSON', message: 'Send a valid JSON body.' }));

    return;
  }

  if (error instanceof Error && 'type' in error && error.type === 'entity.too.large') {
    next(new APIError('PAYLOAD_TOO_LARGE', { code: 'BODY_TOO_LARGE', message: 'Request body exceeds 16 KB.' }));

    return;
  }

  next(error);
};
