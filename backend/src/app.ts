import express from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.routes';
import { conversationsRouter } from './modules/conversations/conversations.routes';
import { errorHandler } from './shared/errors/errorHandler';
import { requestLogger } from './shared/middleware/requestLogger';

export const app = express();

// Allowlist the frontend origin(s). Override via CORS_ORIGIN (comma-separated).
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(requestLogger);
app.use(express.json());

app.use('/auth', authRouter);
app.use('/conversations', conversationsRouter);

app.use(errorHandler);
