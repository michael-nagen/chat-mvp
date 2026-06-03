import { RequestHandler } from 'express';
import { NotImplementedError } from '../../shared/errors/AppError';

export const listMessages: RequestHandler = (_req, _res) => {
  throw new NotImplementedError('GET /conversations/:id/messages is not implemented yet.');
};

export const createMessage: RequestHandler = (_req, _res) => {
  throw new NotImplementedError('POST /conversations/:id/messages is not implemented yet.');
};
