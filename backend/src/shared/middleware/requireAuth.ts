import { RequestHandler } from 'express';
import { UnauthorizedError } from '../errors/AppError';
import { authRepository } from '../../modules/auth/auth.repo';

const TOKEN_PREFIX = 'mock-token-';

/**
 * Authenticates the request from an `Authorization: Bearer <token>` header.
 * This week the token is a mock `mock-token-<userId>`, so we extract the user
 * id and confirm the user exists. Sets `req.userId` for downstream handlers.
 *
 * When real auth lands, only this middleware changes (verify a real token);
 * the rest of the app keeps reading `req.userId`.
 */
export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.header('authorization');

  if (!header || !header.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or malformed Authorization header.');
  }

  const token = header.slice('Bearer '.length).trim();

  if (!token.startsWith(TOKEN_PREFIX)) {
    throw new UnauthorizedError('Invalid token.');
  }

  const userId = token.slice(TOKEN_PREFIX.length);

  if (!authRepository.findById(userId)) {
    throw new UnauthorizedError('Invalid token.');
  }

  req.userId = userId;
  next();
};
