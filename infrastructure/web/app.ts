import express, { Express, ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { characterRoutes } from './routes/characterRoutes';
import { sessionRoutes } from './routes/sessionRoutes';
import { debugRoutes } from './routes/debugRoutes';
import { authRoutes } from './routes/authRoutes';
import { noteRoutes } from './routes/noteRoutes';
import { eventRoutes } from './routes/eventRoutes';
import { profileRoutes } from './routes/profileRoutes';
import { errorHandler } from './middlewares/errorHandler';

export const createApp = (): Express => {
  const app = express();

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://vfavretto.github.io',
    'https://vfavretto.github.io/masks-coc',
    'https://masks-coc-backend.onrender.com',
    process.env.FRONTEND_URL
  ].filter(Boolean) as string[];

  // Optimized CORS configuration
  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(helmet());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/notes', noteRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/characters', characterRoutes);
  app.use('/api/sessions', sessionRoutes);
  app.use('/debug', debugRoutes);

  app.use(errorHandler as ErrorRequestHandler);

  return app;
};