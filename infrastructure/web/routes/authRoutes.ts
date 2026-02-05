import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticate, requireKeeper } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', authenticate, AuthController.me);
router.post('/register', authenticate, requireKeeper, AuthController.register);
router.get('/users', authenticate, requireKeeper, AuthController.getAllUsers);

export const authRoutes = router;
