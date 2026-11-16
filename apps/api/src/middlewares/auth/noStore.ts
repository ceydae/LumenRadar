import type { Request, Response, NextFunction } from 'express';

const noStore = (_req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('Cache-Control', 'no-store');

  next();
};

export default noStore;
