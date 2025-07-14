import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User, Role } from '../models';
import { error } from '../utils/response';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json(error('No token provided', null, 401));
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token) as any;
    const user = await User.findByPk(payload.id, { include: [Role] });

    if (!user) {
      res.status(401).json(error('User not found', null, 401));
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json(error('Invalid token', err, 401));
    return;
  }
};

export const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user || !roles.includes(req.user.role.name)) {
        res.status(403).json(error('Forbidden: insufficient permissions', null, 403));
        return;
      }
      next();
    };
  };
