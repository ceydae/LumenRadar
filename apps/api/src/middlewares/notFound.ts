import type { Request, Response } from 'express';

const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({ code: 'NOT_FOUND', message: 'Route not found.' });
};

export default notFound;
