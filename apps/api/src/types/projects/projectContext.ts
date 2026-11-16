import type { Pool } from 'pg';

import type { Auth } from '../../auth/auth.js';

export interface ProjectContext {
  auth: Auth;
  database: Pool;
  clientOrigin: string;
  apiOrigin: string;
}
