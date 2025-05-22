import express, { Express, ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { characterRoutes } from './routes/characterRoutes';
import { sessionRoutes } from './routes/sessionRoutes';
import { errorHandler } from './middlewares/errorHandler';

export const createApp = (): Express => {
  const app = express();

  // CORS configuration
  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Lista de origens permitidas
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000', 
        'https://vfavretto.github.io',
        'https://masks-coc-backend.onrender.com',
        process.env.FRONTEND_URL
      ].filter(Boolean); // Remove valores undefined

      console.log('🌍 CORS Request from origin:', origin);
      console.log('🔧 Allowed origins:', allowedOrigins);
      
      // Permite requisições sem origin (ex: Postman, apps móveis)
      if (!origin) return callback(null, true);
      
      // Verifica se a origem está na lista permitida
      if (allowedOrigins.includes(origin)) {
        console.log('✅ CORS: Origin allowed');
        return callback(null, true);
      }
      
      console.log('❌ CORS: Origin not allowed');
      return callback(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  };

  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(helmet());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/characters', characterRoutes);
  app.use('/api/sessions', sessionRoutes);

  app.use(errorHandler as ErrorRequestHandler);

  return app;
};