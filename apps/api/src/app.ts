import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { toNodeHandler } from 'better-auth/node';
import type { Auth } from './auth/auth.js';
import type { Config } from './config.js';
import { createOpenApi } from './docs/openapi.js';
import { errorHandler } from './errors.js';

export function createApp(config: Config, auth: Auth) {
  const app = express();
  const authHandler = toNodeHandler(auth);
  const openapi = createOpenApi(config);

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: config.CLIENT_ORIGIN, credentials: true }));
  app.use('/api/auth', (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  app.post('/api/auth/sign-in/social', (_req, res, next) => {
    if (!config.DISCORD_CLIENT_ID || !config.DISCORD_CLIENT_SECRET) {
      res.status(503).json({ code: 'DISCORD_NOT_CONFIGURED', message: 'Discord login is not configured.' });
      return;
    }
    next();
  }, authHandler);

  app.get([
    '/api/auth/callback/discord',
    '/api/auth/get-session',
    '/api/auth/token',
    '/api/auth/jwks',
  ], authHandler);
  app.post('/api/auth/sign-out', authHandler);

  app.get('/openapi.json', (_req, res) => res.json(openapi));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi, {
    customSiteTitle: 'Lumen Radar API',
    swaggerOptions: { withCredentials: true },
  }));

  app.use((_req, res) => {
    res.status(404).json({ code: 'NOT_FOUND', message: 'Route not found.' });
  });
  app.use(errorHandler);
  return app;
}
