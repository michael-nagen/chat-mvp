import express from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.routes';
import { conversationsRouter } from './modules/conversations/conversations.routes';
import { messagesRouter } from './modules/messages/messages.routes';
import { errorHandler } from './shared/errors/errorHandler';
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

// Unmatched routes return a consistent JSON shape instead of express's default HTML.
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);
