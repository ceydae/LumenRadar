import type { Pool } from 'pg';

import type { Config } from '../config.js';
import type { Auth } from '../../auth/auth.js';

export interface ProjectContext {
  auth: Auth;
  database: Pool;
  clientOrigin: string;
  apiOrigin: string;
  umami: Pick<Config, 'UMAMI_API_URL' | 'UMAMI_API_KEY'>;
}
