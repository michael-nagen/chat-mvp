import { RequestHandler } from 'express';
import { NotImplementedError } from '../../shared/errors/AppError';

export const listConversations: RequestHandler = (_req, _res) => {
  throw new NotImplementedError('GET /conversations is not implemented yet.');
};

export const createConversation: RequestHandler = (_req, _res) => {
  throw new NotImplementedError('POST /conversations is not implemented yet.');
};
