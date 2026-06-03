import { RequestHandler } from 'express';
import { NotImplementedError } from '../../shared/errors/AppError';

export const login: RequestHandler = (_req, _res) => {
  throw new NotImplementedError('POST /auth/login is not implemented yet.');
};
