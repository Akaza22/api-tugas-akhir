import { Request, Response, NextFunction } from 'express';
import { error } from './response';

// Higher-order function to wrap async route handlers
export const controllerHandler =
  (fn: (req: Request, res: Response, next?: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch((err) => {
      console.error(err);
      res.status(500).json(error('Internal Server Error', err));
    });
