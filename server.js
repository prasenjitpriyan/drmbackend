import express from 'express';
import config from './src/config/config.js';
import { connectDB } from './src/config/database.js';

const app = express();

// Middleware and routes here...
app.use(express.json());

const startServer = async () => {
  await connectDB();
  app.listen(config.PORT, () => {
    console.log(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
  });
};

startServer();
