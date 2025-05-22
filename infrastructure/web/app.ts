import express, { Express, ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { characterRoutes } from './routes/characterRoutes';
import { sessionRoutes } from './routes/sessionRoutes';
import { errorHandler } from './middlewares/errorHandler';

export const createApp = (): Express => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(helmet());

  // Rota raiz para teste de deploy
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Masks CoC API is finally running!' });
  });

  app.use('/api/characters', characterRoutes);
  app.use('/api/sessions', sessionRoutes);

  app.use(errorHandler as ErrorRequestHandler);

  return app;
};