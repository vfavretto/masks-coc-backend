import { Request, Response, NextFunction } from 'express';
import { JwtService, TokenPayload } from '../../../shared/services/JwtService';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.substring(7); // Remove 'Bearer '
  const payload = JwtService.verify(token);

  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  req.user = payload;
  next();
};

export const requireRole = (...roles: ('keeper' | 'player')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

// Middleware para rotas que precisam apenas de Keeper
export const requireKeeper = requireRole('keeper');

// Middleware para rotas que aceitam qualquer usuário autenticado
export const requireAuth = authenticate;
