import express from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.routes';
import { conversationsRouter } from './modules/conversations/conversations.routes';
import { messagesRouter } from './modules/messages/messages.routes';
import { errorHandler } from './shared/errors/errorHandler';
import { NotFoundError } from './shared/errors/AppError';
import { requestLogger } from './shared/middleware/requestLogger';
import { requireAuth } from './shared/middleware/requireAuth';

export const app = express();

// Allowlist the frontend origin(s). Override via CORS_ORIGIN (comma-separated).
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(requestLogger);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/conversations', conversationsRouter);
app.use('/conversations/:conversationId/messages', requireAuth, messagesRouter);

// Unmatched routes are funneled through the same error pipeline as everything else.
app.use((_req, _res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);
