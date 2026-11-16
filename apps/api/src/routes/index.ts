import { Router } from 'express';

import authRoutes from './auth/index.js';
import docsRoutes from './docs/index.js';
import projectRoutes from './projects/index.js';

const router = Router();

router.use('/api/auth', authRoutes);

router.use('/api/projects', projectRoutes);

router.use(docsRoutes);

export default router;
