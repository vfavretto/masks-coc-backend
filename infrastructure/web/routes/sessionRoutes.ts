import { Router } from 'express';
import { SessionController } from '../controllers/SessionController';
import {
  GetAllSessions,
  GetSessionById,
  FilterSessionsByTag,
  SearchSession,
  CreateSessionUseCase,
  UpdateSessionUseCase,
  DeleteSessionUseCase
} from '../../../application/useCases/session';
import { MongoSessionRepository } from '../../database/repositories/MongoSessionRepository';

const router = Router();
const sessionRepository = new MongoSessionRepository();

const getAllSessionsUseCase = new GetAllSessions(sessionRepository);
const getSessionByIdUseCase = new GetSessionById(sessionRepository);
const filterSessionsByTagUseCase = new FilterSessionsByTag(sessionRepository);
const searchSessionUseCase = new SearchSession(sessionRepository);
const createSessionUseCase = new CreateSessionUseCase(sessionRepository);
const updateSessionUseCase = new UpdateSessionUseCase(sessionRepository);
const deleteSessionUseCase = new DeleteSessionUseCase(sessionRepository);

const sessionController = new SessionController(
  getAllSessionsUseCase,
  getSessionByIdUseCase,
  filterSessionsByTagUseCase,
  searchSessionUseCase,
  createSessionUseCase,
  updateSessionUseCase,
  deleteSessionUseCase
);

router.get('/', async (req, res) => {
  await sessionController.getAllSessions(req, res);
});

router.get('/search', async (req, res) => {
  await sessionController.searchSessions(req, res);
});

router.get('/tags', async (req, res) => {
  await sessionController.getSessionsByTags(req, res);
});

router.get('/:id', async (req, res) => {
  await sessionController.getSessionById(req, res);
});

router.post('/', async (req, res) => {
  await sessionController.createSession(req, res);
});

router.put('/:id', async (req, res) => {
  await sessionController.updateSession(req, res);
});

router.delete('/:id', async (req, res) => {
  await sessionController.deleteSession(req, res);
});

export { router as sessionRoutes };