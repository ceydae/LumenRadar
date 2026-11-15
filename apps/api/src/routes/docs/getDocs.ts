import swaggerUi from 'swagger-ui-express';
import type { OpenAPIV3 } from 'openapi-types';
import type { Request, Response, NextFunction } from 'express';

const getDocs = (req: Request, res: Response, next: NextFunction): void => {
  const document = req.app.locals.openapi as OpenAPIV3.Document;

  swaggerUi.setup(document, {
    customSiteTitle: 'Lumen Radar API',
    swaggerOptions: { withCredentials: true },
  })(req, res, next);
};

export default getDocs;
