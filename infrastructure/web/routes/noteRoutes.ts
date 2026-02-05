import { Router } from 'express';
import { NoteController } from '../controllers/NoteController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', NoteController.getMyNotes);
router.get('/public', NoteController.getPublicNotes);
router.get('/:id', NoteController.getNoteById);
router.post('/', NoteController.createNote);
router.put('/:id', NoteController.updateNote);
router.delete('/:id', NoteController.deleteNote);

export const noteRoutes = router;
