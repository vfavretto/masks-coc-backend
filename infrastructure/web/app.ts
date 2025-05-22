import express, { Express, ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { characterRoutes } from './routes/characterRoutes';
import { sessionRoutes } from './routes/sessionRoutes';
import { errorHandler } from './middlewares/errorHandler';

export const createApp = (): Express => {
  const app = express();

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://vfavretto.github.io',
    'https://masks-coc-backend.onrender.com',
    process.env.FRONTEND_URL
  ].filter(Boolean) as string[]; // filter(Boolean) remove null/undefined

  // Middleware para preflight requests ANTES da configuração principal do CORS
  app.options('*', (req: express.Request, res: express.Response) => {
    const origin = req.headers.origin as string; // Cast para string, já que verificaremos
    console.log('🚀 Preflight (app.options) for:', req.method, req.url, 'from origin:', origin);

    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin');
      res.header('Access-Control-Allow-Credentials', 'true');
      console.log('✅ Preflight (app.options) allowed for origin:', origin);
      res.sendStatus(204); // No Content
    } else if (!origin && (req.path.startsWith('/api/') || req.path === '/health')){
        // Permite requisições diretas sem Origin (Postman, etc) para as rotas da API ou health check
        console.log('✅ Preflight (app.options) allowed for no-origin (direct API/health call):', req.path);
        res.sendStatus(204); 
    }else {
      console.log('❌ Preflight (app.options) denied for origin:', origin, 'for path:', req.path);
      res.sendStatus(403); // Forbidden
    }
  });

  // Configuração CORS principal
  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      console.log('🌍 CORS Check (corsOptions) for origin:', origin);
      if (!origin || allowedOrigins.includes(origin)) {
        console.log('✅ CORS Check (corsOptions) allowed for origin:', origin || '"none" (server-to-server or blocked by browser)');
        callback(null, true);
      } else {
        console.log('❌ CORS Check (corsOptions) denied for origin:', origin);
        callback(new Error('Not allowed by CORS: Origin not in allowed list.'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // OPTIONS já é tratado pelo app.options('*')
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: true,
    // optionsSuccessStatus: 204, // Se não usar app.options, o middleware cors pode lidar com OPTIONS
  };
  
  app.use(express.json());
  app.use(cors(corsOptions)); // Middleware CORS principal
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