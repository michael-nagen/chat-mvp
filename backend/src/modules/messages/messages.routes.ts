import { Router } from 'express';
import { createMessage, listMessages } from './messages.controller';
import { createMessageSchema, listMessagesQuerySchema } from './messages.schemas';
import { validate } from '../../shared/middleware/validate';

export const messagesRouter = Router({ mergeParams: true });

messagesRouter.get('/', validate({ query: listMessagesQuerySchema }), listMessages);
messagesRouter.post('/', validate({ body: createMessageSchema }), createMessage);
