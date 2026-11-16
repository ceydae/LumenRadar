import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import type { Pool } from 'pg';

import router from './routes/index.js';
import type { Auth } from './auth/auth.js';
import { errorHandler } from './errors.js';
import type { Config } from './types/config.js';
import notFound from './middlewares/notFound.js';
import { createOpenApi } from './docs/openapi.js';

export const createApp = (config: Config, auth: Auth, database: Pool): express.Express => {
  const app = express();

  app.locals.authContext = { auth, config };
  app.locals.projectContext = { auth, database, clientOrigin: config.CLIENT_ORIGIN, apiOrigin: config.BETTER_AUTH_URL };
  app.locals.openapi = createOpenApi(config);

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: config.CLIENT_ORIGIN, credentials: true }));
  app.use(router);
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
