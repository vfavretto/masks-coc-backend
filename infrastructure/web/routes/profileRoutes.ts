import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Get my profile (requires auth)
router.get('/me', authenticate, ProfileController.getProfile);
router.put('/me', authenticate, ProfileController.updateProfile);

// Get public profile (no auth required)
router.get('/:userId', ProfileController.getPublicProfile);

export const profileRoutes = router;
