import { toNodeHandler } from 'better-auth/node';
import type { Request, Response } from 'express';

import type { AuthContext } from '../../types/auth/context.js';

const authHandler = async (req: Request, res: Response): Promise<void> => {
  const context = req.app.locals.authContext as AuthContext;

  await toNodeHandler(context.auth)(req, res);
};

export default authHandler;
