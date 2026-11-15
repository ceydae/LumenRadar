import { Router } from 'express';

import authHandler from './handler.js';
import postSignIn from './postSignIn.js';
import noStore from '../../middlewares/auth/noStore.js';

const authRoutes = Router();

authRoutes.use(noStore);

authRoutes.post('/sign-in/social', postSignIn);
authRoutes.get('/callback/discord', authHandler);
authRoutes.get('/get-session', authHandler);
authRoutes.get('/token', authHandler);
authRoutes.get('/jwks', authHandler);
authRoutes.post('/sign-out', authHandler);

export default authRoutes;
