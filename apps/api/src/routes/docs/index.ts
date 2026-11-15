import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import getDocs from './getDocs.js';
import getOpenApi from './getOpenApi.js';

const docsRoutes = Router();

docsRoutes.get('/openapi.json', getOpenApi);

docsRoutes.use('/docs', swaggerUi.serve, getDocs);

export default docsRoutes;
