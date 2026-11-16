import { APIError } from 'better-auth/api';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request, Response, NextFunction } from 'express';

import type { ProjectLocals } from '../../types/projects/projectLocals.js';
import type { ProjectContext } from '../../types/projects/projectContext.js';

export const requireProjectSession = async (
  req: Request,
  res: Response<unknown, ProjectLocals>,
  next: NextFunction,
): Promise<void> => {
  const context = req.app.locals.projectContext as ProjectContext;
  const origin = req.get('Origin');

  res.setHeader('Cache-Control', 'no-store');

  if (
    req.method !== 'GET' &&
    req.method !== 'HEAD' &&
    ((origin !== undefined && origin !== context.clientOrigin && origin !== context.apiOrigin) ||
      (origin === undefined && req.get('Sec-Fetch-Site') === 'cross-site'))
  ) {
    throw new APIError('FORBIDDEN', { code: 'UNTRUSTED_ORIGIN', message: 'Untrusted request origin.' });
  }

  const session = await context.auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

  if (!session) {
    throw new APIError('UNAUTHORIZED', { code: 'UNAUTHORIZED', message: 'Sign in with Discord first.' });
  }

  res.locals.projectContext = context;
  res.locals.projectUserId = session.user.id;

  next();
};
