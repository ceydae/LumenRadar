import type { Pool } from 'pg';

import type { Auth } from '../../auth/auth.js';

export interface TestDatabase {
  pool: Pool;
  auth: Auth;
  close: () => Promise<void>;
}
