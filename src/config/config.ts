import dotenv from 'dotenv';
import path from 'path';

// This file assumes dotenv has already been loaded in server.ts.
// We add this in case you ever run config.ts directly (e.g., in tests).
dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
});
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

export const config = {
  NODE_ENV: process.env.NODE_ENV as string,
  PORT: parseInt(process.env.PORT as string, 10),
  MONGODB_URI: process.env.MONGODB_URI as string,
  DB_NAME: process.env.DB_NAME as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRE: process.env.JWT_EXPIRE as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE as string,
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS as string, 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS as string, 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS as string, 10),
};
