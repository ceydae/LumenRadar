import type { OpenAPIV3 } from 'openapi-types';
import type { Request, Response } from 'express';

const getOpenApi = (req: Request, res: Response): void => {
  const document = req.app.locals.openapi as OpenAPIV3.Document;

  res.json(document);
};

export default getOpenApi;
