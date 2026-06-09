import { RequestHandler } from 'express';
import { UnauthorizedError } from '../errors/AppError';
import { authOrchestrator } from '../../modules/auth/auth.orchestrator';

const TOKEN_PREFIX = 'mock-token-';

// Mock tokens for now: `mock-token-<userId>`.
export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.header('authorization');

  if (!header || !header.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or malformed Authorization header.');
  }

  const token = header.slice('Bearer '.length).trim();

  if (!token.startsWith(TOKEN_PREFIX)) {
    throw new UnauthorizedError('Invalid token.');
  }

  const userId = token.slice(TOKEN_PREFIX.length);

  if (!authOrchestrator.getUser(userId)) {
    throw new UnauthorizedError('Invalid token.');
  }

  res.locals.userId = userId;
  next();
};
