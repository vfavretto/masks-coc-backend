import { Router } from 'express';
import { DebugController } from '../controllers/DebugController';

const router = Router();
const debugController = new DebugController();

router.get('/database', async (req, res) => {
  await debugController.getDatabaseInfo(req, res);
});

export { router as debugRoutes }; 