import dotenv from 'dotenv';
import path from 'path';

// Load .env.local first, then .env
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  debug: true,
});

import express from 'express';
import { config } from './src/config/config';
import { connectDB } from './src/config/database';

const app = express();

// Middleware and routes here...
app.use(express.json());

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(config.PORT, () => {
    console.log(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
  });
};

startServer();
