import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Public route for viewing events
router.get('/', EventController.getAllEvents);
router.get('/:id', EventController.getEventById);

// Protected routes
router.post('/', authenticate, EventController.createEvent);
router.put('/:id', authenticate, EventController.updateEvent);
router.delete('/:id', authenticate, EventController.deleteEvent);

export const eventRoutes = router;
