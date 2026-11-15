import type { Request, Response } from 'express';

import authHandler from './handler.js';
import type { AuthContext } from '../../types/auth/context.js';

const postSignIn = async (req: Request, res: Response): Promise<void> => {
  const { config } = req.app.locals.authContext as AuthContext;

  if (!config.DISCORD_CLIENT_ID || !config.DISCORD_CLIENT_SECRET) {
    res
      .status(503)
      .json({
        code: 'DISCORD_NOT_CONFIGURED',
        message: 'Discord login is not configured.',
      });

    return;
  }

  await authHandler(req, res);
};

export default postSignIn;
