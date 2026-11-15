import type { Config } from '../../config.js';
import type { Auth } from '../../auth/auth.js';

export interface AuthContext {
  auth: Auth;
  config: Config;
}
