import dotenv from 'dotenv';
import { createApp } from './infrastructure/web/app';
import { connectDatabase } from './infrastructure/database/config';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = createApp();

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

process.on('SIGINT', async () => {
  console.log('Gracefully shutting down');
  process.exit(0);
});